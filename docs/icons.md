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

The catalog lets you filter by category, search names and related words such as "delete" or "directory", compare the three token sizes, and copy a named import. Each card keeps its import selectable when clipboard access is unavailable. Examples show decorative icons beside text, labelled icon buttons, and icons with independent meaning.

Add new named wrappers to `packages/ui/src/icons.tsx` when a product needs them, and include them in the catalog inventory in `apps/catalog/src/icon-data.ts`. Keep imports static; a runtime map of every library icon would include unnecessary assets.

## Alternatives inspected

| Library | Useful characteristics | Kit decision |
|---|---|---|
| [Lucide](https://lucide.dev/guide/react) | Typed individual React components, adjustable size/stroke, tree shaking | Adopt for this phase |
| [Tabler](https://tabler.io/icons) | Outline and filled variants, 24px grid, 2px stroke, MIT license | Suitable alternative for future gaps; avoid mixing similar outline sets now |
| [Phosphor](https://github.com/phosphor-icons/react) | Multiple weights, filled/duotone treatments, React and SSR imports | Consider if a product needs those treatments |

Sources were inspected on 25 October 2026. Lucide uses the ISC license, with MIT notices for Feather-derived icons. Its full notice and the TanStack dependency notices ship in `packages/ui/licenses`. See [Lucide's license](https://lucide.dev/license). Brand logos are outside this curated set.
