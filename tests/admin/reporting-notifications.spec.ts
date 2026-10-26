import { expect, test, type Page } from "@playwright/test";

async function controls(page: Page) {
  const panel = page.locator(".starter-demo-controls");
  if (await panel.getAttribute("open") === null) await panel.getByText("Demo controls", { exact: true }).click();
}
async function workspace(page: Page, name: string) {
  await page.getByRole("button", { name: /^Switch workspace:/ }).click();
  await page.getByRole("button", { name: new RegExp(name) }).click();
}

test("report filters and exports recover from failures and cancel without stale results", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Workspace report", exact: true })).toBeVisible();
  const period = page.getByRole("combobox", { name: "Reporting period", exact: true });
  await period.click();
  await page.getByRole("option", { name: "Last 4 weeks", exact: true }).click();
  await controls(page);
  await page.getByRole("button", { name: "Fail next request", exact: true }).click();
  await page.getByRole("button", { name: "Apply report", exact: true }).click();
  await expect(page.getByRole("region", { name: "Workspace dashboard" }).getByRole("alert")).toContainText("sample service");
  await page.getByRole("button", { name: "Retry report", exact: true }).click();
  await expect(page.getByText("Report updated.", { exact: true })).toBeVisible();
  await page.getByText("View data table", { exact: true }).click();
  await expect(page.getByRole("table")).toContainText("Week 4");
  await page.getByRole("button", { name: "Fail next request", exact: true }).click();
  await page.getByRole("button", { name: "Export report", exact: true }).click();
  await page.getByRole("button", { name: "Retry export", exact: true }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download export", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("northstar-month-activity.csv");
  expect(await download.failure()).toBeNull();
  await page.getByRole("switch", { name: "Slow requests", exact: true }).click();
  await page.getByRole("button", { name: "Prepare another export", exact: true }).click();
  await page.getByRole("button", { name: "Cancel export", exact: true }).click();
  await expect(page.getByRole("button", { name: "Export report", exact: true })).toBeFocused();
  await expect(page.getByRole("link", { name: "Download export", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Apply report", exact: true }).click();
  await page.getByRole("button", { name: "Cancel report update", exact: true }).click();
  await expect(page.getByText("Report update cancelled. The previous report is still shown.", { exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Apply report", exact: true }).click();
  await workspace(page, "Harbor Workshop");
  await expect(period).toHaveText(/Last 7 days/);
  await expect(page.getByText("Report updated.", { exact: true })).toHaveCount(0);
});

test("notification read state and delivery preferences remain scoped across navigation and requests", async ({ page }) => {
  await page.goto("/notifications");
  const mark = page.getByRole("button", { name: "Mark Community field guide needs a review as read", exact: true });
  await expect(mark).toBeVisible();
  await controls(page);
  await page.getByRole("button", { name: "Fail next request", exact: true }).click();
  await mark.click();
  await page.getByRole("button", { name: "Retry notification request", exact: true }).click();
  await expect(page.getByRole("button", { name: "Mark Community field guide needs a review as unread", exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Admin navigation", exact: true }).getByRole("link", { name: "Dashboard", exact: true }).click();
  await page.getByRole("navigation", { name: "Admin navigation", exact: true }).getByRole("link", { name: "Notifications", exact: true }).click();
  await expect(page.getByRole("button", { name: "Mark Community field guide needs a review as unread", exact: true })).toBeVisible();
  await controls(page);
  await page.getByRole("switch", { name: "Slow requests", exact: true }).click();
  await page.getByRole("button", { name: "Mark Community field guide needs a review as unread", exact: true }).click();
  await page.getByRole("button", { name: "Cancel notification request", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Notification inbox", exact: true })).toBeFocused();
  await expect(page.getByRole("button", { name: "Mark Community field guide needs a review as unread", exact: true })).toBeVisible();
  await controls(page);
  await page.getByRole("switch", { name: "Slow requests", exact: true }).click();
  await page.getByRole("tab", { name: "Preferences", exact: true }).click();
  const email = page.getByRole("switch", { name: "Record updates: Email", exact: true });
  const original = await email.getAttribute("aria-checked");
  await email.click();
  await page.getByRole("button", { name: "Fail next request", exact: true }).click();
  await page.getByRole("button", { name: "Save preferences", exact: true }).click();
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(page.getByText("Notification preferences saved.", { exact: true })).toBeVisible();
  await workspace(page, "Harbor Workshop");
  await page.getByRole("tab", { name: "Preferences", exact: true }).click();
  await expect(email).toHaveAttribute("aria-checked", original ?? "true");
  await workspace(page, "Northstar Studio");
  await page.getByRole("tab", { name: "Preferences", exact: true }).click();
  await expect(email).toHaveAttribute("aria-checked", original === "true" ? "false" : "true");
});

test("report completion restores focus from the removed cancellation control", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Workspace report", exact: true })).toBeVisible();
  await controls(page);
  await page.getByRole("switch", { name: "Slow requests", exact: true }).click();
  await page.getByRole("button", { name: "Apply report", exact: true }).click();
  const cancel = page.getByRole("button", { name: "Cancel report update", exact: true });
  await cancel.focus();
  await expect(cancel).toHaveCount(0);
  await expect(page.getByText("Report updated.", { exact: true })).toBeFocused();
});
