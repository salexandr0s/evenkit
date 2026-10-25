# Foundations and display contracts

Owner: Project kit. Maturity: pilot. Example consumer: the local component catalog. This module implements inventory A01–A07, A11, H01–H04 and H08.

These original kit components use the existing Apple Minimal values and [Card contract](/Users/nationalbank/GitHub/ai-config/claude/uiux-contract/components/card.yaml). They add no runtime dependency, asset or visual token. Components receive ordinary React/native attributes and forwarded refs. The host owns record data, routing, action behavior and focus recovery after removing content.

| Inventory | Contract and public API |
| --- | --- |
| A01 | `Prose` scopes native headings, paragraphs, links, lists, quotes and code. `Heading` selects semantic level independently of visual size. `.pk-text-muted` and `.pk-caption` are optional text recipes. Body uses the theme's sans family; headings retain the theme's heading family. |
| A02 | `Container` has content, reading, form and full widths using existing layout tokens. It is a div; hosts provide page landmarks with native HTML. |
| A03 | `Stack`, `Inline` and `Grid` use a bounded token gap scale. Inline groups wrap by default. Grid has one to four desktop columns and collapses at existing breakpoints. No child has a forced content width. |
| A04 | `Separator` is decorative by default. Set `decorative={false}` for a structural separator; vertical orientation supplies the correct ARIA orientation. |
| A05 | `Card`, `CardHeader`, `CardBody`, `CardFooter` and `CardMedia` group related content. Variants are default, elevated, outline and ghost. The passive card has no hover or click semantics. Place real links/buttons inside it. Header/body/footer use contract spacing and the footer uses a rule. Card height follows content; titles wrap. |
| A06 | `PageHeader` and `SectionHeader` compose a configurable heading, description, breadcrumb, metadata and actions. Their default heading levels are h1 and h2. Actions wrap beneath long text. |
| A07 | `ActionGroup` is a named native-tab-order group, suitable for related actions. It intentionally does not claim `role="toolbar"`; use this recipe when each action belongs in normal Tab order. Full roving toolbar behavior is outside this simple group API. |
| A11 | `VisuallyHidden` retains text in the accessibility tree. `SkipLink` moves to an existing focusable target; give the target `tabIndex={-1}`. `LiveStatus` remains mounted while its text changes, with polite atomic status announcements by default. |
| H01 | `Avatar` exposes the person's name once, shows initials until its image loads, falls back after failure and retries when src changes. Image content is decorative inside the named root. `AvatarGroup` shows a bounded set plus a named overflow count; it does not hide member names behind an unlabeled number. |
| H02 | `Tag` is passive by default. An `onSelectedChange` callback creates a pressed-state button. `onRemove` adds a separately named sibling button, so select/remove controls never nest. `TagGroup` groups related tags; the host restores focus when removing one. Tag uses existing Badge tones. |
| H03 | `DataList` and `DataListItem` keep native dl/dt/dd semantics, with responsive label/value rows. Missing values remain explicit host content. |
| H04 | `ListItem` is a div composition for media, title, description, metadata and trailing actions. Put it inside native li elements when presenting a list. Headings and links stay host-controlled. |
| H08 | `Kbd` uses native kbd markup and the mono font. Supply platform-specific characters and an accessible label when a shortcut symbol needs explanation. |

Library CSS is scoped to `pk-` classes. All values derive from existing tokens; structural zero, percentages and grid fractions are layout values. Controls keep visible focus and at least 44px targets on narrow/coarse-pointer screens. Long text wraps, logical properties support RTL, and content remains readable in all eight light/dark themes. There is no decorative animation.

## Usage and composition

Import token CSS before UI CSS. The catalog has a separate searchable entry and complete usage snippet for each inventory item. The page/layout recipes do not impose a global reset or application landmark structure.

Use one useful boundary around a related unit. Repeated list rows and descriptions can use rules without a surrounding card. The default Card follows the existing contract's small shadow; ghost removes the boundary and shadow.

For tag removal, move focus to another surviving control before the selected tag is removed. Keep a persistent `LiveStatus` for the result. The catalog example restores focus to its Reset tags control. For skip navigation, keep the destination in the document and focusable with `tabIndex={-1}`.

## Verification

Scoped ESLint and strict TypeScript checks passed for the implementation and behavior tests. A separate strict check passed for the preview/entry modules against their source exports, including unused-code and CSS-import checking. Browser journeys are prepared for avatar image failure/recovery, tag removal focus, skip-link destination focus, and long-label/narrow/RTL layouts. Root owns their integrated execution, theme inspection, builds and packed-consumer checks.
