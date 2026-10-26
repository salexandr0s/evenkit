import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium, expect } from "@playwright/test";
import { buildRegistry } from "./build.mjs";
import { sha256 } from "./catalog.mjs";
import { createViewer } from "./viewer.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const artifacts = join(root, ".artifacts/block-registry-design");
const scratch = await mkdtemp(join(tmpdir(), "evenkit-viewer-"));
const report = { status: "running", widths: [], contrast: {}, checks: [], runtimeErrors: [], requests: [], scratchRemoved: false };
let browser;
try {
  await mkdir(artifacts, { recursive: true });
  const catalog = await buildRegistry({ root, output: join(scratch, "catalog") });
  await createViewer({ registry: join(scratch, "catalog"), output: join(scratch, "viewer.html") });
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, colorScheme: "light" });
  page.on("pageerror", error => report.runtimeErrors.push(error.message));
  page.on("console", message => { if (message.type() === "error") report.runtimeErrors.push(message.text()); });
  page.on("request", request => { if (/^https?:/.test(request.url())) report.requests.push(request.url()); });
  await page.goto(pathToFileURL(join(scratch, "viewer.html")).href);
  await expect(page.locator("#block-heading")).toHaveText("Record detail");
  await expect(page.locator("#block-list button")).toHaveCount(catalog.items.length);
  await expect(page.locator("#copy-command")).toBeDisabled();
  await page.locator("#search").fill("O11");
  await expect(page.locator("#block-list button")).toHaveCount(1);
  await page.locator("#block-list button").click();
  await expect(page.locator("#block-heading")).toHaveText("Recovery page");
  await page.locator("#search").fill("no-matching-block");
  await expect(page.locator("#empty")).toBeVisible();
  await page.locator("#clear-search").click();
  await expect(page.locator("#search")).toBeFocused();
  await page.getByRole("button", { name: "Record detail 2 files", exact: true }).click();
  report.checks.push("Search by inventory, empty state and selection");

  await page.locator("#overview-tab").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#source-tab")).toBeFocused();
  await expect(page.locator("#source-tab")).toHaveAttribute("aria-selected", "true");
  await page.locator("#source-file").selectOption("1");
  await expect(page.locator("#source-path")).toHaveText("registry/blocks/record-workflow.tsx");
  await page.locator("#source-file").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#copy-source")).toBeFocused();
  await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Clipboard denied for fixture"); } } }); });
  await page.locator("#copy-source").click();
  await expect(page.locator("#source-fallback")).toBeFocused();
  await expect(page.locator("#source-fallback")).toHaveValue(catalog.items.find(item => item.name === "record-detail").files[1].content);
  await page.locator("#overview-tab").click();
  await page.locator("#consumer").fill("/tmp/My app's source");
  await page.locator("#directory").fill("../escape");
  await expect(page.locator("#directory")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#copy-command")).toBeDisabled();
  await page.locator("#directory").fill("src/blocks");
  await expect(page.locator("#copy-command")).toBeEnabled();
  assert.match(await page.locator("#install-command").inputValue(), /--dry-run$/);
  await page.locator("#copy-command").click();
  await expect(page.locator("#install-command")).toBeFocused();
  await expect(page.locator("#command-status")).toContainText("Clipboard unavailable");
  const selection = await page.locator("#install-command").evaluate(node => [node.selectionStart, node.selectionEnd, node.value.length]);
  assert.deepEqual(selection, [0, selection[2], selection[2]]);
  await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async text => { window.copiedCommand = text; } } }); });
  await page.locator("#copy-command").click();
  await expect(page.locator("#command-status")).toHaveText("Copied to clipboard.");
  assert.equal(await page.evaluate(() => window.copiedCommand), await page.locator("#install-command").inputValue());
  report.checks.push("Keyboard tabs, exact source fallback, path validation, command clipboard success/fallback");

  await page.locator("#consumer").fill("/path/to/your-app");
  const settle = () => page.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    await Promise.all(document.getAnimations().map(animation => animation.finished));
    window.scrollTo(0, 0);
  });
  const contrast = () => page.evaluate(() => {
    const luminance = color => {
      const values = color.match(/[\d.]+/g).slice(0, 3).map(value => {
        const channel = Number(value) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    };
    return Object.fromEntries([".intro-copy", ".file-note", ".private-badge", ".block-link[aria-current=true] .block-link-title", ".block-link[aria-current=true] .block-link-meta", "#search", "#copy-command"].map(selector => {
      const node = document.querySelector(selector);
      let background = node;
      while (getComputedStyle(background).backgroundColor === "rgba(0, 0, 0, 0)" && background.parentElement) background = background.parentElement;
      const foregroundLuminance = luminance(getComputedStyle(node).color);
      const backgroundLuminance = luminance(getComputedStyle(background).backgroundColor);
      return [selector, (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)];
    }));
  });
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const tab of ["overview", "source"]) {
      await page.locator(`#${tab}-tab`).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      assert.equal(overflow, false, `${tab} overflows at ${width}px`);
    }
    await page.locator("#overview-tab").click();
    await settle();
    await page.screenshot({ path: join(artifacts, `viewer-${width}-light.png`), fullPage: true });
    report.widths.push(width);
  }
  report.contrast.light = await contrast();
  const initialBackground = await page.locator("html").evaluate(node => getComputedStyle(node).backgroundColor);
  await page.getByRole("button", { name: "Switch to dark appearance" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-kit-mode", "dark");
  assert.notEqual(await page.locator("html").evaluate(node => getComputedStyle(node).backgroundColor), initialBackground);
  await settle();
  report.contrast.dark = await contrast();
  for (const ratios of Object.values(report.contrast)) for (const [selector, ratio] of Object.entries(ratios)) assert.ok(ratio >= 4.5, `Text contrast below AA: ${selector}: ${ratio}`);
  await page.screenshot({ path: join(artifacts, "viewer-1440-dark.png"), fullPage: true });
  await page.locator("#source-tab").click();
  await settle();
  await page.screenshot({ path: join(artifacts, "viewer-source-dark.png"), fullPage: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await page.locator("#appearance").evaluate(node => getComputedStyle(node).transitionDuration), "0s");
  report.checks.push("Responsive overview/source, light/dark text contrast, real dark tokens, reduced motion");

  const malicious = structuredClone(catalog);
  malicious.items[0].title = '</script><img src="https://invalid.example/asset" onerror="window.injected=true">';
  malicious.items[0].files[0].content = '</script><script>window.injected=true</script>' + "\n".repeat(6000);
  malicious.items[0].meta.evenkit.files[0].sha256 = sha256(malicious.items[0].files[0].content);
  await mkdir(join(scratch, "malicious"));
  await writeFile(join(scratch, "malicious/registry.json"), JSON.stringify(malicious));
  await createViewer({ registry: join(scratch, "malicious"), output: join(scratch, "malicious.html") });
  await page.goto(pathToFileURL(join(scratch, "malicious.html")).href);
  await page.locator("#block-list button").first().click();
  await expect(page.locator("#block-heading")).toHaveText(malicious.items[0].title);
  await page.locator("#source-tab").click();
  assert.match(await page.locator("#source-lines").innerText(), /<script>window.injected=true<\/script>/);
  await expect(page.locator("#source-lines li")).toHaveCount(5000);
  await expect(page.locator("#line-count")).toContainText("5000 of 6001 lines");
  await page.setViewportSize({ width: 360, height: 1000 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, "Long source preview overflows mobile layout");
  assert.equal(await page.evaluate(() => window.injected), undefined);
  assert.equal(await page.locator("img").count(), 0);
  assert.deepEqual(report.runtimeErrors, []);
  assert.deepEqual(report.requests, []);
  report.checks.push("Malicious catalog/source stay text, no runtime errors or network requests");
  // Confirm every CSS variable used by the viewer is provided by its token snapshot.
  const css = await readFile(new URL("./viewer.css", import.meta.url), "utf8");
  const tokens = await readFile(join(root, "packages/tokens/dist/tokens.css"), "utf8");
  for (const [, token] of css.matchAll(/var\((--pk-[a-z0-9-]+)/g)) assert.ok(tokens.includes(`${token}:`), `Undefined token: ${token}`);
  report.checks.push("All viewer CSS variables resolve to the Evenkit token package");
  report.status = "passed";
} catch (error) {
  report.status = "failed";
  report.error = error.stack ?? error.message;
  process.exitCode = 1;
} finally {
  await browser?.close();
  await rm(scratch, { recursive: true, force: true });
  report.scratchRemoved = true;
  await writeFile(join(artifacts, "browser-verification.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
}
