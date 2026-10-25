"use client";

import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from "react";
import { Button, ButtonLink } from "./button.js";
import { classes } from "./classes.js";
import { DownloadIcon, ExternalLinkIcon, FileTextIcon, RotateCcwIcon, TrashIcon, UploadIcon, XIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

export interface SemanticTableProps extends ComponentPropsWithoutRef<"table"> { density?: "default" | "compact" }
export const SemanticTable = forwardRef<HTMLTableElement, SemanticTableProps>(function SemanticTable({ className, density = "default", ...props }, ref) {
  return <table {...props} ref={ref} className={classes("pk-table", className)} data-density={density} />;
});
export const TableHeader = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<"thead">>(function TableHeader({ className, ...props }, ref) { return <thead {...props} ref={ref} className={classes("pk-table-header", className)} />; });
export const TableBody = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<"tbody">>(function TableBody({ className, ...props }, ref) { return <tbody {...props} ref={ref} className={classes("pk-table-body", className)} />; });
export const TableFooter = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<"tfoot">>(function TableFooter({ className, ...props }, ref) { return <tfoot {...props} ref={ref} className={classes("pk-table-footer", className)} />; });
export const TableRow = forwardRef<HTMLTableRowElement, ComponentPropsWithoutRef<"tr">>(function TableRow({ className, ...props }, ref) { return <tr {...props} ref={ref} className={classes("pk-table-row", className)} />; });
export interface TableHeadProps extends Omit<ComponentPropsWithoutRef<"th">, "align"> { align?: "start" | "end" | "center" }
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead({ className, align = "start", scope = "col", ...props }, ref) { return <th {...props} scope={scope} ref={ref} className={classes("pk-table-head", className)} data-align={align} />; });
export interface TableCellProps extends Omit<ComponentPropsWithoutRef<"td">, "align"> { align?: "start" | "end" | "center" }
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ className, align = "start", ...props }, ref) { return <td {...props} ref={ref} className={classes("pk-table-cell", className)} data-align={align} />; });
export const TableCaption = forwardRef<HTMLTableCaptionElement, ComponentPropsWithoutRef<"caption">>(function TableCaption({ className, ...props }, ref) { return <caption {...props} ref={ref} className={classes("pk-table-caption", className)} />; });
export interface TableScrollRegionProps extends ComponentPropsWithoutRef<"div"> { label: string }
export const TableScrollRegion = forwardRef<HTMLDivElement, TableScrollRegionProps>(function TableScrollRegion({ className, label, tabIndex = 0, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-table-region", className)} role="region" aria-label={label} tabIndex={tabIndex} />;
});

export interface FilterBarProps extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit" | "onReset"> {
  onApply: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  dirty?: boolean;
  busy?: boolean;
  status?: ReactNode;
  applyLabel?: string;
  clearLabel?: string;
}
export const FilterBar = forwardRef<HTMLFormElement, FilterBarProps>(function FilterBar({ className, onApply, onClear, dirty = false, busy = false, status, applyLabel = "Apply filters", clearLabel = "Reset filters", children, ...props }, ref) {
  const statusId = useId();
  return <form {...props} ref={ref} className={classes("pk-filter-bar", className)} aria-busy={busy || undefined} onSubmit={event => { event.preventDefault(); if (!busy) onApply(event); }} onReset={event => { event.preventDefault(); onClear(); }}>
    <div className="pk-filter-fields">{children}</div>
    <div className="pk-filter-actions"><Button type="submit" className="pk-filter-apply" aria-disabled={busy || undefined} aria-describedby={statusId}>{applyLabel}</Button><Button type="reset" variant="outline">{clearLabel}</Button></div>
    <p className="pk-filter-status" id={statusId} role="status">{dirty ? "Changes not applied. Apply filters to update results." : busy ? "Updating results…" : status ?? "Showing all results."}</p>
  </form>;
});

