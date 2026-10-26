# Tested compatibility

Integrated admin-starter verification, 26 October 2026. These packages remain local pilots. [The integration record](./admin-integration.md) lists accepted source revisions, exact commands, bundle evidence and limits; [the session handoff](../SESSION_HANDOFF.md) records the final result.

| Area | Environment exercised | Evidence |
| --- | --- | --- |
| Tooling | Node 26.12.1, npm 11.20.0, TypeScript 6.0.3 strict | Clean lockfile installation; combined builds, configured types and lint |
| React | React/React DOM 19.3.1 | Catalog, assembled admin and independently packed consumers |
| Generic Vite | Vite 8.3.5 | 116 copied catalog examples, packed Next/Vite consumers and independently installed/copied blocks |
| Next | Next 16.4.3 App Router and proxy | Runnable admin, packed server rendering, explicit server-only rejection and route journeys |
| Browser automation | Playwright 1.64.1; Chromium catalog/consumers; Chromium, Firefox and WebKit admin | Interaction, cancellation, retry, context isolation, focus, mobile drawer and downloaded content checks |
| Themes and widths | Eight themes, light/dark; assembled admin at 360/1440px | 576 admin route/theme/mode/width/engine combinations; catalog has additional RTL/intermediate-width matrices |
| Reporting | d3-shape 3.2.0/d3-path 3.1.0 | Keyboard chart inspection, semantic data tables, period filtering, cancellable downloads and series/surface contrast |
| Rich chat | react-markdown 10.1.0/remark-gfm 4.0.1 | Escaped HTML, safe URLs, code copying, attachment/source states and copied examples |
| Supabase | SSR 0.12.7/SDK 2.118.0; disposable local GoTrue v2.194.0 | Nine real provider/Next groups including cookies, eligibility, recovery email/PKCE/password update, sign-out and Chromium expiry cleanup |
| Block distribution | Local registry with 23 items/34 files | Schema/import closure, dry run/install/repeat, owned edits/upgrade recovery and independent consumer builds |

The declared Node minimum is 22.12.0; only Node 26.12.1 was exercised. TypeScript 6.0.3 matches the installed lint parser's supported range. The reconciled lockfile and [dependency record](./dependency-reconciliation.md) retain exact dependencies and licenses.

## Adoption boundaries

Import token CSS before UI CSS. Consumers need no Tailwind. Set theme/mode attributes on the document root so body-mounted dialog/select/tooltip portals inherit them. Nested theme scopes are outside the supported setup. React remains a peer and interactive emitted UI preserves `"use client"`.

Custom brands now require six `chart-series-1` through `chart-series-6` values in each mode. Spread a built-in mode before overriding, or supply every validated semantic token. The addition preserves neutral surfaces. Chart contrast validation concerns marks against neutral surfaces; use labels, markers/dashes/patterns and the data table to supplement color.

The UI and tokens have no Next, Supabase or server-only dependencies. The optional adapter has explicit `/server`, `/client`, `/paths` and `/policy` subpaths. Server pages verify identity and application-owned eligibility. The starter uses confirmed-email UUID allowlisting and closed signup by default; it does not add provider membership/data schemas. Hosted email, OAuth, magic links and MFA remain outside its bounded verification.

Editable blocks are application-owned source. Preserve cancellation signals and reject stale results after workspace, record, revision or permission changes. Cancellation cannot reverse a remote operation already committed. Tables use stable IDs and application-owned remote queries; authorization and backend pagination stay in the host. Admin navigation uses the existing container breakpoint and custom router links must preserve supplied navigation props/ref.

The demo keeps business data, uploads, notification state and role changes in memory. Workspace changes abort pending requests; authentication transitions unmount the provider and release file URLs. Appearance preferences use browser storage by workspace. Production transports must enforce authorization, validate files and manage durable storage/download URLs independently.

Markdown rendering is opt-in per message and uses a fixed safe pipeline. Its dependencies currently share the chat module, so importing ChatPanel also brings that renderer graph. Unused chart/Markdown engines are absent from the independent Button-only Vite build. The catalog's workstream previews are lazy; all UI CSS is delivered together. Sizes and this tradeoff are recorded in the integration report.

## Verification gaps

Physical touch devices, installed Safari, screen readers, forced-color modes, older React/Node versions, other frameworks and production deployment were not tested. WebKit automation is engine coverage, not a physical iOS/Safari device claim. Catalog and packed-consumer browser journeys use Chromium; only the assembled admin runs all three engines. No full WCAG-conformance claim is made.

The real local provider check did not exercise external email delivery, hosted configuration, bot/rate limits, OAuth/magic links/MFA, production entitlements, expiry-timed token refresh or an injected sign-out outage. Cookie issuance/SSR reads, successful local sign-out and expiry recovery were exercised. All disposable provider resources and credentials were removed. Existing applications and production schemas were not modified.

Before adopting or upgrading, run `npm run verify`, `npm run verify:examples`, `npm run verify:packages`, `node scripts/verify-packages.mjs --registry`, `node scripts/verify-website-blocks.mjs` and `npm run verify:bundle`. Build packages before independent consumer checks; registered sources must match committed Git blobs. The local-provider script and setup are documented in [the auth adapter guide](./auth-adapter.md).
