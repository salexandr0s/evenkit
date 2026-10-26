# Sidebar dropdown fix: 26 October 2026

Status: DONE. Fixed catalog sidebar/header jumping upward when a main-content dropdown opens on a scrolled page. Horizontal clipping now applies only to the body, preserving viewport scroll locking and sticky positioning. Added a regression covering both scroll positions, selection, Escape, focus recovery and blocked background scrolling. Reproduced in all three browser engines; 17 Chromium journeys and six Firefox/WebKit sidebar journeys pass, as do catalog build, configured types and full lint. Before/after evidence and details are appended to `docs/design-pass-review.md`. Committed and merged into local `main`; no push or deployment.

---

# Seven-workstream design handoff: 26 October 2026

Status: DONE. Completed the requested goal across editable block registry tools, documents, team administration, notifications/status, rich chat, reporting and website blocks. The completed design branch is merged into local `main` in `/Users/nationalbank/.codex/worktrees/evenkit-design-refinements/design-tokens`. No push, publication or deployment occurred. The primary checkout's concurrent metadata edits remain untouched.

## Result

Integrated each feature's design pass and the earlier broad pass, then refined the combined interface: bounded mobile registry navigation, readable document layouts and stable Undo, compact team headers, selection-aware inbox actions, narrow chat citations, aligned metric rows, restored website form columns and concise UI copy. Preserved public APIs, callbacks, routes, original main history, `LockIcon` discovery and explicit password-toggle captions. Concurrent package-fixture hydration hardening is also included.

See [the final review](docs/design-pass-review.md) for the workstream table, implementation commits, exact check scope, initial failures and limits. The seven-family gallery is `.artifacts/seven-workstreams/evidence.html`; evidence remains local and ignored by Git. Earlier broad evidence remains in the separate `evenkit-design-pass` worktree.

## Verification

Configured production build, TypeScript and ESLint passed. The broad runs passed 47 unit tests, 296 catalog journeys and 63 admin journeys across Chromium/Firefox/WebKit. Later affected checks passed: copied admin flows after isolated failure investigation, document upload/removal/restore in all three browsers, 12 auth/form journeys and four icon journeys. Final repeats passed all 34 registry tests and 116 copied examples/104 mappings. Independent Vite/Next consumers passed with all 23 installed registry blocks, strict types, production builds, browser interaction and package boundaries; temporary consumers were removed. The final verifier/fixture change passed focused lint and packed strict types.

Visual review covers all eight themes in light/dark, desktop/mobile, long content, RTL, short viewports, keyboard/focus recovery, reduced motion and overflow. No known failing check or unresolved source regression remains. Physical touch/IME devices, screen-reader speech and real provider services were not exercised. Browsers without subgrid retain natural-flow alignment.

## Resume

```sh
cd /Users/nationalbank/.codex/worktrees/evenkit-design-refinements/design-tokens
git status --short
git log --oneline -15
# Catalog preview, if stopped:
npm run preview --workspace @evenkit/catalog -- --port 5621 --strictPort
# Admin production preview, if stopped:
npm run start --workspace @evenkit/admin-starter -- --port 5625
```

Implementation is complete and locally merged. No required design work is deferred. Historical handoff entries below describe their own earlier snapshots; this entry and the final review supersede their integration status and verification limits.

---

# Session handoff: 26 October 2026

Status: DONE. Completed the design and UI-copy pass across the expanded Evenkit catalog, editable blocks and assembled admin application. Worktree: `/Users/nationalbank/.codex/worktrees/evenkit-design-pass/design-tokens`; branch: `codex/evenkit-design-pass`; integrated base: `71f8aa6`. The original checkout and concurrent work remain separate and preserved. No push, publication or deployment occurred.

## Completed

Readable mobile document tables; aligned document cards, statistics, website features and Card owner rows; bounded website forms/article media; consistent admin gutters and compact mobile metrics; keyboard tooltips for familiar utility controls; compact chat citation actions with preserved excerpt focus and nested Escape behavior; specific UI copy with accurate demo/service boundaries. Existing public props, URLs, routing and application callbacks remain intact.

Implementation commits: `2d69f9c` website, `688d8ea` data/reporting, `8a2930c` admin, `be04b00` utility controls, `05cef61` catalog/copy, `fc80a25` chat. Full change/evidence/verification details are in [docs/design-pass-review.md](docs/design-pass-review.md). Before/after gallery: `.artifacts/design-pass/evidence.html`.

## Verification

Package/catalog and Next admin production builds, configured workspace TypeScript and full ESLint passed. All 47 unit tests and 294 Chromium browser journeys passed. The final localized tooltip-layer correction then passed all five affected rich-chat journeys, an independent four-path normal/reduced-motion RTL dismissal check, rebuilt packages/catalog, TypeScript, lint and independent packed Vite/Next consumers. All 116 copied examples/104 mappings passed. Copied website assemblies also passed independent Vite/Next checks.

Visual/state checks include all eight themes in light/dark, desktop/mobile, short viewports, long content, RTL, reduced motion, focus recovery, busy/error/retry, and overflow. The baseline includes 232 catalog captures; targeted family evidence and matrix scope are recorded in the review. No known failing check or unresolved review finding remains.

## Limits and resume

Chromium only; Safari/Firefox, physical touch/IME and screen-reader speech were not tested. Real provider services were not used. Older browsers without subgrid use natural-flow fallback alignment. Local ignored evidence stays in this attached worktree. These local commits are ready for review/integration; they were not merged into the original checkout.

```sh
cd /Users/nationalbank/.codex/worktrees/evenkit-design-pass/design-tokens
git status --short
git log --oneline 71f8aa6..HEAD
# Catalog preview, if stopped:
npm run preview --workspace @evenkit/catalog -- --port 5591 --strictPort
```

The retained catalog preview is `http://127.0.0.1:5591/`; assembled admin development preview is `http://127.0.0.1:5596/`. Other temporary verification servers are cleaned up. Earlier integrated handoff history follows for reference.

---

# Team administration design handoff: 26 October 2026

# Session handoff: 26 October 2026

# Session handoff: 26 October 2026

## Reporting design pass completed

## Website design pass: 26 October 2026

Status: DONE. Completed the requested visual design pass on P01–P06 and P10. Website heroes now have a larger display scale and a tighter reading measure. Feature grids, service rows, alternating sections, CTA panels, FAQ and footer have distinct spacing and hierarchy. Contact pairs its introduction with a bordered field panel; newsletter uses a separate neutral band. Articles have clearer metadata, a larger title, a contents rail and visibly labeled code regions. The examples include an original imagined fern illustration, a detail view and a studio mark using the existing Leaf icon. Demo content remains fictional.

Changed `registry/blocks/website/website.css`, `website-forms.css`, `website-article.css`, the corresponding composition markup, `examples.tsx` and `examples.css`. `apps/catalog/src/website-preview.css` improves the preview frame and controls. Updated `docs/website-blocks.md` and source provenance. The article spacing regression now measures the new code frame; code focus, accessible naming, direction and scrolling assertions remain intact. Public component APIs and submission behavior are preserved. No shared primitive or homepage changes.

Verification passed:

- Catalog production build, configured workspace TypeScript, full ESLint and `git diff --check`.
- All 93 copied catalog examples and 79 inventory mappings compile.
- All 22 website Chromium tests passed, covering eight themes in light/dark, mobile/intermediate/desktop widths, long text, RTL, headings, keyboard navigation, form recovery and reduced motion. Results: `.artifacts/website-blocks/design-browser-results/.last-run.json`.
- Independently packed Vite and Next consumers built and passed render, stylesheet, interaction, repeated-form, duplicate-submission and unmount-abort checks with no runtime errors. Report: `.artifacts/website-blocks/copied-consumption.json`; previous evidence is preserved in `before-design-consumption/`.
- Final read-only code review found no actionable issues. Visual review covered heroes, full copied website, article and desktop/mobile RTL forms. Captures are under `.artifacts/website-blocks/design-visual/`; composition captures are under `.artifacts/website-design-compositions/`.
- The final artwork detail crop was moved below the illustration labels to avoid a partial heading in the cropped image. Catalog build and focused ESLint passed again after that static SVG viewport change; the browser and consumer suites precede only this artwork crop.

No requested work remains. Browser automation used Chromium; Firefox, Safari, physical touch and live submission services were not tested. No publication, push or deployment. The local production preview was restarted at `http://127.0.0.1:5427/#website-heroes`; temporary viewport overrides were cleared and Neutral dark restored.

Resume with the commands below. If the preview has stopped, start it again from this worktree.

```sh
cd /Users/nationalbank/.codex/worktrees/website-blocks/design-tokens
git status --short
git log -3 --oneline
npm run preview --workspace @evenkit/catalog -- --host 127.0.0.1 --port 5427 --strictPort
```

## Website blocks: 25 October 2026

Status: DONE. Branch: `codex/reporting`. Worktree: `/Users/nationalbank/.codex/worktrees/reporting/design-tokens`. Design commit: `b87cdb2de08e06fa704e89091a5a4805b7b35a57` (`style(reporting): refine dashboard hierarchy and chart interactions`). This continues the implementation recorded below. Concurrent work and the original checkout were preserved; nothing was pushed, published or deployed.

### Design and APIs

- Statistics use larger tabular numerals, secondary units, aligned comparison/period footers, static loading placeholders and explicit error treatment. Dashboard statistics share a neutral summary band.
- Report fields form a compact wrapping strip with aligned actions and status. Narrow containers expand fields to the available width. Export preparation, progress, ready and error states have contained feedback and retain their focus behavior.
- Chart headers group context and legends. Plots have more vertical room, quieter grid lines, proportionate circle/square/diamond markers and a clear table disclosure. Full keyboard instructions remain accessible. The inspector overlays the plot without moving the page.
- Coverage and activity share a row on wide dashboards and stack in narrow containers. The catalog coverage table includes order counts and availability; sample export-state controls sit in a separate disclosure.
- Mixed-direction metric strings and chart period labels use bidi isolation. A browser regression measures the displayed order of `6 of 7` and `19–25` under RTL. Existing zero, missing-data, keyboard, focus-recovery and export-invalidation contracts remain covered.

Public APIs, dependencies, tokens and licenses are unchanged by this pass. See [component APIs and examples](docs/reporting.md). Changed sources are the statistic/reporting/chart modules and styles, `registry/blocks/dashboard.tsx`, the reporting preview and `tests/browser/reporting.spec.ts`.

### Verification

All final checks passed. Evidence is under `.artifacts/reporting-design/`:

| Check | Result |
| --- | --- |
| Production build, workspace typecheck and ESLint | Passed; `build.log`, `typecheck.log`, `lint.log`. |
| Unit tests | 33 tests in six files passed; `unit.log`. |
| Reporting/theme/token browser journeys | Ten passed, including marker proportions at 360/1440px and RTL text order; `browser.log`. |
| Six reporting catalog routes | Six passed across eight themes, both modes and four viewport widths (384 combinations); `catalog-matrix.log`. |
| Chart matrix | 192 theme/mode/direction/width combinations, reduced motion and visible focus; included in `browser.log`. |
| Copyable examples | All 92 examples and 78 inventory mappings passed; `examples.log`. |
| Packed consumers | Independent Vite and Next builds, HTTP/CSS checks, Next SSR and copied dashboard passed; `packages.log`, `.artifacts/package-verification.json`. Temporary consumers and servers were removed. |
| Visual review | 26 desktop/narrow/state/RTL captures; no runtime errors or overflow. Inspector activation moved the table disclosure by 0px at both widths; `visuals.json`, `interactions.json`. All referenced CSS tokens resolve; `css-token-audit.json`. Independent final source/visual review found no remaining actionable issue. |

