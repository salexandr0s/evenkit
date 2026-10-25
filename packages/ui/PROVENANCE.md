# UI package sources

Version 0.1.0 is a pilot. The kit maintainer owns this package; consuming projects own adoption and product-specific behavior.

The control implementations and prefixed CSS are original kit code based on the workspace's Apple Minimal component contracts. They use the contracts' sizing, state, focus, and responsive requirements, with the kit's accessible semantic color pairs. No original application palettes, fonts, logos, domain behavior, or third-party component source were copied into this package.

The composition follows the public patterns in [shadcn/ui's Radix button documentation](https://ui.shadcn.com/docs/components/radix/button), [Radix's Dialog documentation](https://www.radix-ui.com/primitives/docs/components/dialog), and [Radix's Select documentation](https://www.radix-ui.com/primitives/docs/components/select), inspected on 25 October 2026. Runtime dependencies are pinned to `@radix-ui/react-dialog` 1.3.1 and `@radix-ui/react-select` 2.4.1; their packages retain their MIT licenses. Radix supplies focus management, dismissal, portals, accessible naming, select typeahead, and form integration. The kit supplies the presentation and exported wrappers.

`Select` renders a custom button trigger and kit-styled popup. Its chevron uses the shared interior spacing token. Options are supplied as `{ value, label, disabled? }` records; each option needs a unique nonempty value. Use `placeholder` for the empty selection and `onValueChange` for changes. The forwarded ref points to the trigger button. The `name`, `form`, `required`, and `disabled` properties go to Radix's form integration rather than a simulated native change event. The popup uses the shared popover layer above modal content and accepts an optional portal `container`.

Import `@project-kit/tokens/css`, then `@project-kit/ui/css`. Component styles are scoped to `pk-` classes and do not install a global reset. Set theme and mode attributes on the document root in this release so body-mounted dialog portals inherit them. Nested theme scopes are not a supported portal configuration yet.

The root project records tested framework versions and checks. Usage in the local catalog alone does not establish production adoption.

## Icons

The curated icon wrappers use named static imports from `lucide-react` 1.61.0, following the [Lucide React guide](https://lucide.dev/guide/react). The package retains Lucide's ISC license and the MIT notices for Feather-derived icons. The installed notice is included in this package's `licenses` directory.

Icons use the kit's `sm`, `md`, and `lg` size tokens, a shared stroke-width token, and `currentColor`. They are decorative by default. Supply `label` when an icon itself conveys information; the wrapper then exposes an image role and accessible name. An icon-only button still needs its own accessible label. The icon wrappers do not accept a dynamic icon name or load an icon registry.

Dropdown rows use border-box sizing and the shared option-height token. Small desktop controls use the shared small-control height without extra content-box padding; mobile controls retain the touch-height token.

## Admin shell and tables

`AdminShell` is an original composition of the inherited sidebar/navbar contracts and kit controls. Its mobile drawer uses the existing Radix Dialog wrapper. CSS container queries adapt navigation to the available width; a ResizeObserver closes an open drawer when the shell expands and restores focus to visible content. Branding, links, the active item, router integration, and page content come from the consumer.

`DataTable` uses `@tanstack/react-table` 9.3.1 for client sorting, global filtering, pagination, and row selection, following its [React quick start](https://tanstack.com/table/latest/docs/framework/react/quick-start) and installed versioned types/guidance. The semantic table markup and styles are original kit code. It processes the complete supplied dataset and requires unique stable row IDs. Selection is controlled by the consumer; remove IDs when their records are deleted. The header selection checkbox applies to the current page. Loading and error states disable the internal data controls. Custom toolbar actions remain consumer-owned.

TanStack's React and core packages use MIT licenses; their installed notices are included in `licenses`. This package does not provide fetching, server pagination, virtualization, authorization, or persistence.

## Authentication pages

Login, signup, reset-request, and new-password pages are original kit compositions of the existing controls and icons. `AuthLayout` and `PasswordField` are reusable public components. The callback/result contract keeps service SDKs, recovery authorization, routing, and persistence in the application. No external auth component code or new runtime dependency was added.

Password-manager attributes follow [MDN's autocomplete reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete). Neutral recovery confirmation and confirmation-field behavior follow [OWASP's password recovery guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), inspected on 25 October 2026. The UI does not establish that a recovery token is valid; the service verifies it at submission. See the root authentication integration guide for boundaries and examples.

The follow-up audit corrected lost focus when a live recovery-state change removes the form, added visible password-toggle captions that remain part of their accessible names, and reduced auth spacing using existing tokens. The catalog removes redundant framing and gives narrow embedded forms more usable width. Page copy remains English; a localized standalone PasswordField does not imply full-page localization.
