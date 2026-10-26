import { useRef, useState } from "react";
import { Button, ChevronDownIcon, FileLightbox, FilePreview, SelectField, type MediaFile } from "@evenkit/ui";
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
    <div className="media-preview-example-header"><div><h3 ref={fallback} tabIndex={-1}>File previews</h3><p>View the file here or open a focused preview.</p></div>{!launcherHidden ? <Button key="launcher" variant="outline" onClick={() => { setOpen(true); if (removeLauncher) setLauncherHidden(true); }}>Open lightbox</Button> : <Button key="restore" variant="outline" onClick={() => setLauncherHidden(false)}>Restore preview button</Button>}</div>
    <div className="media-preview-example-workspace"><div className="media-preview-example-picker"><SelectField label="Preview example" value={file.id} options={examples.map(item => ({ value: item.id, label: item.name }))} onValueChange={id => { const next = examples.find(item => item.id === id); if (next) { setFile(next); setLauncherHidden(false); } }} /><p>Images and plain text display here. Other files keep their open and download actions.</p></div><FilePreview file={file} onRefresh={refresh} /></div>
    <details className="media-preview-example-options" open><summary><span>Preview states</span><span className="media-preview-example-summary-note">Test access and recovery</span><ChevronDownIcon aria-hidden="true" /></summary><div className="media-preview-example-options-body"><div className="media-preview-example-actions"><Button size="sm" variant="ghost" onClick={() => setFile(current => ({ ...current, preview: { status: "expired" } }))}>Expire preview</Button><Button size="sm" variant="ghost" onClick={() => setFile(current => ({ ...current, preview: { status: "unavailable" } }))}>Make unavailable</Button><Button size="sm" variant="ghost" onClick={() => setFile(current => ({ ...current, preview: { status: "loading" } }))}>Show loading</Button><Button size="sm" variant="ghost" onClick={() => setFile(current => ({ ...current, mimeType: "image/png", preview: { status: "ready", url: "/missing-preview.png" } }))}>Break image</Button><Button size="sm" variant="outline" onClick={refresh}>Restore preview</Button></div><label><input type="checkbox" checked={removeLauncher} onChange={event => setRemoveLauncher(event.target.checked)} />Remove launcher when opening</label><p>Inline formats: PNG, JPEG, WebP, AVIF, GIF and plain text. PDF, SVG, HTML and other formats use file actions. Your application supplies the file content and access.</p></div></details>
    <FileLightbox file={file} open={open} onOpenChange={setOpen} onRefresh={refresh} returnFocusRef={fallback} />
  </div>;
}
