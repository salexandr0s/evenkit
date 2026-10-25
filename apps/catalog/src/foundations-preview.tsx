import { useRef, useState } from "react";
import {
  ActionGroup, Avatar, AvatarGroup, Badge, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader,
  Container, DataList, DataListItem, Grid, Heading, Inline, Kbd, ListItem, LiveStatus,
  PageHeader, PlusIcon, Prose, SectionHeader, Separator, SkipLink, Stack, Tag, TagGroup,
  VisuallyHidden,
} from "@project-kit/ui";
import "./foundations-preview.css";

function TypographyPreview() {
  return <article className="foundations-preview-article"><div className="foundations-preview-article-meta"><span>Studio notes</span><span>02 November 2026</span></div><Prose><h2>A clearer project review</h2><p className="foundations-preview-lead">Keep the next decision in view. A useful project record gives everyone enough context to move the work forward.</p><h3>Before the review</h3><p>Start with the owner and the expected outcome. Keep the questions that need an answer together:</p><ul><li>What changed since the last review?</li><li>Which decision does the team need to make?</li><li>Who owns the next step?</li></ul><blockquote>The review is ready when the team can make the next decision.</blockquote><h3>Leave a useful record</h3><p>Set <code>project.status</code> after the review and add the next action. <a href="#typography-reference">Read the review notes</a> before sharing an update.</p><p className="pk-text-muted">Keep supporting context close to the decision it explains.</p><p className="pk-caption" id="typography-reference">Example content for the fictional Studio workspace.</p></Prose></article>;
}

function WidthPreview() {
  const widths = [
    { width: "full", title: "Workspace overview", limit: "Available width", detail: "Tables, timelines and broad project overviews use the space available to them." },
    { width: "content", title: "A shared place for the work", limit: "1280px maximum", detail: "Page content stays centered on a larger display, with room for navigation and supporting detail." },
    { width: "reading", title: "Notes that are easy to follow", limit: "720px maximum", detail: "Keep longer passages at a comfortable reading width. A narrower measure helps the eye find the start of the next line." },
    { width: "form", title: "One task at a time", limit: "480px maximum", detail: "Focused forms keep labels, fields and the next action close together." },
  ] as const;
  return <Stack gap="6">{widths.map(({ width, title, limit, detail }) => <div key={width} className="foundations-preview-width-stage"><Container width={width} className="foundations-preview-width"><div className="foundations-preview-width-label"><span>{width}</span><span>{limit}</span></div><Heading as="h3" size="4">{title}</Heading><p>{detail}</p></Container></div>)}</Stack>;
}

function LayoutPreview() {
  const projects = [
    { name: "Website refresh", owner: "Alex Morgan", detail: "Review the first draft and confirm the next round of changes.", status: "In review" },
    { name: "Research library", owner: "Noor Aziz", detail: "Bring interview notes and findings into one shared record.", status: "In progress" },
    { name: "Annual review", owner: "Sam Rivera", detail: "Prepare project outcomes for the end-of-year review.", status: "Planned" },
  ];
  return <Stack gap="6"><Inline justify="between" align="start"><Stack gap="1"><Heading as="h3" size="3">Studio projects</Heading><p className="pk-text-muted">The work ahead, with an owner for each next step.</p></Stack><Badge>3 projects</Badge></Inline><Grid columns={3} gap="6">{projects.map(project => <Stack gap="4" key={project.name} className="foundations-preview-sample"><div><Badge>{project.status}</Badge><Heading as="h4" size="4">{project.name}</Heading><p>{project.detail}</p></div><Inline gap="2"><Avatar name={project.owner} size="sm" decorative /><span className="pk-caption">{project.owner}</span></Inline></Stack>)}</Grid><Inline justify="between" className="foundations-preview-layout-footer"><span className="pk-caption">Project categories</span><Inline gap="2"><Tag>Design</Tag><Tag>Research</Tag><Tag>Planning</Tag></Inline></Inline></Stack>;
}

function SeparatorPreview() {
  return <Container width="reading"><Stack gap="6"><Stack gap="2"><Heading as="h3" size="3">Website refresh</Heading><p className="pk-text-muted">The first draft is ready for a review of the content and navigation.</p></Stack><Inline gap="4" className="foundations-preview-metadata"><span>Updated today</span><Inline gap="4" wrap={false}><Separator orientation="vertical" /><span>Alex Morgan</span></Inline><Inline gap="4" wrap={false}><Separator orientation="vertical" /><span>Studio workspace</span></Inline></Inline><Separator decorative={false} /><Stack gap="2"><Heading as="h4" size="4">Next review</Heading><p>Confirm the page structure, collect feedback and assign the next changes.</p><p className="pk-caption">Monday, 2 November · Design team</p></Stack></Stack></Container>;
}

