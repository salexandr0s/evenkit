import { createElement, createRef, type ReactNode } from "react";
import { renderToStaticMarkup as renderMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChatAttachments } from "./chat-attachments.js";
import { ChatComposer } from "./chat-composer.js";
import { ChatMessages } from "./chat-messages.js";
import { ChatSources } from "./chat-sources.js";
import { defaultChatLabels } from "./chat-types.js";
import type { UploadQueueController, UploadState } from "./upload-queue.js";
import { TooltipProvider } from "./tooltip.js";

function renderToStaticMarkup(node: ReactNode) {
  return renderMarkup(createElement(TooltipProvider, null, node));
}

describe("rich chat integration boundaries", () => {
  it("keeps plain text and custom renderMessage precedence", () => {
    const props = { messages: [{ id: "text", role: "assistant" as const, content: "**plain** <b>text</b>" }], status: "idle" as const, labels: defaultChatLabels, suggestions: [], onSuggestion() {} };
    expect(renderToStaticMarkup(createElement(ChatMessages, props))).toContain("**plain** &lt;b&gt;text&lt;/b&gt;");
    const html = renderToStaticMarkup(createElement(ChatMessages, { ...props, messages: [{ ...props.messages[0]!, format: "markdown" }], renderMessage: () => "Host content" }));
    expect(html).toContain("Host content");
    expect(html).not.toContain('class="pk-chat-markdown"');
  });

  it("removes forbidden and unavailable source and attachment URLs", () => {
    const sources = renderToStaticMarkup(createElement(ChatSources, { sources: [
      { id: "unsafe", title: "Unsafe source", href: "javascript:alert(1)" },
      { id: "private", title: "Private source", href: "/private", unavailable: true },
    ] }));
    expect(sources).not.toContain("href=");
    expect(sources.match(/Source unavailable/g)).toHaveLength(2);
    const files = renderToStaticMarkup(createElement(ChatAttachments, { attachments: [
      { id: "bad", name: "Bad file", href: "data:text/html,x", previewUrl: "https://example.com/private.png", mediaType: "image/png" },
      { id: "private", name: "Private file", href: "/private", downloadHref: "/private", unavailable: true },
    ] }));
    expect(files).not.toContain("href=");
    expect(files).not.toContain("<img");
    expect(files.match(/Attachment unavailable/g)).toHaveLength(2);
  });

  it("gates attachment-only sends on completion and filters composer result links", () => {
    function composer(state: UploadState) {
      const queue: UploadQueueController = {
        items: [{ id: "file", file: new File(["notes"], "notes.txt"), state, result: { href: "javascript:alert(1)", downloadHref: "data:text/html,x" } }],
        maxFiles: 1, addFiles: () => ({ acceptedIds: [], rejected: [] }), start() {}, cancel() {}, cancelAll() {}, retry() {}, remove() {}, clearCompleted() {},
      };
      return renderToStaticMarkup(createElement(ChatComposer, { value: "", onValueChange() {}, onSend() {}, status: "idle", labels: defaultChatLabels, maxLength: 4000, textareaRef: createRef<HTMLTextAreaElement>(), attachments: { queue } }));
    }
    for (const state of ["queued", "uploading", "error", "cancelled"] as const) {
      expect(composer(state)).toMatch(/<button[^>]+type="submit"[^>]+disabled=""/);
    }
    const complete = composer("complete");
    expect(complete).not.toMatch(/<button[^>]+type="submit"[^>]+disabled=""/);
    expect(complete).not.toContain("href=");
  });
});
