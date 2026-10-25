import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Autocomplete, Button, Combobox, Dialog, DialogClose, DialogContent, DialogDescription, DialogTrigger,
  DialogFooter, DialogTitle, Fieldset, FileTextIcon, FormActions, FormErrorSummary, FormSection,
  PasswordField, SaveStatus, SearchField, TextField, type ComboboxOption, type FormErrorItem,
  type SaveStatusState,
} from "@project-kit/ui";
import "./forms-preview.css";

const teams: readonly ComboboxOption[] = [
  { value: "planning", label: "Planning", description: "Prepare project plans and milestones." },
  { value: "paused", label: "Paused team", description: "This team is unavailable.", disabled: true },
  { value: "operations", label: "Operations", description: "Coordinate delivery across teams and keep the current project moving." },
  { value: "research", label: "Research", description: "Review findings and prepare the next question." },
];
const topics: readonly ComboboxOption[] = [
  { value: "roadmap", label: "Roadmap" }, { value: "launch", label: "Launch checklist" },
  { value: "interviews", label: "Customer interviews" },
];

function FieldsetExample() {
  const [disabled, setDisabled] = useState(false);
  return <div className="forms-preview-stack">
    <FormSection heading="Contact details" headingAs="h3" description="Choose who receives updates about this project.">
      <Fieldset legend="Project contact" hint="This fictional contact receives project updates." required disabled={disabled}>
        <TextField label="Contact name" name="contactName" defaultValue="Alex Morgan" required />
        <TextField label="Contact email" type="email" name="contactEmail" defaultValue="alex@example.com" required />
      </Fieldset>
      <div className="forms-preview-actions"><Button variant="outline" onClick={() => setDisabled(current => !current)}>{disabled ? "Enable contact fields" : "Disable contact fields"}</Button></div>
    </FormSection>
    <FormSection heading="Workspace information" headingAs="h3" description="Include this reference when discussing the project with your team.">
      <Fieldset legend="Reference details" optional hint="This reference is assigned to the workspace.">
        <TextField label="Workspace reference" defaultValue="WK-2048" readOnly />
      </Fieldset>
    </FormSection>
  </div>;
}

function SummaryExample() {
  const baseId = useId();
  const nameId = `${baseId}-name`;
  const emailId = `${baseId}-email`;
  const summary = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<readonly FormErrorItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issues: FormErrorItem[] = [];
    if (!name.trim()) issues.push({ fieldId: nameId, message: "Enter a project contact name." });
    const emailInput = document.getElementById(emailId);
    if (!email || (emailInput instanceof HTMLInputElement && !emailInput.validity.valid)) issues.push({ fieldId: emailId, message: "Enter a valid contact email." });
    setErrors(issues);
    setSubmitted(issues.length === 0);
    if (issues.length > 0) queueMicrotask(() => summary.current?.focus());
  }
  return <form className="forms-preview-stack" noValidate onSubmit={submit} onReset={() => { setName(""); setEmail(""); setErrors([]); setSubmitted(false); }}>
    <header className="forms-preview-header"><h3>Project contact</h3><p>Add the person who should receive project updates.</p></header>
    <FormErrorSummary ref={summary} errors={errors} />
    <TextField id={nameId} label="Project contact name" name="name" value={name} required onChange={event => { setName(event.target.value); setSubmitted(false); }} error={errors.find(issue => issue.fieldId === nameId)?.message} />
    <TextField id={emailId} label="Project contact email" name="email" type="email" value={email} required onChange={event => { setEmail(event.target.value); setSubmitted(false); }} error={errors.find(issue => issue.fieldId === emailId)?.message} />
    <FormActions><Button type="submit">Validate contact</Button><Button type="reset" variant="outline">Reset contact</Button></FormActions>
    <p className="forms-preview-note" role="status">{submitted ? "Contact details are valid. No request was sent." : "Submit the empty form to try error navigation."}</p>
  </form>;
}

