import { useId, type CSSProperties } from "react";
import { themeNames, themes, type ColorMode, type ThemeName } from "@evenkit/tokens";
import { ArrowRightIcon, Button, ButtonLink, CheckIcon } from "@evenkit/ui";
import "./theme-preview.css";

const swatches = [
  { role: "bg", label: "Canvas" },
  { role: "accent", label: "Accent" },
  { role: "accent-hover", label: "Hover" },
  { role: "accent-soft", label: "Highlight" },
  { role: "ring", label: "Focus" },
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
        <div className="theme-gallery-description">
          <h3>Choose a palette</h3>
          <p>Compare accent colours on neutral surfaces. Use the sun or moon button above to switch between light and dark appearance.</p>
        </div>
        <div className="theme-gallery-actions">
          <p className="theme-gallery-current" role="status">Using <strong>{themes[theme].name}</strong><span>{mode}</span></p>
          <ButtonLink href="#tokens" variant="link" size="sm" endIcon={<ArrowRightIcon size="sm" />}>Inspect tokens</ButtonLink>
        </div>
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
                  <p className="theme-specimen-heading">The autumn project</p>
                  <p className="theme-specimen-body">Review the brief and share the next steps with your team.</p>
                  <p className="theme-specimen-meta"><span>Updated today</span><span>4 contributors</span></p>
                  <div className="theme-specimen-footer"><span>Project notes</span><span className="theme-specimen-status"><CheckIcon size="sm" /> Ready</span></div>
                </div>
                <div className="theme-specimen-raised"><CheckIcon size="sm" /><span>All changes saved</span></div>
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
                <Button fullWidth variant={selected ? "primary" : "outline"} aria-pressed={selected} onClick={() => onThemeChange(name)}>Apply {brand.name}</Button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="theme-gallery-guidance">Themes colour actions, focus rings and subtle highlights. Page backgrounds, text and borders stay neutral. Your choice is saved in this browser. Open Design tokens to inspect colour values and contrast checks.</p>
    </div>
  );
}
