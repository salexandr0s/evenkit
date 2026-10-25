import { lazy, Suspense, useEffect, useState } from "react";
import { themes, themeNames, type ColorMode, type ThemeName } from "@project-kit/tokens";
import { Badge, Button, ChevronRightIcon, EmptyState, ExternalLinkIcon, Input, Label, MenuIcon, SearchIcon, Select, Spinner } from "@project-kit/ui";
import { entries, groups } from "./catalog-data";
import { CodeExample } from "./code-example";
import { FieldPreview } from "./field-preview";
import { ButtonPreview, DialogPreview, EmptyPreview, LoadingPreview, SelectPreview, StatusPreview } from "./control-previews";
import { TokenPreview } from "./token-preview";
import { IconPreview } from "./icon-preview";

const ShellPreview = lazy(() => import("./shell-preview").then((module) => ({ default: module.ShellPreview })));
const TablePreview = lazy(() => import("./table-preview").then((module) => ({ default: module.TablePreview })));

const appearances = ["system", "light", "dark"] as const;
type Appearance = (typeof appearances)[number];
const themeOptions = themeNames.map((name) => ({ value: name, label: themes[name].name }));
const appearanceOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
] as const;

function readPreference<T extends string>(key: string, options: readonly T[], fallback: T): T {
  try {
    const stored = localStorage.getItem(`project-kit.catalog.${key}`);
    return options.find((option) => option === stored) ?? fallback;
  } catch {
    return fallback;
  }
}

function selectedFromHash() {
  const id = window.location.hash.slice(1);
  return entries.some((entry) => entry.id === id) ? id : "buttons";
}

function Preview({ id, theme, mode }: { id: string; theme: ThemeName; mode: ColorMode }) {
  switch (id) {
    case "tokens": return <TokenPreview theme={theme} mode={mode} />;
    case "icons": return <IconPreview />;
    case "admin-shell": return <ShellPreview />;
    case "data-table": return <TablePreview />;
    case "fields": return <FieldPreview />;
    case "select": return <SelectPreview />;
    case "dialog": return <DialogPreview />;
    case "status": return <StatusPreview />;
    case "loading": return <LoadingPreview />;
    case "empty": return <EmptyPreview />;
    default: return <ButtonPreview />;
  }
}

