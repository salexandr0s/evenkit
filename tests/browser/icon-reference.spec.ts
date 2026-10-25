import { expect, test, type Page } from "@playwright/test";
import * as kit from "@project-kit/ui";

async function choose(page: Page, label: string, value: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: value, exact: true }).click();
}

test("icon reference combines aliases and categories, copies imports, and preserves accessible patterns", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#icons");
  const reference = page.getByRole("region", { name: "Icon reference", exact: true });
  const search = reference.getByRole("searchbox", { name: "Search icons", exact: true });
  const gallery = reference.getByRole("list", { name: "Available icons", exact: true });
  const size = reference.getByRole("combobox", { name: "Icon size", exact: true });

  await choose(page, "Icon category", "Actions");
  await search.fill("delete");
  await expect(gallery.locator("[data-icon]")).toHaveCount(1);
  const trash = gallery.locator('[data-icon="TrashIcon"]');
  await choose(page, "Icon size", "Large · 24px");
  await expect(trash.locator("svg")).toHaveCSS("width", "24px");
  await expect(trash.locator("svg")).toHaveAttribute("aria-hidden", "true");

  const copy = trash.getByRole("button", { name: "Copy import for TrashIcon", exact: true });
  await copy.press("Enter");
  const namedImport = 'import { TrashIcon } from "@project-kit/ui";';
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(namedImport);
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => { throw new Error("Clipboard blocked in this regression check"); },
    });
  });
  await copy.press("Enter");
  await expect(reference.getByRole("status").filter({ hasText: /unavailable|could not|unable/i })).toBeVisible();
  await expect(trash).toContainText(namedImport);

  await choose(page, "Icon category", "Appearance");
  await expect(gallery.locator("[data-icon]")).toHaveCount(0);
  await reference.getByRole("button", { name: "Reset icon filters", exact: true }).press("Enter");
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(size).toHaveText("Large · 24px");
  const names = await gallery.locator("[data-icon]").evaluateAll(elements => elements.map(element => element.getAttribute("data-icon")));
  expect(names.sort()).toEqual(Object.keys(kit).filter(name => name.endsWith("Icon")).sort());

  const labelledIcon = page.getByRole("img", { name: "Search projects", exact: true });
  await expect(labelledIcon).toBeVisible();
  const iconAction = page.getByRole("button", { name: "Add preview project", exact: true });
  await expect(iconAction.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await iconAction.press("Enter");
  await expect(page.getByText("Icon button activated in this preview.", { exact: true })).toBeVisible();
  const textAction = page.getByRole("button", { name: "Create preview project", exact: true });
  await expect(textAction.locator("svg")).toHaveAttribute("aria-hidden", "true");

  // Full import paths must remain readable without making the page wider.
  await search.fill("directory");
  await expect(gallery.locator('[data-icon="FolderIcon"]')).toBeVisible();
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect((await gallery.getByRole("button", { name: "Copy import for FolderIcon", exact: true }).boundingBox())?.height).toBeGreaterThanOrEqual(44);
});
