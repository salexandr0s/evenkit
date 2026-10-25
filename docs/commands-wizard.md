# Commands and guided setup

`CommandPalette` covers E10. `StepIndicator` covers E08. The copyable `OnboardingWizard` block covers O06. Their catalog routes are `#command-palette`, `#step-indicator`, and `#onboarding-wizard`.

## Command palette

Control `open` and `onOpenChange` from your application. Supply local `items`, or a stable `search(query, { signal })` callback that returns filtered `CommandItem` records. Each record has a stable `id`, a label, optional description/group/keywords/shortcut/icon, and either an `href` or an `onAction` callback. Native links retain browser navigation and open-in-new-tab behavior. Disabled destinations have no href and are skipped by keyboard navigation. Actions run after the dialog closes and restores focus, allowing an action to open another dialog.

Local matching searches labels, descriptions, and keywords. Remote search defaults to a 150 ms debounce. Changing the query, provider, or open state aborts the preceding request. Request identity checks also reject a late response from a provider that ignores cancellation. Previous results are removed while a new query loads; loading, empty, failure, and retry have separate states. Keep `search` stable with `useCallback` so ordinary parent renders do not restart requests. Your host owns authorization, result ranking, request validation, and action outcomes.

The search field receives initial focus. Tab follows ordinary links and buttons; Up/Down moves through available results, Home/End moves to the first/last result, and Up from the first result returns to the search field. Enter in the search field invokes the first available result. Escape closes the dialog and restores its opener. Search results use section headings and lists with native controls, not option roles that would replace link/button semantics.

The optional Ctrl/Cmd+K shortcut ignores composition, repeated keys, modified combinations, editable controls outside the palette, and other open modal dialogs. Set `shortcut={false}` when the host owns global shortcut dispatch. Displayed per-item shortcuts are hints; the host registers those actions. Optional controlled `query`/`onQueryChange` lets the host persist or reset the search text.

## Step indicator

Pass stable step IDs and `currentStep`. Each item can supply `complete`, `error`, or `upcoming` status. The current item uses `aria-current="step"`; every state has text as well as color and icon cues. Error status can coexist with the current-step marker. Labels and descriptions wrap.

Without `onStepChange`, the indicator is noninteractive progress. With it, completed steps become buttons; upcoming and error steps remain text. The host controls whether a step is valid and whether it may be revisited. `disabled` prevents completed-step actions while work is pending. `orientation="vertical"` supports a side column; narrow layouts stack horizontal steps as well. State wording can be replaced through `labels`.

## Onboarding block

Copy `registry/blocks/onboarding-wizard.tsx` into your application and import package CSS. The generic block receives `initialData`, ordered `steps`, `renderReview`, and `onSubmit`. Each step provides a title, render callback, and synchronous validation returning `{ fieldId, message }` errors. Render actual fields with those IDs, forward `disabled`, and use immutable `update(nextData)` calls. Validation messages link to fields through `FormErrorSummary`.

Continue validates the current step. Back retains answers. Completed steps and review edit actions allow revisiting earlier steps. Final submission validates every step again and returns to the first invalid step. Step changes focus the new heading; validation failures focus the error summary. In-progress saves and submission focus a cancellation control. A failed submission preserves all answers for retry. Successful submission replaces the form, so draft cleanup failures cannot cause duplicate submission.

Use unique step IDs and reserve `__review` for the final review screen. Keep the step sequence stable during a flow. Remount the block with a new React `key` when switching accounts, workspace scope, or the setup definition.

## Draft storage

Optional `WizardDraftStorage<Data>` has asynchronous `load`, `save`, and `clear` methods, each receiving an `AbortSignal`. The stored envelope contains `version`, `data`, `stepId`, and an ISO `savedAt` timestamp. The host chooses storage, scopes keys by account/workspace, validates loaded data, and respects cancellation before committing writes. Keep the storage object stable. The block does not access browser storage itself.

On mount, the block looks for a draft and waits before allowing edits. A compatible draft prompts Resume draft or Start fresh. Resume revalidates earlier steps and returns to the first invalid one. A version mismatch produces an error instead of restoring incompatible answers. Save draft is explicit; editing does not silently persist data. Failed storage operations preserve the current answers, and saving can be retried. Submitted data is saved independently of draft cleanup; failed cleanup has its own retry button.

Cancellation aborts an operation and ignores its eventual result. A host that persists work after ignoring the signal may still have side effects; use server idempotency for submission and respect the signal in storage adapters. The local catalog adapter validates its stored envelope and demonstrates save, reopen, resume, unavailable storage, submission failure, cancellation, and cleanup retry.
