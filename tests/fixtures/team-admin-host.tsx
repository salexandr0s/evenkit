import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AuditViewer, InvitationAcceptance, RoleCapabilityEditor, TeamMembers,
  type AcceptanceInvitation, type AuditCriteria, type AuditQuery, type AuditRecord,
  type CapabilityDefinition, type TeamActionContext, type TeamActionResult, type TeamInvitation,
} from "@evenkit/ui";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

interface TeamTestHost {
  resolve: (result: TeamActionResult) => void;
  changeContext: () => void;
  changeRevision?: () => void;
  changeDefinitions?: () => void;
  removeInvitation?: () => void;
  completeRevoke?: () => void;
  shrinkAudit?: () => void;
  setAcceptanceStatus?: (status: AcceptanceInvitation["status"]) => void;
  setAccess?: (access: "editable" | "read-only" | "denied") => void;
}
declare global { interface Window { teamTestHost: TeamTestHost } }

/** This host deliberately ignores AbortSignal so the UI's stale-result guard is exercised. */
function useDeferredAction() {
  const queue = useRef<((result: TeamActionResult) => void)[]>([]);
  const [requests, setRequests] = useState(0);
  const [submitted, setSubmitted] = useState("");
  const [lastContext, setLastContext] = useState("");
  const run = useCallback((value: unknown, context: TeamActionContext) => {
    setRequests(count => count + 1);
    setSubmitted(JSON.stringify(value));
    setLastContext(context.contextKey);
    return new Promise<TeamActionResult>(resolve => { queue.current.push(resolve); });
  }, []);
  const resolve = useCallback((result: TeamActionResult) => { queue.current.shift()?.(result); }, []);
  const evidence = <aside aria-label="Host evidence"><output aria-label="Host requests">{requests}</output><output aria-label="Submitted value">{submitted}</output><output aria-label="Submitted context">{lastContext}</output></aside>;
  return { run, resolve, evidence };
}

function AcceptanceHost() {
  const operation = useDeferredAction();
  const [context, setContext] = useState(1);
  const [revision, setRevision] = useState(1);
  const [status, setStatus] = useState<AcceptanceInvitation["status"]>("ready");
  const [denied, setDenied] = useState(false);
  const [navigation, setNavigation] = useState("");
  useEffect(() => {
    window.teamTestHost = {
      resolve: operation.resolve,
      changeContext: () => setContext(value => value + 1),
      changeRevision: () => setRevision(value => value + 1),
      setAcceptanceStatus: setStatus,
      setAccess: value => setDenied(value === "denied"),
    };
  }, [operation.resolve]);
  return <>
    <InvitationAcceptance contextKey={`team-a:principal-${context}`} invitation={{ id: "invite-a", revision: String(revision), teamName: "Fictional Cedar Studio", email: "casey@example.test", status }} currentAccountLabel="casey@example.test" timeZone="UTC"
      {...(denied ? { deniedReason: "The host denied this request." } : {})}
      onAccept={(id, action) => operation.run({ invitationId: id, revision: action.revision }, action)}
      onSignIn={() => setNavigation("sign-in")} onSwitchAccount={() => setNavigation("switch-account")}
      onRequestReplacement={() => setNavigation("replacement")} onContinue={() => setNavigation("team")}
      onReload={() => setRevision(value => value + 1)} />
    {operation.evidence}<output aria-label="Host navigation">{navigation}</output>
  </>;
}

const initialCapabilities: readonly CapabilityDefinition[] = [
  { id: "records.read", label: "Read records" },
  { id: "records.review", label: "Review records" },
  { id: "records.retain", label: "Retain records", disabledReason: "Managed by the host." },
];
function RoleHost() {
  const operation = useDeferredAction();
  const [context, setContext] = useState(1);
  const [revision, setRevision] = useState(1);
  const [capabilities, setCapabilities] = useState(initialCapabilities);
  const [access, setAccess] = useState<"editable" | "read-only" | "denied">("editable");
  useEffect(() => {
    window.teamTestHost = {
      resolve: operation.resolve,
      changeContext: () => setContext(value => value + 1),
      changeRevision: () => setRevision(value => value + 1),
      changeDefinitions: () => setCapabilities(initialCapabilities.map(capability => capability.id === "records.review" ? { ...capability, disabledReason: "No longer available." } : capability)),
      setAccess,
    };
  }, [operation.resolve]);
  return <>
    <RoleCapabilityEditor contextKey={`team-a:principal-${context}`} role={{ id: "reviewers", revision: String(revision), label: "Archive reviewers", capabilityIds: ["records.read", "records.retain", "legacy.grant"] }} capabilities={capabilities}
      {...(access === "read-only" ? { readOnlyReason: "This role can only be viewed." } : {})}
      {...(access === "denied" ? { deniedReason: "The host denied editing." } : {})}
      onSave={(change, action) => operation.run(change, action)} onReload={() => setRevision(value => value + 1)} />
    {operation.evidence}
  </>;
}

