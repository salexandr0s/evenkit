import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { RecordWorkflow, type WorkflowRecord } from "../../registry/blocks/record-workflow.js";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

declare global { interface Window { recordTestHost: { resolve: () => void } } }
const record: WorkflowRecord = { id: "meridian", name: "Meridian release", notes: "Review the release.", status: "draft" };
function RecordHost() {
  const requests = useRef<(() => void)[]>([]);
  const [count, setCount] = useState(0);
  useEffect(() => { window.recordTestHost = { resolve: () => requests.current.shift()?.() }; }, []);
  return <>
    <RecordWorkflow records={[record]} initialEditId={record.id} onSave={draft => {
      setCount(value => value + 1);
      return new Promise<WorkflowRecord>(resolve => { requests.current.push(() => resolve({ ...draft, id: record.id })); });
    }} />
    <output aria-label="Save requests">{count}</output>
  </>;
}

const root = document.getElementById("root");
if (!root) throw new Error("The record host root is missing.");
createRoot(root).render(<RecordHost />);
