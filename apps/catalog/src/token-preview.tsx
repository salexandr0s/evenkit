import { useId, useRef, useState, type CSSProperties } from "react";
import { contrastChecks, contrastRatio, cssVariables, themes, type ColorMode, type ThemeName } from "@project-kit/tokens";
import { Badge, Button, CheckIcon, EmptyState, Input, Label, SearchIcon, Select, TextField } from "@project-kit/ui";
import "./token-preview.css";

const categories = [
  { value: "all", label: "All tokens", description: "Every resolved CSS variable in the selected theme." },
  { value: "color", label: "Semantic colors", description: "Use these roles in components. Their values follow the selected theme and appearance." },
  { value: "palette", label: "Palette", description: "Raw color scales stay the same across themes. Use semantic colors for component states and content." },
  { value: "space", label: "Spacing", description: "A shared scale for padding, gaps, and margins. Samples show each spacing value at its actual size." },
  { value: "font", label: "Typography", description: "Font families, sizes, weights, and presets for readable text and consistent hierarchy." },
  { value: "shape", label: "Shape & elevation", description: "Corner radii, border widths, and shadows for surfaces and controls." },
  { value: "layout", label: "Layout & sizing", description: "Shared dimensions for controls, icons, tables, and page layouts." },
  { value: "motion", label: "Motion", description: "Durations and easing curves. Components respect the device's reduced-motion preference." },
  { value: "other", label: "Other", description: "Stacking layers and opacity values used across the kit." },
] as const;
type Category = (typeof categories)[number]["value"];

function categoryFor(name: string): Category {
  const token = name.slice("--pk-".length);
  for (const prefix of ["color", "palette", "space", "font", "motion"] as const) {
    if (token.startsWith(`${prefix}-`)) return prefix;
  }
  if (/^(radius|shadow|border-width)-/.test(token)) return "shape";
  if (/^(breakpoint|control|layout|icon|table|spinner)-/.test(token)) return "layout";
  return "other";
}

function TokenSample({ name, value }: { name: string; value: string }) {
  const variable = `var(${name})`;
  let kind = "value";
  let style: CSSProperties = {};
  let content = "·";

  if (name.startsWith("--pk-color-") || name.startsWith("--pk-palette-")) {
    kind = "color";
    style = { backgroundColor: variable };
    content = "";
  } else if (name.startsWith("--pk-space-")) {
    kind = "spacing";
    style = { width: variable };
    content = "";
  } else if (name.startsWith("--pk-radius-")) {
    kind = "shape";
    style = { borderRadius: variable };
    content = "";
  } else if (name.startsWith("--pk-shadow-")) {
    kind = "shadow";
    style = { boxShadow: variable };
    content = "";
  } else if (name.startsWith("--pk-border-width-")) {
    kind = "shape";
    style = { borderWidth: variable, background: "var(--pk-color-surface)" };
    content = "";
  } else if (name.startsWith("--pk-font-")) {
    kind = "type";
    content = "Aa";
    if (name.includes("-family-")) style = { fontFamily: variable };
    else if (name.includes("-weight-") || name.endsWith("-font-weight")) style = { fontWeight: value };
    else if (name.includes("-size-") || name.endsWith("-font-size")) style = { fontSize: variable };
    else if (name.includes("-letter-spacing-") || name.endsWith("-letter-spacing")) style = { letterSpacing: variable };
    else if (name.includes("-line-height-") || name.endsWith("-line-height")) style = { lineHeight: variable };
  }

  return <span className="token-sample" data-kind={kind} aria-hidden="true"><span style={style}>{content}</span></span>;
}

