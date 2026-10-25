# Component inventory and expansion plan

Research date: 25 October 2026. Project: `@evenkit` in `design-tokens`.

The kit should cover complete application and website flows, from small controls to editable page templates. The research baseline had 14 catalog sections. The tables below preserve that baseline and the proposed expansion scope.

The original 48 priority entries and 24 application additions are implemented. Subsequent verified families include [document-library](./document-library.md), [team administration](./team-administration.md) and auth pages. The final combined counts and evidence are tracked in [admin integration](./admin-integration.md). Remaining Follow-up and Optional entries are proposals.

This is a proposed inventory, based on the original project review, the internal Apple Minimal contracts, current public exports, and fresh research of the original upstream libraries. Priorities are recommendations. An entry records a reusable family or work item; it does not promise a separate package, export, or ready implementation for every name.

## What exists

Baseline checked against [public exports](../packages/ui/src/index.ts) and [catalog entries](../apps/catalog/src/catalog-data.ts) before the priority build.

| Catalog section | Available capability | Boundary or remaining gap |
| --- | --- | --- |
| Themes | Eight themes with light/dark modes and system preference | Document-level theming is the supported portal setup. |
| Design tokens | Typed foundations, semantic colors, generated CSS and JSON | New visual requirements need explicit token additions. |
| Icons | 60 named Lucide wrappers | Add named glyphs when a component needs them. |
| Buttons | Button, ButtonLink, icon shapes, busy states, variants | Toggle groups, split actions, and grouped actions are separate work. |
| Fields | Input, Textarea, Label, TextField, TextareaField | Specialized fields and reusable form orchestration are missing. |
| Select | Flat/grouped single selection and field composition | Search, multiple selection, and action menus are separate controls. |
| Dialog | Trigger, content, header, body, footer, close, sizes | General sheets and destructive confirmations are missing. |
| Tooltips | Hover/focus hints, placement, wrapping, arrow | Interactive popovers and hover cards are separate patterns. |
| Admin shell | Navigation groups, draggable expanded/collapsed/hidden sidebar, mobile drawer | Standalone navigation components and account/workspace menus are missing. |
| Data table | Client search, sorting, pagination, selection, custom cells, recovery states | Checkbox and pagination are internal; no public semantic Table or remote-data mode. |
| AI chat | Floating/embedded chat, history, composer, message actions | Transport, storage, rich rendering, and attachments belong to later work. |
| Status | Badge and persistent ActionMessage | Toasts and notification management are missing. |
| Loading | Spinner and static Skeleton variants | Measured progress and task progress compositions are missing. |
| Empty state | First-use, search, recovery, compact and action compositions | Full error/access/offline pages need templates. |

These are local pilot capabilities. Existing verification evidence is in [compatibility](./compatibility.md) and the [design pass](./hallmark-design-pass.md); this research did not rerun runtime checks.

Five gaps already have internal specifications: **Card, Tabs, Toast, Dropdown/Menu, and Navbar**. Implementing them would put existing design decisions to use. The action DropdownMenu should remain distinct from the form Select.

## How to read the inventory

| Label | Meaning |
| --- | --- |
| Next | Original priority foundations, now implemented. |
| Built | Requested application components implemented in the current roadmap. |
| Follow-up | Common compositions and richer controls; prepare after their dependencies. |
| Optional | Keep a documented candidate; implement when a named project needs it. |
| UI | Maintained React component or small composition using kit CSS. |
| Recipe | Documented composition of existing controls or native HTML; a new abstraction may be unnecessary. |
| Block | Editable page or larger flow distributed as source. |
| Adapter | Explicit framework/provider integration with its own dependencies and checks. |
| Extend | Expand or extract an existing implementation rather than duplicate it. |

Rows retain their original scope; Next and Built rows are implemented, while other rows remain proposed additions or extensions. Subparts such as CardHeader/CardBody, individual form states, sizes, and color variants are included in their family rather than counted separately.

## Foundations and layout

