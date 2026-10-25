import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import { foundation } from "@evenkit/tokens";
import type { AdminSidebarState } from "./admin-shell.js";

export const sidebarWidths: Record<AdminSidebarState, number> = {
  hidden: 0,
  collapsed: Number.parseFloat(foundation.layout.sidebarCollapsed),
  expanded: Number.parseFloat(foundation.layout.sidebar),
};
const modes: readonly AdminSidebarState[] = ["hidden", "collapsed", "expanded"];
const magneticRange = Number.parseFloat(foundation.space["6"]);

function nearestMode(width: number): AdminSidebarState {
  return modes.reduce((nearest, mode) => Math.abs(sidebarWidths[mode] - width) < Math.abs(sidebarWidths[nearest] - width) ? mode : nearest, "hidden");
}

interface DragSession {
  pointerId: number;
  startX: number;
  startWidth: number;
  direction: number;
  state: AdminSidebarState;
  handle: HTMLDivElement;
}

interface SidebarDragOptions {
  state: AdminSidebarState;
  wideLayout: boolean;
  frameRef: RefObject<HTMLDivElement | null>;
  sidebarRef: RefObject<HTMLElement | null>;
  onChange: (state: AdminSidebarState) => void;
}

export function useAdminSidebarDrag({ state, wideLayout, frameRef, sidebarRef, onChange }: SidebarDragOptions) {
  const sessionRef = useRef<DragSession | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const dragging = width !== null;

  const releaseCapture = useCallback(() => {
    const session = sessionRef.current;
    sessionRef.current = null;
    if (session?.handle.hasPointerCapture(session.pointerId)) session.handle.releasePointerCapture(session.pointerId);
  }, []);

  const cancel = useCallback(() => {
    releaseCapture();
    setWidth(null);
  }, [releaseCapture]);

  useLayoutEffect(() => {
    if (sessionRef.current && (!wideLayout || sessionRef.current.state !== state)) cancel();
  }, [state, wideLayout, cancel]);

  useEffect(() => releaseCapture, [releaseCapture]);

  useEffect(() => {
    if (!dragging) return;
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      cancel();
    }
    document.addEventListener("keydown", escape, true);
    return () => document.removeEventListener("keydown", escape, true);
  }, [dragging, cancel]);

  function trackedWidth(clientX: number, session: DragSession) {
    const raw = Math.max(0, Math.min(sidebarWidths.expanded, session.startWidth + (clientX - session.startX) * session.direction));
    const target = sidebarWidths[nearestMode(raw)];
    const attraction = Math.max(0, 1 - Math.abs(target - raw) / magneticRange);
    return raw + (target - raw) * attraction * 0.65;
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!event.isPrimary || event.button !== 0 || sessionRef.current || !frame || frame.clientWidth <= Number.parseFloat(foundation.breakpoint.md)) return;
    event.preventDefault();
    const handle = event.currentTarget;
    const startWidth = sidebarRef.current?.getBoundingClientRect().width ?? sidebarWidths[state];
    handle.setPointerCapture(event.pointerId);
    handle.focus({ preventScroll: true });
    sessionRef.current = { pointerId: event.pointerId, startX: event.clientX, startWidth, direction: getComputedStyle(frame).direction === "rtl" ? -1 : 1, state, handle };
    setWidth(startWidth);
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const session = sessionRef.current;
    if (session?.pointerId !== event.pointerId) return;
    if (!canContinue(session)) { cancel(); return; }
    setWidth(trackedWidth(event.clientX, session));
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    const session = sessionRef.current;
    if (session?.pointerId !== event.pointerId) return;
    if (!canContinue(session)) { cancel(); return; }
    const next = nearestMode(trackedWidth(event.clientX, session));
    releaseCapture();
    setWidth(null);
    if (next !== state) onChange(next);
  }

  function canContinue(session: DragSession) {
    const frame = frameRef.current;
    return frame !== null && frame.clientWidth > Number.parseFloat(foundation.breakpoint.md) && session.handle.getClientRects().length > 0;
  }

  function pointerCancel(event: PointerEvent<HTMLDivElement>) {
    if (sessionRef.current?.pointerId === event.pointerId) cancel();
  }

  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (sessionRef.current) {
      if (event.key === "Escape") { event.preventDefault(); cancel(); }
      return;
    }
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const index = modes.indexOf(state);
    let next: AdminSidebarState | undefined;
    if (event.key === "Home") next = "hidden";
    if (event.key === "End") next = "expanded";
    if (event.key === "ArrowLeft") next = modes[Math.max(0, Math.min(modes.length - 1, index + (rtl ? 1 : -1)))];
    if (event.key === "ArrowRight") next = modes[Math.max(0, Math.min(modes.length - 1, index + (rtl ? -1 : 1)))];
    if (next === undefined) return;
    event.preventDefault();
    if (next !== state) onChange(next);
  }

  return { width, dragging, cancel, handleProps: { onPointerDown: pointerDown, onPointerMove: pointerMove, onPointerUp: pointerUp, onPointerCancel: pointerCancel, onLostPointerCapture: pointerCancel, onKeyDown: keyDown } };
}
