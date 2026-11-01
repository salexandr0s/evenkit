"use client";

import { useId, useLayoutEffect, useMemo, useRef, type FocusEvent, type ReactNode } from "react";
import {
  columnFilteringFeature, createFilteredRowModel, createPaginatedRowModel, createSortedRowModel,
  filterFn_includesString, globalFilteringFeature, rowPaginationFeature, rowSelectionFeature,
  rowSortingFeature, sortFn_alphanumeric, sortFn_text, tableFeatures, useTable,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { DataTableCell } from "./data-table-cell.js";
import { EmptyState, Spinner } from "./feedback.js";
import { Input, Label } from "./field.js";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, CircleAlertIcon, InboxIcon, SearchIcon, XIcon } from "./icons.js";
import { Pagination } from "./navigation.js";
import { Checkbox } from "./selection-controls.js";
import { Select } from "./select.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";
import { BulkActionBar } from "./table-controls.js";
import type { DataTableRemote } from "./remote-table.js";

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
});
const defaultPageSizes = [10, 25, 50] as const;
const noSelection: RowSelectionState = {};

export type DataTableCellOverflow = "truncate" | "wrap";

export interface DataTableColumn<T extends object> {
  id: string;
  header: string;
  /** Primitive value used for sorting, search, and default cell rendering. */
  accessor: (row: T) => string | number;
  cell?: (row: T) => ReactNode;
  align?: "start" | "end";
  sortable?: boolean;
  searchable?: boolean;
  /** Set false for identifying columns that must remain visible. */
  hideable?: boolean;
  /** Applies to primitive accessor cells. Custom cell renderers own their content. */
  overflow?: DataTableCellOverflow;
}

export interface DataTableSelection<T extends object> {
  selectedIds: readonly string[];
  onSelectionChange: (ids: readonly string[]) => void;
  getRowLabel?: (row: T) => string;
  actions?: ReactNode;
  /** Supplying a scope label uses the reusable bulk bar. Selection always contains explicit IDs. */
  scopeLabel?: string;
}

/** Client processing by default. In remote mode the host supplies an already processed page. */
export interface DataTableProps<T extends object> {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowId: (row: T) => string;
  caption: string;
  density?: "default" | "compact";
  searchable?: boolean;
  searchLabel?: string;
  /** External search controls can clear their query and restore focus here. */
  onClearSearch?: () => void;
  initialPageSize?: number;
  pageSizeOptions?: readonly number[];
  selection?: DataTableSelection<T>;
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  emptyAction?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
  remote?: DataTableRemote;
  hiddenColumnIds?: readonly string[];
}

