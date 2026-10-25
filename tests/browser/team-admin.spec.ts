import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { themeNames } from "@evenkit/tokens";

async function select(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

test("members example validates invitations and retries without losing the draft", async ({ page }) => {
  await page.goto("/#team-members");
  const members = page.getByRole("region", { name: "Team members table", exact: true });
  await expect(members).toContainText("Mira Chen");
  await page.getByRole("searchbox", { name: "Search members", exact: true }).fill("colleague9");
  await expect(members).toContainText("Research colleague 9");
  await select(page, "Simulated response", "Failure then retry");
  const invite = page.getByRole("button", { name: "Invite member", exact: true });
  await invite.click();
  const dialog = page.getByRole("dialog", { name: "Invite a member", exact: true });
  const email = dialog.getByRole("textbox", { name: "Email address", exact: true });
  await expect(email).toBeFocused();
  await dialog.getByRole("button", { name: "Send invitation", exact: true }).click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toBeFocused();
  await email.fill("new-colleague@example.test");
  await select(page, "Invitation role", "Reviewer");
  await dialog.getByRole("button", { name: "Send invitation", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("fictional request failed");
  await expect(email).toHaveValue("new-colleague@example.test");
  await dialog.getByRole("button", { name: "Retry invitation action", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(invite).toBeFocused();
  const invitations = page.getByRole("region", { name: "Team invitations table", exact: true });
  await expect(invitations).toContainText("new-colleague@example.test");
  await select(page, "Filter invitations by status", "Expired");
  await expect(invitations).toContainText("ada@example.test");
  await page.getByRole("button", { name: "Resend invitation for ada@example.test", exact: true }).click();
  const resend = page.getByRole("dialog", { name: "Resend invitation", exact: true });
  await expect(resend.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await resend.getByRole("button", { name: "Resend invitation", exact: true }).click();
  await expect(resend).toBeHidden();
  await expect(invitations).not.toContainText("ada@example.test");
  await expect(page.getByRole("heading", { name: "Members of Aster Research", exact: true })).toBeFocused();
});

test("invitation block connects account recovery and failure retry to the host", async ({ page }) => {
  await page.goto("/#invitation-acceptance");
  await select(page, "Invitation state", "Account mismatch");
  await expect(page.getByRole("button", { name: "Accept invitation", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Switch account", exact: true }).click();
  await select(page, "Simulated response", "Failure then retry");
  await page.getByRole("button", { name: "Accept invitation", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("fictional request failed");
  await page.getByRole("button", { name: "Retry acceptance", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Invitation accepted", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Continue to team", exact: true }).click();
  await expect(page.locator(".team-admin-demo-status")).toContainText("workspace here");
});

test("role block preserves unknown grants through a confirmed host save", async ({ page }) => {
  await page.goto("/#role-capability-editor");
  const editor = page.locator(".pk-role-editor");
  await expect(editor).toContainText("archive.legacy");
  await expect(editor.getByRole("checkbox", { name: "Read research notes", exact: true })).toBeDisabled();
  await editor.getByRole("checkbox", { name: "Comment on research notes", exact: true }).check();
  await editor.getByRole("button", { name: "Review changes", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Save capabilities for Reviewer?", exact: true });
  await expect(dialog).toContainText("Comment on research notes");
  await dialog.getByRole("button", { name: "Save capabilities", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator(".team-admin-demo-status")).toContainText("including the retained legacy grant");
  await expect(editor.getByRole("checkbox", { name: "Comment on research notes", exact: true })).toBeChecked();
  await expect(editor).toContainText("archive.legacy");
  await page.getByRole("checkbox", { name: "Read-only role", exact: true }).check();
  await expect(editor.getByRole("button", { name: "Review changes", exact: true })).toBeDisabled();
});

test("audit example exports all matches and recovers a failed read", async ({ page }) => {
  await page.goto("/#audit-viewer");
  const audit = page.locator(".pk-audit-viewer");
  await expect(audit.getByText("6 matching events", { exact: true })).toBeVisible();
  const downloading = page.waitForEvent("download");
  await audit.getByRole("button", { name: "Export matching events", exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe("fictional-team-audit.json");
  const path = await download.path();
  if (!path) throw new Error("The host export did not produce a file.");
  const exported: unknown = JSON.parse(await readFile(path, "utf8"));
  expect(exported).toMatchObject({ fictional: true, criteria: { search: "", actorId: null, kind: null, outcome: null } });
  expect(exported).toHaveProperty("records.length", 6);
  await audit.getByRole("searchbox", { name: "Search audit activity", exact: true }).fill("revoked");
  await expect(audit).toContainText("revoked an unused invitation");
  await audit.locator("summary").click();
  await expect(audit).toContainText("unused@example.test");
  await page.getByRole("button", { name: "Fail next audit load", exact: true }).click();
  await expect(audit.getByRole("alert")).toContainText("fictional audit request failed");
  await audit.getByRole("button", { name: "Retry activity", exact: true }).click();
  await expect(audit).toContainText("revoked an unused invitation");
  await page.getByRole("checkbox", { name: "Deny audit access", exact: true }).check();
  await expect(audit.locator("time")).toHaveCount(0);
  await expect(audit.getByRole("button", { name: "Export matching events", exact: true })).toBeDisabled();
});

test("team screens fit RTL at narrow widths across every theme and system mode", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 360, height: 900 });
  for (const id of ["team-members", "invitation-acceptance", "role-capability-editor", "audit-viewer"]) {
    await page.goto(`/#${id}`);
    await expect(page.locator(".team-admin-preview")).toBeVisible();
    await page.evaluate(() => { document.documentElement.dir = "rtl"; });
    for (const mode of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: mode, reducedMotion: "reduce" });
      const overflow = await page.evaluate(names => {
        const root = document.documentElement;
        delete root.dataset.kitMode;
        return names.filter(theme => { root.dataset.kitTheme = theme; return root.scrollWidth > window.innerWidth + 1; });
      }, themeNames);
      expect(overflow, `${id} RTL system ${mode}`).toEqual([]);
    }
    if (id === "team-members") {
      const trigger = page.getByRole("button", { name: "Invite member", exact: true });
      await trigger.focus(); await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: "Invite a member", exact: true });
      await expect(dialog.getByRole("textbox", { name: "Email address", exact: true })).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("combobox", { name: "Invitation role", exact: true })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    }
  }
  expect(errors).toEqual([]);
});
