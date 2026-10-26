"use client";

import { forwardRef, useState, type ReactElement } from "react";
import { Button, ButtonLink, type ButtonProps, type ButtonLinkProps } from "./button.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, type TooltipContentProps } from "./tooltip.js";

interface IconActionProps {
  /** The action's tooltip and default accessible name. */
  label: string;
  children: ReactElement;
  tooltipSide?: TooltipContentProps["side"];
}

export interface IconButtonProps extends Omit<ButtonProps, "shape" | "startIcon" | "endIcon" | "children" | "title">, IconActionProps {}
export interface IconButtonLinkProps extends Omit<ButtonLinkProps, "shape" | "startIcon" | "endIcon" | "children" | "title">, IconActionProps {}

function IconActionTooltip({ label, tooltipSide, children }: IconActionProps) {
  const [open, setOpen] = useState(false);
  // Remove the dismissal layer immediately when focus moves to another action.
  return <TooltipProvider><Tooltip open={open} onOpenChange={setOpen}><TooltipTrigger asChild>{children}</TooltipTrigger>{open ? <TooltipContent side={tooltipSide}>{label}</TooltipContent> : null}</Tooltip></TooltipProvider>;
}

/** A compact button with a required name and a hover/focus tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tooltipSide, children, variant = "ghost", size = "sm", "aria-label": accessibleLabel = label, ...props }, ref,
) {
  return <IconActionTooltip label={label} tooltipSide={tooltipSide}><Button {...props} ref={ref} variant={variant} size={size} shape="icon" aria-label={accessibleLabel}>{children}</Button></IconActionTooltip>;
});

/** A compact native link with the same naming and tooltip contract. */
export const IconButtonLink = forwardRef<HTMLAnchorElement, IconButtonLinkProps>(function IconButtonLink(
  { label, tooltipSide, children, variant = "ghost", size = "sm", "aria-label": accessibleLabel = label, ...props }, ref,
) {
  return <IconActionTooltip label={label} tooltipSide={tooltipSide}><ButtonLink {...props} ref={ref} variant={variant} size={size} shape="icon" aria-label={accessibleLabel}>{children}</ButtonLink></IconActionTooltip>;
});
