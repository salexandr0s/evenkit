"use client";

import { useId, useState, type Ref } from "react";
import { Button } from "./button.js";
import { IconButton } from "./icon-button.js";
import { Input } from "./field.js";
import { MessageSquareIcon, PlusIcon, SearchIcon, TrashIcon } from "./icons.js";
import type { ChatConversation, ChatLabels } from "./chat-types.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

interface ChatHistoryProps {
  conversations: readonly ChatConversation[];
  activeConversationId?: string | undefined;
  labels: ChatLabels;
  searchRef: Ref<HTMLInputElement>;
  onSelect?: ((id: string) => void) | undefined;
  onNew?: (() => void) | undefined;
  onDelete?: ((id: string) => void) | undefined;
}

export function ChatHistory({ conversations, activeConversationId, labels, searchRef, onSelect, onNew, onDelete }: ChatHistoryProps) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const search = query.trim().toLocaleLowerCase();
  const matches = conversations.filter(chat => `${chat.title} ${chat.description ?? ""}`.toLocaleLowerCase().includes(search));
  return <>
    <div className="pk-chat-history-heading">
      <h3>{labels.history}</h3>
      {onNew && <IconButton label={labels.newChat} size="sm" onClick={() => { setQuery(""); onNew(); }}><PlusIcon size="sm" /></IconButton>}
      <label htmlFor={searchId} className="pk-chat-visually-hidden">{labels.searchChats}</label>
      <Input id={searchId} ref={searchRef} type="search" placeholder={labels.searchChats} value={query} onChange={event => setQuery(event.target.value)} startAdornment={<SearchIcon size="sm" />} />
    </div>
    <nav className="pk-chat-history-list" aria-label={labels.history}>
      {matches.length ? matches.map(chat => <div key={chat.id} className="pk-chat-history-item" data-active={chat.id === activeConversationId || undefined}>
        <button className="pk-chat-history-select" type="button" aria-label={chat.title} aria-current={chat.id === activeConversationId ? "true" : undefined} disabled={!onSelect} onClick={() => onSelect?.(chat.id)}>
          <MessageSquareIcon size="sm" />
          <span><strong>{chat.title}</strong>{chat.description && <small>{chat.description}</small>}</span>
        </button>
        {onDelete && <Tooltip>
          <TooltipTrigger asChild><Button className="pk-chat-history-delete" variant="ghost" size="sm" shape="icon" aria-label={`${labels.deleteChat}: ${chat.title}`} onClick={() => onDelete(chat.id)}><TrashIcon size="sm" /></Button></TooltipTrigger>
          <TooltipContent>{`${labels.deleteChat}: ${chat.title}`}</TooltipContent>
        </Tooltip>}
      </div>) : <p className="pk-chat-history-empty" role="status">{search ? labels.noMatches : labels.noChats}</p>}
    </nav>
  </>;
}
