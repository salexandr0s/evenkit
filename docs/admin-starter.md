# Next admin starter

The app in `apps/admin-starter` uses the same `@evenkit/ui` and `@evenkit/tokens` packages as the Vite catalog. It starts with fictional data for Northstar Studio and Harbor Workshop. Demo mutations stay in the current tab until a full reload or an authentication transition. No database is needed for the default mode.

## Run locally

Use Node 22.12 or newer. From the repository root:

```sh
npm ci
npm run dev:admin
```

Open `http://127.0.0.1:5396`. The root address redirects to `/dashboard`. To check a production build locally:

```sh
npm run build:admin
npm run start --workspace @evenkit/admin-starter
```

To use another port, append `-- --port 5397` to the workspace `dev` or `start` command. The packages are local, unpublished workspace packages; a copied application must install their locally packed tarballs or remain in a workspace that provides them.

## Pages and behavior

| Address | Purpose |
| --- | --- |
| `/dashboard` | Workspace metrics and links to project records. |
| `/records` | Search, filter, paginate, create and edit projects. |
| `/records/[recordId]` | A record's details and sample activity. |
| `/team` | Team members, invitations and role controls. |
| `/notifications` | Workspace notifications and channel preferences. |
| `/documents` | Document lists, previews and upload actions. |
| `/settings` | Profile fields and appearance preferences. |

The workspace switcher changes the active data context. Pending requests are aborted and the next view starts with that workspace's state. Changes to one workspace's records and profile do not alter the other workspace. A record URL from another workspace displays a recovery action instead of showing the previous workspace's record.

Open **Demo controls** to make requests slow or fail the next request. Refresh a view to exercise loading, cancellation and retry. Save a record or profile to exercise mutation failure: the form retains its draft, offers retry and supports cancellation. Changing workspace during a save prevents the old result from updating the new context. The session recovery link preserves the current destination, then starts a fresh demo after recovery.

Appearance preferences are scoped by workspace and stored on this browser when storage is available. Theme, light/dark/system mode and density affect the app. The formatting locale affects timestamp formatting; interface text remains English. Browser storage failure leaves preferences usable for the current visit.

## Customize the application

`components/admin-workspace.tsx` composes the existing `AdminShell`, workspace switcher and navigation. Each major view uses a dynamic import, so adding a view does not require eagerly loading its implementation. Add its route name in `lib/navigation.ts`, then its lazy import and navigation item in the shell.

`components/starter-providers.tsx` owns the demo request lifecycle and workspace data. Replace its fictional fixtures and request function with your application's transport. Keep the `AbortSignal` contract and check the active workspace before committing async results. A backend must enforce authorization and validate the workspace on every read and mutation; the client switcher is presentation state.

`blocks/` contains editable copies of the record workflow, record detail and account settings blocks. Applications own these files and their domain language. Their primitives still come from `@evenkit/ui`; framework imports belong in the app's route and integration files. Copy source blocks together with their declared local dependencies.

The `(admin)` route-group layout owns the client provider. Moving to sign-in or session recovery unmounts it and cancels pending requests. Each server page calls `requireStarterSession` before rendering. The reusable components and source blocks do not import Next or Supabase.

## Optional Supabase auth

The default mode is a local demonstration. Provider mode is opt-in through `apps/admin-starter/.env.local`; see [the auth adapter guide](./auth-adapter.md) for environment variables, local provider setup, redirect URLs and the application-owned eligibility policy. The starter's project records and workspace memberships remain fictional in provider mode. Signing in does not connect them to production data or create membership tables.

## Verification

Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:admin` and the packed-consumer checks after changing boundaries or copied blocks. The integration handoff records the exact checks, browser coverage and limitations for the delivered revision. These docs do not imply live-provider or physical-device verification.
