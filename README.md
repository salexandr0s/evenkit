# Shared project kit

Reusable tokens, React controls, icons, an admin shell, data tables, and authentication pages, with a local component catalog. This repository lives in the requested `design-tokens` folder. Version 0.1.0 is a pilot for evaluation in new projects.

## Start the catalog

Requires Node.js 22.12 or later and npm. From this repository:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`. The dev command builds the packages first. If you edit package source while the catalog is running, run `npm run build:packages` to update its public artifacts. The catalog itself has Vite hot reload.

The catalog has fifteen entries, including login, signup, password reset, and new-password pages. Search by component or state, switch between Neutral and Grove, and try light, dark, or system appearance. Forms, navigation, table state changes, and authentication outcomes are local previews.

## Packages

| Package | Contents | Public imports |
|---|---|---|
| `@project-kit/tokens` | Typed scales, palettes, two themes, brand validation, contrast checks, generated CSS/JSON | Main export, `/css`, `/tokens.json` |
| `@project-kit/ui` | Controls and feedback, 32 icons, AdminShell, DataTable, and four authentication pages | Main export, `/css` |
| `@project-kit/catalog` | Searchable examples and usage reference | Local application |

Both libraries export built files and declarations. UI styles use `pk-` classes and `--pk-` variables, with no global reset. Consumers need React 19 and React DOM 19; no Tailwind, Next.js, database, or authentication dependency is required by the UI package.

## Use in another project

Build and pack both packages locally:

```sh
npm run build:packages
mkdir -p .artifacts
npm pack --workspace @project-kit/tokens --workspace @project-kit/ui --pack-destination .artifacts
```

From a sibling project directory, install both tarballs together:

```sh
npm install ../design-tokens/.artifacts/project-kit-tokens-0.1.0.tgz ../design-tokens/.artifacts/project-kit-ui-0.1.0.tgz
```

Import the styles in this order, once at the application entry or root layout:

```tsx
import "@project-kit/tokens/css";
import "@project-kit/ui/css";
import { Button, TextField } from "@project-kit/ui";

export function ProjectForm() {
  return <form>
    <TextField label="Project name" name="projectName" required />
    <Button type="submit">Create project</Button>
  </form>;
}
```

Provide your own submit handler and data storage. TextField and TextareaField associate labels, hints, and errors with their native controls and preserve additional `aria-describedby` IDs. A loading Button preserves its accessible name and width while disabling interaction. Use ButtonLink for navigation and keep ordinary button semantics for actions.

Button and ButtonLink accept `startIcon` and `endIcon` for decorative icons beside a wrapping label, and `fullWidth` to fill their container. Use `shape="icon"` with one glyph child and an `aria-label` or `aria-labelledby` for a square control. Icon shape takes precedence over `fullWidth`. Icon controls use the selected 32/40/48px size on desktop and at least 44px on narrow or coarse-pointer screens. Pass `aria-pressed` and your own state handler for toggle actions. A caller-provided `aria-busy` is preserved; `loading` also disables a Button and displays its spinner.

Set theme attributes on the document root:

```html
<html lang="en" data-kit-theme="grove" data-kit-mode="dark">
```

Omit `data-kit-mode` to follow the system. Neutral is the default theme. This release supports document-level themes; nested scopes are not supported for body-mounted dialog portals. Custom brands use the same validated model and contrast checks; see [token usage](packages/tokens/README.md).

For Next.js, import CSS in the root layout. Interactive UI exports retain their `"use client"` boundary. Server components may render controls with serializable props; handlers and client state belong in a client component. A dialog needs its Title and Description, with a trigger and a clear dismissal action.

## Fields

Use TextField for an input and TextareaField for multiline text. Both accept native control props and refs, plus `label`, `hint`, `error`, `optional`, and `fieldClassName`. Required controls show a required cue; `optional` shows an optional cue when the control is not required. Label also supports these cues when composing a field manually. Native `required` belongs on the control. An error sets `aria-invalid`; without an error, a caller-provided invalid state is preserved.

```tsx
import { MailIcon, TextareaField, TextField } from "@project-kit/ui";

<TextField label="Contact email" type="email" name="email" required
  startAdornment={<MailIcon />} error={errors.email} />
<TextareaField label="Notes" name="notes" optional rows={4}
  hint="Add context for your team." error={errors.notes} />
```

Input and TextField accept `startAdornment` and `endAdornment` for icons, text, or labelled actions. Include meaningful prefixes or units in the label or hint; adornments are not part of the native value. Custom actions need their own accessible name and disabled behavior. Set those explicitly when the field is disabled or read-only. A read-only control remains focusable and selectable; a disabled control uses native disabled behavior.

Input always renders a stable wrapper so changing adornments preserves the native input, its value, and focus. The wrapper uses `display: contents` when empty of adornments. `className`, `style`, events, and refs remain on the native input; consumer CSS should not rely on the input being a direct child of the field. Textarea retains native vertical resizing. Use refs to focus the first invalid control on submission, as the catalog form demonstrates. Validation rules and character counters belong to the consuming form.

## Select

Select accepts flat options or a mix of options and `SelectOptionGroup` objects. Each group has a stable `id`, a `label`, and an `options` array. Option values must be nonempty and unique across the entire control; group IDs must be unique. Empty groups are omitted. When there are no options, the popup shows `emptyMessage` (default: “No options available.”) and remains keyboard dismissible.

```tsx
import { SelectField, type SelectOptionGroup } from "@project-kit/ui";

