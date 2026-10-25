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

## Integration remaining at core commit

Team, notifications, documents and the reporting dashboard are waiting for their finished track commits and handoffs. Their navigation entries exist; the three pending views currently show an integration message. These are required integration work, not a completed R06 delivery. The starter owner will wire copied blocks once root integrates the verified commits, then update this handoff and the setup guide.

Root owns final build/type/lint/unit/browser runs, copied example verification, independent packed Next/Vite consumers, bundle measurements and inventory status. Physical devices and browsers beyond the reported test matrix remain unverified unless the final handoff adds evidence.

## Run

From the repository root, run `npm ci` and `npm run dev:admin`; open `http://127.0.0.1:5396`. See `docs/admin-starter.md` for setup and customization. No production service, schema, deployment or package publication was changed.
