import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Checkbox, CheckboxGroup, CopyAction, Meter, Progress, RadioGroup, SegmentedControl, Switch, Toggle, ToggleGroup, ToggleGroupItem } from "@evenkit/ui";
import "./selection-preview.css";

function CheckboxPreview() {
  const [result, setResult] = useState("Submit to inspect the selected values.");
  const [error, setError] = useState("");
  const first = useRef<HTMLButtonElement>(null);
  return <section className="selection-preview" aria-label="Checkbox form example">
    <header className="selection-preview-heading"><p className="selection-preview-context">Workspace preferences</p><h3>Delivery channels</h3><p>Choose where project updates reach you.</p></header>
    <form className="selection-preview-stack" onSubmit={event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const channels = data.getAll("channel");
      if (channels.length === 0) { setError("Choose at least one delivery channel."); first.current?.focus(); return; }
      setError(""); setResult(`Channels: ${channels.join(", ")}. Approval: ${data.has("approval") ? "confirmed" : "not confirmed"}.`);
    }} onReset={() => { setError(""); setResult("Form reset to the initial values."); }}>
      <CheckboxGroup label="Send updates by" hint="Choose at least one channel." error={error}>
        <Checkbox ref={first} name="channel" value="email" defaultChecked label="Email" hint="A digest sent to your registered address." />
        <Checkbox name="channel" value="inbox" label="Workspace inbox" hint="Keep updates beside the projects you follow." />
        <Checkbox name="channel" value="sms" disabled label="SMS, managed by the organization" />
      </CheckboxGroup>
      <div className="selection-preview-section"><Checkbox name="approval" defaultChecked="indeterminate" label="Partial approval" hint="Some project updates are approved. Select to approve all." /></div>
      <ButtonGroup label="Checkbox form actions"><Button type="submit">Inspect values</Button><Button type="reset" variant="outline">Reset choices</Button></ButtonGroup>
      <p role="status">{result}</p>
    </form>
    <div dir="rtl" lang="he"><Checkbox label="עדכונים לצוות האזורי עם תיאור ארוך שנשאר קריא גם במסך צר" hint="האפשרות הזו מציגה יישור מימין לשמאל." /></div>
    <RequiredChoicesPreview />
  </section>;
}

function RequiredChoicesPreview() {
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [access, setAccess] = useState<string | null>(null);
  const [permission, setPermission] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(false);
  const [required, setRequired] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [hostError, setHostError] = useState(false);
  function reset() {
    setMessage(""); setConfirmed(false); setAccess(null); setPermission(null); setNotifications(false);
    setRequired(true); setDisabled(false); setHostError(false);
  }
  return <section className="selection-preview-stack selection-preview-section" aria-label="Required choices example">
    <header className="selection-preview-heading"><p className="selection-preview-context">Validation example</p><h3>Required choices</h3><p>Submit with an empty choice to see its message and focus recovery.</p></header>
    <form className="selection-preview-stack" onSubmit={event => { event.preventDefault(); setMessage("Required choices accepted."); }} onReset={reset}>
      <Checkbox label="Confirm project access" name="confirmed" required={required} disabled={disabled} checked={confirmed} onCheckedChange={next => setConfirmed(next === true)} error={hostError && "Access could not be verified by the host."} />
      <RadioGroup label="Access level" name="access" required={required} disabled={disabled} value={access} onValueChange={setAccess} error="" options={[
        { value: "public", label: "Public unavailable", disabled: true }, { value: "team", label: "Team only" }, { value: "private", label: "Private" },
      ]} />
      <SegmentedControl label="Editing permission" name="permission" required={required} disabled={disabled} value={permission} onValueChange={setPermission} error={false} options={[{ value: "view", label: "View" }, { value: "edit", label: "Edit" }]} />
      <Switch label="Require change notifications" name="notifications" required={required} disabled={disabled} checked={notifications} onCheckedChange={setNotifications} error={false} />
      <ButtonGroup label="Required choice actions"><Button type="submit">Validate required choices</Button><Button type="reset" variant="outline">Reset required choices</Button></ButtonGroup>
      <ButtonGroup label="Controlled validation examples">
        <Button variant="outline" onClick={() => { setConfirmed(true); setAccess("team"); setPermission("view"); setNotifications(true); }}>Correct required choices</Button>
        <Button variant="outline" onClick={() => setRequired(value => !value)}>{required ? "Make choices optional" : "Require choices"}</Button>
        <Button variant="outline" onClick={() => setDisabled(value => !value)}>{disabled ? "Enable required choices" : "Disable required choices"}</Button>
        <Button variant="outline" onClick={() => setHostError(value => !value)}>{hostError ? "Clear host error" : "Show host error"}</Button>
      </ButtonGroup>
      {message ? <p>{message}</p> : null}
    </form>
  </section>;
}

