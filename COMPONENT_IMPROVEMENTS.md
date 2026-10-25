# Component improvement goal

Requested on 25 October 2026. Goal: review every component one by one, make substantial improvements, and verify each before moving on. Work runs on `codex/component-improvements`.

Keep the existing public API compatible. Preserve all built-in themes, document-level theming, token-based dimensions, prefixed package CSS, and independent Next/Vite installation. Improvements should make the component more useful, easier to understand, or safer to compose. Changes to an already sound primitive need a concrete reason.

## Queue

| Order | Area and public components | Planned outcome | Status |
|---|---|---|---|
| 1 | Design tokens | Search every resolved CSS variable, copy its usage, inspect visual scales and defined contrast pairs for the current theme. | Complete |
| 2 | Icons: all named wrappers | Search categories and aliases, select preview size, copy named imports, and demonstrate decorative, labelled, and action use. | Complete |
| 3 | Button, ButtonLink | Icon-only sizing, leading/trailing icons, full-width layout, clearer variant hierarchy, and a working asynchronous loading example. | Complete |
| 4 | Label, Input, Textarea, TextField, TextareaField | Shared field composition, textarea field, required/optional cues, adornments, read-only styling, and validation focus recovery. | Complete |
| 5 | Select, SelectField | Grouped and described options, empty-options feedback, shared field composition, and long-label handling while preserving compact rows. | Complete |
| 6 | Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter | Size and layout composition, long-content scrolling, reachable actions, mobile presentation, and logical RTL positioning. | Complete |
| 7 | TooltipProvider, Tooltip, TooltipTrigger, TooltipContent | Custom theme-aware surfaces, hover/focus behavior, dismissal, wrapping, and reusable positioning. | Complete |
| 8 | AdminShell | Expanded, icon-only, and hidden modes; restore controls, navigation icons/tooltips, compact slots, badges, mobile and focus recovery. | Complete |
| 9 | Badge, ActionMessage | Status icons, wrapping labels, message titles/actions, warning feedback, and a retry/dismiss example. | Complete |
| 10 | Spinner, Skeleton | Token sizes, text/avatar/block skeletons, and a loading-to-content example with one accessible announcement. | Complete |
| 11 | EmptyState | Icon slot, heading semantics, secondary action, compact layout, and distinct first-use, no-results, and failure examples. | Complete |
| 12 | DataTable | Per-column wrapping, usable custom action cells, clear search, displayed-row range, selection clearing/bulk actions, and improved state presentation. | Complete |

On 25 October the user moved sidebar work next, requested a reusable tooltip design, and asked for more icon variety. Tooltip and AdminShell therefore precede feedback, and the icon family was expanded as part of that work.

After the queue, review the catalog frame, usage snippets, exports, documentation, and packed consumers together. Record any justified departures from this plan beside the affected item.

## Work cycle

1. Inspect the component, its preview, and existing tests; state the intended improvement.
2. Review the plan, then implement that component. Keep shared-file ownership sequential.
3. Check types and lint, exercise affected interactions, and inspect light/dark and narrow layouts. Add regression tests for meaningful behavior rather than static styling.
4. Resolve review findings, record evidence here, and commit a reviewable unit before starting the next component.

Final verification includes the repository checks and independent packed Next/Vite consumers after public package changes. Do not mark the goal complete until every queue item and integration review is verified.

## Evidence

### 1. Design tokens

The reference exposes all 199 resolved variables in eight categories plus an All tokens view, with semantic roles separate from raw palette values. Search and category filters persist across appearance changes. Copy actions provide the variable expression and report clipboard failure without hiding selectable text. Visual samples cover colors, spacing, type, radius, border, and shadow values. The expandable contrast panel evaluates all 33 defined pairs for the current theme. A live form demonstrates themed controls.

Plan and source reviews passed. Explicit list semantics were added after review. Obsolete preview styles were removed. Package APIs and validated theme values remain unchanged.

Verification: production build, workspace/test type checks, ESLint, and all seven token tests passed. Seven Chromium journeys passed (six existing catalog journeys plus the new token reference journey); the token journey passed again after the list-semantics change. Coverage includes exact variable completeness, copying and denial recovery, filter reset/focus, live theme values and contrast, and long font values at 360/768/1024/1440px. Light and dark views were inspected in the app browser. Screenshot: `.artifacts/token-reference.png`.

