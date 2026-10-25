"use client";

import { useCallback, useId, useLayoutEffect, useRef, type RefObject } from "react";
import { Button } from "./button.js";
import type { ChatComposerAttachments } from "./chat-attachments.js";
import { Textarea } from "./field.js";
import { ArrowUpIcon, SquareIcon } from "./icons.js";
import type { ChatLabels, ChatStatus } from "./chat-types.js";
import { safeChatAttachmentUrl } from "./rich-chat-urls.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";
import { UploadQueue } from "./upload-queue.js";

interface ChatComposerProps {
  value: string;
  onValueChange: (value: string) => void;
  onSend: (message: string) => void;
  onStop?: (() => void) | undefined;
  status: ChatStatus;
  labels: ChatLabels;
  maxLength: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  attachments?: ChatComposerAttachments | undefined;
}

export function ChatComposer({ value, onValueChange, onSend, onStop, status, labels, maxLength, textareaRef, attachments }: ChatComposerProps) {
  const id = useId();
  const composing = useRef(false);
  const submitted = useRef(false);
  const busy = status === "submitted" || status === "streaming";
  const overLimit = value.length > maxLength;
  const files = attachments?.queue.items ?? [];
  const pendingAttachments = files.some(file => file.state !== "complete");
  const canSend = !busy && !overLimit && !pendingAttachments && (value.trim().length > 0 || files.length > 0);
  const { label: attachmentLabel = "Attachments", pendingMessage = "Finish uploading, retry or remove files before sending.", ...uploadProps } = attachments ?? {};
  const uploadQueue = attachments ? { ...attachments.queue, items: files.map(item => {
    if (!item.result) return item;
    const href = safeChatAttachmentUrl(item.result.href);
    const downloadHref = safeChatAttachmentUrl(item.result.downloadHref);
    return { ...item, result: { ...(href ? { href } : {}), ...(downloadHref ? { downloadHref } : {}) } };
  }) } : undefined;
  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || textarea.getBoundingClientRect().width === 0) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + textarea.offsetHeight - textarea.clientHeight}px`;
  }, [textareaRef]);
  useLayoutEffect(resizeTextarea, [value, resizeTextarea]);
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    let previousWidth = textarea.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const width = textarea.getBoundingClientRect().width;
      if (width !== previousWidth) { previousWidth = width; resizeTextarea(); }
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [resizeTextarea, textareaRef]);

  function send() {
    if (!canSend || submitted.current || composing.current) return;
    submitted.current = true;
    try { onSend(value.trim()); } finally { queueMicrotask(() => { submitted.current = false; }); }
    textareaRef.current?.focus();
  }

  return <form className="pk-chat-composer" onSubmit={event => { event.preventDefault(); send(); }}>
    {attachments && uploadQueue && <div className="pk-chat-composer-attachments" role="region" aria-label={typeof attachmentLabel === "string" ? attachmentLabel : "Attachments"} tabIndex={0}>
      <UploadQueue {...uploadProps} queue={uploadQueue} label={attachmentLabel} disabled={busy || Boolean(attachments.disabled)} />
    </div>}
    {pendingAttachments && <p id={`${id}-attachments`} className="pk-chat-attachments-pending" role="status">{pendingMessage}</p>}
    <label className="pk-chat-visually-hidden" htmlFor={id}>{labels.message}</label>
    <div className="pk-chat-composer-field">
      <Textarea id={id} ref={textareaRef} rows={1} value={value} maxLength={maxLength} placeholder={labels.placeholder}
        aria-describedby={`${id}-hint${value.length >= maxLength ? ` ${id}-limit` : ""}${pendingAttachments ? ` ${id}-attachments` : ""}`} aria-invalid={overLimit || undefined}
        onChange={event => onValueChange(event.target.value)}
        onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }}
        onKeyDown={event => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229 && !composing.current) {
            event.preventDefault(); send();
          }
        }} />
      {busy ? <Tooltip key="stop">
        <TooltipTrigger asChild><Button shape="icon" aria-label={labels.stop} disabled={!onStop} onClick={event => { event.preventDefault(); onStop?.(); textareaRef.current?.focus(); }}><SquareIcon size="sm" /></Button></TooltipTrigger>
        <TooltipContent>{labels.stop}</TooltipContent>
      </Tooltip> : <Tooltip key="send">
        <TooltipTrigger asChild><Button type="submit" shape="icon" aria-label={labels.send} disabled={!canSend}><ArrowUpIcon /></Button></TooltipTrigger>
        <TooltipContent>{labels.send}</TooltipContent>
      </Tooltip>}
    </div>
    <div className="pk-chat-composer-meta">
      <span id={`${id}-hint`}>{labels.composerHint}</span>
      {value.length >= maxLength && <span id={`${id}-limit`} role="status">{labels.characterLimit} ({maxLength})</span>}
    </div>
  </form>;
}
