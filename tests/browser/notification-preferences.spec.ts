import { expect, test } from "@playwright/test";

test("preference saves preserve keyboard focus and failed drafts while enforcing channel policy", async ({ page }) => {
  await page.goto("/#notification-preferences");
  const form = page.getByRole("form", { name: "Notification preferences", exact: true });
  const email = form.getByRole("switch", { name: "Mentions and replies: Email", exact: true });
  const required = form.getByRole("switch", { name: "Account security: In app", exact: true });
  await expect(required).toBeChecked();
  await expect(required).toHaveAttribute("aria-disabled", "true");
  await required.focus(); await page.keyboard.press("Space");
  await expect(required).toBeChecked();
  await expect(required).toHaveAccessibleDescription(/Required by your workspace/);
  await expect(form.getByRole("switch", { name: "Mentions and replies: Push", exact: true })).toHaveAccessibleDescription(/Push delivery is not available/);
  await page.getByText("Example controls", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Fail the next preference save", exact: true }).check();
  await email.focus(); await page.keyboard.press("Space");
  await expect(email).toBeChecked();
  const save = form.getByRole("button", { name: "Save preferences", exact: true });
  await save.focus(); await page.keyboard.press("Enter");
  await expect(save).toBeFocused();
  await expect(form.getByRole("alert")).toContainText("The sample save failed.");
  const retry = form.getByRole("button", { name: "Retry save", exact: true });
  await expect(retry).toBeFocused();
  await expect(email).toBeChecked();
  await page.keyboard.press("Enter");
  await expect(form.getByText("Notification preferences saved.", { exact: true })).toBeVisible();
  await expect(form.getByRole("button", { name: "Save preferences", exact: true })).toBeFocused();
  await expect(page.getByRole("status", { name: "Completed preference saves" })).toHaveText("1");
});

test("cancel and context changes reject ignored-abort saves without taking external focus", async ({ page }) => {
  await page.goto("/#notification-preferences");
  await page.getByText("Example controls", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Use a slow preference response", exact: true }).check();
  await page.getByRole("checkbox", { name: "Ignore cancellation in sample request", exact: true }).check();
  const form = page.getByRole("form", { name: "Notification preferences", exact: true });
  const email = form.getByRole("switch", { name: "Mentions and replies: Email", exact: true });
  await email.click();
  await form.getByRole("button", { name: "Save preferences", exact: true }).click();
  await form.getByRole("button", { name: "Cancel save", exact: true }).click();
  await expect(form.getByRole("button", { name: "Save preferences", exact: true })).toBeFocused();
  await expect(email).toBeChecked();
  await form.getByRole("button", { name: "Save preferences", exact: true }).click();
  const change = page.getByRole("button", { name: "Change preference workspace", exact: true });
  await change.click();
  await expect(change).toBeFocused();
  await expect(email).not.toBeChecked();
  await page.waitForTimeout(1900);
  await expect(page.getByRole("status", { name: "Completed preference saves" })).toHaveText("0");
  await expect(email).not.toBeChecked();
  await expect(change).toBeFocused();
});

test("replacement snapshots and revoked permission invalidate pending saves", async ({ page }) => {
  await page.goto("/#notification-preferences");
  await page.getByText("Example controls", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Use a slow preference response", exact: true }).check();
  await page.getByRole("checkbox", { name: "Ignore cancellation in sample request", exact: true }).check();
  const form = page.getByRole("form", { name: "Notification preferences", exact: true });
  const email = form.getByRole("switch", { name: "Mentions and replies: Email", exact: true });
  await email.click();
  await form.getByRole("button", { name: "Save preferences", exact: true }).click();
  await page.getByRole("button", { name: "Reload saved preferences", exact: true }).click();
  await expect(email).not.toBeChecked();
  await email.click();
  await form.getByRole("button", { name: "Save preferences", exact: true }).click();
  const permission = page.getByRole("checkbox", { name: "View preferences without edit access", exact: true });
  await permission.check();
  await expect(email).toHaveAttribute("aria-disabled", "true");
  await expect(email).not.toBeChecked();
  await page.waitForTimeout(1900);
  await expect(page.getByRole("status", { name: "Completed preference saves" })).toHaveText("0");
  await expect(permission).toBeFocused();
});

test("long preference labels wrap in narrow RTL layouts with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#notification-preferences");
  await page.getByText("Example controls", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Use long category labels", exact: true }).check();
  await page.getByRole("checkbox", { name: "Use right-to-left layout", exact: true }).check();
  const preview = page.locator(".notification-preferences-preview");
  await expect(preview).toHaveCSS("direction", "rtl");
  await expect(page.getByRole("switch", { name: /^Project changes, review assignments.*: Email$/ })).toBeVisible();
  expect(await preview.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("schema removal restores focus from a removed switch and rejects its pending save", async ({ page }) => {
  await page.goto("/#notification-preferences");
  await page.getByText("Example controls", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Use a slow preference response", exact: true }).check();
  await page.getByRole("checkbox", { name: "Ignore cancellation in sample request", exact: true }).check();
  const form = page.getByRole("form", { name: "Notification preferences", exact: true });
  const email = form.getByRole("switch", { name: "Mentions and replies: Email", exact: true });
  await email.click();
  await form.getByRole("button", { name: "Save preferences", exact: true }).click();
  await email.focus();
  // Model a host schema update without moving focus to the example control.
  await page.getByRole("checkbox", { name: "Remove email channel", exact: true }).evaluate(element => (element as HTMLButtonElement).click());
  await expect(email).toHaveCount(0);
  await expect(form.getByRole("button", { name: "Save preferences", exact: true })).toBeFocused();
  await page.waitForTimeout(1900);
  await expect(page.getByRole("status", { name: "Completed preference saves" })).toHaveText("0");
});
