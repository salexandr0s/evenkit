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
} from "@evenkit/ui";
import "./overlays-preview.css";

function MenuExample() {
  const [archived, setArchived] = useState(false);
  const [density, setDensity] = useState("comfortable");
  const [message, setMessage] = useState("No action selected.");
  return <div className="overlays-preview-stack">
    <div className="overlays-preview-project">
    <div className="overlays-preview-project-heading"><div><h3>Project list</h3><p>Plan the next team review.</p></div><DropdownMenu>
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
    </DropdownMenu></div>
    <ul className="overlays-preview-project-list" data-density={density} aria-label="Sample projects">
      <li><span>Launch review</span><span>In review</span></li>
      <li><span>Access review</span><span>Planning</span></li>
      {archived ? <li><span>Previous launch</span><span>Archived</span></li> : null}
    </ul></div>
    <p role="status">Archived projects: {archived ? "shown" : "hidden"}. Row spacing: {density}. {message}</p>
    <div className="overlays-preview-secondary"><span>Direction and long labels</span><DropdownMenu dir="rtl"><DropdownMenuTrigger asChild><Button dir="rtl" variant="ghost">RTL actions</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>مشروع الفريق</DropdownMenuLabel><DropdownMenuItem onSelect={() => setMessage("The long RTL action was selected.")}>عرض جميع تفاصيل المشروع والملاحظات المرتبطة به للفريق</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
  </div>;
}

function SharingPopover({ label = "Sharing options" }: { label?: string }) {
  const [name, setName] = useState("Review group");
  return <Popover><PopoverTrigger asChild><Button variant="outline">{label}</Button></PopoverTrigger><PopoverContent align="start">
    <div className="overlays-preview-popover-heading"><PopoverTitle>Sharing options</PopoverTitle><PopoverDescription>Name the group reviewing the launch brief.</PopoverDescription></div>
    <TextField label="Review group" value={name} onChange={event => setName(event.target.value)} />
    <div className="overlays-preview-popover-footer"><PopoverClose asChild><Button size="sm">Done</Button></PopoverClose></div>
  </PopoverContent></Popover>;
}

