import { useState, type MouseEvent } from "react";
import {
  Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger,
  Avatar, Badge, Breadcrumbs, Button, ChevronDownIcon, Collapsible, CollapsibleContent, CollapsibleTrigger,
  Heading, Inline, Navbar, Pagination, Stack, Tabs, TabsContent, TabsList, TabsTrigger, TextField,
  type NavigationLinkProps, type PaginationPageLinkProps,
} from "@evenkit/ui";
import "./navigation-preview.css";

function TabsPreview() {
  const [active, setActive] = useState("overview");
  const [name, setName] = useState("Launch checklist");
  const [notes, setNotes] = useState(0);
  return <div className="navigation-preview">
    <Inline justify="between" align="start"><Stack gap="2"><Heading as="h3" size="3">{name || "Untitled project"}</Heading><p className="pk-text-muted">Prepare the next release with the Studio team.</p></Stack><Badge tone="accent">In progress</Badge></Inline>
    <Tabs value={active} onValueChange={setActive}>
      <TabsList aria-label="Project views"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="review" disabled>Review</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>
      <TabsContent value="overview"><div className="navigation-preview-project-grid"><div className="navigation-preview-stack"><TextField label="Project title" value={name} onChange={event => setName(event.target.value)} /><Button variant="outline" onClick={() => setNotes(value => value + 1)}>Add activity note</Button><p role="status" className="navigation-preview-status">{notes} {notes === 1 ? "note" : "notes"} recorded.</p></div><dl className="navigation-preview-project-details"><div><dt>Owner</dt><dd><Inline gap="2"><Avatar name="Alex Morgan" size="sm" decorative />Alex Morgan</Inline></dd></div><div><dt>Next review</dt><dd><time dateTime="2026-11-02">2 November 2026</time></dd></div><div><dt>Workspace</dt><dd>Studio</dd></div></dl></div></TabsContent>
      <TabsContent value="activity"><div className="navigation-preview-activity"><Avatar name="Alex Morgan" size="sm" decorative /><div><h3>Activity for {name || "Untitled project"}</h3><p className="pk-text-muted">{notes === 0 ? "No notes yet. Add a note in Overview." : `${notes} local ${notes === 1 ? "note was" : "notes were"} added to this preview.`}</p></div></div></TabsContent>
    </Tabs>
    <section className="navigation-preview-section"><h3>Manual activation</h3><p>Move with arrow keys, then press Enter or Space to activate a tab.</p>
      <Tabs defaultValue="summary" variant="pills" size="sm" activationMode="manual"><TabsList aria-label="Report views"><TabsTrigger value="summary">Summary</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList><TabsContent value="summary">The report is ready for review.</TabsContent><TabsContent value="history">The last review was completed on 23 October.</TabsContent></Tabs>
    </section>
    <section className="navigation-preview-section" dir="rtl"><h3>Right-to-left tabs</h3><Tabs defaultValue="details" dir="rtl"><TabsList aria-label="Right-to-left views"><TabsTrigger value="details">التفاصيل</TabsTrigger><TabsTrigger value="history">السجل</TabsTrigger></TabsList><TabsContent value="details">تفاصيل المشروع</TabsContent><TabsContent value="history">سجل المشروع</TabsContent></Tabs></section>
  </div>;
}

function AccordionPreview() {
  return <div className="navigation-preview">
    <section><div className="navigation-preview-intro"><Heading as="h3" size="3">Project questions</Heading><p className="pk-text-muted">A few details before the team gets started.</p></div><Accordion type="single" collapsible defaultValue="scope" aria-label="Project questions">
      <AccordionItem value="scope"><AccordionHeader><AccordionTrigger>What belongs in the project?</AccordionTrigger></AccordionHeader><AccordionContent><p>Keep the brief, tasks, owners and review dates together. Record decisions beside the work they affect so the next person can pick up where you left off.</p></AccordionContent></AccordionItem>
      <AccordionItem value="access"><AccordionHeader><AccordionTrigger>Who can access the workspace?</AccordionTrigger></AccordionHeader><AccordionContent><p>Workspace members can follow the projects shared with their team. Your application decides membership and permissions; these records are fictional.</p></AccordionContent></AccordionItem>
      <AccordionItem value="archive" disabled><AccordionHeader><AccordionTrigger>Archive policy unavailable</AccordionTrigger></AccordionHeader><AccordionContent>Not available in this preview.</AccordionContent></AccordionItem>
    </Accordion></section>
    <section className="navigation-preview-section"><h3>Several sections can stay open</h3><Accordion type="multiple" defaultValue={["notes"]} aria-label="Project reference">
      <AccordionItem value="notes"><AccordionHeader><AccordionTrigger>Notes</AccordionTrigger></AccordionHeader><AccordionContent>Keep decisions with the task they affect.</AccordionContent></AccordionItem>
      <AccordionItem value="files"><AccordionHeader><AccordionTrigger>Files</AccordionTrigger></AccordionHeader><AccordionContent>Attach the brief and supporting documents.</AccordionContent></AccordionItem>
    </Accordion></section>
  </div>;
}

