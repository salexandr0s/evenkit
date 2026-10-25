import { expect, test } from "@playwright/test";

test("remote pages preserve totals, selected IDs and controlled sorting", async ({ page }) => {
  await page.goto("/#remote-data-table");
  const table = page.locator(".pk-data-table");
  await expect(table.getByRole("status")).toHaveText("1–5 of 12 records · 0 selected");
  await table.getByRole("checkbox", { name: "Select Meridian release", exact: true }).check();
  await table.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(table.getByRole("status")).toHaveText("6–10 of 12 records · 1 selected");
  await table.getByRole("checkbox", { name: "Select Atlas discovery", exact: true }).check();
  await expect(table.getByRole("group", { name: "Selected records", exact: true })).toContainText("2 selected");
  await table.getByRole("button", { name: "Sort by Project", exact: true }).click();
  await expect(table.getByRole("status")).toHaveText("1–5 of 12 records · 2 selected");
  await expect(table.locator("tbody tr").first()).toContainText("Aster research");
  await expect(table.getByRole("columnheader", { name: "Sort by Project" })).toHaveAttribute("aria-sort", "ascending");
  const search = table.getByRole("searchbox", { name: "Search remote projects" });
  await search.fill("Aster");
  await expect(table.getByRole("status")).toHaveText("1–1 of 1 record · 0 selected");
  await search.fill("");
  await expect(table.getByRole("status")).toHaveText("1–5 of 12 records · 0 selected");
  await table.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(table.getByRole("status")).toHaveText("6–10 of 12 records · 0 selected");
  await table.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(table.getByRole("status")).toHaveText("11–12 of 12 records · 0 selected");
  await table.getByRole("checkbox", { name: "Select all rows on this page", exact: true }).check();
  await table.getByRole("button", { name: "Archive selected" }).click();
  await expect(page.getByRole("status", { name: "Bulk action result" })).toHaveText("2 selected projects archived.");
  await expect(table.getByRole("status")).toHaveText("6–10 of 10 records · 0 selected");
});

test("remote search ignores late responses and recovers request failures", async ({ page }) => {
  await page.goto("/#remote-data-table");
  const table = page.locator(".pk-data-table");
  const search = table.getByRole("searchbox", { name: "Search remote projects" });
  await expect(table.getByRole("status")).toContainText("of 12 records");
  await search.fill("mer");
  await expect(table.getByRole("status")).toHaveText("Loading records…");
  await expect(search).toBeEnabled();
  await search.fill("Aster");
  await expect(table.getByRole("status")).toHaveText("1–1 of 1 record · 0 selected");
  await page.waitForTimeout(750); // The deliberately slow superseded request must have completed.
  await expect(table.locator("tbody")).toContainText("Aster research");
  await expect(table.locator("tbody")).not.toContainText("Meridian release");
  await page.getByRole("button", { name: "Fail next request", exact: true }).click();
  await expect(table.getByRole("alert")).toContainText("The sample request failed.");
  await table.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(table.getByRole("status")).toHaveText("1–1 of 1 record · 0 selected");
  await search.fill("no such project");
  await expect(table.getByText("No matching records", { exact: true })).toBeVisible();
  await table.getByRole("button", { name: "Clear search", exact: true }).last().click();
  await expect(search).toBeFocused();
  await expect(table.getByRole("status")).toHaveText("1–5 of 12 records · 0 selected");
});

test("display settings retain identifying columns and control density", async ({ page }) => {
  await page.goto("/#column-settings");
  const table = page.locator(".pk-data-table");
  await expect(table.getByRole("status")).toContainText("of 12 records");
  await table.getByRole("button", { name: "Display settings", exact: true }).click();
  const popover = page.locator(".pk-column-settings");
  await expect(popover.getByRole("checkbox", { name: "Project", exact: true })).toBeDisabled();
  await popover.getByRole("checkbox", { name: "Owner", exact: true }).uncheck();
  await popover.getByRole("combobox", { name: "Row spacing", exact: true }).click();
  await page.getByRole("option", { name: "Compact", exact: true }).click();
  await expect(popover.getByRole("combobox", { name: "Row spacing", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(table.getByRole("button", { name: "Display settings", exact: true })).toBeFocused();
  await expect(table.getByRole("columnheader", { name: "Sort by Owner", exact: true })).toHaveCount(0);
  await expect(table).toHaveAttribute("data-density", "compact");
  await expect(table.getByRole("columnheader", { name: "Sort by Project", exact: true })).toBeVisible();
});
