import { expect, test } from "@playwright/test";

test("filter drafts do not change results until applied and removal restores focus", async ({ page }) => {
  await page.goto("/#filters");
  const results = page.getByRole("list", { name: "Filtered projects" });
  await expect(results.getByRole("listitem")).toHaveCount(5);
  await page.getByRole("searchbox", { name: "Search project names" }).fill("Meridian");
  await expect(page.getByRole("status").filter({ hasText: "Changes not applied." })).toBeVisible();
  await expect(results.getByRole("listitem")).toHaveCount(5);
  await page.getByRole("button", { name: "Apply filters", exact: true }).click();
  await expect(results.getByRole("listitem")).toHaveCount(1);
  await expect(results).toContainText("Meridian release");
  await page.getByRole("button", { name: "Remove filter: Search: Meridian" }).click();
  await expect(results.getByRole("listitem")).toHaveCount(5);
  await expect(page.getByRole("group", { name: "Applied filters" }).getByRole("status")).toBeFocused();

  await page.goto("/#applied-filters");
  await page.getByRole("button", { name: "Remove filter: Search: Meridian" }).click();
  const remaining = page.getByRole("button", { name: "Remove filter: Status: active" });
  await expect(remaining).toBeFocused();
  await expect(page.getByRole("list", { name: "Filtered projects" }).getByRole("listitem")).toHaveCount(3);
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.getByRole("group", { name: "Applied filters" }).getByRole("status")).toBeFocused();
});

test("deferred applied-filter commits recover focus only while removal owns it", async ({ page }) => {
  await page.goto("/#applied-filters");
  await page.clock.install();
  await page.getByRole("checkbox", { name: "Defer filter updates" }).check();
  const removeQuery = page.getByRole("button", { name: "Remove filter: Search: Meridian" });
  await removeQuery.click();
  await expect(removeQuery).toBeFocused();
  await expect(removeQuery).toBeVisible();
  await page.clock.fastForward(500);
  await expect(page.getByRole("button", { name: "Remove filter: Status: active" })).toBeFocused();
  const clear = page.getByRole("button", { name: "Clear all filters" });
  await clear.click();
  await expect(clear).toBeFocused();
  await page.clock.fastForward(500);
  await expect(page.getByRole("group", { name: "Applied filters" }).getByRole("status")).toBeFocused();

  const search = page.getByRole("searchbox", { name: "Search project names" });
  await search.fill("Aster");
  await page.getByRole("button", { name: "Apply filters", exact: true }).click();
  await page.getByRole("button", { name: "Remove filter: Search: Aster" }).click();
  await search.focus();
  await page.clock.fastForward(500);
  await expect(page.getByRole("button", { name: "Remove filter: Search: Aster" })).not.toBeVisible();
  await expect(search).toBeFocused();
});

