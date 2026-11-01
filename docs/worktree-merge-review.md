# Recent worktree merge review

26 October 2026. Target: `codex/component-improvements`, starting at `71f8aa6`.
Temporary integration checkout: `/Users/nationalbank/.codex/worktrees/merge-recent-worktrees/design-tokens`, branch `codex/merge-recent-worktrees`.

Ten completed worktree snapshots are integrated and verified. The primary checkout was fast-forwarded to `8187a1a`, retaining its uncommitted catalog/LLM metadata changes. A final build, typecheck and lint in that checkout passed. Later uncommitted UI/sidebar edits are outside this verification snapshot.

## Source revisions

| Source branch | Source cutoff | Integration state |
| --- | --- | --- |
| `codex/admin-starter` | `8910a66` | Merged |
| `codex/block-registry` | `a1d8dbb` | Audited deltas applied; ancestry reconciled |
| `codex/document-library` | `13e0e31` | Audited deltas applied; ancestry reconciled |
| `codex/evenkit-design-pass` | `d463796` | Merged with semantic conflict resolution |
| `codex/evenkit-design-refinements` | `e063b01` | Merged, including final fixes and evidence |
| `codex/notifications` | `c946d89` | Audited deltas applied; ancestry reconciled |
| `codex/reporting` | `5485165` | Audited deltas applied; ancestry reconciled |
| `codex/rich-chat` | `39686e6` | Audited deltas applied; ancestry reconciled |
| `codex/team-admin` | `1dc9ae5` | Audited deltas applied; ancestry reconciled |
| `codex/website-blocks` | `caff633` | Audited deltas applied; ancestry reconciled |

The refinement snapshot includes lock-icon discovery, explicit password-toggle captions, document Undo availability, package-fixture hydration and final design evidence. Existing `main` and `codex/auth-pages` histories are retained. These cutoffs identify completed work; subsequent UI/sidebar edits started after this cutoff and remain uncommitted outside the merge.

## Merge decisions

Seven feature implementations had already been ported to the target. The audit compared their owned files, applied missing design/documentation commits, and only then recorded their original branch ancestry. Those ancestry merges left the integrated tree unchanged. Exact source and merge revisions are in `.artifacts/worktree-integration/history-reconciliation.json`.

Admin-starter and shared-design merges used normal merges with file-level conflict resolution. Reporting, statistics and website layouts combine the family design work with shared spacing and symmetry changes. Public callbacks, authorization boundaries, cancellation and retry behavior remain application-owned.

Document layouts retain grouped controls, passive thumbnails, readable file-type labels, equal-height cards and the starter filename minimum width. Table actions gain named icons and tooltips; grid actions retain visible labels. The older four-child subgrid rules were incompatible with the newer thumbnail/body structure and were not copied over it.

Team confirmations retain the Team/Role description list and adopt the clearer pending message. Rich-chat source actions preserve nested overlay dismissal. Password toggles retain explicit `showText`/`hideText` compatibility, and document Undo remains unavailable while the list reloads.

Six starter copies were synchronized with their registry counterparts: document library, notification center, notification preferences, team administration, role settings and audit page. Starter-specific notification behavior and the newer team section heading were preserved. Duplicate audit headings were removed, and role selection sits in the header action area.

The primary checkout's uncommitted `apps/catalog/index.html` and both files in `apps/catalog/llms/` remain byte-identical to their initial snapshots. Its Vite configuration retains the LLM plugin alongside the integrated build manifest. The merged result matches the expected three-way content hash, including after the final primary build. These user edits remain uncommitted; `primary-preservation.json` records the checks.

Conflict paths, initial worktree states and verification inputs are recorded in `.artifacts/worktree-integration/resolved-conflicts.json`, `baseline.json` and `verification-inputs-final.json`.

## Verification

The broad browser runs cover the assembled merge. After the last bounded compatibility and recovery fixes, affected catalog and three-engine admin journeys passed again. The final build, type/lint, unit, example and packed-consumer checks use the updated source.

| Check | Recorded result | Evidence under `.artifacts/worktree-integration/` |
| --- | --- | --- |
| Production builds | Final integration and primary checkout passed | `build-cutoff.log`, `primary-build.log` |
| Configured TypeScript and ESLint | Passed | `typecheck-cutoff.log`, `lint-cutoff.log`, `primary-typecheck.log`, `primary-lint.log` |
| Unit suite | 47 passed | `unit-cutoff.log` |
| Registry tests | 34 passed | `registry-final.log` |
| Copied examples | 116 examples; 104 inventory mappings passed | `examples-cutoff.log` |
| Catalog browser suite | 296 Chromium journeys passed | `catalog-browser.log` |
| Admin browser suite | 63 journeys across Chromium, Firefox and WebKit passed | `admin-browser.log` |
| Copied website consumers | Vite/Next builds, CSS, rendering and keyboard/form checks passed | `website-consumers.log` |
| Registry viewer | Passed without runtime errors | `registry-viewer.log` |
| Bundle checks | Passed; 11 workstream previews deferred | `bundle-cutoff.log` |
| Final caption, document and icon journeys | 11 Chromium cases and 12 admin cases across three engines passed | `affected-browser.log`, `affected-admin.log` |
| Final packed packages/registry consumers | Vite/Next build, strict types, SSR, HTTP/CSS, auth and interactions passed; all 23 registry blocks installed in each | `packed-registry-final.log`, `reports/registry-packages.json` |
| Source ancestry and primary-file preservation | All ten cutoffs are ancestors; user edits preserved | `completed-source-worktrees.json`, `primary-preservation.json` |

The first packed Next interaction timed out on its SSR-visible dialog trigger. The fixture now stays disabled until its client effect marks readiness; the verifier waits for that signal and retains runtime/focus/request diagnostics on failure. Dialog visibility, Escape, focus restoration, checkbox, password and document assertions remain mandatory. The final packed run passed and cleaned its temporary consumers/servers. This follows [Playwright's hydration guidance](https://playwright.dev/docs/navigations#hydration).

Historical feature screenshots and checks remain in each source checkout at `/Users/nationalbank/.codex/worktrees/<track>/design-tokens/.artifacts/`, with the checkout paths listed in `baseline.json`. Consult the family handoffs, including `docs/document-library-handoff.md`, `docs/notifications-handoff.md`, `docs/rich-chat-handoff.md` and `docs/handoffs/`. The shared design evidence is recorded in `docs/design-pass-review.md`; branch-local counts describe those source snapshots.

## Limits and final handoff

Admin coverage across three browser engines does not establish physical Safari/mobile-device behavior. Physical touch, native mobile keyboards and spoken screen-reader output remain unverified. Live provider delivery, production authorization and private-storage behavior require their own application environments; local fictional flows and browser checks do not establish those properties.

No packages were published, no site was deployed and no application was migrated. Source branches/worktrees are retained. Verification evidence was copied to the primary checkout under `.artifacts/worktree-integration/`. The app rejected archiving the integration checkout because it is this task's primary checkout, so that clean snapshot is retained. No required merge work remains for the recorded cutoffs.
