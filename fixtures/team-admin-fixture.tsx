"use client";

import { useCallback, useState } from "react";
import { AuditViewer, InvitationAcceptance, RoleCapabilityEditor, TeamMembers, type AuditQuery, type AuditViewerProps, type TeamMembersProps } from "@evenkit/ui";

/** Exercises public declarations and client boundaries in independent packed consumers. */
export function TeamAdminFixture() {
  const [query, setQuery] = useState<AuditQuery>({ search: "", actorId: null, kind: null, outcome: null, pageIndex: 0, pageSize: 10 });
  const loadMembers = useCallback<TeamMembersProps["loadMembers"]>(async () => ({ data: [], total: 0 }), []);
  const loadAudit = useCallback<AuditViewerProps["load"]>(async () => ({ data: [], total: 0 }), []);
  return <section aria-label="Packed team administration">
    <h2>Team administration package controls</h2>
    <TeamMembers contextKey="packed-team:principal:1" teamName="Fictional archive" roles={[]} invitations={[]} loadMembers={loadMembers} timeZone="UTC" />
    <InvitationAcceptance contextKey="packed-team:principal:1" invitation={{ id: "invitation", revision: "1", teamName: "Fictional archive", email: "reader@example.com", status: "expired" }} timeZone="UTC" onAccept={async () => ({ status: "denied", message: "This fixture invitation has expired." })} />
    <RoleCapabilityEditor contextKey="packed-team:principal:1" role={{ id: "reader", revision: "1", label: "Archive reviewer", capabilityIds: ["read"] }} capabilities={[{ id: "read", label: "Read archive" }]} readOnlyReason="Read-only package fixture." onSave={async () => ({ status: "denied", message: "This fixture is read-only." })} />
    <AuditViewer contextKey="packed-team:principal:1" query={query} onQueryChange={setQuery} load={loadAudit} timeZone="UTC" />
  </section>;
}
