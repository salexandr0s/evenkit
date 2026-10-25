import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { createServer } from "vite";

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = await mkdtemp(join(tmpdir(), "evenkit-examples-"));
const reportPath = join(root, ".artifacts", "catalog-examples.json");
const report = { status: "running", entries: [], inventory: [], scratchRemoved: false };
let server;

try {
  server = await createServer({
    configFile: false,
    root: join(root, "apps", "catalog"),
    server: { middlewareMode: true },
    appType: "custom",
  });
  const { entries } = await server.ssrLoadModule("/src/catalog-data.ts");
  if (!Array.isArray(entries)) throw new Error("Catalog entries were not exported.");
  const ids = entries.map(entry => entry.id);
  if (new Set(ids).size !== ids.length) throw new Error("Catalog entry IDs must be unique.");
  const inventory = await readFile(join(root, "docs", "component-inventory.md"), "utf8");
  const original = [...inventory.matchAll(/^\| ([A-R]\d{2}) \|[^\n]+\| Next \/[^\n]+$/gm)].map(match => match[1]);
  if (original.length !== 48) throw new Error(`Expected the original 48 Next entries, received ${original.length}.`);
  const additions = [
    "D01", "D02", "D03", "D04", "D08", "C08", "C09", "C05", "C06",
    "I08", "I04", "I05", "I06", "O03", "H06", "M02", "M03", "M04", "M05",
    "J03", "J04", "E10", "E08", "O06",
    "J05", "J06", "J07",
  ];
  const inventoryIds = [...inventory.matchAll(/^\| ([A-R]\d{2}) \|/gm)].map(match => match[1]);
  const expected = [...original, ...additions];
  if (new Set(expected).size !== 75 || additions.some(id => !inventoryIds.includes(id))) {
    throw new Error("The requested roadmap must contain 27 distinct additions present in the inventory.");
  }
  const mapped = entries.flatMap(entry => entry.inventoryIds ?? []);
  for (const id of expected) {
    if (mapped.filter(value => value === id).length !== 1) throw new Error(`${id} must map to exactly one catalog entry.`);
  }
  if (mapped.some(id => !expected.includes(id))) throw new Error("Unexpected inventory IDs in component examples.");
  await symlink(join(root, "node_modules"), join(scratch, "node_modules"), "dir");
  const examples = join(scratch, "examples");
  await mkdir(examples);
  await cp(join(root, "registry", "blocks"), examples, { recursive: true });
  for (const entry of entries) {
    if (!/^[a-z][a-z0-9-]*$/.test(entry.id) || typeof entry.usage !== "string" || !entry.usage.trim()) {
      throw new Error("Every entry needs a safe ID and complete usage example.");
    }
    await writeFile(join(examples, `${entry.id}-example.tsx`), entry.usage + "\n");
  }
  await writeFile(join(scratch, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      target: "ES2022", lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext", moduleResolution: "Bundler", jsx: "react-jsx",
      strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true,
      noEmit: true, noUnusedLocals: true, noUnusedParameters: true,
      noUncheckedSideEffectImports: true, skipLibCheck: true, types: ["react", "node"],
    },
    include: ["examples/**/*.tsx"],
  }, null, 2));
  await run(process.execPath, [join(root, "node_modules", "typescript", "bin", "tsc"), "-p", join(scratch, "tsconfig.json")], { cwd: root });
  report.entries = ids;
  report.inventory = expected;
  report.status = "passed";
  console.log(`Verified ${ids.length} copied examples and all ${expected.length} priority mappings.`);
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.message : String(error);
  if (error && typeof error === "object" && "stdout" in error) process.stderr.write(String(error.stdout));
  console.error(report.error);
  process.exitCode = 1;
} finally {
  await server?.close();
  await rm(scratch, { recursive: true, force: true });
  report.scratchRemoved = true;
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
}
