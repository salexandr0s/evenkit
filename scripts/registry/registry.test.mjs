import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmod, lstat, mkdir, mkdtemp, readFile, readdir, readlink, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cli = join(root, "scripts/registry/cli.mjs");
const revision = "a".repeat(40);
const hash = content => createHash("sha256").update(content).digest("hex");
const dependencies = [
  { name: "@evenkit/ui", range: "0.1.0", distribution: "private", license: "UNLICENSED" },
  { name: "@evenkit/tokens", range: "0.1.0", distribution: "private", license: "UNLICENSED" },
  { name: "react", range: "^19.0.0", distribution: "npm", license: "MIT" },
  { name: "react-dom", range: "^19.0.0", distribution: "npm", license: "MIT" }
];

function command(args, expected = 0) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root, encoding: "utf8", timeout: 30_000, maxBuffer: 4 * 1024 * 1024
  });
  assert.ifError(result.error);
  const diagnostic = `${args.join(" ")}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`;
  if (expected === "failure") assert.notEqual(result.status, 0, diagnostic);
  else assert.equal(result.status, expected, diagnostic);
  const text = result.stdout.trim() || result.stderr.trim();
  return { ...result, data: JSON.parse(text) };
}

async function scratch(t) {
  const directory = await mkdtemp(join(tmpdir(), "evenkit-registry-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

async function json(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2) + "\n");
}

const readJson = async path => JSON.parse(await readFile(path, "utf8"));

function item(name = "demo", content = "export const demo = 'baseline';\n", helper = true) {
  const files = [{ path: "registry/blocks/demo.tsx", type: "registry:file", target: "demo.tsx", content }];
  if (helper) files.push({ path: "registry/blocks/helper.ts", type: "registry:file", target: "helper.ts", content: "export const helper = 'baseline';\n" });
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json", name, type: "registry:block",
    title: "Test block", description: "A block used by temporary installer consumers.",
    dependencies: dependencies.map(dependency => `${dependency.name}@${dependency.range}`), files,
    meta: { evenkit: {
      formatVersion: 1, sourceRevision: revision, license: "UNLICENSED", inventoryIds: ["R05"],
      dependencies: structuredClone(dependencies),
      files: files.map(file => ({ path: file.path, target: file.target, sha256: hash(file.content), sourceRevision: revision }))
    } }
  };
}

async function bundle(parent, name = "v1", items = [item()]) {
  const directory = join(parent, name);
  await mkdir(directory);
  const catalog = {
    $schema: "https://ui.shadcn.com/schema/registry.json", name: "evenkit",
    homepage: "https://github.com/salexandr0s/evenkit", items
  };
  await json(join(directory, "registry.json"), catalog);
  for (const entry of items) await json(join(directory, `${entry.name}.json`), entry);
  return directory;
}

async function consumer(parent, name = "consumer", { omit = [], versions = {}, declared = true } = {}) {
  const directory = join(parent, name);
  const manifest = { name: "registry-consumer", private: true, type: "module", dependencies: {} };
  for (const dependency of dependencies) {
    const version = versions[dependency.name] ?? (dependency.name.startsWith("@evenkit/") ? "0.1.0" : "19.3.1");
    if (declared) manifest.dependencies[dependency.name] = dependency.distribution === "private"
      ? `file:../private/${dependency.name.split("/").at(-1)}.tgz` : dependency.range;
    if (!omit.includes(dependency.name)) {
      await json(join(directory, "node_modules", dependency.name, "package.json"), {
        name: dependency.name, version, type: "module", main: "index.js", exports: { ".": "./index.js", "./package.json": "./package.json" }
      });
      await writeFile(join(directory, "node_modules", dependency.name, "index.js"), "export {};\n");
    }
  }
  await json(join(directory, "package.json"), manifest);
  return directory;
}

