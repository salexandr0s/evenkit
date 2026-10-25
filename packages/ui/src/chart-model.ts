import { area, curveLinear, line } from "d3-shape";
import type { ChartDatum, ChartSeries } from "./chart-types.js";

export const plotWidth = 640;
export const plotHeight = 240;
export const plotInset = 8;
export const seriesDashes = ["", "8 4", "2 4", "8 3 2 3", "12 4", "4 3 2 3"] as const;
export const seriesPatterns = ["", "M0 8L8 0", "M0 0L8 8", "M0 4H8", "M4 0V8", "M0 0L8 8M0 8L8 0"] as const;
export const defaultChartFormat = (value: number) => new Intl.NumberFormat("en", { maximumSignificantDigits: 21 }).format(value);
export function chartValue(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
export function chartColor(series: ChartSeries, index: number): string {
  return `var(--pk-chart-series-${series.color ?? index + 1})`;
}
export function validChartData(data: readonly ChartDatum[], series: readonly ChartSeries[]): boolean {
  return series.length <= 6 && series.every(item => item.id.length > 0) && data.every(item => item.id.length > 0)
    && new Set(series.map(item => item.id)).size === series.length
    && new Set(data.map(item => item.id)).size === data.length
    && data.every(row => series.every(item => {
      const value = chartValue(row.values[item.id]);
      return value === null || Math.abs(value) <= Number.MAX_SAFE_INTEGER / 6;
    }));
}
export function hasChartData(data: readonly ChartDatum[], series: readonly ChartSeries[]): boolean {
  return data.some(row => series.some(item => chartValue(row.values[item.id]) !== null));
}
export interface ChartSegment { value: number | null; start: number; end: number }
export function chartSegments(data: readonly ChartDatum[], series: readonly ChartSeries[], stacked: boolean): ChartSegment[][] {
  return data.map(row => {
    let positive = 0;
    let negative = 0;
    return series.map(item => {
      const value = chartValue(row.values[item.id]);
      if (value === null) return { value, start: 0, end: 0 };
      const start = stacked ? value < 0 ? negative : positive : 0;
      const end = start + value;
      if (value < 0) negative = end;
      else positive = end;
      return { value, start, end };
    });
  });
}
export function chartDomain(data: readonly ChartDatum[], series: readonly ChartSeries[], stacked = false): readonly [number, number] {
  let min = 0;
  let max = 0;
  for (const row of chartSegments(data, series, stacked)) for (const segment of row) {
    min = Math.min(min, segment.start, segment.end);
    max = Math.max(max, segment.start, segment.end);
  }
  return min === max ? [0, 1] : [min, max];
}
export function chartScale(value: number, domain: readonly [number, number], horizontal = false): number {
  const fraction = (value - domain[0]) / (domain[1] - domain[0]);
  return horizontal ? plotInset + fraction * (plotWidth - 2 * plotInset) : plotHeight - plotInset - fraction * (plotHeight - 2 * plotInset);
}
export function categoryPosition(index: number, count: number): number {
  return count <= 1 ? plotWidth / 2 : plotInset + index / (count - 1) * (plotWidth - 2 * plotInset);
}
export function chartPaths(data: readonly ChartDatum[], series: ChartSeries, domain: readonly [number, number]) {
  const points = data.map((row, index) => ({ x: categoryPosition(index, data.length), value: chartValue(row.values[series.id]) }));
  const path = line<(typeof points)[number]>().defined(point => point.value !== null).x(point => point.x).y(point => chartScale(point.value ?? 0, domain)).curve(curveLinear);
  const fill = area<(typeof points)[number]>().defined(point => point.value !== null).x(point => point.x).y0(chartScale(0, domain)).y1(point => chartScale(point.value ?? 0, domain)).curve(curveLinear);
  return { line: path(points) ?? "", area: fill(points) ?? "" };
}