function CardPreview() {
  const [message, setMessage] = useState("Choose a project to review.");
  const projects = [
    { variant: "default", name: "Website refresh", detail: "Review the page structure and first content draft before the next design round.", owner: "Alex Morgan", status: "In review" },
    { variant: "elevated", name: "Research library", detail: "A shared home for interview notes, findings and the questions still open.", owner: "Noor Aziz", status: "In progress" },
    { variant: "outline", name: "Annual review", detail: "Bring the year's project outcomes together for the team review.", owner: "Sam Rivera", status: "Planned" },
    { variant: "ghost", name: "Workspace guide", detail: "Keep the team's decisions and working agreements easy to find.", owner: "Robin Chen", status: "Draft" },
  ] as const;
  return <Stack gap="6"><Grid gap="6">{projects.map(project => <Card key={project.variant} variant={project.variant}><CardHeader><Inline justify="between" className="foundations-preview-card-label"><Badge tone={project.variant === "default" ? "accent" : "neutral"}>{project.status}</Badge><span className="pk-caption">{project.variant}</span></Inline><h3>{project.name}</h3></CardHeader><CardBody><Stack gap="6"><p className="pk-text-muted">{project.detail}</p><Inline gap="2"><Avatar name={project.owner} size="sm" decorative /><div><strong className="foundations-preview-owner">{project.owner}</strong><p className="pk-caption">Project owner</p></div></Inline></Stack></CardBody><CardFooter className="foundations-preview-card-footer"><span className="pk-caption">Studio workspace</span><Button variant="outline" onClick={() => setMessage(`Review opened for the ${project.variant} example.`)}>Review project</Button></CardFooter></Card>)}</Grid><LiveStatus className="foundations-preview-status">{message}</LiveStatus></Stack>;
}

function HeaderPreview() {
  const [message, setMessage] = useState("No project created yet.");
  const [reviews, setReviews] = useState(0);
  return <Stack gap="8"><PageHeader title="Studio projects" headingAs="h2" breadcrumbs={<Breadcrumbs items={[{ id: "workspace", label: "Studio workspace" }, { id: "projects", label: "Projects" }]} />} description="Track project owners, review dates and the next decision." metadata={<><AvatarGroup size="sm" label="Workspace members" max={3} avatars={[{ name: "Alex Morgan" }, { name: "Noor Aziz" }, { name: "Sam Rivera" }]} /><span>3 members</span><Separator orientation="vertical" /><span>Updated today</span></>} actions={<Button startIcon={<PlusIcon />} onClick={() => setMessage("A new project draft is ready.")}>Create project</Button>} /><Separator /><SectionHeader title="Open reviews" headingAs="h3" description="Reviews waiting for a decision from the team." metadata={reviews} actions={<Button variant="outline" onClick={() => { setReviews(value => value + 1); setMessage("A sample review was added."); }}>Add review</Button>} /><LiveStatus className="foundations-preview-status">{message}</LiveStatus></Stack>;
}

function ActionGroupPreview() {
  const [message, setMessage] = useState("The draft is ready for review.");
  return <Stack gap="6"><Inline justify="between"><Stack gap="1"><Heading as="h3" size="4">Website refresh</Heading><p className="pk-text-muted">Project brief</p></Stack><Badge>Draft</Badge></Inline><div className="foundations-preview-action-bar"><ActionGroup label="Draft actions"><Button onClick={() => setMessage("Draft saved.")}>Save draft</Button><Button variant="outline" onClick={() => setMessage("Preview opened.")}>Preview</Button><Separator orientation="vertical" /><Button variant="ghost" onClick={() => setMessage("Draft archived.")}>Archive</Button><Button disabled variant="outline">Publish</Button></ActionGroup><LiveStatus className="foundations-preview-status">{message}</LiveStatus></div><p className="pk-caption">Save your changes before publishing. Use Tab to move through the available actions.</p></Stack>;
}

