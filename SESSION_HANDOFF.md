# Session handoff: 25 October 2026

Project: `/Users/nationalbank/GitHub/design-tokens`. Branch: `codex/component-improvements`.

## Design commit series: 25 October 2026

Committed this chat's completed 48-item design pass and popup-footer follow-up in four logical units: foundations/forms, navigation, overlays/data workflows, and popup actions. Separate Navbar implementation/design, Hallmark, field-error and other pre-existing edits remain in the working tree. Shared navigation, catalog CSS, global CSS and handoff contents were staged selectively; no work-tree source files were replaced. The commits were not pushed.

An isolated copy of the exact runtime commit contents passed production build, configured TypeScript, full ESLint, eight token tests, all 130 included Chromium journeys, 62 copied examples/exactly 48 mappings and independent packed Next/Vite builds with SSR/HTTP/CSS/copied-block checks. The excluded Navbar work has five additional journeys; its absence explains the 130-test count versus the earlier combined 135-test run. Evidence: `.artifacts/design-commits/isolated-*.log`, `manifest.json`, planned patches and the saved preservation hashes. No additional implementation work was performed for packaging. Resume with `git log -4 --oneline` and `git status --short`; remaining edits belong to other work.

## Popup footer refinement: 25 October 2026

Refined the popup button area requested in the attached edit-project screenshot. Dialog, AlertDialog and Sheet now share a same-surface footer with a content-width hairline, 16px top padding and 8px action gaps. Removed the full-bleed dark band and negative margins; the existing 24/20px outer gutters, motion and scrolling remain. In RecordWorkflow, Reset changes is a small explicit non-submit button after Notes. The footer pairs persistent status with Cancel/Save on desktop, expands errors across the row, and puts an equal-width/equal-height action pair below status on mobile. Long desktop labels move to another row before compressing status.

Runtime changes are limited to `packages/ui/src/styles.css`, `packages/ui/src/data-workflows.css` and `registry/blocks/record-workflow.tsx`. Updated README, overlay and data-workflow contracts. Native form ID/submission, callbacks, draft/request cancellation, pending focus and the single SaveStatus node are preserved. Existing and concurrent changes remain intact; this refinement is included in the local design commit series.

Verification passed: production builds, configured TypeScript, full ESLint, seven existing dialog/confirmation/sheet/workflow Chromium journeys, and two affected record reruns after the wrapping fix. Twelve default popup captures cover Ocean dark/Neutral light desktop and dark mobile; three final editor views and active-state captures cover pending, failure/retry, cancellation, discard, short 360×600 windows, eight themes/both modes and long LTR/RTL labels. Runtime reports have no errors or overflow. Review caught and fixed a zero-width desktop status under very long actions and unequal mobile button heights. The final stress case retains a 510px-wide status on desktop and equal 123px-high mobile buttons. Firefox/Safari and physical touch were not tested; no permanent tests were added for the styling change.

Evidence is in `.artifacts/popup-footers/`: `source-changes.patch` isolates the three runtime-file edits from their starting state; `before/`, `after/`, `final/`, `runtime-final/` and `alignment-final/` contain comparisons and reports; logs record the exact checks. Independent review is in `review.md`. The owned temporary preview on 5313 is confirmed closed; other previews were preserved. No required implementation work remains. Resume with `git status --short` and that patch before committing overlapping files.

## Completed 48-item design goal: 25 October 2026

All 48 implemented Next inventory items were significantly improved in inventory order and independently reviewed. This completes the design goal based on user-confirmed implementation commit `686055c`. The authoritative per-item checklist and evidence are in `docs/component-design-elevation.md`. No required implementation or verification work remains.

Changes cover the six shared family modules/styles (`foundations`, `selection-controls`, `form-controls`, `navigation`, `overlays`, `data-workflows`), their catalog previews and family docs, the two editable record/recovery blocks, and a zero-specificity catalog margin reset. Existing switch and overlay browser journeys now cover reproduced RTL direction, confirmation exit-activation and AccountMenu keyboard pending-focus defects. Narrow rich/file rows use container width to keep text readable and actions reachable. Progress has a real indeterminate segment and reduced-motion state; SaveStatus preserves one lifecycle node. List Notes retain a readable width inside contained table scrolling. The page editor preserves native submission, drafts, aborts and focus while improving sections and save feedback.

