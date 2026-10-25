# Chart dependency decision

Evaluated on 25 October 2026 for inventory K01, K02 and K03.

Evenkit uses `d3-shape@3.2.0` for line and area paths, with its `d3-path@3.1.0` runtime dependency. The development types are `@types/d3-shape@3.2.0`. Versions come from the installed package metadata and lockfile. The React components, frame, linear coordinate mapping, bars, keyboard inspector, patterns, table and styles are original kit code.

## Scope and choice

The official [D3 shape documentation](https://d3js.org/d3-shape) describes independent generators that produce path data without taking ownership of the DOM. This fits a small adapter that keeps the kit's existing React controls, tokens and semantics. Only line, area and linear-curve functions are imported. The [line API](https://d3js.org/d3-shape/line) provides a `defined` accessor that separates missing observations into distinct segments. The [area API](https://d3js.org/d3-shape/area) provides an explicit baseline. Evenkit uses zero as that baseline and draws a full-opacity outline; the translucent area is supplementary.

[Recharts](https://recharts.github.io/en-US/guide/installation/) was the bounded comparison. It offers a React chart system and a wider collection of chart types. Its [chart-size guide](https://recharts.github.io/en-US/guide/sizes/) describes responsive sizing. It would still need a kit frame, missing-data policy, theme palette, table alternative and export boundary. For the requested line/area/bar set, the smaller D3 path dependency leaves those responsibilities in one React adapter and avoids introducing another chart state model. This decision does not claim that D3 supplies accessibility: Evenkit owns that behavior and its tests.

## Supported data contract

Charts accept one to six named series and ordered categories. Values are finite numbers or explicit missing values. `null`, `undefined`, `NaN` and infinity render as unavailable. A measured zero remains zero in the plot, inspector and table. Repeated category or series IDs, more than six series, empty IDs, or finite values with absolute magnitude above `Number.MAX_SAFE_INTEGER / 6` produce the invalid-data state. The magnitude bound keeps six-series sums and coordinate arithmetic finite. The host should convert larger quantities to a stated display unit before passing them.

Line and area charts use equally spaced category positions. A time series must already contain ordered, equally spaced reporting buckets, including missing buckets, with `period`, `aggregation`, `categoryLabel` and `unit` describing what each observation means. The adapter does not infer timezones, interpolate missing dates, aggregate observations, compute comparisons or fetch data. Signed bar stacks accumulate positive and negative values separately around zero. Area series overlap and are not stacked.

The plot width follows its container; text stays in HTML at the kit's normal font sizes. Vertical plots have a stable token-based height. Horizontal plots grow with their row labels. Below the kit's small breakpoint (640px of chart width), line and area axes show only the first and last category labels, aligned with their endpoints. Every category remains available through the keyboard/pointer inspector and data table. This uses the chart container width, so a narrow dashboard column gets the same treatment as a phone. The graphics keep source order from left to right in both text directions so dates and positive numeric axes do not reverse. Surrounding controls and tables inherit the document direction. Charts have no animated transitions, including under reduced motion.

Six color slots, line dashes, marker shapes and bar hatch patterns identify series; bar legends repeat the same patterns. Small numeric keys use neutral text. A keyboard inspector and a native table disclosure provide the exact formatted values and missing-data labels. The adapter preserves focus across loading/error transitions and when a focused retry or table is removed. Pointer details remain readable while hovered and dismiss with Escape; touch selection stays open after release.

This adapter does not implement continuous time scales, logarithmic axes, zoom, streaming buffers, virtualization, per-series axes, image export or chart editing. Applications own queries, metric definitions, aggregation, data volume, export preparation and file generation. The supplied dashboard block is editable application source.

## Licenses and provenance

The runtime libraries are unmodified npm dependencies under ISC: [d3-shape v3.2.0 license](https://github.com/d3/d3-shape/blob/v3.2.0/LICENSE), [d3-path v3.1.0 license](https://github.com/d3/d3-path/blob/v3.1.0/LICENSE). Their installed notices are copied to [`d3-shape.txt`](../packages/ui/licenses/d3-shape.txt) and [`d3-path.txt`](../packages/ui/licenses/d3-path.txt). The MIT notice for the development type package is in [`types-d3-shape.txt`](../packages/ui/licenses/types-d3-shape.txt). No Recharts source or examples were copied. Public documentation informed the dependency choice and API calls; chart presentation and behavior were written for Evenkit.

Focused geometry tests are in [`chart-model.test.ts`](../packages/ui/tests/chart-model.test.ts). Browser interaction, theme/layout and packed-consumer evidence is recorded in the reporting handoff.
