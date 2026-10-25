import { useEffect, useRef, useState } from "react";
import { Badge, Button, DataTable, Label, Select, type DataTableColumn } from "@evenkit/ui";
import { getProjectId, projectColumns, projects, type PreviewProject } from "./project-data";
import "./table-preview.css";

const states = ["ready", "loading", "error", "empty"] as const;
type PreviewState = (typeof states)[number];
const stateOptions = [
  { value: "ready", label: "Ready" }, { value: "loading", label: "Loading" },
  { value: "error", label: "Error" }, { value: "empty", label: "Empty" }
] as const;
const densityOptions = [{ value: "default", label: "Comfortable" }, { value: "compact", label: "Compact" }] as const;
const textOptions = [{ value: "wrap", label: "Wrap" }, { value: "truncate", label: "Truncate" }] as const;
const summaries = [
  "Launch plans and checklist.",
  "A shared place for client requests and project updates.",
  "Interview notes, research findings, and study summaries from the product and customer teams, collected in one library for the next planning cycle.",
  "Navigation, content, and accessibility updates for the website.",
  "A practical guide for new teammates during their first month.",
  "Published articles and campaign assets from previous releases.",
  "Contact details and collaboration notes for partner teams.",
  "Quarterly results and the next set of priorities.",
  "Design feedback and decisions awaiting a final review.",
  "Definitions and examples for working with project data.",
  "Product decisions, open questions, and meeting notes.",
  "Release checks, owners, and remaining approvals.",
];

interface TableProject extends PreviewProject {
  summary: string;
}

function createPreviewProjects(): readonly TableProject[] {
  return projects.map((project, index) => ({ ...project, summary: summaries[index] ?? "Fictional project summary." }));
}

const previewProjectColumns: readonly DataTableColumn<TableProject>[] = projectColumns.map((column) => {
  if (column.id === "owner") return {
    ...column,
    cell: (row: TableProject) => <div className="table-preview-owner"><span>{row.owner}</span><span>{row.owner === "Nora Patel" ? "Research coordination across product and customer teams" : "Workspace team"}</span></div>,
  };
  if (column.id === "updated") return {
    ...column,
    cell: (row: TableProject) => <time className="table-preview-date" dateTime={row.updated}>{column.cell?.(row) ?? row.updated}</time>,
  };
  return column;
});

export function TablePreview() {
  const [state, setState] = useState<PreviewState>("ready");
  const [density, setDensity] = useState<"default" | "compact">("default");
  const [cellText, setCellText] = useState<"wrap" | "truncate">("wrap");
  const [records, setRecords] = useState(createPreviewProjects);
  const [selectedIds, setSelectedIds] = useState<readonly string[]>([]);
  const [reviewProject, setReviewProject] = useState<TableProject | null>(null);
  const [archiveResult, setArchiveResult] = useState("");
  const [tableVersion, setTableVersion] = useState(0);
  const resetRef = useRef<HTMLButtonElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const unavailable = state === "loading" || state === "error";

  useEffect(() => {
    if (reviewProject) reviewHeadingRef.current?.focus();
  }, [reviewProject]);

  function openReview(project: TableProject) {
    if (reviewProject?.id === project.id) reviewHeadingRef.current?.focus();
    else setReviewProject(project);
  }

  function closeReview() {
    resetRef.current?.focus();
    setReviewProject(null);
  }

  function restoreProjects() {
    resetRef.current?.focus();
    setRecords(createPreviewProjects());
    setSelectedIds([]);
    setState("ready");
    setReviewProject(null);
    setArchiveResult("");
    setTableVersion((version) => version + 1);
  }

  function archiveSelected() {
    if (unavailable || selectedIds.length === 0) return;
    const selected = new Set(selectedIds);
    const archivedCount = records.filter((project) => selected.has(project.id)).length;
    resetRef.current?.focus();
    setRecords((current) => current.filter((project) => !selected.has(project.id)));
    setSelectedIds([]);
    if (reviewProject && selected.has(reviewProject.id)) setReviewProject(null);
    setArchiveResult(`${archivedCount} ${archivedCount === 1 ? "project archived" : "projects archived"} in this preview. Reset the example to restore the records.`);
  }

  const columns: readonly DataTableColumn<TableProject>[] = [
    ...previewProjectColumns,
    { id: "summary", header: "Summary", accessor: (row) => row.summary, overflow: cellText },
    { id: "review", header: "Review", accessor: () => "", sortable: false, searchable: false, cell: (row) => <Button size="sm" variant="outline" aria-label={`Review ${row.name}`} onClick={() => openReview(row)}>Review</Button> },
  ];

  return (
    <section className="table-preview" aria-label="Project table example">
      <div className="table-preview-heading"><h3>Browse and review projects</h3><p>Search, select, and review fictional projects. Changes stay in this preview.</p></div>
      <div className="table-preview-settings">
        <div className="table-preview-field"><Label htmlFor="table-preview-state">Preview state</Label><Select id="table-preview-state" value={state} options={stateOptions} onValueChange={(value) => { const next = states.find((item) => item === value); if (next) setState(next); }} /></div>
        <div className="table-preview-field"><Label htmlFor="table-preview-density">Table density</Label><Select id="table-preview-density" value={density} options={densityOptions} onValueChange={(value) => { if (value === "default" || value === "compact") setDensity(value); }} /></div>
        <div className="table-preview-field"><Label htmlFor="table-preview-text">Cell text</Label><Select id="table-preview-text" value={cellText} options={textOptions} onValueChange={(value) => { if (value === "wrap" || value === "truncate") setCellText(value); }} /></div>
      </div>
      <div><Button ref={resetRef} size="sm" variant="ghost" onClick={restoreProjects}>Reset table example</Button></div>
      <DataTable
        key={tableVersion}
        columns={columns}
        data={state === "empty" ? [] : records}
        getRowId={getProjectId}
        caption="Projects"
        searchLabel="Search projects"
        initialPageSize={5}
        pageSizeOptions={[5, 10, 25]}
        density={density}
        loading={state === "loading"}
        error={state === "error" ? <div className="table-preview-error"><strong>Projects could not be loaded.</strong><p>This is a local error example. Try again to restore the table with your selection intact.</p></div> : undefined}
        onRetry={() => setState("ready")}
        emptyTitle="No projects in this preview"
        emptyDescription="Restore the fictional projects to explore search, selection, and row actions."
        emptyAction={<Button size="sm" variant="outline" onClick={restoreProjects}>Restore preview projects</Button>}
        toolbar={<Badge tone="accent">Local data</Badge>}
        selection={{ selectedIds, onSelectionChange: setSelectedIds, getRowLabel: (row) => row.name, actions: <Button size="sm" variant="outline" disabled={unavailable || selectedIds.length === 0} onClick={archiveSelected}>Archive selected</Button> }}
      />
      <p className="table-preview-result" role="status" aria-label="Archive result" aria-atomic="true">{archiveResult}</p>
      <section className="table-preview-review" aria-label="Project review">
        <h4 ref={reviewHeadingRef} tabIndex={-1}>{reviewProject ? `Review ${reviewProject.name}` : "Project review"}</h4>
        {reviewProject ? <>
          <p>{reviewProject.summary}</p>
          <dl><div><dt>Owner</dt><dd>{reviewProject.owner}</dd></div><div><dt>Members</dt><dd>{reviewProject.members}</dd></div><div><dt>Status</dt><dd>{reviewProject.status}</dd></div></dl>
          <div><Button size="sm" variant="outline" onClick={closeReview}>Close project review</Button></div>
        </> : <p>Choose Review beside a project to inspect its details here.</p>}
      </section>
    </section>
  );
}
