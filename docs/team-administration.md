# Team administration

M07, L04, M08 and O09 provide reusable administration screens and editable page blocks. Import components from `@evenkit/ui`, after `@evenkit/tokens/css` and `@evenkit/ui/css`. Copy the blocks from `registry/blocks` into an application to change page structure, navigation or wording.

| Inventory | Component | Editable block | Catalog route |
| --- | --- | --- | --- |
| M07 | `TeamMembers` | `team-administration.tsx` | `/#team-members` |
| L04 | `InvitationAcceptance` | `invitation-page.tsx` | `/#invitation-acceptance` |
| M08 | `RoleCapabilityEditor` | `role-settings.tsx` | `/#role-capability-editor` |
| O09 | `AuditViewer` | `audit-page.tsx` | `/#audit-viewer` |

## Application boundary

The application owns authentication, authorization, membership rules, invitation delivery, persistence, transport, mutations and audit storage. Disabled controls and hidden actions describe the current UI state; they do not authorize a request. Recheck authorization and record versions at the server mutation boundary. Validate external payloads in the host loader or action adapter before passing typed records into these components.

Role IDs, labels, capabilities and grants come from the application. There is no shared role hierarchy, implicit grant inheritance, product-role list or permission evaluator. The role editor edits a supplied list of capability IDs. Authentication pages on `codex/auth-pages` remain separate; the integration agent can connect sign-in and account-switch callbacks later.

Supply a stable `contextKey` that changes whenever the team, authenticated principal, session or policy revision changes. Include invitation/role revisions in their supplied records. Revisions must change when the meaning or action availability of those records changes. Keep host callbacks current and loaders memoized; an inline loader can repeatedly invalidate a remote request.

## Action results and cancellation

All mutation and export callbacks receive `{ signal, contextKey }`. They return a `TeamActionResult`:

```ts
{ status: "success", message?: string }
{ status: "denied", message: string }
{ status: "error", message: string }
{ status: "stale", message: string }
```

Return `denied` for an application policy refusal, `stale` when the caller must refresh its context or record version, and `error` for a recoverable failure. Rejected promises also become visible error results. Success means the host completed its operation; the host supplies the updated records. A controlled record revision invalidates the previous panel and its feedback, so hosts that update records immediately can announce the completed save beside the editor, as the role example does. Avoid returning success before a mutation has actually succeeded.

The internal action hook prevents duplicate in-flight submissions and ignores results after cancellation, unmounting or a context change, even when a callback ignores its abort signal. It does not cancel a server transaction. Hosts should honor the signal before committing local state, use server-side idempotency where needed and reconcile after an uncertain result. Cancelled delivery, acceptance or export may have already completed outside the UI.

Callbacks can close over application adapters without exposing provider SDKs to the kit:

```tsx
const acceptInvitation: InvitationAcceptanceProps["onAccept"] = async (id, context) => {
  const result = await application.acceptInvitation(id, {
    signal: context.signal,
    expectedContext: context.contextKey,
    expectedRevision: context.revision,
  });
  if (context.signal.aborted) return { status: "stale", message: "Refresh the invitation status." };
  return result;
};
```

`application` in this sketch is the consuming application's validated transport adapter, not an Evenkit service. The catalog usage examples contain complete compile-checked component and block signatures.

## Members and pending invitations

`TeamMembers` receives the team name, application role definitions, optional member-status definitions, a memoized `loadMembers` callback and a controlled invitation collection. The member loader receives `(query, filters, context)`: the standard remote table query includes search, sorting and pagination, while filters contain `roleId` and `status` (empty strings mean all). It returns `{ data, total }` for the authorized query. Apply filtering and sorting before paging.

Supply the complete authorized invitation collection: invitation search, status filtering and pagination operate locally over that collection. An invitation includes `id`, `revision`, `email`, `roleId`, `expiresAt` and `status` (`pending`, `expired`, `revoked` or `accepted`). Large invitation datasets should use an application-owned paging composition rather than passing a single page as the full collection.

`onInvite(draft, context)` receives a trimmed email and selected role ID after basic email/role validation. `onResend(invitation, context)` and `onRevoke(invitation, context)` receive the captured record, including its revision, after confirmation. The host checks duplicates, limits, final role eligibility and delivery policy. Omitting a callback hides its action; `inviteUnavailable` and `invitationActionUnavailable` explain disabled actions. Update the controlled invitations after success. `onRefresh` reconciles invitations after cancellation or stale results; the component also retries the member loader.

## Invitation acceptance

`InvitationAcceptance` receives an invitation with `id`, `revision`, `teamName`, `email` and a host verdict: `ready`, `signed-out`, `account-mismatch`, `expired`, `revoked` or `already-accepted`. Optional role and expiry information are display data. `currentAccountLabel` describes the active identity; the component never compares email addresses to determine ownership. The host determines expiration and revocation from authoritative state.

Only a ready invitation can call `onAccept`. Recovery callbacks cover sign-in, switching accounts, requesting a replacement, continuing into the application and reloading the latest invitation. Supply only supported actions. `deniedReason` disables acceptance with an explanation. `timeZone` is explicit; `locale` controls timestamp formatting. Use ISO timestamps with an offset or `Z`.

## Role and capability editing

`RoleCapabilityEditor` receives a role's `id`, `revision`, label and `capabilityIds`, plus the application's capability definitions. Definitions can include a description, group and `disabledReason`. Unknown grants remain visible and are retained on save. A disabled capability retains its existing value; the editor cannot grant or remove it.

