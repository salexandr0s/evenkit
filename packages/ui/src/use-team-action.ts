"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { TeamActionContext, TeamActionResult } from "./team-admin-types.js";

export interface TeamActionState {
  pending: boolean;
  result: TeamActionResult | null;
  /** Returns null when cancelled, superseded or already running. */
  run: (operation: (context: TeamActionContext) => Promise<TeamActionResult>) => Promise<TeamActionResult | null>;
  cancel: () => void;
  reset: () => void;
}

const changedContext: TeamActionResult = { status: "stale", message: "The context changed. Review the current details before trying again." };

/** UI cancellation cannot undo a committed host mutation. Reconcile with the host after cancellation. */
export function useTeamAction(contextKey: string): TeamActionState {
  const [state, setState] = useState<{ key: string; pending: boolean; result: TeamActionResult | null }>({ key: contextKey, pending: false, result: null });
  const currentKey = useRef(contextKey);
  currentKey.current = contextKey;
  const request = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const lastKey = useRef(contextKey);
  useLayoutEffect(() => {
    if (lastKey.current === contextKey) return;
    lastKey.current = contextKey;
    request.current?.abort();
    request.current = null;
    setState(previous => ({ key: contextKey, pending: false, result: previous.pending || previous.result ? changedContext : null }));
  }, [contextKey]);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; request.current?.abort(); request.current = null; };
  }, []);

  const reset = useCallback(() => {
    request.current?.abort();
    request.current = null;
    setState({ key: currentKey.current, pending: false, result: null });
  }, []);

  const run = useCallback(async (operation: (context: TeamActionContext) => Promise<TeamActionResult>) => {
    if (!mounted.current || request.current || currentKey.current !== contextKey) return null;
    const controller = new AbortController();
    request.current = controller;
    setState({ key: contextKey, pending: true, result: null });
    let result: TeamActionResult;
    try {
      result = await operation({ signal: controller.signal, contextKey });
    } catch (error: unknown) {
      result = { status: "error", message: error instanceof Error ? error.message : "The action could not be completed. Try again." };
    }
    if (controller.signal.aborted || request.current !== controller || currentKey.current !== contextKey) return null;
    request.current = null;
    setState({ key: contextKey, pending: false, result });
    return result;
  }, [contextKey]);

  const current = state.key === contextKey;
  return { pending: current && state.pending, result: current ? state.result : state.pending || state.result ? changedContext : null, run, cancel: reset, reset };
}
