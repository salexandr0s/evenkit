# Navigation controls

Owner: Project kit. Maturity: pilot. Inventory: E01–E06. Example consumer: the local component catalog. These controls use the existing kit styles and document-level themes.

## Contracts

| Family | Contract |
| --- | --- |
| Tabs | `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` preserve Radix props and refs. The root chooses `underline` or `pills`, `sm` or `md`, direction, orientation, and automatic/manual activation. Arrow keys skip disabled triggers. Each panel is named by its trigger. Horizontal tab lists scroll within their own region and retain focus-ring space. |
| Accordion | `Accordion` preserves Radix's single/multiple value union, controlled/uncontrolled state, direction and disabled behavior. Compose Item → Header → Trigger plus Content. Headers default to h3 and support Radix `asChild` for a different heading level. Trigger icons are decorative. |
| Collapsible | Root/Trigger/Content expose Radix state and refs. It is one disclosure, without adding an accordion heading or selection model. Trigger may compose a kit Button with `asChild`. |
| Breadcrumbs | A named nav contains an ordered list. The last item is the current page. All ancestors remain available, and long labels wrap. `renderLink` receives native anchor props and a ref so a host router can preserve keyboard, click, and focus behavior. |
| Navbar | A header accepts brand, links, active ID, actions, and a router link renderer. Below the existing 768px breakpoint in its own container, links move into the existing modal Dialog. The menu closes after ordinary link activation. On a resize to desktop it closes and recovers focus to an enabled desktop link, brand, visible action or the header itself; focus on links that become hidden moves to the visible menu trigger. Disabled destinations have no href and bypass the router renderer. The complex-page skip link targets `contentId`; the host supplies a focusable destination. |
| Pagination | The host supplies a one-based `page`, `pageCount`, and `onPageChange`. Inputs are normalized for display; the component never mutates the host page silently. Previous/next and bounded numbered choices use real buttons. Optional `renderPageLink` turns available page choices into host-controlled anchors. Busy/disabled and boundary controls remain disabled. `compact` hides numbered choices and leaves named icon buttons for dense table footers. Compact controls reuse the kit Tooltip on hover/focus, with the same label as their accessible name; scrolling and activation dismiss the hint. Full-text mode retains its visible labels. Page status is announced politely. |

All controls use existing semantic colors, 32/40px control sizes, 44px narrow/coarse-pointer targets, short motion tokens and reduced-motion overrides. Native attributes and event handlers pass through. The parent supplies route destinations, labels, page data and async policy.

## Public APIs

- `TabsProps` adds `variant?: "underline" | "pills"` and `size?: "sm" | "md"` to Radix Root props. Parts export their corresponding props types.
- `AccordionProps` remains the Radix single/multiple union. Parts export native-compatible props and refs.
- `CollapsibleProps` and its parts retain Radix props and refs.
- `BreadcrumbsProps` accepts `items: readonly BreadcrumbItem[]`, optional `label`, and `renderLink`. Each item has `id`, `label`, and an optional `href` for ancestors.
- `NavbarProps` accepts `brand`, `items`, optional `activeItemId`, `actions`, `renderLink`, `contentId`, navigation/menu labels, and native header props. Each `NavbarItem` has `id`, `label`, `href`, and optional `disabled`.
- `PaginationProps` accepts `page`, `pageCount`, `onPageChange`, optional `compact`, `disabled`, `busy`, `label`, `previousLabel`, `nextLabel`, `pageLabel`, `showStatus`, `statusText`, and `renderPageLink`. `showStatus={false}` delegates announcements to an existing table; `statusText` replaces the default page count during loading or errors. Page link renderers receive native anchor props plus the destination page.

Router renderers must forward the supplied ref, children, native events and ARIA attributes. A renderer must return one focusable link. Supplying a custom renderer does not transfer routing policy to the kit. The Navbar skip link stays clipped and outside pointer hit testing until focused, so an embedded header cannot cover preceding page controls.

Navbar remembers focus owned by its desktop links or mobile trigger while responsive CSS changes visibility. A hidden-control blur restores focus to the visible replacement even when the browser clears activeElement before the resize observer. Moving focus to a host control clears that intent, so resizing does not take focus back.

## Sources and ownership

Tabs and Navbar derive presentation from the internal `tabs.v1` and `navbar.v1` contracts. Original kit wrappers supply CSS, responsive composition and APIs. Behavior uses pinned MIT-licensed Radix Tabs 1.2.1, Accordion 1.3.1 and Collapsible 1.2.1, with the existing Dialog dependency for mobile navigation. Relevant references: [Tabs](https://www.radix-ui.com/primitives/docs/components/tabs), [Accordion](https://www.radix-ui.com/primitives/docs/components/accordion), [Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible), and [ARIA breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/).

## Verification

Focused browser journeys cover tab activation and disabled skipping, single/multiple accordion expansion, disclosure state, pagination boundaries, menu dismissal and resize focus recovery, RTL and narrow wrapping. Source and catalog examples receive configured TypeScript/lint checks. Integrated browser and package-consumption results are recorded by the root integration pass.
