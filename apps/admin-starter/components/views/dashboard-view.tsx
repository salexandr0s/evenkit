"use client";

import Link from "next/link";
import { Button, Card, CardBody, CardHeader, DataList, DataListItem, Heading, Inline } from "@evenkit/ui";
import { useStarter } from "../starter-providers";
import { useDemoLoad } from "../use-demo-load";
import { ViewLoadState } from "../view-load-state";

export function DashboardView() {
  const { data, workspaceName } = useStarter();
  const load = useDemoLoad();
  return <section aria-label="Workspace dashboard" className="starter-stack">
    <Inline justify="between"><p className="starter-muted">Current workspace: {workspaceName}</p><Button variant="outline" onClick={load.reload} disabled={load.state === "loading"}>Refresh dashboard</Button></Inline>
    <ViewLoadState load={load} label="Dashboard" />
    {load.state === "ready" ? <>
      <div className="starter-metrics">
        <Card><CardBody><span className="starter-muted">Projects</span><strong className="starter-metric-value">{data.records.length}</strong></CardBody></Card>
        <Card><CardBody><span className="starter-muted">Active projects</span><strong className="starter-metric-value">{data.records.filter(record => record.status === "active").length}</strong></CardBody></Card>
        <Card><CardBody><span className="starter-muted">Drafts to review</span><strong className="starter-metric-value">{data.records.filter(record => record.status === "draft").length}</strong></CardBody></Card>
      </div>
      <Card><CardHeader><Heading as="h2" size="4">Project overview</Heading></CardHeader><CardBody><DataList>{data.records.map(record => <DataListItem key={record.id} term={<Link href={`/records/${record.id}`}>{record.name}</Link>}>{record.notes}</DataListItem>)}</DataList></CardBody></Card>
    </> : null}
  </section>;
}
