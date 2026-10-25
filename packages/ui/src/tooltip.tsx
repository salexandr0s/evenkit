"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { foundation } from "@evenkit/tokens";
import { createContext, forwardRef, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type ComponentRef, type RefObject } from "react";
import { classes } from "./classes.js";

export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

const TooltipMotionContext = createContext<{
  open: boolean;
  staleScroll: RefObject<((event: Event) => boolean) | null>;
} | null>(null);

export function TooltipProvider({ delayDuration = Number.parseFloat(foundation.motion.delay.tooltip), ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider {...props} delayDuration={delayDuration} />;
}

export function Tooltip({ open: controlledOpen, defaultOpen = false, onOpenChange, ...props }: ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const staleScroll = useRef<((event: Event) => boolean) | null>(null);
  const scrollEvent = useRef<Event | null>(null);
  const open = controlledOpen ?? localOpen;
  const motion = useMemo(() => ({ open, staleScroll }), [open]);
  useLayoutEffect(() => {
    // Register before Radix's passive scroll listener and retain the ordering
    // when a tooltip reopens during its exit animation.
    const onScroll = (event: Event) => {
      scrollEvent.current = staleScroll.current?.(event) ? event : null;
    };
    window.addEventListener("scroll", onScroll, true);
    return () => { window.removeEventListener("scroll", onScroll, true); scrollEvent.current = null; };
  }, []);
  // Control Radix before it broadcasts opening, so retained exit content cannot
  // dismiss itself when the same trigger opens again during its closing animation.
  return <TooltipMotionContext.Provider value={motion}><TooltipPrimitive.Root {...props} open={open} onOpenChange={(next) => {
    // Native listeners can have a microtask checkpoint between them. Event phase
    // identifies the active dispatch without suppressing a later blur or Escape.
    if (!next && scrollEvent.current && scrollEvent.current.eventPhase !== Event.NONE && staleScroll.current?.(scrollEvent.current)) return;
    if (controlledOpen === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  }} /></TooltipMotionContext.Provider>;
}
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps extends Omit<ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>, "asChild"> {
  container?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Portal>["container"];
  showArrow?: boolean;
}

export const TooltipContent = forwardRef<ComponentRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(function TooltipContent(
  {
    className, children, container, forceMount, showArrow = true,
    sideOffset = Number.parseFloat(foundation.space["2"]),
    collisionPadding = Number.parseFloat(foundation.space["2"]),
    ...props
  },
  ref,
) {
  const motion = useContext(TooltipMotionContext);
  const [content, setContent] = useState<ComponentRef<typeof TooltipPrimitive.Content> | null>(null);
  const contentRef = useCallback((node: ComponentRef<typeof TooltipPrimitive.Content> | null) => {
    setContent(node);
    if (typeof ref === "function") {
      const cleanup: unknown = ref(node);
      if (typeof cleanup === "function") return () => { setContent(null); cleanup(); };
    } else if (ref) ref.current = node;
  }, [ref]);

  useLayoutEffect(() => {
    if (!motion?.open || !content) return;
    const doc = content.ownerDocument;
    const trigger = doc.activeElement;
    const descriptionId = content.id || content.querySelector('[role="tooltip"]')?.id;
    if (!(trigger instanceof HTMLElement) || !descriptionId || !trigger.getAttribute("aria-describedby")?.split(/\s+/).includes(descriptionId)) return;
    const origin = trigger.getBoundingClientRect();
    const view = doc.defaultView;
    const scrollX = view?.scrollX;
    const scrollY = view?.scrollY;
    const ancestors: { node: HTMLElement; left: number; top: number }[] = [];
    for (let node = trigger.parentElement; node; node = node.parentElement) ancestors.push({ node, left: node.scrollLeft, top: node.scrollTop });
    // Focus can queue a scroll event before the tooltip mounts. Ignore that
    // stale event only when its focused trigger has not moved since opening.
    const staleScroll = (event: Event) => {
      if (!(event.target instanceof Node) || !event.target.contains(trigger) || doc.activeElement !== trigger || !trigger.isConnected) return false;
      const current = trigger.getBoundingClientRect();
      return current.x === origin.x && current.y === origin.y && current.width === origin.width && current.height === origin.height
        && view?.scrollX === scrollX && view?.scrollY === scrollY
        && ancestors.every(({ node, left, top }) => node.scrollLeft === left && node.scrollTop === top);
    };
    motion.staleScroll.current = staleScroll;
    return () => { if (motion.staleScroll.current === staleScroll) motion.staleScroll.current = null; };
  }, [content, motion]);

  return (
    <TooltipPrimitive.Portal container={container} forceMount={forceMount}>
      <TooltipPrimitive.Content
        {...props}
        ref={contentRef}
        forceMount={forceMount}
        className={classes("pk-tooltip-content", className)}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
      >
        <div className="pk-tooltip-text">{children}</div>
        {showArrow ? (
          <TooltipPrimitive.Arrow
            asChild
            className="pk-tooltip-arrow"
            width={Number.parseFloat(foundation.space["2"])}
            height={Number.parseFloat(foundation.space["1"])}
            aria-hidden="true"
          >
            <svg viewBox="0 0 30 10" preserveAspectRatio="none">
              <path d="M0 0H30L15 10Z" />
              <path className="pk-tooltip-arrow-outline" d="M0 0L15 10L30 0" vectorEffect="non-scaling-stroke" />
            </svg>
          </TooltipPrimitive.Arrow>
        ) : null}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});
