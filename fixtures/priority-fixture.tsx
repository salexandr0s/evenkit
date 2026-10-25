"use client";

import { useState } from "react";
import * as Kit from "@evenkit/ui";
import { RecordWorkflow, type WorkflowRecord } from "./blocks/record-workflow";
import { RecoveryPage } from "./blocks/recovery-page";
import { RoadmapFixture } from "./roadmap-fixture";

const requiredExports: readonly (keyof typeof Kit)[] = [
  "Prose", "Container", "Stack", "Separator", "Card", "PageHeader", "ActionGroup", "VisuallyHidden",
  "Checkbox", "RadioGroup", "Switch", "Toggle", "ToggleGroup", "SegmentedControl", "ButtonGroup", "CopyAction",
  "Fieldset", "FormErrorSummary", "SearchField", "PasswordField", "Combobox", "FormActions", "SaveStatus",
  "Tabs", "Accordion", "Collapsible", "Breadcrumbs", "Navbar", "NavbarBrand", "Pagination",
  "DropdownMenu", "Popover", "AlertDialog", "Sheet", "ToastProvider", "Progress", "Meter",
  "Avatar", "Tag", "DataList", "ListItem", "Kbd", "SemanticTable", "FilterBar", "AppliedFilters",
  "FileInput", "FileRow", "AccountMenu",
];

export function PriorityFixture() {
  const [checked, setChecked] = useState(false);
  const [project, setProject] = useState<string | null>("alpha");
  const [files, setFiles] = useState(0);
  const [records, setRecords] = useState<readonly WorkflowRecord[]>([{ id: "packed", name: "Packed editable record", notes: "Local fixture data", status: "draft" }]);
  for (const name of requiredExports) if (Kit[name] === undefined) throw new Error(`Missing packed export: ${name}`);
  return <section aria-label="Packed priority controls">
    <Kit.PageHeader headingAs="h2" title="Priority package controls" description="Public exports installed from packed artifacts." />
    <Kit.Navbar
      brand={<Kit.NavbarBrand href="#packed-navigation" logo={<Kit.ShapesIcon />} description="Package consumer">Packed navigation</Kit.NavbarBrand>}
      navLabel="Packed primary navigation"
      items={[
        { id: "overview", label: "Overview", href: "#packed-navigation" },
        { id: "resources", label: "Resources", items: [
          { id: "guides", label: "Guides", href: "#packed-guides" },
          { id: "support", label: "Support", href: "#packed-support" },
        ] },
      ]}
      activeItemId="overview"
      account={{ label: "Sign in to package preview", href: "#packed-account" }}
      contact={{ label: "Contact", href: "#packed-contact" }}
      contentId="packed-navigation"
    />
    <div id="packed-navigation" tabIndex={-1}>Packed header with grouped navigation and account actions.</div>
    <Kit.Card><Kit.CardHeader><h3>Packed foundations</h3></Kit.CardHeader><Kit.CardBody>
      <Kit.Avatar name="Alex Morgan" />
      <Kit.Tag>Package preview</Kit.Tag>
      <Kit.DataList><Kit.DataListItem term="State">Ready for evaluation</Kit.DataListItem></Kit.DataList>
      <Kit.Kbd>Enter</Kit.Kbd>
    </Kit.CardBody></Kit.Card>
    <Kit.Fieldset legend="Packed form controls">
      <Kit.Checkbox label="Accept package preview" name="accepted" checked={checked} onCheckedChange={value => setChecked(value === true)} />
      <Kit.Switch label="Local notifications" defaultChecked />
      <Kit.RadioGroup label="View" defaultValue="list" options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
      <Kit.SearchField label="Find packed records" />
      <Kit.PasswordField label="Example password" autoComplete="new-password" />
      <Kit.Combobox label="Packed project" name="project" value={project} onValueChange={setProject} options={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]} />
    </Kit.Fieldset>
    <Kit.Tabs defaultValue="details"><Kit.TabsList aria-label="Packed record"><Kit.TabsTrigger value="details">Details</Kit.TabsTrigger></Kit.TabsList><Kit.TabsContent value="details">Packed tab content</Kit.TabsContent></Kit.Tabs>
    <Kit.DropdownMenu><Kit.DropdownMenuTrigger asChild><Kit.Button>Package actions</Kit.Button></Kit.DropdownMenuTrigger><Kit.DropdownMenuContent><Kit.DropdownMenuItem>Review package</Kit.DropdownMenuItem></Kit.DropdownMenuContent></Kit.DropdownMenu>
    <Kit.Popover><Kit.PopoverTrigger asChild><Kit.Button>Package details</Kit.Button></Kit.PopoverTrigger><Kit.PopoverContent><Kit.PopoverTitle>Installed package</Kit.PopoverTitle><Kit.PopoverDescription>Uses the kit surface and behavior.</Kit.PopoverDescription></Kit.PopoverContent></Kit.Popover>
    <Kit.ToastProvider><Kit.Progress label="Package build" value={100} /><Kit.Meter label="Fixture records" value={2} max={10} /></Kit.ToastProvider>
    <Kit.SemanticTable><Kit.TableCaption>Packed semantic rows</Kit.TableCaption><Kit.TableHeader><Kit.TableRow><Kit.TableHead>Project</Kit.TableHead></Kit.TableRow></Kit.TableHeader><Kit.TableBody><Kit.TableRow><Kit.TableCell>Alpha</Kit.TableCell></Kit.TableRow></Kit.TableBody></Kit.SemanticTable>
    <Kit.FileInput label="Packed attachment" onFilesSelected={selection => setFiles(selection.accepted.length)} />
    <p role="status">{files} files selected locally.</p>
    <Kit.AccountMenu name="Alex Morgan" links={[{ id: "profile", label: "Profile", href: "#profile" }]} />
    <RecordWorkflow title="Packed editable projects" records={records} onSave={async (draft, { signal }) => {
      signal.throwIfAborted();
      const saved: WorkflowRecord = { ...draft, id: draft.id ?? "created-in-fixture" };
      setRecords(current => [...current.filter(record => record.id !== saved.id), saved]);
      return saved;
    }} />
    <RecoveryPage headingAs="h3" kind="offline" action={<Kit.ButtonLink href="#reconnect">Reconnect</Kit.ButtonLink>} />
    <RoadmapFixture />
  </section>;
}
