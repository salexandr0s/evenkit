import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { themes, themeNames, type ColorMode, type ThemeName } from "@evenkit/tokens";
import {
  AdminShell, Badge, Button, ChevronDownIcon, CircleCheckIcon, CircleHelpIcon,
  EmptyState, ExternalLinkIcon, FileTextIcon, InboxIcon, Input, Label, LayoutDashboardIcon,
  MaximizeIcon, MessageSquareIcon, MoonIcon, PanelLeftIcon, PencilIcon, RotateCcwIcon,
  SearchIcon, Select, Spinner, SquareIcon, SunIcon, Tooltip, TooltipContent, TooltipProvider,
  TooltipTrigger, type AdminLinkProps, type AdminNavGroup, type AdminSidebarState,
  AccessibilityIcon, ArrowLeftRightIcon, BellIcon, BoldIcon, ChevronRightIcon,
  ChevronsUpDownIcon, CircleAlertIcon, CircleDotIcon, CloudCheckIcon, Columns3Icon,
  ContactRoundIcon, CopyIcon, FilePenLineIcon, FilterIcon, FilterXIcon, GaugeIcon,
  GroupIcon, HeadingIcon, KeyboardIcon, KeyRoundIcon, LayoutGridIcon, ListChecksIcon,
  ListCollapseIcon, ListFilterIcon, ListIcon, ListTreeIcon, ListXIcon, MenuIcon,
  MessageSquareTextIcon, PanelRightIcon, PanelsTopLeftIcon, PanelTopDashedIcon,
  PanelTopIcon, RectangleHorizontalIcon, SaveIcon, SeparatorHorizontalIcon,
  ShapesIcon, SlidersHorizontalIcon, SquareCheckIcon, Table2Icon, TagsIcon,
  ToggleRightIcon, TriangleAlertIcon, TypeIcon, UploadIcon, UserIcon,
  CalendarDaysIcon, ClockIcon, Building2Icon, ActivityIcon, CameraIcon, CalculatorIcon,
} from "@evenkit/ui";
import { entries, groups } from "./catalog-data";
import { foundationsEntries } from "./foundations-entries";
import { selectionEntries } from "./selection-entries";
import { formsEntries } from "./forms-entries";
import { navigationEntries } from "./navigation-entries";
import { overlaysEntries } from "./overlays-entries";
import { workflowsEntries } from "./workflows-entries";
import { roadmapEntries } from "./roadmap-entries";
import { authEntries } from "./auth-data";
import { websiteEntries } from "./website-entries";
import { CodeExample } from "./code-example";
import { FieldPreview } from "./field-preview";
import { EmptyPreview } from "./empty-preview";
import { LoadingPreview } from "./loading-preview";
import { StatusPreview } from "./status-preview";
import { DialogPreview } from "./dialog-preview";
import { SelectPreview } from "./select-preview";
import { ButtonPreview } from "./button-preview";
import { TokenPreview } from "./token-preview";
import { ThemePreview } from "./theme-preview";
import { readPreference, type CatalogPreferences } from "./use-catalog-preferences";

const IconPreview = lazy(() => import("./icon-preview").then((module) => ({ default: module.IconPreview })));
const ShellPreview = lazy(() => import("./shell-preview").then((module) => ({ default: module.ShellPreview })));
const TablePreview = lazy(() => import("./table-preview").then((module) => ({ default: module.TablePreview })));
const ChatPreview = lazy(() => import("./chat-preview").then((module) => ({ default: module.ChatPreview })));
const RichChatPreview = lazy(() => import("./rich-chat-preview").then((module) => ({ default: module.RichChatPreview })));
const TooltipPreview = lazy(() => import("./tooltip-preview").then((module) => ({ default: module.TooltipPreview })));
const FoundationsPreview = lazy(() => import("./foundations-preview").then((module) => ({ default: module.FoundationsPreview })));
const SelectionPreview = lazy(() => import("./selection-preview").then((module) => ({ default: module.SelectionPreview })));
const FormsPreview = lazy(() => import("./forms-preview").then((module) => ({ default: module.FormsPreview })));
const NavigationPreview = lazy(() => import("./navigation-preview").then((module) => ({ default: module.NavigationPreview })));
const OverlaysPreview = lazy(() => import("./overlays-preview").then((module) => ({ default: module.OverlaysPreview })));
const WorkflowsPreview = lazy(() => import("./workflows-preview").then((module) => ({ default: module.WorkflowsPreview })));
const RoadmapPreview = lazy(() => import("./roadmap-preview").then((module) => ({ default: module.RoadmapPreview })));
const WebsitePreview = lazy(() => import("./website-preview").then((module) => ({ default: module.WebsitePreview })));

