# Admin starter integration

Delivery date: 26 October 2026. Branch: `codex/admin-starter`. Worktree: `/Users/nationalbank/.codex/worktrees/admin-starter/design-tokens`. Base: `b588b1b1964ba2b26ee8453606f354f2c33eb10d`, the latest local `codex/component-improvements` after fetching origin on 25 October. The base was seven commits ahead of origin. The original checkout and concurrent worktrees remain intact. Nothing was pushed, published, deployed or migrated.

## Accepted source revisions

Only finished commits with verification handoffs were accepted. Shared export, CSS, catalog, dependency and fixture conflicts were resolved additively against the newer component APIs. Old auth package names and duplicate controls were adapted rather than replacing current components.

| Track | Accepted source commits | Integrated commits / handoff |
| --- | --- | --- |
| Auth pages | `6fc9302`, `0a93d90`, `e81afc0` reviewed | Adaptation `e1276b2`, wiring `2b5e56e`; [auth handoff](./handoffs/auth-adapter.md) |
| Documents | `27eb10e`, `a5cb9f1`, `6ce6eed` | `160dd70`, `4fdda27`, `e607a23`; [track handoff](./document-library-handoff.md) |
| Team | `3f591ea`, `737b3a7` | `340fa0a`, `1cc67b7`; [track handoff](./handoffs/team-admin-track.md) |
| Registry | `0193a17`, `a340aaf` | `caa272e`, `eebd9f9`; [track handoff](./handoffs/block-registry-track.md) |
| Notifications | `b3ca9c7`, `cda0196` | `b94999f`, `a177695`; [track handoff](./notifications-handoff.md) |
| Website | `173dd10`; `572ee22` handoff reviewed | `13b5f9d`; [preserved handoff](./handoffs/website-blocks-track.md) |
| Rich chat | `64f3196`, `363f84b`, `7b16451` | `c7d666a`, `b738769`, `78d963b`; [track handoff](./rich-chat-handoff.md) |
| Reporting | `6f084ef`, `bd3023e`, `836881e` | `716852d`, `eb3e4ee`, `8dbbaf6`; [track handoff](./handoffs/reporting-track.md) |

The assembled app starts with `npm ci && npm run dev:admin` at `http://127.0.0.1:5396`. [Setup and customization](./admin-starter.md) cover fictional data, view composition, copied blocks, workspace boundaries and optional auth configuration. Core app commit `cc923b6`, team/doc integration `0a72f92`, notifications `0fcb87a`, adapter `fe2baf8`, auth routes `b9c17a3`, registry expansion `7ffc16a`, consumer checks `0ce2e1b` and document/team journeys `3eaa8e0` form the app integration units.

## Delivered scope

R06 delivers a runnable Next admin with dashboard/report filters/chart/table/CSV, records/list/detail/edit, profile/appearance, team/invitations/roles/audit, notifications/preferences and documents/folders/upload/preview/download/removal/undo. Fictional mutations work, retain failed drafts and support retry, cancellation and context changes. Data is scoped to workspace and discarded on authentication transitions. No provider membership or application data schema was added.

R01 is an opt-in bounded password/PKCE Supabase adapter with explicit server/client/paths/policy exports. Protected server pages verify identity and application-owned eligibility. The starter policy requires confirmed email plus a server-only UUID allowlist; signup defaults closed. Return paths reject normalized/protocol-relative redirects and the app validates its own route set. Callback, POST sign-out, origin validation, session-expiry recovery and cookie synchronization stay in the app/adapter. [The adapter guide](./auth-adapter.md) describes the exact boundaries.

R05 now distributes 23 registered items and 34 unique files, including local source/CSS/declaration closures. Its installer handles dry runs, repeated installation, owned edits and upgrade conflicts. Rich chat remains a maintained UI family with a copied complete catalog example; no artificial registry block was added. The catalog contains 116 copied examples and 104 distinct inventory mappings. Separate Vite and website starter applications remain future inventory scope; generic Vite consumption and copied website blocks are verified here.

