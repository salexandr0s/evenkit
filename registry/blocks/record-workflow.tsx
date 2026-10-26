"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AppliedFilters, Badge, Button, CircleCheckIcon, DataTable, Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FilterBar, FormSection, IconButton, Inline, PageHeader, PencilIcon, PlusIcon, RotateCcwIcon, SaveStatus, SearchField, SelectField, Stack, TextareaField, TextField, type DataTableColumn } from "@evenkit/ui";

export interface WorkflowRecord { id: string; name: string; notes: string; status: "draft" | "active" }
export interface WorkflowDraft { id?: string; name: string; notes: string; status: "draft" | "active" }
export interface RecordWorkflowProps {
  records: readonly WorkflowRecord[];
  onSave: (draft: WorkflowDraft, context: { signal: AbortSignal }) => Promise<WorkflowRecord>;
  title?: string;
  description?: string;
  loading?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  initialEditId?: string;
  /** Show record details when its name is activated; routing stays with the host. */
  onOpenRecord?: (record: WorkflowRecord) => void;
  /** Mount the existing editor without its list, using initialEditId. */
  editorOnly?: boolean;
  onEditorClose?: () => void;
}
interface Editor { original: WorkflowDraft; draft: WorkflowDraft }
const statusOptions = [{ value: "draft", label: "Draft" }, { value: "active", label: "Active" }];
const blank: WorkflowDraft = { name: "", notes: "", status: "draft" };
function sameDraft(left: WorkflowDraft, right: WorkflowDraft) { return left.name === right.name && left.notes === right.notes && left.status === right.status; }

