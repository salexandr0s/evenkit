"use client";

import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { ActionMessage, Spinner } from "./feedback.js";
import { Avatar } from "./foundations.js";
import { FormattedTimestamp } from "./formatting.js";

export interface ActivityEvent {
  id: string;
  actor: string;
  avatarSrc?: string;
  action: ReactNode;
  /** An ISO timestamp with Z or a numeric offset, never a date-only value. */
  timestamp: string;
  detail?: ReactNode;
  state?: "complete" | "pending" | "error";
  onRetry?: () => void;
}
export interface ActivityGroup { id: string; label: string; events: readonly ActivityEvent[] }
export interface ActivityTimelineProps extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  groups: readonly ActivityGroup[];
  timeZone: string;
  locale?: string;
  label?: string;
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  emptyMessage?: ReactNode;
}

/** Events remain in the host's order; grouping and pagination are application-owned. */
export function ActivityTimeline({ groups, timeZone, locale = "en", label = "Activity", loading = false, error, onRetry, emptyMessage = "No activity yet.", className, ...props }: ActivityTimelineProps) {
  const id = useId();
  const hasEvents = groups.some(group => group.events.length > 0);
  return <section {...props} className={classes("pk-activity-timeline", className)} aria-label={label}>
    <div aria-busy={loading}>
      {groups.filter(group => group.events.length).map((group, index) => <section className="pk-activity-group" key={group.id} aria-labelledby={`${id}-${index}`}>
        <h3 id={`${id}-${index}`} className="pk-activity-group-heading">{group.label}</h3>
        <ol className="pk-activity-list">{group.events.map(event => <li className="pk-activity-event" key={event.id} tabIndex={-1} data-state={event.state ?? "complete"}>
          <div className="pk-activity-avatar"><Avatar name={event.actor} {...(event.avatarSrc ? { src: event.avatarSrc } : {})} size="sm" decorative /></div>
          <div className="pk-activity-content">
            <p className="pk-activity-summary"><strong>{event.actor}</strong> {event.action}</p>
            <FormattedTimestamp className="pk-activity-time" value={event.timestamp} options={{ timeZone, locale, dateStyle: "medium", timeStyle: "short" }} />
            {event.detail ? <div className="pk-activity-detail">{event.detail}</div> : null}
            {event.state === "pending" ? <p className="pk-activity-state" role="status"><Spinner size="sm" aria-hidden="true" />Pending</p> : event.state === "error" ? <div className="pk-activity-state" role="alert"><span>Action failed.</span>{event.onRetry ? <Button variant="ghost" size="sm" onClick={click => { click.currentTarget.closest("li")?.focus(); event.onRetry?.(); }} aria-label={`Retry action by ${event.actor}`}>Retry</Button> : null}</div> : null}
          </div>
        </li>)}</ol>
      </section>)}
      {!hasEvents && !loading && !error ? <p className="pk-activity-empty">{emptyMessage}</p> : null}
    </div>
    {error ? <ActionMessage tone="error" heading="Activity could not be loaded" {...(onRetry ? { actions: <Button variant="outline" size="sm" onClick={onRetry}>Retry activity</Button> } : {})}>{error}</ActionMessage> : null}
    <div className="pk-activity-loading" role="status">{loading ? <><Spinner size="sm" aria-hidden="true" />Loading activity…</> : null}</div>
  </section>;
}
