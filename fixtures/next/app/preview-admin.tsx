"use client";

import { AdminShell, DataTable, FolderIcon, type DataTableColumn } from "@project-kit/ui";

const records = [{ id: "one", name: "Independent consumer", members: 3 }];
const columns: readonly DataTableColumn<(typeof records)[number]>[] = [
  { id: "name", header: "Project", accessor: row => row.name },
  { id: "members", header: "Members", accessor: row => row.members, align: "end" },
];

export function PreviewAdmin() {
  return <AdminShell contentAs="section" brand="Package kit" header="Projects" activeItemId="projects" navigation={[{ items: [{ id: "projects", label: "Projects", href: "#projects", icon: <FolderIcon /> }] }]}>
    <DataTable caption="Packed projects" data={records} columns={columns} getRowId={row => row.id} />
  </AdminShell>;
}
