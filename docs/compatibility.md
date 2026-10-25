# Tested compatibility

Foundation, component refinement, and authentication-page phases, 25 October 2026. These packages are local pilots; no production application has adopted them yet.

| Area | Version/environment exercised | Evidence |
|---|---|---|
| Runtime/tooling | Node.js 26.12.1, npm 11.20.0 | Local builds and validation commands |
| React | React and React DOM 19.3.1 | Catalog plus independent consumers |
| TypeScript | 6.0.3, strict mode | Package, catalog, test/config, and consumer checks |
| Validation | Zod 4.6.7 | Seven schema, contrast, and output tests |
| Dialog | Radix Dialog 1.3.1 | Focus containment, Escape, restoration, inherited theme |
| Custom dropdown | Radix Select 2.4.1 | Keyboard/typeahead, form value, disabled state, popup-over-dialog layer, and inset chevron |
| Icons | Lucide React 1.61.0 | Named wrappers, token sizes, decorative/labelled semantics; catalog search and icon action inspected |
| Table engine | TanStack React Table 9.3.1 | Numeric sorting, search/page reset, stable ID selection, page selection, state recovery, mobile overflow |
| Admin shell | Kit composition with Radix Dialog | Container-responsive navigation, focus containment/restoration, Escape/outside/navigation dismissal, resize cleanup, skip link |
| Authentication pages | Kit controls, icons, and typed async callbacks | Validation/focus, visibility controls, pending guards, rejected-request recovery, neutral reset confirmation, recovery-link states |
| Vite | 8.3.5 | Catalog build and packed-package consumer build/HTTP smoke |
| Next.js | 16.4.3, App Router | Independent packed-package build, server render, CSS HTTP smoke |
| Browser | Chromium through Playwright 1.64.1 | 22 journeys: five auth flows and 17 existing component regressions |
| Layout widths | 360, 768, 1024, 1440, 1700 CSS pixels | Overflow checks, touch targets, container navigation, resize cleanup |
| Themes | Neutral and Grove; light, dark, and system | Token contrast validation plus browser mode-precedence checks |

The declared Node minimum is 22.12.0; the current verification ran on Node 26.12.1. TypeScript 6.0.3 was selected because the installed lint parser's supported range excludes TypeScript 7. The lockfile records the actual development dependency graph.

## Supported boundaries

- Import token CSS before UI CSS. The libraries ship their own CSS and do not need Tailwind in the consumer. Both independent fixtures build without it.
- Set theme/mode attributes on the document root. This also supplies body-mounted dialog portals. Nested theme scopes are outside this release's support.
- React is a peer dependency. Interactive modules retain `"use client"` in emitted JavaScript.
- Custom brands accept complete semantic light/dark colors, bounded radii, and a deliberately restricted valid font-family syntax. Validation checks the color pairs used by current controls; it does not certify arbitrary application CSS or imagery.
- Source packages export built artifacts, CSS declarations, and token JSON. Packed consumers do not read workspace source or the original `ai-config` repository.
- Tables process the entire supplied client dataset. Selection is controlled using stable IDs; consumers must remove deleted records' IDs. The header checkbox selects the current page. Backend processing and virtualization are outside this phase.
- Admin navigation adapts at the 768px container breakpoint. The shell uses CSS container queries and ResizeObserver, so embedded panes can collapse independently of the viewport. Custom router links must preserve supplied navigation props.
- Authentication pages use application-owned callbacks. Their inputs have password-manager attributes, but no third-party password-manager extension was exercised. Recovery tokens, service-side policy, rate limits, email delivery, and sessions were not implemented or tested by these local previews.

## Limits

Firefox, Safari, older React versions, other frameworks, and production deployment were not verified. The Next.js fixture check exercises package installation, build, server rendering, and CSS delivery; interactive browser journeys run against the Vite catalog. There is no claim of full WCAG conformance or compatibility testing of Mantine, HeroUI, or Chakra runtimes.

The first code review found and resolved a missing custom hover-contrast pair and malformed font-family acceptance. Packaging checks found and resolved strict TypeScript CSS-import declarations. Visual review found and resolved toolbar labels shrinking inside words. The focused checks cover the resulting behavior.

The admin/table review resolved numeric alignment in wide cells and a skip link visible above an embedded shell. Dropdown options were reduced from 52px to 36px desktop rows through border-box sizing; browser checks also confirm 44px mobile rows. The shell test awaits Radix's actual initial close-button focus and uses an actionable overlay click before checking dismissal.

Auth verification passed a synchronous duplicate-submit check, structured errors, rejected promises, password policy and confirmation, neutral reset copy, unusable recovery links, narrow layouts, and pending-preview cleanup. Independent Vite and Next consumers import all four pages; Next server-renders them and both deliver their CSS. Review corrected plain-anchor styles so they preserve ButtonLink contrast. The initial auth harness was corrected to use accessible-name locators for required email fields and native password names with separate accessible-name assertions.

Before upgrading a dependency or adopting a new consumer, run the checks for the affected package/interface and record the new evidence. Auth service adapters, server-table processing, and uploads need their own server and data-boundary verification.