### 2. Icons

All 31 public wrappers appear in a reference with readable names, category and alias filters, actual 16/20/24px size previews, and named-import copying. Import expressions remain selectable if clipboard access fails. Reset restores all icons and search focus while preserving the chosen size. Three working examples distinguish icons beside visible text, labelled icon actions, and independently labelled images. Metadata stays in the catalog; package exports and tree shaking are unchanged.

Plan and implementation reviews passed. Catalog build, workspace/test type checks, ESLint, and the focused Chromium icon journey passed. The journey checks the gallery against public icon exports, alias/category intersection, keyboard copying and denial recovery, size changes, reset focus, accessible names, and 360px wrapping/touch targets. Light and dark views were inspected. Screenshot: `.artifacts/icon-reference.png`.

### 3. Buttons

Button and ButtonLink now share explicit icon-only sizing, leading/trailing icon slots, and full-width layout. Icon shape takes precedence over full width. Decorative icons remain outside accessible names. Loading retains the label and dimensions, disables duplicate activation, and reports busy state; caller-supplied busy state also works independently. Pressed buttons have a visible inset state. Default sizes remain 32/40/48px, with at least 44px targets on narrow screens and coarse pointers.

The catalog demonstrates asynchronous saving, toggle state, icon actions, native links, and wrapping full-width labels. Other actions give local feedback. Existing usages, refs, native attributes, and inline children remain compatible. Documentation and both packed consumer fixtures cover the new composition props and exported ButtonShape type.

Plan and implementation reviews passed. Production build, workspace/test type checks, ESLint, seven token tests, and all 13 Chromium journeys passed. Two new button journeys cover loading dimensions and names, duplicate prevention, pressed/busy semantics, decorative slots, desktop/narrow/coarse-pointer sizing, icon/full-width precedence, wrapping, and keyboard link navigation. Independent packed Vite and Next consumers built and passed HTTP/stylesheet checks; their temporary directories and server processes were removed. Light and dark views were inspected. Screenshot: `.artifacts/button-reference.png`.

### 4. Fields

TextField and the new TextareaField share one internal frame for labels, hints, errors, IDs, and description associations. Label supports required/optional cues; native required semantics remain on the control. Input accepts leading and trailing text, icons, and independently labelled actions. A stable wrapper preserves the native node and focus when slots appear or disappear. Read-only controls remain selectable and have a distinct surface. Sizes are 32/40/48px with 44/44/48px narrow and coarse-pointer targets. Textarea keeps native resizing and rows.

The form preview demonstrates optional multiline notes, a character counter linked through an external description ID, live correction after submission, first-invalid focus, and reset/focus recovery. Other examples cover clear actions, text suffixes, long paired adornments, RTL layout, and read-only/disabled/error states. Documentation explains the wrapper's effect on direct-child selectors and caller responsibility for custom action states. Packed fixtures import TextareaField and its public props type.

Plan, implementation, and test/documentation reviews passed. Review found and resolved long adornment overflow and missing wrapper direction; visual inspection also improved the space available to short suffixes. Production build, workspace/test type checks, ESLint, seven token tests, all 14 Chromium journeys, and independent packed Vite/Next consumers passed. After the final CSS spacing refinement, UI/catalog builds and all seven field/catalog journeys passed again. Coverage includes external descriptions, native FormData, validation/reset focus, input identity through conditional slots, enabled read-only controls, touch sizes, long-slot geometry, RTL order, and overflow at 360/768/1024/1440px. Package verification cleaned its own servers and temporary directory. Light and dark views were inspected. Screenshot: `.artifacts/field-reference.png`.

### 5. Select

Select accepts flat or mixed grouped options, with named group headings and optional descriptions associated with each item. The closed trigger, typeahead, and native form labels retain only the option label. Empty groups are omitted; an empty menu provides a status message, keyboard focus, Escape dismissal, and trigger focus recovery. SelectField reuses the shared label/hint/error frame and preserves external description IDs and the trigger ref.

