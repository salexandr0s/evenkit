import { createRoot } from "react-dom/client";
import { AdminShell, Badge, Button, DataTable, FolderIcon, Select, TextField, type DataTableColumn } from "@project-kit/ui";
import "@project-kit/tokens/css";
import "@project-kit/ui/css";

const element = document.getElementById("root");
if (!element) throw new Error("Missing fixture root.");
const records = [{ id: "one", name: "Independent consumer", members: 3 }];
const columns: readonly DataTableColumn<(typeof records)[number]>[] = [
  { id: "name", header: "Project", accessor: row => row.name },
  { id: "members", header: "Members", accessor: row => row.members, align: "end" },
];
createRoot(element).render(<main>
  <h1>Packed package check</h1>
  <Badge tone="success">Vite consumer</Badge>
  <TextField label="Project name" defaultValue="Independent consumer" />
  <Select aria-label="Visibility" name="visibility" defaultValue="private" options={[{ value: "private", label: "Private" }, { value: "team", label: "Team" }]} />
  <Button>Native button</Button>
  <AdminShell contentAs="section" brand="Package kit" header="Projects" activeItemId="projects" navigation={[{ items: [{ id: "projects", label: "Projects", href: "#projects", icon: <FolderIcon /> }] }]}>
    <DataTable caption="Packed projects" data={records} columns={columns} getRowId={row => row.id} />
  </AdminShell>
</main>);
