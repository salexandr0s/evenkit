"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import { classes } from "./classes.js";
import { XIcon } from "./icons.js";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  container?: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>["container"];
  showCloseButton?: boolean;
  closeLabel?: string;
}

export const DialogContent = forwardRef<ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(function DialogContent(
  { className, children, container, showCloseButton = true, closeLabel = "Close dialog", ...props },
  ref,
) {
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className="pk-dialog-overlay" />
      <DialogPrimitive.Content {...props} ref={ref} className={classes("pk-dialog-content", className)}>
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close className="pk-dialog-close" aria-label={closeLabel}>
            <XIcon />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
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

export const DialogFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function DialogFooter(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={classes("pk-dialog-footer", className)} />;
});
