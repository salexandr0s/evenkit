"use client";

import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger, Container, Heading, Prose, Stack, type HeadingTag } from "@evenkit/ui";
import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import "./website.css";

export interface FaqItem { id: string; question: ReactNode; answer: ReactNode }
export interface FaqSectionProps extends Omit<ComponentPropsWithoutRef<"section">, "title" | "children" | "dir"> {
  title: ReactNode;
  description?: ReactNode;
  items: readonly FaqItem[];
  defaultOpenIds?: string[];
  headingAs?: HeadingTag;
  questionHeadingAs?: HeadingTag;
  dir?: "ltr" | "rtl";
}

const nextHeading: Record<HeadingTag, HeadingTag> = { h1: "h2", h2: "h3", h3: "h4", h4: "h5", h5: "h6", h6: "h6" };

export function FaqSection({ title, description, items, defaultOpenIds = [], headingAs = "h2", questionHeadingAs: QuestionHeading = nextHeading[headingAs], dir, className, ...props }: FaqSectionProps) {
  const titleId = useId();
  return <section aria-labelledby={titleId} {...props} dir={dir} className={["pk-website-section pk-website-faq", className].filter(Boolean).join(" ")}>
    <Container width="reading">
      <Stack gap="3" className="pk-website-section-intro">
        <Heading id={titleId} as={headingAs} size="2">{title}</Heading>
        {description ? <Prose className="pk-website-description">{description}</Prose> : null}
      </Stack>
      <Accordion type="multiple" defaultValue={defaultOpenIds} {...(dir ? { dir } : {})}>
        {items.map(item => <AccordionItem key={item.id} value={item.id}>
          <AccordionHeader asChild><QuestionHeading><AccordionTrigger>{item.question}</AccordionTrigger></QuestionHeading></AccordionHeader>
          <AccordionContent><Prose>{item.answer}</Prose></AccordionContent>
        </AccordionItem>)}
      </Accordion>
    </Container>
  </section>;
}
