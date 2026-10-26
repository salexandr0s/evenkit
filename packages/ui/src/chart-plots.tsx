"use client";

import type { CSSProperties } from "react";
import type { ChartFrameRenderProps } from "./chart-frame.js";
import { categoryPosition, chartColor, chartDomain, chartPaths, chartScale, chartSegments, chartValue, defaultChartFormat, plotHeight, plotInset, plotWidth, seriesDashes, seriesPatterns } from "./chart-model.js";
import type { ChartDatum, ChartSeries } from "./chart-types.js";

interface PlotProps extends ChartFrameRenderProps {
  data: readonly ChartDatum[];
  series: readonly ChartSeries[];
  formatValue?: ((value: number) => string) | undefined;
  categoryLabel?: string | undefined;
}
function Grid({ domain, horizontal = false }: { domain: readonly [number, number]; horizontal?: boolean }) {
  const ticks = [domain[0], domain[0] + (domain[1] - domain[0]) / 2, domain[1]];
  return <g className="pk-chart-grid">{ticks.map((value, index) => horizontal
    ? <line key={index} x1={chartScale(value, domain, true)} x2={chartScale(value, domain, true)} y1={plotInset} y2={plotHeight - plotInset} />
    : <line key={index} x1={plotInset} x2={plotWidth - plotInset} y1={chartScale(value, domain)} y2={chartScale(value, domain)} />)}
    {horizontal ? <line className="pk-chart-zero" x1={chartScale(0, domain, true)} x2={chartScale(0, domain, true)} y1={plotInset} y2={plotHeight - plotInset} />
      : <line className="pk-chart-zero" x1={plotInset} x2={plotWidth - plotInset} y1={chartScale(0, domain)} y2={chartScale(0, domain)} />}
  </g>;
}
function Axis({ domain, formatValue = defaultChartFormat, horizontal = false }: { domain: readonly [number, number]; formatValue?: ((value: number) => string) | undefined; horizontal?: boolean }) {
  const values = horizontal ? [domain[0], domain[0] + (domain[1] - domain[0]) / 2, domain[1]] : [domain[1], domain[0] + (domain[1] - domain[0]) / 2, domain[0]];
  return <div className="pk-chart-axis" data-horizontal={horizontal || undefined} aria-hidden="true">{values.map((value, index) => <span key={index}>{formatValue(value)}</span>)}</div>;
}
function Categories({ data, activeIndex, grouped = false }: { data: readonly ChartDatum[]; activeIndex: number | null; grouped?: boolean }) {
  const tracks = grouped ? data.length : Math.max(1, (data.length - 1) * 2);
  return <div className="pk-chart-categories" data-grouped={grouped || undefined} data-single={data.length === 1 || undefined} style={{ "--pk-chart-count": tracks } as CSSProperties} aria-hidden="true">
    {data.map((row, index) => <span key={row.id} dir="auto" style={grouped ? undefined : { gridColumn: index === 0 ? "1" : index === data.length - 1 ? String(tracks) : `${index * 2} / span 2` }} data-active={activeIndex === index || undefined}>{row.label}</span>)}
  </div>;
}
function Points({ data, series, domain }: { data: readonly ChartDatum[]; series: readonly ChartSeries[]; domain: readonly [number, number] }) {
  return <div className="pk-chart-marker-layer" aria-hidden="true">{series.map((item, index) => data.map((row, rowIndex) => {
    const value = chartValue(row.values[item.id]);
    return value === null ? null : <span key={`${item.id}-${row.id}`} className="pk-chart-point" data-series={item.id} data-category={row.id} data-shape={index % 3 === 1 ? "square" : index % 3 === 2 ? "diamond" : "circle"} style={{ left: `${categoryPosition(rowIndex, data.length) / plotWidth * 100}%`, top: `${chartScale(value, domain) / plotHeight * 100}%`, color: chartColor(item, index) }} />;
  }))}</div>;
}
export function LinePlot({ data, series, activeIndex, onActiveIndexChange, formatValue, categoryLabel, area = false }: PlotProps & { area?: boolean }) {
  const domain = chartDomain(data, series);
  return <div className="pk-chart-plot" data-kind={area ? "area" : "line"}>
    <div className="pk-chart-vertical-layout"><Axis domain={domain} formatValue={formatValue} />
      <div className="pk-chart-svg-wrap"><svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} preserveAspectRatio="none" className="pk-chart-svg" aria-hidden="true">
        <Grid domain={domain} />
        {series.map((item, index) => {
          const paths = chartPaths(data, item, domain);
          return <g key={item.id} style={{ color: chartColor(item, index) }}>
            {area ? <path className="pk-chart-area" data-series={item.id} d={paths.area} /> : null}
            <path className="pk-chart-line" data-series={item.id} d={paths.line} strokeDasharray={seriesDashes[index]} />
          </g>;
        })}
        {activeIndex === null ? null : <line className="pk-chart-cursor" x1={categoryPosition(activeIndex, data.length)} x2={categoryPosition(activeIndex, data.length)} y1={plotInset} y2={plotHeight - plotInset} />}
        {data.map((row, index) => {
          const x = categoryPosition(index, data.length);
          const previous = categoryPosition(index - 1, data.length);
          const next = categoryPosition(index + 1, data.length);
          const start = index === 0 ? 0 : (previous + x) / 2;
          const end = index === data.length - 1 ? plotWidth : (x + next) / 2;
          return <rect key={row.id} className="pk-chart-hit" data-category={row.id} x={start} y={0} width={end - start} height={plotHeight} onPointerEnter={() => onActiveIndexChange(index)} onPointerDown={() => onActiveIndexChange(index)} />;
        })}
      </svg><Points data={data} series={series} domain={domain} /></div>
    </div>
    <Categories data={data} activeIndex={activeIndex} />
    {categoryLabel ? <p className="pk-chart-category-title">{categoryLabel}</p> : null}
  </div>;
}

