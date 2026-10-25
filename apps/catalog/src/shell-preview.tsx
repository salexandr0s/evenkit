import { useState, type MouseEvent } from "react";
import {
  ActionMessage, AdminShell, Badge, Button, DataTable, FolderIcon, LayoutDashboardIcon,
  SettingsIcon, UserIcon, UsersIcon, type AdminLinkProps, type AdminNavGroup, type AdminSidebarState
} from "@evenkit/ui";
import { getProjectId, projectColumns, projects } from "./project-data";

const owners = [...new Set(projects.map((project) => project.owner))];
const navigation: readonly AdminNavGroup[] = [
  { label: "Workspace", items: [
    { id: "overview", label: "Overview", href: "#admin-overview", icon: <LayoutDashboardIcon /> },
    { id: "projects", label: "Projects", href: "#admin-projects", icon: <FolderIcon />, end: <Badge>{projects.length}</Badge> },
    { id: "team", label: "Team", href: "#admin-team", icon: <UsersIcon />, end: <Badge>{owners.length}</Badge> }
  ] },
  { label: "Manage", items: [{ id: "settings", label: "Settings", href: "#admin-settings", icon: <SettingsIcon /> }] }
];
const items = navigation.flatMap((group) => group.items);

export function ShellPreview() {
  const [activeId, setActiveId] = useState("overview");
  const [sidebarState, setSidebarState] = useState<AdminSidebarState>("expanded");
  const active = items.find((item) => item.id === activeId) ?? items[0];

  function renderLink(props: AdminLinkProps) {
    function navigate(event: MouseEvent<HTMLAnchorElement>) {
      props.onClick?.(event);
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const next = items.find((item) => item.href === props.href);
      if (next) setActiveId(next.id);
    }
    return <a {...props} onClick={navigate} />;
  }

  return (
    <div className="catalog-admin-preview">
      <AdminShell
        brand={<span className="catalog-demo-brand"><LayoutDashboardIcon /><strong>Demo workspace</strong></span>}
        compactBrand={<><LayoutDashboardIcon /><span className="pk-admin-visually-hidden">Demo workspace</span></>}
        sidebarState={sidebarState}
        onSidebarStateChange={setSidebarState}
        navigation={navigation}
        activeItemId={activeId}
        header={<strong>{active?.label ?? "Overview"}</strong>}
        actions={activeId !== "projects" ? <Button size="sm" variant="outline" onClick={() => setActiveId("projects")}><FolderIcon />View projects</Button> : <Badge tone="accent">Local data</Badge>}
        footer={<span className="catalog-caption">Fictional records · local preview</span>}
        contentAs="section"
        contentId="admin-preview-content"
        navLabel="Demo workspace navigation"
        renderLink={renderLink}
      >
        {activeId === "overview" && <div className="catalog-shell-page">
          <div><h3>Workspace overview</h3><p className="catalog-caption">A small operations workspace using shared navigation and controls.</p></div>
          <div className="catalog-summary-grid">
            <div><span>Projects</span><strong>{projects.length}</strong></div>
            <div><span>Active</span><strong>{projects.filter((project) => project.status === "Active").length}</strong></div>
            <div><span>Needs review</span><strong>{projects.filter((project) => project.status === "Review").length}</strong></div>
          </div>
          <div className="catalog-recent-projects"><h4>Recently updated</h4>{projects.slice(0, 3).map((project) => <div key={project.id}><span><strong>{project.name}</strong><small>{project.owner}</small></span><Badge tone={project.status === "Active" ? "success" : project.status === "Review" ? "warning" : "neutral"}>{project.status}</Badge></div>)}</div>
        </div>}
        {activeId === "projects" && <div className="catalog-shell-page"><div><h3>Workspace projects</h3><p className="catalog-caption">Search, sort, and page through the same fictional records.</p></div><DataTable columns={projectColumns} data={projects} getRowId={getProjectId} caption="Workspace projects" searchLabel="Search workspace projects" initialPageSize={5} pageSizeOptions={[5, 10]} /></div>}
        {activeId === "team" && <div className="catalog-shell-page"><div><h3>Workspace team</h3><p className="catalog-caption">Owners shown in the fictional project records.</p></div><ul className="catalog-team-list" role="list">{owners.map((owner) => <li key={owner}><UserIcon /><span><strong>{owner}</strong><small>{projects.filter((project) => project.owner === owner).length} projects</small></span></li>)}</ul></div>}
        {activeId === "settings" && <div className="catalog-shell-page"><div><h3>Workspace settings</h3><p className="catalog-caption">This page demonstrates a navigation destination.</p></div><ActionMessage tone="info">The shell supplies layout and navigation. Your application owns settings, permissions, and persistence.</ActionMessage></div>}
      </AdminShell>
    </div>
  );
}
