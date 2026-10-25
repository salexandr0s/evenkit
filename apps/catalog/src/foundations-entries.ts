import type { CatalogEntry } from "./catalog-types.js";

const styles = 'import "@project-kit/tokens/css";\nimport "@project-kit/ui/css";\n\n';

export const foundationsEntries: readonly CatalogEntry[] = [
  {
    id: "typography", name: "Typography and prose", group: "Foundations", inventoryIds: ["A01"],
    description: "Theme-aware headings, readable prose and native document elements without a global reset.",
    tags: ["heading", "body", "caption", "muted", "quote", "list", "link", "inline code", "A01"],
    source: "Original kit recipe · Apple Minimal typography", sourceUrl: "https://ui.shadcn.com/docs/components/radix/typography",
    usage: styles + `import { Prose } from "@project-kit/ui";

export function ProjectNotes() {
  return <Prose>
    <h2>Review notes</h2>
    <p>Confirm the owner and expected outcome before the review.</p>
    <ul><li>Record the next decision.</li><li>Assign the follow-up.</li></ul>
    <blockquote>Keep the project record current.</blockquote>
    <p>Use <code>project.status</code> for the record state.</p>
    <p className="pk-caption">Updated by the Studio team.</p>
  </Prose>;
}`,
  },
  {
    id: "layout-widths", name: "Containers and page widths", group: "Foundations", inventoryIds: ["A02"],
    description: "Content, reading, form and full-width containers using shared layout tokens.",
    tags: ["container", "page", "width", "reading", "form", "responsive", "A02"],
    source: "Original kit recipe · existing layout tokens", sourceUrl: "https://mantine.dev/core/container/",
    usage: styles + `import { Container, Heading } from "@project-kit/ui";

export function ProjectIntroduction() {
  return <main>
    <Container width="reading">
      <Heading as="h1" size="2">Studio projects</Heading>
      <p>A shared workspace for project notes and reviews.</p>
    </Container>
  </main>;
}`,
  },
  {
    id: "layout-groups", name: "Stack, inline and grid", group: "Foundations", inventoryIds: ["A03"],
    description: "Token-spaced groups that wrap and collapse with the available viewport.",
    tags: ["stack", "inline", "group", "grid", "columns", "spacing", "responsive", "A03"],
    source: "Original kit layout primitives", sourceUrl: "https://mantine.dev/core/stack/",
    usage: styles + `import { Badge, Grid, Heading, Inline, Stack } from "@project-kit/ui";

export function ProjectOverview() {
  return <Stack gap="6">
    <Inline justify="between"><Heading as="h2">Projects</Heading><Badge>2 projects</Badge></Inline>
    <Grid columns={2} gap="4"><p>Website refresh</p><p>Research library</p></Grid>
  </Stack>;
}`,
  },
  {
    id: "separator", name: "Separator", group: "Foundations", inventoryIds: ["A04"],
    description: "Horizontal and vertical rules with explicit decorative or structural meaning.",
    tags: ["divider", "rule", "horizontal", "vertical", "A04"],
    source: "Original kit implementation · native separator semantics", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/separator",
    usage: styles + `import { Inline, Separator, Stack } from "@project-kit/ui";

export function ProjectMetadata() {
  return <Stack>
    <p>Project overview</p><Separator decorative={false} />
    <Inline><span>Studio</span><Separator orientation="vertical" /><span>In review</span></Inline>
  </Stack>;
}`,
  },
  {
    id: "card", name: "Card", group: "Controls", inventoryIds: ["A05"],
    description: "Content-driven cards with header, body, footer and media parts, using the existing card contract.",
    tags: ["card", "header", "body", "footer", "media", "outline", "elevated", "ghost", "A05"],
    source: "Original kit implementation · internal card.v1", sourceUrl: "https://ui.shadcn.com/docs/components/radix/card",
    usage: '"use client";\n\n' + styles + `import { Button, Card, CardBody, CardFooter, CardHeader } from "@project-kit/ui";

export function ProjectCard({ onReview }: { onReview: () => void }) {
  return <Card variant="outline">
    <CardHeader><h2>Website refresh</h2></CardHeader>
    <CardBody><p>Confirm the research findings before the next review.</p></CardBody>
    <CardFooter><Button onClick={onReview}>Review project</Button></CardFooter>
  </Card>;
}`,
  },
  {
    id: "page-header", name: "Page and section headers", group: "Compositions", inventoryIds: ["A06"],
    description: "Headings, descriptions, metadata and wrapping actions with a host-selected heading level.",
    tags: ["page header", "section header", "title", "actions", "description", "metadata", "A06"],
    source: "Original kit header composition", sourceUrl: "https://ui.shadcn.com/blocks",
    usage: '"use client";\n\n' + styles + `import { Button, PageHeader, SectionHeader, Stack } from "@project-kit/ui";

export function ProjectHeading({ onCreate }: { onCreate: () => void }) {
  return <Stack gap="8">
    <PageHeader title="Projects" description="Review owners and the next decision."
      actions={<Button onClick={onCreate}>Create project</Button>} />
    <SectionHeader title="Recent activity" description="Updates from the team." />
  </Stack>;
}`,
  },
  {
    id: "toolbar", name: "Toolbar and action group recipe", group: "Compositions", inventoryIds: ["A07"],
    description: "Related actions in a named group with normal Tab order and safe wrapping.",
    tags: ["toolbar", "action group", "buttons", "keyboard", "A07"],
    source: "Original kit action-group recipe · native Tab order", sourceUrl: "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/",
    usage: '"use client";\n\n' + styles + `import { ActionGroup, Button } from "@project-kit/ui";

export function DraftActions({ onSave, onPreview }: { onSave: () => void; onPreview: () => void }) {
  return <ActionGroup label="Draft actions">
    <Button onClick={onSave}>Save draft</Button>
    <Button variant="outline" onClick={onPreview}>Preview</Button>
  </ActionGroup>;
}

// Every action remains in normal Tab order. This group does not claim role="toolbar".`,
  },
  {
    id: "accessibility", name: "Accessibility helpers", group: "Foundations", inventoryIds: ["A11"],
    description: "Hidden labels, skip navigation and persistent live status using native HTML semantics.",
    tags: ["visually hidden", "screen reader", "skip link", "live status", "announcement", "focus", "A11"],
    source: "Original kit helpers · WAI navigation and status patterns", sourceUrl: "https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/",
    usage: `"use client";

` + styles + `import { useState } from "react";
import { LiveStatus, PlusIcon, SkipLink, VisuallyHidden } from "@project-kit/ui";

export function ProjectWorkspace() {
  const [count, setCount] = useState(0);
  return <>
    <SkipLink href="#project-content">Skip to projects</SkipLink>
    <main id="project-content" tabIndex={-1}>
      <button type="button" className="pk-button" data-shape="icon" onClick={() => setCount(value => value + 1)}>
        <PlusIcon /><VisuallyHidden>Add project</VisuallyHidden>
      </button>
      <LiveStatus>{count ? count + " projects added." : ""}</LiveStatus>
    </main>
  </>;
}`,
  },
  {
    id: "avatar", name: "Avatar and avatar group", group: "Controls", inventoryIds: ["H01"],
    description: "Named image/initials fallbacks, shared sizes and accessible group overflow.",
    tags: ["avatar", "person", "image", "initials", "fallback", "team", "group", "H01"],
    source: "Original kit implementation · shared control sizes", sourceUrl: "https://ui.shadcn.com/docs/components/radix/avatar",
    usage: styles + `import { Avatar, AvatarGroup, Inline } from "@project-kit/ui";

export function ProjectPeople() {
  return <Inline>
    <Avatar name="Alex Morgan" size="lg" />
    <AvatarGroup label="Project team" max={2} avatars={[
      { name: "Sam Rivera" }, { name: "Noor Aziz" }, { name: "Robin Chen" },
    ]} />
  </Inline>;
}`,
  },
  {
    id: "tags", name: "Tags and tag groups", group: "Controls", inventoryIds: ["H02"],
    description: "Passive labels, pressed selections and separately named remove actions using Badge tones.",
    tags: ["tag", "chip", "pill", "remove", "selection", "group", "H02"],
    source: "Original kit composition · existing Badge tones", sourceUrl: "https://chakra-ui.com/docs/components/tag",
    usage: `"use client";

` + styles + `import { useRef, useState } from "react";
import { Button, LiveStatus, Tag, TagGroup } from "@project-kit/ui";

export function ProjectTags() {
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState(false);
  const reset = useRef<HTMLButtonElement>(null);
  return <>
    <TagGroup aria-label="Project tags">{visible && <Tag selected={selected}
      onSelectedChange={setSelected} onRemove={() => { reset.current?.focus(); setVisible(false); }}>
      Research
    </Tag>}</TagGroup>
    <Button ref={reset} onClick={() => setVisible(true)}>Reset tags</Button>
    <LiveStatus>{visible ? "" : "Research removed."}</LiveStatus>
  </>;
}`,
  },
  {
    id: "data-list", name: "Description and data lists", group: "Compositions", inventoryIds: ["H03"],
    description: "Responsive native description lists for record details and explicit missing values.",
    tags: ["description list", "data list", "details", "label", "value", "metadata", "H03"],
    source: "Original kit recipe · native dl/dt/dd", sourceUrl: "https://chakra-ui.com/docs/components/data-list",
    usage: styles + `import { DataList, DataListItem } from "@project-kit/ui";

export function ProjectDetails() {
  return <DataList aria-label="Project details">
    <DataListItem term="Project">Website refresh</DataListItem>
    <DataListItem term="Owner">Alex Morgan</DataListItem>
    <DataListItem term="Review date"><time dateTime="2026-11-02">2 November 2026</time></DataListItem>
    <DataListItem term="Contact">Not shared</DataListItem>
  </DataList>;
}`,
  },
  {
    id: "list-item", name: "Rich list items", group: "Compositions", inventoryIds: ["H04"],
    description: "Rows with media, title, description, metadata and actions inside host-owned lists.",
    tags: ["list item", "row", "media", "record", "metadata", "actions", "H04"],
    source: "Original kit row composition", sourceUrl: "https://ui.shadcn.com/docs/components/radix/item",
    usage: '"use client";\n\n' + styles + `import { Avatar, Button, ListItem } from "@project-kit/ui";

export function ProjectRecords({ onReview }: { onReview: () => void }) {
  return <ul><li>
    <ListItem title="Website refresh" description="Ready for its next review."
      media={<Avatar name="Alex Morgan" />} metadata="Owned by Alex Morgan"
      actions={<Button onClick={onReview}>Review project</Button>} />
  </li></ul>;
}`,
  },
  {
    id: "kbd", name: "Keyboard shortcuts", group: "Foundations", inventoryIds: ["H08"],
    description: "Native keyboard notation with host-provided platform symbols and accessible labels.",
    tags: ["kbd", "keyboard", "shortcut", "command", "control", "platform", "H08"],
    source: "Original kit styling · native kbd", sourceUrl: "https://ui.shadcn.com/docs/components/radix/kbd",
    usage: styles + `import { Inline, Kbd } from "@project-kit/ui";

export function SearchShortcut({ macOS }: { macOS: boolean }) {
  return <Inline gap="1">
    <span>Search</span><Kbd aria-label={macOS ? "Command" : "Control"}>{macOS ? "⌘" : "Ctrl"}</Kbd><Kbd>K</Kbd>
  </Inline>;
}

// The host registers the shortcut; Kbd displays its notation.`,
  },
];