Verification passed: production builds; configured TypeScript and full ESLint; eight token tests; all 135 Chromium journeys including 48 routes across eight themes, two modes and four widths; 62 copied examples/exactly 48 priority mappings; independent packed Next/Vite builds, SSR/native-prop, HTTP/CSS and copied-block checks. After the full run, the sole source change was the block-local Notes renderer. Its six affected journeys, build/typecheck/focused lint and packed consumers passed again. All 291 source/config hashes were stable at the final checkpoint. During handoff, concurrent Navbar follow-up changes reached its shared component, catalog preview and browser test files. Those later contents are preserved and were not reverified by this goal. See `final-input-stability.json` for observed paths. No undefined CSS token references remain across 32 shared/catalog stylesheets. Independent source/pixel review signed off all 48; supplemental states include keyboard/reduced-motion/RTL, long names and narrow containers, five recovery variants and short-window save/retry/cancel/discard.

Evidence is under `.artifacts/design-elevation/`: `review-completion.md`, `final-*.log`, `o-final-*.log`, `o-final-package-verification.json`, `final-input-stability.json` and family screenshots/runtime reports. The tracker describes intermediate reproduced failures and harness corrections separately from product fixes. Firefox/Safari and physical touch were not tested.

Concurrent complete-Navbar, Hallmark, compact utility and animated-icon work is preserved. The completed Navbar behavior and fixtures superseded the earlier E05 specimen and passed final integration before that later follow-up. This pass and its popup follow-up are committed locally; no deployment or push was performed. Separate Navbar and Hallmark work remains uncommitted. Root's temporary 5307 preview and M fixture 5393 are confirmed closed; independent consumers removed their own servers/directories; other previews are preserved.

Resume for review: `cat docs/component-design-elevation.md`, `cat .artifacts/design-elevation/review-completion.md`, `git status --short`. No further design implementation is required for this goal.

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

## Library sidebar: 25 October 2026

The component library now uses the public AdminShell, with icons for all 14 entries, magnetic edge dragging, one changing display button, and custom tooltips in the icon rail. Expanded, collapsed, and hidden modes persist through reloads. Search remains in the header in every mode. Theme selection, the sun/moon appearance button, native hash navigation, and browser history remain available.

Shared shell fixes keep nested resize handles independent, close the mobile drawer after home-link navigation, and measure the sticky header so skip navigation leaves the destination visible. Existing browser tests now scope embedded shell controls to their preview. Two library journeys cover mode changes, dragging, persistence, tooltips, nested shells, search, history, drawer focus, home navigation, and the skip destination.

Verification passed: source review, production build, configured typecheck, ESLint, all 41 Chromium journeys before the final home-link and skip-link fixes, and 17 affected journeys after those fixes. Packed Vite and Next consumers passed production builds, HTTP 200, and stylesheet delivery; owned servers and temporary consumers were removed. Logs: `.artifacts/catalog-sidebar-final-build.log`, `.artifacts/catalog-sidebar-final-browser.log`, and `.artifacts/catalog-sidebar-packages.log`. Package report: `.artifacts/catalog-sidebar-package-verification.json`.

Manual inspection covered expanded, compact, hidden, dragging, icon tooltips, and light/dark appearance. Screenshots: `.artifacts/catalog-sidebar-expanded.png`, `.artifacts/catalog-sidebar-compact.png`, and `.artifacts/catalog-sidebar-light.png`. Dark appearance and expanded navigation were restored; the temporary browser tab was closed and the existing preview on port 5173 preserved. Firefox and Safari were not tested. No work remains for this request; the earlier component goal remains complete.

A separate Hallmark visual pass began editing shared files after verification. Those edits are preserved outside this sidebar commit; recheck the working tree before continuing.

## Appearance icon: 25 October 2026

The catalog appearance dropdown is now one ghost icon button beside Theme. A moon switches to dark mode; a sun switches to light mode. The accessible action name and custom tooltip change with the glyph, while the button and keyboard focus remain stable. The catalog still follows a saved/default system preference until the user makes an explicit choice, which persists across reloads. The two-state button replaces the system selection menu.

Updated `apps/catalog/src/catalog.tsx/css`, related theme/chat preview guidance, and README. Existing Button tokens provide 40px desktop and 44px mobile targets; mobile alignment follows the bottom of the Theme select. Four existing browser test files now use the icon control. The appearance regression covers OS changes before manual selection, glyph changes, Enter/Space, tooltip naming, focus retention, persisted override, and mobile size.

Verification passed: plan/source review, production build, configured typecheck, focused ESLint, and all ten Chromium journeys in `catalog.spec.ts`, `themes.spec.ts`, `token-reference.spec.ts`, and `status.spec.ts`. Manual light/dark and 360px inspection passed. Firefox/Safari were not tested. Screenshot: `.artifacts/appearance-icon-dark.jpg`; preview: `http://127.0.0.1:5173/#chat`. Dark mode was restored and the temporary viewport override cleared. No work remains for this request.

