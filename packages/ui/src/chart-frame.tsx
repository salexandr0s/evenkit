"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { SemanticTable, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableScrollRegion } from "./data-workflows.js";
import { ChevronDownIcon, Table2Icon } from "./icons.js";
import { chartColor, chartValue, defaultChartFormat, hasChartData, seriesDashes, seriesPatterns, validChartData } from "./chart-model.js";
import { chartLabels, type ChartDatum, type ChartProps, type ChartSeries } from "./chart-types.js";

export interface ChartLegendProps { series: readonly ChartSeries[]; label?: string; variant?: "line" | "bar" }
export function ChartLegend({ series, label = chartLabels.legend, variant = "line" }: ChartLegendProps) {
  const id = useId().replace(/:/g, "");
  return <ul className="pk-chart-legend" aria-label={label}>{series.map((item, index) => <li key={item.id}>
    <svg viewBox="0 0 32 16" className="pk-chart-swatch" aria-hidden="true" style={{ color: chartColor(item, index) }}>
      {variant === "bar" ? <><defs><pattern id={`${id}-${index}`} width={8} height={8} patternUnits="userSpaceOnUse"><rect width={8} height={8} fill="currentColor" />{index ? <path d={seriesPatterns[index]} className="pk-chart-pattern" /> : null}</pattern></defs><rect y={2} width={32} height={12} fill={`url(#${id}-${index})`} /></> : <path d="M0 8H32" stroke="currentColor" strokeWidth="2" strokeDasharray={seriesDashes[index]} />}
    </svg><span>{item.label}</span>
  </li>)}</ul>;
}
export interface ChartTooltipProps {
  datum: ChartDatum;
  series: readonly ChartSeries[];
  unit: string;
  id?: string;
  formatValue?: (value: number) => string;
  missingLabel?: string;
  announce?: boolean;
}
export function ChartTooltip({ datum, series, unit, id, formatValue = defaultChartFormat, missingLabel = chartLabels.missing, announce = false }: ChartTooltipProps) {
  return <div id={id} className="pk-chart-tooltip" role="tooltip" aria-live={announce ? "polite" : "off"} aria-atomic="true">
    <strong>{datum.label}</strong><dl>{series.map((item, index) => {
      const value = chartValue(datum.values[item.id]);
      return <div key={item.id}><dt><span className="pk-chart-tooltip-mark" aria-hidden="true" style={{ background: chartColor(item, index) }} />{item.label}</dt><dd>{value === null ? missingLabel : <>{formatValue(value)} <span>{unit}</span></>}</dd></div>;
    })}</dl>
  </div>;
}
export interface ChartDataTableProps {
  title: string;
  unit: string;
  categoryLabel?: string;
  data: readonly ChartDatum[];
  series: readonly ChartSeries[];
  formatValue?: (value: number) => string;
  missingLabel?: string;
}
export function ChartDataTable({ title, unit, categoryLabel = "Category", data, series, formatValue = defaultChartFormat, missingLabel = chartLabels.missing }: ChartDataTableProps) {
  return <TableScrollRegion label={`${title}: data table`} className="pk-chart-table-region"><SemanticTable density="compact">
    <TableCaption>{title} ({unit})</TableCaption>
    <TableHeader><TableRow><TableHead>{categoryLabel}</TableHead>{series.map(item => <TableHead key={item.id} align="end">{item.label} ({unit})</TableHead>)}</TableRow></TableHeader>
    <TableBody>{data.map(row => <TableRow key={row.id}><TableHead scope="row">{row.label}</TableHead>{series.map(item => {
      const value = chartValue(row.values[item.id]);
      return <TableCell key={item.id} align="end">{value === null ? missingLabel : formatValue(value)}</TableCell>;
    })}</TableRow>)}</TableBody>
  </SemanticTable></TableScrollRegion>;
}
export interface ChartFrameRenderProps {
  activeIndex: number | null;
  onActiveIndexChange: (index: number | null) => void;
  patternId: string;
}
export interface ChartFrameProps extends ChartProps {
  children: ReactNode | ((props: ChartFrameRenderProps) => ReactNode);
  legendVariant?: "line" | "bar";
}
export function ChartFrame({ title, description, unit, categoryLabel = "Category", period, aggregation, data, series, loading = false, error, onRetry, formatValue = defaultChartFormat, labels, children, legendVariant = "line", className, ...props }: ChartFrameProps) {
  const id = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const interaction = useRef<HTMLDivElement>(null);
  const recoverFocus = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    return () => { if (node.contains(node.ownerDocument.activeElement)) interaction.current?.focus(); };
  }, []);
  useEffect(() => {
    if (activeId === null) return;
    const document = interaction.current?.ownerDocument;
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") setActiveId(null); };
    document?.addEventListener("keydown", dismiss);
    return () => document?.removeEventListener("keydown", dismiss);
  }, [activeId]);
  const text = { ...chartLabels, ...labels };
  const invalid = !validChartData(data, series);
  const failed = error !== null && error !== undefined && error !== false;
  const ready = !loading && !failed && !invalid;
  const hasData = ready && hasChartData(data, series);
  const activeIndex = activeId === null || !hasData ? null : Math.max(0, data.findIndex(row => row.id === activeId));
  const active = activeIndex === null ? undefined : data[activeIndex];
  const select = (index: number | null) => setActiveId(index === null ? null : data[index]?.id ?? null);
  return <figure {...props} className={classes("pk-chart-frame", className)} aria-labelledby={`${id}-title`} aria-busy={loading || undefined}>
    <figcaption className="pk-chart-caption"><div className="pk-chart-heading"><h3 id={`${id}-title`}>{title}</h3>{description ? <div className="pk-chart-description">{description}</div> : null}</div>
      <div className="pk-chart-caption-meta"><p className="pk-chart-context">{period ? <span className="pk-chart-period"><bdi dir="auto">{period}</bdi></span> : null}{aggregation ? <span><bdi dir="auto">{aggregation}</bdi></span> : null}<span className="pk-chart-unit"><bdi dir="auto">{unit}</bdi></span></p>
        {series.length > 0 && !invalid ? <ChartLegend series={series} label={text.legend} variant={legendVariant} /> : null}
      </div>
    </figcaption>
    {hasData ? <p className="pk-chart-instructions pk-visually-hidden" id={`${id}-instructions`}>{text.instructions}</p> : null}
    <div className="pk-chart-inspectable" onPointerLeave={event => { if (!focused && event.pointerType !== "touch") select(null); }}>
      <div ref={interaction} className="pk-chart-interaction" role="group" tabIndex={hasData ? 0 : -1} aria-label={`${title}: chart`} aria-describedby={hasData ? `${id}-instructions${active ? ` ${id}-tooltip` : ""}` : `${id}-status`}
        onFocus={() => { setFocused(true); if (activeId === null && hasData) select(0); }}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setFocused(false); select(null); } }}
        onKeyDown={event => {
          if (!hasData) return;
          let next: number | null;
          const current = activeIndex ?? 0;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") next = activeIndex === null ? 0 : Math.min(data.length - 1, current + 1);
          else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, current - 1);
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = data.length - 1;
          else if (event.key === "Escape") next = null;
          else return;
          event.preventDefault(); select(next);
        }}>
        <div id={`${id}-status`} className="pk-chart-status" role={failed || invalid ? "alert" : "status"}>
          {loading ? text.loading : invalid ? text.invalid : failed ? error : !hasData ? text.empty : null}
          {!loading && failed && onRetry ? <Button ref={recoverFocus} variant="outline" size="sm" onClick={onRetry}>{text.retry}</Button> : null}
        </div>
        {hasData ? typeof children === "function" ? children({ activeIndex, onActiveIndexChange: select, patternId: id.replace(/:/g, "") }) : children : null}
      </div>
      <div className="pk-chart-inspector" data-side={activeIndex !== null && activeIndex >= data.length / 2 ? "left" : "right"}>{active ? <ChartTooltip id={`${id}-tooltip`} datum={active} series={series} unit={unit} formatValue={formatValue} missingLabel={text.missing} announce={focused} /> : null}</div>
    </div>
    {ready && data.length > 0 && series.length > 0 ? <details ref={recoverFocus} className="pk-chart-data"><summary><span className="pk-chart-data-label"><Table2Icon size="sm" animation="static" />{text.showTable}</span><span className="pk-chart-data-tools">{hasData ? <span className="pk-chart-key-hint" aria-hidden="true" title={text.instructions}><kbd>←</kbd><kbd>→</kbd></span> : null}<ChevronDownIcon size="sm" animation="static" className="pk-chart-disclosure-icon" /></span></summary>
      <ChartDataTable title={title} unit={unit} categoryLabel={categoryLabel} data={data} series={series} formatValue={formatValue} missingLabel={text.missing} />
    </details> : null}
  </figure>;
}
