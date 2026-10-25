import type { CatalogEntry } from "./catalog-types.js";

export const notificationPreferencesEntries: readonly CatalogEntry[] = [{
  id: "notification-preferences", name: "Notification preferences", group: "Compositions", inventoryIds: ["M06"],
  description: "Choose channels for each category, review required or unavailable choices, and recover a failed save without losing your draft.",
  tags: ["notifications", "preferences", "settings", "email", "channels", "M06"],
  source: "Original editable kit block · Switch, FormSection and SaveStatus",
  sourceUrl: "https://www.radix-ui.com/primitives/docs/components/switch",
  usage: `"use client";

import { useState } from "react";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { SettingsLayout } from "@evenkit/ui";
import { NotificationPreferences, type NotificationPreferenceValue } from "./notification-preferences";

// Copy registry/blocks/notification-preferences.tsx beside this file.
// The package stylesheet includes the block's presentation styles.
export function WorkspaceNotifications() {
  const [saved, setSaved] = useState<NotificationPreferenceValue>({
    mentions: { "in-app": true, email: false },
    security: { "in-app": true, email: true },
  });
  return <SettingsLayout items={[{ id: "notifications", label: "Notifications" }]}
    activeId="notifications" onNavigate={() => {}}>
    <NotificationPreferences contextKey="meridian" revision={1} value={saved}
      channels={[{ id: "in-app", label: "In app" }, { id: "email", label: "Email" }]}
      categories={[
        { id: "mentions", label: "Mentions and replies" },
        { id: "security", label: "Account security", policies: {
          "in-app": { required: "Your workspace requires account notices in the app." },
        } },
      ]}
      onSave={async (draft, { signal }) => {
        signal.throwIfAborted();
        return draft; // In-memory example; replace with your application's save.
      }} onSaved={next => setSaved(next)} />
  </SettingsLayout>;
}

// onSave receives { signal, contextKey, revision } and returns the saved values.
// Parse network responses in your application. Enforce authorization and revision
// checks on your server; aborting a request cannot undo a server-side write.
// Commit local UI state in onSaved, which rejects results from obsolete contexts.
// Increment revision when replacing the server snapshot. Context, policy or schema
// changes cancel pending work and reset unsaved choices to the supplied value.
`,
}];
