# Tested compatibility

Foundation phase, 25 October 2026. These packages are local pilots; no production application has adopted them yet.

| Area | Version/environment exercised | Evidence |
|---|---|---|
| Runtime/tooling | Node.js 26.12.1, npm 11.20.0 | Local builds and validation commands |
| React | React and React DOM 19.3.1 | Catalog plus independent consumers |
| TypeScript | 6.0.3, strict mode | Package, catalog, test/config, and consumer checks |
| Validation | Zod 4.6.7 | Seven schema, contrast, and output tests |
| Dialog | Radix Dialog 1.3.1 | Focus containment, Escape, restoration, inherited theme |
| Custom dropdown | Radix Select 2.4.1 | Keyboard/typeahead, form value, disabled state, popup-over-dialog layer, and inset chevron |
| Vite | 8.3.5 | Catalog build and packed-package consumer build/HTTP smoke |
| Next.js | 16.4.3, App Router | Independent packed-package build, server render, CSS HTTP smoke |
| Browser | Chromium through Playwright 1.64.1 | Six catalog journeys |
| Layout widths | 360, 768, 1024, 1440 CSS pixels | Overflow checks; small-screen navigation and control sizing |
| Themes | Neutral and Grove; light, dark, and system | Token contrast validation plus browser mode-precedence checks |

The declared Node minimum is 22.12.0; the current verification ran on Node 26.12.1. TypeScript 6.0.3 was selected because the installed lint parser's supported range excludes TypeScript 7. The lockfile records the actual development dependency graph.

## Supported boundaries

- Import token CSS before UI CSS. The libraries ship their own CSS and do not need Tailwind in the consumer. Both independent fixtures build without it.
- Set theme/mode attributes on the document root. This also supplies body-mounted dialog portals. Nested theme scopes are outside this release's support.
- React is a peer dependency. Interactive modules retain `"use client"` in emitted JavaScript.
- Custom brands accept complete semantic light/dark colors, bounded radii, and a deliberately restricted valid font-family syntax. Validation checks the color pairs used by current controls; it does not certify arbitrary application CSS or imagery.
- Source packages export built artifacts, CSS declarations, and token JSON. Packed consumers do not read workspace source or the original `ai-config` repository.

## Limits

Firefox, Safari, older React versions, other frameworks, and production deployment were not verified. The Next.js fixture check exercises package installation, build, server rendering, and CSS delivery; interactive browser journeys run against the Vite catalog. There is no claim of full WCAG conformance or compatibility testing of Mantine, HeroUI, or Chakra runtimes.

The first code review found and resolved a missing custom hover-contrast pair and malformed font-family acceptance. Packaging checks found and resolved strict TypeScript CSS-import declarations. Visual review found and resolved toolbar labels shrinking inside words. The focused checks cover the resulting behavior.

Before upgrading a dependency or adopting a new consumer, run the checks for the affected package/interface and record the new evidence. Later auth, admin, and upload modules need their own server and data-boundary verification.
