import type { NotificationItem, NotificationOperation, NotificationPage } from "@evenkit/ui";
import type { NotificationCategory, NotificationChannel, NotificationPreferenceValue } from "../blocks/notification-preferences";
import type { WorkspaceId } from "./demo-data";

export interface DemoNotification extends NotificationItem {
  destination?: string;
}

export interface DemoNotificationData {
  items: readonly DemoNotification[];
  revision: number;
  preferences: NotificationPreferenceValue;
  preferenceRevision: number;
  noticeDismissed: boolean;
}

export const notificationChannels: readonly NotificationChannel[] = [
  { id: "inbox", label: "Inbox" },
  { id: "email", label: "Email", description: "Demo only; no email is sent." },
];

export const notificationCategories: readonly NotificationCategory[] = [
  { id: "records", label: "Record updates", description: "Comments and status changes on your projects." },
  { id: "documents", label: "Document updates", description: "Files ready for review." },
  { id: "team", label: "Team changes", description: "Invitations and role changes." },
  { id: "security", label: "Account security", description: "Sign-in and account notices.", policies: { inbox: { required: "Account security notices stay in your inbox." }, email: { required: "Account security email is required in this demo." } } },
];

function workspaceNotifications(workspaceId: WorkspaceId): DemoNotificationData {
  const northstar = workspaceId === "northstar";
  return {
    revision: 1,
    preferenceRevision: 1,
    noticeDismissed: false,
    preferences: {
      records: { inbox: true, email: true },
      documents: { inbox: true, email: false },
      team: { inbox: true, email: true },
      security: { inbox: true, email: true },
    },
    items: [
      { id: `${workspaceId}-review`, title: northstar ? "Community field guide needs a review" : "Repair café needs a review", description: northstar ? "Morgan Lee added a note to the project brief." : "Sam Rowan added a note to the event plan.", read: false, timestamp: "2026-10-25T09:30:00Z", timestampLabel: "25 Oct, 09:30 UTC", actions: [{ id: "open", label: "Open record" }], destination: `/records/${workspaceId}-1` },
      { id: `${workspaceId}-document`, title: northstar ? "Studio reference files are ready" : "Workshop reference files are ready", description: "Preview or download the workspace reference files.", read: false, timestamp: "2026-10-25T08:15:00Z", timestampLabel: "25 Oct, 08:15 UTC", actions: [{ id: "open", label: "Open documents" }], destination: "/documents" },
      { id: `${workspaceId}-team`, title: northstar ? "Morgan Lee joined the studio" : "Taylor Moss joined the workshop", description: "Review the workspace member list and available roles.", read: true, timestamp: "2026-10-24T15:00:00Z", timestampLabel: "24 Oct, 15:00 UTC", actions: [{ id: "open", label: "Open team" }], destination: "/team" },
      { id: `${workspaceId}-record`, title: northstar ? "Studio archive was updated" : "Tool library was updated", description: "Review the updated project details.", read: false, timestamp: "2026-10-24T10:00:00Z", timestampLabel: "24 Oct, 10:00 UTC", actions: [{ id: "open", label: "Open record" }], destination: `/records/${workspaceId}-2` },
      { id: `${workspaceId}-policy`, title: "Account notice retained", description: "This sample notice shows a workspace retention policy.", read: true, readOnlyReason: "Retained account notices cannot be marked unread.", timestamp: "2026-10-23T10:00:00Z", timestampLabel: "23 Oct, 10:00 UTC", actions: [{ id: "open", label: "Open settings" }], destination: "/settings" },
      { id: `${workspaceId}-archive`, title: "An older export has expired", description: "The original export is no longer available.", read: true, actions: [{ id: "open", label: "Download export", unavailable: "Create a new export from the current workspace." }] },
    ],
  };
}

export function initialNotificationData(): Record<WorkspaceId, DemoNotificationData> {
  return { northstar: workspaceNotifications("northstar"), harbor: workspaceNotifications("harbor") };
}

export function notificationPage(data: DemoNotificationData, page: number): NotificationPage {
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(data.items.length / pageSize));
  if (!Number.isInteger(page) || page < 1 || page > pageCount) throw new Error("This notification page is not available.");
  return { page, pageCount, groups: [{ id: `page-${page}`, label: page === 1 ? "Recent updates" : "Earlier updates", items: data.items.slice((page - 1) * pageSize, page * pageSize) }] };
}

export function notificationOperationAllowed(data: DemoNotificationData, operation: NotificationOperation): boolean {
  if (operation.type === "read") return operation.ids.length > 0 && operation.ids.every(id => data.items.some(item => item.id === id && !item.readOnlyReason));
  return data.items.some(item => item.id === operation.notificationId && item.actions?.some(action => action.id === operation.actionId && !action.unavailable));
}

export function notificationDestination(data: DemoNotificationData, operation: NotificationOperation): string | null {
  if (operation.type !== "action" || operation.actionId !== "open" || !notificationOperationAllowed(data, operation)) return null;
  // Destinations are application-owned fixture routes, never notification-supplied URLs.
  return data.items.find(item => item.id === operation.notificationId)?.destination ?? null;
}
