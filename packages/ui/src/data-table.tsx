"use client";

import { useId, useMemo, type ReactNode } from "react";
import {
  columnFilteringFeature, createFilteredRowModel, createPaginatedRowModel, createSortedRowModel,
  filterFn_includesString, globalFilteringFeature, rowPaginationFeature, rowSelectionFeature,
  rowSortingFeature, sortFn_alphanumeric, sortFn_text, tableFeatures, useTable,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { EmptyState, Spinner } from "./feedback.js";
import { Input, Label } from "./field.js";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons.js";
import { Select } from "./select.js";

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

export interface DataTableColumn<T extends object> {
  id: string;
  header: string;
  /** Primitive value used for sorting, search, and the full cell title. */
  accessor: (row: T) => string | number;
  cell?: (row: T) => ReactNode;
  align?: "start" | "end";
  sortable?: boolean;
}

export interface DataTableSelection<T extends object> {
  selectedIds: readonly string[];
  onSelectionChange: (ids: readonly string[]) => void;
  getRowLabel?: (row: T) => string;
}

/** Client-side processing of the complete supplied dataset. Fetching stays in the host. */
export interface DataTableProps<T extends object> {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowId: (row: T) => string;
  caption: string;
  density?: "default" | "compact";
  searchable?: boolean;
  searchLabel?: string;
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
}

interface SelectionCheckboxProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (event: unknown) => void;
  disabled: boolean;
}

function SelectionCheckbox({ label, checked, indeterminate = false, onChange, disabled }: SelectionCheckboxProps) {
  return (
    <label className="pk-data-table-checkbox">
      <input
        type="checkbox" aria-label={label} checked={checked} disabled={disabled}
        aria-checked={indeterminate ? "mixed" : checked}
        ref={(element) => { if (element) element.indeterminate = indeterminate; }}
        onChange={onChange}
      />
    </label>
  );
}

