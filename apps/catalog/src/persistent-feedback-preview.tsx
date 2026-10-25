import { useRef, useState } from "react";
import { Button, Checkbox, ConnectionStatus, PersistentBanner, PresenceIndicator, SelectField, Stack, UnreadIndicator, type ConnectionState } from "@evenkit/ui";
import "./persistent-feedback-preview.css";

export function PersistentFeedbackPreview({ id }: { id: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(true);
  const [workspace, setWorkspace] = useState("Meridian Studio");
  const [state, setState] = useState<ConnectionState>("offline");
  const [fail, setFail] = useState(false);
  const [slow, setSlow] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [completed, setCompleted] = useState(0);
  async function prepare() {
    const shouldFail = fail;
    setFail(false);
    // Deliberately ignore cancellation to demonstrate the component's stale-result guard.
    await new Promise<void>(resolve => window.setTimeout(resolve, slow ? 2500 : 350));
    if (shouldFail) throw new Error("The sample request failed. The notice remains available.");
  }
  if (id === "presence-unread") return <Stack className="persistent-feedback-preview">
    <div className="persistent-feedback-intro"><h3>Team availability</h3><p>Each state includes text. Counts keep their exact accessible value.</p></div>
    <PresenceIndicator state="online" label="Alex Morgan is online" />
    <PresenceIndicator state="away" label="Sam Rivera is away" />
    <PresenceIndicator state="busy" label="Robin Chen is busy" />
    <PresenceIndicator state="offline" label="Taylor Novak is offline" />
    <Button variant="outline" onClick={() => { window.location.hash = "notification-center"; }}>Open notifications <UnreadIndicator count={128} /></Button>
    <span>Read notifications <UnreadIndicator count={0} /></span>
  </Stack>;
  const details: Record<ConnectionState, string> = {
    offline: "You can review this page. Changes cannot be sent until the connection returns.",
    reconnecting: "The application is trying to reconnect. Keep this page open while it checks the connection.",
    stale: "This page shows the last retrieved data. Refresh before relying on its current status.",
    "session-expiring": "Your session ends at 14:30 Europe/Vienna. Sign in again before continuing your work.",
  };
  const actions = [{ id: "recover", label: id === "persistent-banner" ? "Review scheduled maintenance and preparation instructions" : state === "session-expiring" ? "Continue session" : "Check connection", onAction: prepare, onSuccess: () => setCompleted(count => count + 1), ...(allowed ? {} : { unavailable: "Only workspace owners can perform this action." }) }];
  return <Stack className="persistent-feedback-preview">
    <div className="persistent-feedback-intro"><h3 ref={heading} tabIndex={-1}>{workspace}</h3><p>Notices remain on the page until the application resolves or dismisses them.</p></div>
    {id === "persistent-banner" ? visible ? <PersistentBanner contextKey={workspace} heading="Scheduled maintenance" actions={actions} dismissal={{ onDismiss: prepare, onDismissed: () => setVisible(false), focusRef: heading }}>
      On 30 October, editing will be unavailable from 22:00 to 22:30 Europe/Vienna. Finish your changes before that time.
    </PersistentBanner> : <Button variant="outline" onClick={() => setVisible(true)}>Show notice again</Button> : <ConnectionStatus contextKey={workspace} state={state} actions={actions}>{details[state]}</ConnectionStatus>}
    <p className="persistent-feedback-result">Completed actions in this workspace: {completed}</p>
    <div className="persistent-feedback-options">
      {id === "connection-status" ? <SelectField label="Application status" value={state} onValueChange={value => setState(value as ConnectionState)} options={[{ value: "offline", label: "Offline" }, { value: "reconnecting", label: "Reconnecting" }, { value: "stale", label: "Stale data" }, { value: "session-expiring", label: "Session expiring" }]} /> : null}
      <Checkbox label="Fail the next request" checked={fail} onCheckedChange={checked => setFail(checked === true)} />
      <Checkbox label="Use a slow response" checked={slow} onCheckedChange={checked => setSlow(checked === true)} />
      <Checkbox label="Allow recovery action" checked={allowed} onCheckedChange={checked => setAllowed(checked === true)} />
      <Button variant="outline" size="sm" onClick={() => { setWorkspace(current => current === "Meridian Studio" ? "Aster Research" : "Meridian Studio"); setCompleted(0); setVisible(true); }}>Switch notification context</Button>
    </div>
  </Stack>;
}