test("file selection rejects invalid files, retains accepted native values and permits reselection", async ({ page }) => {
  await page.goto("/#file-input");
  const input = page.getByLabel("Project attachments", { exact: true });
  const selected = page.getByRole("list", { name: "Selected attachments" });
  await input.setInputFiles({ name: "portrait.png", mimeType: "image/png", buffer: Buffer.from("image") });
  await expect(page.getByRole("alert")).toContainText("this file type is not accepted");
  await expect(selected.getByRole("listitem")).toHaveCount(0);
  expect(await input.evaluate(element => (element as HTMLInputElement).files?.length)).toBe(0);

  const note = { name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("Project notes") };
  await input.setInputFiles(note);
  const chooserPromise = page.waitForEvent("filechooser");
  await input.click();
  await (await chooserPromise).setFiles(note);
  await expect(selected.getByRole("listitem")).toHaveCount(2);
  await page.getByRole("button", { name: "Read selected files" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Current native selection" })).toContainText("notes.txt");
  await input.evaluate(element => { const fileInput = element as HTMLInputElement; fileInput.value = ""; fileInput.dispatchEvent(new Event("cancel")); });
  expect(await input.evaluate(element => (element as HTMLInputElement).files?.[0]?.name)).toBe("notes.txt");

  await input.setInputFiles({ name: "large.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(1024 * 1024 + 1) });
  await expect(page.getByRole("alert")).toContainText("exceeds the size limit");
  await input.setInputFiles([{ name: "third.txt", mimeType: "text/plain", buffer: Buffer.from("Third") }, { name: "fourth.txt", mimeType: "text/plain", buffer: Buffer.from("Fourth") }]);
  await expect(selected.getByRole("listitem")).toHaveCount(3);
  await expect(page.getByRole("alert")).toContainText("file count limit");
  expect(await input.evaluate(element => Array.from((element as HTMLInputElement).files ?? []).map(file => file.name))).toEqual(["notes.txt", "notes.txt", "third.txt"]);
  await page.getByRole("button", { name: "Clear files", exact: true }).click();
  await expect(selected.getByRole("listitem")).toHaveCount(0);
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  await input.evaluate(element => element.dispatchEvent(new Event("cancel")));
  expect(await input.evaluate(element => (element as HTMLInputElement).files?.length)).toBe(0);
  await input.setInputFiles(note);
  await expect(selected.getByRole("listitem")).toHaveCount(1);
  await page.getByRole("button", { name: "Remove notes.txt" }).click();
  await expect(input).toBeFocused();
  expect(await input.evaluate(element => (element as HTMLInputElement).files?.length)).toBe(0);
  await input.evaluate(element => { const node = element as HTMLInputElement; node.value = ""; node.dispatchEvent(new Event("cancel")); });
  expect(await input.evaluate(element => (element as HTMLInputElement).files?.length)).toBe(0);
  await page.getByRole("button", { name: "Read selected files" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Current native selection" })).toContainText("No files in the current selection.");

  const disabled = page.getByLabel("Unavailable attachments", { exact: true });
  await expect(disabled).toBeDisabled();
  const transfer = await page.evaluateHandle(() => { const data = new DataTransfer(); data.items.add(new File(["ignored"], "ignored.txt", { type: "text/plain" })); return data; });
  await disabled.locator("..").dispatchEvent("drop", { dataTransfer: transfer });
  await expect(selected.getByRole("listitem")).toHaveCount(0);
  await transfer.dispose();
});

test("editable record block validates, preserves dirty drafts, and retries a failed save", async ({ page }) => {
  await page.goto("/#list-page");
  await page.clock.install();
  const create = page.getByRole("button", { name: "Create project", exact: true });
  await create.click();
  const dialog = page.getByRole("dialog");
  const name = dialog.getByRole("textbox", { name: "Project name", exact: true });
  await dialog.getByRole("button", { name: "Save project", exact: true }).click();
  await expect(name).toBeFocused();
  await name.fill("   ");
  await dialog.getByRole("button", { name: "Save project", exact: true }).click();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await name.fill("Nightfall planning");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toHaveAccessibleName("Discard changes?");
  await expect(dialog.getByRole("button", { name: "Keep editing" })).toBeFocused();
  await dialog.getByRole("button", { name: "Keep editing" }).click();
  await expect(name).toHaveValue("Nightfall planning");
  await expect(name).toBeFocused();
  await dialog.getByRole("button", { name: "Reset changes" }).click();
  await expect(name).toHaveValue("");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(create).toBeFocused();

  await page.getByRole("checkbox", { name: "Fail the next save" }).check();
  await create.click();
  await name.fill("Nightfall planning");
  await dialog.getByRole("button", { name: "Save project", exact: true }).click();
  await expect(dialog.getByRole("button", { name: "Cancel save", exact: true })).toBeFocused();
  await page.clock.fastForward(1000);
  await expect(dialog.getByRole("alert")).toContainText("Project was not saved");
  await expect(name).toHaveValue("Nightfall planning");
  await dialog.getByRole("button", { name: "Retry save", exact: true }).click();
  await page.clock.fastForward(1000);
  await expect(dialog).not.toBeVisible();
  await expect(create).toBeFocused();
  await expect(page.locator(".pk-record-result")).toHaveText("Nightfall planning saved.");
  await page.getByRole("searchbox", { name: "Find projects" }).fill("Nightfall");
  await page.getByRole("button", { name: "Apply filters", exact: true }).click();
  await page.getByRole("button", { name: "Edit Nightfall planning" }).click();
  await name.fill("Discarded title");
  await name.press("Escape");
  await dialog.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(page.getByRole("button", { name: "Edit Nightfall planning" })).toBeFocused();
});

test("cancelled saves cannot replace a later draft or create a record", async ({ page }) => {
  await page.goto("/#list-page");
  await page.clock.install();
  await page.getByRole("button", { name: "Create project", exact: true }).click();
  const dialog = page.getByRole("dialog");
  const name = dialog.getByRole("textbox", { name: "Project name", exact: true });
  await name.fill("Cancelled project");
  await dialog.getByRole("button", { name: "Save project", exact: true }).click();
  await dialog.getByRole("button", { name: "Cancel save", exact: true }).click();
  await expect(name).toBeEditable();
  await expect(dialog.getByRole("status").filter({ hasText: "Save cancelled" })).toBeVisible();
  await name.fill("Later draft");
  await page.clock.fastForward(2000);
  await expect(dialog).toBeVisible();
  await expect(name).toHaveValue("Later draft");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await dialog.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(page.locator(".pk-record-result")).toHaveText("");
  await page.getByRole("searchbox", { name: "Find projects" }).fill("Cancelled project");
  await page.getByRole("button", { name: "Apply filters", exact: true }).click();
  await expect(page.getByText("No projects match these filters", { exact: true })).toBeVisible();
});

test("file row recovery and editable recovery page actions remain usable at narrow widths", async ({ page }) => {
  await page.goto("/#file-row");
  await page.setViewportSize({ width: 360, height: 900 });
  const retry = page.getByRole("button", { name: "Retry Quarterly project handover and delivery notes.txt" });
  await retry.focus();
  await expect(page.getByRole("tooltip", { name: "Retry Quarterly project handover and delivery notes.txt", exact: true }).and(page.locator(".pk-tooltip-content"))).toBeVisible();
  await retry.press("Enter");
  await expect(page.getByRole("status").filter({ hasText: "Sample retry completed." })).toBeVisible();
  await page.getByRole("button", { name: "Remove Quarterly project handover and delivery notes.txt" }).click();
  await expect(page.getByRole("button", { name: "Reset file examples" })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.goto("/#error-pages");
  await page.getByRole("combobox", { name: "Recovery state" }).click();
  await page.getByRole("option", { name: "Offline", exact: true }).click();
  await expect(page.getByRole("heading", { name: "You are offline" })).toBeVisible();
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Recovery requested in this local preview." })).toBeVisible();
  await page.getByRole("link", { name: "Return to projects" }).click();
  await expect(page).toHaveURL(/#list-page$/);
});