`final-inputs.json` records the design commit and source hashes. Screenshots temporarily made the catalog header static to avoid occluding the component; production styles were not altered for capture.

### Preview and remaining work

No required work remains. The rebuilt local preview is available at `http://127.0.0.1:49234/#dashboard` (owned Vite process 30923). Other agents' servers were preserved. Existing chart scope limits still apply: six series, ordered categorical buckets, host-owned queries/definitions/exports. Chromium was tested; Safari, Firefox, physical touch devices and assistive-technology applications were not tested.

Resume with:

```sh
cd /Users/nationalbank/.codex/worktrees/reporting/design-tokens
git status --short
git log -5 --oneline
npm run preview --workspace @evenkit/catalog -- --port 49234 --strictPort
```

Run the preview command only if the existing server has stopped. The verification commands from the implementation handoff below still apply; use `.artifacts/reporting-design/` for the latest evidence.

## Previous implementation handoff: 25 October 2026

Status: DONE. Branch `codex/team-admin`, isolated checkout `/Users/nationalbank/.codex/worktrees/team-admin/design-tokens`. Design commit `5c26a1f96fb5be8a9e308ba8634a2b77efd03dd9` (`style(team-admin): refine administration layouts and visual hierarchy`) follows the implementation and documentation commits recorded below.

## Completed design pass

The four administration screens now have stronger headings, restrained neutral panels and clearer action areas. Members use a unified search/filter toolbar, decorative avatars, wrapping role labels and a distinct invitations section. The acceptance page uses one focused card with aligned account details. Capability rows show selected and locked states, with a footer summarizing draft changes. Audit events use framed rows, aligned desktop timestamps, expandable detail panels and visible time-zone metadata.

Editable blocks remove duplicate invitation/audit headers, move the role selector beside its page heading, and use the full width for a members-only page. Real multi-section consumers retain SettingsLayout. Catalog response controls are grouped separately below each example. Public signatures, authorization boundaries, async guards and focus behavior remain intact. No dependencies were added.

Changed files: `packages/ui/src/{team-members,invitation-acceptance,role-capability-editor,audit-viewer}.{tsx,css}`, the four matching `registry/blocks` files, `apps/catalog/src/team-admin-preview.{tsx,css}` and `docs/team-administration.md`. Shared primitives, token definitions and authentication pages were not modified.

## Verification and evidence

UI/catalog production builds, configured workspace TypeScript, full ESLint, all 90 copied examples and all 76 inventory mappings passed. All 17 relevant Chromium tests passed: eight host-boundary tests, five catalog journeys and four theme/viewport contracts. Coverage includes eight themes, light/dark, 360/768/1024/1440px, RTL/system modes, keyboard/focus recovery, denial, cancellation and stale context. Independent source review found no actionable issue; all CSS variables resolve to kit tokens and `git diff --check` passes. Existing unit and packed-consumer verification from the implementation is recorded below; it was not repeated for this presentation pass.

Visual review covered all four screens on desktop and role/audit layouts in narrow RTL. Final audit screenshot: `.artifacts/team-admin-design/audit-desktop.png`. Earlier implementation screenshots remain in `.artifacts/team-admin/`. Firefox, Safari, physical touch and screen-reader speech were not exercised.

## Remaining work and resume

No required work remains for the design request. Final authentication integration stays with the integration agent. No push, production services, publishing or deployment occurred. The rebuilt preview is running at `http://127.0.0.1:5399/#audit-viewer` (other routes remain `/#team-members`, `/#invitation-acceptance`, `/#role-capability-editor`).

```sh
cd /Users/nationalbank/.codex/worktrees/team-admin/design-tokens
git status --short
git log -4 --oneline
# Restart only if the preview is stopped:
npm run preview --workspace @evenkit/catalog -- --port 5399 --strictPort
```

Earlier implementation and branch history is retained below.

---

# Team administration handoff: 25 October 2026

Status: DONE. Branch `codex/team-admin`, isolated checkout `/Users/nationalbank/.codex/worktrees/team-admin/design-tokens`. Base `b588b1b1964ba2b26ee8453606f354f2c33eb10d` from the latest local `codex/component-improvements` after fetching origin. Implementation commit `3f591ea6fa13ffba7898c151caf3f158d2dc0774`.

## Completed

M07 members and invitations, L04 invitation acceptance, M08 application-defined role/capability editing, and O09 read-only audit viewing/export. Each has reusable package modules/styles, an editable block and a catalog entry with fictional local scenarios. Applications own authentication, authorization, policy, mutations, delivery and storage. No fixed roles or permission engine were added.

Host outcomes include success, denial, failure/retry and stale state. Cancellation and context/revision changes ignore late responses. Role drafts retain unknown and locked grants. Audit results are display records; export is a host callback over all matching criteria. Member queries are remote; the controlled invitations collection is searched locally and must be complete for its authorized scope.

## Files and contracts

See `docs/team-administration.md` for APIs, ownership, verification and integration notes. New UI modules are `team-members`, `invitation-acceptance`, `role-capability-editor`, `audit-viewer`, `team-admin-types` and internal `use-team-action`. Editable blocks are in `registry/blocks`; catalog entries, previews and demo data use the `team-admin-` prefix. Public export, CSS bundling and catalog wiring changes are additive. Dependency manifests and lockfile are unchanged; provenance records the reused dependencies/licenses.

## Verification

Production build, configured TypeScript, ESLint, 23 unit tests, all 90 copied examples, and independent packed Vite/Next.js consumers passed. Eight host-boundary tests, five catalog journeys and four theme/viewport contract tests passed (17 distinct Chromium tests). Coverage includes all eight themes, light/dark/system, RTL, narrow layouts, long labels, keyboard/focus recovery, cancellation, stale records and audit exports. After visual review, team tables received a token-based minimum width; the three affected layout/journey checks and an RTL offscreen-action keyboard check passed again.

Evidence: `.artifacts/team-admin/`, `.artifacts/catalog-examples.json`, `.artifacts/package-verification.json`. Eight reviewed component screenshots include desktop Ocean dark and 360px Grove light/RTL. Temporary package-consumer servers/directories were cleaned. Browser automation used Chromium; Firefox, Safari, physical touch and screen-reader speech were not exercised.

## Integration and remaining work

No required work remains within this task. Final authentication integration is assigned to the integration agent; `codex/auth-pages` was not touched. Merge the small export/style/catalog/verifier additions alongside other agents' work and recompute inventory totals. The implementation commit is self-contained; this handoff commit changes documentation only. No production services, migrations, publishing, deployment or push occurred.

The local preview is running at `http://127.0.0.1:5399/#team-members`. Other new routes are `/#invitation-acceptance`, `/#role-capability-editor` and `/#audit-viewer`.

```sh
cd /Users/nationalbank/.codex/worktrees/team-admin/design-tokens
git status --short
git log -3 --oneline
# Restart only if the local preview is stopped:
npm run preview --workspace @evenkit/catalog -- --port 5399 --strictPort
```

Earlier branch handoff history is retained below.

---

# Session handoff: 25 October 2026

Current worktree: `/Users/nationalbank/.codex/worktrees/document-library/design-tokens`.
Branch: `codex/document-library`. Base: `b588b1b` from `codex/component-improvements`.

# Session handoff: 26 October 2026

## Latest session: rich chat design pass

**DONE** on `codex/rich-chat` in `/Users/nationalbank/.codex/worktrees/rich-chat/design-tokens`. Commit `05d0ce0` refines Markdown rhythm, code headers and copy feedback, citation rows/previews, message files, the unified upload/composer surface and catalog presentation. All checks passed: production build, configured typecheck, full ESLint, 32 unit tests, nine focused Chromium journeys, the extended short-window layout journey, 87 copied examples and packed Next/Vite consumers. The layout journey includes 128 theme/mode/direction/width combinations and a 360×320 widget with failed files and a multiline draft.

The [design pass record](./docs/rich-chat-design-pass.md) contains decisions, evidence and remaining verification limits. Final screenshots are in `.artifacts/rich-chat-design/`; logs are `.artifacts/rich-chat/design-*.log`. Firefox/Safari, physical devices and assistive technology were not tested. No implementation work remains. No publishing or deployment occurred. The rebuilt preview is available at `http://127.0.0.1:5388/#rich-chat`; restart it with `npm run preview --workspace @evenkit/catalog -- --port 5388 --strictPort` if needed. Resume with `git status --short` and `git log -5 --oneline` in this worktree. Earlier session notes are preserved below.

## Rich chat implementation: 25 October 2026

## Document library design: 26 October 2026

Completed the requested design pass in `a906e7b`. The library has a contained
folder header, grouped toolbar, aligned controls and compact file rows. Grid
cards use passive 4:3 previews, readable fallbacks and separate selection
targets. File previews have bounded canvases and aligned actions; avatar editing
has a bounded settings panel and connected status/save footer. Neutral palette
checkerboards reveal transparency without modifying image pixels.

Changed only the owned media-preview/document-library modules, avatar styles,
editable blocks, corresponding catalog files, API/provenance docs and two focused
browser journeys. Async storage/transfer contracts remain with applications.
Independent review findings were resolved, including focus when an asynchronous
preview replaces focused status content. Existing concurrent work is preserved.

Production builds, workspace type/lint checks, 25 unit tests, 89 copied examples,
75 mappings, packed Vite/Next consumers and ten component browser journeys passed.
Appearance verification passed 281 matrix checks plus five focused mobile checks.
The last CSS adjustment was separately checked at all four widths in both modes
and all themes; LTR/RTL sort labels stay on one line and failed avatar decoding
keeps its fallback readable. Evidence: `.artifacts/document-library-design/`.

No requested implementation or design work remains. Safari, Firefox and physical
mobile keyboards were not tested. No push, publication or deployment occurred.
The preview server was restarted at `http://127.0.0.1:5497/#document-library`.
See [the integration handoff](docs/document-library-handoff.md) for source hashes,
verification details and merge notes. Resume from this worktree with
`git status --short` and `git log --oneline b588b1b..codex/document-library`.

## Document library: 25 October 2026

Completed J05, J06 and J07 with maintained media-preview/document-library modules,
editable avatar-upload/document-library blocks, catalog examples and focused
tests. Implementation commit: `27eb10e`; catalog/docs: `a5cb9f1`; sample asset
metadata: `6ce6eed`. The original checkout and concurrent worktrees are preserved.

Build, TypeScript, ESLint, 25 unit tests, 89 copied examples/75 mappings and packed
Vite/Next checks passed. Ten new Chromium journeys and eleven existing regressions
passed. A 281-check appearance/layout pass covered all themes/modes, four widths,
RTL, list/grid and reduced-motion portals. Independent review findings are resolved.
No J05–J07 implementation work remains; Safari, Firefox, physical mobile keyboards
and production storage were not tested. No push, publication or deployment occurred.

