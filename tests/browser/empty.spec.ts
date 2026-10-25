import { expect, test } from "@playwright/test";

test("empty panels offer distinct recovery actions and retain keyboard focus", async ({ page }) => {
  await page.goto("/#empty");
  const firstUse = page.getByRole("region", { name: "First-use example", exact: true });
  const firstReset = firstUse.getByRole("button", { name: "Reset first-use example" });
  await expect(firstUse.getByRole("heading", { name: "No projects yet", level: 4 })).toBeVisible();
  await expect(firstUse.locator(".pk-empty-icon")).toHaveAttribute("aria-hidden", "true");
  await expect(firstUse.getByRole("status")).toHaveCount(0);
  await firstUse.getByRole("button", { name: "Create preview project" }).click();
  await expect(firstUse.getByRole("status")).toContainText("A preview project is ready.");
  await expect(firstReset).toBeFocused();
  await firstReset.click();
  await firstUse.getByRole("button", { name: "Use a template" }).click();
  await expect(firstUse.getByRole("status")).toContainText("The planning template is ready");
  await expect(firstReset).toBeFocused();

  const failure = page.getByRole("region", { name: "Recoverable failure example" });
  const help = failure.getByRole("button", { name: "Show troubleshooting" });
  await help.click();
  await expect(failure.getByRole("button", { name: "Hide troubleshooting" })).toHaveAttribute("aria-expanded", "true");
  await expect(failure.getByRole("heading", { name: "Troubleshooting steps" })).toBeVisible();
  await failure.getByRole("button", { name: "Retry preview" }).click();
  await expect(failure.getByRole("status")).toHaveText("The retry preview succeeded. No external service was contacted.");
  const failureReset = failure.getByRole("button", { name: "Reset failure example" });
  await expect(failureReset).toBeFocused();
  await failureReset.click();
  await expect(failure.getByRole("button", { name: "Show troubleshooting" })).toHaveAttribute("aria-expanded", "false");
  await expect(failure.getByRole("heading", { name: "Troubleshooting steps" })).not.toBeVisible();
});

test("compact search recovery and secondary-only RTL actions work on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/#empty");
  const noResults = page.getByRole("region", { name: "No-results example" });
  const search = noResults.getByRole("searchbox", { name: "Search projects" });
  const count = noResults.getByRole("status", { name: "Project search status" });
  await expect(count).toHaveText("0 projects found.");
  await noResults.getByRole("button", { name: "Include archived" }).click();
  await expect(search).toBeFocused();
  await expect(count).toHaveText("1 project found.");
  await expect(noResults.getByRole("list", { name: "Matching projects" })).toContainText("Budget report");
  await noResults.getByRole("button", { name: "Reset search example" }).click();
  await noResults.getByRole("button", { name: "Clear search" }).click();
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(count).toHaveText("2 projects found.");
  await expect(noResults.getByRole("list", { name: "Matching projects" })).toContainText("Spring launch");

  const rtl = page.getByRole("region", { name: "RTL empty-state example" });
  const searchAgain = rtl.getByRole("button", { name: "Search projects again" });
  await expect(searchAgain).toBeVisible();
  const layout = await rtl.locator(".pk-empty-state").evaluate(element => ({
    direction: getComputedStyle(element).direction,
    textAlign: getComputedStyle(element).textAlign,
    overflow: element.scrollWidth > element.clientWidth,
    pageOverflow: document.documentElement.scrollWidth > window.innerWidth,
  }));
  expect(layout).toEqual({ direction: "rtl", textAlign: "start", overflow: false, pageOverflow: false });
  await searchAgain.click();
  await expect(search).toHaveValue("Budget report");
  await expect(search).toBeFocused();
  await expect(count).toHaveText("0 projects found.");
});
