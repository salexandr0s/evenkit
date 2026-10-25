"use client";

import { createContext, useContext, useId, type ComponentPropsWithoutRef } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { classes } from "./classes.js";
import { CodeBlock, type CodeBlockLabels } from "./code-block.js";
import { safeChatUrl } from "./rich-chat-urls.js";

export interface ChatMarkdownLabels {
  table: string;
  image: string;
  footnotes: string;
  code: Partial<CodeBlockLabels>;
}

const defaultLabels: ChatMarkdownLabels = { table: "Message table", image: "Image omitted", footnotes: "Footnotes", code: {} };
const MarkdownLabels = createContext(defaultLabels);
const FootnotePrefix = createContext("");

// Keep component identities stable while streaming so focused controls stay mounted.
const components: Components = {
  pre: function MarkdownCode({ node, children }) {
    const labels = useContext(MarkdownLabels);
    const code = node?.children.find(child => child.type === "element" && child.tagName === "code");
    if (code?.type !== "element") return <pre>{children}</pre>;
    const text = code.children.map(child => child.type === "text" ? child.value : "").join("");
    const names = code.properties.className;
    const language = Array.isArray(names) ? names.find(name => typeof name === "string" && name.startsWith("language-")) : undefined;
    return <CodeBlock code={text.endsWith("\n") ? text.slice(0, -1) : text} {...(typeof language === "string" ? { language: language.slice(9) } : {})} labels={labels.code} />;
  },
  a: function MarkdownLink({ href, title, children, id, "aria-label": label, "aria-describedby": description }) {
    const prefix = useContext(FootnotePrefix);
    const safe = safeChatUrl(href);
    return safe ? <a href={safe} title={title} id={id} aria-label={label} aria-describedby={description === "footnote-label" ? `${prefix}footnote-label` : description} rel="noreferrer">{children}</a> : <span>{children}</span>;
  },
  h2: function MarkdownHeading({ id, children }) {
    const prefix = useContext(FootnotePrefix);
    return <h2 id={id === "footnote-label" ? `${prefix}footnote-label` : id}>{children}</h2>;
  },
  img: function MarkdownImage({ alt }) {
    const labels = useContext(MarkdownLabels);
    return <span className="pk-chat-markdown-image">{labels.image}{alt ? `: ${alt}` : ""}</span>;
  },
  table: function MarkdownTable({ children }) {
    const labels = useContext(MarkdownLabels);
    return <div className="pk-chat-markdown-table" tabIndex={0} role="region" aria-label={labels.table}><table>{children}</table></div>;
  },
};

export interface ChatMarkdownProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "dangerouslySetInnerHTML"> {
  content: string;
  streaming?: boolean;
  labels?: Partial<ChatMarkdownLabels>;
}

/** Fixed Markdown pipeline: escaped HTML, validated links, and no remote images. */
export function ChatMarkdown({ content, streaming = false, labels: customLabels, className, ...props }: ChatMarkdownProps) {
  const labels = { ...defaultLabels, ...customLabels };
  const id = useId().replaceAll(":", "");
  const prefix = `pk-${id}-`;
  return <div {...props} className={classes("pk-chat-markdown", className)} data-streaming={streaming || undefined}>
    <MarkdownLabels.Provider value={labels}>
      <FootnotePrefix.Provider value={prefix}>
      <Markdown remarkPlugins={[remarkGfm]} components={components} urlTransform={safeChatUrl}
        remarkRehypeOptions={{ clobberPrefix: prefix, footnoteLabel: labels.footnotes }}>
        {content}
      </Markdown>
      </FootnotePrefix.Provider>
    </MarkdownLabels.Provider>
  </div>;
}