const auditRecords: readonly AuditRecord[] = [
  { id: "event-a", actor: "Casey Rowan", actorId: "casey", action: "reviewed a role", timestamp: "2026-10-25T10:30:00Z", kind: "role", outcome: "denied", details: [{ label: "Reason", value: "The host rejected the change." }] },
  { id: "event-b", actor: "Morgan Vale", actorId: "morgan", action: "sent an invitation", timestamp: "2026-10-25T09:00:00Z", kind: "invite", outcome: "complete" },
];
function matches(record: AuditRecord, criteria: AuditCriteria) {
  return `${record.actor} ${record.action}`.toLocaleLowerCase().includes(criteria.search.toLocaleLowerCase())
    && (criteria.actorId === null || record.actorId === criteria.actorId)
    && (criteria.kind === null || record.kind === criteria.kind)
    && (criteria.outcome === null || record.outcome === criteria.outcome);
}
function AuditHost() {
  const operation = useDeferredAction();
  const [context, setContext] = useState(1);
  const [denied, setDenied] = useState(false);
  const [loads, setLoads] = useState(0);
  const [records, setRecords] = useState(auditRecords);
  const [query, setQuery] = useState<AuditQuery>({ pageIndex: 0, pageSize: 1, search: "", actorId: null, kind: null, outcome: null });
  const load = useCallback(async (request: AuditQuery) => {
    setLoads(value => value + 1);
    const filtered = records.filter(record => matches(record, request));
    return { data: filtered.slice(request.pageIndex * request.pageSize, (request.pageIndex + 1) * request.pageSize), total: filtered.length };
  }, [records]);
  useEffect(() => {
    window.teamTestHost = {
      resolve: operation.resolve,
      changeContext: () => setContext(value => value + 1),
      setAccess: value => setDenied(value === "denied"),
      shrinkAudit: () => { setRecords(auditRecords.slice(0, 1)); setContext(value => value + 1); },
    };
  }, [operation.resolve]);
  return <>
    <AuditViewer contextKey={`team-a:principal-${context}`} query={query} onQueryChange={setQuery} load={load} timeZone="UTC"
      actors={[{ id: "casey", label: "Casey Rowan" }, { id: "morgan", label: "Morgan Vale" }]}
      kinds={[{ id: "role", label: "Role" }, { id: "invite", label: "Invitation" }]}
      outcomes={[{ id: "denied", label: "Denied" }, { id: "complete", label: "Complete" }]}
      {...(denied ? { denied: "The host denied audit access." } : {})}
      onExport={(criteria, action) => operation.run(criteria, action)} onRefreshContext={() => setContext(value => value + 1)} />
    {operation.evidence}<output aria-label="Host loads">{loads}</output><output aria-label="Audit query">{JSON.stringify(query)}</output>
  </>;
}

const invitation: TeamInvitation = { id: "invite-a", email: "casey@example.test", roleId: "reviewers", status: "pending", revision: "1", expiresAt: "2026-11-01T12:00:00Z" };
function MembersHost() {
  const operation = useDeferredAction();
  const [context, setContext] = useState(1);
  const [invitations, setInvitations] = useState<readonly TeamInvitation[]>([invitation]);
  const load = useCallback(async () => ({ data: [], total: 0 }), []);
  useEffect(() => {
    window.teamTestHost = {
      resolve: operation.resolve,
      changeContext: () => setContext(value => value + 1),
      changeRevision: () => setInvitations(current => current.map(item => ({ ...item, revision: String(Number(item.revision) + 1) }))),
      removeInvitation: () => setInvitations([]),
      completeRevoke: () => { setInvitations([]); operation.resolve({ status: "success", message: "Revoke saved by host." }); },
    };
  }, [operation.resolve]);
  return <>
    <TeamMembers contextKey={`team-a:principal-${context}`} teamName="Fictional Cedar Studio" roles={[{ id: "reviewers", label: "Archive reviewers" }]} invitations={invitations} loadMembers={load} timeZone="UTC"
      onInvite={(draft, action) => operation.run(draft, action)} onRevoke={(record, action) => operation.run(record, action)} onResend={(record, action) => operation.run(record, action)} onRefresh={() => setContext(value => value + 1)} />
    {operation.evidence}
  </>;
}

const root = document.getElementById("root");
if (!root) throw new Error("The team administration host root is missing.");
const surface = new URLSearchParams(location.search).get("surface");
createRoot(root).render(<main><h1>Team administration host</h1>{surface === "role" ? <RoleHost /> : surface === "audit" ? <AuditHost /> : surface === "members" ? <MembersHost /> : <AcceptanceHost />}</main>);
