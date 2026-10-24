import type { CSSProperties } from "react";
import { foundation, themes, type ColorMode, type ThemeName } from "@project-kit/tokens";
import { Badge, Button, TextField } from "@project-kit/ui";

const colorSamples = [
  ["bg", "Background"], ["surface", "Surface"], ["fg", "Foreground"],
  ["fg-muted", "Muted text"], ["accent", "Accent"], ["danger", "Danger"],
  ["success", "Success"], ["warning", "Warning"]
] as const;

const spacingSamples = ["1", "2", "3", "4", "6", "8"] as const;

export function TokenPreview({ theme, mode }: { theme: ThemeName; mode: ColorMode }) {
  const colors = themes[theme].modes[mode];
  return (
    <div className="catalog-demo-stack">
      <div>
        <div className="catalog-section-caption"><p className="catalog-state-label">Semantic colors</p><span>{themes[theme].name} / {mode}</span></div>
        <div className="catalog-swatches">
          {colorSamples.map(([key, label]) => (
            <div className="catalog-swatch" key={key}>
              <span className="catalog-swatch-color" style={{ backgroundColor: colors[key] }} aria-hidden="true" />
              <strong>{label}</strong><code>{colors[key]}</code>
            </div>
          ))}
        </div>
      </div>
      <div className="catalog-demo-divider">
        <p className="catalog-state-label">Spacing scale</p>
        <div className="catalog-spacing-scale">
          {spacingSamples.map((step) => (
            <div className="catalog-spacing-sample" key={step}>
              <span style={{ "--catalog-sample-size": `var(--pk-space-${step})` } as CSSProperties} aria-hidden="true" />
              <code>{step}</code><span>{foundation.space[step]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="catalog-demo-divider">
        <p className="catalog-state-label">Type scale</p>
        <div className="catalog-type-samples">
          <p className="catalog-type-heading">Project overview</p>
          <p className="catalog-type-body">Readable text, clear labels, and a shared scale.</p>
          <p className="catalog-type-caption">Metadata and supporting details</p>
          <code>font.family.mono</code>
        </div>
      </div>
      <div className="catalog-demo-divider">
        <p className="catalog-state-label">The same controls, a different theme</p>
        <div className="catalog-token-demo">
          <TextField label="Workspace name" defaultValue="Demo workspace" />
          <div className="catalog-demo-actions"><Button>Create workspace</Button><Badge tone="success">Ready</Badge></div>
        </div>
      </div>
    </div>
  );
}
