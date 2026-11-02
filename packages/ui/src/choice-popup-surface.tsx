"use client";

import { forwardRef, useCallback, useLayoutEffect, useRef, type ComponentPropsWithoutRef, type Ref, type SyntheticEvent } from "react";

interface ChoicePopupSurfaceProps extends ComponentPropsWithoutRef<"div"> {
  active: boolean;
  popupRef: Ref<HTMLDivElement> | undefined;
}

function setRef(ref: Ref<HTMLDivElement> | undefined, node: HTMLDivElement | null) {
  if (typeof ref === "function") return ref(node);
  if (ref) ref.current = node;
}

function whilePopupOpen<Event extends SyntheticEvent<HTMLDivElement>>(active: boolean, handler?: (event: Event) => void) {
  return (event: Event) => {
    if (!active) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    handler?.(event);
  };
}

/** Base UI keeps the surface during exit; Radix owns dismissal only while open. */
export const ChoicePopupSurface = forwardRef<HTMLDivElement, ChoicePopupSurfaceProps>(function ChoicePopupSurface(
  { active, popupRef, inert, onKeyDownCapture, onKeyUpCapture, onPointerDownCapture, onPointerUpCapture, onClickCapture, "aria-hidden": hidden, ...props },
  layerRef,
) {
  const surface = useRef<HTMLDivElement | null>(null);
  const setSurface = useCallback((node: HTMLDivElement | null) => {
    surface.current = node;
    const cleanup = setRef(popupRef, node);
    if (typeof cleanup === "function") return () => {
      if (surface.current === node) surface.current = null;
      cleanup();
    };
  }, [popupRef]);

  useLayoutEffect(() => {
    if (!active || !surface.current) return;
    const cleanup = setRef(layerRef, surface.current);
    return () => {
      if (typeof cleanup === "function") cleanup();
      else setRef(layerRef, null);
    };
  }, [active, layerRef]);

  return <div {...props} ref={setSurface} inert={!active || inert} aria-hidden={active ? hidden : true}
    onKeyDownCapture={whilePopupOpen(active, onKeyDownCapture)} onKeyUpCapture={whilePopupOpen(active, onKeyUpCapture)}
    onPointerDownCapture={whilePopupOpen(active, onPointerDownCapture)} onPointerUpCapture={whilePopupOpen(active, onPointerUpCapture)}
    onClickCapture={whilePopupOpen(active, onClickCapture)} />;
});
