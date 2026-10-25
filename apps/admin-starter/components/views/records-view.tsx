"use client";

import { useRouter } from "next/navigation";
import { Button, EmptyState, Inline } from "@evenkit/ui";
import { RecordWorkflow } from "../../blocks/record-workflow";
import { RecordDetail } from "../../blocks/record-detail";
import { useStarter } from "../starter-providers";
import { useDemoLoad } from "../use-demo-load";
import { ViewLoadState } from "../view-load-state";

export function RecordsView({ recordId }: { recordId?: string }) {
  const { data, workspaceName, appearance, saveRecord } = useStarter();
  const router = useRouter();
  const load = useDemoLoad();
  const record = data.records.find(item => item.id === recordId);
  return <div className="starter-stack">
    <Inline justify="end"><Button variant="outline" onClick={load.reload} disabled={load.state === "loading"}>Refresh records</Button></Inline>
    <ViewLoadState load={load} label="Records" />
    {load.state === "ready" ? recordId ? record ? <RecordDetail key={record.id} record={record}
      metadata={[{ id: "workspace", label: "Workspace", value: workspaceName }, { id: "owner", label: "Owner", value: data.profile.name }, { id: "id", label: "Record ID", value: record.id }]}
      activity={[{ id: "october", label: "October 2026", events: [{ id: "created", actor: data.profile.name, action: "created this project", timestamp: "2026-10-21T09:00:00Z", detail: "Sample activity for this fictional workspace." }] }]}
      timeZone="Europe/Vienna" locale={appearance.locale ?? "en"} onSave={saveRecord} onBack={() => router.push("/records")} />
      : <EmptyState title="Record not in this workspace" description="Choose a project from the current workspace, or switch back to its workspace." action={<Button onClick={() => router.push("/records")}>View records</Button>} />
      : <RecordWorkflow records={data.records} onSave={saveRecord} onOpenRecord={item => router.push(`/records/${item.id}`)} description={`Projects in ${workspaceName}. Changes are saved for this demo visit.`} /> : null}
  </div>;
}
