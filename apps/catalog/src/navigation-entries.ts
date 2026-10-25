import type { CatalogEntry } from "./catalog-types.js";

const imports = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';

export const navigationEntries: readonly CatalogEntry[] = [
  {
    id: "tabs", name: "Tabs", group: "Controls", inventoryIds: ["E01"],
    description: "Related views with underline or pill styling, keyboard navigation, disabled choices, and automatic or manual activation.",
    tags: ["tabs", "tabpanel", "navigation", "underline", "pills", "manual", "rtl", "E01"],
    source: "Radix Tabs · internal tabs.v1 contract",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/tabs",
    usage: `${imports}import { Tabs, TabsList, TabsTrigger, TabsContent } from "@evenkit/ui";

export function ProjectTabs() {
  return (
    <Tabs defaultValue="overview" variant="underline">
      <TabsList aria-label="Project views">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Project details belong here.</TabsContent>
      <TabsContent value="activity">Recent project activity belongs here.</TabsContent>
    </Tabs>
  );
}

// variant: underline | pills; size: sm | md.
// Set activationMode="manual" when changing views is expensive.
// Supply dir="rtl" for an explicitly right-to-left keyboard model.
`,
  },
  {
    id: "accordion", name: "Accordion", group: "Controls", inventoryIds: ["E02"],
    description: "Expandable sections with semantic headings, single or multiple open items, and keyboard navigation.",
    tags: ["accordion", "disclosure", "faq", "expand", "collapse", "heading", "E02"],
    source: "Radix Accordion · original kit presentation",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/accordion",
    usage: `${imports}import { Accordion, AccordionItem, AccordionHeader,
  AccordionTrigger, AccordionContent } from "@evenkit/ui";

export function ProjectQuestions() {
  return (
    <Accordion type="single" collapsible defaultValue="access">
      <AccordionItem value="access">
        <AccordionHeader>
          <AccordionTrigger>Who can access this project?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Your application supplies the access policy.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="files">
        <AccordionHeader><AccordionTrigger>Where are the files?</AccordionTrigger></AccordionHeader>
        <AccordionContent>Show the relevant document links here.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// type="multiple" uses string[] values and can keep several items open.
// AccordionHeader defaults to h3; use asChild to supply another heading level.
`,
  },
  {
    id: "collapsible", name: "Collapsible", group: "Controls", inventoryIds: ["E03"],
    description: "Show or hide one related region with a named trigger and controlled or uncontrolled state.",
    tags: ["collapsible", "disclosure", "show", "hide", "details", "E03"],
    source: "Radix Collapsible · kit Button composition",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/collapsible",
    usage: `${imports}import { useState } from "react";
import { Button, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@evenkit/ui";

export function ProjectDetails() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline">{open ? "Hide details" : "Show details"}</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>Additional project information belongs here.</CollapsibleContent>
    </Collapsible>
  );
}
`,
  },
  {
    id: "breadcrumbs", name: "Breadcrumbs", group: "Controls", inventoryIds: ["E04"],
    description: "A complete ancestor path with a current-page marker, wrapping long labels, and router integration.",
    tags: ["breadcrumbs", "path", "navigation", "ancestors", "current page", "long labels", "E04"],
    source: "Original kit composition · ARIA breadcrumb pattern",
    sourceUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/",
    usage: `${imports}import { Breadcrumbs } from "@evenkit/ui";

export function ProjectPath() {
  return (
    <Breadcrumbs items={[
      { id: "workspace", label: "Workspace", href: "/workspace" },
      { id: "projects", label: "Projects", href: "/projects" },
      { id: "current", label: "Launch checklist" },
    ]} />
  );
}

// A custom renderLink receives anchor props and ref for your router.
// The final item is current and does not navigate.
`,
  },
  {
    id: "navbar", name: "Navbar", group: "Compositions", inventoryIds: ["E05"],
    description: "A complete website or application header with a linked logo, grouped navigation, account access, contact action, and a responsive mobile drawer.",
    tags: ["navbar", "navigation", "header", "logo", "account", "login", "contact", "mobile", "drawer", "router", "sidebar", "skip link", "E05"],
    source: "Internal navbar.v1 · existing Radix Dialog composition",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: `${imports}import type { ReactNode } from "react";
import { AdminShell, Avatar, CompassIcon, FolderIcon, LayoutDashboardIcon,
  Navbar, NavbarBrand, UsersIcon } from "@evenkit/ui";

interface SessionUser { name: string; email: string }

export function WebsiteLayout({ children, activeItemId, user, onSignIn, onSignOut }: {
  children: ReactNode;
  activeItemId: string;
  user: SessionUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
}) {
  return (
    <>
      <Navbar
        brand={<NavbarBrand href="/" logo={<CompassIcon />}
          description="Design & development">Northstar Studio</NavbarBrand>}
        items={[
          { id: "studio", label: "Studio", href: "/" },
          { id: "work", label: "Work", items: [
            { id: "websites", label: "Websites", href: "/work/websites" },
            { id: "applications", label: "Applications", href: "/work/applications" },
          ] },
          { id: "about", label: "About", href: "/about" },
        ]}
        activeItemId={activeItemId}
        contentId="site-main"
        navLabel="Studio navigation"
        account={user ? {
          label: "Your account", name: user.name, description: user.email,
          icon: <Avatar name={user.name} size="sm" decorative />,
          items: [
            { id: "profile", label: "Your profile", href: "/account" },
            { id: "sign-out", label: "Sign out", onSelect: onSignOut },
          ],
        } : { label: "Sign in", onSelect: onSignIn }}
        contact={{ label: "Contact", href: "/contact" }}
      />
      <main id="site-main" tabIndex={-1}>{children}</main>
    </>
  );
}

export function WorkspaceLayout({ children, activeItemId, user, onSignOut }: {
  children: ReactNode;
  activeItemId: string;
  user: SessionUser;
  onSignOut: () => void;
}) {
  return (
    <>
      <Navbar
        brand={<NavbarBrand href="/workspace" logo={<CompassIcon />}>Northstar</NavbarBrand>}
        items={[
          { id: "workspace", label: "Workspace", href: "/workspace" },
          { id: "activity", label: "Activity", href: "/activity" },
        ]}
        activeItemId="workspace"
        navLabel="Global navigation"
        contentId="workspace-main"
        account={{ label: "Your account", name: user.name, description: user.email,
          items: [{ id: "sign-out", label: "Sign out", onSelect: onSignOut }] }}
        contact={{ label: "Support", href: "/support" }}
      />
      <AdminShell
        brand="Studio workspace"
        compactBrand={<FolderIcon />}
        header="Studio workspace"
        contentId="workspace-main"
        navLabel="Project navigation"
        activeItemId={activeItemId}
        navigation={[{ label: "Workspace", items: [
          { id: "overview", label: "Overview", href: "/workspace", icon: <LayoutDashboardIcon /> },
          { id: "projects", label: "Projects", href: "/workspace/projects", icon: <FolderIcon /> },
          { id: "team", label: "Team", href: "/workspace/team", icon: <UsersIcon /> },
        ] }]}
      >{children}</AdminShell>
    </>
  );
}

// Supply authentication callbacks from your application.
// contact also accepts { label: "Contact", onSelect: openContactDialog }.
// renderLink must forward its ref, children, native events and ARIA props.
// The Navbar sits above AdminShell; its header prop is for local page context.
`,
  },
  {
    id: "pagination", name: "Pagination", group: "Controls", inventoryIds: ["E06"],
    description: "Controlled page navigation with boundaries, compact footers, busy states, and optional router links.",
    tags: ["pagination", "pages", "next", "previous", "list", "table", "busy", "E06"],
    source: "Original kit composition · extracted table navigation contract",
    sourceUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html",
    usage: `${imports}import { useState } from "react";
import { Pagination } from "@evenkit/ui";

export function ProjectPages({ pageCount, onLoadPage }: {
  pageCount: number;
  onLoadPage: (page: number) => void;
}) {
  const [page, setPage] = useState(1);
  return (
    <Pagination page={page} pageCount={pageCount} onPageChange={next => {
      setPage(next);
      onLoadPage(next);
    }} />
  );
}

// page is one-based. The host owns loading, errors and page-range recovery.
// compact hides numbered choices. busy/disabled disables all controls.
// showStatus={false} lets an existing table own its status announcement.
`,
  },
];
