"use client";

import { useState } from "react";
import { AreaChart, BarChart, ChartDataTable, ChartFrame, ChartLegend, ChartTooltip, ExportAction, LineChart, ReportingControls, Stack, Statistic, type ChartDatum, type ChartSeries, type ExportState } from "@evenkit/ui";
import { DashboardBlock } from "./blocks/dashboard";

const series: readonly ChartSeries[] = [{ id: "completed", label: "Completed", color: 1 }, { id: "adjustment", label: "Adjustment", color: 2 }];
const data: readonly ChartDatum[] = [
  { id: "monday", label: "Monday", values: { completed: 24, adjustment: -3 } },
  { id: "tuesday", label: "Tuesday", values: { completed: null, adjustment: 0 } },
  { id: "wednesday", label: "Wednesday", values: { completed: 0, adjustment: 4 } },
];
const chart = { title: "Packed monthly activity", unit: "orders", data, series, period: "October 2026", aggregation: "Daily totals" };

export function ReportingFixture() {
  const [period, setPeriod] = useState("month");
  const [exportState, setExportState] = useState<ExportState>({ status: "idle" });
  const controls = { period: { label: "Packed report period", value: period, options: [{ value: "month", label: "This month" }], onValueChange: setPeriod } };
  const exportAction = { state: exportState, onPrepare: () => setExportState({ status: "preparing" }), onCancel: () => setExportState({ status: "idle" }) };
  return <Stack aria-label="Packed reporting controls">
    <h2>Reporting package controls</h2>
    <Statistic label="Packed completed orders" value={0} unit="orders" comparison={{ direction: "down", text: "Down 3 from the previous period", tone: "positive" }} />
    <ReportingControls {...controls} />
    <ExportAction {...exportAction} />
    <LineChart {...chart} />
    <AreaChart {...chart} title="Packed volume" />
    <BarChart {...chart} title="Packed grouped bars" orientation="horizontal" />
    <BarChart {...chart} title="Packed stacked bars" stacked />
    <ChartFrame {...chart} title="Packed chart composition"><p>Host-provided plot with shared frame and table.</p></ChartFrame>
    <ChartLegend series={series} />
    <ChartTooltip datum={data[0]!} series={series} unit="orders" />
    <ChartDataTable {...chart} title="Packed explicit table" />
    <DashboardBlock title="Packed reporting dashboard" statistics={[{ id: "orders", label: "Orders", value: 24, unit: "orders" }]} controls={controls} exportAction={exportAction} chart={chart} />
  </Stack>;
}
