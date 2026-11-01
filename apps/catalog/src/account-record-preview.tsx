import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { cssVariables } from "@evenkit/tokens";
import { ActivityTimeline, Badge, Button, DataList, DataListItem, SettingsLayout, WorkspaceSwitcher, type ActivityGroup, type AppearanceValue } from "@evenkit/ui";
import { AppearanceSettings, ProfileSettings, type ProfileValue } from "../../../registry/blocks/account-settings";
import { RecordDetail } from "../../../registry/blocks/record-detail";
import { RecordWorkflow, type WorkflowDraft, type WorkflowRecord } from "../../../registry/blocks/record-workflow";
import "./account-record-preview.css";

const initialRecords: readonly WorkflowRecord[] = [
  { id: "meridian", name: "Meridian release", notes: "Prepare the release checklist and confirm the handover with the delivery team.", status: "active" },
  { id: "aster", name: "Aster research", notes: "Collect interview notes for the next planning session.", status: "draft" },
  { id: "cedar", name: "Cedar handover", notes: "Review documents and agree the next owner.", status: "active" },
];
const initialActivity: readonly ActivityGroup[] = [{ id: "oct25", label: "25 October 2026", events: [
  { id: "review", actor: "Sam Rivera", action: "reviewed the release plan", timestamp: "2026-10-25T10:30:00Z", detail: "The checklist is ready for the final review." },
  { id: "assign", actor: "Alex Morgan", action: "assigned the project to the delivery team", timestamp: "2026-10-25T08:15:00Z" },
] }, { id: "oct24", label: "24 October 2026", events: [{ id: "create", actor: "Alex Morgan", action: "created the project", timestamp: "2026-10-24T14:00:00Z" }] }];

function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Cancelled", "AbortError")); return; }
    const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, ms);
    function abort() { window.clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); }
    signal.addEventListener("abort", abort, { once: true });
  });
}

function RecordsExample() {
  const [records, setRecords] = useState(initialRecords);
  const [selected, setSelected] = useState<string | null>(null);
  const [activity, setActivity] = useState(initialActivity);
  const [fail, setFail] = useState(false);
  const returnTarget = useRef<HTMLElement | null>(null);
  const returnToList = useRef(false);
  const record = records.find(item => item.id === selected);
  useLayoutEffect(() => { if (!selected && returnToList.current) { returnToList.current = false; returnTarget.current?.focus(); } }, [selected]);
  async function save(draft: WorkflowDraft, { signal }: { signal: AbortSignal }) {
    await delay(650, signal);
    if (fail) { setFail(false); throw new Error("The sample request failed. Retry to save your draft."); }
    const saved: WorkflowRecord = { ...draft, id: draft.id ?? crypto.randomUUID() };
    setRecords(current => current.some(item => item.id === saved.id) ? current.map(item => item.id === saved.id ? saved : item) : [...current, saved]);
    setActivity(current => [{ id: "saved", label: "Latest update", events: [{ id: crypto.randomUUID(), actor: "You", action: `updated ${saved.name}`, timestamp: new Date().toISOString() }] }, ...current.filter(group => group.id !== "saved")]);
    return saved;
  }
  return <div className="account-record-preview">
    <div hidden={Boolean(record)}><RecordWorkflow records={records} onSave={save} onOpenRecord={next => { returnTarget.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setSelected(next.id); }} /></div>
    {record ? <RecordDetail key={record.id} record={record} metadata={[{ id: "owner", label: "Owner", value: "Alex Morgan" }, { id: "team", label: "Workspace", value: "Meridian Studio" }, { id: "id", label: "Record ID", value: record.id }, { id: "deadline", label: "Target date", value: <time dateTime="2026-11-06">6 November 2026</time> }]} activity={activity} timeZone="Europe/Vienna" onSave={save} onBack={() => { returnToList.current = true; setSelected(null); }} /> : null}
    <div className="account-record-options"><label><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)} />Fail the next save</label></div>
  </div>;
}

function TimelineExample() {
  const [failed, setFailed] = useState(true);
  const [loadError, setLoadError] = useState(false);
  return <div className="account-record-preview">
    <div className="account-record-heading"><h3>Project history</h3><p>Times are shown in Europe/Vienna.</p></div>
    <ActivityTimeline groups={[{ id: "pending", label: "Recent changes", events: [{ id: "comment", actor: "You", action: failed ? "could not add a comment" : "added a comment", timestamp: "2026-10-25T11:00:00Z", state: failed ? "error" : "complete", detail: "Please confirm the review date.", onRetry: () => setFailed(false) }] }, ...initialActivity]} timeZone="Europe/Vienna" {...(loadError ? { error: "The activity request failed.", onRetry: () => setLoadError(false) } : {})} />
    <Button size="sm" variant="outline" onClick={() => setLoadError(true)}>Simulate loading failure</Button>
  </div>;
}

