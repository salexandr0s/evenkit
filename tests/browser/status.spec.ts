import { expect, test } from "@playwright/test";

test("persistent feedback supports keyboard recovery, dismissal and cancellation without losing focus", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-25T08:00:00Z") });
  await page.goto("/#status");
  await page.clock.pauseAt(new Date("2026-10-25T09:00:00Z"));
  const recovery = page.getByRole("region", { name: "Export recovery example" });
  const retry = recovery.getByRole("button", { name: "Retry export", exact: true });
  const dismiss = recovery.getByRole("button", { name: "Dismiss message", exact: true });
  const reset = recovery.getByRole("button", { name: "Reset example", exact: true });
  await expect(recovery.getByRole("alert")).toContainText("Export did not finish");
  await expect(recovery.getByRole("alert").locator("svg")).toHaveAttribute("aria-hidden", "true");
  const notes = page.getByRole("region", { name: "Static message examples" });
  await expect(notes.getByRole("note")).toHaveCount(4);
  await expect(notes.getByRole("note").filter({ hasText: "Text without an icon" }).locator("svg")).toHaveCount(0);

  await retry.press("Enter");
  await expect(retry).toBeDisabled();
  await expect(retry).toHaveAttribute("aria-busy", "true");
  await expect(dismiss).toBeFocused();
  await expect(recovery.getByRole("status")).toContainText("Retrying export");
  // Completion must leave a user who moved away on their chosen control.
  await reset.focus();
  await page.clock.runFor(1000);
  await expect(recovery.getByRole("status")).toContainText("Export ready");
  await expect(retry).toHaveCount(0);
  await expect(reset).toBeFocused();
  await dismiss.press("Enter");
  await expect(reset).toBeFocused();
  await expect(recovery.getByRole("status")).toHaveText("Message dismissed.");

  // Dismissing while work is pending must not resurrect the message later.
  await reset.press("Enter");
  await retry.press("Enter");
  await dismiss.press("Enter");
  await page.clock.runFor(1000);
  await expect(recovery.getByRole("status")).toHaveText("Message dismissed.");
  await expect(reset).toBeFocused();

  // Reset also cancels the previous request instead of accepting its stale result.
  await reset.press("Enter");
  await retry.press("Enter");
  await reset.press("Enter");
  await page.clock.runFor(1000);
  await expect(recovery.getByRole("alert")).toContainText("Export did not finish");
  await expect(retry).toBeEnabled();
  await expect(reset).toBeFocused();
});

test("badges retain compact geometry while longer feedback and RTL content fit narrow layouts", async ({ page }) => {
  await page.goto("/#status");
  const badges = page.getByRole("region", { name: "Badge examples" });
  for (const [label, height] of [["Small", 20], ["Medium", 24], ["Reviewed", 24]] as const) {
    const badge = badges.locator(".pk-badge").filter({ hasText: new RegExp(`^${label}$`) });
    expect((await badge.boundingBox())?.height).toBe(height);
    await expect(badge).not.toHaveAttribute("role");
  }
  const approved = badges.locator(".pk-badge").filter({ hasText: /^Approved$/ });
  await expect(approved.locator("svg")).toHaveCount(1);
  await expect(approved.locator(".pk-badge-dot")).toHaveCount(0);
  const rtl = page.locator('.status-message-grid [dir="rtl"]');
  const icon = await rtl.locator(".pk-action-message-icon").boundingBox();
  const body = await rtl.locator(".pk-action-message-content").boundingBox();
  expect(icon!.x).toBeGreaterThanOrEqual(body!.x + body!.width);

  const warning = page.getByRole("note").filter({ hasText: "Review before sharing" });
  const initialColor = await warning.evaluate(element => getComputedStyle(element).backgroundColor);
  await page.getByRole("combobox", { name: "Theme", exact: true }).click();
  await page.getByRole("option", { name: "Grove", exact: true }).click();
  await page.getByRole("button", { name: "Switch to dark mode", exact: true }).click();
  await expect(warning).not.toHaveCSS("background-color", initialColor);

  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator(".status-workbench .pk-badge, .status-workbench .pk-action-message, .status-workbench .pk-action-message-actions").evaluateAll(elements => elements.every(element => element.scrollWidth <= element.clientWidth))).toBe(true);
    if (width === 360) {
      const long = badges.locator(".pk-badge").filter({ hasText: "Awaiting approval" });
      expect((await long.boundingBox())?.height).toBeGreaterThan(24);
      for (const button of await page.getByRole("region", { name: "Export recovery example" }).getByRole("button").all()) {
        expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      }
    }
  }
});
