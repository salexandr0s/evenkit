import { useRef, useState, type MouseEvent } from "react";
import {
  AdminShell, Avatar, Badge, Button, CompassIcon, Dialog, DialogBody, DialogContent,
  DialogDescription, DialogFooter, DialogHeader, DialogTitle, FolderIcon, Heading,
  Inline, LayoutDashboardIcon, Navbar, NavbarBrand, SelectField, TextareaField, TextField, UsersIcon,
  type AdminLinkProps, type NavigationLinkProps, type NavbarGroup, type NavbarItem,
} from "@evenkit/ui";

const studioItems: readonly (NavbarItem | NavbarGroup)[] = [
  { id: "studio", label: "Studio", href: "/studio" },
  { id: "work", label: "Work", items: [
    { id: "websites", label: "Websites", href: "/work/websites" },
    { id: "applications", label: "Applications", href: "/work/applications" },
  ] },
  { id: "journal", label: "Journal", href: "/journal" },
  { id: "about", label: "About", href: "/about" },
];

const studioPages: Record<string, { label: string; title: string; description: string }> = {
  studio: { label: "Independent design studio", title: "We design websites and applications.", description: "A small team working with you from the first sketch to the final release." },
  websites: { label: "Selected work / Websites", title: "A place for your work on the web.", description: "Clear content, considered details and room for your organisation to grow." },
  applications: { label: "Selected work / Applications", title: "Tools for the way your team works.", description: "From project workspaces to customer portals, we design around the task at hand." },
  journal: { label: "Studio journal", title: "Notes from the studio.", description: "Ideas, working methods and details from the projects on our desks." },
  about: { label: "About Northstar", title: "A small team, working together.", description: "Designers and developers sharing the work from early conversations to launch day." },
  profile: { label: "Your studio account", title: "Alex Morgan", description: "Your projects and conversations with the Northstar team." },
};

function ordinaryLink(event: MouseEvent<HTMLAnchorElement>) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
    && !event.currentTarget.hasAttribute("download") && (!event.currentTarget.target || event.currentTarget.target === "_self");
}

