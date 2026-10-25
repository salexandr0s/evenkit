# Component design improvement tracker

Completed 25 October 2026. This goal covered the 48 implemented Next items in [the inventory](./component-inventory.md). Implementation baseline: commit `686055c` (`feat(ui): build 48 priority components and page blocks`). The earlier [build tracker](./priority-build-plan.md) records that implementation; this document records the subsequent design work.

Implementation follows inventory order, one item at a time. Review and verification may run alongside the next item where file ownership is separate. Each item needs a concrete improvement to its component or recipe, a working catalog example, and proportionate verification before it is marked verified. Existing uncommitted work is preserved.

The design uses the existing Apple Minimal contract: clear typography, deliberate spacing, restrained surfaces, state-driven motion, eight themes, keyboard access and responsive layouts. Shared styles improve consuming applications as well as the catalog. Tokens, public APIs, native form semantics and existing interaction contracts remain the foundation.

## Item queue

| ID | Item | State | Changes and evidence |
| --- | --- | --- | --- |
| A01 | Typography and prose | Verified | Shared heading/paragraph rhythm, quote/code/link treatment and a complete reading specimen. Source/visual review and A checks passed. |
| A02 | Container and page width | Verified | Width measures with task-specific content, centered limits and long-word wrapping. Source/visual review and A checks passed. |
| A03 | Stack, inline group, responsive grid | Verified | Shrink-safe layout children and a project grid with deliberate ownership and status alignment. Source/visual review and A checks passed. |
| A04 | Separator | Verified | Horizontal section boundary and grouped vertical metadata rules in a complete review composition. Source/visual review and A checks passed. |
| A05 | Card | Verified | Consistent header/body rhythm, flexible card body and aligned action footers with owner context. Source/visual review and A checks passed. |
| A06 | Page header and section header | Verified | Stronger page/section type hierarchy, wrapping metadata, breadcrumb and aligned actions. Source/visual review and A checks passed. |
| A07 | Toolbar and action group | Verified | Draft context, grouped actions and persistent status with native Tab order. Source/visual review and A checks passed. |
| A11 | Accessibility helpers | Verified | Viewport-safe skip link, visible keyboard focus, reduced-motion support and live status specimen. Source/visual review and A checks passed. |
| B01 | Checkbox and checkbox group | Verified | Checkbox label/hint hierarchy, group spacing and delivery-preference specimen. Source/visual review and B checks passed. |
| B02 | Radio group | Verified | Separated radio choices with aligned descriptions and a persistent selected row boundary. Source/visual review and B checks passed. |
| B03 | Switch | Verified | Smooth fixed-track thumb travel, pending spinner, nested explicit RTL/LTR support and reduced motion. Source/visual review and B checks passed. |
| B04 | Toggle and toggle group | Verified | Distinct action-toggle borders and pressed fills; toggles format the preview note. Source/visual review and B checks passed. |
| B05 | Segmented control | Verified | Balanced segmented widths and a working project list/cards view. Source/visual review and B checks passed. |
| B06 | Button group | Verified | Single joined seams, raised focus, wrapped labels and correct mobile corners. Source/visual review and B checks passed. |
| B08 | Copy action | Verified | Source and copy action together, stable expandable feedback, pending/success/failure icons. Source/visual review and B checks passed. |
| C01 | Fieldset and form section | Verified | Stronger legend and section hierarchy, roomier field groups and responsive insets. Source/visual review and C checks passed. |
| C02 | Form error summary and status | Verified | Semantic error icon/header, restrained leading rule and roomier recovery links. Source/visual review and C checks passed. |
| C03 | Search field | Verified | Document search with result count, rich result rows, no-results guidance and separate secondary examples. Source/visual review and C checks passed. |
| C04 | Password field | Verified | Inset reveal action with stable geometry, preserved caret/focus and 44px touch height. Concurrent utility work replaced text with square reveal icons; current geometry rechecked. |
| C07 | Combobox and autocomplete | Verified | 6px popup inset, layered depth, reserved check gutter, distinct selected/highlighted states and short opening motion. Source/visual review and C checks passed. |
| C15 | Form actions and dirty-state recipe | Verified | Spaced form footer, stable expandable dirty indication and adjacent save/retry feedback. Source/visual review and C checks passed. |
| E01 | Tabs | Verified | Baseline-aligned underline, inset focus ring, refined pills and project detail panels. Source/visual review and E checks passed. |
| E02 | Accordion | Verified | Clear open framing, aligned content, 120ms opening reveal and immediate close with reduced-motion support. Source/visual review and E checks passed. |
| E03 | Collapsible | Verified | Default decorative chevron, preserved asChild composition and inset detail content. Source/visual review and E checks passed. |
| E04 | Breadcrumbs | Verified | Muted ancestors, strong current page, touch targets and explicit-direction-safe separators. Source/visual review and E checks passed. |
| E05 | Navbar/navigation menu | Verified | Active cues and responsive navigation; concurrent complete-header work adds grouped links, account/contact controls and website/application specimens. Final integration passed. |
| E06 | Pagination | Verified | Persistent selection, tabular numerals, changing records, coherent mobile grouping and correct RTL arrows. Source/visual review and E checks passed. |
| F01 | DropdownMenu | Verified | Aligned choice gutters, distinct pointer/focus treatment, directional opening and available-height menus. Source/visual review and F checks passed. |
| F02 | Popover | Verified | Roomier surface, paired title/description, field/action hierarchy and contextual sharing example. Source/visual review and F checks passed. |
| F03 | AlertDialog/confirmation | Verified | Record context, pending/retry hierarchy and closing-state input guards. Existing activation regression reproduced then passed. |
| F04 | Sheet/side drawer | Verified | Logical horizontal motion/corners, stretched notes field and useful review sections. Source/visual review and F checks passed. |
| G01 | Toast | Verified | Semantic icon surface, layered depth and independent opening/swipe feedback with compact controls preserved. Source/visual review and F checks passed. |
| G02 | Progress and meter | Verified | Distinct moving unknown-total segment, explicit completion, visible dark tracks and preparation/storage composition. Source/visual/runtime review passed. |
| G04 | Save/submission status | Verified | Quiet idle/dirty rows, saving spinner, semantic result frames and one persistent lifecycle status. Source/visual/runtime review passed. |
| H01 | Avatar and avatar group | Verified | 32/40/48px identity hierarchy, image reveal, stable fallback and wrap-safe overlapping groups. Source/visual/runtime review passed. |
| H02 | Tag/chip and tag group | Verified | Selectable check gutters, divided remove actions, clear focus and responsive touch targets. Source/visual/runtime review passed. |
| H03 | Description/data list | Verified | Stronger term/value hierarchy, deliberate row spacing and readable long values. Source/visual/runtime review passed. |
| H04 | List item and rich item row | Verified | Media/content/action hierarchy and container-responsive action placement, including narrow desktop panels. Source/visual/runtime review passed. |
| H08 | Keyboard shortcut/Kbd | Verified | Centered keycaps with consistent size, mono type, lower edge and readable shortcut groups. Source/visual/runtime review passed. |
| I01 | Semantic Table | Verified | Stronger caption/header/footer hierarchy, deliberate density and whole-word wrapping within contained scroll. Source/visual/runtime review passed. |
| I02 | Filter bar and filter field | Verified | Wrapping fields/actions, visible draft/update feedback and useful result context. Source/visual/runtime review passed. |
| I03 | Applied filters | Verified | Clear removable chip anatomy, active count and preserved deferred focus recovery. Source/visual/runtime review passed. |
| J01 | File input and dropzone | Verified | Icon/choice/constraint hierarchy and distinct drag, error, focus and disabled states. Source/visual/runtime review passed. |
| J02 | File row and attachment | Verified | File/state hierarchy, shared native progress and narrow-container action placement. Source/visual/runtime review passed. |
| M01 | Account menu | Verified | Identity header/trigger, conditional sections, appearance icons and stable keyboard pending/error focus. Source/visual/runtime review passed. |
| O02 | List/index page | Verified | Page hierarchy, explicit record count, working search/filter context, status badges and readable contained-scroll notes. Source/visual/runtime review passed. |
| O04 | Create/edit page | Verified | Sectioned form, persistent save status, body scrolling and clear pending/retry/cancel/discard actions. Source/visual/runtime review passed. |
| O11 | Error/access/offline pages | Verified | Distinct semantic icons, focused reading width and useful recovery actions for five states. Source/visual/runtime review passed. |

