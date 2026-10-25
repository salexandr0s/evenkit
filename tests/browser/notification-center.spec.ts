import { expect, test } from "@playwright/test";

test("notification selection is page scoped and preserves unavailable notifications", async ({ page }) => {
  await page.goto("/#notification-center");
  const center = page.getByRole("region", { name: "Notifications", exact: true });
  const select = center.getByRole("checkbox", { name: "Select this page", exact: true });
  await select.focus();
  await page.keyboard.press("Space");
  await expect(center.getByRole("checkbox", { name: "Select Release plan ready for review", exact: true })).toBeChecked();
  await expect(center.getByRole("checkbox", { name: "Select Workspace retention policy", exact: true })).toBeDisabled();
  await expect(center.getByRole("button", { name: "Manage policy: Workspace retention policy", exact: true })).toHaveAccessibleDescription("Administrator access required.");
  await center.getByRole("button", { name: "Mark all on this page as read", exact: true }).click();
  await expect(center.getByRole("status").first()).toHaveText("1 notification marked as read.");
  await expect(center.getByRole("button", { name: "Mark Release plan ready for review as unread", exact: true })).toBeVisible();
  await expect(center.getByRole("button", { name: "Mark Workspace retention policy as read", exact: true })).toBeDisabled();
  await center.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(center.getByRole("button", { name: "Mark Cedar handover completed as read", exact: true })).toBeVisible();
  await expect(center.getByRole("status").first()).toHaveText("Page 2 loaded.");
  await expect(center.getByText("0 selected on this page.", { exact: false })).toBeVisible();
  await expect(center.getByRole("heading", { name: "Notifications", exact: true })).toBeFocused();
  await center.getByRole("button", { name: "Previous page", exact: true }).click();
  await expect(select).not.toBeChecked();
});

test("notification actions retain focus while pending and offer persistent retry", async ({ page }) => {
  await page.goto("/#notification-center");
  await page.clock.install();
  const center = page.getByRole("region", { name: "Notifications", exact: true });
  await page.getByRole("checkbox", { name: "Fail the next notification request", exact: true }).check();
  const read = center.getByRole("button", { name: "Mark Release plan ready for review as read", exact: true });
  await read.focus();
  await page.keyboard.press("Enter");
  await expect(read).toBeFocused();
  await expect(read).toHaveAttribute("aria-disabled", "true");
  await page.clock.fastForward(350);
  await expect(center.getByRole("alert")).toContainText("sample connection failed");
  await expect(read).toBeFocused();
  await center.getByRole("button", { name: "Retry notification request", exact: true }).click();
  await page.clock.fastForward(350);
  await expect(center.getByRole("button", { name: "Mark Release plan ready for review as unread", exact: true })).toBeVisible();
  await expect(center.getByRole("heading", { name: "Notifications", exact: true })).toBeFocused();
  await center.getByRole("button", { name: "Open project: Release plan ready for review", exact: true }).click();
  await page.clock.fastForward(350);
  await expect(page.getByText("Opened Meridian release.", { exact: true })).toBeVisible();
});

test("late notification results cannot cross context or permission changes", async ({ page }) => {
  await page.goto("/#notification-center");
  await page.clock.install();
  const center = page.getByRole("region", { name: "Notifications", exact: true });
  await page.getByRole("checkbox", { name: "Use a slow notification response", exact: true }).check();
  const read = center.getByRole("button", { name: "Mark Release plan ready for review as read", exact: true });
  await read.click();
  const change = page.getByRole("button", { name: "Change notification workspace", exact: true });
  await change.click();
  await page.clock.fastForward(3000);
  await expect(read).toBeVisible();
  await expect(change).toBeFocused();
  await center.getByRole("checkbox", { name: "Select this page", exact: true }).check();
  await read.click();
  const revoke = page.getByRole("checkbox", { name: "Revoke notification permissions", exact: true });
  await revoke.check();
  await page.clock.fastForward(3000);
  await expect(read).toBeDisabled();
  await revoke.uncheck();
  await expect(read).toBeEnabled();
  await expect(center.getByText("0 selected on this page.", { exact: false })).toBeVisible();
  await center.getByRole("button", { name: "Next page", exact: true }).click();
  await change.click();
  await page.clock.fastForward(3000);
  await expect(read).toBeVisible();
  await expect(center.getByRole("heading", { name: "Cedar handover completed", exact: true })).toHaveCount(0);
});

test("notification page failures recover and empty state remains available", async ({ page }) => {
  await page.goto("/#notification-center");
  const center = page.getByRole("region", { name: "Notifications", exact: true });
  await page.getByRole("checkbox", { name: "Fail the next notification request", exact: true }).check();
  await center.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(center.getByRole("alert")).toContainText("Page could not be loaded");
  await expect(center.getByRole("heading", { name: "Release plan ready for review", exact: true })).toBeVisible();
  await center.getByRole("button", { name: "Retry notification request", exact: true }).click();
  await expect(center.getByRole("heading", { name: "Cedar handover completed", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Show notification loading failure", exact: true }).click();
  await center.getByRole("button", { name: "Retry loading notifications", exact: true }).click();
  await expect(center.getByRole("alert")).toHaveCount(0);
  await page.getByRole("button", { name: "Show empty inbox", exact: true }).click();
  await expect(center.getByText("No notifications", { exact: true })).toBeVisible();
});
