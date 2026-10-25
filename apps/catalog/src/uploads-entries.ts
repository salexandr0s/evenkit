import type { CatalogEntry } from "./catalog-types.js";

const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';

export const uploadsEntries: readonly CatalogEntry[] = [
  {
    id: "upload-queue", name: "Upload queue", group: "Compositions", inventoryIds: ["J03"],
    description: "Queue multiple files with progress, cancellation, retries, duplicate checks and local image previews.",
    tags: ["upload", "queue", "file", "progress", "cancel", "retry", "duplicate", "J03"],
    source: "Original kit controller · FileInput and FileRow composition",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
    usage: `${imports}
import { UploadQueue, useUploadQueue, type UploadTransport } from "@evenkit/ui";

// Supply an authenticated transport from your application. It must honor the
// signal and may call onProgress(percentage) while transferring the file.
export function ProjectAttachments({ upload }: { upload: UploadTransport }) {
  const queue = useUploadQueue({ upload, concurrency: 2, maxFiles: 8 });
  return <UploadQueue queue={queue} label="Project attachments"
    accept="image/*,.pdf,.txt" maxBytes={5 * 1024 * 1024}
    hint="Images, PDFs or text files. Up to 8 files, 5 MB each." />;
}
`,
  },
  {
    id: "image", name: "Image and thumbnail", group: "Compositions", inventoryIds: ["J04"],
    description: "Stable image frames with cover or contain fit, accessible alternatives, loading and retryable errors.",
    tags: ["image", "thumbnail", "media", "preview", "alt", "loading", "fallback", "J04"],
    source: "Original kit composition · native image element",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img",
    usage: `${imports}
import { Image, Thumbnail } from "@evenkit/ui";

export function ProjectImage({ src, description }: { src: string; description: string }) {
  return <>
    <Image src={src} alt={description} aspectRatio={16 / 9} fit="contain" />
    {/* Use an empty alternative when an adjacent label provides the same text. */}
    <Thumbnail src={src} alt="" size="md" />
  </>;
}
`,
  },
];
