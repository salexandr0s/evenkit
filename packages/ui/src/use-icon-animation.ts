"use client";

import { useEffect, type RefObject } from "react";
import type { AnimatedGlyphProps } from "./animated-icons/motion.js";
import type { IconAnimation } from "./icon-provider.js";

const triggerSelector = [
  "[data-icon-trigger]", "button", "a[href]", "summary",
  ...["button", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "tab", "checkbox", "radio", "switch", "combobox"].map(role => `[role="${role}"]`),
].join(",");
const blockedSelector = ':disabled, [aria-disabled="true"], [data-disabled]:not([data-disabled="false"]), [aria-busy="true"], [data-loading="true"], [inert]';

/** Hover belongs to the nearest control; a standalone icon owns its own target. */
export function useIconAnimation(ref: RefObject<SVGSVGElement | null>, animation: IconAnimation, controls: AnimatedGlyphProps["controls"]) {
  useEffect(() => {
    const svg = ref.current;
    if (!svg || animation === "static") return;

    const target = svg.closest(triggerSelector) ?? svg;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(any-hover: hover)");
    let active = false;
    const observer = new MutationObserver(() => {
      if (svg.closest(blockedSelector)) stop();
    });

    function stop() {
      if (!active) return;
      active = false;
      observer.disconnect();
      svg?.removeAttribute("data-icon-hovered");
      controls.stop();
      // Motion disposes its controls before passive unmount cleanup runs.
      if (ref.current?.isConnected) controls.set("normal");
    }

    function start(event: Event) {
      if (!(event instanceof PointerEvent) || event.pointerType === "touch" || active
        || reduced.matches || !hover.matches || svg?.closest(blockedSelector)) return;
      active = true;
      svg?.setAttribute("data-icon-hovered", "true");
      // Observe only while hovered, including fieldsets and busy/inert regions.
      for (let element: Element | null = svg; element; element = element.parentElement) {
        observer.observe(element, { attributes: true, attributeFilter: ["disabled", "aria-disabled", "data-disabled", "aria-busy", "data-loading", "inert"] });
      }
      void controls.start("animate");
    }

    function preferenceChanged() {
      if (reduced.matches || !hover.matches) stop();
    }

    function visibilityChanged() {
      if (document.hidden) stop();
    }

    target.addEventListener("pointerenter", start);
    target.addEventListener("pointerleave", stop);
    target.addEventListener("pointercancel", stop);
    reduced.addEventListener("change", preferenceChanged);
    hover.addEventListener("change", preferenceChanged);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      stop();
      observer.disconnect();
      target.removeEventListener("pointerenter", start);
      target.removeEventListener("pointerleave", stop);
      target.removeEventListener("pointercancel", stop);
      reduced.removeEventListener("change", preferenceChanged);
      hover.removeEventListener("change", preferenceChanged);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [ref, animation, controls]);
}
