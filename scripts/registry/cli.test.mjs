import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const cli = fileURLToPath(new URL("./cli.mjs", import.meta.url));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });

test("piped output remains JSON and text can be requested explicitly", () => {
  const json = run("--help");
  assert.equal(json.status, 0);
  assert.match(JSON.parse(json.stdout).commands.view, /NEW_HTML_FILE/);
  const text = run("--help", "--format", "text");
  assert.equal(text.status, 0);
  assert.match(text.stdout, /Evenkit/);
  assert.match(text.stdout, /view --registry/);
  assert.equal(text.stdout.includes(String.fromCharCode(27)), false);
});

test("strict parse failures honor explicit output preferences", () => {
  const text = run("--format=text", "--unknown-option");
  assert.equal(text.status, 1);
  assert.equal(text.stdout, "");
  assert.match(text.stderr, /Unknown option/);
  assert.throws(() => JSON.parse(text.stderr));
  const json = run("--json", "--unknown-option");
  assert.equal(json.status, 1);
  assert.match(JSON.parse(json.stderr).error, /Unknown option/);
});

test("invalid format combinations fail without writing stdout", () => {
  for (const args of [["--format", "xml"], ["--json", "--format", "text"]]) {
    const result = run("--help", ...args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.ok(JSON.parse(result.stderr).error);
  }
});