function Patterns({ series, patternId }: { series: readonly ChartSeries[]; patternId: string }) {
  return <defs>{series.map((item, index) => <pattern id={`${patternId}-${index}`} key={item.id} width={8} height={8} patternUnits="userSpaceOnUse">
    <rect width={8} height={8} fill={chartColor(item, index)} />
    {index ? <path d={seriesPatterns[index]} className="pk-chart-pattern" /> : null}
  </pattern>)}</defs>;
}
export function BarPlot({ data, series, activeIndex, onActiveIndexChange, patternId, formatValue, categoryLabel, horizontal = false, stacked = false }: PlotProps & { horizontal?: boolean; stacked?: boolean }) {
  const domain = chartDomain(data, series, stacked);
  const segments = chartSegments(data, series, stacked);
  const band = (horizontal ? plotHeight - 2 * plotInset : plotWidth - 2 * plotInset) / data.length;
  const groupSize = band * 0.7;
  const size = stacked ? groupSize : groupSize / series.length;
  return <div className="pk-chart-plot" data-kind="bar" data-orientation={horizontal ? "horizontal" : "vertical"} data-stacked={stacked || undefined}>
    {horizontal ? <Axis domain={domain} formatValue={formatValue} horizontal /> : null}
    <div className={horizontal ? "pk-chart-horizontal-layout" : "pk-chart-vertical-layout"} style={{ "--pk-chart-count": data.length } as CSSProperties}>
      {horizontal ? <div className="pk-chart-row-labels" aria-hidden="true">{data.map((row, index) => <span key={row.id} dir="auto" data-active={activeIndex === index || undefined}>{row.label}</span>)}</div> : <Axis domain={domain} formatValue={formatValue} />}
      <div className="pk-chart-svg-wrap"><svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} preserveAspectRatio="none" className="pk-chart-svg" aria-hidden="true">
        <Patterns series={series} patternId={patternId} /><Grid domain={domain} horizontal={horizontal} />
        {segments.map((row, rowIndex) => row.map((segment, seriesIndex) => {
          if (segment.value === null) return null;
          const item = series[seriesIndex];
          const datum = data[rowIndex];
          if (!item || !datum) return null;
          const start = chartScale(segment.start, domain, horizontal);
          const end = chartScale(segment.end, domain, horizontal);
          const category = plotInset + rowIndex * band + (band - groupSize) / 2 + (stacked ? 0 : seriesIndex * size);
          return <rect key={`${datum.id}-${item.id}`} className="pk-chart-bar" data-series={item.id} data-category={datum.id} data-zero={segment.value === 0 || undefined}
            x={horizontal ? Math.min(start, end) : category} y={horizontal ? category : Math.min(start, end)}
            width={horizontal ? Math.abs(end - start) : size} height={horizontal ? size : Math.abs(end - start)}
            fill={`url(#${patternId}-${seriesIndex})`} style={{ color: chartColor(item, seriesIndex) }} />;
        }))}
        {data.map((row, index) => <rect key={row.id} className="pk-chart-hit" data-category={row.id} data-active={activeIndex === index || undefined}
          x={horizontal ? 0 : plotInset + index * band} y={horizontal ? plotInset + index * band : 0}
          width={horizontal ? plotWidth : band} height={horizontal ? band : plotHeight}
          onPointerEnter={() => onActiveIndexChange(index)} onPointerDown={() => onActiveIndexChange(index)} />)}
      </svg></div>
    </div>
    {!horizontal ? <Categories data={data} activeIndex={activeIndex} grouped /> : null}
    {categoryLabel ? <p className="pk-chart-category-title">{categoryLabel}</p> : null}
  </div>;
}