See [the integration handoff](docs/document-library-handoff.md) for contracts,
shared-file merge notes, evidence and resume commands; the [API guide](docs/document-library.md)
documents application ownership and copyable usage. Evidence is in
`.artifacts/document-library/`. Local preview: `http://127.0.0.1:5497/#document-library`.
Resume with `git status --short` and `git log --oneline b588b1b..codex/document-library`
from the current worktree. Previous integration history follows.

## Notification design pass: 25 October 2026

On `codex/notifications` in `/Users/nationalbank/.codex/worktrees/notifications/design-tokens`, refined the inbox hierarchy and selection states, preference channel/policy layout, responsive persistent banners, and workspace/team catalog examples. Added an optional decorative banner icon. Async and focus contracts remain intact. The [integration handoff](docs/notifications-handoff.md#design-pass-25-october-2026) records changes, integration scope, screenshots and verification.

Build, configured typecheck, full lint, 23 unit tests, all 14 focused Chromium cases in one run, 91 copied examples/77 mappings, and packed Vite/Next checks passed. Visual review includes Ocean light desktop/mobile, selected and empty inboxes, Linen dark preferences, and Rose dark RTL mobile feedback. Manual screen-reader listening, Safari/Firefox and physical devices remain unverified. No required work remains; nothing was pushed, published or deployed. Local preview: `http://127.0.0.1:59475/#notification-center`.

Resume with `git status --short` and `git log -3 --oneline` in the worktree above. Preserve both this follow-up and the original feature when integrating. Earlier handoff history follows.

## Notification family: 25 October 2026

Current isolated worktree: `/Users/nationalbank/.codex/worktrees/notifications/design-tokens`, branch `codex/notifications`, feature commit `b3ca9c7`. The [notification integration handoff](docs/notifications-handoff.md) records O08/M06/H10/G03/G06, contracts, shared integration points and verification evidence. Build/type/lint, 23 unit tests, 91 copyable examples, 77 inventory mappings, 13 Chromium behavior cases plus the theme/layout matrix, and independent packed Next/Vite consumers passed. No push, publication or deployment occurred.

The earlier base-branch session history below is preserved for context.

Project: `/Users/nationalbank/GitHub/design-tokens`. Branch: `codex/component-improvements`.

## Component accent details: 25 October 2026

Implemented the five accent additions approved after the component audit. Applied filter chips use accent text and soft fills, and enabled upload icon tiles use the same pairing. Sorted table columns have an accent arrow. The homepage's three collection icons use the theme accent. Command results gain an accented leading icon on hover or keyboard focus, with a soft row fill on keyboard focus. Error and disabled states retain their semantic or neutral styling. Large surfaces, utility icons, APIs and layout remain unchanged. The optional first-use empty-state treatment was not included in this five-part pass.

Changed `packages/ui/src/data-workflows.css`, `data-table.css`, `command-palette.css` and `apps/catalog/src/homepage.css`. Production build passed, including package TypeScript compilation. All nine targeted Chromium journeys passed across homepage, tables, command search, applied filters and uploads. Nine token tests passed, covering required contrast pairs across all eight themes in both modes. A temporary Chromium fixture passed 44 upload/filter style checks in Ocean light and dark. Independent review found no actionable issues. No permanent tests were added for these CSS changes.

Visual review covered all five additions in Grove, including light/dark upload and command views. The user's light appearance was restored after checking dark mode. Captures and verification logs are in `.artifacts/component-accents/`. Firefox, Safari and physical touch were not tested. The local preview at `http://127.0.0.1:5390/` is rebuilt; production was not deployed. No required work remains. Resume with `git status --short` and `git log -3 --oneline`.

## Theme colour on selected states: 25 October 2026

Rebalanced themes after the user found the first pass too muted. Selected sidebar rows now use a tinted background with accent labels and icons. The same treatment covers selected settings/workspace navigation, pill tabs, radio rows, toggles, segmented choices and current dropdown/mobile destinations. Horizontal active links keep their underline and gain accent text; the current pagination page has an accent fill. Selected neutral tags use the theme accent, while semantic tag tones retain their meaning. Selected colours persist on hover. Large surfaces, body text and structural borders remain neutral.

Strengthened `accent-soft` across the eight themes; Grove light uses `#E0F2E6`. All existing text contrast checks pass, with a minimum of 4.89:1. Runtime changes are in `packages/tokens/src/themes.ts` and the UI stylesheets `admin-shell.css`, `foundations.css`, `navigation.css`, `selection-controls.css` and `workspace-settings.css`. Three component guides describe the selected-state treatment. APIs, layout and interaction behaviour are unchanged.

Verification passed: production build, configured workspace TypeScript, ESLint and nine token tests. The browser run passed 39 of 40 journeys; the remaining switch journey froze the clock before its lazy preview loaded. Added a visibility wait before pausing the clock, preserving every timing and behaviour assertion; all eight selection journeys then passed. The other 32 passing journeys cover themes, sidebar, foundations, navigation, navbar and settings. A temporary Chromium fixture passed 61 selected/hover/focus style assertions. Visual review covered Grove light and Ocean dark sidebar, tabs and selections, with before/after captures in `.artifacts/theme-selection/`. Independent reviews approved the styling and test readiness fix. Firefox, Safari and physical touch were not tested.

The local preview at `http://127.0.0.1:5390/` is rebuilt. The user's tab was refreshed; its Grove light preference was restored after checking a separate temporary tab. No required work remains; this change has not been deployed. Resume with `git status --short` and `git log -3 --oneline`.

## Subtle theme accents: 25 October 2026

Completed the goal to keep themes from recolouring the whole site. All eight built-in themes share neutral page backgrounds, surfaces, text and borders within each appearance mode. Theme colours apply to actions, focus rings and softer hover/selection highlights. Existing accent identities, semantic status colours, custom-brand support and Linen's serif headings remain. The gallery compares Canvas, Accent, Hover, Highlight and Focus swatches; homepage and package guidance describe the new behaviour.

Changed `packages/tokens/src/themes.ts`, its existing token tests, `apps/catalog/src/theme-preview.tsx`, the homepage theme description, both READMEs and `tests/browser/themes.spec.ts`. Concurrent homepage copy and heading commits were preserved. Token coverage now guards shared neutral colours; the existing browser journey checks neutral surfaces and changing accents, including dialog portals.

Verification passed: production builds, configured workspace TypeScript, full ESLint, nine token tests and all 16 Chromium journeys across themes, homepage, token reference, catalog and settings. A separate 64-case browser check covered all eight themes in both modes on homepage/catalog at 360/1440px, with no overflow or runtime errors. Before/after screenshots confirm the restrained colouring. Independent review found no actionable issues; every contrast check passes, with the lowest text contrast at 4.87:1 against a 4.5:1 requirement. Evidence: `.artifacts/subtle-themes/`. Firefox, Safari and physical touch were not tested.

No required implementation work remains. The rebuilt local preview is `http://127.0.0.1:5390/#themes`; production has not been deployed for this change. Resume with `git status --short` and `git log -3 --oneline`. If needed, restart the preview with `npm run preview --workspace @evenkit/catalog -- --port 5390 --strictPort`.

## Theme heading wording: 25 October 2026

Changed the homepage heading to the user's exact wording, "Multiple color themes". Catalog build, TypeScript and focused ESLint passed; the rebuilt preview includes the new text. Concurrent palette changes were preserved and excluded from this wording commit. No remaining work for this request.

## Homepage copy cleanup: 25 October 2026

Applied the requested `avoid-ai-writing` pass to homepage text. The hero now reads "React components and design tokens." Replaced vague theme, library, setup and footer wording, shortened the introduction, and made the demo instructions and checklist labels specific. Only ten selected copy spans in `apps/catalog/src/homepage.tsx` changed; component behavior, links, IDs and styling are preserved.

One editing pass completed, with no further justified copy changes found on review. The skill's quote normalizer and detector ran on changed prose; the detector reported no findings. An exact reverse comparison confirmed no source edits outside the selected spans. Catalog build, TypeScript and focused ESLint passed. Chromium checks and screenshots at 1440/360px confirmed the new heading, working checklist, no horizontal overflow and no runtime errors. Evidence: `.artifacts/homepage/copy-desktop.png`, `copy-mobile.png` and `copy-build.log`. No new tests were added for copy changes.

The rebuilt preview is at `http://127.0.0.1:5390/`; refresh an already-open tab to see it. No remaining work for this copy request. Changes are local and have not been deployed. Resume with `git status --short` and `git log -2 --oneline`.

## Homepage and default landing page: 25 October 2026

Completed the homepage goal. The root URL now opens a dedicated Evenkit homepage with an interactive project form and checklist, eight theme choices, links into the component library, and copyable starter code. Existing component URLs such as `/#buttons`, `/#themes` and `/#tokens` still open the catalog. Catalog branding returns to `/`; theme, appearance and sidebar preferences retain their existing storage keys. The homepage accurately describes the packages as unpublished pilots.

Key files: `apps/catalog/src/homepage.tsx`, `homepage.css`, `app.tsx`, `use-catalog-preferences.ts`, `catalog.tsx`, `main.tsx`, `apps/catalog/index.html`, `README.md`, and the homepage/catalog/sidebar browser tests. The catalog loads on entry through a lazy boundary; homepage section anchors use `#home-*` to keep them separate from component routes.

Verification passed: production package/catalog builds, configured workspace TypeScript, full ESLint, and all 19 Chromium journeys across homepage, catalog, catalog-sidebar, themes and sidebar-tooltip. Additional production-preview checks covered form validation/submission, visibility selection, checklist state, copied clipboard text, overflow at 360/768/1024/1440px, action text across all eight palettes and dark Ocean, 44px brand links, skip-link focus, and runtime errors. Independent review found no remaining actionable issue. Corrected the CopyAction prop and homepage anchor specificity during verification. Evidence is under `.artifacts/homepage/`. Firefox, Safari and physical touch were not tested.

Local preview: `http://127.0.0.1:5390/`. The homepage has not been pushed or deployed to production. No required implementation work remains. Resume with `git status --short` and `git log -2 --oneline`. If the preview stops, run `npm run preview --workspace @evenkit/catalog -- --port 5390 --strictPort`. Deployment remains a separate action using `vercel deploy --prod --scope blockconsult`; the current production deployment is recorded below.

## Private repository and production deployment: 25 October 2026

Committed all remaining navigation and catalog design changes as `f2eff93` and `20d89eb`. Created the private GitHub repository `https://github.com/salexandr0s/evenkit`, added it as `origin`, and pushed all three local branches with upstream tracking. The default branch is `codex/component-improvements`; `main` and `codex/auth-pages` retain their existing histories. The concurrent sidebar fix `d8dfd23` is also pushed.

Production is live at `https://evenkit.dev` and `https://www.evenkit.dev`. Deployment `dpl_BpM2DTiz5MM2MH3UETMKDEEuX6Uw` is READY at `https://evenkit-6ol25r9wc-blockconsult.vercel.app`, built from clean source commit `d8dfd238036a514b7904af0f3220699c5be240ed`. It uses the existing Block Consult GmbH project `evenkit`, ID `prj_5K4UrqWVGwIWPIxGYAe8OkwfpxBW`. The Vercel connector lacks access to this team; the authorized local CLI session deployed successfully with explicit scope `blockconsult`.

Reused the applicable build, type, lint, unit, browser and packed-consumer verification recorded below. Vercel completed a fresh production build. Live Chromium checks confirmed the 86-entry catalog, calendar month navigation and remote table at 1440/360px without runtime errors or horizontal overflow. A final production check confirmed the sidebar handle stays at y=468 after scrolling 300px in a 1000px-high viewport. Evidence is in `.artifacts/repository-publish/`. This handoff-only commit is excluded from deployment by `.vercelignore`.

No requested work remains. Resume with `git status --short`, `git remote -v` and `git log -4 --oneline`. Deploy future changes from this checkout with `vercel deploy --prod --scope blockconsult`; automatic Git deployment was not configured. The package artifacts remain unpublished.

## Sidebar resize handle: 25 October 2026

Fixed the resize handle moving upward with the main content. In `packages/ui/src/admin-shell.css`, its sticky top offset now matches its initial position at the sidebar midpoint. Before the fix, scrolling 300px moved the handle from y=448 to y=148 while the sidebar remained at y=0. After the fix, the handle stays at y=448 throughout the 960px-high page, including at the bottom. Confidence in the localized CSS fix is high.

Verification passed: `npm run build`, all 10 existing Chromium tests in `catalog-sidebar.spec.ts` and `sidebar-tooltip.spec.ts`, and direct scroll geometry checks for expanded, collapsed and hidden states plus a viewport resize to 1024x700. The build retains its existing chunk-size advisory. No new tests were added for this CSS adjustment; Firefox and Safari were not tested. No required work remains. The local preview at `http://127.0.0.1:5390/#stack` includes the fix; production was not deployed. Resume with `git log -1 --oneline` and `git status --short`.

## Calendar design refinement: 25 October 2026

Completed the requested Calendar design pass. The month title now leads paired navigation arrows; selected days use filled circles, today uses an outline and dot, and range bands join endpoint centers in either direction. Shorter keyboard guidance aligns with Today. Forced-color mode uses system highlight colors for selection and hover. The standalone catalog example has one framed calendar with a localized selected-date summary and a matching-width language field below it. Existing props, date constraints, keyboard behavior and form contracts are preserved.

Changed `packages/ui/src/date-calendar.tsx`, `date-controls.css`, `apps/catalog/src/dates-preview.tsx`, `dates-preview.css` and `docs/dates.md`. Verification passed: production builds, configured TypeScript, focused ESLint and all four existing date Chromium journeys. Thirty-two theme/mode/width combinations passed selected/hover contrast, focus, target-size and overflow checks. Before/after captures cover Calendar, DatePicker and DateRangePicker in light/dark at 360/1440px. Independent review confirmed 44×44 touch targets, RTL arrows and multi-row range continuity. Forced-color selection/hover and scroll access to presets passed at 360×700px. Firefox/Safari and physical touch were not tested.

No required work remains. Evidence and the isolated patch are under `.artifacts/calendar-design/`. Preview: `http://127.0.0.1:5390/#calendar`; the existing preview server remains running. This pass is committed separately from the earlier application-component work. Pre-existing Navbar, Hallmark and other design edits remain untouched. Resume with `git log -1 --oneline`, `git status --short` and `cat docs/dates.md`.

## Application components and design pass: 25 October 2026

Completed the requested nine groups covering 24 inventory additions: dates/time/formatting, MultiSelect/token input, locale numbers and unit recipes, remote tables and controls, record details/activity, workspace/settings/profile/appearance, upload queues/images, command search, and steps/onboarding. Public APIs and source blocks are in commit `907a53c`; catalog integration, browser coverage and completion records follow in a separate commit. Earlier Navbar, Hallmark and design edits remain in the working tree and were excluded through selective patches. No production deployment or package publication was performed for this work.

The catalog now has 86 examples and exactly 72 inventory mappings. `apps/catalog/src/roadmap-entries.ts` and `roadmap-preview.tsx` integrate six feature families. New maintained controls are exported from `packages/ui/src/index.ts`; `registry/blocks/record-detail.tsx`, `account-settings.tsx` and `onboarding-wizard.tsx` are copyable application blocks. API guides are `docs/dates.md`, `value-fields.md`, `remote-tables.md`, `records-settings.md`, `uploads.md` and `commands-wizard.md`. The completed plan and design evidence are in `docs/component-roadmap-plan.md` and `component-roadmap-design.md`.

Date-only and local-time strings remain distinct from timezone-bearing instants. Numeric drafts preserve invalid/partial input and submit canonical values. Applications own API transports, routing, authorization, storage scope and mutations. Async controls cancel requests and reject stale completions. Remote tables expose query/total/selection scope; source blocks preserve drafts and focus. Appearance settings include supported locales and density. Document themes use root attributes; nested samples apply explicit `cssVariables` and resolved system mode.

The design pass improved selected-calendar contrast, bounded form width, mobile step density and action wrapping, upload empty states and stable command-search positioning. Reviewed all 24 additions at 360/1440px in light Neutral and dark Ocean; 96 captures and follow-up appearance/MultiSelect captures found no page overflow or runtime errors. The final appearance journey asserts actual computed theme colors.

Verification passed: production builds, configured TypeScript and ESLint, 22 unit tests, all 86 copied examples/72 mappings, independent packed Vite/Next production builds and SSR/HTTP/stylesheet checks. The full Chromium run passed 183 of 184 journeys; its required-number-field failure was fixed and all ten affected value/account journeys passed after rebuilding. The final catalog color refinement passed the extended settings journey. No known test failure remains. Firefox, Safari, physical touch and a complete RTL visual matrix were not tested. Vite retains its initial-chunk size advisory.

No required implementation remains. Evidence is under `.artifacts/component-roadmap/`, including `*-complete.log`, `unit-final.log`, `browser-final.log`, screenshots and selective patches. The local preview is `http://127.0.0.1:5390/#calendar` (owned session 77066). Resume with `git log -2 --oneline`, `git status --short` and `cat docs/component-roadmap-design.md`. If the preview has stopped, run `npm run preview --workspace @evenkit/catalog -- --port 5390 --strictPort`.

## Evenkit rename and production launch: 25 October 2026

Renamed the kit and workspace packages to Evenkit / `@evenkit/*`, updated examples and documentation, and created an original transparent logo from scratch. The catalog uses the logo silhouette with the active theme foreground and supplies it as the favicon. Existing `pk-` CSS and `data-kit-*` contracts remain stable; catalog preferences migrate from the former storage keys.

Production is live at https://evenkit.dev, with https://www.evenkit.dev also verified in a browser. Vercel project `evenkit` belongs to Block Consult GmbH (`blockconsult`), ID `prj_5K4UrqWVGwIWPIxGYAe8OkwfpxBW`. Deployment `dpl_DHELtJHtgpfQQX3WN19QoNm2Beei` is READY. Cloudflare retains DNS with DNS-only CNAME records for `@` and `www` pointing to `af34aa774455dc22.vercel-dns-016.com`; Vercel reports both domains configured correctly. The connector uses a different account; deployment used the user's confirmed local CLI account/team.

Verification passed on the deployed working tree: production build, configured TypeScript and ESLint, eight token tests, all 135 Chromium journeys, 62 copied examples/all 48 mappings, and independent packed Vite/Next.js builds and HTTP/CSS checks. Live browser checks confirmed branding, search and light/dark switching. Screenshot: `.artifacts/evenkit/live-evenkit.png`. Branding/deployment changes form a focused commit separate from the pre-existing design/Navbar work; working files were preserved. An isolated copy of the staged source also passed build, TypeScript and ESLint. No Git remote is configured. The library packages remain unpublished.

Key files: `vercel.json`, `.vercelignore`, root/workspace package manifests and lockfile, `apps/catalog/index.html`, `apps/catalog/src/catalog.tsx`, `apps/catalog/src/catalog.css`, and `apps/catalog/public/evenkit-logo.png`. Redeploy from the repository root with `vercel deploy --prod --scope blockconsult`. Inspect with `vercel project inspect evenkit --scope blockconsult` and `vercel domains verify evenkit.dev --scope blockconsult`. Existing pending component edits remain separate and are preserved below.

## Design commit series: 25 October 2026

Committed this chat's completed 48-item design pass and popup-footer follow-up in four logical units: foundations/forms, navigation, overlays/data workflows, and popup actions. Separate Navbar implementation/design, Hallmark, field-error and other pre-existing edits remain in the working tree. Shared navigation, catalog CSS, global CSS and handoff contents were staged selectively; no work-tree source files were replaced. The commits were not pushed.

An isolated copy of the exact runtime commit contents passed production build, configured TypeScript, full ESLint, eight token tests, all 130 included Chromium journeys, 62 copied examples/exactly 48 mappings and independent packed Next/Vite builds with SSR/HTTP/CSS/copied-block checks. The excluded Navbar work has five additional journeys; its absence explains the 130-test count versus the earlier combined 135-test run. Evidence: `.artifacts/design-commits/isolated-*.log`, `manifest.json`, planned patches and the saved preservation hashes. No additional implementation work was performed for packaging. Resume with `git log -4 --oneline` and `git status --short`; remaining edits belong to other work.

## Menu bar refinement: 25 October 2026

Completed the requested additional design pass. Compact headers retain Contact when their container is at least 640px and the brand, actions, account, Contact and menu control fit. Phones and longer content keep Contact in the drawer. Focus remains on a visible Contact control when navigation collapses and moves to the menu only when its control becomes hidden. Account controls now keep an accent border and muted surface while open; grouped mobile links have a logical inset and leading border. Navbar dropdowns use a 24px token offset to clear the header divider. Existing design tokens and public APIs are preserved.

Runtime edits are limited to `packages/ui/src/navigation.tsx`, `navigation.css` and `navbar-parts.tsx`. Updated `docs/navigation.md` and extended the existing resize journey in `tests/browser/navbar-header.spec.ts`. The extended journey failed against the baseline at the missing tablet Contact action and passes after this change.

Verification passed: production build, configured TypeScript and ESLint, all 11 navigation/header Chromium journeys, and independent packed Vite/Next.js builds with HTTP/stylesheet smoke checks. Visual geometry checks covered both website and application headers at 360/768/1440px across all eight themes and both modes (48 combinations). No header overlap, page overflow or runtime errors were found. Desktop group/account menus clear the divider by 9px; long action and brand labels hide Contact when needed, and hiding a focused action recovers to the menu. Before/after desktop, tablet, phone, drawer and light/dark account-menu captures were inspected. Firefox/Safari and physical touch were not tested.

Evidence, source hashes and the isolated five-file patch are in `.artifacts/navbar-refinement/`. Preview: `http://127.0.0.1:5311/#navbar`. No required implementation work remains. Changes remain uncommitted alongside earlier navigation and concurrent component work. The existing preview server and concurrent popup-footer handoff were preserved. Resume with `git status --short`, `cat docs/navigation.md` and `.artifacts/navbar-refinement/owned-changes.patch`.

## Popup footer refinement: 25 October 2026

Refined the popup button area requested in the attached edit-project screenshot. Dialog, AlertDialog and Sheet now share a same-surface footer with a content-width hairline, 16px top padding and 8px action gaps. Removed the full-bleed dark band and negative margins; the existing 24/20px outer gutters, motion and scrolling remain. In RecordWorkflow, Reset changes is a small explicit non-submit button after Notes. The footer pairs persistent status with Cancel/Save on desktop, expands errors across the row, and puts an equal-width/equal-height action pair below status on mobile. Long desktop labels move to another row before compressing status.

Runtime changes are limited to `packages/ui/src/styles.css`, `packages/ui/src/data-workflows.css` and `registry/blocks/record-workflow.tsx`. Updated README, overlay and data-workflow contracts. Native form ID/submission, callbacks, draft/request cancellation, pending focus and the single SaveStatus node are preserved. Existing and concurrent changes remain intact; this refinement is included in the local design commit series.

Verification passed: production builds, configured TypeScript, full ESLint, seven existing dialog/confirmation/sheet/workflow Chromium journeys, and two affected record reruns after the wrapping fix. Twelve default popup captures cover Ocean dark/Neutral light desktop and dark mobile; three final editor views and active-state captures cover pending, failure/retry, cancellation, discard, short 360×600 windows, eight themes/both modes and long LTR/RTL labels. Runtime reports have no errors or overflow. Review caught and fixed a zero-width desktop status under very long actions and unequal mobile button heights. The final stress case retains a 510px-wide status on desktop and equal 123px-high mobile buttons. Firefox/Safari and physical touch were not tested; no permanent tests were added for the styling change.

Evidence is in `.artifacts/popup-footers/`: `source-changes.patch` isolates the three runtime-file edits from their starting state; `before/`, `after/`, `final/`, `runtime-final/` and `alignment-final/` contain comparisons and reports; logs record the exact checks. Independent review is in `review.md`. The owned temporary preview on 5313 is confirmed closed; other previews were preserved. No required implementation work remains. Resume with `git status --short` and that patch before committing overlapping files.

## Menu bar design pass: 25 October 2026

Completed the design improvement goal. The Navbar now uses a 72px desktop / 64px compact minimum row height, aligned 44px navigation and action controls, consistent 32px brand logos, and a single active-route underline for links and groups. Menus have more padding, stronger account-name hierarchy, and one account/avatar boundary. The mobile drawer has a grouped heading, independently scrolling links and a bottom Contact footer; opening it focuses the active enabled destination or first enabled link. All dimensions and colors use existing tokens; public APIs and host-owned routing/account/contact behavior remain compatible.

Changed `packages/ui/src/navigation.css` and `navigation.tsx`, `apps/catalog/src/navbar-preview.tsx` and `navigation-preview.css`, `docs/navigation.md`, and the existing mobile journey in `tests/browser/navbar-header.spec.ts`. Catalog controls now stay with the compact specimen and include derived default/selected-group/signed-in/unavailable presets. Reduced example-body spacing keeps the header visible. Other component families and the earlier uncommitted work were preserved.

Verification passed: production build, configured TypeScript and ESLint, all 11 navigation/header Chromium journeys, independent packed Next.js and Vite builds with SSR/HTTP/CSS checks, 64 theme/mode/width combinations for both website and app headers, and 32 themed dropdown/account-menu combinations. Checks found no overlap, page overflow, clipping, runtime errors or contrast failures in the checked pairs. Verified preview presets, disabled-link keyboard skipping, long brand/localized labels at 360/768/1024/1440/1920px, reduced motion, and mobile autofocus plus last-link/Contact reachability at 360×420px. Independent source and before/after visual review accepted the pass with no remaining finding. Firefox/Safari and physical touch were not tested.

Before/after captures, verification logs, JSON results and the design-pass patch are in `.artifacts/navbar-design/`. The existing preview remains at `http://127.0.0.1:5311/#navbar`. No required design work remains. The work remains uncommitted alongside the previous navigation implementation and overlapping design changes. Resume with `git status --short`, `cat docs/navigation.md`, and `.artifacts/navbar-design/owned-changes.patch`.

## Complete top navigation: 25 October 2026

Extended the public Navbar without replacing its existing flat-link API. Added NavbarBrand, one-level link groups, named login/account controls, host-owned signed-in menus, and a Contact action. Desktop layout follows the supplied header reference using existing tokens. The header collapses below md or when its contents need more space; the account control stays visible and Contact moves into the mobile drawer. Hidden measurement content is inert. Resize, menu dismissal, host dialog handoff and account replacement preserve usable focus. Native link callbacks run before navigation, while callback-only popup actions run after dismissal.

Core changes are in `packages/ui/src/navigation.tsx`, `navigation.css` and new `navbar-parts.tsx`. New `apps/catalog/src/navbar-preview.tsx` contains working website and application/sidebar specimens; the navigation preview, styles, copied usage and `docs/navigation.md` document integration. Existing navigation regression specimens remain available. `tests/browser/navbar-header.spec.ts` adds five interaction journeys. The packed consumer fixture and package verifier now exercise the complete header.

Final verification passed: production build, configured TypeScript and ESLint, all 11 navigation/header Chromium journeys, packed Next.js and Vite builds with SSR/HTTP/CSS checks, and 64 visual/geometry combinations across eight themes, both modes and 360/768/1024/1440px. The initial integration run also passed all 10 sidebar/tooltip journeys. All 62 copied examples compiled, and eight token tests passed. Additional runtime checks confirm visible keyboard focus, reduced motion, long brand/localized labels at five widths, and no horizontal overflow or runtime errors. Independent source review accepted the implementation; desktop, mobile, dropdown, drawer and application captures were inspected. Firefox/Safari and physical touch were not tested.

Evidence and the goal-only patch are in `.artifacts/navbar/`. The preview is available at `http://127.0.0.1:5311/#navbar` (owned preview session 96461). No required implementation work remains. Changes remain uncommitted: a dry-run applying the goal-only patch to the index failed on four files containing overlapping pre-existing design edits; those edits and the index were preserved. Resume with `git status --short`, `cat docs/navigation.md`, and `.artifacts/navbar/owned-changes.patch`.

## Icon motion clipping pass: 25 October 2026

Fixed the outer SVG viewport clipping moving artwork across all 215 icons. `packages/ui/src/icons.css` allows visible overflow while preserving token dimensions and the 24-unit viewBox. A narrow `:has(> .pk-icon)` override in `styles.css` also allows kit SVG motion through Badge's icon slot; arbitrary custom images retain their existing clipping. The padded ActionMessage frame and intentional scroll-container clipping remain unchanged.

Shortened the outlying coin drops in HandCoins and speed trails in Car/Truck, and slightly reduced Leaf's upward travel. Normal artwork, reset states, durations and easing remain intact. Updated `docs/icons.md`. The new regression in `tests/browser/icon-animation.spec.ts` renders real public icons/buttons/badges, freezes representative hover poses, hit-tests painted strokes beyond the original SVG viewport, and asserts unchanged layout geometry.

Verification passed: production package/catalog build, configured TypeScript and ESLint, four icon Chromium tests (including the live idle/hover/reset sweep for all 215 icons), and the existing Badge geometry/RTL/narrow-layout journey. The new clipping regression failed against the pre-fix build and passes after the fix. A separate bounds audit sampled all catalog icons: maximum measured excursion is now four artwork units, down from nineteen for HandCoins and over eleven for Car; all sampled overflowing artwork uses visible overflow. Inspected seven motion captures, including Search and CreditCard, and checked 360px layout for horizontal overflow. Independent source review found no actionable issues. Firefox/Safari and physical touch were not tested.

Evidence: `.artifacts/icon-motion-bounds-before.json`, `icon-motion-bounds-after.json`, `icon-motion-before-test-results/`, `icon-motion-test-results/`, `icon-motion-*.png`, and `icon-motion-playwright.config.ts`. No required clipping work remains. Existing dev preview on port 5173 serves the updated icons. Concurrent design edits remain separate. Resume with `git status --short`; view `http://127.0.0.1:5173/#icons`.

## Icon scenario expansion: 25 October 2026

Added 116 named icons, bringing the library to 215. New categories cover food/drink (24), money/payments (20), charts (16 added; 17 including the existing combined chart), shopping/delivery (12), travel/places (12), health/fitness (10), nature/weather (10), and devices/technology (12). Every addition uses the existing hover/static/reduced-motion contract. Forty-five new glyph bodies adapt the same pinned Lucide Animated source; 71 use original CSS motion on installed Lucide artwork. Totals are now 95 adapted bodies and 120 CSS animations. Syringe retains the installed 24-unit outline because upstream uses incompatible filled artwork.

Extracted the unchanged shared factory and icon types into `packages/ui/src/create-kit-icon.tsx`; original imports and public types remain compatible. Eight `icons-*.tsx` domain modules have explicit public exports. `apps/catalog/src/scenario-icon-data.ts` supplies searchable labels/aliases and eight categories; catalog data remains outside the UI runtime. Icons now load through the catalog's existing lazy/Suspense pattern, moving the expanded gallery into its own chunk. Updated `docs/icons.md`, README and provenance. The existing all-icon browser sweep derives its inventory from public exports.

Verification passed: final production build, configured TypeScript and ESLint, all three icon Chromium journeys (including idle/hover/reset for all 215), 62 copied examples and 48 priority mappings, and independent packed Vite/Next builds with SSR/HTTP/CSS checks. Packed fixtures explicitly render new Coffee and BanknoteArrowUp exports. Manifest/public export/category audits match all 116 additions; all 71 CSS presets target visible SVG geometry. Category and breakfast/revenue/portfolio searches, dark/light rendering, and 360px overflow checks passed with no page errors. Independent source review found no actionable issues. An initial sweep used a build predating the final MapPin reset fix; rebuilding the final source resolved it. Firefox/Safari and physical touch were not tested.

Evidence: `.artifacts/icon-expansion-implementation.json`, `icon-expansion-smoke.json`, `icon-expansion-package-verification.json`, `icon-expansion-test-results/`, and `icon-expansion-*.png`. Fixed-build tests use `.artifacts/icon-expansion-playwright.config.ts` to avoid concurrent catalog rebuilds. No required icon-expansion work remains. Concurrent design changes remain separate. Resume with `git status --short`; view `http://127.0.0.1:5173/#icons`.

## Inline utility actions: 25 October 2026

Completed the compact-layout follow-up. Toast icon actions now sit beside the title and dismiss control in one row. Ghost buttons remove the resting outline; controls are 24px on desktop with 16px glyphs and expand to 44px for narrow/coarse-pointer input. Added ButtonSize/xs without changing field ControlSize. Applied xs to the previously converted copy, password, file, chat, selection and status utilities, plus SearchField clearing. Icon import copying now sits beside wrapping code. Text-only toast actions retain their existing visible-label layout. This supersedes the lower-row square toast shown in the earlier utility-icon pass.

Production build, configured TypeScript and ESLint passed. The relevant browser suite passed 27/29 initially; the chat streaming test passed on serial rerun, leaving only the concurrent AlertDialog exit-guard regression at tests/browser/overlays.spec.ts:100. This follow-up does not alter that dialog or test. Both extended button/toast journeys passed, including inline alignment, 24px desktop sizing, 44px narrow/wide-touch sizing, keyboard focus and undo behavior. Eighteen light/dark/mobile visual checks plus keyboard code-copy verification passed. Source review accepted the change. Firefox/Safari and physical touch input were not tested.

Evidence is in `.artifacts/inline-icon-actions/`; `undo-archive.png` shows the final resting toast. Concurrent design and animated-icon work remains preserved. Existing preview on port 5173 remains available. No required compact-layout work remains.

## Animated icons: 25 October 2026

Completed the icon-animation goal. All 99 named icons animate only on pointer hover, including their containing controls. Fifty SVG bodies adapt Lucide Animated at commit `4662fff2b60fdcf4751b32013606756caf7c4c26`; 49 use original CSS motion on the installed Lucide artwork. `animation="static"` and `IconProvider` provide per-icon and subtree settings. Reduced motion, touch contact, disabled/busy controls, exit and unmount are handled centrally. Sizes, currentColor, accessible labels, native SVG refs/props and canonical Lucide classes remain available. Spinner keeps its existing progress behavior.

The Icons catalog has a mode selector, side-by-side examples and matching JSX. Documentation, provenance and MIT notices accompany pinned Motion 14.6.0. Main sources: `packages/ui/src/icons.tsx`, `icon-provider.tsx`, `use-icon-animation.ts`, `icons.css`, `animated-icons/`; catalog and docs changes are limited to icons.

Verification passed: production build, configured TypeScript and ESLint, eight token tests, all 62 copied examples/48 mappings, packed Vite and Next production builds with HTTP/CSS smoke, SSR/native-prop smoke and independent source review. The 99-glyph browser sweep checks idle state, actual path/geometry motion and complete reset. All three focused icon journeys passed after replacing timing-sensitive polling with an observer (`.artifacts/animated-icons-focused-final.log`). Light/dark desktop and narrow screenshots show no overflow; a development hover-then-unmount check recorded no runtime errors.

The fixed-build full Chromium run passed 127 of 129 journeys (`.artifacts/animated-icons-browser-final.log`). One failure was the short-animation polling assertion, fixed and rerun successfully without runtime changes. The remaining failure is unrelated: `tests/browser/overlays.spec.ts:100` detects Enter activating confirmation while AlertDialog exits. Review confirmed its content wrapper matches HEAD, lacks the closed-state input guards of DialogContent, and the failing dialog has no icon. Concurrent overlay work is preserved. Vite still reports its chunk-size advisory. Firefox/Safari and physical touch devices were not tested.

No required icon work remains. Existing Hallmark/design, compact-button and overlay edits are outside this commit. The owned patch is `.artifacts/animated-icons-owned.patch`; screenshots are `.artifacts/animated-icons-{desktop,mobile,dark}.png`. Resume with `git status --short` and `cat docs/icons.md`. Existing catalog preview on port 5173 remains available at `/#icons`.

## Utility icon buttons: 25 October 2026

Completed the utility-icon goal. Undo archive, code/import/token copy, password visibility, chat copy/idle retry/jump, file-row actions, status dismissal and table selection clearing use named square icon buttons with shared tooltips. Primary actions, confirmation labels, empty-state recovery and filter resets retain text. Added Undo2Icon, EyeIcon and EyeOffIcon (99 wrappers). Toast actions accept an optional icon while retaining label, altText, callbacks and the existing text fallback. Updated copied examples and family docs.

Verification passed: production build, full configured typecheck and ESLint, 29 existing Chromium journeys, all 62 copied snippets, independent source review, and 18 light/dark/mobile visual/geometry checks plus keyboard code copying. Mobile controls meet 44px targets. Evidence and the owned change patch are in `.artifacts/icon-actions/`; `undo-archive.png` shows the requested toast. The build retains its existing chunk-size warning. No required work remains for this goal; Firefox/Safari and physical mobile input were not tested.

Concurrent icon-animation edits began during verification and temporarily introduced missing IconProvider/IconAnimation exports in the shared checkout. Final build/typecheck/lint passed in a snapshot of the starting working tree plus only this goal's changes. The successful browser run and visual checks used the completed icon-button build. Existing design and animation work was preserved; their integration remains owned by those chats. The password reveal is now square, superseding the earlier 64px Show/Hide description below. The commit includes only this goal's changes and the password-specific styling needed for its new control.

Resume with `git status --short` and `.artifacts/icon-actions/changed-files.txt`. Existing preview on port 5173 was preserved; the temporary verification server and snapshot were removed.

## Completed 48-item design goal: 25 October 2026

All 48 implemented Next inventory items were significantly improved in inventory order and independently reviewed. This completes the design goal based on user-confirmed implementation commit `686055c`. The authoritative per-item checklist and evidence are in `docs/component-design-elevation.md`. No required implementation or verification work remains.

Changes cover the six shared family modules/styles (`foundations`, `selection-controls`, `form-controls`, `navigation`, `overlays`, `data-workflows`), their catalog previews and family docs, the two editable record/recovery blocks, and a zero-specificity catalog margin reset. Existing switch and overlay browser journeys now cover reproduced RTL direction, confirmation exit-activation and AccountMenu keyboard pending-focus defects. Narrow rich/file rows use container width to keep text readable and actions reachable. Progress has a real indeterminate segment and reduced-motion state; SaveStatus preserves one lifecycle node. List Notes retain a readable width inside contained table scrolling. The page editor preserves native submission, drafts, aborts and focus while improving sections and save feedback.

Verification passed: production builds; configured TypeScript and full ESLint; eight token tests; all 135 Chromium journeys including 48 routes across eight themes, two modes and four widths; 62 copied examples/exactly 48 priority mappings; independent packed Next/Vite builds, SSR/native-prop, HTTP/CSS and copied-block checks. After the full run, the sole source change was the block-local Notes renderer. Its six affected journeys, build/typecheck/focused lint and packed consumers passed again. All 291 source/config hashes were stable at the final checkpoint. During handoff, concurrent Navbar follow-up changes reached its shared component, catalog preview and browser test files. Those later contents are preserved and were not reverified by this goal. See `final-input-stability.json` for observed paths. No undefined CSS token references remain across 32 shared/catalog stylesheets. Independent source/pixel review signed off all 48; supplemental states include keyboard/reduced-motion/RTL, long names and narrow containers, five recovery variants and short-window save/retry/cancel/discard.

Evidence is under `.artifacts/design-elevation/`: `review-completion.md`, `final-*.log`, `o-final-*.log`, `o-final-package-verification.json`, `final-input-stability.json` and family screenshots/runtime reports. The tracker describes intermediate reproduced failures and harness corrections separately from product fixes. Firefox/Safari and physical touch were not tested.

Concurrent complete-Navbar, Hallmark, compact utility and animated-icon work is preserved. The completed Navbar behavior and fixtures superseded the earlier E05 specimen and passed final integration before that later follow-up. This pass and its popup follow-up are committed locally; no deployment or push was performed. Separate Navbar and Hallmark work remains uncommitted. Root's temporary 5307 preview and M fixture 5393 are confirmed closed; independent consumers removed their own servers/directories; other previews are preserved.

Resume for review: `cat docs/component-design-elevation.md`, `cat .artifacts/design-elevation/review-completion.md`, `git status --short`. No further design implementation is required for this goal.

## Sidebar icon coverage: 25 October 2026

All 62 catalog entries now have explicit sidebar icons. The 48 entries added after the original catalog had used AdminShell's circle fallback. Added 36 static Lucide wrappers and public exports, bringing the searchable icon inventory to 96. The icon reference includes a Controls category and component aliases such as checkbox, fieldset and combobox. Existing icon sizing, stroke, color and accessibility behavior remain intact; no dependency was added.

Changed files: `packages/ui/src/icons.tsx`, `packages/ui/src/index.ts`, `apps/catalog/src/catalog.tsx`, `apps/catalog/src/icon-data.ts`, `docs/icons.md` and `README.md`. Production build, configured typecheck, focused ESLint, all three existing sidebar/icon Chromium journeys, an AST coverage/inventory check and independent code review passed. Live preview inspection confirmed 62 decorative 20px icons with no fallback circles, all 96 gallery entries, component search and category filtering. Dark and light sidebar captures passed visual review. An initial gallery smoke assertion expected 12 Controls entries; the actual 11-entry category was correct, and the corrected smoke passed. The build reports a chunk-size warning.

Evidence is in `.artifacts/sidebar-icons/`: `build.log`, `typecheck.log`, `lint.log`, `browser.log`, `gallery.log`, `sidebar-dark.png`, `sidebar-light.png` and `controls-gallery.png`. No required work remains. Firefox/Safari were not tested. Existing design-pass edits and concurrent forms/selection work remain outside this change. Resume with `git status --short`; the existing preview at `http://127.0.0.1:5173` remains running.

## Completed 48-priority build

All 48 Next priorities are implemented and verified. The catalog has 62 entries with complete copied examples. Six public UI modules cover foundations, selection/progress, forms, navigation, overlays, data/files; editable record and recovery blocks are in `registry/blocks`. Every ID has source, contract and verification evidence in `docs/priority-build-plan.md`. No required implementation or verification work remains for this goal.

Final checks passed: production build; configured TypeScript and ESLint; eight token tests; all 127 Chromium journeys; all 62 copied snippets and exactly 48 priority mappings; independent packed Next/Vite builds, SSR/HTTP/CSS and copied-block checks. Every priority route fits all eight themes, both modes and 360/768/1024/1440px layouts. Seventeen representative captures had no runtime errors; independent review of seven captures found no actionable visual defect. The kit has 211 resolved variables and 560 validated contrast pairs.

Review resolved native required validation/focus, controlled choice-label and search clearing, popup Escape ordering, responsive Navbar focus, compact pagination hints, deferred filter-removal focus, native file cancellation/removal state, and stale async results. C07 deliberately follows Base UI's disabled-option discovery model: disabled rows may be highlighted and announced but cannot be selected. Its dialog popup uses the parent content as container plus the shared Radix DismissableLayer.

Evidence: `.artifacts/priority-build-confirm.log`, `priority-typecheck-confirm.log`, `priority-lint-confirm.log`, `priority-examples-confirm.log`, `priority-release-browser.log`, `priority-token-final.log`, `priority-packages-confirm.log`, `catalog-examples.json`, `package-verification.json`, and `priority-visual/report.json`. The 98 source hashes in `priority-verification-inputs.json` remained unchanged during the final checks. Owned diagnostic/fixture servers and temporary consumers were cleaned; the existing 5173 preview remains available.

Firefox/Safari, physical mobile keyboards and production adoption remain unverified. Packages remain local/unpublished. Other chats' dialog/dropdown/tooltip commits through `2ba4a8b` and their pre-existing design-pass edits were preserved. Inspect `git status --short` for those remaining parallel changes; the goal's commit isolates its own source, docs and tests.

Resume reference: `cat docs/priority-build-plan.md`, `cat docs/compatibility.md`, `git log -1 --oneline`.

## Shared dialog design: 25 October 2026

Dialogs now share an elevated frame, more space between sections, an inset close control and a separated action footer. Shared surface/backdrop motion opens in 160ms and closes in 120ms. ChatWidget now uses the same Dialog wrapper as the catalog and AdminShell drawers, retaining its compact/maximized viewport layout and Escape order. Drawer motion uses logical direction with build-safe RTL selectors. All visual values reuse existing tokens.

Closing controls block keyboard and pointer activation. Rapid reopening restores focus inside the retained content without remounting or losing drafts, while honoring caller autofocus cancellation and forwarded refs. Reduced motion uses zero-duration animations with stable names so changing the preference during exit still lets Radix Presence release focus/scroll locks. Core changes: `packages/ui/src/dialog.tsx`, shared dialog styles, chat composition/styles, and drawer motion rules. README/UI provenance describe the design; two existing browser specs cover lifecycle and settled geometry.

Source review and manual light/dark inspection passed. An isolated snapshot of HEAD `95ea8cf` plus only these dialog changes passed production build, configured typecheck, full ESLint, eight token tests, all 44 Chromium journeys, and packed Vite/Next production builds with HTTP/stylesheet smoke checks. Logs and screenshots are in `.artifacts/dialog-design/`: `isolated-*.log`, `package-verification.json`, `dark.png`, and `light.png`. The isolated check was necessary because other component implementation was changing the same checkout; the mixed checkout run passed dialog/chat/drawer journeys but had three table-related failures and catalog import type errors from that other work. Those files were preserved.

No required work remains for this dialog request. Firefox and Safari were not tested. Temporary verification tabs and owned preview servers on ports 5303/5305 are closed; the existing preview on 5173 was preserved. Concurrent Hallmark, field-error, inventory and new-component changes remain outside this commit. Resume with `git status --short` and this handoff; do not assume the ongoing broader working tree is fully verified by this dialog check.

## Shared dropdown design: 25 October 2026

Updated the shared Select/SelectField design used by all 15 direct catalog dropdowns and DataTable pagination. Popups have 6px padding and trigger spacing, layered shadows, trailing selected checkmarks, distinct selected and highlighted rows, and a rotating chevron. Existing tokens provide every visual value. Opening fades with 4px directional movement over 160ms; closing uses 120ms. Reduced motion removes popup and chevron motion. Public props, grouped descriptions, form integration, long-label wrapping, RTL and 36px desktop / 44px touch rows remain intact.

Radix Presence retains closing content for the animation. Pointer interaction and keyboard selection are blocked during exit, including Escape followed immediately by Enter inside a dialog. Disabling a control skips the exit to preserve asynchronous focus recovery. Core changes are in `packages/ui/src/select.tsx` and the select rules in `packages/ui/src/styles.css`; README and UI provenance document the behavior. Usage audit found no separate native or custom dropdown implementations to migrate.

Source review, production build, configured typecheck, ESLint, eight token tests, and packed Vite/Next consumers passed. The 11 focused browser journeys passed. The full Chromium run passed 42 of 43 journeys; one exact row-height assertion caught floating-point rounding during the entrance animation. That test now waits for the actual animation to finish and still checks exactly 36px/44px. Both affected catalog journeys passed afterward, including the modal exit check made deterministic by pausing/resuming its animation around real keyboard input. Runtime source did not change after the full run. Logs: `.artifacts/dropdown-design-build.log`, `.artifacts/dropdown-design-focused.log`, `.artifacts/dropdown-design-browser.log`, `.artifacts/select-geometry-exit-browser.log`, `.artifacts/dropdown-design-tokens.log`, and `.artifacts/dropdown-design-packages.log`. Package report: `.artifacts/dropdown-design-package-verification.json`.

Manual light/dark inspection passed; screenshots are `.artifacts/dropdown-design-dark.png` and `.artifacts/dropdown-design-light.png`. The temporary visual preview on port 5303 and its tab were closed; the existing preview on port 5173 was preserved. Firefox and Safari were not tested. No required work remains for this dropdown request. Concurrent Hallmark, field-error-icon and inventory changes remain outside this commit. Resume with `git status --short` and this handoff before selecting the next component.

## Shared tooltip design: 25 October 2026

Tooltips now share a compact inverse surface, matching arrow, 220ms hover delay, and 120ms directional fade with 2px movement. Both opening and closing animate; reduced motion removes both animations. Existing tokens provide colors, spacing, radius, typography, shadow and motion. The shared tooltip is used for sidebar controls and compact branding, catalog icon examples, field clear actions, table search/pagination, dialog close buttons, and chat controls. Removed the redundant native title from the static sharing message. README and token provenance describe the design.

The shared root controls Radix internally to preserve rapid reopening during exit. Focused tooltips ignore queued scroll events only when trigger geometry and all scroll offsets remain unchanged during that event's dispatch; genuine scrolling still dismisses them. Dialog autofocus and chat/sidebar focus restoration avoid unsolicited hints. Opening the mobile drawer removes its superseded menu hint immediately so the drawer owns Escape. Existing focus loops and activation behavior remain intact.

Verification passed: source review, production build, configured typecheck, ESLint, eight token tests, and all 43 Chromium journeys. Regressions cover animated exit, rapid reopening, keyboard descriptions, real-scroll dismissal, tooltip-first Escape, modal pointer behavior, RTL, reduced motion, and drawer focus restoration. Packed Vite and Next consumers passed production builds, HTTP 200 and stylesheet checks; owned servers and temporary directories were cleaned. Logs: `.artifacts/tooltip-design-final-build.log`, `.artifacts/tooltip-design-complete-browser.log`, `.artifacts/tooltip-design-tokens.log`, and `.artifacts/tooltip-design-final-packages.log`. Package report: `.artifacts/tooltip-design-package-verification.json`.

Manual light/dark inspection passed. Screenshots: `.artifacts/tooltip-design-dark.png` and `.artifacts/tooltip-design-light.png`. Dark appearance and expanded navigation were restored; the temporary browser tab was closed and the existing preview on port 5173 preserved. Firefox and Safari were not tested. No required work remains for this tooltip request; the earlier component goal remains complete. Concurrent Hallmark, field-error-icon and component-inventory edits are preserved outside the tooltip commit. Resume with `git status --short` and this handoff before starting the next component.

## Component inventory research

Added `docs/component-inventory.md` in response to the request for a full list of components and compositions to prepare. It compares the 14 existing catalog sections and public exports with the original local project review, Apple Minimal contracts, and current shadcn, Radix, Mantine, HeroUI, Chakra, React Aria, Uiverse and Supabase references.

The inventory contains 183 proposed additions/extensions across 18 groups: 48 Next, 90 Follow-up and 45 Optional. Each row identifies its delivery as UI, recipe, editable block or integration adapter. It records sources, current capabilities, common design requirements and a dependency-based preparation order. Card, Tabs, Toast, DropdownMenu and standalone Navbar have internal contracts but no public implementation; Checkbox and Pagination currently exist inside DataTable.

Documentation checks passed for unique/sequential IDs, priority counts, inventory table columns and all local link targets. External source pages were inspected during research. No runtime tests were run for this documentation-only change, and no component implementation was added. Existing application edits and the earlier handoff content below were preserved. Implementation of the proposed inventory remains future work.

Resume with `cat docs/component-inventory.md` and select a complete flow from its recommended waves. The research did not select new runtime dependencies, publish packages or migrate a consuming application.

## Field error icon follow-up

Replaced the plain exclamation mark in `packages/ui/src/field-frame.tsx` with the existing 16px CircleAlertIcon. Updated the error-row styles in `packages/ui/src/styles.css` to align the icon with the first text line, including wrapped messages; removed the unused symbol class. This applies to text, textarea and select field errors. The icon is decorative; error text, alert semantics and control associations remain intact.

Production build, configured typecheck, focused ESLint and all four existing field/select Chromium journeys passed. Dark desktop and mobile inspection passed; the mobile icon is 16px square, centered on the first line, without overflow. Screenshots: `.artifacts/field-error-icon-dark.png` and `.artifacts/field-error-icon-mobile.png`. No required follow-up remains. Other uncommitted work was preserved.

## Completed

Completed a Hallmark design polish across all 14 catalog entries and every public component family. The complete audit, copy changes, remaining linter findings and evidence are in `docs/hallmark-design-pass.md`. Hallmark source: version 2.0.0, commit `7ec868225c6caa040558c321ee0fefa0e73f83a8`, cloned outside the project at `/tmp/design-tokens-hallmark-20261025`.

The catalog now uses fewer nested frames and decorative labels; theme selection, control emphasis, disabled fields, empty states, and component specimens are clearer. Existing token palettes, typography, APIs, state handling, semantic feedback and requested sidebar/chat motion remain. No dependencies were added to the project, no tests changed for this pass, and nothing was published.

## Key files changed

- Catalog chrome and foundations: `apps/catalog/src/catalog.tsx/css`, theme/token/icon preview files.
- Controls: `packages/ui/src/styles.css`, button and dialog preview files.
- Compositions: `packages/ui/src/admin-shell.css`, `chat.css`, `data-table.css`, `tooltip.tsx`; chat and table preview files.
- Feedback: loading and empty preview files. Badge, ActionMessage and Tooltip visual designs were audited and retained.
- Audit records: `docs/hallmark-design-pass.md`, `.hallmark/preflight.json`, `.hallmark/log.json`.

## Verification state

Production build, configured TypeScript checks, ESLint, eight token tests and all 41 Chromium browser journeys passed. Two button journeys passed after final CSS adjustments; two dialog journeys and focused ESLint/typecheck passed after the review's final badge/copy cleanup. Packed Vite and Next consumers passed production builds and stylesheet/HTTP checks on the final package artifacts.

Hallmark rendered all 14 routes across eight widths, with a separate 56-capture light/dark desktop/mobile check. No document overflow or runtime errors were found by that capture check. Preserved inventory: 41 links, 29 fields, 138 handlers, two figures. One chat heading was replaced and recorded.

Raw Hallmark confirmation: 18 FAIL, 16 REFLEX, four WARN. These are documented, not hidden: requested layout motion; separate-column sticky, disabled-cascade and scrolling/closed-content false positives; state rules defined outside preview CSS; existing apostrophe style; and intentional table horizontal scrolling on phones. No claim of a clean raw linter run is made.

Independent finish review inspected all route areas. It requested removal of one redundant dialog badge, then checked the recapture and returned `ship`; the mobile table tradeoff was answered. Logs are in `.artifacts/hallmark/`; before/after comparison is `.hallmark/compare.html`.

## Remaining / known gaps

No required work remains for this design pass. Firefox/Safari and physical mobile keyboards were not tested. The table still requires horizontal scrolling on small screens. Packages remain local/unpublished.

Concurrent sidebar work was preserved and committed separately as `702f00e feat(catalog): reuse draggable sidebar for library navigation` during this pass. The design-pass files are uncommitted. The initial working-tree diff is `.artifacts/hallmark/pre-existing.patch`; do not attribute that prior sidebar work to this pass.

## Resume commands

```sh
git status --short
git diff --stat
cat docs/hallmark-design-pass.md
```

Preview remains available at `http://127.0.0.1:5173/#buttons`. Before/after screenshots and logs are ignored artifacts; the audit and Hallmark metadata are source records.

## Decisions

Use Hallmark's app-screen polish criteria within the existing system. Preserve explicit prior requests for sidebar and chat motion, report mechanical exceptions honestly, retain functional field/modal/table/theme boundaries, and change components only where the audit found a useful improvement.

## R05 editable block registry: 25 October 2026

Status: DONE for the five committed blocks available at branch creation. Worktree: `/Users/nationalbank/.codex/worktrees/block-registry/design-tokens`. Branch: `codex/block-registry`. The earlier handoff sections are retained as history; their branch and deployment statements describe earlier work.

### Completed

Created the isolated worktree from local `codex/component-improvements` at `b588b1b`. After fetching, that local branch was seven commits ahead of `origin/codex/component-improvements`; the local tip was the latest source. Implementation commit: `0193a171b8fb50bf8fd95d111c7a64fd77a7b8ec` (`feat(registry): add editable block installation and upgrade tooling`). This handoff is a separate documentation commit following it.

Implemented discovery, schema validation, inspection, dry-run installation, baseline tracking, upgrade comparison, reviewed conflict acceptance and interrupted-operation recovery. Registered `account-settings`, `onboarding-wizard`, `record-detail`, `record-workflow` and `recovery-page`. `record-detail` includes the shared record editor; installed state tracks both owners when appropriate. Optional registry verification reuses the existing packed Vite/Next consumers.

Only registry tooling/metadata/schema, `docs/block-registry.md`, additive root scripts/dependencies and the optional verification path changed. Package, component, block, catalog and fixture source have no diff from the base. No registry was published, no service was deployed, no other worktree was edited, and no existing application was used as a test consumer.

### Files and commands

- `scripts/registry/{build,catalog,cli,installer,storage}.mjs`: source bundling, validation, CLI, baseline comparisons and filesystem transactions.
- `scripts/registry/registry.test.mjs`: 21 temporary-consumer test groups.
- `registry/metadata/*.json`: extensible opt-in records; `registry/schema/`: pinned official schemas, metadata schema, source hashes and retained MIT notice.
- `docs/block-registry.md`: exact installation, local/private package acquisition, upgrade, conflict resolution, recovery and integration commands.
- `scripts/verify-packages.mjs --registry`: installs copied blocks through the CLI before existing consumer builds and smoke checks.

Resume and inspect the final local snapshot:

```sh
cd /Users/nationalbank/.codex/worktrees/block-registry/design-tokens
git status --short
git log -3 --oneline
node scripts/registry/cli.mjs discover
node scripts/registry/cli.mjs validate --registry .artifacts/block-registry/catalog
node scripts/registry/cli.mjs inspect record-detail --registry .artifacts/block-registry/catalog
```

The ignored snapshot `.artifacts/block-registry/catalog` was built after implementation commit `0193a17` and validated against the pinned official schemas. To build elsewhere, use a new output directory; builds reject an existing directory. For fresh verification after integration:

```sh
npm ci --ignore-scripts
npm run verify:registry
npm run typecheck
npm run lint
```

### Verification evidence

Executed `npm run test:registry`: all 21 tests passed, no skips, final full run about 40 seconds. Coverage includes fresh install, missing/undeclared/incompatible dependencies, repeated install, pre-existing application files, edited/deleted source, clean upgrades/removals, conflicts, shared owners, review token staleness, traversal/symlinks, corrupt metadata/state, caught write failures, interrupted processes, and edits after interruption. Metadata validates against its selected schema; vendored bytes match provenance hashes. Tests also check that unfinished/unregistered source is excluded, dirty registered source is rejected, and incomplete relative imports fail the build.

Executed `npm run build:packages`, `npm run typecheck` and `npm run lint`: all passed. Final focused ESLint also passed after the review fixes. Executed `node scripts/verify-packages.mjs --registry`: packed local Evenkit packages installed in independent Vite and Next consumers; all five blocks installed through the CLI, dry runs and repeated installs passed, both production builds passed, both returned HTTP 200, stylesheets passed, and existing Next SSR assertions passed. All owned servers stopped and temporary consumers were removed.

Independent review found two failure modes: mixed baseline versions in different destination directories were wrongly checked as one catalog, and rollback/atomic replacement could lose permission bits. The fixes validate each installed item independently, validate the complete next state before writes, journal original modes and apply modes explicitly despite umask. Focused regressions passed, including `0600` removal rollback and `0664` atomic replacement under umask `022`; confidence is high. The `0664` assertion was added to the existing clean-upgrade test after the full run and that test passed again.

Evidence remains in this worktree:

- `.artifacts/block-registry/tests.log`, `permissions.log`, `build.log`, `typecheck.log`, `lint.log`, `packages.log`.
- `.artifacts/registry-package-verification.json`: consumer results, dependency checks, hashes, source revision, server PIDs/ports and confirmed cleanup.
- `.artifacts/block-registry/verification-inputs.json`: SHA-256 values for all 20 implementation inputs at verification.

The full catalog browser matrix was not rerun because no component or block behavior changed. Framework integration was exercised by the existing independent package fixtures.

### Decisions and limits

The selected distribution is a local installer over shadcn-schema-compatible catalogs. Standard shadcn installation does not create Evenkit baseline state, and the catalog dependency names do not imply publicly available Evenkit packages. Both private Evenkit tarballs must be supplied together or installed through the consumer's authenticated registry. The installer checks declarations/installed versions and never invokes npm or changes a consumer manifest.

Official schema copies and docs were inspected on 25 October 2026. Ajv 8.20.0 (MIT), Zod 4.6.7 (MIT), semver 7.8.5 (ISC), and existing TypeScript 6.0.3 (Apache-2.0) support tooling only. Evenkit block metadata remains `UNLICENSED`; no new public distribution right is claimed. Schema MIT notices are retained. Exact upstream URLs and hashes are in `registry/schema/provenance.json`.

There is no automatic text merge or force overwrite. Explicit conflict acceptance requires the current review token and preserves reviewed local contents. Native Windows filesystem behavior is unsupported; macOS was tested. File bytes and ordinary modes are retained, while ACLs, extended attributes and timestamps are not archived. Hostile concurrent directory replacement is outside the portable filesystem guarantees. A truncated initial write, corrupt state/journal or post-interruption edit can require manual review/repair; recovery refuses unknown content rather than erasing it. Empty directories may remain after rollback.

### Integration handoff for newly finished blocks

The integration owner should include tooling commit `0193a171b8fb50bf8fd95d111c7a64fd77a7b8ec` and retain this R05 handoff section alongside other agents' handoffs. Resolve root package-script/dependency additions additively. Do not replace their component/block source with this branch's older snapshots.

Merge each finished block's source, dependency/license decisions and verification from its owning agent first. Run `registry discover` on the integration branch. Add one metadata file per finished block, including its full local import closure, destination layout and direct package dependencies. The tooling intentionally has no references to the unfinished document-library, notifications, reporting, rich-chat or team-admin worktrees. Their final block names and paths must come from their completed handoffs.

After adding metadata, run `npm run verify:registry`, the integration branch's type/lint checks, and each new block's applicable behavior checks. The packed verification installs every registered block, while its runtime fixtures exercise the existing five; new blocks still need their owning agents' usage/runtime evidence. Build a fresh snapshot from the final integration commit and record that revision. Update inventory R05's status/link in the integration tracker there; this branch leaves the shared inventory document untouched to preserve ownership.

## Registry design pass: 26 October 2026

Status: DONE. Branch/worktree remain `codex/block-registry` at `/Users/nationalbank/.codex/worktrees/block-registry/design-tokens`. User selected readable CLI output plus a local visual registry viewer. Implementation commit: `13ac235` (`feat(registry): add visual explorer and readable terminal output`), following R05 commits `0193a17` and `a340aaf`. This appended handoff preserves other agents' source records.

### Completed design work

- `scripts/registry/presentation.mjs`: terminal summaries with grouped file actions, dependency blockers, provenance, upgrade comparisons and next steps. Text is default in a terminal; pipes retain JSON. `--format text`, `--format json` and `--json` override this. Colors respect `NO_COLOR`; metadata control sequences are removed from text output. Installer behavior and exit codes are retained.
- `scripts/registry/viewer.mjs`, `viewer-client.js`, `viewer.css`: standalone local HTML export through `registry view`. Uses the existing Evenkit wordmark and Grove tokens, responsive library/inspector layout, light/dark appearance, search, file/dependency/provenance inspection, source text and a quoted dry-run command builder. Commands execute only when copied into a terminal. The page embeds its assets and catalog, uses a hash-based CSP, and makes no network requests.
- `cli.test.mjs`, `presentation.test.mjs`, `viewer.test.mjs`: output compatibility, error formatting, terminal control handling, HTML/CSP escaping, exclusive export paths and literal shell arguments. `verify-viewer.mjs`: repeatable browser verification using the existing Playwright dependency.
- `docs/block-registry.md`: viewer, format, installation/upgrade and verification commands, private-source handling and dependency/license decisions. Additive package scripts build tokens before registry tests and expose `verify:registry-viewer`.

No package, app, component, block or fixture source changed from `b588b1b`. No new dependency or public license was added. The viewer is a source/metadata inspector; it does not render the blocks as application previews. It reuses private repository assets. Nothing was published or deployed, and all consumer testing used temporary directories.

### Verification and evidence

All 34 registry tests passed (21 installer/builder tests retained plus 13 CLI/presentation/viewer tests). The full configured `npm run typecheck` and `npm run lint` passed. Final focused ESLint passed after the browser verification additions. `git diff --check` passed. The earlier R05 packed Vite/Next consumer results remain applicable to unchanged installer/block source; those package builds were not repeated for presentation changes.

`npm run verify:registry-viewer` passed in Chromium: search and empty state, keyboard tab navigation, clipboard success/manual-copy fallbacks, relative destination validation, exact source copying, source/overview layouts at 360/768/1024/1440px, light/dark token switching, reduced motion, escaped malicious metadata/source and a 6,001-line source fixture. Measured text contrast across representative body, muted, selected, input and primary-button pairs exceeded 4.5:1 in both appearances (minimum 4.94:1). All viewer CSS variables resolve to built token definitions. No browser runtime errors or network requests occurred; temporary catalogs were removed.

Independent review found a mobile overflow in the long-file notice; wrapping and a 360px long-source check fixed it. Review reported no remaining actionable findings. Source previews cap at 5,000 lines to bound DOM size, while copying retains the complete source. Safari, Firefox and screen-reader testing were not run. Appearance and application-path fields persist only within the current page; regenerate exports after paths or snapshots change. The original R05 filesystem/upgrade limitations still apply.

Ignored local evidence is under `.artifacts/block-registry-design/`: `tests.log`, `cli.log`, `typecheck.log`, `lint.log`, `final-lint.log`, `browser.log`, `browser-verification.json`, responsive and dark/source PNGs, and `verification-inputs.json` with implementation input hashes. `catalog-final/` was built from commit `13ac235`, and `blocks.html` is its usable local viewer; `preview.png` shows its initial state. Earlier versioned HTML drafts are historical artifacts.

### Resume and integration commands

```sh
cd /Users/nationalbank/.codex/worktrees/block-registry/design-tokens
git status --short
git log -4 --oneline
open .artifacts/block-registry-design/blocks.html
node scripts/registry/cli.mjs list --registry .artifacts/block-registry-design/catalog-final --format text
npm run test:registry
npm run verify:registry-viewer
```

For a fresh export after integrating newly finished blocks:

```sh
npm run build --workspace @evenkit/tokens
EVENKIT_DESIGN_SNAPSHOT=$(mktemp -d /tmp/evenkit-design.XXXXXX)
node scripts/registry/cli.mjs build --output "$EVENKIT_DESIGN_SNAPSHOT/catalog"
node scripts/registry/cli.mjs view --registry "$EVENKIT_DESIGN_SNAPSHOT/catalog" --output "$EVENKIT_DESIGN_SNAPSHOT/blocks.html"
open "$EVENKIT_DESIGN_SNAPSHOT/blocks.html"
```

Include design commit `13ac235` after the original R05 commits. Keep root package-script changes additive and preserve other agents' source. Follow the earlier integration handoff to merge finished block source first, then add metadata; the viewer discovers all catalog items without a hard-coded block list. Run `npm run verify:registry`, `npm run verify:registry-viewer` and the integration branch's applicable checks, then export from its final commit. No design-pass work remains outstanding.

---

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
