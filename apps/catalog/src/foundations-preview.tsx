import { useRef, useState } from "react";
import {
  ActionGroup, Avatar, AvatarGroup, Badge, Button, Card, CardBody, CardFooter, CardHeader,
  Container, DataList, DataListItem, Grid, Heading, Inline, Kbd, ListItem, LiveStatus,
  PageHeader, PlusIcon, Prose, SectionHeader, Separator, SkipLink, Stack, Tag, TagGroup,
  VisuallyHidden,
} from "@project-kit/ui";
import "./foundations-preview.css";

function TypographyPreview() {
  return <Prose><h2>Project notes</h2><p>A shared record keeps the team informed. Body text follows the active theme while headings retain its chosen typeface.</p><h3>Before the review</h3><ul><li>Confirm the owner and expected outcome.</li><li>Record unresolved questions in the project notes.</li></ul><blockquote>The review is ready when the team can make the next decision.</blockquote><p>Use <code>project.status</code> for a short technical value. <a href="#typography-reference">Read the review notes</a>.</p><p className="pk-text-muted">Secondary text supports the main content.</p><p className="pk-caption" id="typography-reference">Example content for the fictional Studio workspace.</p></Prose>;
}

function WidthPreview() {
  return <Stack>{(["full", "content", "reading", "form"] as const).map(width => <Container key={width} width={width} className="foundations-preview-width"><strong>{width}</strong><p>Content grows within the shared width limit and the available parent.</p></Container>)}</Stack>;
}

function LayoutPreview() {
  return <Stack gap="6"><Inline justify="between"><Heading as="h3" size="4">Studio projects</Heading><Badge>3 projects</Badge></Inline><Grid columns={3}>{["Website refresh", "Research library", "Annual review"].map(name => <div key={name} className="foundations-preview-sample"><strong>{name}</strong><p>Owner and project notes stay readable as the grid narrows.</p></div>)}</Grid><Inline><Tag>Design</Tag><Tag>Research</Tag><Tag>Long project category that wraps without clipping</Tag></Inline></Stack>;
}

function SeparatorPreview() {
  return <Stack><p>Overview and detail use a quiet horizontal rule.</p><Separator decorative={false} /><Inline><span>Updated today</span><Separator orientation="vertical" /><span>Alex Morgan</span><Separator orientation="vertical" /><span>Studio workspace</span></Inline><p className="pk-caption">The vertical rules here are decorative; the horizontal rule marks a section boundary.</p></Stack>;
}

function CardPreview() {
  const [message, setMessage] = useState("Choose a project to review.");
  return <Stack gap="6"><Grid>{(["default", "elevated", "outline", "ghost"] as const).map(variant => <Card key={variant} variant={variant}><CardHeader><h3>{variant === "default" ? "Website refresh" : `${variant[0]?.toUpperCase()}${variant.slice(1)} card`}</h3></CardHeader><CardBody><p>Related project content has one boundary. Long notes wrap and the height follows the content.</p></CardBody><CardFooter><Button variant="outline" onClick={() => setMessage(`Review opened for the ${variant} example.`)}>Review project</Button></CardFooter></Card>)}</Grid><LiveStatus>{message}</LiveStatus></Stack>;
}

function HeaderPreview() {
  const [message, setMessage] = useState("No project created yet.");
  const [reviews, setReviews] = useState(0);
  return <Stack gap="8"><PageHeader title="Studio projects" headingAs="h2" description="Track project owners, review dates and the next decision." metadata="Fictional workspace with local sample data." actions={<Button startIcon={<PlusIcon />} onClick={() => setMessage("A new project draft is ready.")}>Create project</Button>} /><Separator /><SectionHeader title="Open reviews" headingAs="h3" description="The sample review count starts at zero." metadata={reviews} actions={<Button variant="outline" onClick={() => { setReviews(value => value + 1); setMessage("A sample review was added."); }}>Add review</Button>} /><LiveStatus>{message}</LiveStatus></Stack>;
}

function ActionGroupPreview() {
  const [message, setMessage] = useState("The draft is ready for review.");
  return <Stack><ActionGroup label="Draft actions"><Button onClick={() => setMessage("Draft saved.")}>Save draft</Button><Button variant="outline" onClick={() => setMessage("Preview opened.")}>Preview</Button><Button variant="ghost" onClick={() => setMessage("Draft archived.")}>Archive</Button><Button disabled variant="outline">Publish</Button></ActionGroup><LiveStatus>{message}</LiveStatus><p className="pk-caption">These actions use normal Tab order. The group does not claim toolbar arrow-key behavior.</p></Stack>;
}

function AccessibilityPreview() {
  const [updates, setUpdates] = useState(0);
  return <Stack><SkipLink href="#foundations-skip-target">Skip to example content</SkipLink><p>Focus the skip link with the keyboard to move past repeated content.</p><button type="button" className="pk-button" data-shape="icon" onClick={() => setUpdates(value => value + 1)}><PlusIcon /><VisuallyHidden>Add project</VisuallyHidden></button><section id="foundations-skip-target" tabIndex={-1} className="foundations-preview-target" aria-label="Example content"><Heading as="h3" size="4">Example content</Heading><p>The destination can receive focus without entering the normal Tab order.</p></section><LiveStatus>{updates ? `${updates} project ${updates === 1 ? "update" : "updates"} recorded.` : "No updates yet."}</LiveStatus></Stack>;
}

function avatarSample() {
  const style = getComputedStyle(document.documentElement);
  const bg = style.getPropertyValue("--pk-color-accent").trim();
  const fg = style.getPropertyValue("--pk-color-on-accent").trim();
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${bg}"/><circle cx="24" cy="18" r="8" fill="${fg}"/><path d="M8 48V40a16 16 0 0132 0v8" fill="${fg}"/></svg>`)}`;
}

