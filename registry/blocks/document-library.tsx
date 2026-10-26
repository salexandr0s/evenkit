"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, ChevronDownIcon, Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DocumentLibrary, FileLightbox, IconButton, RotateCcwIcon, SaveStatus, Undo2Icon, UploadIcon, UploadQueue, useDocumentLibrary, useUploadQueue, type DocumentFolder, type DocumentLibraryLoad, type DocumentLibraryQuery, type MediaFile, type UploadContext, type UploadResult } from "@evenkit/ui";

export interface DocumentMutationContext { signal: AbortSignal; folderId: string | null }
export interface DocumentLibraryBlockProps {
  /** Change when the account, workspace or permission context changes. */
  scopeKey: string;
  load: DocumentLibraryLoad;
  /** The application authorizes and validates all files before storing them. */
  upload?: (file: File, context: UploadContext & { folderId: string | null }) => Promise<UploadResult>;
  /** Prefer reversible trash semantics. Failed calls keep the selected IDs. */
  onRemove?: (ids: readonly string[], context: DocumentMutationContext) => Promise<void>;
  /** Restores the last successfully removed IDs; retention policy belongs to the host. */
  onRestore?: (ids: readonly string[], context: DocumentMutationContext) => Promise<void>;
  onRefreshPreview?: (file: MediaFile) => void;
}

const initialQuery: DocumentLibraryQuery = { folderId: null, kind: "all", pageIndex: 0, pageSize: 6, search: "", sort: { id: "name", direction: "asc" } };

/** Remounting on scope changes aborts uploads/mutations and discards the previous account's state. */
export function DocumentLibraryBlock(props: DocumentLibraryBlockProps) { return <LibraryWorkspace key={props.scopeKey} {...props} />; }

