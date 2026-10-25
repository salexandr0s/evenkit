import type { CatalogEntry } from "./catalog-types.js";

const imports = `"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n`;

export const overlaysEntries: readonly CatalogEntry[] = [
  {
    id: "dropdown-menu", name: "Dropdown menu", group: "Controls", inventoryIds: ["F01"],
    description: "Action menus with checkboxes, radio choices, submenus, disabled actions, and keyboard navigation.",
    tags: ["menu", "actions", "dropdown", "submenu", "checkbox", "radio", "F01"],
    source: "Radix DropdownMenu with kit presentation", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dropdown-menu",
    usage: imports + `import { useState } from "react";
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@evenkit/ui";

export function ProjectActions({ onReview }: { onReview: () => void }) {
  const [archived, setArchived] = useState(false);
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="outline">Project actions</Button></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={onReview}>Review project</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem checked={archived}
        onCheckedChange={value => setArchived(value === true)}
        onSelect={event => event.preventDefault()}>Show archived</DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}
`,
  },
  {
    id: "popover", name: "Popover", group: "Controls", inventoryIds: ["F02"],
    description: "Interactive supplementary content with a title, useful focus behavior, viewport-aware placement, and dialog layering.",
    tags: ["popover", "popup", "interactive", "overlay", "focus", "F02"],
    source: "Radix Popover with kit surface and portal layer", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/popover",
    usage: imports + `import { Button, TextField, Popover, PopoverTrigger, PopoverContent,
  PopoverTitle, PopoverDescription, PopoverClose } from "@evenkit/ui";

export function SharingOptions() {
  return <Popover>
    <PopoverTrigger asChild><Button variant="outline">Sharing options</Button></PopoverTrigger>
    <PopoverContent align="start">
      <PopoverTitle>Review group</PopoverTitle>
      <PopoverDescription>Update the group name in this local form.</PopoverDescription>
      <TextField label="Group name" name="group" defaultValue="Review team" />
      <PopoverClose asChild><Button>Done</Button></PopoverClose>
    </PopoverContent>
  </Popover>;
}
`,
  },
  {
    id: "alert-dialog", name: "Alert dialog", group: "Controls", inventoryIds: ["F03"],
    description: "Critical confirmations with cancel-first focus, explicit dismissal, and async failure or retry before closing.",
    tags: ["alert dialog", "confirm", "delete", "destructive", "async", "retry", "F03"],
    source: "Radix AlertDialog with shared dialog presentation", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/alert-dialog",
    usage: imports + `import { useRef, useState } from "react";
import { Button, ActionMessage, AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction } from "@evenkit/ui";

export function DeleteProject({ remove }: { remove: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const request = useRef(0);
  const cancel = useRef<HTMLButtonElement>(null);
  function changeOpen(next: boolean) {
    request.current++;
    setPending(false); setError(""); setOpen(next);
  }
  async function confirm() {
    cancel.current?.focus(); setPending(true); setError("");
    const current = ++request.current;
    try {
      await remove();
      if (current === request.current) changeOpen(false);
    } catch {
      if (current === request.current) setError("Deletion failed. Try again.");
    } finally {
      if (current === request.current) setPending(false);
    }
  }
  return <AlertDialog open={open} onOpenChange={changeOpen}>
    <AlertDialogTrigger asChild><Button variant="destructive">Delete project</Button></AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
      <AlertDialogDescription>Review the consequences before confirming.</AlertDialogDescription>
      {error && <ActionMessage tone="error">{error}</ActionMessage>}
      <AlertDialogFooter>
        <AlertDialogCancel ref={cancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction disabled={pending} aria-busy={pending || undefined}
          onClick={event => { event.preventDefault(); void confirm(); }}>
          {pending ? "Deleting…" : "Confirm deletion"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}

// The host owns cancellation of the underlying request and deleted-record focus recovery.
`,
  },
  {
    id: "sheet", name: "Sheet", group: "Controls", inventoryIds: ["F04"],
    description: "Modal side panels with logical placement, scrolling bodies, persistent actions, and dialog focus recovery.",
    tags: ["sheet", "drawer", "side panel", "scroll", "start", "end", "F04"],
    source: "Existing kit Dialog with logical side-panel layout", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: imports + `import { useId, useState } from "react";
import { Button, TextareaField, Sheet, SheetTrigger, SheetContent, SheetHeader,
  SheetTitle, SheetDescription, SheetBody, SheetFooter, SheetClose } from "@evenkit/ui";

export function ProjectNotes({ onSave }: { onSave: (notes: string) => void }) {
  const [open, setOpen] = useState(false);
  const form = useId();
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild><Button>Edit notes</Button></SheetTrigger>
    <SheetContent side="end">
      <SheetHeader><SheetTitle>Project notes</SheetTitle>
        <SheetDescription>Update the review brief.</SheetDescription></SheetHeader>
      <SheetBody><form id={form} onSubmit={event => {
        event.preventDefault();
        onSave(String(new FormData(event.currentTarget).get("notes") ?? ""));
        setOpen(false);
      }}><TextareaField label="Notes" name="notes" required /></form></SheetBody>
      <SheetFooter><SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
        <Button type="submit" form={form}>Save notes</Button></SheetFooter>
    </SheetContent>
  </Sheet>;
}
`,
  },
  {
    id: "toast", name: "Toast", group: "Feedback", inventoryIds: ["G01"],
    description: "Brief notifications with actions, a three-notice limit, paused expiry, keyboard access, and context cleanup.",
    tags: ["toast", "notification", "undo", "timer", "feedback", "G01"],
    source: "Radix Toast with original kit notification manager", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/toast",
    usage: imports + `import { useState } from "react";
import { Button, ToastProvider, Undo2Icon, useToast } from "@evenkit/ui";

function SaveAction({ save }: { save: () => Promise<void> }) {
  const { toast } = useToast();
  return <Button onClick={async event => {
    const returnFocusTo = event.currentTarget;
    try {
      await save();
      toast({ title: "Project saved", tone: "success", returnFocusTo });
    } catch {
      toast({ title: "Save failed", description: "Review the form and try again.", tone: "error", returnFocusTo });
    }
  }}>Save project</Button>;
}

export function ProjectSave({ projectId, save }: { projectId: string; save: () => Promise<void> }) {
  return <ToastProvider scopeKey={projectId}><SaveAction save={save} /></ToastProvider>;
}

function ArchiveAction() {
  const { toast } = useToast();
  const [archived, setArchived] = useState(false);
  return <>
    <Button variant="outline" onClick={event => {
      setArchived(true);
      toast({ title: "Project archived", duration: Infinity, returnFocusTo: event.currentTarget,
        action: { label: "Undo archive", altText: "Restore the project from its archive action",
          icon: <Undo2Icon size="sm" />, onClick: () => setArchived(false) } });
    }}>Archive sample project</Button>
    <p role="status">{archived ? "The sample project is archived." : "The sample project is active."}</p>
  </>;
}

export function ProjectArchive({ projectId }: { projectId: string }) {
  return <ToastProvider scopeKey={projectId}><ArchiveAction /></ToastProvider>;
}

// Omit action.icon when the action needs a visible label.
// Keep unresolved field errors visible in the form. Toasts supplement that feedback.
`,
  },
  {
    id: "account-menu", name: "Account menu", group: "Compositions", inventoryIds: ["M01"],
    description: "Identity, native navigation links, appearance preferences, and host-owned sign-out with pending and error feedback.",
    tags: ["account", "user menu", "profile", "appearance", "sign out", "M01"],
    source: "Original kit composition using DropdownMenu", sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dropdown-menu",
    usage: imports + `import { useState } from "react";
import { AccountMenu } from "@evenkit/ui";

export function UserMenu({ signOut }: { signOut: () => Promise<void> }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"light" | "dark" | "system">("system");
  return <AccountMenu name="Alex Morgan" description="Demo workspace"
    links={[{ id: "profile", label: "Profile", href: "/profile" }]}
    open={open} onOpenChange={setOpen}
    appearance={{ value: mode, onValueChange: setMode }}
    signOutPending={pending} signOutError={error}
    onSignOut={() => {
      setPending(true); setError("");
      void signOut().then(() => setOpen(false)).catch(() => {
        setError("Sign-out failed. Try again.");
      }).finally(() => setPending(false));
    }} />;
}

// The host applies appearance changes and performs authentication/provider work.
`,
  },
];