The editor confirms the proposed grant list before invoking `onSave({ roleId, revision, capabilityIds }, context)`. Failure keeps the draft for retry. Read-only and denied reasons block saves. Record, definition or policy changes invalidate an old confirmation; the host can supply `onReload` to fetch the current role before editing again. The application validates the final grant list and persists it. Acceptance and role saves block immediate retries after cancellation until the host supplies a fresh record revision or context, because the prior operation may have committed.

## Audit viewing and export

`AuditViewer` accepts a controlled `AuditQuery`, `onQueryChange`, a memoized `load` callback and an explicit `timeZone`. Queries contain `search`, `actorId`, `kind`, `outcome`, `pageIndex` and `pageSize`. A loader returns `{ data, total }`, where total counts every match before pagination. Apply search and filters to the whole authorized dataset on the host. Optional actor, kind and outcome definitions supply filter labels.

Each `AuditRecord` has a stable ID, actor name/ID, action, timestamp, kind and outcome, with optional label/value details. It is rendered through `ActivityTimeline`. Recorded outcomes are display data; the viewer never retries the recorded operation or edits events. Load retry fetches records again. A read denial suppresses records.

`onExport(criteria, context)` receives the active search and filters without pagination. The host decides format, permissions, redaction, download delivery and retention. Export therefore covers the matching dataset, not only the current page. Changing filters or context invalidates a pending export result. `exportDisabledReason` explains why export is unavailable, and `onRefreshContext` supports stale-context recovery.

## Presentation and accessibility

Controls reuse the kit's fields, dialogs, checkboxes and feedback. Members use the remote DataTable; audit events use ActivityTimeline. Editable settings pages use SettingsLayout. Styles use semantic `--pk-*` tokens, logical spacing and wrapping for long names and labels. Theme attributes belong on the document root so portals inherit them. Light, dark and system preference use the existing kit behavior.

Dialogs restore focus to a live trigger or a stable section fallback when a row disappears. Pending operations expose a cancellation action, and errors remain visible with recovery controls. Draft invalidation must not leave focus on a removed element. Audit details use native disclosure controls. Horizontal table scrolling stays inside the table region at narrow widths.

## Dependencies and source records

This work adds no dependencies and no third-party source copies. It reuses the pinned React, Radix and TanStack packages already recorded in [UI provenance](../packages/ui/PROVENANCE.md) and their existing [license notices](../packages/ui/licenses). The new modules, CSS, blocks and catalog examples are original kit code. Fictional examples run locally and make no production requests.

## Verification

Verified locally on 25 October 2026:

- `npm run build`, configured workspace `npm run typecheck` and `npm run lint` passed. Focused lint passed after the final test/verifier edits.
- `npm test`: 23 tests passed, including the existing theme token contrast checks.
- `npm run verify:examples`: 90 copied usage examples compiled and all 76 implemented inventory mappings passed. The verifier disables its unused HMR server to avoid collisions with concurrent worktrees.
- `npm run verify:packages`: independent packed Vite and Next.js production builds and HTTP/stylesheet checks passed. All owned temporary servers and directories were cleaned up. Final package inspection confirmed the new JavaScript, declarations and table styles are included.
- Eight `team-admin-host.spec.ts` tests passed with controllable, deliberately non-cooperative host promises. They cover duplicate acceptance, captured revisions, account verdicts, late cancellation/context responses, unknown and locked grants, stale recovery, exact audit export criteria, access changes, total shrinkage and removed invitation focus.
- Five `team-admin.spec.ts` catalog journeys passed. They cover validation, retry without draft loss, resend, account recovery, role persistence, JSON export of all matches, load retry, RTL/system modes and keyboard navigation.
- Four existing `priority-catalog.spec.ts` routes passed across all eight themes, light/dark modes and 360/768/1024/1440px widths. The members journey, theme matrix and RTL journey passed again after the narrow-table CSS adjustment.
- Eight component captures were reviewed at desktop Ocean dark and 360px Grove light/RTL. No page overflow or browser errors occurred. A narrow RTL keyboard check confirmed that focusing an offscreen row action scrolls its table into view, opens its dialog with Enter and restores focus with Escape.

Evidence is local under `.artifacts/team-admin/`, `.artifacts/catalog-examples.json` and `.artifacts/package-verification.json`. The capture helper hides the sticky catalog header only while taking component screenshots. The runtime component CSS is unchanged by capture.

Automated browser coverage is Chromium. Firefox, Safari, physical touch and screen-reader speech output were not exercised. Production authentication/provider integration is intentionally outside this branch. No production services, migrations, publishing or deployment were performed.

Run the focused checks from the isolated checkout:

```sh
npm run build
npm run typecheck
npm run lint
npm test
npm run verify:examples
npm run verify:packages
KIT_CATALOG_PORT=5398 npx playwright test tests/browser/team-admin.spec.ts tests/browser/team-admin-host.spec.ts
KIT_CATALOG_PORT=5398 npx playwright test tests/browser/priority-catalog.spec.ts --grep 'Members and invitations|Invitation acceptance|Role and capability editor|Audit viewer'
```

The editable blocks use the package's public API and require no provider configuration. For a local catalog preview, run `npm run preview --workspace @evenkit/catalog -- --port 5399 --strictPort` and open `http://127.0.0.1:5399/#team-members`.
