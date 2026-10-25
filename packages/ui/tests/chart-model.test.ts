import { describe, expect, it } from "vitest";
import { chartDomain, chartPaths, chartScale, chartSegments, chartValue, defaultChartFormat, hasChartData, validChartData } from "../src/chart-model.js";
import type { ChartDatum, ChartSeries } from "../src/chart-types.js";

const series: readonly ChartSeries[] = [{ id: "a", label: "Current" }, { id: "b", label: "Previous" }];
const row = (id: string, a: number | null | undefined, b: number | null | undefined = null): ChartDatum => ({ id, label: id, values: { a, b } });

describe("chart data boundaries", () => {
  it("keeps zero distinct from absent and nonfinite measurements", () => {
    expect(chartValue(0)).toBe(0);
    for (const missing of [null, undefined, NaN, Infinity, -Infinity]) expect(chartValue(missing)).toBeNull();
    expect(hasChartData([row("zero", 0)], series)).toBe(true);
    expect(hasChartData([row("missing", null, NaN)], series)).toBe(false);
    expect(defaultChartFormat(0.000001)).toBe("0.000001");
    expect(defaultChartFormat(1.123456789012345)).toBe("1.123456789012345");
  });
  it("rejects ambiguous identities, excessive series and unsafe stack magnitudes", () => {
    expect(validChartData([row("x", 1), row("x", 2)], series)).toBe(false);
    expect(validChartData([row("", 1)], series)).toBe(false);
    expect(validChartData([row("x", 1)], [series[0]!, series[0]!])).toBe(false);
    expect(validChartData([], Array.from({ length: 7 }, (_, index) => ({ id: String(index), label: String(index) })))).toBe(false);
    expect(validChartData([row("x", Number.MAX_VALUE)], series)).toBe(false);
    expect(validChartData([row("x", Number.MAX_SAFE_INTEGER / 6)], series)).toBe(true);
  });
});
describe("chart geometry", () => {
  it("uses separate positive and negative totals in signed stacks and includes zero", () => {
    const keys = ["a", "b", "c", "d"].map(id => ({ id, label: id }));
    const data = [{ id: "x", label: "x", values: { a: 5, b: -3, c: 7, d: -4 } }];
    expect(chartSegments(data, keys, true)[0]).toEqual([
      { value: 5, start: 0, end: 5 }, { value: -3, start: 0, end: -3 },
      { value: 7, start: 5, end: 12 }, { value: -4, start: -3, end: -7 },
    ]);
    expect(chartDomain(data, keys, true)).toEqual([-7, 12]);
    expect(chartDomain(data, keys, false)).toEqual([-4, 7]);
    expect(chartSegments([row("x", 0, null)], series, true)[0]).toEqual([{ value: 0, start: 0, end: 0 }, { value: null, start: 0, end: 0 }]);
  });
  it("keeps zero-only, negative-only and single-point plots finite", () => {
    const domain = chartDomain([row("zero", 0)], series);
    expect(domain).toEqual([0, 1]);
    expect(chartScale(0, domain)).toBe(232);
    expect(chartScale(0, domain, true)).toBe(8);
    expect(chartDomain([row("negative", -8)], series)).toEqual([-8, 0]);
    const paths = chartPaths([row("zero", 0)], series[0]!, domain);
    expect(paths.line).toContain("320,232");
    expect(paths.area).not.toMatch(/NaN|Infinity/);
  });
  it("breaks line and area paths at missing buckets without replacing them with zero", () => {
    const data = [row("one", 2), row("missing", null), row("zero", 0), row("four", 4)];
    const paths = chartPaths(data, series[0]!, chartDomain(data, series));
    expect(paths.line.match(/M/g)).toHaveLength(2);
    expect(paths.area.match(/M/g)).toHaveLength(2);
    expect(paths.line).toContain("424,232");
    expect(paths.line).not.toMatch(/NaN|Infinity/);
    expect(chartPaths([row("missing", undefined)], series[0]!, [0, 1])).toEqual({ line: "", area: "" });
  });
});
