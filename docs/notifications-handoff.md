# Notification family integration handoff

Completed 25 October 2026 on `codex/notifications` in `/Users/nationalbank/.codex/worktrees/notifications/design-tokens`. Feature commit: `b3ca9c7` (`feat(notifications): add inbox preferences and persistent status`). Base: `b588b1b1964ba2b26ee8453606f354f2c33eb10d` on local `codex/component-improvements`. The remote branch was fetched before worktree creation; the local base was seven commits ahead and contained the latest available component changes. No push, package publication or deployment occurred.

## Design pass: 25 October 2026

The follow-up design pass starts from `cda0196` and is included in the current `codex/notifications` branch tip. Integrate it with the original feature. This section supersedes the visual and verification evidence below for the updated files.

The inbox now uses one framed neutral surface, a page unread count, separated page/selection actions, title-first rows, selected-row accents and an attached pagination footer. Preferences use category descriptions beside aligned channel tiles, shared channel guidance, visible policy labels and a compact save footer. Banners adapt their message/action layout to available width and accept an optional decorative `icon`; connection states supply appropriate default icons. Catalog examples show workspace content and team members, with fault controls in native disclosures. Successful maintenance actions reveal preparation details.

Public async, selection and focus contracts are unchanged. Full visible bulk-action labels match accessible names for voice control. Preference category headings remain available to screen-reader heading navigation. No shared primitives, tokens, dependencies, lockfiles or unrelated agent files changed. CSS and markup changes are confined to the family and its examples.

Validation on the design pass:

| Check | Result and evidence |
| --- | --- |
| Production build | Passed; `.artifacts/notifications-design-build.log` |
| Configured typecheck and full ESLint | Passed; `.artifacts/notifications-design-typecheck.log`, `.artifacts/notifications-design-lint.log`; scoped lint also passed after the final label correction |
| Unit suite | 23 passed; `.artifacts/notifications-design-unit.log` |
| Copied examples | 91 examples and 77 inventory mappings passed; `.artifacts/notifications-design-examples.log` |
| Focused Chromium suite | All 14 cases passed together in 21.5 seconds; `.artifacts/notifications-design-browser.log` |
| Packed Vite and Next consumers | Production build, HTTP, SSR and CSS checks passed; `.artifacts/notifications-design-packages.log`, `.artifacts/package-verification.json`; owned consumer servers/scratch cleaned |
| Independent source review | No outstanding findings after label, heading, policy-priority, CSS-scoping and preview-outcome corrections; reviewer did not run tests |

The browser matrix covers eight themes in light/dark, neutral surfaces and theme accents, 360/768/1024/1440px widths, RTL, long notification and banner-action labels, 44px mobile controls and reduced motion. Existing preference coverage also exercises narrow RTL with long categories. Updated test selectors identify the new actual panel surfaces and open example-control disclosures; behavior assertions were retained.

Visual inspection covered Ocean light desktop layouts across the family, mobile center/preferences/banner layouts, selected and empty inboxes, Linen dark preferences with unsaved changes, and Rose dark mobile RTL banners with a visible action result. Captures are `.artifacts/design-*-desktop.png`, `.artifacts/design-*-mobile.png`, `.artifacts/design-notification-center-selected.png`, `.artifacts/design-notification-center-empty.png`, `.artifacts/design-notification-preferences-linen-dark.png` and `.artifacts/design-persistent-banner-rose-dark-rtl.png`. The screenshot helper was corrected to wait for lazy-loaded content and restore the catalog header between routes; its initial partial captures were replaced. These ignored artifacts remain local to this worktree.

Manual screen-reader listening, Safari/Firefox and physical devices remain unverified. No required design work remains. The local production preview is available at `http://127.0.0.1:59475/#notification-center` for review. Nothing was pushed, published or deployed.

## Delivered scope

| Inventory | Delivery | Main source |
| --- | --- | --- |
| O08 | Grouped notification center, page-scoped selection/mark-all, read/unread, row actions, pagination and recovery | `registry/blocks/notification-center.tsx`, `packages/ui/src/notifications.tsx` |
| M06 | Per-category/channel preferences, required/read-only/unavailable policies, draft/save/reset/cancel/retry | `registry/blocks/notification-preferences.tsx` |
| H10 | Visible presence text and accessible unread counts | `packages/ui/src/persistent-feedback.tsx` |
| G03 | In-flow persistent banner, optional actions and guarded dismissal | `packages/ui/src/persistent-feedback.tsx` |
| G06 | Offline, reconnecting, stale-data and session-expiring presentations | `packages/ui/src/persistent-feedback.tsx` |

Each family has a catalog entry, interactive preview, complete copyable example and focused browser coverage. `docs/notifications.md` records props, dependencies, scope rules, host responsibilities, accessibility behavior and provenance. The family is a pilot; Meridian Studio is fictional catalog data, not a production-adoption claim. Original internal code remains unlicensed for public distribution, consistent with the repository's existing policy.

## Integration points

Keep new family files together with these additive shared integrations:

