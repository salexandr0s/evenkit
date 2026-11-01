import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import react from "@vitejs/plugin-react";
import { build } from "vite";

let script = "";
let styles = "";
test.beforeAll(async () => {
  const result = await build({ configFile: false, logLevel: "error", plugins: [react()], define: { "process.env.NODE_ENV": '"production"' }, build: { write: false, lib: { entry: fileURLToPath(new URL("../fixtures/appearance-settings-host.tsx", import.meta.url)), formats: ["iife"], name: "AppearanceSettingsHost" } } });
  for (const bundle of Array.isArray(result) ? result : [result]) {
    if (!("output" in bundle)) throw new Error("The appearance host build did not return assets.");
    for (const file of bundle.output) {
      if (file.type === "chunk") script += file.code;
      else if (file.fileName.endsWith(".css")) styles += typeof file.source === "string" ? file.source : Buffer.from(file.source).toString("utf8");
    }
  }
});

for (const storage of ["unavailable", "read-only"] as const) {
  test(`locale updates preserve visit preferences when storage is ${storage}`, async ({ page }) => {
    await page.addInitScript(mode => {
      localStorage.setItem("appearance-host-a", JSON.stringify({ theme: "neutral", mode: "light", density: "default", locale: "de-AT" }));
      Storage.prototype.setItem = () => { throw new Error("Storage writes unavailable"); };
      if (mode === "unavailable") Storage.prototype.getItem = () => { throw new Error("Storage reads unavailable"); };
    }, storage);
    await page.route("**/appearance-settings-host-test", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Appearance settings host</title><link rel="stylesheet" href="/appearance-settings-host-test/styles.css"></head><body><div id="root"></div><script src="/appearance-settings-host-test/script.js"></script></body></html>' }));
    await page.route("**/appearance-settings-host-test/script.js", route => route.fulfill({ contentType: "text/javascript", body: script }));
    await page.route("**/appearance-settings-host-test/styles.css", route => route.fulfill({ contentType: "text/css", body: styles }));
    await page.goto("/appearance-settings-host-test");
    const preferences = page.getByLabel("Current preferences");
    await expect(preferences).toContainText(storage === "read-only" ? '"locale":"de-AT"' : '"locale":"en"');
    await page.getByRole("radio", { name: "Dark", exact: true }).check();
    await page.getByRole("combobox", { name: "Density", exact: true }).click();
    await page.getByRole("option", { name: "Compact", exact: true }).click();
    await page.getByRole("combobox", { name: "Color theme", exact: true }).click();
    await page.getByRole("option", { name: "Grove", exact: true }).click();
    const updates = page.getByLabel("Preference updates");
    const before = await updates.textContent();
    await page.getByRole("button", { name: "Recreate locale options", exact: true }).click();
    await expect(updates).toHaveText(before ?? "");
    await page.getByRole("button", { name: "Replace supported locales", exact: true }).click();
    await expect(preferences).toHaveText(JSON.stringify({ theme: "grove", mode: "dark", density: "compact", locale: "fr" }));
    await expect(updates).toHaveText(String(Number(before) + 1));
    await page.getByRole("button", { name: "Restore supported locales", exact: true }).click();
    await expect(preferences).toHaveText(JSON.stringify({ theme: "grove", mode: "dark", density: "compact", locale: "fr" }));
    await expect(updates).toHaveText(String(Number(before) + 1));
    await page.getByRole("button", { name: "Switch account", exact: true }).click();
    await expect(preferences).toHaveText(JSON.stringify({ theme: "neutral", mode: "light", density: "default", locale: "en" }));
  });
}
