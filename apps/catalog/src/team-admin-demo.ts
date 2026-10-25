import { useRef, useState } from "react";
import type { AuditQuery, AuditRecord, TeamActionContext, TeamActionResult, TeamInvitation, TeamMember, TeamRoleDefinition } from "@evenkit/ui";

export type DemoResponse = "success" | "error" | "denied" | "stale" | "slow";
export const demoResponses = [
  { value: "success", label: "Success" }, { value: "error", label: "Failure then retry" },
  { value: "denied", label: "Denied" }, { value: "stale", label: "Stale context" },
  { value: "slow", label: "Slow response" },
];

export function demoDelay(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Stopped waiting", "AbortError")); return; }
    const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, milliseconds);
    function abort() { window.clearTimeout(timer); reject(new DOMException("Stopped waiting", "AbortError")); }
    signal.addEventListener("abort", abort, { once: true });
  });
}

/** A local request simulator; real hosts validate, authorize and persist their own requests. */
export function useDemoAction(contextKey: string) {
  const [response, setResponse] = useState<DemoResponse>("success");
  const liveContext = useRef(contextKey);
  liveContext.current = contextKey;
  async function act({ signal }: TeamActionContext, message: string): Promise<TeamActionResult> {
    const startedIn = contextKey;
    await demoDelay(response === "slow" ? 3000 : 450, signal);
    if (signal.aborted || liveContext.current !== startedIn) throw new DOMException("Context changed", "AbortError");
    if (response === "error") { setResponse("success"); return { status: "error", message: "The fictional request failed. Your changes are ready to retry." }; }
    if (response === "denied") return { status: "denied", message: "The application denied this request. Ask the team coordinator to review your access." };
    if (response === "stale") return { status: "stale", message: "The team's access settings changed. Refresh the context before trying again." };
    return { status: "success", message };
  }
  return { response, setResponse, act };
}

export const demoRoles: readonly TeamRoleDefinition[] = [
  { id: "reviewer", label: "Reviewer", description: "Reviews research notes." },
  { id: "coordinator", label: "Release coordinator", description: "Coordinates review handovers." },
  { id: "external", label: "External collaborator for international research and archive projects", disabled: true },
];

export const demoMembers: readonly TeamMember[] = [
  { id: "mira", name: "Mira Chen", email: "mira@example.test", roleId: "coordinator", status: "active" },
  { id: "noor", name: "Noor Haddad", email: "noor@example.test", roleId: "reviewer", status: "active" },
  { id: "ines", name: "Inés da Silva Fernandes de Oliveira", email: "ines.research-and-archive@example.test", roleId: "external", status: "inactive" },
  ...Array.from({ length: 9 }, (_, index) => ({ id: `reviewer-${index}`, name: `Research colleague ${index + 1}`, email: `colleague${index + 1}@example.test`, roleId: "reviewer", status: index % 3 === 0 ? "inactive" : "active" })),
];

export const demoInvitations: readonly TeamInvitation[] = [
  { id: "invite-leo", email: "leo@example.test", roleId: "reviewer", status: "pending", revision: "1", expiresAt: "2026-11-01T18:00:00Z" },
  { id: "invite-ada", email: "ada@example.test", roleId: "coordinator", status: "expired", revision: "1", expiresAt: "2026-10-20T18:00:00Z" },
];

export const demoAudit: readonly AuditRecord[] = [
  { id: "a1", actor: "Mira Chen", actorId: "mira", action: "invited Leo to Aster Research", timestamp: "2026-10-25T10:15:00Z", kind: "invitation", outcome: "allowed", details: [{ label: "Recipient", value: "leo@example.test" }, { label: "Role", value: "Reviewer" }, { label: "Request reference", value: "local-demo-101" }] },
  { id: "a2", actor: "Noor Haddad", actorId: "noor", action: "requested a role change", timestamp: "2026-10-25T09:40:00Z", kind: "role", outcome: "denied", details: [{ label: "Application decision", value: "Role changes require coordinator approval." }, { label: "Role", value: "Release coordinator" }] },
  { id: "a3", actor: "Mira Chen", actorId: "mira", action: "updated the research review checklist", timestamp: "2026-10-24T15:20:00Z", kind: "record", outcome: "allowed", details: [{ label: "Record", value: "International research and archive handover checklist with extended review guidance" }] },
  { id: "a4", actor: "Archive worker", actorId: "worker", action: "could not complete a scheduled archive export", timestamp: "2026-10-24T12:00:00Z", kind: "export", outcome: "failed", details: [{ label: "Recorded failure", value: "The fictional archive destination was unavailable." }] },
  { id: "a5", actor: "Noor Haddad", actorId: "noor", action: "accepted a team invitation", timestamp: "2026-10-23T08:00:00Z", kind: "invitation", outcome: "allowed", details: [{ label: "Team", value: "Aster Research" }] },
  { id: "a6", actor: "Mira Chen", actorId: "mira", action: "revoked an unused invitation", timestamp: "2026-10-22T16:30:00Z", kind: "invitation", outcome: "allowed", details: [{ label: "Recipient", value: "unused@example.test" }] },
];

export function filterDemoAudit(records: readonly AuditRecord[], query: Omit<AuditQuery, "pageIndex" | "pageSize">) {
  const search = query.search.trim().toLocaleLowerCase();
  return records.filter(record => (!query.actorId || record.actorId === query.actorId) && (!query.kind || record.kind === query.kind) && (!query.outcome || record.outcome === query.outcome) && `${record.actor} ${record.action} ${record.details?.map(detail => `${detail.label} ${detail.value}`).join(" ") ?? ""}`.toLocaleLowerCase().includes(search));
}
