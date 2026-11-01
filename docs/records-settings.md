# Record details and account settings

The package exports `ActivityTimeline`, `WorkspaceSwitcher`, `SettingsLayout` and `AppearancePreferences`. Copy `registry/blocks/record-detail.tsx` and `record-workflow.tsx` for record pages. Copy `registry/blocks/account-settings.tsx` for profile editing and local appearance storage. Import the token and UI styles once at your application boundary.

## Record detail and activity

`RecordDetail` takes a record, metadata rows, activity groups, an explicit `timeZone`, and host callbacks for save and back navigation. Its editor reuses `RecordWorkflow` so validation, dirty dismissal, cancel, retry and reset behave like the list's editor. Save results are announced in the detail page. Closing the editor restores focus to Edit project. The host updates `record` after a successful save and owns the record's URL, history and contextual `actions`.

`RecordWorkflow.onOpenRecord` makes each record name an action for opening detail. Keep the list mounted while showing detail if you want its filters and page to survive back navigation. The catalog does this and restores focus to the activated record. `editorOnly` and `initialEditId` mount its existing editor without the list; `onEditorClose` lets the detail host remove that editor after save, cancel or confirmed discard.

`ActivityTimeline` renders ordered groups without sorting or regrouping them. Each event has a stable ID, actor, action and offset-bearing timestamp. Dates are formatted through the shared timestamp formatter using the required display timezone. The host decides group labels and ordering. Optional event states distinguish pending and failed actions; an event retry callback is separate from the timeline's loading-error retry. Empty, loading and failed loading states retain their text equivalents. Avatar initials are decorative because the adjacent actor is already named.

## Workspace switching

`WorkspaceSwitcher` takes a controlled workspace ID and available workspaces. `unavailable` gives a reason and disables that workspace. Search matches names and descriptions; arrow keys, Home and End move through available choices. Escape dismisses the popup and returns focus to the trigger.

Use `onSwitch(id, { signal })` to prepare or validate the destination. Commit the new route/account/cache context in `onValueChange`, which runs only after that request succeeds. Failed preparation keeps the current workspace selected and shows retry. Cancellation, dismissal, external value changes, disabling and unmount abort preparation and invalidate its completion. Applications must also honor the signal before committing server or application state; cancelling a promise cannot undo a server-side operation already committed.

## Settings and profile

`SettingsLayout` renders a responsive navigation column and content region. Its `activeId` and `onNavigate` are controlled. Preserve mounted forms or handle unsaved drafts before switching sections; the catalog keeps sections mounted with `hidden` so drafts survive navigation.

`ProfileSettings` starts a draft from `profile`, requires name and a valid email address, and calls `onSave(draft, { signal })`. A rejected request keeps the draft. Reset returns to the latest saved values. Cancellation invalidates late completion and returns focus to the name field. A successful response must have the same profile ID; `onSaved` is the host's optional commit notification. Changing the profile ID remounts the editor and cancels the previous account's pending request. To intentionally reload a changed revision of the same profile, remount the block with a revision key after resolving any unsaved edits.

Email-change verification, authorization and account services belong to the application. This block only supplies editable fields and their save interaction.

## Appearance

`AppearancePreferences` is controlled and does not mutate the document. The value contains a supported theme name and `system`, `light` or `dark` mode. Optional `density` is `default` or `compact`, defaulting to `default`. Optional `locale` is selected from the host's `locales` array of `{ value, label }` options; omit that array to hide the locale control. Supply valid Intl locale identifiers and labels for the languages your application supports. Existing theme/mode-only values remain valid.

Apply `data-kit-theme` and `data-kit-mode` on `document.documentElement`; omit `data-kit-mode` for system mode so the token stylesheet follows the device preference. These stylesheet selectors target the document root. Nested specimens need explicit CSS variables: spread `cssVariables(theme, resolvedMode)` from `@evenkit/tokens` into their style and set `colorScheme` to the resolved light/dark mode, as the catalog appearance sample does. Resolve system mode with `matchMedia` and subscribe to changes. Nested data attributes alone do not apply a theme.

Density is a preference for host layout spacing; the control does not shrink touch targets or apply global styles. The catalog applies density to its sample padding and row spacing, and locale to Intl number/date formatting. Application translation, document language, direction and formatting elsewhere remain host responsibilities.

The copyable `AppearanceSettings` block validates stored values, reads storage after mounting, and catches unavailable browser storage. Stored locale values must match the supplied `locales`; unsupported values fall back to the supported initial locale or the first option. Invalid or missing density falls back to the initial density or `default`, so older theme/mode records still restore. Changing the supported locale values revalidates the current selection while preserving this visit's theme, mode and density. Changes remain usable for the current visit if storage fails. Give it a storage key scoped to the account/workspace. Changing that key remounts the storage reader. The block calls `onValueChange` on initialization, when the user chooses a value, and when a locale change requires a new selection; applying that value and syncing preferences across devices remain host responsibilities.
