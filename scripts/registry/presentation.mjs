import { stripVTControlCharacters } from "node:util";

const tones = { heading: 1, muted: 2, good: 32, warning: 33, bad: 31, accent: 36 };
const actions = {
  conflict: ["CONFLICT", "bad"], create: ["CREATE", "good"], update: ["UPDATE", "warning"],
  remove: ["REMOVE", "warning"], rollback: ["ROLLBACK", "warning"], adopt: ["BASELINE", "accent"],
  "preserve-reviewed": ["KEEP REVIEWED", "accent"], "local-modified": ["KEEP EDIT", "accent"], unchanged: ["KEEP", "muted"]
};
const titles = {
  discover: "Source discovery", list: "Available blocks", inspect: "Block details", build: "Registry snapshot",
  validate: "Registry validation", install: "Install blocks", upgrade: "Upgrade blocks", diff: "Upgrade comparison",
  recover: "Recover installation", view: "Local registry viewer", help: "Registry commands"
};

function clean(value, multiline = false) {
  let text = stripVTControlCharacters(String(value ?? ""));
  text = [...text].filter(character => {
    const code = character.codePointAt(0);
    return (code >= 32 || code === 9 || code === 10) && !(code >= 127 && code <= 159) &&
      ![0x200e, 0x200f].includes(code) && !(code >= 0x202a && code <= 0x202e) && !(code >= 0x2066 && code <= 0x2069);
  }).join("");
  return multiline ? text : text.replace(/[\n\t]+/g, " ");
}

function writer({ width = 80, color = false } = {}) {
  width = Number.isFinite(width) ? Math.max(1, Math.min(240, Math.floor(width))) : 80;
  const lines = [];
  function line(value = "", { indent = 0, tone, code = false } = {}) {
    const prefix = " ".repeat(Math.min(indent, Math.max(0, width - 8)));
    const capacity = Math.max(1, width - prefix.length);
    const source = clean(value, code).replace(/\t/g, "    ");
    for (const original of source.split("\n")) {
      let remaining = [...original];
      do {
        let cut = Math.min(capacity, remaining.length);
        if (!code && cut < remaining.length) {
          const space = remaining.lastIndexOf(" ", cut);
          if (space > capacity / 3) cut = space;
        }
        let segment = remaining.slice(0, cut).join("");
        remaining = remaining.slice(cut);
        if (!code) { segment = segment.trimEnd(); remaining = [...remaining.join("").trimStart()]; }
        const rendered = prefix + segment;
        lines.push(color && tones[tone] ? `\u001b[${tones[tone]}m${rendered}\u001b[0m` : rendered);
      } while (remaining.length);
    }
  }
  function field(label, value, indent = 2) {
    if (value === undefined || value === null || value === "") return;
    if (width >= 48 && clean(label).length <= 12) line(`${clean(label).padEnd(12)} ${clean(value)}`, { indent });
    else { line(`${clean(label)}:`, { indent, tone: "muted" }); line(value, { indent: indent + 2 }); }
  }
  function section(label) { line(); line(label, { tone: "heading" }); }
  return { line, field, section, finish: () => lines.join("\n").trimEnd() + "\n" };
}

const plural = (count, singular) => `${count} ${singular}${count === 1 ? "" : "s"}`;
const shortHash = value => value ? clean(value).slice(0, 12) : "absent";
const argument = value => /^[a-zA-Z0-9_./-]+$/.test(clean(value)) ? clean(value) : `'${clean(value).replace(/'/g, "'\\''")}'`;

function next(doc, text, command) {
  doc.section("Next");
  doc.line(text, { indent: 2 });
  if (command) doc.line(command, { indent: 2, tone: "accent" });
}

function blockList(doc, items, discovery = false) {
  doc.line(plural(items.length, "block"), { tone: "muted" });
  if (!items.length) { doc.line("No blocks available.", { indent: 2 }); return; }
  for (const item of items) {
    doc.section(`${item.name}  /  ${item.title ?? item.name}`);
    if (item.description) doc.line(item.description, { indent: 2 });
    doc.field("Inventory", (item.inventoryIds ?? []).join(", "));
    doc.field("Files", plural(item.files?.length ?? 0, "file"));
    if (!discovery) doc.field("Revision", shortHash(item.sourceRevision));
  }
}

