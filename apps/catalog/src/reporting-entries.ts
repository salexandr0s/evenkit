import type { CatalogEntry } from "./catalog-types.js";

const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';
const seriesExample = `const series: readonly ChartSeries[] = [
  { id: "orders", label: "Orders", color: 1 },
  { id: "previous", label: "Previous period", color: 2 },
];
const data: readonly ChartDatum[] = [
  { id: "mon", label: "Monday", values: { orders: 24, previous: 18 } },
  { id: "tue", label: "Tuesday", values: { orders: null, previous: 23 } },
  { id: "wed", label: "Wednesday", values: { orders: 0, previous: 29 } },
  { id: "thu", label: "Thursday", values: { orders: 42, previous: 25 } },
];`;

export const reportingEntries: readonly CatalogEntry[] = [
  {
    id: "statistic", name: "Statistic / KPI", group: "Compositions", inventoryIds: ["H05"],
    description: "A value with its unit, period and comparison, including explicit missing, loading and error states.",
    tags: ["statistic", "KPI", "metric", "value", "trend", "comparison", "H05"],
    source: "Original kit composition · semantic metric text", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl",
    usage: `${imports}
import { Grid, Statistic } from "@evenkit/ui";

export function WeeklyMetrics() {
  return <Grid columns={3} className="pk-statistic-group">
    <Statistic label="Completed orders" value={221} unit="orders"
      period="19–25 October 2026"
      comparison={{ text: "Up 12% from the previous week", direction: "up", tone: "positive" }} />
    <Statistic label="Failed deliveries" value={0} unit="deliveries"
      period="19–25 October 2026"
      comparison={{ text: "Down 3 deliveries from the previous week", direction: "down", tone: "positive" }} />
    <Statistic label="Average response time" value={null} unit="minutes"
      period="19–25 October 2026" missingLabel="Not measured for this period" />
  </Grid>;
}
// Your application defines metrics, comparison arithmetic and favorable trends.
`,
  },
  {
    id: "chart-frame", name: "Chart frame and data", group: "Compositions", inventoryIds: ["K01"],
    description: "A shared series contract, named figure, legend, keyboard inspector and data table, with loading and recovery states.",
    tags: ["chart", "series", "legend", "tooltip", "table", "accessible", "loading", "K01"],
    source: "Original kit frame · D3 shape adapter", sourceUrl: "https://d3js.org/d3-shape",
    usage: `${imports}
import { ChartFrame, type ChartDatum, type ChartSeries } from "@evenkit/ui";

const series: readonly ChartSeries[] = [{ id: "reviews", label: "Completed reviews", color: 1 }];
const data: readonly ChartDatum[] = [
  { id: "mon", label: "Monday", values: { reviews: 2 } },
  { id: "tue", label: "Tuesday", values: { reviews: 4 } },
  { id: "wed", label: "Wednesday", values: { reviews: 3 } },
];

export function ReviewChart() {
  // This fixed fixture uses a 0–4 scale. Custom adapters own marks and hit areas.
  return <ChartFrame title="Reviews by day" unit="reviews" categoryLabel="Day"
    period="19–21 October 2026" aggregation="Daily totals" data={data} series={series} legendVariant="bar">
    {({ activeIndex, onActiveIndexChange }) => <svg viewBox="0 0 320 192" aria-hidden="true"
      style={{ display: "block", width: "100%", height: "calc(var(--pk-space-16) * 3)" }}>
      <path d="M0 154H320" stroke="var(--pk-color-border-strong)" />
      {data.map((row, index) => <g key={row.id} onPointerMove={() => onActiveIndexChange(index)}>
        <rect x={index * 100} y={0} width={100} height={192} fill="transparent" />
        <rect x={index * 100 + 16} y={154 - (row.values.reviews ?? 0) * 30}
          width={64} height={(row.values.reviews ?? 0) * 30} fill="var(--pk-chart-series-1)"
          stroke={activeIndex === index ? "var(--pk-color-ring)" : "none"}
          strokeWidth="var(--pk-border-width-thick)" pointerEvents="none" />
        <text x={index * 100 + 48} y={180} textAnchor="middle" fill="var(--pk-color-fg-muted)"
          style={{ fontSize: "var(--pk-font-size-sm)" }} pointerEvents="none">{row.label}</text>
      </g>)}
    </svg>}
  </ChartFrame>;
}
// ChartFrame supplies keyboard inspection, the tooltip, states and data table.
// For general datasets, use the supplied LineChart, AreaChart and BarChart adapters.
`,
  },
  {
    id: "line-chart", name: "Line and area charts", group: "Compositions", inventoryIds: ["K02"],
    description: "Ordered line and area charts with missing-value gaps, explicit units and periods, and matching table values.",
    tags: ["chart", "line", "area", "time", "period", "missing", "K02"],
    source: "D3 line/area generators · original React rendering", sourceUrl: "https://d3js.org/d3-shape/line",
    usage: `${imports}
import { AreaChart, LineChart, Stack, type ChartDatum, type ChartSeries } from "@evenkit/ui";

${seriesExample}

export function DailyOrders() {
  return <Stack gap="6">
    <LineChart title="Orders by day" unit="orders" categoryLabel="Day"
      period="19–22 October 2026" aggregation="Daily totals" data={data} series={series} />
    <AreaChart title="Daily order volume" unit="orders" categoryLabel="Day"
      period="19–22 October 2026" aggregation="Daily totals" data={data} series={series.slice(0, 1)} />
  </Stack>;
}
// Rows have equal visual spacing. Sort and aggregate time buckets in your application.
// Insert a null row for a missing bucket; absent rows do not create time gaps.
`,
  },
  {
    id: "bar-chart", name: "Bar charts", group: "Compositions", inventoryIds: ["K03"],
    description: "Horizontal and vertical bars with grouped or stacked series, negative values, and full category labels in the table.",
    tags: ["chart", "bar", "horizontal", "vertical", "grouped", "stacked", "comparison", "K03"],
    source: "Original React SVG adapter · shared chart contract", sourceUrl: "https://d3js.org/d3-shape/stack",
    usage: `${imports}
import { BarChart, Stack, type ChartDatum, type ChartSeries } from "@evenkit/ui";

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
  return <Stack gap="6">
    <BarChart title="Orders by region" unit="orders" categoryLabel="Region"
      data={data} series={series} orientation="horizontal" />
    <BarChart title="Orders by channel" unit="orders" categoryLabel="Region"
      data={data} series={series} orientation="vertical" />
    <BarChart title="Stacked regional orders" unit="orders" categoryLabel="Region"
      data={data} series={series} orientation="horizontal" stacked />
    <BarChart title="Stacked channel totals" unit="orders" categoryLabel="Region"
      data={data} series={series} orientation="vertical" stacked />
  </Stack>;
}
// Stack only additive measures with the same unit. Negative values stack below zero.
`,
  },
  {
    id: "reporting-controls", name: "Reporting controls and export", group: "Controls", inventoryIds: ["K07"],
    description: "Controlled report choices and export preparation, progress, download, cancellation and retry feedback.",
    tags: ["report", "period", "comparison", "filter", "unit", "export", "download", "progress", "K07"],
    source: "Original kit composition · host-owned queries and export", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download",
    usage: `${imports}
import { useState } from "react";
import { ExportAction, ReportingControls, Stack, type ExportState } from "@evenkit/ui";

interface ReportQuery { period: string; comparison: string; unit: string }
export function ReportTools({ exportState, onApply, onPrepare, onCancel, onInvalidateExport }: {
  exportState: ExportState;
  onApply: (query: ReportQuery) => void;
  onPrepare: () => void;
  onCancel: () => void;
  onInvalidateExport: () => void;
}) {
  const [query, setQuery] = useState<ReportQuery>({ period: "week", comparison: "previous", unit: "orders" });
  const [dirty, setDirty] = useState(false);
  function change(key: keyof ReportQuery, value: string) {
    setQuery(current => ({ ...current, [key]: value }));
    setDirty(true);
    onInvalidateExport();
  }
  return <Stack>
    <ReportingControls
      period={{ label: "Period", value: query.period, options: [{ value: "week", label: "This week" }, { value: "month", label: "This month" }], onValueChange: value => change("period", value) }}
      comparison={{ label: "Comparison", value: query.comparison, options: [{ value: "previous", label: "Previous period" }, { value: "none", label: "No comparison" }], onValueChange: value => change("comparison", value) }}
      unit={{ label: "Unit", value: query.unit, options: [{ value: "orders", label: "Orders" }, { value: "eur", label: "EUR" }], onValueChange: value => change("unit", value) }}
      dirty={dirty} onApply={() => { onApply(query); setDirty(false); }} />
    <ExportAction state={exportState} onPrepare={onPrepare} onRetry={onPrepare}
      onCancel={onCancel} disabled={dirty} />
  </Stack>;
}
// The host supplies state: idle, preparing, progress with value, ready with href,
// or error with message. It owns generation, cancellation and URL cleanup.
`,
  },
  {
    id: "dashboard", name: "Dashboard block", group: "Compositions", inventoryIds: ["O01"],
    description: "Editable dashboard source with report choices, summaries, charts, recent activity and a data section.",
    tags: ["dashboard", "overview", "summary", "activity", "reporting", "block", "O01"],
    source: "Editable original kit source · host-owned data", sourceUrl: "https://ui.shadcn.com/blocks",
    usage: `${imports}
import { useState } from "react";
import { type ExportActionProps } from "@evenkit/ui";
import { DashboardBlock } from "./dashboard";

// Copy registry/blocks/dashboard.tsx beside this module and edit its composition.
export function ReportingDashboard({ exportAction, onInvalidateExport }: {
  exportAction: ExportActionProps; onInvalidateExport: () => void;
}) {
  const [comparison, setComparison] = useState("previous");
  return <DashboardBlock title="Order report" description="Sample daily order totals."
    controls={{
      period: { label: "Period", value: "week", options: [{ value: "week", label: "19–25 October 2026" }], onValueChange: () => {} },
      comparison: { label: "Comparison", value: comparison, options: [{ value: "previous", label: "Previous period" }, { value: "none", label: "No comparison" }], onValueChange: value => { setComparison(value); onInvalidateExport(); } },
    }}
    statistics={[{ id: "orders", label: "Orders received", value: 55, unit: "orders", period: "19–20 October 2026" }]}
    chart={{ title: "Orders by day", unit: "orders", categoryLabel: "Day", aggregation: "Daily totals",
      series: [{ id: "current", label: "Current period", color: 1 }, ...(comparison === "previous" ? [{ id: "previous", label: "Previous period", color: 2 as const }] : [])],
      data: [{ id: "mon", label: "Monday", values: { current: 24, previous: 18 } }, { id: "tue", label: "Tuesday", values: { current: 31, previous: 23 } }],
    }}
    activity={{ timeZone: "Europe/Vienna", groups: [{ id: "today", label: "25 October 2026", events: [{ id: "report", actor: "Alex Morgan", action: "reviewed the weekly report", timestamp: "2026-10-25T09:00:00Z" }] }] }}
    exportAction={exportAction} />;
}
// The host supplies exportAction and invalidates ready files when the report changes.
`,
  },
];
