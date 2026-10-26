"use client";

import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { DataTable, type DataTableColumn } from "./data-table.js";
import { FileRow } from "./data-workflows.js";
import { EmptyState, Spinner } from "./feedback.js";
import { SearchField } from "./form-controls.js";
import { ArrowRightIcon, EyeIcon, FolderIcon, LayoutGridIcon, ListIcon } from "./icons.js";
import { FilePreview, mediaFileTypeLabel, type MediaFile } from "./media-preview.js";
import { Breadcrumbs, Pagination } from "./navigation.js";
import { useRemoteTable, useTableSelection, type DataTableQuery, type RemoteTableLoadContext, type RemoteTableResult } from "./remote-table.js";
import { Checkbox, SegmentedControl } from "./selection-controls.js";
import { SelectField } from "./select.js";
import { BulkActionBar, SortControl } from "./table-controls.js";

export interface DocumentFolder { id: string; name: string; kind: "folder" }
export interface DocumentFile extends MediaFile { kind: "file"; sizeBytes?: number }
export type DocumentEntry = DocumentFolder | DocumentFile;
export type DocumentKindFilter = "all" | "files" | "folders";
export interface DocumentLibraryQuery extends DataTableQuery { folderId: string | null; kind: DocumentKindFilter }
export type DocumentLibraryLoad = (query: DocumentLibraryQuery, context: RemoteTableLoadContext) => Promise<RemoteTableResult<DocumentEntry>>;

export interface UseDocumentLibraryOptions {
  /** Include account, workspace and permission revision in this key. */
  scopeKey: string;
  query: DocumentLibraryQuery;
  /** Memoize this callback and validate the application's response at its boundary. */
  load: DocumentLibraryLoad;
}

/** Reuses the remote table's abort and lifetime guards; IDs survive sort/page changes. */
export function useDocumentLibrary({ scopeKey, query, load }: UseDocumentLibraryOptions) {
  const { folderId, kind } = query;
  const contextKey = JSON.stringify([scopeKey, folderId, kind]);
  const pageLoader = useCallback(async (page: DataTableQuery, context: RemoteTableLoadContext) => {
    const result = await load({ ...page, folderId, kind }, context);
    const ids = new Set<string>();
    for (const entry of result.data) {
      if (!entry.id || ids.has(entry.id)) throw new Error("Documents must have unique, non-empty IDs.");
      ids.add(entry.id);
    }
    return result;
  }, [load, folderId, kind]);
  const result = useRemoteTable({ query, contextKey, load: pageLoader });
  const selection = useTableSelection(JSON.stringify([contextKey, query.search]));
  return { ...result, selection };
}

export interface DocumentLibraryProps {
  entries: readonly DocumentEntry[];
  total: number;
  query: DocumentLibraryQuery;
  onQueryChange: (query: DocumentLibraryQuery) => void;
  /** Ancestors from the first folder beneath the root to the current folder. */
  path: readonly DocumentFolder[];
  onNavigate: (path: readonly DocumentFolder[]) => void;
  view: "list" | "grid";
  onViewChange: (view: "list" | "grid") => void;
  selection: { selectedIds: readonly string[]; onSelectionChange: (ids: readonly string[]) => void };
  onPreview: (file: DocumentFile, trigger: HTMLButtonElement) => void;
  onRemove?: (ids: readonly string[]) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  actions?: ReactNode;
  rootLabel?: string;
  className?: string;
}

const sortFields = [{ id: "name", label: "Name" }, { id: "size", label: "File size" }];
function entryType(entry: DocumentEntry) { return entry.kind === "folder" ? "Folder" : mediaFileTypeLabel(entry.mimeType); }

