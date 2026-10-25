"use client";

import { ActionMessage, Button, Spinner } from "@evenkit/ui";
import { useLayoutEffect, useRef } from "react";
import type { useDemoLoad } from "./use-demo-load";

export function ViewLoadState({ load, label }: { load: ReturnType<typeof useDemoLoad>; label: string }) {
  const region = useRef<HTMLDivElement>(null);
  const focused = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (focused.current && !focused.current.isConnected && document.activeElement === document.body) {
      (region.current ?? document.getElementById("admin-view-heading"))?.focus();
    }
  }, [load.state]);
  if (load.state === "ready") return null;
  return <div ref={region} tabIndex={-1} onFocusCapture={event => { focused.current = event.target; }} className="starter-load" aria-label={`${label} loading state`}>
    {load.state === "loading" ? <><Spinner label={`Loading ${label}`} /><Button variant="outline" onClick={load.cancel}>Cancel loading</Button></>
      : load.state === "error" ? <ActionMessage tone="error" role="alert" heading={`${label} could not be loaded`} actions={<Button variant="outline" onClick={load.reload}>Retry</Button>}>{load.error}</ActionMessage>
        : <ActionMessage tone="info" heading="Loading cancelled" actions={<Button variant="outline" onClick={load.reload}>Load {label.toLowerCase()}</Button>}>You can try again at any time.</ActionMessage>}
  </div>;
}
