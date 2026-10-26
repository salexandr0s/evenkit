#!/usr/bin/env node
import { parseArgs } from "node:util";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildRegistry, discoverBlocks } from "./build.mjs";
import { loadRegistry } from "./catalog.mjs";
import { applyPlan, comparePlan, planInstallation, recoverInstallation } from "./installer.mjs";
import { renderError, renderResult } from "./presentation.mjs";
import { createViewer } from "./viewer.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const help = {
  commands: {
    discover: "discover [--root repository]",
    build: "build --output NEW_DIRECTORY [--root repository]",
    validate: "validate --registry BUNDLE_DIRECTORY",
    list: "list --registry BUNDLE_DIRECTORY",
    inspect: "inspect NAME --registry BUNDLE_DIRECTORY",
    view: "view --registry BUNDLE_DIRECTORY --output NEW_HTML_FILE",
    install: "install NAME... --registry BUNDLE_DIRECTORY --cwd CONSUMER [--dir src/blocks] [--dry-run]",
    diff: "diff NAME... --registry NEW_BUNDLE_DIRECTORY --cwd CONSUMER",
    upgrade: "upgrade NAME... --registry NEW_BUNDLE_DIRECTORY --cwd CONSUMER [--dry-run] [--accept-local REVIEW_TOKEN]",
    recover: "recover --cwd CONSUMER [--dry-run]"
  },
  exitCodes: { 0: "success", 1: "invalid input or operation failed", 2: "blocked by dependencies or conflicts" },
  output: "Readable text in a terminal; JSON when piped. Override with --format text, --format json or --json."
};

const allowed = {
  discover: ["root"], build: ["root", "output"], validate: ["registry"], list: ["registry"], inspect: ["registry"],
  view: ["registry", "output"],
  install: ["registry", "cwd", "dir", "dry-run"], diff: ["registry", "cwd"],
  upgrade: ["registry", "cwd", "dry-run", "accept-local"], recover: ["cwd", "dry-run"]
};
const presentation = { command: "help", values: {}, format: process.stdout.isTTY ? "text" : "json" };
// Honor output preferences even when strict argument parsing rejects the input.
const outputArgs = process.argv.slice(2, process.argv.indexOf("--") === -1 ? undefined : process.argv.indexOf("--"));
for (const [index, argument] of outputArgs.entries()) {
  const format = argument === "--format" ? outputArgs[index + 1] : argument.startsWith("--format=") ? argument.slice(9) : undefined;
  if (["text", "json"].includes(format)) presentation.format = format;
}
if (outputArgs.includes("--json")) presentation.format = "json";

async function main() {
  const { positionals, values } = parseArgs({
    allowPositionals: true, strict: true,
    options: Object.fromEntries(["root", "output", "registry", "cwd", "dir", "accept-local", "dry-run", "help", "format", "json"].map(name => [name, { type: ["dry-run", "help", "json"].includes(name) ? "boolean" : "string" }]))
  });
  const [command, ...names] = positionals;
  presentation.command = values.help || !command ? "help" : command;
  presentation.values = values;
  if (values.json) presentation.format = "json";
  else if (["text", "json"].includes(values.format)) presentation.format = values.format;
  if (values.format && !["text", "json"].includes(values.format)) throw new Error("--format must be text or json.");
  if (values.json && values.format && values.format !== "json") throw new Error("Use either --json or --format text, not both.");
  if (values.help || !command) return help;
  if (!Object.hasOwn(allowed, command)) throw new Error(`Unknown command: ${command}`);
  for (const key of Object.keys(values)) if (![...allowed[command], "format", "json"].includes(key)) throw new Error(`Option --${key} is not supported by ${command}.`);
  const noNames = ["discover", "build", "validate", "list", "recover", "view"].includes(command);
  if ((noNames && names.length) || (!noNames && !names.length) || (command === "inspect" && names.length !== 1)) throw new Error(`Usage: ${help.commands[command]}`);
  const requireOption = name => {
    if (!values[name]?.trim()) throw new Error(`--${name} is required. Usage: ${help.commands[command]}`);
    return values[name];
  };
  if (command === "discover") return discoverBlocks(values.root ?? root);
  if (command === "build") {
    const output = requireOption("output");
    const catalog = await buildRegistry({ root: values.root ?? root, output });
    return { output: resolve(output), items: catalog.items.map(item => item.name), validated: true };
  }
  if (command === "recover") return recoverInstallation({ cwd: requireOption("cwd"), dryRun: values["dry-run"] });
  const registry = requireOption("registry");
  if (command === "view") return createViewer({ registry, output: requireOption("output") });
  if (["validate", "list", "inspect"].includes(command)) {
    const catalog = await loadRegistry(registry);
    if (command === "validate") return { validated: true, items: catalog.items.map(item => item.name) };
    if (command === "list") return { name: catalog.name, items: catalog.items.map(({ name, title, description, meta }) => ({ name, title, description, ...meta.evenkit })) };
    const item = catalog.items.find(item => item.name === names[0]);
    if (!item) throw new Error(`Unknown block: ${names[0]}`);
    return item;
  }
  const plan = await planInstallation({ operation: command === "diff" ? "upgrade" : command, names, registry, cwd: requireOption("cwd"), directory: values.dir, acceptLocal: values["accept-local"] });
  if (command === "diff") return comparePlan(plan);
  if (plan.blocked || values["dry-run"]) return { ...plan, dryRun: Boolean(values["dry-run"]), applied: false };
  return applyPlan(plan);
}

try {
  const result = await main();
  const textResult = presentation.command === "recover" ? { ...result, dryRun: Boolean(presentation.values["dry-run"]), consumer: resolve(presentation.values.cwd) } : result;
  console.log(presentation.format === "json" ? JSON.stringify(result, null, 2) : renderResult(textResult, { command: presentation.command, width: process.stdout.columns ?? 80, color: Boolean(process.stdout.isTTY) && !Object.hasOwn(process.env, "NO_COLOR") && process.env.TERM !== "dumb" }));
  if (result.blocked) process.exitCode = 2;
} catch (error) {
  console.error(presentation.format === "json" ? JSON.stringify({ error: error.message }, null, 2) : renderError(error, { width: process.stderr.columns ?? 80, color: Boolean(process.stderr.isTTY) && !Object.hasOwn(process.env, "NO_COLOR") && process.env.TERM !== "dumb" }));
  process.exitCode = 1;
}
