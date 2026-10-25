import { expect, test } from "@playwright/test";
import { themeNames, themes } from "@evenkit/tokens";

const colors = themeNames.map(name => ({ name, light: themes[name].modes.light, dark: themes[name].modes.dark }));

for (const route of ["chart-frame", "bar-chart", "dashboard"]) {
  test(`${route} keeps chart paint, keyboard focus and long labels usable in every theme and direction`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/#${route}`);
    const figure = page.locator(".pk-chart-frame").first();
    const interaction = figure.locator(".pk-chart-interaction");
    await expect(interaction).toBeVisible();
    await page.keyboard.press("Tab");
    await interaction.focus();
    await interaction.press("ArrowRight");
    await expect(figure.getByRole("tooltip")).toBeVisible();

    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      const failures = await page.evaluate(({ palettes }) => {
        const root = document.documentElement;
        const initial = { theme: root.dataset.kitTheme, mode: root.dataset.kitMode, dir: root.getAttribute("dir") };
        const figure = document.querySelector<HTMLElement>(".pk-chart-frame");
        const interaction = figure?.querySelector<HTMLElement>(".pk-chart-interaction");
        if (!figure || !interaction) return ["Chart frame missing"];
        const failures: string[] = [];
        const rgb = (hex: string) => `rgb(${[1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16)).join(", ")})`;
        try {
          for (const palette of palettes) for (const mode of ["light", "dark"] as const) for (const dir of ["ltr", "rtl"]) {
            root.dataset.kitTheme = palette.name;
            root.dataset.kitMode = mode;
            root.setAttribute("dir", dir);
            const prefix = `${palette.name}/${mode}/${dir}/${window.innerWidth}`;
            const frameStyle = getComputedStyle(figure);
            const focusStyle = getComputedStyle(interaction);
            const tokenStyle = getComputedStyle(root);
            if (root.scrollWidth > window.innerWidth + 1) failures.push(`${prefix}: page overflow`);
            if (figure.scrollWidth > figure.clientWidth + 1) failures.push(`${prefix}: chart content overflow`);
            if (frameStyle.backgroundColor !== rgb(palette[mode].surface)) failures.push(`${prefix}: non-neutral chart surface`);
            if (document.activeElement !== interaction) failures.push(`${prefix}: lost chart focus`);
            if (!interaction.matches(":focus-visible") || Number.parseFloat(focusStyle.outlineWidth) < 1 || focusStyle.outlineColor !== rgb(palette[mode].ring)) failures.push(`${prefix}: missing themed focus ring`);
            const mark = figure.querySelector(".pk-chart-line, pattern > rect");
            if (!mark) failures.push(`${prefix}: chart mark missing`);
            else {
              const style = getComputedStyle(mark);
              const paint = mark.classList.contains("pk-chart-line") ? style.stroke : style.fill;
              if (paint !== rgb(palette[mode]["chart-series-1"])) failures.push(`${prefix}: primary series paint`);
            }
            for (let index = 1; index <= 6; index++) {
              if (!/^#[0-9a-f]{6}$/i.test(tokenStyle.getPropertyValue(`--pk-chart-series-${index}`).trim())) failures.push(`${prefix}: unresolved series ${index}`);
            }
            for (const label of figure.querySelectorAll<HTMLElement>(".pk-chart-row-labels span, .pk-chart-categories span, .pk-chart-tooltip dt, .pk-chart-tooltip dd")) {
              if (label.scrollWidth > label.clientWidth + 1) failures.push(`${prefix}: label overflow ${label.textContent}`);
            }
          }
          if (figure.getAnimations({ subtree: true }).some(animation => animation.playState === "running")) failures.push("Chart animates with reduced motion enabled");
        } finally {
          if (initial.theme === undefined) delete root.dataset.kitTheme;
          else root.dataset.kitTheme = initial.theme;
          if (initial.mode === undefined) delete root.dataset.kitMode;
          else root.dataset.kitMode = initial.mode;
          if (initial.dir === null) root.removeAttribute("dir");
          else root.setAttribute("dir", initial.dir);
        }
        return failures;
      }, { palettes: colors });
      expect(failures).toEqual([]);
    }
    await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
    await interaction.press("Home");
    const first = await figure.getByRole("tooltip").locator("strong").textContent();
    await interaction.press("ArrowRight");
    await expect(figure.getByRole("tooltip").locator("strong")).not.toHaveText(first ?? "");
    await interaction.press("Escape");
    await expect(figure.getByRole("tooltip")).toBeHidden();
    await expect(interaction).toBeFocused();
    await figure.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(figure.getByRole("table")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    expect(errors).toEqual([]);
  });
}