Focused command: `KIT_CATALOG_PORT=5317 npx playwright test tests/browser/catalog.spec.ts tests/browser/themes.spec.ts tests/browser/token-reference.spec.ts tests/browser/status.spec.ts --workers=1 --output=.artifacts/appearance-icon-browser-results`.

## Badge design pass: 25 October 2026

Badges now use quiet semantic borders for both soft and outline variants, semibold labels, tabular numerals, and consistent 6px medium / 4px small icon gaps. Decorative content stays within its 16px slot; intrinsic width and inline alignment keep badges compact in lists and surrounding text. Existing 20/24px short-label sizes, semantic fills, long-label wrapping, native span semantics, and public props remain intact.

Changes are limited to the Badge block in `packages/ui/src/styles.css` and badge examples in `apps/catalog/src/status-preview.tsx/css`. Badge examples appear first and include status icons, contextual counts, RTL, longer text, and a small project list. Message examples and recovery behavior remain available.

Verification passed: plan/source review, `npm run build`, `npm run typecheck`, focused ESLint, eight token tests, and five Chromium journeys in `status.spec.ts` and `admin-kit.spec.ts`. Manual inspection covered light/dark appearance and 360px layouts. Firefox and Safari were not tested. References: `.artifacts/badge-design-light.jpg` and `.artifacts/badge-design-dark.jpg`. The stopped local preview was restarted on port 5173; Dark appearance was restored and temporary viewport emulation cleared. No badge work remains.

Focused verification command: `KIT_CATALOG_PORT=5317 npx playwright test tests/browser/status.spec.ts tests/browser/admin-kit.spec.ts --workers=1 --output=.artifacts/badge-design-browser-results`.

## Current state: component goal complete

All twelve planned areas and final integration are complete. The user-requested sidebar has expanded, icon-only, and hidden states, magnetic edge dragging, quick smooth transitions, one changing display button, custom icon tooltips, and distinct team/person icons. The broader queue and evidence are in `COMPONENT_IMPROVEMENTS.md`; earlier sections below preserve the history of separate work.

The final integration fixes every copied usage example into a typed standalone module, updates stale README/compatibility claims, and adds tooltip CSS to the existing packed stylesheet check. Review confirms all 14 catalog entries, 60 icons, 204 variables, eight themes, and 560 contrast pairs. Chat, themes, later tooltip/status styling, and chat motion were included. DataTable was committed as `efe41b9`; the final integration commit follows it.

Final source review has no findings. `KIT_CATALOG_PORT=5298 npm run verify` passed production build, configured type checks, ESLint, eight token tests, and all 39 Chromium journeys in 16 files. All 14 extracted snippets passed strict TypeScript with unused-code and CSS-import checks. `npm run verify:packages` passed Vite/Next installation, production builds, HTTP 200, Next server rendering, and stylesheet delivery, including tooltips and chat. Owned servers and temporary consumers were removed. Logs: `.artifacts/integration-verify.log`, `.artifacts/integration-packages.log`; report: `.artifacts/integration-package-verification.json`.

Manual final inspection covered the single sidebar control, drag/snapping, icon rail tooltip, distinct person/team icons, and dark chat overlay. References: `.artifacts/integration-sidebar.png`, `.artifacts/integration-sidebar-tooltip.png`, `.artifacts/integration-chat.png`. DataTable also has final light/dark references. Temporary browser tabs are closed; the user's existing tab, preview on port 5173, and Dark appearance were preserved. Firefox/Safari, production adoption, and real mobile keyboards remain unverified. Packages remain unpublished local pilots. No required goal work remains.

## Earlier continuation: DataTable complete

All twelve planned component areas are implemented and verified individually. DataTable now supports primitive wrap/truncate behavior with tooltips only for actual overflow, unclipped custom cells, nonsearchable columns, clear-search focus, displayed ranges, host selection actions, and clearing IDs across pages/filters. IDs survive temporary unavailable data. The preview demonstrates local archiving, rich rows, row review, state recovery, and reset. Public types, docs, and both packed fixtures cover the additions.

Async focus handling recovers disabled or removed table controls to the stable scroll region while preserving outside focus. Select closes an open popup when disabled. Two focused host-fixture journeys cover the page-size portal, search, row actions, and external focus; the fixture is bundled in memory without adding a product route. Overflow text opens its keyboard tooltip after focus-triggered scrolling settles. Custom dates stay on one line in the preview.