function AvatarPreview() {
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("Initials are shown until an image loads.");
  return <Stack gap="6"><Inline><Avatar name="Alex Morgan" {...(src ? { src } : {})} size="lg" /><div><strong>Alex Morgan</strong><p className="pk-caption">Project owner</p></div></Inline><ActionGroup label="Avatar image examples"><Button variant="outline" onClick={() => { setSrc("data:image/png;base64,invalid"); setMessage("The unavailable image falls back to initials."); }}>Use missing image</Button><Button variant="outline" onClick={() => { setSrc(avatarSample()); setMessage("The sample image replaces the initials after loading."); }}>Use sample image</Button><Button variant="ghost" onClick={() => { setSrc(undefined); setMessage("Initials restored."); }}>Use initials</Button></ActionGroup><LiveStatus>{message}</LiveStatus><AvatarGroup label="Project team" max={3} avatars={[{ name: "Alex Morgan" }, { name: "Sam Rivera" }, { name: "Noor Aziz" }, { name: "Robin Chen" }, { name: "Ellis Taylor" }]} /><Inline><Avatar name="Alex Morgan" size="sm" /><Avatar name="Sam Rivera" /><Avatar name="Noor Aziz" size="lg" /></Inline></Stack>;
}

function TagsPreview() {
  const initial = ["Design", "Research", "A long localized project label that remains readable"];
  const [tags, setTags] = useState(initial);
  const [selected, setSelected] = useState<readonly string[]>(["Design"]);
  const [message, setMessage] = useState("Choose or remove a project tag.");
  const resetRef = useRef<HTMLButtonElement>(null);
  return <Stack><TagGroup aria-label="Project tags">{tags.map(tag => <Tag key={tag} tone="accent" selected={selected.includes(tag)} onSelectedChange={next => { setSelected(values => next ? [...values, tag] : values.filter(value => value !== tag)); setMessage(`${tag} ${next ? "selected" : "unselected"}.`); }} onRemove={() => { resetRef.current?.focus(); setTags(values => values.filter(value => value !== tag)); setSelected(values => values.filter(value => value !== tag)); setMessage(`${tag} removed.`); }}>{tag}</Tag>)}<Tag>Read only</Tag><Tag disabled onSelectedChange={() => undefined}>Unavailable</Tag></TagGroup><Button ref={resetRef} variant="outline" onClick={() => { setTags(initial); setSelected(["Design"]); setMessage("Project tags restored."); }}>Reset tags</Button><LiveStatus>{message}</LiveStatus><TagGroup dir="rtl" aria-label="Right-to-left tags"><Tag tone="success">تمت المراجعة</Tag><Tag tone="warning">بانتظار الرد</Tag></TagGroup></Stack>;
}

function DataListPreview() {
  const [shared, setShared] = useState(false);
  return <Stack><DataList aria-label="Project details"><DataListItem term="Project">Website refresh</DataListItem><DataListItem term="Owner"><Inline gap="2"><Avatar name="Alex Morgan" size="sm" decorative />Alex Morgan</Inline></DataListItem><DataListItem term="Review date"><time dateTime="2026-11-02">2 November 2026</time></DataListItem><DataListItem term="Contact">{shared ? "alex@example.test" : "Not shared"}</DataListItem><DataListItem term="Notes">Confirm the research findings and prepare the first draft for the next review.</DataListItem></DataList><Button variant="outline" onClick={() => setShared(value => !value)}>{shared ? "Hide sample contact" : "Show sample contact"}</Button></Stack>;
}

function ListItemPreview() {
  const [message, setMessage] = useState("Choose a record to review.");
  return <Stack><ul className="foundations-preview-list">{[{ name: "Website refresh", owner: "Alex Morgan" }, { name: "Research library with a deliberately longer project title", owner: "Noor Aziz" }].map(project => <li key={project.name}><ListItem media={<Avatar name={project.owner} />} title={project.name} description={`Owned by ${project.owner}. The project is ready for its next review.`} metadata={<Badge tone="accent">In review</Badge>} actions={<Button variant="outline" onClick={() => setMessage(`${project.name} is open for review.`)} aria-label={`Review ${project.name}`}>Review</Button>} /></li>)}</ul><LiveStatus>{message}</LiveStatus></Stack>;
}

function KbdPreview() {
  return <Stack><Inline><span>macOS command example</span><Kbd aria-label="Command">⌘</Kbd><Kbd>K</Kbd></Inline><Inline><span>Windows and Linux example</span><Kbd>Ctrl</Kbd><Kbd>K</Kbd></Inline><p className="pk-caption">The host chooses the shortcut and supplies the correct platform label. These specimens display notation.</p></Stack>;
}

export function FoundationsPreview({ id }: { id: string }) {
  const previews = {
    typography: <TypographyPreview />,
    "layout-widths": <WidthPreview />,
    "layout-groups": <LayoutPreview />,
    separator: <SeparatorPreview />,
    card: <CardPreview />,
    "page-header": <HeaderPreview />,
    toolbar: <ActionGroupPreview />,
    accessibility: <AccessibilityPreview />,
    avatar: <AvatarPreview />,
    tags: <TagsPreview />,
    "data-list": <DataListPreview />,
    "list-item": <ListItemPreview />,
    kbd: <KbdPreview />,
  };
  return <div className="foundations-preview">{previews[id as keyof typeof previews] ?? <TypographyPreview />}</div>;
}