function SearchExample() {
  const [query, setQuery] = useState("");
  const [nativeQuery, setNativeQuery] = useState("");
  const documents = [
    { title: "Release notes", detail: "Recent changes to the workspace.", kind: "Updates" },
    { title: "Team handbook", detail: "Working agreements and team contacts.", kind: "Guide" },
    { title: "Project brief", detail: "The next decision, owner and review date.", kind: "Project" },
  ];
  const matches = documents.filter(document => document.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="forms-preview-stack">
    <section className="forms-preview-stack forms-preview-search" aria-label="Document search">
      <header className="forms-preview-header"><h3>Workspace documents</h3><p>Search release notes, guides and project documents.</p></header>
      <div>
        <SearchField label="Search documents" name="query" value={query} onValueChange={setQuery} placeholder="Search by title" results={`${matches.length} ${matches.length === 1 ? "document" : "documents"} found.`} />
        <ul className="forms-preview-results" aria-label="Matching documents">{matches.map(document => <li key={document.title}><span className="forms-preview-document-icon"><FileTextIcon /></span><div className="forms-preview-document-copy"><strong>{document.title}</strong><p>{document.detail}</p></div><span className="forms-preview-document-kind">{document.kind}</span></li>)}</ul>
        {!matches.length ? <div className="forms-preview-no-results"><strong>No matching documents</strong><p>Try another title or clear the search to see all documents.</p></div> : null}
      </div>
    </section>
    <section className="forms-preview-stack forms-preview-secondary" aria-label="Controlled and saved searches">
      <header className="forms-preview-header"><h4>Controlled and saved searches</h4><p>Try clearing a controlled value or restoring a saved search.</p></header>
      <SearchField label="Native controlled search" value={nativeQuery} onChange={event => setNativeQuery(event.currentTarget.value)} clearLabel="Clear native search"
        hint="Native onChange can control the field, including its clear action." results={`Native query: ${nativeQuery || "(empty)"}.`} />
      <form className="forms-preview-stack" onReset={() => undefined}>
        <SearchField label="Saved search" defaultValue="Project" name="savedSearch" hint="This uncontrolled field restores its default when its form resets." />
        <Button type="reset" variant="outline">Reset saved search</Button>
      </form>
    </section>
  </div>;
}

function PasswordExample() {
  const [submitted, setSubmitted] = useState(false);
  return <form className="forms-preview-stack" onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
    <FormSection heading="Account access" headingAs="h3" description="Enter your password to continue to the workspace.">
      <PasswordField label="Account password" name="password" autoComplete="current-password" required hint="Use a sample value. This example does not send or store it." />
      <FormActions><Button type="submit">Check password field</Button></FormActions>
      <p className="forms-preview-note" role="status">{submitted ? "The required field has a value. No request was sent." : "Show and hide the value without replacing the input."}</p>
    </FormSection>
    <section className="forms-preview-stack forms-preview-secondary" aria-label="Password field states">
      <header className="forms-preview-header"><h4>Read-only and unavailable</h4><p>A read-only value can still be revealed and copied.</p></header>
      <PasswordField label="Read-only password" defaultValue="sample-reference" readOnly autoComplete="off" />
      <PasswordField label="Unavailable password" disabled autoComplete="off" />
    </section>
  </form>;
}

function ComboboxExample() {
  const [submitted, setSubmitted] = useState("No submitted values yet.");
  const [controlled, setControlled] = useState<string | null>("planning");
  const [researchLabel, setResearchLabel] = useState("Research");
  const controlledTeams = useMemo(() => teams.map(team => team.value === "research" ? { ...team, label: researchLabel } : team), [researchLabel]);
  const [disabled, setDisabled] = useState(false);
  const [dialogContainer, setDialogContainer] = useState<HTMLDivElement | null>(null);
  return <div className="forms-preview-stack">
    <header className="forms-preview-header"><h3>Project ownership</h3><p>Choose the team responsible for the work and add a topic.</p></header>
    <form aria-label="Team choice form" className="forms-preview-stack" onSubmit={event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      setSubmitted(`Submitted team: ${String(data.get("team") ?? "")}; topic: ${String(data.get("topic") ?? "")}.`);
    }} onReset={() => setSubmitted("Choices reset to their defaults.")}>
      <Combobox label="Project team" name="team" options={teams} defaultValue="planning" required disabled={disabled} hint="Search by team name. Paused teams are unavailable for new projects." clearLabel="Clear project team" openLabel="Show project teams" />
      <Autocomplete label="Project topic" name="topic" options={topics} defaultValue="Roadmap" hint="Choose a suggestion or enter your own topic." clearLabel="Clear project topic" openLabel="Show topic suggestions" />
      <FormActions><Button type="submit">Capture choices</Button><Button type="reset" variant="outline">Reset choices</Button></FormActions>
      <p className="forms-preview-note" role="status">{submitted}</p>
    </form>
    <Button variant="outline" onClick={() => setDisabled(current => !current)}>{disabled ? "Enable project team" : "Disable project team"}</Button>
    <section className="forms-preview-stack forms-preview-secondary" aria-label="Additional team selection examples">
      <header className="forms-preview-header"><h4>Selection states</h4><p>Controlled values, read-only fields, direction and dialog placement.</p></header>
      <form aria-label="Controlled team form" className="forms-preview-stack" onReset={() => setControlled("planning")}>
        <Combobox label="Controlled team" name="controlledTeam" options={controlledTeams} value={controlled} onValueChange={setControlled} hint="The host owns this value and its reset behavior." clearLabel="Clear controlled team" openLabel="Show controlled teams" />
        <div className="forms-preview-actions"><Button variant="outline" onClick={() => setControlled("research")}>Choose Research externally</Button><Button variant="outline" onClick={() => setResearchLabel(current => current === "Research" ? "Research and discovery" : "Research")}>Refresh team labels</Button><Button type="reset" variant="outline">Reset controlled team</Button></div>
      </form>
      <Combobox label="Read-only team" options={teams} defaultValue="operations" readOnly hint="A read-only selection remains available to copy." />
      <div dir="rtl"><Combobox dir="rtl" label="Right-to-left team" options={teams} defaultValue="research" openLabel="Show right-to-left teams" clearLabel="Clear right-to-left team" hint="Option descriptions and controls follow the field direction." /></div>
      <Dialog>
        <DialogTrigger asChild><Button variant="outline">Choose a team in a dialog</Button></DialogTrigger>
        <DialogContent ref={setDialogContainer}>
          <DialogTitle>Project team dialog</DialogTitle>
          <DialogDescription>The popup stays within this dialog's focus and dismissal boundary.</DialogDescription>
          <Combobox label="Dialog project team" options={teams} defaultValue="planning" container={dialogContainer} openLabel="Show dialog teams" clearLabel="Clear dialog team" />
          <DialogFooter><DialogClose asChild><Button variant="outline">Done choosing team</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  </div>;
}

