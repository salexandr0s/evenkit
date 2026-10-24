import { Badge, Button, Select, TextField } from "@project-kit/ui";
import { PreviewDialog } from "./preview-dialog";

export default function Page() {
  return <main>
    <h1>Packed package check</h1>
    <Badge tone="success">Next.js consumer</Badge>
    <TextField label="Project name" defaultValue="Independent consumer" />
    <Select aria-label="Visibility" name="visibility" defaultValue="private" options={[{ value: "private", label: "Private" }, { value: "team", label: "Team" }]} />
    <Button>Native button</Button>
    <PreviewDialog />
  </main>;
}