function CollapsiblePreview() {
  const [open, setOpen] = useState(false);
  return <div className="navigation-preview"><Stack gap="2"><Heading as="h3" size="3">Launch checklist</Heading><p className="pk-text-muted">Keep project details close without interrupting the task.</p></Stack><Collapsible open={open} onOpenChange={setOpen}>
    <CollapsibleTrigger asChild><Button variant="outline" endIcon={<ChevronDownIcon size="sm" className="pk-collapsible-chevron" />}>{open ? "Hide project details" : "Show project details"}</Button></CollapsibleTrigger>
    <CollapsibleContent><dl className="navigation-preview-details"><div><dt>Owner</dt><dd><Inline gap="2"><Avatar name="Alex Morgan" size="sm" decorative />Alex Morgan</Inline></dd></div><div><dt>Reference</dt><dd><code>PROJECT-204</code></dd></div><div><dt>Next review</dt><dd>2 November 2026</dd></div></dl></CollapsibleContent>
  </Collapsible><section className="navigation-preview-section"><h3>Inline disclosure</h3><Collapsible defaultOpen><CollapsibleTrigger>Working notes</CollapsibleTrigger><CollapsibleContent><p>Confirm the release owner before sharing the checklist with the team.</p></CollapsibleContent></Collapsible></section><section className="navigation-preview-section"><h3>Unavailable details</h3><Collapsible disabled><CollapsibleTrigger asChild><Button disabled variant="outline" endIcon={<ChevronDownIcon size="sm" className="pk-collapsible-chevron" />}>Restricted details</Button></CollapsibleTrigger><CollapsibleContent>Restricted content</CollapsibleContent></Collapsible></section></div>;
}

function BreadcrumbsPreview() {
  const [destination, setDestination] = useState("Launch checklist");
  function renderLink(props: NavigationLinkProps) {
    return <a {...props} onClick={event => { props.onClick?.(event); if (!event.defaultPrevented) { event.preventDefault(); setDestination(String(props.children)); } }} />;
  }
  const items = [{ id: "workspace", label: "Workspace", href: "/workspace" }, { id: "projects", label: "Projects", href: "/projects" }, { id: "launch", label: "Launch checklist" }];
  return <div className="navigation-preview"><Stack gap="3"><Breadcrumbs items={items} renderLink={renderLink} /><Heading as="h3" size="3">Launch checklist</Heading><p className="pk-text-muted">The release plan, decisions and next steps for the Studio team.</p><p role="status" className="navigation-preview-status">Preview destination: {destination}</p></Stack>
    <section className="navigation-preview-section"><h3>Long project names</h3><Breadcrumbs label="Long project breadcrumb" items={[...items.slice(0, 2), { id: "long", label: "International workspace coordination and launch preparation for the coming quarter" }]} renderLink={renderLink} /></section>
    <section className="navigation-preview-section" dir="rtl"><h3>Right-to-left path</h3><Breadcrumbs label="Right-to-left breadcrumb" items={[{ id: "home", label: "مساحة العمل", href: "/workspace" }, { id: "project", label: "المشروع الحالي" }]} renderLink={renderLink} /></section>
  </div>;
}

