import { expect, test } from "@playwright/test";

test("upload queue cancels, retries and removes a chosen file", async ({ page }) => {
  await page.goto("/#upload-queue");
  const picker = page.getByLabel("Choose attachments", { exact: true });
  await picker.setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("Notes") });
  const row = page.getByRole("list", { name: "Upload queue", exact: true }).getByRole("listitem");
  await expect(row).toHaveAttribute("data-state", "uploading");
  await page.getByRole("button", { name: "Cancel notes.txt", exact: true }).click();
  await expect(row).toHaveAttribute("data-state", "cancelled");
  await expect(row).toBeFocused();
  await page.getByRole("button", { name: "Retry notes.txt", exact: true }).click();
  await expect(row).toHaveAttribute("data-state", "complete");
  await expect(page.getByRole("link", { name: "Download notes.txt", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Remove notes.txt", exact: true }).click();
  await expect(row).toHaveCount(0);
  await expect(picker).toBeFocused();
});

test("upload failure keeps the same file for retry and duplicates do not create rows", async ({ page }) => {
  await page.goto("/#upload-queue");
  await page.getByRole("checkbox", { name: "Fail the next upload" }).check();
  await page.getByRole("button", { name: "Add sample files", exact: true }).click();
  const list = page.getByRole("list", { name: "Upload queue", exact: true });
  const failed = list.getByRole("listitem").filter({ hasText: "Review notes.txt" });
  await expect(failed).toHaveAttribute("data-state", "error");
  await page.getByRole("button", { name: "Add sample files", exact: true }).click();
  await expect(list.getByRole("listitem")).toHaveCount(3);
  await expect(page.getByText("Review notes.txt is already in the queue.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Retry Review notes.txt", exact: true }).click();
  await expect(failed).toHaveAttribute("data-state", "complete");
  await page.getByRole("button", { name: "Clear completed", exact: true }).click();
  await expect(list).toHaveCount(0);
});

test("image previews release object URLs and failed images recover without changing frame size", async ({ page }) => {
  await page.addInitScript(() => {
    const create = URL.createObjectURL.bind(URL);
    const revoke = URL.revokeObjectURL.bind(URL);
    const urls = new Set<string>();
    Object.defineProperty(window, "__liveUploadUrls", { value: urls });
    URL.createObjectURL = object => { const url = create(object); urls.add(url); return url; };
    URL.revokeObjectURL = url => { urls.delete(url); revoke(url); };
  });
  await page.goto("/#upload-queue");
  await page.getByLabel("Choose attachments", { exact: true }).setInputFiles({ name: "preview.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a2ioAAAAASUVORK5CYII=", "base64") });
  await expect(page.locator(".pk-upload-list .pk-thumbnail")).toHaveAttribute("data-state", "loaded");
  await page.getByRole("button", { name: "Cancel preview.png", exact: true }).click();
  await page.getByRole("button", { name: "Remove preview.png", exact: true }).click();
  await expect.poll(() => page.evaluate(() => Reflect.get(window, "__liveUploadUrls").size as number)).toBe(0);
  await page.goto("/#image");
  const frame = page.locator(".uploads-preview-images figure").nth(1).locator(".pk-image");
  await expect(frame).toHaveAttribute("data-state", "error");
  const before = await frame.boundingBox();
  await page.getByRole("button", { name: "Retry image", exact: true }).click();
  await expect(frame).toHaveAttribute("data-state", "loaded");
  await expect(frame).toBeFocused();
  const after = await frame.boundingBox();
  expect(after?.height).toBe(before?.height);
  expect(after?.width).toBe(before?.width);
});
