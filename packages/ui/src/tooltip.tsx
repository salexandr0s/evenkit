"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { foundation } from "@project-kit/tokens";
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import { classes } from "./classes.js";

export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

export function TooltipProvider({ delayDuration = Number.parseFloat(foundation.motion.delay.tooltip), ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider {...props} delayDuration={delayDuration} />;
}

export const Tooltip = TooltipPrimitive.Root;
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
  return (
    <TooltipPrimitive.Portal container={container} forceMount={forceMount}>
      <TooltipPrimitive.Content
        {...props}
        ref={ref}
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