function NavbarPreview() {
  const [narrow, setNarrow] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [active, setActive] = useState("projects");
  const [created, setCreated] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const [showAction, setShowAction] = useState(true);
  const items = [{ id: "projects", label: "Projects", href: "/projects" }, { id: "team", label: "Team", href: "/team" }, { id: "reports", label: "Reports", href: "/reports", disabled: true }];
  function renderLink(props: NavigationLinkProps) {
    return <a {...props} onClick={event => {
      props.onClick?.(event);
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const item = items.find(item => item.href === props.href);
      if (item) setActive(item.id);
    }} />;
  }
  return <div className="navigation-preview">
    <div className="navigation-preview-navbar-frame" data-narrow={narrow || undefined} dir={rtl ? "rtl" : "ltr"}>
      <Navbar brand={unavailable ? "Northstar" : <a href="#navbar-content">Northstar</a>} items={unavailable ? items.map(item => ({ ...item, disabled: true })) : items} activeItemId={active} contentId="navbar-content" dir={rtl ? "rtl" : "ltr"} navLabel="Preview navigation" renderLink={renderLink} actions={showAction ? <Button size="sm" onClick={() => setCreated(value => value + 1)}>Create project</Button> : null} />
      <section id="navbar-content" tabIndex={-1} className="navigation-preview-navbar-content"><div className="navigation-preview-intro"><Heading as="h3" size="3">{active === "projects" ? "Projects" : "Team"}</Heading><p className="pk-text-muted">{active === "projects" ? "Work in progress across the Studio workspace." : "The people responsible for the next step."}</p></div>{active === "projects" ? <ul className="navigation-preview-records"><li><div><strong>Website refresh</strong><span>Alex Morgan</span></div><Badge tone="accent">In review</Badge></li><li><div><strong>Research library</strong><span>Noor Aziz</span></div><Badge>In progress</Badge></li>{Array.from({ length: created }, (_, index) => <li key={index}><div><strong>Project draft {index + 1}</strong><span>Not assigned</span></div><Badge>Draft</Badge></li>)}</ul> : <ul className="navigation-preview-records">{["Alex Morgan", "Noor Aziz", "Sam Rivera"].map((person, index) => <li key={person}><Inline gap="3"><Avatar name={person} size="sm" decorative /><strong>{person}</strong></Inline><span className="pk-caption">{index === 0 ? "Workspace owner" : "Member"}</span></li>)}</ul>}<p role="status" className="navigation-preview-status">{created === 0 ? "Choose a destination or create a local project." : `${created} local ${created === 1 ? "project" : "projects"} created.`}</p></section>
    </div>
    <section className="navigation-preview-section"><h3>Preview options</h3><div className="navigation-preview-actions"><Button variant="outline" aria-pressed={narrow} onClick={() => setNarrow(value => !value)}>{narrow ? "Use wide preview" : "Use narrow preview"}</Button><Button variant="outline" aria-pressed={rtl} onClick={() => setRtl(value => !value)}>Preview RTL</Button><Button variant="outline" aria-pressed={unavailable} onClick={() => setUnavailable(value => !value)}>Use unavailable navigation</Button><Button variant="outline" aria-pressed={!showAction} onClick={() => setShowAction(value => !value)}>{showAction ? "Hide global action" : "Show global action"}</Button></div></section>
  </div>;
}

function PaginationPreview() {
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(12);
  const projectNames = ["Website refresh", "Research library", "Launch checklist", "Workspace guide", "Annual review", "Content audit"];
  function toggleBusy(event: MouseEvent<HTMLButtonElement>) {
    // Keep focus on the persistent action while pagination becomes unavailable.
    event.currentTarget.focus();
    setBusy(value => !value);
  }
  function renderPageLink({ page: target, onClick, ...props }: PaginationPageLinkProps) {
    return <a {...props} href={`?page=${target}`} onClick={event => { onClick?.(event); if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) event.preventDefault(); }} />;
  }
  return <div className="navigation-preview"><section><div className="navigation-preview-intro"><Heading as="h3" size="3">Project pages</Heading><p className="pk-text-muted">Showing local page {count === 0 ? 0 : page}.</p></div>{count === 0 ? <div className="navigation-preview-empty"><Heading as="h4" size="4">No projects to show</Heading><p className="pk-text-muted">Restore the sample results to continue browsing.</p></div> : <ul className="navigation-preview-records" aria-busy={busy}>{[0, 1, 2].map(index => { const record = (page - 1) * 3 + index; return <li key={record}><div><strong>{projectNames[record % projectNames.length]}</strong><span>PROJECT-{String(record + 1).padStart(3, "0")}</span></div><Badge>{index === 0 ? "In review" : "In progress"}</Badge></li>; })}</ul>}<div className="navigation-preview-pagination-footer"><Pagination page={page} pageCount={count} onPageChange={setPage} busy={busy} label="Project pages" statusText={busy ? "Updating project pages…" : undefined} /></div></section>
    <section className="navigation-preview-section"><h3>Preview options</h3><div className="navigation-preview-actions"><Button variant="outline" aria-pressed={busy} onClick={toggleBusy}>{busy ? "Finish updating" : "Simulate updating"}</Button><Button variant="outline" onClick={() => { setCount(value => value === 0 ? 12 : 0); setPage(1); }}>{count === 0 ? "Restore results" : "Show empty results"}</Button></div></section>
    <section className="navigation-preview-section"><h3>Compact footer</h3><Pagination page={page} pageCount={count} onPageChange={setPage} busy={busy} compact label="Compact project pages" /></section>
    <section className="navigation-preview-section"><h3>Router links</h3><Pagination page={page} pageCount={count} onPageChange={setPage} busy={busy} label="Linked project pages" renderPageLink={renderPageLink} /></section>
  </div>;
}

export function NavigationPreview({ id }: { id: string }) {
  switch (id) {
    case "tabs": return <TabsPreview />;
    case "accordion": return <AccordionPreview />;
    case "collapsible": return <CollapsiblePreview />;
    case "breadcrumbs": return <BreadcrumbsPreview />;
    case "navbar": return <NavbarPreview />;
    case "pagination": return <PaginationPreview />;
    default: return null;
  }
}
