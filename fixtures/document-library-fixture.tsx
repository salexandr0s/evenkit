"use client";

import { useState } from "react";
import { Button, FileLightbox, FilePreview, type DocumentLibraryLoad, type MediaFile } from "@evenkit/ui";
import { AvatarUpload } from "./blocks/avatar-upload";
import { DocumentLibraryBlock } from "./blocks/document-library";

const note: MediaFile = {
  id: "packed-document", name: "Packed document.txt", mimeType: "text/plain",
  preview: { status: "ready", text: "Document content from an independent consumer." },
};
const load: DocumentLibraryLoad = async (_query, { signal }) => {
  signal.throwIfAborted();
  return { data: [{ ...note, kind: "file" }], total: 1 };
};

export function DocumentLibraryFixture() {
  const [open, setOpen] = useState(false);
  return <section aria-label="Packed document library">
    <h2>Document library package controls</h2>
    <FilePreview file={note} />
    <Button onClick={() => setOpen(true)}>Preview packed document</Button>
    <FileLightbox file={note} open={open} onOpenChange={setOpen} />
    <AvatarUpload ownerId="packed-workspace" name="Packed workspace" kind="logo"
      value={null} onSave={async () => null} />
    <DocumentLibraryBlock scopeKey="packed-documents" load={load} />
  </section>;
}
