# Evenkit tokens

Typed values, validated themes, and generated CSS for Evenkit. Import the built CSS once in the application entry point:

```ts
import "@evenkit/tokens/css";
```

Set `data-kit-theme` to a theme ID from the table below on the document element. Set `data-kit-mode="light"` or `data-kit-mode="dark"` to choose a mode. Omit `data-kit-mode` to follow the system preference. These themes apply to the document root; nested theme scopes are not supported in this release.

```ts
import { themes, cssVariables } from "@evenkit/tokens";

document.documentElement.dataset.kitTheme = "grove";
document.documentElement.dataset.kitMode = "dark";

const accent = themes.grove.modes.dark.accent;
const variables = cssVariables("grove", "dark");
```

The `foundation` export contains inherited spacing, type, radii, shadows, palette, and control scales, plus documented kit layout/state additions. Semantic colors live in `themes[name].modes[mode]`. All emitted CSS custom properties use the `--pk-` prefix. The JSON export is available at `@evenkit/tokens/tokens.json`.

## Built-in themes

Compare the themes in the catalog at `/#themes`, then apply one to see it on forms, tables, navigation, dialogs, and chat. The gallery follows the selected appearance, and the catalog remembers your choice.

| Theme ID | Palette direction |
|---|---|
| `neutral` | Blue accents; the default. |
| `grove` | Green accents. |
| `graphite` | Monochrome accents. |
| `linen` | Olive-brown accents and Georgia serif headings. |
| `ocean` | Teal accents. |
| `dusk` | Violet accents. |
| `clay` | Terracotta accents. |
| `rose` | Berry accents. |

Every built-in theme shares the same neutral page backgrounds, surfaces, text and borders within each appearance mode. Themes change actions, focus rings and soft selected or hover highlights. Dark appearance uses lighter accents on neutral dark surfaces. Text, muted text, hover states, and focus rings are checked against the backgrounds used by the kit. Error, warning, and success colours retain their meanings across themes.

Body text uses the shared system font stack. Linen's heading stack is `Georgia, 'Times New Roman', serif`; it uses locally available fonts and requires no download. Other themes use the system stack for headings too. Spacing, type sizes, and control dimensions stay consistent when switching themes.

## Custom brands

`createBrandCss` validates an unknown configuration and returns CSS for its document-theme ID. It requires complete light and dark semantic colors and validates text/action contrast and control boundaries. Font families use a nonempty comma-separated list: simple unquoted CSS identifiers or names in matching single/double quotes. Multiword names must be quoted. Quoted names support ASCII letters, digits, spaces, periods, underscores, and hyphens; escapes and commas inside quoted names are outside this release's syntax. CSS-wide keywords are not family names. Radii accept bounded pixel/rem lengths. Colors use six-digit hexadecimal notation, except the restricted black overlay value. Token aliases and arbitrary CSS expressions are not accepted.

```ts
import { createBrandCss, themes } from "@evenkit/tokens";

const css = createBrandCss({
  ...themes.grove,
  id: "sample-brand",
  name: "Sample brand",
  fontFamily: "Georgia, serif",
  radius: { sm: "4px", md: "8px", lg: "12px" },
});
// Load this CSS after the base stylesheet, then use data-kit-theme="sample-brand".
```

`brandSchema`, `themeSchema`, `validateBrand`, and `validateTheme` share this supported configuration shape. The typography and radius properties receive foundation defaults when omitted. The helpers emit every accepted visual property; unsupported properties are rejected.

Validation includes secondary text (`fg-muted`, at least 4.5:1) and focus rings (`ring`, at least 3:1) against `accent-soft`, which the kit uses for selected and hovered surfaces. Custom brands accepted before these checks may need a darker or lighter `accent-soft` value. Built-in highlights meet these checks with the shared neutral text colours.

Success text requires at least 4.5:1 contrast against `bg`, `bg-muted`, `surface`, and `surface-elevated`. Warning icons require at least 3:1 against those surfaces. Both status colours also require 4.5:1 against their matching tinted backgrounds for badge text. Custom brands must meet both sets of checks; a readable badge alone does not ensure readable status content elsewhere.

## Build and checks

`npm run build --workspace @evenkit/tokens` compiles TypeScript, then generates `dist/tokens.css` and `dist/tokens.json` from the same exported values. Generated outputs have no timestamps and do not read files outside the package. `npm run typecheck --workspace @evenkit/tokens` checks the package. The root test runner executes the focused schema, contrast, and output tests.

See [PROVENANCE.md](./PROVENANCE.md) for source attribution and semantic changes.
