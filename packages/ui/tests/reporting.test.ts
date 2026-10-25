import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ExportAction, type ExportState } from "../src/reporting.js";
import { Statistic } from "../src/statistic.js";

describe("reporting presentation contracts", () => {
  it("keeps zero available and never formats missing or nonfinite values", () => {
    const formatValue = vi.fn((value: number) => `${value.toFixed(2)}`);
    const zero = renderToStaticMarkup(createElement(Statistic, { label: "Revenue", value: 0, unit: "EUR", formatValue }));
    expect(zero).toContain('data-state="ready"');
    expect(zero).toContain("0.00");
    expect(formatValue).toHaveBeenCalledExactlyOnceWith(0);
    for (const value of [null, "", NaN, Infinity]) {
      const missing = renderToStaticMarkup(createElement(Statistic, { label: "Revenue", value, formatValue }));
      expect(missing).toContain('data-state="empty"');
      expect(missing).toContain("No data");
    }
    expect(formatValue).toHaveBeenCalledTimes(1);
  });

  it("hides stale comparisons during loading and failure and keeps trend text independent of tone", () => {
    const comparison = { text: "Down 8% from September", direction: "down" as const, tone: "positive" as const };
    const ready = renderToStaticMarkup(createElement(Statistic, { label: "Incidents", value: 4, comparison }));
    expect(ready).toContain('data-tone="positive"');
    expect(ready).toContain(comparison.text);
    for (const state of [{ loading: true }, { error: "Report unavailable" }]) {
      const unavailable = renderToStaticMarkup(createElement(Statistic, { label: "Incidents", value: 4, comparison, ...state }));
      expect(unavailable).not.toContain(comparison.text);
    }
  });

  it("distinguishes indeterminate preparation from measured zero and clamps invalid progress", () => {
    const progressElement = (state: ExportState) => renderToStaticMarkup(createElement(ExportAction, { state, onPrepare() {} })).match(/<progress\b[^>]*>/u)?.[0];
    expect(progressElement({ status: "preparing" })).not.toMatch(/\svalue=/u);
    expect(progressElement({ status: "progress", value: 0 })).toContain('value="0"');
    expect(progressElement({ status: "progress", value: 120 })).toContain('value="100"');
    expect(progressElement({ status: "progress", value: -3 })).toContain('value="0"');
    expect(progressElement({ status: "progress", value: NaN })).not.toMatch(/\svalue=/u);
  });

  it("only offers a download for a ready export and removes its URL while disabled", () => {
    const render = (state: ExportState, disabled = false) => renderToStaticMarkup(createElement(ExportAction, { state, disabled, onPrepare() {} }));
    const ready: ExportState = { status: "ready", href: "/reports/october.csv", fileName: "october.csv" };
    expect(render(ready)).toContain('href="/reports/october.csv"');
    expect(render(ready)).toContain('download="october.csv"');
    expect(render(ready, true)).not.toContain("/reports/october.csv");
    expect(render({ status: "error", message: "Export failed" })).not.toContain("<a ");
    expect(render({ status: "preparing" })).not.toContain("<a ");
  });
});
