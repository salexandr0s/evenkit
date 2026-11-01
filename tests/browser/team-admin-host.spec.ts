import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import react from "@vitejs/plugin-react";
import { build } from "vite";

let script = "";
let styles = "";
test.beforeAll(async () => {
  const result = await build({ configFile: false, logLevel: "error", plugins: [react()], define: { "process.env.NODE_ENV": '"production"' },
    resolve: { alias: [{ find: /^@evenkit\/ui$/, replacement: fileURLToPath(new URL("../../packages/ui/src/index.ts", import.meta.url)) }] },
    build: { write: false, lib: { entry: fileURLToPath(new URL("../fixtures/team-admin-host.tsx", import.meta.url)), formats: ["iife"], name: "TeamAdminHost" } } });
  const scripts: string[] = [];
  const sheets: string[] = [];
  for (const bundle of Array.isArray(result) ? result : [result]) {
    if (!("output" in bundle)) throw new Error("The team host build did not return assets.");
    for (const file of bundle.output) {
      if (file.type === "chunk") scripts.push(file.code);
      else if (file.fileName.endsWith(".css")) sheets.push(typeof file.source === "string" ? file.source : Buffer.from(file.source).toString("utf8"));
    }
  }
  if (scripts.length !== 1 || sheets.length === 0) throw new Error("The team host needs one script and its styles.");
  script = scripts.join("\n"); styles = sheets.join("\n");
});
test.beforeEach(async ({ page }) => {
  await page.route(/\/team-admin-host-test(?:\?.*)?$/, route => route.fulfill({ contentType: "text/html", body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Team administration host</title><link rel="stylesheet" href="/team-admin-host-test/styles.css"></head><body><div id="root"></div><script src="/team-admin-host-test/script.js"></script></body></html>' }));
  await page.route("**/team-admin-host-test/script.js", route => route.fulfill({ contentType: "text/javascript", body: script }));
  await page.route("**/team-admin-host-test/styles.css", route => route.fulfill({ contentType: "text/css", body: styles }));
});
async function open(page: Page, surface: "acceptance" | "role" | "audit" | "members") {
  await page.goto(`/team-admin-host-test?surface=${surface}`);
  await expect(page.getByRole("heading", { name: "Team administration host", exact: true })).toBeVisible();
  await page.waitForFunction(() => Boolean(window.teamTestHost));
}

test("native invitation submission respects blocked outcomes while allowing failure retry", async ({ page }) => {
  for (const status of ["denied", "stale", "error"] as const) {
    await open(page, "members");
    await page.getByRole("button", { name: "Invite member", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Invite a member", exact: true });
    await dialog.getByRole("textbox", { name: "Email address", exact: true }).fill("new@example.test");
    await dialog.getByRole("combobox", { name: "Invitation role", exact: true }).click();
    await page.getByRole("option", { name: "Archive reviewers", exact: true }).click();
    await dialog.getByRole("button", { name: "Send invitation", exact: true }).click();
    await page.evaluate(result => window.teamTestHost.resolve(result), { status, message: "Review current access." });
    await expect(dialog.getByText("Review current access.", { exact: true })).toBeVisible();
    const email = dialog.getByRole("textbox", { name: "Email address", exact: true });
    if (status === "error") await expect(email).toBeEnabled();
    else await expect(email).toBeDisabled();
    await dialog.getByRole("form", { name: "Invite a member", exact: true }).evaluate(form => (form as HTMLFormElement).requestSubmit());
    await expect(page.getByLabel("Host requests")).toHaveText(status === "error" ? "2" : "1");
    if (status !== "error") await expect(dialog.getByText("Review current access.", { exact: true })).toBeVisible();
  }
});

// A host may finish after cancellation, or while the account and record are replaced.
test("acceptance suppresses duplicate requests and ignores late cancelled or stale replies", async ({ page }) => {
  await open(page, "acceptance");
  const accept = page.getByRole("button", { name: "Accept invitation", exact: true });
  await accept.evaluate(button => { if (!(button instanceof HTMLButtonElement)) throw new Error("Expected acceptance button."); button.click(); button.click(); });
  await expect(page.getByLabel("Host requests")).toHaveText("1");
  await expect(page.getByLabel("Submitted value")).toHaveText(JSON.stringify({ invitationId: "invite-a", revision: "1" }));
  await expect(page.getByRole("button", { name: "Stop waiting", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Stop waiting", exact: true }).click();
  await page.evaluate(() => window.teamTestHost.resolve({ status: "success", message: "Late acceptance" }));
  await expect(page.getByRole("heading", { name: "Invitation accepted", exact: true })).toHaveCount(0);
  await expect(accept).toHaveCount(0);
  await page.getByRole("button", { name: "Reload invitation", exact: true }).click();
  await accept.click();
  await page.evaluate(() => window.teamTestHost.changeContext());
  await page.evaluate(() => window.teamTestHost.resolve({ status: "success", message: "Old account acceptance" }));
  await expect(page.getByRole("heading", { name: "Accept invitation", exact: true })).toBeFocused();
  await expect(page.getByRole("button", { name: "Continue to team", exact: true })).toHaveCount(0);
  await accept.click();
  await expect(page.getByLabel("Submitted context")).toHaveText("team-a:principal-2");
  await page.evaluate(() => window.teamTestHost.changeRevision?.());
  await page.evaluate(() => window.teamTestHost.resolve({ status: "success", message: "Old revision acceptance" }));
  await expect(accept).toBeEnabled();
  await expect(page.getByRole("heading", { name: "Invitation accepted", exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Host requests")).toHaveText("3");
});

test("host invitation verdicts block acceptance even when account labels match", async ({ page }) => {
  await open(page, "acceptance");
  const states = [
    ["account-mismatch", "Switch account", "switch-account"],
    ["expired", "Request new invitation", "replacement"],
    ["revoked", "Request new invitation", "replacement"],
    ["already-accepted", "Continue to team", "team"],
    ["signed-out", "Sign in", "sign-in"],
  ] as const;
  for (const [status, action, navigation] of states) {
    await page.evaluate(value => window.teamTestHost.setAcceptanceStatus?.(value), status);
    await expect(page.getByRole("button", { name: "Accept invitation", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: action, exact: true }).click();
    await expect(page.getByLabel("Host navigation")).toHaveText(navigation);
  }
  await page.evaluate(() => { window.teamTestHost.setAcceptanceStatus?.("ready"); window.teamTestHost.setAccess?.("denied"); });
  await expect(page.getByRole("button", { name: "Accept invitation", exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Host requests")).toHaveText("0");
});

test("role retries preserve unknown and locked grants and stale outcomes require reload", async ({ page }) => {
  await open(page, "role");
  const review = page.getByRole("button", { name: "Review changes", exact: true });
  await expect(page.getByRole("checkbox", { name: "Retain records", exact: true })).toBeDisabled();
  await page.getByRole("checkbox", { name: "Review records", exact: true }).check();
  await review.click();
  const dialog = page.getByRole("dialog", { name: "Save capabilities for Archive reviewers?", exact: true });
  await expect(dialog.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(review).toBeFocused();
  await review.click();
  await dialog.getByRole("button", { name: "Save capabilities", exact: true }).click();
  await expect(page.getByLabel("Submitted value")).toHaveText(JSON.stringify({ roleId: "reviewers", revision: "1", capabilityIds: ["records.read", "records.retain", "legacy.grant", "records.review"] }));
  await page.evaluate(() => window.teamTestHost.resolve({ status: "error", message: "Please retry the save." }));
  await dialog.getByRole("button", { name: "Retry save", exact: true }).click();
  await page.evaluate(() => window.teamTestHost.resolve({ status: "stale", message: "The role changed on the server." }));
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("checkbox", { name: "Review records", exact: true })).toBeChecked();
  await expect(review).toBeDisabled();
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Review records", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Reload role", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Review records", exact: true })).toBeEnabled();
  await expect(page.getByRole("checkbox", { name: "Review records", exact: true })).not.toBeChecked();
  await expect(page.getByLabel("Host requests")).toHaveText("2");
});

test("role revisions, definition changes and access changes invalidate confirmations", async ({ page }) => {
  await open(page, "role");
  const review = page.getByRole("button", { name: "Review changes", exact: true });
  const grant = page.getByRole("checkbox", { name: "Review records", exact: true });
  const dialog = page.getByRole("dialog", { name: "Save capabilities for Archive reviewers?", exact: true });
  await grant.check(); await review.click();
  await page.evaluate(() => window.teamTestHost.changeRevision?.());
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { name: "Archive reviewers", exact: true })).toBeFocused();
  await expect(grant).not.toBeChecked();
  await grant.check(); await review.click();
  await dialog.getByRole("button", { name: "Save capabilities", exact: true }).click();
  await page.evaluate(() => window.teamTestHost.changeContext());
  await page.evaluate(() => window.teamTestHost.resolve({ status: "success", message: "Old role saved" }));
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Role saved", { exact: true })).toHaveCount(0);
  await grant.check(); await review.click();
  await page.evaluate(() => window.teamTestHost.changeDefinitions?.());
  await expect(dialog).toBeHidden(); await expect(grant).toBeDisabled();
  for (const access of ["read-only", "denied"] as const) {
    await page.evaluate(value => window.teamTestHost.setAccess?.(value), access);
    await expect(page.getByRole("checkbox", { name: "Read records", exact: true })).toBeDisabled();
    await expect(review).toBeDisabled();
  }
  await expect(page.getByLabel("Host requests")).toHaveText("1");
});

test("audit exports capture all filters and ignore replies after filtering or denial", async ({ page }) => {
  await open(page, "audit");
  await page.getByRole("searchbox", { name: "Search audit activity", exact: true }).fill("review");
  for (const [label, option] of [["Actor", "Casey Rowan"], ["Event type", "Role"], ["Outcome", "Denied"]] as const) {
    await page.getByRole("combobox", { name: label, exact: true }).click();
    await page.getByRole("option", { name: option, exact: true }).click();
  }
  const events = page.getByRole("region", { name: "Audit events", exact: true });
  await expect(events).toContainText("reviewed a role");
  await expect(events.getByRole("button", { name: /Retry/ })).toHaveCount(0);
  await events.locator("summary").click();
  await expect(events.getByText("The host rejected the change.", { exact: true })).toBeVisible();
  await expect(events.locator("time")).toHaveAttribute("datetime", "2026-10-25T10:30:00Z");
  const exportButton = page.getByRole("button", { name: "Export matching events", exact: true });
  await exportButton.click();
  await expect(page.getByLabel("Submitted value")).toHaveText(JSON.stringify({ search: "review", actorId: "casey", kind: "role", outcome: "denied" }));
  await expect(page.getByRole("button", { name: "Cancel export", exact: true })).toBeFocused();
  await page.getByRole("searchbox", { name: "Search audit activity", exact: true }).fill("other");
  await page.evaluate(() => window.teamTestHost.resolve({ status: "success", message: "Old export ready" }));
  await expect(page.getByText("Export ready", { exact: true })).toHaveCount(0);
  await exportButton.click();
  const loadsBefore = await page.getByLabel("Host loads").textContent();
  await page.evaluate(() => window.teamTestHost.setAccess?.("denied"));
  await page.evaluate(() => window.teamTestHost.resolve({ status: "success", message: "Denied export ready" }));
  await expect(events).toHaveCount(0);
  await expect(exportButton).toBeDisabled();
  await expect(page.getByLabel("Host loads")).toHaveText(loadsBefore ?? "");
  await expect(page.getByText("Export ready", { exact: true })).toHaveCount(0);
});

test("removing an invitation during revoke closes the confirmation and restores live focus", async ({ page }) => {
  await open(page, "members");
  const trigger = page.getByRole("button", { name: "Revoke invitation for casey@example.test", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Revoke invitation", exact: true });
  await expect(dialog.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await dialog.getByRole("button", { name: "Revoke invitation", exact: true }).click();
  await expect(dialog.getByRole("button", { name: "Stop waiting", exact: true })).toBeFocused();
  await page.evaluate(() => window.teamTestHost.removeInvitation?.());
  await expect(dialog).toBeHidden(); await expect(trigger).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Members of Fictional Cedar Studio", exact: true })).toBeFocused();
  await page.evaluate(() => window.teamTestHost.resolve({ status: "success", message: "Old revoke completed" }));
  await expect(page.getByText("Old revoke completed", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Host requests")).toHaveText("1");
});


test("audit total changes clamp the page and recover focus from removed or denied controls", async ({ page }) => {
  await open(page, "audit");
  const events = page.getByRole("region", { name: "Audit events", exact: true });
  await expect(events).toContainText("reviewed a role");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(events).toContainText("sent an invitation");
  await events.locator("summary").focus();
  await page.evaluate(() => window.teamTestHost.shrinkAudit?.());
  await expect(events).toContainText("reviewed a role");
  await expect(page.getByLabel("Audit query")).toContainText('"pageIndex":0');
  const heading = page.getByRole("heading", { name: "Audit activity", exact: true });
  await expect(heading).toBeFocused();
  const search = page.getByRole("searchbox", { name: "Search audit activity", exact: true });
  await search.focus();
  await page.evaluate(() => window.teamTestHost.setAccess?.("denied"));
  await expect(search).toBeDisabled();
  await expect(heading).toBeFocused();
  await expect(events).toHaveCount(0);
});


test("a controlled revoke update completes successfully and restores focus after row removal", async ({ page }) => {
  await open(page, "members");
  await page.getByRole("button", { name: "Revoke invitation for casey@example.test", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Revoke invitation", exact: true });
  await dialog.getByRole("button", { name: "Revoke invitation", exact: true }).click();
  await page.evaluate(() => window.teamTestHost.completeRevoke?.());
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Revoke saved by host.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Revoke invitation for casey@example.test", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Members of Fictional Cedar Studio", exact: true })).toBeFocused();
  await expect(page.getByLabel("Host requests")).toHaveText("1");
});
