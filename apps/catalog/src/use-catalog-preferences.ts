import { useEffect, useState } from "react";
import { themeNames, type ColorMode, type ThemeName } from "@evenkit/tokens";

const appearances = ["system", "light", "dark"] as const;
type Appearance = (typeof appearances)[number];

export function readPreference<T extends string>(key: string, options: readonly T[], fallback: T): T {
  try {
    // Preserve preferences saved before the Evenkit rename on this origin.
    const stored = localStorage.getItem(`evenkit.catalog.${key}`) ?? localStorage.getItem(`project-kit.catalog.${key}`);
    return options.find((option) => option === stored) ?? fallback;
  } catch {
    return fallback;
  }
}

export interface CatalogPreferences {
  theme: ThemeName;
  mode: ColorMode;
  onThemeChange: (theme: ThemeName) => void;
  onToggleAppearance: () => void;
}

export function useCatalogPreferences(): CatalogPreferences {
  const [theme, setTheme] = useState<ThemeName>(() => readPreference("theme", themeNames, "neutral"));
  const [appearance, setAppearance] = useState<Appearance>(() => readPreference("appearance", appearances, "system"));
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const mode: ColorMode = appearance === "system" ? (systemDark ? "dark" : "light") : appearance;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const change = () => setSystemDark(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.kitTheme = theme;
    if (appearance === "system") delete document.documentElement.dataset.kitMode;
    else document.documentElement.dataset.kitMode = appearance;
    try {
      localStorage.setItem("evenkit.catalog.theme", theme);
      localStorage.setItem("evenkit.catalog.appearance", appearance);
    } catch {
      // Preferences still apply when browser storage is unavailable.
    }
  }, [theme, appearance]);

  return { theme, mode, onThemeChange: setTheme, onToggleAppearance: () => setAppearance(mode === "light" ? "dark" : "light") };
}