const workspaces = [{ id: "studio", name: "Meridian Studio", description: "Design and delivery · 12 members" }, { id: "research", name: "Aster Research", description: "Research team · 6 members" }, { id: "archive", name: "Cedar Archive", description: "Previous projects", unavailable: "Access is unavailable" }];
function WorkspaceExample() {
  const [workspace, setWorkspace] = useState("studio");
  const [fail, setFail] = useState(false);
  const [slow, setSlow] = useState(false);
  return <div className="account-record-preview">
    <div className="account-record-heading"><h3>Your workspaces</h3><p>Switch between the teams you belong to.</p></div>
    <WorkspaceSwitcher workspaces={workspaces} value={workspace} onValueChange={setWorkspace} onSwitch={async (_id, { signal }) => { await delay(slow ? 2500 : 650, signal); if (fail) { setFail(false); throw new Error("The sample connection failed. Your current workspace is unchanged."); } }} />
    <DataList><DataListItem term="Current workspace">{workspaces.find(item => item.id === workspace)?.name}</DataListItem><DataListItem term="Access"><Badge tone="success">Member</Badge></DataListItem></DataList>
    <div className="account-record-options"><label><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)} />Fail the next switch</label><label><input type="checkbox" checked={slow} onChange={event => setSlow(event.target.checked)} />Use a slow response</label></div>
  </div>;
}

const profile: ProfileValue = { id: "alex", name: "Alex Morgan", email: "alex@example.com" };
function ProfileExample() {
  const [fail, setFail] = useState(false);
  const [slow, setSlow] = useState(false);
  return <div className="account-record-preview">
    <ProfileSettings profile={profile} onSave={async (draft, { signal }) => { await delay(slow ? 2500 : 650, signal); if (fail) { setFail(false); throw new Error("The sample request failed. Your draft is ready to retry."); } return draft; }} />
    <div className="account-record-options"><label><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)} />Fail the next save</label><label><input type="checkbox" checked={slow} onChange={event => setSlow(event.target.checked)} />Use a slow response</label></div>
  </div>;
}

const appearanceLocales = [{ value: "en-US", label: "English (United States)" }, { value: "de-AT", label: "Deutsch (Österreich)" }, { value: "fr-FR", label: "Français (France)" }];
function AppearanceExample() {
  const [appearance, setAppearance] = useState<AppearanceValue>({ theme: "neutral", mode: "system", density: "default", locale: "en-US" });
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => { const media = window.matchMedia("(prefers-color-scheme: dark)"); const change = () => setSystemDark(media.matches); media.addEventListener("change", change); return () => media.removeEventListener("change", change); }, []);
  const mode = appearance.mode === "system" ? systemDark ? "dark" : "light" : appearance.mode;
  const sampleStyle: CSSProperties = { ...cssVariables(appearance.theme, mode), colorScheme: mode };
  return <div className="account-record-preview account-appearance-preview">
    <AppearanceSettings storageKey="evenkit.demo.appearance" locales={appearanceLocales} onValueChange={setAppearance} />
    <div className="account-appearance-sample" style={sampleStyle} data-kit-theme={appearance.theme} data-kit-mode={mode} data-density={appearance.density ?? "default"} data-locale={appearance.locale ?? "en-US"}>
      <div><span className="account-appearance-label">Preview</span><h3>Your workspace</h3><p>This sample uses your chosen appearance.</p></div>
      <dl className="account-appearance-data"><div><dt>Project budget</dt><dd>{new Intl.NumberFormat(appearance.locale ?? "en-US", { style: "currency", currency: "EUR" }).format(1234.5)}</dd></div><div><dt>Review date</dt><dd><time dateTime="2026-11-06">{new Intl.DateTimeFormat(appearance.locale ?? "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date("2026-11-06T12:00:00Z"))}</time></dd></div></dl>
      <div className="catalog-demo-actions"><Button>Primary action</Button><Button variant="outline">Secondary action</Button></div>
      <p>Locale changes number and date formatting here. Application text stays in English.</p>
    </div>
  </div>;
}

function SettingsExample() {
  const [section, setSection] = useState("profile");
  return <div className="account-record-preview"><div className="account-record-heading"><h3>Account settings</h3><p>Manage your profile, workspace and appearance.</p></div>
    <SettingsLayout items={[{ id: "profile", label: "Profile" }, { id: "workspace", label: "Workspace" }, { id: "appearance", label: "Appearance" }]} activeId={section} onNavigate={setSection}>
      <div hidden={section !== "profile"}><ProfileExample /></div><div hidden={section !== "workspace"}><WorkspaceExample /></div><div hidden={section !== "appearance"}><AppearanceExample /></div>
    </SettingsLayout>
  </div>;
}

export function AccountRecordPreview({ id }: { id: string }) {
  switch (id) {
    case "activity-timeline": return <TimelineExample />;
    case "record-detail": return <RecordsExample />;
    case "workspace-switcher": return <WorkspaceExample />;
    case "settings-layout": return <SettingsExample />;
    case "profile-settings": return <ProfileExample />;
    default: return <AppearanceExample />;
  }
}