Verification passed: plan/source review, production build, configured type checks, ESLint, 22 affected Chromium journeys, and packed Vite/Next builds plus HTTP/CSS checks. After the final preview polish, seven table/admin/host journeys passed again. The table usage snippet passed independent TypeScript compilation. Package report: `.artifacts/table-package-verification.json`; temporary consumers and owned servers were cleaned. Screenshots: `.artifacts/table-dark-reference.png`, `.artifacts/table-light-reference.png`. Dark appearance was restored and the temporary tab closed. Firefox/Safari remain untested.

Only final integration remains. Audit found stale icon counts and package-verification scope in README, obsolete compatibility evidence, and copied examples with adjacent JSX roots or module-scope hooks. Correct those, check every usage snippet against actual exports, include tooltip CSS in the existing packed stylesheet check, then run the combined `npm run verify` and `npm run verify:packages`. Include separately added themes/chat and tooltip/status refinements. Keep the goal active until that evidence and final review pass.

## Earlier continuation: EmptyState complete

Eleven of twelve component areas are verified. EmptyState adds decorative icons, secondary actions (including secondary-only panels), small/medium sizing, logical start/center alignment, and `titleAs` for paragraphs, block content, or headings. The root div, native attributes/ref, and existing caller defaults remain compatible. Descriptions respect the reading-width token. No new dependency or token was added, and the component does not manage announcements or focus.

Key changes: `packages/ui/src/feedback.tsx`, the EmptyState block in `styles.css`, public exports, README, both packed fixtures, and new `apps/catalog/src/empty-preview.tsx/css`. The preview has working first-use/template/search/retry/troubleshooting examples with explicit focus recovery. `catalog.tsx` now returns focus to Search components after Clear search, reopening hidden mobile navigation first. The obsolete `control-previews.tsx` was removed.

Verification passed: plan/source review, production build, workspace/test typecheck, ESLint, 13 relevant Chromium journeys, and independent packed Vite/Next builds plus HTTP/stylesheet checks. The icon journey initially failed because its next keyboard action ran before Radix completed close autofocus; its choose helper now waits for trigger focus, preserving the final reset/search assertion. New tests cover both actions, focus, search counts/results, retry/help, secondary-only RTL recovery, and 360px overflow. Package report: `.artifacts/empty-package-verification.json`; temporary consumers and servers were cleaned. Light/dark screenshots: `.artifacts/empty-dark-reference.png`, `.artifacts/empty-light-reference.png`. Original Dark appearance was restored and the temporary browser tab closed. Firefox/Safari remain untested.

Next: DataTable, then final integration including separately added chat, themes, and tooltip/status styling. The goal remains active. Other chats committed `2f6ad38` (chat opening/closing) and `a0131d8` (message styling) during this work; their changes were preserved. Recheck git status before editing. Focused browser command: `KIT_CATALOG_PORT=5298 npx playwright test tests/browser/empty.spec.ts tests/browser/catalog.spec.ts tests/browser/admin-kit.spec.ts tests/browser/icon-reference.spec.ts tests/browser/token-reference.spec.ts --workers=1 --output=.artifacts/empty-browser-final`.

## Status message design pass: 25 October 2026

The status banners now have neutral surfaces, fine borders with a colored leading edge, and consistent 32px tinted icon tiles around the existing 20px SVG status symbols. Standalone text aligns with the icon; messages with headings use quieter body text and retain their action layout. The leading edge follows RTL and preserves tone when the icon is hidden. The ActionMessage API and announcement/retry/dismiss behavior are unchanged.

Only the ActionMessage block in `packages/ui/src/styles.css` and `apps/catalog/src/status-preview.tsx/css` changed for this request. Four compact message examples at the top of the preview match the screenshot's use case. Existing badge, recovery, custom-icon, hidden-icon, and RTL examples remain available.

Verification passed: production build, workspace/test typecheck, focused ESLint, both Chromium journeys in `tests/browser/status.spec.ts`, and source review. Manual checks covered light/dark, 360px wrapping, longer messages, actions, and custom/hidden icons. Firefox and Safari suites were not run. References: `.artifacts/message-design-light.jpg` and `.artifacts/message-design-dark.jpg`. Preview: `http://127.0.0.1:5173/#status`. The stopped preview server was restarted; the observed Dark selection was restored after inspection.

Concurrent EmptyState and chat work belongs to other chats. Preserve those edits, especially adjacent shared CSS and `feedback.tsx`. Focused check: `KIT_CATALOG_PORT=5317 npx playwright test tests/browser/status.spec.ts --workers=1 --output=.artifacts/message-design-browser-results`.

## Earlier continuation: loading complete

