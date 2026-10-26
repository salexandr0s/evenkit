import { useCallback, useRef, useState, type ReactNode } from "react";
import { Button, Checkbox, SelectField, type AuditQuery, type AuditViewerProps, type EditableRole, type InvitationAcceptanceStatus, type TeamInvitation, type TeamMembersProps } from "@evenkit/ui";
import { TeamAdministration } from "../../../registry/blocks/team-administration.js";
import { InvitationPage } from "../../../registry/blocks/invitation-page.js";
import { RoleSettings } from "../../../registry/blocks/role-settings.js";
import { AuditPage } from "../../../registry/blocks/audit-page.js";
import { demoAudit, demoDelay, demoInvitations, demoMembers, demoResponses, demoRoles, filterDemoAudit, useDemoAction } from "./team-admin-demo.js";
import "./team-admin-preview.css";

function DemoFrame({ children }: { children: ReactNode }) {
  return <div className="team-admin-preview"><p className="team-admin-demo-note"><span>Local preview</span>Fictional data. No invitations are delivered.</p>{children}</div>;
}

function ResponseControls({ demo, onContextChange, children }: { demo: ReturnType<typeof useDemoAction>; onContextChange: () => void; children?: ReactNode }) {
  return <section className="team-admin-demo-controls" aria-label="Demo controls">
    <div className="team-admin-demo-controls-heading"><h3>Try a different outcome</h3><p>Explore recovery states and changes to the team context.</p></div>
    <div className="team-admin-demo-controls-fields">
    <SelectField label="Simulated response" value={demo.response} options={demoResponses} onValueChange={next => { if (next === "success" || next === "error" || next === "denied" || next === "stale" || next === "slow") demo.setResponse(next); }} />
    <Button variant="outline" size="sm" onClick={onContextChange}>Switch team context</Button>{children}
    </div>
  </section>;
}

function MembersExample() {
  const [revision, setRevision] = useState(0);
  const [section, setSection] = useState<"members" | "roles" | "audit">("members");
  const [invitations, setInvitations] = useState<Record<string, readonly TeamInvitation[]>>({ aster: demoInvitations, orchard: [] });
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [note, setNote] = useState("");
  const failLoad = useRef(false);
  const teamId = revision % 2 === 0 ? "aster" : "orchard";
  const teamName = teamId === "aster" ? "Aster Research" : "Orchard Archive";
  const contextKey = `members:${teamId}:mira:${revision}`;
  const demo = useDemoAction(contextKey);
  const loadMembers = useCallback<TeamMembersProps["loadMembers"]>(async (query, filters, { signal }) => {
    await demoDelay(180, signal);
    if (failLoad.current) { failLoad.current = false; throw new Error("The fictional member list could not be loaded. Retry to continue."); }
    const source = teamId === "aster" ? demoMembers : demoMembers.slice(0, 2).map(member => ({ ...member, name: `Archive colleague ${member.id}`, email: `archive-${member.email}` }));
    const search = query.search.trim().toLocaleLowerCase();
    const filtered = source.filter(member => (!filters.roleId || member.roleId === filters.roleId) && (!filters.status || member.status === filters.status) && `${member.name} ${member.email}`.toLocaleLowerCase().includes(search));
    const sort = query.sort;
    if (sort) filtered.sort((left, right) => {
      const field = sort.id === "role" ? "roleId" : sort.id === "status" ? "status" : "name";
      return left[field].localeCompare(right[field]) * (sort.direction === "desc" ? -1 : 1);
    });
    return { data: filtered.slice(query.pageIndex * query.pageSize, (query.pageIndex + 1) * query.pageSize), total: filtered.length };
  }, [teamId, loadAttempt]);
  const updateInvitation = (invitation: TeamInvitation, remove: boolean) => setInvitations(current => ({ ...current, [teamId]: remove ? (current[teamId] ?? []).filter(item => item.id !== invitation.id) : (current[teamId] ?? []).map(item => item.id === invitation.id ? { ...item, status: "pending", revision: `${Number(item.revision) + 1}`, expiresAt: "2026-11-08T18:00:00Z" } : item) }));
  const refresh = () => { demo.setResponse("success"); setRevision(value => value + 2); setNote("Loaded the current local team context."); };
  return <DemoFrame>
    <TeamAdministration teamName={teamName} section={section} onSectionChange={setSection} members={{ contextKey, teamName, roles: demoRoles, memberStatuses: [{ id: "active", label: "Active" }, { id: "inactive", label: "Inactive" }], loadMembers, invitations: invitations[teamId] ?? [], timeZone: "Europe/Vienna", onRefresh: refresh,
      onInvite: async (draft, context) => {
        const result = await demo.act(context, `Invitation created for ${draft.email}.`);
        if (result.status === "success") {
          if ((invitations[teamId] ?? []).some(invitation => invitation.email.toLocaleLowerCase() === draft.email.toLocaleLowerCase() && invitation.status === "pending")) return { status: "error", message: "A pending invitation already exists for this email. Resend it from the list." };
          setInvitations(current => ({ ...current, [teamId]: [...(current[teamId] ?? []), { ...draft, id: crypto.randomUUID(), status: "pending", revision: "1", expiresAt: "2026-11-01T18:00:00Z" }] }));
        }
        return result;
      },
      onResend: async (invitation, context) => { const result = await demo.act(context, `Invitation resent to ${invitation.email}.`); if (result.status === "success") updateInvitation(invitation, false); return result; },
      onRevoke: async (invitation, context) => { const result = await demo.act(context, `Invitation revoked for ${invitation.email}.`); if (result.status === "success") updateInvitation(invitation, true); return result; },
    }} />
    <ResponseControls demo={demo} onContextChange={() => { setRevision(value => value + 1); setNote(""); }}><Button size="sm" variant="outline" onClick={() => { failLoad.current = true; setLoadAttempt(value => value + 1); }}>Fail next member load</Button></ResponseControls>
    <p className="team-admin-demo-status" role="status">{note}</p>
  </DemoFrame>;
}

