import { expect, test, type Locator } from "@playwright/test";

async function bounds(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

test("long dialog keeps actions visible and falls back to reachable whole-content scrolling in short windows", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#dialog");
  const trigger = page.getByRole("button", { name: "Review project brief", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Review project brief", exact: true });
  const body = dialog.locator(".pk-dialog-body");
  const title = dialog.getByRole("heading", { name: "Review project brief", exact: true });
  const notes = dialog.getByRole("textbox", { name: "Review notes" });
  const close = dialog.getByRole("button", { name: "Close brief", exact: true });
  await expect(title).toBeFocused();
  expect((await bounds(dialog)).width).toBe(720);
  expect(await body.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
  const titleBefore = await bounds(title);
  const closeBefore = await bounds(close);
  expect(closeBefore.y + closeBefore.height).toBeLessThan(900);

  await page.keyboard.press("Tab");
  await expect(notes).toBeFocused();
  expect(await body.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  expect((await bounds(title)).y).toBe(titleBefore.y);
  expect((await bounds(close)).y).toBe(closeBefore.y);
  await notes.fill("Ready for review.");
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await close.press("Enter");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();

  // On a short landscape viewport, all content must scroll instead of clipping.
  await page.setViewportSize({ width: 768, height: 400 });
  await trigger.click();
  await expect(title).toBeFocused();
  expect(await dialog.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
  await page.keyboard.press("Tab");
  await expect(notes).toBeFocused();
  const dialogBox = await bounds(dialog);
  const notesBox = await bounds(notes);
  expect(notesBox.y).toBeGreaterThanOrEqual(dialogBox.y);
  expect(notesBox.y + notesBox.height).toBeLessThanOrEqual(dialogBox.y + dialogBox.height);
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  const closeBox = await bounds(close);
  expect(closeBox.y).toBeGreaterThanOrEqual(dialogBox.y);
  expect(closeBox.y + closeBox.height).toBeLessThanOrEqual(dialogBox.y + dialogBox.height);
  await close.press("Enter");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("dialog sizes stay within narrow screens and RTL close controls use the leading edge", async ({ page, browser }) => {
  await page.goto("/#dialog");
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [triggerName, expectedWidth] of [["Edit project", 560], ["Review project brief", 720], ["Open RTL dialog", 420]] as const) {
      const trigger = page.getByRole("button", { name: triggerName, exact: true });
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const box = await bounds(dialog);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      if (width >= 768) expect(box.width).toBe(expectedWidth);
      expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
      if (triggerName === "Open RTL dialog") {
        await expect(dialog).toHaveAttribute("dir", "rtl");
        const close = dialog.getByRole("button", { name: "Close RTL dialog", exact: true });
        const closeBox = await bounds(close);
        expect(closeBox.x - box.x).toBeGreaterThanOrEqual(12);
        expect(closeBox.x - box.x).toBeLessThanOrEqual(14);
        const title = dialog.locator(".pk-dialog-title");
        const textStart = await title.evaluate(element => element.getBoundingClientRect().left + parseFloat(getComputedStyle(element).paddingLeft));
        expect(textStart).toBeGreaterThanOrEqual(closeBox.x + closeBox.width);
        if (width === 360) expect(closeBox.width).toBeGreaterThanOrEqual(44);
      }
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }

  const touch = await browser.newContext({ viewport: { width: 1280, height: 900 }, hasTouch: true });
  try {
    const touchPage = await touch.newPage();
    await touchPage.goto(new URL("/#dialog", page.url()).href);
    await touchPage.getByRole("button", { name: "Open RTL dialog", exact: true }).click();
    const close = await bounds(touchPage.getByRole("button", { name: "Close RTL dialog", exact: true }));
    expect(close.width).toBeGreaterThanOrEqual(44);
    expect(close.height).toBeGreaterThanOrEqual(44);
  } finally {
    await touch.close();
  }
});
