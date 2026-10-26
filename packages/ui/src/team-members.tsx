"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./button.js";
import { DataTable, type DataTableColumn } from "./data-table.js";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog.js";
import { ActionMessage, Badge } from "./feedback.js";
import { TextField } from "./field.js";
import { FormattedTimestamp } from "./formatting.js";
import { Avatar } from "./foundations.js";
import { MailIcon, UserPlusIcon } from "./icons.js";
import { useRemoteTable, type DataTableQuery, type RemoteTableResult } from "./remote-table.js";
import { SelectField } from "./select.js";
import type { TeamActionContext, TeamActionResult, TeamRoleDefinition } from "./team-admin-types.js";
import { useTeamAction } from "./use-team-action.js";

export interface TeamMember { id: string; name: string; email: string; roleId: string; status: string }
export interface TeamMemberFilters { roleId: string; status: string }
export interface TeamMemberStatus { id: string; label: string }
export interface TeamInvitation {
  id: string;
  email: string;
  roleId: string;
  status: "pending" | "expired" | "revoked" | "accepted";
  /** Change this whenever the invitation changes, including delivery or policy revisions. */
  revision: string;
  expiresAt: string;
}
export interface TeamInviteDraft { email: string; roleId: string }
export interface TeamMembersProps {
  /** Include team, signed-in account and policy revisions. */
  contextKey: string;
  teamName: string;
  roles: readonly TeamRoleDefinition[];
  memberStatuses?: readonly TeamMemberStatus[];
  /** Memoize this callback. Validate API responses and authorize access in the application. */
  loadMembers: (query: DataTableQuery, filters: TeamMemberFilters, context: TeamActionContext) => Promise<RemoteTableResult<TeamMember>>;
  /** Complete authorized collection; invitation search, filters and pagination run locally. */
  invitations: readonly TeamInvitation[];
  onInvite?: (draft: TeamInviteDraft, context: TeamActionContext) => Promise<TeamActionResult>;
  onResend?: (invitation: TeamInvitation, context: TeamActionContext) => Promise<TeamActionResult>;
  onRevoke?: (invitation: TeamInvitation, context: TeamActionContext) => Promise<TeamActionResult>;
  /** Refresh the application's controlled invitations after cancellation or stale feedback. */
  onRefresh?: () => void;
  inviteUnavailable?: string;
  /** Presentation hint only. The host must authorize every mutation independently. */
  invitationActionUnavailable?: (invitation: TeamInvitation, action: "resend" | "revoke") => string | undefined;
  timeZone: string;
  locale?: string;
}

type TeamDialog = { kind: "invite"; scope: string } | { kind: "resend" | "revoke"; scope: string; invitation: TeamInvitation };
const initialQuery: DataTableQuery = { pageIndex: 0, pageSize: 10, search: "", sort: null };
const statusLabels: Record<TeamInvitation["status"], string> = { pending: "Pending", expired: "Expired", revoked: "Revoked", accepted: "Accepted" };

function invitationKey(invitation: TeamInvitation | undefined): string {
  return invitation ? JSON.stringify([invitation.id, invitation.revision, invitation.email, invitation.roleId, invitation.status, invitation.expiresAt]) : "missing";
}

