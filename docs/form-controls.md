# Form controls

Owner: Evenkit. Maturity: pilot. Example consumer: the catalog's editable fictional workspace forms. Inventory: C01, C02, C03, C04, C07, C15 and G04.

## Component contracts

These contracts extend the existing input contract and shared `FieldFrame`. All controls inherit the kit's 32/40/48px sizes, 44px touch targets, semantic color pairs, token spacing, visible focus and logical direction. Labels, descriptions and errors wrap. The current document theme also supplies portal colors.

| Family | Contract |
| --- | --- |
| Fieldset / FormSection (C01) | Fieldset renders a native fieldset and legend, with associated group hint/error and a required/optional cue. The legend has stronger type than the fields, with 24px desktop insets and 16px narrow/touch insets. Disabled fieldsets retain native descendant behavior. FormSection provides a configurable heading level, associated description and separation between adjacent sections without pretending to be a field. |
| FormErrorSummary (C02) | A focusable alert lists host-supplied errors linked to stable control IDs. A decorative error icon and a leading semantic rule identify the summary; links have room to wrap and retain 44px touch targets. Activating an error focuses that control through `getElementById`, avoiding selector escaping. The host decides when to focus the summary after failed submission. An empty list renders nothing. |
| SearchField (C03) | Reuses TextField and its stable input wrapper. Its labeled clear action returns focus to the input. Optional result text is an associated polite status with compact, tabular numeric text. Native input props/ref and form value remain available. The catalog pairs search with document rows and explicit no-results guidance. |
| PasswordField (C04) | One stable password input toggles its type through a labeled pressed-state button. The square Eye/EyeOff control has an inset separator and a tooltip with the translated Show/Hide label. Native autocomplete, name, validation, disabled and read-only behavior pass through. Pointer activation preserves input focus and selection. Visibility is presentation state and never changes the password value. |
| Combobox / Autocomplete (C07) | Combobox selects a predefined option ID while its input displays/filter labels. Autocomplete accepts free text with optional suggestions. Base UI supplies filtering, active-descendant keyboard navigation, IME behavior, disabled-option discovery and popup placement. Arrow navigation may highlight a disabled option to expose its description; activating it cannot select it or close the popup. Options have unique nonempty IDs, plain labels, optional descriptions and disabled state. Custom option content does not alter submitted IDs. Clear, no-results, pending, invalid, disabled and read-only states are explicit. |
| FormActions (C15) | A wrapping action region composes the host's submit/cancel/reset buttons and optional dirty text. The persistent status node has a minimum line height and can grow for longer messages. It does not install navigation listeners or infer dirty state. The catalog recipe keeps save/retry feedback beside the actions and demonstrates save/discard/keep-editing recovery. |
| SaveStatus (G04) | One persistent ActionMessage presents compact idle/dirty/saving rows and framed saved/error feedback. A muted check marks idle, a pencil marks edits and a decorative Spinner shows saving activity. Explicit `icon` content takes precedence, including null/false suppression. The host supplies retry actions and completion state. Its role remains overridable; failures default to alert and other states to status. It owns no request, storage or timer. |

## State and form ownership

SearchField, Combobox and Autocomplete accept `value`/`onValueChange` for controlled use and `defaultValue` for uncontrolled use. Uncontrolled instances restore their default value when their owning native form resets. Controlled hosts own their reset value in `onReset`; the control does not silently overwrite it. A cancelled reset leaves values intact. Reset also closes choice popups and restores the uncontrolled display query.

Base UI owns the combobox's display/filter query. External selected IDs and refreshed selected labels update the closed field, while a passive option refresh preserves an in-progress filter. `onInputValueChange` observes this text without taking ownership of it.

SearchField also supports native `onChange` as the controlled value handler. Its clear action dispatches an input event through the same change path as typing, so native handlers and `onValueChange` observers receive the cleared value without a fabricated event object.

Combobox's `name` submits its selected option ID, including an empty value when cleared. Typing a label does not submit arbitrary text as an ID. Autocomplete's `name` submits its text, including text absent from suggestions. Disabled controls are omitted from FormData; read-only controls remain selectable and submit their value. Required validation follows the native form boundary. Options and callbacks come from the host; fetching and server validation remain application code.

Field hints/errors preserve caller `aria-describedby` IDs. Option descriptions are associated with their options. Field errors retain the existing decorative error icon. FormErrorSummary is a separate navigation aid; field-level associations remain necessary.

Choice fields label the input from a dedicated label-content span. This keeps the accessible name stable when Base UI hides surrounding content while a popup is open; the separate required/optional cue remains decorative.

Choice popups use a 6px inset, layered token shadows and a reserved trailing checkmark gutter. Selected options have an accent surface; highlighted options retain an inset focus ring, including unavailable options reached with the keyboard. The popup enters with a 160ms fade and 4px movement from its anchor side, while the trigger chevron follows its open state. Reduced motion removes both effects. Dismissal retains the primitive's immediate close behavior.

When a choice field is inside the kit's Radix Dialog, pass the dialog content element as `container`. This keeps the Base UI popup inside Radix's focus, pointer and dismissal boundary. The combobox catalog demonstrates this composition with a content ref. The default portal remains the document body for ordinary page fields.

FormActions and SaveStatus accept native root attributes/refs and host content. Hosts choose submission timing, cancellation, retry, dirty comparisons, route interception and focus recovery. A page should focus a stable summary or first invalid field after validation failure and retain a reachable cancel/retry action during a pending operation.

SaveStatus keeps its root mounted as state changes, and heading, actions, children and icon overrides remain available in every state. Routine messages use a token minimum height and grow with longer content. The saving spinner is decorative, so the message supplies the announcement; it follows the existing reduced-motion treatment. Success and failure keep ActionMessage's semantic icon surface and leading border.

## Dependency and source

`@base-ui/react` 1.9.0 is a bounded unstyled behavior dependency for the combobox/autocomplete family. Existing Radix components remain the basis of other overlays; Base UI supplies a dedicated combobox that those installed Radix primitives do not provide. The kit supplies original wrappers and `pk-` CSS and imports no Base UI theme runtime.

`@radix-ui/react-dismissable-layer` 1.2.1 registers choice popups in the existing Radix overlay stack. Escape closes the active choice popup through Base UI's close action before an enclosing Dialog can handle it. Base UI retains option navigation, filtering and pointer dismissal. Both dependencies retain their MIT notices.

The [Base UI Combobox](https://base-ui.com/react/components/combobox) and [Autocomplete](https://base-ui.com/react/components/autocomplete) documentation and installed 1.9.0 declarations informed this implementation. Base UI is MIT licensed and retains its package notice. No third-party example source, branding or sample assets are copied.

## Catalog and verification

Entries: `fieldset`, `form-summary`, `search-field`, `password-field`, `combobox`, `form-actions` and `save-status`. Every entry has a complete public-package usage snippet. The combobox page also demonstrates free-text autocomplete, native form reset, selected IDs, long descriptions, disabled items and RTL layout. Form action/status pages demonstrate an intentional save failure and retry using local fictional data.

Primary examples show contact details, document search, account access and project ownership. Additional controlled, read-only, disabled and direction examples remain visible in separate sections. The save recipe places one lifecycle status next to its action footer, without a second dirty announcement. Restoring the saved name returns the status to idle. FormActions' standalone dirty message remains available to compositions that do not use SaveStatus.

Focused browser coverage is in `tests/browser/form-controls.spec.ts`. Integration, packed-consumer, theme and responsive evidence is recorded by the root build plan after the complete package/catalog is assembled. This module's existence alone does not establish those checks passed.
