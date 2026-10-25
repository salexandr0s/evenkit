import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type * as DialogPrimitive from "@radix-ui/react-dialog";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  description?: string;
}

export type ChatStatus = "idle" | "submitted" | "streaming" | "error";

/** Override visible text and accessible control names for your product or locale. */
export interface ChatLabels {
  assistant: string;
  user: string;
  message: string;
  placeholder: string;
  send: string;
  stop: string;
  retry: string;
  copy: string;
  copied: string;
  copyFailed: string;
  responding: string;
  error: string;
  emptyTitle: string;
  emptyDescription: string;
  suggestions: string;
  history: string;
  showHistory: string;
  hideHistory: string;
  searchChats: string;
  noChats: string;
  noMatches: string;
  newChat: string;
  deleteChat: string;
  maximize: string;
  restore: string;
  close: string;
  conversation: string;
  jumpToLatest: string;
  composerHint: string;
  characterLimit: string;
}

export const defaultChatLabels: ChatLabels = {
  assistant: "Assistant", user: "You", message: "Message", placeholder: "Write a message…",
  send: "Send message", stop: "Stop response", retry: "Retry response", copy: "Copy response",
  copied: "Copied", copyFailed: "Could not copy. Select the response to copy it.",
  responding: "Assistant is responding", error: "The response could not be completed. Try again.",
  emptyTitle: "What can I help with?", emptyDescription: "Ask a question or choose a starting point.",
  suggestions: "Suggested prompts", history: "Chat history", showHistory: "Show chat history",
  hideHistory: "Hide chat history", searchChats: "Search chats", noChats: "No chats yet.",
  noMatches: "No chats match your search.", newChat: "New chat", deleteChat: "Delete chat",
  maximize: "Maximize chat", restore: "Restore chat", close: "Close chat", conversation: "Conversation",
  jumpToLatest: "Jump to latest", composerHint: "Enter to send · Shift + Enter for a new line",
  characterLimit: "Character limit reached",
};

export interface ChatPanelProps extends Omit<ComponentPropsWithoutRef<"div">, "title" | "children" | "onSubmit"> {
  messages: readonly ChatMessage[];
  conversations?: readonly ChatConversation[];
  activeConversationId?: string;
  /** Draft state belongs to the host so closing the widget does not discard it. */
  value: string;
  onValueChange: (value: string) => void;
  /** The host accepts the message, clears its draft, and sets the response status. */
  onSend: (message: string) => void;
  onSelectConversation?: (id: string) => void;
  onNewConversation?: () => void;
  onDeleteConversation?: (id: string) => void;
  status?: ChatStatus;
  error?: string;
  onStop?: () => void;
  onRetry?: () => void;
  suggestions?: readonly string[];
  /** Safe plain text is the default. Rich text rendering is supplied by the host. */
  renderMessage?: (message: ChatMessage) => ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  labels?: Partial<ChatLabels>;
  maxLength?: number;
}

export interface ChatWidgetProps extends ChatPanelProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  maximized?: boolean;
  defaultMaximized?: boolean;
  onMaximizedChange?: (maximized: boolean) => void;
  launcherLabel?: string;
  launcherIcon?: ReactNode;
  container?: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>["container"];
}