/** The host owns data and mutations; a visible or enabled action never grants permission. */
export function TeamMembers({ contextKey, teamName, roles, memberStatuses = [], loadMembers, invitations, onInvite, onResend, onRevoke, onRefresh, inviteUnavailable, invitationActionUnavailable, timeZone, locale = "en" }: TeamMembersProps) {
  const headingId = useId();
  const formId = useId();
  const [query, setQuery] = useState<DataTableQuery>(initialQuery);
  const [filters, setFilters] = useState<TeamMemberFilters>({ roleId: "", status: "" });
  const [invitationStatus, setInvitationStatus] = useState("all");
  const [dialog, setDialog] = useState<TeamDialog | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TeamInviteDraft>({ email: "", roleId: "" });
  const [errors, setErrors] = useState<{ email?: string | undefined; roleId?: string | undefined }>({});
  const [notice, setNotice] = useState<{ tone: "success" | "info" | "warning"; text: string; refresh?: boolean } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const roleInput = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const previousContext = useRef(contextKey);
  const previousPending = useRef(false);
  const roleScope = JSON.stringify(roles);
  const currentInvitation = dialog && dialog.kind !== "invite" ? invitations.find(item => item.id === dialog.invitation.id) : undefined;
  const unavailable = dialog?.kind === "invite" ? inviteUnavailable : dialog && currentInvitation ? invitationActionUnavailable?.(currentInvitation, dialog.kind) : undefined;
  const availableCallback = dialog?.kind === "invite" ? !!onInvite : dialog?.kind === "resend" ? !!onResend : !!onRevoke;
  const scope = JSON.stringify([contextKey, roleScope, unavailable ?? "", availableCallback, dialog?.kind === "invite" ? "invite" : invitationKey(currentInvitation)]);
  const stale = open && dialog !== null && dialog.scope !== scope;
  const action = useTeamAction(scope);
  const load = useCallback((nextQuery: DataTableQuery, context: { signal: AbortSignal }) => loadMembers(nextQuery, filters, { ...context, contextKey }), [loadMembers, filters, contextKey]);
  const members = useRemoteTable({ query, contextKey: JSON.stringify([contextKey, filters]), load });

  useLayoutEffect(() => {
    if (previousContext.current === contextKey) return;
    previousContext.current = contextKey;
    setQuery(initialQuery); setFilters({ roleId: "", status: "" }); setInvitationStatus("all");
    setNotice({ tone: "warning", text: "The team or account changed. Review the current members and invitations.", refresh: true });
  }, [contextKey]);
  useLayoutEffect(() => {
    const roleId = roles.some(role => role.id === filters.roleId) ? filters.roleId : "";
    const status = memberStatuses.some(option => option.id === filters.status) ? filters.status : "";
    if (roleId === filters.roleId && status === filters.status) return;
    setFilters({ roleId, status });
    setQuery(current => ({ ...current, pageIndex: 0 }));
  }, [roles, memberStatuses, filters]);
  useLayoutEffect(() => {
    if (!stale) return;
    setOpen(false);
    setErrors({});
    setNotice({ tone: "warning", text: "The invitation or available actions changed. Refresh and review the details before trying again.", refresh: true });
  }, [stale]);
  useLayoutEffect(() => {
    if (action.pending) cancelButton.current?.focus();
    else if (previousPending.current && open) submitButton.current?.focus();
    previousPending.current = action.pending;
  }, [action.pending, open]);

  function refresh() { members.retry(); onRefresh?.(); setNotice({ tone: "info", text: "Refresh requested. Review the current invitation state." }); }
  function changeFilter(next: TeamMemberFilters) { setFilters(next); setQuery(current => ({ ...current, pageIndex: 0 })); }
  function restoreFocus() {
    const target = trigger.current;
    if (target?.isConnected && !target.disabled) target.focus();
    else heading.current?.focus();
  }
  function close() {
    if (action.pending) setNotice({ tone: "info", text: "Stopped waiting. Refresh to check the latest invitation state.", refresh: true });
    action.cancel(); setOpen(false);
  }
  function showInvite(button: HTMLButtonElement) {
    if (!onInvite || inviteUnavailable) return;
    trigger.current = button; action.reset(); setNotice(null); setErrors({}); setDraft({ email: "", roleId: "" });
    setDialog({ kind: "invite", scope: JSON.stringify([contextKey, roleScope, inviteUnavailable ?? "", true, "invite"]) }); setOpen(true);
  }
  function showInvitation(kind: "resend" | "revoke", invitation: TeamInvitation, button: HTMLButtonElement) {
    const denied = invitationActionUnavailable?.(invitation, kind);
    if (denied || (kind === "resend" ? !onResend : !onRevoke) || !["pending", "expired"].includes(invitation.status)) return;
    trigger.current = button; action.reset(); setNotice(null); setErrors({});
    setDialog({ kind, invitation: { ...invitation }, scope: JSON.stringify([contextKey, roleScope, denied ?? "", true, invitationKey(invitation)]) }); setOpen(true);
  }
  async function submit() {
    if (!dialog || !open || stale || action.pending || unavailable || !availableCallback) return;
    let operation: ((context: TeamActionContext) => Promise<TeamActionResult>) | undefined;
    if (dialog.kind === "invite" && onInvite) {
      const email = draft.email.trim();
      const nextErrors: typeof errors = {};
      if (!email || emailInput.current?.validity.typeMismatch) nextErrors.email = "Enter an email address, such as name@example.com.";
      if (!roles.some(role => role.id === draft.roleId && !role.disabled)) nextErrors.roleId = "Choose an available role.";
      setErrors(nextErrors);
      if (nextErrors.email || nextErrors.roleId) { if (nextErrors.email) emailInput.current?.focus(); else roleInput.current?.focus(); return; }
      operation = context => onInvite({ email, roleId: draft.roleId }, { ...context, contextKey });
    } else if (dialog.kind !== "invite" && currentInvitation && invitationKey(currentInvitation) === invitationKey(dialog.invitation)) {
      const callback = dialog.kind === "resend" ? onResend : onRevoke;
      if (callback) operation = context => callback({ ...dialog.invitation }, { ...context, contextKey });
    }
    if (!operation) return;
    const outcome = await action.run(operation);
    if (outcome?.status === "success") {
      setOpen(false);
      setNotice({ tone: "success", text: outcome.message ?? (dialog.kind === "invite" ? "Invitation sent." : dialog.kind === "resend" ? "Invitation resent." : "Invitation revoked.") });
      members.retry();
    }
  }
  const roleLabel = (id: string) => roles.find(role => role.id === id)?.label ?? id;
  const memberColumns: readonly DataTableColumn<TeamMember>[] = [
    { id: "name", header: "Member", accessor: member => member.name, cell: member => <div className="pk-team-person"><Avatar name={member.name} size="sm" decorative /><div className="pk-team-identity"><strong>{member.name}</strong><span>{member.email}</span></div></div>, hideable: false },
    { id: "role", header: "Role", accessor: member => roleLabel(member.roleId), cell: member => <span className="pk-team-role">{roleLabel(member.roleId)}</span> },
    { id: "status", header: "Status", accessor: member => memberStatuses.find(status => status.id === member.status)?.label ?? member.status, cell: member => <span className="pk-team-member-status">{memberStatuses.find(status => status.id === member.status)?.label ?? member.status}</span> },
  ];
  const invitationColumns: readonly DataTableColumn<TeamInvitation>[] = [
    { id: "email", header: "Email", accessor: invitation => invitation.email, cell: invitation => <span className="pk-team-invited-email">{invitation.email}</span>, hideable: false },
    { id: "role", header: "Role", accessor: invitation => roleLabel(invitation.roleId), cell: invitation => <span className="pk-team-role">{roleLabel(invitation.roleId)}</span> },
    { id: "status", header: "Status", accessor: invitation => statusLabels[invitation.status], cell: invitation => <Badge tone={invitation.status === "pending" ? "accent" : invitation.status === "expired" ? "warning" : "neutral"}>{statusLabels[invitation.status]}</Badge> },
    { id: "expiresAt", header: "Expires", accessor: invitation => invitation.expiresAt, cell: invitation => <span className="pk-team-expiration"><FormattedTimestamp value={invitation.expiresAt} options={{ locale, timeZone, dateStyle: "medium", timeStyle: "short" }} /></span> },
    { id: "actions", header: "Actions", accessor: () => "", sortable: false, searchable: false, cell: invitation => <div className="pk-team-row-actions">{(["resend", "revoke"] as const).map(kind => {
      const callback = kind === "resend" ? onResend : onRevoke;
      if (!callback || !["pending", "expired"].includes(invitation.status)) return null;
      const reason = invitationActionUnavailable?.(invitation, kind);
      return <div className="pk-team-action-hint" key={kind}><Button size="sm" variant={kind === "revoke" ? "ghost" : "outline"} disabled={!!reason} aria-label={`${kind === "resend" ? "Resend" : "Revoke"} invitation for ${invitation.email}`} onClick={event => showInvitation(kind, invitation, event.currentTarget)}>{kind === "resend" ? "Resend" : "Revoke"}</Button>{reason ? <span>{reason}</span> : null}</div>;
    })}</div> },
  ];
  const title = dialog?.kind === "invite" ? "Invite a member" : dialog?.kind === "resend" ? "Resend invitation" : "Revoke invitation";
  const actionLabel = dialog?.kind === "invite" ? "Send invitation" : dialog?.kind === "resend" ? "Resend invitation" : "Revoke invitation";
  const retryable = action.result?.status === "error";
  const blocked = action.result?.status === "denied" || action.result?.status === "stale";
  return <section className="pk-team-members" aria-labelledby={headingId}>
    <div className="pk-team-header"><div><span className="pk-team-eyebrow">Team directory</span><h2 ref={heading} id={headingId} tabIndex={-1}>Members of {teamName}</h2><p>Find people, review their roles and manage invitations.</p></div>{onInvite ? <Button startIcon={<UserPlusIcon size="sm" />} disabled={!!inviteUnavailable} onClick={event => showInvite(event.currentTarget)}>Invite member</Button> : null}</div>
    {inviteUnavailable ? <ActionMessage tone="info">{inviteUnavailable}</ActionMessage> : null}
    {notice ? <ActionMessage tone={notice.tone} actions={notice.refresh ? <Button variant="outline" size="sm" onClick={refresh}>Refresh team</Button> : undefined}>{notice.text}</ActionMessage> : null}
    <DataTable className="pk-team-directory" data={members.data} columns={memberColumns} getRowId={member => member.id} caption="Team members" searchLabel="Search members" remote={{ query, total: members.total, onQueryChange: setQuery }} loading={members.loading} error={members.error} onRetry={members.retry} emptyTitle="No members match" emptyDescription="Try another search or filter." toolbar={<div className="pk-team-filters">
      <SelectField label="Role" aria-label="Filter members by role" controlSize="sm" value={filters.roleId ? `role:${filters.roleId}` : "all"} options={[{ value: "all", label: "All roles" }, ...roles.map(role => ({ value: `role:${role.id}`, label: role.label }))]} onValueChange={value => changeFilter({ ...filters, roleId: value === "all" ? "" : value.slice(5) })} />
      {memberStatuses.length ? <SelectField label="Status" aria-label="Filter members by status" controlSize="sm" value={filters.status ? `status:${filters.status}` : "all"} options={[{ value: "all", label: "All statuses" }, ...memberStatuses.map(status => ({ value: `status:${status.id}`, label: status.label }))]} onValueChange={value => changeFilter({ ...filters, status: value === "all" ? "" : value.slice(7) })} /> : null}
    </div>} />
    <div className="pk-team-invitations">
      <div className="pk-team-invitations-heading"><span className="pk-team-section-icon" aria-hidden="true"><MailIcon /></span><div><h3>Invitations <Badge tone="neutral">{invitations.filter(invitation => invitation.status === "pending").length} pending</Badge></h3><p>Track invitations and send a reminder when needed.</p></div></div>
      <DataTable className="pk-team-directory" data={invitations.filter(invitation => invitationStatus === "all" || invitation.status === invitationStatus)} columns={invitationColumns} getRowId={invitation => invitation.id} caption="Team invitations" searchLabel="Search invitations" emptyTitle="No matching invitations" emptyDescription="Try another search or status, or invite a member." toolbar={<SelectField label="Status" aria-label="Filter invitations by status" controlSize="sm" value={invitationStatus} options={[{ value: "all", label: "All statuses" }, ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))]} onValueChange={setInvitationStatus} />} />
    </div>
    <Dialog open={open && !stale} onOpenChange={next => { if (!next) close(); }}>
      <DialogContent className="pk-team-dialog" onOpenAutoFocus={event => { event.preventDefault(); if (dialog?.kind === "invite") emailInput.current?.focus(); else cancelButton.current?.focus(); }} onCloseAutoFocus={event => { event.preventDefault(); restoreFocus(); }} onInteractOutside={event => { if (dialog?.kind === "revoke") event.preventDefault(); }}>
        <DialogHeader><span className="pk-team-section-icon" aria-hidden="true">{dialog?.kind === "invite" ? <UserPlusIcon /> : <MailIcon />}</span><DialogTitle>{title}</DialogTitle><DialogDescription>{dialog?.kind === "invite" ? `Send an invitation to join ${teamName}.` : dialog?.kind === "resend" ? `Send another invitation to ${dialog.invitation.email}.` : `Revoke the invitation for ${dialog?.invitation.email ?? "this address"}. They will need a new invitation to join.`}</DialogDescription></DialogHeader>
        <DialogBody>
          {dialog?.kind === "invite" ? <form id={formId} className="pk-team-invite-form" noValidate onSubmit={event => { event.preventDefault(); void submit(); }} aria-label="Invite a member">
            <TextField ref={emailInput} label="Email address" type="email" autoComplete="email" required value={draft.email} error={errors.email} disabled={action.pending || blocked} onChange={event => { setDraft(current => ({ ...current, email: event.target.value })); setErrors(current => ({ ...current, email: undefined })); }} />
            <SelectField ref={roleInput} label="Invitation role" required placeholder="Choose a role" value={draft.roleId} error={errors.roleId} disabled={action.pending || blocked} options={roles.map(role => ({ value: role.id, label: role.label, ...(role.description ? { description: role.description } : {}), disabled: role.disabled ?? false }))} onValueChange={roleId => { setDraft(current => ({ ...current, roleId })); setErrors(current => ({ ...current, roleId: undefined })); }} />
          </form> : <dl className="pk-team-confirm-detail"><div><dt>Team</dt><dd>{teamName}</dd></div><div><dt>Role</dt><dd>{dialog ? roleLabel(dialog.invitation.roleId) : ""}</dd></div></dl>}
          {action.pending ? <p role="status" className="pk-team-note">Waiting for the application… You can stop waiting, then refresh to check the result.</p> : null}
          {action.result && action.result.status !== "success" ? <ActionMessage tone={action.result.status === "error" ? "error" : "warning"} heading={action.result.status === "denied" ? "Action not allowed" : action.result.status === "stale" ? "Details changed" : "Invitation action failed"} actions={blocked ? <Button variant="outline" size="sm" onClick={() => { close(); refresh(); }}>Refresh team</Button> : undefined}>{action.result.message}</ActionMessage> : null}
        </DialogBody>
        <DialogFooter><Button ref={cancelButton} variant="outline" onClick={close}>{action.pending ? "Stop waiting" : "Cancel"}</Button><Button ref={submitButton} variant={dialog?.kind === "revoke" ? "destructive" : "primary"} disabled={action.pending || blocked || stale} {...(dialog?.kind === "invite" ? { type: "submit", form: formId } : { onClick: () => { void submit(); } })}>{retryable ? "Retry invitation action" : actionLabel}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </section>;
}