const AuthPreview = lazy(() => import("./auth-preview").then(module => ({ default: module.AuthPreview })));

const sidebarStates = ["expanded", "collapsed", "hidden"] as const;
const themeOptions = themeNames.map((name) => ({ value: name, label: themes[name].name }));
const navigationIcons: Record<string, ReactNode> = {
  login: <KeyRoundIcon />, signup: <UserIcon />, "password-reset": <KeyRoundIcon />, "new-password": <KeyRoundIcon />,
  themes: <SunIcon />, tokens: <LayoutDashboardIcon />, icons: <ShapesIcon />,
  buttons: <SquareIcon />, fields: <PencilIcon />, select: <ChevronDownIcon />,
  dialog: <MaximizeIcon />, tooltips: <CircleHelpIcon />, "admin-shell": <PanelLeftIcon />,
  "data-table": <FileTextIcon />, chat: <MessageSquareIcon />, status: <CircleCheckIcon />,
  loading: <RotateCcwIcon />, empty: <InboxIcon />,
  typography: <TypeIcon />, "layout-widths": <RectangleHorizontalIcon />,
  "layout-groups": <LayoutGridIcon />, separator: <SeparatorHorizontalIcon />,
  card: <PanelTopIcon />, "page-header": <HeadingIcon />, toolbar: <SlidersHorizontalIcon />,
  accessibility: <AccessibilityIcon />, avatar: <UserIcon />, tags: <TagsIcon />,
  "data-list": <ListTreeIcon />, "list-item": <ListIcon />, kbd: <KeyboardIcon />,
  checkbox: <SquareCheckIcon />, "radio-group": <CircleDotIcon />, switch: <ToggleRightIcon />,
  "toggle-group": <BoldIcon />, "segmented-control": <Columns3Icon />, "button-group": <GroupIcon />,
  "copy-action": <CopyIcon />, progress: <GaugeIcon />, fieldset: <ListChecksIcon />,
  "form-summary": <ListXIcon />, "search-field": <SearchIcon />, "password-field": <KeyRoundIcon />,
  combobox: <ListFilterIcon />, "form-actions": <SaveIcon />, "save-status": <CloudCheckIcon />,
  tabs: <PanelsTopLeftIcon />, accordion: <ListCollapseIcon />, collapsible: <ChevronsUpDownIcon />,
  breadcrumbs: <ChevronRightIcon />, navbar: <PanelTopDashedIcon />, pagination: <ArrowLeftRightIcon />,
  "dropdown-menu": <MenuIcon />, popover: <MessageSquareTextIcon />, "alert-dialog": <TriangleAlertIcon />,
  sheet: <PanelRightIcon />, toast: <BellIcon />, "account-menu": <ContactRoundIcon />,
  "semantic-table": <Table2Icon />, filters: <FilterIcon />, "applied-filters": <FilterXIcon />,
  "file-input": <UploadIcon />, "file-row": <FileTextIcon />, "list-page": <ListIcon />,
  "edit-page": <FilePenLineIcon />, "error-pages": <CircleAlertIcon />,
  calendar: <CalendarDaysIcon />, "date-picker": <CalendarDaysIcon />, "date-range": <CalendarDaysIcon />,
  "time-field": <ClockIcon />, formatting: <TypeIcon />, "multi-select": <ListChecksIcon />,
  "token-input": <TagsIcon />, "number-field": <CalculatorIcon />, "number-recipes": <CalculatorIcon />,
  "remote-data-table": <Table2Icon />, "sort-control": <ListFilterIcon />, "bulk-actions": <ListChecksIcon />,
  "column-settings": <Columns3Icon />, "activity-timeline": <ActivityIcon />, "record-detail": <FileTextIcon />,
  "workspace-switcher": <Building2Icon />, "settings-layout": <SlidersHorizontalIcon />,
  "profile-settings": <UserIcon />, "appearance-preferences": <SunIcon />, "upload-queue": <UploadIcon />,
  image: <CameraIcon />, "command-palette": <SearchIcon />, "step-indicator": <ListChecksIcon />,
  "onboarding-wizard": <PanelsTopLeftIcon />,
  "avatar-upload": <UserIcon />, "file-preview": <CameraIcon />, "document-library": <FileTextIcon />,
  "website-shell": <PanelTopIcon />, "website-heroes": <HeadingIcon />,
  "website-features": <LayoutGridIcon />, "website-cta": <SquareIcon />,
  "website-faq": <CircleHelpIcon />, "website-forms": <ContactRoundIcon />,
  "website-article": <FileTextIcon />,
  "rich-chat": <MessageSquareTextIcon />,
  statistic: <GaugeIcon />, "chart-frame": <LayoutDashboardIcon />,
  "line-chart": <ActivityIcon />, "bar-chart": <Columns3Icon />,
  "reporting-controls": <SlidersHorizontalIcon />, dashboard: <LayoutDashboardIcon />,
};

