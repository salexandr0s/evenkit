# Evenkit

> Evenkit is a React 19 design system: validated design tokens with eight themes (`@evenkit/tokens`), controls, layouts, data tables, charts and AI chat (`@evenkit/ui`), editable source blocks installed by a local CLI, and an opt-in Next.js and Supabase auth adapter (`@evenkit/auth-next`). Version 0.1.0 is a pilot distributed through local packages or a configured private registry.

This file tells coding agents how to install, configure and use Evenkit in an application. The live catalog at https://evenkit.dev shows every component; each entry below links to its catalog page, which has a live preview and a copyable TypeScript usage example. https://evenkit.dev/llms-full.txt contains this guide plus every usage example in one file.

## Before you start

- Evenkit packages are not on npm. `npm install @evenkit/ui` against the public registry will not install them. Install the packed tarballs from an Evenkit checkout, or use the application's authenticated private registry if one is configured.
- Do not run `shadcn add` for Evenkit blocks. The registry items are shadcn-schema compatible, but only the Evenkit CLI records the baseline needed for upgrades, and shadcn may try to fetch the private packages from npm.
- Consumers need React 19 and React DOM 19 (peer dependencies). Tailwind is not required. The UI package ships its own CSS with `pk-` classes and `--pk-` custom properties, and adds no global reset.
- The checkout declares Node.js 22.12 or later; the recorded verification used Node.js 26.12.1 and npm 11.20.0. On Node 22, the installed ESLint requires at least 22.13. Use the recorded toolchain when reproducing the full checks.
- Tested with Vite 8 and Next.js 16 (App Router), and TypeScript 6 in strict mode. The configured browser suites use Chromium for the catalog and packed consumers, and Chromium, Firefox and WebKit for the admin starter. WebKit automation does not verify installed Safari or physical iOS devices. Older React versions and other frameworks have not been verified.

## Install the packages

From an Evenkit checkout, build and pack the packages:

```sh
npm ci
npm run build:packages
mkdir -p .artifacts
npm pack --workspace @evenkit/tokens --workspace @evenkit/ui --pack-destination .artifacts
```

From the consuming project, install both tarballs in one command so npm does not look for `@evenkit/tokens` on the public registry:

```sh
npm install ../evenkit/.artifacts/evenkit-tokens-0.1.0.tgz ../evenkit/.artifacts/evenkit-ui-0.1.0.tgz
```

Adjust the path to wherever the checkout lives. For the Supabase adapter, also pack `@evenkit/auth-next` with the same command's `--workspace` option and install the resulting `evenkit-auth-next-0.1.0.tgz` in the consumer. It requires Next.js `^16.4.3`; generic UI apps need only tokens and UI.

## Set up styles and themes

Import the token CSS before the UI CSS, once, in the application entry point or the Next.js root layout:

```tsx
import "@evenkit/tokens/css";
import "@evenkit/ui/css";
```

Set the theme on the document root. Body-mounted portals (dialogs, selects, tooltips) read it from there:

```html
<html lang="en" data-kit-theme="grove" data-kit-mode="dark">
```

- `data-kit-theme`: `neutral` (blue, the default), `grove` (green), `graphite` (monochrome), `linen` (olive-brown with Georgia serif headings), `ocean` (teal), `dusk` (violet), `clay` (terracotta), `rose` (berry).
- `data-kit-mode`: `light` or `dark`. Omit it to follow the system preference.
- Themes change accents, focus rings and selected or hover highlights. Page backgrounds, surfaces, text and borders are shared neutrals in each mode, and error, warning and success colours keep their meaning across themes.
- Nested theme scopes are not supported in this release. Set the theme on `<html>` only.

Token values are also available in code:

```ts
import { themes, cssVariables, foundation, createBrandCss } from "@evenkit/tokens";

const accent = themes.grove.modes.dark.accent;
const variables = cssVariables("grove", "dark");
```

`foundation` holds spacing, type, radii, shadows, palette and control scales. The JSON export is `@evenkit/tokens/tokens.json`.

For a custom brand, `createBrandCss(config)` validates the configuration and returns CSS for a new theme ID. Supply complete light and dark modes, including `chart-series-1` through `chart-series-6`. Colours use six-digit hex except `overlay`, which uses black `rgba(0, 0, 0, alpha)` with alpha from 0 to 1. Spreading a built-in theme before overriding values preserves the required fields. Validation checks text, action, focus, strong-border and chart contrast, and rejects unsupported properties. Load the returned CSS after the base stylesheet and set `data-kit-theme` to the new ID. `brandSchema`, `themeSchema`, `validateBrand` and `validateTheme` expose the same rules.

## Rules for writing code with Evenkit

