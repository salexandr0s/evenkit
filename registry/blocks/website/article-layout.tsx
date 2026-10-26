"use client";

import { useId, type ReactNode } from "react";
import { Container, Heading, Prose, Stack, type HeadingTag } from "@evenkit/ui";
import "./website-article.css";

export interface ArticleSection {
  /** Stable, URL-safe ID, unique within this article. */
  id: string;
  title: string;
  content: ReactNode;
}

export interface ArticleLayoutProps {
  /** Supply a stable unique ID for shareable links; generated IDs support repeated previews. */
  id?: string;
  title: ReactNode;
  introduction?: ReactNode;
  metadata?: ReactNode;
  media?: ReactNode;
  sections: readonly ArticleSection[];
  contentsLabel?: string;
  related?: ReactNode;
  headingAs?: "h1" | "h2" | "h3";
}

/** Editable document composition. The host owns content, metadata and related links. */
export function ArticleLayout({ id, title, introduction, metadata, media, sections, contentsLabel = "On this page", related, headingAs = "h1" }: ArticleLayoutProps) {
  const instance = useId();
  const articleId = id ?? `article-${instance.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const sectionTag: HeadingTag = headingAs === "h1" ? "h2" : headingAs === "h2" ? "h3" : "h4";
  const sectionId = (key: string) => `${articleId}-section-${key}`;
  return <article id={articleId} className="pk-website-article" aria-labelledby={`${articleId}-title`}>
    <Container className="pk-website-article-inner">
      <Stack gap="8" className="pk-website-article-flow">
        <header className="pk-website-article-header">
          {metadata ? <div className="pk-website-article-metadata">{metadata}</div> : null}
          <Heading id={`${articleId}-title`} as={headingAs} size="1">{title}</Heading>
          {introduction ? <Prose className="pk-website-article-introduction">{introduction}</Prose> : null}
        </header>
        {media ? <div className="pk-website-article-media">{media}</div> : null}
        <div className="pk-website-article-grid">
          {sections.length ? <nav className="pk-website-contents" aria-label={contentsLabel}>
            <p>{contentsLabel}</p>
            <ol>{sections.map(section => <li key={section.id}>
              <a href={`#${sectionId(section.id)}`} onClick={event => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
                document.getElementById(sectionId(section.id))?.focus({ preventScroll: true });
              }}>{section.title}</a>
            </li>)}</ol>
          </nav> : null}
          <div className="pk-website-article-body">
            {sections.map(section => <section key={section.id} aria-labelledby={sectionId(section.id)}>
              <Heading id={sectionId(section.id)} as={sectionTag} size="3" tabIndex={-1}>{section.title}</Heading>
              <Prose>{section.content}</Prose>
            </section>)}
            {related ? <aside className="pk-website-article-related">{related}</aside> : null}
          </div>
        </div>
      </Stack>
    </Container>
  </article>;
}

/** Plain text only; syntax highlighting and arbitrary HTML are host concerns. */
export function ArticleCode({ children, label }: { children: string; label: string }) {
  return <div className="pk-website-code-frame"><div className="pk-website-code-label" aria-hidden="true">{label}</div><pre className="pk-website-code" tabIndex={0} role="region" aria-label={label} dir="ltr"><code>{children}</code></pre></div>;
}