function AccessibilityPreview() {
  const [updates, setUpdates] = useState(0);
  return <Container width="reading"><Stack gap="6"><SkipLink href="#foundations-skip-target">Skip to example content</SkipLink><Stack gap="2"><Heading as="h3" size="4">Move through the page</Heading><p className="pk-text-muted">Press <Kbd>Tab</Kbd> to reveal the skip link, then <Kbd>Enter</Kbd> to jump to the content below.</p></Stack><section id="foundations-skip-target" tabIndex={-1} className="foundations-preview-target" aria-label="Example content"><Inline justify="between"><Stack gap="1"><Heading as="h3" size="4">Example content</Heading><p className="pk-text-muted">Add a project to try the status announcement.</p></Stack><button type="button" className="pk-button" data-variant="outline" data-shape="icon" onClick={() => setUpdates(value => value + 1)}><PlusIcon /><VisuallyHidden>Add project</VisuallyHidden></button></Inline><Separator /><LiveStatus className="foundations-preview-status">{updates ? `${updates} project ${updates === 1 ? "update" : "updates"} recorded.` : "No updates yet."}</LiveStatus></section><p className="pk-caption">The icon button has a text name for screen readers. Updates are announced without moving focus.</p></Stack></Container>;
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
  const sizes = [{ name: "Alex Morgan", size: "sm", label: "Compact" }, { name: "Sam Rivera", size: "md", label: "Default" }, { name: "Noor Aziz", size: "lg", label: "Profile" }] as const;
  return <Stack gap="6"><Inline justify="between" className="foundations-preview-profile"><Inline gap="4"><Avatar name="Alex Morgan" {...(src ? { src } : {})} size="lg" /><Stack gap="1"><Heading as="h3" size="4">Alex Morgan</Heading><p className="pk-text-muted">Project owner · Website refresh</p></Stack></Inline><Badge>Studio team</Badge></Inline><Stack gap="3"><ActionGroup label="Avatar image examples"><Button variant="outline" onClick={() => { setSrc("data:image/png;base64,invalid"); setMessage("The unavailable image falls back to initials."); }}>Use missing image</Button><Button variant="outline" onClick={() => { setSrc(avatarSample()); setMessage("The sample image replaces the initials after loading."); }}>Use sample image</Button><Button variant="ghost" onClick={() => { setSrc(undefined); setMessage("Initials restored."); }}>Use initials</Button></ActionGroup><LiveStatus className="foundations-preview-status">{message}</LiveStatus></Stack><div className="foundations-preview-display-section"><Inline justify="between"><Stack gap="1"><Heading as="h4" size="4">Project team</Heading><p className="pk-text-muted">Five people working on the next review.</p></Stack><AvatarGroup label="Project team" max={3} avatars={[{ name: "Alex Morgan" }, { name: "Sam Rivera" }, { name: "Noor Aziz" }, { name: "Robin Chen" }, { name: "Ellis Taylor" }]} /></Inline></div><Inline gap="8" align="end" className="foundations-preview-avatar-sizes">{sizes.map(avatar => <Stack gap="2" key={avatar.size}><Avatar name={avatar.name} size={avatar.size} /><span className="pk-caption">{avatar.label}</span></Stack>)}</Inline></Stack>;
}

function TagsPreview() {
  const initial = ["Design", "Research", "A long localized project label that remains readable"];
  const [tags, setTags] = useState(initial);
  const [selected, setSelected] = useState<readonly string[]>(["Design"]);
  const [message, setMessage] = useState("Choose or remove a project tag.");
  const resetRef = useRef<HTMLButtonElement>(null);
  return <Stack gap="6"><Inline justify="between"><Stack gap="1"><Heading as="h3" size="4">Project labels</Heading><p className="pk-text-muted">Choose the labels used to organize this project.</p></Stack><span className="pk-caption">{selected.length} selected</span></Inline><TagGroup aria-label="Project tags">{tags.map(tag => <Tag key={tag} tone="accent" selected={selected.includes(tag)} onSelectedChange={next => { setSelected(values => next ? [...values, tag] : values.filter(value => value !== tag)); setMessage(`${tag} ${next ? "selected" : "unselected"}.`); }} onRemove={() => { resetRef.current?.focus(); setTags(values => values.filter(value => value !== tag)); setSelected(values => values.filter(value => value !== tag)); setMessage(`${tag} removed.`); }}>{tag}</Tag>)}<Tag>Read only</Tag><Tag disabled onSelectedChange={() => undefined}>Unavailable</Tag></TagGroup><Inline justify="between" className="foundations-preview-tags-footer"><LiveStatus className="foundations-preview-status">{message}</LiveStatus><Button ref={resetRef} variant="outline" onClick={() => { setTags(initial); setSelected(["Design"]); setMessage("Project tags restored."); }}>Reset tags</Button></Inline><Stack gap="3"><Heading as="h4" size="4">Review labels</Heading><TagGroup dir="rtl" aria-label="Right-to-left tags"><Tag tone="success">تمت المراجعة</Tag><Tag tone="warning">بانتظار الرد</Tag></TagGroup><p className="pk-caption">Labels follow the reading direction of their group.</p></Stack></Stack>;
}

