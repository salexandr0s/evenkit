# Component improvement goal

Requested on 25 October 2026. Goal: review every component one by one, make substantial improvements, and verify each before moving on. Work runs on `codex/component-improvements`.

Keep the existing public API compatible. Preserve the Neutral and Grove themes, document-level theming, token-based dimensions, prefixed package CSS, and independent Next/Vite installation. Improvements should make the component more useful, easier to understand, or safer to compose. Changes to an already sound primitive need a concrete reason.

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
| 9 | Badge, ActionMessage | Status icons, wrapping labels, message titles/actions, warning feedback, and a retry/dismiss example. | Pending |
| 10 | Spinner, Skeleton | Token sizes, text/avatar/block skeletons, and a loading-to-content example with one accessible announcement. | Pending |
| 11 | EmptyState | Icon slot, heading semantics, secondary action, compact layout, and distinct first-use, no-results, and failure examples. | Pending |
| 12 | DataTable | Per-column wrapping, usable custom action cells, clear search, displayed-row range, selection clearing/bulk actions, and improved state presentation. | Pending |

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

Next: Badge and ActionMessage. Eight of twelve areas are complete. The goal remains active; items 9–12 and final integration review are unfinished.
