import { useCallback, useId, useMemo, useRef, useState } from "react";
import { ActionMessage, Button, Checkbox, CommandPalette, DataList, DataListItem, Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, Kbd, SearchIcon, SelectField, Stack, StepIndicator, TextField, type CommandItem, type CommandSearch, type StepIndicatorItem } from "@evenkit/ui";
import { OnboardingWizard, type WizardDraft, type WizardDraftStorage, type WizardStep } from "../../../registry/blocks/onboarding-wizard";
import "./command-wizard-preview.css";

function delay(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Cancelled", "AbortError")); return; }
    const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, milliseconds);
    function abort() { window.clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); }
    signal.addEventListener("abort", abort, { once: true });
  });
}

function CommandsExample() {
  const [open, setOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const failure = useRef(false);
  const [message, setMessage] = useState("");
  const commands = useMemo<readonly CommandItem[]>(() => [
    { id: "projects", label: "Project directory", description: "Browse the current project list", group: "Destinations", href: "#data-table", icon: <SearchIcon size="sm" /> },
    { id: "calendar", label: "Calendar", description: "Plan dates and reporting periods", group: "Destinations", href: "#calendar" },
    { id: "admin", label: "Workspace administration", description: "Available to workspace administrators", group: "Destinations", href: "#workspace-switcher", disabled: true },
    { id: "create", label: "New project", description: "Open a project form", group: "Actions", onAction: () => setProjectOpen(true) },
    { id: "copy", label: "Prepare project report", description: "Create a report in this local preview", group: "Actions", onAction: () => setMessage("Project report prepared in this preview.") },
  ], []);
  const search = useCallback<CommandSearch>(async (query, { signal }) => {
    const shouldFail = failure.current;
    if (shouldFail) { failure.current = false; setFailNext(false); }
    await delay(query.toLowerCase() === "project" ? 650 : 180, signal);
    if (shouldFail) throw new Error("Search is temporarily unavailable. Try the same search again.");
    const needle = query.trim().toLowerCase();
    return commands.filter(command => `${command.label} ${command.description ?? ""}`.toLowerCase().includes(needle));
  }, [commands]);
  return <div className="command-wizard-preview">
    <div className="command-preview-intro"><div className="command-preview-symbol"><SearchIcon size="lg" /></div><h3>Find your next destination</h3><p>Search project pages and run workspace actions.</p><Button startIcon={<SearchIcon size="sm" />} onClick={() => setOpen(true)}>Open search</Button><p className="command-preview-shortcut">Or press <Kbd>Ctrl / ⌘ K</Kbd> outside a text field.</p></div>
    <p role="status" className="command-preview-note">{message}</p>
    <CommandPalette open={open} onOpenChange={setOpen} search={search} />
    <Dialog open={projectOpen} onOpenChange={setProjectOpen}><DialogContent><DialogHeader><DialogTitle>New project</DialogTitle><DialogDescription>Choose a name for this local project.</DialogDescription></DialogHeader><DialogBody><TextField label="Project name" autoComplete="off" /></DialogBody></DialogContent></Dialog>
    <section className="command-preview-options"><h3>Preview options</h3><Checkbox label="Fail the next search" checked={failNext} onCheckedChange={value => { failure.current = value === true; setFailNext(value === true); }} /><TextField label="Notes" placeholder="The search shortcut leaves text fields alone." /><Button variant="outline" onClick={() => setProjectOpen(true)}>Open project form</Button></section>
  </div>;
}

function StepsExample() {
  const [current, setCurrent] = useState("details");
  const [hasError, setHasError] = useState(false);
  const steps: readonly StepIndicatorItem[] = [
    { id: "workspace", label: "Workspace", description: "Name and contact", status: current !== "workspace" ? "complete" : "upcoming" },
    { id: "details", label: "Preferences", description: "Choose your working defaults", status: hasError ? "error" : current === "review" ? "complete" : "upcoming" },
    { id: "review", label: "Review", description: "Confirm your answers" },
  ];
  return <div className="command-wizard-preview"><h3>Workspace setup</h3><StepIndicator steps={steps} currentStep={current} onStepChange={setCurrent} aria-label="Workspace setup steps" /><ActionMessage heading={current === "workspace" ? "Workspace details" : current === "details" ? "Preferences" : "Review setup"}>Completed steps can be revisited. Upcoming steps describe what remains.</ActionMessage><div className="catalog-demo-actions"><Button variant="outline" onClick={() => { setCurrent("details"); setHasError(false); }}>Reset steps</Button><Button onClick={() => { setCurrent(current === "workspace" ? "details" : "review"); setHasError(false); }} disabled={current === "review"}>Next step</Button></div><section className="command-preview-options"><h3>Preview options</h3><Checkbox label="Preferences need attention" checked={hasError} onCheckedChange={value => setHasError(value === true)} /><StepIndicator steps={steps} currentStep={current} orientation="vertical" aria-label="Read-only setup progress" /></section></div>;
}

interface SetupData { workspace: string; email: string; updates: boolean; region: "eu" | "us" }
const initialSetup: SetupData = { workspace: "", email: "", updates: true, region: "eu" };
const storageKey = "evenkit.catalog.onboarding.v1";
function readDraft(value: unknown): WizardDraft<SetupData> | null {
  if (value === null) return null;
  if (typeof value !== "object" || !("version" in value) || typeof value.version !== "number" || !("stepId" in value) || typeof value.stepId !== "string" || !("savedAt" in value) || typeof value.savedAt !== "string" || !("data" in value) || typeof value.data !== "object" || value.data === null) throw new Error("The saved draft could not be read. Start a new draft or restore valid data.");
  const data = value.data;
  if (!("workspace" in data) || typeof data.workspace !== "string" || !("email" in data) || typeof data.email !== "string" || !("updates" in data) || typeof data.updates !== "boolean" || !("region" in data) || (data.region !== "eu" && data.region !== "us")) throw new Error("The saved draft has invalid answers.");
  return { version: value.version, stepId: value.stepId, savedAt: value.savedAt, data: { workspace: data.workspace, email: data.email, updates: data.updates, region: data.region } };
}

function WizardExample() {
  const id = useId();
  const [generation, setGeneration] = useState(0);
  const [failSubmit, setFailSubmit] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [slowCleanup, setSlowCleanup] = useState(false);
  const storageFailure = useRef(false);
  const cleanupDelay = useRef(false);
  const [savedName, setSavedName] = useState("");
  const storage = useMemo<WizardDraftStorage<SetupData>>(() => ({
    load: async ({ signal }) => { await delay(150, signal); if (storageFailure.current) throw new Error("Draft storage is unavailable. Your current answers can still be submitted."); const raw = localStorage.getItem(storageKey); return readDraft(raw === null ? null : JSON.parse(raw) as unknown); },
    save: async (draft, { signal }) => { await delay(150, signal); if (storageFailure.current) throw new Error("Draft storage is unavailable. Your answers are still on this page."); localStorage.setItem(storageKey, JSON.stringify(draft)); },
    clear: async ({ signal }) => { await delay(cleanupDelay.current ? 1200 : 150, signal); if (storageFailure.current) throw new Error("The saved draft could not be removed. Try again when storage is available."); localStorage.removeItem(storageKey); },
  }), []);
  const steps = useMemo<readonly WizardStep<SetupData>[]>(() => [
    { id: "workspace", title: "Workspace details", description: "Choose a workspace name and a contact address.",
      validate: data => [...(!data.workspace.trim() ? [{ fieldId: `${id}-workspace`, message: "Enter a workspace name." }] : []), ...(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? [{ fieldId: `${id}-email`, message: "Enter a valid email address." }] : [])],
      render: ({ data, update, errors, disabled }) => <Stack><TextField id={`${id}-workspace`} label="Workspace name" required value={data.workspace} disabled={disabled} error={errors.find(error => error.fieldId === `${id}-workspace`)?.message} onChange={event => update({ ...data, workspace: event.currentTarget.value })} /><TextField id={`${id}-email`} label="Contact email" type="email" autoComplete="email" required value={data.email} disabled={disabled} error={errors.find(error => error.fieldId === `${id}-email`)?.message} onChange={event => update({ ...data, email: event.currentTarget.value })} /></Stack> },
    { id: "preferences", title: "Preferences", description: "Set the defaults for this workspace.", validate: () => [],
      render: ({ data, update, disabled }) => <Stack><SelectField label="Data region" value={data.region} disabled={disabled} options={[{ value: "eu", label: "Europe" }, { value: "us", label: "United States" }]} onValueChange={value => { if (value === "eu" || value === "us") update({ ...data, region: value }); }} /><Checkbox label="Send workspace updates" checked={data.updates} disabled={disabled} onCheckedChange={value => update({ ...data, updates: value === true })} /></Stack> },
  ], [id]);
  return <div className="command-wizard-preview">
    <OnboardingWizard key={generation} initialData={initialSetup} steps={steps} storage={storage} title="Workspace setup" successTitle="Workspace is ready" successContent={<p>{savedName} has been created in this local preview.</p>}
      renderReview={(data, edit) => <Stack><DataList><DataListItem term="Workspace">{data.workspace}</DataListItem><DataListItem term="Contact">{data.email}</DataListItem><DataListItem term="Data region">{data.region === "eu" ? "Europe" : "United States"}</DataListItem><DataListItem term="Updates">{data.updates ? "Enabled" : "Disabled"}</DataListItem></DataList><div className="catalog-demo-actions"><Button type="button" variant="outline" size="sm" onClick={() => edit("workspace")}>Edit workspace</Button><Button type="button" variant="outline" size="sm" onClick={() => edit("preferences")}>Edit preferences</Button></div></Stack>}
      onSubmit={async (data, { signal }) => { const shouldFail = failSubmit; await delay(650, signal); if (shouldFail) { setFailSubmit(false); throw new Error("The sample request failed. Retry to keep the same answers."); } setSavedName(data.workspace); }} />
    <section className="command-preview-options"><h3>Preview options</h3><Checkbox label="Fail the next submission" checked={failSubmit} onCheckedChange={value => setFailSubmit(value === true)} /><Checkbox label="Draft storage unavailable" checked={storageUnavailable} onCheckedChange={value => { storageFailure.current = value === true; setStorageUnavailable(value === true); }} /><Checkbox label="Delay draft cleanup" checked={slowCleanup} onCheckedChange={value => { cleanupDelay.current = value === true; setSlowCleanup(value === true); }} /><Button variant="outline" onClick={() => { setGeneration(value => value + 1); setSavedName(""); }}>Reopen setup</Button><p className="command-preview-note">Save a draft, then reopen setup to recover it. This example stores drafts in your browser.</p></section>
  </div>;
}

export function CommandWizardPreview({ id }: { id: string }) {
  if (id === "command-palette") return <CommandsExample />;
  if (id === "step-indicator") return <StepsExample />;
  return <WizardExample />;
}
