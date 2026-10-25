"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { FileInput, FileRow, type FileSelection } from "./data-workflows.js";
import { Thumbnail } from "./image.js";
import { UploadQueueStore, type UploadAddResult, type UploadItem, type UploadQueueOptions, type UploadRejection } from "./upload-queue-utils.js";

export type { UploadState, UploadResult, UploadItem, UploadContext, UploadTransport, UploadQueueOptions, UploadRejection, UploadAddResult } from "./upload-queue-utils.js";

export interface UploadQueueController {
  items: readonly UploadItem[];
  maxFiles: number;
  addFiles: (files: readonly File[]) => UploadAddResult;
  start: () => void;
  cancel: (id: string) => void;
  cancelAll: () => void;
  retry: (id: string) => void;
  remove: (id: string) => void;
  clearCompleted: () => void;
}

/** Owns upload attempts while the host supplies transport, authorization and URLs. */
export function useUploadQueue({ upload, concurrency = 2, maxFiles = 10, autoStart = true }: UploadQueueOptions): UploadQueueController {
  const [store] = useState(() => new UploadQueueStore({ upload, concurrency, maxFiles, autoStart }));
  const items = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  useEffect(() => { store.configure({ upload, concurrency, maxFiles }); }, [store, upload, concurrency, maxFiles]);
  useEffect(() => { store.activate(); return store.deactivate; }, [store]);
  return { items, maxFiles, addFiles: store.addFiles, start: store.start, cancel: store.cancel, cancelAll: store.cancelAll, retry: store.retry, remove: store.remove, clearCompleted: store.clearCompleted };
}

function UploadPreview({ file }: { file: File }) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return src ? <Thumbnail src={src} alt="" size="sm" loading="eager" /> : null;
}

function UploadQueueRow({ item, queue, showPreview, locale }: { item: UploadItem; queue: UploadQueueController; showPreview: boolean; locale: string | undefined }) {
  const row = useRef<HTMLLIElement>(null);
  const recover = (action: () => void) => { row.current?.focus(); action(); };
  return <FileRow ref={row} tabIndex={-1} name={item.file.name} sizeBytes={item.file.size} fileType={item.file.type || "File"}
    state={item.state} {...(item.progress === undefined ? {} : { progress: item.progress })}
    {...(locale ? { locale } : {})} {...item.result}
    message={item.error}
    preview={showPreview && item.file.type.startsWith("image/") ? <UploadPreview file={item.file} /> : undefined}
    onCancel={() => recover(() => queue.cancel(item.id))} onRetry={() => recover(() => queue.retry(item.id))}
    onRemove={() => queue.remove(item.id)} />;
}

export interface UploadQueueProps {
  queue: UploadQueueController;
  label: ReactNode;
  hint?: ReactNode;
  accept?: string;
  maxBytes?: number;
  disabled?: boolean;
  showPreviews?: boolean;
  locale?: string;
  className?: string;
  emptyMessage?: ReactNode;
  name?: string;
  form?: string;
  id?: string;
}

export function UploadQueue({ queue, label, hint, accept, maxBytes, disabled = false, showPreviews = true, locale, className, emptyMessage = "Choose files to start uploading.", name, form, id }: UploadQueueProps) {
  const [rejected, setRejected] = useState<readonly UploadRejection[]>([]);
  const picker = useRef<HTMLInputElement>(null);
  const { items } = queue;
  const complete = items.filter(item => item.state === "complete").length;
  const active = items.filter(item => item.state === "uploading").length;
  const queued = items.filter(item => item.state === "queued").length;
  const failed = items.filter(item => item.state === "error").length;
  const cancelled = items.filter(item => item.state === "cancelled").length;
  const summary = items.length ? `${complete} of ${items.length} complete${active ? `, ${active} uploading` : ""}${queued ? `, ${queued} queued` : ""}${failed ? `, ${failed} failed` : ""}${cancelled ? `, ${cancelled} cancelled` : ""}.` : "No files in the queue.";
  function select(selection: FileSelection) { setRejected(queue.addFiles(selection.accepted).rejected); }
  // Removing a row must leave focus on a stable visible control.
  const rowQueue = { ...queue, remove: (itemId: string) => { picker.current?.focus(); queue.remove(itemId); } };
  return <fieldset className={classes("pk-upload-queue", className)} disabled={disabled}>
    <legend className="pk-visually-hidden">{label}</legend>
    <FileInput ref={picker} label={label} hint={hint} files={items.map(item => item.file)} onFilesSelected={select}
      {...(accept === undefined ? {} : { accept })} {...(maxBytes === undefined ? {} : { maxBytes })}
      {...(name === undefined ? {} : { name })} {...(form === undefined ? {} : { form })} {...(id === undefined ? {} : { id })} />
    {rejected.length ? <ul className="pk-file-errors" role="alert">{rejected.map((rejection, index) => <li key={index}>{rejection.message}</li>)}</ul> : null}
    <div className="pk-upload-summary"><p role="status" aria-atomic="true">{items.length ? summary : emptyMessage}</p><div className="pk-upload-actions">
      {queued ? <Button variant="outline" size="sm" onClick={() => { picker.current?.focus(); queue.start(); }}>Start queued files</Button> : null}
      {active || queued ? <Button variant="ghost" size="sm" onClick={() => { picker.current?.focus(); queue.cancelAll(); }}>Cancel pending</Button> : null}
      {complete ? <Button variant="ghost" size="sm" onClick={() => { picker.current?.focus(); queue.clearCompleted(); }}>Clear completed</Button> : null}
    </div></div>
    {items.length ? <ul className="pk-upload-list" aria-label="Upload queue">{items.map(item => <UploadQueueRow key={item.id} item={item} queue={rowQueue} showPreview={showPreviews} locale={locale} />)}</ul> : null}
  </fieldset>;
}
