"use client";

import { useCallback, useRef, useState } from "react";
import type { AuditRecord, AuditViewerProps, RoleCapabilityEditorProps, TeamActionContext, TeamInvitation, TeamMembersProps } from "@evenkit/ui";
import { demoCapabilities, matchingAudit } from "../lib/demo-team";
import { useStarter } from "./starter-providers";

export function useDemoTeam() {
  const { workspaceId, data, request, updateTeam, createFileUrl } = useStarter();
  const source = useRef(data.team);
  source.current = data.team;
  const [notice, setNotice] = useState("");
  const contextKey = `${workspaceId}:fictional-admin:policy-v1`;

  const wait = useCallback(async (context: TeamActionContext) => {
    if (context.contextKey !== contextKey) throw new Error("The workspace changed. Refresh this view.");
    await request(context.signal);
    context.signal.throwIfAborted();
  }, [contextKey, request]);

  const loadMembers: TeamMembersProps["loadMembers"] = useCallback(async (query, filters, context) => {
    await wait(context);
    const search = query.search.trim().toLocaleLowerCase();
    const members = source.current.members.filter(member => (!search || `${member.name} ${member.email}`.toLocaleLowerCase().includes(search)) && (!filters.roleId || member.roleId === filters.roleId) && (!filters.status || member.status === filters.status));
    members.sort((left, right) => {
      const value = (member: typeof left) => query.sort?.id === "role" ? source.current.roles.find(role => role.id === member.roleId)?.label ?? member.roleId : query.sort?.id === "status" ? member.status : member.name;
      return value(left).localeCompare(value(right)) * (query.sort?.direction === "desc" ? -1 : 1);
    });
    return { data: members.slice(query.pageIndex * query.pageSize, (query.pageIndex + 1) * query.pageSize), total: members.length };
  }, [wait]);

  function event(action: string, kind = "team"): AuditRecord {
    return { id: crypto.randomUUID(), actor: data.profile.name, actorId: `${workspaceId}-alex`, action, kind, outcome: "success", timestamp: new Date().toISOString(), details: [{ label: "Environment", value: "Local fictional demo" }] };
  }

  const invite: NonNullable<TeamMembersProps["onInvite"]> = async (draft, context) => {
    await wait(context);
    if (!source.current.roles.some(role => role.id === draft.roleId)) return { status: "denied", message: "Choose a role available in this workspace." };
    if (draft.roleId === "coordinator") return { status: "denied", message: "Coordinator invitations are disabled by this demo's policy." };
    const email = draft.email.trim().toLocaleLowerCase();
    if (source.current.members.some(member => member.email.toLocaleLowerCase() === email) || source.current.invitations.some(invitation => invitation.email.toLocaleLowerCase() === email && invitation.status === "pending")) return { status: "error", message: "This address already has membership or a pending invitation." };
    const invitation: TeamInvitation = { id: crypto.randomUUID(), revision: crypto.randomUUID(), email, roleId: draft.roleId, status: "pending", expiresAt: new Date(Date.now() + 7 * 86400000).toISOString() };
    const audit = event(`Created a sample invitation for ${email}`);
    updateTeam(team => ({ ...team, invitations: [...team.invitations, invitation], audit: [audit, ...team.audit] }), context.signal);
    setNotice("Invitation created in this demo. No email was sent.");
    return { status: "success", message: "Sample invitation created. No email was sent." };
  };

  async function changeInvitation(invitation: TeamInvitation, context: TeamActionContext, operation: "resend" | "revoke") {
    await wait(context);
    const current = source.current.invitations.find(item => item.id === invitation.id);
    if (!current || current.revision !== invitation.revision) return { status: "stale" as const, message: "This invitation changed. Refresh and review its current status." };
    if (current.status === "accepted" || current.status === "revoked") return { status: "denied" as const, message: "This invitation is no longer pending." };
    const updated: TeamInvitation = { ...current, revision: crypto.randomUUID(), status: operation === "revoke" ? "revoked" : "pending", ...(operation === "resend" ? { expiresAt: new Date(Date.now() + 7 * 86400000).toISOString() } : {}) };
    const audit = event(`${operation === "revoke" ? "Revoked" : "Renewed"} a sample invitation for ${current.email}`);
    updateTeam(team => ({ ...team, invitations: team.invitations.map(item => item.id === current.id ? updated : item), audit: [audit, ...team.audit] }), context.signal);
    setNotice(operation === "revoke" ? "Sample invitation revoked." : "Sample invitation renewed. No email was sent.");
    return { status: "success" as const };
  }

  const saveRole: RoleCapabilityEditorProps["onSave"] = async (change, context) => {
    await wait(context);
    const role = source.current.roles.find(item => item.id === change.roleId);
    if (!role || role.revision !== change.revision) return { status: "stale", message: "The role changed. Reload it before saving." };
    if (role.id === "coordinator") return { status: "denied", message: "The coordinator role is fixed by this demo's policy." };
    if (change.capabilityIds.some(id => !demoCapabilities.some(capability => capability.id === id)) || !change.capabilityIds.includes("audit.read")) return { status: "denied", message: "The proposed grants do not match this demo's policy." };
    const audit = event(`Updated the ${role.label} role`, "roles");
    updateTeam(team => ({ ...team, roles: team.roles.map(item => item.id === role.id ? { ...item, revision: crypto.randomUUID(), capabilityIds: [...new Set(change.capabilityIds)] } : item), audit: [audit, ...team.audit] }), context.signal);
    setNotice(`${role.label} role saved in this demo.`);
    return { status: "success" };
  };

  function reloadRole(roleId: string) {
    updateTeam(team => ({ ...team, roles: team.roles.map(role => role.id === roleId ? { ...role, revision: crypto.randomUUID() } : role) }), new AbortController().signal);
    setNotice("Role reloaded from the current local state.");
  }

  const loadAudit: AuditViewerProps["load"] = useCallback(async (query, context) => {
    await wait(context);
    const records = matchingAudit(source.current.audit, query);
    return { data: records.slice(query.pageIndex * query.pageSize, (query.pageIndex + 1) * query.pageSize), total: records.length };
  }, [wait]);
  const exportAudit: NonNullable<AuditViewerProps["onExport"]> = async (criteria, context) => {
    await wait(context);
    const records = matchingAudit(source.current.audit, criteria);
    const url = createFileUrl(new File([JSON.stringify(records, null, 2)], `${workspaceId}-audit.json`, { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `${workspaceId}-audit.json`; document.body.append(anchor); anchor.click(); anchor.remove();
    return { status: "success", message: `Downloaded ${records.length} matching sample events.` };
  };

  return { contextKey, notice, loadMembers, invite, resend: (invitation: TeamInvitation, context: TeamActionContext) => changeInvitation(invitation, context, "resend"), revoke: (invitation: TeamInvitation, context: TeamActionContext) => changeInvitation(invitation, context, "revoke"), saveRole, reloadRole, loadAudit, exportAudit };
}
