import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AuditViewer, Button, ConnectionStatus, DocumentLibrary, FilePreview, Image, PersistentBanner, type MediaFile } from "@evenkit/ui";
import { NotificationCenter } from "../../registry/blocks/notification-center.js";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

declare global { interface Window { mediaLifecycleHost: { replace: () => void } } }

function MediaLifecycleHost() {
  const [replaced, setReplaced] = useState(false);
  const surface = new URLSearchParams(location.search).get("surface");
  useEffect(() => { window.mediaLifecycleHost = { replace: () => setReplaced(true) }; }, []);
  const loadAudit = useCallback(async () => ({ data: [{ id: "event", actor: "Mira", actorId: "mira", action: "Changed project", timestamp: "2026-11-01T12:00:00Z", kind: "record", outcome: "success" }], total: 1 }), []);
  const file: MediaFile = { id: "project", name: "Project file.png", mimeType: "image/png", preview: replaced ? { status: "ready", url: "/evenkit-logo.png" } : { status: "expired" } };
  return <main style={{ maxWidth: "var(--pk-layout-form)", margin: "var(--pk-space-4) auto" }}>
    <h1>Media lifecycle host</h1><Button>Outside control</Button>
    {surface === "image" ? <Image src={replaced ? "/evenkit-logo.png" : "data:image/png;base64,broken"} alt="Project image" loading="eager" /> : null}
    {surface === "preview" ? <FilePreview file={file} onRefresh={() => undefined} /> : null}
    {surface === "banner" ? <PersistentBanner contextKey="workspace" heading="Workspace notice" actions={replaced ? [] : [{ id: "open", label: "Open details", onAction: async () => undefined }]}>Project files need review.</PersistentBanner> : null}
    {surface === "connection" ? <ConnectionStatus contextKey="workspace" state={replaced ? "stale" : "offline"} actions={replaced ? [] : [{ id: "retry", label: "Retry connection", onAction: async () => undefined }]}>Your local changes are still here.</ConnectionStatus> : null}
    {surface === "notification" ? <NotificationCenter contextKey="workspace" page={1} pageCount={1}
      groups={replaced ? [] : [{ id: "today", label: "Today", items: [{ id: "project", title: "Project ready", read: false }] }]}
      onOperation={async () => undefined} onCommit={() => undefined} onLoadPage={async () => ({ page: 1, pageCount: 1, groups: [] })} onPageLoaded={() => undefined} /> : null}
    {surface === "documents" ? <DocumentLibrary entries={[{ id: "folder", name: "Project documents", kind: "folder" }]} total={1}
      query={{ pageIndex: 0, pageSize: 6, search: "", sort: null, folderId: null, kind: "all" }} onQueryChange={() => undefined}
      path={[]} onNavigate={() => undefined} view="grid" onViewChange={() => undefined} selection={{ selectedIds: [], onSelectionChange: () => undefined }} onPreview={() => undefined} loading={replaced} /> : null}
    {surface === "audit" ? <AuditViewer contextKey="workspace" query={{ pageIndex: 0, pageSize: 6, search: "", actorId: null, kind: null, outcome: null }}
      onQueryChange={() => undefined} load={loadAudit} timeZone="UTC" {...(replaced ? { denied: "Access changed" } : {})} onExport={async () => ({ status: "success" })} /> : null}
  </main>;
}

const root = document.getElementById("root");
if (!root) throw new Error("The media host needs a root element.");
createRoot(root).render(<MediaLifecycleHost />);
