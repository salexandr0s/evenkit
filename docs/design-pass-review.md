# Evenkit design and copy review

26 October 2026. Isolated branch `codex/evenkit-design-pass`, based on integrated commit `71f8aa6`. The original checkout and its uncommitted catalog work are preserved. No push, publication or deployment is part of this pass.

## Audit and priorities

The audit covers the current 116-entry catalog, maintained components, editable blocks and the assembled Next.js admin starter. It uses the existing Apple Minimal contracts, `--pk-` tokens, named Lucide icons and the installed `avoid-ai-writing` skill, including its patterns and headline references. Existing APIs, routing and application callbacks remain the compatibility boundary.

| Priority | Finding | Planned batch |
| --- | --- | --- |
| 1 | At 360px, document list filenames collapse to one character per line. Mixed previews and long names also misalign grid actions. | Correct shared document layout and utility controls; retain all content and intentional table scrolling. |
| 1 | Unequal website feature headings push descriptions to different baselines. | Use shared content-sized rows and responsive stacking without fixed content heights. |
| 2 | Statistic values and metadata diverge with long labels; newer data screens contain implementation-oriented status copy. | Align related statistics and simplify user-facing wording while preserving demo and service boundaries. |
| 2 | Assembled admin pages repeat workspace headings, reserve space for empty status, and overstate document capabilities. | Tighten page rhythm, action presentation and factual copy. |
| 2 | Website forms stretch to 1050px, article media overwhelms its reading column, and examples repeat demo disclaimers. | Bound reading/form widths, normalize gaps and improve copy. |
| 2 | Some familiar utility icons lack keyboard tooltips; chat citations repeat text buttons. | Reuse the existing tooltip/button primitives, preserve accessible names and test focus recovery. |

Implementation follows rendered before captures for each batch. Pure styling/copy changes use visual review; interaction changes extend existing journeys where useful. Final verification includes configured build/type/lint, browser journeys, copied examples and packed consumers. Evidence and final outcomes follow below.

## Implemented changes

- **Documents:** the list keeps a readable 480px minimum inside its existing named scroll region. The toolbar wraps controls at their useful widths. Grid cards share content-sized tracks, so previews, names and actions align without clipping long filenames. List Preview/Open actions use named Eye/Folder icons and keyboard tooltips; grid actions retain labels.
- **Statistics and reports:** explicit statistic groups and dashboard metrics share label/value, period, comparison and status rows. Standalone cards keep natural flow. Long comparisons, missing periods and loading/error states no longer push adjacent values down. Reporting fields align at their controls. The group class is included in copied examples and documented in `docs/reporting.md`.
- **Website blocks:** feature headings/descriptions/actions align across unequal content; forms and article media use the reading-width token; phone gutters recover usable space. An article without contents navigation uses the full body column. Shorter studio/article copy retains the fictional-example disclosure.
- **Admin application:** removed the second layer of page padding, compacted mobile metrics, corrected nested Team heading hierarchy and removed empty-status spacing while preserving the live region. Refresh controls use named icons, tooltips and the existing busy behavior. Documents no longer claims access management; demo password-reset feedback explicitly says no email was sent.
- **Core controls and chat:** added keyboard hints to search/choice clear actions, calendar/date triggers, numeric steppers, sort clearing, bulk-selection clearing and Navbar account/menu controls. Citation previews use Eye/X controls, retain custom labels, focus the excerpt first and restore the trigger without reopening a tooltip. Closing tooltip layers are removed when the preview opens/closes so they cannot consume the enclosing chat's Escape.
- **Catalog and copy:** aligned Card owner rows, assigned specific navigation icons to the newly integrated families, replaced user-facing “selected IDs” and application-internal status language, and removed duplicated attachment-unavailable copy. Generated rich-chat copied source is synchronized.

The review retained the existing typography, semantic palettes, chart rendering, navigation layout, standard form validation, profile settings, notification layouts and overlay footer treatment where they already met the brief. Primary actions, confirmations and unfamiliar actions keep visible labels. No public prop, identifier, route, URL or host callback was removed or renamed. The mathematical minus on numeric steppers remains a mathematical symbol; the kit has no named MinusIcon.

## Visual evidence

Open the [before/after gallery](../.artifacts/design-pass/evidence.html). Files remain local in this worktree's ignored `.artifacts/design-pass/` directory.

