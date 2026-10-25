import type { CatalogEntry } from "./catalog-types.js";

function usage(imports: string, body: string) {
  return `"use client";\n\nimport "@project-kit/tokens/css";\nimport "@project-kit/ui/css";\n${imports}\n\n${body}\n`;
}

export const selectionEntries: readonly CatalogEntry[] = [
  {
    id: "checkbox", name: "Checkbox", group: "Controls", inventoryIds: ["B01"],
    description: "Single and grouped choices with mixed state, field feedback, native form values and reset.",
    tags: ["checkbox", "checkbox group", "mixed", "indeterminate", "selection", "form", "required", "reset"],
    source: "Radix Checkbox 1.4.1 · original kit field composition",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/checkbox",
    usage: usage('import { Button, Checkbox, CheckboxGroup } from "@project-kit/ui";', `export function DeliveryOptions({ onSubmit }: { onSubmit: (values: FormData) => void }) {
  return (
    <form onSubmit={event => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}>
      <CheckboxGroup label="Delivery channels" hint="Choose the channels your team uses.">
        <Checkbox label="Email" name="channel" value="email" defaultChecked />
        <Checkbox label="Workspace inbox" name="channel" value="inbox" />
      </CheckboxGroup>
      <Checkbox label="Partial approval" name="approval" defaultChecked="indeterminate" />
      <Button type="submit">Save delivery options</Button>
      <Button type="reset" variant="outline">Reset</Button>
    </form>
  );
}`),
  },
  {
    id: "radio-group", name: "Radio group", group: "Controls", inventoryIds: ["B02"],
    description: "One choice from a labeled group, with descriptions, disabled-option skipping and native form integration.",
    tags: ["radio", "radio group", "one choice", "form", "schedule", "keyboard", "reset"],
    source: "Radix RadioGroup 1.5.1 · kit labels and feedback",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/radio-group",
    usage: usage('import { Button, RadioGroup } from "@project-kit/ui";', `export function ScheduleOptions({ onSubmit }: { onSubmit: (values: FormData) => void }) {
  return (
    <form onSubmit={event => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}>
      <RadioGroup label="Delivery schedule" name="schedule" defaultValue="weekly" required options={[
        { value: "weekly", label: "Weekly", description: "A summary every Monday." },
        { value: "instant", label: "Immediately", disabled: true },
        { value: "monthly", label: "Monthly" },
      ]} />
      <Button type="submit">Save schedule</Button>
      <Button type="reset" variant="outline">Reset</Button>
    </form>
  );
}`),
  },
  {
    id: "switch", name: "Switch", group: "Controls", inventoryIds: ["B03"],
    description: "Immediate preferences with a focus-preserving pending state and associated save errors.",
    tags: ["switch", "preference", "toggle", "pending", "save", "error", "retry"],
    source: "Radix Switch 1.4.1 · kit feedback and pending behavior",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/switch",
    usage: usage('import { Switch } from "@project-kit/ui";', `interface NotificationPreferenceProps {
  enabled: boolean;
  saving: boolean;
  error?: string;
  onChange: (enabled: boolean) => void;
}

export function NotificationPreference({ enabled, saving, error, onChange }: NotificationPreferenceProps) {
  return (
    <Switch label="Project notifications" checked={enabled} onCheckedChange={onChange}
      pending={saving} error={error} hint="Receive updates when a project changes." />
  );
}

// The host saves the preference, updates enabled on success, and supplies errors.`),
  },
  {
    id: "toggle-group", name: "Toggle and toggle group", group: "Controls", inventoryIds: ["B04"],
    description: "Pressed actions with independent, single or multiple selection and roving keyboard focus.",
    tags: ["toggle", "toggle group", "pressed", "formatting", "toolbar", "keyboard", "alignment"],
    source: "Radix ToggleGroup 1.2.1 · kit pressed Button",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/toggle-group",
    usage: usage('import { useState } from "react";\nimport { Toggle, ToggleGroup, ToggleGroupItem } from "@project-kit/ui";', `export function FormattingActions() {
  const [formats, setFormats] = useState<string[]>(["bold"]);
  return (
    <>
      <Toggle>Bookmark project</Toggle>
      <ToggleGroup type="multiple" aria-label="Text formatting" value={formats} onValueChange={setFormats}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}`),
  },
  {
    id: "segmented-control", name: "Segmented control", group: "Controls", inventoryIds: ["B05"],
    description: "Compact mode selection with radio semantics, disabled choices and a native form value.",
    tags: ["segmented", "mode", "view", "radio", "form", "list", "cards", "rtl"],
    source: "Radix RadioGroup 1.5.1 · original segmented presentation",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/radio-group",
    usage: usage('import { useState } from "react";\nimport { SegmentedControl } from "@project-kit/ui";', `export function ProjectPresentation() {
  const [mode, setMode] = useState("list");
  return (
    <SegmentedControl label="Project presentation" name="presentation" value={mode} onValueChange={setMode}
      options={[{ value: "list", label: "List" }, { value: "cards", label: "Cards" }]} />
  );
}

// Use Tabs when the controls select associated tab panels.`),
  },
  {
    id: "button-group", name: "Button group", group: "Controls", inventoryIds: ["B06"],
    description: "Named joined or spaced actions that retain normal Tab order and allow growing labels.",
    tags: ["button group", "actions", "joined", "vertical", "horizontal", "wrapping"],
    source: "Original kit composition · native group semantics",
    sourceUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
    usage: usage('import { Button, ButtonGroup } from "@project-kit/ui";', `export function DocumentActions({ onSave, onPreview }: { onSave: () => void; onPreview: () => void }) {
  return (
    <ButtonGroup label="Document actions" joined>
      <Button variant="outline" onClick={onSave}>Save document</Button>
      <Button variant="outline" onClick={onPreview}>Preview</Button>
    </ButtonGroup>
  );
}`),
  },
  {
    id: "copy-action", name: "Copy action", group: "Controls", inventoryIds: ["B08"],
    description: "Copy real values with confirmed success, visible failure, retry and stable focus.",
    tags: ["copy", "clipboard", "reference", "failure", "retry", "feedback"],
    source: "Original kit Clipboard API composition",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText",
    usage: usage('import { CopyAction } from "@project-kit/ui";', `export function CopyProjectReference({ reference }: { reference: string }) {
  return <CopyAction text={reference}>Copy project reference</CopyAction>;
}

// A rejected or unavailable clipboard reports failure; the control keeps focus.
// Pass writeText when the host supplies its own clipboard integration.`),
  },
  {
    id: "progress", name: "Progress and meter", group: "Feedback", inventoryIds: ["G02"],
    description: "Labeled native progress for work and a separate meter for bounded measurements.",
    tags: ["progress", "meter", "determinate", "indeterminate", "percentage", "measurement", "loading"],
    source: "Original kit composition · native progress and meter",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress",
    usage: usage('import { Meter, Progress } from "@project-kit/ui";', `export function PreparationStatus({ completed, total }: { completed: number; total: number }) {
  return (
    <>
      <Progress label="File preparation" value={completed} max={total} />
      <Progress label="Connecting to the workspace" />
      <Meter label="Workspace storage" value={38} max={100} valueText="38 GB of 100 GB" />
    </>
  );
}`),
  },
];