function SaveExample() {
  const [savedName, setSavedName] = useState("Northwind project");
  const [draft, setDraft] = useState("Northwind project");
  const [state, setState] = useState<SaveStatusState>("idle");
  const [discardOpen, setDiscardOpen] = useState(false);
  const failNext = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveButton = useRef<HTMLButtonElement>(null);
  const retryButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const dirty = draft !== savedName;
  const saving = state === "saving";
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  function stopSave() {
    if (timer.current !== null) { clearTimeout(timer.current); timer.current = null; }
  }
  function save() {
    if (!draft.trim() || timer.current !== null) return;
    const active = document.activeElement;
    if (active === saveButton.current || active === retryButton.current) cancelButton.current?.focus();
    const nextName = draft;
    setState("saving");
    timer.current = setTimeout(() => {
      timer.current = null;
      if (failNext.current) { failNext.current = false; setState("error"); }
      else { setSavedName(nextName); setState("saved"); }
    }, 500);
  }
  function reset() { stopSave(); setDraft(savedName); setState("idle"); }
  return <div className="forms-preview-stack">
    <header className="forms-preview-header"><h3>Project details</h3><p>Edit the project name and save when you are ready.</p></header>
    <form className="forms-preview-stack" onSubmit={event => { event.preventDefault(); save(); }} onReset={reset}>
      <TextField label="Editable project name" name="name" required value={draft} readOnly={saving} hint={<span>Saved name: <strong>{savedName}</strong></span>} onChange={event => { const next = event.target.value; setDraft(next); setState(next === savedName ? "idle" : "dirty"); }} />
      <div className="forms-preview-save-footer">
        <FormActions>
          <Button ref={saveButton} type="submit" loading={saving} disabled={!dirty}>Save project</Button>
          <Button ref={cancelButton} variant="outline" onClick={() => {
            if (saving) { stopSave(); setState("dirty"); }
            else if (dirty) setDiscardOpen(true);
            else reset();
          }}>{saving ? "Cancel save" : "Cancel changes"}</Button>
          <Button type="reset" variant="ghost" disabled={saving}>Reset draft</Button>
        </FormActions>
        <SaveStatus state={state === "idle" && dirty ? "dirty" : state} actions={state === "error" ? <Button ref={retryButton} size="sm" onClick={save}>Retry save</Button> : undefined} />
      </div>
    </form>
    <p className="forms-preview-note forms-preview-scenario">Change the fictional project name. Its first save fails; Retry then succeeds. Cancel can stop a pending save.</p>
    <Dialog open={discardOpen} onOpenChange={setDiscardOpen}>
      <DialogContent size="sm" onCloseAutoFocus={event => { event.preventDefault(); cancelButton.current?.focus(); }}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogDescription>Your saved project name will stay in place.</DialogDescription>
        <DialogFooter><DialogClose asChild><Button variant="outline">Keep editing</Button></DialogClose><Button variant="destructive" onClick={() => { reset(); setDiscardOpen(false); }}>Discard changes</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}

export function FormsPreview({ id }: { id: string }) {
  return <div className="forms-preview">{
    id === "fieldset" ? <FieldsetExample />
      : id === "form-summary" ? <SummaryExample />
        : id === "search-field" ? <SearchExample />
          : id === "password-field" ? <PasswordExample />
            : id === "combobox" ? <ComboboxExample />
              : <SaveExample />
  }</div>;
}
