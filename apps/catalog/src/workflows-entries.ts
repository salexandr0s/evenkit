import type { CatalogEntry } from "./catalog-types.js";

const imports = '"use client";\n\nimport "@project-kit/tokens/css";\nimport "@project-kit/ui/css";\n';
const workflowUsage = `${imports}
import { useState } from "react";
import { RecordWorkflow, type WorkflowRecord } from "./record-workflow";

// Copy registry/blocks/record-workflow.tsx beside this module.
export function ProjectsPage() {
  const [records, setRecords] = useState<readonly WorkflowRecord[]>([]);
  return <RecordWorkflow records={records} onSave={async (draft, { signal }) => {
    if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
    // Replace this local update with your application's save request.
    const saved: WorkflowRecord = { ...draft, id: draft.id ?? crypto.randomUUID() };
    setRecords(current => current.some(record => record.id === saved.id)
      ? current.map(record => record.id === saved.id ? saved : record)
      : [...current, saved]);
    return saved;
  }} />;
}
`;

export const workflowsEntries: readonly CatalogEntry[] = [
  { id: "semantic-table", name: "Semantic table", group: "Compositions", inventoryIds: ["I01"], description: "Native table parts with captions, density, numeric alignment and a contained scroll region.", tags: ["table", "caption", "rows", "header", "footer", "density", "numeric", "I01"], source: "Original kit composition · internal table contract", sourceUrl: "https://ui.shadcn.com/docs/components/radix/table", usage: `${imports}
import { SemanticTable, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableScrollRegion } from "@project-kit/ui";

export function BudgetTable() {
  return <TableScrollRegion label="Project budgets">
    <SemanticTable density="compact">
      <TableCaption>Project budgets in euros</TableCaption>
      <TableHeader><TableRow><TableHead>Project</TableHead><TableHead align="end">Budget</TableHead></TableRow></TableHeader>
      <TableBody><TableRow><TableHead scope="row">Meridian</TableHead><TableCell align="end">12,400</TableCell></TableRow></TableBody>
    </SemanticTable>
  </TableScrollRegion>;
}
` },
  { id: "filters", name: "Filter bar", group: "Compositions", inventoryIds: ["I02"], description: "Keep editable filter criteria separate from the query that produced the visible results.", tags: ["filter", "search", "apply", "reset", "draft", "form", "I02"], source: "Original kit composition · securicheck filter requirements", sourceUrl: "https://ui.shadcn.com/docs/components/radix/data-table", usage: `${imports}
import { useState } from "react";
import { FilterBar, TextField } from "@project-kit/ui";

export function ProjectFilters({ onQuery }: { onQuery: (query: string) => void }) {
  const [draft, setDraft] = useState("");
  const [applied, setApplied] = useState("");
  return <FilterBar dirty={draft !== applied}
    onApply={() => { setApplied(draft); onQuery(draft); }}
    onClear={() => { setDraft(""); setApplied(""); onQuery(""); }}>
    <TextField label="Find projects" value={draft} onChange={event => setDraft(event.target.value)} />
  </FilterBar>;
}
` },
  { id: "applied-filters", name: "Applied filters", group: "Compositions", inventoryIds: ["I03"], description: "Removable filter chips, an active count, clear-all, and focus recovery after removal.", tags: ["filter", "chip", "remove", "count", "clear", "I03"], source: "Original kit composition · applied query feedback", sourceUrl: "https://ui.shadcn.com/docs/components/radix/data-table", usage: `${imports}
import { AppliedFilters, type AppliedFilter } from "@project-kit/ui";

export function ActiveFilters({ filters, onRemove, onClear }: {
  filters: readonly AppliedFilter[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  return <AppliedFilters filters={filters} onRemove={onRemove} onClear={onClear} />;
}
` },
  { id: "file-input", name: "File input and dropzone", group: "Controls", inventoryIds: ["J01"], description: "Choose or drop files with type, size and count feedback. Your application handles uploads.", tags: ["file", "upload", "dropzone", "attachment", "validation", "J01"], source: "Original kit implementation · native file input", sourceUrl: "https://chakra-ui.com/docs/components/file-upload", usage: `${imports}
import { FileInput, type FileSelection } from "@project-kit/ui";

export function Attachments({ files, onSelection }: {
  files: readonly File[];
  onSelection: (selection: FileSelection) => void;
}) {
  return <FileInput label="Attachments" name="attachments" accept=".pdf,.txt"
    maxBytes={1024 * 1024} maxFiles={3} files={files}
    hint="PDF or text files, up to 1 MB each." onFilesSelected={onSelection} />;
}
` },
  { id: "file-row", name: "File row and attachment", group: "Compositions", inventoryIds: ["J02"], description: "File metadata, host-supplied progress and failure states, with named download and recovery actions.", tags: ["file", "attachment", "download", "retry", "remove", "progress", "J02"], source: "Original kit composition · file presentation", sourceUrl: "https://chakra-ui.com/docs/components/file-upload", usage: `${imports}
import { FileRow } from "@project-kit/ui";

export function DocumentRow({ downloadUrl, onRemove, onRetry }: {
  downloadUrl: string;
  onRemove: () => void;
  onRetry: () => void;
}) {
  return <ul><FileRow name="Project notes.pdf" sizeBytes={12400} fileType="PDF"
    state="error" message="The upload failed." downloadHref={downloadUrl}
    onRemove={onRemove} onRetry={onRetry} /></ul>;
}
` },
  { id: "list-page", name: "List page block", group: "Compositions", inventoryIds: ["O02"], description: "An editable list-to-edit flow with filters, pagination, recovery states and host-supplied records.", tags: ["page", "block", "list", "index", "create", "edit", "pagination", "O02"], source: "Editable kit source block · fictional catalog consumer", sourceUrl: "https://ui.shadcn.com/blocks", usage: workflowUsage },
  { id: "edit-page", name: "Create and edit block", group: "Compositions", inventoryIds: ["O04"], description: "Edit records with validation, dirty dismissal, reset, cancelled saves, failure and retry.", tags: ["page", "block", "create", "edit", "form", "dirty", "save", "retry", "O04"], source: "Editable kit source block · host-owned persistence", sourceUrl: "https://ui.shadcn.com/blocks", usage: workflowUsage },
  { id: "error-pages", name: "Error and recovery pages", group: "Compositions", inventoryIds: ["O11"], description: "Editable 404, unavailable, access-denied, offline and maintenance layouts with useful recovery actions.", tags: ["page", "block", "error", "404", "500", "denied", "offline", "maintenance", "O11"], source: "Editable kit source block · EmptyState composition", sourceUrl: "https://ui.shadcn.com/docs/components/radix/empty", usage: `${imports}
import { Button, ButtonLink } from "@project-kit/ui";
import { RecoveryPage } from "./recovery-page";

// Copy registry/blocks/recovery-page.tsx beside this module.
export function UnavailablePage({ onRetry }: { onRetry: () => void }) {
  return <RecoveryPage kind="unavailable" action={<Button onClick={onRetry}>Try again</Button>}
    secondaryAction={<ButtonLink href="/projects" variant="outline">Return to projects</ButtonLink>} />;
}
` },
];
