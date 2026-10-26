import { useState } from "react";
import {
  AreaChart, Badge, BarChart, Button, ExportAction, Grid, LineChart, ReportingControls,
  SelectField, SemanticTable, Statistic, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableScrollRegion,
  type ExportState,
} from "@evenkit/ui";
import { DashboardBlock } from "../../../registry/blocks/dashboard.js";
import {
  channelSeries, comparisonOptions, monthlyOrders, orderSeries, periodOptions,
  regionalOrders, sampleExport, unitOptions, weeklyOrders,
} from "./reporting-demo-data.js";
import "./reporting-preview.css";

function StatisticExample() {
  return <div className="reporting-preview">
    <div className="reporting-preview-heading"><h3>Weekly performance</h3><p>19–25 October 2026</p></div>
    <Grid columns={3}>
      <Statistic label="Completed orders" value={221} unit="orders" period="19–25 October 2026"
        comparison={{ text: "Up 12% from the previous week", direction: "up", tone: "positive" }} />
      <Statistic label="Failed deliveries" value={0} unit="deliveries" period="19–25 October 2026"
        comparison={{ text: "Down 3 deliveries from the previous week", direction: "down", tone: "positive" }} />
      <Statistic label="Average response time" value={null} unit="minutes" period="19–25 October 2026" missingLabel="Not measured for this period" />
    </Grid>
    <section className="reporting-preview-section" aria-label="Customer and support metrics">
    <div className="reporting-preview-heading"><h3>Customers and support</h3><p>Monthly and daily measures</p></div>
    <Grid columns={2}>
      <Statistic label="Repeat customers" value={32} unit="%" period="October 2026"
        comparison={{ text: "Unchanged from September 2026", direction: "unchanged" }} />
      <Statistic label="Outstanding support requests from distribution partners" value={18} unit="requests" period="25 October 2026"
        comparison={{ text: "Up 4 requests from yesterday", direction: "up", tone: "negative" }} />
    </Grid>
    </section>
    <section className="reporting-preview-section" aria-label="Statistic states"><h3>Loading and unavailable values</h3>
      <Grid columns={2}>
        <Statistic label="Net revenue" value={null} unit="EUR" period="October 2026" loading />
        <Statistic label="Delivery time" value={null} unit="hours" period="October 2026" error="Delivery times could not be loaded." />
      </Grid>
    </section>
    <p className="reporting-preview-note">A decrease can be favorable. The comparison text names the change and period; its arrow and color support that text.</p>
  </div>;
}

function FrameExample() {
  const [state, setState] = useState("ready");
  const [short, setShort] = useState(false);
  const data = state === "empty" ? [] : short ? weeklyOrders.slice(0, 2) : weeklyOrders;
  return <div className="reporting-preview">
    <LineChart title="Orders by day" description="Daily totals, including one missing measurement and a measured zero."
      unit="orders" categoryLabel="Day" period="19–25 October 2026" aggregation="Daily totals"
      data={data} series={orderSeries} loading={state === "loading"}
      {...(state === "error" ? { error: "The order report could not be loaded." } : {})} onRetry={() => setState("ready")} />
    <div className="reporting-preview-options">
      <div className="reporting-preview-field"><SelectField label="Chart state" value={state} onValueChange={setState} options={[
        { value: "ready", label: "Ready" }, { value: "loading", label: "Loading" },
        { value: "empty", label: "Empty" }, { value: "error", label: "Error" },
      ]} /></div>
      <Button variant="outline" onClick={() => setShort(current => !current)}>{short ? "Use full week" : "Use shorter period"}</Button>
      <Button variant="outline" onClick={() => setState("loading")}>Reload sample</Button>
    </div>
    <p className="reporting-preview-note">Wednesday is missing; Thursday has zero orders. These controls change the sample.</p>
  </div>;
}

function LineExample() {
  return <div className="reporting-preview">
    <LineChart title="Orders by day" description="Compare daily order totals with the previous week."
      unit="orders" categoryLabel="Day" period="19–25 October 2026" aggregation="Daily totals" data={weeklyOrders} series={orderSeries} />
    <AreaChart title="Daily order volume" description="Wednesday is unavailable. Thursday is a measured zero."
      unit="orders" categoryLabel="Day" period="19–25 October 2026" aggregation="Daily totals" data={weeklyOrders} series={orderSeries.slice(0, 1)} />
    <p className="reporting-preview-note">Dates are ordered categories with equal visual spacing. The host prepares consistent buckets and inserts missing values.</p>
  </div>;
}

