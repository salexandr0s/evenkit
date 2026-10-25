import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ChartColor = 1 | 2 | 3 | 4 | 5 | 6;
export interface ChartSeries {
  /** Stable key into each datum's values. A chart supports at most six series. */
  id: string;
  label: string;
  color?: ChartColor;
}
export interface ChartDatum {
  id: string;
  label: string;
  /** Zero is a measurement. Null, undefined and nonfinite numbers are missing. */
  values: Readonly<Record<string, number | null | undefined>>;
}
export interface ChartLabels {
  loading: string;
  empty: string;
  missing: string;
  retry: string;
  showTable: string;
  legend: string;
  instructions: string;
  invalid: string;
}
export interface ChartProps extends Omit<ComponentPropsWithoutRef<"figure">, "children" | "title"> {
  title: string;
  description?: ReactNode;
  unit: string;
  categoryLabel?: string;
  period?: string;
  aggregation?: string;
  data: readonly ChartDatum[];
  series: readonly ChartSeries[];
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  /** Formats a number without the unit; used consistently in inspector, axes and table. */
  formatValue?: (value: number) => string;
  labels?: Partial<ChartLabels>;
}
export interface BarChartProps extends ChartProps {
  orientation?: "horizontal" | "vertical";
  stacked?: boolean;
}

export const chartLabels: ChartLabels = {
  loading: "Loading chart…",
  empty: "No measurements for this period.",
  missing: "Not available",
  retry: "Retry",
  showTable: "View data table",
  legend: "Chart series",
  instructions: "Focus the chart and use arrow keys to inspect values. Home and End move to the first and last category. Escape dismisses details. All values are also in the data table.",
  invalid: "The chart needs unique category and series IDs, no more than six series, and values within the supported numeric range.",
};
