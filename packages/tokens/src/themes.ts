import { foundation } from "./foundation.js";
import { brandSchema, type Brand } from "./schema.js";

const { neutral, blue, green, red, amber } = foundation.palette;
const light = {
  bg: neutral[0],
  "bg-muted": neutral[50],
  surface: neutral[0],
  "surface-elevated": neutral[0],
  fg: neutral[900],
  "fg-muted": neutral[600],
  border: neutral[200],
  "border-strong": neutral[500],
  accent: blue[700],
  "accent-hover": blue[800],
  "on-accent": neutral[0],
  "accent-soft": blue[50],
  danger: red[700],
  "danger-hover": red[800],
  "on-danger": neutral[0],
  "danger-bg": red[50],
  warning: amber[800],
  "warning-bg": amber[50],
  success: green[800],
  "success-bg": green[50],
  ring: blue[700],
  overlay: "rgba(0,0,0,0.40)",
};
const dark = {
  bg: neutral[1000],
  "bg-muted": neutral[900],
  surface: neutral[900],
  "surface-elevated": neutral[800],
  fg: neutral[100],
  "fg-muted": neutral[400],
  border: neutral[700],
  "border-strong": neutral[400],
  accent: blue[300],
  "accent-hover": blue[200],
  "on-accent": neutral[1000],
  "accent-soft": blue[900],
  danger: red[300],
  "danger-hover": red[200],
  "on-danger": neutral[1000],
  "danger-bg": red[900],
  warning: amber[300],
  "warning-bg": amber[900],
  success: green[300],
  "success-bg": green[900],
  ring: blue[300],
  overlay: "rgba(0,0,0,0.55)",
};

export const themeNames = ["neutral", "grove"] as const;
export type ThemeName = (typeof themeNames)[number];

type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] };

function deepFreeze<T extends object>(value: T): DeepReadonly<T> {
  for (const child of Object.values(value)) {
    if (child !== null && typeof child === "object") deepFreeze(child);
  }
  return Object.freeze(value);
}

export const themes: DeepReadonly<Record<ThemeName, Brand>> = deepFreeze({
  neutral: brandSchema.parse({
    id: "neutral",
    name: "Neutral",
    description: "Neutral surfaces with blue actions.",
    modes: { light, dark },
  }),
  grove: brandSchema.parse({
    id: "grove",
    name: "Grove",
    description: "A fictional green theme using the same controls and spacing.",
    modes: {
      light: { ...light, bg: neutral[50], "bg-muted": green[50], accent: green[800], "accent-hover": green[900], "accent-soft": green[50], ring: green[800] },
      dark: { ...dark, accent: green[300], "accent-hover": green[200], "accent-soft": green[900], ring: green[300] },
    },
  }),
});