function RadioPreview() {
  const [result, setResult] = useState("Weekly is the initial delivery schedule.");
  return <section className="selection-preview" aria-label="Radio form example">
    <header className="selection-preview-heading"><p className="selection-preview-context">Workspace preferences</p><h3>Delivery schedule</h3><p>Choose how often you receive a project summary.</p></header>
    <form className="selection-preview-stack" onSubmit={event => { event.preventDefault(); setResult(`Schedule: ${String(new FormData(event.currentTarget).get("schedule"))}.`); }} onReset={() => setResult("Schedule reset to weekly.")}>
      <RadioGroup label="Delivery schedule" name="schedule" defaultValue="weekly" required options={[
        { value: "weekly", label: "Weekly", description: "A summary every Monday." },
        { value: "instant", label: "Immediately", description: "Unavailable for this sample workspace.", disabled: true },
        { value: "monthly", label: "Monthly", description: "A summary on the first day of each month." },
      ]} hint="Select one schedule." />
      <ButtonGroup label="Radio form actions"><Button type="submit">Inspect schedule</Button><Button type="reset" variant="outline">Reset schedule</Button></ButtonGroup>
      <p role="status">{result}</p>
    </form>
  </section>;
}

function SwitchPreview() {
  const [checked, setChecked] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("Notifications are off.");
  const [error, setError] = useState("");
  const attempts = useRef(0);
  const [formResult, setFormResult] = useState("The weekly digest starts enabled.");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function save(next: boolean) {
    setPending(true); setError(""); setMessage("Saving notification preference…");
    attempts.current += 1;
    timer.current = setTimeout(() => {
      setPending(false);
      if (attempts.current === 1) { setError("The sample save failed. Activate the switch to try again."); setMessage("Notifications remain off."); }
      else { setChecked(next); setMessage(next ? "Notifications are on." : "Notifications are off."); }
    }, 650);
  }
  return <section className="selection-preview" aria-label="Switch recovery example">
    <header className="selection-preview-heading"><p className="selection-preview-context">Notifications</p><h3>Stay up to date</h3><p>Change a preference without leaving this page. The first sample save fails so you can try recovery.</p></header>
    <div className="selection-preview-stack"><Switch label="Project notifications" checked={checked} onCheckedChange={save} pending={pending} error={error} hint="Receive updates when a project changes." /><p role="status">{message}</p></div>
    <div className="selection-preview-section"><Switch label="Security notices, required by the organization" defaultChecked disabled hint="These notices are always sent to workspace members." /></div>
    <form className="selection-preview-stack selection-preview-section" aria-label="Switch form values" onSubmit={event => {
      event.preventDefault(); setFormResult(new FormData(event.currentTarget).has("digest") ? "Weekly digest enabled." : "Weekly digest disabled.");
    }} onReset={() => setFormResult("Weekly digest reset to enabled.")}>
      <Switch label="Weekly digest" name="digest" defaultChecked hint="Collect the week's updates in one message." />
      <ButtonGroup label="Switch form actions"><Button type="submit">Inspect digest</Button><Button type="reset" variant="outline">Reset digest</Button></ButtonGroup>
      <p role="status">{formResult}</p>
    </form>
  </section>;
}

function TogglePreview() {
  const [formats, setFormats] = useState<string[]>(["bold"]);
  const [alignment, setAlignment] = useState("start");
  return <section className="selection-preview" aria-label="Toggle actions example">
    <header className="selection-preview-heading"><p className="selection-preview-context">Project note</p><h3>Format a note</h3><p>Apply independent actions to the text below.</p></header>
    <div><Toggle>Bookmark project</Toggle></div>
    <ToggleGroup type="multiple" aria-label="Text formatting" value={formats} onValueChange={setFormats}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem><ToggleGroupItem value="italic" disabled>Italic unavailable</ToggleGroupItem><ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup type="single" aria-label="Text alignment" value={alignment} onValueChange={setAlignment}><ToggleGroupItem value="start">Start</ToggleGroupItem><ToggleGroupItem value="center">Center</ToggleGroupItem><ToggleGroupItem value="end">End</ToggleGroupItem></ToggleGroup>
    <div className="selection-preview-note" data-bold={formats.includes("bold") || undefined} data-underline={formats.includes("underline") || undefined} data-align={alignment}>Keep the next project decision in view.</div>
    <p role="status">Formatting: {formats.length ? formats.join(", ") : "none"}.</p>
  </section>;
}

function SegmentedPreview() {
  const [mode, setMode] = useState("list");
  return <section className="selection-preview" aria-label="Segmented mode example">
    <header className="selection-preview-heading"><p className="selection-preview-context">Studio projects</p><h3>Choose a presentation</h3><p>Switch between a compact list and a card for each project.</p></header>
    <form className="selection-preview-stack" onReset={() => setMode("list")}>
      <SegmentedControl label="Project presentation" name="presentation" value={mode} onValueChange={setMode} options={[
        { value: "list", label: "List" }, { value: "board", label: "Board", disabled: true }, { value: "cards", label: "Cards" },
      ]} />
      <ul className="selection-preview-projects" data-mode={mode} aria-label="Projects">
        {[{ name: "Website refresh", owner: "Alex Morgan", status: "In review" }, { name: "Research library", owner: "Noor Aziz", status: "Draft" }, { name: "Annual review", owner: "Sam Rivera", status: "In progress" }].map(project => <li key={project.name}><div><strong>{project.name}</strong><p>{project.owner}</p></div><span>{project.status}</span></li>)}
      </ul>
      <p role="status">Current presentation: {mode}.</p>
      <Button type="reset" variant="outline">Reset presentation</Button>
    </form>
    <div dir="rtl" lang="he"><SegmentedControl label="תצוגה" dir="rtl" defaultValue="list" options={[{ value: "list", label: "רשימה" }, { value: "cards", label: "כרטיסים" }]} /></div>
  </section>;
}