| Family | Before | After |
| --- | --- | --- |
| Admin dashboard, 360px | [Before](../.artifacts/design-pass/admin/before-dashboard-360.png) | [After](../.artifacts/design-pass/admin/after-dashboard-360.png) |
| Documents, 360px | [Before](../.artifacts/design-pass/admin/before-documents-360.png) | [After](../.artifacts/design-pass/admin/after-documents-360.png) |
| Website features, long headings | [Before](../.artifacts/design-pass/website/before-features-1440.png) | [After](../.artifacts/design-pass/website/after-features-1440.png) |
| Website forms | [Before](../.artifacts/design-pass/website/before-forms-1440.png) | [After](../.artifacts/design-pass/website/after-forms-1440.png) |
| Citation preview | [Before](../.artifacts/design-pass/core/source-1440.png) | [After](../.artifacts/design-pass/core-after/source-detail-1440.png) |
| Statistics | [Before](../.artifacts/design-pass/data/before-statistics-1440.png) | [Long-content check](../.artifacts/design-pass/data/subgrid-statistic-1024-stress.png) |
| Card owner alignment | [Before](../.artifacts/design-pass/core/card-1440-preview.png) | [After](../.artifacts/design-pass/core-after/card-neutral-light-1440.png) |

The catalog baseline has 232 captures across all 116 entries at 1440/360px, with no page errors or document overflow. Contact sheets support the broad review; family captures cover stable content and active states. Some initial element captures include the sticky catalog header, and some asynchronous previews show loading states. They are not evidence of clipping in the component. Final focus/state captures and the family geometry reports establish the affected layouts. Admin development captures include Next's indicator and the application's intentional page-heading focus outline.

Additional evidence includes all-theme matrices and screenshots under `data/`, `core/`, `core-after/`, `website/` and `admin/`. Reviewed states include short 360×500/600 viewports, narrow panels, long labels/filenames/comparisons, RTL, dark appearances, reduced motion, busy/disabled/error/retry, keyboard tooltip activation, modal dismissal and focus recovery. All eight themes retain the same semantic tokens.

## Verification

All required checks passed. Logs and JSON reports are under `.artifacts/design-pass/`, with package/example reports in `.artifacts/`.

| Check | Result / evidence |
| --- | --- |
| Production package/catalog build | Passed, `build-final.log`. |
| Assembled Next.js admin production build | Passed, `admin/build-final.log`. |
| Configured workspace TypeScript and full ESLint | Passed, `typecheck-final.log`, `lint-final.log`. |
| Existing unit suite | 47 passed across 10 files, `unit.log`. |
| Full Chromium suite | 294 passed, `browser-final.log`. The final tooltip-layer follow-up also passed all five rich-chat journeys in `chat-final.log`. |
| Copied examples | 116 examples / 104 priority mappings passed, `examples-final.log`. |
| Packed consumers | Independent Vite and Next production/HTTP/stylesheet checks passed on final packages, `packages-final.log`. |
| Copied website assemblies | Independent Vite/Next builds and form/navigation/keyboard checks passed, `website/consumers.log` and `.artifacts/website-blocks/`. |
| Additional visual/state checks | 145 data checks plus 16 statistic stress cases, 128 core checks, 64 date/numeric/sort checks, 24 Navbar checks, 14 assembled route/viewport checks and 16 admin theme/mode cases passed. Family notes and JSON files record their exact scope. |
| Independent review | Both findings resolved; final production check covers four complete nested chat close paths in normal/reduced motion, RTL 360×600. |

The broad suite passed before the last localized tooltip-layer correction; the affected five-journey suite, independent four-path check, build, type, lint and packed consumers passed afterward. No known failing check remains.

The existing dirty-form journey now waits for its lazy preview to appear before freezing the clock. Its discard, cancellation, failure, retry and stale-completion assertions are unchanged. Existing date, document, form, Navbar and rich-chat journeys were extended to cover tooltip composition and focus recovery. No cosmetic snapshot tests or new test framework were added.

Independent review caught and resolved the citation initial-focus/closing-tooltip issues and statistic alignment under missing or longer metadata. The detailed review is in [reviewer notes](../.artifacts/design-pass/reviewer-notes.md).

## Limits

Browser verification uses Chromium. Safari, Firefox, physical touch/IME devices and screen-reader speech were not exercised. Real authentication, storage, mail and other provider services were not used; demo/service boundaries remain explicit. Older browsers without CSS subgrid retain the natural-flow fallback, with less cross-card alignment. No publication, push or deployment occurred.

## Local commits and resume

Implementation is committed in six logical units: `2d69f9c` website layouts, `688d8ea` documents/reporting, `8a2930c` admin application, `be04b00` utility tooltips, `05cef61` catalog/copy, and `fc80a25` chat source controls. The report and session handoff follow in a documentation commit.

Worktree: `/Users/nationalbank/.codex/worktrees/evenkit-design-pass/design-tokens`, branch `codex/evenkit-design-pass`. The original checkout remains separate; these commits have not been integrated into it. Resume with `git status --short` and `git log --oneline 71f8aa6..HEAD` from this worktree. No required implementation work remains.
