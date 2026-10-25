"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog.js";
import { ActionMessage, Spinner } from "./feedback.js";
import { SearchField } from "./form-controls.js";
import { Kbd } from "./foundations.js";
import { ArrowRightIcon, SearchIcon } from "./icons.js";

interface CommandItemContent {
  id: string;
  label: string;
  description?: string;
  group?: string;
  keywords?: readonly string[];
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
}
export type CommandItem = CommandItemContent & (
  | { href: string; onAction?: never; target?: "_self" | "_blank" }
  | { onAction: () => void; href?: never; target?: never }
);
export type CommandSearch = (query: string, context: { signal: AbortSignal }) => Promise<readonly CommandItem[]>;
export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: readonly CommandItem[];
  /** Supply a stable callback. Remote results are already filtered by the host. */
  search?: CommandSearch;
  query?: string;
  onQueryChange?: (query: string) => void;
  title?: string;
  description?: string;
  searchLabel?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  retryLabel?: string;
  resultsLabel?: string;
  defaultGroupLabel?: string;
  /** Ctrl/Cmd+K ignores editable controls and other open modal dialogs. */
  shortcut?: boolean;
  debounceMs?: number;
  className?: string;
}

const emptyItems: readonly CommandItem[] = [];
interface SearchResult { query: string; items: readonly CommandItem[]; status: "loading" | "ready" | "error"; provider?: CommandSearch; error?: string }

