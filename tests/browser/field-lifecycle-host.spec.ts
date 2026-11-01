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
    build: { write: false, lib: { entry: fileURLToPath(new URL("../fixtures/field-lifecycle-host.tsx", import.meta.url)), formats: ["iife"], name: "FieldLifecycleHost" } },
  });
  for (const bundle of Array.isArray(result) ? result : [result]) {
    if (!("output" in bundle)) throw new Error("The field lifecycle build did not return assets.");
    for (const file of bundle.output) {
      if (file.type === "chunk") script += file.code;
      else if (file.fileName.endsWith(".css")) styles += typeof file.source === "string" ? file.source : Buffer.from(file.source).toString("utf8");
    }
  }
  if (!script || !styles) throw new Error("The field lifecycle host needs a script and styles.");
});

test.beforeEach(async ({ page }) => {
  await page.route("**/field-lifecycle-host", route => route.fulfill({ contentType: "text/html", body: '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Field lifecycle host</title><link rel="stylesheet" href="/field-lifecycle-host/styles.css"></head><body><div id="root"></div><script src="/field-lifecycle-host/script.js"></script></body></html>' }));
  await page.route("**/field-lifecycle-host/script.js", route => route.fulfill({ contentType: "text/javascript", body: script }));
  await page.route("**/field-lifecycle-host/styles.css", route => route.fulfill({ contentType: "text/css", body: styles }));
  await page.clock.install({ time: new Date("2026-10-25T08:00:00Z") });
  await page.goto("/field-lifecycle-host");
  await expect(page.getByRole("heading", { name: "Field lifecycle host" })).toBeVisible();
  await page.clock.pauseAt(new Date("2026-10-25T09:00:00Z"));
});

test("date and multi-value popups stay closed after editing is restored", async ({ page }) => {
  for (const mode of ["read-only", "disabled"]) {
    for (const field of ["date", "range", "multi"]) {
      const region = page.locator(`[data-field="${field}"]`);
      const trigger = field === "multi" ? region.getByRole("combobox") : region.getByRole("button");
      const popup = page.getByRole(field === "multi" ? "listbox" : "dialog");
      await page.getByRole("button", { name: `Schedule ${mode}`, exact: true }).click();
      await trigger.press("ArrowDown");
      if (field !== "multi") await trigger.press("Enter");
      await page.clock.runFor(50);
      await expect(popup).toBeVisible();
      await page.clock.runFor(450);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await page.clock.runFor(50);
      await expect(popup).toHaveCount(0);
      await page.getByRole("button", { name: "Resume editing", exact: true }).click();
      await expect(popup).toHaveCount(0);
      await trigger.press("ArrowDown");
      if (field !== "multi") await trigger.press("Enter");
      await page.clock.runFor(50);
      await expect(popup).toBeVisible();
      await page.keyboard.press("Escape");
      await page.clock.runFor(50);
    }
  }
});

test("date portals close for native fieldsets, reject queued choices and preserve the first legend exemption", async ({ page }) => {
  const fieldset = page.getByTestId("host-fieldset");
  const values = () => page.getByRole("form", { name: "Host form" }).evaluate(node => [...new FormData(node as HTMLFormElement).entries()]);
  const original = await values();
  for (const field of ["date", "range"]) {
    const region = page.locator(`[data-field="${field}"]`);
    const trigger = region.getByRole("button");
    await trigger.click();
    await page.clock.runFor(50);
    await expect(page.getByRole("dialog")).toBeVisible();
    await fieldset.evaluate(node => { (node as HTMLFieldSetElement).disabled = true; });
    await page.clock.runFor(50);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await fieldset.evaluate(node => { (node as HTMLFieldSetElement).disabled = false; });
    await trigger.click();
    await page.clock.runFor(50);
    await page.locator('[data-date="2026-10-28"]').evaluate(node => {
      const owner = document.querySelector<HTMLFieldSetElement>('[data-testid="host-fieldset"]');
      if (!owner) throw new Error("Missing host fieldset.");
      owner.disabled = true;
      (node as HTMLButtonElement).click();
    });
    await page.clock.runFor(50);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await fieldset.evaluate(node => { (node as HTMLFieldSetElement).disabled = false; });
    expect(await values()).toEqual(original);
    await region.evaluate(node => node.closest("fieldset")?.querySelector("legend")?.append(node));
    await trigger.click();
    await page.clock.runFor(50);
    await fieldset.evaluate(node => { (node as HTMLFieldSetElement).disabled = true; });
    await page.clock.runFor(50);
    await expect(trigger).toBeEnabled();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await page.clock.runFor(50);
    await fieldset.evaluate(node => { (node as HTMLFieldSetElement).disabled = false; });
  }
});

test("disabling a focused token input preserves its uncommitted draft", async ({ page }) => {
  const input = page.getByRole("textbox", { name: "Host labels", exact: true });
  const values = () => page.getByRole("form", { name: "Host form" }).evaluate(node => new FormData(node as HTMLFormElement).getAll("labels"));
  await page.getByRole("button", { name: "Schedule disabled", exact: true }).click();
  await input.fill("Uncommitted");
  await page.clock.runFor(500);
  await expect(input).toBeDisabled();
  await page.getByRole("button", { name: "Resume editing", exact: true }).click();
  await expect(input).toHaveValue("Uncommitted");
  expect(await values()).toEqual(["Planning"]);
  await input.focus();
  await input.press("Tab");
  await expect(input).toHaveValue("");
  expect(await values()).toEqual(["Planning", "Uncommitted"]);
});
