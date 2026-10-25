"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ActivityTimeline, Badge, Button, DataList, DataListItem, PageHeader, Tabs, TabsContent, TabsList, TabsTrigger, type ActivityGroup } from "@evenkit/ui";
import { RecordWorkflow, type WorkflowRecord, type RecordWorkflowProps } from "./record-workflow";

export interface RecordMetadata { id: string; label: string; value: ReactNode }
export interface RecordDetailProps {
  record: WorkflowRecord;
  metadata: readonly RecordMetadata[];
  activity: readonly ActivityGroup[];
  timeZone: string;
  locale?: string;
  onSave: RecordWorkflowProps["onSave"];
  onBack: () => void;
  backLabel?: string;
  actions?: ReactNode;
  activityLoading?: boolean;
  activityError?: ReactNode;
  onRetryActivity?: () => void;
}

/** Copy alongside record-workflow.tsx. The host owns the record and its history. */
export function RecordDetail({ record, metadata, activity, timeZone, locale = "en", onSave, onBack, backLabel = "Back to projects", actions, activityLoading = false, activityError, onRetryActivity }: RecordDetailProps) {
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState("");
  const editButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const returning = useRef(false);
  useLayoutEffect(() => { heading.current?.focus(); }, [record.id]);
  useLayoutEffect(() => { if (!editing && returning.current) { returning.current = false; editButton.current?.focus(); } }, [editing]);
  function closeEditor() { returning.current = true; setEditing(false); }
  return <section className="pk-record-detail" aria-label={`${record.name} details`}>
    <Button variant="ghost" size="sm" onClick={onBack}>{backLabel}</Button>
    <PageHeader ref={heading} tabIndex={-1} headingAs="h2" title={record.name} description={record.notes || "No description has been added."} metadata={<Badge dot tone={record.status === "active" ? "success" : "neutral"}>{record.status === "active" ? "Active" : "Draft"}</Badge>} actions={<><Button ref={editButton} variant="outline" onClick={() => { setResult(""); setEditing(true); }}>Edit project</Button>{actions}</>} />
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project detail sections"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>
      <TabsContent value="overview"><DataList>{metadata.map(item => <DataListItem key={item.id} term={item.label}>{item.value ?? "Not provided"}</DataListItem>)}</DataList></TabsContent>
      <TabsContent value="activity"><ActivityTimeline groups={activity} timeZone={timeZone} locale={locale} loading={activityLoading} {...(activityError === undefined ? {} : { error: activityError })} {...(onRetryActivity ? { onRetry: onRetryActivity } : {})} /></TabsContent>
    </Tabs>
    <p role="status" className="pk-settings-result">{result}</p>
    {editing ? <RecordWorkflow key={record.id} records={[record]} initialEditId={record.id} editorOnly onEditorClose={closeEditor} onSave={async (draft, context) => { const saved = await onSave(draft, context); if (!context.signal.aborted) setResult(`${saved.name} saved.`); return saved; }} /> : null}
  </section>;
}
