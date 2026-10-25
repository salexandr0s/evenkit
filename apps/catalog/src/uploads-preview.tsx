import { useCallback, useRef, useState } from "react";
import { Button, Image, SelectField, Thumbnail, UploadQueue, useUploadQueue, type UploadTransport } from "@evenkit/ui";
import "./uploads-preview.css";

function QueueExample() {
  const [failNext, setFailNext] = useState(false);
  const failure = useRef(false);
  const [sampleMessage, setSampleMessage] = useState("");
  const upload = useCallback<UploadTransport>((file, { signal, onProgress }) => new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Upload cancelled", "AbortError")); return; }
    const shouldFail = failure.current;
    failure.current = false;
    setFailNext(false);
    let progress = 0;
    const timer = window.setInterval(() => {
      progress += 20;
      onProgress(progress);
      if (progress === 100) {
        window.clearInterval(timer);
        signal.removeEventListener("abort", abort);
        if (shouldFail) reject(new Error("The sample upload failed. Retry the same file."));
        else resolve(file.type === "text/plain" ? { downloadHref: `data:text/plain;charset=utf-8,${encodeURIComponent("Local upload preview completed.")}` } : undefined);
      }
    }, 300);
    function abort() { window.clearInterval(timer); reject(new DOMException("Upload cancelled", "AbortError")); }
    signal.addEventListener("abort", abort, { once: true });
  }), []);
  const queue = useUploadQueue({ upload, concurrency: 2, maxFiles: 6 });
  function addSamples() {
    const selection = queue.addFiles([
      new File(["Review notes"], "Review notes.txt", { type: "text/plain", lastModified: 1 }),
      new File(["Meeting agenda"], "Planning agenda.txt", { type: "text/plain", lastModified: 1 }),
      new File(["Handover checklist"], "Handover checklist.txt", { type: "text/plain", lastModified: 1 }),
    ]);
    setSampleMessage(selection.rejected.length ? selection.rejected.map(item => item.message).join(" ") : "Three sample files added.");
  }
  return <div className="uploads-preview">
    <div className="uploads-preview-header"><div><h3>Project attachments</h3><p>Keep transfer progress and recovery beside each file.</p></div><Button variant="outline" onClick={addSamples}>Add sample files</Button></div>
    <UploadQueue queue={queue} label="Choose attachments" accept="image/*,.pdf,.txt" maxBytes={5 * 1024 * 1024}
      hint="Up to 6 images, PDFs or text files, 5 MB each." />
    <section className="uploads-preview-options"><h3>Preview options</h3><label><input type="checkbox" checked={failNext} onChange={event => { failure.current = event.target.checked; setFailNext(event.target.checked); }} />Fail the next upload</label><p>Transfers run locally in this example. Choose an image to preview it before upload completes.</p><p role="status">{sampleMessage}</p></section>
  </div>;
}

function ImagesExample() {
  const [fit, setFit] = useState<"cover" | "contain">("contain");
  const [broken, setBroken] = useState(true);
  return <div className="uploads-preview">
    <div className="uploads-preview-header"><div><h3>Image presentation</h3><p>Reserve the same space while images load or recover.</p></div><SelectField label="Image fit" value={fit} onValueChange={value => { if (value === "cover" || value === "contain") setFit(value); }} options={[{ value: "contain", label: "Contain" }, { value: "cover", label: "Cover" }]} /></div>
    <div className="uploads-preview-images">
      <figure><Image src="/evenkit-logo.png" alt="Evenkit logo" fit={fit} loading="eager" aspectRatio={4 / 3} /><figcaption>Image frame</figcaption></figure>
      <figure><Image src={broken ? "data:image/png;base64,broken" : "/evenkit-logo.png"} alt="Evenkit logo with retry" fit="contain" loading="eager" aspectRatio={4 / 3} onRetry={() => setBroken(false)} /><figcaption>Failure and recovery</figcaption></figure>
    </div>
    <section className="uploads-preview-thumbnails" aria-label="Thumbnail sizes"><Thumbnail src="/evenkit-logo.png" alt="Small Evenkit logo thumbnail" size="sm" fit="contain" /><Thumbnail src="/evenkit-logo.png" alt="Medium Evenkit logo thumbnail" size="md" fit="contain" /><Thumbnail src="/evenkit-logo.png" alt="Large Evenkit logo thumbnail" size="lg" fit="contain" /><p>Thumbnails keep a square frame and preserve the supplied alternative text.</p></section>
    <div><Button variant="outline" onClick={() => setBroken(true)}>Show image failure</Button></div>
  </div>;
}

export function UploadsPreview({ id }: { id: string }) { return id === "image" ? <ImagesExample /> : <QueueExample />; }
