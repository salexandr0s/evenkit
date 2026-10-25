# Icons

Use the named Lucide wrappers exported by `@project-kit/ui`. The kit pins `lucide-react` 1.61.0. Its outlined icons suit controls, navigation, and table actions, and its static React imports support tree shaking. [Lucide React documentation](https://lucide.dev/guide/react).

```tsx
import { Button, PlusIcon, SearchIcon } from "@project-kit/ui";

<Button><PlusIcon size="sm" />Create project</Button>
<Button variant="ghost" shape="icon" aria-label="Search projects">
  <SearchIcon />
</Button>
<SearchIcon label="Search" />
```

Icons are decorative by default. Use `shape="icon"` for a square icon button and put its accessible label on the button itself. Use an icon's `label` only when the icon independently conveys meaning. Pair status icons with visible text. Sizes are `sm` (16px), `md` (20px, default), and `lg` (24px), with a shared stroke width of 2 and inherited text color.

Use `UserIcon` for one person, an account, or a profile. Use `UsersIcon` for a team or group. The silhouettes differ, so a person row does not look like the destination for the whole team.

```tsx
import { UserIcon, UsersIcon } from "@project-kit/ui";

<span><UserIcon />Alex Morgan</span>
<span><UsersIcon />Team</span>
```

The set contains 60 named wrappers, including these families:

| Purpose | Icons |
|---|---|
| People and teams | `UserIcon`, `UsersIcon`, `UserPlusIcon`, `UserCheckIcon`, `ContactRoundIcon` |
| Workspace and reporting | `Building2Icon`, `BriefcaseBusinessIcon`, `ChartNoAxesCombinedIcon`, `LayoutDashboardIcon` |
| Communication | `BellIcon`, `InboxIcon`, `MailIcon`, `MessageSquareIcon` |
| Time and saved content | `CalendarDaysIcon`, `ClockIcon`, `BookmarkIcon`, `ArchiveIcon` |
| Common actions | `UploadIcon`, `DownloadIcon`, `CopyIcon`, `PencilIcon`, `FilterIcon` |
| Sidebar controls | `PanelLeftIcon`, `PanelLeftCloseIcon`, `PanelLeftOpenIcon` |
| Status | `ActivityIcon`, `CheckIcon`, `CircleCheckIcon`, `CircleAlertIcon`, `TriangleAlertIcon`, `InfoIcon`, `CircleHelpIcon`, `CircleIcon` |
| Chat actions | `MaximizeIcon`, `MinimizeIcon`, `SquareIcon`, `RotateCcwIcon` |

Use `PanelLeftCloseIcon` for collapsing the sidebar and `PanelLeftOpenIcon` for expanding it. Keep the action's accessible name on its button; a tooltip can also show that action to pointer users.

ActionMessage uses `CircleCheckIcon` for success, `CircleAlertIcon` for errors, `TriangleAlertIcon` for warnings, and `InfoIcon` for information. Each glyph accompanies visible text so color is not the only status cue.

The catalog lets you filter by category, search names and related words such as "delete" or "directory", compare the three token sizes, and copy a named import. Each card keeps its import selectable when clipboard access is unavailable. Examples show decorative icons beside text, labelled icon buttons, and icons with independent meaning.

Add new named wrappers to `packages/ui/src/icons.tsx` when a product needs them, and include them in the catalog inventory in `apps/catalog/src/icon-data.ts`. Keep imports static; a runtime map of every library icon would include unnecessary assets.

## Alternatives inspected

| Library | Useful characteristics | Kit decision |
|---|---|---|
| [Lucide](https://lucide.dev/guide/react) | Typed individual React components, adjustable size/stroke, tree shaking | Adopt for this phase |
| [Tabler](https://tabler.io/icons) | Outline and filled variants, 24px grid, 2px stroke, MIT license | Suitable alternative for future gaps; avoid mixing similar outline sets now |
| [Phosphor](https://github.com/phosphor-icons/react) | Multiple weights, filled/duotone treatments, React and SSR imports | Consider if a product needs those treatments |

Sources were inspected on 25 October 2026. Lucide uses the ISC license, with MIT notices for Feather-derived icons. Its full notice and the TanStack dependency notices ship in `packages/ui/licenses`. See [Lucide's license](https://lucide.dev/license). Brand logos are outside this curated set.
