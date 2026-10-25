# Session handoff: 25 October 2026

Project: `/Users/nationalbank/GitHub/design-tokens`. Branch: `codex/component-improvements`.

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
