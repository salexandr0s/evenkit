# Dashboards and reporting

Inventory coverage: H05, K01, K02, K03, K07 and O01. The catalog routes are `statistic`, `chart-frame`, `line-chart`, `bar-chart`, `reporting-controls` and `dashboard`. Each route includes a complete copyable example.

The kit renders values and report states. Applications own queries, metric definitions, aggregation, comparison arithmetic, currency conversion, export generation and storage. The dashboard is editable source in [registry/blocks/dashboard.tsx](../registry/blocks/dashboard.tsx), so applications can change its sections and connect their own data.

Import `@evenkit/tokens/css` before `@evenkit/ui/css`. The chart adapter uses pinned `d3-shape` for line and area paths; React owns the SVG, controls and accessibility. The bounded dependency evaluation, official references and licenses are recorded in [chart-dependency.md](./chart-dependency.md) and [UI provenance](../packages/ui/PROVENANCE.md).

## Statistics

`Statistic` takes a required `label` and `value`, plus optional `unit`, `period`, `comparison`, `formatValue`, `loading`, `error` and `missingLabel`. A number uses `formatValue`, which defaults to `String`; a string is already formatted by the host. Zero remains a value. `null`, an empty string and nonfinite numbers display the missing label. Loading and errors suppress stale values and comparisons.

Comparisons contain visible `text`, a direction (`up`, `down` or `unchanged`) and an optional tone (`neutral`, `positive` or `negative`). Include the amount, direction and comparison period in the text. Direction and tone are independent: fewer failures can be a positive change. The arrows are decorative, so the meaning remains available without color or icons.

```tsx
"use client";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { Grid, Statistic } from "@evenkit/ui";

export function DeliverySummary() {
  return <Grid columns={2}>
    <Statistic label="Failed deliveries" value={0} unit="deliveries"
      period="19–25 October 2026"
      comparison={{ text: "Down 3 deliveries from the previous week", direction: "down", tone: "positive" }} />
    <Statistic label="Average response time" value={null} unit="minutes"
      period="19–25 October 2026" missingLabel="Not measured for this period" />
  </Grid>;
}
```

## Chart data and series

`LineChart`, `AreaChart` and `BarChart` use the same `ChartProps` contract.

| Prop | Contract |
| --- | --- |
| `title`, `unit` | Required visible chart name and measurement unit. All series in a chart use this unit. |
| `data` | Ordered `ChartDatum[]`: stable `id`, full `label`, and `values` keyed by series ID. |
| `series` | Up to six `ChartSeries` objects with stable `id`, full `label` and optional `color` from 1 through 6. The array order controls legend and series order. |
| `description` | Optional explanation, caveats or host-provided summary. |
| `categoryLabel` | Name for the category column, such as Day or Region. Defaults to Category. |
| `period`, `aggregation` | Visible context. Specify the period and how each value was grouped or calculated. |
| `formatValue` | Formats a number without its unit. Shared by chart labels, inspector and table. Defaults to English number formatting with up to 21 significant digits so small nonzero measurements remain visible. |
| `loading`, `error`, `onRetry` | Host-controlled loading/error state and optional retry callback. |
| `labels` | Partial `ChartLabels` override for loading, empty, missing, retry, table summary, legend, keyboard instructions and invalid-data messages. |
| Native figure props | `id`, `className`, `dir` and other figure attributes are forwarded. |

Series and row IDs must be nonempty and unique within their arrays. Keep them stable when replacing data. Numbers must be finite measurements within `Number.MAX_SAFE_INTEGER / 6` in magnitude. Nonfinite values, `null`, absent keys and `undefined` are missing. Invalid IDs, too many series and out-of-range values show a contract error instead of plotting misleading geometry. Validate untrusted responses at the application's API boundary.

Zero is a measurement and stays in the plot, tooltip and table. Missing line/area values leave gaps; the adapter does not connect them. A dataset of zeros has a usable zero baseline. Empty arrays and datasets with no measurements show an empty message; existing rows with missing values remain available in the table.

Rows are equally spaced categories. Time series must arrive sorted and aggregated into the intended buckets, with explicit missing rows. The adapter does not parse timestamps, select a timezone, resample, interpolate missing values or infer elapsed time from labels. Irregular temporal spacing requires an application-specific adapter. Use explicit display timezones when formatting timestamp labels. Avoid comparisons between different units or incompatible aggregation periods.

