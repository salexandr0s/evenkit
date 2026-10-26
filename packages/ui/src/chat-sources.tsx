"use client";

import { useId, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { EyeIcon, XIcon } from "./icons.js";
import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "./overlays.js";
import { safeChatUrl } from "./rich-chat-urls.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

/** Applications supply citation data and decide whether a source is accessible. */
export interface ChatSource {
  id: string;
  title: string;
  href?: string;
  /** Plain text supplied by the application; the kit never fetches a source. */
  preview?: string;
  unavailable?: boolean;
}

export interface ChatSourcesLabels {
  sources: string;
  preview: string;
  unavailable: string;
  close: string;
}

export interface ChatSourcesProps extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  sources: readonly ChatSource[];
  labels?: Partial<ChatSourcesLabels>;
}

const defaultLabels: ChatSourcesLabels = {
  sources: "Sources", preview: "Preview", unavailable: "Source unavailable", close: "Close preview",
};

function SourcePreview({ source, labels, available, dir }: {
  source: ChatSource; labels: ChatSourcesLabels; available: boolean; dir: ChatSourcesProps["dir"];
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const excerpt = useRef<HTMLParagraphElement>(null);
  const restoringFocus = useRef(false);
  return <Popover open={open} onOpenChange={setOpen}>
    <Tooltip>
      <TooltipTrigger asChild onFocus={event => { if (restoringFocus.current) event.preventDefault(); }}>
        <PopoverTrigger asChild><Button ref={trigger} size="xs" variant="ghost" shape="icon" aria-label={`${labels.preview}: ${source.title}`}><EyeIcon size="sm" /></Button></PopoverTrigger>
      </TooltipTrigger>
      {/* Remove the hint's closing layer so Escape belongs to the open preview. */}
      {!open && <TooltipContent>{labels.preview}: {source.title}</TooltipContent>}
    </Tooltip>
    <PopoverContent className="pk-chat-source-preview" dir={dir} onOpenAutoFocus={event => {
      event.preventDefault();
      excerpt.current?.focus();
    }} onCloseAutoFocus={event => {
      // Restoring focus must not open a hint that consumes the enclosing chat's Escape.
      event.preventDefault();
      restoringFocus.current = true;
      trigger.current?.focus();
      restoringFocus.current = false;
    }}>
      <div className="pk-chat-source-preview-heading">
        <PopoverTitle>{source.title}</PopoverTitle>
        <Tooltip><TooltipTrigger asChild><PopoverClose asChild><Button size="xs" variant="ghost" shape="icon" aria-label={labels.close}><XIcon size="sm" /></Button></PopoverClose></TooltipTrigger>{open && <TooltipContent>{labels.close}</TooltipContent>}</Tooltip>
      </div>
      <PopoverDescription ref={excerpt} className="pk-chat-source-excerpt" tabIndex={0}>{source.preview}</PopoverDescription>
      {!available && <p>{labels.unavailable}</p>}
    </PopoverContent>
  </Popover>;
}

/** A numbered source list with keyboard-accessible links and optional previews. */
export function ChatSources({ sources, labels: customLabels, className, dir, ...props }: ChatSourcesProps) {
  const headingId = useId();
  const labels = { ...defaultLabels, ...customLabels };
  if (!sources.length) return null;
  return <TooltipProvider><section {...props} dir={dir} className={classes("pk-chat-sources", className)} aria-labelledby={headingId}>
    <h4 id={headingId}>{labels.sources}</h4>
    <ol>{sources.map(source => {
      const href = source.unavailable ? undefined : safeChatUrl(source.href);
      return <li key={source.id}>
        <div className="pk-chat-source-row">
          <div className="pk-chat-source-name">
            {href ? <a href={href} rel="noreferrer">{source.title}</a> : <span>{source.title}</span>}
            {!href && <small>{labels.unavailable}</small>}
          </div>
          {source.preview && <SourcePreview source={source} labels={labels} available={!!href} dir={dir} />}
        </div>
      </li>;
    })}</ol>
  </section></TooltipProvider>;
}
