import { copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { build, createServer, runnerImport, type InlineConfig, type Plugin } from "vite";

const repo = fileURLToPath(new URL("../", import.meta.url));
const usage = 'export const example = "``` nested fence";';
let scratch: string;
let root: string;
let config: InlineConfig;
let close: (() => Promise<void>) | undefined;

function entrySource(description: string) {
  return `export const entry = ${JSON.stringify({
    id: "sample", name: "Sample", group: "Controls", description, usage,
    tags: [], source: "Fixture", sourceUrl: "https://example.com", inventoryIds: ["A01"],
  })};`;
}

function blockSource(name: string) {
  return JSON.stringify({
    name, title: name, description: `Editable ${name}.`, inventoryIds: ["A01"],
    files: [{ target: `${name}.tsx` }],
  });
}

beforeEach(async () => {
  scratch = await mkdtemp(join(tmpdir(), "evenkit-llms-"));
  root = join(scratch, "apps/catalog");
  await mkdir(join(root, "llms"), { recursive: true });
  await mkdir(join(root, "src"));
  await mkdir(join(scratch, "registry/metadata"), { recursive: true });
  await symlink(join(repo, "node_modules"), join(scratch, "node_modules"), "dir");
  await writeFile(join(scratch, "package.json"), '{"type":"module"}');
  await copyFile(join(repo, "apps/catalog/llms/llms-plugin.ts"), join(root, "llms/llms-plugin.ts"));
  await writeFile(join(root, "llms/guide.md"), "# Fixture guide\n\nInitial instructions.\n");
  await writeFile(join(root, "src/entry.ts"), entrySource("Initial description."));
  await writeFile(join(root, "src/catalog-data.ts"), 'import { entry } from "./entry.js";\nexport const entries = [entry];\nexport const groups = ["Controls"];');
  await writeFile(join(root, "index.html"), '<div id="root">Catalog fixture</div>');
  await writeFile(join(scratch, "registry/metadata/sample.json"), blockSource("sample"));
  const { module } = await runnerImport<{ llmsFiles: () => Plugin }>(join(root, "llms/llms-plugin.ts"), { logLevel: "silent" });
  config = { root, configFile: false, logLevel: "silent", plugins: [module.llmsFiles()] };
});

afterEach(async () => {
  await close?.();
  close = undefined;
  await rm(scratch, { recursive: true, force: true });
});

test("dev serves fresh plain text, HEAD, method errors and unrelated routes", async () => {
  const server = await createServer({ ...config, server: { host: "127.0.0.1", port: 0 } });
  close = () => server.close();
  await server.listen();
  const address = server.httpServer?.address();
  if (!address || typeof address === "string") throw new Error("Dev server has no TCP address.");
  const url = `http://127.0.0.1:${address.port}`;
  const index = await fetch(`${url}/llms.txt?source=test`);
  expect(index.status).toBe(200);
  expect(index.headers.get("content-type")).toBe("text/plain; charset=utf-8");
  const text = await index.text();
  expect(text).toContain("[Sample](https://evenkit.dev/#sample)");
  expect(text).toContain("Editable block: `sample`");
  const head = await fetch(`${url}/llms.txt`, { method: "HEAD" });
  expect(head.status).toBe(200);
  expect(head.headers.get("content-length")).toBe(String(Buffer.byteLength(text)));
  expect(await head.text()).toBe("");
  const post = await fetch(`${url}/llms.txt`, { method: "POST" });
  expect(post.status).toBe(405);
  expect(post.headers.get("allow")).toBe("GET, HEAD");
  expect(await (await fetch(`${url}/`)).text()).toContain("Catalog fixture");
  await writeFile(join(root, "src/entry.ts"), entrySource("Updated description."));
  await writeFile(join(root, "llms/guide.md"), "# Updated guide\n");
  const full = await (await fetch(`${url}/llms-full.txt`)).text();
  expect(full).toContain("# Updated guide");
  expect(full).toContain("Updated description.");
  expect(full).toContain(`\n\n\`\`\`\`tsx\n${usage}\n\`\`\`\``);
  await writeFile(join(scratch, "registry/metadata/sample.json"), "{}");
  const invalid = await fetch(`${url}/llms.txt`);
  expect(invalid.status).toBe(500);
  expect(invalid.headers.get("content-type")).not.toBe("text/plain; charset=utf-8");
  await invalid.text();
});

test("watch rebuilds guide, transitive examples and added or removed block metadata", async () => {
  const watcher = await build({ ...config, build: { watch: { buildDelay: 20 } } });
  if (!("on" in watcher)) throw new Error("Expected a build watcher.");
  close = () => watcher.close();
  const errors: Error[] = [];
  watcher.on("event", event => {
    if (event.code === "ERROR") errors.push(event.error);
  });
  const output = (name: string) => readFile(join(root, "dist", name), "utf8");
  await vi.waitFor(async () => expect(await output("llms.txt")).toContain("Initial instructions."));
  await writeFile(join(root, "llms/guide.md"), "# Changed guide\n");
  await vi.waitFor(async () => expect(await output("llms.txt")).toContain("# Changed guide"));
  await writeFile(join(root, "src/entry.ts"), entrySource("Rebuilt description."));
  await vi.waitFor(async () => expect(await output("llms-full.txt")).toContain("Rebuilt description."));
  const extra = join(scratch, "registry/metadata/extra.json");
  await writeFile(extra, blockSource("extra"));
  await vi.waitFor(async () => expect(await output("llms.txt")).toContain("`extra.tsx`"));
  await writeFile(extra, blockSource("renamed"));
  await vi.waitFor(async () => expect(await output("llms.txt")).toContain("`renamed.tsx`"));
  await rm(extra);
  await vi.waitFor(async () => expect(await output("llms.txt")).not.toContain("`renamed.tsx`"));
  expect(await output("llms-full.txt")).toContain(usage);
  expect(errors).toEqual([]);
}, 15_000);

test("build refuses malformed block metadata", async () => {
  await writeFile(join(scratch, "registry/metadata/sample.json"), "{}");
  await expect(build(config)).rejects.toThrow();
});

test("watch recovers after invalid initial metadata is corrected", async () => {
  const path = join(scratch, "registry/metadata/sample.json");
  await writeFile(path, "{}");
  const watcher = await build({ ...config, build: { watch: { buildDelay: 20 } } });
  if (!("on" in watcher)) throw new Error("Expected a build watcher.");
  close = () => watcher.close();
  const errors: Error[] = [];
  watcher.on("event", event => {
    if (event.code === "ERROR") errors.push(event.error);
  });
  await vi.waitFor(() => expect(errors).toHaveLength(1));
  await writeFile(path, blockSource("recovered"));
  await vi.waitFor(async () => {
    expect(await readFile(join(root, "dist/llms.txt"), "utf8")).toContain("`recovered.tsx`");
  });
});