async function snapshot(directory) {
  const result = {};
  async function visit(prefix = "") {
    for (const name of (await readdir(join(directory, prefix))).sort()) {
      const relative = prefix ? `${prefix}/${name}` : name;
      const path = join(directory, relative);
      const info = await lstat(path);
      if (info.isSymbolicLink()) result[relative] = `link:${await readlink(path)}`;
      else if (info.isDirectory()) { result[relative] = "directory"; await visit(relative); }
      else result[relative] = hash(await readFile(path));
    }
  }
  await visit();
  return result;
}

function install(registry, cwd, extra = []) {
  return command(["install", "demo", "--registry", registry, "--cwd", cwd, ...extra]);
}

test("discovery, build, and inspection describe committed editable blocks", async t => {
  const directory = await scratch(t);
  const output = join(directory, "built");
  command(["discover"]);
  command(["build", "--output", output]);
  const catalog = await readJson(join(output, "registry.json"));
  for (const name of ["account-settings", "onboarding-wizard", "record-detail", "record-workflow", "recovery-page"]) {
    assert.ok(catalog.items.some(entry => entry.name === name));
  }
  command(["list", "--registry", output]);
  const inspected = command(["inspect", "record-detail", "--registry", output]).data;
  assert.equal(inspected.name, "record-detail");
  assert.ok(inspected.files.some(file => file.target === "record-workflow.tsx"));
  for (const entry of catalog.items) {
    assert.match(entry.meta.evenkit.sourceRevision, /^[a-f0-9]{40}$/);
    for (const file of entry.files) {
      assert.equal(file.content, await readFile(join(root, file.path), "utf8"));
      assert.equal(entry.meta.evenkit.files.find(source => source.path === file.path).sha256, hash(file.content));
    }
  }
  command(["build", "--output", output], "failure");
});

test("dry runs are read-only; fresh and repeated installs retain exact baselines", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const cwd = await consumer(directory);
  const before = await snapshot(cwd);
  const plan = install(registry, cwd, ["--dir", "app/editable", "--dry-run"]).data;
  assert.equal(plan.blocked, false);
  assert.deepEqual(plan.files.map(file => file.status), ["create", "create"]);
  assert.deepEqual(await snapshot(cwd), before);
  install(registry, cwd, ["--dir", "app/editable"]);
  assert.equal(await readFile(join(cwd, "app/editable/demo.tsx"), "utf8"), item().files[0].content);
  const state = await readJson(join(cwd, ".evenkit/blocks.json"));
  assert.equal(state.schemaVersion, 1);
  assert.equal(state.files["app/editable/demo.tsx"].content, item().files[0].content);
  assert.equal(state.files["app/editable/demo.tsx"].sha256, hash(item().files[0].content));
  assert.deepEqual(state.files["app/editable/demo.tsx"].owners, ["demo"]);
  const installed = await snapshot(cwd);
  install(registry, cwd, ["--dir", "app/editable"]);
  assert.deepEqual(await snapshot(cwd), installed);
});

test("missing, undeclared, and incompatible packages block all writes", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  for (const [name, options] of [
    ["missing", { omit: ["@evenkit/ui"] }],
    ["undeclared", { declared: false }],
    ["incompatible", { versions: { react: "18.3.1" } }]
  ]) {
    const cwd = await consumer(directory, name, options);
    const before = await snapshot(cwd);
    const result = command(["install", "demo", "--registry", registry, "--cwd", cwd], 2);
    assert.equal(result.data.blocked, true);
    assert.deepEqual(await snapshot(cwd), before);
  }
});

test("pre-existing application files are never adopted implicitly", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const cwd = await consumer(directory);
  await mkdir(join(cwd, "src/blocks"), { recursive: true });
  await writeFile(join(cwd, "src/blocks/demo.tsx"), item().files[0].content);
  const before = await snapshot(cwd);
  const result = command(["install", "demo", "--registry", registry, "--cwd", cwd], 2);
  assert.equal(result.data.blocked, true);
  assert.ok(result.data.files.some(file => file.status === "conflict"));
  assert.deepEqual(await snapshot(cwd), before);
});