- `packages/ui/src/index.ts` exports notifications and persistent feedback. `packages/ui/scripts/copy-styles.mjs` adds three stylesheets, including the source preferences block's styles.
- `apps/catalog/src/roadmap-entries.ts` and `roadmap-preview.tsx` include the five new pages. Entry IDs are `notification-center`, `notification-preferences`, `persistent-banner`, `connection-status`, and `presence-unread`.
- `scripts/verify-catalog-examples.mjs` adds O08/M06/H10/G03/G06. This branch has 91 examples and 77 mapped inventory IDs. When combining other agents' additions, preserve all mappings and recompute the hardcoded expected count and README count.
- `fixtures/roadmap-fixture.tsx` renders package exports and copied blocks. `scripts/verify-packages.mjs` checks their Next server output and delivered CSS.
- Inventory status, README guide link and UI provenance describe this family. Merge their additions with other agents' documentation.

There are no dependency, lockfile, token, shared control or backend changes. The primary checkout and other worktrees were preserved. The existing root session history is retained with a pointer to this handoff.

## Behavior decisions

Selection and mark-all apply only to eligible notifications on the visible page. Page/context changes clear selection; removing or denying a row prunes its selection. Read-only reasons govern selection/read changes; action availability is independent. Focusing an event does not mark it read.

Request callbacks receive the original context key and AbortSignal. Components guard UI commit callbacks and reject obsolete success/error results after context/revision/policy changes or unmount, even if the host ignores abort. Page/data identity changes also invalidate center requests. Preference schema/policy/revision changes reset the draft to the host snapshot. Same-revision value updates preserve active edits.

Applications own events, permissions, connection/session state, persistence and network validation. Aborting UI work cannot undo server writes. Hosts must authorize/scoped-write their own services, commit client state through the guarded callbacks, and provide focus targets when their successful actions navigate or remove content. Critical content remains on the page; session status has no automatic dismissal timer.

## Verification evidence

| Check | Result |
| --- | --- |
| `npm run build` | Passed package compilation and production catalog build; final log `.artifacts/notifications-build.log` |
| `npm run typecheck` | Passed configured checks and all workspaces; no suppressions added |
| `npm run lint` | Passed; final scoped lint also passed (`.artifacts/notifications-lint-final.log`) |
| `npm test` | 23 tests passed in four files, including existing token contrast checks |
| `npm run verify:examples` | All 91 copyable examples compiled; all 77 mappings passed (`.artifacts/catalog-examples.json`) |
| Focused Chromium behavior | 13 behavior cases passed on the final built source (`.artifacts/notifications-browser-final.log`) |
| Theme/layout matrix | Passed separately after correcting test setup (`.artifacts/notifications-matrix.log`) |
| `npm run verify:packages` | Independent packed Vite and Next builds, HTTP 200, SSR and stylesheet checks passed; both owned servers and scratch directory cleaned (`.artifacts/package-verification.json`) |
| `git diff --check` | Passed before feature commit |
| Independent code/docs review | No outstanding blocking findings; reviewer did not independently run tests |

The matrix checks eight themes in light/dark, neutral surfaces and accent values, 360/768/1024/1440px RTL layouts, long notification labels, 44px mobile control targets and reduced-motion spinner behavior. The preferences suite separately checks long category labels on narrow RTL layouts. Behavior cases cover keyboard names/activation, page scope, permissions, failure/retry, cancellation, stale context/revision/schema results, live page completion, and focus recovery.

The initial matrix incorrectly expected the existing transparent idle SaveStatus row to have a panel background. Its selector now targets actual family surfaces. A later matrix attempt timed out opening the theme menu after scrolling to long-label controls; the test now scrolls to the toolbar before selecting themes and enables long labels for the layout checks. A colliding local test port was avoided without stopping another agent's process. No unresolved test failure remains. The final 13 behavior cases and one corrected matrix case give 14 covered journeys; they were completed in separate runs.

Visual inspection covered the Ocean/light center and preferences and Rose/dark mobile RTL banner. Captures are `.artifacts/notification-center-desktop.png`, `.artifacts/notification-preferences-desktop.png`, and `.artifacts/notifications-banner-rtl-mobile.png`. Artifacts are local and ignored by Git. No manual screen-reader listening audit, Safari/Firefox run, physical device test or production-service integration was performed. Keyboard/ARIA/accessibility-tree evidence should not be described as those broader checks.

## Resume and integration

```sh
cd /Users/nationalbank/.codex/worktrees/notifications/design-tokens
git status --short
git log -3 --oneline
```

The feature commit can be cherry-picked onto the integration branch. Resolve shared catalog/style/example/fixture additions by preserving both families. The handoff-only commit adds this document and the root pointer; it does not change runtime behavior. Reuse the evidence above for unchanged source, and run the checks affected by any integration conflict resolution.

To reproduce the focused checks after a build, choose an unused catalog port:

```sh
KIT_CATALOG_PORT=59474 npx playwright test tests/browser/notification-center.spec.ts tests/browser/notification-preferences.spec.ts tests/browser/persistent-feedback.spec.ts
npm run verify:examples
npm run verify:packages
```

No required implementation work remains. Application adoption must still supply events, authorization, persistence and connection/session policy.
