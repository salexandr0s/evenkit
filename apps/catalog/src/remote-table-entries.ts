import type { CatalogEntry } from "./catalog-types.js";
const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';

export const remoteTableEntries: readonly CatalogEntry[] = [
  { id: "remote-data-table", name: "Remote data table", group: "Compositions", inventoryIds: ["I08"], description: "Controlled server sorting, search, paging and totals, with cancellable requests, retry and selection across pages.", tags: ["table", "remote", "API", "server", "pagination", "loading", "retry", "selection", "I08"], source: "TanStack manual processing · original request adapter", sourceUrl: "https://tanstack.com/table/latest/docs/guide/pagination", usage: `${imports}
import { useState } from "react";
import { DataTable, useRemoteTable, useTableSelection, type DataTableQuery, type RemoteTableLoadContext, type RemoteTableResult } from "@evenkit/ui";

interface Project { id: string; name: string }
// Keep load stable with useCallback in your host. Parse the API response there.
export function ProjectDirectory({ load }: {
  load: (query: DataTableQuery, context: RemoteTableLoadContext) => Promise<RemoteTableResult<Project>>;
}) {
  const [query, setQuery] = useState<DataTableQuery>({ pageIndex: 0, pageSize: 10, search: "", sort: null });
  const result = useRemoteTable({ query, load });
  const selection = useTableSelection(query.search);
  return <DataTable data={result.data} getRowId={row => row.id} caption="Projects"
    columns={[{ id: "name", header: "Project", accessor: row => row.name, hideable: false }]}
    remote={{ query, total: result.total, onQueryChange: setQuery }}
    loading={result.loading} error={result.error} onRetry={result.retry}
    selection={{ ...selection, scopeLabel: "Records across pages of this search" }} />;
}
` },
  { id: "sort-control", name: "Sort control", group: "Controls", inventoryIds: ["I04"], description: "Choose a sort field and direction for a table or list, and return to its default order.", tags: ["sort", "ascending", "descending", "list", "field", "I04"], source: "Original kit composition · Select", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/select", usage: `${imports}
import { useState } from "react";
import { SortControl, type TableSort } from "@evenkit/ui";

export function ProjectSort() {
  const [sort, setSort] = useState<TableSort | null>(null);
  return <SortControl fields={[{ id: "name", label: "Project name" }, { id: "updated", label: "Last updated" }]}
    value={sort} onValueChange={setSort} />;
}
` },
  { id: "bulk-actions", name: "Bulk action bar", group: "Compositions", inventoryIds: ["I05"], description: "Show how many records are selected, explain the selection scope, and offer actions or clear the selection.", tags: ["bulk", "selection", "actions", "scope", "count", "I05"], source: "Original kit composition · native controls", sourceUrl: "https://tanstack.com/table/latest/docs/guide/row-selection", usage: `${imports}
import { BulkActionBar, Button } from "@evenkit/ui";

export function SelectedProjects({ ids, pending, onReview, onClear }: {
  ids: readonly string[]; pending: boolean; onReview: (ids: readonly string[]) => void; onClear: () => void;
}) {
  // Restore focus to a stable control when an action removes this bar.
  return <BulkActionBar count={ids.length} scopeLabel="Records across pages of this search"
    disabled={pending} onClear={onClear}>
    <Button size="sm" onClick={() => onReview(ids)}>Mark for review</Button>
  </BulkActionBar>;
}
` },
  { id: "column-settings", name: "Column settings", group: "Controls", inventoryIds: ["I06"], description: "Choose visible columns and row spacing while keeping required identifying columns available.", tags: ["table", "columns", "visibility", "density", "settings", "I06"], source: "Original kit composition · Popover and Checkbox", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/popover", usage: `${imports}
import { useState } from "react";
import { ColumnSettings } from "@evenkit/ui";

export function ProjectDisplaySettings() {
  const [hiddenIds, setHiddenIds] = useState<readonly string[]>([]);
  const [density, setDensity] = useState<"default" | "compact">("default");
  // Pass hiddenIds as DataTable.hiddenColumnIds and density as DataTable.density.
  // Persistence belongs to your application, scoped to the user and table.
  return <ColumnSettings columns={[{ id: "name", label: "Project", required: true }, { id: "owner", label: "Owner" }]}
    hiddenIds={hiddenIds} onHiddenIdsChange={setHiddenIds}
    density={density} onDensityChange={setDensity} />;
}
` },
];
