"use client";

import { lazy, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { AdminShell, Badge, BellIcon, Button, FileTextIcon, FolderIcon, LayoutDashboardIcon, PageHeader, SettingsIcon, Spinner, Switch, UsersIcon, WorkspaceSwitcher, type AdminNavGroup } from "@evenkit/ui";
import { sectionLabels, type AdminSection } from "../lib/navigation";
import { demoWorkspaces } from "../lib/demo-data";
import { useStarter } from "./starter-providers";

const DashboardView = lazy(() => import("./views/dashboard-view").then(module => ({ default: module.DashboardView })));
const RecordsView = lazy(() => import("./views/records-view").then(module => ({ default: module.RecordsView })));
const SettingsView = lazy(() => import("./views/settings-view").then(module => ({ default: module.SettingsView })));

export interface StarterSession { mode: "demo" | "supabase"; userLabel: string }
const navigation: readonly AdminNavGroup[] = [{ label: "Workspace", items: [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon /> },
  { id: "records", label: "Records", href: "/records", icon: <FolderIcon /> },
  { id: "team", label: "Team", href: "/team", icon: <UsersIcon /> },
  { id: "notifications", label: "Notifications", href: "/notifications", icon: <BellIcon /> },
  { id: "documents", label: "Documents", href: "/documents", icon: <FileTextIcon /> },
  { id: "settings", label: "Settings", href: "/settings", icon: <SettingsIcon /> },
] }];
const descriptions: Record<AdminSection, string> = {
  dashboard: "Project activity and workspace updates.", records: "Review projects, edit details and follow their progress.",
  team: "Manage members, invitations and roles.", notifications: "Review workspace updates and choose what reaches you.",
  documents: "Organize files, review previews and manage access.", settings: "Manage your profile and workspace appearance.",
};

export function AdminWorkspace({ section, session, recordId }: { section: AdminSection; session: StarterSession; recordId?: string }) {
  const starter = useStarter();
  const heading = useRef<HTMLDivElement>(null);
  useEffect(() => { heading.current?.focus(); }, [section, recordId, starter.workspaceId]);
  const returnTo = recordId ? `/records/${encodeURIComponent(recordId)}` : `/${section}`;
  return <AdminShell
    brand={<Link className="starter-brand" href="/dashboard">Evenkit <span>Admin starter</span></Link>}
    compactBrand={<LayoutDashboardIcon />}
    navigation={navigation} activeItemId={section} navLabel="Admin navigation" contentId="admin-content"
    renderLink={({ onClick, onMouseEnter, onTouchStart, ...props }) => <Link {...props} prefetch={false} {...(onClick ? { onClick } : {})} {...(onMouseEnter ? { onMouseEnter } : {})} {...(onTouchStart ? { onTouchStart } : {})} />}
    header={<WorkspaceSwitcher workspaces={demoWorkspaces} value={starter.workspaceId} onValueChange={starter.switchWorkspace} />}
    actions={<Badge tone="accent">Fictional data</Badge>}
    footer={<div className="starter-account"><strong>{session.userLabel}</strong><span>{session.mode === "demo" ? "Local demo" : "Supabase session"}</span>{session.mode === "supabase" ? <form method="post" action="/auth/sign-out"><Button type="submit" variant="outline" size="sm">Sign out</Button></form> : <Link href="/login">Explore sign-in</Link>}</div>}
  >
    <div className="starter-page">
      <PageHeader ref={heading} id="admin-view-heading" tabIndex={-1} title={sectionLabels[section]} description={descriptions[section]} metadata={starter.workspaceName} />
      <details className="starter-demo-controls">
        <summary>Demo controls</summary>
        <div className="starter-demo-controls-body">
          <p>Changes stay in this tab. Reloading starts a new demo.</p>
          <Switch label="Slow requests" hint="Allow time to cancel or change workspace." checked={starter.slow} onCheckedChange={starter.setSlow} />
          <Button variant="outline" disabled={starter.failureArmed} onClick={starter.failNext}>{starter.failureArmed ? "Next request will fail" : "Fail next request"}</Button>
          <a href={`/session-expired?returnTo=${encodeURIComponent(returnTo)}`}>Try session recovery</a>
        </div>
      </details>
      <div key={`${starter.workspaceId}:${section}`} className="starter-view">
        <Suspense fallback={<div className="starter-load"><Spinner label={`Loading ${sectionLabels[section].toLowerCase()}`} /></div>}>
          {section === "dashboard" ? <DashboardView /> : section === "records" ? <RecordsView {...(recordId ? { recordId } : {})} /> : section === "settings" ? <SettingsView /> : <p>Integration for this workspace view is in progress.</p>}
        </Suspense>
      </div>
    </div>
  </AdminShell>;
}
