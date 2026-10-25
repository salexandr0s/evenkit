# Admin starter notification integration

The starter composes the maintained notification center, notification preferences, persistent banner and unread indicator at `/notifications`. Data is fictional and stored in memory separately for Northstar Studio and Harbor Workshop. Completed changes survive admin route navigation and workspace changes. Reloading or leaving the admin route group discards the data. Email preferences do not send messages.

## Files and ownership

- `apps/admin-starter/components/views/notifications-view.tsx` exports `NotificationsView` for the shell's lazy route loader.
- `apps/admin-starter/components/notification-demo-provider.tsx` retains workspace state and guards mutations by workspace and revision.
- `apps/admin-starter/lib/demo-notifications.ts` defines the fixture data, preference policies, page boundaries and app-owned action destinations.
- `apps/admin-starter/blocks/notification-center.tsx` is copied from the registry block with an explicit cancel button for the demo's prepared requests. Cancellation aborts the request, keeps the saved data and focuses the inbox heading.
- `apps/admin-starter/blocks/notification-preferences.tsx` matches the registry source.
- `apps/admin-starter/app/(admin)/layout.tsx` nests the notification provider inside `StarterProviders`. Auth pages do not retain this state.

The integration adds no dependencies, styles, generic package imports of Next, or Supabase calls. Next navigation stays in the app view. Fixture navigation resolves only application-owned destinations for permitted notification actions.

## Behavior and customization

Each workspace has six notifications across two pages. Selecting all and marking all affect eligible items on the current page. The retained account notice cannot change read state. The expired export has a visible unavailable reason. Focusing or opening a notification does not mark it read.

The shared demo controls apply to page loads, read changes, row navigation, preference saves and banner dismissal. Failures keep the current state and expose retry. The inbox and preferences offer explicit cancellation; route, tab, workspace and auth transitions also invalidate pending block requests. Mutations occur only in the blocks' guarded completion callbacks. The provider adds workspace/revision checks before updating saved state. Cancellation in this fixture prevents writes; a real service must enforce authorization and cannot assume abort reverses a completed server write.

Preferences include Inbox and Email channels for record, document, team and account security updates. The application's fixture policy requires both account security channels. Successful saves update the provider without replacing the preference revision, preserving the block's saved confirmation. A replacement server snapshot should increment `preferenceRevision` to invalidate obsolete drafts and requests.

Replace the fixture helpers with application-owned data and validated services when adopting the starter. Pass the original workspace identity and AbortSignal through requests; keep UI mutations in `onCommit`, `onPageLoaded`, `onSaved` and `onDismissed`. Keep permission checks on the service as well as in the presentation policy. Preserve route allowlisting when using notification data to navigate.

## Verification

- `npm run typecheck --workspace @evenkit/admin-starter` passed (`tsc --noEmit`) after the shared package declaration rebuild.
- Focused `npx eslint` passed for all six runtime files, including a repeat after the shared package rebuild.
- Node fixture assertions passed for independent workspace objects, two-page slicing, invalid page rejection, retained/denied actions, cross-workspace ID rejection and action destinations.
- `git diff --check` passed for the owned runtime files.
- Assembled browser journeys await the integration build. The root integration handoff records the final build, keyboard/focus, mobile, theme and packed-consumer results. These checks are not claimed by this handoff until executed.

## Browser journey selectors

Open `/notifications`. The tablist is `Notification views`; its tabs are `Inbox` and `Preferences`. The inbox heading is `Notification inbox`.

1. Use `Mark Community field guide needs a review as read`, then confirm the button changes to `Mark Community field guide needs a review as unread`. Navigate away and return to check persistence.
2. Use `Select this page` and the selected read/unread actions. `Mark all on this page as read` leaves the unread `Studio archive was updated` on page 2 untouched. Pagination is labelled `Notification pages`.
3. Arm `Fail next request` in the shared demo controls and mark a row or change page. `Retry notification request` retries the failed operation.
4. Enable slow requests, start an inbox request and activate `Cancel notification request`. Confirm `Notification request cancelled. No changes were saved.` and focus on `Notification inbox`.
5. Open `Preferences`, change `Record updates: Email`, then use `Save preferences`. Confirm `Notification preferences saved.`. Failure exposes `Retry save`; a slow save exposes `Cancel save`, which retains the draft. Reset restores the saved value.
6. Switch workspaces while a slow read or save is pending, then return. Completed changes remain in their own workspace; the cancelled request does not commit.
7. Use `Open record: Community field guide needs a review` and confirm `/records/northstar-1`. Document, team and settings actions use their matching starter routes.
8. Dismiss `Review your delivery preferences` using `Dismiss preference reminder`. Focus moves to the workspace summary. The dismissal persists for that workspace; the other workspace retains its reminder.

No notification provider, email delivery, production data or membership service was exercised. This integration uses the local fixture only.
