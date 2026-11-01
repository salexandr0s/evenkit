"use client";

import { useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Button } from "./button.js";
import { IconButton } from "./icon-button.js";
import { classes } from "./classes.js";
import { ActionMessage, Badge, Spinner, type ActionMessageTone } from "./feedback.js";
import { ClockIcon, KeyRoundIcon, RotateCcwIcon, XIcon } from "./icons.js";
import { WifiIcon } from "./icons-technology.js";

export interface FeedbackRequestContext { signal: AbortSignal; contextKey: string }
export interface BannerAction {
  id: string;
  label: string;
  /** A visible reason for denying the action. */
  unavailable?: string;
  /** Prepare work here; update current UI only in onSuccess. */
  onAction: (context: FeedbackRequestContext) => Promise<void>;
  onSuccess?: () => void;
  /** Set when success removes this banner or its focused action. */
  focusRef?: RefObject<HTMLElement | null>;
}
export interface BannerDismissal {
  label?: string;
  onDismiss: (context: FeedbackRequestContext) => Promise<void>;
  /** Remove the banner and persist dismissal only after guarded completion. */
  onDismissed: () => void;
  /** A visible focusable element outside the banner, such as the page heading. */
  focusRef: RefObject<HTMLElement | null>;
}
export interface PersistentBannerProps {
  contextKey: string;
  /** Change when the notice or its policy changes within the same context. */
  revision?: string | number;
  heading: string;
  children: ReactNode;
  tone?: ActionMessageTone;
  /** Optional decorative icon; visible text still conveys the notice's meaning. */
  icon?: ReactNode;
  actions?: readonly BannerAction[];
  dismissal?: BannerDismissal;
  /** Concise live text; the persistent content itself is not a live region. */
  announcement?: string;
  urgency?: "polite" | "assertive";
  className?: string;
}

/** In-flow persistent information. Visibility and dismissal storage belong to the host. */
export function PersistentBanner({ contextKey, revision = 0, heading, children, tone = "info", icon, actions = [], dismissal, announcement = "", urgency = "polite", className }: PersistentBannerProps) {
  const headingId = useId();
  const region = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const controls = useRef(new Map<string, HTMLButtonElement>());
  const retry = useRef<HTMLButtonElement>(null);
  const focused = useRef<HTMLElement | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [failure, setFailure] = useState<{ id: string; message: string } | null>(null);
  const [note, setNote] = useState("");
  // Stable structural identity allows inline host callbacks without aborting on every render.
  const scope = JSON.stringify([contextKey, revision, heading, actions.map(action => [action.id, action.unavailable ?? ""]), Boolean(dismissal)]);
  const latestScope = useRef(scope);
  const latest = useRef({ actions, dismissal });
  latestScope.current = scope;
  latest.current = { actions, dismissal };
  useLayoutEffect(() => {
    request.current?.abort(); request.current = null;
    setPending(null); setFailure(null); setNote("");
    return () => { request.current?.abort(); request.current = null; };
  }, [scope]);
  useLayoutEffect(() => {
    if (focused.current && !focused.current.isConnected && document.activeElement === document.body) region.current?.focus();
  });

  async function run(id: string) {
    if (request.current) return;
    const action = actions.find(item => `action:${item.id}` === id);
    const dismiss = id === "dismiss" ? dismissal : undefined;
    if ((!action && !dismiss) || action?.unavailable) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(id); setNote(`${action?.label ?? dismiss?.label ?? "Dismiss notice"} in progress.`);
    try {
      await (action ? action.onAction : dismiss!.onDismiss)({ signal: controller.signal, contextKey });
      if (controller.signal.aborted || request.current !== controller || latestScope.current !== scope) return;
      request.current = null; setPending(null);
      if (document.activeElement === retry.current) controls.current.get(id)?.focus();
      setFailure(null);
      setNote(`${action?.label ?? dismiss?.label ?? "Dismiss notice"} completed.`);
      if (dismiss) {
        if (region.current?.contains(document.activeElement)) latest.current.dismissal?.focusRef.current?.focus();
        latest.current.dismissal?.onDismissed();
      } else {
        const current = latest.current.actions.find(item => `action:${item.id}` === id);
        if (region.current?.contains(document.activeElement)) current?.focusRef?.current?.focus();
        current?.onSuccess?.();
      }
    } catch (error: unknown) {
      if (controller.signal.aborted || request.current !== controller || latestScope.current !== scope) return;
      request.current = null; setPending(null);
      const message = error instanceof Error ? error.message : "The request failed. Please try again.";
      setFailure({ id, message }); setNote(`Action failed. ${message}`);
    }
  }

  return <div ref={region} role="region" tabIndex={-1} aria-labelledby={headingId} className={classes("pk-persistent-banner", className)} onFocusCapture={event => { focused.current = event.target; }} onBlurCapture={event => {
    if (event.relatedTarget !== null) focused.current = null;
    else {
      const previous = focused.current;
      queueMicrotask(() => {
        if (focused.current === previous && previous?.isConnected && previous.ownerDocument.activeElement !== previous) focused.current = null;
      });
    }
  }}>
    <ActionMessage role="group" tone={tone} icon={icon} heading={<span id={headingId}>{heading}</span>} actions={actions.length || dismissal ? <>
      {actions.map(action => <span key={action.id} className="pk-banner-action">
        <Button ref={node => { if (node) controls.current.set(`action:${action.id}`, node); else controls.current.delete(`action:${action.id}`); }} variant="outline" size="sm" aria-disabled={pending !== null || Boolean(action.unavailable)} aria-busy={pending === `action:${action.id}` || undefined} aria-describedby={action.unavailable ? `${headingId}-${action.id}` : undefined} onClick={() => { void run(`action:${action.id}`); }}>
          {pending === `action:${action.id}` ? <Spinner size="sm" aria-hidden="true" /> : null}{action.label}
        </Button>
        {action.unavailable ? <span id={`${headingId}-${action.id}`} className="pk-banner-note">{action.unavailable}</span> : null}
      </span>)}
      {dismissal ? <IconButton ref={node => { if (node) controls.current.set("dismiss", node); else controls.current.delete("dismiss"); }} label={dismissal.label ?? "Dismiss notice"} variant="ghost" size="sm" aria-disabled={pending !== null} aria-busy={pending === "dismiss" || undefined} onClick={() => { void run("dismiss"); }}>{pending === "dismiss" ? <Spinner size="sm" aria-hidden="true" /> : <XIcon size="sm" />}</IconButton> : null}
    </> : undefined}>{children}</ActionMessage>
    {failure ? <ActionMessage role="group" tone="error" heading="Action could not be completed" actions={<Button ref={retry} variant="outline" size="sm" aria-disabled={pending !== null} aria-busy={pending === failure.id || undefined} onClick={() => { void run(failure.id); }}>Retry action</Button>}>{failure.message}</ActionMessage> : null}
    <span className="pk-visually-hidden" aria-live={urgency} aria-atomic="true">{announcement}{note ? ` ${note}` : ""}</span>
  </div>;
}