function PopoverExample() {
  const [action, setAction] = useState("No dialog action selected.");
  return <div className="overlays-preview-stack">
    <div className="overlays-preview-project"><div className="overlays-preview-project-heading"><div><h3>Launch review</h3><p>Coordinate the project review group.</p></div><SharingPopover /></div></div>
    <div className="overlays-preview-secondary"><span>Controls inside a dialog</span><Dialog><DialogTrigger asChild><Button variant="outline">Open nested overlays</Button></DialogTrigger><DialogContent>
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
  return <div className="overlays-preview-stack"><div className="overlays-preview-record"><strong>Launch review</strong><span>Sample project · Demo workspace</span></div>
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogTrigger asChild><Button variant="destructive" disabled={deleted}>Delete project</Button></AlertDialogTrigger><AlertDialogContent onCloseAutoFocus={event => { if (removed.current) { event.preventDefault(); restore.current?.focus(); } }}>
        <AlertDialogHeader><AlertDialogTitle>Delete the sample project?</AlertDialogTitle><AlertDialogDescription>Remove Launch review from the demo workspace. Cancel keeps the project available; after deletion, you can restore the sample.</AlertDialogDescription></AlertDialogHeader>
        <div className="overlays-preview-record"><strong>Launch review</strong><span>Sample project · Demo workspace</span></div>
        {error ? <ActionMessage tone="error">{error}</ActionMessage> : null}
        <AlertDialogFooter><AlertDialogCancel ref={cancel}>Cancel deletion</AlertDialogCancel><AlertDialogAction disabled={pending} aria-busy={pending || undefined} onClick={event => { event.preventDefault(); remove(); }}>{pending ? "Deleting…" : error ? "Retry deletion" : "Confirm deletion"}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <p className="overlays-preview-hint">The first preview request fails. Retry it, or cancel while it is pending.</p>
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
  return <div className="overlays-preview-stack"><div className="overlays-preview-record"><strong>Launch review</strong><p>Saved notes: {saved}</p></div><Sheet open={open} onOpenChange={next => { setOpen(next); if (next) setDraft(saved); }}>
    <div className="overlays-preview-actions"><SheetTrigger asChild><Button onClick={event => { opener.current = event.currentTarget; setSide("end"); }}>Edit notes in sheet</Button></SheetTrigger><Button variant="outline" onClick={event => { opener.current = event.currentTarget; setSide("start"); setDraft(saved); setOpen(true); }}>Open start sheet</Button></div>
    <SheetContent side={side} closeLabel="Close notes sheet" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }}><SheetHeader><SheetTitle>Project notes</SheetTitle><SheetDescription>Prepare the launch review. Keep decisions and next steps in the project brief.</SheetDescription></SheetHeader>
      <SheetBody><form className="overlays-preview-stack overlays-preview-sheet-form" id={formId} onSubmit={event => { event.preventDefault(); setSaved(draft.trim()); setOpen(false); }}>
        <TextareaField label="Launch notes" required value={draft} onChange={event => setDraft(event.target.value)} rows={5} />
        <section className="overlays-preview-review-section"><h3>Review owner</h3><p>Confirm who will lead the discussion and collect decisions. Add the people who need to approve the launch.</p></section>
        <section className="overlays-preview-review-section"><h3>Schedule</h3><p>Check the review date against delivery milestones. Leave time for changes before the team shares the final brief.</p></section>
        <section className="overlays-preview-review-section"><h3>Supporting material</h3><p>Gather the current design, access requirements, and open questions. Link each document from the brief so reviewers can prepare.</p></section>
        <section className="overlays-preview-review-section"><h3>Follow-up</h3><p>Record each decision with its owner and next step. Bring unresolved questions to the next project review.</p></section>
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
  return <div className="overlays-preview-stack">
    <div className="overlays-preview-project"><div className="overlays-preview-project-heading"><div><h3>Launch review</h3><p role="status">{state}</p></div></div>
    <div className="overlays-preview-project-actions"><Button ref={save} onClick={() => toast({ title: "Project saved", description: "Your local example is up to date.", tone: "success", returnFocusTo: save.current })}>Show saved notice</Button>
      <Button variant="outline" onClick={event => { const target = event.currentTarget; setState("The sample project is archived."); toast({ title: "Project archived", duration: Infinity, returnFocusTo: target, action: { label: "Undo archive", altText: "Restore the project from its archive action", icon: <Undo2Icon size="sm" />, onClick: () => setState("The sample project is active.") } }); }}>Show action notice</Button>
    </div></div>
    <p className="overlays-preview-hint">Notifications pause while hovered or focused. Press F8 to reach them.</p>
    <div className="overlays-preview-secondary"><span>Notification lifecycle</span><div className="overlays-preview-actions">
      <Button variant="outline" onClick={() => { for (let index = 1; index <= 4; index++) toast({ title: `Current notice ${index}`, duration: Infinity }); }}>Show four notices</Button>
      <Button variant="outline" onClick={() => { const timer = setTimeout(() => { delayed.current.delete(timer); toast({ title: "Delayed review ready", duration: Infinity }); }, 400); delayed.current.add(timer); }}>Schedule delayed notice</Button>
      <Button variant="ghost" onClick={clear}>Clear notifications</Button><Button variant="ghost" onClick={changeContext}>Change notification context</Button>
    </div><TextField label="Draft preserved across context changes" placeholder="Keep typing here" /></div>
  </div>;
}

function ToastExample() {
  const [context, setContext] = useState("planning");
  return <ToastProvider scopeKey={context}><div className="overlays-preview-stack"><ToastActions changeContext={() => setContext(value => value === "planning" ? "review" : "planning")} /><p className="overlays-preview-hint">Notification context: {context}</p></div></ToastProvider>;
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
  return <div className="overlays-preview-stack">
    <div className="overlays-preview-project"><div className="overlays-preview-project-heading"><div><h3>Demo workspace</h3><p>Profile and account preferences.</p></div>
      <AccountMenu name="Alex Morgan" description="Demo workspace" links={[{ id: "profile", label: "Profile", href: "#account-profile-example" }, { id: "billing", label: "Billing (unavailable)", href: "#account-billing-example", disabled: true }]} appearance={{ value: appearance, onValueChange: setAppearance }} open={open} onOpenChange={setOpen} onSignOut={signOut} signOutPending={pending} signOutError={error} />
    </div><section className="overlays-preview-account-profile" id="account-profile-example" tabIndex={-1}><h3>Local profile</h3><p>Alex coordinates the sample project review.</p></section></div>
    <p role="status">Appearance preference: {appearance}. {message}</p>
    <p className="overlays-preview-hint">The sign-out preview fails once so you can try again.</p>
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
