# UI package sources

Version 0.1.0 is a pilot. The kit maintainer owns this package; consuming projects own adoption and product-specific behavior.

The control implementations and prefixed CSS are original kit code based on the workspace's Apple Minimal component contracts. They use the contracts' sizing, state, focus, and responsive requirements, with the kit's accessible semantic color pairs. No original application palettes, fonts, logos, domain behavior, or third-party component source were copied into this package.

The composition follows the public patterns in [shadcn/ui's Radix button documentation](https://ui.shadcn.com/docs/components/radix/button), [Radix's Dialog documentation](https://www.radix-ui.com/primitives/docs/components/dialog), and [Radix's Select documentation](https://www.radix-ui.com/primitives/docs/components/select), inspected on 25 October 2026. Runtime dependencies are pinned to `@radix-ui/react-dialog` 1.3.1 and `@radix-ui/react-select` 2.4.1; their packages retain their MIT licenses. Radix supplies focus management, dismissal, portals, accessible naming, select typeahead, and form integration. The kit supplies the presentation and exported wrappers.

The tooltip wrapper uses `@radix-ui/react-tooltip` 1.4.1 and its MIT license. The [Radix Tooltip documentation](https://www.radix-ui.com/primitives/docs/components/tooltip) and installed types were inspected on 25 October 2026. Radix manages hover, focus, dismissal, and positioning; the kit supplies the high-contrast surface, arrow, spacing, width, and default hover delay.

`Select` renders a custom button trigger and kit-styled popup. Its chevron uses the shared interior spacing token. Options are supplied as `{ value, label, disabled? }` records; each option needs a unique nonempty value. Use `placeholder` for the empty selection and `onValueChange` for changes. The forwarded ref points to the trigger button. The `name`, `form`, `required`, and `disabled` properties go to Radix's form integration rather than a simulated native change event. The popup uses the shared popover layer above modal content and accepts an optional portal `container`.

The dropdown design uses existing tokens for 6px popup padding and trigger spacing, 10px surface corners, and layered shadows. Selected options use the validated accent pair and a trailing checkmark; keyboard focus uses an inset ring. Radix Presence retains the popup for a 120ms closing fade, following a 160ms opening fade with 4px directional movement. Closed content blocks input, disabling skips the exit, and reduced motion removes popup and chevron motion. The same Select implementation serves every catalog dropdown and the table page-size control.

Dialog uses an elevated surface, layered shadows, and a separated action footer with responsive gutters. Existing motion tokens provide a 160ms opening fade and a 120ms closing fade. Independent translation preserves centered placement, drawer edges, and chat-window geometry. Radix Presence retains both surfaces through exit; the wrapper blocks closing controls from pointer and keyboard activation. Reduced motion removes the animations. Catalog dialogs, AdminShell drawers, and ChatWidget all use the shared Dialog wrapper and backdrop.

Import `@evenkit/tokens/css`, then `@evenkit/ui/css`. Component styles are scoped to `pk-` classes and do not install a global reset. Set theme and mode attributes on the document root in this release so body-mounted dialog portals inherit them. Nested theme scopes are not a supported portal configuration yet.

The root project records tested framework versions and checks. Usage in the local catalog alone does not establish production adoption.

## Icons

The curated icon wrappers use named static imports from `lucide-react` 1.61.0, following the [Lucide React guide](https://lucide.dev/guide/react). The package retains Lucide's ISC license and the MIT notices for Feather-derived icons. The installed notice is included in this package's `licenses` directory.

Ninety-five animated glyphs in `src/animated-icons` adapt [Lucide Animated](https://lucide-animated.com/) at [commit 4662fff2b60fdcf4751b32013606756caf7c4c26](https://github.com/pqoqubbw/icons/tree/4662fff2b60fdcf4751b32013606756caf7c4c26/icons). Its MIT notice is retained in `licenses/lucide-animated.txt`. The other 120 icons use original kit CSS animations on the installed Lucide artwork. The standing-person Accessibility icon retains its meaning instead of adopting the upstream wheelchair artwork. Syringe keeps the installed 24-unit Lucide outline because the upstream artwork uses a different coordinate system and fill treatment. Motion 14.6.0 supplies SVG animation; its MIT notice and the notices for its animation dependencies are retained in `licenses`.

The adaptations share the kit's SVG wrapper and hover controller. Outer SVG refs, control transforms, dimensions, stroke width and accessible naming remain under the kit's contract. Animations use the existing motion tokens, with finite sequences spanning multiple token durations where needed. Keyboard uses deterministic key feedback; Menu returns to its menu shape; Logout has an explicit resting state. There is no initial animation or continuous loop.

Icons default to hover motion. `animation="static"` disables it for an icon; `IconProvider` sets a subtree default, including portal content. Pointer hover follows the nearest native or ARIA control, or a `data-icon-trigger` wrapper. Leaving, disabling, loading, losing window focus, or enabling reduced motion stops and resets the artwork. Touch contact and keyboard focus do not start icon motion. Spinner retains its independent progress behavior.

Icons use the kit's `sm`, `md`, and `lg` size tokens, a shared stroke-width token, and `currentColor`. They are decorative by default. Supply `label` when an icon itself conveys information; the wrapper then exposes an image role and accessible name. An icon-only button still needs its own accessible label. The icon wrappers do not accept a dynamic icon name or load an icon registry.

Dropdown rows use border-box sizing and the shared option-height token. Small desktop controls use the shared small-control height without extra content-box padding; mobile controls retain the touch-height token.

## Status and persistent feedback

Badge follows the inherited badge contract's 20/24px short-label sizes, optional dot/icon, and outline treatment. Labels may wrap when their container is narrow or text is localized. This deliberately departs from the contract's no-wrap rule to prevent overflow while retaining the compact default geometry. Count formatting remains application-owned.

ActionMessage is an original persistent-feedback composition with a decorative tone icon, optional heading, body, and actions. Its default alert/status semantics remain configurable through native attributes. The component adds no timers or dismissal policy; consumers own action behavior and focus recovery.

## Loading primitives

Spinner reuses the existing 16/20/24px icon tokens and preserves its 20px default. Skeleton uses the existing control and font scales for block, avatar, and text geometry, keeping the 40px default block compatible. Text and avatar variants replace the old block minimum rather than competing with it. Low-specificity selectors preserve later consumer class overrides. Skeletons remain static and decorative; spinner rotation follows reduced-motion preferences. Loading announcements and async state belong to the consumer.

## Admin shell and tables

`AdminShell` is an original composition of the inherited sidebar/navbar contracts and kit controls. Its mobile drawer uses the existing Radix Dialog wrapper. CSS container queries adapt navigation to the available width; a ResizeObserver closes an open drawer when the shell expands and restores focus to visible content. Branding, links, the active item, router integration, and page content come from the consumer.

`DataTable` uses `@tanstack/react-table` 9.3.1 for client sorting, global filtering, pagination, and row selection, following its [React quick start](https://tanstack.com/table/latest/docs/framework/react/quick-start) and installed versioned types/guidance. The semantic table markup and styles are original kit code. It processes the complete supplied dataset and requires unique stable row IDs. Selection is controlled by the consumer; remove IDs when their records are deleted. The header selection checkbox applies to the current page. Loading and error states disable the internal data controls. Custom toolbar actions remain consumer-owned.

TanStack's React and core packages use MIT licenses; their installed notices are included in `licenses`. The optional remote mode uses manual processing and controlled queries/totals. `useRemoteTable` wraps a host loader with request cancellation and stale-response protection; API transport, virtualization, authorization and persistence remain application-owned.

Primitive cells retain the inherited table contract's single-line default, with the kit tooltip available only for overflowing text. Explicit wrapping and unclipped custom cells depart from that default where longer content or interactive controls require it. Focus rings stay outside the ellipsis wrapper. Row heights remain minimums, and horizontal scrolling is confined to the table region. Selection actions belong to the host; the built-in clear action clears all controlled IDs without pruning them on data changes.

## AI chat

`ChatWidget` and `ChatPanel` are original kit compositions using the existing Radix Dialog dependency and kit controls. Brainwave's launcher, compact/fullscreen transitions, composer, message actions, and scroll behavior supplied the interaction reference. The kit adds host-supplied conversation history and uses the kit's existing semantic tokens throughout. Brainwave's branding, content protocol, AI transport, and storage implementation are not included.

Chat records, drafts, response status, cancellation, persistence, and any rich message renderer belong to the consumer. Plain text is the default. The catalog demonstrates local sample replies; the UI package makes no AI requests.

## Priority expansion

The 48-priority expansion adds original kit foundations/display, selection/progress, form, navigation, overlay, data and file compositions. Per-family contracts and ownership are in the repository's `docs/foundations.md`, `selection-controls.md`, `form-controls.md`, `navigation.md`, `overlays.md`, and `data-workflows.md`. Existing Card, Tabs, Navbar, Dropdown and Toast contracts inform their corresponding implementations. Recipes preserve native HTML where an extra interaction abstraction is unnecessary.

New Radix behavior dependencies are pinned to Accordion 1.3.1, AlertDialog 1.2.1, Checkbox 1.4.1, Collapsible 1.2.1, DropdownMenu 2.2.1, Popover 1.3.1, RadioGroup 1.5.1, Switch 1.4.1, Tabs 1.2.1, Toast 1.3.1 and ToggleGroup 1.2.1. Their installed MIT notices are included in `licenses`. The kit supplies token-based presentation and wrappers; it does not import Radix Themes.

Combobox and Autocomplete use the unstyled `@base-ui/react` 1.9.0 behavior primitives, following the [official combobox documentation](https://base-ui.com/react/components/combobox) and installed types. This bounded additional primitive family supplies selection/query, IME, keyboard, reset and collection behavior absent from the existing Radix controls. No Base UI theme or CSS is imported. Its installed MIT notice is included. Composition inside a Radix dialog uses that dialog's content element as the popup container, with `@radix-ui/react-dismissable-layer` 1.2.1 coordinating Escape dismissal so the popup closes before its parent. Its installed MIT notice is included. The forms catalog documents and demonstrates this composition.

DataTable now consumes the public Checkbox and Pagination rather than maintaining private alternatives. Client data processing and host-owned selection behavior remain the same. The two editable source blocks in `registry/blocks` compose maintained public controls. RecordWorkflow's records, persistence, generated IDs and authorization remain with its host; FileInput performs selection and presentation without uploading to a provider.

## Application component additions

The 24-item roadmap adds original calendar arithmetic and keyboard navigation, date/time controls, Intl formatting, multi-value and number fields, remote table controls, activity and settings compositions, upload queues, images, command search and wizard progress. It adds no runtime dependencies. MultiSelect uses the existing Base UI Combobox; date and workspace popups use the existing Radix Popover; command search uses the existing Dialog. Calendar dates remain separate from zoned timestamps, and number drafts remain separate from stored numeric values.

The upload queue receives a host transport and protects each attempt from stale callbacks. Command search accepts a host search callback. The additional `record-detail`, `account-settings` and `onboarding-wizard` blocks are distributed as source alongside the existing blocks; applications own data validation, storage, authentication, navigation and network services. The catalog uses fictional local records and simulated requests.

## Document library and media previews

J05–J07 add original `media-preview` and `document-library` modules plus editable
`avatar-upload` and `document-library` blocks. They compose existing FileInput,
FileRow, UploadQueue, Image, DataTable remote mode, toolbar controls, Dialog and
settings feedback. No runtime dependencies or copied third-party source were
added. The base revision is `b588b1b1964ba2b26ee8453606f354f2c33eb10d` on
`codex/component-improvements`; implementation is on `codex/document-library`.

Inline previews accept an explicit raster-image MIME list and escaped plain text.
Other types use file actions. Applications supply authorized URLs, validate
content, own transfers and storage, and refresh expired access. Avatar drafts
own and release their temporary object URLs. The document block scopes existing
upload queues to folders and uses abort signals plus request identity checks for
mutation recovery. The sample PDF in the catalog is an original one-page fixture.

These additions remain pilots owned by the kit maintainer. Named example
consumers are the catalog and independent packed Vite/Next fixtures. Internal
source remains unlicensed for public distribution; existing dependency notices
retain their terms. Contracts, copyable examples and verification references
are in `docs/document-library.md` and `docs/document-library-handoff.md`.

The subsequent design pass adds original token-based layouts for the document
toolbar, file cards, preview canvas and avatar settings panel. Passive thumbnail
previews reuse the same MIME policy and Image component. A neutral checkerboard
uses the kit's existing foundation palette to reveal image transparency in both
modes. No external visual assets, component source or dependencies were added.