Use the existing [token source](../packages/tokens/src/foundation.ts), [internal contracts](/Users/nationalbank/GitHub/ai-config/claude/uiux-contract/README.md), and current restrained [catalog treatment](./hallmark-design-pass.md). A useful container does not need a decorative card around it.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| A01 | Typography and prose | Next / Recipe | Heading hierarchy, body, caption, muted text, lists, quotes, inline code, links. |
| A02 | Container and page width | Next / Recipe | Content, reading, form, and full-width layouts using shared widths. |
| A03 | Stack, inline group, responsive grid | Next / Recipe | Consistent spacing, wrapping, alignment, responsive columns. |
| A04 | Separator | Next / UI | Horizontal/vertical rules with decorative or structural semantics. |
| A05 | Card | Next / UI | Header/body/footer/media; outline and elevated treatments only where useful. |
| A06 | Page header and section header | Next / UI | Heading, description, breadcrumb slot, contextual metadata, actions. |
| A07 | Toolbar and action group | Next / UI | Wrapping actions and filters; keyboard toolbar behavior when appropriate. |
| A08 | Aspect ratio and media frame | Follow-up / Recipe | Stable image/video dimensions and predictable fallback space. |
| A09 | Scroll region | Follow-up / UI | Native scrolling, accessible naming, unclipped focus, overflow cues. |
| A10 | Resizable split pane | Optional / UI | Persistent pane sizing, keyboard adjustment, touch behavior, RTL. |
| A11 | Accessibility helpers | Next / Recipe | Visually hidden text, skip links, live-status patterns and consistent accessible names. |
| A12 | Locale and direction | Follow-up / Recipe | Locale/RTL context, logical placement, number/date formatting and translated labels. |

## Actions and selection controls