function selectedFromHash() {
  const id = window.location.hash.slice(1);
  return entries.some((entry) => entry.id === id) ? id : "buttons";
}

function Preview({ id, theme, mode, onThemeChange }: { id: string; theme: ThemeName; mode: ColorMode; onThemeChange: (theme: ThemeName) => void }) {
  if (authEntries.some(entry => entry.id === id) && (id === "login" || id === "signup" || id === "password-reset" || id === "new-password")) return <AuthPreview kind={id} />;
  if (websiteEntries.some(entry => entry.id === id)) return <WebsitePreview key={id} id={id} />;
  if (roadmapEntries.some(entry => entry.id === id)) return <RoadmapPreview id={id} />;
  if (foundationsEntries.some(entry => entry.id === id)) return <FoundationsPreview id={id} />;
  if (selectionEntries.some(entry => entry.id === id)) return <SelectionPreview id={id} />;
  if (formsEntries.some(entry => entry.id === id)) return <FormsPreview id={id} />;
  if (navigationEntries.some(entry => entry.id === id)) return <NavigationPreview id={id} />;
  if (overlaysEntries.some(entry => entry.id === id)) return <OverlaysPreview id={id} />;
  if (workflowsEntries.some(entry => entry.id === id)) return <WorkflowsPreview id={id} />;
  switch (id) {
    case "themes": return <ThemePreview theme={theme} mode={mode} onThemeChange={onThemeChange} />;
    case "tokens": return <TokenPreview theme={theme} mode={mode} />;
    case "icons": return <IconPreview />;
    case "admin-shell": return <ShellPreview />;
    case "data-table": return <TablePreview />;
    case "chat": return <ChatPreview />;
    case "rich-chat": return <RichChatPreview />;
    case "fields": return <FieldPreview />;
    case "select": return <SelectPreview />;
    case "dialog": return <DialogPreview />;
    case "tooltips": return <TooltipPreview />;
    case "status": return <StatusPreview />;
    case "loading": return <LoadingPreview />;
    case "empty": return <EmptyPreview />;
    default: return <ButtonPreview />;
  }
}

