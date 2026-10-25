import { useId, useRef, useState, type FormEvent } from "react";
import {
  ActionMessage, Badge, Button, Dialog, DialogBody, DialogClose, DialogContent,
  DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  SelectField, TextareaField, TextField,
} from "@evenkit/ui";
import "./dialog-preview.css";

const visibilityOptions = [
  { value: "private", label: "Private" },
  { value: "team", label: "Team" },
  { value: "public", label: "Public" },
] as const;

const briefSections = [
  {
    title: "Purpose",
    text: "Spring launch brings the project workspace, help content, and release notes into one coordinated release. The team will review the complete journey from creating a project to inviting a collaborator. The brief keeps the decisions in one place so reviewers can check the same scope before work begins.",
  },
  {
    title: "Included in this release",
    text: "The first release covers project creation, visibility settings, and invitations. Each screen needs clear labels, useful empty states, and a way to recover from an error. Billing changes and account migration are outside this release. Record requests for those areas separately so they do not delay the agreed work.",
  },
  {
    title: "Review checkpoints",
    text: "Review the first draft with design and engineering before expanding it to every screen. Check names and descriptions against the product language, then test the complete journey with the keyboard. The final review includes narrow screens, long project names, and the empty and disabled states that a new workspace will encounter.",
  },
  {
    title: "Release preparation",
    text: "Prepare a short release note that explains what people can now do and where to start. Support should have the same instructions before the release opens to more workspaces. Keep a record of known limits, with a named owner for each follow-up, so the team can answer questions without reconstructing earlier decisions.",
  },
  {
    title: "Ownership and handover",
    text: "The project owner checks the final scope and confirms that open review comments have a response. Engineering records the release steps and recovery procedure. Design supplies the approved content and interaction notes. After handover, the team reviews reported issues together and agrees which changes belong in the next release.",
  },
  {
    title: "Before you finish",
    text: "Read through the scope once more and note anything that needs a decision. Include the affected screen or step so another reviewer can find it. Notes in this example are temporary: closing the brief clears them. The close action stays available while you read, and the whole dialog can scroll in a short window.",
  },
] as const;

export function DialogPreview() {
  const formId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const briefTitleRef = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState({ name: "Spring launch", visibility: "private" });
  const [draft, setDraft] = useState(saved);
  const [attempted, setAttempted] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(saved);
      setAttempted(false);
    }
    setOpen(nextOpen);
  }

  function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const name = draft.name.trim();
    if (!name) {
      nameRef.current?.focus();
      return;
    }
    setSaved({ ...draft, name });
    setSavedMessage(`Saved ${name} in this preview. No data was sent or stored.`);
    setOpen(false);
  }

  return (
    <div className="dialog-workbench">
      <section className="dialog-preview-section" aria-label="Project editing example">
        <div className="dialog-preview-heading"><h3>Edit a project</h3><p>Save updates the card below. Closing without saving discards your changes.</p></div>
        <div className="dialog-project-card">
          <div className="dialog-project-summary"><Badge tone="accent">Project</Badge><strong>{saved.name}</strong><p>Visibility: {saved.visibility}.</p></div>
          <Dialog open={open} onOpenChange={changeOpen}>
            <DialogTrigger asChild><Button variant="outline">Edit project</Button></DialogTrigger>
            <DialogContent scroll="body">
              <DialogHeader>
                <DialogTitle>Edit project</DialogTitle>
                <DialogDescription>Update the name and visibility for this preview project. Closing without saving discards your changes.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <form className="dialog-edit-form" id={formId} noValidate onSubmit={saveProject}>
                  <TextField ref={nameRef} label="Project name" name="projectName" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.currentTarget.value })} error={attempted && !draft.name.trim() ? "Enter a project name." : undefined} />
                  <SelectField label="Project visibility" name="visibility" options={visibilityOptions} value={draft.visibility} onValueChange={(visibility) => setDraft({ ...draft, visibility })} hint="Choose who can see this project." />
                </form>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" form={formId}>Save preview</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {savedMessage && <ActionMessage tone="success">{savedMessage}</ActionMessage>}
      </section>

      <section className="dialog-preview-section" aria-label="Long dialog example">
        <div className="dialog-preview-heading"><h3>Read a longer brief</h3><p>The brief scrolls between its heading and close action. In a short window, the whole dialog scrolls.</p></div>
        <div>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Review project brief</Button></DialogTrigger>
            <DialogContent size="lg" scroll="body" onOpenAutoFocus={(event) => { event.preventDefault(); briefTitleRef.current?.focus(); }}>
              <DialogHeader>
                <DialogTitle ref={briefTitleRef} tabIndex={-1}>Review project brief</DialogTitle>
                <DialogDescription>Spring launch scope and handover notes. This is a sample brief for reviewing a longer dialog.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="dialog-brief">
                  {briefSections.map((section) => <section key={section.title}><h3>{section.title}</h3><p>{section.text}</p></section>)}
                  <TextareaField label="Review notes" optional rows={3} hint="Temporary notes are cleared when you close this brief." />
                </div>
              </DialogBody>
              <DialogFooter><DialogClose asChild><Button>Close brief</Button></DialogClose></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="dialog-preview-section" aria-label="Right-to-left dialog example">
        <div className="dialog-preview-heading"><h3>Right-to-left layout</h3><p>A small dialog with a wrapping title and a close action at the logical end.</p></div>
        <div>
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Open RTL dialog</Button></DialogTrigger>
            <DialogContent size="sm" dir="rtl" closeLabel="Close RTL dialog">
              <DialogHeader lang="he">
                <DialogTitle>פרטי הפרויקט והעדפות השיתוף של הצוות</DialogTitle>
                <DialogDescription>בדקו את פרטי הפרויקט לפני שיתוף עם הצוות.</DialogDescription>
              </DialogHeader>
              <DialogBody lang="he"><p className="dialog-rtl-copy">אפשר לשנות את שם הפרויקט ואת הרשאות הצפייה בחלון העריכה. הדוגמה הזו מציגה כותרת ארוכה וכפתור סגירה בממשק מימין לשמאל.</p></DialogBody>
              <DialogFooter><DialogClose asChild><Button variant="outline">Close RTL preview</Button></DialogClose></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
