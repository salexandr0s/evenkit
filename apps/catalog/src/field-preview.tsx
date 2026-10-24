import { useState, type FormEvent } from "react";
import { ActionMessage, Button, Label, Textarea, TextField } from "@project-kit/ui";

export function FieldPreview() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);
    if (name.trim().length < 2) {
      setError("Enter a project name with at least two characters.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <div className="catalog-demo-stack">
      <form className="catalog-preview-form" noValidate onSubmit={submit}>
        <TextField
          label="Project name"
          name="projectName"
          placeholder="For example, Spring launch"
          hint="Use a name your team recognises."
          error={error}
          value={name}
          onChange={(event) => { setName(event.target.value); setSubmitted(false); }}
          maxLength={80}
          required
        />
        <div className="catalog-demo-field">
          <Label htmlFor="preview-notes">Notes</Label>
          <Textarea id="preview-notes" placeholder="A few details for your team" rows={3} />
        </div>
        <div className="catalog-demo-actions">
          <Button type="submit">Submit preview</Button>
          <span className="catalog-caption">This form runs in your browser.</span>
        </div>
        {submitted && <ActionMessage tone="success">Preview submitted. No data was sent or stored.</ActionMessage>}
      </form>
      <div className="catalog-demo-divider">
        <span className="catalog-state-label">Disabled</span>
        <TextField label="Workspace ID" value="workspace-demo" disabled readOnly hint="Assigned when a workspace is created." />
      </div>
      <div className="catalog-demo-divider">
        <span className="catalog-state-label">Invalid</span>
        <TextField label="Email address" type="email" defaultValue="not-an-email" error="Enter an email address, such as name@example.com." />
      </div>
    </div>
  );
}
