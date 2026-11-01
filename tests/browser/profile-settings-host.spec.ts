import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import react from "@vitejs/plugin-react";
import { build } from "vite";

let script = "";
let styles = "";
test.beforeAll(async () => {
  const result = await build({ configFile: false, logLevel: "error", plugins: [react()], define: { "process.env.NODE_ENV": '"production"' }, build: { write: false, lib: { entry: fileURLToPath(new URL("../fixtures/profile-settings-host.tsx", import.meta.url)), formats: ["iife"], name: "ProfileSettingsHost" } } });
  for (const bundle of Array.isArray(result) ? result : [result]) {
    if (!("output" in bundle)) throw new Error("The profile host build did not return assets.");
    for (const file of bundle.output) {
      if (file.type === "chunk") script += file.code;
      else if (file.fileName.endsWith(".css")) styles += typeof file.source === "string" ? file.source : Buffer.from(file.source).toString("utf8");
    }
  }
});
test.beforeEach(async ({ page }) => {
  await page.route("**/profile-settings-host-test", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Profile settings host</title><link rel="stylesheet" href="/profile-settings-host-test/styles.css"></head><body><div id="root"></div><script src="/profile-settings-host-test/script.js"></script></body></html>' }));
  await page.route("**/profile-settings-host-test/script.js", route => route.fulfill({ contentType: "text/javascript", body: script }));
  await page.route("**/profile-settings-host-test/styles.css", route => route.fulfill({ contentType: "text/css", body: styles }));
  await page.goto("/profile-settings-host-test");
  await page.waitForFunction(() => Boolean(window.profileTestHost));
});

test("profile rejects duplicate submissions before the pending render", async ({ page }) => {
  const form = page.getByRole("form", { name: "Profile settings", exact: true });
  await form.getByRole("textbox", { name: "Full name", exact: true }).fill("Alex Rivera");
  await form.evaluate(element => {
    if (!(element instanceof HTMLFormElement)) throw new Error("Expected profile form.");
    element.requestSubmit(); element.requestSubmit();
  });
  await expect(page.getByLabel("Save requests")).toHaveText("1");
  await page.evaluate(() => window.profileTestHost.resolve());
  await expect(form.getByRole("status")).toHaveText("Profile saved.");
});

test("profile completion preserves outside focus and restores a focused cancel control", async ({ page }) => {
  const form = page.getByRole("form", { name: "Profile settings", exact: true });
  const name = form.getByRole("textbox", { name: "Full name", exact: true });
  const cancel = form.getByRole("button", { name: "Cancel save", exact: true });
  const outside = page.getByRole("textbox", { name: "Outside the profile", exact: true });
  await name.fill("Alex Rivera");
  await form.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(cancel).toBeFocused();
  await outside.fill("Keep typing here");
  await page.evaluate(() => window.profileTestHost.resolve());
  await expect(form.getByRole("status")).toHaveText("Profile saved.");
  await expect(outside).toBeFocused();

  await name.fill("Alex Rowan");
  await form.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(cancel).toBeFocused();
  await outside.focus();
  await page.evaluate(() => window.profileTestHost.reject());
  await expect(form.getByRole("alert")).toHaveText("Please retry the save.");
  await expect(outside).toBeFocused();

  await form.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(cancel).toBeFocused();
  await page.evaluate(() => window.profileTestHost.resolve());
  await expect(form.getByRole("status")).toHaveText("Profile saved.");
  await expect(name).toBeFocused();
});
