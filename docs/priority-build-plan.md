# Priority implementation plan

25 October 2026. Active goal: implement all 48 Next priorities from [the inventory](./component-inventory.md). The user authorized this build goal. Existing workspace edits remain owned by their earlier work.

## Delivery batches

1. Foundations/display, selection/progress, forms, navigation, and overlays are independent bounded modules. Parallel owners create separate source, CSS, catalog entries/previews, documentation and behavior tests. Root owns package exports, stylesheet assembly, dependency installation and catalog integration.
2. Assemble filtering, semantic tables, file controls and editable list/create/edit/error blocks from these foundations. Show a complete fictional-record workflow with working failure and recovery states.
3. Review APIs, examples, accessible interactions and visual behavior. Verify build/type/lint, meaningful browser regressions, copyable examples, all eight themes and responsive layouts, and packed Next/Vite consumers. Record completion per ID only after evidence is available.

## Integration rules

- Preserve existing public APIs, uncommitted edits and theme behavior. Reuse existing FieldFrame, Dialog, Button and semantic tokens. Root alone edits the existing public barrel, CSS assembly, catalog.tsx and catalog-data.ts.
- Each new catalog entry uses the shared CatalogEntry type and records inventoryIds. Each preview module accepts an id and renders the relevant working example. Entry snippets import public packages and token CSS before UI CSS.
- Components retain native props and refs where appropriate; controlled/uncontrolled boundaries, form reset/submission and async recovery are documented. Generic UI does not own storage, authorization or routing policy.
- Inspect and pin new primitive dependencies. Prefer established behavior primitives over inventing focus/keyboard machinery. Any additional primitive family needs an explicit reason and coexistence checks.
- New contracts are recorded with the module documentation before implementation. All visual rules use existing tokens or a justified token extension.

## Review decisions

C07 follows Base UI's keyboard discovery model: disabled options can be highlighted and announced, but cannot be selected with the keyboard or pointer. Inspection of the installed implementation and a live diagnostic confirmed this behavior. The earlier test assumption that navigation would skip these rows was corrected; the test now verifies discovery, blocked selection and subsequent enabled selection. The inventory scope remains unchanged. Radix Select and radio controls retain their own established keyboard models.

Choice-field popups mounted in a Radix dialog use that dialog's container and a shared DismissableLayer. Browser checks wait for the asynchronous popup to be open before sending Escape, then verify that only the popup closes and the dialog remains usable. Responsive Navbar recovery retains focus intent across CSS hiding before ResizeObserver delivery, while explicit moves to a host control cancel recovery.

## Completion tracker

Pending means no completion claim. Implemented means source/examples exist but verification/review is incomplete. Verified requires the listed evidence.

