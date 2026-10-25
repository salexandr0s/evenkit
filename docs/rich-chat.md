# Rich chat content

`ChatPanel` and `ChatWidget` accept Markdown, message attachments and source records without changing their controlled draft or response lifecycle. Plain text remains the default. Set `format: "markdown"` on the messages that should use rich rendering.

The [complete catalog example](../apps/catalog/src/rich-chat-example.tsx) runs locally and is also the source copied by the catalog's **Rich chat** entry. It includes simulated upload progress, failure and retry, image previews, attachment-only messages, source previews, streaming, long code and a table. Open the floating widget to try the same conversation in a compact modal. It has no provider or storage dependency. Import the two package styles once in your application; in Next.js, put those imports in the root layout.

After editing the catalog example, run `node scripts/generate-rich-chat-example.mjs` to update its copied source. The generated string allows the catalog metadata to load in both Vite and Node-based checks.

## Working example

This component needs React and the two Evenkit packages. Sending appends a plain-text message; the initial assistant response uses Markdown and a source preview.

```tsx
"use client";

import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { useState } from "react";
import { ChatPanel, CodeBlock, type ChatMessage } from "@evenkit/ui";

const initialMessages: ChatMessage[] = [{
  id: "welcome",
  role: "assistant",
  format: "markdown",
  content: [
    "## Project notes",
    "",
    "- Review the draft.",
    "- Assign an owner.",
    "",
    "| Task | Owner |",
    "| --- | --- |",
    "| Review | Design |",
    "",
    "```ts",
    "const ready = true;",
    "```",
  ].join("\n"),
  sources: [{
    id: "reference",
    title: "CommonMark reference",
    href: "https://commonmark.org/help/",
    preview: "Examples for headings, lists, links and code.",
  }],
}];

export function NotesChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [value, setValue] = useState("");
  return <>
    <ChatPanel title="Project notes" messages={messages}
      value={value} onValueChange={setValue}
      style={{ height: "var(--pk-layout-reading)" }}
      onSend={content => {
        setMessages(previous => [...previous, {
          id: crypto.randomUUID(), role: "user", content,
        }]);
        setValue("");
      }} />
    <CodeBlock language="typescript" code="const ready = true;" />
  </>;
}
```

`ChatMarkdown` also works outside a conversation: pass a `content` string and, while updating it, `streaming`. `CodeBlock` accepts a `code` string, an optional `language` label and `labels` overrides. It copies the displayed code and reports clipboard success or failure through the existing `CopyAction`. Copying a whole chat response continues to copy the original message content, including its Markdown syntax.

## Rendering boundary

The built-in renderer uses `react-markdown` and `remark-gfm` with a fixed configuration. Raw HTML displays as text. Markdown image syntax displays its alternative text with an omitted-image label, without fetching the image. Fenced code is text; its language label does not load a grammar. No raw-HTML or syntax-highlighting plugin is enabled. See [dependency evaluation](rich-chat-rendering-research.md) for the official sources and selection rationale.

Markdown and source links accept `http:`, `https:`, `mailto:` and relative URLs. Attachment links and previews accept `http:`, `https:`, `blob:` and relative URLs. Both boundaries reject control characters, backslashes, protocol-relative addresses and unsupported schemes such as `javascript:`, `data:` and `file:`. Invalid Markdown links retain their text. Invalid or missing source links show an unavailable state. These checks do not establish whether a host or file is trusted; the application decides which records the viewer may access.

The existing `renderMessage` callback still overrides the content renderer, including a message's `format`. A custom renderer owns the safety of the nodes it creates. Message attachments and sources remain separate records rendered after that content. Leave those arrays empty when your custom renderer already presents the same records.

## Attachments

Pass `attachments={{ queue, ...options }}` to either chat component. Obtain `queue` from the existing `useUploadQueue` hook with an application-supplied `UploadTransport` and optional `maxFiles`. The composer reuses `UploadQueue` for file selection, previews, progress, cancellation, retry and removal. Composer options `accept`, `maxBytes` and `disabled` help describe and control the UI; the application's transport must enforce authorization and file policy.

The composer waits until every selected file is complete before sending. A failed or cancelled file must be retried or removed. Completed files allow an empty text draft, so `onSend` can receive `""` for an attachment-only message. Its signature remains `(message: string) => void`; the host reads completed items from its queue in that callback, creates `ChatAttachment` records, accepts the message, and then clears the completed queue and draft. The [catalog's `send` function](../apps/catalog/src/rich-chat-example.tsx) shows this complete flow.

| Record or option | Purpose |
| --- | --- |
| `ChatAttachment.id`, `name` | Stable record identity and visible filename. |
| `sizeBytes`, `mediaType`, `description` | Optional metadata and explanatory text. |
| `href`, `downloadHref` | Application-authorized open and download locations. |
| `previewUrl` | Application-authorized image preview; displayed only for an image media type. |
| `unavailable` | Suppresses the record's links and preview while retaining its filename. |
| `ChatComposerAttachments.pendingMessage` | Explains why pending or failed files block sending. |

`ChatAttachments` renders the same message list outside chat and accepts label overrides. An unavailable record keeps its name and explanation. A broken image preview reports that the preview is unavailable while leaving an authorized file link usable. The host owns stored file IDs, signed URL refresh, content scanning, permissions and deletion. It also owns object URL lifetimes: retain URLs while a draft or message uses them, then revoke them. The catalog example ties draft URLs to the selected `File`, since progress can render before an upload result arrives. Sending transfers ownership synchronously before clearing the queue. Its messages are append-only, so sent URLs remain valid until unmount; an application that deletes messages must release their unused URLs too.

## Sources and citations

Set `message.sources` to `ChatSource` records with stable `id`, `title`, optional `href`, optional plain-text `preview`, and optional `unavailable`. The numbered list is the citation index for that message. Sources keep their title when a URL is missing, rejected or unavailable. Preview buttons open the existing popover, and Escape or the close button returns focus to the trigger. The kit never fetches a preview or infers a source's accuracy or access permissions.

`ChatSources` is also exported for independent use. Its `labels` can translate the source heading, preview action, unavailable state and close action. Supply translated source titles and previews as application data. Set `dir="rtl"` on the chat or standalone components for right-to-left interfaces; code remains left-to-right.

## Streaming and layout

Keep the same message `id` while replacing its content, and set the chat's `status` to `"streaming"`. Unfinished fences and other partial Markdown are parsed as the available text; the renderer does not invent missing words. Code and tables have named keyboard-focusable scroll regions. The message list retains its existing scroll-follow behavior and jump-to-latest control. Stopping the response leaves the current partial content visible.

The composer and file list stay mounted as progress changes. The upload area has its own bounded scroll region so long queues do not consume the entire chat. Use the existing theme and mode controls to preview the same content; rich content styles use semantic tokens. The components add no entrance or token-by-token animation and inherit the kit's reduced-motion behavior.
