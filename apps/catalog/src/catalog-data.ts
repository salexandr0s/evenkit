export interface CatalogEntry {
  id: string;
  name: string;
  group: "Foundations" | "Controls" | "Feedback";
  description: string;
  tags: readonly string[];
  source: string;
  sourceUrl: string;
  usage: string;
}

export const entries: readonly CatalogEntry[] = [
  {
    id: "tokens",
    name: "Design tokens",
    group: "Foundations",
    description: "Shared color, spacing, type, and motion values. Switch themes without changing a component.",
    tags: ["theme", "color", "palette", "spacing", "typography", "brand", "dark mode"],
    source: "Internal UI contract · adapted semantic colors",
    sourceUrl: "https://ui.shadcn.com/docs/theming",
    usage: 'import "@project-kit/tokens/css";\n\ndocument.documentElement.dataset.kitTheme = "grove";\ndocument.documentElement.dataset.kitMode = "dark";\n// Remove data-kit-mode to follow the system.'
  },
  {
    id: "buttons",
    name: "Buttons",
    group: "Controls",
    description: "Actions and links with consistent sizing, visible focus, and explicit busy states.",
    tags: ["button", "action", "link", "disabled", "loading", "primary", "secondary"],
    source: "Original implementation · shadcn composition reference",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/button",
    usage: 'import { Button, ButtonLink } from "@project-kit/ui";\n\n<Button variant="primary" onClick={save}>\n  Save changes\n</Button>\n<Button loading>Saving changes</Button>\n<ButtonLink href="/projects" variant="outline">\n  View projects\n</ButtonLink>'
  },
  {
    id: "fields",
    name: "Fields",
    group: "Controls",
    description: "Labeled inputs with associated help and error messages. Compose a form from native controls.",
    tags: ["input", "field", "form", "label", "validation", "error", "textarea", "disabled"],
    source: "Original implementation · internal field requirements",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/input",
    usage: 'import { TextField } from "@project-kit/ui";\n\n<TextField\n  label="Project name"\n  name="projectName"\n  hint="Use a name your team recognises."\n  error={errors.projectName}\n  value={projectName}\n  onChange={(event) => setProjectName(event.target.value)}\n/>'
  },
  {
    id: "select",
    name: "Select",
    group: "Controls",
    description: "A themed dropdown with an inset chevron, keyboard navigation, and explicit option states.",
    tags: ["select", "dropdown", "options", "form", "disabled", "keyboard"],
    source: "Radix Select · custom kit trigger and popup",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/select",
    usage: 'import { Label, Select } from "@project-kit/ui";\n\n<Label htmlFor="visibility">Visibility</Label>\n<Select\n  id="visibility"\n  name="visibility"\n  defaultValue="private"\n  options={[\n    { value: "private", label: "Private" },\n    { value: "team", label: "Team" }\n  ]}\n/>'
  },
  {
    id: "dialog",
    name: "Dialog",
    group: "Controls",
    description: "A focused editing surface with a title, description, focus containment, and Escape dismissal.",
    tags: ["modal", "dialog", "overlay", "focus", "keyboard", "edit"],
    source: "Radix Dialog · kit styling and composition",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: 'import {\n  Button, Dialog, DialogTrigger, DialogContent,\n  DialogTitle, DialogDescription, DialogClose\n} from "@project-kit/ui";\n\n<Dialog>\n  <DialogTrigger asChild><Button>Edit project</Button></DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Edit project</DialogTitle>\n    <DialogDescription>Update this preview.</DialogDescription>\n    <DialogClose asChild><Button>Done</Button></DialogClose>\n  </DialogContent>\n</Dialog>'
  },
  {
    id: "status",
    name: "Status",
    group: "Feedback",
    description: "Short status labels and persistent action messages. Pair color with text to explain the result.",
    tags: ["badge", "message", "feedback", "success", "warning", "danger", "error", "status", "alert"],
    source: "Original implementation · internal feedback requirements",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/badge",
    usage: 'import { Badge, ActionMessage } from "@project-kit/ui";\n\n<Badge tone="success">Active</Badge>\n<ActionMessage tone="error">\n  Your changes could not be saved. Try again.\n</ActionMessage>'
  },
  {
    id: "loading",
    name: "Loading",
    group: "Feedback",
    description: "A labeled spinner and content placeholders, with reduced-motion support.",
    tags: ["spinner", "skeleton", "loading", "busy", "pending", "motion"],
    source: "Original implementation · token-based motion",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/skeleton",
    usage: 'import { Spinner, Skeleton } from "@project-kit/ui";\n\n<Spinner label="Loading projects" />\n<div aria-label="Loading project details" aria-busy="true">\n  <Skeleton />\n  <Skeleton />\n</div>'
  },
  {
    id: "empty",
    name: "Empty state",
    group: "Feedback",
    description: "Explain what is missing and offer a useful next action. Keep a recoverable failure in context.",
    tags: ["empty", "no results", "retry", "error", "recovery", "placeholder"],
    source: "Original implementation · internal state patterns",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/empty",
    usage: 'import { Button, EmptyState } from "@project-kit/ui";\n\n<EmptyState\n  title="No projects yet"\n  description="Create a project to bring your work together."\n  action={<Button onClick={createProject}>Create project</Button>}\n/>'
  }
];

export const groups = ["Foundations", "Controls", "Feedback"] as const;
