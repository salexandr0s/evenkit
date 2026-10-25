import { fileURLToPath } from "node:url";
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
        entry: fileURLToPath(new URL("../fixtures/data-table-host.tsx", import.meta.url)),
        formats: ["iife"],
        name: "TableHost",
      },
    },
  });
  const scripts: string[] = [];
  const sheets: string[] = [];
  for (const bundle of Array.isArray(result) ? result : [result]) {
    if (!("output" in bundle)) throw new Error("The table host build did not return assets.");
    for (const file of bundle.output) {
      if (file.type === "chunk") scripts.push(file.code);
      else if (file.fileName.endsWith(".css")) {
        sheets.push(typeof file.source === "string" ? file.source : Buffer.from(file.source).toString("utf8"));
      }
    }
  }
  if (scripts.length !== 1 || sheets.length === 0) throw new Error("The table host needs one script and its styles.");
  script = scripts.join("\n");
  styles = sheets.join("\n");
});

test.beforeEach(async ({ page }) => {
  await page.route("**/table-host-test", route => route.fulfill({
    contentType: "text/html",
    body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Data table host</title><link rel="stylesheet" href="/table-host-test/styles.css"></head><body><div id="root"></div><script src="/table-host-test/script.js"></script></body></html>',
  }));
  await page.route("**/table-host-test/script.js", route => route.fulfill({ contentType: "text/javascript", body: script }));
  await page.route("**/table-host-test/styles.css", route => route.fulfill({ contentType: "text/css", body: styles }));
  await page.clock.install({ time: new Date("2026-10-25T08:00:00Z") });
  await page.goto("/table-host-test");
  await expect(page.getByRole("heading", { name: "Data table host" })).toBeVisible();
  await page.clock.pauseAt(new Date("2026-10-25T09:00:00Z"));
});

test("async loading closes the page-size popup and recovers table focus", async ({ page }) => {
  const region = page.getByRole("region", { name: "Host projects table", exact: true });
  const pageSize = page.getByRole("combobox", { name: "Rows per page", exact: true });
  await page.getByRole("button", { name: "Schedule loading", exact: true }).click();
  await pageSize.press("ArrowDown");
  await page.clock.runFor(50);
  await expect(page.getByRole("option", { name: "2", exact: true })).toBeFocused();
  await page.clock.runFor(450);
  await expect(region).toHaveAttribute("aria-busy", "true");
  await expect(pageSize).toBeDisabled();
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await page.clock.runFor(50);
  await expect(region).toBeFocused();

  await page.getByRole("button", { name: "Restore records", exact: true }).click();
  await expect(pageSize).toBeEnabled();
  await page.clock.runFor(50);
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(pageSize).toHaveAttribute("aria-expanded", "false");
});

test("async loading recovers disabled or removed controls without taking host focus", async ({ page }) => {
  const region = page.getByRole("region", { name: "Host projects table", exact: true });
  const search = page.getByRole("searchbox", { name: "Search host projects", exact: true });
  const rowAction = page.getByRole("button", { name: "Open Alpha", exact: true });
  const schedule = page.getByRole("button", { name: "Schedule loading", exact: true });
  const restore = page.getByRole("button", { name: "Restore records", exact: true });
  const outside = page.getByRole("button", { name: "Outside control", exact: true });

  await schedule.click();
  await search.focus();
  await expect(search).toBeFocused();
  await page.clock.runFor(500);
  await expect(search).toBeDisabled();
  await expect(region).toBeFocused();
  await restore.click();
  await expect(search).toBeEnabled();

  await schedule.click();
  await rowAction.focus();
  await expect(rowAction).toBeFocused();
  await page.clock.runFor(500);
  await expect(rowAction).toHaveCount(0);
  await expect(region).toBeFocused();
  await restore.click();
  await expect(rowAction).toBeVisible();

  await schedule.click();
  await rowAction.focus();
  await outside.focus();
  await expect(outside).toBeFocused();
  await page.clock.runFor(500);
  await expect(region).toHaveAttribute("aria-busy", "true");
  await expect(outside).toBeFocused();
});
