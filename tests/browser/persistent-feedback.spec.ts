import { expect, test } from "@playwright/test";
import { themeNames, themes } from "@evenkit/tokens";

test("banner retry retains focus and dismissal restores the page heading", async ({ page }) => {
  await page.goto("/#persistent-banner");
  const banner = page.getByRole("region", { name: "Scheduled maintenance", exact: true });
  await page.getByRole("checkbox", { name: "Fail the next request" }).check();
  const dismiss = banner.getByRole("button", { name: "Dismiss notice", exact: true });
  await dismiss.focus(); await page.keyboard.press("Enter");
  await expect(dismiss).toBeFocused();
  await expect(banner.getByText("The sample request failed. The notice remains available.", { exact: true })).toBeVisible();
  await expect(dismiss).toBeFocused();
  const retry = banner.getByRole("button", { name: "Retry action", exact: true });
  await retry.focus(); await page.keyboard.press("Space");
  await expect(retry).toBeFocused();
  await expect(banner).toBeHidden();
  await expect(page.getByRole("heading", { name: "Meridian Studio", exact: true })).toBeFocused();
});

test("banner rejects stale success and failure after context and permission changes", async ({ page }) => {
  await page.goto("/#persistent-banner");
  await page.clock.install();
  await page.getByRole("checkbox", { name: "Use a slow response" }).check();
  const action = page.getByRole("button", { name: "Review scheduled maintenance and preparation instructions", exact: true });
  await action.click();
  await page.getByRole("button", { name: "Switch notification context", exact: true }).click();
  await page.clock.fastForward(3000);
  await expect(page.locator(".persistent-feedback-result")).toHaveText("Completed actions in this workspace: 0");
  await page.getByRole("checkbox", { name: "Fail the next request" }).check();
  await action.click();
  await page.getByRole("checkbox", { name: "Allow recovery action" }).uncheck();
  await page.clock.fastForward(3000);
  await expect(page.getByText("Action could not be completed", { exact: true })).toHaveCount(0);
  await expect(action).toHaveAttribute("aria-disabled", "true");
  await expect(action).toHaveAccessibleDescription("Only workspace owners can perform this action.");
  await action.focus(); await page.keyboard.press("Enter");
  await page.clock.fastForward(3000);
  await expect(page.locator(".persistent-feedback-result")).toContainText(": 0");
});

test("connection state invalidates recovery and keeps critical information visible", async ({ page }) => {
  await page.goto("/#connection-status");
  await page.clock.install();
  await page.getByRole("checkbox", { name: "Use a slow response" }).check();
  await page.getByRole("button", { name: "Check connection", exact: true }).click();
  const choose = async (label: string) => {
    await page.getByRole("combobox", { name: "Application status", exact: true }).click();
    await page.getByRole("option", { name: label, exact: true }).click();
  };
  await choose("Reconnecting"); await page.clock.fastForward(3000);
  await expect(page.locator(".persistent-feedback-result")).toContainText(": 0");
  await expect(page.getByRole("region", { name: "Reconnecting", exact: true })).toBeVisible();
  await choose("Stale data");
  await expect(page.getByRole("region", { name: "Data may be out of date", exact: true })).toBeVisible();
  await choose("Session expiring");
  const notice = page.getByRole("region", { name: "Your session is expiring", exact: true });
  await page.clock.fastForward(60_000);
  await expect(notice).toContainText("14:30 Europe/Vienna");
  await expect(notice.getByRole("button", { name: "Continue session", exact: true })).toBeVisible();
  await expect(notice.getByRole("button", { name: "Dismiss notice" })).toHaveCount(0);
});

test("indicators expose presence text and the exact unread count", async ({ page }) => {
  await page.goto("/#presence-unread");
  await expect(page.getByRole("button", { name: "Open notifications 128 unread notifications", exact: true })).toBeVisible();
  await expect(page.locator(".pk-presence-indicator")).toHaveCount(4);
  await expect(page.getByText("Alex Morgan is online", { exact: true })).toBeVisible();
  await expect(page.getByText("Taylor Novak is offline", { exact: true })).toBeVisible();
  const snapshot = await page.locator(".persistent-feedback-preview").ariaSnapshot();
  expect(snapshot).toContain("128 unread notifications");
  expect(snapshot).not.toContain("99+");
});

test("notification family preserves neutral surfaces, theme accents, RTL and responsive geometry", async ({ page }) => {
  test.setTimeout(120_000);
  const ids = ["notification-center", "notification-preferences", "persistent-banner", "connection-status", "presence-unread"];
  const rgb = (hex: string) => `rgb(${[1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16)).join(", ")})`;
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  for (const id of ids) {
    await page.goto(`/#${id}`);
    const preview = page.locator(".catalog-preview-content");
    await expect(preview).not.toBeEmpty();
    await page.evaluate(() => window.scrollTo(0, 0));
    for (const theme of themeNames) {
      await page.getByRole("combobox", { name: "Theme", exact: true }).click();
      await page.getByRole("option", { name: themes[theme].name, exact: true }).click();
      for (const mode of ["light", "dark"] as const) {
        const toggle = page.getByRole("button", { name: `Switch to ${mode} mode`, exact: true });
        if (await toggle.count()) await toggle.click();
        const surface = preview.locator(".pk-notification-toolbar, .pk-notification-preference-category, .pk-persistent-banner > .pk-action-message").first();
        if (await surface.count()) await expect(surface).toHaveCSS("background-color", rgb(themes.neutral.modes[mode].surface));
        const accent = preview.locator('.pk-badge[data-tone="accent"]').first();
        if (await accent.count()) await expect(accent).toHaveCSS("color", rgb(themes[theme].modes[mode].accent));
        const unread = preview.locator('.pk-notification-item[data-unread] .pk-notification-read-state .pk-icon').first();
        if (await unread.count()) await expect(unread).toHaveCSS("color", rgb(themes[theme].modes[mode].accent));
        const checked = preview.locator('.pk-switch-control[data-state="checked"] .pk-switch-track').first();
        if (await checked.count()) await expect(checked).toHaveCSS("background-color", rgb(themes[theme].modes[mode].accent));
      }
    }
    if (id === "notification-center") await page.getByRole("checkbox", { name: "Use long notification labels", exact: true }).check();
    await page.evaluate(() => { document.documentElement.dir = "rtl"; });
    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(await preview.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    }
    await page.setViewportSize({ width: 360, height: 1000 });
    const controls = preview.locator('button:not([role="switch"]):visible');
    for (const button of await controls.all()) {
      const box = await button.boundingBox();
      if (box) expect(box.height).toBeGreaterThanOrEqual(44);
    }
    if (id === "persistent-banner") await page.screenshot({ path: ".artifacts/notifications-banner-rtl-mobile.png", fullPage: true });
    await page.evaluate(() => { document.documentElement.dir = "ltr"; });
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  await page.goto("/#persistent-banner");
  await page.getByRole("checkbox", { name: "Use a slow response" }).check();
  await page.getByRole("button", { name: "Dismiss notice", exact: true }).click();
  await expect(page.locator(".pk-persistent-banner .pk-spinner")).toHaveCSS("animation-name", "none");
});
