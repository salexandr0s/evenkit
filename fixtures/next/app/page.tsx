import { ArrowRightIcon, Badge, Button, ButtonLink, PlusIcon, Select, SelectField, TextareaField, TextField, type ButtonShape, type SelectOptionGroup, type TextareaFieldProps } from "@project-kit/ui";
import { PreviewDialog } from "./preview-dialog";
import { PreviewAdmin } from "./preview-admin";

export default function Page() {
  const iconShape: ButtonShape = "icon";
  const notesProps: TextareaFieldProps = { label: "Notes", name: "notes", optional: true, hint: "Details for the team.", rows: 3 };
  const templates: SelectOptionGroup = { id: "team", label: "Team templates", options: [{ value: "blank", label: "Blank project", description: "Start with an empty project." }] };
  return <main>
    <h1>Packed package check</h1>
    <Badge tone="success">Next.js consumer</Badge>
    <TextField label="Project name" defaultValue="Independent consumer" required startAdornment={<PlusIcon />} />
    <TextareaField {...notesProps} />
    <SelectField label="Project template" name="template" options={[templates]} defaultValue="blank" hint="Choose a starting point." required />
    <Select aria-label="Visibility" name="visibility" defaultValue="private" options={[{ value: "private", label: "Private" }, { value: "team", label: "Team" }]} />
    <Button>Native button</Button>
    <Button shape={iconShape} aria-label="Create project"><PlusIcon /></Button>
    <Button fullWidth startIcon={<PlusIcon />}>Create project</Button>
    <ButtonLink href="#projects" endIcon={<ArrowRightIcon />}>View projects</ButtonLink>
    <PreviewDialog />
    <PreviewAdmin />
  </main>;
}
