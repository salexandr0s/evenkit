"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PersistentBanner, Tabs, TabsContent, TabsList, TabsTrigger, UnreadIndicator } from "@evenkit/ui";
import { NotificationCenter } from "../../blocks/notification-center";
import { NotificationPreferences } from "../../blocks/notification-preferences";
import { notificationCategories, notificationChannels, notificationDestination, notificationOperationAllowed, notificationPage } from "../../lib/demo-notifications";
import { useNotificationDemo } from "../notification-demo-provider";
import { useStarter } from "../starter-providers";

export function NotificationsView() {
  const router = useRouter();
  const { workspaceId, workspaceName, request } = useStarter();
  const { data, commitOperation, commitPreferences, dismissNotice } = useNotificationDemo();
  const [page, setPage] = useState(1);
  const summary = useRef<HTMLParagraphElement>(null);
  const unread = data.items.filter(item => !item.read).length;

  return <div className="starter-stack">
    <p ref={summary} tabIndex={-1} className="starter-muted">Fictional updates for {workspaceName}. <UnreadIndicator count={unread} label={`${unread} unread notifications in ${workspaceName}`} /></p>
    {!data.noticeDismissed ? <PersistentBanner contextKey={workspaceId} heading="Review your delivery preferences" dismissal={{ label: "Dismiss preference reminder", focusRef: summary, onDismiss: ({ signal }) => request(signal), onDismissed: dismissNotice }}>
      Inbox and email choices are saved separately for each workspace in this demo. No email is sent.
    </PersistentBanner> : null}
    <Tabs defaultValue="inbox">
      <TabsList aria-label="Notification views"><TabsTrigger value="inbox">Inbox</TabsTrigger><TabsTrigger value="preferences">Preferences</TabsTrigger></TabsList>
      <TabsContent value="inbox">
        <NotificationCenter {...notificationPage(data, page)} contextKey={workspaceId} revision={data.revision} title="Notification inbox"
          onOperation={async (operation, { signal, contextKey }) => {
            if (contextKey !== workspaceId || !notificationOperationAllowed(data, operation)) throw new Error("This action is no longer available in the current workspace.");
            await request(signal);
          }}
          onCommit={operation => {
            commitOperation(operation, data.revision);
            const destination = notificationDestination(data, operation);
            if (destination) router.push(destination);
          }}
          onLoadPage={async (next, { signal }) => { await request(signal); return notificationPage(data, next); }}
          onPageLoaded={result => setPage(result.page)} />
      </TabsContent>
      <TabsContent value="preferences">
        <NotificationPreferences contextKey={workspaceId} revision={data.preferenceRevision} channels={notificationChannels} categories={notificationCategories} value={data.preferences}
          description={`Choose which updates reach you in ${workspaceName}. These fictional choices remain until you reload or leave the admin session.`}
          onSave={async (draft, { signal }) => { await request(signal); return draft; }} onSaved={commitPreferences} />
      </TabsContent>
    </Tabs>
  </div>;
}
