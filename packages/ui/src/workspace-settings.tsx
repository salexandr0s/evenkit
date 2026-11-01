"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent } from "react";
import { themes, themeNames, type ThemeName } from "@evenkit/tokens";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { ActionMessage, Spinner } from "./feedback.js";
import { SearchField } from "./form-controls.js";
import { Avatar } from "./foundations.js";
import { IconButton } from "./icon-button.js";
import { CheckIcon, ChevronsUpDownIcon, RotateCcwIcon, XIcon } from "./icons.js";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "./overlays.js";
import { RadioGroup } from "./selection-controls.js";
import { SelectField } from "./select.js";

export interface WorkspaceOption { id: string; name: string; description?: string; unavailable?: string }
export interface WorkspaceSwitcherProps {
  workspaces: readonly WorkspaceOption[];
  value: string;
  onValueChange: (id: string) => void;
  /** Prepare the change; commit it in onValueChange after this promise succeeds. */
  onSwitch?: (id: string, context: { signal: AbortSignal }) => Promise<void>;
  disabled?: boolean;
  label?: string;
}

export function WorkspaceSwitcher({ workspaces, value, onValueChange, onSwitch, disabled = false, label = "Switch workspace" }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [failure, setFailure] = useState<{ id: string; message: string } | null>(null);
  const [note, setNote] = useState("");
  const request = useRef<AbortController | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const restoreSearch = useRef(false);
  const latestOptions = useRef(workspaces);
  latestOptions.current = workspaces;
  const current = workspaces.find(workspace => workspace.id === value);
  const filtered = workspaces.filter(workspace => `${workspace.name} ${workspace.description ?? ""}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  useEffect(() => () => request.current?.abort(), []);
  useLayoutEffect(() => { request.current?.abort(); request.current = null; setPending(null); setFailure(null); if (disabled) setOpen(false); }, [value, disabled]);
  useLayoutEffect(() => { if (pending) cancelButton.current?.focus(); else if (restoreSearch.current) { restoreSearch.current = false; search.current?.focus(); } }, [pending]);
  function cancel() { request.current?.abort(); request.current = null; restoreSearch.current = true; setPending(null); setNote("Workspace change cancelled."); }
  function changeOpen(next: boolean) {
    if (!next) { request.current?.abort(); request.current = null; setPending(null); }
    setOpen(next);
    if (next) { setQuery(""); setFailure(null); setNote(""); }
  }
  async function choose(id: string) {
    const next = workspaces.find(workspace => workspace.id === id);
    if (!next || next.unavailable || disabled || pending || id === value) return;
    const controller = new AbortController();
    request.current?.abort(); request.current = controller;
    setPending(id); setFailure(null); setNote("");
    try {
      await onSwitch?.(id, { signal: controller.signal });
      if (controller.signal.aborted || request.current !== controller) return;
      const available = latestOptions.current.find(workspace => workspace.id === id);
      if (!available || available.unavailable) throw new Error("This workspace is no longer available.");
      request.current = null; setPending(null); setOpen(false); setNote(`Switched to ${next.name}.`);
      onValueChange(id);
    } catch (error: unknown) {
      if (controller.signal.aborted || request.current !== controller) return;
      request.current = null; restoreSearch.current = true; setPending(null);
      setFailure({ id, message: error instanceof Error ? error.message : "The workspace could not be opened." });
    }
  }
  function move(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const options = Array.from(list.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
    if (!options.length) return;
    event.preventDefault();
    const index = options.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : event.key === "ArrowDown" ? (index + 1) % options.length : (index - 1 + options.length) % options.length;
    options[next]?.focus();
  }
  return <div className="pk-workspace-switcher">
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger asChild><Button ref={trigger} className="pk-workspace-trigger" variant="outline" disabled={disabled} aria-label={`${label}: ${current?.name ?? "No workspace"}`} startIcon={<Avatar name={current?.name ?? "Workspace"} size="sm" decorative />} endIcon={<ChevronsUpDownIcon size="sm" />}>{current?.name ?? "Choose workspace"}</Button></PopoverTrigger>
      <PopoverContent className="pk-workspace-popover" align="start" onOpenAutoFocus={event => { event.preventDefault(); search.current?.focus(); }} onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }}>
        <PopoverTitle>{label}</PopoverTitle><PopoverDescription>Choose where you want to work.</PopoverDescription>
        <SearchField ref={search} label="Find a workspace" value={query} disabled={pending !== null} onValueChange={setQuery} onKeyDown={event => { if (event.key === "ArrowDown") move(event); }} />
        <ul ref={list} className="pk-workspace-list" aria-label="Workspaces" onKeyDown={move}>{filtered.map(workspace => <li key={workspace.id}>
          <button className="pk-workspace-option" type="button" disabled={Boolean(workspace.unavailable) || pending !== null} aria-current={workspace.id === value ? "true" : undefined} onClick={() => { void choose(workspace.id); }}>
            <Avatar name={workspace.name} size="sm" decorative /><span className="pk-workspace-option-text"><strong>{workspace.name}</strong>{workspace.description ? <span>{workspace.description}</span> : null}{workspace.unavailable ? <span>{workspace.unavailable}</span> : null}</span>{workspace.id === value ? <CheckIcon size="sm" /> : null}
          </button>
        </li>)}</ul>
        {filtered.length === 0 ? <p className="pk-settings-note">No matching workspaces.</p> : null}
        {pending ? <div className="pk-workspace-pending"><span role="status"><Spinner size="sm" aria-hidden="true" />Opening workspace…</span><IconButton ref={cancelButton} label="Cancel switch" size="sm" variant="ghost" onClick={cancel}><XIcon size="sm" /></IconButton></div> : null}
        {failure ? <ActionMessage tone="error" heading="Workspace did not change" actions={<IconButton label="Retry switch" variant="outline" size="sm" onClick={() => { void choose(failure.id); }}><RotateCcwIcon size="sm" /></IconButton>}>{failure.message}</ActionMessage> : null}
      </PopoverContent>
    </Popover>
    <span className="pk-visually-hidden" role="status">{note}</span>
  </div>;
}

export interface SettingsItem { id: string; label: string; description?: string; disabled?: boolean }
export interface SettingsLayoutProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  items: readonly SettingsItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  navigationLabel?: string;
}
export function SettingsLayout({ items, activeId, onNavigate, navigationLabel = "Settings sections", className, children, ...props }: SettingsLayoutProps) {
  return <div {...props} className={classes("pk-settings-layout", className)}>
    <nav aria-label={navigationLabel}><ul className="pk-settings-navigation">{items.map(item => <li key={item.id}><button type="button" className="pk-settings-navigation-item" disabled={item.disabled} aria-current={item.id === activeId ? "page" : undefined} onClick={() => onNavigate(item.id)}><span>{item.label}</span>{item.description ? <small>{item.description}</small> : null}</button></li>)}</ul></nav>
    <div className="pk-settings-content">{children}</div>
  </div>;
}

export type AppearanceMode = "system" | "light" | "dark";
export interface AppearanceValue { theme: ThemeName; mode: AppearanceMode; density?: "default" | "compact"; locale?: string }
export interface AppearancePreferencesProps {
  value: AppearanceValue;
  onValueChange: (value: AppearanceValue) => void;
  /** Supported formatting locales. Labels and application translations belong to the host. */
  locales?: readonly { value: string; label: string }[];
  disabled?: boolean;
}
export function AppearancePreferences({ value, onValueChange, locales = [], disabled = false }: AppearancePreferencesProps) {
  return <div className="pk-appearance-preferences">
    <RadioGroup label="Color mode" value={value.mode} disabled={disabled} options={[{ value: "system", label: "System", description: "Follow your device setting." }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} onValueChange={mode => { if (mode === "light" || mode === "dark" || mode === "system") onValueChange({ ...value, mode }); }} />
    <SelectField label="Color theme" value={value.theme} disabled={disabled} options={themeNames.map(theme => ({ value: theme, label: themes[theme].name }))} onValueChange={theme => { if (themeNames.includes(theme as ThemeName)) onValueChange({ ...value, theme: theme as ThemeName }); }} />
    <SelectField label="Density" value={value.density ?? "default"} disabled={disabled} options={[{ value: "default", label: "Default" }, { value: "compact", label: "Compact" }]} onValueChange={density => { if (density === "default" || density === "compact") onValueChange({ ...value, density }); }} />
    {locales.length ? <SelectField label="Locale" value={locales.find(locale => locale.value === value.locale)?.value ?? locales[0]?.value ?? ""} disabled={disabled} options={[...locales]} onValueChange={locale => { if (locales.some(option => option.value === locale)) onValueChange({ ...value, locale }); }} /> : null}
  </div>;
}
