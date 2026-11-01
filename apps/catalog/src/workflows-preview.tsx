import { useEffect, useRef, useState } from "react";
import { ActionMessage, AppliedFilters, Badge, Button, ButtonLink, FileInput, FileRow, FilterBar, SelectField, SemanticTable, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TableScrollRegion, TextField, type FileSelection } from "@evenkit/ui";
import { RecordWorkflow, type WorkflowDraft, type WorkflowRecord } from "../../../registry/blocks/record-workflow";
import { RecoveryPage, type RecoveryKind } from "../../../registry/blocks/recovery-page";
import "./workflows-preview.css";

const initialRecords: readonly WorkflowRecord[] = [
  { id: "meridian", name: "Meridian release", notes: "Prepare a release checklist and confirm the handover.", status: "active" },
  { id: "aster", name: "Aster research", notes: "Collect interview notes for the next planning session.", status: "draft" },
  { id: "cedar", name: "Cedar handover", notes: "Review documents and agree the next owner.", status: "active" },
  { id: "delta", name: "Delta review", notes: "Gather decisions from the quarterly review.", status: "draft" },
  { id: "beacon", name: "Beacon workshop", notes: "Schedule the workshop and prepare discussion prompts.", status: "active" },
];

function TableExample() {
  const [density, setDensity] = useState<"default" | "compact">("default");
  return <div className="workflows-preview">
    <div className="workflows-preview-toolbar"><div><h3>Budget review</h3><p className="workflows-preview-note">Allocations for two fictional projects.</p></div><div className="workflows-preview-density"><SelectField label="Table density" value={density} options={[{ value: "default", label: "Default" }, { value: "compact", label: "Compact" }]} onValueChange={value => { if (value === "default" || value === "compact") setDensity(value); }} /></div></div>
    <TableScrollRegion label="Project budget table"><SemanticTable density={density}>
      <TableCaption>Fictional project budgets</TableCaption>
      <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Owner</TableHead><TableHead align="end">Budget</TableHead></TableRow></TableHeader>
      <TableBody><TableRow><TableHead scope="row">Meridian release</TableHead><TableCell>Alex Morgan</TableCell><TableCell align="end">€12,400</TableCell></TableRow><TableRow><TableHead scope="row">Aster research and cross-functional discovery programme</TableHead><TableCell>Sam Rivera</TableCell><TableCell align="end">€8,600</TableCell></TableRow></TableBody>
      <TableFooter><TableRow><TableHead colSpan={2} scope="row">Total</TableHead><TableCell align="end">€21,000</TableCell></TableRow></TableFooter>
    </SemanticTable></TableScrollRegion>
    <p className="workflows-preview-note">Switch density to compare row spacing. Long project names remain readable at either setting.</p>
  </div>;
}

function FiltersExample({ appliedInitially = false }: { appliedInitially?: boolean }) {
  const [draft, setDraft] = useState(appliedInitially ? "Meridian" : "");
  const [query, setQuery] = useState(appliedInitially ? "Meridian" : "");
  const [draftStatus, setDraftStatus] = useState(appliedInitially ? "active" : "all");
  const [status, setStatus] = useState(appliedInitially ? "active" : "all");
  const [deferred, setDeferred] = useState(false);
  const timers = useRef(new Set<number>());
  useEffect(() => { const pending = timers.current; return () => pending.forEach(timer => window.clearTimeout(timer)); }, []);
  function commit(change: () => void) {
    if (!deferred) { change(); return; }
    const timer = window.setTimeout(() => { timers.current.delete(timer); change(); }, 400);
    timers.current.add(timer);
  }
  const items = initialRecords.filter(record => record.name.toLowerCase().includes(query.toLowerCase()) && (status === "all" || record.status === status));
  function clear() { setDraft(""); setQuery(""); setDraftStatus("all"); setStatus("all"); }
  return <div className="workflows-preview">
    <div className="workflows-preview-toolbar"><div><h3>Project directory</h3><p className="workflows-preview-note">Find a project by name or status. Apply your changes to update the list.</p></div></div>
    <FilterBar aria-label="Sample project filters" dirty={draft !== query || draftStatus !== status} onApply={() => { setQuery(draft.trim()); setDraft(draft.trim()); setStatus(draftStatus); }} onClear={() => commit(clear)} status={`${items.length} matching ${items.length === 1 ? "project" : "projects"}.`}>
      <TextField label="Search project names" type="search" value={draft} onChange={event => setDraft(event.target.value)} />
      <SelectField label="Filter status" options={[{ value: "all", label: "All statuses" }, { value: "active", label: "Active" }, { value: "draft", label: "Draft" }]} value={draftStatus} onValueChange={setDraftStatus} />
    </FilterBar>
    <AppliedFilters filters={[...(query ? [{ id: "query", label: `Search: ${query}` }] : []), ...(status !== "all" ? [{ id: "status", label: `Status: ${status}` }] : [])]} onRemove={id => commit(() => { if (id === "query") { setQuery(""); setDraft(""); } else { setStatus("all"); setDraftStatus("all"); } })} onClear={() => commit(clear)} />
    <ul className="workflows-preview-results" aria-label="Filtered projects">{items.map(record => <li key={record.id}><div><strong>{record.name}</strong><p>{record.notes}</p></div><Badge size="sm" tone={record.status === "active" ? "success" : "neutral"}>{record.status === "active" ? "Active" : "Draft"}</Badge></li>)}</ul>
    {items.length === 0 ? <p>No matching projects. Clear the applied filters to see all records.</p> : null}
    <section className="workflows-preview-diagnostics"><h3>Preview options</h3><div className="workflows-preview-options"><label><input type="checkbox" checked={deferred} onChange={event => setDeferred(event.target.checked)} />Defer filter updates</label></div></section>
  </div>;
}

