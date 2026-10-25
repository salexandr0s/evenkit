"use client";

import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { ActivityTimeline, type ActivityGroup } from "./activity-timeline.js";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { ActionMessage, Badge, Spinner } from "./feedback.js";
import { SearchField } from "./form-controls.js";
import { Pagination } from "./navigation.js";
import { useRemoteTable, type DataTableQuery, type RemoteTableResult } from "./remote-table.js";
import { SelectField } from "./select.js";
import type { TeamActionContext, TeamActionResult } from "./team-admin-types.js";
import { useTeamAction } from "./use-team-action.js";

export interface AuditOption { id: string; label: string }
export interface AuditDetail { label: string; value: string }
export interface AuditRecord {
  id: string;
  actor: string;
  actorId: string;
  action: string;
  /** An ISO timestamp with an explicit offset or Z. */
  timestamp: string;
  kind: string;
  /** Recorded application outcome, never the state of a retryable UI action. */
  outcome: string;
  details?: readonly AuditDetail[];
}
export interface AuditCriteria {
  search: string;
  actorId: string | null;
  kind: string | null;
  outcome: string | null;
}
export interface AuditQuery extends AuditCriteria { pageIndex: number; pageSize: number }
export interface AuditViewerProps extends Omit<ComponentPropsWithoutRef<"section">, "children" | "onChange"> {
  /** Include team, principal and authorization revisions. Visibility is not authorization. */
  contextKey: string;
  query: AuditQuery;
  onQueryChange: (query: AuditQuery) => void;
  /** Memoize this callback; validate and authorize responses in the application. */
  load: (query: AuditQuery, context: TeamActionContext) => Promise<RemoteTableResult<AuditRecord>>;
  timeZone: string;
  locale?: string;
  actors?: readonly AuditOption[];
  kinds?: readonly AuditOption[];
  outcomes?: readonly AuditOption[];
  /** Hides records and prevents invoking the loader while this reason is present. */
  denied?: string;
  /** Export all matching events, independent of the current page. Delivery belongs to the host. */
  onExport?: (criteria: AuditCriteria, context: TeamActionContext) => Promise<TeamActionResult>;
  exportDisabledReason?: string;
  onRefreshContext?: () => void;
  label?: string;
}

function filterOptions(options: readonly AuditOption[], selected: string | null, allLabel: string) {
  const available = selected !== null && !options.some(option => option.id === selected)
    ? [...options, { id: selected, label: selected }] : options;
  return [{ value: "all", label: allLabel }, ...available.map(option => ({ value: `value:${option.id}`, label: option.label }))];
}
function filterValue(value: string): string | null { return value === "all" ? null : value.slice("value:".length); }
function optionLabel(options: readonly AuditOption[], id: string) { return options.find(option => option.id === id)?.label ?? id; }