export interface AppliedFilter { id: string; label: string }
export interface AppliedFiltersProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  filters: readonly AppliedFilter[];
  onRemove: (id: string) => void;
  onClear: () => void;
  clearLabel?: string;
  emptyLabel?: string;
}
export const AppliedFilters = forwardRef<HTMLDivElement, AppliedFiltersProps>(function AppliedFilters({ filters, onRemove, onClear, clearLabel = "Clear all filters", emptyLabel = "No active filters.", className, ...props }, forwardedRef) {
  const root = useRef<HTMLDivElement>(null);
  const empty = useRef<HTMLParagraphElement>(null);
  const pendingFocus = useRef<{ id: string | null; index: number; trigger: HTMLButtonElement } | null>(null);
  useEffect(() => {
    const document = root.current?.ownerDocument;
    if (!document) return;
    const relinquish = (event: FocusEvent) => {
      const pending = pendingFocus.current;
      if (!pending) return;
      if (event.type === "focusin" && event.target !== pending.trigger && event.target !== document.body && event.target !== document.documentElement) pendingFocus.current = null;
      if (event.type === "focusout" && event.target === pending.trigger) {
        // A removal can blur before the node is detached. Decide after the
        // commit so that fallback body focus does not cancel recovery.
        queueMicrotask(() => {
          if (pendingFocus.current === pending && pending.trigger.isConnected && document.activeElement !== pending.trigger) pendingFocus.current = null;
        });
      }
    };
    const pointer = (event: PointerEvent) => {
      const pending = pendingFocus.current;
      if (pending && event.target instanceof Node && !pending.trigger.contains(event.target)) pendingFocus.current = null;
    };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab") pendingFocus.current = null; };
    const blur = () => { pendingFocus.current = null; };
    document.addEventListener("focusin", relinquish);
    document.addEventListener("focusout", relinquish);
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("keydown", keyboard, true);
    document.defaultView?.addEventListener("blur", blur);
    return () => { document.removeEventListener("focusin", relinquish); document.removeEventListener("focusout", relinquish); document.removeEventListener("pointerdown", pointer, true); document.removeEventListener("keydown", keyboard, true); document.defaultView?.removeEventListener("blur", blur); pendingFocus.current = null; };
  }, []);
  useLayoutEffect(() => {
    const pending = pendingFocus.current;
    if (!pending || (pending.id === null ? filters.length > 0 : filters.some(filter => filter.id === pending.id))) return;
    pendingFocus.current = null;
    const document = root.current?.ownerDocument;
    if (!document) return;
    const active = document.activeElement;
    if (active !== pending.trigger && (pending.trigger.isConnected || (active !== document.body && active !== null))) return;
    const buttons = root.current?.querySelectorAll<HTMLButtonElement>("[data-filter-remove]");
    (buttons?.[Math.min(pending.index, buttons.length - 1)] ?? empty.current)?.focus();
  });
  function retainFocus(trigger: HTMLButtonElement, index: number, id: string | null) {
    pendingFocus.current = trigger.ownerDocument.activeElement === trigger ? { id, index, trigger } : null;
  }
  return <div {...props} ref={node => { root.current = node; if (typeof forwardedRef === "function") return forwardedRef(node); if (forwardedRef) forwardedRef.current = node; }} className={classes("pk-applied-filters", className)} role="group" aria-label={props["aria-label"] ?? "Applied filters"}>
    <p ref={empty} className="pk-filter-status" role="status" tabIndex={-1}>{filters.length ? `${filters.length} active ${filters.length === 1 ? "filter" : "filters"}.` : emptyLabel}</p>
    {filters.map((filter, index) => <Button key={filter.id} size="sm" variant="outline" data-filter-remove="" aria-label={`Remove filter: ${filter.label}`} onClick={event => { retainFocus(event.currentTarget, index, filter.id); onRemove(filter.id); }}>{filter.label}<span aria-hidden="true">×</span></Button>)}
    {filters.length > 0 ? <Button size="sm" variant="ghost" onClick={event => { retainFocus(event.currentTarget, 0, null); onClear(); }}>{clearLabel}</Button> : null}
  </div>;
});