Spinner and Skeleton are complete; ten of twelve component areas are now verified. `packages/ui/src/feedback.tsx` adds Spinner size/ref support and Skeleton variant/size props; shared CSS preserves the 20px spinner and 40px block defaults, fixes text-line minimum heights, and keeps avatars square when narrow. Low-specificity selectors preserve custom class overrides. Public exports, README/provenance, and packed Vite/Next fixtures cover the additions. No new dependency or token was added.

`apps/catalog/src/loading-preview.tsx/css` supplies an initially loaded project card, a persistent enabled Reload project button, one status outside the busy content, and decorative spinner/skeleton specimens. Reload restarts one 1200ms timer; unmount cancels it and completion never moves focus. Hidden loaded content preserves the card footprint beneath a placeholder overlay. The old LoadingPreview and its obsolete catalog CSS were removed. `tests/browser/loading.spec.ts` covers restarts, focus, roles, sizes, and responsive geometry; the catalog reduced-motion assertion now handles the three spinner specimens.

Verification: plan/source reviews, production build, configured workspace/test typecheck, ESLint, 12 relevant Chromium journeys (loading, button, catalog, admin), and independent packed Vite/Next builds plus HTTP/CSS checks passed. The package report is `.artifacts/loading-package-verification.json`; its temporary consumers and servers were cleaned. Manual light/dark inspection passed. Screenshots: `.artifacts/loading-reference.png` and `.artifacts/loading-dark-reference.png`. The temporary browser tab was closed and original Light appearance restored. Firefox/Safari remain untested.

Next: EmptyState, then DataTable, then final integration including the separate chat, theme, and tooltip additions. The active goal is not complete. The previous goal turn made progress in fa5586f; this turn completes area 10. Tooltip work is now committed as a5a4c70 and was preserved. Recheck git state before editing because other chats share this checkout.

## Tooltip design pass: 25 October 2026

The separate tooltip design goal is complete. `packages/ui/src/tooltip.tsx/css` now uses the theme's elevated surface and foreground, a fine border, medium radius, and an outlined arrow. The existing medium shadow keeps the light surface distinct from adjacent controls. The inner height cap accounts for both borders. The public API, 280px width cap, hover delay, keyboard behavior, and collision handling are unchanged.

`apps/catalog/src/tooltip-preview.tsx/css` places the sharing hint below its trigger, shortens it to the supplemental visibility detail, and keeps invitation and permissions guidance visible. Space below the trigger keeps the hint clear of the next section.

Verification passed: production build, configured workspace/test typecheck, focused ESLint, eight token tests including theme contrast, and all six Chromium journeys in `tests/browser/sidebar-tooltip.spec.ts`. Plan and source review found no remaining issues. Manual inspection covered all four arrow directions and light/dark appearance. A final shadow-only adjustment was rebuilt and inspected. Firefox and Safari suites were not run. References: `.artifacts/tooltip-design-light.jpg` and `.artifacts/tooltip-design-dark.jpg`.

Preview: `http://127.0.0.1:5173/#tooltips`; original Neutral/Light selection restored. This goal does not complete the broader component queue below. Resume with `git status --short` and `npm run build`; focused browser command: `KIT_CATALOG_PORT=5317 npx playwright test tests/browser/sidebar-tooltip.spec.ts --workers=1 --output=.artifacts/tooltip-design-browser-results`.

## Feedback pass: complete

Badge and ActionMessage are complete, bringing the component goal to nine of twelve areas. `packages/ui/src/feedback.tsx` and the targeted shared CSS add badge sizes/variants/icon/dot/wrapping and message warning/heading/actions/custom-icon composition. Root element/ref/native-title/role contracts remain compatible. Three feedback icons and their exports/catalog metadata bring the icon set to 60. README, UI provenance, icon guidance, and both packed fixtures cover the public API.

`apps/catalog/src/status-preview.tsx/css` replaces the old static StatusPreview. It demonstrates retry/dismiss/reset with timer cancellation and stable focus, plus static notes, RTL, long labels, and custom icons. `tests/browser/status.spec.ts` adds two journeys for those behaviors and responsive geometry. Review caught and fixed missing 20/24px minimum badge heights. Retry transfers focus before becoming disabled; completion never steals focus.

Verification: production build, configured workspace/test typecheck, ESLint, eight token tests, all 32 Chromium journeys, and independent packed Vite/Next builds plus HTTP/CSS checks passed. The report was copied to `.artifacts/feedback-package-verification.json`; temporary consumers and owned servers were cleaned. Manual light/dark status inspection and the single sidebar cycle passed. Screenshots: `.artifacts/status-reference.png`, `.artifacts/status-dark-reference.png`, `.artifacts/sidebar-single-control.png`. The temporary browser tab was closed and its original Light appearance restored. Firefox/Safari remain untested.

