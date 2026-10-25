# Tested compatibility

Integrated component, theme, chat and 48-priority review, 25 October 2026. These packages are local pilots; no production application has adopted them yet.

| Area | Version/environment exercised | Evidence |
|---|---|---|
| Runtime/tooling | Node.js 26.12.1, npm 11.20.0 | Local builds and validation commands |
| React | React and React DOM 19.3.1 | Catalog plus independent consumers |
| TypeScript | 6.0.3, strict mode | Package, catalog, test/config, and consumer checks |
| Validation | Zod 4.6.7 | Eight schema, contrast, and output tests |
| Controls and feedback | Kit Button, fields, Badge, ActionMessage, Spinner, Skeleton, and EmptyState | Busy-state names and geometry, field identity and validation, recovery actions, persistent announcements, RTL and narrow layouts |
| Dialog | Radix Dialog 1.3.1 | Focus containment/restoration, Escape, theme inheritance, sizes, body scrolling, and short-window recovery |
| Custom dropdown | Radix Select 2.4.1 | Keyboard/typeahead, form values, groups/descriptions, empty options, touch targets, RTL, and closing when disabled asynchronously |
| Tooltips | Radix Tooltip 1.4.1 | Accessible descriptions, Escape dismissal, viewport wrapping, sidebar labels, and overflowing table cells |
| Icons | Lucide React 1.61.0 | 60 named wrappers, token sizes, decorative/labelled semantics, alias/category filtering, and import copying |
| Table engine | TanStack React Table 9.3.1 | Numeric sorting, search/page reset, stable ID selection, bulk removal, wrap/truncate, unclipped actions, asynchronous focus recovery, and mobile overflow |
| Admin shell | Kit composition with Radix Dialog and Tooltip | Expanded/collapsed/hidden states, pointer and keyboard resizing, RTL, drawer dismissal, focus recovery, reduced motion, and skip link |
| Chat | Kit ChatWidget and ChatPanel | Draft persistence, IME/multiline input, stop/retry, streaming scroll position, answer copying, narrow/short RTL layouts, and focus restoration |
| Vite | 8.3.5 | Catalog build; independent packed consumer builds controls, shell/table, and ChatWidget and serves their CSS |
| Next.js | 16.4.3, App Router | Independent packed consumer build, server-rendered controls/shell/table/ChatPanel, and CSS HTTP smoke |
| Browser | Chromium through Playwright 1.64.1 | 127 passing journeys, covering all priority routes, component interactions and existing regression suites |
| Layout widths | 360, 768, 1024, 1440, 1700 CSS pixels | Overflow checks, touch targets, container navigation, resize cleanup, short windows, and RTL |
| Themes | Neutral, Grove, Graphite, Linen, Ocean, Dusk, Clay, Rose; light, dark, and system | 560 contrast pairs; gallery selection, persistence, computed colours/fonts, system precedence, and dialog inheritance |

The declared Node minimum is 22.12.0; the current verification ran on Node 26.12.1. TypeScript 6.0.3 was selected because the installed lint parser's supported range excludes TypeScript 7. The lockfile records the actual development dependency graph.

On 25 October 2026, `npm run verify` passed against the integrated checkout: production build, package/catalog/test type checks, ESLint, eight token tests, and all 39 Chromium journeys. All 14 copied catalog snippets also passed strict TypeScript checks, including unused declarations and CSS side-effect imports.

`npm run verify:packages` passed for independent Vite and Next.js consumers. Both production builds served HTTP 200 and delivered token, control, icon, tooltip, shell, table, and chat CSS. The Next.js response also contained the rendered shell, table, and chat content. Both temporary servers stopped and the allocated directory was removed. The local run records are `.artifacts/integration-verify.log` and `.artifacts/integration-package-verification.json`.

## Priority expansion verification

All 48 Next items have a public component or documented recipe/editable block, an individual catalog entry, complete usage and per-family contracts. The catalog now has 62 entries, with 211 resolved variables and the existing eight themes/560 contrast pairs. The [completion tracker](./priority-build-plan.md) links each item to source and evidence.

The final source passed production build, configured package/catalog/test TypeScript checks, ESLint, eight token tests and all 127 Chromium journeys. Every priority route was checked at 360/768/1024/1440px in all eight themes and both color modes. All 62 copied usage examples passed strict TypeScript with unused-code and CSS side-effect checks; all 48 inventory IDs map exactly once.

Independent packed Vite and Next consumers built and served HTTP 200 with the new stylesheet families. The fixtures also copied the editable record/recovery blocks independently; Next server rendering included their content. Owned servers and temporary consumers were cleaned. Seventeen representative captures had no runtime errors; a separate reviewer inspected seven component/mobile captures and found no actionable visual issue.

Evidence: `.artifacts/priority-build-confirm.log`, `priority-typecheck-confirm.log`, `priority-lint-confirm.log`, `priority-examples-confirm.log`, `priority-release-browser.log`, `priority-token-final.log`, `priority-packages-confirm.log`, `catalog-examples.json`, `package-verification.json`, and `priority-visual/report.json`. Source hashes are in `priority-verification-inputs.json`.

Combobox/Autocomplete use Base UI 1.9.0. Disabled options remain available for keyboard discovery but cannot be selected. Their dialog composition uses the dialog content as its popup container and a Radix DismissableLayer 1.2.1 bridge. Native field/group validation, controlled resets, clipboard failure, stale async results, file cancellation/removal, popup dismissal and responsive focus recovery have dedicated journeys. These are UI behaviors; storage, server access, routing and persistence remain application responsibilities.

## Supported boundaries

- Import token CSS before UI CSS. The libraries ship their own CSS and do not need Tailwind in the consumer. Both independent fixtures build without it.
- Set theme/mode attributes on the document root. This also supplies body-mounted dialog, select, and tooltip portals. Nested theme scopes are outside this release's support.
- React is a peer dependency. Interactive modules retain `"use client"` in emitted JavaScript.
- Custom brands accept complete semantic light/dark colors, bounded radii, and a deliberately restricted valid font-family syntax. Validation checks the color pairs used by current controls; it does not certify arbitrary application CSS or imagery.
- Source packages export built artifacts, CSS declarations, and token JSON. Packed consumers do not read workspace source or the original `ai-config` repository.
- Tables process the entire supplied client dataset. Selection is controlled using stable IDs and can include IDs outside the current dataset; consumers decide when to remove them. The header checkbox selects the current page. Backend processing and virtualization are outside this release.
- Admin navigation adapts at the 768px container breakpoint. The shell uses CSS container queries and ResizeObserver, so embedded panes can collapse independently of the viewport while retaining the desktop sidebar choice. Custom router links must preserve supplied navigation props and forward the anchor ref.
- Chat messages, conversations, drafts, storage, and AI requests belong to the host. The catalog and packed fixtures use local responses; no AI service or persistence backend is part of these checks.

## Limits

Firefox, Safari, older React versions, other frameworks, and production deployment were not verified. Packed consumer checks exercise installation, build, Next.js server rendering, and CSS delivery. Interactive browser journeys run against the Vite catalog and a test-only table host that changes props without moving focus. There is no claim of full WCAG conformance or compatibility testing of Mantine, HeroUI, or Chakra runtimes.

Before upgrading a dependency or adopting a new consumer, run the checks for the affected package/interface and record the new evidence. Later auth, server-table, and upload modules need their own server and data-boundary verification.
