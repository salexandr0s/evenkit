# Evenkit admin starter handoff — 26 October 2026

Status: complete for the requested bounded R01 adapter, R05 distribution integration and R06 Next admin starter. Nothing was pushed, published, deployed or migrated. Production authentication, data and membership schemas were not changed.

## Checkout and run

- Branch: `codex/admin-starter`.
- Isolated checkout: `/Users/nationalbank/.codex/worktrees/admin-starter/design-tokens`.
- Base: `b588b1b1964ba2b26ee8453606f354f2c33eb10d`, latest local `codex/component-improvements` after fetching origin on 25 October. The local base was seven commits ahead of origin. The primary checkout and concurrent track worktrees are preserved.
- From this checkout: `npm ci`, then `npm run dev:admin`. Open `http://127.0.0.1:5396`.
- Production demo: `npm run build:admin`, then `npm run start --workspace @evenkit/admin-starter`. A local production demo was left running on 127.0.0.1:5396; `/dashboard` returned HTTP 200. This is a local process, not a deployment.
- Other ports require matching `EVENKIT_APP_ORIGIN`; see `apps/admin-starter/.env.example` and [setup/customization](docs/admin-starter.md).

## Delivered behavior

The Next app combines the existing AdminShell with dashboard metrics/chart/table/filter/CSV export, records/list/detail/create/edit, profile/appearance, team/invitations/roles/audit export, notification inbox/preferences, and document folders/list/grid/upload/preview/download/removal/undo. It uses fictional Northstar Studio and Harbor Workshop data. Requests support loading, failure/retry, cancellation and context changes; mutations reject stale workspace/revision results. Authentication transitions discard the in-memory application provider and release file URLs. Appearance preferences are browser-local per workspace.

Auth pages were reviewed from `codex/auth-pages` and adapted to current controls, icons, theme changes and package names. The optional `@evenkit/auth-next` adapter has explicit `/server`, `/client`, `/paths` and `/policy` exports, server-only enforcement, validated origins/return paths, PKCE callback, POST sign-out, cookie synchronization and session-expiry recovery. The app owns eligibility: confirmed email plus server-side UUID allowlist, with signup closed by default. No provider schema migration or production membership model was introduced.

The combined catalog has 116 entries/examples and 104 unique inventory mappings. The registry contains 23 items/34 unique installed files. Generic UI/tokens have no Next or Supabase dependencies and remain independently consumable in Vite. Separate general Vite and website starters remain future inventory scope; the requested runnable Next starter and generic Vite/copied website consumption are delivered.

## Logical commits and accepted tracks

[The integration record](docs/admin-integration.md) lists every accepted source commit and its integrated revision. Only finished verified track commits were cherry-picked, with additive shared-file conflict resolution.

App/integration units include:

| Commit | Unit |
| --- | --- |
| `e1276b2`, `2b5e56e` | Current auth presentation, public export/CSS/catalog wiring and journeys |
| `cc923b6` | Runnable core Next shell, records and settings |
| `fe2baf8`, `b9c17a3` | Bounded adapter, application policy, routes and session recovery |
| `0a72f92` | Workspace documents, team, roles and audit |
| `0fcb87a` | Retained workspace notifications and preferences |
| `7ffc16a`, `0ce2e1b` | Expanded registry and strict independent consumers |
| `3eaa8e0` | Document/team recovery and download journeys |
| `fa64613` | Dashboard reporting, proxy, environment example and reconciled lock/runtime scripts |
| `e59efb2` | Final catalog icons/counts, assembled journeys, lazy/bundle checks and isolated browser output |
| `1278ffb` | Mobile document filename readability and geometry regression |
| `c6d778f` | Final packed/registry artifact hashes and verification handoff |

Preserved track handoffs: [documents](docs/document-library-handoff.md), [team](docs/handoffs/team-admin-track.md), [notifications](docs/notifications-handoff.md), [registry](docs/handoffs/block-registry-track.md), [website](docs/handoffs/website-blocks-track.md), [rich chat](docs/rich-chat-handoff.md), [reporting](docs/handoffs/reporting-track.md), [auth](docs/handoffs/auth-adapter.md), [app](docs/handoffs/admin-starter-app.md), [app notifications](docs/handoffs/admin-notifications.md), [consumers](docs/handoffs/admin-consumers.md).

## Exact verification

Runtime: Node 26.12.1, npm 11.20.0, TypeScript 6.0.3, React/React DOM 19.3.1, Next 16.4.3, Vite 8.3.5, Playwright 1.64.1. Node minimum 22.12 is declared but was not separately exercised.

