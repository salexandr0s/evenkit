import { useRef, useState, type FormEvent } from "react";
import { ActionMessage, Button, MailIcon, TextareaField, TextField, Tooltip, TooltipContent, TooltipTrigger, XIcon } from "@evenkit/ui";
import "./field-preview.css";

function nameError(value: string) {
  return value.trim().length < 2 ? "Enter a project name with at least two characters." : "";
}

function notesError(value: string) {
  return value.trim().length > 0 && value.trim().length < 12 ? "Add at least 12 characters, or leave notes empty." : "";
}

export function FieldPreview() {
  const nameRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const aliasRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [alias, setAlias] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const currentNameError = attempted ? nameError(name) : "";
  const currentNotesError = attempted ? notesError(notes) : "";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    setSubmitted(false);
    if (nameError(name)) {
      nameRef.current?.focus();
      return;
    }
    if (notesError(notes)) {
      notesRef.current?.focus();
      return;
    }
    setSubmitted(true);
  }

  function reset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setName("");
    setNotes("");
    setAttempted(false);
    setSubmitted(false);
    nameRef.current?.focus();
  }

  return (
    <div className="field-workbench">
      <section className="field-section" aria-label="Form validation example">
        <div className="field-section-heading"><h3>Make the next step clear</h3><p>Labels, hints, and errors stay with their fields. Submit this form to try validation and recovery.</p></div>
        <form className="field-preview-form" noValidate onSubmit={submit} onReset={reset}>
          <TextField
            ref={nameRef}
            id="preview-project-name"
            label="Project name"
            name="projectName"
            placeholder="For example, Spring launch"
            hint="Use a name your team recognises."
            error={currentNameError}
            value={name}
            onChange={(event) => { setName(event.target.value); setSubmitted(false); }}
            maxLength={80}
            autoComplete="off"
            required
          />
          <div className="field-notes-example">
            <TextareaField
              ref={notesRef}
              id="preview-notes"
              name="notes"
              label="Notes"
              optional
              rows={3}
              maxLength={240}
              placeholder="A few details for your team"
              hint={<><p>Add context for your team.</p><p>Use at least 12 characters if you include notes.</p></>}
              error={currentNotesError ? <p>{currentNotesError}</p> : undefined}
              aria-describedby="preview-notes-count"
              value={notes}
              onChange={(event) => { setNotes(event.target.value); setSubmitted(false); }}
            />
            <p className="field-character-count" id="preview-notes-count">{notes.length} / 240 characters</p>
          </div>
          <div className="catalog-demo-actions"><Button type="submit">Submit preview</Button><Button type="reset" variant="outline">Reset preview</Button></div>
          <p className="field-caption">This form runs in your browser.</p>
          {submitted && <ActionMessage tone="success">Preview submitted. No data was sent or stored.</ActionMessage>}
        </form>
      </section>

      <section className="field-section" aria-label="Input adornments">
        <div className="field-section-heading"><h3>Keep context inside the control</h3><p>Add a leading icon, a suffix, or an action with its own accessible name.</p></div>
        <div className="field-example-grid">
          <TextField
            ref={aliasRef}
            id="preview-project-alias"
            label="Project alias"
            value={alias}
            placeholder="spring-launch"
            hint="Type an alias to reveal its clear action."
            onChange={(event) => setAlias(event.target.value)}
            endAdornment={alias ? <Tooltip><TooltipTrigger asChild><Button size="sm" shape="icon" variant="ghost" aria-label="Clear project alias" onClick={() => { setAlias(""); aliasRef.current?.focus(); }}><XIcon size="sm" /></Button></TooltipTrigger><TooltipContent>Clear project alias</TooltipContent></Tooltip> : undefined}
          />
          <TextField label="Contact email" type="email" defaultValue="team@example.com" startAdornment={<MailIcon size="sm" />} hint="Use the address your team checks." />
          <TextField label="Project address" defaultValue="spring-launch" endAdornment={<span>.project.test</span>} hint="The full address ends in .project.test." />
          <TextField label="Long address parts" defaultValue="spring" startAdornment={<span>organization.projects.</span>} endAdornment={<span>.collaboration.workspace.test</span>} hint="Long prefixes and suffixes wrap to keep the value editable." />
          <TextField label="Right-to-left address" dir="rtl" defaultValue="spring" startAdornment={<span>team.</span>} endAdornment={<span>.project.test</span>} hint="A right-to-left control inside this left-to-right page." />
        </div>
      </section>

      <section className="field-section" aria-label="Field states">
        <div className="field-section-heading"><h3>Read-only, disabled, and invalid</h3><p>Read-only values remain selectable. Disabled controls are unavailable. Errors explain how to correct an entry.</p></div>
        <div className="field-example-grid">
          <TextField label="Workspace reference" defaultValue="workspace-demo" readOnly hint="Select and copy this assigned reference." />
          <TextField label="Workspace ID" defaultValue="workspace-locked" disabled hint="Unavailable while the workspace is being created." />
          <TextField label="Email address" type="email" defaultValue="not-an-email" error="Enter an email address, such as name@example.com." />
        </div>
      </section>

      <section className="field-section" aria-label="Field sizes">
        <div className="field-section-heading"><h3>A shared size scale</h3><p>Choose the density for the form. Touch layouts keep room for an accurate tap.</p></div>
        <div className="field-size-grid">
          <TextField label="Small field" controlSize="sm" placeholder="Compact control" />
          <TextField label="Medium field" controlSize="md" placeholder="Default control" />
          <TextField label="Large field" controlSize="lg" placeholder="Prominent control" />
        </div>
      </section>
    </div>
  );
}
