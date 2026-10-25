import type { CatalogEntry } from "./catalog-types.js";
const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';
export const persistentFeedbackEntries: readonly CatalogEntry[] = [
  { id: "persistent-banner", name: "Persistent banner", group: "Feedback", inventoryIds: ["G03"], description: "Page and app notices with optional actions, guarded dismissal and persistent recovery feedback.", tags: ["banner", "announcement", "maintenance", "dismiss", "G03"], source: "Original Evenkit composition of ActionMessage and Button", sourceUrl: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html", usage: `${imports}
import { useRef, useState } from "react";
import { PersistentBanner, type FeedbackRequestContext } from "@evenkit/ui";

export function MaintenanceNotice({ workspaceId, saveDismissal }: {
  workspaceId: string;
  saveDismissal: (context: FeedbackRequestContext) => Promise<void>;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  return <>
    <h1 ref={heading} tabIndex={-1}>Projects</h1>
    {dismissedFor !== workspaceId && <PersistentBanner contextKey={workspaceId}
      revision="maintenance-2026-10-30" heading="Scheduled maintenance"
      dismissal={{ onDismiss: saveDismissal,
        onDismissed: () => setDismissedFor(workspaceId), focusRef: heading }}>
      Editing will be unavailable on 30 October from 22:00 to 22:30 Europe/Vienna.
    </PersistentBanner>}
  </>;
}
// The host scopes and authorizes persistence. Honor signal before mutating host state.
// Omit dismissal for information that must remain available.
` },
  { id: "connection-status", name: "Connection and session status", group: "Feedback", inventoryIds: ["G06"], description: "Offline, reconnecting, stale-data and session-expiring notices with application-supplied recovery.", tags: ["offline", "reconnect", "stale", "session", "status", "G06"], source: "Original Evenkit persistent feedback composition", sourceUrl: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html", usage: `${imports}
import { ConnectionStatus, type ConnectionState, type FeedbackRequestContext } from "@evenkit/ui";

export function ApplicationStatus({ workspaceId, state, detail, recover, onRecovered }: {
  workspaceId: string;
  state: ConnectionState;
  detail: string;
  recover: (context: FeedbackRequestContext) => Promise<void>;
  onRecovered: () => void;
}) {
  return <ConnectionStatus contextKey={workspaceId} state={state}
    actions={[{ id: "recover", label: state === "session-expiring" ? "Continue session" : "Retry connection",
      onAction: recover, onSuccess: onRecovered }]}>{detail}</ConnectionStatus>;
}
// The app owns connection checks, session deadlines and persistence.
// If onRecovered removes the focused notice, pass an action focusRef to the next visible target.
` },
  { id: "presence-unread", name: "Presence and unread indicators", group: "Feedback", inventoryIds: ["H10"], description: "Presence states with visible text and unread counts with exact accessible names.", tags: ["presence", "unread", "count", "online", "indicator", "H10"], source: "Original Evenkit text and Badge composition", sourceUrl: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html", usage: `${imports}
import { Button, PresenceIndicator, UnreadIndicator } from "@evenkit/ui";

export function NotificationIndicators({ unread, openNotifications }: {
  unread: number;
  openNotifications: () => void;
}) {
  return <>
    <PresenceIndicator state="online" label="Alex Morgan is online" />
    <Button variant="outline" onClick={openNotifications}>
      Open notifications <UnreadIndicator count={unread} />
    </Button>
  </>;
}
// Counts above 99 display 99+ while retaining the exact accessible count.
// Supply label for localization. Indicators do not announce every presence/count change.
` },
];
