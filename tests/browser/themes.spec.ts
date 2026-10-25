import { expect, test, type Page } from "@playwright/test";
import { themes, themeNames } from "@evenkit/tokens";

async function chooseOption(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

function rgb(hex: string): string {
  return `rgb(${[1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)).join(", ")})`;
}

test("theme gallery applies and remembers a palette across appearance changes and portals", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/#themes");
  const gallery = page.getByRole("region", { name: "Themes live preview", exact: true });
  await expect(gallery.getByRole("article")).toHaveCount(themeNames.length);
  const linen = gallery.getByRole("article", { name: "Linen", exact: true });
  const apply = linen.getByRole("button", { name: "Apply Linen", exact: true });
  await apply.focus();
  await expect(apply).toBeFocused();
  await apply.press("Enter");
  await expect(apply).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("combobox", { name: "Theme", exact: true })).toHaveText("Linen");
  await expect(page.locator("body")).toHaveCSS("background-color", rgb(themes.neutral.modes.light.bg));
  await expect(linen).toHaveCSS("background-color", rgb(themes.neutral.modes.light.surface));
  await expect(apply).toHaveCSS("background-color", rgb(themes.linen.modes.light.accent));
  await expect(linen.locator(".theme-specimen-heading")).toHaveCSS("font-family", /Georgia/);

  await page.reload();
  await expect(apply).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-kit-theme", "linen");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).not.toHaveAttribute("data-kit-mode");
  await expect(linen).toHaveAttribute("data-mode", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", rgb(themes.neutral.modes.dark.bg));
  await expect(apply).toHaveCSS("background-color", rgb(themes.linen.modes.dark.accent));
  await page.getByRole("button", { name: "Switch to light mode", exact: true }).click();
  await expect(linen).toHaveAttribute("data-mode", "light");
  await expect(page.locator("body")).toHaveCSS("color", rgb(themes.neutral.modes.light.fg));

  // The toolbar and cards share one selection; an unapplied card keeps its own palette.
  await chooseOption(page, "Theme", "Ocean");
  await expect(apply).toHaveAttribute("aria-pressed", "false");
  const oceanApply = gallery.getByRole("button", { name: "Apply Ocean", exact: true });
  await expect(oceanApply).toHaveAttribute("aria-pressed", "true");
  await expect(oceanApply).toHaveCSS("background-color", rgb(themes.ocean.modes.light.accent));
  await expect(page.locator("body")).toHaveCSS("background-color", rgb(themes.neutral.modes.light.bg));
  await expect(linen.locator(".theme-specimen-body")).toHaveCSS("color", rgb(themes.neutral.modes.light.fg));
  await expect(linen.locator(".theme-specimen-mark")).toHaveCSS("background-color", rgb(themes.linen.modes.light.accent));
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }

  await apply.click();
  await page.getByRole("button", { name: "Switch to dark mode", exact: true }).click();
  await page.getByRole("navigation", { name: "Components", exact: true }).getByRole("link", { name: "Dialog", exact: true }).click();
  await page.getByRole("button", { name: "Edit project", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Edit project", exact: true });
  await expect(dialog).toHaveCSS("background-color", rgb(themes.neutral.modes.dark["surface-elevated"]));
  await expect(dialog).toHaveCSS("color", rgb(themes.neutral.modes.dark.fg));
  await expect(dialog.getByRole("button", { name: "Save preview", exact: true })).toHaveCSS("background-color", rgb(themes.linen.modes.dark.accent));
  await expect(dialog.getByRole("heading", { name: "Edit project", exact: true })).toHaveCSS("font-family", /Georgia/);
});
