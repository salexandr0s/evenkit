import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import Ajv from "ajv";
import semver from "semver";
import { z } from "zod";

export const registrySchemaUrl = "https://ui.shadcn.com/schema/registry.json";
export const itemSchemaUrl = "https://ui.shadcn.com/schema/registry-item.json";
export const sha256 = value => createHash("sha256").update(value).digest("hex");

export function safeRelativePath(value) {
  if (typeof value !== "string" || value.length === 0 || value.length > 240) {
    throw new Error("A path must be a nonempty relative path of at most 240 characters.");
  }
  for (const part of value.split("/")) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(part) || part.endsWith(".") ||
        ["node_modules", ".evenkit", ".git"].includes(part.toLowerCase()) ||
        /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part)) {
      throw new Error(`Unsafe relative path: ${JSON.stringify(value)}`);
    }
  }
  return value;
}

const relativePath = z.string().superRefine((value, context) => {
  try { safeRelativePath(value); }
  catch (error) { context.addIssue({ code: "custom", message: error.message }); }
});
const revision = z.string().regex(/^[a-f0-9]{40}$/);
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const name = z.string().max(80).regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
const license = z.string().min(1).max(120);
export const dependencySchema = z.strictObject({
  name: z.string().max(214).regex(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/),
  range: z.string().min(1).max(120).refine(value => semver.validRange(value) !== null, "Expected a semver range."),
  distribution: z.enum(["private", "npm"]),
  license
});
const fileLocation = { path: relativePath, target: relativePath };
export const metadataSchema = z.strictObject({
  $schema: z.literal("../schema/block-metadata.json").optional(),
  formatVersion: z.literal(1), name, title: z.string().min(1).max(120),
  description: z.string().min(1).max(2_000),
  inventoryIds: z.array(z.string().regex(/^[A-Z][0-9]{2}$/)).min(1).max(50),
  license: z.literal("UNLICENSED"),
  dependencies: z.array(dependencySchema).max(100),
  files: z.array(z.strictObject(fileLocation)).min(1).max(256)
});
const fileMetadata = z.strictObject({ ...fileLocation, sha256: digest, sourceRevision: revision });
const fileSchema = z.strictObject({ ...fileLocation, type: z.literal("registry:file"), content: z.string().max(2_000_000) });
const itemSchema = z.strictObject({
  $schema: z.literal(itemSchemaUrl), name, type: z.literal("registry:block"),
  title: z.string().min(1).max(120), description: z.string().min(1).max(2_000),
  dependencies: z.array(z.string()).max(100),
  files: z.array(fileSchema).min(1).max(256),
  meta: z.strictObject({ evenkit: z.strictObject({
    formatVersion: z.literal(1), sourceRevision: revision, license: z.literal("UNLICENSED"),
    inventoryIds: z.array(z.string().regex(/^[A-Z][0-9]{2}$/)).min(1).max(50),
    dependencies: z.array(dependencySchema).max(100), files: z.array(fileMetadata).min(1).max(256)
  }) })
});
const catalogSchema = z.strictObject({
  $schema: z.literal(registrySchemaUrl), name: z.literal("evenkit"),
  homepage: z.url(), items: z.array(itemSchema).min(1).max(500)
});

let validators;
function officialValidators() {
  if (!validators) {
    // The upstream schemas allow JSON Schema constructs outside Ajv strict mode.
    // The strict Zod profile below separately limits what this installer accepts.
    const ajv = new Ajv({ allErrors: true, strict: false });
    ajv.addMetaSchema({ $ref: "http://json-schema.org/draft-07/schema#" }, "https://json-schema.org/draft-07/schema#");
    const item = JSON.parse(readFileSync(new URL("../../registry/schema/registry-item.json", import.meta.url), "utf8"));
    const catalog = JSON.parse(readFileSync(new URL("../../registry/schema/registry.json", import.meta.url), "utf8"));
    ajv.addSchema(item, itemSchemaUrl);
    validators = { item: ajv.getSchema(itemSchemaUrl), catalog: ajv.compile(catalog), ajv };
  }
  return validators;
}

