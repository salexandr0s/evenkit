# Project kit tokens

Typed values, validated themes, and generated CSS for the shared project kit. Import the built CSS once in the application entry point:

```ts
import "@project-kit/tokens/css";
```

Set `data-kit-theme="neutral"` or `data-kit-theme="grove"` on the document element. Set `data-kit-mode="light"` or `data-kit-mode="dark"` to choose a mode. Omit `data-kit-mode` to follow the system preference. These themes apply to the document root; nested theme scopes are not supported in this release.

```ts
import { themes, cssVariables } from "@project-kit/tokens";

document.documentElement.dataset.kitTheme = "grove";
document.documentElement.dataset.kitMode = "dark";

const accent = themes.grove.modes.dark.accent;
const variables = cssVariables("grove", "dark");
```

The `foundation` export contains inherited spacing, type, radii, shadows, palette, and control scales, plus documented kit layout/state additions. Semantic colors live in `themes[name].modes[mode]`. All emitted CSS custom properties use the `--pk-` prefix. The JSON export is available at `@project-kit/tokens/tokens.json`.

## Custom brands

`createBrandCss` validates an unknown configuration and returns CSS for its document-theme ID. It requires complete light and dark semantic colors and validates text/action contrast and control boundaries. Font families use a nonempty comma-separated list: simple unquoted CSS identifiers or names in matching single/double quotes. Multiword names must be quoted. Quoted names support ASCII letters, digits, spaces, periods, underscores, and hyphens; escapes and commas inside quoted names are outside this release's syntax. CSS-wide keywords are not family names. Radii accept bounded pixel/rem lengths. Colors use six-digit hexadecimal notation, except the restricted black overlay value. Token aliases and arbitrary CSS expressions are not accepted.

```ts
import { createBrandCss, themes } from "@project-kit/tokens";

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

## Build and checks

`npm run build --workspace @project-kit/tokens` compiles TypeScript, then generates `dist/tokens.css` and `dist/tokens.json` from the same exported values. Generated outputs have no timestamps and do not read files outside the package. `npm run typecheck --workspace @project-kit/tokens` checks the package. The root test runner executes the focused schema, contrast, and output tests.

See [PROVENANCE.md](./PROVENANCE.md) for source attribution and semantic changes.
