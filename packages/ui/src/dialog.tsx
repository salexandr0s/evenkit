"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef, useRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import { classes } from "./classes.js";
import { XIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export type DialogSize = "sm" | "md" | "lg";

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  container?: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>["container"];
  showCloseButton?: boolean;
  closeLabel?: string;
  size?: DialogSize;
  /** Body scrolling uses direct DialogHeader, DialogBody, and DialogFooter children. */
  scroll?: "content" | "body";
}

export const DialogContent = forwardRef<ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(function DialogContent(
  { className, children, container, showCloseButton = true, closeLabel = "Close dialog", size = "md", scroll = "content", onOpenAutoFocus, ...props },
  ref,
) {
  const opening = useRef(false);
  return (
    <TooltipProvider><DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className="pk-dialog-overlay" />
      <DialogPrimitive.Content {...props} ref={ref} className={classes("pk-dialog-content", className)} data-size={size} data-scroll={scroll} data-close-button={showCloseButton || undefined} onOpenAutoFocus={event => {
        opening.current = true;
        try { onOpenAutoFocus?.(event); }
        finally { queueMicrotask(() => { opening.current = false; }); }
      }}>
        {children}
        {showCloseButton ? (
          <Tooltip>
            <TooltipTrigger asChild onFocus={event => { if (opening.current) event.preventDefault(); }}><DialogPrimitive.Close className="pk-dialog-close" aria-label={closeLabel}>
              <XIcon />
            </DialogPrimitive.Close></TooltipTrigger>
            <TooltipContent>{closeLabel}</TooltipContent>
          </Tooltip>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal></TooltipProvider>
  );
});

export const DialogHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function DialogHeader(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={classes("pk-dialog-header", className)} />;
});

export const DialogTitle = forwardRef<ComponentRef<typeof DialogPrimitive.Title>, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(function DialogTitle(
  { className, ...props },
  ref,
) {
  return <DialogPrimitive.Title {...props} ref={ref} className={classes("pk-dialog-title", className)} />;
});

export const DialogDescription = forwardRef<ComponentRef<typeof DialogPrimitive.Description>, ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(function DialogDescription(
  { className, ...props },
  ref,
) {
  return <DialogPrimitive.Description {...props} ref={ref} className={classes("pk-dialog-description", className)} />;
});

export const DialogBody = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function DialogBody(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={classes("pk-dialog-body", className)} />;
});

export const DialogFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function DialogFooter(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={classes("pk-dialog-footer", className)} />;
});
