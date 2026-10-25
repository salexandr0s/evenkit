# UI package sources

Version 0.1.0 is a pilot. The kit maintainer owns this package; consuming projects own adoption and product-specific behavior.

The control implementations and prefixed CSS are original kit code based on the workspace's Apple Minimal component contracts. They use the contracts' sizing, state, focus, and responsive requirements, with the kit's accessible semantic color pairs. No original application palettes, fonts, logos, domain behavior, or third-party component source were copied into this package.

The composition follows the public patterns in [shadcn/ui's Radix button documentation](https://ui.shadcn.com/docs/components/radix/button), [Radix's Dialog documentation](https://www.radix-ui.com/primitives/docs/components/dialog), and [Radix's Select documentation](https://www.radix-ui.com/primitives/docs/components/select), inspected on 25 October 2026. Runtime dependencies are pinned to `@radix-ui/react-dialog` 1.3.1 and `@radix-ui/react-select` 2.4.1; their packages retain their MIT licenses. Radix supplies focus management, dismissal, portals, accessible naming, select typeahead, and form integration. The kit supplies the presentation and exported wrappers.

The tooltip wrapper uses `@radix-ui/react-tooltip` 1.4.1 and its MIT license. The [Radix Tooltip documentation](https://www.radix-ui.com/primitives/docs/components/tooltip) and installed types were inspected on 25 October 2026. Radix manages hover, focus, dismissal, and positioning; the kit supplies the high-contrast surface, arrow, spacing, width, and default hover delay.

`Select` renders a custom button trigger and kit-styled popup. Its chevron uses the shared interior spacing token. Options are supplied as `{ value, label, disabled? }` records; each option needs a unique nonempty value. Use `placeholder` for the empty selection and `onValueChange` for changes. The forwarded ref points to the trigger button. The `name`, `form`, `required`, and `disabled` properties go to Radix's form integration rather than a simulated native change event. The popup uses the shared popover layer above modal content and accepts an optional portal `container`.

Import `@project-kit/tokens/css`, then `@project-kit/ui/css`. Component styles are scoped to `pk-` classes and do not install a global reset. Set theme and mode attributes on the document root in this release so body-mounted dialog portals inherit them. Nested theme scopes are not a supported portal configuration yet.

The root project records tested framework versions and checks. Usage in the local catalog alone does not establish production adoption.

## Icons

The curated icon wrappers use named static imports from `lucide-react` 1.61.0, following the [Lucide React guide](https://lucide.dev/guide/react). The package retains Lucide's ISC license and the MIT notices for Feather-derived icons. The installed notice is included in this package's `licenses` directory.

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

TanStack's React and core packages use MIT licenses; their installed notices are included in `licenses`. This package does not provide fetching, server pagination, virtualization, authorization, or persistence.

## AI chat

`ChatWidget` and `ChatPanel` are original kit compositions using the existing Radix Dialog dependency and kit controls. Brainwave's launcher, compact/fullscreen transitions, composer, message actions, and scroll behavior supplied the interaction reference. The kit adds host-supplied conversation history and uses the kit's existing semantic tokens throughout. Brainwave's branding, content protocol, AI transport, and storage implementation are not included.

Chat records, drafts, response status, cancellation, persistence, and any rich message renderer belong to the consumer. Plain text is the default. The catalog demonstrates local sample replies; the UI package makes no AI requests.