/** Controlled remote activity browsing. Storage, authorization and export delivery remain host-owned. */
export function AuditViewer({
  contextKey, query, onQueryChange, load, timeZone, locale = "en", actors = [], kinds = [], outcomes = [],
  denied, onExport, exportDisabledReason, onRefreshContext, label = "Audit activity", className, ...props
}: AuditViewerProps) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const exportButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const exportHasFocus = useRef(false);
  const exportStarted = useRef(false);
  const focusedControl = useRef<HTMLElement | null>(null);
  const [notice, setNotice] = useState<{ key: string; text: string } | null>(null);
  const criteria = useMemo<AuditCriteria>(() => ({ search: query.search, actorId: query.actorId, kind: query.kind, outcome: query.outcome }), [query.search, query.actorId, query.kind, query.outcome]);
  const scopeKey = JSON.stringify([contextKey, criteria.search, criteria.actorId, criteria.kind, criteria.outcome, denied ?? null]);
  const exportKey = JSON.stringify([scopeKey, exportDisabledReason ?? null, Boolean(onExport)]);
  const action = useTeamAction(exportKey);
  const requestQuery: DataTableQuery = { pageIndex: query.pageIndex, pageSize: query.pageSize, search: query.search, sort: null };
  const loadPage = useCallback((page: DataTableQuery, request: { signal: AbortSignal }) => denied
    ? Promise.resolve({ data: [], total: 0 })
    : load({ ...criteria, pageIndex: page.pageIndex, pageSize: page.pageSize }, { signal: request.signal, contextKey }), [contextKey, criteria, denied, load]);
  const remote = useRemoteTable<AuditRecord>({ query: requestQuery, contextKey: scopeKey, load: loadPage });
  const cannotExport = Boolean(denied || exportDisabledReason || action.pending || action.result?.status === "stale" || action.result?.status === "denied");
  const lastPage = Math.max(0, Math.ceil(remote.total / query.pageSize) - 1);
  const pageResetPending = !denied && !remote.loading && !remote.error && query.pageIndex > lastPage;

  useLayoutEffect(() => {
    if (pageResetPending) onQueryChange({ ...query, pageIndex: lastPage });
  }, [pageResetPending, lastPage, query, onQueryChange]);

  useLayoutEffect(() => {
    if (action.pending && exportStarted.current) {
      exportStarted.current = false;
      cancelButton.current?.focus();
    } else if (!action.pending && exportHasFocus.current) {
      exportHasFocus.current = false;
      if (exportButton.current && !exportButton.current.disabled) exportButton.current.focus();
      else heading.current?.focus();
    }
  }, [action.pending, exportKey]);

  useLayoutEffect(() => {
    const previous = focusedControl.current;
    const active = document.activeElement;
    const lost = previous && (!previous.isConnected || previous.matches(":disabled"));
    if (lost && (active === document.body || active === previous)) {
      focusedControl.current = null;
      heading.current?.focus();
    }
  }, [scopeKey, query.pageIndex, query.pageSize, remote.loading, denied, cannotExport]);

  function changeQuery(next: AuditQuery) {
    action.reset();
    setNotice(null);
    onQueryChange(next);
  }
  function changeCriteria(patch: Partial<AuditCriteria>) { changeQuery({ ...query, ...patch, pageIndex: 0 }); }
  function resetFilters() {
    search.current?.focus();
    changeCriteria({ search: "", actorId: null, kind: null, outcome: null });
  }
  function refresh() {
    heading.current?.focus();
    action.reset();
    setNotice(null);
    remote.retry();
    onRefreshContext?.();
  }
  async function exportEvents() {
    if (!onExport || cannotExport) return;
    setNotice(null);
    exportStarted.current = true;
    const snapshot = { ...criteria };
    await action.run(request => onExport(snapshot, { signal: request.signal, contextKey }));
  }
  function cancelExport() {
    action.cancel();
    setNotice({ key: exportKey, text: "Export cancelled. Check with your application if delivery had already started." });
  }

  const groups: readonly ActivityGroup[] = denied || remote.loading || remote.error || pageResetPending ? [] : [{ id: "events", label: "Events", events: remote.data.map(record => ({
    id: record.id, actor: record.actor, action: record.action, timestamp: record.timestamp,
    detail: <div className="pk-audit-event-detail">
      <div className="pk-audit-event-meta"><span>{optionLabel(kinds, record.kind)}</span><Badge size="sm">{optionLabel(outcomes, record.outcome)}</Badge></div>
      <details className="pk-audit-details">
        <summary>Event details<span className="pk-visually-hidden">: {record.action} by {record.actor}</span></summary>
        <dl><div><dt>Event ID</dt><dd>{record.id}</dd></div><div><dt>Actor ID</dt><dd>{record.actorId}</dd></div>
          {record.details?.map((detail, index) => <div key={`${detail.label}-${index}`}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}
        </dl>
      </details>
    </div>,
  })) }];
  const hasFilters = query.search !== "" || query.actorId !== null || query.kind !== null || query.outcome !== null;
  const stale = action.result?.status === "stale";
  const exportDenied = action.result?.status === "denied";
  return <section {...props} ref={root} className={classes("pk-audit-viewer", className)} aria-labelledby={props["aria-label"] ? undefined : id}
    onFocusCapture={event => { if (event.target instanceof HTMLElement) focusedControl.current = event.target; props.onFocusCapture?.(event); }}
    onBlurCapture={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) focusedControl.current = null; props.onBlurCapture?.(event); }}>
    <header className="pk-audit-header"><div><h2 ref={heading} tabIndex={-1} id={id}>{label}</h2><p>Review recorded events and their details.</p></div>
      {onExport ? <Button ref={exportButton} variant="outline" disabled={cannotExport} onClick={() => { void exportEvents(); }} aria-describedby={exportDisabledReason ? `${id}-export-reason` : undefined}>Export matching events</Button> : null}
    </header>
    {onExport && exportDisabledReason ? <p className="pk-audit-note" id={`${id}-export-reason`}>{exportDisabledReason}</p> : null}
    <div className="pk-audit-filters" role="group" aria-label="Filter audit activity">
      <SearchField ref={search} label="Search audit activity" value={query.search} disabled={Boolean(denied)} onValueChange={value => changeCriteria({ search: value })} />
      <SelectField label="Actor" value={query.actorId === null ? "all" : `value:${query.actorId}`} options={filterOptions(actors, query.actorId, "All actors")} disabled={Boolean(denied)} onValueChange={value => changeCriteria({ actorId: filterValue(value) })} />
      <SelectField label="Event type" value={query.kind === null ? "all" : `value:${query.kind}`} options={filterOptions(kinds, query.kind, "All event types")} disabled={Boolean(denied)} onValueChange={value => changeCriteria({ kind: filterValue(value) })} />
      <SelectField label="Outcome" value={query.outcome === null ? "all" : `value:${query.outcome}`} options={filterOptions(outcomes, query.outcome, "All outcomes")} disabled={Boolean(denied)} onValueChange={value => changeCriteria({ outcome: filterValue(value) })} />
    </div>
    {hasFilters && !denied ? <Button className="pk-audit-reset" variant="ghost" size="sm" onClick={resetFilters}>Clear audit filters</Button> : null}
    {action.pending ? <div className="pk-audit-export-pending"><p role="status"><Spinner size="sm" aria-hidden="true" />Preparing export…</p><Button ref={cancelButton} variant="outline" size="sm" onFocus={() => { exportHasFocus.current = true; }} onBlur={event => { if (event.relatedTarget) exportHasFocus.current = false; }} onClick={cancelExport}>Cancel export</Button></div> : null}
    {action.result ? <ActionMessage tone={action.result.status === "success" ? "success" : stale || exportDenied ? "warning" : "error"} heading={action.result.status === "success" ? "Export ready" : stale ? "Activity context changed" : exportDenied ? "Export unavailable" : "Export failed"}
      actions={action.result.status === "error" ? <Button variant="outline" size="sm" onClick={() => { void exportEvents(); }}>Retry export</Button> : stale || exportDenied ? <Button variant="outline" size="sm" onClick={refresh}>Refresh activity</Button> : undefined}>
      {action.result.message ?? "Your application prepared the requested export."}
    </ActionMessage> : null}
    {notice?.key === exportKey ? <p className="pk-audit-note" role="status">{notice.text}</p> : null}
    {denied ? <ActionMessage tone="warning" heading="Activity unavailable" {...(onRefreshContext ? { actions: <Button variant="outline" size="sm" onClick={refresh}>Refresh access</Button> } : {})}>{denied}</ActionMessage> : <>
      <ActivityTimeline key={JSON.stringify([scopeKey, query.pageIndex, query.pageSize])} label="Audit events" groups={groups} timeZone={timeZone} locale={locale} loading={remote.loading || pageResetPending} error={remote.error}
        onRetry={() => { heading.current?.focus(); remote.retry(); }} emptyMessage={hasFilters ? "No events match these filters. Clear the filters to see more activity." : "No events have been recorded."} />
      <div className="pk-audit-pagination"><p className="pk-audit-note" role="status">{remote.loading ? "" : `${remote.total} matching ${remote.total === 1 ? "event" : "events"}`}</p>
        <Pagination label="Audit pages" compact page={query.pageIndex + 1} pageCount={Math.max(1, Math.ceil(remote.total / query.pageSize))} busy={remote.loading || pageResetPending} disabled={Boolean(remote.error)} onPageChange={page => { heading.current?.focus(); changeQuery({ ...query, pageIndex: page - 1 }); }} />
      </div>
    </>}
  </section>;
}
