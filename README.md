# Evenkit

Reusable tokens, React controls, layouts, forms, navigation, feedback, data and file controls, editable page blocks, and AI chat. Browse the component catalog at [evenkit.dev](https://evenkit.dev). Version 0.1.0 is a pilot for evaluation in new projects.

## Start the catalog

Requires Node.js 22.12 or later and npm. From this repository:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173` for the Evenkit homepage, with interactive component examples, theme previews and setup guidance. Choose Browse components to enter the catalog, or open `/#buttons` directly. The Evenkit logo returns to the homepage. Theme and appearance choices carry across both views.

The dev command builds the packages first. If you edit package source while the catalog is running, run `npm run build:packages` to update its public artifacts. The catalog itself has Vite hot reload.

The catalog includes 86 sections: the original 14, 48 priority examples, and 24 additions for dates, multiple values, numbers, remote tables, records, accounts, uploads, search and onboarding. Search a component name or an inventory ID such as `D02`. Open `/#themes` to compare eight palettes and apply one across the library. The catalog follows your system appearance until you choose light or dark with the sun/moon button; your choice is remembered. Forms, navigation, table state changes, uploads and chat replies are local previews.

The catalog uses AdminShell for its own navigation. Each entry has an icon. Drag the sidebar edge or use the single header button to expand, minimise, or hide it; the display mode is remembered. Search stays in the header, and narrow screens use a navigation drawer.

## Deploy the catalog

Vercel serves the catalog at [evenkit.dev](https://evenkit.dev) from the `evenkit` project in the Block Consult GmbH team. DNS stays with Cloudflare; both `evenkit.dev` and `www.evenkit.dev` point to Vercel using DNS-only CNAME records.

From the repository root, deploy the current working tree:

```sh
vercel deploy --prod --scope blockconsult
```

The root `vercel.json` installs the workspace dependencies, builds both packages and the catalog, then publishes `apps/catalog/dist`. The site uses the original logo in `apps/catalog/public/evenkit-logo.png`; the catalog colors its silhouette with the active theme. The package libraries remain unpublished.

## Packages

| Package | Contents | Public imports |
|---|---|---|
| `@evenkit/tokens` | Typed scales, palettes, eight themes, brand validation, contrast checks, generated CSS/JSON | Main export, `/css`, `/tokens.json` |
| `@evenkit/ui` | Controls, layouts, forms, navigation, overlays, files and feedback; 215 Lucide icons, AdminShell, DataTable and chat | Main export, `/css` |
| `@evenkit/catalog` | Searchable examples and usage reference | Local application |

Both libraries export built files and declarations. UI styles use `pk-` classes and `--pk-` variables, with no global reset. Consumers need React 19 and React DOM 19; no Tailwind, Next.js, database, or authentication dependency is required by the UI package.

## Use in another project

Build and pack both packages locally:

```sh
npm run build:packages
mkdir -p .artifacts
npm pack --workspace @evenkit/tokens --workspace @evenkit/ui --pack-destination .artifacts
```

From a sibling project directory, install both tarballs together:

```sh
npm install ../design-tokens/.artifacts/evenkit-tokens-0.1.0.tgz ../design-tokens/.artifacts/evenkit-ui-0.1.0.tgz
```

Import the styles in this order, once at the application entry or root layout:

```tsx
import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { Button, TextField } from "@evenkit/ui";

export function ProjectForm() {
  return <form>
    <TextField label="Project name" name="projectName" required />
    <Button type="submit">Create project</Button>
  </form>;
}
```

Provide your own submit handler and data storage. TextField and TextareaField associate labels, hints, and errors with their native controls and preserve additional `aria-describedby` IDs. A loading Button preserves its accessible name and width while disabling interaction. Use ButtonLink for navigation and keep ordinary button semantics for actions.

Button and ButtonLink accept `startIcon` and `endIcon` for decorative icons beside a wrapping label, and `fullWidth` to fill their container. Use `shape="icon"` with one glyph child and an `aria-label` or `aria-labelledby` for a square control. Icon shape takes precedence over `fullWidth`. Sizes `xs`, `sm`, `md` and `lg` produce 24/32/40/48px icon controls on desktop and at least 44px on narrow or coarse-pointer screens. Use `xs` with a 16px glyph and `variant="ghost"` for compact inline utilities. Pass `aria-pressed` and your own state handler for toggle actions. A caller-provided `aria-busy` is preserved; `loading` also disables a Button and displays its spinner.

Set theme attributes on the document root:

```html
<html lang="en" data-kit-theme="grove" data-kit-mode="dark">
```

Choose from Neutral, Grove, Graphite, Linen, Ocean, Dusk, Clay, and Rose using their lowercase names. Each theme coordinates page and surface shades, primary and secondary text, borders, and actions. Linen also uses serif headings. See the [theme guide](packages/tokens/README.md#built-in-themes) for the palette directions.

Omit `data-kit-mode` to follow the system. Neutral is the default theme. This release supports document-level themes; nested scopes are not supported for body-mounted dialog portals. Custom brands use the same validated model and contrast checks; see [token usage](packages/tokens/README.md).

For Next.js, import CSS in the root layout. Interactive UI exports retain their `"use client"` boundary. Server components may render controls with serializable props; handlers and client state belong in a client component. A dialog needs its Title and Description, with a trigger and a clear dismissal action.

## Status and feedback

Badge supports `tone`, `size="sm" | "md"`, `variant="soft" | "outline"`, and an optional decorative `icon` or `dot`. An icon takes precedence over a dot. Short labels retain 20/24px heights; longer labels wrap within the available width. Keep labels concise and format counts in your application. Badges are passive spans and preserve native attributes and refs.

```tsx
import { ActionMessage, Badge, Button, CheckIcon } from "@evenkit/ui";

<Badge tone="success" icon={<CheckIcon />}>Approved</Badge>
<Badge tone="accent" size="sm" variant="outline" dot>Live</Badge>
<ActionMessage tone="warning" heading="Review before publishing"
  actions={<Button variant="outline" onClick={review}>Review changes</Button>}>
  Two required fields still need attention.
</ActionMessage>
```

ActionMessage accepts `info`, `success`, `warning`, and `error` tones with distinct decorative icons. Use `heading` for a visible heading, `actions` for buttons or links, and `icon` to replace the default glyph; `null` or `false` hides it. The native `title` attribute remains available. Headings, bodies, and actions accept React content and wrap in narrow layouts. Error messages default to `role="alert"`; other tones use `role="status"`. You can override the role and ARIA attributes, for example `role="note"` for static guidance. Your application owns dismissal, retry behavior, and focus recovery; messages do not disappear automatically.

## Loading

Spinner accepts `size="sm" | "md" | "lg"` for 16/20/24px, with a 20px default and a forwarded span ref. A standalone spinner uses `role="status"` and `label="Loading"`; supply a useful label or native ARIA naming. Set `aria-hidden="true"` when visible text or a parent status already describes progress. Decorative spinners do not add a role or generated label. Reduced motion stops the rotation.

Skeleton accepts `variant="block" | "text" | "avatar"` and `size="sm" | "md" | "lg"`. Blocks have 32/40/48px minimum heights, text lines are 12/14/16px high, and square avatars are 32/40/48px. The default remains a medium block with a 40px minimum. Avatar placeholders shrink square in narrow containers. Native div props, refs, and custom classes/styles remain available. Skeletons stay static and hidden from assistive technology; keep interactive content outside them.

Use `aria-busy` on the content being replaced and one persistent status outside it:

```tsx
<section aria-label="Project details" aria-busy={loading}>
  {loading ? <Skeleton variant="text" /> : <ProjectDetails />}
</section>
<p role="status" aria-atomic="true">
  {loading && <Spinner size="sm" aria-hidden="true" />}
  {loading ? "Loading project details…" : "Project details loaded."}
</p>
```

Match the placeholder layout to the content it replaces. The catalog keeps the reload control mounted and cancels an earlier request when another reload starts.

## Empty states

EmptyState accepts a `title`, optional `description`, a decorative `icon`, and `action` and `secondaryAction` content. Either action can appear alone. Use `size="sm"` for compact panels and `align="start"` for logical alignment in either text direction; the defaults remain medium and centered. Actions and long text wrap within the available width.

```tsx
<EmptyState icon={<FolderIcon />} title="No projects yet" titleAs="h3"
  description="Create a project or start from a template."
  action={<Button onClick={createProject}>Create project</Button>}
  secondaryAction={<Button variant="outline" onClick={chooseTemplate}>Use a template</Button>} />
```

`titleAs` accepts `p` (the default), `div`, or `h1` through `h6`. Choose a heading level that fits the page; use `div` for block content in the title slot. The root remains a div with native attributes and a forwarded ref. The `title` prop is visible React content, not the native hover attribute. EmptyState adds no live region or focus behavior. Keep search announcements outside it, and move focus to a persistent control when an action replaces the panel.

## AI chat

Use `ChatWidget` for a floating launcher that opens a compact chat and expands into a workspace with conversation history. Use `ChatPanel` to embed the same interface in a page. Both include searchable history, suggested prompts, multiline input, streaming feedback, stop/retry controls, and answer copying. They inherit the kit's theme and tokens.

Your project supplies messages, conversations, drafts, and response callbacks. It decides where to save history and which AI service to use. See the [chat integration guide](docs/chat.md) for the API and a working host example; open `/#chat` in the catalog to try the sample conversations.

## Fields

Use TextField for an input and TextareaField for multiline text. Both accept native control props and refs, plus `label`, `hint`, `error`, `optional`, and `fieldClassName`. Required controls show a required cue; `optional` shows an optional cue when the control is not required. Label also supports these cues when composing a field manually. Native `required` belongs on the control. An error sets `aria-invalid`; without an error, a caller-provided invalid state is preserved.

```tsx
import { MailIcon, TextareaField, TextField } from "@evenkit/ui";

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
import { SelectField, type SelectOptionGroup } from "@evenkit/ui";

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

Every dropdown in the catalog uses this shared design: a padded popup, a tinted selected row with a trailing checkmark, and a rotating chevron. Opening fades with a 4px movement over 160ms; closing takes 120ms. Closed options ignore pointer and keyboard input during the exit. Reduced motion removes both popup animations and the chevron transition. Disabling an open control dismisses its popup immediately so the host can recover focus.

Use `defaultValue` for an uncontrolled selection or `value` with `onValueChange` for application state. An empty value displays the placeholder. A named control participates in its containing form, or the form identified by `form`. Applications own validation and controlled reset behavior; the catalog demonstrates focusing an invalid field and clearing it with a reset action.

Disabling Select closes an open popup; re-enabling it keeps the popup closed. If an asynchronous update disables the focused control, the host should choose a useful remaining focus target. DataTable handles this for its own search, row, and pagination controls.

## Dialog

DialogContent accepts `size="sm" | "md" | "lg"` (420/560/720px, constrained to the viewport) and `scroll="content" | "body"`. Defaults preserve the original medium dialog with whole-content scrolling. Use DialogHeader, DialogBody, and DialogFooter as direct children with `scroll="body"` to keep the heading and actions visible while long content scrolls. At viewport heights of 640px or less, the entire dialog scrolls so every section remains reachable.

Dialogs share an elevated surface and an inset close control. The footer uses the same surface, with a content-aligned hairline, 16px top padding and 8px between actions. The surface and backdrop open in 160ms and close in 120ms; a small directional movement accompanies the fade. Closing controls stop accepting input immediately. Reduced motion removes the animations. Catalog dialogs, navigation drawers, and the chat window use this same component, with positioning suited to each surface.

```tsx
import {
  Button, Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose
} from "@evenkit/ui";

<Dialog>
  <DialogTrigger asChild><Button>Edit project</Button></DialogTrigger>
  <DialogContent size="lg" scroll="body">
    <DialogHeader>
      <DialogTitle>Edit project</DialogTitle>
      <DialogDescription>Update the project details.</DialogDescription>
    </DialogHeader>
    <DialogBody>
      <form id="edit-project" onSubmit={saveProject}>{/* Fields */}</form>
    </DialogBody>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <Button type="submit" form="edit-project">Save project</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Use a unique form ID (for example, from React's `useId`) to connect a footer submit button to its form inside the body. Keep validation and unsaved-draft behavior in the application. The catalog demonstrates first-invalid focus, saving, and discarding changes when dismissed. Radix manages focus containment, Escape, outside dismissal, and trigger focus restoration. Native Radix callbacks and refs remain available. Set `dir="rtl"` on DialogContent for logical close-button positioning; use `closeLabel` to name the close control or `showCloseButton={false}` when providing another clear dismissal action.

## Tooltips

Wrap related triggers in TooltipProvider. TooltipTrigger supports `asChild` so the button or link keeps its native semantics. Every icon-only trigger needs its own accessible label; a tooltip is supplementary. Tooltips open on hover after 220ms or immediately on keyboard focus, remain open while hovered, and close on Escape or activation. Keep actions and essential instructions outside the tooltip.

```tsx
import { Button, UserIcon, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@evenkit/ui";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button shape="icon" aria-label="Open profile"><UserIcon /></Button>
    </TooltipTrigger>
    <TooltipContent side="right">Open your profile</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

TooltipContent includes the compact surface, text wrapper, and matching arrow. It supports Radix positioning props, a forwarded ref, `container`, and `showArrow`; it owns its markup and does not expose `asChild`. Text wraps within the viewport, with a 280px maximum width. The inverse foreground/background colors follow the document theme. Opening and closing fade with a 2px movement over 120ms; reduced motion removes both animations. Provider timings are overridable. The catalog and shared component icon actions use this same tooltip. Use `UserIcon` for a person and `UsersIcon` for a team; the icon reference includes all 215 named wrappers.

## Admin shell and tables

`AdminShell` provides expanded (260px), collapsed (72px icon rail), and hidden desktop sidebar states. One header button cycles through these modes; its icon, label, and tooltip describe the next action. Use `defaultSidebarState` for an uncontrolled shell, or `sidebarState` and `onSidebarStateChange` for application state. The shell keeps that desktop choice while narrow containers use a full-label drawer.

Drag the sidebar's outer edge to resize it. The edge attracts gently toward each mode and snaps to the nearest one on release. A grip remains available when hidden. Dragging follows the pointer directly; buttons and release use a short eased transition, disabled for reduced motion. The separator also supports Left/Right arrows, Home to hide, and End to expand, with direction-aware arrows in RTL. Escape cancels a drag. The change callback runs when a new mode is committed, not on each pointer move.

```tsx
import { useState } from "react";
import { AdminShell, FolderIcon, LayoutDashboardIcon, type AdminSidebarState } from "@evenkit/ui";

const [sidebar, setSidebar] = useState<AdminSidebarState>("expanded");
<AdminShell
  brand="Demo workspace" compactBrand={<LayoutDashboardIcon />}
  sidebarState={sidebar} onSidebarStateChange={setSidebar}
  navigation={[{ items: [{ id: "projects", label: "Projects", href: "/projects", icon: <FolderIcon /> }] }]}
  activeItemId="projects" header="Projects"
>{children}</AdminShell>
```

Give each navigation item a distinct `icon`. Legacy items without one receive a neutral circle. Collapsed links retain accessible names and show custom tooltips on hover or focus. Optional `end` content supports counts or badges in expanded links and the drawer. `compactBrand` and `compactFooter` provide icon-rail content; the full footer is hidden when collapsed. Native links work by default. A custom `renderLink` must spread all supplied props and forward the anchor ref, including events and ARIA attributes, so routing, tooltips, and focus work together. Route matching and persistence belong to the application. Use `contentAs="section"` when embedding inside an existing main landmark.

`DataTable` takes the entire client dataset, columns with scalar accessors, and a stable `getRowId`. It supplies sorting, search, pagination, optional controlled selection, numeric alignment, and loading/error/empty states. Selection uses IDs and persists across sorting, search, and page changes. Its select-all control applies to the visible page. Pass `remote` to control the server query and total; remote rows bypass client processing. `useRemoteTable` manages cancellable request lifetimes around your loader. See [remote tables](docs/remote-tables.md) for query scope, selection, retries, bulk actions and column settings.

Set a column's `overflow="wrap"` for longer text. Primitive accessor cells truncate by default and expose a custom tooltip on hover or keyboard focus only when the text overflows. Custom `cell` renderers remain unclipped regardless of `overflow`, so buttons and their focus rings stay visible; compose any specialized truncation inside your renderer. Set `searchable={false}` and `sortable={false}` on action columns. Accessors still supply the scalar sorting and search values for other custom cells.

The footer reports the displayed row range and filtered total. Clear search resets the page and returns focus to the search field. Controlled selection can include IDs hidden by filtering or absent from the current dataset. Clear selection clears every selected ID; your application must also remove deleted IDs when it changes the dataset. Pass bulk controls through `selection.actions` and disable them when appropriate for your request state. The table disables its own data controls while unavailable, but does not change the behavior of host toolbar or selection actions.

```tsx
import { DataTable, type DataTableColumn } from "@evenkit/ui";

interface Project { id: string; name: string; members: number }
const columns: readonly DataTableColumn<Project>[] = [
  { id: "name", header: "Project", accessor: row => row.name, overflow: "wrap" },
  { id: "members", header: "Members", accessor: row => row.members, align: "end" },
];

<DataTable caption="Projects" data={projects} columns={columns}
  getRowId={row => row.id} density="compact" />
```

Table rows use 44px default or 36px compact density, growing when custom content needs more room. Dropdown options use 36px desktop rows. Interactive targets use at least 44px in touch layouts. See [icons](docs/icons.md) for the chosen library, alternatives, import names, and accessible usage.

All 215 icons animate once when hovered, including when the pointer enters their containing button or link. They reset on exit and respect reduced motion. Use `<BellIcon animation="static" />` for a still icon, or wrap a section in `<IconProvider animation="static">` to set its default. An explicit icon prop overrides the provider. The Icons catalog compares both modes and shows the matching JSX, with categories for food, payments, charts, shopping, travel, health, weather, and technology. Search terms such as "breakfast", "revenue", and "portfolio" help find an icon by intent. See [icon motion](docs/icons.md#hover-animation-and-static-icons) for usage.

## Check the kit

```sh
npm run verify
npm run verify:packages
```

`verify` builds, type-checks, lints, runs token validation tests, and exercises the catalog and a focused table host fixture in Chromium. Install the test browser with `npx playwright install chromium` if it is not available. The browser journeys cover token and icon search/copying, theme persistence, form recovery, feedback and loading announcements, empty-state actions, dialog and tooltip behavior, narrow and RTL layouts, reduced motion, table selection/focus, sidebar resizing, and chat drafts, streaming, retry, and copying.

`verify:packages` checks the currently built package artifacts. It packs them, creates independent temporary Vite and Next.js consumers, builds them without Tailwind, serves each production build on an allocated loopback port, and verifies token, control, icon, tooltip, shell, table, and chat CSS delivery. The Vite fixture builds a ChatWidget; the Next.js fixture builds a ChatPanel and checks its server-rendered title alongside the shell and table. Interactive chat behavior is checked in the catalog browser journeys. The script removes its own temporary directories and servers and saves its result to `.artifacts/package-verification.json`. Run `build:packages` before this check after package edits.

The `fixtures` directory is deliberately outside npm workspaces. The installation check must resolve packaged public exports rather than following workspace source links. Its checked-in templates pin framework versions; generated fixture locks and output stay in its temporary directory.

## Decisions and sources

The inherited UI contract supplies the foundation scales and palette. Semantic action/text pairs were adjusted to meet contrast requirements. Built-in themes and configurable brands validate foreground/background, focus, and control-border pairs. New visual dimensions belong in the token source, not in individual controls.

Basic controls and compositions are original kit code using the internal contracts and shadcn composition references. Radix supplies dropdown and dialog behavior; the kit controls their presentation, including an inset chevron. Select accepts an `options` array and an `onValueChange` callback. Lucide supplies icons, and TanStack Table supplies the table engine. Package provenance is recorded in [tokens](packages/tokens/PROVENANCE.md) and [UI](packages/ui/PROVENANCE.md). The [library evaluation](docs/library-evaluation.md) covers shadcn, Uiverse, Mantine, HeroUI, and Chakra.

Packages are local and unpublished. Internal code remains unlicensed for public distribution; dependency licenses retain their own terms. The kit maintainer owns shared interfaces and releases, while consuming projects own adoption, product rules, and deployment.

Authentication services, private storage integration, registry distribution, and application migrations remain later phases from the [implementation plan](IMPLEMENTATION_PLAN.md). Remote table adapters, upload queues and editable list/detail/edit/settings/onboarding source blocks are included. Applications supply their transports, account operations and storage. See [compatibility](docs/compatibility.md) for tested versions and limits.

## Priority component guide

The [48-item tracker](docs/priority-build-plan.md) records implementation and verification by inventory ID. API contracts, composition examples and host responsibilities are documented in [foundations](docs/foundations.md), [selection and progress](docs/selection-controls.md), [forms](docs/form-controls.md), [navigation](docs/navigation.md), [overlays](docs/overlays.md), and [data, files and pages](docs/data-workflows.md).

The editable blocks are [record-workflow.tsx](registry/blocks/record-workflow.tsx) and [recovery-page.tsx](registry/blocks/recovery-page.tsx). Copy the relevant file into the consuming application and import it locally; it imports maintained controls from the installed UI package. Supply records, save/retry callbacks and recovery actions. Record saves receive an AbortSignal, and the example host uses fictional local data. Storage, authorization and routing policies remain application code.

The [component roadmap](docs/component-roadmap-plan.md) tracks the 24 additional inventory items. Their API contracts are in [dates and formatting](docs/dates.md), [multiple values and numbers](docs/value-fields.md), [remote tables](docs/remote-tables.md), [records and settings](docs/records-settings.md), [uploads and images](docs/uploads.md), and [commands and wizard flows](docs/commands-wizard.md). Copy `record-detail.tsx` alongside `record-workflow.tsx` for connected detail/edit pages; `account-settings.tsx` and `onboarding-wizard.tsx` provide editable account and setup flows.

Run `npm run verify:examples` to compile all 86 copied catalog examples and check all 72 inventory ID mappings. Run `npm run verify:packages` after building to install packed packages in independent Vite/Next consumers, copy the editable blocks, and check builds, server rendering and delivered styles.
