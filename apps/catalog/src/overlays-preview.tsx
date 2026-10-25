import { useEffect, useId, useRef, useState } from "react";
import {
  AccountMenu, ActionMessage, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  Button, Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger, DropdownMenuTrigger, Popover, PopoverClose, PopoverContent, PopoverDescription,
  PopoverTitle, PopoverTrigger, Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger, TextField, TextareaField, ToastProvider, Undo2Icon, useToast,
} from "@project-kit/ui";
import "./overlays-preview.css";

function MenuExample() {
  const [archived, setArchived] = useState(false);
  const [density, setDensity] = useState("comfortable");
  const [message, setMessage] = useState("No action selected.");
  return <div className="overlays-preview-stack">
    <p>Choose an action or change how the local project list is displayed.</p>
    <div className="overlays-preview-actions"><DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Project actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Project list</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setMessage("The project details are open in this example.")}>Open details</DropdownMenuItem>
        <DropdownMenuItem disabled>Transfer ownership (unavailable)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={archived} onCheckedChange={value => setArchived(value === true)} onSelect={event => event.preventDefault()}>Show archived projects</DropdownMenuCheckboxItem>
        <DropdownMenuLabel>Row spacing</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="comfortable" onSelect={event => event.preventDefault()}>Comfortable</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="compact" onSelect={event => event.preventDefault()}>Compact</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub><DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger><DropdownMenuSubContent>
          <DropdownMenuItem onSelect={() => setMessage("CSV export selected. Your application supplies the download.")}>CSV file</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setMessage("JSON export selected. Your application supplies the download.")}>JSON file</DropdownMenuItem>
        </DropdownMenuSubContent></DropdownMenuSub>
        <DropdownMenuSeparator /><DropdownMenuItem destructive onSelect={() => setMessage("Archive requested. Your application confirms and applies it.")}>Archive project</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DropdownMenu dir="rtl"><DropdownMenuTrigger asChild><Button dir="rtl" variant="ghost">RTL actions</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>مشروع الفريق</DropdownMenuLabel><DropdownMenuItem onSelect={() => setMessage("The long RTL action was selected.")}>عرض جميع تفاصيل المشروع والملاحظات المرتبطة به للفريق</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
    <p role="status">Archived projects: {archived ? "shown" : "hidden"}. Row spacing: {density}. {message}</p>
  </div>;
}

function SharingPopover({ label = "Sharing options" }: { label?: string }) {
  const [name, setName] = useState("Review group");
  return <Popover><PopoverTrigger asChild><Button variant="outline">{label}</Button></PopoverTrigger><PopoverContent align="start">
    <PopoverTitle>Sharing options</PopoverTitle><PopoverDescription>Name the local review group.</PopoverDescription>
    <TextField label="Review group" value={name} onChange={event => setName(event.target.value)} />
    <PopoverClose asChild><Button size="sm">Done</Button></PopoverClose>
  </PopoverContent></Popover>;
}

function PopoverExample() {
  const [action, setAction] = useState("No dialog action selected.");
  return <div className="overlays-preview-stack"><p>A popover keeps interactive content close to its trigger. It also works from inside a dialog.</p>
    <div className="overlays-preview-actions"><SharingPopover /><Dialog><DialogTrigger asChild><Button>Open nested overlays</Button></DialogTrigger><DialogContent>
      <DialogHeader><DialogTitle>Edit project access</DialogTitle><DialogDescription>Try the controls without leaving this dialog.</DialogDescription></DialogHeader>
      <DialogBody><div className="overlays-preview-stack"><SharingPopover label="Sharing options in dialog" /><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Actions in dialog</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={() => setAction("The review link is ready.")}>Prepare review link</DropdownMenuItem></DropdownMenuContent></DropdownMenu><p role="status">{action}</p></div></DialogBody>
    </DialogContent></Dialog></div>
  </div>;
}

function ConfirmationExample() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);
  const failures = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const request = useRef(0);
  const cancel = useRef<HTMLButtonElement>(null);
  const restore = useRef<HTMLButtonElement>(null);
  const removed = useRef(false);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function changeOpen(next: boolean) {
    request.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPending(false);
    setError("");
    setOpen(next);
  }
  function remove() {
    cancel.current?.focus();
    setPending(true);
    setError("");
    const current = ++request.current;
    timer.current = setTimeout(() => {
      if (current !== request.current) return;
      timer.current = null;
      setPending(false);
      if (failures.current++ === 0) setError("The preview request failed. Try again.");
      else { removed.current = true; setDeleted(true); changeOpen(false); }
    }, 400);
  }
  return <div className="overlays-preview-stack"><p>The first local deletion fails. Retry it, or cancel while it is pending.</p>
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogTrigger asChild><Button variant="destructive" disabled={deleted}>Delete project</Button></AlertDialogTrigger><AlertDialogContent onCloseAutoFocus={event => { if (removed.current) { event.preventDefault(); restore.current?.focus(); } }}>
        <AlertDialogHeader><AlertDialogTitle>Delete the sample project?</AlertDialogTitle><AlertDialogDescription>This removes the fictional project from this example. Cancel keeps it available.</AlertDialogDescription></AlertDialogHeader>
        {error ? <ActionMessage tone="error">{error}</ActionMessage> : null}
        <AlertDialogFooter><AlertDialogCancel ref={cancel}>Cancel deletion</AlertDialogCancel><AlertDialogAction disabled={pending} aria-busy={pending || undefined} onClick={event => { event.preventDefault(); remove(); }}>{pending ? "Deleting…" : error ? "Retry deletion" : "Confirm deletion"}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    {deleted ? <div className="overlays-preview-stack"><p role="status">Sample project deleted.</p><Button ref={restore} onClick={() => { removed.current = false; setDeleted(false); failures.current = 0; }}>Restore sample project</Button></div> : null}
  </div>;
}

