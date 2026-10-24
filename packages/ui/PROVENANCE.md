# UI package sources

Version 0.1.0 is a pilot. The kit maintainer owns this package; consuming projects own adoption and product-specific behavior.

The control implementations and prefixed CSS are original kit code based on the workspace's Apple Minimal component contracts. They use the contracts' sizing, state, focus, and responsive requirements, with the kit's accessible semantic color pairs. No original application palettes, fonts, logos, domain behavior, or third-party component source were copied into this package.

The composition follows the public patterns in [shadcn/ui's Radix button documentation](https://ui.shadcn.com/docs/components/radix/button), [Radix's Dialog documentation](https://www.radix-ui.com/primitives/docs/components/dialog), and [Radix's Select documentation](https://www.radix-ui.com/primitives/docs/components/select), inspected on 25 October 2026. Runtime dependencies are pinned to `@radix-ui/react-dialog` 1.3.1 and `@radix-ui/react-select` 2.4.1; their packages retain their MIT licenses. Radix supplies focus management, dismissal, portals, accessible naming, select typeahead, and form integration. The kit supplies the presentation and exported wrappers.

`Select` renders a custom button trigger and kit-styled popup. Its chevron uses the shared interior spacing token. Options are supplied as `{ value, label, disabled? }` records; each option needs a unique nonempty value. Use `placeholder` for the empty selection and `onValueChange` for changes. The forwarded ref points to the trigger button. The `name`, `form`, `required`, and `disabled` properties go to Radix's form integration rather than a simulated native change event. The popup uses the shared popover layer above modal content and accepts an optional portal `container`.

Import `@project-kit/tokens/css`, then `@project-kit/ui/css`. Component styles are scoped to `pk-` classes and do not install a global reset. Set theme and mode attributes on the document root in this release so body-mounted dialog portals inherit them. Nested theme scopes are not a supported portal configuration yet.

The root project records tested framework versions and checks. Usage in the local catalog alone does not establish production adoption.
