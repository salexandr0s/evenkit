"use client";

import { ChartFrame } from "./chart-frame.js";
import { BarPlot, LinePlot } from "./chart-plots.js";
import type { BarChartProps, ChartProps } from "./chart-types.js";

export type LineChartProps = ChartProps;
export type AreaChartProps = ChartProps;

export function LineChart(props: LineChartProps) {
  return <ChartFrame {...props}>{interaction => <LinePlot {...interaction} data={props.data} series={props.series} formatValue={props.formatValue} categoryLabel={props.categoryLabel} />}</ChartFrame>;
}
export function AreaChart(props: AreaChartProps) {
  return <ChartFrame {...props}>{interaction => <LinePlot {...interaction} data={props.data} series={props.series} formatValue={props.formatValue} categoryLabel={props.categoryLabel} area />}</ChartFrame>;
}
export function BarChart({ orientation = "vertical", stacked = false, ...props }: BarChartProps) {
  return <ChartFrame {...props} legendVariant="bar">{interaction => <BarPlot {...interaction} data={props.data} series={props.series} formatValue={props.formatValue} categoryLabel={props.categoryLabel} horizontal={orientation === "horizontal"} stacked={stacked} />}</ChartFrame>;
}
