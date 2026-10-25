# Hallmark design pass

25 October 2026. Scope: all 14 catalog entries and their exported UI components. This is a polish pass on the existing application, using [Hallmark 2.0.0](https://github.com/Nutlope/hallmark/tree/7ec868225c6caa040558c321ee0fefa0e73f83a8/skills/hallmark), commit `7ec868225c6caa040558c321ee0fefa0e73f83a8`.

The catalog is a tool for inspecting, trying, and copying components. Its existing theme tokens, typography, component APIs, sample data, and working interactions remain the design system. Hallmark's app-screen guidance applies; its marketing hero, imagery, and screen word budgets do not.

## Component audit

| Area and components reviewed | Finding and result | Retained deliberately |
| --- | --- | --- |
| Catalog shell, search, appearance control, preview, code example, documentation panels | Removed the category/version eyebrow, duplicate title badge, decorative live dot, and outer preview card. Documentation uses dividers. Main content has a token-based maximum width. Heading wrapping and focus-ring space are explicit. | Search, all 14 hash destinations, appearance persistence, clipboard notices, code scrolling, source links, and version/maturity information in their useful locations. |
| Themes and all eight palette specimens | Removed the nested document frame, inert eyebrow, fake link styling, decorative status dot, and specimen shadow. Only the selected theme has a filled Apply button. Metadata occupies separate spans. | Each specimen needs its own theme boundary, named swatches, selection marker, and independently resolved colors and typography. |
| Design tokens, token samples, contrast disclosure, theme sample | Token records use rules instead of repeated card/footer fills. Theme metadata follows the sample heading. | Values come from the token source. Search, copy, expanded contrast pairs, category filters, and visual samples remain. No palette or scale values changed. |
| Icons, all 60 named exports, reference and usage patterns | Removed background tiles around gallery glyphs and repeated card/import-panel fills. Pattern examples use rules. | One Lucide family, common stroke and size tokens, decorative versus named semantics, search aliases, selectable sizes, and working import copying. The wrappers share one audited rendering contract. |
| Button and ButtonLink | Secondary/outline/ghost hover surfaces are quieter; primary/destructive buttons lose incidental shadows. Variant specimens are unboxed in a balanced three-by-two desktop grid, two columns on small screens. Removed an inert badge above the saving example. | Six variants, actual links, explicit pressed state, loading geometry, disabled/native semantics, labels that can grow, and touch targets. Secondary hover uses the elevated surface so Neutral/Grove dark modes still change visibly. |
| Input, Textarea, Label, TextField, TextareaField, field frame and adornments | Disabled controls now have explicit muted fill and ink, in addition to cursor/native state. | The form retains one useful boundary. Required/optional cues, label associations, hints/errors, focus, stable adornment wrappers, readonly selection, textarea resizing, validation, and recovery already serve their purpose. |
| Select and SelectField | Disabled fill/ink follows the field treatment. No unrelated restyling needed. | Trigger boundary, checked tick, keyboard highlight, groups, option descriptions, growing long labels, empty popup, native form integration, RTL and touch row sizes. |
| Dialog, Trigger, Close, Content, Header, Title, Description, Body, Footer | The saved-project preview becomes a plain row separated by a rule; its redundant Project badge is removed. | The actual modal requires an elevated surface, boundary, shadow, focus containment, visible title/description, body scrolling, dismissal, and stable footer actions. |
| TooltipProvider, Tooltip, Trigger, Content and arrow | Added explicit `aria-hidden` to the arrow SVG, making its decorative role clear in source as well as through Radix. | Recent surface, border, arrow and shadow design already fits. Hover/focus timing, placement, wrapping, supplementary text, and keyboard dismissal remain. |
| AdminShell, navigation groups/items, icon rail, drawer and resize handle | Current navigation uses a restrained surface and text plus one accent marker. Summary figures lose separate cards and gain tabular numerals. | Expanded/collapsed/hidden states, magnetic dragging, resizing transitions, active marker, sidebar scrolling, mobile drawer, tooltips and focus recovery. Existing sidebar work was preserved. |
| DataTable, toolbar, selection bar, cells, sorting, pagination and states | Quieter table border, simpler selection toolbar, and an unboxed review-details panel. Local-data disclosure is plain text. | One functional table boundary, scroll containment, column alignment, numeric formatting, row selection, search, sort, truncation tooltips, custom cells, loading/error/empty/full states, and host actions. |
| ChatWidget, ChatPanel, history, messages and composer | Removed the empty-state icon tile and preview eyebrow. History hover differs from selection. Preview heading names the two modes; footer uses sentences. | Launcher, floating/maximized states, conversation search/history, drafts, suggested prompts, streamed text, stop/retry/copy controls, composer, focus and state-driven motion. |
| Badge and ActionMessage | Audited without forcing another visual change. The less prominent catalog frame gives these examples a clearer setting. | Compact semantic badges, counts, optional state dots/icons, small/medium sizes, outline/soft variants, wrapping and RTL. Message tone edge and icon tile are part of the recent requested design; neutral message surfaces, headings, actions, roles and recovery remain. |
| Spinner and Skeleton | Flattened skeleton specimen cards, removed project-sample shadow, made its folder tile neutral, and separated size labels from values. | Static placeholders match the loaded layout. The loading card retains one boundary, synchronized placeholder inset/padding, cancellable reload, stable focus, one progress announcement, spinner sizing and reduced motion. |
| EmptyState | Removed the dashed upload-like outline and decorative icon tile. Result rows and troubleshooting use simple rules. | Title/description/actions, compact and start-aligned forms, logical RTL alignment, first-use/template/search/error examples, long-text wrapping, retry and focus recovery. |

Every core export in `packages/ui/src/index.ts` is covered by the component families above. Components that already worked visually were retained rather than changed to inflate the pass.

## Copy changes

- Removed the repeated category/version line and title-level “Pilot”; group navigation and the sidebar version/maturity information remain.
- Preview theme/mode and theme specimen date/contributor metadata use separate spans instead of dot-separated strings.
- “Pilot · ready for evaluation” became “Pilot, ready for evaluation.”
- “React controls · document-level themes” became “React controls with document-level themes.”
- The saving example's decorative “Project settings” badge was removed; the actual heading and save behavior remain.
- The dialog specimen's redundant “Project” badge was removed. “Save updates the card below” became “Save updates the project below” to match the unboxed presentation.
- Chat's “Interactive demo” badge was removed. “One assistant, two ways to use it” became “Embedded and floating chat.” The footer separates its existing local-data statements into sentences.
- In palette specimens, “Project notes” moved from an eyebrow to the footer, replacing the noninteractive “View project ↗” span. No link or action was removed.
- Loading size names and measurements are separate spans. Token theme/mode metadata moved below the sample heading.

No new product claim, metric, testimonial, photo, or external service was added. Existing project records and chat responses remain disclosed local examples.

## Verification and Hallmark findings

The baseline and confirming sweep used Hallmark's static and rendered checks on all 14 URLs, including eight viewport widths from 320 to 1920px. The rendered comparison is at `../.hallmark/compare.html`. Separate captures cover every route in light/dark at desktop and phone widths: 56 captures with no document overflow or runtime errors.

Hallmark's preservation check retained **41/41 links, 29/29 fields, 138/138 handlers and 2/2 figures**. It reports 145/146 original headings retained, with the chat heading replacement recorded in the stylesheet.

The raw linter is **not clean**. Baseline: 20 FAIL, 17 REFLEX, 7 WARN. Confirmation: 18 FAIL, 16 REFLEX, 4 WARN. The remaining findings were inspected rather than suppressed or hidden:

| Finding | Review |
| --- | --- |
| 10a: two layout-property transitions | Sidebar grid resizing and chat positioning are existing requested interactions. Their short token-based transitions and reduced-motion fallbacks remain. These are deliberate departures from Hallmark's transform/opacity-only rule, not a claimed Floor waiver. |
| 56: 15 sticky-position findings | One source finding and the same finding on 14 routes. Sidebar and header occupy separate grid columns; they do not overlap each other. Moving the header down by the sidebar's height would break the layout. |
| 39a: adorned input opacity reset | The child sets `opacity: 1` to avoid double dimming inside its disabled wrapper. Native disabled behavior, cursor, muted fill and ink are supplied by the shared disabled rules. This is a cascade false positive. |
| 26b: two missing-state findings | The preview stylesheet does not own button active/disabled styling. Both live in the shared UI stylesheet and were exercised by browser checks. |
| 72: 14 route-level cramped-box findings | The renderer counts descendants beyond the scrolling sidebar and hidden contents of the closed contrast disclosure. It also applies generic box padding to compact badges and input adornments. Inspected screenshots and interaction checks show these controls retain their intended geometry and scrolling. |
| F1: three apostrophe warnings | Existing ordinary contractions follow the repository's prose convention. No typographic rewrite was needed. |
| F25: narrow data table | The table retains deliberate horizontal scrolling to preserve all fields and row actions. Additional columns require scrolling on a phone. This is a retained usability tradeoff, not a claim that every column fits. |

Production build, configured TypeScript checks, ESLint, eight token tests and all 41 Chromium browser journeys passed. Independent packed Vite and Next consumers built and passed stylesheet/HTTP smoke checks. Final button-only CSS refinements were rebuilt, recaptured and checked with the two existing button journeys. The final dialog badge/copy cleanup passed focused ESLint, configured TypeScript checks, a fresh build and both dialog journeys. Packed-consumer checks passed on the final built package artifacts.

Firefox/Safari and physical mobile keyboards were not tested. No package was published or deployment performed. Existing test changes and concurrent sidebar logic changes belong to the surrounding work and were preserved; this pass did not change tests to accommodate the design.

## Independent visual review

A fresh-context reviewer inspected every route in the full-page desktop and mobile captures, all current light desktop captures, and selected current dark and mobile views. The only requested correction was the redundant Project badge in the dialog specimen; it was removed and recaptured. The table scrolling tradeoff was answered in this report. The reviewer scored both findings closed and returned **ship**.

## Evidence

- `.artifacts/hallmark/before.log`, `after.log`: unfiltered Hallmark findings.
- `.hallmark/before/`, `.hallmark/shots/`, `.hallmark/compare.html`: original and revised screenshots.
- `.artifacts/hallmark/screens/`, `visual-checks.json`: light/dark desktop/mobile captures.
- `.artifacts/hallmark/build.log`, `typecheck.log`, `lint.log`, `tokens.log`, `browser.log`, `button-final.log`, `dialog-final.log`, `packages.log`: verification results.
- `.artifacts/hallmark/pre-existing.patch`: working-tree diff recorded before this pass.
