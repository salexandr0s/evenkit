import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import react from "@vitejs/plugin-react";
import { build } from "vite";

test("record editor suppresses duplicate saves before pending state renders", async ({ page }) => {
  const result = await build({ configFile: false, logLevel: "error", plugins: [react()], define: { "process.env.NODE_ENV": '"production"' }, build: { write: false, lib: { entry: fileURLToPath(new URL("../fixtures/record-workflow-host.tsx", import.meta.url)), formats: ["iife"], name: "RecordWorkflowHost" } } });
  const scripts: string[] = [];
  const styles: string[] = [];
  for (const bundle of Array.isArray(result) ? result : [result]) {
    if (!("output" in bundle)) throw new Error("The record host build did not return assets.");
    for (const file of bundle.output) {
      if (file.type === "chunk") scripts.push(file.code);
      else if (file.fileName.endsWith(".css")) styles.push(typeof file.source === "string" ? file.source : Buffer.from(file.source).toString("utf8"));
    }
  }
  await page.route("**/record-workflow-host-test", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Record workflow host</title><link rel="stylesheet" href="/record-workflow-host-test/styles.css"></head><body><div id="root"></div><script src="/record-workflow-host-test/script.js"></script></body></html>' }));
  await page.route("**/record-workflow-host-test/script.js", route => route.fulfill({ contentType: "text/javascript", body: scripts.join("\n") }));
  await page.route("**/record-workflow-host-test/styles.css", route => route.fulfill({ contentType: "text/css", body: styles.join("\n") }));
  await page.goto("/record-workflow-host-test");
  await page.waitForFunction(() => Boolean(window.recordTestHost));
  const dialog = page.getByRole("dialog", { name: "Edit project", exact: true });
  await dialog.getByRole("textbox", { name: "Project name", exact: true }).fill("Meridian launch");
  await dialog.locator("form").evaluate(form => {
    if (!(form instanceof HTMLFormElement)) throw new Error("Expected editor form.");
    form.requestSubmit(); form.requestSubmit();
  });
  await expect(page.getByLabel("Save requests")).toHaveText("1");
  await page.evaluate(() => window.recordTestHost.resolve());
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status").filter({ hasText: "Meridian launch saved." })).toBeVisible();
});