function dependencies(doc, entries, includeSatisfied = false) {
  if (!entries?.length) return;
  const failures = entries.filter(entry => entry.status && entry.status !== "satisfied");
  doc.section("Dependencies");
  if (!includeSatisfied && failures.length === 0) {
    doc.line(`${plural(entries.length, "requirement")} satisfied.`, { indent: 2, tone: "good" });
    return;
  }
  if (failures.length) doc.line(`${failures.length} of ${entries.length} requirements block this operation.`, { indent: 2, tone: "bad" });
  for (const dependency of includeSatisfied ? entries : failures) {
    const status = dependency.status ? clean(dependency.status).toUpperCase() : "REQUIRED";
    doc.line(`${status}  ${dependency.name}`, { indent: 2, tone: dependency.status && dependency.status !== "satisfied" ? "bad" : "accent" });
    doc.field("Required", dependency.range, 4);
    if (dependency.status) {
      doc.field("Installed", dependency.installed ?? "not installed", 4);
      doc.field("Declared", dependency.declared ?? "not declared in package.json", 4);
    }
    doc.field("Source", dependency.distribution === "private" ? "local tarball or private registry" : "npm", 4);
    if (includeSatisfied) doc.field("License", dependency.license, 4);
  }
}

function fileExplanation(file) {
  if (file.status === "conflict") return file.resolvable ? "Local and incoming contents differ; review required." : "Existing unowned file is preserved; choose a free destination.";
  if (file.status === "local-modified") return file.localHash === null ? "Application deletion preserved." : "Application edits preserved.";
  if (file.status === "preserve-reviewed") return file.localHash === null ? "Reviewed application deletion retained; upstream baseline advances." : "Reviewed application contents retained; upstream baseline advances.";
  if (file.status === "adopt") return "Already matches incoming contents; record the new baseline.";
  if (file.status === "remove") return "Upstream removed this file; local contents match the baseline.";
  if (file.status === "update") return "Local contents match the baseline; incoming update is available.";
  if (file.status === "rollback") return "Restore the contents recorded before the interrupted operation.";
  if (file.status === "unchanged") return "No file write.";
  if (file.status === "create") return "New destination.";
  return `Unrecognized status: ${clean(file.status)}. Inspect --json before continuing.`;
}

function fileGroups(doc, files = []) {
  doc.section("Files");
  if (!files.length) { doc.line("No file actions.", { indent: 2 }); return; }
  const statuses = [...Object.keys(actions), ...new Set(files.map(file => file.status).filter(status => !Object.hasOwn(actions, status)))];
  for (const status of statuses) {
    const group = files.filter(file => file.status === status);
    if (!group.length) continue;
    const [label, tone] = Object.hasOwn(actions, status) ? actions[status] : ["REVIEW", "warning"];
    doc.line(`${label}  ${plural(group.length, "file")}`, { indent: 2, tone });
    for (const file of group) {
      doc.line(file.target, { indent: 4, tone: "heading" });
      doc.line(fileExplanation(file), { indent: 6, tone: "muted" });
      if (file.baselineHash !== undefined) doc.line(`base ${shortHash(file.baselineHash)}  local ${shortHash(file.localHash)}  next ${shortHash(file.incomingHash)}`, { indent: 6, tone: "muted" });
      else if (file.beforeHash !== undefined) doc.line(`before ${shortHash(file.beforeHash)}  local ${shortHash(file.localHash)}  after ${shortHash(file.afterHash)}`, { indent: 6, tone: "muted" });
    }
  }
}

function comparisons(doc, entries) {
  if (!entries) return;
  doc.section("Comparisons");
  if (!entries.length) { doc.line("No files to compare.", { indent: 2 }); return; }
  for (const entry of entries) {
    doc.section(entry.target);
    for (const [key, label] of [["local", "BASELINE -> APPLICATION"], ["upstream", "BASELINE -> INCOMING"]]) {
      doc.line(label, { indent: 2, tone: "accent" });
      const diff = clean(entry.diffs?.[key], true);
      if (!diff.trim()) { doc.line("No changes.", { indent: 4, tone: "muted" }); continue; }
      for (const line of diff.trimEnd().split("\n")) {
        if (line.startsWith("diff --git ") || line.startsWith("index ")) continue;
        const tone = line.startsWith("+") ? "good" : line.startsWith("-") ? "bad" : line.startsWith("@@") ? "accent" : undefined;
        doc.line(line, { indent: 4, tone, code: true });
      }
    }
  }
  doc.line("Use --json for exact contents and unwrapped diffs.", { tone: "muted" });
}