test("repeated installation and unchanged upstream upgrades preserve local edits", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const cwd = await consumer(directory);
  install(registry, cwd);
  const local = "export const demo = 'application edit';\n";
  await writeFile(join(cwd, "src/blocks/demo.tsx"), local);
  const before = await snapshot(cwd);
  const repeat = install(registry, cwd).data;
  assert.ok(repeat.files.some(file => file.status === "local-modified"));
  command(["upgrade", "demo", "--registry", registry, "--cwd", cwd]);
  assert.deepEqual(await snapshot(cwd), before);
  assert.equal((await readJson(join(cwd, ".evenkit/blocks.json"))).files["src/blocks/demo.tsx"].content, item().files[0].content);
});

test("clean upgrades update source and baseline; file removals are explicit", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const upgraded = item("demo", "export const demo = 'upstream v2';\n", false);
  const next = await bundle(directory, "v2", [upgraded]);
  const cwd = await consumer(directory);
  install(registry, cwd);
  await chmod(join(cwd, "src/blocks/demo.tsx"), 0o664);
  const before = await snapshot(cwd);
  const plan = command(["upgrade", "demo", "--registry", next, "--cwd", cwd, "--dry-run"]).data;
  assert.ok(plan.files.some(file => file.status === "update"));
  assert.ok(plan.files.some(file => file.status === "remove"));
  assert.deepEqual(await snapshot(cwd), before);
  command(["upgrade", "demo", "--registry", next, "--cwd", cwd]);
  assert.equal(await readFile(join(cwd, "src/blocks/demo.tsx"), "utf8"), upgraded.files[0].content);
  assert.equal((await lstat(join(cwd, "src/blocks/demo.tsx"))).mode & 0o777, 0o664);
  await assert.rejects(readFile(join(cwd, "src/blocks/helper.ts")), { code: "ENOENT" });
  const state = await readJson(join(cwd, ".evenkit/blocks.json"));
  assert.equal(state.files["src/blocks/demo.tsx"].sha256, hash(upgraded.files[0].content));
  assert.equal(state.files["src/blocks/helper.ts"], undefined);
});

test("upgrade conflicts expose reviewable differences and leave every file unchanged", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const upgraded = item("demo", "export const demo = 'upstream v2';\n", false);
  const next = await bundle(directory, "v2", [upgraded]);
  const cwd = await consumer(directory);
  install(registry, cwd);
  await writeFile(join(cwd, "src/blocks/demo.tsx"), "export const demo = 'application edit';\n");
  const before = await snapshot(cwd);
  const diff = command(["diff", "demo", "--registry", next, "--cwd", cwd], 2).data;
  assert.ok(diff.files.some(file => file.status === "conflict"));
  assert.match(JSON.stringify(diff), /application edit/);
  assert.match(JSON.stringify(diff), /upstream v2/);
  assert.match(JSON.stringify(diff), /@@/);
  command(["upgrade", "demo", "--registry", next, "--cwd", cwd], 2);
  assert.deepEqual(await snapshot(cwd), before);
  await writeFile(join(cwd, "src/blocks/demo.tsx"), upgraded.files[0].content);
  command(["upgrade", "demo", "--registry", next, "--cwd", cwd]);
  assert.equal((await readJson(join(cwd, ".evenkit/blocks.json"))).files["src/blocks/demo.tsx"].content, upgraded.files[0].content);
});

test("local deletions and edited removed files remain conflicts", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const next = await bundle(directory, "v2", [item("demo", "export const demo = 'upstream v2';\n", false)]);
  const cwd = await consumer(directory);
  install(registry, cwd);
  await rm(join(cwd, "src/blocks/demo.tsx"));
  await writeFile(join(cwd, "src/blocks/helper.ts"), "export const helper = 'application edit';\n");
  const before = await snapshot(cwd);
  const result = command(["upgrade", "demo", "--registry", next, "--cwd", cwd], 2).data;
  assert.equal(result.files.filter(file => file.status === "conflict").length, 2);
  assert.deepEqual(await snapshot(cwd), before);
});

