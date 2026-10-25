import { constants } from "node:fs";
import { lstat, mkdir, open, realpath, rename, unlink } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { safeRelativePath, sha256, validateCatalog } from "./catalog.mjs";

export const statePath = ".evenkit/blocks.json";
export const journalPath = ".evenkit/transaction.json";
const lockPath = ".evenkit/lock";
const internalPaths = new Set([statePath, journalPath, lockPath, ".evenkit"]);
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
const fileSchema = z.object({
  content: z.string(), sha256: hashSchema, owners: z.array(z.string()).min(1),
  sourceRevision: z.string().regex(/^[a-f0-9]{40}$/), sourcePath: z.string()
}).strict();
const stateSchema = z.object({
  schemaVersion: z.literal(1),
  blocks: z.record(z.string(), z.object({ directory: z.string(), item: z.unknown() }).strict()),
  files: z.record(z.string(), fileSchema)
}).strict();
const journalSchema = z.object({
  schemaVersion: z.literal(1), consumer: z.string(),
  stateBefore: z.string().nullable(), stateAfter: z.string(),
  changes: z.array(z.object({ target: z.string(), before: z.string().nullable(), after: z.string().nullable(), beforeMode: z.number().int().min(0).max(0o777).optional() }).strict())
}).strict();
const lockSchema = z.object({ pid: z.number().int().positive(), token: z.string().uuid() }).strict();

export const serialize = value => JSON.stringify(value, null, 2) + "\n";
export const contentHash = content => content === null ? null : sha256(content);

export async function consumerRoot(directory) {
  const root = await realpath(resolve(directory));
  if (!(await lstat(root)).isDirectory()) throw new Error("Consumer must be a directory.");
  return root;
}

// Reject links at every existing path segment; never follow a destination link.
export async function checkedPath(root, relative) {
  if (!internalPaths.has(relative)) safeRelativePath(relative);
  let current = root;
  const segments = relative.split("/");
  for (let index = 0; index < segments.length; index++) {
    current = join(current, segments[index]);
    let stat;
    try { stat = await lstat(current); }
    catch (error) { if (error.code === "ENOENT") continue; throw error; }
    if (stat.isSymbolicLink()) throw new Error(`Destination contains a symbolic link: ${relative}`);
    if (index < segments.length - 1 && !stat.isDirectory()) throw new Error(`Destination parent is not a directory: ${relative}`);
    if (stat.isFile() && stat.nlink !== 1) throw new Error(`Destination has hard links: ${relative}`);
  }
  return current;
}

export async function readContent(root, relative) {
  const path = await checkedPath(root, relative);
  let handle;
  try {
    handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
    const stat = await handle.stat();
    if (!stat.isFile() || stat.nlink !== 1) throw new Error(`Expected a regular, unlinked file: ${relative}`);
    const bytes = await handle.readFile();
    const content = bytes.toString("utf8");
    if (!Buffer.from(content).equals(bytes)) throw new Error(`Expected UTF-8 text: ${relative}`);
    return content;
  } catch (error) { if (error.code === "ENOENT") return null; throw error; }
  finally { await handle?.close(); }
}

export async function fileMode(root, relative) {
  return (await lstat(await checkedPath(root, relative))).mode & 0o777;
}

async function syncDirectory(path) {
  const handle = await open(path, constants.O_RDONLY);
  try { await handle.sync(); } finally { await handle.close(); }
}