function BarExample() {
  return <div className="reporting-preview">
    <BarChart title="Orders by region" description="Grouped horizontal bars keep long region names available."
      unit="orders" categoryLabel="Region" period="October 2026" data={regionalOrders} series={channelSeries} orientation="horizontal" />
    <BarChart title="Orders by channel" description="Grouped vertical bars share a zero baseline."
      unit="orders" categoryLabel="Region" period="October 2026" data={regionalOrders} series={channelSeries} orientation="vertical" />
    <BarChart title="Stacked regional orders" description="Positive orders and negative returns stack on opposite sides of zero."
      unit="orders" categoryLabel="Region" period="October 2026" data={regionalOrders} series={channelSeries} orientation="horizontal" stacked />
    <BarChart title="Stacked channel totals" description="The Southern region includes zero orders and an unavailable partner count."
      unit="orders" categoryLabel="Region" period="October 2026" data={regionalOrders} series={channelSeries} orientation="vertical" stacked />
  </div>;
}

function ExportPreviewOptions({ onStateChange, disabled = false }: { onStateChange: (state: ExportState) => void; disabled?: boolean }) {
  return <details className="reporting-preview-export">
    <summary>Try export states</summary>
    <div className="reporting-preview-export-content">
    <p className="reporting-preview-note">Set the sample to progress, ready, or error. The download contains two sample rows.</p>
    <div className="reporting-preview-actions">
      <Button variant="outline" size="sm" disabled={disabled} onClick={() => onStateChange({ status: "progress", value: 45 })}>Show progress</Button>
      <Button variant="outline" size="sm" disabled={disabled} onClick={() => onStateChange({ status: "ready", href: sampleExport, fileName: "sample-orders.csv" })}>Complete export</Button>
      <Button variant="outline" size="sm" disabled={disabled} onClick={() => onStateChange({ status: "error", message: "The sample export failed. Retry or change the report." })}>Fail export</Button>
    </div>
    </div>
  </details>;
}

interface SampleQuery { period: string; comparison: string; unit: string; region: string }
const initialQuery: SampleQuery = { period: "week", comparison: "previous", unit: "orders", region: "all" };

function ReportingExample() {
  const [query, setQuery] = useState(initialQuery);
  const [applied, setApplied] = useState(initialQuery);
  const [exportState, setExportState] = useState<ExportState>({ status: "idle" });
  const dirty = Object.keys(initialQuery).some(key => query[key as keyof SampleQuery] !== applied[key as keyof SampleQuery]);
  function change(key: keyof SampleQuery, value: string) {
    setQuery(current => ({ ...current, [key]: value }));
    setExportState({ status: "idle" });
  }
  const appliedPeriod = periodOptions.find(option => option.value === applied.period)?.label;
  const appliedUnit = unitOptions.find(option => option.value === applied.unit)?.label;
  return <div className="reporting-preview">
    <ReportingControls
      period={{ label: "Period", value: query.period, options: periodOptions, onValueChange: value => change("period", value) }}
      comparison={{ label: "Comparison", value: query.comparison, options: comparisonOptions, onValueChange: value => change("comparison", value) }}
      unit={{ label: "Unit", value: query.unit, options: unitOptions, onValueChange: value => change("unit", value) }}
      filters={<SelectField label="Region" controlSize="sm" value={query.region} onValueChange={value => change("region", value)} options={[{ value: "all", label: "All regions" }, { value: "central", label: "Central region" }]} />}
      dirty={dirty} onApply={() => { setApplied(query); setExportState({ status: "idle" }); }}
      onReset={() => { setQuery(initialQuery); setApplied(initialQuery); setExportState({ status: "idle" }); }}
      status={`Applied: ${appliedPeriod} · ${appliedUnit} · ${applied.region === "all" ? "All regions" : "Central region"}`} />
    <section className="reporting-preview-download" aria-label="Report download">
    <div className="reporting-preview-section"><h3>Export this report</h3><p className="reporting-preview-note">Prepare a CSV download. This preview uses two sample rows.</p></div>
    <ExportAction state={exportState} onPrepare={() => setExportState({ status: "preparing" })}
      onRetry={() => setExportState({ status: "preparing" })} onCancel={() => setExportState({ status: "idle" })} disabled={dirty} />
    </section>
    <ExportPreviewOptions onStateChange={setExportState} disabled={dirty} />
  </div>;
}