test("destination traversal and symlinks cannot write outside the consumer", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const cwd = await consumer(directory);
  const outside = join(directory, "outside");
  await mkdir(outside);
  for (const destination of ["../outside", outside, "C:\\outside", "src/../outside", "node_modules/copied"]) {
    const before = await snapshot(cwd);
    command(["install", "demo", "--registry", registry, "--cwd", cwd, "--dir", destination], "failure");
    assert.deepEqual(await snapshot(cwd), before);
    assert.deepEqual(await readdir(outside), []);
  }
  await symlink(outside, join(cwd, "src"), "dir");
  const before = await snapshot(cwd);
  command(["install", "demo", "--registry", registry, "--cwd", cwd], "failure");
  assert.deepEqual(await snapshot(cwd), before);
  assert.deepEqual(await readdir(outside), []);
});

test("invalid or tampered bundle metadata fails before installation", async t => {
  const directory = await scratch(t);
  const cwd = await consumer(directory);
  const cases = [
    entry => { entry.files[0].content = "changed without updating the hash"; },
    entry => { entry.files[0].target = "../outside.tsx"; entry.meta.evenkit.files[0].target = "../outside.tsx"; },
    entry => { entry.files[0].target = "C:/outside.tsx"; entry.meta.evenkit.files[0].target = "C:/outside.tsx"; },
    entry => { entry.meta.evenkit.sourceRevision = "main"; },
    entry => { entry.dependencies = []; },
    entry => { entry.files.push({ ...entry.files[0], target: "DEMO.tsx" }); entry.meta.evenkit.files.push({ ...entry.meta.evenkit.files[0], target: "DEMO.tsx" }); },
    entry => { entry.envVars = { SECRET: "unexpected" }; }
  ];
  for (const [index, mutate] of cases.entries()) {
    const entry = item();
    mutate(entry);
    const registry = await bundle(directory, `invalid-${index}`, [entry]);
    const before = await snapshot(cwd);
    command(["install", "demo", "--registry", registry, "--cwd", cwd], "failure");
    assert.deepEqual(await snapshot(cwd), before);
  }
});

test("corrupt installed baselines and symlinked state are rejected", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const cwd = await consumer(directory);
  install(registry, cwd);
  const statePath = join(cwd, ".evenkit/blocks.json");
  const state = await readJson(statePath);
  state.files["src/blocks/demo.tsx"].content = "changed baseline without hash";
  await json(statePath, state);
  const before = await snapshot(cwd);
  command(["upgrade", "demo", "--registry", registry, "--cwd", cwd], "failure");
  assert.deepEqual(await snapshot(cwd), before);
  const second = await consumer(directory, "second");
  await symlink(join(cwd, ".evenkit"), join(second, ".evenkit"), "dir");
  const secondBefore = await snapshot(second);
  command(["install", "demo", "--registry", registry, "--cwd", second], "failure");
  assert.deepEqual(await snapshot(second), secondBefore);
  assert.deepEqual(await snapshot(cwd), before);
});

test("shared files require every affected owner to upgrade together", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory, "v1", [item(), item("companion")]);
  const next = await bundle(directory, "v2", [
    item("demo", "export const demo = 'upstream v2';\n"),
    item("companion", "export const demo = 'upstream v2';\n")
  ]);
  const cwd = await consumer(directory);
  command(["install", "demo", "companion", "--registry", registry, "--cwd", cwd]);
  const before = await snapshot(cwd);
  command(["upgrade", "demo", "--registry", next, "--cwd", cwd], 2);
  assert.deepEqual(await snapshot(cwd), before);
  command(["upgrade", "demo", "companion", "--registry", next, "--cwd", cwd]);
  assert.equal(await readFile(join(cwd, "src/blocks/demo.tsx"), "utf8"), "export const demo = 'upstream v2';\n");
  const state = await readJson(join(cwd, ".evenkit/blocks.json"));
  assert.deepEqual(state.files["src/blocks/demo.tsx"].owners.sort(), ["companion", "demo"]);
});

