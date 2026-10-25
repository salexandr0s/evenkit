import { useRef, useState } from "react";
import { Building2Icon, Button, Checkbox, ChevronDownIcon, SlidersHorizontalIcon, type NotificationGroup, type NotificationOperation } from "@evenkit/ui";
import { NotificationCenter } from "../../../registry/blocks/notification-center";
import "./notification-center-preview.css";

const initialPages: readonly (readonly NotificationGroup[])[] = [
  [{ id: "today", label: "Today", items: [
    { id: "review", title: "Release plan ready for review", description: "Alex Morgan requested your review of the Meridian release plan.", timestamp: "2026-10-25T09:00:00Z", timestampLabel: "25 October, 10:00 CET", read: false, actions: [{ id: "open", label: "Open project" }] },
    { id: "schedule", title: "Review meeting moved", description: "Your review is now scheduled for Thursday at 14:00 CET.", read: true },
  ] }, { id: "workspace", label: "Workspace notices", items: [
    { id: "policy", title: "Workspace retention policy", description: "Keep the retention policy available while reviewing project documents.", read: false, readOnlyReason: "Managed by workspace administrators.", actions: [{ id: "manage", label: "Manage policy", unavailable: "Administrator access required." }] },
  ] }],
  [{ id: "earlier", label: "Earlier", items: [{ id: "handover", title: "Cedar handover completed", description: "The handover documents are ready.", read: false }] }],
];

export function NotificationCenterPreview() {
  const [pages, setPages] = useState(initialPages);
  const [page, setPage] = useState(1);
  const [workspace, setWorkspace] = useState("meridian");
  const [fail, setFail] = useState(false);
  const failNext = useRef(false);
  const [slow, setSlow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [longLabels, setLongLabels] = useState(false);
  const [loadError, setLoadError] = useState<string | undefined>();
  const [opened, setOpened] = useState("");
  const [revision, setRevision] = useState(0);
  const groups = (pages[page - 1] ?? []).map(group => ({ ...group, items: group.items.map(item => longLabels ? { ...item, title: `${item.title}: review the delivery schedule, supporting documents and acknowledgments across every participating project team before the next workspace review` } : item) }));
  async function prepare() {
    const shouldFail = failNext.current;
    failNext.current = false; setFail(false);
    // This demo deliberately ignores abort to exercise the component's stale-result guard.
    await new Promise<void>(resolve => window.setTimeout(resolve, slow ? 2500 : 300));
    if (shouldFail) throw new Error("The sample connection failed. Retry when you are ready.");
  }
  function commit(operation: NotificationOperation) {
    if (operation.type === "read") setPages(current => current.map(groups => groups.map(group => ({ ...group, items: group.items.map(item => operation.ids.includes(item.id) ? { ...item, read: operation.read } : item) }))));
    else setOpened(`Opened ${operation.notificationId === "review" ? "Meridian release" : operation.notificationId}.`);
  }
  function reset() { setPages(initialPages); setPage(1); setLoadError(undefined); setOpened(""); setRevision(value => value + 1); }
  return <div className="notification-center-preview">
    <p className="notification-center-workspace"><Building2Icon size="sm" aria-hidden="true" />{workspace === "meridian" ? "Meridian Studio" : "Aster Research"}</p>
    <NotificationCenter groups={groups} page={page} pageCount={pages.length} contextKey={workspace} revision={revision} disabled={disabled} {...(loadError ? { error: loadError } : {})} onOperation={prepare} onCommit={commit} onLoadPage={async next => { const result = { groups: pages[next - 1] ?? [], page: next, pageCount: pages.length }; await prepare(); return result; }} onPageLoaded={result => { setPage(result.page); setLoadError(undefined); }} />
    {opened ? <p role="status">{opened}</p> : null}
    <details className="notification-center-demo-options">
      <summary><SlidersHorizontalIcon size="sm" aria-hidden="true" /><span>Example controls</span><ChevronDownIcon className="notification-center-demo-chevron" size="sm" aria-hidden="true" /></summary>
      <div className="notification-center-demo-body" aria-label="Notification example controls">
      <p className="notification-center-demo-description">Try loading, recovery and context changes.</p>
      <div className="notification-center-demo-toggles">
        <Checkbox label="Fail the next notification request" checked={fail} onCheckedChange={checked => { failNext.current = checked === true; setFail(checked === true); }} />
        <Checkbox label="Use a slow notification response" checked={slow} onCheckedChange={checked => setSlow(checked === true)} />
        <Checkbox label="Revoke notification permissions" checked={disabled} onCheckedChange={checked => setDisabled(checked === true)} />
        <Checkbox label="Use long notification labels" checked={longLabels} onCheckedChange={checked => setLongLabels(checked === true)} />
      </div>
      <div className="catalog-demo-actions">
        <Button size="sm" variant="outline" onClick={() => { setWorkspace(current => current === "meridian" ? "aster" : "meridian"); reset(); }}>Change notification workspace</Button>
        <Button size="sm" variant="outline" onClick={() => setLoadError("Notifications could not be refreshed. Existing items remain available.")}>Show notification loading failure</Button>
        <Button size="sm" variant="outline" onClick={() => { setPages([[]]); setPage(1); setLoadError(undefined); setRevision(value => value + 1); }}>Show empty inbox</Button>
        <Button size="sm" variant="ghost" onClick={reset}>Reset notifications</Button>
      </div>
      </div>
    </details>
  </div>;
}
