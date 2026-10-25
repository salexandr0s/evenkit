"use client";

import { useId } from "react";
import { Button } from "./button.js";
import { CheckIcon, CircleIcon } from "./icons.js";
import { Checkbox } from "./selection-controls.js";

export interface NotificationAction { id: string; label: string; unavailable?: string }
export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  read: boolean;
  /** An ISO timestamp and its application-localized visible label. */
  timestamp?: string;
  timestampLabel?: string;
  /** The application determines whether this notification can be marked read/unread. */
  readOnlyReason?: string;
  actions?: readonly NotificationAction[];
}
export interface NotificationGroup { id: string; label: string; items: readonly NotificationItem[] }
export interface NotificationPage { groups: readonly NotificationGroup[]; page: number; pageCount: number }
export interface NotificationRequestContext { signal: AbortSignal; contextKey: string }
export type NotificationOperation =
  | { type: "read"; ids: readonly string[]; read: boolean }
  | { type: "action"; notificationId: string; actionId: string };
export interface NotificationListProps {
  groups: readonly NotificationGroup[];
  selectedIds?: readonly string[];
  onSelectionChange?: (id: string, selected: boolean) => void;
  onReadChange?: (id: string, read: boolean) => void;
  onAction?: (notificationId: string, actionId: string) => void;
  busy?: boolean;
  disabled?: boolean;
}

/** A native grouped list. Reading or focusing a row never changes its read state. */
export function NotificationList({ groups, selectedIds = [], onSelectionChange, onReadChange, onAction, busy = false, disabled = false }: NotificationListProps) {
  const id = useId();
  return <div className="pk-notification-list">
    {groups.filter(group => group.items.length > 0).map((group, index) => <section className="pk-notification-group" key={group.id} aria-labelledby={`${id}-${index}`}>
      <h3 className="pk-notification-group-title" id={`${id}-${index}`}>{group.label}</h3>
      <ul>{group.items.map((item, itemIndex) => <li className="pk-notification-item" key={item.id} data-unread={!item.read || undefined} data-selected={selectedIds.includes(item.id) || undefined}>
        {onSelectionChange ? <Checkbox aria-label={`Select ${item.title}`} checked={selectedIds.includes(item.id)} disabled={disabled || Boolean(item.readOnlyReason)} aria-describedby={item.readOnlyReason ? `${id}-${index}-${itemIndex}-reason` : undefined} aria-disabled={busy || undefined} onCheckedChange={checked => { if (!busy) onSelectionChange(item.id, checked === true); }} /> : null}
        <div className="pk-notification-content">
          <div className="pk-notification-title-row"><h4 className="pk-notification-title">{item.title}</h4><span className="pk-notification-read-state">{item.read ? <CheckIcon size="sm" /> : <CircleIcon size="sm" />} {item.read ? "Read" : "Unread"}</span></div>
          {item.description ? <p className="pk-notification-description">{item.description}</p> : null}
          {item.readOnlyReason ? <p className="pk-notification-reason" id={`${id}-${index}-${itemIndex}-reason`}>{item.readOnlyReason}</p> : null}
          <div className="pk-notification-item-footer">
            {item.timestamp && item.timestampLabel ? <time className="pk-notification-time" dateTime={item.timestamp}>{item.timestampLabel}</time> : null}
            {onReadChange || item.actions?.length ? <div className="pk-notification-actions">
            {onReadChange ? <Button size="sm" variant="ghost" disabled={disabled || Boolean(item.readOnlyReason)} aria-describedby={item.readOnlyReason ? `${id}-${index}-${itemIndex}-reason` : undefined} aria-disabled={busy || undefined} aria-label={`Mark ${item.title} as ${item.read ? "unread" : "read"}`} onClick={() => { if (!busy) onReadChange(item.id, !item.read); }}>{item.read ? "Mark as unread" : "Mark as read"}</Button> : null}
            {item.actions?.map((action, actionIndex) => <div className="pk-notification-action" key={action.id}><Button size="sm" variant="outline" disabled={disabled || !onAction || Boolean(action.unavailable)} aria-describedby={action.unavailable ? `${id}-${index}-${itemIndex}-${actionIndex}-reason` : undefined} aria-disabled={busy || undefined} aria-label={`${action.label}: ${item.title}`} onClick={() => { if (!busy) onAction?.(item.id, action.id); }}>{action.label}</Button>{action.unavailable ? <span className="pk-notification-reason" id={`${id}-${index}-${itemIndex}-${actionIndex}-reason`}>{action.unavailable}</span> : null}</div>)}
            </div> : null}
          </div>
        </div>
      </li>)}</ul>
    </section>)}
  </div>;
}