test("review tokens preserve resolved local content and reject stale comparisons", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const incoming = item("demo", "export const demo = 'upstream v2';\n");
  const next = await bundle(directory, "v2", [incoming]);
  const cwd = await consumer(directory);
  install(registry, cwd);
  const target = join(cwd, "src/blocks/demo.tsx");
  await writeFile(target, "export const demo = 'first local edit';\n");
  const oldToken = command(["diff", "demo", "--registry", next, "--cwd", cwd], 2).data.reviewToken;
  assert.equal(typeof oldToken, "string");
  const resolved = "export const demo = 'reviewed combination';\n";
  await writeFile(target, resolved);
  const before = await snapshot(cwd);
  command(["upgrade", "demo", "--registry", next, "--cwd", cwd, "--accept-local", oldToken], "failure");
  assert.deepEqual(await snapshot(cwd), before);
  const review = command(["diff", "demo", "--registry", next, "--cwd", cwd], 2).data;
  command(["upgrade", "demo", "--registry", next, "--cwd", cwd, "--accept-local", review.reviewToken]);
  assert.equal(await readFile(target, "utf8"), resolved);
  const state = await readJson(join(cwd, ".evenkit/blocks.json"));
  assert.equal(state.files["src/blocks/demo.tsx"].content, incoming.files[0].content);
  const repeated = command(["upgrade", "demo", "--registry", next, "--cwd", cwd]).data;
  assert.ok(repeated.files.some(file => file.status === "local-modified"));
  assert.equal(await readFile(target, "utf8"), resolved);
});

test("caught write failures roll back files and permit a new installation", async t => {
  const { planInstallation, applyPlan } = await import("./installer.mjs");
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const cwd = await consumer(directory);
  const plan = await planInstallation({ operation: "install", names: ["demo"], registry, cwd });
  await assert.rejects(applyPlan(plan, {
    async afterWrite() {
      const before = await snapshot(cwd);
      const result = command(["recover", "--cwd", cwd], "failure");
      assert.match(result.data.error, /active/);
      assert.deepEqual(await snapshot(cwd), before);
      throw new Error("Injected failure after a file write");
    }
  }), /Injected failure/);
  await assert.rejects(readFile(join(cwd, "src/blocks/demo.tsx")), { code: "ENOENT" });
  await assert.rejects(readFile(join(cwd, "src/blocks/helper.ts")), { code: "ENOENT" });
  await assert.rejects(readFile(join(cwd, ".evenkit/blocks.json")), { code: "ENOENT" });
  await assert.rejects(readFile(join(cwd, ".evenkit/transaction.json")), { code: "ENOENT" });
  install(registry, cwd);
});

function interruptInstall(registry, cwd) {
  const source = `
    import { planInstallation, applyPlan } from ${JSON.stringify(new URL("./installer.mjs", import.meta.url).href)};
    const plan = await planInstallation(${JSON.stringify({ operation: "install", names: ["demo"], registry, cwd })});
    await applyPlan(plan, { afterWrite() { process.exit(73); } });
  `;
  const child = spawnSync(process.execPath, ["--input-type=module", "--eval", source], {
    cwd: root, encoding: "utf8", timeout: 30_000
  });
  assert.ifError(child.error);
  assert.equal(child.status, 73, child.stderr);
}

