"use client";

import { isValidElement, useCallback, useLayoutEffect, useRef, useState, type AriaAttributes, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode, type Ref, type RefCallback } from "react";
import { foundation } from "@evenkit/tokens";

const exitAnimation = "pk-disclosure-presence";
const dimensions = ["height", "paddingTop", "paddingBottom", "marginTop", "marginBottom", "opacity"] as const;
type Dimension = typeof dimensions[number];
type MotionProperty = Dimension | "overflow";

interface DisclosureMotionOptions {
  enabled: boolean;
  style: CSSProperties | undefined;
  inert: boolean | undefined;
  ariaHidden: AriaAttributes["aria-hidden"];
  asChild: boolean | undefined;
  children: ReactNode;
}

/** Animate Radix's content without changing its mount or asChild contract. */
export function useDisclosureMotion(forwardedRef: Ref<HTMLDivElement>, options: DisclosureMotionOptions): RefCallback<HTMLDivElement> {
  const { enabled } = options;
  const child = options.asChild && isValidElement<ComponentPropsWithoutRef<"div">>(options.children) ? options.children.props : undefined;
  const intent = child ? {
    ...options,
    style: { ...options.style, ...child.style },
    inert: "inert" in child ? child.inert : options.inert,
    ariaHidden: "aria-hidden" in child ? child["aria-hidden"] : options.ariaHidden,
  } : options;
  const latest = useRef(intent);
  latest.current = intent;
  const committed = useRef(false);
  const animateOnAttach = useRef(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((next: HTMLDivElement | null) => {
    if (next) animateOnAttach.current = committed.current;
    setNode(next);
    if (typeof forwardedRef === "function") {
      const cleanup = forwardedRef(next);
      if (typeof cleanup === "function") return () => {
        setNode(current => current === next ? null : current);
        cleanup();
      };
    } else if (forwardedRef) forwardedRef.current = next;
  }, [forwardedRef]);

  useLayoutEffect(() => {
    committed.current = true;
    return () => { committed.current = false; };
  }, []);

  useLayoutEffect(() => {
    if (!node || !enabled) return;
    const view = node.ownerDocument.defaultView;
    if (!view || typeof node.animate !== "function") return;
    const element = node;
    const ownerWindow = view;
    const reduced = ownerWindow.matchMedia("(prefers-reduced-motion: reduce)");
    const owned = new Map<MotionProperty, { previous: string; priority: string; value: string; callerOwned: boolean }>();
    let animation: Animation | undefined;
    let generation = 0;
    let disposed = false;
    let open = node.dataset.state === "open";
    let previousHidden = node.getAttribute("aria-hidden");
    let previousInert = node.inert;
    let callerHidden = latest.current.ariaHidden !== undefined;
    let callerInert = latest.current.inert !== undefined;
    let closedAttributes = false;
    let width = node.getBoundingClientRect().width;

    function family(name: string) {
      if (name.startsWith("padding")) return "padding";
      if (name.startsWith("margin")) return "margin";
      if (name.startsWith("overflow")) return "overflow";
      return name === "blockSize" ? "height" : name;
    }

    function callerOwns(name: MotionProperty) {
      return Object.entries(latest.current.style ?? {}).some(([key, value]) => value !== undefined && family(key) === family(name));
    }

    function write(name: MotionProperty, value: string) {
      const property = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      const prior = owned.get(name);
      owned.set(name, { previous: prior?.previous ?? element.style.getPropertyValue(property), priority: prior?.priority ?? element.style.getPropertyPriority(property), value, callerOwned: prior?.callerOwned ?? callerOwns(name) });
      element.style.setProperty(property, value);
    }

    function restoreStyles() {
      const families = new Set(Array.from(owned.keys(), family));
      const retained = new Map<string, { value: string; priority: string }>();
      for (const [name, state] of owned) {
        const property = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        if (element.style.getPropertyValue(property) !== state.value) {
          retained.set(property, { value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) });
          continue;
        }
        if (state.callerOwned) element.style.removeProperty(property);
        else if (state.previous) element.style.setProperty(property, state.previous, state.priority);
        else element.style.removeProperty(property);
      }
      // Let the CSS declaration resolve current shorthands and logical aliases.
      for (const [name, value] of Object.entries(latest.current.style ?? {})) {
        if (value === undefined || value === null || !families.has(family(name))) continue;
        const property = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        element.style.setProperty(property, typeof value === "number" && name !== "opacity" ? `${value}px` : String(value));
      }
      for (const [property, state] of retained) {
        if (state.value) element.style.setProperty(property, state.value, state.priority);
        else element.style.removeProperty(property);
      }
      owned.clear();
    }

    function attributes(nextOpen: boolean) {
      if (!nextOpen && !closedAttributes) {
        const active = element.ownerDocument.activeElement;
        if (active && element.contains(active) && element.id) {
          const owners = ".pk-accordion-item, .pk-collapsible";
          const owner = element.closest(owners);
          const trigger = element.ownerDocument.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(element.id)}"]`)
            ?? Array.from(owner?.querySelectorAll<HTMLElement>(".pk-accordion-trigger, .pk-collapsible-trigger") ?? []).find(candidate => candidate.closest(owners) === owner);
          if (trigger && !trigger.matches(':disabled, [aria-disabled="true"]')) trigger.focus({ preventScroll: true });
        }
        previousHidden = element.getAttribute("aria-hidden");
        previousInert = element.inert;
        callerHidden = latest.current.ariaHidden !== undefined;
        callerInert = latest.current.inert !== undefined;
        element.setAttribute("aria-hidden", "true");
        element.inert = true;
        closedAttributes = true;
      } else if (nextOpen && closedAttributes) {
        if (element.getAttribute("aria-hidden") === "true") {
          if (latest.current.ariaHidden !== undefined) element.setAttribute("aria-hidden", String(latest.current.ariaHidden));
          else if (callerHidden || previousHidden === null) element.removeAttribute("aria-hidden");
          else element.setAttribute("aria-hidden", previousHidden);
        }
        if (element.inert) element.inert = latest.current.inert ?? (callerInert ? false : previousInert);
        closedAttributes = false;
      }
      if (!nextOpen) {
        if (element.getAttribute("aria-hidden") !== "true") element.setAttribute("aria-hidden", "true");
        if (!element.inert) element.inert = true;
      }
    }

    function frame(): Record<Dimension, string> {
      const style = ownerWindow.getComputedStyle(element);
      return Object.fromEntries(dimensions.map(property => [property, style[property]])) as Record<Dimension, string>;
    }

    function clock() {
      return element.getAnimations().find(item => "animationName" in item && item.animationName === exitAnimation);
    }

    function settle() {
      ++generation;
      animation?.cancel();
      animation = undefined;
      restoreStyles();
      if (!open) {
        for (const property of dimensions) write(property, property === "opacity" ? "0" : "0px");
        write("overflow", "hidden");
      }
      attributes(open);
    }

    function animate() {
      if (disposed) return;
      const current = frame();
      ++generation;
      const ticket = generation;
      animation?.cancel();
      restoreStyles();
      const target = frame();
      const style = ownerWindow.getComputedStyle(element);
      const duration = style.getPropertyValue("--pk-motion-duration-base").trim() || foundation.motion.duration.base;
      const milliseconds = Number.parseFloat(duration) * (duration.endsWith("ms") ? 1 : 1000);
      attributes(open);
      if (reduced.matches || !Number.isFinite(milliseconds) || milliseconds <= 0) { settle(); return; }
      if (!open) for (const property of dimensions) target[property] = property === "opacity" ? "0" : "0px";
      write("overflow", "hidden");
      const keyframes: Keyframe[] = [current, { opacity: open ? current.opacity : "0", offset: open ? 0.35 : 0.65 }, target];
      animation = element.animate(keyframes, { duration: milliseconds, easing: style.getPropertyValue("--pk-motion-easing-standard").trim() || foundation.motion.easing.standard, fill: "both" });
      const visual = animation;
      const exit = !open ? clock() : undefined;
      if (exit) {
        // Presence and the visual exit finish on the same timeline frame.
        const time = element.ownerDocument.timeline.currentTime;
        if (typeof time === "number") { exit.startTime = time; visual.startTime = time; }
      }
      visual.onfinish = () => {
        if (!disposed && generation === ticket) settle();
      };
    }

    function preferenceChanged() {
      if (!reduced.matches) return;
      const exit = !open ? clock() : undefined;
      settle();
      exit?.finish();
    }

    const sizes = new WeakMap<Element, { width: number; height: number }>();
    const resize = new ResizeObserver(entries => {
      const nextWidth = element.getBoundingClientRect().width;
      let contentChanged = false;
      for (const entry of entries) {
        const previous = sizes.get(entry.target);
        if (entry.target !== element && previous && (Math.abs(previous.width - entry.contentRect.width) > 0.5 || Math.abs(previous.height - entry.contentRect.height) > 0.5)) contentChanged = true;
        sizes.set(entry.target, { width: entry.contentRect.width, height: entry.contentRect.height });
      }
      const widthChanged = Math.abs(nextWidth - width) > 0.5;
      width = nextWidth;
      if (animation && open && (contentChanged || widthChanged)) animate();
    });
    const observeContents = () => {
      resize.disconnect();
      resize.observe(element);
      for (const child of element.children) resize.observe(child);
    };
    const mutation = new MutationObserver(records => {
      const nextOpen = element.dataset.state === "open";
      if (nextOpen !== open) {
        open = nextOpen;
        animate();
      } else if (open && animation && records.some(record => record.type !== "attributes")) animate();
      else if (!open) attributes(false);
      if (records.some(record => record.type === "childList")) observeContents();
    });
    // Initially open content and server-rendered content keep their natural size.
    if (!open) settle();
    else if (animateOnAttach.current) {
      // A closed asChild content has no DOM node until the user opens it.
      for (const property of dimensions) write(property, property === "opacity" ? "0" : "0px");
      animate();
    }
    animateOnAttach.current = false;
    observeContents();
    mutation.observe(node, { attributes: true, attributeFilter: ["data-state", "aria-hidden", "inert"], childList: true, characterData: true, subtree: true });
    reduced.addEventListener("change", preferenceChanged);
    return () => {
      disposed = true;
      ++generation;
      animation?.cancel();
      resize.disconnect();
      mutation.disconnect();
      reduced.removeEventListener("change", preferenceChanged);
      restoreStyles();
      attributes(true);
    };
  }, [node, enabled]);

  return ref;
}
