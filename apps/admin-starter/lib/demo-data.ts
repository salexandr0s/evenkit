import type { WorkflowRecord } from "../blocks/record-workflow";
import type { ProfileValue } from "../blocks/account-settings";

export const demoWorkspaces = [
  { id: "northstar", name: "Northstar Studio", description: "Design projects · fictional workspace" },
  { id: "harbor", name: "Harbor Workshop", description: "Community projects · fictional workspace" },
] as const;
export type WorkspaceId = typeof demoWorkspaces[number]["id"];
export function isWorkspaceId(value: string): value is WorkspaceId { return demoWorkspaces.some(workspace => workspace.id === value); }

export interface WorkspaceData {
  records: WorkflowRecord[];
  profile: ProfileValue;
}

export function initialWorkspaceData(): Record<WorkspaceId, WorkspaceData> {
  return {
    northstar: {
      records: [
        { id: "northstar-1", name: "Community field guide", status: "active", notes: "Prepare an illustrated guide for the autumn open day." },
        { id: "northstar-2", name: "Studio archive", status: "draft", notes: "Collect project notes and image permissions in one place." },
        { id: "northstar-3", name: "Workshop booking", status: "active", notes: "Test a shorter booking form with the studio team." },
        { id: "northstar-4", name: "Winter exhibition", status: "draft", notes: "Review the draft schedule and floor plan." },
      ],
      profile: { id: "northstar-demo-user", name: "Alex Rivers", email: "alex@northstar.example" },
    },
    harbor: {
      records: [
        { id: "harbor-1", name: "Repair café", status: "active", notes: "Organize the volunteer rota for Saturday." },
        { id: "harbor-2", name: "Tool library", status: "draft", notes: "Catalogue donated tools and their care notes." },
      ],
      profile: { id: "harbor-demo-user", name: "Sam Rowan", email: "sam@harbor.example" },
    },
  };
}

export function waitForDemo(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Cancelled", "AbortError")); return; }
    const abort = () => { clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, milliseconds);
    signal.addEventListener("abort", abort, { once: true });
  });
}