Plain rows remain 36px on desktop and 44px on narrow or coarse-pointer screens. Described rows grow to fit. Popups expand for narrow triggers and constrain long content to available space. Review caught a narrow table-selector regression; intrinsic sizing now keeps two-digit options on one line. Large triggers retain 48px touch height. The preview covers grouped validation/reset, flat form values, loading sample options into an empty group, long labels, and RTL alignment. Documentation and packed fixtures cover the new public types and field composition.

Plan, implementation, and test/documentation reviews passed. Production build, workspace/test type checks, ESLint, seven token tests, all 17 Chromium journeys, and independent packed Vite/Next consumers passed. New journeys verify grouped keyboard/typeahead navigation, disabled-option skipping, descriptions, invalid/reset focus, native form values, empty-menu focus/recovery, long-label bounds at 360/768/1024/1440px, RTL geometry, and wide-screen touch targets. The existing table journey now protects compact page-size options. Package verification removed its own servers and temporary directory. Light and dark grouped menus were inspected. Screenshot: `.artifacts/select-reference.png`.

### 6. Dialog

DialogContent now supports small/medium/large widths and optional body scrolling. The default keeps whole-content scrolling compatible with existing consumers. New DialogHeader and DialogBody components work with DialogFooter to keep headings and actions visible around long content. Short windows (640px high or less) use whole-content scrolling so every section remains reachable. Two layout tokens add the contract's 420/720px sizes around the existing 560px default, bringing the resolved reference to 201 variables.

Close controls use logical placement and 44px narrow/coarse-pointer targets. Title spacing follows direction and close-button visibility. Review also found physical title padding in the admin drawer; logical padding now reserves enough room for its close control in both directions. The catalog demonstrates required validation, external footer form submission, saved versus discarded drafts, a long brief with title autofocus, and an RTL example. Documentation and both packed consumers cover the new exports.

Plan, source, and integration reviews passed. Production build, workspace/test type checks, ESLint, seven token tests, all 19 Chromium journeys, and independent packed Vite/Next consumers passed. New and extended journeys cover first-invalid focus, draft recovery, footer form association, focus containment/restoration, Select layering, body scrolling with stable actions, short-window field/action reachability, 360/768/1024/1440px sizing, RTL title clearance, coarse-pointer close targets, and RTL drawer positioning. Package verification removed its servers and temporary directory. Light and dark dialogs and the RTL example were inspected. Screenshot: `.artifacts/dialog-reference.png`.

### 7. Tooltips

The new Tooltip family uses Radix hover/focus and dismissal behavior with a custom inverse surface, rounded corners, shadow, and optional arrow. Text wraps to a token-defined 280px maximum and available viewport space. Hover opens after 400ms; keyboard focus opens immediately. Existing accessible descriptions are preserved, content remains hoverable, and reduced motion disables the entrance animation. Provider timings, positioning, portal container, refs, and forceMount remain configurable.

The catalog includes a working bookmark action, long help text, and four placements. README, package provenance, bundled CSS, public exports, and both packed consumers cover the new API. Two tooltip tokens and the 72px sidebar token bring the resolved reference to 204 variables.

### 8. Admin shell and icon expansion

AdminShell now supports controlled or uncontrolled expanded (260px), collapsed (72px), and hidden states. Header display controls remain available to restore a hidden sidebar. Every navigation item has an icon, with a neutral fallback for existing iconless consumers. Collapsed links retain accessible names and show the custom tooltip on hover or focus. Compact brand/footer slots, optional navigation end content, and a stronger active state support application composition. Custom link renderers receive native props, events, ARIA attributes, and the anchor ref.

Narrow containers retain the full-label drawer without losing the selected desktop mode. Review found and resolved focus loss when CSS hides a desktop control, plus a race that dropped tooltip focus intent before the resize state committed. Focus now moves to the visible mobile menu, controlled hiding restores focus, and newly visible desktop links and controls retain tooltip intent. RTL tooltips use the navigation's actual direction.

Twenty-two named wrappers expand the icon reference from 31 to 53. New choices cover individual people, teams, organisations, communication, dates, charts, editing, storage, and sidebar controls. UserIcon represents each person in the team preview; UsersIcon represents the team navigation item. Metadata, aliases, categories, exports, and icon guidance were updated together.

