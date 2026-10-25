import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import semver from "semver";
import { z } from "zod";
import { loadRegistry, safeRelativePath, sha256 } from "./catalog.mjs";
import {
  acquireLock, contentHash, consumerRoot, fileMode, filesForBlocks, journalPath, loadState,
  lockIsAlive, parseState, readContent, readLock, recoverJournal, releaseLock, replaceContent,
  serialize, statePath
} from "./storage.mjs";

const contexts = new WeakMap();
const manifestSchema = z.object({
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional()
});
const installedPackageSchema = z.object({ name: z.string(), version: z.string() });

async function checkDependencies(root, items) {
  const text = await readContent(root, "package.json");
  if (text === null) throw new Error("Consumer needs a package.json before installation.");
  const manifest = manifestSchema.parse(JSON.parse(text));
  const declared = { ...manifest.devDependencies, ...manifest.dependencies };
  const requirements = new Map();
  for (const item of items) for (const dependency of item.meta.evenkit.dependencies) {
    requirements.set(`${dependency.name}@${dependency.range}`, dependency);
  }
  const results = [];
  for (const dependency of [...requirements.values()].sort((a, b) => a.name.localeCompare(b.name))) {
    const { name, range } = dependency;
    const declaration = declared[name];
    let installed;
    let status = declaration ? "missing" : "undeclared";
    try {
      // npm links and private/local tarballs are valid dependency sources. They
      // are read here; the installer never writes inside node_modules.
      installed = installedPackageSchema.parse(JSON.parse(await readFile(join(root, "node_modules", name, "package.json"), "utf8")));
      if (installed.name !== name || !semver.valid(installed.version)) throw new Error(`Invalid installed package: ${name}`);
      if (declaration) {
        const declaredRange = semver.validRange(declaration);
        status = semver.satisfies(installed.version, range) && (!declaredRange || semver.satisfies(installed.version, declaredRange)) ? "satisfied" : "incompatible";
      }
    } catch (error) { if (error.code !== "ENOENT") throw error; }
    results.push({ ...dependency, declared: declaration ?? null, installed: installed?.version ?? null, status });
  }
  return results;
}

function identity(item) {
  return sha256(serialize({
    files: item.meta.evenkit.files.map(({ target, sha256: hash }) => ({ target, hash })),
    dependencies: item.meta.evenkit.dependencies, license: item.meta.evenkit.license
  }));
}

export async function planInstallation({ operation, names, registry, cwd, directory = "src/blocks", acceptLocal }) {
  if (!["install", "upgrade"].includes(operation)) throw new Error("Expected install or upgrade operation.");
  if (!Array.isArray(names) || names.length === 0 || new Set(names).size !== names.length) throw new Error("Select one or more distinct block names.");
  if (acceptLocal && (operation !== "upgrade" || !/^[a-f0-9]{64}$/.test(acceptLocal))) throw new Error("--accept-local requires upgrade and a review token from diff.");
  safeRelativePath(directory);
  const root = await consumerRoot(cwd);
  if (await readContent(root, journalPath) !== null) throw new Error("An interrupted transaction needs review. Run recover --dry-run first.");
  const catalog = await loadRegistry(registry);
  const { text: stateBefore, state } = await loadState(root);
  const nextBlocks = { ...state.blocks };
  const issues = [];
  const selected = names.map(name => {
    const item = catalog.items.find(candidate => candidate.name === name);
    if (!item) throw new Error(`Unknown block: ${name}`);
    const previous = state.blocks[name];
    if (operation === "upgrade" && !previous) throw new Error(`Block is not installed: ${name}`);
    if (operation === "install" && previous) {
      if (previous.directory !== directory) issues.push(`Block ${name} is already installed in ${previous.directory}.`);
      if (identity(previous.item) !== identity(item)) issues.push(`Block ${name} has a different installed baseline. Use upgrade.`);
    } else nextBlocks[name] = { directory: previous?.directory ?? directory, item };
    return item;
  });
  const dependencies = await checkDependencies(root, Object.values(nextBlocks).map(block => block.item));
  let nextFiles;
  try { nextFiles = filesForBlocks(nextBlocks); }
  catch (error) { issues.push(error.message); nextFiles = state.files; }
  const nextState = { schemaVersion: 1, blocks: nextBlocks, files: nextFiles };
  const files = [];
  const changes = [];
  const observations = [];
  for (const target of [...new Set([...Object.keys(state.files), ...Object.keys(nextFiles)])].sort()) {
    const baseline = state.files[target]?.content ?? null;
    const incoming = nextFiles[target]?.content ?? null;
    const local = await readContent(root, target);
    const beforeMode = local === null ? undefined : await fileMode(root, target);
    observations.push({ target, baseline, local, incoming, beforeMode });
    let status;
    let resolvable = false;
    if (baseline === null) status = local === null ? "create" : "conflict";
    else if (incoming === null) {
      status = local === null ? "unchanged" : local === baseline ? "remove" : "conflict";
      resolvable = status === "conflict";
    } else if (local === incoming) status = baseline === incoming ? "unchanged" : "adopt";
    else if (incoming === baseline) status = "local-modified";
    else if (local === baseline) status = "update";
    else { status = "conflict"; resolvable = true; }
    if (["create", "update", "remove"].includes(status)) changes.push({ target, before: local, after: incoming, ...(beforeMode === undefined ? {} : { beforeMode }) });
    files.push({ target, status, resolvable, baselineHash: contentHash(baseline), localHash: contentHash(local), incomingHash: contentHash(incoming), owners: nextFiles[target]?.owners ?? state.files[target].owners });
  }
  const stateAfter = serialize(nextState);
  if (issues.length === 0) parseState(stateAfter);
  const reviewToken = sha256(serialize({ operation, names, root, stateBefore, stateAfter, dependencies, observations, issues }));
  if (acceptLocal && acceptLocal !== reviewToken) throw new Error("Review token is stale. Run diff again and review the current files.");
  if (acceptLocal) for (const file of files) {
    if (file.status === "conflict" && file.resolvable) file.status = "preserve-reviewed";
  }
  const blocked = issues.length > 0 || dependencies.some(dependency => dependency.status !== "satisfied") || files.some(file => file.status === "conflict");
  const plan = { operation, consumer: root, names, blocked, issues, dependencies, files, reviewToken };
  contexts.set(plan, { root, stateBefore, stateAfter, changes, observations, selected, options: { operation, names, registry, cwd: root, directory, acceptLocal } });
  return plan;
}

