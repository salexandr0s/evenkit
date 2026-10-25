"use client";

import type { LucideIcon, LucideProps } from "lucide-react";
import { forwardRef, useCallback, useContext, useRef, type ComponentType } from "react";
import { useAnimationControls } from "motion/react";
import { classes } from "./classes.js";
import { IconAnimationContext, type IconAnimation } from "./icon-provider.js";
import { useIconAnimation } from "./use-icon-animation.js";
import type { AnimatedGlyphProps } from "./animated-icons/motion.js";

export type IconSize = "sm" | "md" | "lg";

export interface IconProps extends Omit<LucideProps, "size" | "width" | "height" | "color" | "stroke" | "strokeWidth" | "absoluteStrokeWidth" | "nonScalingStroke" | "children" | "role" | "aria-hidden" | "aria-label" | "aria-labelledby" | "focusable" | "tabIndex"> {
  size?: IconSize;
  label?: string;
  /** Play once on pointer hover, or keep this icon still. Defaults to the provider's setting. */
  animation?: IconAnimation;
}

type IconMotion = ComponentType<AnimatedGlyphProps> | "pulse" | "detail" | "rows" | "columns" | "lid" | "mail" | "dots" | "write" | "toggle" | "swap-y" | "swap-x" | "turn" | "check";

export function createKitIcon(Glyph: LucideIcon, displayName: string, motion: IconMotion) {
  const glyphClass = `lucide-${(Glyph.displayName ?? displayName.replace(/Icon$/, "")).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
  const Icon = forwardRef<SVGSVGElement, IconProps>(function KitIcon(
    { size = "md", label, className, animation: override, ...props },
    ref,
  ) {
    const inherited = useContext(IconAnimationContext);
    const animation = override ?? inherited;
    const svgRef = useRef<SVGSVGElement>(null);
    const setRef = useCallback((node: SVGSVGElement | null) => {
      svgRef.current = node;
      if (typeof ref === "function") {
        const cleanup: unknown = ref(node);
        if (typeof cleanup === "function") return () => { svgRef.current = null; cleanup(); };
      }
      else if (ref) ref.current = node;
    }, [ref]);
    const controls = useAnimationControls();
    useIconAnimation(svgRef, animation, controls);
    const accessibleLabel = label?.trim();
    const shared = {
      ...props,
      ref: setRef,
      className: classes("lucide", glyphClass, "pk-icon", className),
      "data-size": size,
      "data-icon-animation": animation,
      "data-icon-motion": typeof motion === "string" ? motion : "paths",
      color: "currentColor",
      strokeWidth: "var(--pk-icon-stroke-width)",
      focusable: "false" as const,
      tabIndex: undefined,
      role: accessibleLabel ? "img" : undefined,
      "aria-label": accessibleLabel || undefined,
      "aria-hidden": accessibleLabel ? undefined : true,
    };
    if (typeof motion === "string") {
      return <Glyph {...shared} size={`var(--pk-icon-size-${size})`} absoluteStrokeWidth={false} nonScalingStroke={false} />;
    }
    const MotionGlyph = motion;
    return (
      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"
        {...shared} width={`var(--pk-icon-size-${size})`} height={`var(--pk-icon-size-${size})`} stroke="currentColor">
        <MotionGlyph controls={controls} />
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
