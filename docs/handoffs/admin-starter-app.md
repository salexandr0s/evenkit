# Admin starter application handoff

Branch: `codex/admin-starter`. Worktree: `/Users/nationalbank/.codex/worktrees/admin-starter/design-tokens`.

## Core application

Added the Next app in `apps/admin-starter`, with a guarded admin route group, real section URLs and record detail URLs. The client provider retains fictional workspace data across Next navigation and unmounts on authentication transitions. Workspace changes and unmounts abort pending requests. The record and profile save handlers check their workspace before committing results.

The shell, workspace switcher, records, details, activity, profile and appearance controls use the existing kit components and copied blocks. Dashboard, records and settings views load through separate dynamic imports. Demo controls exercise delayed requests and a single injected failure; view loading and form saves expose cancellation and retry. Record and profile drafts survive failed saves. Settings restore supported appearance preferences per workspace, keep English document language and apply the selected formatting locale to timestamps.

The app imports `requireStarterSession` and `StarterSessionMonitor` from the auth owner's files. Supabase and Next stay outside generic UI. Root owns `proxy.ts`, shared package exports/CSS, root dependencies and verification scripts.

## Core verification

- `npm run typecheck --workspace @evenkit/admin-starter` passed after the auth exports were rebuilt.
- Focused ESLint passed for the app routes, components, copied blocks, demo helpers and Next config.
- Development `/dashboard` HTTP request returned 200 on the owned port 5496. That development process was stopped before production builds.
- Root reported a passing production Next build and is running assembled browser journeys. Browser results belong in the final integration handoff; this document does not claim they passed yet.
- Read-only review corrections applied: valid focus/background/font tokens; loader focus restoration only when its focused control disappears; English document language; record detail keyed by record ID; provider lifetime scoped to the admin route group.

## Track integration after the core commit

Root integrated the verified document and team commits before their app sources were copied. The Documents view now uses `DocumentLibraryBlock` with per-workspace files, list/grid, folder queries, preview/download, local upload validation, removal retry/cancel and undo. File object URLs remain available for the current admin visit and are revoked on provider teardown. The Team view uses copied `TeamAdministration`, `RoleSettings` and `AuditPage` blocks with retained per-workspace members, invitations, grants and recorded sample events. Invite/resend/revoke and role saves recheck revisions and the demo's policy before local updates. Audit export downloads all matching events.

The notifications helper owns its provider, copied blocks and view; `AdminWorkspace` now loads its named `NotificationsView` export lazily. All six navigation destinations have implemented views. Reporting integration still awaits its finished handoff; the current dashboard has the core project's metrics and links.

Focused ESLint passed for the document and team sources. After the shared UI declarations were rebuilt, `npm run typecheck --workspace @evenkit/admin-starter` passed with the new document, team and notification views. Assembled production/browser verification remains with root. This is still an integration checkpoint, not a final R06 completion claim.

Root owns final build/type/lint/unit/browser runs, copied example verification, independent packed Next/Vite consumers, bundle measurements and inventory status. Physical devices and browsers beyond the reported test matrix remain unverified unless the final handoff adds evidence.

## Run

From the repository root, run `npm ci` and `npm run dev:admin`; open `http://127.0.0.1:5396`. See `docs/admin-starter.md` for setup and customization. No production service, schema, deployment or package publication was changed.
