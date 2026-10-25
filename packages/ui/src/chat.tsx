"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { foundation } from "@project-kit/tokens";
import { forwardRef, useCallback, useId, useImperativeHandle, useLayoutEffect, useRef, useState, type Ref } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { ChatComposer } from "./chat-composer.js";
import { ChatHistory } from "./chat-history.js";
import { ChatMessages } from "./chat-messages.js";
import { defaultChatLabels, type ChatPanelProps, type ChatWidgetProps } from "./chat-types.js";
import { MaximizeIcon, MessageSquareIcon, MinimizeIcon, PanelLeftIcon, PlusIcon, XIcon } from "./icons.js";

export type { ChatMessage, ChatConversation, ChatStatus, ChatLabels, ChatPanelProps, ChatWidgetProps } from "./chat-types.js";

interface ChatSurfaceHandle {
  closeHistory: () => boolean;
  focusComposer: () => void;
}

interface ChatSurfaceProps extends ChatPanelProps {
  expanded: boolean;
  elementRef?: Ref<HTMLDivElement>;
  onMaximize?: () => void;
  onClose?: () => void;
  dialog?: boolean;
}

const ChatSurface = forwardRef<ChatSurfaceHandle, ChatSurfaceProps>(function ChatSurface({
  messages, conversations, activeConversationId, value, onValueChange, onSend, onSelectConversation,
  onNewConversation, onDeleteConversation, status = "idle", error, onStop, onRetry,
  suggestions = [], renderMessage, title = "Assistant", description, footer, labels: customLabels,
  maxLength = 4000, expanded, onMaximize, onClose, dialog = false, elementRef, className, onKeyDown, ...props
}, ref) {
  const labels = { ...defaultChatLabels, ...customLabels };
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLDivElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const historyToggle = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [wide, setWide] = useState(false);
  const [historyPreference, setHistoryPreference] = useState<boolean>();
  const historyId = useId();
  const hasHistory = conversations !== undefined;
  const historyOpen = hasHistory && (historyPreference ?? (expanded && wide));
  const historyReplacesMain = historyOpen && !wide;
  const previousExpanded = useRef(expanded);
  const setElement = useCallback((node: HTMLDivElement | null) => {
    root.current = node;
    if (typeof elementRef === "function") return elementRef(node);
    if (elementRef) elementRef.current = node;
  }, [elementRef]);

  function closeHistory() {
    if (!historyOpen) return false;
    setHistoryPreference(false);
    historyToggle.current?.focus();
    return true;
  }
  function focusComposer() { composer.current?.focus(); }
  useImperativeHandle(ref, () => ({ closeHistory, focusComposer }));
  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    const update = () => {
      const nextWide = node.clientWidth > Number.parseFloat(foundation.breakpoint.md);
      const nextHistory = hasHistory && (historyPreference ?? (expanded && nextWide));
      // Move focus before the responsive update hides its current pane.
      if (!nextHistory && sidebar.current?.contains(document.activeElement)) historyToggle.current?.focus();
      else if (nextHistory && !nextWide && main.current?.contains(document.activeElement)) search.current?.focus();
      setWide(nextWide);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [expanded, hasHistory, historyPreference]);
  useLayoutEffect(() => {
    if (previousExpanded.current !== expanded) {
      previousExpanded.current = expanded;
      setHistoryPreference(undefined);
    }
  }, [expanded]);
  useLayoutEffect(() => {
    if (historyReplacesMain && main.current?.contains(document.activeElement)) search.current?.focus();
    else if (!historyOpen && sidebar.current?.contains(document.activeElement)) historyToggle.current?.focus();
  }, [historyOpen, historyReplacesMain]);

  function returnToConversation() {
    if (!wide) setHistoryPreference(false);
    // The composer remains mounted while history occupies the narrow panel.
    requestAnimationFrame(focusComposer);
  }

  const Title = dialog ? DialogPrimitive.Title : "h2";
  const Description = dialog ? DialogPrimitive.Description : "p";
  return <div {...props} ref={setElement} className={classes("pk-chat-panel", className)} data-mode={expanded ? "expanded" : "compact"} data-wide={wide} data-history={historyOpen} onKeyDown={event => {
    onKeyDown?.(event);
    if (!dialog && !event.defaultPrevented && event.key === "Escape" && closeHistory()) event.preventDefault();
  }}>
    <header className="pk-chat-header">
      {hasHistory && <Button ref={historyToggle} variant="ghost" size="sm" shape="icon" aria-label={historyOpen ? labels.hideHistory : labels.showHistory} aria-controls={historyId} aria-expanded={historyOpen} onClick={() => {
        setHistoryPreference(!historyOpen);
        if (!historyOpen && !wide) requestAnimationFrame(() => search.current?.focus());
      }}><PanelLeftIcon /></Button>}
      <div className="pk-chat-heading"><Title className="pk-chat-title">{title}</Title>{description && <Description className="pk-chat-description">{description}</Description>}</div>
      <div className="pk-chat-header-actions">
        {onNewConversation && !historyOpen && <Button variant="ghost" size="sm" shape="icon" aria-label={labels.newChat} onClick={() => { onNewConversation(); returnToConversation(); }}><PlusIcon /></Button>}
        {onMaximize && <Button variant="ghost" size="sm" shape="icon" aria-label={expanded ? labels.restore : labels.maximize} onClick={onMaximize}>{expanded ? <MinimizeIcon /> : <MaximizeIcon />}</Button>}
        {onClose && <Button variant="ghost" size="sm" shape="icon" aria-label={labels.close} onClick={onClose}><XIcon /></Button>}
      </div>
    </header>
    <div className="pk-chat-body">
      {hasHistory && <aside ref={sidebar} id={historyId} className="pk-chat-history" hidden={!historyOpen} aria-label={labels.history} onBlurCapture={event => {
        if (!event.relatedTarget && event.currentTarget.hidden) historyToggle.current?.focus();
      }}>
        <ChatHistory conversations={conversations} activeConversationId={activeConversationId} labels={labels} searchRef={search}
          onSelect={onSelectConversation ? id => { onSelectConversation(id); returnToConversation(); } : undefined}
          onNew={onNewConversation ? () => { onNewConversation(); returnToConversation(); } : undefined}
          onDelete={onDeleteConversation ? id => { search.current?.focus(); onDeleteConversation(id); } : undefined} />
      </aside>}
      <div ref={main} className="pk-chat-main" hidden={historyReplacesMain} onBlurCapture={event => {
        if (!event.relatedTarget && event.currentTarget.hidden) search.current?.focus();
      }}>
        <ChatMessages messages={messages} activeConversationId={activeConversationId} status={status} error={error} labels={labels} suggestions={suggestions} renderMessage={renderMessage} onRetry={onRetry} onSuggestion={text => { onValueChange(text); focusComposer(); }} />
        <ChatComposer value={value} onValueChange={onValueChange} onSend={onSend} onStop={onStop} status={status} labels={labels} maxLength={Number.isFinite(maxLength) && maxLength > 0 ? Math.max(1, Math.floor(maxLength)) : 4000} textareaRef={composer} />
        {footer && <div className="pk-chat-footer">{footer}</div>}
      </div>
    </div>
  </div>;
});