function DataListPreview() {
  const [shared, setShared] = useState(false);
  return <Container width="reading"><Stack gap="6"><Inline justify="between"><Stack gap="1"><Heading as="h3" size="4">Project record</Heading><p className="pk-text-muted">The details behind the next review.</p></Stack><Badge tone="accent">In review</Badge></Inline><DataList aria-label="Project details"><DataListItem term="Project">Website refresh</DataListItem><DataListItem term="Owner"><Inline gap="2"><Avatar name="Alex Morgan" size="sm" decorative />Alex Morgan</Inline></DataListItem><DataListItem term="Review date"><time dateTime="2026-11-02">2 November 2026</time></DataListItem><DataListItem term="Contact">{shared ? "alex@example.test" : <span className="foundations-preview-data-note">Not shared</span>}</DataListItem><DataListItem term="Notes"><p className="foundations-preview-data-note">Confirm the research findings and prepare the first draft for the next review.</p></DataListItem></DataList><Inline justify="between" className="foundations-preview-data-footer"><span className="pk-caption">Contact details are shared with the project team.</span><Button variant="outline" onClick={() => setShared(value => !value)}>{shared ? "Hide sample contact" : "Show sample contact"}</Button></Inline></Stack></Container>;
}

function ListItemPreview() {
  const [message, setMessage] = useState("Choose a record to review.");
  const projects = [{ name: "Website refresh", owner: "Alex Morgan", detail: "Review the page structure and the first content draft.", due: "2 November" }, { name: "Research library with a deliberately longer project title", owner: "Noor Aziz", detail: "Confirm the research findings before sharing the next draft.", due: "5 November" }];
  return <Stack gap="6"><Inline justify="between"><Stack gap="1"><Heading as="h3" size="4">Ready for review</Heading><p className="pk-text-muted">Projects waiting for the next decision.</p></Stack><span className="pk-caption">2 projects</span></Inline><ul className="foundations-preview-list foundations-preview-records">{projects.map(project => <li key={project.name}><ListItem media={<Avatar name={project.owner} decorative />} title={project.name} description={project.detail} metadata={<><Badge tone="accent">In review</Badge><span>{project.owner}</span><span>Due {project.due}</span></>} actions={<Button variant="outline" onClick={() => setMessage(`${project.name} is open for review.`)} aria-label={`Review ${project.name}`}>Review</Button>} /></li>)}</ul><LiveStatus className="foundations-preview-status">{message}</LiveStatus></Stack>;
}

function KbdPreview() {
  return <Container width="reading"><Stack gap="6"><Stack gap="1"><Heading as="h3" size="4">Keyboard shortcuts</Heading><p className="pk-text-muted">Show the action beside the keys used to reach it.</p></Stack><ul className="foundations-preview-list foundations-preview-shortcuts"><li><Stack gap="1"><span className="foundations-preview-shortcut-title">Open command menu</span><span className="pk-caption">macOS command example</span></Stack><Inline gap="1" wrap={false}><Kbd aria-label="Command">⌘</Kbd><Kbd>K</Kbd></Inline></li><li><Stack gap="1"><span className="foundations-preview-shortcut-title">Open command menu</span><span className="pk-caption">Windows and Linux example</span></Stack><Inline gap="1" wrap={false}><Kbd>Ctrl</Kbd><Kbd>K</Kbd></Inline></li><li><Stack gap="1"><span className="foundations-preview-shortcut-title">Move to the previous control</span><span className="pk-caption">All platforms</span></Stack><Inline gap="1" wrap={false}><Kbd>Shift</Kbd><Kbd>Tab</Kbd></Inline></li></ul><p className="pk-caption">The host chooses the shortcut and supplies the correct platform label. These specimens display notation.</p></Stack></Container>;
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
