import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const hash = content => createHash("sha256").update(content).digest("hex");

async function scratch(t) {
  const directory = await mkdtemp(join(tmpdir(), "evenkit-viewer-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

function block(name, content, description = "An editable block for a temporary viewer fixture.") {
  const file = { path: `registry/blocks/${name}.tsx`, target: `${name}.tsx`, type: "registry:file", content };
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json", name,
    title: name, description, type: "registry:block", dependencies: ["@evenkit/ui@0.1.0"], files: [file],
    meta: { evenkit: {
      formatVersion: 1, sourceRevision: "a".repeat(40), license: "UNLICENSED", inventoryIds: ["R05"],
      dependencies: [{ name: "@evenkit/ui", range: "0.1.0", distribution: "private", license: "UNLICENSED" }],
      files: [{ path: file.path, target: file.target, sha256: hash(content), sourceRevision: "b".repeat(40) }]
    } }
  };
}

async function bundle(directory, items = [block("demo", "export const demo = 1;\n")]) {
  const registry = join(directory, "registry");
  await mkdir(registry);
  const catalog = {
    $schema: "https://ui.shadcn.com/schema/registry.json", name: "evenkit",
    homepage: "https://github.com/salexandr0s/evenkit", items
  };
  await writeFile(join(registry, "registry.json"), JSON.stringify(catalog, null, 2) + "\n");
  return { registry, catalog };
}

test("viewer export refuses existing files and symlinks", async t => {
  const { createViewer } = await import("./viewer.mjs");
  const directory = await scratch(t);
  const { registry } = await bundle(directory);
  const output = join(directory, "viewer.html");
  const existing = "application-owned content\n";
  await writeFile(output, existing);
  await assert.rejects(createViewer({ registry, output }));
  assert.equal(await readFile(output, "utf8"), existing);
  const linked = join(directory, "linked.html");
  await symlink(output, linked);
  await assert.rejects(createViewer({ registry, output: linked }));
  assert.equal(await readFile(output, "utf8"), existing);
  assert.equal((await lstat(linked)).isSymbolicLink(), true);
});

test("viewer export validates bundle hashes before writing output", async t => {
  const { createViewer } = await import("./viewer.mjs");
  const directory = await scratch(t);
  const entry = block("demo", "export const demo = 1;\n");
  entry.files[0].content = "source changed without a matching digest\n";
  const { registry } = await bundle(directory, [entry]);
  const output = join(directory, "invalid.html");
  await assert.rejects(createViewer({ registry, output }), /[Hh]ash/);
  await assert.rejects(lstat(output), { code: "ENOENT" });
  assert.deepEqual(await readdir(directory), ["registry"]);
});

test("viewer keeps source and metadata as escaped data in a self-contained document", async t => {
  const { createViewer } = await import("./viewer.mjs");
  const directory = await scratch(t);
  const injection = '</script><script>globalThis.registryInjected=true</script><img id="registry-injected" src="x">';
  const source = `export const text = ${JSON.stringify(`${injection}\u2028\u2029<!--`)};\n`;
  const first = block("demo", source, `Description: ${injection}`);
  first.title = injection;
  const { registry, catalog } = await bundle(directory, [first, block("second", "export const second = 2;\n")]);
  const registryBefore = await readFile(join(registry, "registry.json"), "utf8");
  const output = join(directory, "viewer.html");
  const cliPath = join(root, "scripts/registry/cli.mjs");
  await createViewer({ registry, output, cliPath });
  const html = await readFile(output, "utf8");
  const dataMatch = html.match(/<script\b(?=[^>]*\bid=["']registry-data["'])(?=[^>]*\btype=["']application\/json["'])[^>]*>([\s\S]*?)<\/script>/i);
  assert.ok(dataMatch, "The document must embed its registry data as JSON.");
  assert.doesNotMatch(dataMatch[1], /[<\u2028\u2029]/);
  const data = JSON.parse(dataMatch[1]);
  assert.deepEqual(data.catalog, catalog);
  assert.equal(data.registry, registry);
  assert.equal(data.cliPath, cliPath);
  assert.doesNotMatch(html, /<img\b[^>]*\bid=["']registry-injected["']/i);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=/i);
  assert.doesNotMatch(html, /<link\b[^>]*\brel=["']stylesheet["']/i);
  assert.doesNotMatch(html, /<(?:img|iframe|source|video|audio|link|script)\b[^>]*(?:src|href)=["']https?:\/\//i);
  assert.match(html, /--pk-color-/);
  const policyTag = html.match(/<meta\b(?=[^>]*http-equiv=["']Content-Security-Policy["'])[^>]*>/i)?.[0];
  assert.ok(policyTag, "The exported viewer must declare its content security policy.");
  const policy = policyTag.match(/\bcontent="([^"]*)"/)?.[1];
  assert.ok(policy);
  assert.doesNotMatch(policy, /unsafe-inline/);
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(script => !/type=["']application\/json["']/i.test(script[1]));
  assert.ok(scripts.length > 0);
  for (const script of scripts) {
    const digest = createHash("sha256").update(script[2]).digest("base64");
    assert.ok(policy.includes(`'sha256-${digest}'`), "Executable script bytes must match the CSP hash.");
  }
  for (const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    assert.doesNotMatch(style[1], /(?:url\(|@import\s+)[\s"']*https?:\/\//i);
    const digest = createHash("sha256").update(style[1]).digest("base64");
    assert.ok(policy.includes(`'sha256-${digest}'`), "Embedded style bytes must match the CSP hash.");
  }
  assert.equal(await readFile(join(registry, "registry.json"), "utf8"), registryBefore);
  assert.deepEqual((await readdir(directory)).sort(), ["registry", "viewer.html"]);
});

test("copyable dry-run commands preserve shell metacharacters as argument text", async t => {
  const { makeInstallCommand } = await import("./viewer.mjs");
  const directory = await scratch(t);
  const cliPath = join(directory, "cli owner's $(touch dollar-marker) `touch tick-marker`.mjs");
  await writeFile(cliPath, "console.log(JSON.stringify(process.argv.slice(2)));\n");
  const options = {
    cliPath,
    registry: join(directory, "registry owner's $(touch registry-marker)"),
    consumer: join(directory, "consumer owner's `touch consumer-marker`"),
    directory: "src/blocks",
    names: ["record-detail", "recovery-page"]
  };
  const command = makeInstallCommand(options);
  const result = spawnSync("/bin/sh", ["-c", command], {
    cwd: directory, encoding: "utf8", timeout: 15_000, maxBuffer: 1024 * 1024
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), [
    "install", ...options.names, "--registry", options.registry, "--cwd", options.consumer,
    "--dir", options.directory, "--dry-run"
  ]);
  assert.deepEqual(await readdir(directory), [cliPath.slice(directory.length + 1)]);
  for (const badValue of ["path\nsecond-command", "path\u0000suffix", "path\rsecond-command"]) {
    assert.throws(() => makeInstallCommand({ ...options, consumer: badValue }));
  }
});
