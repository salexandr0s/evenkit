import { useRef, useState } from "react";
import { Button, Checkbox, ChevronDownIcon, SelectField, SlidersHorizontalIcon } from "@evenkit/ui";
import { AvatarUpload, avatarImageTypes, type AvatarUploadProps, type AvatarValue } from "../../../registry/blocks/avatar-upload";
import "./avatar-upload-preview.css";

const initial: AvatarValue = { id: "meridian-logo", name: "Meridian logo.png", mimeType: "image/png", src: "/evenkit-logo.png" };

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("The image could not be read."));
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.readAsDataURL(file);
  });
}

export function AvatarUploadPreview() {
  const [value, setValue] = useState<AvatarValue | null>(initial);
  const [revision, setRevision] = useState(0);
  const [owner, setOwner] = useState("meridian");
  const [kind, setKind] = useState<"avatar" | "logo">("logo");
  const [failNext, setFailNext] = useState(false);
  const [late, setLate] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const failure = useRef(false);
  const save: AvatarUploadProps["onSave"] = async (change, { signal }) => {
    const fail = failure.current;
    failure.current = false; setFailNext(false);
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 800);
      function abort() { window.clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); }
      if (!late) { if (signal.aborted) abort(); else signal.addEventListener("abort", abort, { once: true }); }
    });
    if (fail) throw new Error("The sample save failed. Your changes are still here.");
    if (change.kind === "remove") return null;
    const mimeType = avatarImageTypes.find(type => type === change.file.type);
    if (!mimeType) throw new Error("Choose a supported image type.");
    return { id: crypto.randomUUID(), name: change.file.name, mimeType, src: await readImage(change.file) };
  };
  return <div className="avatar-upload-preview">
    <AvatarUpload ownerId={owner} name={owner === "meridian" ? "Meridian workspace" : "Cedar workspace"} kind={kind} value={value} revision={revision} onSave={save}
      onSaved={next => { setValue(next); setSavedCount(count => count + 1); }}
      onRefreshPreview={() => { setValue(current => current ? { ...current, src: "/evenkit-logo.png", previewState: "available" } : current); }} />
    <details className="avatar-upload-demo" aria-label="Avatar preview options" open>
      <summary><SlidersHorizontalIcon size="sm" /><span>Preview options</span><ChevronDownIcon className="avatar-upload-demo-chevron" size="sm" /></summary>
      <div className="avatar-upload-demo-content">
        <div className="avatar-upload-demo-fields">
          <SelectField label="Image use" value={kind} options={[{ value: "avatar", label: "Avatar" }, { value: "logo", label: "Workspace logo" }]} onValueChange={next => { if (next === "avatar" || next === "logo") setKind(next); }} />
          <div className="avatar-upload-demo-checks">
            <Checkbox label="Fail the next save" checked={failNext} onCheckedChange={checked => { failure.current = checked === true; setFailNext(checked === true); }} />
            <Checkbox label="Simulate a late save response" checked={late} onCheckedChange={checked => setLate(checked === true)} />
          </div>
        </div>
        <div className="avatar-upload-demo-actions">
          <Button size="sm" variant="outline" onClick={() => setValue(current => current ? { ...current, previewState: "expired" } : initial)}>Expire preview</Button>
          <Button size="sm" variant="outline" onClick={() => { setValue(initial); setRevision(current => current + 1); }}>Restore saved image</Button>
          <Button size="sm" variant="outline" onClick={() => { setOwner(current => current === "meridian" ? "cedar" : "meridian"); setValue(initial); }}>Switch workspace</Button>
        </div>
        <p className="avatar-upload-demo-note">This example saves images in memory. Reloading restores the sample image.</p>
        <p className="avatar-upload-demo-result" role="status">Completed saves: {savedCount}. Saved image: {value?.name ?? "None"}.</p>
      </div>
    </details>
  </div>;
}
