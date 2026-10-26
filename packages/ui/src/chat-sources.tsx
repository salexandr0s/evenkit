"use client";

import { useId, type ComponentPropsWithoutRef } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { ExternalLinkIcon, EyeIcon } from "./icons.js";
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

function sourceDomain(href: string | undefined): string | undefined {
  if (!href || !/^https?:\/\//i.test(href)) return undefined;
  // Callers pass an already validated URL. Relative and mail links have no domain label.
  return new URL(href).hostname.replace(/^www\./, "");
}

/** A numbered source list with keyboard-accessible links and optional previews. */
export function ChatSources({ sources, labels: customLabels, className, dir, ...props }: ChatSourcesProps) {
  const headingId = useId();
  const labels = { ...defaultLabels, ...customLabels };
  if (!sources.length) return null;
  return <section {...props} dir={dir} className={classes("pk-chat-sources", className)} aria-labelledby={headingId}>
    <div className="pk-chat-sources-heading"><h4 id={headingId}>{labels.sources}</h4><span className="pk-chat-source-count" aria-hidden="true">{sources.length}</span></div>
    <ol role="list">{sources.map((source, index) => {
      const href = source.unavailable ? undefined : safeChatUrl(source.href);
      const domain = sourceDomain(href);
      return <li key={source.id} data-unavailable={!href || undefined}>
        <div className="pk-chat-source-row">
          <span className="pk-chat-source-number" aria-hidden="true">{index + 1}</span>
          <div className="pk-chat-source-name">
            {href ? <a href={href} rel="noreferrer">{source.title}<ExternalLinkIcon size="sm" aria-hidden="true" /></a> : <span>{source.title}</span>}
            {domain ? <small><bdi>{domain}</bdi></small> : !href ? <small>{labels.unavailable}</small> : null}
          </div>
          {source.preview && <Popover>
            <PopoverTrigger asChild><Button className="pk-chat-source-preview-trigger" size="xs" variant="ghost" startIcon={<EyeIcon size="sm" />} aria-label={`${labels.preview}: ${source.title}`}>{labels.preview}</Button></PopoverTrigger>
            <PopoverContent className="pk-chat-source-preview" dir={dir} align="end">
              <div className="pk-chat-source-preview-heading"><span className="pk-chat-source-number" aria-hidden="true">{index + 1}</span><PopoverTitle>{source.title}</PopoverTitle></div>
              <PopoverDescription className="pk-chat-source-excerpt" tabIndex={0}>{source.preview}</PopoverDescription>
              <div className="pk-chat-source-preview-footer">
                {domain ? <small><bdi>{domain}</bdi></small> : !href ? <small>{labels.unavailable}</small> : null}
                <PopoverClose asChild><Button size="xs" variant="ghost">{labels.close}</Button></PopoverClose>
              </div>
            </PopoverContent>
          </Popover>}
        </div>
      </li>;
    })}</ol>
  </section>;
}