test("interrupted installs require recovery and dry-run recovery is read-only", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const cwd = await consumer(directory);
  interruptInstall(registry, cwd);
  const journal = await readJson(join(cwd, ".evenkit/transaction.json"));
  assert.ok(journal.changes.length > 0);
  const before = await snapshot(cwd);
  command(["install", "demo", "--registry", registry, "--cwd", cwd], "failure");
  command(["recover", "--cwd", cwd, "--dry-run"]);
  assert.deepEqual(await snapshot(cwd), before);
  command(["recover", "--cwd", cwd]);
  await assert.rejects(readFile(join(cwd, ".evenkit/transaction.json")), { code: "ENOENT" });
  await assert.rejects(readFile(join(cwd, ".evenkit/blocks.json")), { code: "ENOENT" });
  for (const file of item().files) await assert.rejects(readFile(join(cwd, "src/blocks", file.target)), { code: "ENOENT" });
  install(registry, cwd);
});

test("recovery refuses to replace edits made after an interrupted write", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const cwd = await consumer(directory);
  interruptInstall(registry, cwd);
  const journal = await readJson(join(cwd, ".evenkit/transaction.json"));
  const written = journal.changes[0];
  const target = join(cwd, written.target);
  await writeFile(target, "application edit after interruption\n");
  const before = await snapshot(cwd);
  command(["recover", "--cwd", cwd], "failure");
  assert.deepEqual(await snapshot(cwd), before);
  await writeFile(target, written.after);
  command(["recover", "--cwd", cwd]);
  install(registry, cwd);
});

test("discovery excludes unfinished files and builds reject dirty or incomplete registered source", async t => {
  const { buildRegistry, discoverBlocks } = await import("./build.mjs");
  const directory = await scratch(t);
  const sourceRoot = join(directory, "source");
  const metadata = {
    formatVersion: 1, name: "demo", title: "Test block", description: "A committed source fixture.",
    inventoryIds: ["R05"], license: "UNLICENSED", dependencies: [],
    files: [{ path: "registry/blocks/demo.tsx", target: "demo.tsx" }, { path: "registry/blocks/helper.ts", target: "helper.ts" }]
  };
  await json(join(sourceRoot, "registry/metadata/demo.json"), metadata);
  await mkdir(join(sourceRoot, "registry/blocks"));
  const source = 'export { helper } from "./helper";\n';
  await writeFile(join(sourceRoot, "registry/blocks/demo.tsx"), source);
  await writeFile(join(sourceRoot, "registry/blocks/helper.ts"), "export const helper = 1;\n");
  for (const args of [["init", "-q"], ["add", "registry"], ["-c", "core.hooksPath=/dev/null", "-c", "user.name=Registry test", "-c", "user.email=registry-test@example.invalid", "commit", "-qm", "test(registry): create source fixture"]]) {
    const result = spawnSync("git", args, { cwd: sourceRoot, encoding: "utf8", timeout: 15_000 });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
  }
  await writeFile(join(sourceRoot, "registry/blocks/unfinished.tsx"), "not complete TypeScript yet");
  const discovered = await discoverBlocks(sourceRoot);
  assert.deepEqual(discovered.unregistered, ["registry/blocks/unfinished.tsx"]);
  const built = await buildRegistry({ root: sourceRoot, output: join(directory, "clean") });
  assert.equal(built.items.length, 1);
  assert.equal(built.items[0].files.length, 2);
  await writeFile(join(sourceRoot, "registry/blocks/demo.tsx"), `${source}// unfinished edit\n`);
  await assert.rejects(buildRegistry({ root: sourceRoot, output: join(directory, "dirty") }), /committed/);
  await assert.rejects(lstat(join(directory, "dirty")), { code: "ENOENT" });
  await writeFile(join(sourceRoot, "registry/blocks/demo.tsx"), source);
  metadata.files.pop();
  await json(join(sourceRoot, "registry/metadata/demo.json"), metadata);
  await assert.rejects(buildRegistry({ root: sourceRoot, output: join(directory, "incomplete") }), /local import/);
  await assert.rejects(lstat(join(directory, "incomplete")), { code: "ENOENT" });
});

