"use client";

import { Container, Heading, Inline, Prose, Stack, type HeadingTag } from "@evenkit/ui";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import "./website.css";

export interface HeroProps extends Omit<ComponentPropsWithoutRef<"section">, "title" | "children"> {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  /** Compose Image, video, or a figure with host-owned assets and alternatives. */
  media?: ReactNode;
  variant?: "text" | "media";
  headingAs?: HeadingTag;
}

export function Hero({ title, description, eyebrow, actions, media, variant = "text", headingAs = "h1", className, ...props }: HeroProps) {
  const titleId = useId();
  return <section aria-labelledby={titleId} {...props} className={["pk-website-section pk-website-hero", className].filter(Boolean).join(" ")} data-variant={variant} data-has-media={media ? true : undefined}>
    <Container className="pk-website-hero-layout">
      <Stack gap="6" className="pk-website-hero-copy">
        {eyebrow ? <p className="pk-website-eyebrow">{eyebrow}</p> : null}
        <Heading id={titleId} as={headingAs} size="1" className="pk-website-hero-title">{title}</Heading>
        {description ? <Prose className="pk-website-description">{description}</Prose> : null}
        {actions ? <Inline gap="3" className="pk-website-actions">{actions}</Inline> : null}
      </Stack>
      {media ? <div className="pk-website-media">{media}</div> : null}
    </Container>
  </section>;
}
