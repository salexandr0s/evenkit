import { themeNames } from "@evenkit/tokens";
import type { AppearanceValue } from "@evenkit/ui";
import type { WorkspaceId } from "./demo-data";

export function appearanceStorageKey(workspace: WorkspaceId) { return `evenkit.admin.${workspace}.appearance`; }

/** Browser preferences are untrusted; reject unsupported themes and modes. */
export function readAppearance(raw: string | null): AppearanceValue | undefined {
  if (!raw) return undefined;
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return undefined; }
  if (!value || typeof value !== "object" || !("theme" in value) || !("mode" in value)) return undefined;
  const theme = themeNames.find(name => name === value.theme);
  if (!theme || (value.mode !== "light" && value.mode !== "dark" && value.mode !== "system")) return undefined;
  return { theme, mode: value.mode, density: "density" in value && value.density === "compact" ? "compact" : "default", locale: "locale" in value && value.locale === "de" ? "de" : "en" };
}
