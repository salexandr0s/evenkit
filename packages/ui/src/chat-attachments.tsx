"use client";

import { useState, type ReactNode } from "react";
import { FileRow } from "./data-workflows.js";
import { Thumbnail } from "./image.js";
import { safeChatAttachmentUrl } from "./rich-chat-urls.js";
import type { UploadQueueProps } from "./upload-queue.js";

/** The host snapshots completed uploads into a message and owns URL lifetimes. */
export interface ChatAttachment {
  id: string;
  name: string;
  sizeBytes?: number;
  mediaType?: string;
  href?: string;
  downloadHref?: string;
  /** A host-authorized image preview. Only image media types display a thumbnail. */
  previewUrl?: string;
  unavailable?: boolean;
  description?: string;
}

/** Upload transport, permission checks and completed-file persistence belong to the host. */
export interface ChatComposerAttachments extends Omit<UploadQueueProps, "label"> {
  label?: ReactNode;
  /** Explains why a draft containing pending, failed or cancelled files cannot send. */
  pendingMessage?: string;
}

export interface ChatAttachmentsProps {
  attachments: readonly ChatAttachment[];
  label?: string;
  unavailableLabel?: string;
  previewUnavailableLabel?: string;
  locale?: string;
}

function AttachmentRow({ attachment, unavailableLabel, previewUnavailableLabel, locale }: {
  attachment: ChatAttachment;
  unavailableLabel: string;
  previewUnavailableLabel: string;
  locale: string | undefined;
}) {
  const [failedPreview, setFailedPreview] = useState<string>();
  const href = safeChatAttachmentUrl(attachment.href);
  const downloadHref = safeChatAttachmentUrl(attachment.downloadHref);
  const unavailable = attachment.unavailable || (!href && !downloadHref);
  const previewUrl = !unavailable && attachment.mediaType?.startsWith("image/")
    ? safeChatAttachmentUrl(attachment.previewUrl) : undefined;
  const previewFailed = previewUrl !== undefined && failedPreview === previewUrl;
  const message = [attachment.description, unavailable ? unavailableLabel : previewFailed ? previewUnavailableLabel : undefined].filter(Boolean).join(" ");

  return <FileRow name={attachment.name} data-unavailable={unavailable || undefined}
    {...(attachment.sizeBytes === undefined ? {} : { sizeBytes: attachment.sizeBytes })}
    {...(attachment.mediaType === undefined ? {} : { fileType: attachment.mediaType })}
    {...(locale === undefined ? {} : { locale })}
    {...(unavailable || href === undefined ? {} : { href })}
    {...(unavailable || downloadHref === undefined ? {} : { downloadHref })}
    message={message || undefined}
    preview={previewUrl ? <Thumbnail src={previewUrl} alt="" size="sm" referrerPolicy="no-referrer"
      onError={() => setFailedPreview(previewUrl)} onLoad={() => setFailedPreview(undefined)} /> : undefined} />;
}

/** Read-only message files. The host must omit links and previews the viewer cannot access. */
export function ChatAttachments({ attachments, label = "Attachments", unavailableLabel = "Attachment unavailable", previewUnavailableLabel = "Preview unavailable", locale }: ChatAttachmentsProps) {
  if (attachments.length === 0) return null;
  return <ul className="pk-chat-attachments" role="list" aria-label={label}>
    {attachments.map(attachment => <AttachmentRow key={attachment.id} attachment={attachment}
      unavailableLabel={unavailableLabel} previewUnavailableLabel={previewUnavailableLabel} locale={locale} />)}
  </ul>;
}
