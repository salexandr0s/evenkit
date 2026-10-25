import { useState, type MouseEvent } from "react";
import {
  Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger,
  Breadcrumbs, Button, Collapsible, CollapsibleContent, CollapsibleTrigger,
  Navbar, Pagination, Tabs, TabsContent, TabsList, TabsTrigger, TextField,
  type NavigationLinkProps, type PaginationPageLinkProps,
} from "@project-kit/ui";
import "./navigation-preview.css";

function TabsPreview() {
  const [active, setActive] = useState("overview");
  const [name, setName] = useState("Launch checklist");
  const [notes, setNotes] = useState(0);
  return <div className="navigation-preview">
    <Tabs value={active} onValueChange={setActive}>
      <TabsList aria-label="Project views"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="review" disabled>Review</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>
      <TabsContent value="overview"><div className="navigation-preview-stack"><TextField label="Project title" value={name} onChange={event => setName(event.target.value)} /><Button onClick={() => setNotes(value => value + 1)}>Add activity note</Button><p role="status">{notes} {notes === 1 ? "note" : "notes"} recorded.</p></div></TabsContent>
      <TabsContent value="activity"><h3>Activity for {name || "Untitled project"}</h3><p>{notes === 0 ? "No notes yet. Add a note in Overview." : `${notes} local ${notes === 1 ? "note was" : "notes were"} added to this preview.`}</p></TabsContent>
    </Tabs>
    <section className="navigation-preview-section"><h3>Manual activation</h3><p>Move with arrow keys, then press Enter or Space to activate a tab.</p>
      <Tabs defaultValue="summary" variant="pills" size="sm" activationMode="manual"><TabsList aria-label="Report views"><TabsTrigger value="summary">Summary</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList><TabsContent value="summary">The report is ready for review.</TabsContent><TabsContent value="history">The last review was completed on 23 October.</TabsContent></Tabs>
    </section>
    <section className="navigation-preview-section" dir="rtl"><h3>Right-to-left tabs</h3><Tabs defaultValue="details" dir="rtl"><TabsList aria-label="Right-to-left views"><TabsTrigger value="details">التفاصيل</TabsTrigger><TabsTrigger value="history">السجل</TabsTrigger></TabsList><TabsContent value="details">تفاصيل المشروع</TabsContent><TabsContent value="history">سجل المشروع</TabsContent></Tabs></section>
  </div>;
}

function AccordionPreview() {
  return <div className="navigation-preview">
    <section><h3>One section at a time</h3><Accordion type="single" collapsible defaultValue="scope" aria-label="Project questions">
      <AccordionItem value="scope"><AccordionHeader><AccordionTrigger>What belongs in the project?</AccordionTrigger></AccordionHeader><AccordionContent><p>Tasks, owners, and dates keep the launch plan in one place.</p></AccordionContent></AccordionItem>
      <AccordionItem value="access"><AccordionHeader><AccordionTrigger>Who can access the workspace?</AccordionTrigger></AccordionHeader><AccordionContent><p>Your application decides membership and permissions. This preview uses fictional records.</p></AccordionContent></AccordionItem>
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
  return <div className="navigation-preview"><Collapsible open={open} onOpenChange={setOpen}>
    <CollapsibleTrigger asChild><Button variant="outline">{open ? "Hide project details" : "Show project details"}</Button></CollapsibleTrigger>
    <CollapsibleContent><dl className="navigation-preview-details"><div><dt>Owner</dt><dd>Alex Morgan</dd></div><div><dt>Reference</dt><dd>PROJECT-204</dd></div></dl></CollapsibleContent>
  </Collapsible><Collapsible disabled><CollapsibleTrigger asChild><Button disabled variant="outline">Restricted details</Button></CollapsibleTrigger><CollapsibleContent>Restricted content</CollapsibleContent></Collapsible></div>;
}

function BreadcrumbsPreview() {
  const [destination, setDestination] = useState("Launch checklist");
  function renderLink(props: NavigationLinkProps) {
    return <a {...props} onClick={event => { props.onClick?.(event); if (!event.defaultPrevented) { event.preventDefault(); setDestination(String(props.children)); } }} />;
  }
  const items = [{ id: "workspace", label: "Workspace", href: "/workspace" }, { id: "projects", label: "Projects", href: "/projects" }, { id: "launch", label: "Launch checklist" }];
  return <div className="navigation-preview"><Breadcrumbs items={items} renderLink={renderLink} /><p role="status">Preview destination: {destination}</p>
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
  return <div className="navigation-preview"><div className="navigation-preview-actions"><Button variant="outline" aria-pressed={narrow} onClick={() => setNarrow(value => !value)}>{narrow ? "Use wide preview" : "Use narrow preview"}</Button><Button variant="outline" aria-pressed={rtl} onClick={() => setRtl(value => !value)}>Preview RTL</Button><Button variant="outline" aria-pressed={unavailable} onClick={() => setUnavailable(value => !value)}>Use unavailable navigation</Button><Button variant="outline" aria-pressed={!showAction} onClick={() => setShowAction(value => !value)}>{showAction ? "Hide global action" : "Show global action"}</Button></div>
    <div className="navigation-preview-navbar-frame" data-narrow={narrow || undefined} dir={rtl ? "rtl" : "ltr"}>
      <Navbar brand={unavailable ? "Northstar" : <a href="#navbar-content">Northstar</a>} items={unavailable ? items.map(item => ({ ...item, disabled: true })) : items} activeItemId={active} contentId="navbar-content" dir={rtl ? "rtl" : "ltr"} navLabel="Preview navigation" renderLink={renderLink} actions={showAction ? <Button size="sm" onClick={() => setCreated(value => value + 1)}>Create project</Button> : null} />
      <section id="navbar-content" tabIndex={-1} className="navigation-preview-navbar-content"><h3>{active === "projects" ? "Projects" : "Team"}</h3><p role="status">{created === 0 ? "Choose a destination or create a local project." : `${created} local ${created === 1 ? "project" : "projects"} created.`}</p></section>
    </div>
  </div>;
}

function PaginationPreview() {
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(12);
  function toggleBusy(event: MouseEvent<HTMLButtonElement>) {
    // Keep focus on the persistent action while pagination becomes unavailable.
    event.currentTarget.focus();
    setBusy(value => !value);
  }
  function renderPageLink({ page: target, onClick, ...props }: PaginationPageLinkProps) {
    return <a {...props} href={`?page=${target}`} onClick={event => { onClick?.(event); if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) event.preventDefault(); }} />;
  }
  return <div className="navigation-preview"><section><h3>Project pages</h3><p>Showing local page {count === 0 ? 0 : page}.</p><Pagination page={page} pageCount={count} onPageChange={setPage} busy={busy} label="Project pages" statusText={busy ? "Updating project pages…" : undefined} /><div className="navigation-preview-actions"><Button variant="outline" aria-pressed={busy} onClick={toggleBusy}>{busy ? "Finish updating" : "Simulate updating"}</Button><Button variant="outline" onClick={() => { setCount(value => value === 0 ? 12 : 0); setPage(1); }}>{count === 0 ? "Restore results" : "Show empty results"}</Button></div></section>
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
