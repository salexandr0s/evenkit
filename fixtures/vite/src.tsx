import { createRoot } from "react-dom/client";
import { AdminShell, ArrowRightIcon, Badge, Button, ButtonLink, DataTable, FolderIcon, PlusIcon, Select, SelectField, TextareaField, TextField, type ButtonShape, type DataTableColumn, type SelectOptionGroup, type TextareaFieldProps } from "@project-kit/ui";
import "@project-kit/tokens/css";
import "@project-kit/ui/css";
import { PreviewAuth } from "./auth-preview";

const element = document.getElementById("root");
if (!element) throw new Error("Missing fixture root.");
const records = [{ id: "one", name: "Independent consumer", members: 3 }];
const iconShape: ButtonShape = "icon";
const notesProps: TextareaFieldProps = { label: "Notes", name: "notes", optional: true, hint: "Details for the team.", rows: 3 };
const templates: SelectOptionGroup = { id: "team", label: "Team templates", options: [{ value: "blank", label: "Blank project", description: "Start with an empty project." }] };
const columns: readonly DataTableColumn<(typeof records)[number]>[] = [
  { id: "name", header: "Project", accessor: row => row.name },
  { id: "members", header: "Members", accessor: row => row.members, align: "end" },
];
createRoot(element).render(<main>
  <h1>Packed package check</h1>
  <Badge tone="success">Vite consumer</Badge>
  <TextField label="Project name" defaultValue="Independent consumer" required startAdornment={<FolderIcon />} />
  <TextareaField {...notesProps} />
  <SelectField label="Project template" name="template" options={[templates]} defaultValue="blank" hint="Choose a starting point." required />
  <Select aria-label="Visibility" name="visibility" defaultValue="private" options={[{ value: "private", label: "Private" }, { value: "team", label: "Team" }]} />
  <Button>Native button</Button>
  <PreviewAuth />
  <Button shape={iconShape} aria-label="Create project"><PlusIcon /></Button>
  <Button fullWidth startIcon={<PlusIcon />}>Create project</Button>
  <ButtonLink href="#projects" endIcon={<ArrowRightIcon />}>View projects</ButtonLink>
  <AdminShell contentAs="section" brand="Package kit" header="Projects" activeItemId="projects" navigation={[{ items: [{ id: "projects", label: "Projects", href: "#projects", icon: <FolderIcon /> }] }]}>
    <DataTable caption="Packed projects" data={records} columns={columns} getRowId={row => row.id} />
  </AdminShell>
</main>);
