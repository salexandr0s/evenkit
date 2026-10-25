# Remote tables and display controls

`DataTable` processes the full supplied dataset by default. Its optional `remote` prop switches sorting, filtering and pagination to manual mode. Supply one page in `data`; `remote.total` is the exact matching count before pagination. The table preserves the server's order and never sorts, filters or slices that page again.

## Query and fetching

`DataTableQuery` contains zero-based `pageIndex`, positive integer `pageSize`, `search`, and a nullable `{ id, direction: "asc" | "desc" }` sort. `remote.onQueryChange` receives the complete next query. Search, sort and page-size changes reset the page in the same callback. If a successful response reports fewer pages after deletion, the table requests the last remaining page.

`useRemoteTable({ query, load, contextKey })` is an optional request adapter. Memoize `load` with `useCallback`, and validate your endpoint's response in it. The loader receives an `AbortSignal` and returns `{ data, total }`. The adapter rejects negative/noninteger totals and pages larger than their page size or total. Its effect lifetime guard also ignores completions from loaders that do not honor cancellation. Retry starts a fresh attempt for the same query. Unmounting aborts the request.

Include external filters, workspace/account identity and permission context in `contextKey`. Requests for a previous context cannot update the new view. Loading hides old rows and their count, so they are never described as results for a newer query. Search stays editable while fetching or after a failure; paging and row selection wait for the new response. Pass the adapter's `loading`, `error` and `retry` to `DataTable`. Applications with an existing query library can supply the same table props directly instead.

The table requires exact totals. Cursor pagination, unknown totals and automatic selection of every matching server record are outside this API. Those contracts need separate endpoint support.

When `searchable={false}` uses an external search field, pass `onClearSearch` to
clear the controlled query and focus that field. The filtered-empty recovery
button calls this callback; without it, the table clears its own search as before.

## Selection and bulk actions

Selection always consists of explicit stable row IDs. The header checkbox selects the loaded page. Existing IDs from other pages remain selected. `useTableSelection(scopeKey)` clears IDs when the scope changes, including when returning to an earlier scope. Use a key containing the active search, filters, workspace and permission context; omit page/sort when they do not change membership. Remove deleted or newly inaccessible IDs in your application.

Set `selection.scopeLabel` to use `BulkActionBar` inside the table. Describe the same selection scope your action consumes, for example “Selected IDs across pages of this search.” A standalone `BulkActionBar` accepts `count`, `scopeLabel`, `onClear`, `disabled`, and action children. Use native buttons for actions so the disabled fieldset blocks them while pending. The host owns confirmation, authorization, partial success, and focus restoration after an action removes the bar. Do not describe explicit selected IDs as “all matching records.”

## Sorting and display settings

`SortControl` combines a labeled field and direction. Its nullable `TableSort` value also works outside a table. Clearing the sort restores focus to the field control. Apply the resulting sort to your query and reset its page together.

`ColumnSettings` controls `hiddenIds` and `density`. Pass these to `DataTable.hiddenColumnIds` and `DataTable.density`. Mark required identifying columns with `ColumnSetting.required` and the corresponding `DataTableColumn.hideable: false`. The settings UI prevents hiding the final visible column; the table also retains its first column if a persisted list would hide everything. Hiding a column does not silently remove an active sort on that column.

Persist display settings in the host under a user-and-table key. Reconcile stored IDs with your current column definitions. Column visibility does not remove data from the server response and is not an authorization boundary.

## Catalog and checks

The remote directory uses a delayed local loader over twelve fictional records. Search, sorting and paging happen inside that loader. Selection spans pages, archive removes only explicit IDs, a failed request can be retried, and one slow search deliberately ignores cancellation to exercise stale-response protection. The sort and bulk entries also have standalone examples. The column-settings entry shares the complete directory.

Browser coverage checks server paging/sorting, selection scope and last-page recovery, stale responses and retry, and required columns/density. Existing client-table journeys remain applicable to the unchanged default mode.