- Import components, icons and types from `@evenkit/ui`. There are no deep imports; the package exports only `.`, `/css` and `/package.json`.
- Use the kit's tokens for visual values. Style custom elements with `--pk-` custom properties instead of hard-coded colours, spacing, radii or shadows, so themes keep working.
- Evenkit supplies UI state and interaction behavior. The application supplies data, storage, network requests, business validation, authorization, routing and persistence. Components report intent through callbacks such as `onValueChange`, `onSend` or `onSave`.
- When a callback exposes an `AbortSignal` (often inside a `{ signal }` argument), pass it to the transport and check the active context (workspace, record, route) before committing a late result. Follow that callback's exported type; not every callback is cancellable. Cancellation cannot undo a remote operation already committed.
- Next.js: interactive exports keep their `"use client"` boundary. Server components may render controls with serializable props; event handlers and client state belong in a client component.
- Icons are named wrappers around Lucide (for example `FolderIcon`, `UsersIcon`, `BellIcon`) with sizes `sm`, `md` and `lg`. They animate once on hover; pass `animation="static"` or wrap a section in `<IconProvider animation="static">` to stop that.
- Use `<IconButton label="Open profile"><UserIcon /></IconButton>` for an icon-only action, or `IconButtonLink` for navigation. The required `label` supplies the default accessible name and the hover/focus tooltip. A raw `<Button shape="icon">` still needs `aria-label` or `aria-labelledby`.
- Button variants are `primary`, `secondary`, `outline`, `ghost`, `destructive` and `link`; sizes are `xs`, `sm`, `md` and `lg`. Use `ButtonLink` for navigation and `Button` for actions. `Button` defaults to `type="button"`; set `type="submit"` for a form submitter. `loading` disables the button and keeps its width and accessible name.
- Fields such as `TextField`, `TextareaField` and `SelectField` take `label`, `hint`, `error` and `optional`, and wire up the matching ARIA attributes. Put native `required` on the control; `optional` controls the label annotation.
- `Select` option values must be nonempty and unique across the whole control. Use `value` with `onValueChange`, or `defaultValue` for an uncontrolled select.
- Give `DialogContent` a `DialogTitle`, a useful `DialogDescription` and a clear way to close it. If a description is unnecessary, explicitly pass `aria-describedby={undefined}` to the content. `size` is `sm`, `md` or `lg`; use `scroll="body"` with `DialogHeader`, `DialogBody` and `DialogFooter` to keep actions visible on long content.
- `DataTable` needs a stable `getRowId`, columns with scalar `accessor` functions, and either the full client dataset or a `remote` query for server-side sorting, search and paging (see `useRemoteTable`). Selection is a controlled list of IDs; the app removes deleted IDs itself.
- `AdminShell` sidebar states are `expanded`, `collapsed` and `hidden`. A custom `renderLink` must spread every supplied prop and forward the anchor ref so routing, tooltips and focus keep working.
- For `ChatWidget` (floating launcher) and `ChatPanel` (embedded), the host owns `messages`, the draft (`value`, `onValueChange`), `status` (`idle`, `submitted`, `streaming` or `error`) and the AI request. `onSend` receives trimmed text and does not clear the draft or append the message; the host does both. Attachment-only submissions can have empty text. Widget open/maximized state can be controlled or left internal.
- Set `dir="rtl"` on the document root for a right-to-left application, including its body-mounted overlays.

## Editable source blocks

Blocks are page-level React source files (record lists and editors, settings, team administration, documents, notifications, dashboards and website sections). They are copied into the application, which then owns and edits them. They import their primitives from `@evenkit/ui`. Catalog usage examples that import from a relative path such as `./record-workflow` or `./website/examples` depend on the matching installed block. Adjust those relative imports to the installed location in the consumer.

Catalog entry IDs are not always CLI block names. Use the generated block list below, or `list` and `inspect`, to find the name and installed targets:

| Catalog entry or example | Distribution |
| --- | --- |
| `website-heroes` | Install `website-hero`. |
| `website-forms` | Install `website-contact` and/or `website-newsletter` for the forms used. |
| An import from `./website/examples` | Install `website-examples`, which includes the website sections it imports. |
| `login`, `signup`, `password-reset`, `new-password`, `rich-chat` | Import the example's components from `@evenkit/ui`; these are not CLI blocks. |

Registry items associate catalog entries through `meta.evenkit.inventoryIds`. Their `files[].path` identifies the source, while `files[].target` gives the installed path beneath `--dir`. Preserve the website subdirectory and its shared files.

Install blocks with the CLI in the Evenkit checkout. The consuming project must already declare and install `@evenkit/tokens`, `@evenkit/ui`, `react` and `react-dom`; the CLI checks this and does not modify `package.json` or lockfiles.