```tsx
"use client";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { AreaChart, LineChart, Stack, type ChartDatum, type ChartSeries } from "@evenkit/ui";

const series: readonly ChartSeries[] = [
  { id: "orders", label: "Orders", color: 1 },
  { id: "previous", label: "Previous period", color: 2 },
];
const data: readonly ChartDatum[] = [
  { id: "mon", label: "Monday", values: { orders: 24, previous: 18 } },
  { id: "tue", label: "Tuesday", values: { orders: null, previous: 23 } },
  { id: "wed", label: "Wednesday", values: { orders: 0, previous: 29 } },
  { id: "thu", label: "Thursday", values: { orders: 42, previous: 25 } },
];

export function DailyOrders() {
  return <Stack gap="6">
    <LineChart title="Orders by day" unit="orders" categoryLabel="Day"
      period="19–22 October 2026" aggregation="Daily totals" data={data} series={series} />
    <AreaChart title="Daily order volume" unit="orders" categoryLabel="Day"
      period="19–22 October 2026" aggregation="Daily totals" data={data} series={series.slice(0, 1)} />
  </Stack>;
}
```

`BarChart` also accepts `orientation="horizontal" | "vertical"` and `stacked`. Grouped bars are the default. Positive and negative values stack on their respective sides of zero. Missing entries remain missing in text/table output even though they contribute no segment. Stacks are absolute values, not percentages; the host must decide whether the measures are additive. Use horizontal bars for category labels that need more room. All full labels remain in the inspector and table.

```tsx
"use client";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { BarChart, type ChartDatum, type ChartSeries } from "@evenkit/ui";

const series: readonly ChartSeries[] = [
  { id: "direct", label: "Direct orders", color: 1 },
  { id: "partner", label: "Partner orders", color: 3 },
  { id: "returns", label: "Returns", color: 5 },
];
const data: readonly ChartDatum[] = [
  { id: "north", label: "Northern region", values: { direct: 42, partner: 28, returns: -8 } },
  { id: "central", label: "Central region and surrounding partners", values: { direct: 56, partner: 37, returns: -12 } },
  { id: "south", label: "Southern region", values: { direct: 0, partner: null, returns: 0 } },
];

export function RegionalOrders() {
  return <BarChart title="Orders by region" unit="orders" categoryLabel="Region"
    period="October 2026" data={data} series={series} orientation="horizontal" stacked />;
}
```

## Frame, legend, tooltips and table

Every chart uses `ChartFrame`. Its figure includes a named caption, context, legend, state message, chart inspector and a native `View data table` disclosure. Loading and errors hide the old plot and data table. The table uses a caption, column/row headers, full labels and the same numeric formatter as the chart.

Tab reaches the chart as one focus target. Arrow Right/Down moves to the next category, Left/Up to the previous, Home/End to the endpoints, and Escape dismisses details. Pointer inspection and keyboard inspection use the same `ChartTooltip` content. In RTL, controls and text follow document direction; plot coordinates and category order retain their source order. Keyboard movement follows that plotted order. The table disclosure and its scroll region are keyboard accessible.

`ChartLegend`, `ChartTooltip` and `ChartDataTable` are public for custom compositions. `ChartLegend` takes `series`, an optional accessible `label`, and `variant="line" | "bar"` for matching line or hatch swatches. `ChartTooltip` takes `datum`, `series`, `unit`, and optional `formatValue`, `missingLabel`, `id` and `announce`. `ChartDataTable` takes `title`, `unit`, `data`, `series`, and optional `categoryLabel`, `formatValue` and `missingLabel`.

`ChartFrame` accepts the common chart props, an optional `legendVariant="line" | "bar"`, and either ordinary children or a render function receiving `activeIndex`, `onActiveIndexChange` and a stable `patternId`. Custom adapters own the visual marks and pointer hit areas; retain the frame's keyboard and table alternatives. Do not place nested focusable controls inside its plot interaction target. The [chart-frame catalog example](../apps/catalog/src/reporting-entries.ts) is a complete custom SVG composition with token colors and pointer hit areas; it uses a fixed 0–4 scale for its three-row fixture. Use the supplied adapters for general datasets.

The chart fills its available width. Vertical plots use a fixed height of three `--pk-space-16` units; horizontal bar plots grow with their rows and labels. Long labels remain available without relying on hover. The table scrolls within its own named region. For larger reports, aggregate or filter data in the host: the adapter is intended for modest dashboard datasets, without virtualization, zoom, pan, cross-chart synchronization or editing.

## Themes and contrast

The palette is explicit: `--pk-chart-series-1` through `--pk-chart-series-6`. Series 1 follows the active theme accent; the other slots provide categorical colors. Each mode supplies values while retaining neutral surfaces. Keep a given series on the same slot across related charts. `color` chooses a palette slot; it does not accept an arbitrary CSS color.

