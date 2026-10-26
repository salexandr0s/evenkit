import { useCallback, useEffect, useRef, useState } from "react";
import { Button, type DocumentEntry, type DocumentLibraryLoad } from "@evenkit/ui";
import { DocumentLibraryBlock, type DocumentLibraryBlockProps } from "../../../registry/blocks/document-library.js";
import "./document-library-preview.css";

type SampleEntry = DocumentEntry & { parentId: string | null };
const samples: readonly SampleEntry[] = [
  { id: "root", kind: "folder", name: "Brand assets", parentId: null },
  { id: "empty", kind: "folder", name: "Empty folder", parentId: null },
  { id: "guide", kind: "file", name: "Guidelines-and-accessibility-review-for-the-next-workspace-release-2026.txt", parentId: null, mimeType: "text/plain", sizeBytes: 320, preview: { status: "ready", text: "Workspace review\n\nCheck labels, keyboard focus and narrow layouts.\n\nUploaded text stays text: <script>alert('example')</script>" } },
  { id: "brief", kind: "file", name: "Project brief.pdf", parentId: null, mimeType: "application/pdf", sizeBytes: 182400 },
  { id: "logo", kind: "file", name: "Workspace logo.png", parentId: null, mimeType: "image/png", sizeBytes: 6240, preview: { status: "ready", url: "/evenkit-logo.png" }, openHref: "/evenkit-logo.png", downloadHref: "/evenkit-logo.png" },
  { id: "expired", kind: "file", name: "Expired preview.png", parentId: null, mimeType: "image/png", sizeBytes: 6240, preview: { status: "expired" }, downloadHref: "/evenkit-logo.png" },
  { id: "unavailable", kind: "file", name: "Unavailable preview.png", parentId: null, mimeType: "image/png", preview: { status: "unavailable", message: "The preview is no longer available." } },
  { id: "html", kind: "file", name: "Uploaded page.html", parentId: null, mimeType: "text/html", sizeBytes: 200 },
  { id: "brand-notes", kind: "file", name: "Brand notes.txt", parentId: "root", mimeType: "text/plain", sizeBytes: 180, preview: { status: "ready", text: "Use the approved workspace logo and readable text." } },
];

const delay = (duration: number) => new Promise(resolve => window.setTimeout(resolve, duration));

export function DocumentLibraryPreview() {
  const [records, setRecords] = useState(samples);
  const [removedIds, setRemovedIds] = useState<readonly string[]>([]);
  const [revision, setRevision] = useState(0);
  const [scope, setScope] = useState(0);
  const failLoad = useRef(false);
  const failRemove = useRef(false);
  const failRestore = useRef(false);
  const slowRemove = useRef(false);
  const urls = useRef(new Set<string>());
  useEffect(() => { const owned = urls.current; return () => { owned.forEach(url => URL.revokeObjectURL(url)); }; }, []);
  const load = useCallback<DocumentLibraryLoad>(async query => {
    const shouldFail = failLoad.current; failLoad.current = false;
    // Finish superseded loads to demonstrate the remote table's lifetime guard.
    await delay(query.search === "Workspace" ? 700 : 120);
    if (shouldFail) throw new Error("The sample folder could not be loaded. Try again.");
    const data = records.filter(entry => entry.parentId === query.folderId && !removedIds.includes(entry.id)
      && (query.kind === "all" || (query.kind === "files" ? entry.kind === "file" : entry.kind === "folder"))
      && entry.name.toLowerCase().includes(query.search.toLowerCase()));
    if (query.sort) {
      const { id, direction } = query.sort;
      data.sort((a, b) => {
        const order = id === "size" ? (a.kind === "file" ? a.sizeBytes ?? 0 : 0) - (b.kind === "file" ? b.sizeBytes ?? 0 : 0) : a.name.localeCompare(b.name);
        return direction === "asc" ? order : -order;
      });
    }
    return { data: data.slice(query.pageIndex * query.pageSize, (query.pageIndex + 1) * query.pageSize), total: data.length };
  }, [records, removedIds, revision]);
  const remove = useCallback<NonNullable<DocumentLibraryBlockProps["onRemove"]>>(async (ids, { signal }) => {
    const shouldFail = failRemove.current; failRemove.current = false;
    const duration = slowRemove.current ? 850 : 180; slowRemove.current = false;
    await delay(duration);
    if (signal.aborted) return;
    if (shouldFail) throw new Error("Items could not be removed. Your selection is still here.");
    setRemovedIds(current => [...new Set([...current, ...ids])]);
  }, []);
  const restore = useCallback<NonNullable<DocumentLibraryBlockProps["onRestore"]>>(async (ids, { signal }) => {
    const shouldFail = failRestore.current; failRestore.current = false;
    await delay(180);
    if (signal.aborted) return;
    if (shouldFail) throw new Error("Restore failed. Try undo again.");
    setRemovedIds(current => current.filter(id => !ids.includes(id)));
  }, []);
  const upload = useCallback<NonNullable<DocumentLibraryBlockProps["upload"]>>(async (file, { signal, onProgress, folderId }) => {
    onProgress(20); await delay(180); if (signal.aborted) return {};
    onProgress(70); await delay(180); if (signal.aborted) return {};
    const text = file.type === "text/plain" ? await file.text() : null;
    if (signal.aborted) return {};
    const url = URL.createObjectURL(file); urls.current.add(url);
    setRecords(current => [...current, { id: crypto.randomUUID(), kind: "file", name: file.name, parentId: folderId, mimeType: file.type, sizeBytes: file.size,
      preview: text === null ? { status: "ready", url } : { status: "ready", text }, openHref: url, downloadHref: url }]);
    onProgress(100); return { href: url, downloadHref: url };
  }, []);
  return <div className="document-library-preview">
    <DocumentLibraryBlock scopeKey={`sample-workspace-${scope}`} load={load} upload={upload} onRemove={remove} onRestore={restore}
      onRefreshPreview={file => setRecords(current => current.map(entry => entry.id === file.id && entry.kind === "file" ? { ...entry, preview: { status: "ready", url: "/evenkit-logo.png" } } : entry))} />
    <details aria-label="Document demo controls" className="document-library-demo-options" open><summary>Preview options</summary>
      <div className="document-library-demo-actions">
        <Button variant="outline" size="sm" onClick={() => { failLoad.current = true; setRevision(value => value + 1); }}>Fail next load</Button>
        <Button variant="outline" size="sm" onClick={() => { failRemove.current = true; }}>Fail next removal</Button>
        <Button variant="outline" size="sm" onClick={() => { failRestore.current = true; }}>Fail next restore</Button>
        <Button variant="outline" size="sm" onClick={() => { slowRemove.current = true; }}>Delay next removal</Button>
        <Button variant="ghost" size="sm" onClick={() => { setScope(value => value + 1); setRecords(samples); setRemovedIds([]); urls.current.forEach(url => URL.revokeObjectURL(url)); urls.current.clear(); }}>Reset library</Button>
      </div><p className="pk-settings-note">Uploads and removals use local sample data. Changing folders cancels pending uploads. Selection follows the current folder and filter.</p>
    </details>
  </div>;
}