export function WebsiteNavbarExample() {
  const [active, setActive] = useState("studio");
  const [narrow, setNarrow] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [enquirySaved, setEnquirySaved] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const returnFocusKind = useRef<"account" | "contact">("account");
  const current = studioPages[active] ?? studioPages.studio!;
  const previewState = unavailable ? "unavailable" : signedIn ? "signed-in" : active === "websites" || active === "applications" ? "selected" : "default";
  const items = studioItems.map(item => item.id === "journal" ? { ...item, disabled: unavailable } : item);

  function changePreviewState(value: string) {
    setUnavailable(value === "unavailable");
    setSignedIn(value === "signed-in");
    setActive(value === "selected" ? "websites" : "studio");
  }

  function rememberFocus(kind: "account" | "contact") {
    returnFocusKind.current = kind;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  function restoreFocus(event: Event) {
    event.preventDefault();
    if (returnFocus.current?.isConnected && returnFocus.current.getClientRects().length) {
      returnFocus.current.focus({ preventScroll: true });
      return;
    }
    const menu = frame.current?.querySelector<HTMLElement>('[aria-label="Open studio navigation"]');
    if (returnFocusKind.current === "contact" && menu?.getClientRects().length) menu.focus({ preventScroll: true });
    else frame.current?.querySelector<HTMLElement>(`[aria-label="${signedIn ? "Alex Morgan account" : "Sign in"}"]`)?.focus({ preventScroll: true });
  }
  function openContact() { rememberFocus("contact"); setEnquirySaved(false); setContactOpen(true); }
  function renderLink(props: NavigationLinkProps) {
    return <a {...props} onClick={event => {
      props.onClick?.(event);
      if (!ordinaryLink(event)) return;
      event.preventDefault();
      const item = studioItems.flatMap(item => "items" in item ? item.items : [item]).find(item => item.href === props.href);
      if (item) setActive(item.id);
    }} />;
  }

  return <section className="navbar-example-section navbar-website-section" data-narrow={narrow || undefined} aria-labelledby="navbar-website-title">
    <div className="navbar-example-caption">
      <div><h3 id="navbar-website-title">Website header</h3><p>Brand, primary navigation and a clear next step.</p></div>
      <div className="navbar-example-tools">
        <SelectField label="Header state" fieldClassName="navbar-state-select" controlSize="sm" value={previewState} onValueChange={changePreviewState} options={[
          { value: "default", label: "Default" },
          { value: "selected", label: "Selected group" },
          { value: "signed-in", label: "Signed in" },
          { value: "unavailable", label: "Unavailable destination" },
        ]} />
        <Button size="sm" variant="outline" aria-pressed={narrow} onClick={() => setNarrow(value => !value)}>{narrow ? "Use full website preview" : "Use mobile website preview"}</Button>
      </div>
    </div>
    <div ref={frame} className="navbar-website-example" data-narrow={narrow || undefined}>
      <Navbar
        brand={<NavbarBrand href="/studio" logo={<CompassIcon size="lg" />} description="Design & development" onClick={event => { if (ordinaryLink(event)) { event.preventDefault(); setActive("studio"); } }}>Northstar Studio</NavbarBrand>}
        items={items}
        activeItemId={active}
        renderLink={renderLink}
        contentId="navbar-studio-content"
        navLabel="Studio navigation"
        menuLabel="Open studio navigation"
        closeMenuLabel="Close studio navigation"
        menuDescription="Explore the studio or start a conversation."
        account={signedIn ? {
          label: "Alex Morgan account", name: "Alex Morgan", description: "alex@example.com",
          icon: <Avatar name="Alex Morgan" size="sm" decorative />,
          items: [
            { id: "profile", label: "Your profile", onSelect: () => setActive("profile") },
            { id: "sign-out", label: "Sign out", onSelect: () => { setSignedIn(false); setActive("studio"); } },
          ],
        } : { label: "Sign in", onSelect: () => { rememberFocus("account"); setSignInOpen(true); } }}
        contact={{ label: "Contact", onSelect: openContact }}
      />
      <section id="navbar-studio-content" tabIndex={-1} className="navbar-studio-content">
        <p className="navbar-studio-eyebrow">{current.label}</p>
        <Heading as="h4" size="2">{current.title}</Heading>
        <p className="navbar-studio-description">{current.description}</p>
        <div className="navbar-studio-services"><div><span>01</span><strong>Websites</strong><p>Identity, content and a home on the web.</p></div><div><span>02</span><strong>Applications</strong><p>Useful tools for everyday work.</p></div></div>
      </section>
    </div>
    <p className="navbar-example-note">Choose a destination, open Contact, or try the account control. These examples keep changes in this page.</p>
    <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
      <DialogContent size="sm" onCloseAutoFocus={restoreFocus}>
        <DialogHeader><DialogTitle>Sign in to Northstar</DialogTitle><DialogDescription>Use a demo account to see the signed-in header. No account is created.</DialogDescription></DialogHeader>
        <DialogBody><div className="navbar-demo-account"><Avatar name="Alex Morgan" decorative /><div><strong>Alex Morgan</strong><p>alex@example.com</p></div></div></DialogBody>
        <DialogFooter><Button variant="outline" onClick={() => setSignInOpen(false)}>Cancel</Button><Button onClick={() => { setSignedIn(true); setSignInOpen(false); }}>Use demo account</Button></DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog open={contactOpen} onOpenChange={setContactOpen}>
      <DialogContent onCloseAutoFocus={restoreFocus}>
        <DialogHeader><DialogTitle>Contact Northstar</DialogTitle><DialogDescription>Tell us what you have in mind. This preview saves the enquiry locally without sending it.</DialogDescription></DialogHeader>
        <form className="navbar-contact-form" onSubmit={event => { event.preventDefault(); setEnquirySaved(true); }}>
          <TextField label="Your name" name="name" autoComplete="name" required />
          <TextField label="Email address" name="email" type="email" autoComplete="email" required />
          <TextareaField label="About your project" name="message" rows={3} required />
          {enquirySaved ? <p role="status" className="navbar-contact-success">Enquiry saved in this preview. Nothing was sent.</p> : null}
          <DialogFooter><Button variant="outline" onClick={() => setContactOpen(false)}>Close</Button><Button type="submit">Save enquiry</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </section>;
}

const workspaceNavigation = [{ label: "Workspace", items: [
  { id: "overview", label: "Overview", href: "/workspace", icon: <LayoutDashboardIcon /> },
  { id: "projects", label: "Projects", href: "/workspace/projects", icon: <FolderIcon /> },
  { id: "team", label: "Team", href: "/workspace/team", icon: <UsersIcon /> },
] }];

export function ApplicationNavbarExample() {
  const [active, setActive] = useState("overview");
  const [section, setSection] = useState("workspace");
  function renderLink(props: NavigationLinkProps | AdminLinkProps) {
    return <a {...props} onClick={event => {
      props.onClick?.(event);
      if (!ordinaryLink(event)) return;
      event.preventDefault();
      const item = workspaceNavigation[0]!.items.find(item => item.href === props.href);
      if (item) { setActive(item.id); setSection("workspace"); }
      else if (props.href === "/activity") setSection("activity");
    }} />;
  }
  const title = section === "activity" ? "Workspace activity" : section === "support" ? "Workspace support" : section === "account" ? "Your workspace account" : active === "projects" ? "Workspace projects" : active === "team" ? "Workspace team" : "Workspace overview";
  return <section className="navbar-example-section" aria-labelledby="navbar-application-title">
    <div className="navbar-example-caption"><div><h3 id="navbar-application-title">Application header and sidebar</h3><p>Global destinations above the workspace. Project navigation alongside it.</p></div></div>
    <div className="navbar-application-example">
      <Navbar
        brand={<NavbarBrand href="/workspace" logo={<CompassIcon />} onClick={event => { if (ordinaryLink(event)) { event.preventDefault(); setSection("workspace"); setActive("overview"); } }}>Northstar</NavbarBrand>}
        items={[{ id: "workspace", label: "Workspace", href: "/workspace" }, { id: "activity", label: "Activity", href: "/activity" }]}
        activeItemId={section}
        renderLink={renderLink}
        navLabel="Workspace navigation"
        menuLabel="Open workspace navigation"
        closeMenuLabel="Close workspace navigation"
        contentId="navbar-workspace-content"
        account={{ label: "Workspace account", name: "Alex Morgan", description: "Studio workspace", icon: <Avatar name="Alex Morgan" size="sm" decorative />, items: [{ id: "account", label: "Workspace profile", onSelect: () => setSection("account") }] }}
        contact={{ label: "Support", onSelect: () => setSection("support") }}
      />
      <AdminShell
        brand={<Inline gap="2"><FolderIcon /><strong>Studio workspace</strong></Inline>}
        compactBrand={<FolderIcon />}
        navigation={workspaceNavigation}
        activeItemId={section === "workspace" ? active : ""}
        renderLink={renderLink}
        navLabel="Project navigation"
        contentAs="section"
        contentId="navbar-workspace-content"
        header={<span className="navbar-workspace-context">Studio / {title.replace("Workspace ", "")}</span>}
        footer={<span>Northstar Studio</span>}
      >
        <div className="navbar-workspace-page"><Heading as="h4" size="3">{title}</Heading>
          {section === "support" ? <p>For help with this workspace, contact your workspace owner, Alex Morgan.</p>
            : section === "account" ? <div className="navbar-demo-account"><Avatar name="Alex Morgan" decorative /><div><strong>Alex Morgan</strong><p>Workspace owner</p></div></div>
              : section === "activity" ? <ul className="navigation-preview-records"><li><div><strong>Website refresh moved to review</strong><span>Alex Morgan · Today</span></div><Badge tone="accent">Updated</Badge></li><li><div><strong>Research notes added</strong><span>Noor Aziz · Yesterday</span></div><Badge>Document</Badge></li></ul>
                : active === "team" ? <ul className="navigation-preview-records">{["Alex Morgan", "Noor Aziz", "Sam Rivera"].map(name => <li key={name}><Inline gap="3"><Avatar name={name} size="sm" decorative /><strong>{name}</strong></Inline><Badge>{name === "Alex Morgan" ? "Owner" : "Member"}</Badge></li>)}</ul>
                  : <><p>{active === "projects" ? "Current work across the Studio workspace." : "Keep the next step in view."}</p><ul className="navigation-preview-records"><li><div><strong>Website refresh</strong><span>Alex Morgan</span></div><Badge tone="accent">In review</Badge></li><li><div><strong>Research library</strong><span>Noor Aziz</span></div><Badge>In progress</Badge></li></ul></>}
        </div>
      </AdminShell>
    </div>
  </section>;
}