interface SelectedFile { id: number; file: File }
function FilesExample() {
  const [files, setFiles] = useState<readonly SelectedFile[]>([]);
  const [selectionCount, setSelectionCount] = useState(0);
  const [formNames, setFormNames] = useState("");
  const nextId = useRef(0);
  const picker = useRef<HTMLInputElement>(null);
  function selected(selection: FileSelection) {
    setSelectionCount(count => count + 1);
    setFiles(current => [...current, ...selection.accepted.map(file => ({ file, id: nextId.current++ }))]);
  }
  return <div className="workflows-preview">
    <div className="workflows-preview-toolbar"><div><h3>Files for the project review</h3><p className="workflows-preview-note">Add supporting documents to this local selection.</p></div></div>
    <form className="workflows-preview" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setFormNames(data.getAll("attachments").filter((value): value is File => value instanceof File && value.name !== "").map(file => file.name).join(", ") || "No files in the current selection."); }} onReset={() => { setFiles([]); setFormNames(""); setSelectionCount(0); }}>
      <FileInput ref={picker} name="attachments" label="Project attachments" accept=".txt,.pdf" maxBytes={1024 * 1024} maxFiles={3} files={files.map(item => item.file)} hint="Text or PDF files, up to 1 MB each. Add up to three files. This preview does not upload them." onFilesSelected={selected} />
      <ul className="workflows-preview-files" aria-label="Selected attachments">{files.map(({ id, file }) => <FileRow key={id} name={file.name} sizeBytes={file.size} fileType={file.type || "File"} onRemove={() => { setFiles(current => current.filter(item => item.id !== id)); picker.current?.focus(); }} />)}</ul>
      <div className="workflows-preview-file-summary"><div className="catalog-demo-actions"><Button type="submit" variant="outline">Read selected files</Button><Button type="reset" variant="ghost">Clear files</Button></div><p className="workflows-preview-note" role="status">{selectionCount} selections received. {files.length} files retained in this preview.</p></div>
      {formNames ? <ActionMessage heading="Current native selection">{formNames}</ActionMessage> : null}
    </form>
    <section className="workflows-preview-diagnostics"><h3>Unavailable selection</h3><FileInput label="Unavailable attachments" disabled hint="Disabled file selection cannot accept drops." onFilesSelected={() => undefined} /></section>
  </div>;
}

function FileRowsExample() {
  const [failed, setFailed] = useState(true);
  const [included, setIncluded] = useState(true);
  const [uploading, setUploading] = useState(true);
  const reset = useRef<HTMLButtonElement>(null);
  return <div className="workflows-preview">
    <div className="workflows-preview-toolbar"><div><h3>Review attachments</h3><p className="workflows-preview-note">Check file status, retry the failed example or cancel the pending one.</p></div></div>
    <ul className="workflows-preview-files" aria-label="File state examples">
      {included ? <FileRow name="Quarterly project handover and delivery notes.txt" sizeBytes={12400} fileType="Text document" downloadHref="data:text/plain;charset=utf-8,Example%20project%20notes" state={failed ? "error" : "complete"} message={failed ? "The sample upload failed. Retry to mark it complete." : "Sample retry completed."} onRetry={() => { reset.current?.focus(); setFailed(false); }} onRemove={() => { setIncluded(false); reset.current?.focus(); }} /> : null}
      <FileRow name="Research-summary.pdf" sizeBytes={420000} fileType="PDF" state={uploading ? "uploading" : "ready"} progress={65} message={uploading ? "Example progress; no file is being uploaded." : "Sample operation cancelled."} onCancel={() => { setUploading(false); reset.current?.focus(); }} />
    </ul>
    <section className="workflows-preview-diagnostics"><h3>Preview options</h3><div className="catalog-demo-actions"><Button ref={reset} variant="outline" onClick={() => { setIncluded(true); setFailed(true); setUploading(true); }}>Reset file examples</Button></div></section>
  </div>;
}

