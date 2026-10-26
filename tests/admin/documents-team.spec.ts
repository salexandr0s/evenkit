import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

async function controls(page: Page) {
  const details = page.locator(".starter-demo-controls");
  if (await details.getAttribute("open") === null) await details.getByText("Demo controls", { exact: true }).click();
}
async function workspace(page: Page, name: string) {
  await page.getByRole("button", { name: /^Switch workspace:/ }).click();
  await page.getByRole("button", { name: new RegExp(name) }).click();
}
async function teamSection(page: Page, name: string) {
  await page.getByRole("navigation", { name: "Team settings", exact: true }).getByRole("button", { name, exact: true }).click();
}
async function invitation(page: Page, email: string) {
  await page.getByRole("button", { name: "Invite member", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Invite a member", exact: true });
  await dialog.getByRole("textbox", { name: "Email address", exact: true }).fill(email);
  await dialog.getByRole("combobox", { name: "Invitation role", exact: true }).click();
  await page.getByRole("option", { name: "Editor", exact: true }).click();
  return dialog;
}
const sampleFile = (name: string) => ({ name, mimeType: "text/plain", buffer: Buffer.from("Fictional workshop notes. No customer data.") });

test("uploaded documents survive navigation, preview and download, and removal retries can be undone", async ({ page }) => {
  await page.goto("/documents");
  const library = page.getByRole("region", { name: "Document library", exact: true });
  await expect(library.getByRole("button", { name: "Preview Community brief.txt", exact: true })).toBeVisible();
  await controls(page);
  await page.getByRole("button", { name: "Fail next request", exact: true }).click();
  await page.getByLabel("Upload to this folder", { exact: true }).setInputFiles(sampleFile("Workshop notes.txt"));
  const queue = page.getByRole("list", { name: "Upload queue", exact: true });
  await expect(queue).toContainText("sample service");
  await queue.getByRole("button", { name: "Retry Workshop notes.txt", exact: true }).click();
  await expect(library.getByRole("button", { name: "Preview Workshop notes.txt", exact: true })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Admin navigation", exact: true });
  await nav.getByRole("link", { name: "Records", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Records", exact: true, level: 1 })).toBeVisible();
  await nav.getByRole("link", { name: "Documents", exact: true }).click();
  await library.getByRole("radio", { name: "Grid", exact: true }).click();
  const preview = library.getByRole("button", { name: "Preview Workshop notes.txt", exact: true });
  await preview.focus();
  await page.keyboard.press("Enter");
  const lightbox = page.getByRole("dialog", { name: "Workshop notes.txt", exact: true });
  await expect(lightbox.getByRole("region", { name: "Text content of Workshop notes.txt", exact: true })).toHaveText("Fictional workshop notes. No customer data.");
  const downloading = page.waitForEvent("download");
  await lightbox.getByRole("link", { name: "Download Workshop notes.txt", exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe("Workshop notes.txt");
  const downloadPath = await download.path();
  if (!downloadPath) throw new Error("The local document download did not produce a file.");
  expect(await readFile(downloadPath, "utf8")).toBe("Fictional workshop notes. No customer data.");
  await page.keyboard.press("Escape");
  await expect(preview).toBeFocused();
  await library.getByRole("checkbox", { name: "Select Workshop notes.txt", exact: true }).check();
  await controls(page);
  await page.getByRole("button", { name: "Fail next request", exact: true }).click();
  await library.getByRole("button", { name: "Remove selected", exact: true }).click();
  const removal = page.getByRole("dialog", { name: "Remove selected items?", exact: true });
  await removal.getByRole("button", { name: "Remove items", exact: true }).click();
  await expect(removal.getByRole("alert")).toContainText("sample service");
  await removal.getByRole("button", { name: "Retry removal", exact: true }).click();
  await expect(removal).toBeHidden();
  await expect(library.getByRole("button", { name: "Refresh documents", exact: true })).toBeFocused();
  await expect(preview).toHaveCount(0);
  await page.getByRole("button", { name: "Undo removal", exact: true }).click();
  await expect(preview).toBeVisible();
  await preview.click();
  await expect(lightbox.getByRole("region", { name: "Text content of Workshop notes.txt", exact: true })).toContainText("Fictional workshop notes");
});

test("cancelled document removal and uploads cannot mutate another folder or workspace", async ({ page }) => {
  await page.goto("/documents");
  const library = page.getByRole("region", { name: "Document library", exact: true });
  const brief = library.getByRole("checkbox", { name: "Select Community brief.txt", exact: true });
  await brief.check();
  await controls(page);
  await page.getByRole("switch", { name: "Slow requests", exact: true }).click();
  await library.getByRole("button", { name: "Remove selected", exact: true }).click();
  const removal = page.getByRole("dialog", { name: "Remove selected items?", exact: true });
  await removal.getByRole("button", { name: "Remove items", exact: true }).click();
  await expect(removal.getByRole("button", { name: "Cancel removal", exact: true })).toBeFocused();
  await removal.getByRole("button", { name: "Cancel removal", exact: true }).click();
  await expect(library.getByRole("button", { name: "Refresh documents", exact: true })).toBeFocused();
  await expect(brief).toBeChecked();
  await page.getByLabel("Upload to this folder", { exact: true }).setInputFiles(sampleFile("Cancelled upload.txt"));
  await page.getByRole("button", { name: "Cancel Cancelled upload.txt", exact: true }).click();
  await expect(page.getByRole("list", { name: "Upload queue", exact: true })).toContainText("Cancelled");
  await page.getByLabel("Upload to this folder", { exact: true }).setInputFiles(sampleFile("Wrong folder.txt"));
  await expect(page.getByRole("button", { name: "Cancel Wrong folder.txt", exact: true })).toBeVisible();
  await library.getByRole("button", { name: "Open folder Planning", exact: true }).click();
  await expect(library.getByRole("button", { name: "Preview Schedule.txt", exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Upload queue", exact: true })).toHaveCount(0);
  await expect(library.getByRole("button", { name: "Preview Wrong folder.txt", exact: true })).toHaveCount(0);
  await library.getByRole("button", { name: "All documents", exact: true }).click();
  await expect(brief).toBeVisible();
  await expect(library.getByRole("button", { name: "Preview Cancelled upload.txt", exact: true })).toHaveCount(0);
  await expect(library.getByRole("button", { name: "Preview Wrong folder.txt", exact: true })).toHaveCount(0);
  await page.getByLabel("Upload to this folder", { exact: true }).setInputFiles(sampleFile("Wrong workspace.txt"));
  await expect(page.getByRole("button", { name: "Cancel Wrong workspace.txt", exact: true })).toBeVisible();
  await workspace(page, "Harbor Workshop");
  await expect(library.getByRole("button", { name: "Preview Repair café notes.txt", exact: true })).toBeVisible();
  await expect(library.getByRole("button", { name: "Preview Wrong workspace.txt", exact: true })).toHaveCount(0);
  await workspace(page, "Northstar Studio");
  await expect(brief).toBeVisible();
  await expect(library.getByRole("button", { name: "Preview Wrong workspace.txt", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Undo removal", exact: true })).toHaveCount(0);
});

test("invitation retry and revocation plus a saved role produce scoped audit downloads", async ({ page }) => {
  await page.goto("/team");
  await expect(page.getByRole("table", { name: "Team members", exact: true })).toContainText("Alex Rivers");
  await controls(page);
  await page.getByRole("button", { name: "Fail next request", exact: true }).click();
  const invite = await invitation(page, "visitor@example.test");
  await invite.getByRole("button", { name: "Send invitation", exact: true }).click();
  await expect(invite.getByRole("alert")).toContainText("sample service");
  await expect(invite.getByRole("textbox", { name: "Email address", exact: true })).toHaveValue("visitor@example.test");
  await invite.getByRole("button", { name: "Retry invitation action", exact: true }).click();
  await expect(invite).toBeHidden();
  await expect(page.getByRole("button", { name: "Invite member", exact: true })).toBeFocused();
  const invited = page.getByRole("table", { name: "Team invitations", exact: true }).getByRole("row").filter({ hasText: "visitor@example.test" });
  await expect(invited).toContainText("Pending");
  await invited.getByRole("button", { name: "Revoke invitation for visitor@example.test", exact: true }).click();
  const revoke = page.getByRole("dialog", { name: "Revoke invitation", exact: true });
  await expect(revoke.getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await revoke.getByRole("button", { name: "Revoke invitation", exact: true }).click();
  await expect(invited).toContainText("Revoked");
  await teamSection(page, "Roles and capabilities");
  await expect(page.getByRole("checkbox", { name: "Read audit history", exact: true })).toBeDisabled();
  await page.getByRole("checkbox", { name: "Manage documents", exact: true }).check();
  await page.getByRole("button", { name: "Review changes", exact: true }).click();
  const role = page.getByRole("dialog", { name: "Save capabilities for Editor?", exact: true });
  await expect(role).toContainText("Manage documents");
  await role.getByRole("button", { name: "Save capabilities", exact: true }).click();
  await expect(role).toBeHidden();
  await expect(page.getByText("Editor role saved in this demo.", { exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Manage documents", exact: true })).toBeChecked();
  await teamSection(page, "Audit history");
  const audit = page.getByRole("region", { name: "Audit activity", exact: true });
  await expect(audit).toContainText("Updated the Editor role");
  await audit.getByRole("searchbox", { name: "Search audit activity", exact: true }).fill("sample invitation");
  await expect(audit).toContainText("2 matching events");
  const downloading = page.waitForEvent("download");
  await audit.getByRole("button", { name: "Export matching events", exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe("northstar-audit.json");
  const downloadPath = await download.path();
  if (!downloadPath) throw new Error("The demo audit export did not produce a file.");
  const records: unknown = JSON.parse(await readFile(downloadPath, "utf8"));
  expect(records).toEqual([
    expect.objectContaining({ action: "Revoked a sample invitation for visitor@example.test", actor: "Alex Rivers" }),
    expect.objectContaining({ action: "Created a sample invitation for visitor@example.test", actor: "Alex Rivers" }),
  ]);
});

test("cancelled team writes and an export interrupted by a workspace change stay isolated", async ({ page }) => {
  const downloads: string[] = [];
  page.on("download", download => downloads.push(download.suggestedFilename()));
  await page.goto("/team");
  await expect(page.getByRole("table", { name: "Team members", exact: true })).toContainText("Alex Rivers");
  await controls(page);
  await page.getByRole("switch", { name: "Slow requests", exact: true }).click();
  const invite = await invitation(page, "cancelled@example.test");
  await invite.getByRole("button", { name: "Send invitation", exact: true }).click();
  await expect(invite.getByRole("button", { name: "Stop waiting", exact: true })).toBeFocused();
  await invite.getByRole("button", { name: "Stop waiting", exact: true }).click();
  await expect(page.getByRole("button", { name: "Invite member", exact: true })).toBeFocused();
  await teamSection(page, "Roles and capabilities");
  await page.getByRole("checkbox", { name: "Manage documents", exact: true }).check();
  await page.getByRole("button", { name: "Review changes", exact: true }).click();
  const role = page.getByRole("dialog", { name: "Save capabilities for Editor?", exact: true });
  await role.getByRole("button", { name: "Save capabilities", exact: true }).click();
  await role.getByRole("button", { name: "Stop waiting", exact: true }).click();
  await expect(page.getByRole("button", { name: "Review changes", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Reload role", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Manage documents", exact: true })).not.toBeChecked();
  await teamSection(page, "Audit history");
  const audit = page.getByRole("region", { name: "Audit activity", exact: true });
  await expect(audit).toContainText("2 matching events");
  await audit.getByRole("button", { name: "Export matching events", exact: true }).click();
  await expect(audit.getByRole("button", { name: "Cancel export", exact: true })).toBeFocused();
  await workspace(page, "Harbor Workshop");
  await expect(page.getByRole("table", { name: "Team members", exact: true })).toContainText("Sam Rowan");
  await workspace(page, "Northstar Studio");
  await expect(page.getByRole("table", { name: "Team members", exact: true })).toContainText("Alex Rivers");
  await expect(page.getByRole("table", { name: "Team invitations", exact: true })).not.toContainText("cancelled@example.test");
  expect(downloads).toEqual([]);
  await page.getByRole("switch", { name: "Slow requests", exact: true }).click();
  await teamSection(page, "Roles and capabilities");
  await expect(page.getByRole("checkbox", { name: "Manage documents", exact: true })).not.toBeChecked();
});