test("failed upgrades restore existing files and baseline records", async t => {
  const { planInstallation, applyPlan } = await import("./installer.mjs");
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const next = await bundle(directory, "v2", [item("demo", "export const demo = 'upstream v2';\n", false)]);
  const cwd = await consumer(directory);
  install(registry, cwd);
  await chmod(join(cwd, "src/blocks/helper.ts"), 0o600);
  const before = await snapshot(cwd);
  const plan = await planInstallation({ operation: "upgrade", names: ["demo"], registry: next, cwd });
  await assert.rejects(applyPlan(plan, {
    afterWrite({ target }) {
      if (target.endsWith("/helper.ts")) throw new Error("Injected upgrade write failure");
    }
  }), /Injected upgrade/);
  assert.deepEqual(await snapshot(cwd), before);
  assert.equal((await lstat(join(cwd, "src/blocks/helper.ts"))).mode & 0o777, 0o600);
});

test("an application edit after planning prevents stale writes", async t => {
  const { planInstallation, applyPlan } = await import("./installer.mjs");
  const directory = await scratch(t);
  const registry = await bundle(directory);
  const next = await bundle(directory, "v2", [item("demo", "export const demo = 'upstream v2';\n")]);
  const cwd = await consumer(directory);
  install(registry, cwd);
  const plan = await planInstallation({ operation: "upgrade", names: ["demo"], registry: next, cwd });
  await writeFile(join(cwd, "src/blocks/demo.tsx"), "application edit after planning\n");
  const before = await snapshot(cwd);
  await assert.rejects(applyPlan(plan), /changed after review/);
  assert.deepEqual(await snapshot(cwd), before);
});

test("different destination directories can hold different source baselines", async t => {
  const directory = await scratch(t);
  const registry = await bundle(directory, "v1", [item(), item("companion")]);
  const incoming = "export const demo = 'upstream v2';\n";
  const next = await bundle(directory, "v2", [item("demo", incoming), item("companion", incoming)]);
  const cwd = await consumer(directory);
  install(registry, cwd, ["--dir", "app/first"]);
  command(["install", "companion", "--registry", next, "--cwd", cwd, "--dir", "app/second"]);
  assert.equal(await readFile(join(cwd, "app/first/demo.tsx"), "utf8"), item().files[0].content);
  assert.equal(await readFile(join(cwd, "app/second/demo.tsx"), "utf8"), incoming);
  const before = await snapshot(cwd);
  command(["upgrade", "companion", "--registry", next, "--cwd", cwd]);
  assert.deepEqual(await snapshot(cwd), before);
  command(["upgrade", "demo", "--registry", next, "--cwd", cwd]);
  const state = await readJson(join(cwd, ".evenkit/blocks.json"));
  assert.deepEqual(state.files["app/first/demo.tsx"].owners, ["demo"]);
  assert.deepEqual(state.files["app/second/demo.tsx"].owners, ["companion"]);
});

test("metadata validates against its pinned schema and upstream files match provenance hashes", async () => {
  const { default: Ajv } = await import("ajv");
  const schemaDirectory = join(root, "registry/schema");
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(await readJson(join(schemaDirectory, "block-metadata.json")));
  const metadataDirectory = join(root, "registry/metadata");
  for (const filename of (await readdir(metadataDirectory)).filter(name => name.endsWith(".json"))) {
    const metadata = await readJson(join(metadataDirectory, filename));
    assert.equal(validate(metadata), true, `${filename}: ${ajv.errorsText(validate.errors)}`);
    const invalid = { ...metadata };
    delete invalid.files;
    assert.equal(validate(invalid), false);
  }
  const provenance = await readJson(join(schemaDirectory, "provenance.json"));
  assert.equal(provenance.license, "MIT");
  for (const file of provenance.files) {
    assert.equal(hash(await readFile(join(schemaDirectory, file.file))), file.sha256, file.file);
  }
});
