import { expect, test, type Page } from "@playwright/test";

async function choose(page: Page, label: string, value: string) {
  const trigger = page.getByRole("combobox", { name: label, exact: true });
  await trigger.click();
  await page.getByRole("option", { name: value, exact: true }).click();
  await expect(trigger).toBeFocused();
}

test("table keeps selection with IDs through numeric sorting, search, and pagination", async ({ page }) => {
  await page.goto("/#data-table");
  const table = page.locator(".pk-data-table");
  const search = table.getByRole("searchbox", { name: "Search projects" });
  await table.getByRole("checkbox", { name: "Select Spring launch", exact: true }).check();
  await table.getByRole("button", { name: "Sort by Members", exact: true }).click();
  await expect(table.locator("tbody tr").first()).toContainText("Product notes");
  await expect(table.getByRole("columnheader", { name: "Sort by Members" })).toHaveAttribute("aria-sort", "ascending");
  await table.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(table.getByRole("checkbox", { name: "Select Spring launch", exact: true })).toBeChecked();
  await search.fill("Spring launch");
  await expect(table.getByText("Page 1 of 1", { exact: true })).toBeVisible();
  await expect(table.getByRole("checkbox", { name: "Select Spring launch", exact: true })).toBeChecked();
  await search.fill("missing-project");
  await expect(table.getByText("No matching records", { exact: true })).toBeVisible();
  await table.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toBeFocused();
  await expect(table.getByText("Page 1 of 3", { exact: true })).toBeVisible();
  await table.getByRole("checkbox", { name: "Select all rows on this page", exact: true }).check();
  await expect(table.getByRole("status")).toHaveText("1–5 of 12 records · 6 selected");
  await table.getByRole("checkbox", { name: "Select all rows on this page", exact: true }).uncheck();
  await expect(table.getByRole("status")).toHaveText("1–5 of 12 records · 1 selected");
  await table.getByRole("button", { name: "Sort by Members", exact: true }).click();
  await expect(table.locator("tbody tr").first()).toContainText("Client portal");
  await table.getByRole("combobox", { name: "Rows per page", exact: true }).click();
  const pageSize = page.getByRole("option", { name: "25", exact: true });
  expect((await pageSize.boundingBox())?.height).toBe(36);
  await pageSize.click();
  await expect(table.getByText("Page 1 of 1", { exact: true })).toBeVisible();
  await expect(table.locator("tbody tr")).toHaveCount(12);
});

test("table states recover and narrow layouts confine horizontal scrolling", async ({ page }) => {
  await page.goto("/#data-table");
  const table = page.locator(".pk-data-table");
  const scroll = table.getByRole("region", { name: "Projects table", exact: true });
  await table.getByRole("checkbox", { name: "Select Spring launch", exact: true }).check();
  await choose(page, "Preview state", "Loading");
  await expect(scroll).toHaveAttribute("aria-busy", "true");
  await expect(table.getByRole("status")).toHaveText("Loading records…");
  expect(await table.getByRole("status").evaluate(element => element.closest('[aria-busy="true"]') === null)).toBe(true);
  await expect(table.getByRole("button", { name: "Clear selection" })).toBeDisabled();
  await expect(table.getByRole("button", { name: "Archive selected" })).toBeDisabled();
  await expect(table.getByRole("searchbox", { name: "Search projects" })).toBeDisabled();
  await expect(table.getByRole("button", { name: "Sort by Project", exact: true })).toBeDisabled();
  await choose(page, "Preview state", "Error");
  await expect(table.getByRole("alert")).toContainText("Projects could not be loaded");
  await table.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(scroll).toBeFocused();
  await expect(table.getByRole("checkbox", { name: "Select Spring launch", exact: true })).toBeChecked();
  await choose(page, "Preview state", "Empty");
  await expect(table.getByText("No projects in this preview", { exact: true })).toBeVisible();
  await choose(page, "Preview state", "Ready");
  await expect(table.getByRole("checkbox", { name: "Select Spring launch", exact: true })).toBeChecked();
  await choose(page, "Table density", "Compact");
  await expect(table).toHaveAttribute("data-density", "compact");
  // Rich cells and actions must be allowed to grow beyond the compact minimum.
  expect((await table.locator("tbody tr").first().boundingBox())?.height).toBeGreaterThanOrEqual(36);
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await table.locator(".pk-data-table-scroll").evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  expect((await table.locator("tbody tr").first().boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

test("shell drawer closes on navigation, Escape, outside click, and container growth", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/#admin-shell");
  const trigger = page.getByRole("button", { name: "Open navigation", exact: true });
  const drawer = page.getByRole("dialog", { name: "Demo workspace navigation", exact: true });
  await trigger.click();
  await expect(drawer).toBeVisible();
  for (let index = 0; index < 6; index += 1) {
    await page.keyboard.press("Tab");
    expect(await drawer.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await drawer.getByRole("link", { name: "Team", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "Workspace team", exact: true })).toBeVisible();
  await trigger.click();
  await expect(drawer.getByRole("button", { name: "Close navigation", exact: true })).toBeFocused();
  await page.locator(".pk-dialog-overlay").click({ position: { x: 350, y: 400 } });
  await expect(drawer).not.toBeVisible();
  await trigger.click();
  await expect(drawer.getByRole("button", { name: "Close navigation", exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1700, height: 1000 });
  await expect(drawer).not.toBeVisible();
  await expect(trigger).not.toBeVisible();
  await expect(page.locator("#admin-preview-content")).toBeFocused();
  await expect(page.locator("body")).not.toHaveAttribute("data-scroll-locked");
  await expect(page.getByRole("navigation", { name: "Demo workspace navigation", exact: true }).getByRole("link", { name: "Team", exact: true })).toHaveAttribute("aria-current", "page");
  const skip = page.getByRole("link", { name: "Skip to main content", exact: true });
  await skip.focus();
  await skip.press("Enter");
  await expect(page.locator("#admin-preview-content")).toBeFocused();

  // The shared dialog close control and the drawer title must agree on RTL.
  await page.setViewportSize({ width: 360, height: 800 });
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  await trigger.click();
  await expect(drawer).toBeVisible();
  const rtl = await drawer.evaluate(element => {
    const close = element.querySelector(".pk-dialog-close")!.getBoundingClientRect();
    const title = element.querySelector(".pk-dialog-title")!;
    const box = element.getBoundingClientRect();
    return {
      right: box.right,
      textStart: title.getBoundingClientRect().left + parseFloat(getComputedStyle(title).paddingLeft),
      closeEnd: close.right,
    };
  });
  expect(rtl.right).toBe(360);
  expect(rtl.textStart).toBeGreaterThanOrEqual(rtl.closeEnd);
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