## Compatibility and dependencies

`@evenkit/tokens` and `@evenkit/ui` have no Next or Supabase dependencies. `@evenkit/auth-next/server` imports `server-only`; packed Next verification deliberately rejects importing it from a Client Component. Interactive emitted UI files retain `"use client"`. Generic consumers import token CSS before UI CSS, require no Tailwind and use document-root theme attributes for portals.

Custom brand configurations must now supply `chart-series-1` through `chart-series-6` in both modes. Spread a built-in theme's mode before overriding brand values, or supply all six validated colors; old incomplete custom-mode objects fail validation. Neutral surfaces and existing accent contracts are preserved. Chart surface contrast does not prove pairwise color distinguishability; labels, patterns/dashes and the semantic data table remain necessary.

New runtime dependencies are pinned: d3-shape 3.2.0/d3-path 3.1.0 (ISC), react-markdown 10.1.0/remark-gfm 4.0.1 (MIT), and the optional adapter's Supabase SSR 0.12.7/SDK 2.118.0/server-only 0.0.1/Zod 4.6.7 (MIT). Next is 16.4.3. [Dependency reconciliation](./dependency-reconciliation.md) records every added lock entry, optional Sharp/libvips licensing, notice locations and registry tooling. `npm ls --all` passes. Original Evenkit source remains private and unlicensed for public distribution.

## Verification record

`npm run verify` exited 0 after a clean install: all package/catalog/admin builds, configured strict types, full ESLint, 47 unit tests, 21 registry tests, 295 catalog Chromium journeys and 63 assembled admin journeys (21 in each of Chromium, Firefox and WebKit) passed. `npm run verify:examples` passed all 116 copied examples and 104 mappings. Final command results are also recorded in `SESSION_HANDOFF.md`. Local logs are ignored by Git under `.artifacts/admin-integration/`; the source tests, scripts and tracked handoffs make the checks repeatable.

| Check | Evidence |
| --- | --- |
| Clean install and combined production builds | `clean-install.log`, `verify-final.log`; tokens, UI, adapter, catalog and Next starter |
| Configured strict types and full ESLint | `verify-final.log`; packages, catalog, app, browser tests/configs |
| Unit and registry tests | `verify-final.log`; 47 unit tests and 21 registry tests |
| Copied examples | `examples.log`; 116 complete copied examples, 104 unique mappings |
| Catalog journeys | `verify-final.log`; full Chromium suite including lazy network requests and theme/layout matrices |
| Admin journeys | `verify-final.log`; Chromium, Firefox and WebKit, including focus restoration, workspace isolation, retries, cancellation, actual CSV/file/audit downloads and session recovery |
| Independent packed Next/Vite | `packed-consumers.log`, `.artifacts/package-verification.json`; builds, strict types, SSR/CSS, hydration/focus and negative auth server/client boundary |
| Registry-installed Next/Vite | `registry-consumers.log`, `.artifacts/registry-package-verification.json`; all 23 items/34 files with dry-run/install/repeat checks |
| Independently copied website | `website-consumers.log`, `.artifacts/website-blocks/copied-consumption.json`; Vite/Next rendering/styles/keyboard/forms/duplicate submission/unmount cancellation |
| Real disposable Supabase/Next | `.artifacts/admin-auth/local-provider.json`; nine groups passed, cleanup confirmed in `local-environment.json` |

The catalog's fake-clock form test now waits for the lazy form before pausing time. Browser runs use isolated output directories; an earlier overlapping run caused a trace cleanup ENOENT, then the isolated three-engine run passed. Initial integration-test selector/readiness errors were corrected before the final verification. Review also found and fixed the dashboard's focused cancellation control disappearing on successful completion; a dedicated journey covers it.

Final visual inspection caught a compressed document-name column that page-overflow assertions could not detect. Commit `1278ffb` gives document filenames a readable token-based minimum inside the horizontally scrolling table. The final CSS change passed combined builds, strict types/lint, five document catalog journeys, 33 affected admin journeys in all three engines (including filename width/height assertions), and fresh packed/registry consumers. Evidence is `mobile-fix-*.log`, `packed-consumers-final.log` and `registry-consumers-final.log`.

