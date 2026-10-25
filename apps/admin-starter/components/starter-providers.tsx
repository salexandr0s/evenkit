"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { AppearanceValue } from "@evenkit/ui";
import type { WorkflowDraft, WorkflowRecord } from "../blocks/record-workflow";
import type { ProfileValue } from "../blocks/account-settings";
import { demoWorkspaces, initialWorkspaceData, isWorkspaceId, waitForDemo, type WorkspaceData, type WorkspaceId } from "../lib/demo-data";
import { appearanceStorageKey, readAppearance } from "../lib/appearance";
import type { DemoDocument } from "../lib/demo-documents";
import type { DemoTeam } from "../lib/demo-team";

interface StarterContextValue {
  workspaceId: WorkspaceId;
  workspaceName: string;
  data: WorkspaceData;
  appearance: AppearanceValue;
  setAppearance: (value: AppearanceValue) => void;
  switchWorkspace: (id: string) => void;
  request: (signal: AbortSignal) => Promise<void>;
  saveRecord: (draft: WorkflowDraft, context: { signal: AbortSignal }) => Promise<WorkflowRecord>;
  saveProfile: (draft: ProfileValue, context: { signal: AbortSignal }) => Promise<ProfileValue>;
  updateDocuments: (update: (documents: readonly DemoDocument[]) => readonly DemoDocument[], signal: AbortSignal) => void;
  createFileUrl: (file: File) => string;
  updateTeam: (update: (team: DemoTeam) => DemoTeam, signal: AbortSignal) => void;
  slow: boolean;
  setSlow: (value: boolean) => void;
  failNext: () => void;
  failureArmed: boolean;
}

const StarterContext = createContext<StarterContextValue | null>(null);
const defaultAppearance: AppearanceValue = { theme: "neutral", mode: "light", density: "default", locale: "en" };

export function StarterProviders({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId>("northstar");
  const [workspaces, setWorkspaces] = useState(initialWorkspaceData);
  const [appearances, setAppearances] = useState<Partial<Record<WorkspaceId, AppearanceValue>>>({});
  const [slow, setSlow] = useState(false);
  const [failureArmed, setFailureArmed] = useState(false);
  const controls = useRef({ slow: false, fail: false });
  const requests = useRef(new Set<AbortController>());
  const activeWorkspace = useRef(workspaceId);
  const fileUrls = useRef(new Set<string>());
  const appearance = appearances[workspaceId] ?? defaultAppearance;

  useEffect(() => {
    const restored: Partial<Record<WorkspaceId, AppearanceValue>> = {};
    for (const workspace of demoWorkspaces) {
      try {
        const value = readAppearance(localStorage.getItem(appearanceStorageKey(workspace.id)));
        if (value) restored[workspace.id] = value;
      } catch { /* Storage can be unavailable; in-memory preferences still work. */ }
    }
    setAppearances(restored);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.kitTheme = appearance.theme;
    if (appearance.mode === "system") delete document.documentElement.dataset.kitMode;
    else document.documentElement.dataset.kitMode = appearance.mode;
    document.documentElement.dataset.density = appearance.density ?? "default";
  }, [appearance]);

  useEffect(() => {
    const pending = requests.current;
    const urls = fileUrls.current;
    return () => { for (const controller of pending) controller.abort(); pending.clear(); for (const url of urls) URL.revokeObjectURL(url); urls.clear(); };
  }, []);

  const request = useCallback(async (signal: AbortSignal) => {
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) controller.abort();
    requests.current.add(controller);
    const fail = controls.current.fail;
    controls.current.fail = false;
    if (fail) setFailureArmed(false);
    try {
      await waitForDemo(controls.current.slow ? 3500 : 400, controller.signal);
      if (fail) throw new Error("The sample service could not complete this request. Retry when you are ready.");
    } finally {
      signal.removeEventListener("abort", abort);
      requests.current.delete(controller);
    }
  }, []);

  function switchWorkspace(id: string) {
    if (!isWorkspaceId(id) || id === activeWorkspace.current) return;
    for (const controller of requests.current) controller.abort();
    requests.current.clear();
    activeWorkspace.current = id;
    controls.current.fail = false;
    setFailureArmed(false);
    setWorkspaceId(id);
  }

  async function saveRecord(draft: WorkflowDraft, { signal }: { signal: AbortSignal }) {
    const scope = workspaceId;
    await request(signal);
    if (signal.aborted || activeWorkspace.current !== scope) throw new DOMException("Cancelled", "AbortError");
    if (!draft.name.trim()) throw new Error("Enter a project name.");
    if (draft.id && !workspaces[scope].records.some(record => record.id === draft.id)) throw new Error("This record is no longer in the selected workspace.");
    const saved: WorkflowRecord = { ...draft, id: draft.id ?? `${scope}-${crypto.randomUUID()}`, name: draft.name.trim() };
    setWorkspaces(current => ({ ...current, [scope]: { ...current[scope], records: draft.id ? current[scope].records.map(record => record.id === saved.id ? saved : record) : [...current[scope].records, saved] } }));
    return saved;
  }

  async function saveProfile(draft: ProfileValue, { signal }: { signal: AbortSignal }) {
    const scope = workspaceId;
    await request(signal);
    if (signal.aborted || activeWorkspace.current !== scope) throw new DOMException("Cancelled", "AbortError");
    if (draft.id !== workspaces[scope].profile.id) throw new Error("This profile belongs to another workspace.");
    setWorkspaces(current => ({ ...current, [scope]: { ...current[scope], profile: draft } }));
    return draft;
  }

  function updateDocuments(update: (documents: readonly DemoDocument[]) => readonly DemoDocument[], signal: AbortSignal) {
    if (signal.aborted || activeWorkspace.current !== workspaceId) throw new DOMException("Cancelled", "AbortError");
    const scope = workspaceId;
    setWorkspaces(current => ({ ...current, [scope]: { ...current[scope], documents: update(current[scope].documents) } }));
  }

  function createFileUrl(file: File) {
    const url = URL.createObjectURL(file);
    fileUrls.current.add(url);
    return url;
  }

  function updateTeam(update: (team: DemoTeam) => DemoTeam, signal: AbortSignal) {
    if (signal.aborted || activeWorkspace.current !== workspaceId) throw new DOMException("Cancelled", "AbortError");
    const scope = workspaceId;
    setWorkspaces(current => ({ ...current, [scope]: { ...current[scope], team: update(current[scope].team) } }));
  }

  return <StarterContext.Provider value={{
    workspaceId, workspaceName: demoWorkspaces.find(workspace => workspace.id === workspaceId)?.name ?? "Workspace", data: workspaces[workspaceId],
    appearance, setAppearance: value => setAppearances(current => ({ ...current, [workspaceId]: value })), switchWorkspace, request, saveRecord, saveProfile, updateDocuments, createFileUrl, updateTeam,
    slow, setSlow: value => { controls.current.slow = value; setSlow(value); },
    failNext: () => { controls.current.fail = true; setFailureArmed(true); }, failureArmed,
  }}>{children}</StarterContext.Provider>;
}

export function useStarter() {
  const context = useContext(StarterContext);
  if (!context) throw new Error("Starter components need StarterProviders.");
  return context;
}