export type ConnectionState = "offline" | "reconnecting" | "stale" | "session-expiring";
export interface ConnectionStatusProps extends Omit<PersistentBannerProps, "heading" | "tone" | "announcement" | "children"> {
  state: ConnectionState;
  /** Explain the application's actual save/recovery behavior; no persistence is assumed. */
  children: ReactNode;
  heading?: string;
}
const connectionHeadings: Record<ConnectionState, string> = {
  offline: "You are offline", reconnecting: "Reconnecting", stale: "Data may be out of date", "session-expiring": "Your session is expiring",
};
export function ConnectionStatus({ state, heading = connectionHeadings[state], revision = 0, children, ...props }: ConnectionStatusProps) {
  const stateIcon = { offline: <WifiIcon />, reconnecting: <RotateCcwIcon />, stale: <ClockIcon />, "session-expiring": <KeyRoundIcon /> }[state];
  return <PersistentBanner {...props} icon={props.icon === undefined ? stateIcon : props.icon} revision={JSON.stringify([revision, state])} heading={heading} tone={state === "reconnecting" ? "info" : "warning"} announcement={heading}>{children}</PersistentBanner>;
}

export interface PresenceIndicatorProps {
  state: "online" | "away" | "busy" | "offline";
  /** Visible text, including the person's name when needed. */
  label: string;
  className?: string;
}
export function PresenceIndicator({ state, label, className }: PresenceIndicatorProps) {
  return <span className={classes("pk-presence-indicator", className)} data-state={state}><span className="pk-presence-dot" aria-hidden="true" />{label}</span>;
}

export interface UnreadIndicatorProps {
  count: number;
  /** Exact text alternative, useful for localization and counts above the visual cap. */
  label?: string;
  className?: string;
}
export function UnreadIndicator({ count, label, className }: UnreadIndicatorProps) {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  return <span className={classes("pk-unread-indicator", className)}><Badge dir="ltr" tone={safeCount ? "accent" : "neutral"} aria-hidden="true">{safeCount > 99 ? "99+" : safeCount}</Badge><span className="pk-visually-hidden">{label ?? `${safeCount} unread ${safeCount === 1 ? "notification" : "notifications"}`}</span></span>;
}