Next: Spinner/Skeleton, then EmptyState and DataTable, then final integration including separately added chat and themes. The goal remains active. New concurrent tooltip edits appeared in `packages/ui/src/tooltip.tsx/css` and `apps/catalog/src/tooltip-preview.tsx/css` after this feedback verification; preserve them and do not stage them in the feedback commit. Recheck working-tree ownership before starting the next area. Earlier theme/chat sections below are historical context.

## Theme expansion: 25 October 2026

The separate theme goal is implemented: six additional palettes (Graphite, Linen, Ocean, Dusk, Clay, Rose) bring the kit to eight themes and sixteen light/dark combinations. Each new palette defines coordinated surfaces, primary/secondary text, control borders, and action states. Linen uses local Georgia headings with the shared system body font. The 204-variable contract and component dimensions remain unchanged.

`packages/tokens/src/themes.ts` owns the palettes. `schema.ts` now checks secondary text and inset focus rings against `accent-soft`, used by chat history and selected controls. Grove's dark selected background changes from `#14532D` to `#123D24`, improving secondary-text contrast from 3.55:1 to 4.77:1. Custom brands may need adjustments for the stricter validation; this is documented in `packages/tokens/README.md` and `PROVENANCE.md`.

`apps/catalog/src/theme-preview.tsx/css` adds `/#themes`, with eight comparison cards, actual semantic swatches, and keyboard-operable Apply buttons. Catalog toolbar/card selection and persistence use the same state. All previews follow resolved appearance; portals use the document theme. `tests/browser/themes.spec.ts` checks computed colours/fonts, keyboard apply, persistence, mode precedence, independent card palettes, responsive widths, and a Linen dialog. Root README and `docs/compatibility.md` describe the new options.

Verification: independent static review passed. All 560 contrast pairs (35 × 2 × 8) pass; every new-theme text pair exceeds 5:1. Token build, focused lint, and eight unit tests passed in the shared checkout. Full build/typecheck initially encountered concurrent unfinished feedback changes importing missing CircleCheckIcon, InfoIcon, and TriangleAlertIcon. They are unrelated to this goal and were preserved. An isolated copy of `88c8c93` plus only this goal's changes passed production build, workspace/test type checks, ESLint, eight token tests, eight Chromium journeys, and packed Vite/Next consumer builds plus HTTP/stylesheet checks. Its verified catalog output was copied to the existing preview on port 5173. The package report is `.artifacts/theme-package-verification.json`. Firefox and Safari were not tested.

The theme work is separate from the earlier component-improvement queue below. Preserve concurrent changes in `packages/ui/src/feedback.tsx` and `styles.css`; do not stage or revert them as part of themes. Recheck their state before a shared build. Resume with `git status --short`, `git log --oneline -5`, and `npm run build`; the theme browser checks are `tests/browser/themes.spec.ts`, `token-reference.spec.ts`, and `catalog.spec.ts`. User-facing preview: `http://127.0.0.1:5173/#themes`.

## Earlier component work

The user's goal was to substantially improve every component one by one. All twelve areas and final integration are complete. The user explicitly moved sidebar work next and added reusable tooltips and more icon variety. Queue and evidence are in `COMPONENT_IMPROVEMENTS.md`.

## Completed

- Tokens (`ea8bacc`): searchable variable reference, copying, specimens, and 33 contrast pairs. Subsequent Dialog/Tooltip/AdminShell additions bring the reference to 204 variables.
- Icons (`f3b69f9`, expanded in `a5d173a`): search, categories/aliases, sizes, named imports, accessible examples. Sidebar work brought the set to 53 wrappers, including distinct UserIcon and UsersIcon; concurrent chat work adds more.
- Buttons (`829c1a2`): icon shape/slots, full width, pressed state, stable loading, touch targets.
- Fields (`edc880b`): shared frame, TextareaField, label cues, stable adornments, native refs/descriptions, RTL/wrapping, validation/reset focus, read-only states.
- Select (`1dfd7f9`): grouped/described options, SelectField, empty-menu focus/recovery, intrinsic popup sizing, touch/RTL layout, validation/form examples.
- Dialog (`3030904`): three widths, header/body/footer composition, optional body scrolling, short-window fallback, logical close/title spacing, edit/brief/RTL examples.
- Tooltips and AdminShell (`a5d173a`): reusable custom tooltips, three sidebar display modes, mobile/focus recovery, icon expansion.
- Sidebar drag refinement (commit includes this handoff): magnetic edge dragging, 160ms transitions, one changing cycle button, keyboard resizing, cancellation, and reduced motion.

## Sidebar and tooltip implementation

