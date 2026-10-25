import { describe, expect, it } from "vitest";
import {
  brandSchema,
  colorModes,
  contrastChecks,
  contrastRatio,
  createBrandCss,
  cssVariables,
  foundation,
  generateCss,
  themeNames,
  themes,
} from "../src/index.js";

describe("theme trust boundary", () => {
  it("rejects CSS injection through identifiers, fonts, dimensions, and colors", () => {
    const base = structuredClone(themes.neutral);
    const invalid = [
      { ...base, id: 'bad"]{color:red}' },
      { ...base, fontFamily: "Arial; color: red" },
      { ...base, radius: { ...base.radius, md: "calc(100vw)" } },
      { ...base, radius: { ...base.radius, md: "999px" } },
      { ...base, modes: { ...base.modes, light: { ...base.modes.light, accent: "var(--untrusted)" } } },
      { ...base, modes: { ...base.modes, light: { ...base.modes.light, accent: "{unknown.alias}" } } },
    ];
    for (const input of invalid) expect(brandSchema.safeParse(input).success).toBe(false);
  });

  it("rejects malformed font lists for body and heading typography", () => {
    for (const property of ["fontFamily", "headingFamily"] as const) {
      for (const value of ["'", ",", "Arial, '", "Arial,", ", Arial", '""', "' '", "Arial,,serif", "Arial, inherit", "Arial inherit", "Times New Roman", "1Font"]) {
        expect(brandSchema.safeParse({ ...themes.neutral, [property]: value }).success, `${property}: ${value}`).toBe(false);
        expect(() => createBrandCss({ ...themes.neutral, [property]: value })).toThrow();
      }
    }
    const body = foundation.font.family.sans;
    const heading = '"Sample Display", Georgia, serif';
    const css = createBrandCss({ ...themes.neutral, fontFamily: body, headingFamily: heading });
    expect(css).toContain(`--pk-font-family-sans: ${body};`);
    expect(css).toContain(`--pk-font-family-heading: ${heading};`);
  });

  it("rejects missing semantic tokens and insufficient contrast", () => {
    const base = structuredClone(themes.neutral);
    const withoutRing: Partial<typeof base.modes.light> = { ...base.modes.light };
    delete withoutRing.ring;
    expect(brandSchema.safeParse({ ...base, modes: { ...base.modes, light: withoutRing } }).success).toBe(false);
    expect(brandSchema.safeParse({
      ...base,
      modes: { ...base.modes, light: { ...base.modes.light, accent: foundation.palette.blue[500] } },
    }).success).toBe(false);
  });

  it("keeps built-in themes neutral outside their distinct accents", () => {
    const accentRoles = new Set(["accent", "accent-hover", "on-accent", "accent-soft", "ring", "chart-series-1"]);
    for (const mode of colorModes) {
      const sharedColors = Object.entries(themes.neutral.modes[mode]).filter(([role]) => !accentRoles.has(role));
      for (const name of themeNames) {
        expect(Object.entries(themes[name].modes[mode]).filter(([role]) => !accentRoles.has(role)), `${name}/${mode}`).toEqual(sharedColors);
      }
      expect(new Set(themeNames.map((name) => themes[name].modes[mode].accent)).size).toBe(themeNames.length);
    }
  });

  it("checks every required foreground/background pair in all themes and modes", () => {
    for (const name of themeNames) {
      for (const mode of colorModes) {
        const colors = themes[name].modes[mode];
        for (const check of contrastChecks) {
          expect(contrastRatio(colors[check.foreground], colors[check.background]), `${name}/${mode}/${check.foreground}/${check.background}`).toBeGreaterThanOrEqual(check.minimum);
        }
      }
    }
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
    expect(contrastRatio("#ffffff", "#000000")).toBe(21);
  });

  it("rejects a custom hover surface that makes neutral button labels unreadable", () => {
    const input = structuredClone(themes.neutral);
    input.modes.dark.accent = "#FFFFFF";
    input.modes.dark["accent-soft"] = "#767676";

    expect(contrastRatio(input.modes.dark.fg, input.modes.dark["accent-soft"])).toBeLessThan(4.5);
    const result = brandSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "modes.dark.fg" && issue.message.includes("accent-soft"))).toBe(true);
    }
    expect(() => createBrandCss(input)).toThrow();
  });

  it("requires safe chart colors and validates every series on plotting surfaces", () => {
    for (const role of ["chart-series-1", "chart-series-2", "chart-series-3", "chart-series-4", "chart-series-5", "chart-series-6"] as const) {
      const base = structuredClone(themes.neutral);
      const incomplete: Partial<typeof base.modes.light> = { ...base.modes.light };
      delete incomplete[role];
      expect(brandSchema.safeParse({ ...base, modes: { ...base.modes, light: incomplete } }).success).toBe(false);
      for (const value of ["var(--unsafe)", "#FFFFFF"]) {
        expect(brandSchema.safeParse({
          ...base,
          modes: { ...base.modes, light: { ...base.modes.light, [role]: value } },
        }).success).toBe(false);
      }
      for (const name of themeNames) {
        for (const mode of colorModes) {
          const colors = themes[name].modes[mode];
          expect(cssVariables(name, mode)[`--pk-${role}`]).toBe(colors[role]);
          if (role === "chart-series-1") expect(colors[role]).toBe(colors.accent);
          for (const background of ["bg", "bg-muted", "surface", "surface-elevated"] as const) {
            expect(contrastChecks).toContainEqual({ foreground: role, background, minimum: 3 });
          }
        }
      }
    }
  });

  it("rejects unreadable secondary text and inset focus rings on selected surfaces", () => {
    for (const [foreground, value] of [["fg-muted", "#9696A0"], ["ring", "#767680"]] as const) {
      const input = structuredClone(themes.neutral);
      input.modes.dark[foreground] = value;
      for (const background of ["bg", "bg-muted", "surface", "surface-elevated"] as const) {
        expect(contrastRatio(value, input.modes.dark[background])).toBeGreaterThanOrEqual(foreground === "ring" ? 3 : 4.5);
      }
      const result = brandSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.path.join(".") === `modes.dark.${foreground}` && issue.message.includes("accent-soft"))).toBe(true);
      }
    }
  });
});

describe("portable token output", () => {
  it("generates deterministic fully resolved CSS with document-only selectors", () => {
    const css = generateCss();
    expect(css).toBe(generateCss());
    expect(css).not.toMatch(/\{(?:color|space|font|radius)\./);
    expect(css).toContain(':root[data-kit-theme="grove"][data-kit-mode="dark"]');
    expect(css).toContain(':root[data-kit-theme="grove"]:not([data-kit-mode])');
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).not.toMatch(/(?:^|\n)(?:body|button|input)\s*\{/);
    expect(cssVariables("neutral", "light")["--pk-space-4"]).toBe("16px");
    expect(cssVariables("grove", "dark")["--pk-color-accent"]).toBe(themes.grove.modes.dark.accent);
  });

  it("emits validated custom brand values rather than silently ignoring them", () => {
    const css = createBrandCss({ ...themes.grove, id: "sample", fontFamily: "Georgia, serif", radius: { sm: "2px", md: "4px", lg: "8px" } });
    expect(css).toContain(':root[data-kit-theme="sample"]');
    expect(css).toContain("--pk-font-family-sans: Georgia, serif;");
    expect(css).toContain("--pk-radius-md: 4px;");
  });
});
