import { expect, test, type Locator } from "@playwright/test";

async function bounds(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

async function finishEntrance(dialog: Locator) {
  await dialog.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
}

async function observeDialogExit(dialog: Locator) {
  return dialog.evaluateHandle(element => {
    const overlay = document.querySelector(".pk-dialog-overlay");
    if (!overlay) throw new Error("Missing dialog backdrop.");
    function watch(surface: Element, animationName: string) {
      const result = { connected: false, pointerEvents: "", animation: "", duration: "", paused: false, endedWhileConnected: false };
      const observer = new MutationObserver(() => {
        if (surface.getAttribute("data-state") !== "closed") return;
        const style = getComputedStyle(surface);
        Object.assign(result, { connected: surface.isConnected, pointerEvents: style.pointerEvents, animation: style.animationName, duration: style.animationDuration });
        for (const animation of surface.getAnimations()) {
          if (animation instanceof CSSAnimation && animation.animationName === animationName) {
            animation.pause();
            result.paused = animation.playState === "paused";
          }
        }
        observer.disconnect();
      });
      observer.observe(surface, { attributes: true, attributeFilter: ["data-state"] });
      surface.addEventListener("animationend", event => {
        if (event.target === surface && event instanceof AnimationEvent && event.animationName === animationName) result.endedWhileConnected = surface.isConnected;
      }, { capture: true });
      return result;
    }
    return { content: watch(element, "pk-dialog-out"), overlay: watch(overlay, "pk-dialog-backdrop-out") };
  });
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
  await finishEntrance(dialog);
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
  await finishEntrance(dialog);
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
      await finishEntrance(dialog);
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
    await finishEntrance(touchPage.getByRole("dialog"));
    const close = await bounds(touchPage.getByRole("button", { name: "Close RTL dialog", exact: true }));
    expect(close.width).toBeGreaterThanOrEqual(44);
    expect(close.height).toBeGreaterThanOrEqual(44);
  } finally {
    await touch.close();
  }
});

test("dialog exits block submission, restore focus, and can be interrupted without duplicate surfaces", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#dialog");
  const trigger = page.getByRole("button", { name: "Edit project", exact: true });
  const dialog = page.getByRole("dialog", { name: "Edit project", exact: true });
  const overlay = page.locator(".pk-dialog-overlay");
  const name = dialog.getByRole("textbox", { name: "Project name", exact: true });
  await trigger.click();
  await expect(name).toBeFocused();
  await expect(dialog).toHaveCSS("animation-name", "pk-dialog-in");
  await expect(dialog).toHaveCSS("animation-duration", "0.16s");
  await expect(overlay).toHaveCSS("animation-name", "pk-dialog-backdrop-in");
  await expect(overlay).toHaveCSS("animation-duration", "0.16s");
  await finishEntrance(dialog);
  await name.fill("Unsaved exit edit");
  const exit = await observeDialogExit(dialog);
  try {
    await page.keyboard.press("Escape");
    await expect.poll(() => exit.jsonValue()).toEqual({
      content: { connected: true, pointerEvents: "none", animation: "pk-dialog-out", duration: "0.12s", paused: true, endedWhileConnected: false },
      overlay: { connected: true, pointerEvents: "none", animation: "pk-dialog-backdrop-out", duration: "0.12s", paused: true, endedWhileConnected: false },
    });
    await expect(name).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".dialog-project-summary strong")).toHaveText("Spring launch");
    await page.locator(".pk-dialog-content, .pk-dialog-overlay").evaluateAll(elements => {
      for (const element of elements) for (const animation of element.getAnimations()) animation.play();
    });
    await expect.poll(() => exit.jsonValue()).toMatchObject({ content: { endedWhileConnected: true }, overlay: { endedWhileConnected: true } });
    await expect(dialog).toHaveCount(0);
    await expect(overlay).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
  } finally {
    await exit.dispose();
  }

  await trigger.click();
  await expect(name).toHaveValue("Spring launch");
  await expect(name).toBeFocused();
  await finishEntrance(dialog);
  const interrupted = await observeDialogExit(dialog);
  try {
    await page.keyboard.press("Escape");
    await expect.poll(() => interrupted.jsonValue()).toMatchObject({ content: { paused: true }, overlay: { paused: true } });
    await page.getByRole("button", { name: "Edit project", exact: true, includeHidden: true }).evaluate((element: HTMLButtonElement) => { element.focus(); element.click(); });
    await expect(dialog).toHaveAttribute("data-state", "open");
    await expect(overlay).toHaveAttribute("data-state", "open");
    await expect(page.locator(".pk-dialog-content")).toHaveCount(1);
    await expect(overlay).toHaveCount(1);
    await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
    await finishEntrance(dialog);
  } finally {
    await interrupted.dispose();
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(overlay).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await trigger.click();
  await expect(name).toBeFocused();
  await expect(dialog).toHaveCSS("animation-duration", "0s");
  await expect(overlay).toHaveCSS("animation-duration", "0s");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(overlay).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
});
