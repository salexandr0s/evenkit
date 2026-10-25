"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TableSort } from "./table-controls.js";

export interface DataTableQuery {
  pageIndex: number;
  pageSize: number;
  search: string;
  sort: TableSort | null;
}
export interface DataTableRemote {
  query: DataTableQuery;
  /** Exact count for the query, before pagination. */
  total: number;
  onQueryChange: (query: DataTableQuery) => void;
}
export interface RemoteTableResult<T extends object> { data: readonly T[]; total: number }
export interface RemoteTableLoadContext { signal: AbortSignal }
export interface UseRemoteTableOptions<T extends object> {
  query: DataTableQuery;
  /** Include external filters, tenant IDs, and permission context in this key. */
  contextKey?: string;
  /** Memoize the loader with useCallback. Validate your API response in this callback. */
  load: (query: DataTableQuery, context: RemoteTableLoadContext) => Promise<RemoteTableResult<T>>;
}

export function tableQueryKey(query: DataTableQuery, contextKey = ""): string {
  return JSON.stringify([contextKey, query.pageIndex, query.pageSize, query.search, query.sort?.id ?? null, query.sort?.direction ?? null]);
}

/** Abort plus an effect lifetime guard protects against loaders that ignore cancellation. */
export function useRemoteTable<T extends object>({ query, contextKey = "", load }: UseRemoteTableOptions<T>) {
  const key = tableQueryKey(query, contextKey);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; attempt: number; data: readonly T[]; total: number; loading: boolean; error: string | null }>({ key: "", attempt: -1, data: [], total: 0, loading: true, error: null });
  const requestQuery = useMemo(() => ({ ...query, sort: query.sort ? { ...query.sort } : null }), [key]);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setResult({ key, attempt, data: [], total: 0, loading: true, error: null });
    void Promise.resolve().then(() => load(requestQuery, { signal: controller.signal })).then(next => {
      if (!active || controller.signal.aborted) return;
      if (!Array.isArray(next.data) || !Number.isSafeInteger(next.total) || next.total < 0 || next.data.length > requestQuery.pageSize || next.data.length > next.total || (next.total > requestQuery.pageIndex * requestQuery.pageSize && next.data.length === 0)) {
        throw new Error("The server returned an invalid page or total.");
      }
      setResult({ key, attempt, data: next.data, total: next.total, loading: false, error: null });
    }).catch((error: unknown) => {
      if (!active || controller.signal.aborted) return;
      setResult({ key, attempt, data: [], total: 0, loading: false, error: error instanceof Error ? error.message : "Records could not be loaded." });
    });
    return () => { active = false; controller.abort(); };
  }, [key, attempt, load, requestQuery]);
  const current = result.key === key && result.attempt === attempt;
  const loading = !current || result.loading;
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  return { data: loading ? [] : result.data, total: current ? result.total : 0, loading, error: current ? result.error : null, retry };
}

/** Retains explicit selected IDs across pages and clears them synchronously when their scope changes. */
export function useTableSelection(scopeKey: string) {
  const [selection, setSelection] = useState<{ scopeKey: string; ids: readonly string[] }>({ scopeKey, ids: [] });
  if (selection.scopeKey !== scopeKey) setSelection({ scopeKey, ids: [] });
  const selectedIds = selection.scopeKey === scopeKey ? selection.ids : [];
  const onSelectionChange = useCallback((ids: readonly string[]) => setSelection({ scopeKey, ids: [...new Set(ids)] }), [scopeKey]);
  return { selectedIds, onSelectionChange };
}