Plan and source reviews passed. Production build, workspace/test type checks, ESLint, seven token tests, all 23 Chromium journeys, and independent packed Vite/Next consumers passed during this update. After the final focus and resize fixes, UI/catalog builds, type checks, lint, and all seven affected sidebar/tooltip/admin journeys passed again. Coverage includes all three widths/states, hoverable and keyboard tooltips, Escape and activation, distinct person/team glyphs, hidden-space removal, controlled focus recovery, mobile restoration, immediate focus after resizing, RTL placement, external descriptions, reduced motion, and viewport bounds at 360/768/1024/1440px. Package verification removed its own servers and temporary directory. Light and dark views were inspected; screenshot: `.artifacts/sidebar-reference.png`.

Follow-up requested on 25 October: the sidebar edge is now draggable, with gentle attraction within 24px of its three widths and nearest-mode snapping on release. Width tracks the pointer directly; release and button changes use the existing 160ms standard easing. A fixed-width inner surface avoids reflowing labels during movement. One stable header button cycles expanded → collapsed → hidden → expanded, changing its icon, accessible name, and tooltip to the next action. The hidden edge retains a grip. The focusable separator supports physical Left/Right arrows in LTR/RTL, Home/End, and Escape cancellation; reduced motion removes transitions.

Drag state is temporary and emits one callback only when a new mode is committed. Pointer cancellation, lost capture, external state changes, and mobile layout changes discard it. Review and regression testing found a release-before-ResizeObserver race; live width and handle visibility now prevent a mobile release from committing a stale snap. Hidden content becomes inert immediately, and existing focus recovery remains covered.

The follow-up passed build, type checks, lint, all nine affected Chromium journeys, and packed Vite/Next consumers in an isolated copy of the previous commit plus the sidebar changes. This kept unrelated chat-component work in progress outside the verification scope. The shared workspace also built successfully after its new files landed. Manual dark-mode dragging, hidden-edge restoration, and the single icon were inspected. No remaining review findings. Screenshot: `.artifacts/sidebar-drag-reference.png`.

### 9. Badge and ActionMessage

Badge now supports small/medium sizes, soft/outline variants, decorative icons, and dots. Root span semantics, native props/refs, existing tones, and inline icon children remain compatible. Short labels retain 20/24px heights; explicit minimum heights also protect empty or icon-only content. Longer labels wrap safely. This deliberately departs from the inherited no-wrap rule for narrow containers and localized text; the rationale is recorded in UI provenance.

ActionMessage adds a warning tone, separate heading/actions slots, and configurable decorative icons. Native title and ARIA attributes remain available. Errors default to alert, other tones to status, and caller roles override those defaults. Three new named wrappers distinguish success, information, and warning, bringing the icon reference to 60 after the concurrent chat additions.

The new Status preview demonstrates variants, rich headings, static notes, custom/absent icons, RTL, and a working retry/dismiss/reset flow. Retry moves focus from the soon-disabled control to a stable Dismiss button; completion never moves focus. Dismiss/reset cancel pending work, and dismissal returns focus to Reset. Two browser journeys protect cancellation, focus, roles, compact geometry, narrow wrapping, and RTL placement.

Plan and source reviews passed with no remaining findings. Production build, workspace/test type checks, ESLint, eight token tests, all 32 Chromium journeys, and independent packed Vite/Next consumers passed. Existing table and sidebar consumers retain their dimensions and behavior. Package verification cleaned its servers and temporary directory. Light/dark views and the single sidebar control were inspected in the app browser; screenshots: `.artifacts/status-reference.png`, `.artifacts/status-dark-reference.png`, and `.artifacts/sidebar-single-control.png`. Firefox and Safari were not tested.

### 10. Spinner and Skeleton

Spinner now forwards its span ref and supports 16/20/24px sizes, retaining the 20px default, native naming/roles, and decorative behavior used by buttons, tables, and chat. Skeleton adds block, text, and avatar variants in three sizes. Text lines override the old 40px minimum; avatars stay square when shrinking. The default remains a 40px block. Low-specificity selectors preserve later host class overrides. All dimensions reuse existing tokens, and skeletons remain static.

