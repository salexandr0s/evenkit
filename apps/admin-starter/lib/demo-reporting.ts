import type { ChartDatum } from "@evenkit/ui";
import type { WorkspaceId } from "./demo-data";

export const reportPeriods = [{ value: "week", label: "Last 7 days" }, { value: "month", label: "Last 4 weeks" }] as const;
export type ReportPeriod = typeof reportPeriods[number]["value"];

/** Fictional measurements: these are not inferred from the editable project list. */
export function reportData(workspace: WorkspaceId, period: ReportPeriod): ChartDatum[] {
  const values = workspace === "northstar" ? [5, 8, 6, 12, 9, 14, 11] : [3, 4, 7, 5, 8, 6, 9];
  const labels = period === "week" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Week 1", "Week 2", "Week 3", "Week 4"];
  return labels.map((label, index) => ({ id: `${period}-${index}`, label, values: { completed: (values[index] ?? 0) * (period === "week" ? 1 : 4) } }));
}

export function reportCsv(data: readonly ChartDatum[]): string {
  return "Period,Completed tasks\r\n" + data.map(row => `${row.label},${row.values.completed ?? ""}`).join("\r\n");
}
