"use client";

import { useState } from "react";
import * as Kit from "@evenkit/ui";
import { RecordDetail } from "./blocks/record-detail";
import { ProfileSettings, AppearanceSettings } from "./blocks/account-settings";
import { OnboardingWizard } from "./blocks/onboarding-wizard";
import { NotificationCenter } from "./blocks/notification-center";
import { NotificationPreferences } from "./blocks/notification-preferences";

const requiredExports: readonly (keyof typeof Kit)[] = [
  "Calendar", "DateField", "DatePicker", "DateRangePicker", "TimeField",
  "formatDateOnly", "formatTimestamp", "formatNumber", "formatFileSize", "FormattedTimestamp",
  "MultiSelect", "TokenInput", "NumberField", "CurrencyField", "PercentageField", "UnitField",
  "SortControl", "BulkActionBar", "ColumnSettings", "useRemoteTable", "useTableSelection",
  "ActivityTimeline", "WorkspaceSwitcher", "SettingsLayout", "AppearancePreferences",
  "UploadQueue", "useUploadQueue", "Image", "Thumbnail", "CommandPalette", "StepIndicator",
  "NotificationList", "PersistentBanner", "ConnectionStatus", "PresenceIndicator", "UnreadIndicator",
];

const record = { id: "packed-detail", name: "Packed record detail", notes: "Package fixture", status: "draft" as const };

export function RoadmapFixture() {
  const [date, setDate] = useState<string | null>("2026-10-25");
  const [workspace, setWorkspace] = useState("one");
  const [appearance, setAppearance] = useState<Kit.AppearanceValue>({ theme: "neutral", mode: "system" });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const queue = Kit.useUploadQueue({ upload: async (_file, { signal, onProgress }) => { signal.throwIfAborted(); onProgress(100); return {}; } });
  for (const name of requiredExports) if (Kit[name] === undefined) throw new Error(`Missing roadmap export: ${name}`);
  return <Kit.Stack aria-label="Packed roadmap controls">
    <h2>Roadmap package controls</h2>
    <h3>Packed notification family</h3>
    <Kit.PersistentBanner contextKey="packed" heading="Packed maintenance notice">Editing pauses at 22:00 UTC.</Kit.PersistentBanner>
    <Kit.ConnectionStatus contextKey="packed" state="offline">This preview cannot send changes.</Kit.ConnectionStatus>
    <Kit.PresenceIndicator state="online" label="Packed member is online" />
    <Kit.UnreadIndicator count={128} />
    <NotificationCenter contextKey="packed" page={1} pageCount={1} groups={[{ id: "today", label: "Today", items: [{ id: "packed", title: "Packed notification", read: false }] }]}
      onOperation={async () => {}} onCommit={() => {}} onLoadPage={async page => ({ page, pageCount: 1, groups: [] })} onPageLoaded={() => {}} />
    <NotificationPreferences contextKey="packed" revision={1} channels={[{ id: "email", label: "Email" }]} categories={[{ id: "mentions", label: "Mentions" }]}
      value={{ mentions: { email: true } }} onSave={async draft => draft} />
    <Kit.Calendar value={date} onValueChange={setDate} today="2026-10-25" />
    <Kit.DatePicker label="Packed deadline" value={date} onValueChange={setDate} today="2026-10-25" />
    <Kit.DateRangePicker label="Packed reporting period" today="2026-10-25" />
    <Kit.TimeField label="Packed appointment time" defaultValue="09:30" />
    <Kit.FormattedTimestamp value="2026-10-25T12:00:00Z" options={{ timeZone: "Europe/Vienna" }} />
    <Kit.MultiSelect label="Packed people" options={[{ value: "alex", label: "Alex" }]} />
    <Kit.TokenInput label="Packed labels" defaultValue={["Release"]} />
    <Kit.NumberField label="Packed quantity" defaultValue={2.5} step={0.5} />
    <Kit.CurrencyField label="Packed budget" currency="EUR" defaultValue={100} />
    <Kit.PercentageField label="Packed rate" defaultValue={25} />
    <Kit.UnitField label="Packed distance" unit="km" defaultValue={5} />
    <Kit.DataTable caption="Packed remote rows" data={[record]} getRowId={row => row.id}
      columns={[{ id: "name", header: "Project", accessor: row => row.name }]}
      remote={{ query: { pageIndex: 0, pageSize: 10, search: "", sort: null }, total: 1, onQueryChange: () => {} }} />
    <Kit.WorkspaceSwitcher workspaces={[{ id: "one", name: "Packed workspace" }]} value={workspace} onValueChange={setWorkspace} />
    <Kit.SettingsLayout items={[{ id: "appearance", label: "Appearance" }]} activeId="appearance" onNavigate={() => {}}>
      <Kit.AppearancePreferences value={appearance} onValueChange={setAppearance} />
    </Kit.SettingsLayout>
    <Kit.UploadQueue queue={queue} label="Packed uploads" />
    <Kit.Thumbnail src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23777'/%3E%3C/svg%3E" alt="Package thumbnail" />
    <Kit.Button onClick={() => setPaletteOpen(true)}>Search packed commands</Kit.Button>
    <Kit.CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} shortcut={false} items={[{ id: "home", label: "Package home", href: "#packed-navigation" }]} />
    <Kit.StepIndicator currentStep="review" steps={[{ id: "details", label: "Details", status: "complete" }, { id: "review", label: "Review" }]} />
    <RecordDetail record={record} metadata={[{ id: "owner", label: "Owner", value: "Alex" }]} activity={[]} timeZone="UTC" onBack={() => {}} onSave={async draft => ({ ...draft, id: record.id })} />
    <ProfileSettings profile={{ id: "packed-person", name: "Alex", email: "alex@example.com" }} onSave={async value => value} />
    <AppearanceSettings storageKey="evenkit.packed.appearance" />
    <OnboardingWizard initialData={{ name: "Packed setup" }} steps={[{ id: "name", title: "Workspace", validate: () => [], render: ({ data, update }) => <Kit.TextField label="Packed setup name" value={data.name} onChange={event => update({ name: event.target.value })} /> }]}
      renderReview={data => <p>{data.name}</p>} onSubmit={async () => {}} />
  </Kit.Stack>;
}
