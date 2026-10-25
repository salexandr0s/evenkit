import type { CatalogEntry } from "./catalog-types.js";

export const mediaPreviewEntries: readonly CatalogEntry[] = [{
  id: "file-preview", name: "File preview and lightbox", group: "Compositions", inventoryIds: ["J06"],
  description: "Preview images and plain text, recover expired access, and open or download other files.",
  tags: ["file", "preview", "lightbox", "document", "image", "download", "J06"],
  source: "Original kit composition · Image and Radix Dialog",
  sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
  usage: `"use client";

import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { useRef, useState } from "react";
import { Button, FileLightbox, FilePreview, type MediaFile } from "@evenkit/ui";

export function DocumentPreview({ file, onRefresh }: {
  file: MediaFile;
  onRefresh: (file: MediaFile) => void;
}) {
  const [open, setOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  return <section>
    <h2 ref={heading} tabIndex={-1}>{file.name}</h2>
    <FilePreview file={file} onRefresh={onRefresh} />
    <Button onClick={() => setOpen(true)}>Open file preview</Button>
    <FileLightbox file={file} open={open} onOpenChange={setOpen}
      onRefresh={onRefresh} returnFocusRef={heading} />
  </section>;
}

// Example data. Replace URLs with destinations authorized by your application.
export const imageFile: MediaFile = {
  id: "project-cover", name: "Project cover.png", mimeType: "image/png",
  preview: { status: "ready", url: "/files/project-cover.png" },
  openHref: "/files/project-cover.png", downloadHref: "/files/project-cover.png",
};
export const notesFile: MediaFile = {
  id: "project-notes", name: "Project notes.txt", mimeType: "text/plain",
  preview: { status: "ready", text: "Review the project notes." },
};

// Inline: PNG, JPEG, WebP, AVIF, GIF, and supplied text/plain content.
// PDF, SVG, HTML, and other types use open/download fallbacks.
// Refresh access in the host, set preview.status to loading, then publish a new
// preview. Abort and ignore stale results after file, revision or context changes.
// Object URLs belong to their creator; revoke them after all previews release them.
// Supply static image renditions when animated files must respect reduced motion.
`,
}];