function assertUnique(values, label) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}.`);
}

export function validateMetadata(value) {
  const metadata = metadataSchema.parse(value);
  validateLocations(metadata.files, metadata.name);
  validateDependencies(metadata.dependencies, metadata.name);
  assertUnique(metadata.inventoryIds, `inventory ID in ${metadata.name}`);
  for (const file of metadata.files) {
    if (!file.path.startsWith("registry/blocks/")) throw new Error(`Source must be inside registry/blocks/: ${file.path}`);
  }
  return metadata;
}

function validateDependencies(dependencies, label) {
  assertUnique(dependencies.map(dependency => dependency.name), `dependency in ${label}`);
  for (const dependency of dependencies) {
    if (dependency.name.startsWith("@evenkit/") && dependency.distribution !== "private") {
      throw new Error(`Evenkit packages require private distribution: ${dependency.name}`);
    }
  }
}

function validateLocations(files, label) {
  assertUnique(files.map(file => file.path.toLowerCase()), `source path in ${label}`);
  const targets = files.map(file => file.target.toLowerCase()).sort();
  assertUnique(targets, `destination in ${label}`);
  assertNoPathPrefixes(targets, label);
}

function assertNoPathPrefixes(targets, label) {
  const destinations = new Set(targets);
  for (const target of targets) {
    const parts = target.split("/");
    for (let index = 1; index < parts.length; index++) {
      if (destinations.has(parts.slice(0, index).join("/"))) throw new Error(`File/directory destination collision in ${label}.`);
    }
  }
}

export function validateCatalog(value) {
  const official = officialValidators();
  if (!official.catalog(value)) throw new Error(`shadcn registry schema: ${official.ajv.errorsText(official.catalog.errors)}`);
  const catalog = catalogSchema.parse(value);
  assertUnique(catalog.items.map(item => item.name), "registry item name");
  const destinations = new Map();
  for (const item of catalog.items) {
    if (!official.item(item)) throw new Error(`shadcn item schema (${item.name}): ${official.ajv.errorsText(official.item.errors)}`);
    const metadata = item.meta.evenkit;
    validateLocations(item.files, item.name);
    validateLocations(metadata.files, `${item.name} metadata`);
    validateDependencies(metadata.dependencies, item.name);
    assertUnique(metadata.inventoryIds, `inventory ID in ${item.name}`);
    const expectedDependencies = metadata.dependencies.map(dependency => `${dependency.name}@${dependency.range}`).sort();
    if (JSON.stringify([...item.dependencies].sort()) !== JSON.stringify(expectedDependencies)) {
      throw new Error(`Dependency metadata disagrees with shadcn dependencies: ${item.name}`);
    }
    if (item.files.length !== metadata.files.length) throw new Error(`Incomplete file metadata: ${item.name}`);
    for (const file of item.files) {
      const entry = metadata.files.find(candidate => candidate.path === file.path && candidate.target === file.target);
      if (!entry || entry.sha256 !== sha256(file.content)) throw new Error(`Hash or file metadata mismatch: ${item.name}/${file.path}`);
      if (!file.path.startsWith("registry/blocks/")) throw new Error(`Source must be inside registry/blocks/: ${file.path}`);
      const previous = destinations.get(file.target.toLowerCase());
      if (previous && (previous.path !== file.path || previous.target !== file.target || previous.sha256 !== entry.sha256 || previous.sourceRevision !== entry.sourceRevision)) {
        throw new Error(`Conflicting shared destination: ${file.target}`);
      }
      destinations.set(file.target.toLowerCase(), entry);
    }
  }
  assertNoPathPrefixes([...destinations.keys()], "registry items");
  return catalog;
}

export async function loadRegistry(directory) {
  const path = join(directory, "registry.json");
  if ((await stat(path)).size > 32 * 1024 * 1024) throw new Error("Registry exceeds the 32 MiB input limit.");
  return validateCatalog(JSON.parse(await readFile(path, "utf8")));
}
