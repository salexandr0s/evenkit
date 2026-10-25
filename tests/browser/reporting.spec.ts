import { expect, test, type Locator, type Page } from "@playwright/test";

const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", error => errors.push(error.message));
});
test.afterEach(({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

function chart(page: Page, title: string): Locator {
  return page.locator(".pk-chart-frame").filter({ has: page.getByRole("heading", { name: title, exact: true }) });
}

async function chooseOption(page: Page, name: string, option: string) {
  await page.getByRole("combobox", { name, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

// A host update can arrive while keyboard focus remains inside the chart.
async function hostAction(page: Page, name: string) {
  await page.getByRole("button", { name, exact: true }).evaluate(button => {
    if (!(button instanceof HTMLButtonElement)) throw new Error("Expected a host action button");
    button.click();
  });
}

test("chart inspection preserves missing measurements, zero and focus during data replacement", async ({ page }) => {
  await page.goto("/#chart-frame");
  const figure = chart(page, "Orders by day");
  const plot = figure.locator(".pk-chart-interaction");
  const tooltip = figure.getByRole("tooltip");
  await plot.focus();
  await expect(tooltip).toContainText("Monday");
  await plot.press("ArrowRight");
  await expect(tooltip).toContainText("Tuesday");
  await plot.press("ArrowDown");
  await expect(tooltip).toContainText("Wednesday");
  await expect(tooltip).toContainText("Not available");
  await plot.press("ArrowRight");
  await expect(tooltip).toContainText("Thursday");
  await expect(tooltip).toContainText("0");
  await expect(tooltip).not.toContainText("Not available");
  await plot.press("End");
  await expect(tooltip).toContainText("Sunday");
  await hostAction(page, "Use shorter period");
  await expect(plot).toBeFocused();
  await expect(tooltip).toContainText("Monday");
  await hostAction(page, "Use full week");
  await plot.press("End");
  await plot.press("Home");
  await expect(tooltip).toContainText("Monday");
  await plot.press("Escape");
  await expect(tooltip).toBeHidden();
  await expect(plot).toBeFocused();
  await plot.press("ArrowRight");
  await expect(tooltip).toBeVisible();

  const disclosure = figure.locator("summary");
  await disclosure.focus();
  await disclosure.press("Enter");
  const table = figure.getByRole("table");
  await expect(table).toBeVisible();
  await expect(table.getByRole("row", { name: /Wednesday/ })).toContainText("Not available");
  await expect(table.getByRole("row", { name: /Thursday/ }).getByRole("cell")).toHaveText(["0", "25"]);
  await expect(table.getByRole("row", { name: /Sunday/ }).getByRole("cell")).toHaveText(["46", "34"]);
});

test("chart loading, empty and failed states recover without displaying stale measurements", async ({ page }) => {
  await page.goto("/#chart-frame");
  const figure = chart(page, "Orders by day");
  await figure.locator("summary").focus();
  await figure.locator("summary").press("Enter");
  await expect(figure.getByRole("table")).toBeVisible();
  await hostAction(page, "Reload sample");
  await expect(figure.locator(".pk-chart-interaction")).toBeFocused();
  await expect(figure.getByRole("table")).toHaveCount(0);
  await expect(figure).toContainText("Loading chart");
  await expect(figure.locator(".pk-chart-svg")).toHaveCount(0);
  await expect(figure.locator(".pk-chart-interaction")).toHaveAttribute("tabindex", "-1");
  await chooseOption(page, "Chart state", "Empty");
  await expect(figure).toContainText("No measurements for this period.");
  await expect(figure.locator(".pk-chart-svg")).toHaveCount(0);
  await expect(figure.locator(".pk-chart-interaction")).toHaveAttribute("tabindex", "-1");
  await chooseOption(page, "Chart state", "Error");
  await expect(figure.getByRole("alert")).toBeVisible();
  const retry = figure.getByRole("button", { name: "Retry", exact: true });
  await retry.focus();
  await retry.press("Enter");
  await expect(figure.locator(".pk-chart-interaction")).toBeVisible();
  await expect(figure.locator(".pk-chart-interaction")).toBeFocused();
});

test("reporting controls invalidate prepared downloads and export transitions retain usable focus", async ({ page }) => {
  await page.goto("/#reporting-controls");
  const exportGroup = page.getByRole("group", { name: "Export report", exact: true });
  const prepare = exportGroup.locator("button").first();
  await prepare.focus();
  await prepare.press("Enter");
  await expect(exportGroup).toHaveAttribute("data-state", "preparing");
  await expect(prepare).toBeFocused();
  await expect(prepare).toHaveAttribute("aria-disabled", "true");
  await prepare.press("Enter");
  await expect(exportGroup).toHaveAttribute("data-state", "preparing");
  await hostAction(page, "Show progress");
  await expect(exportGroup).toHaveAttribute("data-state", "progress");
  await expect(exportGroup.getByRole("progressbar", { name: "Export progress", exact: true })).toHaveAttribute("value", "45");
  await expect(prepare).toBeFocused();
  await hostAction(page, "Fail export");
  await expect(exportGroup.getByRole("alert")).toBeVisible();
  await expect(prepare).toBeFocused();
  await expect(prepare).toHaveText("Retry export");
  await prepare.press("Enter");
  await expect(exportGroup).toHaveAttribute("data-state", "preparing");
  await exportGroup.getByRole("button", { name: "Cancel export", exact: true }).click();
  await expect(exportGroup).toHaveAttribute("data-state", "idle");
  await expect(prepare).toBeFocused();
  await prepare.press("Enter");
  await exportGroup.getByRole("button", { name: "Cancel export", exact: true }).focus();
  await hostAction(page, "Complete export");
  await expect(exportGroup).toHaveAttribute("data-state", "ready");
  await expect(prepare).toBeFocused();
  const download = exportGroup.getByRole("link", { name: "Download export", exact: true });
  await expect(download).toHaveAttribute("href", /^data:text\/csv/);
  await download.focus();
  await hostAction(page, "Fail export");
  await expect(exportGroup).toHaveAttribute("data-state", "error");
  await expect(prepare).toBeFocused();
  await prepare.press("Enter");
  await hostAction(page, "Complete export");
  await expect(download).toBeVisible();
  await chooseOption(page, "Period", "October 2026");
  await expect(exportGroup.getByRole("link", { name: "Download export", exact: true })).toHaveCount(0);
  const controls = page.getByRole("group", { name: "Reporting controls", exact: true });
  await expect(controls.getByRole("status")).toContainText("Changes have not been applied.");
  await controls.getByRole("button", { name: "Apply report", exact: true }).click();
  await expect(controls.getByRole("status")).not.toContainText("Changes have not been applied.");
  await controls.getByRole("button", { name: "Reset report", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Period", exact: true })).toHaveText("19–25 October 2026");
});

test("line, area and bar adapters draw missing, grouped and signed stacked values", async ({ page }) => {
  await page.goto("/#line-chart");
  const line = chart(page, "Orders by day");
  await expect(line.locator(".pk-chart-line")).toHaveCount(2);
  const current = line.locator('g').filter({ has: page.locator('.pk-chart-line[data-series="current"]') }).last();
  await expect(current.locator(".pk-chart-point")).toHaveCount(6);
  const area = chart(page, "Daily order volume");
  await expect(area.locator(".pk-chart-area")).toHaveCount(1);
  await expect(area.locator(".pk-chart-line")).toHaveCount(1);
  await expect(area.locator(".pk-chart-point")).toHaveCount(6);

  await page.goto("/#bar-chart");
  for (const title of ["Orders by region", "Orders by channel", "Stacked regional orders", "Stacked channel totals"]) {
    const figure = chart(page, title);
    await expect(figure.locator(".pk-chart-bar")).toHaveCount(8);
    const geometry = await figure.evaluate(element => {
      const plot = element.querySelector<HTMLElement>(".pk-chart-plot");
      const horizontal = plot?.dataset.orientation === "horizontal";
      const read = (series: string) => {
        const rect = element.querySelector<SVGRectElement>(`.pk-chart-bar[data-series="${series}"][data-category="north"]`);
        if (!rect) throw new Error(`Missing ${series} bar`);
        return { x: rect.x.baseVal.value, y: rect.y.baseVal.value, width: rect.width.baseVal.value, height: rect.height.baseVal.value };
      };
      const zero = element.querySelector<SVGLineElement>(".pk-chart-zero");
      if (!zero) throw new Error("Missing zero baseline");
      return { horizontal, stacked: plot?.dataset.stacked === "true", direct: read("direct"), partner: read("partner"), returns: read("returns"), zero: horizontal ? zero.x1.baseVal.value : zero.y1.baseVal.value };
    });
    const { horizontal, stacked, direct, partner, returns, zero } = geometry;
    if (horizontal) {
      expect(direct.x).toBeCloseTo(zero);
      expect(partner.x).toBeCloseTo(stacked ? direct.x + direct.width : zero);
      expect(returns.x + returns.width).toBeCloseTo(zero);
      expect(returns.x).toBeLessThan(zero);
      if (stacked) expect(partner.y).toBeCloseTo(direct.y);
      else expect(partner.y).toBeGreaterThan(direct.y);
    } else {
      expect(direct.y + direct.height).toBeCloseTo(zero);
      expect(partner.y + partner.height).toBeCloseTo(stacked ? direct.y : zero);
      expect(returns.y).toBeCloseTo(zero);
      expect(returns.height).toBeGreaterThan(0);
      if (stacked) expect(partner.x).toBeCloseTo(direct.x);
      else expect(partner.x).toBeGreaterThan(direct.x);
    }
    await expect(figure.locator(".pk-chart-svg pattern")).toHaveCount(3);
    const patternPaths = await figure.locator(".pk-chart-svg pattern path").evaluateAll(paths => paths.map(path => path.getAttribute("d")));
    expect(patternPaths).toHaveLength(2);
    expect(await figure.locator(".pk-chart-legend pattern path").evaluateAll(paths => paths.map(path => path.getAttribute("d")))).toEqual(patternPaths);
    await figure.locator("summary").click();
    await expect(figure.getByRole("row", { name: /Southern region/ }).getByRole("cell")).toHaveText(["0", "Not available", "0"]);
    await expect(figure.getByRole("row", { name: /Central region and surrounding distribution partners/ })).toBeVisible();
  }
});

test("statistics distinguish zero from missing and dashboard controls update host supplied data", async ({ page }) => {
  await page.goto("/#statistic");
  const zero = page.locator(".pk-statistic").filter({ has: page.getByText("Failed deliveries", { exact: true }) });
  await expect(zero).toHaveAttribute("data-state", "ready");
  await expect(zero.locator("dd")).toHaveText("0 deliveries");
  await expect(zero).toContainText("Down 3 deliveries from the previous week");
  const missing = page.locator(".pk-statistic").filter({ has: page.getByText("Average response time", { exact: true }) });
  await expect(missing).toHaveAttribute("data-state", "empty");
  await expect(missing.locator("dd")).toHaveText("Not measured for this period");
  await expect(page.locator('.pk-statistic[data-state="loading"] dd')).toHaveAttribute("aria-busy", "true");

  await page.goto("/#dashboard");
  const dashboard = page.getByRole("region", { name: "Order report", exact: true });
  const history = chart(page, "Order history");
  await expect(dashboard.getByRole("group", { name: "Report summary", exact: true })).toContainText("6 of 7");
  await expect(history.locator(".pk-chart-line")).toHaveCount(2);
  await chooseOption(page, "Comparison", "No comparison");
  await expect(history.locator(".pk-chart-line")).toHaveCount(1);
  await chooseOption(page, "Period", "October 2026");
  await expect(history).toContainText("Weekly totals; last bucket has three days");
  await expect(dashboard.getByRole("group", { name: "Report summary", exact: true })).not.toContainText("6 of 7");
  await expect(dashboard.getByRole("table", { name: "Order reporting coverage", exact: true })).toBeVisible();
  await expect(dashboard.locator("time").first()).toHaveAttribute("datetime", "2026-10-25T09:00:00Z");
});
