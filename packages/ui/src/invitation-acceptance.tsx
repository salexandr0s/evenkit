"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./button.js";
import { ActionMessage, Badge } from "./feedback.js";
import { FormattedTimestamp } from "./formatting.js";
import type { TeamActionContext, TeamActionResult } from "./team-admin-types.js";
import { useTeamAction } from "./use-team-action.js";

export type InvitationAcceptanceStatus = "ready" | "signed-out" | "account-mismatch" | "expired" | "revoked" | "already-accepted";
export interface AcceptanceInvitation {
  id: string;
  revision: string;
  teamName: string;
  email: string;
  roleLabel?: string;
  expiresAt?: string;
  /** The application verifies identity, validity and membership before supplying this state. */
  status: InvitationAcceptanceStatus;
}
export interface InvitationAcceptanceProps {
  /** Include the team, authenticated principal and policy revision. Never include a secret token. */
  contextKey: string;
  invitation: AcceptanceInvitation;
  currentAccountLabel?: string;
  timeZone: string;
  locale?: string;
  deniedReason?: string;
  onAccept: (invitationId: string, context: TeamActionContext & { revision: string }) => Promise<TeamActionResult>;
  onSignIn?: () => void;
  onSwitchAccount?: () => void;
  onRequestReplacement?: () => void;
  onContinue?: () => void;
  /** Fetch fresh invitation and account state, then change revision/contextKey. */
  onReload?: () => void;
}

const invitationMessages: Record<InvitationAcceptanceStatus, { title: string; message: string }> = {
  ready: { title: "Accept invitation", message: "Review the team and account before joining." },
  "signed-out": { title: "Sign in to accept", message: "Sign in with the account this invitation was sent to." },
  "account-mismatch": { title: "Use the invited account", message: "The signed-in account cannot accept this invitation. Switch accounts to continue." },
  expired: { title: "Invitation expired", message: "This invitation can no longer be accepted. Ask the team for a new invitation." },
  revoked: { title: "Invitation revoked", message: "The team withdrew this invitation. Contact the team if you still need access." },
  "already-accepted": { title: "Invitation already accepted", message: "This invitation has already been used. Continue using the account that joined the team." },
};

/** Identity checks, token handling and joining the team belong to the application. */
export function InvitationAcceptance(props: InvitationAcceptanceProps) {
  const scope = JSON.stringify([props.contextKey, props.invitation, props.currentAccountLabel, props.deniedReason]);
  const [seen, setSeen] = useState({ scope, changed: false });
  if (seen.scope !== scope) setSeen({ scope, changed: true });
  return <AcceptancePanel key={scope} {...props} scope={scope} contextChanged={seen.changed} />;
}

function AcceptancePanel({ invitation, contextKey, currentAccountLabel, timeZone, locale = "en", deniedReason, onAccept, onSignIn, onSwitchAccount, onRequestReplacement, onContinue, onReload, scope, contextChanged }: InvitationAcceptanceProps & { scope: string; contextChanged: boolean }) {
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const accept = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const action = useTeamAction(scope);
  const [uncertain, setUncertain] = useState(false);
  const [note, setNote] = useState(contextChanged ? "Invitation details changed. Review them before continuing." : "");
  const previousPending = useRef(false);
  const success = action.result?.status === "success";
  const stale = action.result?.status === "stale" || uncertain;
  const denied = Boolean(deniedReason) || action.result?.status === "denied";
  const canAccept = invitation.status === "ready" && !denied && !stale && !success;
  const message = success ? { title: "Invitation accepted", message: "You have joined the team." } : invitationMessages[invitation.status];

  useLayoutEffect(() => { if (contextChanged) heading.current?.focus(); }, [contextChanged]);
  useLayoutEffect(() => {
    if (action.pending) cancel.current?.focus();
    else if (previousPending.current) {
      if (canAccept) accept.current?.focus(); else heading.current?.focus();
    }
    previousPending.current = action.pending;
  }, [action.pending, canAccept]);

  async function join() {
    if (!canAccept || action.pending) return;
    setNote("");
    await action.run(context => onAccept(invitation.id, { ...context, contextKey, revision: invitation.revision }));
  }
  function stopWaiting() {
    action.cancel();
    setUncertain(true);
    setNote("Stopped waiting for acceptance. Reload the invitation to check whether you joined before trying again.");
  }

  return <section className="pk-invitation-acceptance" aria-labelledby={headingId}>
    <header className="pk-invitation-heading">
      <Badge tone={success || invitation.status === "already-accepted" ? "success" : invitation.status === "ready" ? "accent" : "warning"}>Team invitation</Badge>
      <h2 id={headingId} ref={heading} tabIndex={-1}>{message.title}</h2>
      <p>{message.message}</p>
    </header>
    <dl className="pk-invitation-details">
      <div><dt>Team</dt><dd>{invitation.teamName}</dd></div>
      <div><dt>Invited account</dt><dd><bdi>{invitation.email}</bdi></dd></div>
      {invitation.roleLabel ? <div><dt>Role</dt><dd>{invitation.roleLabel}</dd></div> : null}
      {currentAccountLabel ? <div><dt>Signed in as</dt><dd><bdi>{currentAccountLabel}</bdi></dd></div> : null}
      {invitation.expiresAt ? <div><dt>Expires</dt><dd><FormattedTimestamp value={invitation.expiresAt} options={{ timeZone, locale, dateStyle: "medium", timeStyle: "short" }} /></dd></div> : null}
    </dl>
    {deniedReason ? <ActionMessage tone="warning" heading="Acceptance unavailable">{deniedReason}</ActionMessage> : null}
    {action.result ? <ActionMessage tone={success ? "success" : action.result.status === "error" ? "error" : "warning"} heading={success ? "You joined the team" : action.result.status === "denied" ? "Acceptance denied" : action.result.status === "stale" ? "Invitation changed" : "Could not accept invitation"}>{action.result.message ?? "Invitation accepted."}</ActionMessage> : null}
    {note ? <ActionMessage tone={uncertain ? "warning" : "info"}>{note}</ActionMessage> : null}
    <div className="pk-invitation-actions">
      {canAccept ? <Button ref={accept} loading={action.pending} onClick={() => { void join(); }}>{action.result?.status === "error" ? "Retry acceptance" : "Accept invitation"}</Button> : null}
      {action.pending ? <Button ref={cancel} variant="outline" onClick={stopWaiting}>Stop waiting</Button> : null}
      {invitation.status === "signed-out" && onSignIn ? <Button onClick={onSignIn}>Sign in</Button> : null}
      {invitation.status === "account-mismatch" && onSwitchAccount ? <Button onClick={onSwitchAccount}>Switch account</Button> : null}
      {(invitation.status === "expired" || invitation.status === "revoked") && onRequestReplacement ? <Button variant="outline" onClick={onRequestReplacement}>Request new invitation</Button> : null}
      {(success || invitation.status === "already-accepted") && onContinue ? <Button onClick={onContinue}>Continue to team</Button> : null}
      {(stale || denied) && onReload ? <Button variant="outline" onClick={onReload}>Reload invitation</Button> : null}
    </div>
    {action.pending ? <p className="pk-invitation-note" role="status">Accepting invitation…</p> : null}
  </section>;
}