The admin layout suite checks all six sections at 360 and 1440 CSS pixels, in eight themes and both modes, in each browser engine: 576 combinations. It checks document overflow, heading focus and theme-token availability, and exercises keyboard opening/Escape/focus return of the mobile drawer. Chromium captures for all six mobile sections were inspected. Catalog families add their own RTL, intermediate-width, reduced-motion, dialog and chart matrices. This is bounded evidence, not a claim of full accessibility conformance.

## Bundle impact

Measurements are per emitted asset, with gzip calculated locally. Shared dependency closures overlap; do not sum the catalog view totals. These are observations, not enforced production size budgets.

| Build/fixture | Raw bytes | Gzip bytes | Meaning |
| --- | ---: | ---: | --- |
| Base catalog, all 53 JS/CSS assets | 1,797,270 | 495,898 | All deferred routes included |
| Integrated catalog, all 80 JS/CSS assets | 2,267,608 | 631,614 | Increase 470,338 raw / 135,716 gzip across all added families |
| Catalog initial host closure | 935,479 | 237,958 | Includes shared UI/React and monolithic token/UI CSS |
| Catalog view static closure | 1,223,215 | 312,995 | Includes overlapping shared dependencies; see JSON for exact files |
| Admin demo dashboard browser-requested JS | 1,151,471 | 359,811 | Excludes CSS and RSC payloads; provider/team/notification view chunks remain deferred |
| Admin deferred notification view JS | 12,302 | 4,332 | View-specific chunk, shared dependencies excluded |
| Admin deferred team view JS | 39,017 | 12,159 | View-specific chunk, shared dependencies excluded |
| Admin deferred provider SDK JS | 258,603 | 67,664 | Absent from demo dashboard/notification requests |
| Independent Button-only Vite JS | 368,914 | 116,979 | 311 emitted modules including React; excludes optional chart/Markdown engines |
| Independent full-coverage Vite JS | 1,419,602 | 420,894 | 1,222 modules; deliberately references all UI exports and copied blocks |

`npm run verify:bundle` checks source maps and the Vite manifest: eleven workstream previews remain deferred, and no Next/Supabase/Markdown/d3 module appears in the initial/catalog static graph. A browser journey checks real lazy requests. Markdown dependencies currently share the chat module, so a plain ChatPanel consumer also loads that renderer graph; opt-in refers to rendering behavior. All UI CSS is delivered together. The Button-only consumer proves chart/Markdown code can be removed when unused; it does not promise a minimal stylesheet. Admin browser-observed dashboard and deferred team/notification/provider chunk measurements are written to `admin-bundle.json`.

## Remaining limitations

Real local GoTrue tests covered eligible login/SSR cookies, nonmember denial and cleanup, sign-out, invalid/expired recovery, actual reset email→PKCE→password update→new login, denied callbacks and Chromium focus-triggered expiry clearing the mounted app. They used Supabase CLI 2.111.0, Docker 29.5.2/Colima, GoTrue v2.194.0, PostgreSQL 17.6.1.156 and Mailpit v1.30.2. All users, browser/processes, containers, volumes, network and temporary credentials were removed.

Hosted-provider configuration, external email delivery, OAuth/magic links/MFA, bot/rate-limit behavior, production entitlements, expiry-timed token refresh and an injected provider sign-out outage were not exercised. Provider outages retain the current view until a protected request presents recovery; an absent session clears the app on SIGNED_OUT, focus or polling. Cancellation cannot reverse a remote mutation that already committed.

Browser engines were automated on macOS. Physical phones/tablets, installed Safari, screen readers, high-contrast/forced-color modes, older React/Node versions and deployed environments were not tested. The catalog and packed consumers use Chromium; the assembled admin has Chromium/Firefox/WebKit coverage. Files and business data remain fictional/in memory, and private storage authorization is application-owned. No production application was changed.
