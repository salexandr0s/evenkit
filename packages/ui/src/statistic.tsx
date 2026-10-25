"use client";

import { type ComponentPropsWithoutRef } from "react";
import { classes } from "./classes.js";
import { ArrowDownIcon, ArrowUpIcon } from "./icons.js";

export interface StatisticComparison {
  /** Include direction, amount and comparison period in this visible text. */
  text: string;
  direction: "up" | "down" | "unchanged";
  /** A decrease can be positive; the application defines whether a change is useful. */
  tone?: "neutral" | "positive" | "negative";
}

export interface StatisticProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  label: string;
  /** Strings are already formatted by the host. Null, empty strings and nonfinite numbers are missing. */
  value: number | string | null;
  unit?: string;
  period?: string;
  comparison?: StatisticComparison;
  formatValue?: (value: number) => string;
  loading?: boolean;
  error?: string;
  missingLabel?: string;
}

/** Presentation only: metric definitions and comparison calculations belong to the host. */
export function Statistic({ label, value, unit, period, comparison, formatValue = String, loading = false, error, missingLabel = "No data", className, ...props }: StatisticProps) {
  const missing = value === null || value === "" || (typeof value === "number" && !Number.isFinite(value));
  const available = !error && !loading && !missing;
  return <div {...props} className={classes("pk-statistic", className)} data-state={error ? "error" : loading ? "loading" : missing ? "empty" : "ready"}>
    <dl className="pk-statistic-measurement">
      <dt className="pk-statistic-label">{label}</dt>
      <dd className="pk-statistic-value" aria-busy={loading || undefined}>
        {available ? <><span>{typeof value === "number" ? formatValue(value) : value}</span>{unit ? <span className="pk-statistic-unit"> {unit}</span> : null}</> : <span className="pk-statistic-placeholder">{error ? "Unavailable" : loading ? "Loading…" : missingLabel}</span>}
      </dd>
    </dl>
    {period ? <p className="pk-statistic-period">{period}</p> : null}
    {available && comparison ? <p className="pk-statistic-comparison" data-tone={comparison.tone ?? "neutral"}>
      {comparison.direction === "up" ? <ArrowUpIcon size="sm" animation="static" aria-hidden="true" /> : comparison.direction === "down" ? <ArrowDownIcon size="sm" animation="static" aria-hidden="true" /> : <span aria-hidden="true">=</span>}
      <span>{comparison.text}</span>
    </p> : null}
    <p className="pk-statistic-status" role="status">{error || (loading ? `Loading ${label.toLowerCase()}…` : "")}</p>
  </div>;
}