```sh
EVENKIT_ROOT=/path/to/evenkit
SNAPSHOT=$(mktemp -d)
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" build --output "$SNAPSHOT/catalog"
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" list --registry "$SNAPSHOT/catalog" --json
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" inspect record-detail --registry "$SNAPSHOT/catalog" --json
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" install record-detail recovery-page \
  --registry "$SNAPSHOT/catalog" --cwd /path/to/app --dir src/blocks --dry-run
node "$EVENKIT_ROOT/scripts/registry/cli.mjs" install record-detail recovery-page \
  --registry "$SNAPSHOT/catalog" --cwd /path/to/app --dir src/blocks
```

- Review the `--dry-run` output before installing. Each build needs an output directory that does not yet exist, even if an existing directory is empty. Registered source files must match committed Git `HEAD`; commit intended block changes before building a snapshot.
- Commit `.evenkit/blocks.json` with the installed files. Upgrades depend on it. Do not edit it by hand.
- Installation never overwrites an existing file it does not own, and there is no force option.
- To upgrade, build a new snapshot, run `diff` and then `upgrade --dry-run` and `upgrade` with the same block names, `--registry` and `--cwd`. Untouched files update, local edits are preserved, and a file changed on both sides is a conflict that blocks the whole plan. After resolving a conflict by hand, run `diff` again and use `upgrade NAME... --accept-local REVIEW_TOKEN` with its current `reviewToken` and the same registry/consumer options. This preserves the reviewed local files and advances their recorded baseline; it does not merge them for you.
- After an interrupted run, use `recover --cwd /path/to/app --dry-run`, then `recover`.
- The CLI prints readable text in a terminal and JSON when piped. Use `--json` or `--format json` for predictable machine output; errors go to stderr. Exit status `0` is success, `1` is invalid input or a failed operation, and `2` is a blocked plan (for example a conflict).
- Copy website blocks with their CSS and `.css.d.ts` declaration files, and use TypeScript `"moduleResolution": "Bundler"`.

## Authentication adapter

`@evenkit/auth-next` is an opt-in adapter for Supabase SSR auth in Next.js. It has no root import; use the explicit entry points:

- `@evenkit/auth-next/server`: per-request server clients, configuration validation, origin checks and verified identity checks. It imports `server-only`.
- `@evenkit/auth-next/client`: the browser client factory.
- `@evenkit/auth-next/paths`: validation for local continuation paths.
- `@evenkit/auth-next/policy`: the verified-user contract and an application-owned eligibility callback.

Configure only a publishable or legacy `anon` key; secret and service-role keys are rejected. Signing in does not make a user eligible: the application decides eligibility on the server and checks authorization again at every data and mutation boundary. The adapter creates no tables, memberships or row-level policies. `@evenkit/ui` and `@evenkit/tokens` do not depend on Next.js or Supabase, so the auth page components (`LoginPage`, `SignupPage`, `PasswordResetPage`, `NewPasswordPage`) also work in Vite apps.

The auth pages manage their forms and submission feedback. Supply their callbacks to perform sign-in, signup, password recovery or password updates with your provider. A successful callback is not an authorization check. Keep reset-password responses neutral so they do not reveal whether an email address has an account.

## Reference applications in the checkout

- `apps/catalog`: the Vite catalog behind https://evenkit.dev. After `npm ci` on a fresh checkout, run `npm run dev` and open http://127.0.0.1:5173. Its `predev` step builds the packages before starting Vite.
- `apps/admin-starter`: a Next.js admin app composed from `AdminShell` and the blocks, using fictional data. Run `npm run dev:admin` and open http://127.0.0.1:5396. Replace the fixtures in `components/starter-providers.tsx` with real transport code, and keep its `AbortSignal` handling.

## Checks

Run these in the Evenkit checkout after changing kit code:

- `npm run verify`: build, type checks, lint, unit and registry tests, Chromium catalog journeys, and admin journeys in Chromium, Firefox and WebKit. Install the engines with `npx playwright install chromium firefox webkit` first.
- `npm run verify:packages`: packs the built packages and builds independent Vite and Next.js consumers, checking server rendering and CSS delivery. Run `npm run build:packages` first; browser checks need Chromium.
- `npm run verify:examples`: compiles every catalog usage example in strict TypeScript.
- `npm run verify:registry`: registry tests plus a full install of every block into packed consumers.

In a consuming app, run its own type check and build after adding Evenkit code. Copied blocks are application source and go through the app's lint and tests.

## License

The original Evenkit package and block code is documented as internal and `UNLICENSED`; this pilot does not provide a public reuse or redistribution license. Access to this guide and its examples does not change that status. Use or distribution requires the maintainer's authorization. Third-party dependencies keep their own licenses.
