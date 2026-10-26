"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, DataList, DataListItem, Heading, Inline, type ExportState } from "@evenkit/ui";
import { DashboardBlock } from "../../blocks/dashboard";
import { reportCsv, reportData, reportPeriods, type ReportPeriod } from "../../lib/demo-reporting";
import { useStarter } from "../starter-providers";
import { useDemoLoad } from "../use-demo-load";
import { ViewLoadState } from "../view-load-state";

export function DashboardView() {
  const { data, workspaceId, workspaceName, request } = useStarter();
  const load = useDemoLoad();
  const [period, setPeriod] = useState<ReportPeriod>("week");
  const [applied, setApplied] = useState<ReportPeriod>("week");
  const [reportState, setReportState] = useState<"idle" | "pending" | "error">("idle");
  const [message, setMessage] = useState("");
  const [exportState, setExportState] = useState<ExportState>({ status: "idle" });
  const reportController = useRef<AbortController | null>(null);
  const exportController = useRef<AbortController | null>(null);
  const exportUrl = useRef<string | null>(null);
  const reportStatus = useRef<HTMLParagraphElement>(null);
  const cancelButton = useRef<HTMLButtonElement | null>(null);
  const retainReportFocus = useCallback((node: HTMLButtonElement | null) => {
    const previous = cancelButton.current;
    if (!node && previous?.ownerDocument.activeElement === previous) reportStatus.current?.focus();
    cancelButton.current = node;
  }, []);
  const measurements = reportData(workspaceId, applied);
  const periodLabel = reportPeriods.find(option => option.value === applied)?.label ?? "Last 7 days";

  useEffect(() => () => {
    reportController.current?.abort(); exportController.current?.abort();
    if (exportUrl.current) URL.revokeObjectURL(exportUrl.current);
  }, []);

  function clearExport() {
    exportController.current?.abort(); exportController.current = null;
    if (exportUrl.current) URL.revokeObjectURL(exportUrl.current);
    exportUrl.current = null; setExportState({ status: "idle" });
  }

  async function applyReport() {
    reportController.current?.abort();
    const controller = new AbortController(); reportController.current = controller;
    const selected = period;
    setReportState("pending"); setMessage(""); clearExport();
    try {
      await request(controller.signal);
      if (controller.signal.aborted || reportController.current !== controller) return;
      setApplied(selected); setReportState("idle"); setMessage("Report updated.");
    } catch (error) {
      if (controller.signal.aborted || reportController.current !== controller) return;
      setReportState("error"); setMessage(error instanceof Error ? error.message : "The report could not be loaded.");
    }
  }

  async function prepareExport() {
    clearExport();
    const controller = new AbortController(); exportController.current = controller;
    const snapshot = measurements;
    setExportState({ status: "preparing" });
    try {
      await request(controller.signal);
      if (controller.signal.aborted || exportController.current !== controller) return;
      const url = URL.createObjectURL(new Blob([reportCsv(snapshot)], { type: "text/csv;charset=utf-8" }));
      exportUrl.current = url;
      setExportState({ status: "ready", href: url, fileName: `${workspaceId}-${applied}-activity.csv` });
    } catch (error) {
      if (controller.signal.aborted || exportController.current !== controller) return;
      setExportState({ status: "error", message: error instanceof Error ? error.message : "The export could not be prepared." });
    }
  }

  return <section aria-label="Workspace dashboard" className="starter-stack">
    <Inline justify="between"><p className="starter-muted">Current workspace: {workspaceName}</p><Button variant="outline" onClick={() => { reportController.current?.abort(); clearExport(); setReportState("idle"); setMessage(""); load.reload(); }} disabled={load.state === "loading"}>Refresh dashboard</Button></Inline>
    <ViewLoadState load={load} label="Dashboard" />
    {load.state === "ready" ? <>
      <DashboardBlock title="Workspace report" description="Task measurements are fictional. Project counts reflect edits made in this tab."
        statistics={[
          { id: "projects", label: "Projects", value: data.records.length, period: "Current workspace" },
          { id: "active", label: "Active projects", value: data.records.filter(record => record.status === "active").length, period: "Current workspace" },
          { id: "completed", label: "Completed tasks", value: measurements.reduce((sum, row) => sum + (row.values.completed ?? 0), 0), period: periodLabel },
        ]}
        controls={{ period: { label: "Reporting period", value: period, options: reportPeriods, onValueChange: value => { if (value === "week" || value === "month") setPeriod(value); } }, dirty: period !== applied, pending: reportState === "pending", onApply: () => { void applyReport(); }, onReset: () => { reportController.current?.abort(); setReportState("idle"); setPeriod("week"); setApplied("week"); setMessage("Report reset."); clearExport(); }, status: `Showing ${periodLabel.toLowerCase()}.` }}
        exportAction={{ state: exportState, disabled: reportState === "pending", onPrepare: () => { void prepareExport(); }, onRetry: () => { void prepareExport(); }, onCancel: clearExport }}
        chart={{ title: "Completed task activity", description: `Sample activity for ${workspaceName}.`, unit: "tasks", period: periodLabel, aggregation: "Completed tasks per displayed period", categoryLabel: "Period", data: measurements, series: [{ id: "completed", label: "Completed tasks", color: 1 }] }}
        dataSection={<Card><CardHeader><Heading as="h3" size="4">Project overview</Heading></CardHeader><CardBody><DataList>{data.records.map(record => <DataListItem key={record.id} term={<Link prefetch={false} href={`/records/${record.id}`}>{record.name}</Link>}>{record.notes}</DataListItem>)}</DataList></CardBody></Card>}
      />
      <p ref={reportStatus} tabIndex={-1} role={reportState === "error" ? "alert" : "status"}>{message}</p>
      {reportState === "pending" ? <Button ref={retainReportFocus} variant="outline" onClick={() => { reportStatus.current?.focus(); reportController.current?.abort(); setReportState("idle"); setMessage("Report update cancelled. The previous report is still shown."); }}>Cancel report update</Button> : null}
      {reportState === "error" ? <Button variant="outline" onClick={() => { reportStatus.current?.focus(); void applyReport(); }}>Retry report</Button> : null}
    </> : null}
  </section>;
}
