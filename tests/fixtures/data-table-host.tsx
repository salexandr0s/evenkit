import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Checkbox, DataTable, type DataTableColumn } from "@evenkit/ui";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

interface Project {
  id: string;
  name: string;
}

const projects: readonly Project[] = [
  { id: "alpha", name: "Alpha" },
  { id: "beta", name: "Beta" },
  { id: "gamma", name: "Gamma" },
];
const columns: readonly DataTableColumn<Project>[] = [
  { id: "name", header: "Project", accessor: project => project.name },
  {
    id: "actions", header: "Actions", accessor: project => project.id,
    sortable: false, searchable: false,
    cell: project => <Button size="sm" variant="outline" aria-label={`Open ${project.name}`}>Open</Button>,
  },
];
const getRowId = (project: Project) => project.id;
const pageSizes = [2, 3] as const;

function DataTableHost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoped, setScoped] = useState(false);
  const [selectedIds, setSelectedIds] = useState<readonly string[]>([]);
  const [actions, setActions] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }

  useEffect(() => clearTimer, []);

  return (
    <main>
      <h1>Data table host</h1>
      <div>
        <Button onClick={() => {
          clearTimer();
          timer.current = setTimeout(() => { timer.current = null; setLoading(true); }, 500);
        }}>Schedule loading</Button>
        <Button onClick={() => {
          clearTimer();
          timer.current = setTimeout(() => { timer.current = null; setError("Records could not be refreshed."); }, 500);
        }}>Schedule error</Button>
        <Button onClick={() => { clearTimer(); setLoading(false); setError(null); }}>Restore records</Button>
        <Button variant="outline">Outside control</Button>
        <Checkbox label="Use selection scope" checked={scoped} onCheckedChange={value => setScoped(value === true)} />
      </div>
      <DataTable
        data={projects} columns={columns} getRowId={getRowId}
        caption="Host projects" searchLabel="Search host projects"
        initialPageSize={2} pageSizeOptions={pageSizes} loading={loading} error={error}
        selection={{ selectedIds, onSelectionChange: setSelectedIds, getRowLabel: project => project.name,
          ...(scoped ? { scopeLabel: "Selected projects on all pages" } : {}),
          actions: <Button onClick={() => setActions(value => value + 1)}>Archive selected</Button>,
        }}
      />
      <output aria-label="Bulk requests">{actions}</output>
    </main>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("The table host root is missing.");
createRoot(root).render(<DataTableHost />);