export function Catalog() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(selectedFromHash);
  const [navigationOpen, setNavigationOpen] = useState(false);
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
      localStorage.setItem("project-kit.catalog.theme", theme);
      localStorage.setItem("project-kit.catalog.appearance", appearance);
    } catch {
      // Blocked browser storage does not prevent changing the current preview.
    }
  }, [theme, appearance]);

  useEffect(() => {
    const change = () => {
      const id = window.location.hash.slice(1);
      if (!entries.some((entry) => entry.id === id)) return;
      setSelectedId(id);
      setQuery("");
      setNavigationOpen(false);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);

  const search = query.trim().toLowerCase();
  const visible = entries.filter((entry) => [entry.name, entry.group, entry.description, ...entry.tags].join(" ").toLowerCase().includes(search));
  const active = visible.find((entry) => entry.id === selectedId) ?? visible[0];

  return (
    <div className="catalog-app">
      <a className="catalog-skip" href="#catalog-main">Skip to component preview</a>
      <aside className="catalog-sidebar" aria-label="Component library">
        <div className="catalog-brand-row">
          <a className="catalog-brand" href="#buttons" aria-label="Project kit home">
            <span className="catalog-brand-mark" aria-hidden="true"><span /><span /><span /><span /></span>
            <span>Project kit<small>Shared foundations</small></span>
          </a>
          <Button className="catalog-menu-toggle" size="sm" variant="outline" aria-expanded={navigationOpen} aria-controls="catalog-navigation" onClick={() => setNavigationOpen((value) => !value)}>
            <MenuIcon size="sm" />{navigationOpen ? "Close components" : "Browse components"}
          </Button>
        </div>
        <div className="catalog-sidebar-body" id="catalog-navigation" data-open={navigationOpen}>
          <div className="catalog-search">
            <Label htmlFor="component-search">Search components</Label>
            <div className="catalog-search-control"><SearchIcon size="sm" /><Input id="component-search" type="search" placeholder="Search the library…" value={query} onChange={(event) => setQuery(event.target.value)} aria-describedby="search-results" /></div>
            <p id="search-results" className="catalog-search-count" role="status">{visible.length} {visible.length === 1 ? "entry" : "entries"}</p>
          </div>
          <nav aria-label="Components" className="catalog-navigation">
            {groups.map((group) => {
              const groupEntries = visible.filter((entry) => entry.group === group);
              return groupEntries.length > 0 ? (
                <div className="catalog-navigation-group" key={group}>
                  <p>{group}</p>
                  {groupEntries.map((entry) => (
                    <a href={`#${entry.id}`} key={entry.id} aria-current={entry.id === active?.id ? "page" : undefined} onClick={() => { setSelectedId(entry.id); setQuery(""); setNavigationOpen(false); }}>
                      <span>{entry.name}</span><span aria-hidden="true"><ChevronRightIcon size="sm" /></span>
                    </a>
                  ))}
                </div>
              ) : null;
            })}
          </nav>
          <div className="catalog-sidebar-footer"><Badge tone="accent">Pilot</Badge><span>Version 0.1.0</span><p>Internal component library</p></div>
        </div>
      </aside>
      <div className="catalog-workspace">
        <header className="catalog-toolbar">
          <p className="catalog-breadcrumb">Library <span aria-hidden="true">/</span> <strong>Component reference</strong></p>
          <div className="catalog-preferences">
            <div><Label htmlFor="theme-select">Theme</Label><Select id="theme-select" value={theme} options={themeOptions} onValueChange={(selected) => { const value = themeNames.find((name) => name === selected); if (value) setTheme(value); }} /></div>
            <div><Label htmlFor="appearance-select">Appearance</Label><Select id="appearance-select" value={appearance} options={appearanceOptions} onValueChange={(selected) => { const value = appearances.find((name) => name === selected); if (value) setAppearance(value); }} /></div>
          </div>
        </header>
        <main className="catalog-main" id="catalog-main" tabIndex={-1}>
          {active ? (
            <article className="catalog-detail" data-composition={active.group === "Compositions" ? active.id : undefined} key={active.id}>
              <div className="catalog-detail-heading">
                <div className="catalog-eyebrow">{active.group} <span aria-hidden="true">/</span> 0.1.0</div>
                <div className="catalog-title-row"><h1>{active.name}</h1><Badge tone="accent">Pilot</Badge></div>
                <p className="catalog-description">{active.description}</p>
              </div>
              <section className="catalog-preview" aria-label={`${active.name} live preview`}>
                <div className="catalog-preview-header"><h2>Live preview</h2><span><span className="catalog-live-dot" aria-hidden="true" />{themes[theme].name} · {mode}</span></div>
                <div className="catalog-preview-content"><Suspense fallback={<Spinner label="Loading component preview" />}><Preview id={active.id} theme={theme} mode={mode} /></Suspense></div>
              </section>
              <CodeExample code={active.usage} />
              <div className="catalog-information-grid">
                <section className="catalog-info-panel"><h2>Component details</h2><dl><div><dt>Owner</dt><dd>Project kit</dd></div><div><dt>Maturity</dt><dd>Pilot · ready for evaluation</dd></div><div><dt>Source</dt><dd>{active.source}</dd></div></dl><a href={active.sourceUrl} target="_blank" rel="noreferrer">Reference documentation <ExternalLinkIcon size="sm" /></a></section>
                <section className="catalog-info-panel"><h2>Use in a project</h2><p>Import the token stylesheet before the control stylesheet. Components ship ordinary CSS and do not require Tailwind.</p><pre tabIndex={0}><code>{'import "@project-kit/tokens/css";\nimport "@project-kit/ui/css";'}</code></pre><p>These local pilot packages have not been published. Build and pack them from this repository; installation steps are in the repository README.</p></section>
              </div>
              <footer className="catalog-detail-footer"><span>React controls · document-level themes</span><span>Application state and callbacks stay in your project.</span></footer>
            </article>
          ) : (
            <div className="catalog-no-results"><EmptyState title="No components match your search" description={`No results for “${query.trim()}”. Try a component name or a state such as loading.`} action={<Button onClick={() => setQuery("")}>Clear search</Button>} /></div>
          )}
        </main>
      </div>
    </div>
  );
}
