"use client";

import { useRef, useState } from "react";
import type { AuditQuery } from "@evenkit/ui";
import { TeamAdministration, type TeamAdministrationProps } from "../../blocks/team-administration";
import { RoleSettings } from "../../blocks/role-settings";
import { AuditPage } from "../../blocks/audit-page";
import { demoCapabilities } from "../../lib/demo-team";
import { useDemoTeam } from "../use-demo-team";
import { useStarter } from "../starter-providers";

const memberStatuses = [{ id: "active", label: "Active" }, { id: "paused", label: "Paused" }];
const auditKinds = [{ id: "workspace", label: "Workspace" }, { id: "projects", label: "Projects" }, { id: "team", label: "Invitations" }, { id: "roles", label: "Roles" }];

export function TeamView() {
  const { workspaceName, data, appearance } = useStarter();
  const actions = useDemoTeam();
  const [section, setSection] = useState<TeamAdministrationProps["section"]>("members");
  const [roleId, setRoleId] = useState("editor");
  const [query, setQuery] = useState<AuditQuery>({ search: "", actorId: null, kind: null, outcome: null, pageIndex: 0, pageSize: 5 });
  const content = useRef<HTMLDivElement>(null);
  return <div className="starter-stack" ref={content} tabIndex={-1}>
    <p className="starter-muted">Members, roles and invitations are fictional. Actions update this tab and do not send email or change provider membership.</p>
    <p role="status">{actions.notice}</p>
    <TeamAdministration teamName={workspaceName} section={section} onSectionChange={next => { setSection(next); requestAnimationFrame(() => content.current?.focus()); }}
      members={{ contextKey: actions.contextKey, teamName: workspaceName, roles: data.team.roles.map(role => ({ ...role, disabled: role.id === "coordinator" })), memberStatuses, loadMembers: actions.loadMembers, invitations: data.team.invitations,
        onInvite: actions.invite, onResend: actions.resend, onRevoke: actions.revoke,
        invitationActionUnavailable: invitation => invitation.status === "accepted" || invitation.status === "revoked" ? "This invitation is no longer pending." : undefined,
        timeZone: "Europe/Vienna", locale: appearance.locale ?? "en" }}
      roles={<RoleSettings contextKey={actions.contextKey} roles={data.team.roles} roleId={roleId} onRoleChange={setRoleId} capabilities={demoCapabilities} onSave={actions.saveRole}
        {...(roleId === "coordinator" ? { readOnlyReason: "The coordinator role is fixed by this demo's policy." } : {})} onReload={() => actions.reloadRole(roleId)} />}
      audit={<AuditPage contextKey={actions.contextKey} query={query} onQueryChange={setQuery} load={actions.loadAudit} timeZone="Europe/Vienna" locale={appearance.locale ?? "en"}
        actors={data.team.members.map(member => ({ id: member.id, label: member.name }))} kinds={auditKinds} outcomes={[{ id: "success", label: "Success" }]} onExport={actions.exportAudit} />}
    />
  </div>;
}