function DashboardExample() {
  const [period, setPeriod] = useState("week");
  const [comparison, setComparison] = useState("previous");
  const [exportState, setExportState] = useState<ExportState>({ status: "idle" });
  const data = period === "week" ? weeklyOrders : monthlyOrders;
  const label = periodOptions.find(option => option.value === period)?.label ?? "";
  const total = data.reduce((sum, row) => sum + (row.values.current ?? 0), 0);
  const reported = data.filter(row => row.values.current !== null && row.values.current !== undefined).length;
  return <div className="reporting-preview">
    <DashboardBlock title="Order report" description="Orders received across the distribution network."
      controls={{
        period: { label: "Period", value: period, options: periodOptions, onValueChange: value => { setPeriod(value); setExportState({ status: "idle" }); } },
        comparison: { label: "Comparison", value: comparison, options: comparisonOptions, onValueChange: value => { setComparison(value); setExportState({ status: "idle" }); } },
        status: "Sample data · Choices apply immediately",
      }}
      statistics={[
        { id: "orders", label: "Reported orders", value: total, unit: "orders", period: label },
        { id: "coverage", label: "Reporting coverage", value: `${reported} of ${data.length}`, unit: "periods", period: "Missing periods are excluded from the total" },
        { id: "returns", label: "Pending returns", value: 0, unit: "returns", period: "25 October 2026" },
      ]}
      chart={{ title: "Order history", description: "Totals include reported periods only.", unit: "orders", categoryLabel: period === "week" ? "Day" : "Period", period: label,
        aggregation: period === "week" ? "Daily totals" : "Weekly totals; last bucket has three days", data,
        series: comparison === "previous" ? orderSeries : orderSeries.slice(0, 1) }}
      exportAction={{ state: exportState, onPrepare: () => setExportState({ status: "preparing" }), onCancel: () => setExportState({ status: "idle" }), onRetry: () => setExportState({ status: "preparing" }) }}
      dataSection={<section className="reporting-preview-section" aria-label="Reporting coverage"><h3>Coverage by period</h3>
        <TableScrollRegion label="Order reporting coverage"><SemanticTable><TableCaption className="pk-visually-hidden">Order reporting coverage</TableCaption><TableHeader><TableRow><TableHead>Period</TableHead><TableHead align="end">Orders</TableHead><TableHead>Availability</TableHead></TableRow></TableHeader>
          <TableBody>{data.map(row => <TableRow key={row.id}><TableHead scope="row">{row.label}</TableHead><TableCell align="end">{row.values.current ?? "—"}</TableCell><TableCell><Badge size="sm" tone={row.values.current === null ? "warning" : "neutral"}>{row.values.current === null ? "Not reported" : "Reported"}</Badge></TableCell></TableRow>)}</TableBody>
        </SemanticTable></TableScrollRegion></section>}
      activity={{ label: "Report activity", timeZone: "Europe/Vienna", groups: [{ id: "today", label: "25 October 2026", events: [
        { id: "review", actor: "Alex Morgan", action: "reviewed the weekly order report", timestamp: "2026-10-25T09:00:00Z" },
        { id: "missing", actor: "Nora Patel", action: "requested the missing Wednesday totals", timestamp: "2026-10-25T08:15:00Z" },
      ] }] }} />
    <ExportPreviewOptions onStateChange={setExportState} />
  </div>;
}

export function ReportingPreview({ id }: { id: string }) {
  if (id === "statistic") return <StatisticExample />;
  if (id === "chart-frame") return <FrameExample />;
  if (id === "line-chart") return <LineExample />;
  if (id === "bar-chart") return <BarExample />;
  if (id === "reporting-controls") return <ReportingExample />;
  if (id === "dashboard") return <DashboardExample />;
  return null;
}
