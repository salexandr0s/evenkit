import { useRef, useState } from "react";
import { Button, FileLightbox, FilePreview, SelectField, type MediaFile } from "@evenkit/ui";
import "./media-preview-preview.css";

const examples: readonly MediaFile[] = [
  { id: "brand", name: "Evenkit logo.png", mimeType: "image/png", preview: { status: "ready", url: "/evenkit-logo.png" }, openHref: "/evenkit-logo.png", downloadHref: "/evenkit-logo.png" },
  { id: "notes", name: "Release notes with a long filename for the design library handoff.txt", mimeType: "text/plain", preview: { status: "ready", text: "Release checklist\n\nReview the latest document library.\n\nMarkup stays text: <script>alert('example')</script>\n\nملاحظات الفريق: مراجعة الملفات" } },
  { id: "pdf", name: "Project brief.pdf", mimeType: "application/pdf", openHref: "/sample-document.pdf", downloadHref: "/sample-document.pdf" },
  { id: "html", name: "Uploaded page.html", mimeType: "text/html", preview: { status: "ready", text: "<h1>Uploaded HTML</h1>" }, openHref: "javascript:alert('blocked')", downloadHref: "data:text/html,<h1>Blocked</h1>" },
];

export function MediaPreviewPreview() {
  const [file, setFile] = useState<MediaFile>(examples[0]!);
  const [open, setOpen] = useState(false);
  const [removeLauncher, setRemoveLauncher] = useState(false);
  const [launcherHidden, setLauncherHidden] = useState(false);
  const fallback = useRef<HTMLHeadingElement>(null);
  function refresh() { setFile(current => examples.find(example => example.id === current.id) ?? examples[0]!); }
  return <div className="media-preview-example">
    <div className="media-preview-example-header"><div><h3 ref={fallback} tabIndex={-1}>File previews</h3><p>View an image, read plain text or use the file's available actions.</p></div><SelectField label="Preview example" value={file.id} options={examples.map(item => ({ value: item.id, label: item.name }))} onValueChange={id => { const next = examples.find(item => item.id === id); if (next) { setFile(next); setLauncherHidden(false); } }} /></div>
    <FilePreview file={file} onRefresh={refresh} />
    <div className="media-preview-example-actions">{!launcherHidden ? <Button key="launcher" onClick={() => { setOpen(true); if (removeLauncher) setLauncherHidden(true); }}>Open lightbox</Button> : <Button key="restore" variant="outline" onClick={() => setLauncherHidden(false)}>Restore preview button</Button>}</div>
    <section className="media-preview-example-options" aria-label="Preview states"><h3>Preview states</h3><div className="media-preview-example-actions"><Button variant="outline" onClick={() => setFile(current => ({ ...current, preview: { status: "expired" } }))}>Expire preview</Button><Button variant="outline" onClick={() => setFile(current => ({ ...current, preview: { status: "unavailable" } }))}>Make unavailable</Button><Button variant="outline" onClick={() => setFile(current => ({ ...current, preview: { status: "loading" } }))}>Show loading</Button><Button variant="outline" onClick={() => setFile(current => ({ ...current, mimeType: "image/png", preview: { status: "ready", url: "/missing-preview.png" } }))}>Break image</Button><Button variant="outline" onClick={refresh}>Restore preview</Button></div><label><input type="checkbox" checked={removeLauncher} onChange={event => setRemoveLauncher(event.target.checked)} />Remove launcher when opening</label><p>Inline formats: PNG, JPEG, WebP, AVIF, GIF and plain text. PDF, SVG, HTML and other formats use file actions. Your application supplies the file content and access.</p></section>
    <FileLightbox file={file} open={open} onOpenChange={setOpen} onRefresh={refresh} returnFocusRef={fallback} />
  </div>;
}
