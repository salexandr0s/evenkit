import { ArrowRightIcon, Badge, Button, ButtonLink, PlusIcon, Select, TextField, type ButtonShape } from "@project-kit/ui";
import { PreviewDialog } from "./preview-dialog";
import { PreviewAdmin } from "./preview-admin";

export default function Page() {
  const iconShape: ButtonShape = "icon";
  return <main>
    <h1>Packed package check</h1>
    <Badge tone="success">Next.js consumer</Badge>
    <TextField label="Project name" defaultValue="Independent consumer" />
    <Select aria-label="Visibility" name="visibility" defaultValue="private" options={[{ value: "private", label: "Private" }, { value: "team", label: "Team" }]} />
    <Button>Native button</Button>
    <Button shape={iconShape} aria-label="Create project"><PlusIcon /></Button>
    <Button fullWidth startIcon={<PlusIcon />}>Create project</Button>
    <ButtonLink href="#projects" endIcon={<ArrowRightIcon />}>View projects</ButtonLink>
    <PreviewDialog />
    <PreviewAdmin />
  </main>;
}
