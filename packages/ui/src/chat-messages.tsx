"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { foundation } from "@evenkit/tokens";
import { Button } from "./button.js";
import { Spinner } from "./feedback.js";
import { ArrowDownIcon, CheckIcon, CopyIcon, MessageSquareIcon, RotateCcwIcon } from "./icons.js";
import type { ChatLabels, ChatMessage, ChatStatus } from "./chat-types.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";
import { ChatMarkdown } from "./chat-markdown.js";
import { ChatAttachments } from "./chat-attachments.js";
import { ChatSources } from "./chat-sources.js";

interface ChatMessagesProps {
  dir?: string | undefined;
  messages: readonly ChatMessage[];
  activeConversationId?: string | undefined;
  status: ChatStatus;
  error?: string | undefined;
  labels: ChatLabels;
  suggestions: readonly string[];
  onSuggestion: (text: string) => void;
  onRetry?: (() => void) | undefined;
  renderMessage?: ((message: ChatMessage) => ReactNode) | undefined;
}

function Message({ message, labels, copyable, streaming, renderMessage, dir }: { message: ChatMessage; labels: ChatLabels; copyable: boolean; streaming: boolean; renderMessage?: ChatMessagesProps["renderMessage"]; dir?: string | undefined }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [copiedContent, setCopiedContent] = useState("");
  const copied = copyState === "copied" && copiedContent === message.content;
  async function copy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedContent(message.content);
      setCopyState("copied");
    } catch { setCopyState("error"); }
  }
  return <article className="pk-chat-message" data-role={message.role} data-has-attachments={Boolean(message.attachments?.length) || undefined}>
    <div className="pk-chat-message-author">{message.role === "assistant" && <MessageSquareIcon size="sm" />}<span>{message.role === "user" ? labels.user : labels.assistant}</span></div>
    {(renderMessage || message.content || !(message.attachments?.length || message.sources?.length)) && <div className="pk-chat-message-content">{renderMessage ? renderMessage(message) : message.format === "markdown" ? <ChatMarkdown content={message.content} streaming={streaming} /> : message.content}</div>}
    {message.attachments && <ChatAttachments attachments={message.attachments} />}
    {message.sources && <ChatSources sources={message.sources} dir={dir} />}
    {copyable && message.content.trim() && <div className="pk-chat-message-actions">
      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="xs" shape="icon" aria-label={copied ? labels.copied : labels.copy} onClick={() => { void copy(); }}>{copied ? <CheckIcon size="sm" /> : <CopyIcon size="sm" />}</Button></TooltipTrigger><TooltipContent>{copied ? labels.copied : labels.copy}</TooltipContent></Tooltip>
      <span className={copyState === "error" ? "pk-chat-copy-error" : "pk-chat-visually-hidden"} role="status">{copyState === "error" ? labels.copyFailed : copied ? labels.copied : ""}</span>
    </div>}
  </article>;
}

export function ChatMessages({ messages, activeConversationId, status, error, labels, suggestions, onSuggestion, onRetry, renderMessage, dir }: ChatMessagesProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  const previousConversation = useRef(activeConversationId);
  const lastUser = [...messages].reverse().find(message => message.role === "user");
  const previousUser = useRef(lastUser?.id);
  const [showJump, setShowJump] = useState(false);
  const busy = status === "submitted" || status === "streaming";
  const lastAssistant = [...messages].reverse().find(message => message.role === "assistant");
  const streamingMessageId = status === "streaming" && messages[messages.length - 1]?.role === "assistant" ? messages[messages.length - 1]?.id : undefined;
  function scrollToLatest() {
    const node = viewport.current;
    if (node) node.scrollTop = node.scrollHeight;
    following.current = true;
    setShowJump(false);
  }
  useLayoutEffect(() => {
    if (previousConversation.current !== activeConversationId || previousUser.current !== lastUser?.id) {
      following.current = true;
      previousConversation.current = activeConversationId;
      previousUser.current = lastUser?.id;
    }
    if (following.current) scrollToLatest();
    else setShowJump(true);
  }, [messages, status, activeConversationId, lastUser?.id]);
  useLayoutEffect(() => {
    const node = viewport.current;
    const body = content.current;
    if (!node || !body) return;
    const observer = new ResizeObserver(() => { if (following.current) scrollToLatest(); });
    observer.observe(node);
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  return <div className="pk-chat-transcript">
    <div ref={viewport} className="pk-chat-messages" role="region" aria-label={labels.conversation} tabIndex={0} onScroll={() => {
      const node = viewport.current;
      if (!node) return;
      following.current = node.scrollHeight - node.scrollTop - node.clientHeight <= Number.parseFloat(foundation.space["16"]);
      setShowJump(!following.current);
    }}>
      <div ref={content} className="pk-chat-message-stack">
        {messages.length === 0 && !busy && status !== "error" && <div className="pk-chat-empty">
          <span className="pk-chat-empty-icon" aria-hidden="true"><MessageSquareIcon size="lg" /></span>
          <h3>{labels.emptyTitle}</h3><p>{labels.emptyDescription}</p>
          {suggestions.length > 0 && <div className="pk-chat-suggestions" aria-label={labels.suggestions}>
            {suggestions.map((suggestion, index) => <Button key={`${index}-${suggestion}`} variant="outline" onClick={() => onSuggestion(suggestion)}>{suggestion}</Button>)}
          </div>}
        </div>}
        {messages.map(message => <Message key={message.id} message={message} labels={labels} dir={dir} renderMessage={renderMessage} streaming={message.id === streamingMessageId} copyable={message.role === "assistant" && message.id !== streamingMessageId} />)}
        {busy && <div className="pk-chat-responding"><Spinner aria-hidden="true" /><span>{labels.responding}</span></div>}
        {status === "error" && <div className="pk-chat-error" role="alert"><p>{error || labels.error}</p>{onRetry && <Button variant="outline" size="sm" startIcon={<RotateCcwIcon size="sm" />} onClick={onRetry}>{labels.retry}</Button>}</div>}
        {status === "idle" && lastUser && onRetry && <div className="pk-chat-retry"><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="xs" shape="icon" aria-label={labels.retry} onClick={onRetry}><RotateCcwIcon size="sm" /></Button></TooltipTrigger><TooltipContent>{labels.retry}</TooltipContent></Tooltip></div>}
      </div>
    </div>
    {showJump && <div className="pk-chat-jump"><Tooltip><TooltipTrigger asChild><Button variant="secondary" size="xs" shape="icon" aria-label={labels.jumpToLatest} onClick={() => { viewport.current?.focus({ preventScroll: true }); scrollToLatest(); }}><ArrowDownIcon size="sm" /></Button></TooltipTrigger><TooltipContent>{labels.jumpToLatest}</TooltipContent></Tooltip></div>}
    <span className="pk-chat-visually-hidden" role="status">{busy ? labels.responding : status === "idle" ? lastAssistant?.content : ""}</span>
  </div>;
}
