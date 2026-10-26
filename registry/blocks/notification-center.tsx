"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { ActionMessage, Button, CheckIcon, Checkbox, EmptyState, IconButton, InboxIcon, MailIcon, NotificationList, Pagination, Spinner, UnreadIndicator, type NotificationGroup, type NotificationOperation, type NotificationPage, type NotificationRequestContext } from "@evenkit/ui";

export interface NotificationCenterProps extends NotificationPage {
  /** Change for account, workspace, filter, or other security/context boundaries. */
  contextKey: string;
  /** Change when fresh host data supersedes an in-flight request. */
  revision?: string | number;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  /** Persist/prepare only. Commit client state in onCommit after the stale-result guard. */
  onOperation: (operation: NotificationOperation, context: NotificationRequestContext) => Promise<void>;
  onCommit: (operation: NotificationOperation) => void;
  onLoadPage: (page: number, context: NotificationRequestContext) => Promise<NotificationPage>;
  onPageLoaded: (result: NotificationPage) => void;
}
type Task = { type: "page"; page: number } | { type: "operation"; operation: NotificationOperation };

function dataIdentity(groups: readonly NotificationGroup[]) {
  return groups.map(group => [group.id, group.items.map(item => [item.id, item.read, item.readOnlyReason, item.actions?.map(action => [action.id, action.unavailable])])]);
}