async function ensureParent(root, relative) {
  await checkedPath(root, relative);
  const parts = relative.split("/").slice(0, -1);
  let parent = root;
  for (const part of parts) {
    parent = join(parent, part);
    try { await mkdir(parent, { mode: 0o755 }); }
    catch (error) { if (error.code !== "EEXIST") throw error; }
    const stat = await lstat(parent);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Unsafe destination parent: ${relative}`);
  }
}

export async function replaceContent(root, relative, expected, next, creationMode = 0o644) {
  if (await readContent(root, relative) !== expected) throw new Error(`File changed during operation: ${relative}`);
  if (next === null) {
    if (expected !== null) {
      await unlink(await checkedPath(root, relative));
      await syncDirectory(dirname(join(root, relative)));
    }
    return;
  }
  await ensureParent(root, relative);
  const path = await checkedPath(root, relative);
  if (expected === null) {
    const handle = await open(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, creationMode);
    try { await handle.writeFile(next); await handle.chmod(creationMode); await handle.sync(); } finally { await handle.close(); }
  } else {
    const temporary = join(dirname(path), `.evenkit-${randomUUID()}.tmp`);
    const mode = (await lstat(path)).mode & 0o777;
    const handle = await open(temporary, "wx", mode);
    try {
      await handle.writeFile(next); await handle.chmod(mode); await handle.sync(); await handle.close();
      if (await readContent(root, relative) !== expected) throw new Error(`File changed during operation: ${relative}`);
      await rename(temporary, path);
    } finally {
      await handle.close();
      await unlink(temporary).catch(error => { if (error.code !== "ENOENT") throw error; });
    }
  }
  await syncDirectory(dirname(path));
}

export function filesForBlocks(blocks) {
  const files = Object.create(null);
  const folded = new Map();
  for (const [name, block] of Object.entries(blocks).sort(([a], [b]) => a.localeCompare(b))) {
    safeRelativePath(block.directory);
    for (const file of block.item.files) {
      const target = `${block.directory}/${file.target}`;
      safeRelativePath(target);
      const metadata = block.item.meta.evenkit.files.find(entry => entry.target === file.target);
      const previous = files[target];
      if (previous && previous.sha256 !== metadata.sha256) throw new Error(`Shared file has incompatible baselines: ${target}. Upgrade all owning blocks together.`);
      if (folded.has(target.toLowerCase()) && folded.get(target.toLowerCase()) !== target) throw new Error(`Case-colliding destination: ${target}`);
      folded.set(target.toLowerCase(), target);
      if (previous) previous.owners.push(name);
      else files[target] = { content: file.content, sha256: metadata.sha256, owners: [name], sourceRevision: metadata.sourceRevision, sourcePath: file.path };
    }
  }
  for (const target of Object.keys(files)) {
    const parts = target.toLowerCase().split("/");
    for (let index = 1; index < parts.length; index++) {
      if (folded.has(parts.slice(0, index).join("/"))) throw new Error(`File/directory destination collision: ${target}`);
    }
  }
  return files;
}

export function parseState(text) {
  if (text === null) return { schemaVersion: 1, blocks: {}, files: {} };
  const state = stateSchema.parse(JSON.parse(text));
  for (const [name, block] of Object.entries(state.blocks)) {
    if (block.item?.name !== name) throw new Error(`Invalid state block key: ${name}`);
    validateCatalog({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "evenkit", homepage: "https://github.com/salexandr0s/evenkit", items: [block.item] });
  }
  const expected = filesForBlocks(state.blocks);
  if (Object.keys(state.files).length !== Object.keys(expected).length) throw new Error("Installed state file ownership is inconsistent.");
  for (const [target, file] of Object.entries(state.files)) {
    safeRelativePath(target);
    const baseline = expected[target];
    if (!baseline || file.sha256 !== sha256(file.content) || !isDeepStrictEqual(file, baseline)) throw new Error(`Installed baseline is corrupt: ${target}`);
  }
  return state;
}

export async function loadState(root) {
  const text = await readContent(root, statePath);
  return { text, state: parseState(text) };
}

export async function acquireLock(root) {
  await checkedPath(root, ".evenkit");
  try { await mkdir(join(root, ".evenkit"), { mode: 0o700 }); }
  catch (error) { if (error.code !== "EEXIST") throw error; }
  const lock = { pid: process.pid, token: randomUUID() };
  await replaceContent(root, lockPath, null, serialize(lock));
  return lock;
}

export async function releaseLock(root, lock) {
  await replaceContent(root, lockPath, serialize(lock), null);
}

export async function readLock(root) {
  const text = await readContent(root, lockPath);
  return text === null ? null : lockSchema.parse(JSON.parse(text));
}

export function lockIsAlive(lock) {
  try { process.kill(lock.pid, 0); return true; }
  catch (error) { if (error.code === "ESRCH") return false; throw error; }
}

export function parseJournal(text, root) {
  const journal = journalSchema.parse(JSON.parse(text));
  if (journal.consumer !== root) throw new Error("Transaction belongs to a different consumer.");
  const before = parseState(journal.stateBefore);
  const after = parseState(journal.stateAfter);
  const seen = new Set();
  for (const change of journal.changes) {
    safeRelativePath(change.target);
    if (seen.has(change.target)) throw new Error("Duplicate transaction target.");
    seen.add(change.target);
    if (change.before === change.after || change.before !== (before.files[change.target]?.content ?? null) || change.after !== (after.files[change.target]?.content ?? null)) throw new Error(`Transaction does not match installed baselines: ${change.target}`);
  }
  return journal;
}

// A complete state write is the commit point. Before it, recovery rolls back.
export async function recoverJournal(root, dryRun = false) {
  const text = await readContent(root, journalPath);
  if (text === null) return { operation: "recover", blocked: false, status: "no-transaction", files: [] };
  const journal = parseJournal(text, root);
  const currentState = await readContent(root, statePath);
  if (currentState === journal.stateAfter) {
    if (!dryRun) await replaceContent(root, journalPath, text, null);
    return { operation: "recover", blocked: false, status: "committed", files: [] };
  }
  if (currentState !== journal.stateBefore) throw new Error("Installed state changed after interruption; preserve the journal and review it manually.");
  const files = [];
  for (const change of journal.changes) {
    const current = await readContent(root, change.target);
    const status = current === change.before ? "unchanged" : current === change.after ? "rollback" : "conflict";
    files.push({ target: change.target, status, localHash: contentHash(current), beforeHash: contentHash(change.before), afterHash: contentHash(change.after) });
  }
  const blocked = files.some(file => file.status === "conflict");
  if (!blocked && !dryRun) {
    for (const change of [...journal.changes].reverse()) {
      if (files.find(file => file.target === change.target).status === "rollback") await replaceContent(root, change.target, change.after, change.before, change.beforeMode);
    }
    await replaceContent(root, journalPath, text, null);
  }
  return { operation: "recover", blocked, status: blocked ? "conflict" : "rolled-back", files };
}