/** Editable application block. The host owns records, persistence, IDs and authorization. */
export function RecordWorkflow({ records, onSave, title = "Projects", description = "Review and update projects.", loading = false, error, onRetry, initialEditId, onOpenRecord, editorOnly = false, onEditorClose }: RecordWorkflowProps) {
  const initial = records.find(record => record.id === initialEditId);
  const [editor, setEditor] = useState<Editor | null>(() => initial ? { original: { ...initial }, draft: { ...initial } } : null);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [appliedStatus, setAppliedStatus] = useState("all");
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveNote, setSaveNote] = useState("");
  const [result, setResult] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const request = useRef<AbortController | null>(null);
  const createButton = useRef<HTMLButtonElement>(null);
  const returnTarget = useRef<HTMLButtonElement | null>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const keepEditing = useRef<HTMLButtonElement>(null);
  const formId = useId();
  const dirty = editor !== null && !sameDraft(editor.original, editor.draft);
  const dirtyFilters = query !== appliedQuery || status !== appliedStatus;
  const filtered = records.filter(record => record.name.toLocaleLowerCase().includes(appliedQuery.toLocaleLowerCase()) && (appliedStatus === "all" || record.status === appliedStatus));

  useEffect(() => () => request.current?.abort(), []);
  useLayoutEffect(() => { if (confirmDiscard) keepEditing.current?.focus(); }, [confirmDiscard]);

  function cancelSave(note = "Save cancelled. Your draft is still available.") {
    request.current?.abort(); request.current = null; setPending(false); setSaveNote(note);
  }
  function closeEditor() {
    request.current?.abort(); request.current = null; setPending(false); setConfirmDiscard(false); setEditor(null); setSaveError(""); setSaveNote("");
    onEditorClose?.();
  }
  function requestClose() {
    request.current?.abort(); request.current = null; setPending(false);
    if (dirty) setConfirmDiscard(true); else closeEditor();
  }
  function openEditor(record: WorkflowRecord | null, target: HTMLButtonElement) {
    request.current?.abort(); request.current = null;
    const draft = record ? { ...record } : { ...blank };
    returnTarget.current = target;
    setEditor({ original: { ...draft }, draft }); setAttempted(false); setPending(false); setSaveError(""); setSaveNote(""); setConfirmDiscard(false); setResult("");
  }
  function patchDraft(update: Partial<WorkflowDraft>) { setEditor(current => current ? { ...current, draft: { ...current.draft, ...update } } : current); setSaveError(""); setSaveNote(""); }
  function resetDraft() {
    cancelSave("");
    setEditor(current => current ? { ...current, draft: { ...current.original } } : current);
    setAttempted(false); setSaveError(""); nameInput.current?.focus();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || pending) return;
    setAttempted(true);
    if (!editor.draft.name.trim()) { nameInput.current?.focus(); return; }
    const controller = new AbortController();
    request.current?.abort(); request.current = controller;
    cancelButton.current?.focus(); setPending(true); setSaveError(""); setSaveNote("");
    try {
      const saved = await onSave({ ...editor.draft, name: editor.draft.name.trim() }, { signal: controller.signal });
      if (controller.signal.aborted || request.current !== controller) return;
      setResult(`${saved.name} saved.`); closeEditor();
    } catch (failure: unknown) {
      if (controller.signal.aborted || request.current !== controller) return;
      setSaveError(failure instanceof Error ? failure.message : "The project could not be saved. Try again.");
    } finally {
      if (request.current === controller) { request.current = null; setPending(false); }
    }
  }
  function clearFilters() { setQuery(""); setAppliedQuery(""); setStatus("all"); setAppliedStatus("all"); }
  const columns: readonly DataTableColumn<WorkflowRecord>[] = [
    { id: "name", header: "Project", accessor: record => record.name, overflow: "wrap", ...(onOpenRecord ? { cell: (record: WorkflowRecord) => <Button variant="link" size="sm" aria-label={`View ${record.name}`} onClick={() => onOpenRecord(record)}>{record.name}</Button> } : {}) },
    { id: "status", header: "Status", accessor: record => record.status === "active" ? "Active" : "Draft", cell: record => <Badge size="sm" tone={record.status === "active" ? "success" : "neutral"} dot>{record.status === "active" ? "Active" : "Draft"}</Badge> },
    { id: "notes", header: "Notes", accessor: record => record.notes || "No notes", overflow: "wrap", cell: record => <span style={{ display: "block", minWidth: "var(--pk-layout-sidebar)" }}>{record.notes || "No notes"}</span> },
    { id: "actions", header: "Actions", accessor: () => "", sortable: false, searchable: false, cell: record => <IconButton label="Edit" aria-label={`Edit ${record.name}`} onClick={event => openEditor(record, event.currentTarget)}><PencilIcon size="sm" /></IconButton> },
  ];
  return <section className="pk-record-workflow" aria-label={`${title} workflow`}>
    {!editorOnly ? <>
    <header><PageHeader headingAs="h2" title={title} description={description} metadata={`${records.length} ${records.length === 1 ? "project" : "projects"} in total`} actions={<Button ref={createButton} startIcon={<PlusIcon size="sm" />} onClick={event => openEditor(null, event.currentTarget)}>Create project</Button>} /></header>
    <Stack gap="3">
      <FilterBar aria-label="Project filters" dirty={dirtyFilters} busy={loading} status={`${filtered.length} matching ${filtered.length === 1 ? "project" : "projects"}.`} onApply={() => { setAppliedQuery(query.trim()); setQuery(query.trim()); setAppliedStatus(status); }} onClear={clearFilters}>
        <SearchField ref={searchInput} label="Find projects" clearLabel="Clear project search" name="query" value={query} onChange={event => setQuery(event.target.value)} />
        <SelectField label="Project status" name="status" options={[{ value: "all", label: "All statuses" }, ...statusOptions]} value={status} onValueChange={setStatus} />
      </FilterBar>
      <AppliedFilters filters={[...(appliedQuery ? [{ id: "query", label: `Search: ${appliedQuery}` }] : []), ...(appliedStatus !== "all" ? [{ id: "status", label: `Status: ${appliedStatus}` }] : [])]} onRemove={id => { if (id === "query") { setAppliedQuery(""); setQuery(""); } else { setAppliedStatus("all"); setStatus("all"); } }} onClear={clearFilters} />
    </Stack>
    <DataTable caption="Project records" data={filtered} columns={columns} getRowId={record => record.id} searchable={false} initialPageSize={3} pageSizeOptions={[3, 5, 10]} loading={loading} {...(error === undefined ? {} : { error })} {...(onRetry ? { onRetry } : {})} emptyTitle={records.length ? "No projects match these filters" : "No projects yet"} emptyDescription={records.length ? "Clear the applied filters to see your projects." : "Create a project to start this list."} emptyAction={records.length ? <Button onClick={() => { clearFilters(); searchInput.current?.focus(); }}>Clear filters</Button> : <Button onClick={event => openEditor(null, event.currentTarget)}>Create your first project</Button>} />
    <Inline className="pk-record-result" role="status" gap="2">{result ? <CircleCheckIcon size="sm" /> : null}{result}</Inline>
    </> : null}
    <Dialog open={editor !== null} onOpenChange={open => { if (!open) requestClose(); }}>
      <DialogContent showCloseButton={false} scroll="body" onCloseAutoFocus={event => { event.preventDefault(); (returnTarget.current?.isConnected ? returnTarget.current : createButton.current)?.focus(); }} onEscapeKeyDown={event => { event.preventDefault(); if (confirmDiscard) { setConfirmDiscard(false); queueMicrotask(() => nameInput.current?.focus()); } else requestClose(); }} onPointerDownOutside={event => { event.preventDefault(); if (!confirmDiscard) requestClose(); }}>
        {confirmDiscard ? <><DialogHeader><DialogTitle>Discard changes?</DialogTitle><DialogDescription>Your unsaved changes will be removed.</DialogDescription></DialogHeader><DialogBody><p>Keep editing to return to this draft, or discard it and return to the list.</p></DialogBody><DialogFooter><Button ref={keepEditing} variant="outline" onClick={() => { setConfirmDiscard(false); queueMicrotask(() => nameInput.current?.focus()); }}>Keep editing</Button><Button variant="destructive" onClick={closeEditor}>Discard changes</Button></DialogFooter></> : <>
          <DialogHeader><DialogTitle>{editor?.draft.id ? "Edit project" : "Create project"}</DialogTitle><DialogDescription>{editor?.original.id ? `Update ${editor.original.name}.` : "Set the name, status and notes for a new project."}</DialogDescription></DialogHeader>
          <DialogBody><form id={formId} onSubmit={event => { void submit(event); }} className="pk-record-form">
            <FormSection heading="Project details" headingAs="h3">
              <TextField ref={nameInput} label="Project name" name="name" required autoComplete="off" value={editor?.draft.name ?? ""} disabled={pending} onInvalid={() => setAttempted(true)} onChange={event => patchDraft({ name: event.target.value })} error={attempted && !editor?.draft.name.trim() ? "Enter a project name." : undefined} />
              <SelectField label="Status" name="record-status" options={statusOptions} value={editor?.draft.status ?? "draft"} disabled={pending} onValueChange={value => { if (value === "draft" || value === "active") patchDraft({ status: value }); }} />
            </FormSection>
            <FormSection heading="Notes" headingAs="h3">
              <TextareaField label="Project notes" name="notes" optional value={editor?.draft.notes ?? ""} disabled={pending} onChange={event => patchDraft({ notes: event.target.value })} />
            </FormSection>
            <IconButton className="pk-record-reset" label="Reset changes" disabled={pending || !dirty} onClick={resetDraft}><RotateCcwIcon size="sm" /></IconButton>
          </form></DialogBody>
          <DialogFooter className="pk-record-footer">
            <SaveStatus state={saveError ? "error" : pending ? "saving" : dirty ? "dirty" : "idle"} role={saveError ? "alert" : "status"} heading={saveError ? "Project was not saved" : undefined}>
              {saveError ? <>{saveError} Your draft is available for retry.</> : saveNote || (pending ? "Saving project…" : dirty ? "Unsaved changes" : "No unsaved changes")}
            </SaveStatus>
            <div className="pk-record-footer-actions"><Button ref={cancelButton} variant="outline" onClick={() => pending ? cancelSave() : requestClose()}>{pending ? "Cancel save" : "Cancel"}</Button><Button type="submit" form={formId} loading={pending}>{saveError ? "Retry save" : "Save project"}</Button></div>
          </DialogFooter>
        </>}
      </DialogContent>
    </Dialog>
  </section>;
}
