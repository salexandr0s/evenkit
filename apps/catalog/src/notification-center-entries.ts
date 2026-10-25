import type { CatalogEntry } from "./catalog-types.js";

export const notificationCenterEntries: readonly CatalogEntry[] = [{
  id: "notification-center", name: "Notification center", group: "Compositions", inventoryIds: ["O08"],
  description: "Grouped notifications with explicit page selection, read states, actions and recoverable page requests.",
  tags: ["notifications", "inbox", "unread", "read", "group", "pagination", "O08"],
  source: "Original Evenkit composition · editable source · host-owned events and persistence",
  sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul",
  usage: `"use client";

import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { useState } from "react";
import type { NotificationOperation, NotificationPage, NotificationRequestContext } from "@evenkit/ui";
import { NotificationCenter } from "./notification-center";

// Copy registry/blocks/notification-center.tsx beside this file.
// The application authenticates requests and supplies events, permissions and storage.
interface InboxProps {
  contextKey: string;
  revision: string;
  initialPage: NotificationPage;
  persist: (operation: NotificationOperation, context: NotificationRequestContext) => Promise<void>;
  loadPage: (page: number, context: NotificationRequestContext) => Promise<NotificationPage>;
  open: (notificationId: string, actionId: string) => void;
}

export function Inbox({ contextKey, revision, initialPage, persist, loadPage, open }: InboxProps) {
  const sourceKey = JSON.stringify([contextKey, revision]);
  const [loaded, setLoaded] = useState({ sourceKey, snapshot: initialPage });
  // Replace old data immediately without remounting focused controls.
  const snapshot = loaded.sourceKey === sourceKey ? loaded.snapshot : initialPage;
  return <NotificationCenter {...snapshot} contextKey={contextKey} revision={revision}
    onOperation={persist}
    onCommit={operation => {
      if (operation.type === "action") {
        open(operation.notificationId, operation.actionId);
        return;
      }
      setLoaded(stored => {
        const current = stored.sourceKey === sourceKey ? stored.snapshot : initialPage;
        return { sourceKey, snapshot: { ...current,
          groups: current.groups.map(group => ({ ...group,
            items: group.items.map(item => operation.ids.includes(item.id)
              ? { ...item, read: operation.read } : item),
          })),
        } };
      });
    }}
    onLoadPage={loadPage} onPageLoaded={result => setLoaded({ sourceKey, snapshot: result })} />;
}

// persist and loadPage receive AbortSignal; respect it before application side effects.
// Only onCommit/onPageLoaded update this example's client state after the stale guard.
// Pass a changed revision when a background refresh supersedes a pending request.
// Selection and mark all affect eligible items on the visible page only.
`,
}];
