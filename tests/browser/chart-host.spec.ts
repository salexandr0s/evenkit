import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import react from "@vitejs/plugin-react";
import { build } from "vite";

let script = "";
let styles = "";

test.beforeAll(async () => {
  const result = await build({
    configFile: false,
    logLevel: "error",
    plugins: [react()],
    define: { "process.env.NODE_ENV": '"production"' },
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(new URL("../fixtures/chart-host.tsx", import.meta.url)),
        formats: ["iife"],
        name: "ChartHost",
      },
    },
  });
  const scripts: string[] = [];
  const sheets: string[] = [];
  for (const bundle of Array.isArray(result) ? result : [result]) {
    if (!("output" in bundle)) throw new Error("The chart host build did not return assets.");
    for (const file of bundle.output) {
      if (file.type === "chunk") scripts.push(file.code);
      else if (file.fileName.endsWith(".css")) {
        sheets.push(typeof file.source === "string" ? file.source : Buffer.from(file.source).toString("utf8"));
      }
    }
  }
  if (scripts.length !== 1 || sheets.length === 0) throw new Error("The chart host needs one script and its styles.");
  script = scripts.join("\n");
  styles = sheets.join("\n") + await readFile(new URL("../../packages/ui/src/chart.css", import.meta.url), "utf8");
});

test.beforeEach(async ({ page }) => {
  await page.route("**/chart-host-test", route => route.fulfill({
    contentType: "text/html",
    body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Chart host</title><link rel="stylesheet" href="/chart-host-test/styles.css"></head><body><div id="root"></div><script src="/chart-host-test/script.js"></script></body></html>',
  }));
  await page.route("**/chart-host-test/script.js", route => route.fulfill({ contentType: "text/javascript", body: script }));
  await page.route("**/chart-host-test/styles.css", route => route.fulfill({ contentType: "text/css", body: styles }));
  await page.goto("/chart-host-test");
  await expect(page.getByRole("heading", { name: "Chart host" })).toBeVisible();
});

test("overflowing chart details retain keyboard scrolling and focus through host updates", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const plot = page.getByRole("group", { name: "Partner orders: chart", exact: true });
  const inspector = page.locator(".pk-chart-inspector");
  const tooltip = page.getByRole("tooltip");
  const outside = page.getByRole("button", { name: "Outside control", exact: true });
  async function hostAction(name: string) {
    await page.getByRole("button", { name, exact: true }).evaluate(button => {
      if (!(button instanceof HTMLButtonElement)) throw new Error("Missing host button");
      button.click();
    });
  }

  await plot.focus();
  await plot.press("ArrowRight");
  await plot.press("Tab");
  await expect(inspector).toBeFocused();
  await expect(inspector).toHaveAccessibleName("Partner orders");
  await expect(tooltip).toContainText("Period 2");
  expect(await inspector.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
  await inspector.press("PageDown");
  await expect.poll(() => inspector.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await expect(tooltip).toContainText("Period 2");
  await inspector.press("Shift+Tab");
  await expect(plot).toBeFocused();
  await plot.press("End");
  await plot.press("Tab");
  await hostAction("Reverse periods");
  await expect(inspector).toBeFocused();
  await expect(tooltip).toContainText("Period 3");
  await hostAction("Remove first period");
  await expect(inspector).toBeFocused();
  await expect(tooltip).toContainText("Period 2");
  await inspector.press("Tab");
  await expect(page.locator("summary")).toBeFocused();
  await expect(tooltip).toHaveCount(0);
  await plot.focus();
  await plot.press("Tab");
  await inspector.press("Escape");
  await expect(plot).toBeFocused();
  await expect(tooltip).toHaveCount(0);
  await plot.press("Tab");
  await expect(page.locator("summary")).toBeFocused();

  await plot.focus();
  await plot.press("Tab");
  await hostAction("Load report");
  await expect(plot).toBeFocused();
  await expect(inspector).toHaveCount(0);
  await hostAction("Restore report");
  await outside.focus();
  await page.locator(".pk-chart-hit").first().hover({ position: { x: 2, y: 2 } });
  await expect(tooltip).toBeVisible();
  await expect(outside).toBeFocused();
  await hostAction("Load report");
  await expect(outside).toBeFocused();
  await expect(inspector).toHaveCount(0);
  await hostAction("Restore report");
  await outside.evaluate(button => { if (button instanceof HTMLElement) button.blur(); });
  await page.locator(".pk-chart-hit").first().hover({ position: { x: 2, y: 2 } });
  await expect(tooltip).toBeVisible();
  await hostAction("Load report");
  await expect(page.locator("body")).toBeFocused();
  await expect(inspector).toHaveCount(0);
});