## Verification record

All 48 items are verified. Independent source and visual review is complete, and final integration checks passed. No required work remains for this design goal.

### A01–A07 and A11

Changed shared foundations styles, matching catalog specimens and the family contract. The catalog's heading/paragraph reset now has zero specificity so component typography remains authoritative. Public APIs are unchanged.

Production build, configured TypeScript and full ESLint passed. All 12 targeted Chromium journeys passed: four existing foundations interaction journeys and the eight item routes across eight themes, light/dark modes and 360/768/1024/1440px. There are 24 final captures without runtime errors or document overflow. Independent review inspected all eight light desktop specimens, selected dark views and five mobile views; no actionable findings remain. Review found and resolved the icon action's missing accessible name and the catalog margin reset before completion.

Evidence: `.artifacts/design-elevation/a-final-{build,typecheck,lint,browser}.log`, `a-final-shots/report.json` and its images. Baseline source/status are in `before/` and `initial-status.txt`; the baseline report covers 48 distinct routes and 144 captures. Firefox/Safari and physical mobile input remain untested.

### B01–B06 and B08

Changed shared selection styles and limited status markup, catalog specimens and the family contract. Public APIs, native forms, reset behavior and async guards remain. G02 is unchanged at this checkpoint.

Production build, configured TypeScript and full ESLint passed. All 15 relevant Chromium journeys passed, including seven routes across the theme/width matrix. Independent review inspected all seven light desktop specimens, four dark and four mobile views with no remaining findings. There are 21 captures without runtime errors or page overflow.

