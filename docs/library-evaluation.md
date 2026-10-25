# Component library evaluation

Reviewed 25 October 2026 for the first Evenkit phase. The current kit uses original controls and prefixed CSS, with Radix Dialog as its interaction dependency. No Mantine, HeroUI, Chakra, or Uiverse source was copied into this release.

| Source | Useful in this foundation | Candidate for a later phase |
|---|---|---|
| shadcn/ui | Composable control APIs, explicit variants, semantic tokens, and source provenance | Internal registry and editable auth/admin blocks |
| Uiverse | Optional visual treatments after adapting tokens, focus, motion, and sizing | Curated branded loaders and decorative patterns |
| Mantine | Complete labeled-field composition and state examples | Independent form state, Combobox/MultiSelect, dates, AppShell, Dropzone |
| HeroUI v3 | Semantic color pairs, multipart slots, state attributes, and separate prebuilt CSS | Locale-aware dates/numbers, collection selection, richer tables |
| Chakra UI | Semantic-token roles, variant recipes, slot recipes, complete fields | File selection, steps, comboboxes, tree views, or a separate Chakra starter |

The recommendation is to evaluate a bounded integration when a named project needs it. Adding several full control systems now would duplicate the kit's theming and overlay behavior. The useful patterns already reflected here are semantic foreground/background pairs, labeled fields with associated feedback, explicit variants, independent controls, and catalog state examples.

## shadcn/ui and Uiverse

shadcn's [blocks](https://ui.shadcn.com/blocks) and [registry](https://ui.shadcn.com/docs/registry) fit the planned composition/distribution layer. This phase follows its [Radix button composition](https://ui.shadcn.com/docs/components/radix/button) as a reference and uses the existing internal design contract for presentation.

The earlier review inspected a [Uiverse bar loader](https://uiverse.io/satyamchaudharydev/ugly-bulldog-75), a [diagonal pattern](https://uiverse.io/AspenBranch/slippery-sheep-50), and a [rewards button](https://uiverse.io/vinodjangid07/dull-ladybug-18). The first two are optional visual candidates. The button needs focus, sizing, and motion adaptation. Their individual pages display MIT notices; preserve the applicable author and license information if code is later included.

## Mantine

Mantine's normal setup imports CSS and uses a [MantineProvider](https://mantine.dev/theming/mantine-provider/). Its [Next.js integration](https://mantine.dev/guides/next/) also addresses server rendering and initial color scheme. Core adoption would add a separate theme context and CSS-variable mapping.

The most promising narrow dependency is [@mantine/form](https://mantine.dev/form/use-form/), which can work with custom inputs independently of Mantine core. Evaluate it when a real form needs coordinated validation or more complex state. Mantine's [Input documentation](https://mantine.dev/core/input/) reinforces the need to associate labels, descriptions, and errors; a raw input alone does not supply a complete accessible field. [AppShell](https://mantine.dev/core/app-shell/) and [Dropzone](https://mantine.dev/x/dropzone/) are useful later references. Mantine is [MIT licensed](https://github.com/mantinedev/mantine/blob/master/LICENSE).

## HeroUI v3

HeroUI v3 uses React Aria Components and does not require a HeroUI provider. Its [quick start](https://heroui.com/en/docs/react/getting-started/quick-start) targets React 19 and Tailwind 4, while its [framework guide](https://heroui.com/en/docs/react/getting-started/frameworks) also offers precompiled CSS. Locale agreement matters during server/client rendering; React Aria's optional I18nProvider can supply that context.

The separation of behavior and style is useful, but importing styles alone does not add keyboard or focus behavior. Its [theme variables and component classes](https://heroui.com/en/docs/react/getting-started/theming) include general names, so adoption beside this prefixed kit needs an explicit CSS coexistence decision. A [DatePicker](https://heroui.com/en/docs/react/components/date-picker) is a candidate when a project needs localized calendar behavior. The reviewed v3 branch is [Apache-2.0 licensed](https://github.com/heroui-inc/heroui/blob/v3/LICENSE); do not assume licensing from earlier HeroUI/NextUI versions.

## Chakra UI

Chakra's [semantic tokens](https://chakra-ui.com/docs/theming/semantic-tokens), [recipes](https://chakra-ui.com/docs/theming/recipes), and [slot recipes](https://chakra-ui.com/docs/theming/slot-recipes) are useful conventions for describing shared controls. Its [Field](https://chakra-ui.com/docs/components/field) is a complete composition reference, including helpers and error state.

Current [installation](https://chakra-ui.com/docs/get-started/installation) uses Chakra, Emotion, and a provider; a future zero-runtime direction is not its present integration model. Its components can render through a [server-component boundary](https://chakra-ui.com/docs/components/concepts/server-components), with [Next.js integration](https://chakra-ui.com/docs/get-started/frameworks/next-app) addressing Emotion and streaming requirements. [Variable prefixes and reset scope](https://chakra-ui.com/docs/theming/overview) are configurable. It is a plausible alternative starter stack rather than an additional runtime for this first foundation.

[File Upload](https://chakra-ui.com/docs/components/file-upload), steps, and tree/combobox patterns merit review when the corresponding modules are needed. Picker UI remains separate from storage authorization and server validation. The [Chakra repository](https://github.com/chakra-ui/chakra-ui) is MIT licensed.

These are source-based integration findings and recommendations, not executed compatibility tests for the three additional libraries. Their accessible primitives still require verification of the final labels, colors, focus flow, and locale behavior.