- `packages/ui/src/admin-shell.tsx/css`: exported AdminSidebarState=`expanded|collapsed|hidden`; controlled sidebarState/onSidebarStateChange or uncontrolled defaultSidebarState. Widths 260/72/0 in a stable animated two-column grid. One stable header button cycles expanded→collapsed→hidden→expanded; icon/name/tooltip describe the next action. compactBrand/compactFooter and AdminNavItem.end are additive. Legacy missing icons get CircleIcon. Active links use the accent surface and logical inset indicator.
- Internal `use-admin-sidebar-drag.ts` tracks a temporary width from the actual rendered start width, with 24px magnetic attraction, pointer capture, and nearest-mode release. Callbacks fire only on changed-mode commits. Escape, pointercancel/lost capture, external state changes, unmount, and mobile resize clean up. Live frame width/handle visibility guard move and release against observer lag. No animation while dragging; normal settle is 160ms, reduced motion disables it.
- The separator stays outside the inert/clipped sidebar and remains reachable at width0; it has a visible grip, 44px coarse-pointer hit area, keyboard arrows with RTL direction, Home/End, numeric values/state text, and an aside ID association. Fixed inner widths prevent label reflow during movement. Sidebar focus tracking handles inert blur without stealing separator focus.
- Custom renderLink retains its ReactNode return API through an internal forwarded NavLink. Consumers must spread supplied native props, events, ARIA attributes, and anchor ref. Collapsed links have accessible names independently of tooltips.
- Navigation receives actual collapsed mode separately from tooltipsEnabled=wideLayout. Visible focus/hover intent is retained before the ResizeObserver state commits; rendering is gated by wideLayout. Narrow cleanup checks actual visibility to avoid erasing new desktop intent. Header tooltips use the same visibility rule. Existing mobile drawer closes on route selection, Escape, outside click, and container growth.
- Guarded onBlurCapture on sidebar and desktop controls recovers focus to the visible mobile menu when CSS hides the focused target. Controlled hiding uses a layout effect to focus Expand sidebar. No global focus tracker.
- New `packages/ui/src/tooltip.tsx/css`: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent; Radix 1.4.1 dependency. Custom inverse surface, arrow, wrapping/scrolling, 280px width cap, 400ms hover delay, immediate keyboard focus, reduced-motion support. Content owns its wrapper/arrow and deliberately omits asChild; Trigger supports it. Portal container, refs, and forceMount supported.
- `packages/tokens/src/foundation.ts`: layout.sidebarCollapsed=72px, layout.tooltip=280px, motion.delay.tooltip=400ms, with provenance. All 204 resolved variables appear in the existing reference.
- `packages/ui/src/icons.tsx`, catalog metadata, public exports, and docs add 22 wrappers (53 total). UserIcon is the individual-person glyph, UsersIcon the team glyph. Static wrappers preserve accessibility, refs, token sizes, and tree shaking.
- Catalog has a new Tooltips entry (12 entries total), bookmark/help/placement examples, controlled shell preview, navigation counts, and single-person team rows. README and both packed consumer fixtures cover the public additions.
- `tests/browser/sidebar-tooltip.spec.ts`: six journeys covering the single cycle control, modes/space, pointer tracking and snapping, hidden restoration, Escape/mobile cancellation, separator keyboard/RTL and values, reduced motion, icons, tooltips, mobile focus, immediate focus after resize, controlled hiding, and viewport bounds.

## Verification

Production build, workspace/test type checks, ESLint, seven token tests, all 23 Chromium journeys, and packed Vite/Next consumers passed during this update. Independent consumers built and passed HTTP/stylesheet checks; their owned servers and temporary directory were removed. After the final focus/resize fixes, UI/catalog builds, type checks, lint, and all seven affected sidebar/tooltip/admin journeys passed again. No remaining review findings.

The later drag/single-button refinement passed build, types, lint, nine affected Chromium journeys, and independent packed Vite/Next builds plus HTTP/CSS checks in an isolated copy of `a5d173a` plus only the sidebar source/test changes. Its first pointer test caught a release-before-observer race, fixed with live geometry checks. The shared workspace build also passed after concurrent chat files landed. Source review has no remaining findings. The isolated preview was stopped and its verification directory moved to Trash; its package report is saved in `.artifacts/sidebar-package-verification.json`.

Root inspected dark dragging, the single changing icon, and restoration from hidden. Screenshot `.artifacts/sidebar-drag-reference.png` records the refinement; `.artifacts/sidebar-reference.png` records the prior tooltip work. Firefox and Safari remain untested.