A supplementary runtime check caught Vite rewriting `:dir(rtl)` into language matching, which reversed the wrong switch direction in a container using explicit HTML `dir`. The fix uses an inherited private direction variable, including nested overrides. The existing switch journey now verifies the physical checked-thumb position in RTL and a nested LTR override; it reproduced the old failure, then passed with the fix. Both affected browser journeys passed after rebuilding. Supplementary checks confirm ±18px thumb travel in nested contexts, unchanged pending geometry, reduced motion, equal segment widths, working card view and joined-button corners at 360px.

Evidence: `.artifacts/design-elevation/b-{build,typecheck,lint,browser}.log`, `b-final-{build,typecheck,lint}.log`, `b-rtl-{reproduction,final-browser}.log`, `b-after-shots/`, `b-interactions.json`, and `switch-direction-check.json`. Directional switch motion follows explicit HTML `dir`; CSS-only direction and `dir="auto"` are outside this implementation.

### C01, C02, C03, C04, C07 and C15

Changed shared form styling, limited summary/password/combobox markup, catalog specimens and the family contract. Native form behavior and public APIs remain. SaveStatus (G04) is still pending, although its shared catalog composition benefits from C15.

Production build, configured TypeScript and full ESLint passed. All 11 relevant Chromium journeys passed: five existing form interaction journeys and six routes across the theme/width matrix. There are 18 normal-state captures without errors/overflow, four active error-summary/combobox captures, and three final password captures. Independent review inspected all six light desktop previews, four mobile and two dark views, plus the four active states.

Runtime measurement found the original Show/Hide text control changed width despite its minimum width, because the shared size selector won the padding cascade. A scoped 64px width and shrink guard fixed that geometry, and both affected browser journeys passed after rebuilding. Concurrent utility commit `6682c60` subsequently replaced the text with square reveal icons and tooltips; its updated geometry is preserved. Fresh measurements show stable 24×24px desktop and 44×44px narrow actions, with caret selection/focus retained. Combobox opening uses inspected Base UI attributes; closing remains immediate and dialog Escape/focus checks pass.

