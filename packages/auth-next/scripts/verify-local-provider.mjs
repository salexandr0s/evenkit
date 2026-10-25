import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

// Explicit opt-in: this script refuses hosted providers and never discovers account credentials.
const statusPath = process.env.EVENKIT_LOCAL_STATUS;
if (!statusPath) throw new Error("Set EVENKIT_LOCAL_STATUS to the JSON status file from the disposable local Supabase project.");
const status = JSON.parse(await readFile(statusPath, "utf8"));
const provider = new URL(status.API_URL);
if (provider.hostname !== "127.0.0.1" || provider.port !== "56321") throw new Error("This verification only permits the disposable provider at 127.0.0.1:56321.");
const root = fileURLToPath(new URL("../../../", import.meta.url));
const app = "http://127.0.0.1:5348";
const artifacts = resolve(root, ".artifacts/admin-auth");
await mkdir(artifacts, { recursive: true });
const report = { provider: "disposable local Supabase", checks: [], cleanup: false };
const userIds = [];
let child;
let browser;
let childClosed = false;
let logs = "";
const password = `Test-only-${randomUUID()}!`;
const id = randomUUID().slice(0, 8);
const allowedEmail = `evenkit-allowed-${id}@example.test`;
const deniedEmail = `evenkit-denied-${id}@example.test`;
const jar = new Map();
function record(name) { report.checks.push(name); console.log(`PASS ${name}`); }
function cookies(response) {
  for (const value of response.headers.getSetCookie()) {
    const first = value.split(";", 1)[0];
    const split = first.indexOf("=");
    const name = first.slice(0, split);
    if (/max-age=0/i.test(value)) jar.delete(name); else jar.set(name, first.slice(split + 1));
  }
}
async function request(path, options = {}) {
  const response = await fetch(new URL(path, app), { redirect: "manual", ...options, headers: { cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "), ...options.headers } });
  cookies(response);
  return response;
}
async function action(body, origin = app) {
  return request("/auth/action", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });
}
async function admin(path, method, body) {
  const response = await fetch(new URL(`/auth/v1/admin/${path}`, provider), { method, headers: { apikey: status.ANON_KEY, authorization: `Bearer ${status.SERVICE_ROLE_KEY}`, "content-type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
  if (!response.ok) throw new Error(`Disposable provider admin request failed: ${response.status}`);
  return response.status === 204 ? null : response.json();
}
async function recoveryCallback(email) {
  const response = await action({ action: "request-reset", email, returnTo: "/records" });
  assert.equal(response.status, 200);
  assert.ok([...jar.keys()].some(key => key.includes("code-verifier")));
  const mailOrigin = status.MAILPIT_URL ?? status.INBUCKET_URL ?? "http://127.0.0.1:56324";
  let messages = [];
  for (let count = 0; count < 30; count++) {
    const res = await fetch(`${mailOrigin}/api/v1/messages`);
    if (res.ok) {
      const inbox = await res.json();
      messages = (inbox.messages ?? []).filter(message => message.To?.some(recipient => recipient.Address === email));
    }
    if (messages.length) break;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  assert.ok(messages.length, "Recovery email was not captured by the disposable inbox.");
  const message = await (await fetch(`${mailOrigin}/api/v1/message/${messages[0].ID}`)).json();
  const text = message.Text || message.HTML || "";
  const match = text.match(/https?:\/\/[^\s"<>]+\/auth\/v1\/verify\?[^\s"<>]+/);
  assert.ok(match, "Recovery message did not contain a verification link.");
  const verification = await fetch(match[0].replaceAll("&amp;", "&"), { redirect: "manual" });
  const callback = verification.headers.get("location");
  assert.ok(callback?.startsWith(`${app}/auth/callback`));
  return callback;
}

try {
  for (const email of [allowedEmail, deniedEmail]) {
    const user = await admin("users", "POST", { email, password, email_confirm: true });
    assert.equal(typeof user.id, "string");
    userIds.push(user.id);
  }
  child = spawn(process.execPath, [resolve(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "5348"], {
    cwd: resolve(root, "apps/admin-starter"), stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", EVENKIT_AUTH_MODE: "supabase", SUPABASE_URL: provider.origin, SUPABASE_PUBLISHABLE_KEY: status.ANON_KEY, EVENKIT_APP_ORIGIN: app, EVENKIT_ALLOWED_USER_IDS: userIds[0], EVENKIT_ALLOW_SIGNUP: "false" },
  });
  child.once("close", () => { childClosed = true; });
  for (const stream of [child.stdout, child.stderr]) stream.on("data", chunk => { logs = (logs + chunk).slice(-16000); });
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (childClosed) throw new Error("Owned Next server exited before readiness.");
    try { if ((await fetch(`${app}/login`)).ok) break; } catch { /* Starting. */ }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  let response = await request("/records?workspace=studio");
  assert.ok([303, 307].includes(response.status));
  assert.match(response.headers.get("location"), /session-expired/);
  record("anonymous protected route requires recovery");
  response = await action({ action: "login", email: allowedEmail, password }, "https://foreign.invalid");
  assert.equal(response.status, 403);
  response = await action({ action: "signup", email: `signup-${id}@example.test`, password });
  assert.equal(response.status, 403);
  record("foreign Origin and closed signup policy rejected on server");
  response = await action({ action: "login", email: deniedEmail, password });
  assert.equal(response.status, 403);
  assert.equal((await request("/dashboard")).status, 307);
  record("verified nonmember denied and session removed");
  response = await action({ action: "login", email: allowedEmail, password, returnTo: "//evil.test" });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).redirect, "/dashboard");
  assert.ok([...jar.keys()].some(key => key.includes("auth-token")));
  response = await request("/dashboard");
  assert.equal(response.status, 200);
  assert.ok((await response.text()).includes(allowedEmail));
  record("real password login sets cookies and verifies eligibility during SSR");
  response = await request("/auth/sign-out", { method: "POST", headers: { origin: "https://foreign.invalid" } });
  assert.equal(response.status, 403);
  response = await request("/auth/sign-out", { method: "POST", headers: { origin: app } });
  assert.equal(response.status, 303);
  assert.equal([...jar.keys()].some(key => key.includes("auth-token")), false);
  response = await action({ action: "update-password", password });
  assert.equal(response.status, 401);
  record("real local sign-out clears cookies; expired recovery cannot update password");
  response = await request("/auth/callback?code=invalid&returnTo=https://evil.test");
  assert.equal(response.status, 303);
  assert.match(response.headers.get("location"), /^http:\/\/127.0.0.1:5348\/session-expired\?/);
  record("invalid callback stays on the configured origin");
  const callback = await recoveryCallback(allowedEmail);
  response = await request(callback);
  assert.equal(response.status, 303);
  assert.match(response.headers.get("location"), /\/reset-password\?returnTo=%2Frecords/);
  assert.equal((await request("/reset-password")).status, 200);
  const replacement = `Changed-${randomUUID()}!`;
  response = await action({ action: "update-password", password: replacement, returnTo: "/records" });
  assert.equal(response.status, 200);
  assert.match((await response.json()).redirect, /^\/login\?/);
  response = await action({ action: "login", email: allowedEmail, password: replacement });
  assert.equal(response.status, 200);
  record("real recovery email, PKCE callback, password update and new-password login");
  browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${app}/login?returnTo=%2Frecords`);
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(allowedEmail);
  await page.locator('input[name="password"]').fill(replacement);
  const monitorReady = page.waitForResponse(response => response.url().startsWith(`${provider.origin}/auth/v1/user`));
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL(`${app}/records`);
  await page.getByRole("heading", { name: "Records", exact: true }).waitFor();
  await monitorReady;
  await context.clearCookies();
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.waitForURL(/\/session-expired\?returnTo=%2Frecords/);
  record("Chromium provider login and focus-triggered session expiry clear the mounted admin");
  await browser.close();
  browser = undefined;
  const deniedCallback = new URL(await recoveryCallback(deniedEmail));
  deniedCallback.searchParams.delete("flow");
  response = await request(deniedCallback.href);
  assert.equal(response.status, 303);
  assert.equal(new URL(response.headers.get("location")).pathname, "/access-denied");
  assert.equal([...jar.keys()].some(key => key.includes("auth-token")), false);
  record("real PKCE callback rejects a verified nonmember and clears its session");
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error instanceof Error ? error.message : String(error);
  process.exitCode = 1;
  console.error(report.error);
} finally {
  await browser?.close();
  for (const userId of userIds) await admin(`users/${userId}`, "DELETE").catch(() => { report.cleanupError = "A fixture user could not be deleted."; });
  if (child && !childClosed) {
    child.kill("SIGTERM");
    for (let i = 0; i < 30 && !childClosed; i++) await new Promise(resolve => setTimeout(resolve, 100));
    if (!childClosed) child.kill("SIGKILL");
  }
  report.cleanup = (!child || childClosed) && !report.cleanupError;
  await writeFile(resolve(artifacts, "local-provider.json"), JSON.stringify(report, null, 2) + "\n");
  // Server output contains no credential values; defensively redact keys before saving.
  for (const secret of [status.ANON_KEY, status.SERVICE_ROLE_KEY, password]) if (secret) logs = logs.replaceAll(secret, "[redacted]");
  await writeFile(resolve(artifacts, "local-provider-server.log"), logs);
}
