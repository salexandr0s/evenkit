import { expect, test } from "@playwright/test";
import { entries } from "../../apps/catalog/src/catalog-data.js";
import { themeNames } from "@evenkit/tokens";

// Package/type checks cannot detect long labels escaping a themed page or a
// missing lazy preview. Exercise every priority route at the contract widths.
for (const entry of entries.filter(item => item.inventoryIds?.length)) {
  test(`${entry.name} loads and fits the theme and viewport contracts`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`/#${entry.id}`);
    await expect(page.locator(".catalog-title-row h1")).toHaveText(entry.name);
    // An initially open editor makes its background aria-hidden. Inspect the
    // named preview in the DOM while separately checking the visible dialog.
    const preview = page.locator(".catalog-preview");
    await expect(preview).toHaveAttribute("aria-label", `${entry.name} live preview`);
    await expect(preview).toBeVisible();
    await expect(preview.locator('.pk-spinner[aria-label="Loading component preview"]')).toHaveCount(0);
    // The named lazy-loading fallback must disappear before inspecting content.
    await expect(preview.locator(".catalog-preview-content > :first-child")).toBeVisible();
    if (entry.id === "edit-page") await expect(page.getByRole("dialog", { name: "Edit project", exact: true })).toBeVisible();

    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      const failures = await page.evaluate(({ names }) => {
        const root = document.documentElement;
        const originalTheme = root.dataset.kitTheme;
        const originalMode = root.dataset.kitMode;
        const failures: string[] = [];
        try {
          for (const theme of names) for (const mode of ["light", "dark"]) {
            root.dataset.kitTheme = theme;
            root.dataset.kitMode = mode;
            if (root.scrollWidth > window.innerWidth + 1) failures.push(`${theme}/${mode}: page ${root.scrollWidth}px exceeds ${window.innerWidth}px`);
            const preview = document.querySelector(".catalog-preview-content");
            if (!(preview instanceof HTMLElement) || preview.clientWidth === 0) failures.push(`${theme}/${mode}: preview missing`);
            for (const dialog of document.querySelectorAll<HTMLElement>('.pk-dialog-content[data-state="open"]')) {
              const bounds = dialog.getBoundingClientRect();
              if (bounds.left < -1 || bounds.right > window.innerWidth + 1) failures.push(`${theme}/${mode}: dialog exceeds viewport`);
            }
          }
        } finally {
          if (originalTheme === undefined) delete root.dataset.kitTheme;
          else root.dataset.kitTheme = originalTheme;
          if (originalMode === undefined) delete root.dataset.kitMode;
          else root.dataset.kitMode = originalMode;
        }
        return failures;
      }, { names: themeNames });
      expect(failures, `${entry.id} at ${width}px`).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}
