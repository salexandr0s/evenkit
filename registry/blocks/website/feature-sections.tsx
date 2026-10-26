"use client";

import { Container, Heading, Prose, Stack, type HeadingTag } from "@evenkit/ui";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import "./website.css";

export interface FeatureItem {
  id: string;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export interface FeatureSectionProps extends Omit<ComponentPropsWithoutRef<"section">, "title" | "children"> {
  title: ReactNode;
  description?: ReactNode;
  items: readonly FeatureItem[];
  presentation?: "list" | "grid";
  headingAs?: HeadingTag;
  itemHeadingAs?: HeadingTag;
}

const nextHeading: Record<HeadingTag, HeadingTag> = { h1: "h2", h2: "h3", h3: "h4", h4: "h5", h5: "h6", h6: "h6" };

export function FeatureSection({ title, description, items, presentation = "grid", headingAs = "h2", itemHeadingAs = nextHeading[headingAs], className, ...props }: FeatureSectionProps) {
  const titleId = useId();
  return <section aria-labelledby={titleId} {...props} className={["pk-website-section pk-website-feature-section", className].filter(Boolean).join(" ")} data-presentation={presentation}>
    <Container>
      <Stack gap="3" className="pk-website-section-intro">
        <Heading id={titleId} as={headingAs} size="2">{title}</Heading>
        {description ? <Prose className="pk-website-description">{description}</Prose> : null}
      </Stack>
      <ul role="list" className="pk-website-features" data-presentation={presentation}>
        {items.map(item => <li key={item.id} className="pk-website-feature">
          <Stack gap="3" className="pk-website-feature-heading">
            {item.icon ? <span aria-hidden="true" className="pk-website-feature-icon">{item.icon}</span> : null}
            <Heading as={itemHeadingAs} size="4">{item.title}</Heading>
          </Stack>
          <Stack gap="4" className="pk-website-feature-body">
            <Prose className="pk-website-description">{item.description}</Prose>
            {item.action ? <div className="pk-website-actions">{item.action}</div> : null}
          </Stack>
        </li>)}
      </ul>
    </Container>
  </section>;
}

export interface AlternatingItem extends Omit<FeatureItem, "icon"> { media: ReactNode }

export interface AlternatingSectionsProps extends Omit<FeatureSectionProps, "presentation" | "items"> {
  items: readonly AlternatingItem[];
}

/** Text precedes media in the DOM; only the wider-screen visual placement alternates. */
export function AlternatingSections({ title, description, items, headingAs = "h2", itemHeadingAs = nextHeading[headingAs], className, ...props }: AlternatingSectionsProps) {
  const titleId = useId();
  return <section aria-labelledby={titleId} {...props} className={["pk-website-section pk-website-alternating-section", className].filter(Boolean).join(" ")}>
    <Container>
      <Stack gap="3" className="pk-website-section-intro">
        <Heading id={titleId} as={headingAs} size="2">{title}</Heading>
        {description ? <Prose className="pk-website-description">{description}</Prose> : null}
      </Stack>
      <div className="pk-website-alternating">
        {items.map(item => <div key={item.id} className="pk-website-alternating-item">
          <Stack gap="4" className="pk-website-alternating-copy">
            <Heading as={itemHeadingAs} size="3">{item.title}</Heading>
            <Prose className="pk-website-description">{item.description}</Prose>
            {item.action ? <div className="pk-website-actions">{item.action}</div> : null}
          </Stack>
          <div className="pk-website-media">{item.media}</div>
        </div>)}
      </div>
    </Container>
  </section>;
}
