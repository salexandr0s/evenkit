import { Badge, type DataTableColumn } from "@evenkit/ui";

export interface PreviewProject {
  id: string;
  name: string;
  owner: string;
  members: number;
  status: "Active" | "Draft" | "Review";
  updated: string;
}

/** Fictional, local records used only to demonstrate table behavior. */
export const projects: readonly PreviewProject[] = [
  { id: "project-01", name: "Spring launch", owner: "Maya Chen", members: 6, status: "Active", updated: "2026-10-24" },
  { id: "project-02", name: "Client portal", owner: "Leo Martin", members: 12, status: "Review", updated: "2026-10-23" },
  { id: "project-03", name: "Research library", owner: "Nora Patel", members: 4, status: "Draft", updated: "2026-10-22" },
  { id: "project-04", name: "Website refresh", owner: "Maya Chen", members: 2, status: "Active", updated: "2026-10-21" },
  { id: "project-05", name: "Team onboarding", owner: "Finn Reed", members: 8, status: "Active", updated: "2026-10-20" },
  { id: "project-06", name: "Content archive", owner: "Nora Patel", members: 10, status: "Review", updated: "2026-10-19" },
  { id: "project-07", name: "Partner directory", owner: "Leo Martin", members: 3, status: "Draft", updated: "2026-10-18" },
  { id: "project-08", name: "Autumn report", owner: "Finn Reed", members: 7, status: "Active", updated: "2026-10-17" },
  { id: "project-09", name: "Design review", owner: "Maya Chen", members: 5, status: "Review", updated: "2026-10-16" },
  { id: "project-10", name: "Data handbook", owner: "Nora Patel", members: 9, status: "Active", updated: "2026-10-15" },
  { id: "project-11", name: "Product notes", owner: "Leo Martin", members: 1, status: "Draft", updated: "2026-10-14" },
  { id: "project-12", name: "Release checklist", owner: "Finn Reed", members: 11, status: "Review", updated: "2026-10-13" }
];

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const projectColumns: readonly DataTableColumn<PreviewProject>[] = [
  { id: "name", header: "Project", accessor: (row) => row.name },
  { id: "owner", header: "Owner", accessor: (row) => row.owner },
  { id: "members", header: "Members", accessor: (row) => row.members, align: "end" },
  { id: "status", header: "Status", accessor: (row) => row.status, cell: (row) => <Badge tone={row.status === "Active" ? "success" : row.status === "Review" ? "warning" : "neutral"}>{row.status}</Badge> },
  { id: "updated", header: "Updated", accessor: (row) => row.updated, cell: (row) => dateFormat.format(new Date(row.updated)) }
];

export const getProjectId = (row: PreviewProject) => row.id;