Unrelated chat-component work is occurring concurrently in this same checkout, including shared README/catalog files and UI exports/icons/bundling. Preserve it. Stage only the sidebar hunks in shared files; do not include or revert other work. Integrate newly added components into the final goal review once that work is complete.

## Remaining work

No required work remains for this goal. Final integration resolved the copied-example and stale-documentation findings and verified the combined library. Optional future browser/platform coverage is documented in `docs/compatibility.md` and is not a completion blocker.

Keep plan/review, relevant verification, and logical local commits. Shared source/CSS ownership must remain sequential.

## Local preview

Pre-existing production preview: `http://127.0.0.1:5173/#admin-shell`, serving rebuilt catalog. Recheck process ownership before stopping it. The user's existing browser tab was preserved; a separate verification tab was closed. Saved screenshots are in ignored `.artifacts/`. Packages remain unpublished local pilots.

## Resume

```sh
git status --short
git log --oneline -8
cat COMPONENT_IMPROVEMENTS.md
cat packages/ui/src/feedback.tsx
```

Read relevant UI contracts before changes. Build packages after public source changes and catalog before checking the production preview. Existing `/root/tokens_implementation`, `/root/tooltip_implementation`, `/root/audit`, and `/root/review` agents can be reused with followup_task. Configured specialist roles use an unavailable model, so inherited-model explicit assignments are required. Workspace instructions require delegated implementation/review and avoid-ai-writing. Developer authorization covers reversible goal work without repeated approvals. Do not mark the goal complete until every queue item and final integration review passes.

## Reusable AI chat addition

The user requested a reusable chatbot based on `brainwave_site` within the kit's current tokens. This addition is complete; the earlier component improvement queue above remains separate.

- `ChatWidget` provides a floating launcher, compact modal, and maximized workspace; `ChatPanel` embeds the same UI. Both use one stable surface across resizing. Source is in `packages/ui/src/chat*.tsx`, `chat-types.ts`, and `chat.css`.
- Conversations, messages, drafts, response status, and callbacks belong to the host. The UI includes searchable history, new/delete actions, suggested prompts, multiline/IME-safe entry, stop/retry/copy, bounded scrolling, and a keyboard-accessible jump action. Plain text is safe by default; a renderer hook supports product content. The kit adds no transport, storage, dependency, or foundation token.
- Brainwave's source sidebar is a question outline within one conversation. The kit instead accepts genuine saved-conversation metadata, matching the user's requested history behavior.
- Four named icons were added (57 total). Public exports and packed CSS include chat. The catalog has 13 entries; `/#chat` demonstrates per-conversation drafts and simulated responses with cancellation. Documentation: `docs/chat.md`. Independent Vite and Next fixtures exercise the public API.
- Verification: production build, workspace/test typecheck, ESLint, four chat Chromium journeys, and seven catalog/icon journeys passed. Packed Vite and Next consumers built and passed HTTP/SSR/stylesheet smoke checks. Final focus-only fixes were subsequently rebuilt, typechecked, linted, and browser tested. Static review found no remaining issues. Native preview checked light/dark compact and expanded views. Firefox/Safari and a real mobile software keyboard were not tested.
- Browser tests caught Stop changing into a submit button during its click. Distinct keyed buttons plus default prevention preserve the next draft and return focus. Resize and jump focus regressions are covered. Transcript uses a named region with a separate status announcer so Radix can hide the background transcript when the widget opens.
- Use isolated browser test output when concurrent runs share this checkout: `KIT_CATALOG_PORT=5297 npx playwright test tests/browser/chat.spec.ts --workers=1 --output=.artifacts/chat-browser-results`. The initial shared output run collided with another runner's artifact cleanup; the isolated final run passed.
- User-facing preview remains open at `http://127.0.0.1:5173/#chat`; screenshot `.artifacts/chat-reference.png`. AI replies in the catalog are samples. Projects connect their own service and persistence using the integration guide.

The concurrent sidebar change was committed separately as `7976024`; its files were preserved.

Chat motion follow-up: maximize/restore now transition size, position, and corners with the existing 220ms duration and standard easing. Both sizes keep the same logical end anchor, including RTL, so position interpolates without an auto-to-zero jump. The panel inherits the animated radius; reduced motion disables the transition. Production build and all four chat Chromium journeys passed after this CSS-only change.

Chat open/close follow-up: the panel fades and moves by the existing space-3 token on entry (220ms) and exit (160ms); the backdrop fades with it and the launcher fades between visibility states. Radix's data-state animations retain the closing content until its exit completes. Reduced motion disables these animations and transitions. Production build and all four chat Chromium journeys passed. The user's preview had moved to Fields during verification, so it was left undisturbed; refresh to load the rebuilt CSS.
