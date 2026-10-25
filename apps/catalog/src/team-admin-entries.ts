import type { CatalogEntry } from "./catalog-types.js";

const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';
export const teamAdminEntries: readonly CatalogEntry[] = [
  {
    id: "team-members", name: "Members and invitations", group: "Compositions", inventoryIds: ["M07"],
    description: "Search members, filter by application roles, and invite, resend or revoke with confirmation and recovery.",
    tags: ["team", "members", "invitation", "invite", "resend", "revoke", "M07"],
    source: "Original kit composition · host-owned membership", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: `${imports}
import { useState } from "react";
import type { TeamMembersProps } from "@evenkit/ui";
import { TeamAdministration } from "./team-administration";

// Copy registry/blocks/team-administration.tsx beside this file.
export function TeamSettings(props: TeamMembersProps) {
  const [section, setSection] = useState<"members" | "roles" | "audit">("members");
  return <TeamAdministration teamName={props.teamName} section={section}
    onSectionChange={setSection} members={props} />;
}
// loadMembers receives the full search/page/sort query and external filters.
// The host validates and authorizes every mutation, then updates invitations.
// Change contextKey when the team, account or policy revision changes.
`,
  },
  {
    id: "invitation-acceptance", name: "Invitation acceptance", group: "Compositions", inventoryIds: ["L04"],
    description: "Review an invitation with account mismatch, expired, revoked and already accepted states.",
    tags: ["invitation", "accept", "account", "expired", "revoked", "L04"],
    source: "Original kit composition · application-resolved identity", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: `${imports}
import type { InvitationAcceptanceProps } from "@evenkit/ui";
import { InvitationPage } from "./invitation-page";

// Copy registry/blocks/invitation-page.tsx beside this file.
export function JoinTeam(props: InvitationAcceptanceProps) {
  return <InvitationPage {...props} />;
}
// Resolve invitation.status and account identity in the application.
// onAccept rechecks the invitation and returns success, denied, error or stale.
// Sign-in, account switching and navigation callbacks use the host's auth flow.
`,
  },
  {
    id: "role-capability-editor", name: "Role and capability editor", group: "Compositions", inventoryIds: ["M08"],
    description: "Edit application-defined grants with locked capabilities, confirmation, read-only states and draft recovery.",
    tags: ["role", "capability", "permissions", "grants", "access", "M08"],
    source: "Original kit composition · application-defined grants", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/checkbox",
    usage: `${imports}
import { RoleSettings, type RoleSettingsProps } from "./role-settings";

// Copy registry/blocks/role-settings.tsx beside this file.
export function ApplicationRoles(props: RoleSettingsProps) {
  return <RoleSettings {...props} />;
}
// Supply role and capability definitions from your application.
// The editor does not interpret grants or enforce authorization.
// onSave revalidates policy and writes the chosen grants in the host.
`,
  },
  {
    id: "audit-viewer", name: "Audit viewer", group: "Compositions", inventoryIds: ["O09"],
    description: "Search and filter recorded events, inspect actors and details, and request a host-owned export.",
    tags: ["audit", "activity", "history", "actor", "export", "O09"],
    source: "Original kit composition · ActivityTimeline and remote queries", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time",
    usage: `${imports}
import type { AuditViewerProps } from "@evenkit/ui";
import { AuditPage } from "./audit-page";

// Copy registry/blocks/audit-page.tsx beside this file.
export function TeamAudit(props: AuditViewerProps) {
  return <AuditPage {...props} />;
}
// load searches the full permitted dataset and returns one page plus its total.
// onExport receives all active filters without pagination. The host creates
// and delivers the file; the viewer never retries or changes recorded events.
`,
  },
];
