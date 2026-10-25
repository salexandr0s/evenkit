"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStarter } from "./starter-providers";

export function useDemoLoad() {
  const { request, workspaceId } = useStarter();
  const controller = useRef<AbortController | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "cancelled" | "error">("loading");
  const [error, setError] = useState("");
  const reload = useCallback(() => {
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    setState("loading"); setError("");
    void request(next.signal).then(() => {
      if (!next.signal.aborted && controller.current === next) setState("ready");
    }, (failure: unknown) => {
      if (!next.signal.aborted && controller.current === next) { setState("error"); setError(failure instanceof Error ? failure.message : "This view could not be loaded."); }
    });
  }, [request]);
  useEffect(() => { reload(); return () => controller.current?.abort(); }, [reload, workspaceId]);
  const cancel = () => { controller.current?.abort(); controller.current = null; setState("cancelled"); };
  return { state, error, reload, cancel };
}
