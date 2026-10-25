# Reusable AI chat

`ChatWidget` provides a launcher, compact modal chat, and maximized workspace. `ChatPanel` embeds the same conversation UI in a page. Both use the kit's current theme and accept application-owned messages, drafts, response state, and conversation history.

Import `@project-kit/tokens/css` before `@project-kit/ui/css`. In Next.js, render the chat from a client component and import the styles in your root layout. The [catalog example](../apps/catalog/src/chat-preview.tsx) demonstrates conversation switching, simulated responses, stop, retry, and deletion without an AI service.

## Connect a reply handler

The application accepts a submitted message, clears the draft, and updates `status`. The component calls `onSend` with trimmed text; it does not clear the controlled value or append messages itself. This example accepts a reply function from your application:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChatWidget, type ChatMessage, type ChatStatus } from "@project-kit/ui";

type Reply = (messages: readonly ChatMessage[], signal: AbortSignal) => Promise<string>;

export function ProjectAssistant({ reply }: { reply: Reply }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const pending = useRef<AbortController | null>(null);

  useEffect(() => () => pending.current?.abort(), []);

  async function send(content: string) {
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    const next: ChatMessage[] = [...messages, {
      id: crypto.randomUUID(), role: "user", content,
    }];
    setMessages(next);
    setDraft("");
    setStatus("submitted");
    try {
      const content = await reply(next, controller.signal);
      if (pending.current !== controller || controller.signal.aborted) return;
      setMessages(previous => [...previous, {
        id: crypto.randomUUID(), role: "assistant", content,
      }]);
      setStatus("idle");
    } catch {
      if (pending.current === controller && !controller.signal.aborted) {
        setStatus("error");
      }
    } finally {
      if (pending.current === controller) pending.current = null;
    }
  }

  function stop() {
    pending.current?.abort();
    pending.current = null;
    setStatus("idle");
  }

  return <ChatWidget
    title="Project assistant"
    messages={messages}
    value={draft}
    onValueChange={setDraft}
    onSend={content => { void send(content); }}
    status={status}
    onStop={stop}
  />;
}
```

Set `status="streaming"` while replacing the content of the same assistant message as chunks arrive. Stable message IDs preserve the message's identity. Supply `onRetry` to show a retry action; keep the failed request in application state so retry does not append a duplicate user message. Supply `error` to describe a recoverable failure in your own wording.

## Conversation history and persistence

Pass `conversations` as `{ id, title, description? }` records, `activeConversationId`, and the messages for that conversation. `onSelectConversation(id)`, `onNewConversation()`, and `onDeleteConversation(id)` report user actions. The application updates the arrays and selected ID. Omit an optional callback when that action is unavailable; handle any deletion confirmation in the application.

Store drafts by conversation ID if users should retain unfinished messages when switching chats. Before switching or deleting an active conversation, abort its request and invalidate its request ID. Check both conversation and request IDs before applying a response, including error and completion callbacks. An older request must never update the newly selected chat. Closing the widget only changes visibility; use `onOpenChange` if your application also needs to stop a response when closed.

Choose persistence for each project: React state for a temporary session, namespaced browser storage for local history, or your authenticated service for saved chats. The UI package does not make network requests or write chat data to browser storage. The application owns authentication, access checks, validation, and retention.

## Layout, content, and accessibility

| Option | Use |
| --- | --- |
| `ChatWidget` | Floating launcher with a modal compact view and a maximized workspace. |
| `ChatPanel` | Embedded chat within your page layout; use `className` or `style` to size its container. |
| `open`, `onOpenChange` | Control visibility from the application, or use `defaultOpen` for internal state. |
| `maximized`, `onMaximizedChange` | Control expansion, or use `defaultMaximized` for internal state. |
| `title`, `description`, `footer` | Product identity, context, and optional footer content. |
| `launcherLabel`, `launcherIcon` | Launcher wording and decorative icon. |
| `labels` | Override visible labels, hints, and accessible control names for your locale. |
| `renderMessage(message)` | Render application-specific Markdown, citations, or other content. |
| `maxLength` | Limit the draft's length. |
| `container` | Choose the widget portal container. Themes normally belong on the document. |

The default renderer displays escaped text and preserves line breaks. A custom renderer owns the safety of HTML and links it introduces. Keep rendered content keyboard accessible and preserve readable wrapping; application content can use the same semantic token variables as the chat.

Enter sends a nonempty message, Shift+Enter inserts a new line, and IME composition does not send prematurely. A pending response prevents another send; provide `onStop` to let the user cancel it. Choosing a suggested prompt fills and focuses the draft so the user can edit it before sending. The message list follows incoming content while the reader is at the bottom and offers a jump action after they scroll up.

The widget traps focus while open. Escape first hides open history, then restores a maximized chat, then closes the compact chat and returns focus to the launcher. The close button closes either size directly. Maximizing changes the existing dialog layout, preserving the draft. History uses named controls and marks the selected conversation; narrow layouts keep history available through its toggle. Use `dir="rtl"` and translated `labels` for right-to-left interfaces.
