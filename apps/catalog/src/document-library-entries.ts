import type { CatalogEntry } from "./catalog-types.js";

export const documentLibraryEntries: readonly CatalogEntry[] = [{
  id: "document-library", name: "Document library", group: "Compositions", inventoryIds: ["J07"],
  description: "Browse folders in a list or grid, select files across pages, preview documents, upload files and recover failed removals.",
  tags: ["documents", "files", "folders", "grid", "selection", "upload", "preview", "J07"],
  source: "Editable kit source block · remote table, file rows and upload queue",
  sourceUrl: "https://ui.shadcn.com/blocks",
  usage: `"use client";

import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { DocumentLibraryBlock, type DocumentLibraryBlockProps } from "./document-library";

// Copy registry/blocks/document-library.tsx beside this module.
// Memoize load. It returns the requested page and the total before pagination.
// It receives folderId, kind, search, sort, pageIndex and pageSize.
export function WorkspaceDocuments(props: DocumentLibraryBlockProps) {
  return <DocumentLibraryBlock {...props} />;
}

// scopeKey includes the account, workspace and permission revision.
// load validates API responses and returns stable, unique IDs.
// upload receives a captured folderId and the existing queue's AbortSignal.
// onRemove/onRestore implement the application's trash and retention policy.
// Honor signals before committing host state; authorize every operation server-side.
// Preview raster images or supplied plain text. Other types use open/download links.
// Supply onRefreshPreview to replace expired signed URLs in your load result.
// Changing folders aborts that folder's queue. Scope changes discard all local state.
`,
}];
