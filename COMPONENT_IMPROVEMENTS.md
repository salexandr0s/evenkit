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
| 6 | Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription, DialogFooter | Size and layout composition, long-content scrolling, reachable actions, mobile presentation, and logical RTL positioning. | Pending |
| 7 | Badge, ActionMessage | Status icons, wrapping labels, message titles/actions, warning feedback, and a retry/dismiss example. | Pending |
| 8 | Spinner, Skeleton | Token sizes, text/avatar/block skeletons, and a loading-to-content example with one accessible announcement. | Pending |
| 9 | EmptyState | Icon slot, heading semantics, secondary action, compact layout, and distinct first-use, no-results, and failure examples. | Pending |
| 10 | AdminShell | Navigation badges/end content, stronger active state, narrow-header action layout, and focused review of compact navigation and drawer focus. | Pending |
| 11 | DataTable | Per-column wrapping, usable custom action cells, clear search, displayed-row range, selection clearing/bulk actions, and improved state presentation. | Pending |

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

Next: Dialog. The goal remains active; items 6–11 and final integration review are unfinished.