| Command / check | Result | Local evidence |
| --- | --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` | Exit 0; clean reconciled install, 348 packages | `.artifacts/admin-integration/clean-install.log` |
| `npm run verify` | Exit 0: tokens/UI/adapter/catalog/admin builds, configured strict types, full ESLint, **47 unit tests**, **21 registry tests**, **295 Chromium catalog journeys**, **63 admin journeys (21 per Chromium/Firefox/WebKit)** | `.artifacts/admin-integration/verify-final.log` |
| `npm run verify:examples` | Exit 0; **116 independently copied examples, 104 unique inventory mappings** | `.artifacts/admin-integration/examples-final.log` |
| Final mobile CSS change: `npm run build`, `npm run typecheck`, `npm run lint` | Exit 0 | `.artifacts/admin-integration/mobile-fix-build.log`, `mobile-fix-typecheck.log`, `mobile-fix-lint.log` |
| Final CSS affected browser checks | **5 document catalog journeys**, **33 admin document/team/layout/lazy journeys** in all three engines passed | `.artifacts/admin-integration/mobile-fix-catalog-browser.log`, `mobile-fix-admin-browser.log` |
| `npm run verify:packages` | Independent packed Vite/Next build, strict types, SSR/CSS, Chromium hydration/checkbox/dialog/document focus, explicit auth exports and expected rejection of server-from-client import | `.artifacts/admin-integration/packed-consumers-final.log`, `.artifacts/package-verification.json` |
| `node scripts/verify-packages.mjs --registry` | All **23 items/34 files** installed in each disposable Vite/Next consumer; dry-run/install/repeat plus the same types/build/browser/boundary checks | `.artifacts/admin-integration/registry-consumers-final.log`, `.artifacts/registry-package-verification.json` |
| `node scripts/verify-website-blocks.mjs` | Independently copied Vite/Next website render/styles/keyboard/forms, duplicate-submit prevention, repeated forms and unmount cancellation passed | `.artifacts/admin-integration/website-consumers.log`, `.artifacts/website-blocks/copied-consumption.json` |
| `npm run verify:bundle` and browser lazy tests | Eleven deferred catalog workstream previews; no Next/Supabase/Markdown/d3 in initial/catalog static graph. Actual catalog/admin request checks pass; provider SDK remains absent from demo dashboard and notifications | `.artifacts/admin-integration/catalog-bundle.json`, `admin-bundle.json` |
| `npm ls --all --json` | Exit 0; dependency graph resolved | `.artifacts/admin-integration/dependency-tree.json` |
| Real disposable Supabase + built Next | **9 groups passed**, including actual email/PKCE/password update and Chromium expiry cleanup | `.artifacts/admin-auth/local-provider.json`, `local-environment.json`, `local-provider-server.log` |

The full verification preceded the final CSS-only mobile correction; all affected builds/types/lint/browser and fresh packed/registry checks were rerun after that correction. Website source was unchanged after its independent check. Earlier test startup, selector/readiness and overlapping trace-output failures were corrected; isolated runs passed. A real report-completion focus defect was fixed and has a dedicated regression journey. Loaded mobile captures exposed the filename compression defect, which now has minimum-width/height assertions.

All six admin sections were checked at 360/1440px across eight themes and light/dark in each engine (576 combinations), with keyboard drawer open/Escape/focus return. Loaded mobile captures were inspected. Catalog families include further RTL, intermediate-width and reduced-motion matrices. Internal horizontal table scrolling is intentional; document grid view is also available.

## Bundle, licenses and adoption

[Dependency reconciliation](docs/dependency-reconciliation.md) lists 162 added third-party lock entries (including optional platform packages), pinned direct versions and declared licenses. Notices for reporting, Markdown and Supabase dependencies are retained in their packages. Next's optional Sharp/libvips packages declare Apache/LGPL combinations and remain outside generic UI tarballs. Original private Evenkit source remains unlicensed for public distribution.

Custom brand light/dark modes now require `chart-series-1` through `chart-series-6`; spread a built-in mode or supply all validated values. Existing neutral surfaces and current controls are preserved. [Compatibility](docs/compatibility.md) and [reporting](docs/reporting.md) describe adoption boundaries.

The final catalog host is 237,958 bytes gzip, and its catalog-view static closure is 312,995 bytes gzip; these overlap. Full all-route assets increased from 495,898 to 631,614 bytes gzip. Button-only independent Vite JS is 116,979 bytes gzip with optional chart/Markdown/provider engines excluded; full coverage deliberately retains all UI exports. Browser-observed admin dashboard JS is 359,811 bytes gzip excluding CSS/RSC. Team, notification and provider chunks remain deferred. These are per-asset local measurements, not production budgets. All UI CSS is delivered together, and plain ChatPanel imports currently share the Markdown renderer graph. Exact raw sizes/file sets are in the integration report and JSON artifacts.

## Provider and device limits

The local environment used Supabase CLI 2.111.0, Docker 29.5.2/Colima, GoTrue v2.194.0, PostgreSQL 17.6.1.156 and Mailpit v1.30.2. Tests covered anonymous recovery, Origin/closed-signup rejection, verified nonmember denial/cookie cleanup, allowed login/cookie SSR, successful sign-out, invalid/expired recovery, real reset email→PKCE→password update→new login, nonmember callback rejection and Chromium focus-triggered expiry clearing the app. All fixture users, browser/server processes, containers, volumes, network and temporary credentials were removed.

Hosted configuration, external email delivery, OAuth/magic links/MFA, bot/rate-limit behavior, production entitlements, expiry-timed token refresh and an injected sign-out outage were not exercised. Provider outages retain the current view until a protected request presents recovery; missing sessions clear on provider event/focus/polling. Cancellation cannot undo a provider mutation already committed.

Physical phones/tablets, installed Safari, screen readers, forced-color modes, older runtimes and deployment were not tested. WebKit automation is engine evidence, not physical iOS certification. The catalog/packed consumers use Chromium; assembled admin flows run Chromium/Firefox/WebKit. No full WCAG claim is made. Private storage and production authorization remain application-owned; business data stays fictional/in memory.

## Continue from here

Use the isolated branch for review/adoption. The working tree is intended to be clean after the final documentation commit. Logs under `.artifacts/` are local ignored evidence; commands, tests, source handoffs and the integration record are tracked. Rebuild before independent consumer checks; registered source files must match committed blobs. There is no pending publication, deployment, migration or production verification step authorized by this task.
