import { expect, test } from "@playwright/test";

test("headers preserve a zero review count as metadata before a review is added", async ({ page }) => {
  await page.goto("/#page-header");
  const header = page.locator(".foundations-preview .pk-section-header");
  const count = header.locator(".pk-page-header-metadata");
  await expect(count).toHaveText("0");
  await expect(count).toBeVisible();
  await header.getByRole("button", { name: "Add review", exact: true }).click();
  await expect(count).toHaveText("1");
});

test("avatar failure keeps its name and recovers when a new image is supplied", async ({ page }) => {
  await page.goto("/#avatar");
  const owner = page.locator(".foundations-preview .pk-avatar").first();
  await expect(owner).toHaveAccessibleName("Alex Morgan");
  await expect(owner).toContainText("AM");
  await page.getByRole("button", { name: "Use missing image", exact: true }).click();
  await expect(owner.locator("img")).toHaveCount(0);
  await page.getByRole("button", { name: "Use sample image", exact: true }).click();
  await expect(owner.locator("img")).toHaveAttribute("data-loaded", "true");
  await expect(owner).toHaveAccessibleName("Alex Morgan");
  await expect(owner.locator("img")).toHaveAttribute("alt", "");
  await expect(page.getByRole("img", { name: "2 more: Robin Chen, Ellis Taylor", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Use initials", exact: true }).click();
  await expect(owner.locator("img")).toHaveCount(0);
  await expect(owner).toContainText("AM");
});

test("tag selection and removal use separate controls and recover focus", async ({ page, browser }) => {
  await page.goto("/#tags");
  const tags = page.getByRole("group", { name: "Project tags", exact: true });
  const design = tags.getByRole("button", { name: "Design", exact: true });
  await expect(design).toHaveAttribute("aria-pressed", "true");
  await design.press("Space");
  await expect(design).toHaveAttribute("aria-pressed", "false");
  const remove = tags.getByRole("button", { name: "Remove Design", exact: true });
  await remove.focus();
  await remove.press("Enter");
  await expect(design).toHaveCount(0);
  const reset = page.getByRole("button", { name: "Reset tags", exact: true });
  await expect(reset).toBeFocused();
  await expect(page.locator(".foundations-preview").getByRole("status")).toHaveText("Design removed.");
  await reset.press("Enter");
  await expect(design).toHaveAttribute("aria-pressed", "true");
  await expect(reset).toBeFocused();
  await expect(tags.getByRole("button", { name: "Unavailable", exact: true })).toBeDisabled();

  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await tags.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  }
  await page.setViewportSize({ width: 360, height: 900 });
  expect((await remove.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await expect(page.getByRole("group", { name: "Right-to-left tags" })).toHaveCSS("direction", "rtl");
  const touch = await browser.newContext({ hasTouch: true, viewport: { width: 1280, height: 900 } });
  try {
    const touchPage = await touch.newPage();
    await touchPage.goto(new URL("/#tags", page.url()).href);
    expect((await touchPage.getByRole("button", { name: "Remove Design", exact: true }).boundingBox())?.height).toBeGreaterThanOrEqual(44);
  } finally { await touch.close(); }
});

test("action groups retain normal Tab order and skip links focus the destination", async ({ page }) => {
  await page.goto("/#toolbar");
  const group = page.getByRole("group", { name: "Draft actions", exact: true });
  await group.getByRole("button", { name: "Save draft", exact: true }).focus();
  await page.keyboard.press("Tab");
  const preview = group.getByRole("button", { name: "Preview", exact: true });
  await expect(preview).toBeFocused();
  await preview.press("Enter");
  await expect(page.locator(".foundations-preview").getByRole("status")).toHaveText("Preview opened.");
  await preview.press("Tab");
  await expect(group.getByRole("button", { name: "Archive", exact: true })).toBeFocused();
  await expect(group.getByRole("button", { name: "Publish", exact: true })).toBeDisabled();
  await page.goto("/#accessibility");
  const skip = page.getByRole("link", { name: "Skip to example content", exact: true });
  await skip.focus();
  await expect(skip).toBeInViewport();
  for (const modifier of ["ctrlKey", "metaKey", "shiftKey", "altKey"]) {
    await skip.evaluate((element, key) => {
      // Suppress the synthetic event's native fragment navigation after React
      // handles it, so this check isolates the component's focus behavior.
      document.addEventListener("click", event => event.preventDefault(), { once: true });
      element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, [key]: true }));
    }, modifier);
    await expect(skip).toBeFocused();
  }
  await skip.press("Enter");
  await expect(page.getByRole("region", { name: "Example content", exact: true })).toBeFocused();
  await page.locator(".foundations-preview").getByRole("button", { name: "Add project", exact: true }).click();
  await expect(page.locator(".foundations-preview").getByRole("status")).toHaveText("1 project update recorded.");
});
