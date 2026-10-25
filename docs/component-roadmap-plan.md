# Component roadmap implementation

Requested on 25 October 2026. Extend the existing Evenkit packages and catalog, then review the completed components together for visual consistency and usability.

## Delivery order

| Order | Inventory | Deliverable | Status |
| --- | --- | --- | --- |
| 1 | D01–D04, D08 | Calendar, typed date and range pickers, local time field, formatting | Complete |
| 2 | C08, C09 | MultiSelect and token input | Complete |
| 3 | C05, C06 | Locale-aware number field and currency, percentage, unit recipes | Complete |
| 4 | I08, I04–I06 | Controlled remote tables, sort, bulk actions, column settings | Complete |
| 5 | O03, H06 | Record details, activity timeline, connected editing | Complete |
| 6 | M02–M05 | Workspace switcher, settings, profile, appearance | Complete |
| 7 | J03, J04 | Upload queue and image/thumbnail | Complete |
| 8 | E10 | Command palette and async global search | Complete |
| 9 | E08, O06 | Step indicator and recoverable onboarding wizard | Complete |
| 10 | All requested additions | Design review and improvements | Complete |

Implementation agents owned separate modules; integration followed the requested order. Existing working-tree changes are preserved. Shared-file baselines are stored under `.artifacts/component-roadmap/baseline/` so changes from this work can be reviewed separately.

## Contracts

- Date-only values use validated `YYYY-MM-DD` strings; local time uses `HH:mm`. Instants require an explicit timezone when displayed. A date-only value never changes when the display timezone changes.
- Number fields separate editing text from committed numbers. Empty values, partial input, invalid input, and zero remain distinct. Recipes document precision and percentage units.
- Controls share the existing field descriptions, disabled behavior, native form semantics, overlay primitives, and design tokens.
- Applications own network requests, authorization, routing, storage, and account changes. Adapters accept cancellation and reject stale completion callbacks.
- Remote rows bypass client filtering, sorting, and pagination. Selection scope and the query producing displayed rows remain explicit.
- Source blocks compose public components and preserve drafts, errors, back navigation, cancellation, and focus recovery.

## Verification

Passed production build, configured TypeScript and ESLint, 22 unit tests, 86 copied catalog examples and all 72 inventory mappings. Independent packed Next.js and Vite consumers passed builds and SSR/HTTP/stylesheet checks. The full Chromium run passed 183 of 184 journeys; the required-number-field failure was fixed, and all ten affected number/selection/account journeys passed after the final rebuild, including one new preference-validation journey. No known test failure remains.

Reviewed all 24 additions at 360px and 1440px in light Neutral and dark Ocean. See [design review and verification](component-roadmap-design.md) for improvements, evidence and testing limits.
