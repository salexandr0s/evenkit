"use client";

import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ChatPanel, ChatWidget, CodeBlock, useUploadQueue, type ChatAttachment, type ChatMessage, type ChatPanelProps, type ChatStatus, type UploadTransport } from "@evenkit/ui";

const answer = [
  "## Release notes",
  "",
  "Keep **decisions**, supporting files and sources together. A message opts into Markdown with `format: \"markdown\"`.",
  "",
  "- Review the draft with your team.",
  "- Check the linked [Markdown reference](https://commonmark.org/help/).",
  "- Retry or remove a failed file before sending.",
  "",
  "### Ownership",
  "",
  "| Item | Owner | State | Notes | Reference |",
  "| --- | --- | --- | --- | --- |",
  "| Rendering | UI kit | Ready | Tables and code scroll within the message | N01/H07 |",
  "| Uploads | Application | Review | Transport and permissions belong to the host | N02 |",
  "| Sources | Application | Review | Titles, URLs and previews are supplied as data | N03 |",
  "",
  "### Example",
  "",
  "```tsx",
  "const message = { id: 'release', role: 'assistant', format: 'markdown', content: 'A long line stays inside this code block, so it does not widen the conversation or move the composer outside the panel.' };",
  "```",
  "",
  "Raw HTML stays text: <strong>this is not an HTML element</strong>.",
].join("\n");

const initialMessages: ChatMessage[] = [
  { id: "plain", role: "user", content: "Plain text still works: **these asterisks stay visible**." },
  {
    id: "rich", role: "assistant", format: "markdown", content: answer,
    sources: [
      { id: "markdown", title: "CommonMark reference", href: "https://commonmark.org/help/", preview: "Reference examples for headings, lists, links and fenced code." },
      { id: "archived", title: "Archived project notes", unavailable: true, preview: "The application no longer grants access to these notes." },
      { id: "unsafe", title: "Blocked source address", href: "javascript:alert('blocked')" },
    ],
    attachments: [{ id: "missing", name: "Previous draft.pdf", mediaType: "application/pdf", unavailable: true, description: "This file is no longer available." }],
  },
];