export async function applyPlan(plan, { afterWrite } = {}) {
  const context = contexts.get(plan);
  if (!context) throw new Error("Use the plan returned by planInstallation in the same process.");
  if (plan.blocked) throw new Error("Installation is blocked. Resolve dependencies and conflicts first.");
  const { root, stateBefore, stateAfter, changes } = context;
  const lock = await acquireLock(root);
  let keepLock = false;
  try {
    const current = await planInstallation(context.options);
    if (current.reviewToken !== plan.reviewToken || current.blocked) throw new Error("Consumer or registry changed after review. Generate a new plan.");
    if (stateBefore === stateAfter && changes.length === 0) return { ...plan, applied: false };
    const journal = { schemaVersion: 1, consumer: root, stateBefore, stateAfter, changes };
    const journalText = serialize(journal);
    await replaceContent(root, journalPath, null, journalText);
    try {
      for (const [index, change] of changes.entries()) {
        await replaceContent(root, change.target, change.before, change.after);
        await afterWrite?.({ target: change.target, index });
      }
      await replaceContent(root, statePath, stateBefore, stateAfter);
      await replaceContent(root, journalPath, journalText, null);
    } catch (error) {
      const recovery = await recoverJournal(root);
      if (recovery.blocked) {
        keepLock = true;
        throw new Error(`${error.message} Recovery needs review; preserve .evenkit/transaction.json and run recover --dry-run.`, { cause: error });
      }
      throw error;
    }
    return { ...plan, applied: true };
  } finally { if (!keepLock) await releaseLock(root, lock); }
}

export async function recoverInstallation({ cwd, dryRun = false }) {
  const root = await consumerRoot(cwd);
  const previousLock = await readLock(root);
  if (previousLock && lockIsAlive(previousLock)) throw new Error(`Installer process ${previousLock.pid} is still active. Recovery refused.`);
  const preview = await recoverJournal(root, true);
  if (dryRun || preview.blocked) return preview;
  if (previousLock) await releaseLock(root, previousLock);
  const lock = await acquireLock(root);
  try { return await recoverJournal(root); }
  finally { await releaseLock(root, lock); }
}

function unifiedDiff(directory, name) {
  try {
    return execFileSync("git", ["--no-pager", "diff", "--no-index", "--no-ext-diff", "--no-textconv", "--", `${name}.before`, `${name}.after`], {
      cwd: directory, encoding: "utf8", maxBuffer: 8 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    if (error.status === 1) return error.stdout;
    throw error;
  }
}

export async function comparePlan(plan) {
  const context = contexts.get(plan);
  if (!context) throw new Error("Use a current installation plan for comparisons.");
  const scratch = await mkdtemp(join(tmpdir(), "evenkit-diff-"));
  try {
    const comparisons = [];
    for (const [index, observation] of context.observations.entries()) {
      const { target, baseline, local, incoming } = observation;
      const diffs = {};
      for (const [label, after] of [["local", local], ["upstream", incoming]]) {
        const name = `${index}-${label}`;
        await writeFile(join(scratch, `${name}.before`), baseline ?? "");
        await writeFile(join(scratch, `${name}.after`), after ?? "");
        diffs[label] = unifiedDiff(scratch, name);
      }
      comparisons.push({ target, baseline, local, incoming, diffs });
    }
    return { ...plan, comparisons };
  } finally { await rm(scratch, { recursive: true, force: true }); }
}
