import { expect, test, type Page } from "@playwright/test";

async function choose(page: Page, label: string, value: string) {
  const trigger = page.getByRole("combobox", { name: label, exact: true });
  await trigger.click();
  await page.getByRole("option", { name: value, exact: true }).click();
  await expect(trigger).toBeFocused();
}

test("selection clears hidden IDs and bulk removal recovers the last page", async ({ page }) => {
  await page.goto("/#data-table");
  const table = page.locator(".pk-data-table");
  const search = table.getByRole("searchbox", { name: "Search projects" });
  const scroll = table.getByRole("region", { name: "Projects table", exact: true });
  const next = table.getByRole("button", { name: "Next page" });
  await table.getByRole("checkbox", { name: "Select Spring launch", exact: true }).check();
  await next.click();
  await table.getByRole("checkbox", { name: "Select Content archive", exact: true }).check();
  await search.fill("does-not-exist");
  await expect(table.getByRole("status")).toHaveText("0 records · 2 selected");
  await table.getByRole("button", { name: "Clear selection" }).click();
  await expect(scroll).toBeFocused();
  await expect(table.getByRole("group", { name: "Selected records" })).toHaveCount(0);
  await table.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toBeFocused();
  await expect(table.getByRole("checkbox", { name: "Select Spring launch", exact: true })).not.toBeChecked();
  await next.click();
  await expect(table.getByRole("checkbox", { name: "Select Content archive", exact: true })).not.toBeChecked();
  await next.click();
  await expect(table.getByRole("status")).toHaveText("11–12 of 12 records · 0 selected");
  await table.getByRole("checkbox", { name: "Select all rows on this page" }).check();
  await table.getByRole("button", { name: "Archive selected" }).click();
  await expect(page.getByRole("button", { name: "Reset table example" })).toBeFocused();
  await expect(page.getByRole("status", { name: "Archive result" })).toContainText("2 projects archived");
  await expect(table.getByRole("status")).toHaveText("1–5 of 10 records · 0 selected");
  await expect(table.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  await expect(table.getByText("No matching records", { exact: true })).toHaveCount(0);
  await search.fill("Release checklist");
  await expect(table.getByText("No matching records", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset table example" }).click();
  await expect(table.getByRole("status")).toHaveText("1–5 of 12 records · 0 selected");
  await choose(page, "Preview state", "Empty");
  await table.getByRole("button", { name: "Restore preview projects" }).click();
  await expect(table.locator("tbody tr")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Reset table example" })).toBeFocused();
});

test("wrapped cells, overflow tooltips, and row actions stay usable at narrow widths", async ({ page }) => {
  await page.goto("/#data-table");
  const table = page.locator(".pk-data-table");
  const research = table.getByRole("row").filter({ has: page.getByRole("checkbox", { name: "Select Research library", exact: true }) });
  const summary = research.getByRole("cell").filter({ hasText: /^Interview notes, research findings/ });
  const cell = summary.locator(".pk-data-table-cell");
  await expect(cell).toHaveAttribute("data-overflow", "wrap");
  expect(await cell.evaluate(element => element.scrollHeight <= element.clientHeight)).toBe(true);
  await choose(page, "Cell text", "Truncate");
  await expect(cell).toHaveAttribute("data-truncated", "true");
  await expect(cell).toHaveAttribute("tabindex", "0");
  await cell.focus();
  await expect(page.getByRole("tooltip")).toContainText("Interview notes, research findings");
  await cell.press("Escape");
  await expect(page.getByRole("tooltip")).not.toBeVisible();
  await expect(cell).toBeFocused();
  await choose(page, "Cell text", "Wrap");
  await expect(cell).not.toHaveAttribute("tabindex", "0");
  await expect(page.getByRole("tooltip")).toHaveCount(0);

  const review = research.getByRole("button", { name: "Review Research library", exact: true });
  await review.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(review).toBeFocused();
  const focus = await review.evaluate(element => {
    const wrapper = element.closest(".pk-data-table-cell")!;
    const controlStyle = getComputedStyle(element);
    return { overflow: getComputedStyle(wrapper).overflow, focusVisible: element.matches(":focus-visible"), outline: controlStyle.outlineStyle };
  });
  expect(focus).toEqual({ overflow: "visible", focusVisible: true, outline: "solid" });
  await review.press("Enter");
  const details = page.getByRole("region", { name: "Project review", exact: true });
  await expect(details.getByRole("heading", { name: "Review Research library" })).toBeFocused();
  await expect(details).toContainText("Nora Patel");
  await details.getByRole("button", { name: "Close project review" }).click();
  await expect(page.getByRole("button", { name: "Reset table example" })).toBeFocused();

  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await table.locator(".pk-data-table-scroll").evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await review.focus();
  await expect(review).toBeInViewport();
  expect((await review.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});
