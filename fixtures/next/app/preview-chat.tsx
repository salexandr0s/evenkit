"use client";

import { useState } from "react";
import { ChatPanel, type ChatConversation, type ChatMessage } from "@evenkit/ui";

const conversations: readonly ChatConversation[] = [{ id: "package", title: "Package check", description: "Local fixture messages" }];

export function PreviewChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "This response comes from local fixture state." },
    { id: "rich", role: "assistant", format: "markdown", content: "## Packed rich chat\n\n| State | Value |\n| --- | --- |\n| Package | Ready |\n\n```ts\nconst ready = true;\n```", sources: [{ id: "reference", title: "Markdown reference", href: "https://commonmark.org/help/", preview: "Markdown syntax examples." }], attachments: [{ id: "missing", name: "Archived notes.txt", unavailable: true }] },
  ]);
  const [draft, setDraft] = useState("");

  function send(content: string) {
    const id = crypto.randomUUID();
    setMessages(previous => [...previous,
      { id, role: "user", content },
      { id: `${id}-reply`, role: "assistant", content: "The installed chat component received your message." },
    ]);
    setDraft("");
  }

  return <ChatPanel title="Package assistant" messages={messages} conversations={conversations} activeConversationId="package" value={draft} onValueChange={setDraft} onSend={send} footer="Local package preview" />;
}