const templates: SelectOptionGroup = {
  id: "team", label: "Team templates",
  options: [
    { value: "blank", label: "Blank project" },
    { value: "launch", label: "Product launch", description: "Plan the next release." }
  ]
};

<SelectField label="Project template" name="template" required
  options={[templates]} value={template} onValueChange={setTemplate}
  hint="Choose a starting point." error={errors.template} />
```

SelectField adds the same label, hint, error, optional cue, and external-description support as TextField. Its ref points to the trigger button. Option descriptions are associated with their menu items; the closed trigger and native form option retain only the label. Plain rows stay 36px on desktop and at least 44px in touch layouts. Described or long rows grow to fit their text. Set `dir` for RTL control and popup layout.

Use `defaultValue` for an uncontrolled selection or `value` with `onValueChange` for application state. An empty value displays the placeholder. A named control participates in its containing form, or the form identified by `form`. Applications own validation and controlled reset behavior; the catalog demonstrates focusing an invalid field and clearing it with a reset action.

## Authentication pages

Use `LoginPage`, `SignupPage`, `PasswordResetPage`, and `NewPasswordPage` with your application's typed submission callbacks. The pages provide validation, password visibility, pending/error/success states, and responsive layout using shared tokens, controls, and icons. `AuthLayout` and `PasswordField` are also public compositions.

Applications own authentication services, recovery tokens/sessions, navigation, and password policy. Signup success states must describe the actual next step; reset confirmation uses neutral account wording. See [authentication integration](docs/authentication.md) and the [phase plan](AUTH_PAGES_PLAN.md) for callback contracts and examples.

## Admin shell and tables

`AdminShell` provides a sidebar, header, content area, skip link, and a drawer for narrow containers. Supply navigation items, the active item ID, branding, actions, and footer content. Native links work by default; `renderLink` lets a consuming router receive the same link props. Authentication and route matching belong to the application. Use `contentAs="section"` when embedding a shell inside an existing main landmark.

`DataTable` takes the entire client dataset, columns with scalar accessors, and a stable `getRowId`. It supplies sorting, search, pagination, optional controlled selection, numeric alignment, and loading/error/empty states. Selection uses IDs and persists across sorting, search, and page changes. Its select-all control applies to the visible page. Server pagination, fetching, and bulk actions belong to the application; this release does not include a server table adapter.

```tsx
import { DataTable, type DataTableColumn } from "@project-kit/ui";

interface Project { id: string; name: string; members: number }
const columns: readonly DataTableColumn<Project>[] = [
  { id: "name", header: "Project", accessor: row => row.name },
  { id: "members", header: "Members", accessor: row => row.members, align: "end" },
];

<DataTable caption="Projects" data={projects} columns={columns}
  getRowId={row => row.id} density="compact" />
```

Table rows use 44px default or 36px compact density, growing when custom content needs more room. Dropdown options use 36px desktop rows. Interactive targets use at least 44px in touch layouts. See [icons](docs/icons.md) for the chosen library, alternatives, import names, and accessible usage.

## Check the kit

```sh
npm run verify
npm run verify:packages
```

`verify` builds, type-checks, lints, runs token validation tests, and exercises the catalog in Chromium. Install the test browser with `npx playwright install chromium` if it is not available. The browser journeys cover component search, appearance precedence, form recovery, dialog focus/dismissal, dropdown sizing, narrow layouts, reduced motion, table behavior, and shell navigation.

`verify:packages` checks the currently built package artifacts. It packs them, creates independent temporary Vite and Next.js consumers, builds them without Tailwind, serves each production build on an allocated loopback port, and verifies token, control, icon, shell, and table CSS delivery. It removes its own temporary directories and servers. The result is saved to `.artifacts/package-verification.json`. Run `build:packages` before this check after package edits.

The `fixtures` directory is deliberately outside npm workspaces. The installation check must resolve packaged public exports rather than following workspace source links. Its checked-in templates pin framework versions; generated fixture locks and output stay in its temporary directory.

## Decisions and sources

The inherited UI contract supplies the foundation scales and palette. Semantic action/text pairs were adjusted to meet contrast requirements. Built-in themes and configurable brands validate foreground/background, focus, and control-border pairs. New visual dimensions belong in the token source, not in individual controls.

Basic controls and compositions are original kit code using the internal contracts and shadcn composition references. Radix supplies dropdown and dialog behavior; the kit controls their presentation, including an inset chevron. Select accepts an `options` array and an `onValueChange` callback. Lucide supplies icons, and TanStack Table supplies the table engine. Package provenance is recorded in [tokens](packages/tokens/PROVENANCE.md) and [UI](packages/ui/PROVENANCE.md). The [library evaluation](docs/library-evaluation.md) covers shadcn, Uiverse, Mantine, HeroUI, and Chakra.

Packages are local and unpublished. Internal code remains unlicensed for public distribution; dependency licenses retain their own terms. The kit maintainer owns shared interfaces and releases, while consuming projects own adoption, product rules, and deployment.

Authentication-service adapters, uploads, registry distribution, a server table adapter, and application migrations remain later phases from the [implementation plan](IMPLEMENTATION_PLAN.md). See [compatibility](docs/compatibility.md) for tested versions and limits.
