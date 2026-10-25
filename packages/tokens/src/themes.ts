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
  "accent-soft": blue[100],
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
  "accent-soft": "#00316F",
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

export const themeNames = ["neutral", "grove", "graphite", "linen", "ocean", "dusk", "clay", "rose"] as const;
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
    description: "Green accents and soft highlights on neutral surfaces.",
    modes: {
      light: { ...light, accent: green[800], "accent-hover": green[900], "accent-soft": "#E0F2E6", ring: green[800] },
      dark: { ...dark, accent: green[300], "accent-hover": green[200], "accent-soft": "#123A24", ring: green[300] },
    },
  }),
  graphite: brandSchema.parse({
    id: "graphite",
    name: "Graphite",
    description: "Monochrome accents and soft grey highlights.",
    modes: {
      light: {
        ...light,
        accent: "#3D3D3D",
        "accent-hover": "#242424",
        "on-accent": "#FFFFFF",
        "accent-soft": "#E5E5E5",
        ring: "#3D3D3D",
      },
      dark: {
        ...dark,
        accent: "#DEDEDE",
        "accent-hover": "#F2F2F2",
        "on-accent": "#191919",
        "accent-soft": "#333333",
        ring: "#DEDEDE",
      },
    },
  }),
  linen: brandSchema.parse({
    id: "linen",
    name: "Linen",
    description: "Olive-brown accents on neutral surfaces, with serif headings.",
    headingFamily: "Georgia, 'Times New Roman', serif",
    modes: {
      light: {
        ...light,
        accent: "#665934",
        "accent-hover": "#514527",
        "on-accent": "#FFFFFF",
        "accent-soft": "#E9E1CD",
        ring: "#665934",
      },
      dark: {
        ...dark,
        accent: "#D5C18D",
        "accent-hover": "#E5D3A8",
        "on-accent": "#282217",
        "accent-soft": "#393222",
        ring: "#D5C18D",
      },
    },
  }),
  ocean: brandSchema.parse({
    id: "ocean",
    name: "Ocean",
    description: "Teal accents and soft highlights on neutral surfaces.",
    modes: {
      light: {
        ...light,
        accent: "#0C626F",
        "accent-hover": "#084D59",
        "on-accent": "#FFFFFF",
        "accent-soft": "#DCEDEF",
        ring: "#0C626F",
      },
      dark: {
        ...dark,
        accent: "#80CBD1",
        "accent-hover": "#A4E0E4",
        "on-accent": "#102C34",
        "accent-soft": "#193740",
        ring: "#80CBD1",
      },
    },
  }),
  dusk: brandSchema.parse({
    id: "dusk",
    name: "Dusk",
    description: "Violet accents and soft highlights on neutral surfaces.",
    modes: {
      light: {
        ...light,
        accent: "#6C478B",
        "accent-hover": "#55346F",
        "on-accent": "#FFFFFF",
        "accent-soft": "#E9DFF2",
        ring: "#6C478B",
      },
      dark: {
        ...dark,
        accent: "#CFACF0",
        "accent-hover": "#DFC7F5",
        "on-accent": "#2B163C",
        "accent-soft": "#3F2A4D",
        ring: "#CFACF0",
      },
    },
  }),
  clay: brandSchema.parse({
    id: "clay",
    name: "Clay",
    description: "Terracotta accents and soft highlights on neutral surfaces.",
    modes: {
      light: {
        ...light,
        accent: "#914525",
        "accent-hover": "#79391F",
        "on-accent": "#FFFFFF",
        "accent-soft": "#F0DFD3",
        ring: "#914525",
      },
      dark: {
        ...dark,
        accent: "#E7B18C",
        "accent-hover": "#F3C7A7",
        "on-accent": "#3A2113",
        "accent-soft": "#452D1D",
        ring: "#E7B18C",
      },
    },
  }),
  rose: brandSchema.parse({
    id: "rose",
    name: "Rose",
    description: "Berry accents and soft highlights on neutral surfaces.",
    modes: {
      light: {
        ...light,
        accent: "#934362",
        "accent-hover": "#76324E",
        "on-accent": "#FFFFFF",
        "accent-soft": "#F1DFE7",
        ring: "#934362",
      },
      dark: {
        ...dark,
        accent: "#E8A4C1",
        "accent-hover": "#F4BFD6",
        "on-accent": "#381C29",
        "accent-soft": "#492A3A",
        ring: "#E8A4C1",
      },
    },
  }),
});
