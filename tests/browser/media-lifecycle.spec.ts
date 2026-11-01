import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import react from "@vitejs/plugin-react";
import { build } from "vite";

let script = "";
let styles = "";
test.beforeAll(async () => {
  const result = await build({ configFile: false, logLevel: "error", plugins: [react()], define: { "process.env.NODE_ENV": '"production"' },
    resolve: { alias: [{ find: /^@evenkit\/ui$/, replacement: fileURLToPath(new URL("../../packages/ui/src/index.ts", import.meta.url)) }] },
    build: { write: false, lib: { entry: fileURLToPath(new URL("../fixtures/media-lifecycle-host.tsx", import.meta.url)), formats: ["iife"], name: "MediaLifecycleHost" } } });
  for (const bundle of Array.isArray(result) ? result : [result]) {
    if (!("output" in bundle)) throw new Error("The media host build did not return assets.");
    for (const file of bundle.output) {
      if (file.type === "chunk") script += file.code;
      else if (file.fileName.endsWith(".css")) styles += typeof file.source === "string" ? file.source : Buffer.from(file.source).toString("utf8");
    }
  }
});
test.beforeEach(async ({ page }) => {
  await page.route(/\/media-lifecycle-host-test(?:\?.*)?$/, route => route.fulfill({ contentType: "text/html", body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Media lifecycle host</title><link rel="stylesheet" href="/media-lifecycle-host-test.css"></head><body><div id="root"></div><script src="/media-lifecycle-host-test.js"></script></body></html>' }));
  await page.route("**/media-lifecycle-host-test.js", route => route.fulfill({ contentType: "text/javascript", body: script }));
  await page.route("**/media-lifecycle-host-test.css", route => route.fulfill({ contentType: "text/css", body: styles }));
});

for (const surface of ["image", "preview", "banner", "connection", "notification", "documents", "audit"] as const) test(`${surface} replacement recovers only the control that still owns focus`, async ({ page }) => {
  for (const destination of ["owned", "body", "outside", "same-task blur"] as const) {
    await page.goto(`/media-lifecycle-host-test?surface=${surface}`);
    await page.waitForFunction(() => Boolean(window.mediaLifecycleHost));
    const control = surface === "documents" || surface === "notification" ? page.getByRole("checkbox", { name: surface === "documents" ? "Select Project documents" : "Select Project ready", exact: true }) : page.getByRole("button", { name: surface === "image" ? "Retry image" : surface === "preview" ? "Refresh preview of Project file.png" : surface === "banner" ? "Open details" : surface === "audit" ? "Export matching events" : "Retry connection", exact: true });
    await control.focus();
    if (destination === "body") await control.blur();
    if (destination === "outside") await page.getByRole("button", { name: "Outside control", exact: true }).focus();
    if (destination === "same-task blur") await control.evaluate(element => { element.blur(); window.mediaLifecycleHost.replace(); });
    else await page.evaluate(() => window.mediaLifecycleHost.replace());
    if (surface === "audit") await expect(control).toBeDisabled();
    else await expect(control).toHaveCount(0);
    const expected = destination === "body" || destination === "same-task blur" ? page.locator("body") : destination === "outside" ? page.getByRole("button", { name: "Outside control", exact: true }) : page.locator(surface === "image" ? ".pk-image" : surface === "preview" ? ".pk-file-preview" : surface === "notification" ? ".pk-notification-center-heading" : surface === "documents" ? ".pk-document-status" : surface === "audit" ? ".pk-audit-heading h2" : ".pk-persistent-banner");
    await expect(expected, `${surface}: ${destination}`).toBeFocused();
  }
});

test("audit export preserves deliberate blur and restores an owned retry control", async ({ page }) => {
  await page.goto("/#audit-viewer");
  await expect(page.getByText("6 matching events", { exact: true })).toBeVisible();
  await page.getByRole("combobox", { name: "Simulated response", exact: true }).click();
  await page.getByRole("option", { name: "Failure then retry", exact: true }).click();
  await page.clock.install();
  const exportButton = page.getByRole("button", { name: "Export matching events", exact: true });
  await exportButton.click();
  const cancel = page.getByRole("button", { name: "Cancel export", exact: true });
  await expect(cancel).toBeFocused();
  await cancel.blur();
  await page.clock.fastForward(1000);
  await expect(page.getByText("Export failed", { exact: true })).toBeVisible();
  await expect(page.locator("body")).toBeFocused();
  await page.getByRole("button", { name: "Retry export", exact: true }).click();
  await expect(cancel).toBeFocused();
  await page.clock.fastForward(1000);
  await expect(page.getByText("Export ready", { exact: true })).toBeVisible();
  await expect(exportButton).toBeFocused();
});