function plan(doc, result, command) {
  const mode = result.blocked ? ["BLOCKED", "No files changed.", "bad"] : command === "diff" ? ["REVIEW", "Comparison only; no files changed.", "accent"] : result.dryRun ? ["PREVIEW", "No files changed.", "accent"] : result.applied ? ["APPLIED", "Installed baselines recorded.", "good"] : ["NO CHANGES", "Files and baselines left as they are.", "muted"];
  doc.line(`${mode[0]}  ${mode[1]}`, { tone: mode[2] });
  doc.field("Consumer", result.consumer);
  doc.field("Blocks", (result.names ?? []).join(", "));
  if (result.issues?.length) {
    doc.section("Blockers");
    for (const issue of result.issues) doc.line(`- ${clean(issue)}`, { indent: 2, tone: "bad" });
  }
  dependencies(doc, result.dependencies);
  fileGroups(doc, result.files);
  comparisons(doc, result.comparisons);
  const names = (result.names ?? []).map(argument).join(" ");
  const destination = argument(result.consumer ?? "CONSUMER");
  const base = `npm run registry -- ${result.operation ?? "upgrade"} ${names} --registry BUNDLE_DIRECTORY --cwd ${destination}`;
  if (result.dependencies?.some(dependency => dependency.status !== "satisfied")) {
    next(doc, "Install or declare the listed dependencies in the consumer. Obtain private packages from local tarballs or your private registry. Repeat the original command with --dry-run, keeping any --dir or --accept-local option.");
  } else if (result.blocked && command !== "diff") {
    const conflicts = result.files?.filter(file => file.status === "conflict") ?? [];
    if (result.operation === "upgrade") next(doc, "Review the application and incoming changes before resolving conflicts.", `npm run registry -- diff ${names} --registry BUNDLE_DIRECTORY --cwd ${destination}`);
    else if (conflicts.some(file => !file.resolvable)) next(doc, "Preserve existing files and select a new --dir destination. Review the new dry run before installing.");
    else next(doc, "Resolve the blockers above, then repeat the original command with --dry-run. Keep any --dir option.");
  } else if (command === "diff") {
    doc.section("Review token");
    doc.line(result.reviewToken ?? "Unavailable", { indent: 2 });
    next(doc, result.blocked
      ? "Resolve the application files, then rerun diff. Use the new token with --accept-local only after reviewing the resulting contents. Dependency, ownership and shared-file blockers still need resolution."
      : "Review both comparisons, then preview the upgrade. Keep the registry snapshot and consumer paths the same.", result.blocked ? undefined : `${base} --dry-run`);
  } else if (result.dryRun) next(doc, "Review this plan, then repeat the same command without --dry-run. Keep any --dir or --accept-local option.");
  else if (result.applied) next(doc, "Review the application diff and commit the installed source with .evenkit/blocks.json.");
}

function recovery(doc, result) {
  const message = result.blocked ? "BLOCKED  Recovery needs review; files are preserved." : result.status === "no-transaction" ? "NOTHING TO RECOVER  No transaction journal found." : result.status === "committed" ? (result.dryRun ? "PREVIEW  Completed transaction; journal can be cleared." : "RECOVERED  Completed transaction journal cleared.") : result.status === "rolled-back" ? (result.dryRun ? "PREVIEW  Rollback plan; no files changed." : "RECOVERED  Interrupted writes rolled back.") : "REVIEW  Unrecognized recovery state; inspect --json.";
  doc.line(message, { tone: result.blocked ? "bad" : result.dryRun ? "accent" : "good" });
  doc.field("Consumer", result.consumer);
  fileGroups(doc, result.files);
  if (result.blocked) next(doc, "Preserve .evenkit/transaction.json and save your application edits. Review the recorded before/after contents before retrying recovery.");
  else if (result.dryRun && result.status !== "no-transaction") next(doc, "Review the rollback plan, then run recovery without --dry-run.", `npm run registry -- recover --cwd ${argument(result.consumer ?? "CONSUMER")}`);
}

