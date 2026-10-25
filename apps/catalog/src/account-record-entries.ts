import type { CatalogEntry } from "./catalog-types.js";

const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';
export const accountRecordEntries: readonly CatalogEntry[] = [
  { id: "activity-timeline", name: "Activity timeline", group: "Compositions", inventoryIds: ["H06"], description: "Grouped events with actors, explicit display timezones, pending actions and retry feedback.", tags: ["history", "activity", "timeline", "actor", "time", "H06"], source: "Original kit composition · ordered activity list", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time", usage: `${imports}
import { ActivityTimeline } from "@evenkit/ui";

export function ProjectHistory() {
  return <ActivityTimeline timeZone="Europe/Vienna" groups={[{
    id: "oct25", label: "25 October 2026", events: [{
      id: "created", actor: "Alex Morgan", action: "created the project",
      timestamp: "2026-10-25T09:00:00Z",
    }],
  }]} />;
}
` },
  { id: "record-detail", name: "Record detail block", group: "Compositions", inventoryIds: ["O03"], description: "Open a record from the list, review metadata and history, edit its fields, and return to the same list.", tags: ["record", "detail", "page", "metadata", "history", "edit", "O03"], source: "Editable kit source block · shared record editor", sourceUrl: "https://ui.shadcn.com/blocks", usage: `${imports}
import { RecordDetail } from "./record-detail";
import type { RecordWorkflowProps, WorkflowRecord } from "./record-workflow";

// Copy record-detail.tsx and record-workflow.tsx from registry/blocks.
export function ProjectDetails({ record, onSave, onBack }: {
  record: WorkflowRecord;
  onSave: RecordWorkflowProps["onSave"];
  onBack: () => void;
}) {
  return <RecordDetail record={record} onSave={onSave} onBack={onBack}
    metadata={[{ id: "id", label: "Record ID", value: record.id }]}
    activity={[]} timeZone="Europe/Vienna" />;
}
// Supply onOpenRecord to RecordWorkflow to connect the list to this page.
` },
  { id: "workspace-switcher", name: "Workspace switcher", group: "Controls", inventoryIds: ["M02"], description: "Search available workspaces and switch with pending, cancel, failure and retry states.", tags: ["workspace", "organization", "account", "switch", "search", "M02"], source: "Original kit composition · Radix Popover", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/popover", usage: `${imports}
import { WorkspaceSwitcher, type WorkspaceOption } from "@evenkit/ui";

export function WorkspaceControl({ workspaces, value, prepare, commit }: {
  workspaces: readonly WorkspaceOption[];
  value: string;
  prepare: (id: string, context: { signal: AbortSignal }) => Promise<void>;
  commit: (id: string) => void;
}) {
  return <WorkspaceSwitcher workspaces={workspaces} value={value}
    onSwitch={prepare} onValueChange={commit} />;
}
// prepare loads/validates the destination; commit changes the active context.
` },
  { id: "settings-layout", name: "Settings layout", group: "Compositions", inventoryIds: ["M03"], description: "Responsive settings navigation with an explicit active section and space for account forms.", tags: ["settings", "layout", "account", "navigation", "M03"], source: "Original kit composition · native navigation", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav", usage: `${imports}
import { useState } from "react";
import { SettingsLayout } from "@evenkit/ui";

export function SettingsPage() {
  const [section, setSection] = useState("profile");
  return <SettingsLayout activeId={section} onNavigate={setSection}
    items={[{ id: "profile", label: "Profile" }, { id: "appearance", label: "Appearance" }]}>
    <section aria-label={section === "profile" ? "Profile settings" : "Appearance settings"}>
      <h2>{section === "profile" ? "Your profile" : "Appearance"}</h2>
    </section>
  </SettingsLayout>;
}
` },
  { id: "profile-settings", name: "Profile settings block", group: "Compositions", inventoryIds: ["M04"], description: "Update account details with validation, reset, cancellation and draft-preserving save recovery.", tags: ["profile", "account", "name", "email", "save", "M04"], source: "Editable kit source block · host-owned persistence", sourceUrl: "https://ui.shadcn.com/blocks", usage: `${imports}
import { ProfileSettings, type ProfileSettingsProps } from "./account-settings";

// Copy registry/blocks/account-settings.tsx beside this module.
export function AccountProfile(props: ProfileSettingsProps) {
  return <ProfileSettings {...props} />;
}
// onSave returns the saved profile. Honor signal before committing host state.
` },
  { id: "appearance-preferences", name: "Appearance preferences", group: "Controls", inventoryIds: ["M05"], description: "Choose a theme, color mode, density and supported locale, with a scoped local persistence recipe.", tags: ["appearance", "theme", "light", "dark", "system", "density", "locale", "formatting", "preferences", "M05"], source: "Original kit controls · editable preference storage recipe", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme", usage: `${imports}
import { AppearancePreferences, type AppearanceValue } from "@evenkit/ui";

export function Preferences({ value, onChange }: {
  value: AppearanceValue;
  onChange: (value: AppearanceValue) => void;
}) {
  return <AppearancePreferences value={value} onValueChange={onChange}
    locales={[{ value: "en-US", label: "English (United States)" },
      { value: "de-AT", label: "Deutsch (Österreich)" }]} />;
}
// Apply value.theme to data-kit-theme on document.documentElement.
// For system mode omit data-kit-mode; otherwise set it to light or dark.
// Optional density defaults to "default"; apply compact spacing within your layout.
// Pass the chosen locale to Intl formatters. Application translations stay host-owned.
// Copy AppearanceSettings from registry/blocks/account-settings.tsx for storage.
` },
];
