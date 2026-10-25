import { useEffect, useRef, useState } from "react";
import { Badge, ChatPanel, ChatWidget, SelectField, type ChatConversation, type ChatMessage, type ChatPanelProps, type ChatStatus } from "@evenkit/ui";
import "./chat-preview.css";

interface DemoConversation extends ChatConversation {
  messages: ChatMessage[];
  draft: string;
}

const initialConversations: DemoConversation[] = [
  { id: "plan", title: "Plan a project", description: "Start a conversation", messages: [], draft: "" },
  { id: "themes", title: "Theme setup", description: "Colors and appearance", draft: "", messages: [
    { id: "theme-question", role: "user", content: "Can the assistant match our brand?" },
    { id: "theme-answer", role: "assistant", content: "Yes. The chat uses the same color, typography, spacing, and motion tokens as the rest of the kit. Try changing Theme or using the sun or moon button above the preview.\n\nYour project supplies the assistant name, introductory text, suggested prompts, and footer." },
  ] },
  { id: "launch", title: "Launch checklist", description: "A saved conversation", draft: "", messages: [
    { id: "launch-question", role: "user", content: "What should we check before launch?" },
    { id: "launch-answer", role: "assistant", content: "Check the main user journey, keyboard navigation, narrow screens, and how the app handles a failed request.\n\nFor the assistant, also check that changing conversations cancels or isolates any pending reply." },
  ] },
];

const suggestions = ["Help me plan a project", "How do themes work?", "What can I reuse?"];
const responseOptions = [
  { value: "stream", label: "Streamed reply" },
  { value: "error", label: "Fail once" },
  { value: "long", label: "Long reply" },
];

function replyFor(text: string, long: boolean) {
  const intro = /theme|brand|color/i.test(text)
    ? "The assistant inherits your project's design tokens. Change Theme or use the sun or moon button to see its surfaces, text, and controls update together."
    : /reuse|component|integrat/i.test(text)
      ? "Use ChatWidget for a floating assistant, or ChatPanel for a dedicated page. Your project supplies messages, conversations, and response callbacks."
      : "Start with the outcome you want, then list the work and the decisions that need an owner. Keep the first version small enough to try with your team.";
  const ending = "\n\nThis is a sample response. In a project, connect the same interface to your AI service and conversation storage.";
  if (!long) return intro + ending;
  return intro + "\n\n" + Array.from({ length: 12 }, (_, index) =>
    `${index + 1}. Review one part of the experience. Try its main action, check the result, and confirm that a failed request offers a useful way to recover. Record any decision that changes the next step.`,
  ).join("\n\n") + ending;
}

export function ChatPreview() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState("plan");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [response, setResponse] = useState("stream");
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const request = useRef(0);
  const pending = useRef(false);
  const active = conversations.find(conversation => conversation.id === activeId)!;

  useEffect(() => () => { request.current += 1; clearInterval(timer.current); }, []);

  function stop() {
    request.current += 1;
    clearInterval(timer.current);
    pending.current = false;
    setStatus("idle");
  }

  function update(id: string, transform: (conversation: DemoConversation) => DemoConversation) {
    setConversations(previous => previous.map(conversation => conversation.id === id ? transform(conversation) : conversation));
  }

  function generate(text: string, retry = false) {
    if (pending.current || !text.trim()) return;
    const id = activeId;
    const generation = ++request.current;
    const assistantId = crypto.randomUUID();
    const fails = response === "error" && !retry;
    const content = replyFor(text, response === "long");
    pending.current = true;
    setStatus("submitted");
    update(id, conversation => {
      const lastUser = [...conversation.messages].reverse().find(message => message.role === "user");
      const lastUserIndex = conversation.messages.findIndex(message => message.id === lastUser?.id);
      const messages = retry ? conversation.messages.slice(0, lastUserIndex + 1) : [...conversation.messages, { id: crypto.randomUUID(), role: "user" as const, content: text }];
      return { ...conversation, messages, draft: retry ? conversation.draft : "", title: conversation.messages.length ? conversation.title : text.slice(0, 48), description: "This visit" };
    });
    let cursor = 0;
    timer.current = setInterval(() => {
      if (request.current !== generation) return;
      if (fails) {
        clearInterval(timer.current);
        pending.current = false;
        setStatus("error");
        setResponse("stream");
        return;
      }
      cursor = Math.min(cursor + (response === "long" ? 48 : 20), content.length);
      const partial: ChatMessage = { id: assistantId, role: "assistant", content: content.slice(0, cursor) };
      update(id, conversation => ({ ...conversation, messages: conversation.messages.some(message => message.id === assistantId)
        ? conversation.messages.map(message => message.id === assistantId ? partial : message)
        : [...conversation.messages, partial] }));
      if (cursor === content.length) {
        clearInterval(timer.current);
        pending.current = false;
        setStatus("idle");
      } else setStatus("streaming");
    }, 100);
  }

  function newConversation() {
    stop();
    const id = crypto.randomUUID();
    setConversations(previous => [{ id, title: "New conversation", description: "This visit", messages: [], draft: "" }, ...previous]);
    setActiveId(id);
  }

  function deleteConversation(id: string) {
    if (id === activeId) stop();
    const remaining = conversations.filter(conversation => conversation.id !== id);
    if (remaining.length === 0) {
      const replacement = { id: crypto.randomUUID(), title: "New conversation", messages: [], draft: "" };
      setConversations([replacement]);
      setActiveId(replacement.id);
    } else {
      setConversations(remaining);
      if (id === activeId) setActiveId(remaining[0]!.id);
    }
  }

  const chat: ChatPanelProps = {
    title: "Project assistant",
    description: "A place to work through your next project.",
    conversations,
    activeConversationId: activeId,
    messages: active.messages,
    value: active.draft,
    onValueChange: draft => update(activeId, conversation => ({ ...conversation, draft })),
    onSend: text => generate(text),
    onStop: stop,
    onRetry: () => {
      const lastQuestion = [...active.messages].reverse().find(message => message.role === "user");
      if (lastQuestion) generate(lastQuestion.content, true);
    },
    onSelectConversation: id => { stop(); setActiveId(id); },
    onNewConversation: newConversation,
    onDeleteConversation: deleteConversation,
    status,
    ...(status === "error" ? { error: "The sample reply failed. Try again to continue this conversation." } : {}),
    suggestions,
    footer: "Sample replies · history lasts for this visit",
  };

  return (
    <div className="chat-workbench">
      <div className="chat-preview-intro">
        <div><Badge tone="accent">Interactive demo</Badge><h3>One assistant, two ways to use it</h3><p>Try the embedded panel below, or open the floating assistant in the corner. Expand it to browse conversations alongside your messages.</p></div>
        <SelectField label="Response preview" options={responseOptions} value={response} onValueChange={setResponse} disabled={status === "submitted" || status === "streaming"} />
      </div>
      <ChatPanel {...chat} className="chat-preview-panel" />
      <p className="catalog-caption">This demo uses sample replies. Your project connects the assistant to its AI service and decides where conversations are saved.</p>
      <ChatWidget {...chat} open={open} onOpenChange={setOpen} launcherLabel="Open assistant" />
    </div>
  );
}