function LibraryWorkspace({ scopeKey, load, upload, onRemove, onRestore, onRefreshPreview }: DocumentLibraryBlockProps) {
  const [query, setQuery] = useState<DocumentLibraryQuery>(initialQuery);
  const [path, setPath] = useState<readonly DocumentFolder[]>([]);
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedPreview, setSelectedPreview] = useState<MediaFile | null>(null);
  const [removalIds, setRemovalIds] = useState<readonly string[] | null>(null);
  const [removed, setRemoved] = useState<{ ids: readonly string[]; folderId: string | null } | null>(null);
  const [pending, setPending] = useState<"remove" | "restore" | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const request = useRef<AbortController | null>(null);
  const refresh = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const result = useDocumentLibrary({ scopeKey, query, load });
  const preview = result.data.find(entry => entry.id === selectedPreview?.id && entry.kind === "file");
  const loadingPreview: MediaFile | null = selectedPreview && result.loading ? { id: selectedPreview.id, name: selectedPreview.name, mimeType: selectedPreview.mimeType, preview: { status: "loading" } } : null;
  useEffect(() => () => request.current?.abort(), []);
  useLayoutEffect(() => { if (pending === "remove") cancelButton.current?.focus(); }, [pending]);
  function cancelRequest() {
    request.current?.abort(); request.current = null; setPending(null);
  }
  function navigate(next: readonly DocumentFolder[]) {
    cancelRequest(); setRemovalIds(null); setRemoved(null); setError(""); setNote(""); setSelectedPreview(null);
    setPath(next); setQuery(current => ({ ...current, folderId: next.at(-1)?.id ?? null, pageIndex: 0, search: "", kind: "all" }));
  }
  function closeRemoval() { cancelRequest(); setRemovalIds(null); setError(""); setNote("Removal cancelled. Your selection is still here."); }
  async function mutate(operation: "remove" | "restore") {
    const ids = operation === "remove" ? removalIds : removed?.ids;
    const callback = operation === "remove" ? onRemove : onRestore;
    const folderId = operation === "remove" ? query.folderId : removed?.folderId ?? null;
    if (!ids?.length || !callback || pending) return;
    const controller = new AbortController();
    request.current?.abort(); request.current = controller; setPending(operation); setError(""); setNote("");
    try {
      await callback([...ids], { signal: controller.signal, folderId });
      if (controller.signal.aborted || request.current !== controller) return;
      if (operation === "remove") {
        setRemoved({ ids: [...ids], folderId }); setRemovalIds(null); result.selection.onSelectionChange([]);
        setNote(`${ids.length} ${ids.length === 1 ? "item" : "items"} removed.`);
      } else { setRemoved(null); setNote("Removed items restored."); }
      refresh.current?.focus(); result.retry();
    } catch (failure: unknown) {
      if (controller.signal.aborted || request.current !== controller) return;
      setError(failure instanceof Error ? failure.message : operation === "remove" ? "Items could not be removed. Retry or cancel." : "Items could not be restored. Try undo again.");
    } finally {
      if (request.current === controller) { request.current = null; setPending(null); }
    }
  }
  return <div className="pk-document-block">
    <DocumentLibrary entries={result.data} total={result.total} query={query} onQueryChange={setQuery} path={path} onNavigate={navigate} view={view} onViewChange={setView}
      selection={result.selection} loading={result.loading} error={result.error} onRetry={result.retry}
      onPreview={(file, trigger) => { trigger.focus(); setSelectedPreview(file); }} {...(onRemove ? { onRemove: (ids: readonly string[]) => { setError(""); setRemovalIds([...ids]); } } : {})}
      actions={<IconButton ref={refresh} label="Refresh documents" size="sm" variant="outline" onClick={result.retry}><RotateCcwIcon size="sm" /></IconButton>} />
    {removalIds === null && (error || note || pending === "restore") ? <SaveStatus state={error ? "error" : pending ? "saving" : "saved"} role={error ? "alert" : "status"}>{error || note || "Restoring items…"}</SaveStatus> : null}
    {removed && onRestore ? <div className="pk-document-recovery"><p>{removed.ids.length} {removed.ids.length === 1 ? "item can" : "items can"} be restored from the last removal.</p>
      <IconButton label="Undo removal" variant="outline" disabled={result.loading} loading={pending === "restore"} onClick={() => { void mutate("restore"); }}><Undo2Icon /></IconButton>
      {pending === "restore" ? <Button variant="ghost" onClick={() => { cancelRequest(); setNote("Restore cancelled. You can try undo again."); refresh.current?.focus(); }}>Cancel restore</Button> : null}
    </div> : null}
    {upload ? <DocumentUploads key={JSON.stringify([query.folderId])} folderId={query.folderId} upload={upload} onComplete={result.retry} /> : null}
    <FileLightbox file={preview?.kind === "file" ? preview : loadingPreview} open={selectedPreview !== null} onOpenChange={open => { if (!open) setSelectedPreview(null); }} returnFocusRef={refresh} {...(onRefreshPreview ? { onRefresh: onRefreshPreview } : {})} />
    <Dialog open={removalIds !== null} onOpenChange={open => { if (!open) closeRemoval(); }}>
      <DialogContent size="sm" onCloseAutoFocus={event => { event.preventDefault(); refresh.current?.focus(); }}>
        <DialogHeader><DialogTitle>Remove selected items?</DialogTitle><DialogDescription>{removalIds?.length ?? 0} selected items will be removed from this library.{onRestore ? " You can undo the last successful removal." : " Your application controls whether they can be restored."}</DialogDescription></DialogHeader>
        <DialogBody><SaveStatus state={error ? "error" : pending ? "saving" : "idle"} role={error ? "alert" : "status"}>{error || (pending === "remove" ? "Removing items…" : "Cancel to keep the selected items.")}</SaveStatus></DialogBody>
        <DialogFooter><Button ref={cancelButton} variant="outline" onClick={closeRemoval}>Cancel removal</Button><Button loading={pending === "remove"} onClick={() => { void mutate("remove"); }}>{error ? "Retry removal" : "Remove items"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </div>;
}

/** A folder change unmounts this queue and aborts its active attempts. The transport captures the destination. */
function DocumentUploads({ folderId, upload, onComplete }: { folderId: string | null; upload: NonNullable<DocumentLibraryBlockProps["upload"]>; onComplete: () => void }) {
  const transfer = useCallback((file: File, context: UploadContext) => upload(file, { ...context, folderId }), [upload, folderId]);
  const queue = useUploadQueue({ upload: transfer, maxFiles: 8, concurrency: 2 });
  const completed = queue.items.filter(item => item.state === "complete").map(item => item.id).join("|");
  const lastComplete = useRef("");
  useEffect(() => { if (completed !== lastComplete.current) { lastComplete.current = completed; if (completed) onComplete(); } }, [completed, onComplete]);
  return <details className="pk-document-upload-panel" open>
    <summary><UploadIcon size="sm" aria-hidden="true" /><span>Add files<small>Up to 8 files, 5 MB each</small></span><ChevronDownIcon size="sm" aria-hidden="true" /></summary>
    <UploadQueue queue={queue} label="Upload to this folder" accept="image/png,image/jpeg,image/webp,image/avif,image/gif,text/plain,application/pdf" maxBytes={5 * 1024 * 1024} showPreviews={false} hint="Images, plain text or PDF. Changing folders cancels pending uploads." />
  </details>;
}
