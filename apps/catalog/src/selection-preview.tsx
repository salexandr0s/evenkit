import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Checkbox, CheckboxGroup, CopyAction, Meter, Progress, RadioGroup, SegmentedControl, Switch, Toggle, ToggleGroup, ToggleGroupItem } from "@project-kit/ui";
import "./selection-preview.css";

function CheckboxPreview() {
  const [result, setResult] = useState("Submit to inspect the selected values.");
  const [error, setError] = useState("");
  const first = useRef<HTMLButtonElement>(null);
  return <section className="selection-preview" aria-label="Checkbox form example">
    <h3>Delivery channels</h3><p>Try mixed state, disabled choices, form values and native reset.</p>
    <form className="selection-preview-stack" onSubmit={event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const channels = data.getAll("channel");
      if (channels.length === 0) { setError("Choose at least one delivery channel."); first.current?.focus(); return; }
      setError(""); setResult(`Channels: ${channels.join(", ")}. Approval: ${data.has("approval") ? "confirmed" : "not confirmed"}.`);
    }} onReset={() => { setError(""); setResult("Form reset to the initial values."); }}>
      <CheckboxGroup label="Send updates by" hint="Choose at least one channel." error={error}>
        <Checkbox ref={first} name="channel" value="email" defaultChecked label="Email" hint="A digest sent to your registered address." />
        <Checkbox name="channel" value="inbox" label="Workspace inbox" />
        <Checkbox name="channel" value="sms" disabled label="SMS, managed by the organization" />
      </CheckboxGroup>
      <Checkbox name="approval" defaultChecked="indeterminate" label="Partial approval" hint="Mixed state becomes checked when activated; it is initially omitted from FormData." />
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
  return <section className="selection-preview-stack" aria-label="Required choices example">
    <h3>Required choices</h3><p>Native submission validation returns focus to the visible control and keeps the browser's validation message associated with it.</p>
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
    <h3>One schedule</h3><p>Arrow keys skip unavailable choices. A native reset restores the initial selection.</p>
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
    <h3>Save a preference</h3><p>The first sample save fails; the next succeeds. Focus stays on the switch while saving.</p>
    <Switch label="Project notifications" checked={checked} onCheckedChange={save} pending={pending} error={error} hint="Receive updates when a project changes." />
    <p role="status">{message}</p>
    <Switch label="Security notices, required by the organization" defaultChecked disabled />
    <form className="selection-preview-stack" aria-label="Switch form values" onSubmit={event => {
      event.preventDefault(); setFormResult(new FormData(event.currentTarget).has("digest") ? "Weekly digest enabled." : "Weekly digest disabled.");
    }} onReset={() => setFormResult("Weekly digest reset to enabled.")}>
      <Switch label="Weekly digest" name="digest" defaultChecked />
      <ButtonGroup label="Switch form actions"><Button type="submit">Inspect digest</Button><Button type="reset" variant="outline">Reset digest</Button></ButtonGroup>
      <p role="status">{formResult}</p>
    </form>
  </section>;
}

function TogglePreview() {
  const [formats, setFormats] = useState<string[]>(["bold"]);
  return <section className="selection-preview" aria-label="Toggle actions example">
    <h3>Pressed actions</h3><p>Toggle actions can be independent or use a group with arrow-key navigation.</p>
    <div><Toggle>Bookmark project</Toggle></div>
    <ToggleGroup type="multiple" aria-label="Text formatting" value={formats} onValueChange={setFormats}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem><ToggleGroupItem value="italic" disabled>Italic unavailable</ToggleGroupItem><ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
    <p role="status">Formatting: {formats.length ? formats.join(", ") : "none"}.</p>
    <ToggleGroup type="single" aria-label="Text alignment" defaultValue="start"><ToggleGroupItem value="start">Start</ToggleGroupItem><ToggleGroupItem value="center">Center</ToggleGroupItem><ToggleGroupItem value="end">End</ToggleGroupItem></ToggleGroup>
  </section>;
}

function SegmentedPreview() {
  const [mode, setMode] = useState("list");
  return <section className="selection-preview" aria-label="Segmented mode example">
    <h3>Choose a presentation</h3><p>This is a form value and mode choice. It uses radio semantics.</p>
    <form className="selection-preview-stack" onReset={() => setMode("list")}>
      <SegmentedControl label="Project presentation" name="presentation" value={mode} onValueChange={setMode} options={[
        { value: "list", label: "List" }, { value: "board", label: "Board", disabled: true }, { value: "cards", label: "Cards" },
      ]} />
      <p role="status">Current presentation: {mode}.</p>
      <Button type="reset" variant="outline">Reset presentation</Button>
    </form>
    <div dir="rtl" lang="he"><SegmentedControl label="תצוגה" dir="rtl" defaultValue="list" options={[{ value: "list", label: "רשימה" }, { value: "cards", label: "כרטיסים" }]} /></div>
  </section>;
}

function GroupPreview() {
  const [message, setMessage] = useState("Choose an action to try the group.");
  return <section className="selection-preview" aria-label="Button group example">
    <h3>Related actions</h3><p>Every action stays in the normal Tab order. Labels grow with their content.</p>
    <ButtonGroup label="Document actions" joined><Button variant="outline" onClick={() => setMessage("The sample document was saved.")}>Save document</Button><Button variant="outline" onClick={() => setMessage("The sample preview is open.")}>Preview</Button><Button variant="outline" disabled>Publish</Button></ButtonGroup>
    <ButtonGroup label="Review actions" orientation="vertical"><Button variant="outline" onClick={() => setMessage("The regional review was requested.")}>Request a review from the regional operations team</Button><Button variant="ghost" onClick={() => setMessage("The review request was cancelled.")}>Cancel request</Button></ButtonGroup>
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
    <h3>Copy a reference</h3><p>The sample starts with a rejected write. Turn off the failure to use your clipboard.</p>
    <code>{sample}</code>
    <Checkbox label="Simulate clipboard failure" checked={simulateFailure} onCheckedChange={next => setSimulateFailure(next === true)} />
    <div><CopyAction text={sample} writeText={writeText}>Copy project reference</CopyAction></div>
    <div><Button variant="outline" onClick={() => setSample(value => value === "project:field-notes" ? "project:release-plan" : "project:field-notes")}>Change reference</Button></div>
  </section>;
}

function ProgressPreview() {
  const [value, setValue] = useState(25);
  const [indeterminate, setIndeterminate] = useState(false);
  return <section className="selection-preview" aria-label="Progress and meter example">
    <h3>Work and measurements</h3><p>Progress describes completed work. Meter describes a value within a known range.</p>
    <Progress label="Sample file preparation" {...(indeterminate ? {} : { value })} />
    <Checkbox label="Unknown total" checked={indeterminate} onCheckedChange={next => setIndeterminate(next === true)} />
    <ButtonGroup label="Sample progress actions"><Button onClick={() => setValue(current => Math.min(100, current + 25))} disabled={indeterminate || value === 100}>Advance preparation</Button><Button variant="outline" onClick={() => { setValue(25); setIndeterminate(false); }}>Reset preparation</Button></ButtonGroup>
    <Meter label="Workspace storage" value={38} max={100} low={20} high={80} optimum={30} valueText="38 GB of 100 GB" />
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
