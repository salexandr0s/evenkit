import { z } from "zod";
import { contrastRatio } from "./contrast.js";
import { foundation } from "./foundation.js";

const color = z.string().regex(/^#[0-9a-f]{6}$/i, "Use a six-digit hexadecimal color.");
const cssWideKeywords = new Set(["inherit", "initial", "unset", "revert", "revert-layer", "default"]);

function isFontFamilyList(value: string): boolean {
  return value.split(",").every((part) => {
    const family = part.trim();
    const quote = family.charAt(0);
    if (quote === '"' || quote === "'") {
      if (family.length < 3 || !family.endsWith(quote)) return false;
      const name = family.slice(1, -1);
      return name.trim().length > 0 && /^[a-zA-Z0-9 ._-]+$/.test(name);
    }
    return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(family)
      && !cssWideKeywords.has(family.toLowerCase());
  });
}

const fontFamily = z.string().trim().min(1).max(300).refine(isFontFamilyList, "Use a comma-separated list of font family names with balanced quotes.");
const radius = z.string().regex(/^\d+(?:\.\d+)?(?:px|rem)$/).refine((value) => {
  const amount = Number.parseFloat(value);
  return value.endsWith("rem") ? amount <= 2 : amount <= 32;
}, "Radius must be at most 32px or 2rem.");
const overlay = z.string().regex(/^rgba\(0,\s*0,\s*0,\s*(?:0(?:\.\d+)?|1(?:\.0+)?)\)$/);

export const modeColorsSchema = z.strictObject({
  bg: color,
  "bg-muted": color,
  surface: color,
  "surface-elevated": color,
  fg: color,
  "fg-muted": color,
  border: color,
  "border-strong": color,
  accent: color,
  "accent-hover": color,
  "on-accent": color,
  "accent-soft": color,
  danger: color,
  "danger-hover": color,
  "on-danger": color,
  "danger-bg": color,
  warning: color,
  "warning-bg": color,
  success: color,
  "success-bg": color,
  ring: color,
  overlay,
});

export type ModeColors = z.infer<typeof modeColorsSchema>;
export const colorModes = ["light", "dark"] as const;
export type ColorMode = (typeof colorModes)[number];

export interface ContrastCheck {
  foreground: keyof ModeColors;
  background: keyof ModeColors;
  minimum: number;
}

export const contrastChecks: readonly ContrastCheck[] = [
  ...(["bg", "bg-muted", "surface", "surface-elevated"] as const).flatMap((background) => [
    { foreground: "fg" as const, background, minimum: 4.5 },
    { foreground: "fg-muted" as const, background, minimum: 4.5 },
    { foreground: "accent" as const, background, minimum: 4.5 },
    { foreground: "danger" as const, background, minimum: 4.5 },
    { foreground: "border-strong" as const, background, minimum: 3 },
    { foreground: "ring" as const, background, minimum: 3 },
  ]),
  { foreground: "on-accent", background: "accent", minimum: 4.5 },
  { foreground: "on-accent", background: "accent-hover", minimum: 4.5 },
  { foreground: "on-danger", background: "danger", minimum: 4.5 },
  { foreground: "on-danger", background: "danger-hover", minimum: 4.5 },
  { foreground: "accent", background: "accent-soft", minimum: 4.5 },
  { foreground: "fg", background: "accent-soft", minimum: 4.5 },
  { foreground: "fg-muted", background: "accent-soft", minimum: 4.5 },
  { foreground: "ring", background: "accent-soft", minimum: 3 },
  { foreground: "danger", background: "danger-bg", minimum: 4.5 },
  { foreground: "warning", background: "warning-bg", minimum: 4.5 },
  { foreground: "success", background: "success-bg", minimum: 4.5 },
];

function checkModes(modes: Record<ColorMode, ModeColors>, context: z.RefinementCtx) {
  for (const mode of colorModes) {
    const colors = modes[mode];
    for (const check of contrastChecks) {
      if (!/^#[0-9a-f]{6}$/i.test(colors[check.foreground]) || !/^#[0-9a-f]{6}$/i.test(colors[check.background])) continue;
      const ratio = contrastRatio(colors[check.foreground], colors[check.background]);
      if (ratio < check.minimum) {
        context.addIssue({
          code: "custom",
          path: ["modes", mode, check.foreground],
          message: `${check.foreground} against ${check.background} is ${ratio.toFixed(2)}:1; requires ${check.minimum}:1.`,
        });
      }
    }
  }
}

const themeObject = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]{0,31}$/),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(240),
  modes: z.strictObject({ light: modeColorsSchema, dark: modeColorsSchema }),
});

export const brandSchema = themeObject.extend({
  fontFamily: fontFamily.default(foundation.font.family.sans),
  headingFamily: fontFamily.default(foundation.font.family.sans),
  radius: z.strictObject({ sm: radius, md: radius, lg: radius }).default({
    sm: foundation.radius.sm,
    md: foundation.radius.md,
    lg: foundation.radius.lg,
  }),
}).superRefine((brand, context) => checkModes(brand.modes, context));
export const themeSchema = brandSchema;

export type Theme = z.infer<typeof themeSchema>;
export type Brand = z.infer<typeof brandSchema>;

export function validateTheme(input: unknown): Theme {
  return themeSchema.parse(input);
}

export function validateBrand(input: unknown): Brand {
  return brandSchema.parse(input);
}

export function assertThemeContrast(input: unknown): void {
  brandSchema.parse(input);
}
