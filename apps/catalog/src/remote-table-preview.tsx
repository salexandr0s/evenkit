import { useCallback, useRef, useState } from "react";
import { ActionMessage, Badge, BulkActionBar, Button, ColumnSettings, DataTable, SortControl, useRemoteTable, useTableSelection, type DataTableColumn, type DataTableQuery, type RemoteTableLoadContext, type TableSort } from "@evenkit/ui";
import "./remote-table-preview.css";

interface Project { id: string; name: string; owner: string; budget: number; status: string }
const initialProjects: readonly Project[] = [
  { id: "meridian", name: "Meridian release", owner: "Alex Morgan", budget: 12400, status: "Active" },
  { id: "aster", name: "Aster research", owner: "Sam Rivera", budget: 8600, status: "Draft" },
  { id: "cedar", name: "Cedar handover", owner: "Alex Morgan", budget: 5200, status: "Active" },
  { id: "delta", name: "Delta review", owner: "Nora Patel", budget: 3100, status: "Draft" },
  { id: "beacon", name: "Beacon workshop", owner: "Sam Rivera", budget: 7400, status: "Active" },
  { id: "atlas", name: "Atlas discovery", owner: "Nora Patel", budget: 9200, status: "Active" },
  { id: "birch", name: "Birch migration", owner: "Alex Morgan", budget: 18400, status: "Draft" },
  { id: "ember", name: "Ember rollout", owner: "Sam Rivera", budget: 6100, status: "Active" },
  { id: "grove", name: "Grove planning", owner: "Nora Patel", budget: 4300, status: "Draft" },
  { id: "iris", name: "Iris onboarding", owner: "Alex Morgan", budget: 1200, status: "Active" },
  { id: "juniper", name: "Juniper documentation", owner: "Sam Rivera", budget: 2800, status: "Active" },
  { id: "maple", name: "Maple accessibility review", owner: "Nora Patel", budget: 6500, status: "Draft" },
];
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const columns: readonly DataTableColumn<Project>[] = [
  { id: "name", header: "Project", accessor: row => row.name, overflow: "wrap", hideable: false },
  { id: "owner", header: "Owner", accessor: row => row.owner },
  { id: "budget", header: "Budget", accessor: row => row.budget, align: "end", cell: row => money.format(row.budget) },
  { id: "status", header: "Status", accessor: row => row.status, cell: row => <Badge size="sm" tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge> },
];
const initialQuery: DataTableQuery = { pageIndex: 0, pageSize: 5, search: "", sort: null };
const settings = columns.map(column => ({ id: column.id, label: column.header, required: column.hideable === false }));
const sortFields = columns.map(column => ({ id: column.id, label: column.header }));