export function DataTable<T extends object>({
  data, columns, getRowId, caption, density = "default", searchable = true,
  searchLabel = "Search records", onClearSearch, initialPageSize = 10, pageSizeOptions = defaultPageSizes,
  selection, loading = false, error, onRetry, emptyTitle = "No records yet",
  emptyDescription = "Add a record to get started.", emptyAction, toolbar, className, remote, hiddenColumnIds,
}: DataTableProps<T>) {
  const id = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const pageSizeRef = useRef<HTMLButtonElement>(null);
  const focusedControlRef = useRef<HTMLElement | null>(null);
  const focusedPageSizePopupRef = useRef(false);
  const visibleColumns = useMemo(() => {
    const visible = columns.filter(column => column.hideable === false || !hiddenColumnIds?.includes(column.id));
    return visible.length > 0 ? visible : columns.slice(0, 1);
  }, [columns, hiddenColumnIds]);
  const requestedPageSize = remote?.query.pageSize ?? initialPageSize;
  const firstPageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0 ? requestedPageSize : 10;
  const sizes = useMemo(() => [...new Set([firstPageSize, ...pageSizeOptions.filter((size) => Number.isInteger(size) && size > 0)])].sort((a, b) => a - b), [firstPageSize, pageSizeOptions]);
  const sizeOptions = useMemo(() => sizes.map((size) => ({ value: String(size), label: String(size) })), [sizes]);
  const engineColumns = useMemo(() => columns.map((column) => ({
    id: column.id, header: column.header, accessorFn: column.accessor,
    enableSorting: column.sortable !== false, enableGlobalFilter: column.searchable !== false, sortDescFirst: false,
  })), [columns]);
  const selected = useMemo<RowSelectionState>(() => selection ? Object.fromEntries(selection.selectedIds.map((key) => [key, true])) : noSelection, [selection?.selectedIds]);
  const table = useTable({
    features, data, columns: engineColumns, getRowId,
    initialState: { pagination: { pageIndex: 0, pageSize: firstPageSize } },
    state: { rowSelection: selected, ...(remote ? { pagination: { pageIndex: remote.query.pageIndex, pageSize: remote.query.pageSize }, globalFilter: remote.query.search, sorting: remote.query.sort ? [{ id: remote.query.sort.id, desc: remote.query.sort.direction === "desc" }] : [] } : {}) },
    ...(remote ? {
      manualPagination: true, manualSorting: true, manualFiltering: true, rowCount: remote.total,
    } : {}),
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(selected) : updater;
      selection?.onSelectionChange(Object.keys(next).filter((key) => next[key]));
    },
    enableRowSelection: selection !== undefined,
    enableSubRowSelection: false,
    enableRowRangeSelection: false,
    enableMultiSort: false,
    autoResetPageIndex: remote === undefined,
    globalFilterFn: "includesString",
  });
  const rows = table.getRowModel().rows;
  const total = table.getRowCount();
  const { pageIndex, pageSize } = table.state.pagination;
  const search = typeof table.state.globalFilter === "string" ? table.state.globalFilter : "";
  const hasError = error !== undefined && error !== null && error !== false;
  const unavailable = loading || hasError;
  const filteredEmpty = remote ? search.length > 0 : data.length > 0;
  // TanStack resets an out-of-range page after a dataset change. Do not briefly
  // report no matches or an impossible range before that reset completes.
  const lastPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  const pageResetPending = !unavailable && (remote ? pageIndex > lastPage : total > 0 && rows.length === 0);
  const controlsDisabled = unavailable || pageResetPending;
  const selectedCount = Object.keys(selected).length;
  const columnCount = visibleColumns.length + (selection ? 1 : 0);
  function changeSearch(value: string) {
    if (remote) remote.onQueryChange({ ...remote.query, search: value, pageIndex: 0 });
    else { table.setGlobalFilter(value); table.firstPage(); }
  }
  const resetSearch = () => { if (onClearSearch) { onClearSearch(); return; } searchRef.current?.focus(); changeSearch(""); };
  useLayoutEffect(() => {
    if (!remote || unavailable) return;
    if (remote.query.pageIndex > lastPage) remote.onQueryChange({ ...remote.query, pageIndex: lastPage });
  }, [remote, unavailable, lastPage]);
  const range = total === 0 ? "0 records" : `${pageIndex * pageSize + 1}–${pageIndex * pageSize + rows.length} of ${total} ${total === 1 ? "record" : "records"}`;
  const status = loading ? "Loading records…" : hasError ? "Records unavailable" : pageResetPending ? "Updating records…" : `${range}${selection ? ` · ${selectedCount} selected` : ""}`;

  function trackFocus(event: FocusEvent<HTMLDivElement>) {
    const target = event.target;
    const popupId = pageSizeRef.current?.getAttribute("aria-controls");
    const inPageSizePopup = popupId ? document.getElementById(popupId)?.contains(target) === true : false;
    const owned = inPageSizePopup || searchAreaRef.current?.contains(target) || scrollRef.current?.contains(target) || paginationRef.current?.contains(target) || target.closest(".pk-data-table-selection-actions, .pk-bulk-action-bar") !== null;
    focusedControlRef.current = owned ? target : null;
    focusedPageSizePopupRef.current = inPageSizePopup;
  }

  function releaseFocus(event: FocusEvent<HTMLDivElement>) {
    const target = focusedControlRef.current;
    const closingPopup = focusedPageSizePopupRef.current && pageSizeRef.current?.disabled;
    if (event.relatedTarget !== null || (target?.isConnected && !target.matches(":disabled") && !closingPopup)) {
      focusedControlRef.current = null;
      focusedPageSizePopupRef.current = false;
    }
  }

  // Host updates can remove a focused column without changing availability.
  useLayoutEffect(() => {
    const previous = focusedControlRef.current;
    if (!previous) return;
    function recoverFocus() {
      if (focusedControlRef.current !== previous) return true;
      if (previous?.isConnected && !previous.matches(":disabled")) return false;
      if (document.activeElement === document.body || document.activeElement === previous) scrollRef.current?.focus();
      focusedControlRef.current = null;
      focusedPageSizePopupRef.current = false;
      return true;
    }
    if (recoverFocus() || !controlsDisabled || !focusedPageSizePopupRef.current) return;
    // Select closes its portal after the disabled trigger commits. Watch only
    // that transition so a removed option cannot leave focus on the document.
    const observer = new MutationObserver(() => { if (recoverFocus()) observer.disconnect(); });
    observer.observe(previous.ownerDocument.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  });

  return (
    <TooltipProvider><div className={classes("pk-data-table", className)} data-density={density} data-remote={remote ? true : undefined} onFocusCapture={trackFocus} onBlurCapture={releaseFocus}>
      {searchable || toolbar ? (
        <div className="pk-data-table-toolbar">
          {searchable ? <div ref={searchAreaRef} className="pk-data-table-search"><Label htmlFor={`${id}-search`}>{searchLabel}</Label><Input ref={searchRef} id={`${id}-search`} type="search" controlSize="sm" value={search} disabled={!remote && controlsDisabled} placeholder="Search…" startAdornment={<SearchIcon size="sm" />} endAdornment={search && (remote || rows.length > 0) ? <Tooltip><TooltipTrigger asChild><Button size="sm" shape="icon" variant="ghost" aria-label="Clear search" disabled={!remote && controlsDisabled} onClick={resetSearch}><XIcon size="sm" /></Button></TooltipTrigger><TooltipContent>Clear search</TooltipContent></Tooltip> : undefined} onChange={(event) => changeSearch(event.target.value)} /></div> : null}
          {toolbar ? <div className="pk-data-table-actions">{toolbar}</div> : null}
        </div>
      ) : null}
      {selection && selectedCount > 0 ? selection.scopeLabel ? <BulkActionBar count={selectedCount} scopeLabel={selection.scopeLabel} disabled={controlsDisabled} onClear={() => { scrollRef.current?.focus(); selection.onSelectionChange([]); }}>{selection.actions}</BulkActionBar> : <div className="pk-data-table-selection-bar" role="group" aria-label="Selected records"><p>{selectedCount} selected</p><fieldset className="pk-data-table-selection-actions" aria-label="Bulk actions" disabled={controlsDisabled}>{selection.actions}<Tooltip><TooltipTrigger asChild><Button size="xs" variant="ghost" shape="icon" aria-label="Clear selection" data-table-control="clear-selection" disabled={controlsDisabled} onClick={() => { scrollRef.current?.focus(); selection.onSelectionChange([]); }}><XIcon size="sm" /></Button></TooltipTrigger><TooltipContent>Clear selection</TooltipContent></Tooltip></fieldset></div> : null}
      <div ref={scrollRef} className="pk-data-table-scroll" tabIndex={0} role="region" aria-label={`${caption} table`} aria-busy={loading || undefined}>
        <table>
          <caption>{caption}</caption>
          <thead><tr>
            {selection ? <th scope="col" className="pk-data-table-selection"><Checkbox className="pk-data-table-checkbox" aria-label="Select all rows on this page" checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false} onCheckedChange={checked => table.toggleAllPageRowsSelected(checked === true)} disabled={controlsDisabled || rows.length === 0} /></th> : null}
            {visibleColumns.map((column) => {
              const engineColumn = table.getColumn(column.id);
              const sorted = engineColumn?.getIsSorted() ?? false;
              const sortable = engineColumn?.getCanSort() ?? false;
              const SortIcon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;
              return <th key={column.id} scope="col" data-align={column.align ?? "start"} aria-sort={sortable ? sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none" : undefined}>
                {sortable ? <button className="pk-data-table-sort" type="button" disabled={controlsDisabled} aria-label={`Sort by ${column.header}`} onClick={() => {
                  if (remote) remote.onQueryChange({ ...remote.query, pageIndex: 0, sort: sorted === "asc" ? { id: column.id, direction: "desc" } : sorted === "desc" ? null : { id: column.id, direction: "asc" } });
                  else { engineColumn?.toggleSorting(); table.firstPage(); }
                }}><span>{column.header}</span><SortIcon size="sm" /></button> : column.header}
              </th>;
            })}
          </tr></thead>
          <tbody>
            {loading || pageResetPending ? <tr><td colSpan={columnCount}><div className="pk-data-table-state" aria-hidden="true"><Spinner aria-hidden="true" />{loading ? "Loading records…" : "Updating records…"}</div></td></tr>
              : hasError ? <tr><td colSpan={columnCount}><div role="alert"><EmptyState size="sm" icon={<CircleAlertIcon />} title="Records could not be loaded" description={error} action={onRetry ? <Button size="sm" variant="outline" onClick={() => { scrollRef.current?.focus(); onRetry(); }}>Try again</Button> : undefined} /></div></td></tr>
                : total === 0 ? <tr><td colSpan={columnCount}><EmptyState size="sm" icon={filteredEmpty ? <SearchIcon /> : <InboxIcon />} title={filteredEmpty ? "No matching records" : emptyTitle} description={filteredEmpty ? "Try a different search or clear the current search." : emptyDescription} action={filteredEmpty ? <Button size="sm" variant="outline" onClick={resetSearch}>Clear search</Button> : emptyAction} /></td></tr>
                  : rows.map((row) => <tr key={row.id} data-selected={row.getIsSelected() || undefined}>
                    {selection ? <td className="pk-data-table-selection"><Checkbox className="pk-data-table-checkbox" aria-label={`Select ${selection.getRowLabel?.(row.original) ?? String(columns[0]?.accessor(row.original) ?? row.id)}`} checked={row.getIsSelected()} onCheckedChange={checked => row.toggleSelected(checked === true)} /></td> : null}
                    {visibleColumns.map((column) => <td key={column.id} data-align={column.align ?? "start"}>{column.cell ? <div className="pk-data-table-cell" data-overflow="custom">{column.cell(row.original)}</div> : <DataTableCell value={column.accessor(row.original)} overflow={column.overflow ?? "truncate"} />}</td>)}
                  </tr>)}
          </tbody>
        </table>
      </div>
      <div className="pk-data-table-footer">
        <p role="status" aria-atomic="true">{status}</p>
        <div ref={paginationRef} className="pk-data-table-pagination">
          <div className="pk-data-table-page-size"><Label htmlFor={`${id}-size`}>Rows per page</Label><Select ref={pageSizeRef} id={`${id}-size`} controlSize="sm" value={String(pageSize)} options={sizeOptions} disabled={controlsDisabled} onValueChange={(value) => { if (remote) remote.onQueryChange({ ...remote.query, pageSize: Number(value), pageIndex: 0 }); else { table.setPageSize(Number(value)); table.firstPage(); } }} /></div>
          <span>{unavailable ? "Page unavailable" : pageResetPending ? "Updating page" : `Page ${Math.min(pageIndex + 1, Math.max(1, table.getPageCount()))} of ${Math.max(1, table.getPageCount())}`}</span>
          <Pagination compact showStatus={false} page={pageIndex + 1} pageCount={Math.max(1, table.getPageCount())} disabled={controlsDisabled}
            onPageChange={page => { if (remote) remote.onQueryChange({ ...remote.query, pageIndex: page - 1 }); else table.setPageIndex(page - 1); }} />
        </div>
      </div>
    </div></TooltipProvider>
  );
}
