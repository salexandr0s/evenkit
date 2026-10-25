# Component improvement goal

Requested on 25 October 2026. Goal: review every component one by one, make substantial improvements, and verify each before moving on. Work runs on `codex/component-improvements`.

Keep the existing public API compatible. Preserve the Neutral and Grove themes, document-level theming, token-based dimensions, prefixed package CSS, and independent Next/Vite installation. Improvements should make the component more useful, easier to understand, or safer to compose. Changes to an already sound primitive need a concrete reason.

## Queue

| Order | Area and public components | Planned outcome | Status |
|---|---|---|---|
| 1 | Design tokens | Search every resolved CSS variable, copy its usage, inspect visual scales and defined contrast pairs for the current theme. | Complete |
| 2 | Icons: all named wrappers | Search categories and aliases, select preview size, copy named imports, and demonstrate decorative, labelled, and action use. | Complete |
| 3 | Button, ButtonLink | Icon-only sizing, leading/trailing icons, full-width layout, clearer variant hierarchy, and a working asynchronous loading example. | Pending |
| 4 | Label, Input, Textarea, TextField | Shared field composition, textarea field, required/optional cues, adornments, read-only styling, and validation focus recovery. | Pending |
| 5 | Select | Grouped and described options, empty-options feedback, shared field composition, and long-label handling while preserving compact rows. | Pending |
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

Next: Buttons. The goal remains active; items 3–11 and final integration review are unfinished.
