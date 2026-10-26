"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { Avatar, Button, FileInput, FileRow, FormSection, Image, RotateCcwIcon, SaveStatus, TrashIcon, Undo2Icon, formatFileSize } from "@evenkit/ui";

export const avatarImageTypes = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"] as const;
export type AvatarImageType = typeof avatarImageTypes[number];
export interface AvatarValue {
  /** Stable application asset ID; never use a filename as the identity. */
  id: string;
  name: string;
  mimeType: AvatarImageType;
  src?: string;
  previewState?: "available" | "expired" | "unavailable";
}
export type AvatarSaveChange = { kind: "replace"; file: File } | { kind: "remove" };
export interface AvatarUploadProps {
  ownerId: string;
  name: string;
  value: AvatarValue | null;
  /** Change after an authoritative update, even if the asset ID is unchanged. */
  revision?: string | number;
  kind?: "avatar" | "logo";
  maxBytes?: number;
  disabled?: boolean;
  onSave: (change: AvatarSaveChange, context: { ownerId: string; previous: AvatarValue | null; signal: AbortSignal }) => Promise<AvatarValue | null>;
  onSaved?: (value: AvatarValue | null) => void;
  /** Refresh application-owned URLs by updating value. */
  onRefreshPreview?: () => void;
}

/** Copy this block into your app. Your save callback owns validation and transfers. */
export function AvatarUpload(props: AvatarUploadProps) {
  const root = useRef<HTMLDivElement>(null);
  const focused = useRef(false);
  const acknowledgement = useRef<{ key: string; message: string } | null>(null);
  const key = identity(props.ownerId, props.revision, props.value);
  useLayoutEffect(() => {
    if (acknowledgement.current?.key !== key) acknowledgement.current = null;
    if (focused.current) root.current?.querySelector<HTMLInputElement>('input[type="file"]')?.focus();
  }, [key]);
  return <div ref={root} onFocusCapture={() => { focused.current = true; }} onBlurCapture={event => { focused.current = event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget); }}><AvatarUploadForm key={key} {...props}
    savedMessage={acknowledgement.current?.key === key ? acknowledgement.current.message : ""}
    onSaved={next => {
      acknowledgement.current = { key: identity(props.ownerId, props.revision, next), message: `${props.kind === "logo" ? "Logo" : "Avatar"} ${next ? "saved" : "removed"}.` };
      props.onSaved?.(next);
    }} /></div>;
}

function identity(ownerId: string, revision: AvatarUploadProps["revision"], value: AvatarValue | null) {
  return JSON.stringify([ownerId, revision, value?.id, value?.name, value?.mimeType, value?.src, value?.previewState]);
}