const invitationStates: readonly { value: InvitationAcceptanceStatus; label: string }[] = [
  { value: "ready", label: "Ready" }, { value: "signed-out", label: "Sign in required" }, { value: "account-mismatch", label: "Account mismatch" },
  { value: "expired", label: "Expired" }, { value: "revoked", label: "Revoked" }, { value: "already-accepted", label: "Already accepted" },
];
function InvitationExample() {
  const [state, setState] = useState<InvitationAcceptanceStatus>("ready");
  const [revision, setRevision] = useState(0);
  const [note, setNote] = useState("");
  const contextKey = `invitation:leo:${revision}`;
  const demo = useDemoAction(contextKey);
  function refresh() { demo.setResponse("success"); setRevision(value => value + 2); setNote("Loaded the current invitation and account."); }
  return <DemoFrame>
    <InvitationPage contextKey={contextKey} invitation={{ id: "invite-leo", revision: `${revision}`, teamName: revision % 2 === 0 ? "Aster Research" : "Orchard Archive", email: "leo@example.test", roleLabel: "Reviewer", expiresAt: "2026-11-01T18:00:00Z", status: state }} currentAccountLabel={state === "account-mismatch" ? "another-account@example.test" : "leo@example.test"} timeZone="Europe/Vienna"
      onAccept={async (_id, context) => demo.act(context, "You joined the fictional team.")}
      onSignIn={() => { setState("ready"); setRevision(value => value + 2); setNote("Signed in as Leo for this local example."); }}
      onSwitchAccount={() => { setState("ready"); setRevision(value => value + 2); setNote("Switched to Leo's account for this local example."); }}
      onRequestReplacement={() => { setState("ready"); setRevision(value => value + 2); setNote("A new fictional invitation is ready."); }}
      onContinue={() => setNote("The application would open the team's workspace here.")}
      onReload={refresh} />
    <ResponseControls demo={demo} onContextChange={() => { setRevision(value => value + 1); setNote(""); }}>
      <SelectField label="Invitation state" value={state} options={[...invitationStates]} onValueChange={next => { const found = invitationStates.find(item => item.value === next); if (found) { setState(found.value); setNote(""); } }} />
    </ResponseControls>
    <p className="team-admin-demo-status" role="status">{note}</p>
  </DemoFrame>;
}