export function renderResult(result, options = {}) {
  const command = options.command ?? result?.operation ?? (result?.type === "registry:block" ? "inspect" : result?.registered ? "discover" : result?.commands ? "help" : "result");
  const doc = writer(options);
  doc.line("Evenkit / Block registry", { tone: "accent" });
  doc.line(Object.hasOwn(titles, command) ? titles[command] : "Registry result", { tone: "heading" });
  doc.line();
  if (!result || typeof result !== "object") doc.line("No result available. Use --json to inspect the response.");
  else if (["install", "upgrade", "diff"].includes(command)) plan(doc, result, command);
  else if (command === "recover") recovery(doc, result);
  else if (command === "discover") {
    blockList(doc, result.registered ?? [], true);
    doc.section("Unregistered source");
    if (!result.unregistered?.length) doc.line("Every discovered source file has metadata.", { indent: 2, tone: "muted" });
    else { for (const path of result.unregistered) doc.line(path, { indent: 2 }); doc.line("These files are excluded from builds until their metadata is added.", { indent: 2, tone: "muted" }); }
    next(doc, "Build a local snapshot into a new directory.", "npm run registry -- build --output NEW_DIRECTORY");
  } else if (command === "list") {
    blockList(doc, result.items ?? []);
    next(doc, "Inspect a block before installing it.", "npm run registry -- inspect NAME --registry BUNDLE_DIRECTORY");
  } else if (command === "inspect") {
    const meta = result.meta?.evenkit ?? {};
    doc.line(`${result.name}  /  ${result.title ?? result.name}`, { tone: "heading" });
    doc.line(result.description ?? "");
    doc.field("Inventory", (meta.inventoryIds ?? []).join(", "));
    doc.field("Revision", meta.sourceRevision);
    doc.field("License", meta.license);
    doc.section("Files and destinations");
    for (const file of result.files ?? []) {
      const metadata = meta.files?.find(entry => entry.path === file.path && entry.target === file.target);
      doc.line(file.path, { indent: 2, tone: "heading" });
      doc.field("Destination", `<--dir>/${file.target}`, 4);
      doc.field("SHA-256", shortHash(metadata?.sha256), 4);
      doc.field("Revision", shortHash(metadata?.sourceRevision), 4);
    }
    dependencies(doc, meta.dependencies, true);
    next(doc, "Use --json to inspect exact source contents and full hashes. Preview installation in the consumer.", `npm run registry -- install ${argument(result.name)} --registry BUNDLE_DIRECTORY --cwd CONSUMER --dry-run`);
  } else if (["build", "validate", "view"].includes(command)) {
    doc.line(`${result.validated ? "VALIDATED" : "REVIEW REQUIRED"}  ${plural(result.items?.length ?? 0, "block")}`, { tone: result.validated ? "good" : "warning" });
    doc.field("Output", result.output);
    for (const name of result.items ?? []) doc.line(name, { indent: 2 });
    if (command === "view") next(doc, "Open the generated HTML file in your browser.");
    else if (command === "build") next(doc, "Inspect the snapshot's available blocks.", `npm run registry -- list --registry ${argument(result.output ?? "BUNDLE_DIRECTORY")}`);
  } else if (command === "help") {
    doc.line("Install editable block source and review changes before upgrading.");
    doc.section("Commands");
    for (const [name, usage] of Object.entries(result.commands ?? {})) { doc.line(name, { indent: 2, tone: "accent" }); doc.line(`npm run registry -- ${usage}`, { indent: 4 }); }
    doc.section("Output");
    doc.line("Use --format text for readable output or --json for exact machine-readable data.", { indent: 2 });
    doc.section("Exit codes");
    for (const [code, meaning] of Object.entries(result.exitCodes ?? {})) doc.field(code, meaning);
  } else doc.line("Result available. Use --json to inspect the exact response.");
  return doc.finish();
}

export function renderError(error, options = {}) {
  const doc = writer(options);
  doc.line("Evenkit / Block registry", { tone: "accent" });
  doc.line("ERROR  Operation failed", { tone: "bad" });
  doc.line();
  const message = clean(typeof error === "string" ? error : error?.message ?? error?.error ?? "The operation could not be completed.");
  if (Array.isArray(error?.issues) && error.issues.length) {
    for (const issue of error.issues) doc.line(`${issue.path?.join(".") || "Input"}: ${clean(issue.message)}`, { indent: 2 });
  } else doc.line(message, { indent: 2 });
  if (/transaction|journal|interrupted/i.test(message)) next(doc, "Preserve .evenkit/transaction.json and inspect recovery before retrying.", "npm run registry -- recover --cwd CONSUMER --dry-run");
  else if (/review token|after review/i.test(message)) next(doc, "Run diff again against the current consumer and incoming snapshot before accepting local contents.");
  else next(doc, "Check the command arguments and paths. Use --help for command syntax or --json for structured errors.");
  return doc.finish();
}