function GroupPreview() {
  const [message, setMessage] = useState("Choose an action to try the group.");
  return <section className="selection-preview" aria-label="Button group example">
    <header className="selection-preview-heading"><p className="selection-preview-context">Review notes</p><h3>Document actions</h3><p>Save your draft, check the preview, or request a review.</p></header>
    <div className="selection-preview-stack"><p className="selection-preview-context">Draft controls</p><ButtonGroup label="Document actions" joined><Button variant="outline" onClick={() => setMessage("The sample document was saved.")}>Save document</Button><Button variant="outline" onClick={() => setMessage("The sample preview is open.")}>Preview</Button><Button variant="outline" disabled>Publish</Button></ButtonGroup></div>
    <div className="selection-preview-stack selection-preview-section"><p className="selection-preview-context">Review request</p><ButtonGroup label="Review actions" orientation="vertical"><Button variant="outline" onClick={() => setMessage("The regional review was requested.")}>Request a review from the regional operations team</Button><Button variant="ghost" onClick={() => setMessage("The review request was cancelled.")}>Cancel request</Button></ButtonGroup></div>
    <p role="status">{message}</p>
  </section>;
}

function CopyPreview() {
  const [simulateFailure, setSimulateFailure] = useState(true);
  const [sample, setSample] = useState("project:field-notes");
  async function writeText(text: string) {
    if (simulateFailure) throw new Error("Sample clipboard rejection");
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
  }
  return <section className="selection-preview" aria-label="Clipboard recovery example">
    <header className="selection-preview-heading"><p className="selection-preview-context">Project reference</p><h3>Copy and share</h3><p>Keep a project reference ready for your next message.</p></header>
    <div className="selection-preview-reference"><code>{sample}</code><CopyAction text={sample} writeText={writeText}>Copy project reference</CopyAction></div>
    <div className="selection-preview-stack selection-preview-section"><Checkbox label="Simulate clipboard failure" checked={simulateFailure} onCheckedChange={next => setSimulateFailure(next === true)} hint="Turn this off to retry using your clipboard." /><Button variant="outline" onClick={() => setSample(value => value === "project:field-notes" ? "project:release-plan" : "project:field-notes")}>Change reference</Button></div>
  </section>;
}

function ProgressPreview() {
  const [value, setValue] = useState(25);
  const [indeterminate, setIndeterminate] = useState(false);
  return <section className="selection-preview" aria-label="Progress and meter example">
    <div className="selection-preview-heading"><p className="selection-preview-context">Project files</p><h3>Prepare the review pack</h3><p>Collect the brief and supporting documents for the team.</p></div>
    <div className="selection-preview-progress-card">
      <Progress label="Sample file preparation" {...(indeterminate ? {} : { value })} />
      <p role="status">{indeterminate ? "Checking the files. The total is not available yet." : value === 100 ? "All four files are ready for review." : `${value / 25} of 4 files prepared.`}</p>
      <ButtonGroup label="Sample progress actions"><Button onClick={() => setValue(current => Math.min(100, current + 25))} disabled={indeterminate || value === 100}>Advance preparation</Button><Button variant="outline" onClick={() => { setValue(25); setIndeterminate(false); }}>Reset preparation</Button></ButtonGroup>
    </div>
    <Checkbox label="Unknown total" checked={indeterminate} onCheckedChange={next => setIndeterminate(next === true)} hint="Use indeterminate progress until the amount of work is known." />
    <section className="selection-preview-section selection-preview-stack"><div className="selection-preview-heading"><h3>Workspace capacity</h3><p>Storage is a measurement, separate from the preparation task.</p></div><Meter label="Workspace storage" value={38} max={100} low={20} high={80} optimum={30} valueText="38 GB of 100 GB" /><p className="selection-preview-storage-note">62 GB available for upcoming projects.</p></section>
  </section>;
}

export function SelectionPreview({ id }: { id: string }) {
  switch (id) {
    case "checkbox": return <CheckboxPreview />;
    case "radio-group": return <RadioPreview />;
    case "switch": return <SwitchPreview />;
    case "toggle-group": return <TogglePreview />;
    case "segmented-control": return <SegmentedPreview />;
    case "button-group": return <GroupPreview />;
    case "copy-action": return <CopyPreview />;
    case "progress": return <ProgressPreview />;
    default: return null;
  }
}
