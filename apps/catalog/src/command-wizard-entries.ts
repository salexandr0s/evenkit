import type { CatalogEntry } from "./catalog-types.js";

const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';
export const commandWizardEntries: readonly CatalogEntry[] = [
  { id: "command-palette", name: "Command palette", group: "Compositions", inventoryIds: ["E10"], description: "Search grouped destinations and actions with keyboard access, async loading, retry and focus recovery.", tags: ["command", "search", "global", "keyboard", "shortcut", "async", "E10"], source: "Original kit composition · Radix Dialog", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog", usage: `${imports}
import { useState } from "react";
import { Button, CommandPalette, type CommandSearch } from "@evenkit/ui";

export function WorkspaceSearch({ search }: { search: CommandSearch }) {
  const [open, setOpen] = useState(false);
  return <>
    <Button onClick={() => setOpen(true)}>Search workspace</Button>
    <CommandPalette open={open} onOpenChange={setOpen} search={search} />
  </>;
}

// Keep search stable. Return items with an href or an onAction callback.
// Read context.signal when fetching. The palette also rejects stale responses.
// Native links support opening in a new tab. Actions run after dialog dismissal.
` },
  { id: "step-indicator", name: "Step indicator", group: "Controls", inventoryIds: ["E08"], description: "Named progress steps with current, complete, upcoming and error states, plus optional completed-step navigation.", tags: ["steps", "progress", "wizard", "setup", "E08"], source: "Original kit implementation · semantic ordered list", sourceUrl: "https://www.w3.org/WAI/tutorials/forms/multi-page/", usage: `${imports}
import { StepIndicator } from "@evenkit/ui";

export function SetupProgress({ onRevisit }: { onRevisit: (id: string) => void }) {
  return <StepIndicator aria-label="Workspace setup" currentStep="preferences"
    onStepChange={onRevisit} steps={[
      { id: "details", label: "Workspace details", status: "complete" },
      { id: "preferences", label: "Preferences" },
      { id: "review", label: "Review" },
    ]} />;
}

// Omit onStepChange for noninteractive progress. Validation stays with the host.
` },
  { id: "onboarding-wizard", name: "Onboarding wizard", group: "Compositions", inventoryIds: ["O06"], description: "A copyable setup flow with validation, back navigation, review, submission recovery and versioned draft storage.", tags: ["onboarding", "wizard", "setup", "draft", "recovery", "validation", "O06"], source: "Editable kit source block · host-owned storage and submission", sourceUrl: "https://www.w3.org/WAI/tutorials/forms/multi-page/", usage: `${imports}
import { TextField } from "@evenkit/ui";
import { OnboardingWizard, type WizardDraftStorage } from "./onboarding-wizard";

interface Answers { name: string }
// Copy registry/blocks/onboarding-wizard.tsx beside this module.
export function SetupPage({ storage, onSubmit }: {
  storage: WizardDraftStorage<Answers>;
  onSubmit: (answers: Answers, context: { signal: AbortSignal }) => Promise<void>;
}) {
  return <OnboardingWizard initialData={{ name: "" }} storage={storage}
    draftVersion={1} onSubmit={onSubmit} steps={[{
      id: "name", title: "Workspace details",
      validate: data => data.name.trim() ? [] : [{ fieldId: "setup-name", message: "Enter a name." }],
      render: ({ data, update, errors, disabled }) => <TextField id="setup-name"
        label="Workspace name" required value={data.name} disabled={disabled}
        error={errors[0]?.message} onChange={event => update({ name: event.target.value })} />,
    }]} renderReview={data => <p>Workspace: {data.name}</p>} />;
}

// Scope storage per account/workspace and validate loaded data in storage.load.
// Keep the storage object stable and remount the block when its account changes.
` },
];
