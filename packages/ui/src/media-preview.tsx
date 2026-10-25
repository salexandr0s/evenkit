"use client";

import { useRef, type RefObject } from "react";
import { Button, ButtonLink } from "./button.js";
import { classes } from "./classes.js";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog.js";
import { EmptyState, Spinner } from "./feedback.js";
import { DownloadIcon, ExternalLinkIcon, FileTextIcon, RotateCcwIcon } from "./icons.js";
import { Image } from "./image.js";
import { mediaHref, mediaPreviewKind } from "./media-preview-utils.js";

export type MediaPreview =
  | { status: "ready"; url: string }
  | { status: "ready"; text: string }
  | { status: "loading" | "expired" | "unavailable"; message?: string };

export interface MediaFile {
  /** Stable application identity, independent of the filename or signed URL. */
  id: string;
  name: string;
  mimeType: string;
  preview?: MediaPreview;
  /** Application-authorized destinations. Supply fresh URLs for each action. */
  openHref?: string;
  downloadHref?: string;
}

export interface FilePreviewProps {
  file: MediaFile;
  /** The application refreshes access and publishes a new preview state. */
  onRefresh?: (file: MediaFile) => void;
  showActions?: boolean;
  className?: string;
}

const textLimit = 100_000;

function FileActions({ file }: { file: MediaFile }) {
  const open = mediaHref(file.openHref);
  const download = mediaHref(file.downloadHref);
  if (!open && !download) return null;
  return <div className="pk-file-preview-actions">
    {open ? <ButtonLink href={open} target="_blank" rel="noopener noreferrer" variant="outline" startIcon={<ExternalLinkIcon />} aria-label={`Open ${file.name} in a new tab`}>Open file</ButtonLink> : null}
    {download ? <ButtonLink href={download} download={file.name} variant="outline" startIcon={<DownloadIcon />} aria-label={`Download ${file.name}`}>Download</ButtonLink> : null}
  </div>;
}

/** Images and escaped plain text only. Files are never fetched or embedded as documents. */
export function FilePreview({ file, onRefresh, showActions = true, className }: FilePreviewProps) {
  const frame = useRef<HTMLElement | null>(null);
  const kind = mediaPreviewKind(file.mimeType);
  const preview = file.preview;
  const url = preview?.status === "ready" && "url" in preview ? mediaHref(preview.url) : undefined;
  const text = preview?.status === "ready" && "text" in preview ? preview.text : undefined;
  const hasPreview = kind === "image" ? Boolean(url) : kind === "text" && text !== undefined;
  const state = preview?.status === "ready" ? hasPreview ? "ready" : "unavailable" : preview?.status ?? "unavailable";
  const hasActions = Boolean(mediaHref(file.openHref) || mediaHref(file.downloadHref));
  const message = preview && "message" in preview && preview.message
    ? preview.message
    : state === "expired" ? "Preview access has expired. Request a fresh preview to continue."
      : kind === "unsupported" ? "This file type has no inline preview."
        : "This preview is unavailable. The file may have moved or access may have changed.";
  function refresh() { frame.current?.focus({ preventScroll: true }); onRefresh?.(file); }
  return <section ref={frame} tabIndex={-1} className={classes("pk-file-preview", className)} aria-label={`Preview of ${file.name}`} data-state={state}>
    {state === "loading" ? <div className="pk-file-preview-placeholder" role="status"><Spinner aria-hidden="true" /><span>{preview?.status === "loading" && preview.message ? preview.message : `Loading preview for ${file.name}…`}</span></div>
      : state === "ready" && kind === "image" && url ? <Image key={`${file.id}:${url}`} src={url} alt={file.name} fit="contain" loading="eager" fallback="Image unavailable. Open or download the file, or try again." retryLabel={`Retry preview of ${file.name}`} {...(onRefresh ? { onRetry: refresh } : {})} />
        : state === "ready" && kind === "text" && text !== undefined ? <div className="pk-file-preview-text"><pre tabIndex={0} role="region" aria-label={`Text content of ${file.name}`}>{text.slice(0, textLimit)}</pre>{text.length > textLimit ? <p>Showing the first {textLimit.toLocaleString("en")} characters. Open or download the file to read the rest.</p> : null}</div>
          : <EmptyState size="sm" icon={<FileTextIcon />} title={state === "expired" ? "Preview expired" : kind === "unsupported" ? "Preview not supported" : "Preview unavailable"} description={<><p>{message}</p><p>{hasActions ? showActions ? "Open or download the file below." : "Open the file preview for available actions." : "Ask the file owner for access or a download link."}</p></>} action={onRefresh && kind !== "unsupported" ? <Button variant="outline" onClick={refresh} startIcon={<RotateCcwIcon />} aria-label={`Refresh preview of ${file.name}`}>Refresh preview</Button> : undefined} />}
    {showActions ? <FileActions file={file} /> : null}
  </section>;
}

export interface FileLightboxProps {
  file: MediaFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: (file: MediaFile) => void;
  /** Focusable fallback when the original launcher is removed. */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function FileLightbox({ file, open, onOpenChange, onRefresh, returnFocusRef }: FileLightboxProps) {
  const launcher = useRef<HTMLElement | null>(null);
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent size="lg" scroll="body" className="pk-file-lightbox" closeLabel="Close file preview" onOpenAutoFocus={() => {
      launcher.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
    }} onCloseAutoFocus={event => {
      for (const target of [launcher.current, returnFocusRef?.current]) {
        if (!target?.isConnected) continue;
        target.focus({ preventScroll: true });
        if (target.ownerDocument.activeElement === target) { event.preventDefault(); break; }
      }
    }}>
      <DialogHeader><DialogTitle>{file?.name ?? "File preview"}</DialogTitle><DialogDescription>{file ? "File preview and download options." : "This file is no longer in the current view."}</DialogDescription></DialogHeader>
      <DialogBody>{file ? <FilePreview file={file} {...(onRefresh ? { onRefresh } : {})} /> : <EmptyState size="sm" title="File unavailable" description="Close this preview and choose another file." />}</DialogBody>
      <DialogFooter><DialogClose asChild><Button variant="outline">Close preview</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>;
}

export { mediaHref, mediaPreviewKind, mediaPreviewTypes } from "./media-preview-utils.js";