/** Selection and every bulk action apply only to eligible items on the visible page. */
export function NotificationCenter({ groups, page, pageCount, contextKey, revision = 0, title = "Notifications", disabled = false, loading = false, error, onOperation, onCommit, onLoadPage, onPageLoaded }: NotificationCenterProps) {
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const focused = useRef<HTMLElement | null>(null);
  const request = useRef<AbortController | null>(null);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [pending, setPending] = useState<Task | null>(null);
  const [failure, setFailure] = useState<{ task: Task; message: string } | null>(null);
  const [note, setNote] = useState("");
  const items = groups.flatMap(group => group.items);
  const eligible = disabled ? [] : items.filter(item => !item.readOnlyReason);
  const selectedIds = selected.filter(id => eligible.some(item => item.id === id));
  const unreadIds = eligible.filter(item => !item.read).map(item => item.id);
  const pageUnreadCount = items.filter(item => !item.read).length;
  const requestKey = JSON.stringify([contextKey, revision, page, pageCount, disabled, dataIdentity(groups)]);
  const committedKey = useRef(requestKey);
  const scopeKey = JSON.stringify([contextKey, page]);
  const previousScope = useRef(scopeKey);
  const previousContext = useRef(contextKey);
  const busy = pending !== null || loading;

  useLayoutEffect(() => {
    committedKey.current = requestKey;
    if (request.current) {
      request.current.abort(); request.current = null; setPending(null);
      setNote("Notifications changed. The pending action was cancelled.");
    }
    setFailure(null);
    if (previousScope.current !== scopeKey) {
      previousScope.current = scopeKey; setSelected([]);
    } else setSelected(current => current.filter(id => eligible.some(item => item.id === id)));
    if (previousContext.current !== contextKey) { previousContext.current = contextKey; setNote(""); }
  }, [requestKey, scopeKey]);
  useLayoutEffect(() => () => { request.current?.abort(); request.current = null; }, []);
  useLayoutEffect(() => {
    const last = focused.current;
    if (last && (!last.isConnected || last.matches(":disabled")) && (document.activeElement === document.body || document.activeElement === last)) {
      heading.current?.focus(); focused.current = heading.current;
    }
  });

  function allowed(task: Task) {
    if (disabled || loading) return false;
    if (task.type === "page") return task.page >= 1 && task.page <= Math.max(1, pageCount);
    const operation = task.operation;
    if (operation.type === "read") return operation.ids.length > 0 && operation.ids.every(id => eligible.some(item => item.id === id));
    return items.some(item => item.id === operation.notificationId && item.actions?.some(action => action.id === operation.actionId && !action.unavailable));
  }
  async function run(task: Task) {
    if (request.current || !allowed(task)) return;
    const controller = new AbortController();
    const key = requestKey;
    request.current = controller; setPending(task); setNote("");
    const context = { signal: controller.signal, contextKey };
    try {
      const result = task.type === "page" ? await onLoadPage(task.page, context) : await onOperation(task.operation, context);
      if (controller.signal.aborted || request.current !== controller || committedKey.current !== key) return;
      if (task.type === "page" && (!result || result.page !== task.page || !Number.isInteger(result.pageCount) || result.pageCount < 0 || result.page > Math.max(1, result.pageCount))) {
        throw new Error("The response did not match the requested page. Retry to load notifications.");
      }
      request.current = null; setPending(null); setFailure(null);
      if (task.type === "page" && result) {
        onPageLoaded(result); setNote(`Page ${result.page} loaded.`);
      } else if (task.type === "operation") {
        onCommit(task.operation);
        setNote(task.operation.type === "read" ? `${task.operation.ids.length} ${task.operation.ids.length === 1 ? "notification" : "notifications"} marked as ${task.operation.read ? "read" : "unread"}.` : "Notification action completed.");
      }
    } catch (cause: unknown) {
      if (controller.signal.aborted || request.current !== controller || committedKey.current !== key) return;
      request.current = null; setPending(null);
      setFailure({ task, message: cause instanceof Error ? cause.message : "The request failed. Try again." });
    }
  }
  function mark(ids: readonly string[], read: boolean) { void run({ type: "operation", operation: { type: "read", ids: [...ids], read } }); }
  const selectionState = selectedIds.length === 0 ? false : selectedIds.length === eligible.length ? true : "indeterminate";

  return <section className="pk-notification-center" aria-labelledby={headingId} onFocusCapture={event => { if (event.target instanceof HTMLElement) focused.current = event.target; }}>
    <header className="pk-notification-header">
      <span className="pk-notification-header-icon" aria-hidden="true"><InboxIcon size="lg" /></span>
      <div className="pk-notification-header-content">
        <div className="pk-notification-heading-row"><h2 id={headingId} ref={heading} tabIndex={-1} className="pk-notification-center-heading">{title}</h2><UnreadIndicator count={pageUnreadCount} label={`${pageUnreadCount} unread ${pageUnreadCount === 1 ? "notification" : "notifications"} on this page`} /><span className="pk-notification-unread-label" aria-hidden="true">unread</span></div>
        <p className="pk-notification-context">{items.length} {items.length === 1 ? "notification" : "notifications"} on this page{pageCount > 0 ? ` · Page ${page} of ${pageCount}` : ""}</p>
      </div>
      <IconButton className="pk-notification-mark-page" label="Mark all on this page as read" variant="outline" disabled={disabled || unreadIds.length === 0} aria-disabled={busy || undefined} onClick={() => { if (!busy) mark(unreadIds, true); }}><CheckIcon size="sm" /></IconButton>
    </header>
    <div className="pk-notification-toolbar" role="group" aria-label="Current page notification actions">
      <div className="pk-notification-selection"><Checkbox label="Select this page" checked={selectionState} disabled={disabled || eligible.length === 0} aria-disabled={busy || undefined} onCheckedChange={checked => { if (!busy) setSelected(checked === true ? eligible.map(item => item.id) : []); }} /></div>
      {selectedIds.length > 0 ? <div className="pk-notification-selection-actions">
        <IconButton label="Mark selected as read" disabled={disabled || selectedIds.length === 0} aria-disabled={busy || undefined} onClick={() => { if (!busy) mark(selectedIds, true); }}><CheckIcon size="sm" /></IconButton>
        <IconButton label="Mark selected as unread" disabled={disabled || selectedIds.length === 0} aria-disabled={busy || undefined} onClick={() => { if (!busy) mark(selectedIds, false); }}><MailIcon size="sm" /></IconButton>
      </div> : null}
      <p className="pk-notification-scope">{selectedIds.length} selected on this page. Bulk actions exclude other pages and unavailable items.</p>
    </div>
    {error ? <ActionMessage tone="error" heading="Notifications could not be loaded" actions={<Button size="sm" variant="outline" disabled={disabled} aria-disabled={busy || undefined} onClick={() => { if (!busy) void run({ type: "page", page }); }}>Retry loading notifications</Button>}>{error}</ActionMessage> : null}
    <div aria-busy={busy || undefined}>
      {items.length ? <NotificationList groups={groups} selectedIds={selectedIds} disabled={disabled} busy={busy} onSelectionChange={(id, checked) => setSelected(current => checked ? [...new Set([...current, id])] : current.filter(value => value !== id))} onReadChange={(id, read) => mark([id], read)} onAction={(notificationId, actionId) => { void run({ type: "operation", operation: { type: "action", notificationId, actionId } }); }} /> : !loading && !error && !pending ? <EmptyState title="No notifications" description="New updates will appear here." icon={<InboxIcon />} size="sm" /> : null}
    </div>
    {failure ? <ActionMessage tone="error" heading={failure.task.type === "page" ? "Page could not be loaded" : "Notification action failed"} actions={<Button size="sm" variant="outline" disabled={disabled} aria-disabled={busy || undefined} onClick={() => { if (!busy) void run(failure.task); }}>Retry notification request</Button>}>{failure.message}</ActionMessage> : null}
    <footer className="pk-notification-footer">
      <p className="pk-notification-note" role="status" aria-atomic="true">{busy ? <><Spinner size="sm" aria-hidden="true" /> {pending?.type === "operation" ? "Updating notifications…" : "Loading notifications…"}</> : note}</p>
      <Pagination page={page} pageCount={pageCount} label="Notification pages" aria-disabled={busy || undefined} disabled={disabled} onPageChange={next => { if (!busy) void run({ type: "page", page: next }); }} />
    </footer>
  </section>;
}
