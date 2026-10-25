# Data, files, and editable page blocks

25 October 2026. Owner: Project kit. Maturity: pilot. Catalog consumers use fictional local data. Covers I01–I03, J01–J02, O02, O04 and O11.

## Component contracts

`SemanticTable` and its caption/header/body/footer/row/head/cell parts preserve native table props and refs. Density is a row-height minimum; text wraps instead of hiding content. Numeric cells opt into logical end alignment. `TableScrollRegion` confines deliberate horizontal overflow and accepts a region label and keyboard focus. The host supplies table data, sorting, pagination and empty/loading/error presentation.

`FilterBar` is a real form with host-supplied fields, draft/applied state, apply and reset callbacks, busy state, and a persistent status message. Apply uses form submission; while busy it remains focusable with `aria-disabled` and suppresses resubmission. Reset calls the host and preserves focus. `AppliedFilters` accepts stable IDs, labels and remove/clear callbacks. After the controlled filter list commits a removal, focus returns to the next removal action or the persistent empty status. Deferred host updates are supported; recovery is cancelled when the user moves focus elsewhere. Filter state and result fetching belong to the host.

`FileInput` is a labeled native file input enhanced with a keyboard-operable drop surface. It validates each incoming batch against accept tokens, maximum bytes and maximum count, and returns accepted files plus structured rejections. Without `files`, the native input retains the latest accepted batch. Pass a controlled `files` array when keeping a list: it becomes the native FormData selection and picker-cancellation state, so removing a host row also removes its submitted file. The catalog shows this accumulated-list pattern. With multiple selection, `files.length` supplies the existing count unless `existingCount` explicitly includes additional host records. Single-file selection replaces the previous file. The input clears when opening the picker to allow reselection; cancellation restores retained files. Form reset clears errors; a controlled host resets its files array, while uncontrolled selection clears itself. Native required, disabled, multiple, name and form props remain available. The component does not upload or inspect file contents; client checks do not replace server validation. Errors remain associated with the control and are announced. Dragging cannot activate disabled input.

`FileRow` is a list item with filename, type/size metadata, a host-supplied state and progress, and optional open/download/remove/retry/cancel actions. Long filenames wrap. Each action has a name identifying its file. Hosts own URLs, async operations, cancellation, persistence and focus when a removed row leaves the page.

## Editable source blocks

Copy `registry/blocks/record-workflow.tsx` into a consuming application and adjust the record fields and actions. `RecordWorkflow` receives records and an async `onSave(draft, { signal })` callback. The host returns the saved record and updates the supplied records. Its list filters distinguish editable criteria from the applied query; create/edit opens a stable form with native validation, cancel/reset, dirty dismissal confirmation, pending save, persistent failure and retry. Each save uses an AbortController. Cancel, discard, new editing session and unmount abort pending work; stale results cannot close a newer form. The host must pass the signal through its request and owns persistence, record IDs and any policy for already-committed writes. The catalog supplies a cancellable local save adapter with an explicit simulated failure switch.

Copy `registry/blocks/recovery-page.tsx` for 404, unavailable/500, access-denied, offline and maintenance pages. The host supplies primary and optional secondary recovery actions and can override the title/description. The block presents the state; it does not infer authentication, network status or server availability.

## Visual and behavior rules

All values use existing `--pk-` tokens and the inherited table/input contract. Controls reuse Button, TextField, TextareaField, Select and Dialog. Tables keep numeric alignment and contained overflow; layouts wrap at narrow widths. Semantic colors support the eight themes and both modes. Logical properties support RTL. Focus rings remain visible; narrow/coarse-pointer actions retain the 44px touch target. New animation is unnecessary.

Source references are the internal `table.v1`/`input.v1` contracts, the initial LSJ/Alithos/securicheck findings, and Leitspur's file-selection requirements recorded in [the inventory](./component-inventory.md). Implementations here are original kit code. No donor application code or new dependency is included.

## Verification

The focused browser suite is `tests/browser/workflows.spec.ts`. It protects draft/applied filter behavior, committed/deferred removal focus, file rejection/reselection and FormData after removal/cancellation, create/edit validation, dirty dismissal, failed save/retry, and cancellation of a stale save. Root integration owns builds, configured type/lint checks, cross-theme/responsive inspection and packed consumers. Completion evidence is recorded in [the priority tracker](./priority-build-plan.md).
