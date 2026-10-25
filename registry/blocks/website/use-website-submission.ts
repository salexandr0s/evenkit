"use client";

import { useEffect, useRef, useState } from "react";
import type { WebsiteSubmitHandler } from "./form-types";

/** Local UI state only. Remount with a new key when the submission context changes. */
export function useWebsiteSubmission<Values>(onSubmit: WebsiteSubmitHandler<Values>) {
  const [status, setStatus] = useState<"idle" | "pending" | "sent" | "error">("idle");
  const active = useRef<AbortController | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      active.current?.abort();
      active.current = null;
    };
  }, []);

  async function send(values: Values) {
    if (!mounted.current || active.current || status === "sent") return;
    const request = new AbortController();
    active.current = request;
    setStatus("pending");
    try {
      await onSubmit(values, { signal: request.signal });
      if (mounted.current && active.current === request && !request.signal.aborted) setStatus("sent");
    } catch {
      // Raw provider exceptions can contain private details. Render the host's safe failure copy.
      if (mounted.current && active.current === request && !request.signal.aborted) setStatus("error");
    } finally {
      if (active.current === request) active.current = null;
    }
  }

  function reset() {
    active.current?.abort();
    active.current = null;
    setStatus("idle");
  }

  return { status, send, reset };
}