export function DocumentLibrary({ entries, total, query, onQueryChange, path, onNavigate, view, onViewChange, selection, onPreview, onRemove, loading = false, error, onRetry, actions, rootLabel = "All documents", className }: DocumentLibraryProps) {
  const search = useRef<HTMLInputElement>(null);
  const gridStatus = useRef<HTMLParagraphElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const gridFocus = useRef<HTMLElement | null>(null);
  const unavailable = loading || Boolean(error);
  const pageCount = Math.ceil(total / query.pageSize);
  const lastPage = Math.max(0, pageCount - 1);
  const resetPending = !unavailable && query.pageIndex > lastPage;
  useLayoutEffect(() => {
    if (view === "grid" && resetPending) onQueryChange({ ...query, pageIndex: lastPage });
  }, [view, resetPending, onQueryChange, query, lastPage]);
  useLayoutEffect(() => {
    const previous = gridFocus.current;
    if (view !== "grid" || !previous || (!unavailable && !resetPending)) return;
    if ((!previous.isConnected || previous.matches(":disabled")) && (document.activeElement === document.body || document.activeElement === previous)) gridStatus.current?.focus();
  }, [view, unavailable, resetPending]);
  function update(patch: Partial<DocumentLibraryQuery>) { onQueryChange({ ...query, ...patch, pageIndex: 0 }); }
  function navigate(next: readonly DocumentFolder[]) { search.current?.focus(); onNavigate(next); }
  function resetFilters() { search.current?.focus(); update({ search: "", kind: "all" }); }
  const removeAction = onRemove ? <Button size="sm" variant="outline" disabled={unavailable} onClick={() => onRemove(selection.selectedIds)}>Remove selected</Button> : null;
  const openButton = (entry: DocumentEntry) => entry.kind === "folder"
    ? <Button size="sm" variant="ghost" className="pk-document-open" endIcon={<ArrowRightIcon size="sm" />} aria-label={`Open folder ${entry.name}`} onClick={() => navigate([...path, entry])}>Open</Button>
    : <Button size="sm" variant="ghost" className="pk-document-open" startIcon={<EyeIcon size="sm" />} aria-label={`Preview ${entry.name}`} onClick={event => onPreview(entry, event.currentTarget)}>Preview</Button>;
  const columns: readonly DataTableColumn<DocumentEntry>[] = [
    { id: "name", header: "Name", accessor: entry => entry.name, hideable: false, cell: entry => <ul className="pk-document-file-row" data-kind={entry.kind}><FileRow name={entry.name} fileType={entryType(entry)} {...(entry.kind === "file" && entry.sizeBytes !== undefined ? { sizeBytes: entry.sizeBytes } : {})} preview={entry.kind === "folder" ? <FolderIcon /> : undefined} /></ul> },
    { id: "actions", header: "Actions", accessor: () => "", align: "end", sortable: false, searchable: false, cell: openButton },
  ];
  const filtered = query.search !== "" || query.kind !== "all";
  const emptyTitle = filtered ? "No matching documents" : "This folder is empty";
  const emptyDescription = filtered ? "Try another name or show all file types." : "Upload files or choose another folder.";
  const status = loading ? "Loading documents…" : error ? "Documents unavailable" : resetPending ? "Updating documents…" : `${total} ${total === 1 ? "item" : "items"} · ${selection.selectedIds.length} selected`;
  const pageIds = entries.map(entry => entry.id);
  const allSelected = pageIds.length > 0 && pageIds.every(id => selection.selectedIds.includes(id));
  const someSelected = pageIds.some(id => selection.selectedIds.includes(id));
  return <section className={classes("pk-document-library", className)} aria-label="Document library">
    {path.length ? <Breadcrumbs label="Document folders" items={[{ id: "root:", label: rootLabel, href: "#documents-root" }, ...path.map((folder, index) => ({ id: `folder:${folder.id}`, label: folder.name, href: `#documents-path-${index}` }))]} renderLink={({ children, href }) => <button type="button" className="pk-breadcrumb-link pk-document-crumb" onClick={() => navigate(href === "#documents-root" ? [] : path.slice(0, Number(href.split("-").at(-1)) + 1))}>{children}</button>} /> : null}
    <header className="pk-document-header">
      <div className="pk-document-heading"><span className="pk-document-heading-icon" aria-hidden="true"><FolderIcon /></span><div><h3>{path.at(-1)?.name ?? rootLabel}</h3><p>{loading ? "Loading your files…" : error ? "Refresh to try again" : `${total} ${total === 1 ? "item" : "items"}${filtered ? total === 1 ? " matches your filters" : " match your filters" : " in this folder"}`}</p></div></div>
      {actions ? <div className="pk-document-header-actions">{actions}</div> : null}
    </header>
    <div className="pk-document-toolbar" role="group" aria-label="Document controls">
      <div className="pk-document-toolbar-primary"><SearchField ref={search} label="Search documents" placeholder="Search by filename…" value={query.search} onValueChange={value => update({ search: value })} />
        <SegmentedControl label="Document view" value={view} onValueChange={next => { if (next === "list" || next === "grid") onViewChange(next); }} options={[{ value: "list", label: <span className="pk-document-view-label"><ListIcon size="sm" aria-hidden="true" />List</span> }, { value: "grid", label: <span className="pk-document-view-label"><LayoutGridIcon size="sm" aria-hidden="true" />Grid</span> }]} />
      </div>
      <div className="pk-document-toolbar-secondary"><SelectField label="Show" value={query.kind} options={[{ value: "all", label: "All items" }, { value: "files", label: "Files" }, { value: "folders", label: "Folders" }]} onValueChange={kind => { if (kind === "all" || kind === "files" || kind === "folders") update({ kind }); }} />
        <SortControl label="Sort documents" fields={sortFields} value={query.sort} onValueChange={sort => update({ sort })} />
      </div>
    </div>
    {view === "list" ? <DataTable data={entries} columns={columns} getRowId={entry => entry.id} caption="Documents" searchable={false}
      onClearSearch={() => { search.current?.focus(); update({ search: "" }); }}
      remote={{ query, total, onQueryChange: next => onQueryChange({ ...query, ...next }) }} loading={loading} error={error} {...(onRetry ? { onRetry } : {})}
      selection={{ ...selection, getRowLabel: entry => entry.name, scopeLabel: "Selected IDs in this folder and filter, across pages", actions: removeAction }}
      pageSizeOptions={[6, 12, 24]} emptyTitle={emptyTitle} emptyDescription={emptyDescription}
      emptyAction={filtered ? <Button variant="outline" onClick={resetFilters}>Clear filters</Button> : null} />
      : <div ref={grid} className="pk-document-grid-region" onFocusCapture={event => { gridFocus.current = event.target; }} onBlurCapture={event => { if (event.relatedTarget !== null) gridFocus.current = null; }}>
        <BulkActionBar count={selection.selectedIds.length} scopeLabel="Selected IDs in this folder and filter, across pages" disabled={unavailable} onClear={() => { gridStatus.current?.focus(); selection.onSelectionChange([]); }}>{removeAction}</BulkActionBar>
        <p ref={gridStatus} tabIndex={-1} className="pk-document-status" role="status">{status}</p>
        {unavailable || resetPending ? <div className="pk-document-state">{error ? <div role="alert"><EmptyState title="Documents could not be loaded" description={error} action={onRetry ? <Button variant="outline" onClick={onRetry}>Try again</Button> : null} /></div> : <Spinner label="Loading documents" />}</div>
          : entries.length === 0 ? <EmptyState title={emptyTitle} description={emptyDescription} action={filtered ? <Button variant="outline" onClick={resetFilters}>Clear filters</Button> : null} />
            : <><Checkbox label="Select all items on this page" checked={allSelected ? true : someSelected ? "indeterminate" : false} onCheckedChange={checked => selection.onSelectionChange(checked === true ? [...new Set([...selection.selectedIds, ...pageIds])] : selection.selectedIds.filter(id => !pageIds.includes(id)))} />
              <ul className="pk-document-grid" aria-label="Documents">{entries.map(entry => <li key={entry.id} className="pk-document-card" data-kind={entry.kind} data-selected={selection.selectedIds.includes(entry.id) || undefined}>
                <div className="pk-document-card-selection"><Checkbox aria-label={`Select ${entry.name}`} checked={selection.selectedIds.includes(entry.id)} onCheckedChange={checked => selection.onSelectionChange(checked === true ? [...selection.selectedIds, entry.id] : selection.selectedIds.filter(id => id !== entry.id))} /></div>
                {entry.kind === "file" ? <FilePreview file={entry} variant="thumbnail" className="pk-document-card-preview" /> : <div className="pk-document-folder-preview" aria-hidden="true"><FolderIcon /><span>Folder</span></div>}
                <div className="pk-document-card-body"><ul className="pk-document-file-row" data-kind={entry.kind}><FileRow name={entry.name} fileType={entryType(entry)} {...(entry.kind === "file" && entry.sizeBytes !== undefined ? { sizeBytes: entry.sizeBytes } : {})} preview={entry.kind === "folder" ? <FolderIcon /> : undefined} /></ul>
                  {openButton(entry)}
                </div>
              </li>)}</ul></>}
        <Pagination page={query.pageIndex + 1} pageCount={pageCount} busy={unavailable || resetPending} onPageChange={page => onQueryChange({ ...query, pageIndex: page - 1 })} label="Document pages" />
      </div>}
  </section>;
}
