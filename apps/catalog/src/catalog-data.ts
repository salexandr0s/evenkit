import type { CatalogEntry } from "./catalog-types.js";
import { foundationsEntries } from "./foundations-entries.js";
import { selectionEntries } from "./selection-entries.js";
import { formsEntries } from "./forms-entries.js";
import { navigationEntries } from "./navigation-entries.js";
import { overlaysEntries } from "./overlays-entries.js";
import { workflowsEntries } from "./workflows-entries.js";
export type { CatalogEntry } from "./catalog-types.js";

const baseEntries: readonly CatalogEntry[] = [
  {
    id: "themes",
    name: "Themes",
    group: "Foundations",
    description: "Palettes for different projects, with coordinated surfaces, text, and actions. Every theme includes light and dark colours.",
    tags: ["theme", "colour", "color", "palette", "shades", "font", "typography", "brand", "dark mode", "graphite", "linen", "ocean", "dusk", "clay", "rose", "grove", "neutral"],
    source: "Original kit palettes · validated semantic colours",
    sourceUrl: "https://ui.shadcn.com/docs/theming",
    usage: "import \"@project-kit/tokens/css\";\n\n// Call from a browser event handler or effect.\nexport function applyTheme(mode: \"light\" | \"dark\" | \"system\" = \"system\") {\n  const root = document.documentElement;\n  root.dataset.kitTheme = \"linen\";\n  if (mode === \"system\") delete root.dataset.kitMode;\n  else root.dataset.kitMode = mode;\n}\n\n// Document attributes also theme dialogs and other portals."
  },
  {
    id: "tokens",
    name: "Design tokens",
    group: "Foundations",
    description: "Shared color, spacing, type, and motion values. Switch themes without changing a component.",
    tags: ["theme", "color", "palette", "spacing", "typography", "brand", "dark mode"],
    source: "Internal UI contract · adapted semantic colors",
    sourceUrl: "https://ui.shadcn.com/docs/theming",
    usage: "import \"@project-kit/tokens/css\";\n\nexport function TokenExample() {\n  return (\n    <article style={{\n      background: \"var(--pk-color-surface)\",\n      color: \"var(--pk-color-fg)\",\n      padding: \"var(--pk-space-6)\",\n      borderRadius: \"var(--pk-radius-md)\",\n      fontFamily: \"var(--pk-font-family-sans)\",\n    }}>\n      <h2>Project notes</h2>\n      <p>Semantic colors follow the active document theme.</p>\n    </article>\n  );\n}"
  },
  {
    id: "icons",
    name: "Icons",
    group: "Foundations",
    description: "Named icons that animate on hover, with static versions, shared sizes, and accessible labeling patterns.",
    tags: ["icon", "lucide", "animated", "hover", "static", "motion", "search", "folder", "navigation", "arrow", "glyph", "svg"],
    source: "Lucide · Lucide Animated · kit motion",
    sourceUrl: "https://lucide-animated.com/",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { Button, IconProvider, PlusIcon, SearchIcon } from \"@project-kit/ui\";\n\nexport function IconExamples({ onAdd }: { onAdd: () => void }) {\n  return (\n    <IconProvider animation=\"hover\">\n      {/* Hover the button to animate its decorative icon. */}\n      <Button startIcon={<PlusIcon />} onClick={onAdd}>Add project</Button>\n      {/* Name an icon-only action on its button. */}\n      <Button shape=\"icon\" aria-label=\"Add project\" onClick={onAdd}>\n        <PlusIcon />\n      </Button>\n      {/* An explicit static icon stays still within the provider. */}\n      <SearchIcon animation=\"static\" size=\"lg\" label=\"Search projects\" />\n    </IconProvider>\n  );\n}\n"
  },
  {
    id: "buttons",
    name: "Buttons",
    group: "Controls",
    description: "Actions and links with consistent sizing, visible focus, and explicit busy states.",
    tags: ["button", "action", "link", "disabled", "loading", "primary", "secondary", "icon only", "full width", "toggle"],
    source: "Original implementation · shadcn composition reference",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/button",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { Button, ButtonLink, CheckIcon, PlusIcon, ArrowRightIcon } from \"@project-kit/ui\";\n\ninterface ProjectActionsProps {\n  saving: boolean;\n  onSave: () => void;\n  onAdd: () => void;\n  onCreate: () => void;\n}\n\nexport function ProjectActions({ saving, onSave, onAdd, onCreate }: ProjectActionsProps) {\n  return (\n    <>\n      <Button startIcon={<CheckIcon />} loading={saving} onClick={onSave}>\n        Save changes\n      </Button>\n      <Button shape=\"icon\" size=\"sm\" aria-label=\"Add project\" onClick={onAdd}>\n        <PlusIcon size=\"sm\" />\n      </Button>\n      <form onSubmit={event => { event.preventDefault(); onCreate(); }}>\n        <Button fullWidth type=\"submit\">Create workspace</Button>\n      </form>\n      <ButtonLink href=\"/projects\" variant=\"outline\" endIcon={<ArrowRightIcon />}>\n        View projects\n      </ButtonLink>\n    </>\n  );\n}\n"
  },
  {
    id: "fields",
    name: "Fields",
    group: "Controls",
    description: "Inputs and textareas with labels, required cues, adornments, and associated help and errors.",
    tags: ["input", "field", "form", "label", "validation", "error", "textarea", "disabled", "read only", "required", "optional", "adornment"],
    source: "Original implementation · internal field requirements",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/input",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { Button, MailIcon, TextField, TextareaField } from \"@project-kit/ui\";\n\ninterface ContactFormProps {\n  errors?: { email?: string; notes?: string };\n  onSubmit: (data: FormData) => void;\n}\n\nexport function ContactForm({ errors = {}, onSubmit }: ContactFormProps) {\n  return (\n    <form onSubmit={event => {\n      event.preventDefault();\n      onSubmit(new FormData(event.currentTarget));\n    }}>\n      <TextField\n        label=\"Contact email\" type=\"email\" name=\"email\" required\n        startAdornment={<MailIcon />}\n        hint=\"Use the address your team can reach.\" error={errors.email}\n      />\n      <TextareaField\n        label=\"Notes\" name=\"notes\" optional rows={4}\n        hint=\"Add context for your team.\" error={errors.notes}\n      />\n      <Button type=\"submit\">Save contact</Button>\n    </form>\n  );\n}\n\n// Native props and refs pass through to the input or textarea.\n"
  },
  {
    id: "select",
    name: "Select",
    group: "Controls",
    description: "Flat or grouped choices with descriptions, field validation, and keyboard navigation.",
    tags: ["select", "dropdown", "options", "form", "disabled", "keyboard", "groups", "description", "empty", "validation"],
    source: "Radix Select · custom kit trigger and popup",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/select",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { SelectField, type SelectOptionGroup } from \"@project-kit/ui\";\n\nconst templates: SelectOptionGroup = {\n  id: \"team\",\n  label: \"Team templates\",\n  options: [\n    { value: \"blank\", label: \"Blank project\" },\n    { value: \"launch\", label: \"Product launch\",\n      description: \"Plan milestones, owners, and launch tasks.\" },\n  ],\n};\n\ninterface TemplateFieldProps {\n  template: string;\n  onTemplateChange: (value: string) => void;\n  error?: string;\n}\n\nexport function TemplateField({ template, onTemplateChange, error }: TemplateFieldProps) {\n  return (\n    <SelectField\n      label=\"Project template\" name=\"template\" required options={[templates]}\n      value={template} onValueChange={onTemplateChange}\n      hint=\"Choose a starting point for your team.\" error={error}\n    />\n  );\n}\n\n// Flat options work too. Use an empty value to show the placeholder.\n"
  },
  {
    id: "dialog",
    name: "Dialog",
    group: "Controls",
    description: "Sized dialogs with header, scrolling body, and footer composition. Try validation, draft dismissal, long content, and RTL layout.",
    tags: ["modal", "dialog", "overlay", "focus", "keyboard", "edit", "scroll", "size", "rtl"],
    source: "Radix Dialog · kit styling and composition",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { useId, useState } from \"react\";\nimport {\n  Button, TextField, Dialog, DialogTrigger, DialogContent,\n  DialogHeader, DialogTitle, DialogDescription,\n  DialogBody, DialogFooter, DialogClose,\n} from \"@project-kit/ui\";\n\nexport function EditProjectDialog({ name, onSave }: {\n  name: string;\n  onSave: (name: string) => void;\n}) {\n  const formId = useId();\n  const [open, setOpen] = useState(false);\n  return (\n    <Dialog open={open} onOpenChange={setOpen}>\n      <DialogTrigger asChild><Button>Edit project</Button></DialogTrigger>\n      <DialogContent size=\"lg\" scroll=\"body\">\n        <DialogHeader>\n          <DialogTitle>Edit project</DialogTitle>\n          <DialogDescription>Update the project name.</DialogDescription>\n        </DialogHeader>\n        <DialogBody>\n          <form id={formId} onSubmit={event => {\n            event.preventDefault();\n            onSave(String(new FormData(event.currentTarget).get(\"name\") ?? \"\"));\n            setOpen(false);\n          }}>\n            <TextField label=\"Project name\" name=\"name\" defaultValue={name} required />\n          </form>\n        </DialogBody>\n        <DialogFooter>\n          <DialogClose asChild><Button variant=\"outline\">Cancel</Button></DialogClose>\n          <Button type=\"submit\" form={formId}>Save project</Button>\n        </DialogFooter>\n      </DialogContent>\n    </Dialog>\n  );\n}\n\n// size: sm | md (default) | lg; scroll: content (default) | body.\n// The host callback above completes synchronously; manage pending/errors for async saves.\n"
  },
  {
    id: "tooltips",
    name: "Tooltips",
    group: "Controls",
    description: "Custom hints for hover and keyboard focus, with an arrow, wrapping text, and placement that follows available space.",
    tags: ["tooltip", "hint", "hover", "focus", "label", "help", "overlay"],
    source: "Radix Tooltip · kit surface and timing",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/tooltip",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { Button, UserIcon, TooltipProvider, Tooltip,\n  TooltipTrigger, TooltipContent } from \"@project-kit/ui\";\n\nexport function ProfileAction({ onOpenProfile }: { onOpenProfile: () => void }) {\n  return (\n    <TooltipProvider>\n      <Tooltip>\n        <TooltipTrigger asChild>\n          <Button shape=\"icon\" aria-label=\"Open profile\" onClick={onOpenProfile}>\n            <UserIcon />\n          </Button>\n        </TooltipTrigger>\n        <TooltipContent side=\"right\">Open your profile</TooltipContent>\n      </Tooltip>\n    </TooltipProvider>\n  );\n}\n\n// Keep a label on the trigger. Tooltips add context.\n// Hover, keyboard focus, and Escape are supported.\n"
  },
  {
    id: "admin-shell",
    name: "Admin shell",
    group: "Compositions",
    description: "Drag the sidebar edge to snap between expanded, icon-only, and hidden modes, or use the single display control. Custom tooltips label the icon rail; narrow screens use a drawer.",
    tags: ["admin", "shell", "dashboard", "sidebar", "navigation", "layout", "mobile", "drawer", "composition", "collapse", "hide", "tooltip", "drag", "resize", "snap"],
    source: "Original kit composition · Radix mobile drawer",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { useState, type ReactNode } from \"react\";\nimport { AdminShell, FolderIcon, LayoutDashboardIcon,\n  type AdminSidebarState } from \"@project-kit/ui\";\n\nexport function ProjectLayout({ children }: { children: ReactNode }) {\n  const [sidebar, setSidebar] = useState<AdminSidebarState>(\"expanded\");\n  return (\n    <AdminShell\n      brand=\"Demo workspace\" compactBrand={<LayoutDashboardIcon />}\n      sidebarState={sidebar} onSidebarStateChange={setSidebar}\n      navigation={[{ label: \"Workspace\", items: [{\n        id: \"projects\", label: \"Projects\", href: \"/projects\", icon: <FolderIcon />,\n      }] }]}\n      activeItemId=\"projects\" header=\"Projects\"\n    >\n      {children}\n    </AdminShell>\n  );\n}\n\n// States: expanded | collapsed | hidden.\n// Use defaultSidebarState for an uncontrolled shell.\n// Custom renderLink must forward supplied props and the anchor ref.\n// Use contentAs=\"section\" inside an existing main.\n"
  },
  {
    id: "data-table",
    name: "Data table",
    group: "Compositions",
    description: "Search, sort, and review records with wrapped text, accessible truncation tooltips, row actions, and selection across pages. Try bulk archiving and state recovery.",
    tags: ["table", "data", "list", "sort", "search", "pagination", "select", "rows", "loading", "error", "empty", "composition"],
    source: "TanStack Table · original kit rendering",
    sourceUrl: "https://tanstack.com/table/latest/docs/introduction",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { useState } from \"react\";\nimport { Button, ButtonLink, DataTable, type DataTableColumn } from \"@project-kit/ui\";\n\ninterface Project { id: string; name: string; members: number }\nconst columns: readonly DataTableColumn<Project>[] = [\n  { id: \"name\", header: \"Project\", accessor: row => row.name, overflow: \"wrap\" },\n  { id: \"members\", header: \"Members\", accessor: row => row.members, align: \"end\" },\n  { id: \"open\", header: \"Actions\", accessor: () => \"\", sortable: false, searchable: false,\n    cell: row => <ButtonLink size=\"sm\" href={\"/projects/\" + encodeURIComponent(row.id)}\n      aria-label={\"Open \" + row.name}>Open project</ButtonLink> },\n];\n\nexport function ProjectTable({ projects, onReview }: {\n  projects: readonly Project[];\n  onReview: (ids: readonly string[]) => void;\n}) {\n  const [selectedIds, setSelectedIds] = useState<readonly string[]>([]);\n  return (\n    <DataTable\n      caption=\"Projects\" data={projects} columns={columns} getRowId={row => row.id}\n      searchLabel=\"Search projects\" initialPageSize={5} pageSizeOptions={[5, 10, 25]}\n      selection={{\n        selectedIds, onSelectionChange: setSelectedIds, getRowLabel: row => row.name,\n        actions: <Button size=\"sm\" onClick={() => onReview(selectedIds)}>Review selected</Button>,\n      }}\n    />\n  );\n}\n\n// Your app owns records, deleted-ID cleanup, and bulk-action behavior.\n// Custom cell renderers stay unclipped; overflow controls primitive cells.\n"
  },
  {
    id: "chat",
    name: "AI chat",
    group: "Compositions",
    description: "A floating assistant or embedded chat with a maximized workspace, conversation history, and streaming controls. Uses the same tokens as the rest of your project.",
    tags: ["ai", "chat", "chatbot", "assistant", "conversation", "history", "streaming", "messages", "composer", "widget", "maximize", "sidebar"],
    source: "Original kit composition · Brainwave interaction reference",
    sourceUrl: "https://www.radix-ui.com/primitives/docs/components/dialog",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { ChatWidget, ChatPanel, type ChatWidgetProps } from \"@project-kit/ui\";\n\ntype ProjectAssistantProps = Required<Pick<ChatWidgetProps,\n  \"messages\" | \"conversations\" | \"activeConversationId\" |\n  \"value\" | \"onValueChange\" | \"onSend\" |\n  \"onSelectConversation\" | \"onNewConversation\" |\n  \"status\" | \"onStop\" | \"onRetry\"\n>> & { embedded?: boolean };\n\nexport function ProjectAssistant({ embedded = false, ...props }: ProjectAssistantProps) {\n  const Chat = embedded ? ChatPanel : ChatWidget;\n  return (\n    <Chat\n      {...props}\n      title=\"Project assistant\"\n      suggestions={[\"Help me get started\"]}\n    />\n  );\n}\n\n// Pass embedded for a ChatPanel instead of the floating widget.\n// Your app owns messages, drafts, streaming, and storage.\n// onSend clears the draft when the send is accepted.\n// status: idle | submitted | streaming | error.\n"
  },
  {
    id: "status",
    name: "Status",
    group: "Feedback",
    description: "Status labels with icons and indicators, plus persistent messages with a heading and actions. Retry a failed action and dismiss the result.",
    tags: ["badge", "message", "feedback", "success", "warning", "danger", "error", "status", "alert"],
    source: "Original implementation · internal feedback requirements",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/badge",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { Badge, ActionMessage, Button } from \"@project-kit/ui\";\n\nexport function SaveStatus({ onRetry }: { onRetry: () => void }) {\n  return (\n    <>\n      <Badge tone=\"success\" dot>Active</Badge>\n      <Badge size=\"sm\" variant=\"outline\">Draft</Badge>\n      <ActionMessage\n        tone=\"error\"\n        heading=\"Changes could not be saved\"\n        actions={<Button variant=\"outline\" onClick={onRetry}>Try again</Button>}\n      >\n        Your draft is still here. Check your connection and retry.\n      </ActionMessage>\n    </>\n  );\n}\n\n// Messages stay visible until your app removes them.\n// Pass icon={null} to omit the decorative tone icon.\n"
  },
  {
    id: "loading",
    name: "Loading",
    group: "Feedback",
    description: "Sized spinners and text, avatar, or block placeholders. Reload the project to see content replace its skeleton while progress is announced once.",
    tags: ["spinner", "skeleton", "loading", "busy", "pending", "motion"],
    source: "Original implementation · token-based motion",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/skeleton",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport type { ReactNode } from \"react\";\nimport { Spinner, Skeleton } from \"@project-kit/ui\";\n\nexport function ProjectLoading({ loading, children }: {\n  loading: boolean;\n  children: ReactNode;\n}) {\n  return (\n    <>\n      <section aria-label=\"Project details\" aria-busy={loading}>\n        {loading ? <>\n          <Skeleton variant=\"avatar\" size=\"lg\" />\n          <Skeleton variant=\"text\" />\n          <Skeleton variant=\"block\" />\n        </> : children}\n      </section>\n      <p role=\"status\" aria-atomic=\"true\">\n        {loading && <Spinner size=\"sm\" aria-hidden=\"true\" />}\n        {loading ? \"Loading project details…\" : \"Project details loaded.\"}\n      </p>\n    </>\n  );\n}\n\n// For a standalone spinner, supply a useful label.\n// Skeletons are decorative; keep announcements outside busy content.\n"
  },
  {
    id: "empty",
    name: "Empty state",
    group: "Feedback",
    description: "Guide first use, recover an empty search, or retry a failed request. Add a decorative icon, choose a heading level, and offer a second way forward.",
    tags: ["empty", "no results", "retry", "error", "recovery", "placeholder"],
    source: "Original implementation · internal state patterns",
    sourceUrl: "https://ui.shadcn.com/docs/components/radix/empty",
    usage: "\"use client\";\n\nimport \"@project-kit/tokens/css\";\nimport \"@project-kit/ui/css\";\nimport { Button, EmptyState, FolderIcon } from \"@project-kit/ui\";\n\nexport function EmptyProjects({ onCreate, onChooseTemplate }: {\n  onCreate: () => void;\n  onChooseTemplate: () => void;\n}) {\n  return (\n    <EmptyState\n      icon={<FolderIcon />} title=\"No projects yet\" titleAs=\"h3\"\n      size=\"sm\" align=\"start\"\n      description=\"Create a project or start from a template.\"\n      action={<Button onClick={onCreate}>Create project</Button>}\n      secondaryAction={\n        <Button variant=\"outline\" onClick={onChooseTemplate}>Use a template</Button>\n      }\n    />\n  );\n}\n\n// Choose a heading level that fits your page.\n// Your app owns announcements and focus when content is replaced.\n"
  }
];

export const entries: readonly CatalogEntry[] = [
  ...baseEntries, ...foundationsEntries, ...selectionEntries, ...formsEntries,
  ...navigationEntries, ...overlaysEntries, ...workflowsEntries,
];

export const groups = ["Foundations", "Controls", "Compositions", "Feedback"] as const;