The new Loading preview replaces placeholders with a fictional project card. One persistent status sits outside the busy content, and the enabled reload button keeps its name and focus. A repeated reload cancels the previous timer. Hidden loaded content preserves the card's responsive footprint while decorative placeholders occupy the same space. Obsolete catalog skeleton styles were removed. Documentation, exports, and packed fixtures cover the new props, types, and refs.

Plan and source reviews passed without remaining findings. Reviewer checks confirmed square shrinking avatars and host class overrides. Production build, configured workspace/test type checks, ESLint, all 12 relevant Chromium journeys, and independent packed Vite/Next builds plus HTTP/CSS checks passed. The loading journey covers timer restarts, one status, hidden placeholders, focus preservation, dimensions at 360/768/1024/1440px, and all size mappings. Existing button, table, and catalog journeys protect their loading states and reduced-motion behavior. Light/dark views were inspected; screenshots: `.artifacts/loading-reference.png` and `.artifacts/loading-dark-reference.png`. Package verification cleaned its servers and temporary directory. Firefox and Safari were not tested.

### 11. EmptyState

EmptyState now accepts a decorative icon, an independent secondary action, compact sizing, logical start alignment, and a configurable title element. Existing title/description/action callers, root div refs, and native attributes remain compatible. Default titles remain paragraphs; hosts choose the heading level. Descriptions use the reading-width token, and actions wrap safely. The component remains passive so consuming search interfaces can own announcements and focus.

The dedicated preview demonstrates first use, template creation, archived search recovery, troubleshooting/retry, and a compact RTL secondary action. Every action works with fictional local data and restores focus to a persistent control when it replaces content. Catalog Clear search now restores focus and reopens hidden mobile navigation. The obsolete control-previews module was removed; exports, documentation, and packed fixtures cover the new API.

Plan and source reviews passed. Production build, workspace/test typecheck, ESLint, and 13 relevant Chromium journeys passed. Independent packed Vite and Next consumers built and passed HTTP/CSS checks; temporary servers and files were cleaned. The initial icon journey exposed a test race with Radix close autofocus; its helper now waits for trigger focus before the next keyboard interaction, retaining the search-focus assertion. Light/dark layouts were inspected; screenshots: `.artifacts/empty-dark-reference.png` and `.artifacts/empty-light-reference.png`. Firefox and Safari were not tested.

### 12. DataTable

Primitive cells support wrapping or default truncation. Only overflowing text becomes a keyboard stop with a custom tooltip; focus rings and custom cell controls remain unclipped. Columns can opt out of search. Search clearing restores focus, the footer announces the displayed row range and selected count, and the selection bar accepts host actions and clears IDs across pages and filters. Controlled IDs survive temporary loading, error, and empty data; the host owns record deletion and ID cleanup.

The preview demonstrates wrapped summaries, rich owner cells, semantic dates, row review, selection across pages, bulk archiving, and state recovery with fictional records. Removing the last page recovers to valid rows. Error descriptions support block content. Async loading recovers focus from disabled or removed table controls without taking focus from the host. Disabling Select now closes its open popup and keeps it closed when reenabled.

Plan and source reviews passed. Review and runtime checks resolved midword action wrapping, focus-triggered scrolling that dismissed overflow tooltips, and a page-size popup left open during loading. Production build, workspace/test type checks, ESLint, 22 affected Chromium journeys, and independent packed Vite/Next builds plus HTTP/CSS checks passed. Seven table/admin/async-host journeys passed again after the date-layout polish and removal of an ignored test-build option. The copied table usage example also passed TypeScript independently. No dependency or token was added. Package verification cleaned its temporary consumers and servers; report: `.artifacts/table-package-verification.json`. Light/dark references: `.artifacts/table-light-reference.png`, `.artifacts/table-dark-reference.png`. Firefox and Safari remain untested.

All twelve planned areas are complete. The goal remains active until the catalog frame, copied examples, exports, documentation, and combined checks pass final integration, including the separate chat, theme, and tooltip/status additions.