/** Embedded chat workspace. The host owns records, draft, and response lifecycle. */
export const ChatPanel = forwardRef<HTMLDivElement, ChatPanelProps>(function ChatPanel(props, ref) {
  return <ChatSurface {...props} elementRef={ref} expanded />;
});

/** Floating launcher with compact and maximized views of the same chat surface. */
export function ChatWidget({
  open: controlledOpen, defaultOpen = false, onOpenChange,
  maximized: controlledMaximized, defaultMaximized = false, onMaximizedChange,
  launcherLabel = "Open chat", launcherIcon, container, dir, ...props
}: ChatWidgetProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const [localMaximized, setLocalMaximized] = useState(defaultMaximized);
  const open = controlledOpen ?? localOpen;
  const maximized = controlledMaximized ?? localMaximized;
  const surface = useRef<ChatSurfaceHandle>(null);
  const [viewportNode, setViewportNode] = useState<HTMLDivElement | null>(null);
  const setOpen = (next: boolean) => { if (controlledOpen === undefined) setLocalOpen(next); onOpenChange?.(next); };
  const setMaximized = (next: boolean) => { if (controlledMaximized === undefined) setLocalMaximized(next); onMaximizedChange?.(next); };

  useLayoutEffect(() => {
    if (!open) return;
    const node = viewportNode;
    const visual = window.visualViewport;
    if (!node || !visual) return;
    const update = () => {
      node.style.setProperty("--pk-chat-viewport-height", `${visual.height}px`);
      node.style.setProperty("--pk-chat-viewport-top", `${visual.offsetTop}px`);
    };
    update();
    visual.addEventListener("resize", update);
    visual.addEventListener("scroll", update);
    return () => { visual.removeEventListener("resize", update); visual.removeEventListener("scroll", update); };
  }, [open, viewportNode]);

  return <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
    <DialogPrimitive.Trigger asChild><Button className="pk-chat-launcher" size="lg" dir={dir} data-open={open || undefined} startIcon={launcherIcon ?? <MessageSquareIcon />}>{launcherLabel}</Button></DialogPrimitive.Trigger>
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className="pk-chat-overlay" />
      <DialogPrimitive.Content ref={setViewportNode} dir={dir} className="pk-chat-widget" data-maximized={maximized} {...(props.description ? {} : { "aria-describedby": undefined })}
        onOpenAutoFocus={event => { event.preventDefault(); surface.current?.focusComposer(); }}
        onEscapeKeyDown={event => {
          if (surface.current?.closeHistory()) event.preventDefault();
          else if (maximized) { event.preventDefault(); setMaximized(false); }
        }}>
        <ChatSurface {...props} dir={dir} ref={surface} dialog expanded={maximized} onMaximize={() => setMaximized(!maximized)} onClose={() => setOpen(false)} />
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>;
}
