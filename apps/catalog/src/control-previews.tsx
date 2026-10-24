import { useState, type FormEvent } from "react";
import {
  ActionMessage, Badge, Button, ButtonLink, Dialog, DialogClose,
  DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger,
  EmptyState, Label, Select, Skeleton, Spinner, TextField
} from "@project-kit/ui";

const visibilityOptions = [
  { value: "private", label: "Private" },
  { value: "team", label: "Team" },
  { value: "public", label: "Public" }
] as const;
const regionOptions = [{ value: "eu", label: "Europe" }] as const;

export function ButtonPreview() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="catalog-demo-stack">
      <div>
        <p className="catalog-state-label">Variants</p>
        <div className="catalog-demo-actions">
          <Button onClick={() => setClicks((value) => value + 1)}>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <ButtonLink variant="link" href="#fields">View fields</ButtonLink>
        </div>
        <p className="catalog-caption" role="status">
          {clicks ? `Primary action activated ${clicks} ${clicks === 1 ? "time" : "times"}.` : "Try the primary action. This example stays in your browser."}
        </p>
      </div>
      <div className="catalog-demo-divider">
        <p className="catalog-state-label">Sizes</p>
        <div className="catalog-demo-actions catalog-align-end">
          <Button size="sm" variant="outline">Small</Button>
          <Button size="md" variant="outline">Medium</Button>
          <Button size="lg" variant="outline">Large</Button>
        </div>
      </div>
      <div className="catalog-demo-divider">
        <p className="catalog-state-label">Disabled and busy</p>
        <div className="catalog-demo-actions">
          <Button disabled>Disabled action</Button>
          <Button loading>Loading state</Button>
          <ButtonLink variant="outline" href="#tokens">Explore tokens</ButtonLink>
        </div>
      </div>
    </div>
  );
}

export function SelectPreview() {
  const [visibility, setVisibility] = useState("private");
  const [formValue, setFormValue] = useState<string>();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("visibility");
    setFormValue(typeof value === "string" ? value : "");
  }

  return (
    <form className="catalog-preview-form" onSubmit={submit}>
      <div className="catalog-demo-field">
        <Label htmlFor="preview-visibility">Project visibility</Label>
        <Select id="preview-visibility" name="visibility" required value={visibility} options={visibilityOptions} onValueChange={(value) => { setVisibility(value); setFormValue(undefined); }} aria-describedby="visibility-help" />
        <p className="catalog-caption" id="visibility-help" role="status">Selected in this preview: {visibility}.</p>
      </div>
      <div className="catalog-demo-field">
        <Label htmlFor="preview-region">Region</Label>
        <Select id="preview-region" disabled defaultValue="eu" options={regionOptions} />
        <p className="catalog-caption">Disabled selection example.</p>
      </div>
      <Button type="submit">Read selection</Button>
      {formValue !== undefined && <ActionMessage tone={formValue ? "info" : "error"}>{formValue ? `Form value: ${formValue}.` : "No selection value was included in this preview form."}</ActionMessage>}
    </form>
  );
}

export function DialogPreview() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Spring launch");
  const [draft, setDraft] = useState(name);
  const [visibility, setVisibility] = useState("private");
  const [draftVisibility, setDraftVisibility] = useState(visibility);
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    setName(draft.trim());
    setVisibility(draftVisibility);
    setSaved(true);
    setOpen(false);
  }

  return (
    <div className="catalog-dialog-preview">
      <div className="catalog-project-icon" aria-hidden="true"><span /><span /><span /><span /></div>
      <p className="catalog-project-title">{name}</p>
      <p className="catalog-caption">Visibility: {visibility}. Open the dialog to edit this preview.</p>
      <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (next) { setDraft(name); setDraftVisibility(visibility); } }}>
        <DialogTrigger asChild><Button>Edit project</Button></DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>Update the project details in this preview. No changes are sent or stored.</DialogDescription>
          <form className="catalog-dialog-form" onSubmit={submit}>
            <TextField label="Project name" value={draft} onChange={(event) => setDraft(event.target.value)} required maxLength={80} autoComplete="off" />
            <div className="catalog-demo-field">
              <Label htmlFor="dialog-project-visibility">Project visibility</Label>
              <Select id="dialog-project-visibility" options={visibilityOptions} value={draftVisibility} onValueChange={setDraftVisibility} />
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={!draft.trim()}>Save preview</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {saved && <ActionMessage tone="success">Project details updated in this preview.</ActionMessage>}
    </div>
  );
}

export function StatusPreview() {
  return (
    <div className="catalog-demo-stack">
      <div>
        <p className="catalog-state-label">Badges</p>
        <div className="catalog-demo-actions">
          <Badge>Draft</Badge><Badge tone="accent">In progress</Badge>
          <Badge tone="success">Active</Badge><Badge tone="warning">Needs review</Badge>
          <Badge tone="danger">Failed</Badge>
        </div>
      </div>
      <div className="catalog-demo-divider catalog-demo-stack">
        <p className="catalog-state-label">Persistent feedback</p>
        <ActionMessage tone="success">Your preview is ready to review.</ActionMessage>
        <ActionMessage tone="info">Changes remain in this preview.</ActionMessage>
        <ActionMessage tone="error">Example failure: your changes could not be saved. Try again.</ActionMessage>
      </div>
    </div>
  );
}

export function LoadingPreview() {
  return (
    <div className="catalog-demo-stack">
      <div className="catalog-demo-actions"><Spinner label="Loading projects" /><span>Loading projects</span></div>
      <div className="catalog-demo-divider">
        <p className="catalog-state-label">Content placeholder</p>
        <div className="catalog-skeleton-card" aria-label="Loading project details" aria-busy="true">
          <Skeleton className="catalog-skeleton-avatar" />
          <div className="catalog-skeleton-lines"><Skeleton /><Skeleton /><Skeleton /></div>
        </div>
      </div>
      <p className="catalog-caption">Motion follows the reduced-motion preference on your device.</p>
    </div>
  );
}

export function EmptyPreview() {
  const [created, setCreated] = useState(false);
  const [recovered, setRecovered] = useState(false);
  return (
    <div className="catalog-demo-stack">
      {created ? <ActionMessage tone="success">A preview project is ready. No project was created outside this catalog.</ActionMessage> : (
        <EmptyState title="No projects yet" description="Create a project to bring your work together." action={<Button onClick={() => setCreated(true)}>Create preview project</Button>} />
      )}
      <div className="catalog-demo-divider">
        {recovered ? <ActionMessage tone="success">The retry preview succeeded. No external service was contacted.</ActionMessage> : (
          <EmptyState title="Projects could not be loaded" description="This is a recoverable error example. Try the action to see the success state." action={<Button variant="outline" onClick={() => setRecovered(true)}>Retry preview</Button>} />
        )}
      </div>
      {(created || recovered) && <Button variant="ghost" onClick={() => { setCreated(false); setRecovered(false); }}>Reset example</Button>}
    </div>
  );
}
