"use client";

import { Container, Heading, Inline, Prose, Stack, type HeadingTag } from "@evenkit/ui";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import "./website.css";

export interface CallToActionProps extends Omit<ComponentPropsWithoutRef<"section">, "title" | "children"> {
  title: ReactNode;
  description?: ReactNode;
  primaryAction: ReactNode;
  secondaryAction?: ReactNode;
  headingAs?: HeadingTag;
}

export function CallToAction({ title, description, primaryAction, secondaryAction, headingAs = "h2", className, ...props }: CallToActionProps) {
  const titleId = useId();
  return <section aria-labelledby={titleId} {...props} className={["pk-website-section pk-website-cta", className].filter(Boolean).join(" ")}>
    <Container className="pk-website-cta-layout">
      <Stack gap="3" className="pk-website-cta-copy">
        <Heading id={titleId} as={headingAs} size="2">{title}</Heading>
        {description ? <Prose className="pk-website-description">{description}</Prose> : null}
      </Stack>
      <Inline gap="3" className="pk-website-actions">{primaryAction}{secondaryAction}</Inline>
    </Container>
  </section>;
}