export function DataTable<T extends object>({
  data, columns, getRowId, caption, density = "default", searchable = true,
  searchLabel = "Search records", initialPageSize = 10, pageSizeOptions = defaultPageSizes,
  selection, loading = false, error, onRetry, emptyTitle = "No records yet",
  emptyDescription = "Add a record to get started.", emptyAction, toolbar, className,
}: DataTableProps<T>) {
  const id = useId();
  const firstPageSize = Number.isInteger(initialPageSize) && initialPageSize > 0 ? initialPageSize : 10;
  const sizes = useMemo(() => [...new Set([firstPageSize, ...pageSizeOptions.filter((size) => Number.isInteger(size) && size > 0)])].sort((a, b) => a - b), [firstPageSize, pageSizeOptions]);
  const sizeOptions = useMemo(() => sizes.map((size) => ({ value: String(size), label: String(size) })), [sizes]);
  const engineColumns = useMemo(() => columns.map((column) => ({
    id: column.id, header: column.header, accessorFn: column.accessor,
    enableSorting: column.sortable !== false, sortDescFirst: false,
  })), [columns]);
  const selected = useMemo<RowSelectionState>(() => selection ? Object.fromEntries(selection.selectedIds.map((key) => [key, true])) : noSelection, [selection?.selectedIds]);
  const table = useTable({
    features, data, columns: engineColumns, getRowId,
    initialState: { pagination: { pageIndex: 0, pageSize: firstPageSize } },
    state: { rowSelection: selected },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(selected) : updater;
      selection?.onSelectionChange(Object.keys(next));
    },
    enableRowSelection: selection !== undefined,
    enableSubRowSelection: false,
    enableRowRangeSelection: false,
    enableMultiSort: false,
    autoResetPageIndex: true,
    globalFilterFn: "includesString",
  });
  const rows = table.getRowModel().rows;
  const total = table.getRowCount();
  const { pageIndex, pageSize } = table.state.pagination;
  const search = typeof table.state.globalFilter === "string" ? table.state.globalFilter : "";
  const hasError = error !== undefined && error !== null && error !== false;
  const unavailable = loading || hasError;
  const columnCount = columns.length + (selection ? 1 : 0);
  const resetSearch = () => { table.setGlobalFilter(""); table.firstPage(); };

  return (
    <div className={classes("pk-data-table", className)} data-density={density} aria-busy={loading || undefined}>
      {searchable || toolbar ? (
        <div className="pk-data-table-toolbar">
          {searchable ? <div className="pk-data-table-search"><Label htmlFor={`${id}-search`}>{searchLabel}</Label><Input id={`${id}-search`} type="search" controlSize="sm" value={search} disabled={unavailable} placeholder="Search…" onChange={(event) => { table.setGlobalFilter(event.target.value); table.firstPage(); }} /></div> : null}
          {toolbar ? <div className="pk-data-table-actions">{toolbar}</div> : null}
        </div>
      ) : null}
      <div className="pk-data-table-scroll" tabIndex={0} role="region" aria-label={`${caption} table`}>
        <table>
          <caption>{caption}</caption>
          <thead><tr>
            {selection ? <th scope="col" className="pk-data-table-selection"><SelectionCheckbox label="Select all rows on this page" checked={table.getIsAllPageRowsSelected()} indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} disabled={unavailable || rows.length === 0} /></th> : null}
            {columns.map((column) => {
              const engineColumn = table.getColumn(column.id);
              const sorted = engineColumn?.getIsSorted() ?? false;
              const sortable = engineColumn?.getCanSort() ?? false;
              const SortIcon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;
              return <th key={column.id} scope="col" data-align={column.align ?? "start"} aria-sort={sortable ? sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none" : undefined}>
                {sortable ? <button className="pk-data-table-sort" type="button" disabled={unavailable} aria-label={`Sort by ${column.header}`} onClick={() => { engineColumn?.toggleSorting(); table.firstPage(); }}><span>{column.header}</span><SortIcon size="sm" /></button> : column.header}
              </th>;
            })}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={columnCount}><div className="pk-data-table-state" role="status"><Spinner aria-hidden="true" />Loading records…</div></td></tr>
              : hasError ? <tr><td colSpan={columnCount}><div className="pk-data-table-state" role="alert"><p>{error}</p>{onRetry ? <Button size="sm" variant="outline" onClick={onRetry}>Try again</Button> : null}</div></td></tr>
                : rows.length === 0 ? <tr><td colSpan={columnCount}><EmptyState title={data.length === 0 ? emptyTitle : "No matching records"} description={data.length === 0 ? emptyDescription : "Try a different search or clear the current search."} action={data.length === 0 ? emptyAction : <Button size="sm" variant="outline" onClick={resetSearch}>Clear search</Button>} /></td></tr>
                  : rows.map((row) => <tr key={row.id} data-selected={row.getIsSelected() || undefined}>
                    {selection ? <td className="pk-data-table-selection"><SelectionCheckbox label={`Select ${selection.getRowLabel?.(row.original) ?? String(columns[0]?.accessor(row.original) ?? row.id)}`} checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} disabled={false} /></td> : null}
                    {columns.map((column) => <td key={column.id} data-align={column.align ?? "start"}><div className="pk-data-table-cell" title={String(column.accessor(row.original))}>{column.cell ? column.cell(row.original) : column.accessor(row.original)}</div></td>)}
                  </tr>)}
          </tbody>
        </table>
      </div>
      <div className="pk-data-table-footer">
        <p role="status">{unavailable ? "Records unavailable" : `${total} ${total === 1 ? "record" : "records"}${selection ? ` · ${selection.selectedIds.length} selected` : ""}`}</p>
        <div className="pk-data-table-pagination">
          <div className="pk-data-table-page-size"><Label htmlFor={`${id}-size`}>Rows per page</Label><Select id={`${id}-size`} controlSize="sm" value={String(pageSize)} options={sizeOptions} disabled={unavailable} onValueChange={(value) => { table.setPageSize(Number(value)); table.firstPage(); }} /></div>
          <span>Page {Math.min(pageIndex + 1, Math.max(1, table.getPageCount()))} of {Math.max(1, table.getPageCount())}</span>
          <Button size="sm" variant="outline" aria-label="Previous page" disabled={unavailable || !table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeftIcon size="sm" /></Button>
          <Button size="sm" variant="outline" aria-label="Next page" disabled={unavailable || !table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRightIcon size="sm" /></Button>
        </div>
      </div>
    </div>
  );
}