Custom brand input must provide all six `chart-series-1` through `chart-series-6` roles in both `modes.light` and `modes.dark`. This extends the required `ModeColors` schema. Existing custom-brand objects need those keys before validation; spread a shipped theme's modes to inherit their chart palette, then override intentional choices. Validation requires each series color to reach 3:1 against `bg`, `bg-muted`, `surface` and `surface-elevated`.

The token contrast check covers every series against the relevant neutral plotting surfaces across eight themes and light/dark modes. Surface contrast does not establish pairwise color distinguishability. Legends, series numbering, line dashes, bar patterns and the full data table supplement color. Keep these cues when adapting the frame. Charts have no data animation; focus uses the existing ring tokens, and reporting controls inherit the kit's reduced-motion behavior.

## Reporting controls and export

`ReportingControls` accepts a required `period`, optional `comparison` and `unit`, and an optional `filters` slot for existing kit fields. Each selection is `{ label, value, options, onValueChange }`. The host owns each value. Without `onApply`, changes can apply immediately. With `onApply`, keep separate draft and applied query snapshots, use `dirty` for unapplied feedback, and provide `pending` while updating. Optional `onReset`, `status`, `disabled`, `label` and `dir` complete the control contract. Custom filter controls participate in the disabled fieldset; portal-backed controls also need their own disabled prop.

`ExportAction` is controlled by `state` and `onPrepare`, with optional `onCancel`, `onRetry`, `label` and `disabled`.

| State | Required fields | Visible behavior |
| --- | --- | --- |
| `idle` | `status: "idle"` | Prepare action. |
| `preparing` | `status: "preparing"` | Indeterminate progress and optional cancel. |
| `progress` | `status: "progress"`, `value` | Percentage progress; finite values are clamped to 0–100. A nonfinite value remains indeterminate. |
| `ready` | `status: "ready"`, `href` | Download link and prepare-another action; optional `fileName`. |
| `error` | `status: "error"`, `message` | Error text and retry action. |

Preparing, progress and ready states also accept an optional `message`. The prepare/retry control remains mounted through status changes. Cancel and download removal return focus to it when necessary. Status messages are visible and announced; an error uses an alert. A host can omit cancel when its job cannot be cancelled.

The host starts and cancels work, rejects stale job results, invalidates prepared files when the applied report changes, and owns URL creation/revocation. Bind each job to its query snapshot. Disable export while the draft differs from the applied report, or explicitly tell the user which snapshot will be exported. Validate supplied download URLs at the application's boundary. Do not set ready merely because a request started; it means the file is available. The kit never performs queries, calculates metrics, generates files or uploads data.

The [reporting controls catalog example](../apps/catalog/src/reporting-entries.ts) includes a complete draft/apply wrapper with invalidation callbacks. The live preview advances export states manually and supplies a prepared CSV fixture. These preview transitions are not an export implementation.

## Editable dashboard block

Copy [registry/blocks/dashboard.tsx](../registry/blocks/dashboard.tsx) into the consuming application. `DashboardBlockProps` accepts `title`, optional `description`, `statistics`, `controls`, optional `exportAction`, optional `chart`, optional `activity`, a `dataSection` slot and optional `dir`. Each statistic adds a stable `id` to `StatisticProps`. The other sections accept their public component props. The chart is a line chart by default; edit the source to use a bar/area chart or additional sections.

The block composes the kit's PageHeader, ReportingControls, Statistic, LineChart, ActivityTimeline and ExportAction. Supply a semantic table or domain list through `dataSection`. Data, activity timestamps, comparison meanings, permissions, persistence and query/export cancellation remain with the host. The catalog's dashboard example shows immediate period/comparison changes, partial coverage, a data section and export invalidation; the copyable example shows the same public boundaries.

## Verification and limits

Focused regressions cover missing values versus zero, grouped/stacked numeric behavior, state transitions, keyboard inspection, export recovery and prepared-file invalidation. The reporting browser checks exercise the catalog in eight themes, both color modes, narrow layouts, RTL, reduced motion and visible focus. Package verification compiles the public APIs and copied block in independent consumers. See the current [session handoff](../SESSION_HANDOFF.md) for executed commands, evidence and any remaining gaps.

No pie, donut, scatter, heatmap, real-time transport, drilldown routing or export backend is included. These charts are categorical summaries with at most six series. Screen-reader application testing and physical touch-device testing should accompany adoption in a production reporting flow; the data table is always the complete textual alternative.
