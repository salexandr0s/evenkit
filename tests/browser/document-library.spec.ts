import { expect, test } from "@playwright/test";

test("document selection follows IDs across pages and views, and clears on folder/filter changes", async ({ page }) => {
  await page.goto("/#document-library");
  const library = page.getByRole("region", { name: "Document library", exact: true });
  await expect(library.getByRole("status")).toContainText("1–6 of 8 records");
  await library.getByRole("checkbox", { name: "Select Brand assets", exact: true }).check();
  await library.getByRole("combobox", { name: "Sort documents: direction", exact: true }).click();
  await page.getByRole("option", { name: "Descending", exact: true }).click();
  await expect(library.locator("tbody tr").first()).toContainText("Workspace logo.png");
  await expect(library.getByRole("status")).toContainText("1 selected");
  await library.getByRole("combobox", { name: "Sort documents: direction", exact: true }).click();
  await page.getByRole("option", { name: "Ascending", exact: true }).click();
  await expect(library.getByRole("checkbox", { name: "Select Brand assets", exact: true })).toBeChecked();
  await library.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(library.getByRole("status")).toContainText("1 selected");
  await library.getByRole("radio", { name: "Grid", exact: true }).click();
  await expect(library.getByText("8 items · 1 selected", { exact: true })).toBeVisible();
  await library.getByRole("button", { name: "Previous page", exact: true }).click();
  await expect(library.getByRole("checkbox", { name: "Select Brand assets", exact: true })).toBeChecked();
  const thumbnail = library.getByRole("region", { name: "Preview of Expired preview.png", exact: true });
  await expect(thumbnail).toHaveAttribute("data-variant", "thumbnail");
  await expect(thumbnail).toContainText("Preview expired");
  await expect(thumbnail.locator("button, a, input, [tabindex]")).toHaveCount(0);
  const previewLauncher = library.getByRole("button", { name: "Preview Expired preview.png", exact: true });
  await previewLauncher.focus();
  await page.keyboard.press("Enter");
  const previewDialog = page.getByRole("dialog", { name: "Expired preview.png", exact: true });
  await expect(previewDialog.getByRole("button", { name: "Refresh preview of Expired preview.png", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(previewLauncher).toBeFocused();
  await library.getByRole("button", { name: "Open folder Brand assets", exact: true }).click();
  await expect(library.getByText("1 item · 0 selected", { exact: true })).toBeVisible();
  await expect(library.getByRole("searchbox", { name: "Search documents", exact: true })).toBeFocused();
  await library.getByRole("button", { name: "All documents", exact: true }).click();
  await library.getByRole("button", { name: "Open folder Empty folder", exact: true }).click();
  await expect(library.getByText("This folder is empty", { exact: true })).toBeVisible();
  await library.getByRole("button", { name: "All documents", exact: true }).click();
  await library.getByRole("checkbox", { name: "Select Brand assets", exact: true }).check();
  await library.getByRole("combobox", { name: "Show", exact: true }).click();
  await page.getByRole("option", { name: "Files", exact: true }).click();
  await expect(library.getByText("6 items · 0 selected", { exact: true })).toBeVisible();
  await expect(library.getByRole("button", { name: "Open folder Brand assets", exact: true })).toHaveCount(0);
});

test("document queries reject stale results and recover load and removal failures", async ({ page }) => {
  await page.goto("/#document-library");
  const library = page.getByRole("region", { name: "Document library", exact: true });
  const search = library.getByRole("searchbox", { name: "Search documents", exact: true });
  await expect(library.getByRole("status")).toContainText("of 8 records");
  await search.fill("Workspace");
  await expect(library.getByRole("status")).toContainText("Loading records");
  await search.fill("Project");
  await expect(library.getByRole("checkbox", { name: "Select Project brief.pdf", exact: true })).toBeVisible();
  await page.waitForTimeout(750); // Allow the deliberately superseded loader to finish.
  await expect(library.getByRole("checkbox", { name: "Select Workspace logo.png", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Fail next load", exact: true }).click();
  await expect(library.getByRole("alert")).toContainText("sample folder could not be loaded");
  await library.getByRole("button", { name: "Try again", exact: true }).click();
  await search.fill("no such document");
  await expect(library.getByText("No matching records", { exact: true })).toBeVisible();
  await library.getByRole("region", { name: "Documents table", exact: true }).getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toBeFocused();
  await search.fill("Project");
  await library.getByRole("checkbox", { name: "Select Project brief.pdf", exact: true }).check();
  await page.getByRole("button", { name: "Fail next removal", exact: true }).click();
  await library.getByRole("button", { name: "Remove selected", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Remove selected items?", exact: true });
  await dialog.getByRole("button", { name: "Remove items", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Your selection is still here");
  await dialog.getByRole("button", { name: "Retry removal", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(library.getByRole("button", { name: "Refresh documents", exact: true })).toBeFocused();
  await expect(library.getByRole("checkbox", { name: "Select Project brief.pdf", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Fail next restore", exact: true }).click();
  await page.getByRole("button", { name: "Undo removal", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Restore failed");
  await page.getByRole("button", { name: "Undo removal", exact: true }).click();
  await expect(library.getByRole("checkbox", { name: "Select Project brief.pdf", exact: true })).toBeVisible();
});

test("refreshing an expired preview keeps the lightbox open through the reload", async ({ page }) => {
  await page.goto("/#document-library");
  await page.getByRole("button", { name: "Preview Expired preview.png", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Expired preview.png", exact: true });
  await expect(dialog.getByText("Preview expired", { exact: true })).toBeVisible();
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await dialog.getByRole("button", { name: "Refresh preview of Expired preview.png", exact: true }).click();
  await expect(dialog).toHaveAttribute("data-state", "open");
  await expect(dialog.getByRole("status")).toContainText("Loading preview for Expired preview.png");
  await page.clock.runFor(150);
  await expect(dialog.getByRole("img", { name: "Expired preview.png", exact: true })).toBeVisible();
  await page.clock.resume();
  await page.keyboard.press("Escape");
  // The original table row was replaced during reload, so use the stable fallback.
  await expect(page.getByRole("button", { name: "Refresh documents", exact: true })).toBeFocused();
});

test("folder navigation cancels pending and queued uploads without retargeting them", async ({ page }) => {
  await page.goto("/#document-library");
  const library = page.getByRole("region", { name: "Document library", exact: true });
  await expect(library.getByRole("status")).toContainText("of 8 records");
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.getByLabel("Upload to this folder", { exact: true }).setInputFiles([
    { name: "Root upload one.txt", mimeType: "text/plain", buffer: Buffer.from("One") },
    { name: "Root upload two.txt", mimeType: "text/plain", buffer: Buffer.from("Two") },
    { name: "Root upload queued.txt", mimeType: "text/plain", buffer: Buffer.from("Queued") },
  ]);
  await expect(page.getByText("2 uploading, 1 queued.", { exact: false })).toBeVisible();
  // This folder deliberately has the ID "root"; it must not share the root queue.
  await library.getByRole("button", { name: "Open folder Brand assets", exact: true }).click();
  await page.clock.runFor(500);
  await expect(library.getByRole("status")).toContainText("1–1 of 1 record");
  await expect(page.getByRole("list", { name: "Upload queue", exact: true })).toHaveCount(0);
  await library.getByRole("button", { name: "All documents", exact: true }).click();
  await page.clock.runFor(500);
  await library.getByRole("searchbox", { name: "Search documents", exact: true }).fill("Root upload");
  await page.clock.runFor(500);
  await expect(library.getByText("No matching records", { exact: true })).toBeVisible();
});

test("cancelling removal ignores its late completion and preview dismissal restores focus", async ({ page }) => {
  await page.goto("/#document-library");
  const library = page.getByRole("region", { name: "Document library", exact: true });
  await library.getByRole("checkbox", { name: "Select Project brief.pdf", exact: true }).check();
  await page.getByRole("button", { name: "Delay next removal", exact: true }).click();
  await library.getByRole("button", { name: "Remove selected", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Remove selected items?", exact: true });
  await dialog.getByRole("button", { name: "Remove items", exact: true }).click();
  await expect(dialog.getByRole("button", { name: "Cancel removal", exact: true })).toBeFocused();
  await dialog.getByRole("button", { name: "Cancel removal", exact: true }).click();
  await page.waitForTimeout(900);
  await expect(library.getByRole("checkbox", { name: "Select Project brief.pdf", exact: true })).toBeChecked();
  await expect(page.getByRole("button", { name: "Undo removal", exact: true })).toHaveCount(0);
  await library.getByRole("button", { name: "Preview Project brief.pdf", exact: true }).focus();
  await expect(page.getByRole("tooltip")).toHaveText("Preview Project brief.pdf");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(library.getByRole("button", { name: "Preview Project brief.pdf", exact: true })).toBeFocused();
});
