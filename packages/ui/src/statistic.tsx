"use client";

import { type ComponentPropsWithoutRef } from "react";
import { classes } from "./classes.js";
import { ArrowDownIcon, ArrowUpIcon, CircleAlertIcon } from "./icons.js";

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
      <dt className="pk-statistic-label"><bdi dir="auto">{label}</bdi></dt>
      <dd className="pk-statistic-value" aria-busy={loading || undefined}>
        {available ? <><bdi dir="auto" className="pk-statistic-number">{typeof value === "number" ? formatValue(value) : value}</bdi>{unit ? <bdi dir="auto" className="pk-statistic-unit"> {unit}</bdi> : null}</> : <>
          {loading && !error ? <span className="pk-statistic-skeleton" aria-hidden="true" /> : null}
          {error ? <CircleAlertIcon className="pk-statistic-error-icon" size="md" animation="static" aria-hidden="true" /> : null}
          <bdi dir="auto" className={classes("pk-statistic-placeholder", loading && !error && "pk-visually-hidden")}>{error ? "Unavailable" : loading ? "Loading…" : missingLabel}</bdi>
        </>}
      </dd>
    </dl>
    <div className={classes("pk-statistic-footer", !period && !(available && comparison) && !error && !loading && "pk-visually-hidden")}>
      {available && comparison ? <p className="pk-statistic-comparison" data-tone={comparison.tone ?? "neutral"}>
        {comparison.direction === "up" ? <ArrowUpIcon size="sm" animation="static" aria-hidden="true" /> : comparison.direction === "down" ? <ArrowDownIcon size="sm" animation="static" aria-hidden="true" /> : <span className="pk-statistic-unchanged" aria-hidden="true">=</span>}
        <bdi dir="auto">{comparison.text}</bdi>
      </p> : null}
      {period ? <p className="pk-statistic-period"><bdi dir="auto">{period}</bdi></p> : null}
      <p className={classes("pk-statistic-status", !error && !loading && "pk-visually-hidden")} role="status"><bdi dir="auto">{error || (loading ? `Loading ${label.toLowerCase()}…` : "")}</bdi></p>
    </div>
  </div>;
}