function RemoteExample() {
  const [query, setQuery] = useState<DataTableQuery>(initialQuery);
  const [projects, setProjects] = useState(initialProjects);
  const [hiddenIds, setHiddenIds] = useState<readonly string[]>([]);
  const [density, setDensity] = useState<"default" | "compact">("default");
  const [message, setMessage] = useState("");
  const failNext = useRef(false);
  const retryRef = useRef<HTMLButtonElement>(null);
  const selection = useTableSelection(query.search);
  const load = useCallback(async (requested: DataTableQuery, { signal }: RemoteTableLoadContext) => {
    const shouldFail = failNext.current;
    failNext.current = false;
    // Deliberately finish superseded requests: the adapter also guards loaders that ignore abort.
    await new Promise(resolve => window.setTimeout(resolve, requested.search === "mer" ? 700 : 180));
    if (shouldFail && !signal.aborted) throw new Error("The sample request failed. Retry the same query.");
    const filtered = projects.filter(project => `${project.name} ${project.owner} ${project.status}`.toLowerCase().includes(requested.search.toLowerCase()));
    const sort = requested.sort;
    if (sort) {
      const column = columns.find(item => item.id === sort.id);
      if (column) filtered.sort((a, b) => {
        const left = column.accessor(a); const right = column.accessor(b);
        const comparison = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
        return sort.direction === "asc" ? comparison : -comparison;
      });
    }
    return { data: filtered.slice(requested.pageIndex * requested.pageSize, (requested.pageIndex + 1) * requested.pageSize), total: filtered.length };
  }, [projects]);
  const result = useRemoteTable({ query, load });
  return <div className="remote-table-preview">
    <div className="remote-table-preview-heading"><h3>Project directory</h3><p>Browse twelve sample projects through an asynchronous page loader.</p></div>
    <DataTable data={result.data} columns={columns} getRowId={row => row.id} caption="Remote projects" searchLabel="Search remote projects"
      remote={{ query, total: result.total, onQueryChange: setQuery }} loading={result.loading} error={result.error} onRetry={result.retry}
      initialPageSize={5} pageSizeOptions={[5, 10]} hiddenColumnIds={hiddenIds} density={density}
      selection={{ ...selection, getRowLabel: row => row.name, scopeLabel: "Records across pages of this search", actions: <Button size="sm" variant="outline" onClick={() => {
        const ids = selection.selectedIds;
        retryRef.current?.focus();
        setProjects(current => current.filter(row => !ids.includes(row.id)));
        selection.onSelectionChange([]);
        setMessage(`${ids.length} selected ${ids.length === 1 ? "project" : "projects"} archived.`);
      }}>Archive selected</Button> }}
      toolbar={<><SortControl fields={sortFields} value={query.sort} onValueChange={sort => setQuery(current => ({ ...current, sort, pageIndex: 0 }))} /><ColumnSettings columns={settings} hiddenIds={hiddenIds} onHiddenIdsChange={setHiddenIds} density={density} onDensityChange={setDensity} /></>} />
    <p role="status" aria-label="Bulk action result" className="remote-table-preview-note">{message}</p>
    <section className="remote-table-preview-options"><h3>Preview options</h3><div><Button ref={retryRef} variant="outline" size="sm" onClick={() => { failNext.current = true; result.retry(); }}>Fail next request</Button><Button variant="ghost" size="sm" onClick={() => { failNext.current = false; setProjects(initialProjects); setQuery(initialQuery); selection.onSelectionChange([]); setMessage(""); result.retry(); }}>Reset directory</Button></div><p>Selection survives pagination and sorting. Changing the search clears it. Requests stay local to this preview.</p></section>
  </div>;
}

function SortExample() {
  const [sort, setSort] = useState<TableSort | null>({ id: "name", direction: "asc" });
  const sorted = [...initialProjects.slice(0, 3)].sort((a, b) => {
    if (!sort) return 0;
    const result = sort.id === "budget" ? a.budget - b.budget : a.name.localeCompare(b.name);
    return sort.direction === "asc" ? result : -result;
  });
  return <div className="remote-table-preview"><SortControl label="Sort projects" fields={[{ id: "name", label: "Project name" }, { id: "budget", label: "Budget" }]} value={sort} onValueChange={setSort} />
    <ul className="remote-table-preview-list">{sorted.map(project => <li key={project.id}><strong>{project.name}</strong><span>{money.format(project.budget)}</span></li>)}</ul>
  </div>;
}

function BulkExample() {
  const [count, setCount] = useState(3);
  const [message, setMessage] = useState("");
  const resetRef = useRef<HTMLButtonElement>(null);
  return <div className="remote-table-preview"><BulkActionBar count={count} scopeLabel="Records across all pages of this search" onClear={() => { resetRef.current?.focus(); setCount(0); }}><Button size="sm" onClick={() => { resetRef.current?.focus(); setMessage(`${count} selected records marked for review.`); setCount(0); }}>Mark for review</Button></BulkActionBar>
    {message ? <ActionMessage>{message}</ActionMessage> : null}<Button ref={resetRef} variant="outline" onClick={() => { setCount(3); setMessage(""); }}>Select sample records</Button></div>;
}

export function RemoteTablePreview({ id }: { id: string }) {
  if (id === "sort-control") return <SortExample />;
  if (id === "bulk-actions") return <BulkExample />;
  return <RemoteExample />;
}