Evidence: `.artifacts/design-elevation/c-{build,typecheck,lint,browser}.log`, `c-final-build.log`, `c-password-final-browser.log`, `c-interactions.json`, `c-after-shots/`, `c-password-final-shots/`, and `c-*-active.png`. Current icon-action measurements and captures: `e-interactions.json` and `c-password-icon-{1440,360}.png`.

### E01–E06

Changed shared navigation styling and limited disclosure/pagination markup, all six catalog specimens and the family contract. Public APIs, native keyboard behavior, router contracts and navbar resize/focus recovery remain intact.

Production build, configured TypeScript and ESLint passed. All 12 existing navigation and theme/width journeys passed. Review found mobile pagination split its numbered range; choices now stay grouped, followed by a deliberate previous/next row with matching visual and DOM order. Both affected browser journeys passed after rebuilding. Independent review accepted all six light desktop/mobile views, four dark views and active disclosure/navbar/pagination views. The 18 normal captures and three final pagination captures have no runtime errors or document overflow.

Supplementary checks confirm explicit and nested LTR/RTL arrow direction, 120ms disclosure opening, immediate closed hiding and no reduced-motion animation. The first TypeScript attempt encountered concurrent icon/button work; the final configured check passed once those sources settled. The former preview on port5173 was no longer running; this goal owns a temporary preview on port5307.

Evidence: `.artifacts/design-elevation/e-{build,lint,browser}.log`, `e-final-typecheck.log`, `e-pagination-{build,browser,capture}.log`, `e-after-shots/`, `e-pagination-final-shots/`, `e-interactions.json` and `e-*-active.png`. Independent signoff is in `review-completion.md`.

### F01–F04 and G01

Changed shared overlay styles, local confirmation input guards, five catalog specimens and family documentation. Preserved concurrent compact utility icons/tooltips, modal-local portals and immediate toast removal. AccountMenu remains unchanged for its later M01 pass.

Production build, configured TypeScript and ESLint passed. All eleven relevant browser journeys passed across the initial run and focused reruns: six overlay interactions (including AccountMenu regression protection) and five theme/width routes. The confirmation extension first reproduced activation during a retained exit, then passed with local keydown/keyup/click capture guards. Toast and Sheet geometry checks now await their actual entrance animation before comparing resting geometry; the original exact assertions remain.

Independent review accepted all five active surfaces in light/dark desktop and light mobile, plus the mobile confirmation error. Review fixed a narrow Sheet textarea and a menu height cap that unnecessarily hid ordinary actions. There are 15 normal and 16 final active captures without runtime errors or overflow; active surfaces also fit every theme and both modes. Supplementary checks confirm six Sheet direction/override combinations with ±16px horizontal motion, zero vertical motion and correct physical corners; toast swipe moves 20px and cancels to zero, with no animation/transition under reduced motion.

Evidence: `.artifacts/design-elevation/f-{build,typecheck,lint,browser}.log`, `f-alert-reproduction.log`, `f-toast-final-browser.log`, `f-sheet-final-browser.log`, `fg02-browser.log`, `f-after-shots/`, `f-active-shots/`, `f-final-active.log` and `f-runtime.json`. Final menu/Sheet fixes were built in `g02-final-build.log`.

### G02 and G04

Progress retains its native element/ref/ARIA contract, with a decorative moving partial segment for unknown totals, centered without animation under reduced motion. Explicit dir props reach both native element and track; completed work has a check and default completion text while custom text remains intact. The meter keeps native bounds. Review corrected the unfilled track color so it remains visible on dark cards.

SaveStatus retains one ActionMessage root and public overrides. Idle/dirty are quiet, saving shows a decorative spinner, and success/error retain semantic frames. The preview has one lifecycle announcement and returns to idle when its edited value matches the saved value. Long custom content grows rather than clipping.

