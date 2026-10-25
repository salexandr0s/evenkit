import { useId, type CSSProperties } from "react";
import { themeNames, themes, type ColorMode, type ThemeName } from "@project-kit/tokens";
import { Button, CheckIcon } from "@project-kit/ui";
import "./theme-preview.css";

const swatches = [
  { role: "bg", label: "Canvas" },
  { role: "surface", label: "Surface" },
  { role: "fg", label: "Text" },
  { role: "fg-muted", label: "Muted" },
  { role: "accent", label: "Accent" },
] as const;

interface ThemePreviewProps {
  theme: ThemeName;
  mode: ColorMode;
  onThemeChange: (theme: ThemeName) => void;
}

export function ThemePreview({ theme, mode, onThemeChange }: ThemePreviewProps) {
  const id = useId();

  return (
    <div className="theme-gallery">
      <div className="theme-gallery-intro">
        <div>
          <h3>Choose a palette</h3>
          <p>Compare the same workspace in every theme. Use the sun or moon button above to switch between light and dark colours.</p>
        </div>
        <p className="theme-gallery-current" role="status">Using <strong>{themes[theme].name}</strong> · {mode}</p>
      </div>
      <div className="theme-gallery-grid">
        {themeNames.map((name) => {
          const brand = themes[name];
          const colors = brand.modes[mode];
          const selected = theme === name;
          // These specimens have no portals. The catalog itself uses document-level themes.
          const style: CSSProperties = {
            ...Object.fromEntries(Object.entries(colors).map(([role, value]) => [`--pk-color-${role}`, value])),
            "--pk-font-family-sans": brand.fontFamily,
            "--pk-font-family-heading": brand.headingFamily,
            "--pk-radius-sm": brand.radius.sm,
            "--pk-radius-md": brand.radius.md,
            "--pk-radius-lg": brand.radius.lg,
          } as CSSProperties;

          return (
            <article className="theme-card" key={name} data-theme={name} data-mode={mode} data-selected={selected} style={style} aria-labelledby={`${id}-${name}`}>
              <div className="theme-card-specimen">
                <div className="theme-specimen-topline"><span className="theme-specimen-mark" aria-hidden="true" /><span>Workspace</span><span>Overview</span></div>
                <div className="theme-specimen-document">
                  <span className="theme-specimen-eyebrow">Project notes</span>
                  <p className="theme-specimen-heading">The autumn project</p>
                  <p className="theme-specimen-body">Review the brief and share the next steps with your team.</p>
                  <p className="theme-specimen-meta">Updated today · 4 contributors</p>
                  <div className="theme-specimen-footer"><span className="theme-specimen-link">View project <span aria-hidden="true">↗</span></span><span className="theme-specimen-status"><CheckIcon size="sm" /> Ready</span></div>
                </div>
                <div className="theme-specimen-raised"><span className="theme-specimen-dot" aria-hidden="true" /><span>All changes saved</span></div>
              </div>
              <div className="theme-card-details">
                <div className="theme-card-heading"><h4 id={`${id}-${name}`}>{brand.name}</h4>{selected && <span className="theme-card-selected"><CheckIcon size="sm" /> Selected</span>}</div>
                <p className="theme-card-description">{brand.description}</p>
                <dl className="theme-card-swatches">
                  {swatches.map(({ role, label }) => (
                    <div key={role}>
                      <dt><span style={{ backgroundColor: colors[role] }} aria-hidden="true" />{label}</dt>
                      <dd>{colors[role]}</dd>
                    </div>
                  ))}
                </dl>
                <Button fullWidth aria-pressed={selected} onClick={() => onThemeChange(name)}>Apply {brand.name}</Button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="theme-gallery-guidance">Applying a theme updates every component in the catalog and saves your choice in this browser. Open Design tokens to inspect its colour values and contrast checks.</p>
    </div>
  );
}
