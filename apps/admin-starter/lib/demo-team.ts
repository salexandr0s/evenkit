import type { AuditCriteria, AuditRecord, CapabilityDefinition, EditableRole, TeamInvitation, TeamMember } from "@evenkit/ui";
import type { WorkspaceId } from "./demo-data";

export interface DemoTeam {
  members: readonly TeamMember[];
  invitations: readonly TeamInvitation[];
  roles: readonly EditableRole[];
  audit: readonly AuditRecord[];
}

export const demoCapabilities: readonly CapabilityDefinition[] = [
  { id: "projects.read", label: "Read projects", group: "Projects", description: "View project records in this sample workspace." },
  { id: "projects.edit", label: "Edit projects", group: "Projects", description: "Create and update project records." },
  { id: "documents.manage", label: "Manage documents", group: "Documents", description: "Upload, remove and restore files." },
  { id: "team.invite", label: "Invite team members", group: "Team", description: "Create sample invitations." },
  { id: "audit.read", label: "Read audit history", group: "Team", disabledReason: "The demo policy keeps this grant on every role." },
];

export function initialTeam(workspace: WorkspaceId): DemoTeam {
  const northstar = workspace === "northstar";
  return {
    members: [
      { id: `${workspace}-alex`, name: northstar ? "Alex Rivers" : "Sam Rowan", email: northstar ? "alex@northstar.example" : "sam@harbor.example", roleId: "coordinator", status: "active" },
      { id: `${workspace}-morgan`, name: northstar ? "Morgan Lee" : "Taylor Moss", email: northstar ? "morgan@northstar.example" : "taylor@harbor.example", roleId: "editor", status: "active" },
      { id: `${workspace}-casey`, name: "Casey Vale", email: `casey@${workspace}.example`, roleId: "viewer", status: "paused" },
    ],
    invitations: [{ id: `${workspace}-invite`, revision: "1", email: `robin@${workspace}.example`, roleId: "editor", status: "pending", expiresAt: "2026-11-03T12:00:00Z" }],
    roles: [
      { id: "coordinator", label: "Coordinator", revision: "1", capabilityIds: demoCapabilities.map(capability => capability.id) },
      { id: "editor", label: "Editor", revision: "1", capabilityIds: ["projects.read", "projects.edit", "audit.read"] },
      { id: "viewer", label: "Viewer", revision: "1", capabilityIds: ["projects.read", "audit.read"] },
    ],
    audit: [
      { id: `${workspace}-audit-1`, actor: northstar ? "Alex Rivers" : "Sam Rowan", actorId: `${workspace}-alex`, action: "Created this sample workspace", timestamp: "2026-10-21T09:00:00Z", kind: "workspace", outcome: "success", details: [{ label: "Source", value: "Fictional starter data" }] },
      { id: `${workspace}-audit-2`, actor: northstar ? "Morgan Lee" : "Taylor Moss", actorId: `${workspace}-morgan`, action: "Reviewed the project list", timestamp: "2026-10-24T14:30:00Z", kind: "projects", outcome: "success" },
    ],
  };
}

export function matchingAudit(records: readonly AuditRecord[], criteria: AuditCriteria) {
  const search = criteria.search.toLocaleLowerCase().trim();
  return records.filter(record => (!search || `${record.actor} ${record.action} ${record.details?.map(detail => detail.value).join(" ") ?? ""}`.toLocaleLowerCase().includes(search))
    && (!criteria.actorId || record.actorId === criteria.actorId) && (!criteria.kind || record.kind === criteria.kind) && (!criteria.outcome || record.outcome === criteria.outcome));
}
