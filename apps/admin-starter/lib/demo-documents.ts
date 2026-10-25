import type { DocumentEntry, DocumentLibraryQuery } from "@evenkit/ui";
import type { WorkspaceId } from "./demo-data";

export interface DemoDocument { entry: DocumentEntry; parentId: string | null; trashed: boolean }

export function initialDocuments(workspace: WorkspaceId): readonly DemoDocument[] {
  const northstar = workspace === "northstar";
  const folderId = `${workspace}-planning`;
  return [
    { entry: { id: folderId, kind: "folder", name: "Planning" }, parentId: null, trashed: false },
    { entry: { id: `${workspace}-brief`, kind: "file", name: northstar ? "Community brief.txt" : "Repair café notes.txt", mimeType: "text/plain", sizeBytes: northstar ? 179 : 141,
      preview: { status: "ready", text: northstar ? "Northstar Studio\nCommunity field guide\n\nPrepare an illustrated guide for the autumn open day. Review accessibility notes before printing.\n\nThis document is fictional sample data." : "Harbor Workshop\nRepair café\n\nBring the volunteer rota and tool checklist to the Saturday briefing.\n\nThis document is fictional sample data." },
      openHref: `/sample-files/${workspace}-brief.txt`, downloadHref: `/sample-files/${workspace}-brief.txt` }, parentId: null, trashed: false },
    { entry: { id: `${workspace}-welcome`, kind: "file", name: "Read me.txt", mimeType: "text/plain", sizeBytes: 149,
      preview: { status: "ready", text: "These files are part of the Evenkit admin demo. Uploads stay in this browser tab. Remove a file to try the undo action. No file is sent to a server." },
      openHref: "/sample-files/read-me.txt", downloadHref: "/sample-files/read-me.txt" }, parentId: null, trashed: false },
    { entry: { id: `${workspace}-schedule`, kind: "file", name: "Schedule.txt", mimeType: "text/plain", sizeBytes: 115,
      preview: { status: "ready", text: "Monday: review notes.\nWednesday: prepare materials.\nFriday: check access arrangements.\n\nFictional sample schedule." },
      openHref: "/sample-files/schedule.txt", downloadHref: "/sample-files/schedule.txt" }, parentId: folderId, trashed: false },
  ];
}

export function documentPage(documents: readonly DemoDocument[], query: DocumentLibraryQuery) {
  if (query.folderId !== null && !documents.some(document => !document.trashed && document.entry.kind === "folder" && document.entry.id === query.folderId)) {
    throw new Error("This folder is no longer available. Return to All documents.");
  }
  const search = query.search.trim().toLocaleLowerCase();
  const entries = documents.filter(document => !document.trashed && document.parentId === query.folderId)
    .map(document => document.entry)
    .filter(entry => (!search || entry.name.toLocaleLowerCase().includes(search)) && (query.kind === "all" || (query.kind === "files" ? entry.kind === "file" : entry.kind === "folder")));
  entries.sort((left, right) => {
    const order = query.sort?.id === "size" ? (left.kind === "file" ? left.sizeBytes ?? 0 : 0) - (right.kind === "file" ? right.sizeBytes ?? 0 : 0) : left.name.localeCompare(right.name);
    return order * (query.sort?.direction === "desc" ? -1 : 1);
  });
  return { data: entries.slice(query.pageIndex * query.pageSize, (query.pageIndex + 1) * query.pageSize), total: entries.length };
}

const supportedTypes = new Set(["text/plain", "application/pdf", "image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"]);

/** Demo validation only; a real transport must inspect content and authorize on its server. */
export async function validateDemoUpload(file: File): Promise<string | undefined> {
  if (!supportedTypes.has(file.type) || file.size > 5 * 1024 * 1024) throw new Error("Choose a supported file no larger than 5 MB.");
  if (file.type === "text/plain") return (await file.text()).slice(0, 100_000);
  if (file.type === "application/pdf") {
    const header = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
    if (header !== "%PDF-") throw new Error("This file does not have a PDF header.");
  } else {
    try { const bitmap = await createImageBitmap(file); bitmap.close(); }
    catch { throw new Error("This image could not be read. Choose another file."); }
  }
  return undefined;
}