/** Search dialog with native links and buttons. Arrow keys supplement ordinary Tab navigation. */
export function CommandPalette({ open, onOpenChange, items = emptyItems, search, query: controlledQuery, onQueryChange,
  title = "Search and commands", description = "Find a destination or choose an action.", searchLabel = "Search commands",
  emptyMessage = "No results. Try another search.", loadingMessage = "Searching…", retryLabel = "Try again",
  resultsLabel = "Search results", defaultGroupLabel = "Commands", shortcut = true, debounceMs = 150, className,
}: CommandPaletteProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const returnTarget = useRef<HTMLElement | null>(null);
  const actionAfterClose = useRef<(() => void) | null>(null);
  const request = useRef<AbortController | null>(null);
  const [localQuery, setLocalQuery] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [remote, setRemote] = useState<SearchResult>({ query: "", items: emptyItems, status: "loading" });
  const query = controlledQuery ?? localQuery;
  const latest = useRef({ open, onOpenChange });
  latest.current = { open, onOpenChange };

  useEffect(() => {
    if (!shortcut) return;
    function keydown(event: globalThis.KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.repeat || event.altKey || event.shiftKey || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      const own = target !== null && content.current?.contains(target);
      if (!own && target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      // Some modal primitives hide the background without emitting aria-modal.
      const anotherModal = [...document.querySelectorAll<HTMLElement>('[role="dialog"], [role="alertdialog"]')]
        .some(dialog => dialog !== content.current && dialog.dataset.state !== "closed" && dialog.getClientRects().length > 0);
      if (anotherModal) return;
      event.preventDefault();
      if (!latest.current.open) returnTarget.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      latest.current.onOpenChange(!latest.current.open);
    }
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [shortcut]);

  useEffect(() => {
    request.current?.abort();
    if (!open || !search) { setRemote({ query, items: emptyItems, status: "loading" }); return; }
    const controller = new AbortController();
    request.current = controller;
    setRemote({ query, items: emptyItems, status: "loading", provider: search });
    const timer = window.setTimeout(() => {
      void Promise.resolve().then(() => search(query, { signal: controller.signal })).then(found => {
        if (!controller.signal.aborted && request.current === controller) setRemote({ query, items: found, status: "ready", provider: search });
      }, (error: unknown) => {
        if (!controller.signal.aborted && request.current === controller) setRemote({ query, items: emptyItems, status: "error", provider: search, error: error instanceof Error ? error.message : "Search could not be completed." });
      });
    }, Math.max(0, debounceMs));
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [open, query, search, attempt, debounceMs]);

  const localResults = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return items.filter(item => [item.label, item.description, ...(item.keywords ?? [])].filter(Boolean).join(" ").toLocaleLowerCase().includes(needle));
  }, [items, query]);
  const status = search ? remote.query === query && remote.provider === search ? remote.status : "loading" : "ready";
  const visible = status === "ready" ? search ? remote.items : localResults : emptyItems;
  const groups = new Map<string, CommandItem[]>();
  for (const item of visible) {
    const group = item.group ?? defaultGroupLabel;
    groups.set(group, [...(groups.get(group) ?? []), item]);
  }
  function setQuery(value: string) { if (controlledQuery === undefined) setLocalQuery(value); onQueryChange?.(value); }
  function move(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    const nodes = [...(results.current?.querySelectorAll<HTMLElement>('[data-command-item]:not([aria-disabled="true"]):not(:disabled)') ?? [])];
    const index = nodes.findIndex(node => node === document.activeElement);
    const inInput = event.target === input.current;
    if (event.key === "ArrowDown") {
      event.preventDefault(); (nodes[index + 1] ?? nodes[0])?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index === 0) input.current?.focus();
      else (nodes[index - 1] ?? nodes.at(-1))?.focus();
    } else if (!inInput && event.key === "Home") { event.preventDefault(); nodes[0]?.focus(); }
    else if (!inInput && event.key === "End") { event.preventDefault(); nodes.at(-1)?.focus(); }
    else if (inInput && event.key === "Enter" && nodes[0]) { event.preventDefault(); nodes[0].click(); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent ref={content} className={classes("pk-command-palette", className)} scroll="body" size="md"
      onOpenAutoFocus={event => { event.preventDefault(); if (document.activeElement instanceof HTMLElement && !content.current?.contains(document.activeElement)) returnTarget.current = document.activeElement; input.current?.focus(); }}
      onCloseAutoFocus={event => {
        event.preventDefault();
        if (latest.current.open) return;
        if (returnTarget.current?.isConnected) returnTarget.current.focus();
        const action = actionAfterClose.current; actionAfterClose.current = null; action?.();
      }}>
      <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
      <div className="pk-command-search" onKeyDown={move}>
        <SearchField ref={input} label={searchLabel} value={query} onValueChange={setQuery} autoComplete="off" aria-controls={`${id}-results`} />
      </div>
      <DialogBody className="pk-command-body">
        <p className="pk-command-status" role="status" aria-atomic="true">{status === "loading" ? <><Spinner size="sm" aria-hidden="true" />{loadingMessage}</> : status === "error" ? "Search unavailable" : `${visible.length} ${visible.length === 1 ? "result" : "results"}`}</p>
        <div ref={results} id={`${id}-results`} aria-label={resultsLabel} aria-busy={status === "loading"} onKeyDown={move}>
          {status === "error" ? <ActionMessage tone="error" heading="Search could not be completed" actions={<Button size="sm" variant="outline" onClick={() => { input.current?.focus(); setAttempt(value => value + 1); }}>{retryLabel}</Button>}>{remote.error}</ActionMessage> : null}
          {status === "ready" && visible.length === 0 ? <div className="pk-command-empty"><SearchIcon aria-hidden="true" /><p>{emptyMessage}</p></div> : null}
          {[...groups].map(([group, commands], groupIndex) => <section key={group} className="pk-command-group" aria-labelledby={`${id}-group-${groupIndex}`}>
            <h3 id={`${id}-group-${groupIndex}`}>{group}</h3>
            <ul>{commands.map(item => {
              const body = <>{item.icon ? <span className="pk-command-icon" aria-hidden="true">{item.icon}</span> : null}<span className="pk-command-copy"><span className="pk-command-label">{item.label}</span>{item.description ? <span className="pk-command-description">{item.description}</span> : null}</span>{item.shortcut ? <Kbd aria-hidden="true">{item.shortcut}</Kbd> : item.href ? <ArrowRightIcon size="sm" aria-hidden="true" /> : null}</>;
              return <li key={item.id}>{item.href !== undefined ? <a className="pk-command-item" data-command-item="" href={item.disabled ? undefined : item.href} target={item.target} rel={item.target === "_blank" ? "noopener noreferrer" : undefined} aria-disabled={item.disabled || undefined} tabIndex={item.disabled ? -1 : 0} onClick={event => { if (item.disabled) event.preventDefault(); else onOpenChange(false); }}>{body}</a>
                : <button type="button" className="pk-command-item" data-command-item="" disabled={item.disabled} onClick={() => { actionAfterClose.current = item.onAction; onOpenChange(false); }}>{body}</button>}</li>;
            })}</ul>
          </section>)}
        </div>
      </DialogBody>
      <DialogFooter className="pk-command-footer"><span><Kbd>↑</Kbd><Kbd>↓</Kbd> Move</span><span><Kbd>Enter</Kbd> Open</span><span><Kbd>Esc</Kbd> Close</span></DialogFooter>
    </DialogContent>
  </Dialog>;
}
