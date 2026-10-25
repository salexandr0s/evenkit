"use client";

import { useCallback, useRef } from "react";
import type { DocumentFile, DocumentLibraryLoad } from "@evenkit/ui";
import { DocumentLibraryBlock, type DocumentLibraryBlockProps } from "../../blocks/document-library";
import { documentPage, validateDemoUpload } from "../../lib/demo-documents";
import { useStarter } from "../starter-providers";

export function DocumentsView() {
  const { workspaceId, data, request, updateDocuments, createFileUrl } = useStarter();
  const documents = useRef(data.documents);
  documents.current = data.documents;
  const load: DocumentLibraryLoad = useCallback(async (query, { signal }) => {
    await request(signal);
    signal.throwIfAborted();
    return documentPage(documents.current, query);
  }, [request, workspaceId]);

  const upload: NonNullable<DocumentLibraryBlockProps["upload"]> = async (file, context) => {
    const text = await validateDemoUpload(file);
    context.signal.throwIfAborted();
    context.onProgress(15);
    await request(context.signal);
    context.signal.throwIfAborted();
    if (context.folderId !== null && !documents.current.some(document => !document.trashed && document.entry.id === context.folderId && document.entry.kind === "folder")) throw new Error("The destination folder is no longer available.");
    const url = createFileUrl(file);
    const entry: DocumentFile = {
      id: `${workspaceId}-${crypto.randomUUID()}`, kind: "file", name: file.name, mimeType: file.type, sizeBytes: file.size,
      preview: text !== undefined ? { status: "ready", text } : file.type.startsWith("image/") ? { status: "ready", url } : { status: "unavailable", message: "PDF files can be opened or downloaded. They are not embedded in this demo." },
      openHref: url, downloadHref: url,
    };
    updateDocuments(current => [...current, { entry, parentId: context.folderId, trashed: false }], context.signal);
    context.onProgress(100);
    return { href: url, downloadHref: url };
  };

  const remove: NonNullable<DocumentLibraryBlockProps["onRemove"]> = async (ids, { signal, folderId }) => {
    await request(signal);
    signal.throwIfAborted();
    if (!ids.length || ids.some(id => !documents.current.some(document => document.entry.id === id && document.parentId === folderId && !document.trashed))) throw new Error("Some selected items changed. Refresh documents and review your selection.");
    updateDocuments(current => current.map(document => ids.includes(document.entry.id) ? { ...document, trashed: true } : document), signal);
  };
  const restore: NonNullable<DocumentLibraryBlockProps["onRestore"]> = async (ids, { signal, folderId }) => {
    await request(signal);
    signal.throwIfAborted();
    if (ids.some(id => !documents.current.some(document => document.entry.id === id && document.parentId === folderId && document.trashed))) throw new Error("These removed items are no longer available to restore.");
    updateDocuments(current => current.map(document => ids.includes(document.entry.id) ? { ...document, trashed: false } : document), signal);
  };

  return <div className="starter-stack"><p className="starter-muted">Files stay in this tab. Uploads are never sent to a server; reloading clears them.</p><DocumentLibraryBlock scopeKey={`${workspaceId}:demo-user:documents-v1`} load={load} upload={upload} onRemove={remove} onRestore={restore} /></div>;
}
