import { execFile } from "node:child_process";
import { lstat, mkdir, open, readFile, readdir, realpath, rmdir, unlink } from "node:fs/promises";
import { dirname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import semver from "semver";
import ts from "typescript";
import { itemSchemaUrl, registrySchemaUrl, safeRelativePath, sha256, validateCatalog, validateMetadata } from "./catalog.mjs";

const execute = promisify(execFile);
const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

async function git(root, args) {
  const result = await execute("git", args, { cwd: root, encoding: "buffer", maxBuffer: 8 * 1024 * 1024 });
  return result.stdout;
}

async function regularFile(root, relative) {
  safeRelativePath(relative);
  const parts = relative.split("/");
  let current = root;
  for (let index = 0; index < parts.length; index++) {
    current = join(current, parts[index]);
    const info = await lstat(current);
    if (info.isSymbolicLink() || (index < parts.length - 1 ? !info.isDirectory() : !info.isFile())) {
      throw new Error(`Expected a regular source path without symlinks: ${relative}`);
    }
  }
  return current;
}

async function readMetadata(root) {
  const directory = join(root, "registry/metadata");
  const records = [];
  for (const filename of (await readdir(directory)).filter(file => file.endsWith(".json")).sort()) {
    const file = await regularFile(root, `registry/metadata/${filename}`);
    const metadata = validateMetadata(JSON.parse(await readFile(file, "utf8")));
    if (filename !== `${metadata.name}.json`) throw new Error(`Metadata filename must match its item name: ${filename}`);
    records.push(metadata);
  }
  if (records.length === 0) throw new Error("No registered block metadata found.");
  return records;
}

async function sourceFiles(root, directory = "registry/blocks") {
  const files = [];
  for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await sourceFiles(root, path));
    else files.push(path);
  }
  return files.sort();
}

export async function discoverBlocks(root = defaultRoot) {
  const records = await readMetadata(await realpath(root));
  const included = new Set(records.flatMap(record => record.files.map(file => file.path)));
  return {
    registered: records.map(({ name, title, inventoryIds, files }) => ({ name, title, inventoryIds, files })),
    unregistered: (await sourceFiles(root)).filter(file => !included.has(file))
  };
}

function importSpecifiers(file) {
  if (!/\.[cm]?[jt]sx?$/.test(file.path)) return [];
  const source = ts.createSourceFile(file.path, file.content, ts.ScriptTarget.Latest, true);
  if (source.parseDiagnostics.length > 0) throw new Error(`Cannot parse registered source: ${file.path}`);
  const imports = [];
  function add(node) {
    if (!node || !ts.isStringLiteralLike(node)) throw new Error(`Computed module imports are unsupported in ${file.path}.`);
    imports.push(node.text);
  }
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) add(node.moduleSpecifier);
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) add(node.moduleReference.expression);
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) add(node.argument.literal);
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))) add(node.arguments[0]);
    ts.forEachChild(node, visit);
  }
  visit(source);
  return imports;
}

function resolveImport(files, file, specifier, field) {
  const base = posix.normalize(posix.join(posix.dirname(file[field]), specifier));
  const candidates = new Set([base]);
  for (const extension of [".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts", ".json", ".css"]) {
    candidates.add(`${base}${extension}`);
    candidates.add(`${base}/index${extension}`);
  }
  if (/\.[cm]?js$/.test(base)) {
    candidates.add(base.replace(/js$/, "ts"));
    candidates.add(base.replace(/js$/, "tsx"));
  }
  const matches = files.filter(candidate => candidates.has(candidate[field]));
  if (matches.length !== 1) throw new Error(`Missing or ambiguous local import ${specifier} from ${file[field]}. Include its file and preserve the relative layout.`);
  return matches[0];
}

