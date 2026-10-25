import { useRef, useState } from "react";
import { Button, Checkbox, DataList, DataListItem } from "@evenkit/ui";
import { NotificationPreferences, type NotificationCategory, type NotificationChannel, type NotificationPreferenceValue } from "../../../registry/blocks/notification-preferences";
import "./notification-preferences-preview.css";

const channels: readonly NotificationChannel[] = [
  { id: "in-app", label: "In app", description: "Keep updates in the notification center." },
  { id: "email", label: "Email", description: "Send updates to your account email." },
  { id: "push", label: "Push", unavailable: "Push delivery is not available for this workspace." },
];
const categories: readonly NotificationCategory[] = [
  { id: "mentions", label: "Mentions and replies", description: "Messages that mention you or reply to your comments." },
  { id: "projects", label: "Project changes", description: "Changes to projects you follow." },
  { id: "security", label: "Account security", description: "Sign-in and account access changes.", policies: {
    "in-app": { required: "Required by your workspace so account notices remain available." },
    email: { readOnlyReason: "Your administrator manages security email preferences." },
  } },
];
const initial: NotificationPreferenceValue = {
  mentions: { "in-app": true, email: false, push: false },
  projects: { "in-app": true, email: true, push: false },
  security: { "in-app": true, email: true, push: false },
};

export function NotificationPreferencesPreview() {
  const [workspace, setWorkspace] = useState("Meridian Studio");
  const [revision, setRevision] = useState(1);
  const [values, setValues] = useState<Record<string, NotificationPreferenceValue>>({});
  const [savedCount, setSavedCount] = useState(0);
  const [fail, setFail] = useState(false);
  const [slow, setSlow] = useState(false);
  const [ignoreAbort, setIgnoreAbort] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [longLabels, setLongLabels] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [hideEmail, setHideEmail] = useState(false);
  const failNext = useRef(false);
  const displayedCategories = longLabels ? categories.map(category => category.id === "projects" ? { ...category, label: "Project changes, review assignments and scheduled handovers across all teams in this workspace" } : category) : categories;
  return <div className="notification-preferences-preview" dir={rtl ? "rtl" : undefined}>
    <DataList><DataListItem term="Workspace">{workspace}</DataListItem><DataListItem term="Completed saves"><output aria-label="Completed preference saves">{savedCount}</output></DataListItem></DataList>
    <NotificationPreferences contextKey={workspace} revision={revision} channels={hideEmail ? channels.filter(channel => channel.id !== "email") : channels} categories={displayedCategories} value={values[workspace] ?? initial}
      {...(readOnly ? { readOnlyReason: "You can view these preferences. A workspace administrator can change them." } : {})}
      onSave={async (draft, { signal }) => {
        const shouldFail = failNext.current;
        failNext.current = false; setFail(false);
        await new Promise<void>(resolve => window.setTimeout(resolve, slow ? 1800 : 250));
        if (!ignoreAbort && signal.aborted) throw new DOMException("Cancelled", "AbortError");
        if (shouldFail) throw new Error("The sample save failed. Your choices are ready to retry.");
        return draft;
      }}
      onSaved={(next, context) => { setValues(current => ({ ...current, [context.contextKey]: next })); setSavedCount(current => current + 1); }} />
    <details className="notification-preferences-demo-controls"><summary>Example controls</summary>
      <div className="notification-preferences-demo-options">
        <Checkbox label="Fail the next preference save" checked={fail} onCheckedChange={checked => { failNext.current = checked === true; setFail(checked === true); }} />
        <Checkbox label="Use a slow preference response" checked={slow} onCheckedChange={checked => setSlow(checked === true)} />
        <Checkbox label="Ignore cancellation in sample request" checked={ignoreAbort} onCheckedChange={checked => setIgnoreAbort(checked === true)} />
        <Checkbox label="View preferences without edit access" checked={readOnly} onCheckedChange={checked => setReadOnly(checked === true)} />
        <Checkbox label="Use long category labels" checked={longLabels} onCheckedChange={checked => setLongLabels(checked === true)} />
        <Checkbox label="Use right-to-left layout" checked={rtl} onCheckedChange={checked => setRtl(checked === true)} />
        <Checkbox label="Remove email channel" checked={hideEmail} onCheckedChange={checked => setHideEmail(checked === true)} />
        <div className="catalog-demo-actions"><Button variant="outline" onClick={() => setWorkspace(current => current === "Meridian Studio" ? "Aster Research" : "Meridian Studio")}>Change preference workspace</Button>
          <Button variant="outline" onClick={() => { setValues(current => ({ ...current, [workspace]: initial })); setRevision(current => current + 1); }}>Reload saved preferences</Button></div>
      </div>
    </details>
  </div>;
}
