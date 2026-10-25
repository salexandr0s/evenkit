"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { createContext, forwardRef, useCallback, useContext, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type ComponentRef, type SyntheticEvent } from "react";
import { classes } from "./classes.js";
import { XIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

const DialogOpenContext = createContext(false);

export function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, ...props }: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? localOpen;
  return <DialogOpenContext.Provider value={open}><DialogPrimitive.Root {...props} open={open} onOpenChange={next => {
    if (controlledOpen === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  }} /></DialogOpenContext.Provider>;
}
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

// Presence retains the focused controls during exit; they must no longer act on input.
function whileDialogOpen<Event extends SyntheticEvent<HTMLElement>>(handler?: (event: Event) => void) {
  return (event: Event) => {
    if (event.currentTarget.dataset.state === "closed") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    handler?.(event);
  };
}

export const DialogContent = forwardRef<ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(function DialogContent(
  { className, children, container, showCloseButton = true, closeLabel = "Close dialog", size = "md", scroll = "content", onOpenAutoFocus, onFocusCapture, onKeyDownCapture, onKeyUpCapture, onClickCapture, ...props },
  ref,
) {
  const opening = useRef(false);
  const open = useContext(DialogOpenContext);
  const previousOpen = useRef(open);
  const previousContent = useRef<ComponentRef<typeof DialogPrimitive.Content> | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [content, setContent] = useState<ComponentRef<typeof DialogPrimitive.Content> | null>(null);
  const contentRef = useCallback((node: ComponentRef<typeof DialogPrimitive.Content> | null) => {
    setContent(node);
    if (typeof ref === "function") {
      const cleanup: unknown = ref(node);
      if (typeof cleanup === "function") return () => { setContent(null); cleanup(); };
    } else if (ref) ref.current = node;
  }, [ref]);
  const handleOpenAutoFocus = useCallback((event: Event) => {
    opening.current = true;
    try { onOpenAutoFocus?.(event); }
    finally { queueMicrotask(() => { opening.current = false; }); }
  }, [onOpenAutoFocus]);

  useLayoutEffect(() => {
    const reopening = open && !previousOpen.current && content && content === previousContent.current;
    previousOpen.current = open;
    previousContent.current = content;
    // A quick reopen reuses Presence's mounted FocusScope, which does not autofocus again.
    if (!reopening || content.contains(content.ownerDocument.activeElement)) return;
    const event = new Event("dialog.reopenAutoFocus", { cancelable: true });
    content.addEventListener(event.type, handleOpenAutoFocus, { once: true });
    content.dispatchEvent(event);
    if (event.defaultPrevented || content.contains(content.ownerDocument.activeElement)) return;
    if (lastFocused.current && content.contains(lastFocused.current)) lastFocused.current.focus({ preventScroll: true });
    if (!content.contains(content.ownerDocument.activeElement)) content.focus({ preventScroll: true });
  }, [open, content, handleOpenAutoFocus]);
  return (
    <TooltipProvider><DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className="pk-dialog-overlay" />
      <DialogPrimitive.Content {...props} ref={contentRef} className={classes("pk-dialog-content", className)} data-size={size} data-scroll={scroll} data-close-button={showCloseButton || undefined}
      onKeyDownCapture={whileDialogOpen(onKeyDownCapture)} onKeyUpCapture={whileDialogOpen(onKeyUpCapture)} onClickCapture={whileDialogOpen(onClickCapture)} onOpenAutoFocus={handleOpenAutoFocus}
      onFocusCapture={event => {
        if (event.target instanceof HTMLElement && event.currentTarget.contains(event.target)) lastFocused.current = event.target;
        onFocusCapture?.(event);
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
