import { expect, test } from "@playwright/test";

test("lightbox traps keyboard focus, closes with Escape and restores its launcher or fallback", async ({ page }) => {
  await page.goto("/#file-preview");
  const launcher = page.getByRole("button", { name: "Open lightbox", exact: true });
  await launcher.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Evenkit logo.png", exact: true });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await dialog.getByRole("button", { name: "Close file preview", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await expect(page.getByRole("tooltip", { name: "Close file preview", exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(launcher).toBeFocused();
  await page.getByRole("checkbox", { name: "Remove launcher when opening" }).check();
  await launcher.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "File previews", exact: true })).toBeFocused();
});

test("expired and failed previews recover while plain text stays inert and unsupported actions are filtered", async ({ page }) => {
  await page.goto("/#file-preview");
  const preview = page.getByRole("region", { name: "Preview of Evenkit logo.png", exact: true });
  await page.getByRole("button", { name: "Expire preview", exact: true }).click();
  await expect(preview).toHaveAttribute("data-state", "expired");
  await preview.getByRole("button", { name: "Refresh preview of Evenkit logo.png", exact: true }).click();
  await expect(preview.locator(".pk-image")).toHaveAttribute("data-state", "loaded");
  await expect(preview).toBeFocused();
  await page.getByRole("button", { name: "Show loading", exact: true }).click();
  await preview.locator(".pk-file-preview-placeholder").focus();
  // A host completion can replace the focused scroll area without another click.
  await page.getByRole("button", { name: "Restore preview", exact: true }).evaluate(button => { if (button instanceof HTMLButtonElement) button.click(); });
  await expect(preview.locator(".pk-image")).toHaveAttribute("data-state", "loaded");
  await expect(preview).toBeFocused();
  await page.getByRole("button", { name: "Break image", exact: true }).click();
  await expect(preview.locator(".pk-image")).toHaveAttribute("data-state", "error");
  await preview.getByRole("button", { name: "Retry preview of Evenkit logo.png", exact: true }).click();
  await expect(preview.locator(".pk-image")).toHaveAttribute("data-state", "loaded");
  await expect(preview).toBeFocused();
  await page.getByRole("combobox", { name: "Preview example", exact: true }).click();
  await page.getByRole("option", { name: "Release notes with a long filename for the design library handoff.txt", exact: true }).click();
  await expect(page.locator(".pk-file-preview pre")).toContainText("<script>alert('example')</script>");
  await expect(page.locator(".pk-file-preview script, .pk-file-preview iframe, .pk-file-preview object")).toHaveCount(0);
  await page.getByRole("combobox", { name: "Preview example", exact: true }).click();
  await page.getByRole("option", { name: "Uploaded page.html", exact: true }).click();
  await expect(page.getByText("Preview not supported", { exact: true })).toBeVisible();
  await expect(page.locator(".pk-file-preview a, .pk-file-preview pre, .pk-file-preview iframe, .pk-file-preview object")).toHaveCount(0);
});
