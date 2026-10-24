import { createRoot } from "react-dom/client";
import { Badge, Button, Select, TextField } from "@project-kit/ui";
import "@project-kit/tokens/css";
import "@project-kit/ui/css";

const element = document.getElementById("root");
if (!element) throw new Error("Missing fixture root.");
createRoot(element).render(<main>
  <h1>Packed package check</h1>
  <Badge tone="success">Vite consumer</Badge>
  <TextField label="Project name" defaultValue="Independent consumer" />
  <Select aria-label="Visibility" name="visibility" defaultValue="private" options={[{ value: "private", label: "Private" }, { value: "team", label: "Team" }]} />
  <Button>Native button</Button>
</main>);
