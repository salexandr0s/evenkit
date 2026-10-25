import { useRef, useState } from "react";
import { Avatar, Badge, BellIcon, Building2Icon, Button, CalendarDaysIcon, Checkbox, ConnectionStatus, FolderIcon, PersistentBanner, PresenceIndicator, SelectField, UnreadIndicator, UsersIcon, type ConnectionState } from "@evenkit/ui";
import "./persistent-feedback-preview.css";

export function PersistentFeedbackPreview({ id }: { id: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(true);
  const [workspace, setWorkspace] = useState("Meridian Studio");
  const [state, setState] = useState<ConnectionState>("offline");
  const [fail, setFail] = useState(false);
  const [slow, setSlow] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [longLabel, setLongLabel] = useState(false);
  const [completed, setCompleted] = useState(0);
  async function prepare() {
    const shouldFail = fail;
    setFail(false);
    // Deliberately ignore cancellation to demonstrate the component's stale-result guard.
    await new Promise<void>(resolve => window.setTimeout(resolve, slow ? 2500 : 350));
    if (shouldFail) throw new Error("The sample request failed. The notice remains available.");
  }
  if (id === "presence-unread") return <div className="persistent-feedback-preview persistent-feedback-indicators">
    <section className="persistent-feedback-team" aria-label="Team availability">
      <div className="persistent-feedback-intro"><span className="persistent-feedback-mark"><UsersIcon /></span><div><h3>Team availability</h3><p>Meridian Studio · 4 members</p></div></div>
      <ul className="persistent-feedback-members">
        {([
          { name: "Alex Morgan", state: "online", role: "Project lead" },
          { name: "Sam Rivera", state: "away", role: "Product design" },
          { name: "Robin Chen", state: "busy", role: "Engineering" },
          { name: "Taylor Novak", state: "offline", role: "Operations" },
        ] as const).map(person => <li key={person.name}><Avatar name={person.name} decorative /><div><PresenceIndicator state={person.state} label={`${person.name} is ${person.state}`} /><span className="persistent-feedback-member-role">{person.role}</span></div></li>)}
      </ul>
    </section>
    <section className="persistent-feedback-inbox" aria-label="Your inbox">
      <span className="persistent-feedback-mark"><BellIcon /></span><div><h3>Your inbox</h3><p>Mentions, project updates and workspace notices in one place.</p></div>
      <Button variant="outline" onClick={() => { window.location.hash = "notification-center"; }}>Open notifications <UnreadIndicator count={128} /></Button>
      <div className="persistent-feedback-read-count"><span>Unread in archived projects</span><UnreadIndicator count={0} /></div>
    </section>
  </div>;
  const details: Record<ConnectionState, string> = {
    offline: "You can review this page. Changes cannot be sent until the connection returns.",
    reconnecting: "The application is trying to reconnect. Keep this page open while it checks the connection.",
    stale: "This page shows the last retrieved data. Refresh before relying on its current status.",
    "session-expiring": "Your session ends at 14:30 Europe/Vienna. Sign in again before continuing your work.",
  };
  const actions = [{ id: "recover", label: id === "persistent-banner" ? longLabel ? "Review scheduled maintenance and preparation instructions" : "View maintenance details" : state === "session-expiring" ? "Continue session" : "Check connection", onAction: prepare, onSuccess: () => setCompleted(count => count + 1), ...(allowed ? {} : { unavailable: "Only workspace owners can perform this action." }) }];
  return <div className="persistent-feedback-preview">
    {id === "connection-status" ? <div className="persistent-feedback-scenario"><SelectField label="Application status" value={state} onValueChange={value => setState(value as ConnectionState)} options={[{ value: "offline", label: "Offline" }, { value: "reconnecting", label: "Reconnecting" }, { value: "stale", label: "Stale data" }, { value: "session-expiring", label: "Session expiring" }]} /></div> : null}
    <div className="persistent-feedback-workspace">
      <div className="persistent-feedback-intro"><span className="persistent-feedback-mark"><Building2Icon /></span><div><h3 ref={heading} tabIndex={-1}>{workspace}</h3><p>Projects and handovers</p></div></div>
      <div className="persistent-feedback-workspace-body">
        {id === "persistent-banner" ? visible ? <PersistentBanner contextKey={workspace} heading="Scheduled maintenance" icon={<CalendarDaysIcon />} actions={actions} dismissal={{ onDismiss: prepare, onDismissed: () => setVisible(false), focusRef: heading }}>
          On 30 October, editing will be unavailable from 22:00 to 22:30 Europe/Vienna. Finish your changes before that time.
        </PersistentBanner> : <Button className="persistent-feedback-restore" variant="outline" onClick={() => setVisible(true)}>Show notice again</Button> : <ConnectionStatus contextKey={workspace} state={state} actions={actions}>{details[state]}</ConnectionStatus>}
        {completed > 0 ? <div className="persistent-feedback-outcome">{id === "persistent-banner" ? <><h4>Before maintenance</h4><p>Finish your changes before 22:00 Europe/Vienna on 30 October. Editing resumes at 22:30.</p></> : <p>Recovery request completed.</p>}</div> : null}
        <section className="persistent-feedback-projects" aria-label="Recent projects">
          <div className="persistent-feedback-project-heading"><h4>Recent projects</h4><span>Last retrieved at 10:00 CET</span></div>
          <ul>{[{ name: "Meridian release", detail: "Release plan and review notes", status: "In review" }, { name: "Cedar handover", detail: "Handover documents", status: "Ready" }].map(project => <li key={project.name}><FolderIcon /><div><strong>{project.name}</strong><p>{project.detail}</p></div><Badge>{project.status}</Badge></li>)}</ul>
        </section>
      </div>
    </div>
    <details className="persistent-feedback-demo-controls"><summary>Example controls</summary><div className="persistent-feedback-options">
      <p className="persistent-feedback-result">Completed actions in this workspace: {completed}</p>
      <Checkbox label="Fail the next request" checked={fail} onCheckedChange={checked => setFail(checked === true)} />
      <Checkbox label="Use a slow response" checked={slow} onCheckedChange={checked => setSlow(checked === true)} />
      <Checkbox label="Allow recovery action" checked={allowed} onCheckedChange={checked => setAllowed(checked === true)} />
      {id === "persistent-banner" ? <Checkbox label="Use a long action label" checked={longLabel} onCheckedChange={checked => setLongLabel(checked === true)} /> : null}
      <Button variant="outline" size="sm" onClick={() => { setWorkspace(current => current === "Meridian Studio" ? "Aster Research" : "Meridian Studio"); setCompleted(0); setVisible(true); }}>Switch notification context</Button>
    </div></details>
  </div>;
}