// A local fixture. Applications supply authenticated upload transport and URLs.
export function RichChatExample() {
  const [messages, setMessages] = useState(initialMessages);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [failNext, setFailNext] = useState(false);
  const [sampleMessage, setSampleMessage] = useState("");
  const [rtl, setRtl] = useState(false);
  const fail = useRef(false);
  const objectUrls = useRef(new Map<string, { file: File; sent: boolean }>());
  const replyTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const busy = status === "submitted" || status === "streaming";

  const upload = useCallback<UploadTransport>((file, { signal, onProgress }) => new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Upload cancelled", "AbortError")); return; }
    const shouldFail = fail.current;
    fail.current = false;
    setFailNext(false);
    let progress = 0;
    const timer = setInterval(() => {
      progress += 25;
      onProgress(progress);
      if (progress < 100) return;
      clearInterval(timer);
      signal.removeEventListener("abort", abort);
      if (shouldFail) reject(new Error("The sample upload failed. Retry this file or remove it."));
      else {
        const url = URL.createObjectURL(file);
        objectUrls.current.set(url, { file, sent: false });
        resolve({ href: url, downloadHref: url });
      }
    }, 250);
    function abort() { clearInterval(timer); reject(new DOMException("Upload cancelled", "AbortError")); }
    signal.addEventListener("abort", abort, { once: true });
  }), []);
  const queue = useUploadQueue({ upload, concurrency: 2, maxFiles: 4 });

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      clearInterval(replyTimer.current);
      urls.forEach((_resource, url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  // Progress may render before the upload promise publishes its result. The
  // selected File owns its URL until send transfers that ownership to a message.
  useEffect(() => {
    const draftFiles = new Set(queue.items.map(item => item.file));
    for (const [url, resource] of objectUrls.current) {
      if (!resource.sent && !draftFiles.has(resource.file)) {
        URL.revokeObjectURL(url);
        objectUrls.current.delete(url);
      }
    }
  }, [queue.items]);

  function stop() { clearInterval(replyTimer.current); setStatus("idle"); }

  function streamReply() {
    if (busy) return;
    const id = crypto.randomUUID();
    // Begin inside an unfinished fence to make the streaming state inspectable.
    const response = "```tsx\nconst draft = { ready: false };\n```\n\n" + answer;
    let cursor = 18;
    setMessages(previous => [...previous, { id, role: "assistant", format: "markdown", content: response.slice(0, cursor) }]);
    setStatus("streaming");
    replyTimer.current = setInterval(() => {
      cursor = Math.min(cursor + 36, response.length);
      setMessages(previous => previous.map(message => message.id === id ? { ...message, content: response.slice(0, cursor) } : message));
      if (cursor === response.length) stop();
    }, 80);
  }

  function send(text: string) {
    if (busy || queue.items.some(item => item.state !== "complete")) return;
    const attachments: ChatAttachment[] = queue.items.map(item => ({
      id: item.id, name: item.file.name, sizeBytes: item.file.size, mediaType: item.file.type,
      ...item.result,
      ...(item.file.type.startsWith("image/") && item.result?.href ? { previewUrl: item.result.href } : {}),
    }));
    if (!text && !attachments.length) return;
    // Mark ownership before clearing the external queue: its render can commit
    // before React appends the message. Sent messages remain until unmount here.
    for (const attachment of attachments) {
      for (const url of [attachment.href, attachment.downloadHref, attachment.previewUrl]) {
        const resource = url ? objectUrls.current.get(url) : undefined;
        if (resource) resource.sent = true;
      }
    }
    setMessages(previous => [...previous, { id: crypto.randomUUID(), role: "user", content: text, attachments }]);
    setValue("");
    queue.clearCompleted();
  }

  function addSamples() {
    const png = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAE0lEQVR4nGNoaGg4cOAAAxADWQA0jgeBf6FdDQAAAABJRU5ErkJggg=="), character => character.charCodeAt(0));
    const result = queue.addFiles([
      new File(["Review the release notes."], "Review notes.txt", { type: "text/plain", lastModified: 1 }),
      new File([png], "Sample image.png", { type: "image/png", lastModified: 1 }),
    ]);
    setSampleMessage(result.rejected.length ? result.rejected.map(item => item.message).join(" ") : "Two sample files added.");
  }

  const chat: ChatPanelProps = {
    messages, value, onValueChange: setValue, onSend: send, status, onStop: stop,
    dir: rtl ? "rtl" : "ltr",
    attachments: { queue, label: "Attach files", accept: "image/png,image/jpeg,image/webp,.pdf,.txt", maxBytes: 5 * 1024 * 1024, hint: "Up to 4 files, 5 MB each. PNG, JPEG, WebP, PDF or text." },
  };

  return <div className="rich-chat-example" style={{ display: "grid", gap: "var(--pk-space-4)", minWidth: 0 }}>
    <style>{".rich-chat-example > .pk-chat-launcher { position: static; inset: auto; justify-self: start; max-inline-size: 100%; }"}</style>
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--pk-space-2)" }}>
      <Button variant="outline" disabled={busy} onClick={streamReply}>Stream rich reply</Button>
      <Button variant="outline" disabled={busy} onClick={addSamples}>Add sample files</Button>
      <Button variant="outline" aria-pressed={failNext} disabled={busy} onClick={() => { fail.current = !failNext; setFailNext(!failNext); }}>Fail next upload</Button>
      <Button variant="ghost" aria-pressed={rtl} onClick={() => setRtl(!rtl)}>Right-to-left layout</Button>
    </div>
    <p style={{ margin: 0, color: "var(--pk-color-fg-muted)" }}>Uploads stay in this browser. Turn on “Fail next upload”, then add files to try recovery. Send with an empty draft to send attachments alone.</p>
    <p role="status" style={{ margin: 0 }}>{sampleMessage}</p>
    <ChatPanel {...chat} title="Research assistant"
      style={{ height: "var(--pk-layout-reading)", minHeight: "var(--pk-layout-dialog-sm)", maxHeight: "85dvh" }} />
    <ChatWidget {...chat} title="Rich chat widget" launcherLabel="Open rich chat" />
    <section aria-label="Reusable code block" style={{ minWidth: 0 }}>
      <h3>Reusable code block</h3>
      <CodeBlock language="typescript" code={'const title = "Release notes";\nconsole.log(title);'} />
    </section>
  </div>;
}
