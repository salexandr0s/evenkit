import type { CatalogEntry } from "./catalog-types.js";

const styles = '"use client";\n\nimport "@project-kit/tokens/css";\nimport "@project-kit/ui/css";\n';

export const formsEntries: readonly CatalogEntry[] = [
  {
    id: "fieldset", name: "Fieldset and form section", group: "Controls", inventoryIds: ["C01"],
    description: "Group related fields with native legends, descriptions, and disabled behavior.",
    tags: ["fieldset", "legend", "form section", "group", "disabled", "required", "C01"],
    source: "Original kit composition · native fieldset and input contract", sourceUrl: "https://ui.shadcn.com/docs/components/radix/field",
    usage: `${styles}import { Fieldset, FormSection, TextField } from "@project-kit/ui";

export function ContactSection() {
  return (
    <FormSection heading="Contact details" description="Who should receive project updates?">
      <Fieldset legend="Project contact" hint="Use a team address." required>
        <TextField label="Name" name="name" required autoComplete="name" />
        <TextField label="Email" name="email" type="email" required autoComplete="email" />
      </Fieldset>
    </FormSection>
  );
}
`,
  },
  {
    id: "form-summary", name: "Form error summary", group: "Feedback", inventoryIds: ["C02"],
    description: "Link validation errors to their fields and give failed submissions a stable focus destination.",
    tags: ["form", "error", "summary", "validation", "focus", "status", "C02"],
    source: "Original kit validation composition · native focus and field associations", sourceUrl: "https://www.w3.org/WAI/tutorials/forms/notifications/",
    usage: `${styles}import { useRef, useState } from "react";
import { Button, FormErrorSummary, TextField, type FormErrorItem } from "@project-kit/ui";

export function ContactValidation() {
  const summary = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<readonly FormErrorItem[]>([]);
  return (
    <form noValidate onSubmit={event => {
      event.preventDefault();
      const name = String(new FormData(event.currentTarget).get("name") ?? "");
      setErrors(name.trim() ? [] : [{ fieldId: "contact-name", message: "Enter a contact name." }]);
      queueMicrotask(() => summary.current?.focus());
    }}>
      <FormErrorSummary ref={summary} errors={errors} />
      <TextField id="contact-name" label="Contact name" name="name" required
        error={errors.find(error => error.fieldId === "contact-name")?.message} />
      <Button type="submit">Validate contact</Button>
    </form>
  );
}
`,
  },
  {
    id: "search-field", name: "Search field", group: "Controls", inventoryIds: ["C03"],
    description: "Search with a clear action, result feedback, and focus that stays with the input.",
    tags: ["search", "input", "clear", "query", "results", "C03"],
    source: "Original kit field extension · native search input", sourceUrl: "https://ui.shadcn.com/docs/components/radix/input-group",
    usage: `${styles}import { useState } from "react";
import { SearchField } from "@project-kit/ui";

export function DocumentSearch({ titles }: { titles: readonly string[] }) {
  const [query, setQuery] = useState("");
  const matches = titles.filter(title => title.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <SearchField label="Search documents" name="query" value={query} onValueChange={setQuery}
        results={matches.length + " documents found."} />
      <ul>{matches.map(title => <li key={title}>{title}</li>)}</ul>
    </>
  );
}
`,
  },
  {
    id: "password-field", name: "Password field", group: "Controls", inventoryIds: ["C04"],
    description: "Show or hide a password while preserving the input, value, autofill, and selection.",
    tags: ["password", "show", "hide", "autofill", "form", "C04"],
    source: "Original kit field extension · native password semantics", sourceUrl: "https://ui.shadcn.com/docs/components/radix/input-group",
    usage: `${styles}import { Button, PasswordField } from "@project-kit/ui";

export function PasswordForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  return (
    <form onSubmit={event => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}>
      <PasswordField label="Password" name="password" required autoComplete="current-password"
        hint="Use the password for this account." />
      <Button type="submit">Sign in</Button>
    </form>
  );
}
`,
  },
  {
    id: "combobox", name: "Combobox and autocomplete", group: "Controls", inventoryIds: ["C07"],
    description: "Search predefined options by label, select stable IDs, or enter free text with suggestions.",
    tags: ["combobox", "autocomplete", "search", "options", "disabled", "form", "C07"],
    source: "Base UI 1.9.0 behavior · original kit fields and popup styling", sourceUrl: "https://base-ui.com/react/components/combobox",
    usage: `${styles}import { Autocomplete, Button, Combobox, type ComboboxOption } from "@project-kit/ui";

const teams: readonly ComboboxOption[] = [
  { value: "planning", label: "Planning", description: "Plans and milestones" },
  { value: "operations", label: "Operations", description: "Project delivery" },
  { value: "archived", label: "Archived team", disabled: true },
];

export function TeamForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  return (
    <form onSubmit={event => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}>
      <Combobox label="Project team" name="team" options={teams} required defaultValue="planning" />
      <Autocomplete label="Topic" name="topic" options={[{ value: "launch", label: "Launch" }]}
        hint="Choose a suggestion or enter your own topic." />
      <Button type="submit">Save choices</Button>
      <Button type="reset" variant="outline">Reset choices</Button>
    </form>
  );
}
`,
  },
  {
    id: "form-actions", name: "Form actions and unsaved changes", group: "Compositions", inventoryIds: ["C15"],
    description: "Compose save, cancel, and reset actions with explicit dirty state and dismissal recovery.",
    tags: ["form", "actions", "dirty", "unsaved", "save", "cancel", "reset", "C15"],
    source: "Original kit form recipe · host-owned submission and navigation", sourceUrl: "https://ui.shadcn.com/docs/components/radix/field",
    usage: `${styles}import { useRef, useState } from "react";
import { Button, FormActions, SaveStatus, TextField } from "@project-kit/ui";

export function ProjectNameForm({ savedName, onSave, onCancel }: {
  savedName: string;
  onSave: (name: string) => Promise<void>;
  onCancel: (hasUnsavedChanges: boolean) => void;
}) {
  const [name, setName] = useState(savedName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const submit = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const dirty = name !== savedName;
  return (
    <form onSubmit={async event => {
      event.preventDefault();
      if (document.activeElement === submit.current) cancel.current?.focus();
      setSaving(true); setError(false);
      try { await onSave(name); } catch { setError(true); }
      finally { setSaving(false); }
    }} onReset={() => { setName(savedName); setError(false); }}>
      <TextField label="Project name" name="name" required value={name} readOnly={saving}
        onChange={event => setName(event.target.value)} />
      <FormActions dirty={dirty}>
        <Button ref={submit} type="submit" loading={saving}>Save project</Button>
        <Button ref={cancel} variant="outline" onClick={() => onCancel(dirty)}>Cancel</Button>
        <Button type="reset" variant="ghost" disabled={saving}>Reset draft</Button>
      </FormActions>
      <SaveStatus state={error ? "error" : saving ? "saving" : dirty ? "dirty" : "idle"} />
    </form>
  );
}

// The host confirms dirty dismissal and updates savedName after a successful save.
`,
  },
  {
    id: "save-status", name: "Save and submission status", group: "Feedback", inventoryIds: ["G04"],
    description: "Show saving, saved, failed, retry, and unsaved states using persistent feedback.",
    tags: ["save", "submission", "status", "retry", "pending", "success", "error", "G04"],
    source: "Original kit ActionMessage composition · host-owned async state", sourceUrl: "https://ui.shadcn.com/docs/components/radix/alert",
    usage: `${styles}import { Button, SaveStatus, type SaveStatusState } from "@project-kit/ui";

export function SubmissionFeedback({ state, onRetry }: {
  state: SaveStatusState;
  onRetry: () => void;
}) {
  return <SaveStatus state={state}
    actions={state === "error" ? <Button onClick={onRetry}>Retry save</Button> : undefined} />;
}
`,
  },
];