export type FileRejectionCode = "type" | "size" | "count";
export interface FileRejection { file: File; code: FileRejectionCode; message: string }
export interface FileSelection { accepted: readonly File[]; rejected: readonly FileRejection[] }
export interface FileInputProps extends Omit<ComponentPropsWithoutRef<"input">, "type" | "onChange" | "children" | "size"> {
  label: ReactNode;
  hint?: ReactNode;
  maxBytes?: number;
  maxFiles?: number;
  existingCount?: number;
  /** Controlled files are reflected in native FormData and picker-cancellation recovery. */
  files?: readonly File[];
  onFilesSelected: (selection: FileSelection) => void;
  chooseLabel?: string;
  onPickerCancel?: () => void;
}
function acceptsFile(file: File, accept: string | undefined) {
  if (!accept?.trim()) return true;
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();
  const tokens = accept.split(",").map(token => token.trim().toLowerCase()).filter(Boolean);
  return tokens.length === 0 || tokens.some(token => token.startsWith(".") ? name.endsWith(token) : token.endsWith("/*") ? mime.startsWith(token.slice(0, -1)) : mime === token);
}
function writeFiles(input: HTMLInputElement | null, files: readonly File[]) {
  if (!input) return;
  if (typeof DataTransfer === "function") {
    const transfer = new DataTransfer();
    files.forEach(file => transfer.items.add(file));
    input.files = transfer.files;
  } else if (files.length === 0) input.value = "";
}
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput({ label, hint, maxBytes, maxFiles, existingCount, files: controlledFiles, onFilesSelected, chooseLabel = "Choose files or drop them here", onPickerCancel, className, id, accept, multiple = true, disabled, onClick, "aria-describedby": externalDescription, ...props }, forwardedRef) {
  const generated = useId();
  const controlId = id ?? `pk-files-${generated}`;
  const input = useRef<HTMLInputElement>(null);
  const retained = useRef<readonly File[]>([]);
  const controlled = useRef(controlledFiles);
  const [errors, setErrors] = useState<readonly FileRejection[]>([]);
  const [dragging, setDragging] = useState(false);
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const describedBy = [...new Set([...(externalDescription?.split(/\s+/).filter(Boolean) ?? []), ...(hint ? [hintId] : []), ...(errors.length ? [errorId] : [])])].join(" ") || undefined;
  useLayoutEffect(() => {
    controlled.current = controlledFiles;
    if (controlledFiles !== undefined) { retained.current = controlledFiles; writeFiles(input.current, controlledFiles); }
  }, [controlledFiles]);
  useEffect(() => {
    const node = input.current;
    if (!node) return;
    const cancel = () => { writeFiles(node, retained.current); onPickerCancel?.(); };
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) { retained.current = controlled.current ?? []; writeFiles(node, retained.current); setErrors([]); } });
    const form = node.form;
    node.addEventListener("cancel", cancel);
    form?.addEventListener("reset", reset);
    return () => { node.removeEventListener("cancel", cancel); form?.removeEventListener("reset", reset); };
  }, [onPickerCancel, props.form]);
  function select(files: readonly File[]) {
    if (disabled || input.current?.matches(":disabled")) return;
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    const currentCount = existingCount ?? (multiple ? controlledFiles?.length ?? 0 : 0);
    const limit = Math.max(0, Math.min(multiple ? Infinity : 1, maxFiles ?? Infinity) - Math.max(0, currentCount));
    for (const file of files) {
      if (!acceptsFile(file, accept)) rejected.push({ file, code: "type", message: `${file.name}: this file type is not accepted.` });
      else if (maxBytes !== undefined && file.size > maxBytes) rejected.push({ file, code: "size", message: `${file.name}: the file exceeds the size limit.` });
      else if (accepted.length >= limit) rejected.push({ file, code: "count", message: `${file.name}: the file count limit has been reached.` });
      else accepted.push(file);
    }
    retained.current = controlledFiles ?? accepted;
    writeFiles(input.current, retained.current);
    setErrors(rejected);
    onFilesSelected({ accepted, rejected });
  }
  return <div className={classes("pk-file-input", className)} data-disabled={disabled || undefined}>
    <label className="pk-label" id={`${controlId}-label`} htmlFor={controlId}>{label}</label>
    <label className="pk-file-dropzone" htmlFor={controlId} data-dragging={dragging || undefined} onDragOver={event => { event.preventDefault(); if (!disabled && !input.current?.matches(":disabled") && event.dataTransfer.types.includes("Files")) setDragging(true); }} onDragLeave={event => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setDragging(false); }} onDrop={event => { event.preventDefault(); setDragging(false); if (!disabled) select(Array.from(event.dataTransfer.files)); }}>
      <UploadIcon /><span>{chooseLabel}</span>
      <input {...props} ref={node => { input.current = node; if (typeof forwardedRef === "function") return forwardedRef(node); if (forwardedRef) forwardedRef.current = node; }} id={controlId} type="file" accept={accept} multiple={multiple} disabled={disabled} aria-labelledby={props["aria-labelledby"] ?? `${controlId}-label`} aria-describedby={describedBy} aria-invalid={errors.length > 0 || props["aria-invalid"]} onChange={event => select(Array.from(event.currentTarget.files ?? []))} onClick={event => { onClick?.(event); if (!event.defaultPrevented) event.currentTarget.value = ""; }} />
    </label>
    {hint ? <div id={hintId} className="pk-field-hint">{hint}</div> : null}
    {errors.length ? <ul id={errorId} className="pk-file-errors" role="alert">{errors.map((error, index) => <li key={`${error.file.name}-${index}`}>{error.message}</li>)}</ul> : null}
  </div>;
});

