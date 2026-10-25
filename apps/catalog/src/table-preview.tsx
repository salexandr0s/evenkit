import { useState } from "react";
import { Badge, DataTable, Label, Select } from "@project-kit/ui";
import { getProjectId, projectColumns, projects } from "./project-data";

const states = ["ready", "loading", "error", "empty"] as const;
type PreviewState = (typeof states)[number];
const stateOptions = [
  { value: "ready", label: "Ready" }, { value: "loading", label: "Loading" },
  { value: "error", label: "Error" }, { value: "empty", label: "Empty" }
] as const;
const densityOptions = [{ value: "default", label: "Comfortable" }, { value: "compact", label: "Compact" }] as const;

export function TablePreview() {
  const [state, setState] = useState<PreviewState>("ready");
  const [density, setDensity] = useState<"default" | "compact">("default");
  const [selectedIds, setSelectedIds] = useState<readonly string[]>([]);

  return (
    <div className="catalog-demo-stack">
      <div className="catalog-table-settings">
        <div className="catalog-demo-field"><Label htmlFor="table-preview-state">Preview state</Label><Select id="table-preview-state" value={state} options={stateOptions} onValueChange={(value) => { const next = states.find((item) => item === value); if (next) setState(next); }} /></div>
        <div className="catalog-demo-field"><Label htmlFor="table-preview-density">Table density</Label><Select id="table-preview-density" value={density} options={densityOptions} onValueChange={(value) => { if (value === "default" || value === "compact") setDensity(value); }} /></div>
      </div>
      <DataTable
        columns={projectColumns}
        data={state === "empty" ? [] : projects}
        getRowId={getProjectId}
        caption="Projects"
        searchLabel="Search projects"
        initialPageSize={5}
        pageSizeOptions={[5, 10, 25]}
        density={density}
        loading={state === "loading"}
        error={state === "error" ? "Example failure: projects could not be loaded." : undefined}
        onRetry={() => setState("ready")}
        emptyTitle="No projects in this preview"
        emptyDescription="Choose the ready state to restore the fictional project records."
        toolbar={<Badge tone="accent">Local data</Badge>}
        selection={{ selectedIds, onSelectionChange: setSelectedIds, getRowLabel: (row) => row.name }}
      />
      <p className="catalog-caption" role="status">{selectedIds.length} {selectedIds.length === 1 ? "project" : "projects"} selected in this preview. Selection stays with project IDs when you sort or change pages.</p>
    </div>
  );
}
