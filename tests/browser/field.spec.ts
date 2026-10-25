import { expect, test } from "@playwright/test";

test("input adornments preserve identity and focus, and field states fit narrow screens", async ({ page, browser }) => {
  await page.goto("/#fields");
  const alias = page.getByRole("textbox", { name: "Project alias", exact: true });
  const originalInput = await alias.elementHandle();
  if (!originalInput) throw new Error("Missing alias input.");
  await alias.focus();
  await alias.pressSequentially("release");
  await expect(alias).toBeFocused();
  await expect(alias).toHaveValue("release");
  expect(await alias.evaluate((element, original) => element === original, originalInput)).toBe(true);
  await alias.press("Tab");
  const clear = page.getByRole("button", { name: "Clear project alias", exact: true });
  await expect(clear).toBeFocused();
  await clear.press("Enter");
  await expect(alias).toBeFocused();
  await expect(alias).toHaveValue("");
  await expect(clear).not.toBeVisible();
  expect(await alias.evaluate((element, original) => element === original, originalInput)).toBe(true);
  await originalInput.dispose();

  const readOnly = page.getByRole("textbox", { name: "Workspace reference", exact: true });
  const disabled = page.getByRole("textbox", { name: "Workspace ID", exact: true });
  await expect(readOnly).not.toBeDisabled();
  await expect(readOnly).not.toBeEditable();
  await readOnly.focus();
  await expect(readOnly).toBeFocused();
  await expect(disabled).toBeDisabled();
  const email = page.getByRole("textbox", { name: "Contact email", exact: true });
  await expect(email).toHaveAccessibleName("Contact email");
  await email.focus();
  await expect(email).toBeFocused();

  const sizes = [["Small field", 32], ["Medium field", 40], ["Large field", 48]] as const;
  for (const [label, height] of sizes) {
    expect((await page.getByRole("textbox", { name: label, exact: true }).boundingBox())?.height).toBe(height);
  }
  // Long multiline messages and compound inputs must remain usable at the contract widths.
  await page.getByRole("textbox", { name: "Notes", exact: true }).fill("Short");
  await page.getByRole("button", { name: "Submit preview" }).click();
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 360, height: 900 });
  const longParts = page.getByRole("textbox", { name: "Long address parts", exact: true });
  const longGroup = longParts.locator("..");
  expect(await longGroup.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  expect((await longParts.boundingBox())?.width).toBeGreaterThanOrEqual(64);
  for (const slot of await longGroup.locator(".pk-input-adornment").all()) {
    expect(await slot.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  }
  const rtl = page.getByRole("textbox", { name: "Right-to-left address", exact: true });
  await expect(rtl).toHaveAttribute("dir", "rtl");
  await expect(rtl.locator("..")).toHaveCSS("direction", "rtl");
  const nativeBox = await rtl.boundingBox();
  const startBox = await rtl.locator("..").locator('[data-side="start"]').boundingBox();
  const endBox = await rtl.locator("..").locator('[data-side="end"]').boundingBox();
  if (!nativeBox || !startBox || !endBox) throw new Error("Missing RTL adornment geometry.");
  expect(startBox.x).toBeGreaterThanOrEqual(nativeBox.x + nativeBox.width - 1);
  expect(endBox.x + endBox.width).toBeLessThanOrEqual(nativeBox.x + 1);
  for (const [label, height] of sizes) {
    expect((await page.getByRole("textbox", { name: label, exact: true }).boundingBox())?.height).toBe(Math.max(44, height));
  }
  await alias.fill("narrow");
  expect((await clear.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await expect(clear).toBeInViewport();
  await clear.click();
  await expect(alias).toBeFocused();

  const touch = await browser.newContext({ hasTouch: true, viewport: { width: 1280, height: 900 } });
  try {
    const touchPage = await touch.newPage();
    await touchPage.goto(new URL("/#fields", page.url()).href);
    for (const [label, height] of sizes) {
      expect((await touchPage.getByRole("textbox", { name: label, exact: true }).boundingBox())?.height).toBe(Math.max(44, height));
    }
  } finally {
    await touch.close();
  }
});
