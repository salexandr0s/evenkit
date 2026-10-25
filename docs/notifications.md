# Notifications and persistent feedback

This family covers O08, M06, H10, G03 and G06. The components and copyable blocks are pilots owned by the Evenkit maintainer. Meridian Studio in the catalog is the named example consumer; production adoption has not been established.

Import `@evenkit/tokens/css` before `@evenkit/ui/css`. The package exports `NotificationList`, `PersistentBanner`, `ConnectionStatus`, `PresenceIndicator` and `UnreadIndicator`, with their public TypeScript contracts. Copy `registry/blocks/notification-center.tsx` and/or `registry/blocks/notification-preferences.tsx` into the application and import them locally. Their styles are included in the package CSS. The five catalog pages include complete examples that are compiled by `npm run verify:examples`.

## Application boundary

Applications supply events, grouping, ordering, localized timestamps, permissions, pagination results, preference policies, connection state, session deadlines and persistence. The family does not poll, deliver notifications, request browser permissions, start a session timer or create a backend. Parse network responses and authorize operations in the application. IDs must be unique and stable within each list/schema; notification IDs must be unique across groups on a page.

Async request callbacks receive an `AbortSignal` and the original `contextKey`. Preference callbacks also receive `revision`. Callbacks prepare or persist work and return a result; the component calls the corresponding guarded commit callback only while the originating scope is current. Commit local UI state in `onCommit`, `onPageLoaded`, `onSaved`, banner `onSuccess` or `onDismissed`. Change context keys for account, workspace and filter boundaries. Increment revision when a replacement snapshot or changed notice supersedes pending work.

Cancellation rejects stale UI success and error results even if the callback ignores the signal. It cannot reverse a server write. The application must enforce tenant identity, authorization, idempotency and revision checks at its persistence boundary. Callback identity changes alone do not cancel work, so inline callbacks are supported. Unmounting cancels outstanding work. Keep components mounted across context changes when preserving focus; replacing them with a keyed subtree delegates focus recovery to the application.

## Notification center

`NotificationCenter` accepts a controlled `NotificationPage` (`groups`, one-based `page`, `pageCount`), `contextKey`, optional `revision`, title, disabled/loading/error state, `onOperation`, `onCommit`, `onLoadPage` and `onPageLoaded`. A group has an ID, visible label and items. Each item has an ID, title, read boolean, optional description, timestamp plus display label, read-only reason and actions. Action IDs, labels and unavailable reasons come from the application.

Selection is internal and limited to eligible items on the visible page. Changing page or context clears it. Removing an item or revoking permission removes its selection, including when permission later returns. “Mark all on this page as read” snapshots only unread, eligible IDs on that page. It never implies all pages, all matching results or the complete inbox. `readOnlyReason` prevents selection and read changes; each independent action uses its own `unavailable` reason. The center's `disabled` prop prevents all operations.

Read operations are `{ type: "read", ids, read }`; item actions are `{ type: "action", notificationId, actionId }`. Merely focusing or reading a row does not mark it read. One request runs at a time. Retry uses the failed operation, rechecks permission, and retains the current page until a new page loads. A loader must return the requested page and a valid page count. Requests become obsolete on context, revision, page, data identity or permission changes. Host loading/error feedback does not cancel its own request.

The list uses native lists and buttons. Tab visits controls in document order, Space toggles selection, and Enter/Space activates buttons. Read state is visible text with an icon. Busy controls remain focusable; handlers reject duplicate activation. If the focused control disappears or becomes disabled, focus returns to the center heading. Applications own navigation focus after an `onCommit` action opens another page.

## Notification preferences

`NotificationPreferences` accepts `contextKey`, required `revision`, channels, categories, a nested boolean `value`, optional `readOnlyReason`, label and description, async `onSave`, and guarded `onSaved`.

Each channel has an ID, label, optional description and unavailable reason. Categories have an ID, label, description, optional read-only reason, and policies keyed by channel ID. A `required` reason forces that choice on. `readOnlyReason` and `unavailable` preserve saved values while preventing changes. Reasons remain visible and associated with each control; the accessible name includes both category and channel. Focusable switches use `aria-disabled` with guarded updates.

