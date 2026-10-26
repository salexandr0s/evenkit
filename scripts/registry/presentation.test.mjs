import assert from "node:assert/strict";
import test from "node:test";
import { stripVTControlCharacters } from "node:util";
import { renderError, renderResult } from "./presentation.mjs";

const hash = "a".repeat(64);
const revision = "b".repeat(40);
const example = {
  name: "demo", title: "Demo block", description: "Editable source for a test consumer.", type: "registry:block",
  files: [{ path: "registry/blocks/demo.tsx", target: "demo.tsx", content: "SOURCE_CONTENT_MUST_STAY_OUT_OF_INSPECT" }],
  meta: { evenkit: {
    inventoryIds: ["R05"], sourceRevision: revision, license: "UNLICENSED",
    files: [{ path: "registry/blocks/demo.tsx", target: "demo.tsx", sourceRevision: revision, sha256: hash }],
    dependencies: [{ name: "@evenkit/ui", range: "0.1.0", distribution: "private", license: "UNLICENSED" }]
  } }
};
const plan = {
  operation: "upgrade", consumer: "/tmp/consumer", names: ["demo"], blocked: false, issues: [], dependencies: [],
  reviewToken: hash, files: []
};

function assertSafe(text) {
  for (const character of text) {
    const code = character.codePointAt(0);
    assert(code === 10 || code >= 32 && !(code >= 127 && code <= 159), `Unexpected control code ${code}.`);
  }
}

test("inspect presents provenance and private requirements without exposing full source", () => {
  const before = structuredClone(example);
  const text = renderResult(example, { command: "inspect" });
  for (const expected of ["Evenkit", "Block details", "registry/blocks/demo.tsx", "Destination", "demo.tsx", "SHA-256", hash.slice(0, 12), revision, "@evenkit/ui", "0.1.0", "local tarball or private registry", "--json", "--dry-run"]) assert(text.includes(expected), expected);
  assert(!text.includes(example.files[0].content));
  assert(!text.includes(hash));
  assert.deepEqual(example, before);
});

test("blocked plans show failed dependencies and distinguish conflicts, edits and baseline adoption", () => {
  const text = renderResult({ ...plan, blocked: true, dependencies: [
    { name: "@evenkit/ui", range: "0.1.0", distribution: "private", status: "missing", declared: "file:../ui.tgz", installed: null },
    { name: "react", range: "^19.0.0", distribution: "npm", status: "incompatible", declared: "^18.0.0", installed: "18.3.0" }
  ], files: [
    { target: "src/blocks/conflict.tsx", status: "conflict", resolvable: true },
    { target: "src/blocks/edited.tsx", status: "local-modified", localHash: hash },
    { target: "src/blocks/deleted.tsx", status: "local-modified", localHash: null },
    { target: "src/blocks/adopted.tsx", status: "adopt" }
  ] }, { command: "upgrade" });
  for (const expected of ["BLOCKED", "No files changed", "MISSING", "not installed", "INCOMPATIBLE", "18.3.0", "^19.0.0", "CONFLICT", "KEEP EDIT", "Application deletion preserved", "BASELINE", "keeping any --dir"]) assert(text.includes(expected), expected);
  assert(!text.includes("APPLIED"));
  assert(!text.includes("npm install @evenkit"));
});

test("previews, applied operations, no-ops and recovery cannot be mistaken for each other", () => {
  assert.match(renderResult({ ...plan, dryRun: true }, { command: "upgrade" }), /PREVIEW.*No files changed/);
  assert.match(renderResult({ ...plan, applied: true }, { command: "upgrade" }), /APPLIED.*baselines recorded/);
  assert.match(renderResult({ ...plan, applied: false }, { command: "upgrade" }), /NO CHANGES/);
  const recovery = { operation: "recover", status: "rolled-back", files: [], blocked: false };
  assert.match(renderResult({ ...recovery, dryRun: true }), /PREVIEW.*no files changed/);
  assert.match(renderResult(recovery), /RECOVERED.*rolled back/);
  assert.match(renderResult({ ...recovery, status: "no-transaction" }), /NOTHING TO RECOVER/);
  assert.match(renderResult({ ...plan, dryRun: true, files: [{ target: "demo.tsx", status: "__proto__" }] }), /Unrecognized status: __proto__/);
});

test("diff output preserves unified changes while removing terminal control sequences", () => {
  const diff = "diff --git a/0-local.before b/0-local.after\nindex abc..def 100644\n--- a/0-local.before\n+++ b/0-local.after\n@@ -1 +1 @@\n-before\n+after\tvalue\u001b[2J\u001b]52;c;clipboard\u0007\n";
  const result = { ...plan, comparisons: [{ target: "demo.tsx", diffs: { local: diff, upstream: "" }, baseline: "DO_NOT_PRINT_BASELINE", incoming: "DO_NOT_PRINT_INCOMING" }] };
  const text = renderResult(result, { command: "diff", width: 80 });
  for (const expected of ["REVIEW", "Comparison only", "BASELINE -> APPLICATION", "BASELINE -> INCOMING", "@@ -1 +1 @@", "-before", "+after    value", "No changes", hash, "--dry-run"]) assert(text.includes(expected), expected);
  assertSafe(text);
  assert(!text.includes("clipboard"));
  assert(!text.includes("DO_NOT_PRINT"));
});

test("small widths wrap long paths and errors without emitting attacker formatting", () => {
  const hostile = "\u001b[31m\u001b]8;;https://example.invalid\u0007danger\u001b]8;;\u0007\b\r\u009b\u202efile.tsx";
  const input = { ...plan, dryRun: true, consumer: `/tmp/${"long-path-".repeat(12)}`, files: [{ target: hostile, status: "create", incomingHash: hash, localHash: null, baselineHash: null }] };
  for (const width of [1, 16, 28, 40]) {
    for (const text of [renderResult(input, { width }), renderError(new Error(hostile), { width })]) {
      assertSafe(text);
      assert(text.split("\n").every(line => line.length <= width));
      assert(!text.includes("\u202e"));
    }
  }
  const plain = renderResult(input, { width: 40 });
  const colored = renderResult(input, { width: 40, color: true });
  assert(colored.includes("\u001b["));
  assert.equal(stripVTControlCharacters(colored), plain);
  assert(renderError("Folder \u{1f4c1} unavailable", { width: 1 }).includes("\u{1f4c1}"));
});

test("catalog, discovery, help and viewer summaries remain useful when empty", () => {
  assert.match(renderResult({ registered: [], unregistered: ["registry/blocks/unfinished.tsx"] }, { command: "discover" }), /excluded from builds/);
  assert.match(renderResult({ items: [] }, { command: "list" }), /No blocks available/);
  assert.match(renderResult({ output: "/tmp/view.html", items: [], validated: true }, { command: "view" }), /Open the generated HTML/);
  assert.match(renderResult({ validated: true, items: ["demo"] }, { command: "validate" }), /VALIDATED.*1 block/);
  assert.match(renderResult({ commands: { inspect: "inspect NAME --registry BUNDLE_DIRECTORY" }, exitCodes: { 2: "blocked" } }), /--format text/);
  assert.match(renderError({ issues: [{ path: ["files", 0, "target"], message: "Unsafe path" }] }), /files.0.target: Unsafe path/);
  assert.match(renderError(new Error("Interrupted transaction needs review")), /recover --cwd CONSUMER --dry-run/);
});
