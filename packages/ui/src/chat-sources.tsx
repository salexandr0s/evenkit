"use client";

import { useId, type ComponentPropsWithoutRef } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "./overlays.js";
import { safeChatUrl } from "./rich-chat-urls.js";

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

/** A numbered source list with keyboard-accessible links and optional previews. */
export function ChatSources({ sources, labels: customLabels, className, dir, ...props }: ChatSourcesProps) {
  const headingId = useId();
  const labels = { ...defaultLabels, ...customLabels };
  if (!sources.length) return null;
  return <section {...props} dir={dir} className={classes("pk-chat-sources", className)} aria-labelledby={headingId}>
    <h4 id={headingId}>{labels.sources}</h4>
    <ol>{sources.map(source => {
      const href = source.unavailable ? undefined : safeChatUrl(source.href);
      return <li key={source.id}>
        <div className="pk-chat-source-row">
          <div className="pk-chat-source-name">
            {href ? <a href={href} rel="noreferrer">{source.title}</a> : <span>{source.title}</span>}
            {!href && <small>{labels.unavailable}</small>}
          </div>
          {source.preview && <Popover>
            <PopoverTrigger asChild><Button size="xs" variant="outline" aria-label={`${labels.preview}: ${source.title}`}>{labels.preview}</Button></PopoverTrigger>
            <PopoverContent className="pk-chat-source-preview" dir={dir}>
              <PopoverTitle>{source.title}</PopoverTitle>
              <PopoverDescription className="pk-chat-source-excerpt" tabIndex={0}>{source.preview}</PopoverDescription>
              {!href && <p>{labels.unavailable}</p>}
              <PopoverClose asChild><Button size="sm" variant="outline">{labels.close}</Button></PopoverClose>
            </PopoverContent>
          </Popover>}
        </div>
      </li>;
    })}</ol>
  </section>;
}
