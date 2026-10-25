import { authEntries } from "./auth-data";

export interface CatalogEntry {
  id: string;
  name: string;
  group: "Foundations" | "Controls" | "Compositions" | "Feedback";
  description: string;
  tags: readonly string[];
  source: string;
  sourceUrl: string;
  usage: string;
}

export const entries: readonly CatalogEntry[] = [
  ...authEntries,
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
    id: "icons",
    name: "Icons",
    group: "Foundations",
    description: "A curated set of named icons with shared sizes, stroke weight, and accessible labeling patterns.",
    tags: ["icon", "lucide", "search", "folder", "navigation", "arrow", "glyph", "svg"],
    source: "Lucide React · named kit wrappers",
    sourceUrl: "https://lucide.dev/guide/packages/lucide-react",
    usage: 'import { Button, PlusIcon, SearchIcon } from "@project-kit/ui";\n\n// Decorative beside visible button text.\n<Button><PlusIcon />Add project</Button>\n\n// Label an icon-only action on the button.\n<Button shape="icon" aria-label="Add project"><PlusIcon /></Button>\n\n// A standalone icon supplies its own label.\n<SearchIcon size="lg" label="Search projects" />'
  },
  {
    id: "buttons",
    name: "Buttons",
    group: "Controls",
    description: "Actions and links with consistent sizing, visible focus, and explicit busy states.",
    tags: ["button", "action", "link", "disabled", "loading", "primary", "secondary", "icon only", "full width", "toggle"],
    source: "Original implementation · shadcn composition reference",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/button",
    usage: 'import { Button, ButtonLink, CheckIcon, PlusIcon, ArrowRightIcon } from "@project-kit/ui";\n\n<Button startIcon={<CheckIcon />} loading={saving} onClick={save}>\n  Save changes\n</Button>\n<Button shape="icon" size="sm" aria-label="Add project" onClick={add}>\n  <PlusIcon size="sm" />\n</Button>\n<Button fullWidth type="submit">Create workspace</Button>\n<ButtonLink href="/projects" variant="outline" endIcon={<ArrowRightIcon />}>\n  View projects\n</ButtonLink>'
  },
  {
    id: "fields",
    name: "Fields",
    group: "Controls",
    description: "Inputs and textareas with labels, required cues, adornments, and associated help and errors.",
    tags: ["input", "field", "form", "label", "validation", "error", "textarea", "disabled", "read only", "required", "optional", "adornment"],
    source: "Original implementation · internal field requirements",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/input",
    usage: 'import { MailIcon, TextField, TextareaField } from "@project-kit/ui";\n\n<TextField\n  label="Contact email"\n  type="email"\n  name="email"\n  required\n  startAdornment={<MailIcon />}\n  hint="Use the address your team can reach."\n  error={errors.email}\n/>\n<TextareaField\n  label="Notes"\n  name="notes"\n  optional\n  rows={4}\n  hint="Add context for your team."\n  error={errors.notes}\n/>\n\n// Native props and refs pass through to the input or textarea.'
  },
  {
    id: "select",
    name: "Select",
    group: "Controls",
    description: "Flat or grouped choices with descriptions, field validation, and keyboard navigation.",
    tags: ["select", "dropdown", "options", "form", "disabled", "keyboard", "groups", "description", "empty", "validation"],
    source: "Radix Select · custom kit trigger and popup",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/select",
    usage: 'import { SelectField, type SelectOptionGroup } from "@project-kit/ui";\n\nconst templates: SelectOptionGroup = {\n  id: "team",\n  label: "Team templates",\n  options: [\n    { value: "blank", label: "Blank project" },\n    { value: "launch", label: "Product launch",\n      description: "Plan milestones, owners, and launch tasks." }\n  ]\n};\n\n<SelectField\n  label="Project template"\n  name="template"\n  required\n  options={[templates]}\n  value={template}\n  onValueChange={setTemplate}\n  hint="Choose a starting point for your team."\n  error={errors.template}\n/>\n\n// Flat options still work. Use an empty value to show the placeholder.'
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
    id: "admin-shell",
    name: "Admin shell",
    group: "Compositions",
    description: "A responsive application frame with grouped navigation, header slots, and a mobile drawer. Routing stays in your app.",
    tags: ["admin", "shell", "dashboard", "sidebar", "navigation", "layout", "mobile", "drawer", "composition"],
    source: "Original kit composition · Radix mobile drawer",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: 'import { AdminShell, FolderIcon } from "@project-kit/ui";\n\n<AdminShell\n  brand={<strong>Demo workspace</strong>}\n  navigation={[{ label: "Workspace", items: [{\n    id: "projects", label: "Projects", href: "/projects",\n    icon: <FolderIcon />\n  }] }]}\n  activeItemId="projects"\n  header={<strong>Projects</strong>}\n>\n  <h1>Your projects</h1>\n</AdminShell>\n\n// When embedding inside an existing main, set contentAs="section".\n// Supply renderLink to connect your application router.'
  },
  {
    id: "data-table",
    name: "Data table",
    group: "Compositions",
    description: "Client-side sorting, search, pagination, and selection with stable row IDs and explicit loading, error, and empty states.",
    tags: ["table", "data", "list", "sort", "search", "pagination", "select", "rows", "loading", "error", "empty", "composition"],
    source: "TanStack Table · original kit rendering",
    sourceUrl: "https://tanstack.com/table/latest/docs/introduction",
    usage: 'import { DataTable, type DataTableColumn } from "@project-kit/ui";\n\ninterface Project { id: string; name: string }\nconst columns: readonly DataTableColumn<Project>[] = [\n  { id: "name", header: "Project", accessor: (row) => row.name }\n];\nconst rows = [{ id: "project-01", name: "Spring launch" }];\n\n<DataTable\n  columns={columns}\n  data={rows}\n  getRowId={(row) => row.id}\n  caption="Projects"\n  searchLabel="Search projects"\n  initialPageSize={5}\n  pageSizeOptions={[5, 10, 25]}\n/>\n\n// Applications supply records, permissions, and persistence.'
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

export const groups = ["Foundations", "Controls", "Compositions", "Feedback"] as const;