function auditImports(files, dependencies) {
  const declared = new Set(dependencies.map(dependency => dependency.name));
  for (const file of files) {
    for (const specifier of importSpecifiers(file)) {
      if (specifier.startsWith(".")) {
        if (specifier.includes("\\") || /[?#]/.test(specifier)) throw new Error(`Unsupported relative import in ${file.path}: ${specifier}`);
        const source = resolveImport(files, file, specifier, "path");
        const target = resolveImport(files, file, specifier, "target");
        if (source !== target) throw new Error(`Destination layout changes the import ${specifier} from ${file.path}.`);
      } else {
        const packageName = specifier.split("/").slice(0, specifier.startsWith("@") ? 2 : 1).join("/");
        if (!declared.has(packageName)) throw new Error(`Undeclared dependency ${packageName} imported by ${file.path}.`);
      }
    }
  }
}

async function buildItem(root, record, sourceRevision) {
  const files = [];
  const hashes = [];
  for (const location of record.files) {
    const sourcePath = await regularFile(root, location.path);
    const bytes = await readFile(sourcePath);
    const committed = await git(root, ["cat-file", "blob", `${sourceRevision}:${location.path}`]);
    if (!bytes.equals(committed)) throw new Error(`Registered source differs from committed revision ${sourceRevision}: ${location.path}`);
    const content = bytes.toString("utf8");
    if (!Buffer.from(content, "utf8").equals(bytes)) throw new Error(`Registered source must be UTF-8 text: ${location.path}`);
    const fileRevision = (await git(root, ["log", "-1", "--format=%H", sourceRevision, "--", location.path])).toString("utf8").trim();
    files.push({ ...location, type: "registry:file", content });
    hashes.push({ ...location, sha256: sha256(bytes), sourceRevision: fileRevision });
  }
  auditImports(files, record.dependencies);
  for (const dependency of record.dependencies.filter(value => value.name.startsWith("@evenkit/"))) {
    const path = `packages/${dependency.name.slice("@evenkit/".length)}/package.json`;
    const manifest = JSON.parse(await readFile(await regularFile(root, path), "utf8"));
    if (manifest.name !== dependency.name || !semver.satisfies(manifest.version, dependency.range)) {
      throw new Error(`Metadata dependency ${dependency.name}@${dependency.range} does not match the package source.`);
    }
  }
  return {
    $schema: itemSchemaUrl, name: record.name, type: "registry:block", title: record.title,
    description: record.description,
    dependencies: record.dependencies.map(dependency => `${dependency.name}@${dependency.range}`), files,
    meta: { evenkit: {
      formatVersion: 1, sourceRevision, license: record.license, inventoryIds: record.inventoryIds,
      dependencies: record.dependencies, files: hashes
    } }
  };
}

export async function buildRegistry({ root = defaultRoot, output } = {}) {
  if (typeof output !== "string" || output.length === 0) throw new Error("Provide a new output directory.");
  root = await realpath(root);
  output = resolve(output);
  const sourceRevision = (await git(root, ["rev-parse", "HEAD"])).toString("utf8").trim();
  const records = await readMetadata(root);
  const items = [];
  for (const record of records) items.push(await buildItem(root, record, sourceRevision));
  const catalog = validateCatalog({
    $schema: registrySchemaUrl, name: "evenkit", homepage: "https://github.com/salexandr0s/evenkit", items
  });
  await mkdir(dirname(output), { recursive: true });
  // Exclusive directory creation prevents builds from replacing earlier snapshots.
  await mkdir(output);
  const written = [];
  try {
    for (const [filename, value] of [["registry.json", catalog], ...items.map(item => [`${item.name}.json`, item])]) {
      const path = join(output, filename);
      const handle = await open(path, "wx");
      written.push(path);
      try { await handle.writeFile(JSON.stringify(value, null, 2) + "\n"); }
      finally { await handle.close(); }
    }
  } catch (error) {
    const failures = [];
    for (const path of written.reverse()) {
      try { await unlink(path); } catch (cleanupError) { failures.push(cleanupError); }
    }
    try { await rmdir(output); } catch (cleanupError) { failures.push(cleanupError); }
    if (failures.length) throw new AggregateError([error, ...failures], `Registry build failed; inspect partial output at ${output}.`, { cause: error });
    throw error;
  }
  return catalog;
}