Editing creates a local draft. Reset restores the saved snapshot. Cancellation and failed saves keep the draft; retry submits the current draft. Pending saves lock editing and retain the Save button's focus. Context, revision, schema or policy changes cancel work and reset to the supplied value. Same-revision value churn does not replace unsaved edits. A successful save must return all visible category/channel booleans and preserve locked choices; unknown schema keys are discarded. `onSaved` receives the normalized saved values and original request context.

## Persistent banners and status

`PersistentBanner` composes `ActionMessage` and `Button`. It occupies normal layout space, has a named region, and stays visible until the host removes it. Supply a heading, content, context key, optional revision/tone/actions/dismissal, and optional concise announcement. Critical notices can omit dismissal. Content remains readable throughout failures and retries.

Each action has an ID, label, async `onAction`, optional guarded `onSuccess`, unavailable reason and optional `focusRef`. Pass a visible focus target when success removes the banner or its focused action. Dismissal requires an async `onDismiss`, guarded `onDismissed` and a `focusRef` outside the banner. The component restores focus before dismissal only if focus is still inside the banner, preserving an external control the user has moved to. Retry stays mounted while pending and returns focus to the original action on success. A removed focused action falls back to the named banner region.

The persistent content and action buttons are outside the live region. A separate concise `aria-live` message announces progress and errors. `urgency` defaults to polite; use assertive only for a notice that needs an immediate interruption. A host announcement can summarize changing content without announcing the entire interactive banner repeatedly.

`ConnectionStatus` supports `offline`, `reconnecting`, `stale` and `session-expiring`. It supplies a heading and warning/info tone, and invalidates recovery when state changes. Content must describe the application's actual save behavior, last-update information or expiry time. Applications decide whether recovery resolves the notice, and when session state is authoritative. A recovery button does not imply data was saved offline or a session was extended.

## Presence and unread indicators

`PresenceIndicator` accepts `online`, `away`, `busy` or `offline` plus a required visible `label`. The label must include the state; include the person's name where context does not identify them. The dot is decorative. `UnreadIndicator` accepts a count and optional localized label. Finite fractional counts are rounded down, and invalid or negative counts display zero. Counts above 99 show `99+`; the default text alternative retains the normalized integer count. Counts and presence updates are not live regions by default, avoiding repeated announcements of routine events.

## Appearance and accessibility evidence

The family uses existing neutral surfaces, theme accents, `--pk-` spacing/type/shape tokens, the shared control sizes and mobile touch targets. It introduces no motion; progress spinners and controls retain their existing reduced-motion rules. Logical spacing and wrapping support RTL and long labels. Linen headings keep the shared heading font.

Focused Chromium coverage checks page selection and permissions, failed action/page recovery, pending focus, stale results after context/permission/revision changes, preference cancellation and schema removal, banner dismissal/retry, persistent status, and accessible names. The family matrix exercises all eight themes and both modes plus 360/768/1024/1440px RTL layouts. Exact executed commands and outcomes are recorded in `SESSION_HANDOFF.md`; browser DOM/accessibility-tree checks are not a manual screen-reader listening audit. Safari, Firefox, physical mobile keyboards and production services remain unverified.

## Provenance and distribution

The implementation is original Evenkit code based on `codex/component-improvements` commit `b588b1b1964ba2b26ee8453606f354f2c33eb10d`, inspected on 25 October 2026. It composes the repository's existing feedback, selection, settings and pagination controls. No third-party component source or application notification service was copied. There are no new dependencies. Existing Radix Checkbox/Switch behavior and Lucide icons retain the notices shipped with the UI package.

[W3C status-message guidance](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) informed the separate live status text; [W3C use-of-color guidance](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) informed visible text equivalents. These were reviewed on 25 October 2026. Package provenance is in `packages/ui/PROVENANCE.md`. Internal code remains unlicensed for public distribution under the repository's current policy. Nothing in this family publishes a package, deploys an application or changes that policy.