export function Catalog({ theme, mode, onThemeChange: setTheme, onToggleAppearance }: CatalogPreferences) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(selectedFromHash);
  const [sidebarState, setSidebarState] = useState<AdminSidebarState>(() => readPreference("sidebar", sidebarStates, "expanded"));
  const searchRef = useRef<HTMLInputElement>(null);
  const appearanceAction = mode === "light" ? "Switch to dark mode" : "Switch to light mode";

  function clearCatalogSearch() {
    searchRef.current?.focus();
    setQuery("");
  }

  useEffect(() => {
    try {
      localStorage.setItem("evenkit.catalog.sidebar", sidebarState);
    } catch {
      // Sidebar controls still work when browser storage is unavailable.
    }
  }, [sidebarState]);

  useEffect(() => {
    const change = () => {
      const id = window.location.hash.slice(1);
      if (!entries.some((entry) => entry.id === id)) return;
      setSelectedId(id);
      setQuery("");
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);

  const search = query.trim().toLowerCase();
  const visible = entries.filter((entry) => [entry.name, entry.group, entry.description, ...entry.tags, ...(entry.inventoryIds ?? [])].join(" ").toLowerCase().includes(search));
  const active = visible.find((entry) => entry.id === selectedId) ?? visible[0];
  const navigation: readonly AdminNavGroup[] = groups.flatMap((group) => {
    const items = visible.filter((entry) => entry.group === group).map((entry) => ({
      id: entry.id, label: entry.name, href: `#${entry.id}`, icon: navigationIcons[entry.id],
    }));
    return items.length > 0 ? [{ label: group, items }] : [];
  });

  function selectEntry(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.currentTarget.hasAttribute("download") || (event.currentTarget.target && event.currentTarget.target !== "_self")) return;
    setSelectedId(id);
    setQuery("");
  }

  function renderLink({ onClick, ...props }: AdminLinkProps) {
    return <a {...props} onClick={(event) => {
      onClick?.(event);
      const entry = entries.find((item) => props.href === `#${item.id}`);
      if (entry) selectEntry(event, entry.id);
    }} />;
  }

  const brandMark = <span className="catalog-brand-mark" aria-hidden="true" />;

  return (
    <AdminShell
      className="catalog-app"
      brand={<a className="catalog-brand" href="/" aria-label="Evenkit home">{brandMark}<span>Evenkit<small>Components & themes</small></span></a>}
      compactBrand={<Tooltip><TooltipTrigger asChild><a className="catalog-brand" href="/" aria-label="Evenkit home">{brandMark}</a></TooltipTrigger><TooltipContent side="right">Evenkit home</TooltipContent></Tooltip>}
      sidebarState={sidebarState}
      onSidebarStateChange={setSidebarState}
      navigation={navigation}
      {...(active ? { activeItemId: active.id } : {})}
      renderLink={renderLink}
      navLabel="Components"
      contentId="catalog-main"
      header={<div className="catalog-search">
        <div className="catalog-search-heading"><Label htmlFor="component-search">Search components</Label><p id="search-results" className="catalog-search-count" role="status">{visible.length} {visible.length === 1 ? "entry" : "entries"}</p></div>
        <Input ref={searchRef} id="component-search" type="search" startAdornment={<SearchIcon size="sm" />} placeholder="Search the library…" value={query} onChange={(event) => setQuery(event.target.value)} aria-describedby="search-results" />
      </div>}
      actions={<div className="catalog-preferences">
            <div><Label htmlFor="theme-select">Theme</Label><Select id="theme-select" value={theme} options={themeOptions} onValueChange={(selected) => { const value = themeNames.find((name) => name === selected); if (value) setTheme(value); }} /></div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button shape="icon" variant="ghost" aria-label={appearanceAction} onClick={onToggleAppearance}>
                    {mode === "light" ? <MoonIcon /> : <SunIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">{appearanceAction}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>}
      footer={<div className="catalog-library-footer"><div><Badge tone="accent">Pilot</Badge><span>Version 0.1.0</span></div><p>React components, themes and layouts</p></div>}
      compactFooter={<span className="catalog-compact-footer" aria-label="Version 0.1.0">0.1.0</span>}
    >
          {active ? (
            <article className="catalog-detail" data-composition={active.group === "Compositions" ? active.id : undefined} key={active.id}>
              <div className="catalog-detail-heading">
                <div className="catalog-title-row"><h1>{active.name}</h1></div>
                <p className="catalog-description">{active.description}</p>
              </div>
              <section className="catalog-preview" aria-label={`${active.name} live preview`}>
                <div className="catalog-preview-header"><h2>Live preview</h2><span>{themes[theme].name}<span className="catalog-preview-mode">{mode}</span></span></div>
                <div className="catalog-preview-content"><Suspense fallback={<Spinner label="Loading component preview" />}><Preview id={active.id} theme={theme} mode={mode} onThemeChange={setTheme} /></Suspense></div>
              </section>
              <CodeExample code={active.usage} />
              <div className="catalog-information-grid">
                <section className="catalog-info-panel"><h2>Component details</h2><dl><div><dt>Owner</dt><dd>Evenkit</dd></div><div><dt>Maturity</dt><dd>Pilot, ready for evaluation</dd></div><div><dt>Source</dt><dd>{active.source}</dd></div></dl><a href={active.sourceUrl} target="_blank" rel="noreferrer">Reference documentation <ExternalLinkIcon size="sm" /></a></section>
                <section className="catalog-info-panel"><h2>Use in a project</h2><p>Import the token stylesheet before the control stylesheet. Components ship ordinary CSS and do not require Tailwind.</p><pre tabIndex={0}><code>{'import "@evenkit/tokens/css";\nimport "@evenkit/ui/css";'}</code></pre><p>These local pilot packages have not been published. Build and pack them from this repository; installation steps are in the repository README.</p></section>
              </div>
              <footer className="catalog-detail-footer"><span>React controls with document-level themes</span><span>Application state and callbacks stay in your project.</span></footer>
            </article>
          ) : (
            <div className="catalog-no-results"><EmptyState icon={<SearchIcon />} titleAs="h1" title="No components match your search" description={`No results for “${query.trim()}”. Try a component name or a state such as loading.`} action={<Button onClick={clearCatalogSearch}>Clear search</Button>} /></div>
          )}
    </AdminShell>
  );
}