Production builds, configured TypeScript and ESLint passed. Both progress browser journeys and all three save/form-action journeys passed. Runtime checks confirmed four inherited/explicit progress directions, segment containment, reduced motion, completion, nonfinite normalization and custom/empty value text. Save checks confirmed persistent DOM across six state transitions, no nested statuses, disabled Save after restoring the original value, decorative reduced-motion spinner, null/false/custom icon overrides, custom role/heading/actions and wrapping long text. Independent review accepted final progress light/dark/mobile plus active states, and all nine save-status/form-action default/active views.

Evidence: `.artifacts/design-elevation/g02-final-build.log`, `g02-{typecheck,lint,runtime}.log`, `fg02-browser.log`, `g02-final-shots/`, `g02-runtime.json`, `g02-*.png`, `g04-{build,typecheck,lint,browser}.log`, `g04-shots/`, `g04-runtime.json` and `g04-*.png`. The final progress track color was built with G04.

### H01–H04 and H08

Improved Avatar sizes/fallback/image reveal and group overlap, Tag selection/removal anatomy, DataList term/value rhythm, rich row media/action placement and Kbd keycaps. Shared foundations and five catalog specimens preserve native semantics, image request identity and existing APIs.

Production build, configured TypeScript, ESLint and seven existing browser journeys passed. Independent review accepted all 15 default captures and three final rich-row captures. A narrow desktop host with long actions exposed a zero-width text column; a named container query now moves actions below the text based on the available component width. All 18 rich-row combinations pass, including optional media/actions, narrow desktop and mobile. Supplementary checks cover 18 Avatar cases, both tag states, image reveal and reduced motion, with no runtime errors or overflow.

Evidence: `.artifacts/design-elevation/h-{build,typecheck,lint,browser}.log`, `h-after-shots/`, `h-list-final-shots/`, `h-runtime.json`, and `h-runtime.list-narrow-desktop.png`. The final rich-row fix was built and regression-tested with I/J; before-state evidence is retained separately.

### I01–I03, J01–J02 and M01

Improved semantic table hierarchy/density, filter field/action grouping and feedback, removable chip anatomy, dropzone choice/constraint/state hierarchy, and file row metadata/progress/actions. AccountMenu now has a consistent identity header/trigger, correctly separated optional sections, appearance icons and pending/error feedback.

The rebuilt semantic table retains whole-word minimum widths and uses its existing contained scroll when needed. Review corrected an undefined file-error background token to the existing danger background. FileRow uses a named container query: at a 200px desktop host, readable content grows from 16px to 148px, with actions below; wide rows keep trailing actions. Runtime checks cover inherited disabled fieldsets, native/indeterminate/nonfinite progress, long filters and body-row header fills.

The AccountMenu supplementary fixture reproduced Enter leaving focus on a newly disabled Sign out item. Its local pending surface-focus guard prevents Radix's keyboard entry logic from moving focus back to that item. The existing browser journey now uses Enter for its first attempt: it failed before the guard and passes afterward. Eight optional-section combinations plus an error-only case have no empty/doubled dividers. Long names in 360px LTR/RTL preserve Avatar/glyph sizes and fit the menu. Normal keyboard entry, controlled appearance, pending focus, a single described error, retry/success and Escape restoration pass.

Independent review accepted all I/J default views, corrected narrow FileRow views, rebuilt mobile table/error views, and AccountMenu default/open/error/long-name views. Combined production build, configured TypeScript and lint pass; eleven targeted behavior/route journeys passed, followed by all 135 repository journeys. No runtime errors or unresolved findings remain for these six items. Temporary M fixture resources were removed.

Evidence: `.artifacts/design-elevation/ij-{build,lint,browser}.log`, `ij-after-shots/`, `ij-runtime-after.json`, `ij-runtime-after-file-*.png`, `mo-build.log`, `ijmo-browser.log`, `ijmo-final-shots/`, `m-ij-active-shots/`, `m-runtime.json`, `m-runtime-*.png`, `m-focus-reproduction.log` and `m-runtime-focus-reproduction.json`.

