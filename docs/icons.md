# Icons

Use the named Lucide wrappers exported by `@project-kit/ui`. Icons animate on hover by default and accept `animation="static"` for a still version. The kit pins `lucide-react` 1.61.0 and adapts matching animations from [Lucide Animated](https://lucide-animated.com/), with kit animations for the remaining icons. Named imports support tree shaking. [Lucide React documentation](https://lucide.dev/guide/react).

```tsx
import { Button, PlusIcon, SearchIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@project-kit/ui";

<Button><PlusIcon size="sm" />Create project</Button>
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" shape="icon" aria-label="Search projects"><SearchIcon /></Button>
    </TooltipTrigger>
    <TooltipContent>Search projects</TooltipContent>
  </Tooltip>
</TooltipProvider>
<SearchIcon label="Search" />
```

Icons are decorative by default. Use `shape="icon"` for a square icon button and put its accessible label on the button itself. Use an icon's `label` only when the icon independently conveys meaning. Pair status icons with visible text. Sizes are `sm` (16px), `md` (20px, default), and `lg` (24px), with a shared stroke width of 2 and inherited text color.

Use icon buttons for familiar actions whose context is visible, such as copying a code block, downloading a file, revealing a password, or undoing an archive notice. Show the action name in a shared tooltip on hover and keyboard focus. Keep visible labels for primary actions, critical confirmations, recovery instructions, and choices an icon cannot explain. Use `Undo2Icon` to reverse an action, `RotateCcwIcon` to retry, and `EyeIcon` / `EyeOffIcon` to show or hide a password.

Place utility icons inline with the content or action row they belong to. Use `size="xs" variant="ghost" shape="icon"` with a `size="sm"` glyph: the desktop control is 24px with a 16px icon and no visible box at rest. Narrow screens and coarse pointers expand the target to 44px while keeping the glyph small. Larger standalone actions can use the existing button sizes.

Use `UserIcon` for one person, an account, or a profile. Use `UsersIcon` for a team or group. The silhouettes differ, so a person row does not look like the destination for the whole team.

```tsx
import { UserIcon, UsersIcon } from "@project-kit/ui";

<span><UserIcon />Alex Morgan</span>
<span><UsersIcon />Team</span>
```

The set contains 215 named wrappers, including these families:

| Purpose | Icons |
|---|---|
| People and teams | `UserIcon`, `UsersIcon`, `UserPlusIcon`, `UserCheckIcon`, `ContactRoundIcon` |
| Workspace | `Building2Icon`, `BriefcaseBusinessIcon`, `LayoutDashboardIcon` |
| Communication | `BellIcon`, `InboxIcon`, `MailIcon`, `MessageSquareIcon` |
| Time and saved content | `CalendarDaysIcon`, `ClockIcon`, `BookmarkIcon`, `ArchiveIcon` |
| Common actions | `UploadIcon`, `DownloadIcon`, `CopyIcon`, `PencilIcon`, `FilterIcon`, `Undo2Icon` |
| Sidebar controls | `PanelLeftIcon`, `PanelLeftCloseIcon`, `PanelLeftOpenIcon` |
| Status | `ActivityIcon`, `CheckIcon`, `CircleCheckIcon`, `CircleAlertIcon`, `TriangleAlertIcon`, `InfoIcon`, `CircleHelpIcon`, `CircleIcon` |
| Chat actions | `MaximizeIcon`, `MinimizeIcon`, `SquareIcon`, `RotateCcwIcon` |
| Selection controls | `SquareCheckIcon`, `CircleDotIcon`, `ToggleRightIcon`, `BoldIcon`, `Columns3Icon`, `GroupIcon` |
| Forms | `ListChecksIcon`, `ListXIcon`, `KeyRoundIcon`, `EyeIcon`, `EyeOffIcon`, `ListFilterIcon`, `SaveIcon`, `CloudCheckIcon` |
| Layout and content | `TypeIcon`, `RectangleHorizontalIcon`, `LayoutGridIcon`, `SeparatorHorizontalIcon`, `PanelTopIcon`, `HeadingIcon`, `TagsIcon`, `ListIcon`, `ListTreeIcon`, `Table2Icon`, `FilePenLineIcon` |
| Navigation and overlays | `PanelsTopLeftIcon`, `ListCollapseIcon`, `ChevronsUpDownIcon`, `PanelTopDashedIcon`, `ArrowLeftRightIcon`, `MessageSquareTextIcon`, `PanelRightIcon` |
| Helpers and tools | `AccessibilityIcon`, `KeyboardIcon`, `SlidersHorizontalIcon`, `GaugeIcon`, `FilterXIcon`, `ShapesIcon` |
| Food & drink | `UtensilsIcon`, `ChefHatIcon`, `PizzaIcon`, `CroissantIcon`, `CoffeeIcon`, `WineIcon` |
| Money & payments | `WalletIcon`, `CreditCardIcon`, `PiggyBankIcon`, `ReceiptTextIcon`, `EuroIcon`, `BitcoinIcon` |
| Charts & analytics | `ChartNoAxesCombinedIcon`, `ChartLineIcon`, `ChartPieIcon`, `ChartCandlestickIcon`, `ChartScatterIcon`, `ChartGanttIcon` |
| Shopping & delivery | `ShoppingCartIcon`, `StoreIcon`, `GiftIcon`, `PackageCheckIcon`, `TruckIcon`, `QrCodeIcon` |
| Travel & places | `MapPinIcon`, `CompassIcon`, `PlaneIcon`, `TrainFrontIcon`, `HotelIcon`, `LuggageIcon` |
| Health & fitness | `HeartPulseIcon`, `StethoscopeIcon`, `PillIcon`, `HospitalIcon`, `DumbbellIcon`, `BrainIcon` |
| Nature & weather | `LeafIcon`, `SproutIcon`, `TreePineIcon`, `CloudRainIcon`, `CloudSnowIcon`, `ThermometerIcon` |
| Devices & technology | `LaptopIcon`, `SmartphoneIcon`, `CameraIcon`, `HeadphonesIcon`, `WifiIcon`, `CodeXmlIcon` |

Choose a category to browse a scenario, or search for the task: "breakfast" finds coffee, croissants, eggs, and bananas; "revenue" finds money and charts; "portfolio" finds line, pie, and candlestick charts. Search and category filters work together.

```tsx
import { Button, CoffeeIcon, CreditCardIcon, ChartPieIcon, TruckIcon } from "@project-kit/ui";

<Button startIcon={<CoffeeIcon />}>Breakfast menu</Button>
<Button startIcon={<CreditCardIcon />}>Payment methods</Button>
<span><ChartPieIcon animation="static" />Portfolio allocation</span>
<span><TruckIcon />Delivery tracking</span>
```

Use `PanelLeftCloseIcon` for collapsing the sidebar and `PanelLeftOpenIcon` for expanding it. Keep the action's accessible name on its button; a tooltip can also show that action to pointer users.

ActionMessage uses `CircleCheckIcon` for success, `CircleAlertIcon` for errors, `TriangleAlertIcon` for warnings, and `InfoIcon` for information. Each glyph accompanies visible text so color is not the only status cue.

## Hover animation and static icons

Icons stay still on mount and while idle. Hovering an icon or its enclosing button or link plays its animation once; leaving resets it. Keyboard focus does not start an animation. Reduced-motion preferences keep icons still, including icons explicitly set to `animation="hover"`.

Moving artwork can extend slightly beyond the SVG viewport without being cut off. Its layout box stays at the selected token size, so buttons and text do not shift. Badge icon slots allow this motion too. Coin drops and vehicle trails keep their movement close to the icon.

Use `IconProvider` to set a default for a section or application. An explicit icon prop overrides the nearest provider. Both modes retain the same import, size tokens, accessible label, and SVG ref.

```tsx
import { BellIcon, Button, IconProvider, PlusIcon } from "@project-kit/ui";

<BellIcon animation="hover" label="Notifications" />
<BellIcon animation="static" label="Notifications" />

<IconProvider animation="static">
  <Button startIcon={<PlusIcon />}>Create project</Button>
  <BellIcon animation="hover" label="Notifications" />
</IconProvider>
```

For a custom hover area, put `data-icon-trigger` on the enclosing element. The catalog uses this on each icon card. This attribute controls motion only; use native buttons or links for actions and keep their accessible names.

The catalog lets you filter by category, search names and related words such as "delete" or "directory", compare the three token sizes, and choose hover or static motion. Each card shows JSX for the selected settings and keeps its import selectable when clipboard access is unavailable. Copy import still copies only the named import. Examples compare both animation modes and show decorative icons beside text, labelled icon buttons, and icons with independent meaning.

Every catalog sidebar entry has an explicit icon in `apps/catalog/src/catalog.tsx`. The icon reference includes a Controls category and component search terms such as "checkbox", "fieldset", and "combobox".

Add named wrappers to the matching `packages/ui/src/icons-*.tsx` module, such as `icons-food.tsx` or `icons-charts.tsx`; general interface wrappers remain in `icons.tsx`. Use the shared factory in `create-kit-icon.tsx` and export each icon from `packages/ui/src/index.ts`.

Include each icon in the catalog inventory. General interface entries live in `apps/catalog/src/icon-data.ts`; food, finance, charts, shopping, travel, health, nature, and device entries live in `apps/catalog/src/scenario-icon-data.ts`. Keep labels and search aliases in the catalog. Assign an icon when adding a catalog sidebar entry. Keep imports static; a runtime map of every library icon would include unnecessary assets.

## Alternatives inspected

| Library | Useful characteristics | Kit decision |
|---|---|---|
| [Lucide](https://lucide.dev/guide/react) | Typed individual React components, adjustable size/stroke, tree shaking | Adopt for this phase |
| [Lucide Animated](https://lucide-animated.com/) | Per-icon hover animations based on Lucide | Adapt matching animations; supply kit animations for gaps |
| [Tabler](https://tabler.io/icons) | Outline and filled variants, 24px grid, 2px stroke, MIT license | Suitable alternative for future gaps; avoid mixing similar outline sets now |
| [Phosphor](https://github.com/phosphor-icons/react) | Multiple weights, filled/duotone treatments, React and SSR imports | Consider if a product needs those treatments |

Sources were inspected on 25 October 2026. Lucide uses the ISC license, with MIT notices for Feather-derived icons. Lucide Animated and Motion use MIT licenses. Their notices ship in `packages/ui/licenses`; [UI provenance](../packages/ui/PROVENANCE.md#icons) records the pinned source and adaptations. See [Lucide's license](https://lucide.dev/license). Brand logos are outside this curated set.