export function TokenPreview({ theme, mode }: { theme: ThemeName; mode: ColorMode }) {
  const id = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const copyRequest = useRef(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("color");
  const [copyNotice, setCopyNotice] = useState("");
  const [created, setCreated] = useState(false);
  const variables = Object.entries(cssVariables(theme, mode));
  const search = query.trim().toLowerCase();
  const visible = variables.filter(([name, value]) => (
    (category === "all" || categoryFor(name) === category)
    && `${name} ${value}`.toLowerCase().includes(search)
  ));
  const colors = themes[theme].modes[mode];
  const checks = contrastChecks.map((check) => ({
    ...check,
    ratio: contrastRatio(colors[check.foreground], colors[check.background]),
  }));
  const passed = checks.filter((check) => check.ratio >= check.minimum).length;
  const categoryInfo = categories.find((item) => item.value === category) ?? categories[0];

  function resetFilters() {
    setQuery("");
    setCategory("all");
    searchRef.current?.focus();
  }

  async function copy(name: string) {
    const request = ++copyRequest.current;
    const usage = `var(${name})`;
    setCopyNotice("");
    try {
      await navigator.clipboard.writeText(usage);
      if (request === copyRequest.current) setCopyNotice(`Copied ${usage}.`);
    } catch {
      if (request === copyRequest.current) setCopyNotice(`Copy is unavailable. Select ${usage} in the token list to copy it.`);
    }
  }

  return (
    <div className="token-workbench">
      <section className="token-reference" aria-label="Token reference">
        <div className="token-intro">
          <div><h3>Find a token</h3><p>Inspect the current value, then copy its CSS variable into your styles.</p></div>
          <Badge tone="accent">{variables.length} tokens</Badge>
        </div>
        <div className="token-filters">
          <div className="token-search">
            <Label htmlFor={`${id}-search`}>Search tokens</Label>
            <div className="token-search-control">
              <SearchIcon size="sm" />
              <Input ref={searchRef} id={`${id}-search`} type="search" placeholder="Name or value, e.g. accent or 16px" value={query} onChange={(event) => setQuery(event.target.value)} aria-describedby={`${id}-results`} />
            </div>
          </div>
          <div className="token-category">
            <Label htmlFor={`${id}-category`}>Token category</Label>
            <Select id={`${id}-category`} options={categories} value={category} onValueChange={(value) => {
              const selected = categories.find((item) => item.value === value);
              if (selected) setCategory(selected.value);
            }} />
          </div>
        </div>
        <p className="token-guidance">{categoryInfo.description}</p>
        <div className="token-results-header">
          <p id={`${id}-results`} role="status">{visible.length} of {variables.length} tokens · {themes[theme].name} / {mode}</p>
          {visible.length > 0 && (query || category !== "all") && <Button size="sm" variant="ghost" onClick={resetFilters}>Reset filters</Button>}
        </div>
        <p className="token-copy-notice" role="status" aria-live="polite">{copyNotice}</p>
        {visible.length > 0 ? (
          <ul className="token-grid" role="list" aria-label="Resolved tokens">
            {visible.map(([name, value]) => (
              <li className="token-card" key={name} data-token={name}>
                <div className="token-card-heading">
                  <TokenSample name={name} value={value} />
                  <div><span className="token-kind">{categories.find((item) => item.value === categoryFor(name))?.label}</span><code className="token-name">{name}</code></div>
                </div>
                <code className="token-value">{value}</code>
                <div className="token-card-footer">
                  <code className="token-usage">var({name})</code>
                  <Button size="sm" variant="ghost" aria-label={`Copy ${name}`} onClick={() => void copy(name)}>Copy</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No tokens match" description="Try a different name or value, or reset the filters to search every category." action={<Button variant="outline" onClick={resetFilters}>Reset filters</Button>} />
        )}
      </section>

      <details className="token-contrast">
        <summary><span>Contrast checks</span><Badge tone={passed === checks.length ? "success" : "danger"}>{passed} / {checks.length} pass</Badge></summary>
        <div className="token-contrast-content">
          <p className="token-guidance">The kit checks these foreground and background pairs in {themes[theme].name} / {mode}. Text requires 4.5:1; control boundaries and focus rings require 3:1. This checks the defined pairs, not a whole page.</p>
          <ul className="token-contrast-list" role="list" aria-label="Defined contrast pairs">
            {checks.map((check) => (
              <li key={`${check.foreground}/${check.background}`} data-contrast={`${check.foreground}/${check.background}`}>
                <span className="token-contrast-sample" style={{ color: colors[check.foreground], backgroundColor: colors[check.background] }} aria-hidden="true">
                  {check.minimum === 3 ? <span className="token-contrast-boundary" /> : "Aa"}
                </span>
                <span className="token-contrast-pair"><code>{check.foreground}</code><span>on <code>{check.background}</code></span></span>
                <span className="token-contrast-ratio"><strong>{check.ratio.toFixed(2)}:1</strong><span>Required {check.minimum}:1</span></span>
                <Badge tone={check.ratio >= check.minimum ? "success" : "danger"}>{check.ratio >= check.minimum ? "Pass" : "Fail"}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </details>

      <section className="token-theme-sample" aria-label="Theme sample">
        <div className="token-type-example">
          <span className="token-eyebrow">{themes[theme].name} / {mode}</span>
          <h3>Project overview</h3>
          <p>Readable text, clear labels, and a shared scale.</p>
          <small>Metadata and supporting details</small>
          <code>font.family.mono</code>
        </div>
        <form className="token-controls-example" onSubmit={(event) => { event.preventDefault(); setCreated(true); }}>
          <TextField label="Workspace name" name="workspace" defaultValue="Demo workspace" required onChange={() => setCreated(false)} />
          <div className="catalog-demo-actions"><Button type="submit">Create workspace</Button><Badge tone="success">{created ? <><CheckIcon size="sm" /> Created</> : "Ready"}</Badge></div>
          <p className="token-guidance" role="status">{created ? "Workspace created in this preview." : "Try the controls, then switch theme or appearance."}</p>
        </form>
      </section>
    </div>
  );
}
