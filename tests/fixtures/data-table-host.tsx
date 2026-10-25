import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, DataTable, type DataTableColumn } from "@evenkit/ui";
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
        <Button onClick={() => { clearTimer(); setLoading(false); }}>Restore records</Button>
        <Button variant="outline">Outside control</Button>
      </div>
      <DataTable
        data={projects} columns={columns} getRowId={getRowId}
        caption="Host projects" searchLabel="Search host projects"
        initialPageSize={2} pageSizeOptions={pageSizes} loading={loading}
      />
    </main>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("The table host root is missing.");
createRoot(root).render(<DataTableHost />);
