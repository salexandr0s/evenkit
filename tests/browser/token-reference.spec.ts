import { expect, test, type Page } from "@playwright/test";
import { contrastRatio, cssVariables, themes } from "@evenkit/tokens";

async function chooseOption(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

test("token reference keeps search, copying and contrast tied to the selected theme", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/#tokens");
  const reference = page.getByRole("region", { name: "Token reference", exact: true });
  const search = reference.getByRole("searchbox", { name: "Search tokens" });
  const category = reference.getByRole("combobox", { name: "Token category" });
  const list = reference.getByRole("list", { name: "Resolved tokens" });
  const accent = list.locator('[data-token="--pk-color-accent"]');

  await expect(category).toHaveText("Semantic colors");
  await search.fill("spacing");
  await reference.getByRole("button", { name: "Clear token search", exact: true }).press("Enter");
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(category).toHaveText("Semantic colors");
  await search.fill("--pk-color-accent");
  await expect(accent).toContainText(themes.neutral.modes.light.accent);
  await accent.getByRole("button", { name: "Copy --pk-color-accent", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("var(--pk-color-accent)");

  await chooseOption(page, "Theme", "Grove");
  await page.getByRole("button", { name: "Switch to dark mode", exact: true }).click();
  await expect(search).toHaveValue("--pk-color-accent");
  await expect(category).toHaveText("Semantic colors");
  await expect(accent).toContainText(themes.grove.modes.dark.accent);

  await page.locator("summary").filter({ hasText: "Contrast checks" }).click();
  const contrast = page.getByRole("list", { name: "Defined contrast pairs" });
  const colors = themes.grove.modes.dark;
  await expect(contrast.locator('[data-contrast="fg/bg"]')).toContainText(contrastRatio(colors.fg, colors.bg).toFixed(2));
  await page.getByRole("button", { name: "Switch to light mode", exact: true }).click();
  await expect(contrast.locator('[data-contrast="fg/bg"]')).toContainText(contrastRatio(themes.grove.modes.light.fg, themes.grove.modes.light.bg).toFixed(2));

  // Clipboard denial must leave the copyable expression on screen.
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => { throw new Error("Clipboard blocked in this regression check"); },
    });
  });
  await accent.getByRole("button", { name: "Copy --pk-color-accent", exact: true }).click();
  await expect(accent.getByRole("status")).toContainText("Copy is unavailable.");
  await expect(accent).toContainText("var(--pk-color-accent)");

  await search.fill("no-such-token");
  await expect(list.locator("[data-token]")).toHaveCount(0);
  await reference.getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(category).toHaveText("All tokens");
  const names = await list.locator("[data-token]").evaluateAll(elements => elements.map(element => element.getAttribute("data-token")));
  expect(names.sort()).toEqual(Object.keys(cssVariables("grove", "light")).sort());

  // Long font-family values and the expanded contrast list must stay in the page.
  await chooseOption(page, "Token category", "Typography");
  await search.fill("font-family");
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(list.locator('[data-token="--pk-font-family-sans"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }

  const sample = page.getByRole("region", { name: "Theme sample", exact: true });
  const workspace = sample.getByRole("textbox", { name: "Workspace name", exact: true });
  await workspace.fill("   ");
  await sample.getByRole("button", { name: "Create workspace", exact: true }).press("Enter");
  await expect(workspace).toHaveAttribute("aria-invalid", "true");
  await expect(workspace).toBeFocused();
  await expect(sample.getByRole("status")).not.toHaveText("Workspace created in this preview.");
  await workspace.fill("Research workspace");
  await workspace.press("Enter");
  await expect(sample.getByRole("status")).toHaveText("Workspace created in this preview.");
});
