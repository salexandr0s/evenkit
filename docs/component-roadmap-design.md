# Application component design review

Completed 25 October 2026. All 24 requested inventory additions have public components or copyable source blocks, working catalog specimens, documented contracts and appropriate behavioral checks. The catalog now contains 86 copied examples and 72 inventory mappings.

## Improvements

| Area | Final behavior and presentation |
| --- | --- |
| Dates and time | Typed date-only values, predictable keyboard focus and range states; selected calendar days retain contrast on hover and a visible focus ring. Instants require an explicit display timezone. |
| Selection and numbers | Searchable selections, removable tokens, duplicates and overflow remain visible. Value-field examples have a 480px maximum width. Invalid numeric drafts remain editable and native required submission focuses the field. |
| Remote lists | Loading, retry and stale results are distinct. Controls expose totals, query state and selection scope; sorting and pagination are owned by the host. |
| Records and settings | List → detail → edit preserves identity and returns focus. Workspace changes can be cancelled or retried. Settings retain profile drafts; appearance controls persist theme, mode, density and supported formatting locale. The sample applies explicit scoped theme variables so its colors follow the chosen settings. |
| Uploads and images | A single empty-state message leads into file selection. Each file exposes its own progress, cancellation and retry. Preview frames retain their size during loading or failure; the dark logo sample uses a neutral artboard. |
| Command search | The dialog keeps a stable height while requests change, leaving the search field in place. Results scroll independently. Destinations retain native link behavior and actions receive focus after dismissal. |
| Steps and wizard | Narrow screens use a compact vertical step rail. Back and Continue share a full-width row so labels remain readable. Review, validation, draft restoration and cleanup retry are separate states. |

Existing spacing, colors, radii, typography and motion tokens govern the additions. No new runtime dependency was added. Source blocks compose the published controls; applications supply transport, routing, authorization, storage scope and mutations. Catalog adapters demonstrate these contracts with cancellable local requests.

## Evidence

- Production build, configured TypeScript and ESLint passed on the final source.
- All 22 unit tests passed, including date validation, locale number parsing/stepping and upload cancellation/concurrency.
- The full Chromium run passed 183 of 184 journeys. It exposed feedback appearing on number-field blur before the submit click completed. Required feedback now follows native invalid submission. The final package rebuild passed all ten affected selection, number and account journeys, including the added unsupported-preference test. The final catalog refinement also passed the settings journey with computed color assertions for theme, mode and system preference changes. These results combine the full run and focused reruns.
- All 86 copied catalog examples compile; the original 48 and requested 24 inventory mappings appear exactly once.
- Independent packed Vite and Next.js consumers passed production builds and HTTP/stylesheet smoke checks. Next.js also rendered the new controls and copied blocks on the server.
- The 96 final captures cover each addition at 360px and 1440px in light Neutral and dark Ocean. Geometry checks found no horizontal page overflow or runtime errors. Additional full-page captures cover the final appearance changes and recapture MultiSelect without the element-screenshot resize artifact.
- Independent review accepted the compact step rail, mobile wizard actions, bounded forms and stable command-search position. Source reviews checked form resets, async cancellation, stale responses, upload cleanup and draft recovery.

Logs, before/after screenshots, geometry reports and the isolated source patch are under `.artifacts/component-roadmap/`. Final checks use `*-complete.log`; the full Chromium run is `browser-final.log`, unit results are `unit-final.log`, screenshots are in `final/` and `complete/`.

## Limits

Verification used Chromium on desktop and emulated narrow viewports. Firefox, Safari, physical touch and a complete visual RTL matrix were not tested. The build retains Vite's advisory for an initial chunk above 500kB. This work adds library components and examples; no backend service, production deployment or package publication was performed.
