import { createRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AdminShell, ArrowRightIcon, Badge, Button, ButtonLink, ChatWidget, DataTable, Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, FolderIcon, PlusIcon, Select, SelectField, TextareaField, TextField, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, UserIcon, type AdminSidebarState, type ButtonShape, type ChatMessage, type DataTableColumn, type DialogSize, type SelectOptionGroup, type TextareaFieldProps } from "@project-kit/ui";
import "@project-kit/tokens/css";
import "@project-kit/ui/css";
import { ActionMessage, CircleCheckIcon, type ActionMessageProps, type BadgeProps } from "@project-kit/ui";

const element = document.getElementById("root");
if (!element) throw new Error("Missing fixture root.");
const records = [{ id: "one", name: "Independent consumer", members: 3 }];
const sidebarState: AdminSidebarState = "collapsed";
const dialogSize: DialogSize = "sm";
const iconShape: ButtonShape = "icon";
const badgeProps: BadgeProps = { size: "sm", variant: "outline", tone: "success", icon: <CircleCheckIcon />, title: "Packed badge" };
const badgeRef = createRef<HTMLSpanElement>();
const messageProps: ActionMessageProps = { tone: "warning", heading: <h2>Review the package</h2>, title: "Packed feedback", role: "note", "aria-label": "Package feedback" };
const messageRef = createRef<HTMLDivElement>();
const notesProps: TextareaFieldProps = { label: "Notes", name: "notes", optional: true, hint: "Details for the team.", rows: 3 };
const templates: SelectOptionGroup = { id: "team", label: "Team templates", options: [{ value: "blank", label: "Blank project", description: "Start with an empty project." }] };
const columns: readonly DataTableColumn<(typeof records)[number]>[] = [
  { id: "name", header: "Project", accessor: row => row.name },
  { id: "members", header: "Members", accessor: row => row.members, align: "end" },
];

function PreviewChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  function send(content: string) {
    const id = crypto.randomUUID();
    setMessages(previous => [...previous,
      { id, role: "user", content },
      { id: `${id}-reply`, role: "assistant", content: "This response comes from local fixture state." },
    ]);
    setDraft("");
  }

  return <ChatWidget title="Package assistant" launcherLabel="Open package assistant" messages={messages} value={draft} onValueChange={setDraft} onSend={send} suggestions={["Check the packed chat"]} footer="Local package preview" />;
}

createRoot(element).render(<main>
  <h1>Packed package check</h1>
  <Badge {...badgeProps} ref={badgeRef}>Vite consumer</Badge>
  <ActionMessage {...messageProps} ref={messageRef} actions={<ButtonLink href="#projects">Review projects</ButtonLink>}>Persistent feedback from the installed package.</ActionMessage>
  <TextField label="Project name" defaultValue="Independent consumer" required startAdornment={<FolderIcon />} />
  <TextareaField {...notesProps} />
  <SelectField label="Project template" name="template" options={[templates]} defaultValue="blank" hint="Choose a starting point." required />
  <Select aria-label="Visibility" name="visibility" defaultValue="private" options={[{ value: "private", label: "Private" }, { value: "team", label: "Team" }]} />
  <Button>Native button</Button>
  <Button shape={iconShape} aria-label="Create project"><PlusIcon /></Button>
  <Button fullWidth startIcon={<PlusIcon />}>Create project</Button>
  <ButtonLink href="#projects" endIcon={<ArrowRightIcon />}>View projects</ButtonLink>
  <Dialog>
    <DialogTrigger asChild><Button>Open package dialog</Button></DialogTrigger>
    <DialogContent size={dialogSize} scroll="body">
      <DialogHeader>
        <DialogTitle>Package dialog</DialogTitle>
        <DialogDescription>This dialog uses the installed package exports.</DialogDescription>
      </DialogHeader>
      <DialogBody><p>Content scrolls while actions remain available.</p></DialogBody>
      <DialogFooter><DialogClose asChild><Button>Close preview</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>
  <TooltipProvider><Tooltip><TooltipTrigger asChild><Button shape="icon" aria-label="Profile"><UserIcon /></Button></TooltipTrigger><TooltipContent>Open profile</TooltipContent></Tooltip></TooltipProvider>
  <AdminShell defaultSidebarState={sidebarState} compactBrand={<FolderIcon />} contentAs="section" brand="Package kit" header="Projects" activeItemId="projects" navigation={[{ items: [{ id: "projects", label: "Projects", href: "#projects", icon: <FolderIcon /> }] }]}>
    <DataTable caption="Packed projects" data={records} columns={columns} getRowId={row => row.id} />
  </AdminShell>
  <PreviewChat />
</main>);
