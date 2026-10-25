"use client";

import { AdminShell, Button, DataTable, FolderIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, UserIcon, type AdminSidebarState, type DataTableColumn } from "@project-kit/ui";

const records = [{ id: "one", name: "Independent consumer", members: 3 }];
const columns: readonly DataTableColumn<(typeof records)[number]>[] = [
  { id: "name", header: "Project", accessor: row => row.name },
  { id: "members", header: "Members", accessor: row => row.members, align: "end" },
];

export function PreviewAdmin() {
  const sidebar: AdminSidebarState = "collapsed";
  return <AdminShell defaultSidebarState={sidebar} compactBrand={<FolderIcon />} contentAs="section" brand="Package kit" header="Projects" activeItemId="projects" navigation={[{ items: [{ id: "projects", label: "Projects", href: "#projects", icon: <FolderIcon /> }] }]}>
    <TooltipProvider><Tooltip><TooltipTrigger asChild><Button shape="icon" aria-label="Profile"><UserIcon /></Button></TooltipTrigger><TooltipContent>Open profile</TooltipContent></Tooltip></TooltipProvider>
    <DataTable caption="Packed projects" data={records} columns={columns} getRowId={row => row.id} />
  </AdminShell>;
}