export type FileRowState = "ready" | "uploading" | "complete" | "error";
export interface FileRowProps extends Omit<ComponentPropsWithoutRef<"li">, "title"> {
  name: string;
  sizeBytes?: number;
  fileType?: string;
  state?: FileRowState;
  progress?: number;
  message?: ReactNode;
  href?: string;
  downloadHref?: string;
  onRemove?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
  locale?: string;
}
export const FileRow = forwardRef<HTMLLIElement, FileRowProps>(function FileRow({ className, name, sizeBytes, fileType, state = "ready", progress, message, href, downloadHref, onRemove, onRetry, onCancel, locale, ...props }, ref) {
  const formattedSize = sizeBytes === undefined ? undefined : sizeBytes < 1024 ? `${new Intl.NumberFormat(locale).format(sizeBytes)} B` : `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(sizeBytes / 1024)} KB`;
  const stateLabel = { ready: "Ready", uploading: "Uploading", complete: "Complete", error: "Failed" }[state];
  return <li {...props} ref={ref} className={classes("pk-file-row", className)} data-state={state}>
    <FileTextIcon /><div className="pk-file-row-content"><span className="pk-file-name">{name}</span><span className="pk-file-metadata">{[fileType, formattedSize, stateLabel].filter(Boolean).join(" · ")}</span>{message ? <span className="pk-file-message" role={state === "error" ? "alert" : "status"}>{message}</span> : null}{state === "uploading" ? <progress aria-label={`Upload progress for ${name}`} max={100} {...(progress === undefined ? {} : { value: Math.min(100, Math.max(0, progress)) })} /> : null}</div>
    <TooltipProvider><div className="pk-file-actions">
      {href ? <Tooltip><TooltipTrigger asChild><ButtonLink href={href} size="sm" variant="ghost" shape="icon" aria-label={`Open ${name}`}><ExternalLinkIcon size="sm" /></ButtonLink></TooltipTrigger><TooltipContent>{`Open ${name}`}</TooltipContent></Tooltip> : null}
      {downloadHref ? <Tooltip><TooltipTrigger asChild><ButtonLink href={downloadHref} download={name} size="sm" variant="ghost" shape="icon" aria-label={`Download ${name}`}><DownloadIcon size="sm" /></ButtonLink></TooltipTrigger><TooltipContent>{`Download ${name}`}</TooltipContent></Tooltip> : null}
      {state === "error" && onRetry ? <Tooltip><TooltipTrigger asChild><Button size="sm" variant="outline" shape="icon" aria-label={`Retry ${name}`} onClick={onRetry}><RotateCcwIcon size="sm" /></Button></TooltipTrigger><TooltipContent>{`Retry ${name}`}</TooltipContent></Tooltip> : null}
      {state === "uploading" && onCancel ? <Tooltip><TooltipTrigger asChild><Button size="sm" variant="outline" shape="icon" aria-label={`Cancel ${name}`} onClick={onCancel}><XIcon size="sm" /></Button></TooltipTrigger><TooltipContent>{`Cancel ${name}`}</TooltipContent></Tooltip> : onRemove ? <Tooltip><TooltipTrigger asChild><Button size="sm" variant="ghost" shape="icon" aria-label={`Remove ${name}`} onClick={onRemove}><TrashIcon size="sm" /></Button></TooltipTrigger><TooltipContent>{`Remove ${name}`}</TooltipContent></Tooltip> : null}
    </div></TooltipProvider>
  </li>;
});