### O02, O04 and O11

The list block has a stronger page header, explicit record total, working SearchField and filter context, status badges and a persistent save result. Its Notes column has a block-local 260px reading minimum while preserving its string accessor for sorting/search. On mobile, notes stay readable within the existing horizontal scroll region instead of fragmenting into tall narrow rows.

The editor has separate details/notes sections, body scrolling and one persistent SaveStatus in the footer. Native external submission, validation, draft identity, abort handling and return focus remain intact. Recovery pages use five named decorative icons, a focused reading width and distinct actions. The 404 specimen has one destination; the public secondary action remains available.

Independent review accepted default and active light/dark/mobile views, short 360×600px editor states, all five mobile recovery variants, long-content dark RTL and the final scrolled notes view. Supplementary checks recorded 62 successful observations and 24 active captures. An initial recovery harness failed to reset same-hash state; a corrected blank-page setup completed the remaining cases without product changes. No runtime errors or actionable findings remain. The final Notes adjustment passed production build, configured TypeScript, focused lint, all six affected browser journeys and repeated packed Next/Vite block-consumer checks.

Evidence: `.artifacts/design-elevation/o-source-{lint,typecheck}.log`, `o-interactions.json`, `o-final-interactions.json`, `o-active-shots/`, `o-list-final-shots/`, `o-final-{build,typecheck,lint,browser,packages}.log` and `o-final-package-verification.json`.

## Final integration and completion

The complete Chromium suite passed all 135 journeys, including all 48 inventory routes across eight themes, light/dark modes and 360/768/1024/1440px. Production build, configured TypeScript, full ESLint, eight token tests, all 62 copied examples and exactly 48 priority mappings passed. Independent packed Next.js and Vite consumers passed production builds, SSR/native-prop checks, HTTP/stylesheet checks and copied page-block verification. The only source change between that full run and the final verification checkpoint was O02's local Notes renderer; the six affected journeys, build, configured types, focused lint and packed consumers passed again afterward.

A CSS reference audit found no undefined tokens across 32 shared/catalog stylesheets, accounting for the three measured runtime variables. All 291 source/config inputs were stable at the final verification checkpoint. Later handoff checks recorded concurrent Navbar follow-up changes to its shared component, catalog preview and browser test files. The observed paths are listed in `final-input-stability.json`; those newer contents are preserved and are outside this pass's validation claim. Independent source/pixel signoff for each family is in `.artifacts/design-elevation/review-completion.md`. The completed Navbar implementation superseded the earlier E05 specimen and was included in the passing final suite; its separate source/pixel review is recorded in the handoff. The subsequent Navbar follow-up is separate from that tested implementation. The compact utility controls and expanded animated icons are preserved.

Final evidence: `.artifacts/design-elevation/final-{typecheck,lint,token-tests,browser,examples,packages}.log`, `final-css-token-audit.json`, `final-input-stability.json`, `o-final-input-hashes.json` and the per-family records above. Goal-owned preview/fixture servers and independent consumer directories were cleaned up. Other previews were preserved.

Firefox/Safari and physical mobile input were not verified. This pass made no deployments. Its source and documentation are committed separately from concurrent Navbar and Hallmark work. See `SESSION_HANDOFF.md` for the local commit scope; no design queue items remain.

## Isolated commit verification

The local commit series contains this chat's 48-item design pass and popup-footer follow-up. Separate Navbar implementation/design and Hallmark edits were excluded, including their hunks in shared files. The navigation files use the saved E-pass snapshots from before the separate Navbar work. An isolated copy of exactly these runtime sources passed production build, configured TypeScript, full ESLint, eight token tests, all 130 included Chromium journeys, 62 copied examples/exactly 48 mappings, and independent packed Next/Vite builds with SSR/HTTP/CSS and copied-block checks. The five extra Navbar-header journeys belong to the excluded work. Logs are in `.artifacts/design-commits/isolated-*.log`; all work-tree source files were preserved while partial shared-file contents were staged.