| ID | Deliverable | State | Evidence |
| --- | --- | --- | --- |
| A01 | Typography and prose | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| A02 | Container and page width | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| A03 | Stack, inline group, responsive grid | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| A04 | Separator | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| A05 | Card | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| A06 | Page header and section header | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| A07 | Toolbar and action group | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| A11 | Accessibility helpers | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| B01 | Checkbox and checkbox group | Verified | [Source](../packages/ui/src/selection-controls.tsx), [contract](./selection-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| B02 | Radio group | Verified | [Source](../packages/ui/src/selection-controls.tsx), [contract](./selection-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| B03 | Switch | Verified | [Source](../packages/ui/src/selection-controls.tsx), [contract](./selection-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| B04 | Toggle and toggle group | Verified | [Source](../packages/ui/src/selection-controls.tsx), [contract](./selection-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| B05 | Segmented control | Verified | [Source](../packages/ui/src/selection-controls.tsx), [contract](./selection-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| B06 | Button group | Verified | [Source](../packages/ui/src/selection-controls.tsx), [contract](./selection-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| B08 | Copy action | Verified | [Source](../packages/ui/src/selection-controls.tsx), [contract](./selection-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| C01 | Fieldset and form section | Verified | [Source](../packages/ui/src/form-controls.tsx), [contract](./form-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| C02 | Form error summary and status | Verified | [Source](../packages/ui/src/form-controls.tsx), [contract](./form-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| C03 | Search field | Verified | [Source](../packages/ui/src/form-controls.tsx), [contract](./form-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| C04 | Password field | Verified | [Source](../packages/ui/src/form-controls.tsx), [contract](./form-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| C07 | Combobox and autocomplete | Verified | [Source](../packages/ui/src/form-controls.tsx), [contract](./form-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| C15 | Form actions and dirty-state recipe | Verified | [Source](../packages/ui/src/form-controls.tsx), [contract](./form-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| E01 | Tabs | Verified | [Source](../packages/ui/src/navigation.tsx), [contract](./navigation.md); copied usage and route/theme/width checks passed. See final evidence below. |
| E02 | Accordion | Verified | [Source](../packages/ui/src/navigation.tsx), [contract](./navigation.md); copied usage and route/theme/width checks passed. See final evidence below. |
| E03 | Collapsible | Verified | [Source](../packages/ui/src/navigation.tsx), [contract](./navigation.md); copied usage and route/theme/width checks passed. See final evidence below. |
| E04 | Breadcrumbs | Verified | [Source](../packages/ui/src/navigation.tsx), [contract](./navigation.md); copied usage and route/theme/width checks passed. See final evidence below. |
| E05 | Navbar/navigation menu | Verified | [Source](../packages/ui/src/navigation.tsx), [contract](./navigation.md); copied usage and route/theme/width checks passed. See final evidence below. |
| E06 | Pagination | Verified | [Source](../packages/ui/src/navigation.tsx), [contract](./navigation.md); copied usage and route/theme/width checks passed. See final evidence below. |
| F01 | DropdownMenu | Verified | [Source](../packages/ui/src/overlays.tsx), [contract](./overlays.md); copied usage and route/theme/width checks passed. See final evidence below. |
| F02 | Popover | Verified | [Source](../packages/ui/src/overlays.tsx), [contract](./overlays.md); copied usage and route/theme/width checks passed. See final evidence below. |
| F03 | AlertDialog/confirmation | Verified | [Source](../packages/ui/src/overlays.tsx), [contract](./overlays.md); copied usage and route/theme/width checks passed. See final evidence below. |
| F04 | Sheet/side drawer | Verified | [Source](../packages/ui/src/overlays.tsx), [contract](./overlays.md); copied usage and route/theme/width checks passed. See final evidence below. |
| G01 | Toast | Verified | [Source](../packages/ui/src/overlays.tsx), [contract](./overlays.md); copied usage and route/theme/width checks passed. See final evidence below. |
| G02 | Progress and meter | Verified | [Source](../packages/ui/src/selection-controls.tsx), [contract](./selection-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| G04 | Save/submission status | Verified | [Source](../packages/ui/src/form-controls.tsx), [contract](./form-controls.md); copied usage and route/theme/width checks passed. See final evidence below. |
| H01 | Avatar and avatar group | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| H02 | Tag/chip and tag group | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| H03 | Description/data list | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| H04 | List item and rich item row | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| H08 | Keyboard shortcut/Kbd | Verified | [Source](../packages/ui/src/foundations.tsx), [contract](./foundations.md); copied usage and route/theme/width checks passed. See final evidence below. |
| I01 | Semantic Table | Verified | [Source](../packages/ui/src/data-workflows.tsx), [contract](./data-workflows.md); copied usage and route/theme/width checks passed. See final evidence below. |
| I02 | Filter bar and filter field | Verified | [Source](../packages/ui/src/data-workflows.tsx), [contract](./data-workflows.md); copied usage and route/theme/width checks passed. See final evidence below. |
| I03 | Applied filters | Verified | [Source](../packages/ui/src/data-workflows.tsx), [contract](./data-workflows.md); copied usage and route/theme/width checks passed. See final evidence below. |
| J01 | File input and dropzone | Verified | [Source](../packages/ui/src/data-workflows.tsx), [contract](./data-workflows.md); copied usage and route/theme/width checks passed. See final evidence below. |
| J02 | File row and attachment | Verified | [Source](../packages/ui/src/data-workflows.tsx), [contract](./data-workflows.md); copied usage and route/theme/width checks passed. See final evidence below. |
| M01 | Account menu | Verified | [Source](../packages/ui/src/overlays.tsx), [contract](./overlays.md); copied usage and route/theme/width checks passed. See final evidence below. |
| O02 | List/index page | Verified | [Source](../registry/blocks/record-workflow.tsx), [contract](./data-workflows.md); copied usage and route/theme/width checks passed. See final evidence below. |
| O04 | Create/edit page | Verified | [Source](../registry/blocks/record-workflow.tsx), [contract](./data-workflows.md); copied usage and route/theme/width checks passed. See final evidence below. |
| O11 | Error/access/offline pages | Verified | [Source](../registry/blocks/recovery-page.tsx), [contract](./data-workflows.md); copied usage and route/theme/width checks passed. See final evidence below. |

## Final evidence

All 48 deliverables passed source/API review and their applicable interaction checks. `priority-release-browser.log` records all 127 Chromium journeys passing, including 48 route sweeps across eight themes, two modes and four contract widths. Static recipes use route/layout evidence; dedicated family journeys cover form/reset/validation, focus, keyboard, clipboard, popup/timer, file and async workflow failures.

Production build, configured TypeScript and ESLint passed. All eight token tests passed; 211 resolved variables and 560 contrast pairs are retained across eight themes. `npm run verify:examples` compiled all 62 copied examples and proved each of the 48 IDs has exactly one entry. `npm run verify:packages` built independently installed packed Next/Vite consumers, copied both editable blocks, checked server rendering/styles/HTTP and cleaned its own resources.

RecordWorkflow supplies O02/O04 as editable source with records/save/AbortSignal host contracts; RecoveryPage supplies O11. Their catalog demonstrates fictional local data, failure/retry, dirty dismissal and stale-result cancellation. Source paths are `registry/blocks/record-workflow.tsx` and `registry/blocks/recovery-page.tsx`. The family contract documents their integration.

Seventeen final representative captures had no runtime errors. Independent visual review of seven captures found no actionable defect. Evidence and remaining platform limits are recorded in [compatibility](./compatibility.md). Firefox, Safari, physical mobile keyboards and production adoption remain unverified; no package publication or application migration is part of this goal.