function waitForSave(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Save cancelled", "AbortError")); return; }
    const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 800);
    function abort() { window.clearTimeout(timer); reject(new DOMException("Save cancelled", "AbortError")); }
    signal.addEventListener("abort", abort, { once: true });
  });
}
function RecordsExample({ editInitially = false }: { editInitially?: boolean }) {
  const [records, setRecords] = useState(initialRecords);
  const [failNext, setFailNext] = useState(false);
  const [listError, setListError] = useState(false);
  const [loading, setLoading] = useState(false);
  async function save(draft: WorkflowDraft, { signal }: { signal: AbortSignal }) {
    const shouldFail = failNext;
    await waitForSave(signal);
    if (signal.aborted) throw new DOMException("Save cancelled", "AbortError");
    if (shouldFail) { setFailNext(false); throw new Error("The sample save failed. Retry to save the same draft."); }
    const record: WorkflowRecord = { ...draft, id: draft.id ?? crypto.randomUUID() };
    setRecords(current => current.some(item => item.id === record.id) ? current.map(item => item.id === record.id ? record : item) : [...current, record]);
    return record;
  }
  return <div className="workflows-preview">
    <RecordWorkflow records={records} onSave={save} loading={loading} {...(listError ? { error: "Sample records are temporarily unavailable." } : {})} onRetry={() => setListError(false)} {...(editInitially ? { initialEditId: "meridian" } : {})} />
    <section className="workflows-preview-diagnostics" aria-label="Local workflow scenarios"><h3>Preview options</h3><div className="workflows-preview-options"><label><input type="checkbox" checked={failNext} onChange={event => setFailNext(event.target.checked)} />Fail the next save</label><label><input type="checkbox" checked={listError} onChange={event => setListError(event.target.checked)} />Show list error</label><label><input type="checkbox" checked={loading} onChange={event => setLoading(event.target.checked)} />Show loading</label></div><p className="workflows-preview-note">All records and save results stay in this local example.</p></section>
  </div>;
}

const recoveryKinds: readonly { value: RecoveryKind; label: string }[] = [{ value: "not-found", label: "404 / not found" }, { value: "unavailable", label: "500 / unavailable" }, { value: "denied", label: "Access denied" }, { value: "offline", label: "Offline" }, { value: "maintenance", label: "Maintenance" }];
function RecoveryExample() {
  const [kind, setKind] = useState<RecoveryKind>("not-found");
  const [message, setMessage] = useState("");
  return <div className="workflows-preview">
    <RecoveryPage kind={kind} headingAs="h3" action={kind === "not-found" ? <ButtonLink href="#list-page">Open project list</ButtonLink> : <Button onClick={() => setMessage(kind === "denied" ? "A sample access request has been prepared." : "Recovery requested in this local preview.")}>{kind === "denied" ? "Request access" : kind === "maintenance" ? "Check service status" : "Try again"}</Button>} secondaryAction={kind === "not-found" ? undefined : <ButtonLink variant="outline" href="#list-page">Return to projects</ButtonLink>} />
    <p className="workflows-preview-note workflows-preview-recovery-status" role="status">{message}</p>
    <section className="workflows-preview-diagnostics"><h3>Preview states</h3><div className="workflows-preview-recovery-controls"><SelectField label="Recovery state" value={kind} options={recoveryKinds} onValueChange={value => { const entry = recoveryKinds.find(item => item.value === value); if (entry) { setKind(entry.value); setMessage(""); } }} /></div><p className="workflows-preview-note">Recovery actions update this local preview. The consuming application supplies real destinations and actions.</p></section>
  </div>;
}

export function WorkflowsPreview({ id }: { id: string }) {
  switch (id) {
    case "semantic-table": return <TableExample />;
    case "filters": return <FiltersExample />;
    case "applied-filters": return <FiltersExample appliedInitially />;
    case "file-input": return <FilesExample />;
    case "file-row": return <FileRowsExample />;
    case "edit-page": return <RecordsExample editInitially />;
    case "error-pages": return <RecoveryExample />;
    default: return <RecordsExample />;
  }
}