const initialRoles: readonly EditableRole[] = [
  { id: "reviewer", revision: "1", label: "Reviewer", description: "Reviews research notes and comments on proposed changes.", capabilityIds: ["notes.read", "archive.legacy"] },
  { id: "coordinator", revision: "1", label: "Release coordinator", description: "Coordinates the research review and release handover.", capabilityIds: ["notes.read", "notes.comment", "release.prepare"] },
];
const demoCapabilities = [
  { id: "notes.read", label: "Read research notes", description: "Required for both roles in this example.", group: "Research", disabledReason: "The application requires this grant." },
  { id: "notes.comment", label: "Comment on research notes", group: "Research" },
  { id: "release.prepare", label: "Prepare release handovers for international research and archive projects", description: "This long label demonstrates wrapping in narrow layouts.", group: "Delivery" },
  { id: "archive.export", label: "Export archive records", group: "Delivery" },
];
function RolesExample() {
  const [roles, setRoles] = useState(initialRoles);
  const [roleId, setRoleId] = useState("reviewer");
  const [revision, setRevision] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [note, setNote] = useState("");
  const contextKey = `roles:aster:mira:${revision}`;
  const demo = useDemoAction(contextKey);
  return <DemoFrame>
    <RoleSettings roles={roles} roleId={roleId} onRoleChange={setRoleId} contextKey={contextKey} capabilities={demoCapabilities} {...(readOnly ? { readOnlyReason: "You can review these grants. A team coordinator must save changes." } : {})}
      onSave={async (next, context) => {
        const result = await demo.act(context, "Role capabilities saved.");
        if (result.status === "success") {
          setRoles(current => current.map(role => role.id === next.roleId ? { ...role, capabilityIds: [...next.capabilityIds], revision: `${Number(role.revision) + 1}` } : role));
          setNote("The application saved the role capabilities, including the retained legacy grant.");
        }
        return result;
      }} onReload={() => { demo.setResponse("success"); setRevision(value => value + 1); setNote("Loaded the current role definitions and grants."); }} />
    <ResponseControls demo={demo} onContextChange={() => { setRevision(value => value + 1); setNote(""); }}><Checkbox label="Read-only role" checked={readOnly} onCheckedChange={value => setReadOnly(value === true)} /></ResponseControls>
    <p className="team-admin-demo-status" role="status">{note}</p>
  </DemoFrame>;
}

const initialAuditQuery: AuditQuery = { pageIndex: 0, pageSize: 5, search: "", actorId: null, kind: null, outcome: null };
function AuditExample() {
  const [query, setQuery] = useState(initialAuditQuery);
  const [revision, setRevision] = useState(0);
  const [denied, setDenied] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [note, setNote] = useState("");
  const failLoad = useRef(false);
  const contextKey = `audit:aster:mira:${revision}`;
  const demo = useDemoAction(contextKey);
  const load = useCallback<AuditViewerProps["load"]>(async (next, { signal }) => {
    await demoDelay(180, signal);
    if (failLoad.current) { failLoad.current = false; throw new Error("The fictional audit request failed. Retry to load the events."); }
    const filtered = filterDemoAudit(revision % 2 === 0 ? demoAudit : demoAudit.filter(event => event.actorId === "worker"), next);
    return { data: filtered.slice(next.pageIndex * next.pageSize, (next.pageIndex + 1) * next.pageSize), total: filtered.length };
  }, [revision, loadAttempt]);
  return <DemoFrame>
    <AuditPage contextKey={contextKey} query={query} onQueryChange={setQuery} load={load} timeZone="Europe/Vienna"
      actors={[{ id: "mira", label: "Mira Chen" }, { id: "noor", label: "Noor Haddad" }, { id: "worker", label: "Archive worker" }]}
      kinds={[{ id: "invitation", label: "Invitations" }, { id: "role", label: "Roles" }, { id: "record", label: "Records" }, { id: "export", label: "Exports" }]}
      outcomes={[{ id: "allowed", label: "Allowed" }, { id: "denied", label: "Denied" }, { id: "failed", label: "Failed" }]} {...(denied ? { denied: "The application does not allow this account to read the audit history." } : {})}
      onExport={async (criteria, context) => {
        const result = await demo.act(context, "Audit export downloaded.");
        if (result.status === "success") {
          const records = filterDemoAudit(revision % 2 === 0 ? demoAudit : demoAudit.filter(event => event.actorId === "worker"), criteria);
          const blob = new Blob([JSON.stringify({ fictional: true, criteria, records }, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a"); link.href = url; link.download = "fictional-team-audit.json"; link.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 0);
          setNote(`Downloaded ${records.length} fictional events matching the current filters.`);
        }
        return result;
      }} onRefreshContext={() => { demo.setResponse("success"); setDenied(false); setRevision(value => value + 2); setNote("Loaded the current audit context."); }} />
    <ResponseControls demo={demo} onContextChange={() => { setRevision(value => value + 1); setQuery(initialAuditQuery); setNote(""); }}>
      <Button variant="outline" size="sm" onClick={() => { failLoad.current = true; setLoadAttempt(value => value + 1); }}>Fail next audit load</Button>
      <Checkbox label="Deny audit access" checked={denied} onCheckedChange={value => setDenied(value === true)} />
    </ResponseControls>
    <p className="team-admin-demo-status" role="status">{note}</p>
  </DemoFrame>;
}

export function TeamAdminPreview({ id }: { id: string }) {
  if (id === "team-members") return <MembersExample />;
  if (id === "invitation-acceptance") return <InvitationExample />;
  if (id === "role-capability-editor") return <RolesExample />;
  if (id === "audit-viewer") return <AuditExample />;
  return null;
}