The [Radix primitive inventory](https://www.radix-ui.com/primitives/docs/overview/introduction) covers useful behavior foundations. The local DataTable already demonstrates a private checkbox; reuse its requirements while making the public field API consistent.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| B01 | Checkbox and checkbox group | Next / UI, Extend | Checked/unchecked/mixed, group label, hint/error, native form values. |
| B02 | Radio group | Next / UI | One-of-many selection, label/description, horizontal/vertical layouts. |
| B03 | Switch | Next / UI | Immediate preference changes with explicit pending/failure behavior. |
| B04 | Toggle and toggle group | Next / UI | Pressed actions, single/multiple selection, accessible names. |
| B05 | Segmented control | Next / UI | Compact view or mode selection; distinguish it from tab navigation. |
| B06 | Button group | Next / UI | Joined or spaced related actions with safe label wrapping. |
| B07 | Split button | Follow-up / UI | Primary action plus related menu choices; separate focus targets. |
| B08 | Copy action | Next / UI | Copy text/value, confirmed success/failure, stable focus. |
| B09 | Download action | Follow-up / Recipe | Real download links and explicit preparation/progress/error states. |
| B10 | Selection cards | Follow-up / UI | Radio/checkbox card presentation with correct native semantics. |
| B11 | Slider and range slider | Follow-up / UI | Single/range values, keyboard adjustment, labels and numeric alternative. |
| B12 | Rating | Optional / UI | Read-only rating and editable rating with labeled values. |

## Form inputs and composition

Compare [Mantine input families](https://mantine.dev/core/package/), [HeroUI form and collection components](https://heroui.com/en/docs/react/components), and the [shadcn combobox](https://ui.shadcn.com/docs/components/radix/combobox). Choose a behavior dependency after inspecting the actual source: even a documentation route containing `radix` can reference another primitive implementation.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| C01 | Fieldset and form section | Next / UI | Group labels, descriptions, required cues, disabled groups. |
| C02 | Form error summary and status | Next / UI | Linked field errors, first-invalid recovery, pending/saved/failed messages. |
| C03 | Search field | Next / UI, Extend | Clear control, search naming, result feedback; reuse field frame. |
| C04 | Password field | Next / UI | Accessible show/hide, autofill, password-manager compatibility. |
| C05 | Number field | Built / UI | Locale-aware parsing, limits, steps, decimal values, empty state. |
| C06 | Currency, percentage, unit fields | Built / Recipe | Explicit unit/currency, precision, display/edit values, validation. |
| C07 | Combobox and autocomplete | Next / UI | Searchable options, custom rows, keyboard selection, clear and no-results states. |
| C08 | MultiSelect | Built / UI | Multiple values, removable selections, count, overflow and clear-all. |
| C09 | Tags/token input | Built / UI | User-created values, validation, duplicate handling, keyboard removal. |
| C10 | OTP/PIN field | Follow-up / UI | Paste, autofill, grouped digits, accessible naming and invalid feedback. |
| C11 | Phone and masked input | Optional / UI | Country context, unambiguous stored value, paste and edit behavior. |
| C12 | Color field and picker | Optional / UI | Text entry, swatches, alpha where needed, token/brand validation. |
| C13 | Inline editable field | Follow-up / UI | Enter/edit/save/cancel, pending/error, focus recovery. |
| C14 | Repeatable field group | Follow-up / UI | Add/remove rows, stable IDs, per-row errors and focus. |
| C15 | Form actions and dirty-state recipe | Next / Recipe | Save/cancel/reset, unsaved indication, submission and dismissal recovery. |

Prefer ordinary input types for email and URLs. Character counters, adornments, required/optional labels, and field errors extend the existing fields; they do not need competing field systems. Form-state library selection remains a separate decision.

## Dates and time

[HeroUI DatePicker](https://heroui.com/en/docs/react/components/date-picker), [React Aria DatePicker](https://react-aria.adobe.com/DatePicker), and [Mantine dates](https://mantine.dev/dates/getting-started/) are the references. Define date-only, local time, and zoned timestamp values explicitly before implementation.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| D01 | Calendar | Built / UI | Keyboard date navigation, today/selected/unavailable states, locale. |
| D02 | Date field and date picker | Built / UI | Typed entry plus calendar popup; parsing and min/max validation. |
| D03 | Date-range picker | Built / UI | Start/end dates, incomplete selection, presets, invalid ranges. |
| D04 | Time field and time picker | Built / UI | 12/24-hour presentation, minute steps, labeled controls. |
| D05 | Date-time picker | Optional / UI | Compose D02/D04 with an explicit timezone contract. |
| D06 | Month/year picker | Optional / UI | Reporting periods and coarse date selection. |
| D07 | Timezone selector | Optional / UI | Search, IANA identifiers, current offset, daylight-saving context. |
| D08 | Date/number/file-size formatting | Built / Recipe | Locale-aware display; semantic time markup and stable stored values. |

## Navigation and disclosure

The missing Tabs and Navbar already have [internal component contracts](/Users/nationalbank/GitHub/ai-config/claude/uiux-contract/components). Follow the keyboard models in the [WAI-ARIA pattern guide](https://www.w3.org/WAI/ARIA/apg/patterns/) for each interaction.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| E01 | Tabs | Next / UI | Underline/pill treatments, panels, keyboard movement, overflow. |
| E02 | Accordion | Next / UI | Single/multiple expansion, meaningful headings, disabled sections. |
| E03 | Collapsible | Next / UI | One disclosure region without unnecessary accordion structure. |
| E04 | Breadcrumbs | Next / UI | Current page, long paths, responsive overflow. |
| E05 | Navbar/navigation menu | Next / UI | Public/app header, active links, mobile menu, brand/action slots. |
| E06 | Pagination | Next / UI, Extend | Standalone list navigation, page ranges, disabled and busy states. |
| E07 | Navigation item/group | Follow-up / UI, Extend | Extract useful shell pieces without duplicating sidebar state. |
| E08 | Steps/step indicator | Built / UI | Current/completed/upcoming/error states and noninteractive progress. |
| E09 | Table of contents/anchor navigation | Follow-up / UI | Document sections, current section, scroll offsets and keyboard links. |
| E10 | Command palette/global search | Built / UI | Commands versus links, groups, shortcuts, empty/loading results. |

## Menus and overlays

[Radix DropdownMenu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) is the action-menu reference. Reuse existing Dialog behavior where appropriate, while preserving the distinct semantics of menus, confirmations, and supplementary content.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| F01 | DropdownMenu | Next / UI | Actions, disabled/destructive items, separators, check/radio items, submenus. |
| F02 | Popover | Next / UI | Click/focus-open interactive content, dismissal, viewport collision. |
| F03 | AlertDialog/confirmation | Next / UI | Destructive action, explicit cancel, pending/failure and focus recovery. |
| F04 | Sheet/side drawer | Next / UI, Extend | Public side-panel family; reuse modal focus and scroll behavior. |
| F05 | Bottom drawer | Optional / UI | Touch-friendly presentation, keyboard dismissal, safe viewport/keyboard sizing. |
| F06 | Hover card | Follow-up / UI | Supplementary profile/link preview, focus access, usable touch fallback. |
| F07 | Context menu | Optional / UI | Secondary-click actions with a visible keyboard/touch alternative. |
| F08 | Menubar | Optional / UI | Desktop editor commands; keyboard navigation and submenu behavior. |
| F09 | Overlay layering and portal recipe | Follow-up / Recipe | Menus inside dialogs, theme inheritance, scroll locks and nested focus recovery. |

## Feedback and async work

The [internal toast contract](/Users/nationalbank/GitHub/ai-config/claude/uiux-contract/components/toast.yaml), [Radix Toast](https://www.radix-ui.com/primitives/docs/components/toast), and [Gatekeeper toast](/Users/nationalbank/GitHub/gatekeeper/apps/web/src/Toast.tsx) inform ephemeral feedback. Gatekeeper's timer, focus, and stale-context handling are useful requirements; its application event contracts stay local.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| G01 | Toast | Next / UI | Queue/limit, dismiss/action, paused timing, accessible announcement, context cleanup. |
| G02 | Progress and meter | Next / UI | Determinate/indeterminate progress and separate bounded measurement semantics. |
| G03 | Banner/announcement bar | Built / UI | Persistent page/app notice, optional action/dismissal, reserved layout space. |
| G04 | Save/submission status | Next / Recipe | Saving, saved, failed, retry and unsaved changes; reuse ActionMessage. |
| G05 | Task progress | Follow-up / UI | Multi-stage work, completed/failed/cancelled outcomes, retry/cancel actions. |
| G06 | Connection/session status | Built / UI | Offline/reconnecting/stale/session-expiring states with recovery. |
| G07 | Loading overlay and local busy region | Follow-up / Recipe | Defined blocking scope, persistent announcements and focus preservation. |
| G08 | Undo feedback | Follow-up / Recipe | Confirmed reversible action, explicit availability window, failure handling. |

## Data display and small content patterns

Use [Chakra's display catalog](https://chakra-ui.com/docs/components/concepts/overview) and existing local samples to select useful compositions. Native lists and description lists should remain available without extra wrappers.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| H01 | Avatar and avatar group | Next / UI | Image/initials/fallback, meaningful names, overflow count. |
| H02 | Tag/chip and tag group | Next / UI | Display, removal or selection with distinct semantics; reuse Badge styling. |
| H03 | Description/data list | Next / Recipe | Label/value details, compact/responsive layout, missing values. |
| H04 | List item and rich item row | Next / UI | Leading media, title/description, metadata, trailing actions. |
| H05 | Statistic/KPI | Built / UI | Value, unit, period, comparison and text-based trend. |
| H06 | Timeline/activity item | Built / UI | Actor, action, timestamp, grouped events and pending/error states. |
| H07 | Code block and inline code | Built / UI | Overflow, copy feedback, language labels and long lines; highlighting is off. See [rich chat](./rich-chat.md). |
| H08 | Keyboard shortcut/Kbd | Next / UI | Platform-aware shortcut display and accessible descriptions. |
| H09 | Text overflow/read-more | Follow-up / Recipe | Wrapping first, deliberate truncation, full-content access. |
| H10 | Presence/unread indicator | Built / UI | Text equivalents for state; no color-only meaning. |

## Lists, filtering, and tables

Build on the [current DataTable](../packages/ui/src/data-table.tsx), the original LSJ/Alithos table findings in the [project review](/Users/nationalbank/project-kit-review-2026-10-25/project-review.md), and [securicheck filter feedback](/Users/nationalbank/GitHub/securicheck/apps/web/src/components/ui/filter-feedback.tsx). Distinguish draft filters from the query that produced the visible results.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| I01 | Semantic Table | Next / UI | Caption, header/body/footer, alignment, density, scroll containment. |
| I02 | Filter bar and filter field | Next / UI | Search, facets, sort, reset, apply versus immediate behavior. |
| I03 | Applied filters | Next / UI | Removable chips, count, clear-all, pending/applied feedback. |
| I04 | Sort control | Built / UI | Field and direction, accessible current sort, reusable outside tables. |
| I05 | Bulk action bar | Built / UI, Extend | Selected count, actions, clear, cross-page scope; extract table composition. |
| I06 | Column visibility and display settings | Built / UI, Extend | Hide/show columns, density, useful persistence boundary. |
| I07 | Expanded rows and row details | Follow-up / UI, Extend | Controlled expansion, nested content, focus-safe actions. |
| I08 | Remote-data table mode | Built / Adapter, Extend | Controlled sorting/filtering/paging, totals, loading and stale responses. |
| I09 | Saved views | Optional / Block | Named filters/sort/columns; storage and sharing policies stay application-owned. |
| I10 | Virtualized list/table | Optional / Adapter | Large-data rendering with explicit keyboard and screen-reader checks. |
| I11 | Editable table/grid | Optional / Adapter | Cell editing, validation, save/cancel and concurrency; separate scope from read-only tables. |

## Files and media

References: [Leitspur upload picker](/Users/nationalbank/GitHub/leitspur/apps/intake/components/inputs/upload-dropzone.tsx), [Mantine Dropzone](https://mantine.dev/x/dropzone/), and [Chakra File Upload](https://chakra-ui.com/docs/components/file-upload). File selection UI and private storage integration need separate interfaces.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| J01 | File input and dropzone | Next / UI | Click/keyboard/drop, multiple files, types/sizes/counts, rejection feedback. |
| J02 | File row and attachment | Next / UI | Name/type/size, open/download/remove, long names, accessible labels. |
| J03 | Upload queue and progress | Built / UI | Per-file pending/uploading/done/error, retry/cancel and duplicates. |
| J04 | Image and thumbnail | Built / UI | Loading/error/alt text, fit/crop presentation and stable dimensions. |
| J05 | Avatar/logo upload | Built / Block | Picker, named preview, replace/remove, undo, save retry/cancel and object URL cleanup. |
| J06 | File preview/lightbox | Built / UI | Raster images and escaped plain text, expired/unavailable states and open/download fallback. |
| J07 | Document list/grid | Built / Block | File rows/cards, folders, scoped selection, filters/sort, remote states and removal recovery. |
| J08 | Image cropper | Optional / Adapter | Crop/zoom/rotate, reset, keyboard alternative, output constraints. |
| J09 | Media player | Optional / Adapter | Native audio/video first; captions, transcript and playback controls as needed. |

## Charts and reporting

[shadcn charts](https://ui.shadcn.com/docs/components/radix/chart) use Recharts; [Mantine charts](https://mantine.dev/charts/getting-started/) offer another reference set. A kit chart needs its own series tokens, readable labels, a text/table alternative, and usable empty/error states. Existing accent colors alone are not a chart palette.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| K01 | Chart frame and series contract | Built / Adapter | Title/description, units, series colors, legend, tooltip, responsive sizing, fallback data. |
| K02 | Line/area chart | Built / Adapter | Time series, missing values, explicit time and aggregation units. |
| K03 | Bar chart | Built / Adapter | Horizontal/vertical, grouped/stacked, long labels, comparison. |
| K04 | Donut/pie chart | Optional / Adapter | Small part-to-whole sets with values in text and a legend. |
| K05 | Sparkline and trend | Optional / Adapter | Small contextual trend with an accessible summary. |
| K06 | Heatmap/scatter and specialist charts | Optional / Adapter | Add only the chart type a real reporting view requires. |
| K07 | Reporting controls and export | Built / Block | Period, comparison, filters, units, export preparation and failure. |

## Authentication and access screens

Reuse the original SME Manager/Brainwave/Moving Project findings from the [initial plan](/Users/nationalbank/project-kit-review-2026-10-25/README.md), [shadcn login blocks](https://ui.shadcn.com/blocks/login), and [Supabase passwordless documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless). These are presentation blocks; provider behavior is R01 below.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| L01 | Auth layout | Follow-up / Block | Compact and split layouts, brand/legal/help slots, responsive content. |
| L02 | Magic-link sign-in | Follow-up / Block | Email, pending/error/sent, resend/change-address recovery. |
| L03 | Verification/callback result | Follow-up / Block | Confirming, success, invalid/expired link, resend and safe continuation. |
| L04 | Invitation acceptance | Built / Block | Invitation details, account mismatch, expired/revoked/accepted states. |
| L05 | MFA challenge and enrollment | Optional / Block | Code entry, setup, recovery, pending/error states under provider policy. |
| L06 | Session expired and reauthentication | Follow-up / Block | Preserve context, explain expiry, safe continuation and sign-out. |
| L07 | Access denied/request access | Follow-up / Block | Clear denial, supported next step, anonymous versus unavailable provider. |
| L08 | Password login and recovery | Optional / Block | Add login/reset/change-password together when password auth is supported. |
| L09 | Signup/onboarding entry | Optional / Block | Open versus invitation-only policy, verification and duplicate-account recovery. |
| L10 | Social login/passkey/SSO entry | Optional / Block | Only configured methods; provider redirects, cancelled and failed states. |

## Account, organization, and settings

These extend the original invitation/settings candidates into explicit UI blocks. Source leads in the [project review](/Users/nationalbank/project-kit-review-2026-10-25/project-review.md) establish likely donors, not verified reusable services. Policy and persistence remain with each application.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| M01 | Account menu | Next / UI | Identity, profile/settings links, theme, sign-out and pending feedback. |
| M02 | Workspace/organization switcher | Built / UI | Current context, search, unavailable contexts, switching feedback. |
| M03 | Settings layout and section | Built / Block | Navigation, grouped fields, save behavior, deep links and mobile layout. |
| M04 | Profile settings | Built / Block | Name, email, avatar, validation and save recovery. |
| M05 | Appearance/language preferences | Built / Block | Theme/mode, density and locale; compose existing token options. |
| M06 | Notification preferences | Built / Block | Per-channel/category preferences, pending and failed saves. |
| M07 | Members and invitations | Built / Block | Member list, invite/resend/revoke, pending/expired and action feedback. |
| M08 | Role/capability editor | Built / Block | Application-defined grants, read-only/denied states and confirmation. |
| M09 | Security and active sessions | Optional / Block | MFA, sessions/devices, revoke and reauthentication requirements. |
| M10 | API keys and connected integrations | Optional / Block | Create/revoke/reconnect, one-time secret reveal, provider status. |
| M11 | Danger zone/account deletion | Follow-up / Block | Specific consequence, explicit confirmation, pending/error and recovery. |

## Chat and AI extensions

Keep [existing chat](./chat.md) as the base. The [shadcn AI Elements references](https://ui.shadcn.com/docs/ai-elements) suggest useful additions. Expose observable task status and host-supplied content; private model reasoning is not a required UI feature.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| N01 | Rich message rendering | Built / Adapter, Extend | Opt-in Markdown, code, links and tables with a fixed safe content boundary. See [rich chat](./rich-chat.md). |
| N02 | Message attachments | Built / UI, Extend | Upload/preview/remove, progress and per-file recovery through the existing upload queue. |
| N03 | Sources and citations | Built / UI, Extend | Source title, validated link, keyboard preview and unavailable states. |
| N04 | Task/tool status and confirmation | Optional / UI, Extend | Queued/running/failed/completed actions and explicit approval where required. |
| N05 | Model/context selectors | Optional / UI, Extend | Host-provided choices, unavailable options and context limits. |
| N06 | Message feedback and editing | Optional / UI, Extend | Rating/report, edit/resend and branching policy supplied by the host. |
| N07 | Conversation management | Follow-up / UI, Extend | Rename/archive/delete, search recovery, confirmed destructive actions. |

## Application page blocks

[shadcn blocks](https://ui.shadcn.com/blocks) distinguish useful page compositions from individual controls. Assemble these from the kit so projects can start with working flows and then edit their application code.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| O01 | Dashboard/overview | Built / Block | Page header, useful summaries, activity, optional chart and data section. |
| O02 | List/index page | Next / Block | Header/actions, filters, table/list, pagination and recovery states. |
| O03 | Record detail page | Built / Block | Summary, description list, tabs, activity and contextual actions. |
| O04 | Create/edit page | Next / Block | Sections, validation, save/cancel, pending/error, unsaved changes. |
| O05 | Detail drawer/master-detail | Follow-up / Block | List context, selected record, focus/URL boundary and narrow-screen flow. |
| O06 | Onboarding/wizard | Built / Block | Steps, per-step validation, back/forward, review, draft recovery. |
| O07 | Search results page | Follow-up / Block | Query, facets, counts, result rows, no-results and unavailable search. |
| O08 | Notification center | Built / Block | Unread/read, groups, actions, pagination and empty/error states. |
| O09 | Activity/audit viewer | Built / Block | Event filters, actors, timestamps, details and export; no audit storage engine. |
| O10 | Help/support page | Follow-up / Block | Search, FAQ, contact/support entry and documented availability. |
| O11 | Error/access/offline pages | Next / Block | 404, unavailable/500, denied, offline and maintenance with useful recovery. |
| O12 | Import/export workflow | Optional / Block | File selection, mapping, preview, validation results, progress and retry. |

The stepped-form donor is Brainwave; review its full interface with a second consumer before generalizing its schema. [Chakra Steps](https://chakra-ui.com/docs/components/steps) supplies a separate step-indicator reference.

## Website and marketing blocks

The initial review identified Brainwave, savorg.xyz, and Ezio Barber as possible website consumers. P01–P06 and P10 are implemented as [editable website blocks](./website-blocks.md), with fictional examples and application-owned content, assets, routes, consent and submission. Other rows remain proposed structures. These blocks do not claim to reproduce the candidate projects' pages.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| P01 | Website header and footer | Built / Block | Public navigation, mobile menu, legal/contact and locale links. |
| P02 | Hero and introduction | Built / Block | Text-first and media-led layouts, clear action, restrained hierarchy. |
| P03 | Feature/service sections | Built / Block | List/grid, alternating text/media and comparison structures. |
| P04 | Call-to-action section | Built / Block | One primary next step and optional secondary link. |
| P05 | FAQ section | Built / Block | Compose Accordion with appropriate heading structure. |
| P06 | Contact/inquiry and newsletter forms | Built / Block | Required/optional fields, consent where relevant, sent/error recovery. |
| P07 | Pricing/comparison section | Optional / Block | Plans, billing period, features and actual project terms. |
| P08 | Testimonials/logo strip | Optional / Block | Supplied, approved evidence and usable long names/quotes. |
| P09 | Team/about section | Follow-up / Block | People, roles, accessible portraits and project content. |
| P10 | Article/documentation layout | Built / Block | Prose, metadata, contents, code/media and related content. |
| P11 | Article/resource/case-study index | Follow-up / Block | Filters, category/date/author metadata and pagination. |
| P12 | Gallery/carousel | Optional / Block | Native grid first; explicit controls and accessible motion if sliding is needed. |
| P13 | Legal and consent-preference layouts | Optional / Block | Application-provided text/preferences and provider integration boundary. |

## Specialist candidates

Keep these discoverable with a named use case before allocating implementation work. [Mantine's rich text editor](https://mantine.dev/x/tiptap/) illustrates the dependency scope of editor work; [its extension catalog](https://mantine.dev/dates/getting-started/) also distinguishes scheduling from a simple date picker.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| Q01 | Rich text editor | Optional / Adapter | Toolbar, document schema, paste/content validation and serialization. |
| Q02 | Markdown/code/JSON editor | Optional / Adapter | Appropriate engine, keyboard access, validation and preview/diff as needed. |
| Q03 | Tree view/navigation tree | Optional / UI | Expansion, selection, keyboard model, asynchronous children. |
| Q04 | Tree select/cascader | Optional / UI | Hierarchical selection with path display and field feedback. |
| Q05 | Scheduler/agenda | Optional / Adapter | Day/week/month/agenda, timezone, event editing and recurrence policy. |
| Q06 | Kanban board | Optional / Adapter | Columns/cards, keyboard move actions, persistence and concurrent edits. |
| Q07 | Reorderable list/drag and drop | Optional / UI | Visible move alternatives, announcements and saved-order feedback. |
| Q08 | Guided tour/checklist | Optional / Block | Dismiss/resume, stable targets, focus and progress persistence. |
| Q09 | Command terminal/log viewer | Optional / Adapter | Streaming lines, filtering, copy/download, safe rendering and controlled scroll. |
| Q10 | QR code and scanning UI | Optional / Adapter | Text/link alternative, expiry, camera permissions only for scanning. |
| Q11 | Billing/subscription pages | Optional / Block | Provider-owned prices/status, invoices, plan changes and failed payment states. |
| Q12 | Map/address/location picker | Optional / Adapter | Search/list alternative, provider boundary, explicit location precision. |

## Framework, provider, and distribution work

These make the UI usable in real projects. They are separate deliverables from styled components. The original plan already called for a Supabase/Next integration and source-installed blocks. [Supabase's SSR guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), [storage guide](https://supabase.com/docs/guides/storage/uploads/standard-uploads), and [shadcn registry](https://ui.shadcn.com/docs/registry) are current technical references.

| ID | Family | When / delivery | Scope |
| --- | --- | --- | --- |
| R01 | Supabase/Next auth integration | Follow-up / Adapter | Server/client boundaries, callbacks, safe return paths, sign-out, eligibility hooks. |
| R02 | Private upload integration | Follow-up / Adapter | Prepare/upload/finalize, server validation, cleanup, authorization and download policy. |
| R03 | Router bindings | Follow-up / Adapter | Thin Next/router links, active destinations and navigation recovery. |
| R04 | Form-state/validation examples | Follow-up / Adapter | One evaluated integration, field errors, async submit, reset and server feedback. |
| R05 | Editable block registry | Follow-up / Adapter | Dependencies, source revision, install path, owned edits and upgrade comparison. |
| R06 | Starters | Follow-up / Block | Next admin, Vite app and website shells using the same packages and fictional data. |
| R07 | Theme/brand configuration tooling | Follow-up / Adapter | Validated configuration, token preview, export and contrast feedback. |

## Standards for every prepared item

The source of visual rules is the [Apple Minimal contract](/Users/nationalbank/GitHub/ai-config/claude/uiux-contract/agent_contract.yaml), with the kit's documented accessibility adaptations in [token provenance](../packages/tokens/PROVENANCE.md). The latest [design pass](./hallmark-design-pass.md) establishes the catalog's restrained presentation.

1. Use the existing `--pk-` tokens, system typography, semantic colors and named Lucide icons. Extend tokens/contracts before adding visual values. Preserve theme differences, including Linen headings.
2. Retain the 32/40/48px control scale, 44px minimum touch target, compact 36px desktop options, and existing table density. Small visual controls can have a larger interaction target.
3. Define applicable default, hover, active, selected, focus, disabled, read-only, invalid and busy states. Async compositions include empty, loading, error, success and recovery examples.
4. Support keyboard behavior for the actual pattern, clear names/descriptions, visible unclipped focus, correct form values, and focus recovery after dismissal/removal. Color alone cannot carry meaning.
5. Use validated contrast pairs across the eight themes and light/dark modes. Portalled content follows the supported document-level theme scope; nested theme portals need a deliberate extension.
6. Check long/localized labels, RTL, touch/coarse pointers and 360/768/1024/1440px layouts. Contain deliberate table/code scrolling within its region; avoid page overflow.
7. Use existing short motion tokens and reduced-motion behavior. Preserve explicitly requested sidebar/chat interactions. An optional visual treatment must still fit the contract's state-driven motion rule.
8. Keep `pk-` CSS scoped and compatible with the documented plain-CSS/Tailwind consumers. Generic UI remains independent of Next, Supabase, application schemas, routing and credentials.
9. Provide a working catalog example, complete copyable usage, props and dependencies, source/revision/license, maturity and owner, and a named example consumer. Candidate, pilot and supported are distinct claims.
10. Verify changed behavior with proportionate checks and packed Next/Vite consumption where package boundaries change. Current Chromium evidence does not establish Safari/Firefox, physical mobile keyboard or production compatibility.

Prepare styles and states for a component only once. Checkbox fields and table selection should share a control foundation; account menus should reuse DropdownMenu; settings and auth blocks should reuse fields and feedback. Native HTML and recipes are valid deliverables.

## Recommended preparation order

| Wave | Prepare | What it unlocks |
| --- | --- | --- |
| 1 | Card, Separator, page/section headers, Checkbox, RadioGroup, Switch, ToggleGroup, SegmentedControl, Tabs, Accordion/Collapsible | Everyday forms, settings, details, FAQs and structured layouts. |
| 2 | DropdownMenu, Popover, AlertDialog, Sheet, Toast, Progress, Avatar, Breadcrumbs, Pagination, Navbar, AccountMenu | Reusable navigation, row actions, confirmation, transient feedback and identity. |
| 3 | SearchField, Combobox, MultiSelect, tags, number/password/OTP fields, calendar/date/range/time, FileInput/Dropzone/FileRow | Real admin filters, authentication presentation and document workflows. |
| 4 | Form summary/actions, filter bar/applied filters, semantic Table, list/create/edit/detail/settings/auth blocks | Complete reusable screens assembled from the new controls. |
| 5 | Provider adapters, private uploads, members/invitations, onboarding, activity/notifications, dashboard charts, website blocks | Application starters and the original plan's real-project adoption phase. |
| On demand | Specialist candidates and other Optional rows | A specific product requirement with an explicit maintenance owner. |

Waves show dependencies, not estimates or release commitments. For the first implementation batch, select one complete flow, such as list → row menu → edit → confirmation → feedback, and prepare its shared controls together.

## Source decisions

| Source | Use in this kit |
| --- | --- |
| [Initial local review](/Users/nationalbank/project-kit-review-2026-10-25/README.md) and [donor findings](/Users/nationalbank/project-kit-review-2026-10-25/project-review.md) | Real repeated needs and candidate donors: SME Manager auth/branding, Brainwave steps/uploads, Leitspur fields/files, securicheck shell/filter feedback, LSJ/Alithos tables, Gatekeeper toasts. Re-review current source before extraction. |
| [shadcn components](https://ui.shadcn.com/docs/components), [blocks](https://ui.shadcn.com/blocks), [registry](https://ui.shadcn.com/docs/registry) | Inventory/API/composition/distribution references. Adapt presentation and inspect the chosen implementation's actual dependencies. |
| [Radix](https://www.radix-ui.com/primitives/docs/overview/introduction) | Continue the existing incremental behavior approach for compatible controls. |
| [Mantine](https://mantine.dev/core/package/), [HeroUI](https://heroui.com/en/docs/react/components), [Chakra](https://chakra-ui.com/docs/components/concepts/overview) | Compare missing control families and state composition. Their full theme runtimes are not an implied dependency decision. |
| [React Aria dates](https://react-aria.adobe.com/DatePicker) and [WAI-ARIA patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) | References for complex date values, localization, semantics and keyboard interaction. |
| Uiverse [bar loader](https://uiverse.io/satyamchaudharydev/ugly-bulldog-75), [diagonal pattern](https://uiverse.io/AspenBranch/slippery-sheep-50), [gift button](https://uiverse.io/vinodjangid07/dull-ladybug-18) | Optional visual candidates only. Rechecked their pages and visible MIT notices. Any adoption needs author/license preservation, token mapping and contract review; decorative animation conflicts with the current default. |

The inventory and preparation order are a synthesis of these references and the local kit. Research covered documentation and selected local source, not runtime compatibility of proposed additions. No proposed component, provider integration, package publication, or application migration was implemented in this pass.
