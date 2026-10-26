"use client";

import { type ReactNode } from "react";
import {
  ActivityTimeline, ExportAction, LineChart, PageHeader, ReportingControls, Statistic,
  type ActivityTimelineProps, type ExportActionProps, type LineChartProps, type ReportingControlsProps, type StatisticProps,
} from "@evenkit/ui";

export interface DashboardStatistic extends StatisticProps { id: string }

export interface DashboardBlockProps {
  title: string;
  description?: ReactNode;
  statistics: readonly DashboardStatistic[];
  controls: ReportingControlsProps;
  exportAction?: ExportActionProps;
  chart?: LineChartProps;
  activity?: ActivityTimelineProps;
  /** Compose a kit Table, DataTable or a domain-specific list in the host. */
  dataSection?: ReactNode;
  dir?: "ltr" | "rtl";
}

/** Editable source. The host owns datasets, definitions, queries, export jobs and URL lifetimes. */
export function DashboardBlock({ title, description, statistics, controls, exportAction, chart, activity, dataSection, dir }: DashboardBlockProps) {
  return <section className="pk-dashboard" aria-label={title} dir={dir}>
    <PageHeader headingAs="h2" title={title} {...(description === undefined ? {} : { description })} {...(exportAction ? { actions: <ExportAction {...exportAction} /> } : {})} />
    <ReportingControls {...controls} {...(dir ? { dir } : {})} />
    <div className="pk-dashboard-statistics" role="group" aria-label="Report summary">
      {statistics.map(({ id, ...statistic }) => <Statistic key={id} {...statistic} />)}
    </div>
    {chart ? <LineChart {...chart} /> : null}
    {dataSection || activity ? <div className="pk-dashboard-support">
      {dataSection ? <div className="pk-dashboard-section">{dataSection}</div> : null}
      {activity ? <div className="pk-dashboard-activity"><h3 className="pk-dashboard-support-heading">{activity.label ?? "Activity"}</h3><ActivityTimeline {...activity} /></div> : null}
    </div> : null}
  </section>;
}