function useLocalPreview(file: File | null) {
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  useEffect(() => {
    if (!file) return;
    let url: string;
    try { url = URL.createObjectURL(file); }
    catch { return; }
    setPreview({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return preview?.file === file ? preview.url : undefined;
}

function AvatarUploadForm({ ownerId, name, value, kind = "avatar", maxBytes = 5 * 1024 * 1024, disabled = false, onSave, onSaved, onRefreshPreview, savedMessage }: AvatarUploadProps & { savedMessage: string }) {
  const [saved, setSaved] = useState(value);
  const [draft, setDraft] = useState<AvatarSaveChange | null>(null);
  const [beforeRemoval, setBeforeRemoval] = useState<AvatarSaveChange | null>(null);
  const [pending, setPending] = useState(false);
  const [pickerRevision, setPickerRevision] = useState(0);
  const [error, setError] = useState("");
  const [note, setNote] = useState(savedMessage);
  const request = useRef<AbortController | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const undo = useRef<HTMLButtonElement>(null);
  const focusAfterChange = useRef<"picker" | "undo" | null>(null);
  const file = draft?.kind === "replace" ? draft.file : beforeRemoval?.kind === "replace" ? beforeRemoval.file : null;
  const localPreview = useLocalPreview(file);
  const removed = draft?.kind === "remove";
  const dirty = Boolean(draft && (!removed || saved));
  const selected = draft?.kind === "replace" ? draft.file : null;
  const current = removed ? null : saved;
  const src = selected ? localPreview : current?.previewState !== "expired" && current?.previewState !== "unavailable" && avatarImageTypes.includes(current?.mimeType as AvatarImageType) ? current?.src : undefined;
  const previewLabel = `${name}: ${selected ? "selected" : "saved"} ${kind}`;
  useLayoutEffect(() => () => { request.current?.abort(); request.current = null; }, []);
  useLayoutEffect(() => {
    if (pending) cancel.current?.focus();
    else if (focusAfterChange.current) {
      (focusAfterChange.current === "undo" ? undo.current : picker.current)?.focus();
      focusAfterChange.current = null;
    }
  }, [pending, draft]);

  function clearFeedback() { setError(""); setNote(""); }
  function remove() {
    if (pending || disabled || removed) return;
    setBeforeRemoval(draft); setDraft({ kind: "remove" }); setPickerRevision(current => current + 1); clearFeedback(); focusAfterChange.current = "undo";
  }
  function reset() {
    request.current?.abort(); request.current = null;
    setPending(false); setDraft(null); setBeforeRemoval(null); setPickerRevision(current => current + 1); clearFeedback();
    focusAfterChange.current = "picker";
  }
  function cancelSave() {
    request.current?.abort(); request.current = null;
    setPending(false); setNote("Save cancelled. Your changes are still here."); focusAfterChange.current = "picker";
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !dirty || pending || request.current || disabled) return;
    const change = draft;
    const controller = new AbortController();
    let completed: { value: AvatarValue | null } | null = null;
    request.current = controller; setPending(true); clearFeedback();
    try {
      const result = await onSave(change, { ownerId, previous: saved, signal: controller.signal });
      if (controller.signal.aborted || request.current !== controller) return;
      if (change.kind === "remove" ? result !== null : !result?.id || !avatarImageTypes.includes(result.mimeType)) {
        throw new Error("The saved image could not be confirmed. Refresh your account before retrying.");
      }
      setSaved(result); setDraft(null); setBeforeRemoval(null);
      setNote(change.kind === "remove" ? `${kind === "logo" ? "Logo" : "Avatar"} removed.` : `${kind === "logo" ? "Logo" : "Avatar"} saved.`);
      completed = { value: result };
    } catch (failure: unknown) {
      if (controller.signal.aborted || request.current !== controller) return;
      setError(failure instanceof Error ? failure.message : "The image could not be saved. Your changes are still here.");
    } finally {
      if (request.current === controller) { request.current = null; setPending(false); focusAfterChange.current = "picker"; }
    }
    if (completed) onSaved?.(completed.value);
  }
  return <form className="pk-avatar-upload" data-kind={kind} aria-label={`${name} ${kind} settings`} onSubmit={event => { void save(event); }} onReset={event => { event.preventDefault(); reset(); }}>
    <FormSection className="pk-avatar-upload-section" heading={kind === "logo" ? "Workspace logo" : "Profile image"} description="Choose an image, then save your changes.">
      <div className="pk-avatar-upload-editor">
        <figure className="pk-avatar-upload-stage" data-changed={Boolean(draft) || undefined}>
          <div className="pk-avatar-upload-visual">
            {src ? <Image className="pk-avatar-upload-image" src={src} alt={previewLabel} aspectRatio={1} fit={kind === "logo" ? "contain" : "cover"} loading="eager" retryable={false} fallback={`${kind === "logo" ? "Logo" : "Avatar"} preview unavailable`} /> : <Avatar name={name} size="lg" aria-label={`${name}: ${removed ? "image marked for removal" : "image preview unavailable; showing initials"}`} />}
          </div>
          <figcaption>{removed ? "Removal preview" : selected ? `Selected ${kind}` : saved ? `Current ${kind}` : "Initials preview"}</figcaption>
        </figure>
        <div className="pk-avatar-upload-content">
          <div className="pk-avatar-upload-copy"><strong>{name}</strong><p>{removed ? saved ? "The saved image will be removed when you save." : "Selected image removed. Undo to restore it." : selected ? "Selected image. Save to apply it." : saved?.previewState === "expired" ? "This preview has expired. Your saved image is unchanged." : saved && !src ? "The saved image is unavailable. You can replace or remove it." : saved ? "Current saved image" : "No image saved. Your initials are shown."}</p></div>
          <FileInput key={pickerRevision} ref={picker} label={`Choose ${kind}`} name={kind} accept={avatarImageTypes.join(",")} multiple={false} maxFiles={1} maxBytes={maxBytes} files={selected ? [selected] : []} disabled={pending || disabled}
            chooseLabel={saved || selected ? `Replace ${kind}` : `Choose ${kind}`}
            hint={`PNG, JPEG, WebP, GIF or AVIF. Up to ${formatFileSize(maxBytes, { base: 1024 })}.`}
            onFilesSelected={({ accepted }) => { const next = accepted[0]; if (next) { setDraft({ kind: "replace", file: next }); setBeforeRemoval(null); clearFeedback(); } }} />
          {selected ? <ul className="pk-avatar-upload-files" aria-label="Selected image"><FileRow name={selected.name} sizeBytes={selected.size} fileType={selected.type} state="ready" message="Ready to save" /></ul> : null}
          <div className="pk-avatar-upload-actions">
            {removed ? <Button ref={undo} size="sm" variant="outline" startIcon={<Undo2Icon size="sm" />} disabled={pending || disabled} onClick={() => { setDraft(beforeRemoval); setBeforeRemoval(null); clearFeedback(); focusAfterChange.current = "picker"; }}>Undo removal</Button> : saved || selected ? <Button size="sm" variant="ghost" startIcon={<TrashIcon size="sm" />} disabled={pending || disabled} onClick={remove}>Remove {kind}</Button> : null}
            {!selected && saved && !removed && onRefreshPreview ? <Button size="sm" variant="ghost" startIcon={<RotateCcwIcon size="sm" />} disabled={pending || disabled} onClick={onRefreshPreview}>Refresh preview</Button> : null}
          </div>
        </div>
      </div>
    </FormSection>
    <footer className="pk-avatar-upload-footer">
      <SaveStatus state={error ? "error" : pending ? "saving" : dirty ? "dirty" : note ? "saved" : "idle"} role={error ? "alert" : "status"}>{error || (pending ? `Saving ${kind}…` : note || (dirty ? removed ? "Removal is not saved yet." : "You have unsaved changes." : "No changes to save."))}</SaveStatus>
      <div className="pk-avatar-upload-save-actions">
        <Button type="reset" variant="ghost" disabled={pending || disabled || !draft}>Reset changes</Button>
        {pending ? <Button ref={cancel} variant="outline" onClick={cancelSave}>Cancel save</Button> : null}
        <Button type="submit" loading={pending} disabled={disabled || (!dirty && !pending)}>{error ? "Retry save" : `Save ${kind}`}</Button>
      </div>
    </footer>
  </form>;
}