function SheetExample() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"start" | "end">("end");
  const [saved, setSaved] = useState("Prepare the launch review.");
  const [draft, setDraft] = useState(saved);
  const formId = useId();
  const opener = useRef<HTMLButtonElement | null>(null);
  return <div className="overlays-preview-stack"><p>Saved notes: {saved}</p><Sheet open={open} onOpenChange={next => { setOpen(next); if (next) setDraft(saved); }}>
    <div className="overlays-preview-actions"><SheetTrigger asChild><Button onClick={event => { opener.current = event.currentTarget; setSide("end"); }}>Edit notes in sheet</Button></SheetTrigger><Button variant="outline" onClick={event => { opener.current = event.currentTarget; setSide("start"); setDraft(saved); setOpen(true); }}>Open start sheet</Button></div>
    <SheetContent side={side} closeLabel="Close notes sheet" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }}><SheetHeader><SheetTitle>Project notes</SheetTitle><SheetDescription>Update the fictional launch brief. The body scrolls independently of the actions.</SheetDescription></SheetHeader>
      <SheetBody><form className="overlays-preview-stack" id={formId} onSubmit={event => { event.preventDefault(); setSaved(draft.trim()); setOpen(false); }}>
        <TextareaField label="Launch notes" required value={draft} onChange={event => setDraft(event.target.value)} rows={5} />
        {Array.from({ length: 8 }, (_, index) => <section key={index}><h3>Review point {index + 1}</h3><p>Check the owner, schedule, and supporting material before the launch meeting. Record decisions in the project brief so the team can follow up.</p></section>)}
      </form></SheetBody><SheetFooter><SheetClose asChild><Button variant="outline">Discard notes</Button></SheetClose><Button type="submit" form={formId}>Save notes</Button></SheetFooter>
    </SheetContent>
  </Sheet></div>;
}

function ToastActions({ changeContext }: { changeContext: () => void }) {
  const { toast, clear } = useToast();
  const [state, setState] = useState("The sample project is active.");
  const save = useRef<HTMLButtonElement>(null);
  const delayed = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const timers = delayed.current;
    return () => { timers.forEach(timer => clearTimeout(timer)); timers.clear(); };
  }, []);
  return <div className="overlays-preview-stack"><p>Notifications pause while hovered or focused. Press F8 to reach them. Changing context clears old notices.</p>
    <div className="overlays-preview-actions"><Button ref={save} onClick={() => toast({ title: "Project saved", description: "Your local example is up to date.", tone: "success", returnFocusTo: save.current })}>Show saved notice</Button>
      <Button variant="outline" onClick={event => { const target = event.currentTarget; setState("The sample project is archived."); toast({ title: "Project archived", duration: Infinity, returnFocusTo: target, action: { label: "Undo archive", altText: "Restore the project from its archive action", icon: <Undo2Icon size="sm" />, onClick: () => setState("The sample project is active.") } }); }}>Show action notice</Button>
      <Button variant="outline" onClick={() => { for (let index = 1; index <= 4; index++) toast({ title: `Current notice ${index}`, duration: Infinity }); }}>Show four notices</Button>
      <Button variant="outline" onClick={() => { const timer = setTimeout(() => { delayed.current.delete(timer); toast({ title: "Delayed review ready", duration: Infinity }); }, 400); delayed.current.add(timer); }}>Schedule delayed notice</Button>
      <Button variant="ghost" onClick={clear}>Clear notifications</Button><Button variant="ghost" onClick={changeContext}>Change notification context</Button>
    </div><p role="status">{state}</p><TextField label="Draft preserved across context changes" placeholder="Keep typing here" />
  </div>;
}

function ToastExample() {
  const [context, setContext] = useState("planning");
  return <ToastProvider scopeKey={context}><div className="overlays-preview-stack"><p>Notification context: {context}</p><ToastActions changeContext={() => setContext(value => value === "planning" ? "review" : "planning")} /></div></ToastProvider>;
}

function AccountExample() {
  const [appearance, setAppearance] = useState<"light" | "dark" | "system">("system");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("The demo session is active.");
  const [open, setOpen] = useState(false);
  const attempts = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function signOut() {
    setPending(true); setError("");
    timer.current = setTimeout(() => {
      timer.current = null; setPending(false);
      if (attempts.current++ === 0) setError("The local sign-out attempt failed. Try again.");
      else { setMessage("The demo session has ended. No account provider was contacted."); setOpen(false); }
    }, 400);
  }
  return <div className="overlays-preview-stack"><p>Choose an appearance preference, follow a local profile link, or try the sign-out failure and retry.</p>
    <AccountMenu name="Alex Morgan" description="Demo workspace" links={[{ id: "profile", label: "Profile", href: "#account-profile-example" }, { id: "billing", label: "Billing (unavailable)", href: "#account-billing-example", disabled: true }]} appearance={{ value: appearance, onValueChange: setAppearance }} open={open} onOpenChange={setOpen} onSignOut={signOut} signOutPending={pending} signOutError={error} />
    <p role="status">Appearance preference: {appearance}. {message}</p><section id="account-profile-example" tabIndex={-1}><h3>Local profile</h3><p>Alex coordinates the sample project review. Identity and settings data come from the host.</p></section>
  </div>;
}

export function OverlaysPreview({ id }: { id: string }) {
  switch (id) {
    case "dropdown-menu": return <MenuExample />;
    case "popover": return <PopoverExample />;
    case "alert-dialog": return <ConfirmationExample />;
    case "sheet": return <SheetExample />;
    case "toast": return <ToastExample />;
    case "account-menu": return <AccountExample />;
    default: return null;
  }
}
