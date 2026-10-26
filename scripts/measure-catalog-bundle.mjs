import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "apps/catalog/dist");
const manifest = JSON.parse(await readFile(join(output, ".vite/manifest.json"), "utf8"));
const entries = Object.entries(manifest);
const entry = entries.find(([, chunk]) => chunk.isEntry);
if (!entry) throw new Error("Catalog build has no entry chunk.");

function closure(key, found = new Set()) {
  if (found.has(key)) return found;
  const chunk = manifest[key];
  if (!chunk) throw new Error(`Manifest import is missing: ${key}`);
  found.add(key);
  for (const dependency of chunk.imports ?? []) closure(dependency, found);
  return found;
}
async function measure(keys) {
  const files = new Set();
  for (const key of keys) { files.add(manifest[key].file); for (const file of manifest[key].css ?? []) files.add(file); }
  const assets = await Promise.all([...files].map(async file => {
    const data = await readFile(join(output, file));
    return { file, bytes: data.length, gzipBytes: gzipSync(data).length };
  }));
  return { bytes: assets.reduce((sum, asset) => sum + asset.bytes, 0), gzipBytes: assets.reduce((sum, asset) => sum + asset.gzipBytes, 0), assets };
}
async function sourceModules(keys) {
  const sources = [];
  for (const key of keys) {
    const file = manifest[key].file;
    if (!file.endsWith(".js")) continue;
    const map = JSON.parse(await readFile(join(output, `${file}.map`), "utf8"));
    sources.push(...map.sources);
  }
  return [...new Set(sources)];
}
const initial = closure(entry[0]);
const catalog = entries.find(([key]) => /(?:^|\/)catalog\.tsx$/.test(key));
if (!catalog) throw new Error("Catalog must remain a separate lazy module.");
const catalogModules = closure(catalog[0]);
const deferred = entries.filter(([key, chunk]) => chunk.isDynamicEntry && /(?:reporting|rich-chat|auth|team-admin|notification-center|notification-preferences|persistent-feedback|document-library|media-preview|avatar-upload|website).*preview/.test(key));
for (const [key] of deferred) {
  if (initial.has(key) || catalogModules.has(key)) throw new Error(`${key} was pulled into the initial/catalog static import graph.`);
}
const sources = await sourceModules(new Set([...initial, ...catalogModules]));
const leaks = sources.filter(source => /node_modules\/(?:next|@supabase|react-markdown|remark-parse|remark-gfm|rehype-sanitize|recharts|d3-shape|d3-path)\//.test(source));
if (leaks.length) throw new Error(`Provider/framework or optional renderer entered the initial catalog graph: ${leaks.join(", ")}`);
const report = {
  initial: await measure(initial), catalog: await measure(catalogModules),
  deferred: await Promise.all(deferred.map(async ([key]) => ({ entry: key, ...await measure(closure(key)) }))),
  forbiddenInitialModules: leaks,
  note: "Totals include each view's static dependency closure and CSS; view totals overlap and must not be summed. Gzip is measured per asset. Network journeys separately check lazy requests.",
};
await mkdir(join(root, ".artifacts/admin-integration"), { recursive: true });
await writeFile(join(root, ".artifacts/admin-integration/catalog-bundle.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`Initial catalog host: ${report.initial.gzipBytes} bytes gzip. Catalog view: ${report.catalog.gzipBytes} bytes gzip. ${deferred.length} deferred workstream previews. No forbidden initial modules.`);
