"use client";

import * as MenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as AlertPrimitive from "@radix-ui/react-alert-dialog";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { foundation } from "@evenkit/tokens";
import { createPortal } from "react-dom";
import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type ComponentRef, type MouseEvent, type ReactNode, type SyntheticEvent } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, type DialogContentProps } from "./dialog.js";
import { Spinner } from "./feedback.js";
import { Avatar } from "./foundations.js";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, CircleAlertIcon, CircleCheckIcon, InfoIcon, LogOutIcon, MoonIcon, SettingsIcon, SunIcon, TriangleAlertIcon, XIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

const popupGap = Number.parseFloat(foundation.space["2"]);
const popupInset = Number.parseFloat(foundation.space["3"]);

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;
export const DropdownMenuSub = MenuPrimitive.Sub;
export type DropdownMenuProps = ComponentPropsWithoutRef<typeof MenuPrimitive.Root>;
export interface DropdownMenuContentProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.Content> {
  container?: ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>["container"];
}

export const DropdownMenuContent = forwardRef<ComponentRef<typeof MenuPrimitive.Content>, DropdownMenuContentProps>(function DropdownMenuContent(
  { className, children, container, forceMount, sideOffset = popupGap, collisionPadding = popupInset, ...props }, ref,
) {
  return <MenuPrimitive.Portal container={container} forceMount={forceMount}><MenuPrimitive.Content {...props} ref={ref} forceMount={forceMount} sideOffset={sideOffset} collisionPadding={collisionPadding} className={classes("pk-menu-content", className)}>{children}</MenuPrimitive.Content></MenuPrimitive.Portal>;
});

export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.Item> { destructive?: boolean }
export const DropdownMenuItem = forwardRef<ComponentRef<typeof MenuPrimitive.Item>, DropdownMenuItemProps>(function DropdownMenuItem({ className, destructive, ...props }, ref) {
  return <MenuPrimitive.Item {...props} ref={ref} className={classes("pk-menu-item", className)} data-destructive={destructive || undefined} />;
});
export const DropdownMenuLabel = forwardRef<ComponentRef<typeof MenuPrimitive.Label>, ComponentPropsWithoutRef<typeof MenuPrimitive.Label>>(function DropdownMenuLabel({ className, ...props }, ref) {
  return <MenuPrimitive.Label {...props} ref={ref} className={classes("pk-menu-label", className)} />;
});
export const DropdownMenuSeparator = forwardRef<ComponentRef<typeof MenuPrimitive.Separator>, ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <MenuPrimitive.Separator {...props} ref={ref} className={classes("pk-menu-separator", className)} />;
});
export const DropdownMenuCheckboxItem = forwardRef<ComponentRef<typeof MenuPrimitive.CheckboxItem>, ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return <MenuPrimitive.CheckboxItem {...props} ref={ref} className={classes("pk-menu-item pk-menu-choice", className)}><span className="pk-menu-item-text">{children}</span><span className="pk-menu-indicator" aria-hidden="true"><MenuPrimitive.ItemIndicator><CheckIcon size="sm" /></MenuPrimitive.ItemIndicator></span></MenuPrimitive.CheckboxItem>;
});
export const DropdownMenuRadioItem = forwardRef<ComponentRef<typeof MenuPrimitive.RadioItem>, ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return <MenuPrimitive.RadioItem {...props} ref={ref} className={classes("pk-menu-item pk-menu-choice", className)}><span className="pk-menu-item-text">{children}</span><span className="pk-menu-indicator" aria-hidden="true"><MenuPrimitive.ItemIndicator><CheckIcon size="sm" /></MenuPrimitive.ItemIndicator></span></MenuPrimitive.RadioItem>;
});
export const DropdownMenuSubTrigger = forwardRef<ComponentRef<typeof MenuPrimitive.SubTrigger>, ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>>(function DropdownMenuSubTrigger({ className, children, ...props }, ref) {
  return <MenuPrimitive.SubTrigger {...props} ref={ref} className={classes("pk-menu-item pk-menu-sub-trigger", className)}><span className="pk-menu-item-text">{children}</span><ChevronRightIcon className="pk-menu-sub-chevron" size="sm" /></MenuPrimitive.SubTrigger>;
});
export interface DropdownMenuSubContentProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent> { container?: ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>["container"] }
export const DropdownMenuSubContent = forwardRef<ComponentRef<typeof MenuPrimitive.SubContent>, DropdownMenuSubContentProps>(function DropdownMenuSubContent({ className, children, container, forceMount, collisionPadding = popupInset, ...props }, ref) {
  return <MenuPrimitive.Portal container={container} forceMount={forceMount}><MenuPrimitive.SubContent {...props} ref={ref} forceMount={forceMount} collisionPadding={collisionPadding} className={classes("pk-menu-content", className)}>{children}</MenuPrimitive.SubContent></MenuPrimitive.Portal>;
});

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;
export type PopoverProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;
export interface PopoverContentProps extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> { container?: ComponentPropsWithoutRef<typeof PopoverPrimitive.Portal>["container"] }
export const PopoverContent = forwardRef<ComponentRef<typeof PopoverPrimitive.Content>, PopoverContentProps>(function PopoverContent({ className, children, container, forceMount, sideOffset = popupGap, collisionPadding = popupInset, ...props }, ref) {
  return <PopoverPrimitive.Portal container={container} forceMount={forceMount}><PopoverPrimitive.Content {...props} ref={ref} forceMount={forceMount} sideOffset={sideOffset} collisionPadding={collisionPadding} className={classes("pk-popover-content", className)}>{children}</PopoverPrimitive.Content></PopoverPrimitive.Portal>;
});
export const PopoverTitle = forwardRef<ComponentRef<typeof PopoverPrimitive.Title>, ComponentPropsWithoutRef<typeof PopoverPrimitive.Title>>(function PopoverTitle({ className, ...props }, ref) {
  return <PopoverPrimitive.Title {...props} ref={ref} className={classes("pk-popover-title", className)} />;
});
export const PopoverDescription = forwardRef<ComponentRef<typeof PopoverPrimitive.Description>, ComponentPropsWithoutRef<typeof PopoverPrimitive.Description>>(function PopoverDescription({ className, ...props }, ref) {
  return <PopoverPrimitive.Description {...props} ref={ref} className={classes("pk-popover-description", className)} />;
});

export const AlertDialog = AlertPrimitive.Root;
export const AlertDialogTrigger = AlertPrimitive.Trigger;
export const AlertDialogHeader = DialogHeader;
export const AlertDialogFooter = DialogFooter;
export type AlertDialogProps = ComponentPropsWithoutRef<typeof AlertPrimitive.Root>;
export interface AlertDialogContentProps extends ComponentPropsWithoutRef<typeof AlertPrimitive.Content> { container?: ComponentPropsWithoutRef<typeof AlertPrimitive.Portal>["container"] }
function whileAlertDialogOpen<Event extends SyntheticEvent<HTMLElement>>(handler?: (event: Event) => void) {
  return (event: Event) => {
    // Radix retains the closing surface until its exit animation finishes.
    if (event.currentTarget.dataset.state === "closed") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    handler?.(event);
  };
}
export const AlertDialogContent = forwardRef<ComponentRef<typeof AlertPrimitive.Content>, AlertDialogContentProps>(function AlertDialogContent({ className, children, container, forceMount, onKeyDownCapture, onKeyUpCapture, onClickCapture, ...props }, ref) {
  return <AlertPrimitive.Portal container={container} forceMount={forceMount}><AlertPrimitive.Overlay className="pk-dialog-overlay" forceMount={forceMount} /><AlertPrimitive.Content {...props} ref={ref} forceMount={forceMount} className={classes("pk-dialog-content pk-alert-dialog-content", className)} data-size="sm" onKeyDownCapture={whileAlertDialogOpen(onKeyDownCapture)} onKeyUpCapture={whileAlertDialogOpen(onKeyUpCapture)} onClickCapture={whileAlertDialogOpen(onClickCapture)}>{children}</AlertPrimitive.Content></AlertPrimitive.Portal>;
});
export const AlertDialogTitle = forwardRef<ComponentRef<typeof AlertPrimitive.Title>, ComponentPropsWithoutRef<typeof AlertPrimitive.Title>>(function AlertDialogTitle({ className, ...props }, ref) {
  return <AlertPrimitive.Title {...props} ref={ref} className={classes("pk-dialog-title", className)} />;
});
export const AlertDialogDescription = forwardRef<ComponentRef<typeof AlertPrimitive.Description>, ComponentPropsWithoutRef<typeof AlertPrimitive.Description>>(function AlertDialogDescription({ className, ...props }, ref) {
  return <AlertPrimitive.Description {...props} ref={ref} className={classes("pk-dialog-description", className)} />;
});
export const AlertDialogCancel = forwardRef<ComponentRef<typeof AlertPrimitive.Cancel>, ComponentPropsWithoutRef<typeof AlertPrimitive.Cancel>>(function AlertDialogCancel({ className, ...props }, ref) {
  return <AlertPrimitive.Cancel {...props} ref={ref} className={classes("pk-button", className)} data-size="md" data-variant="outline" />;
});
export const AlertDialogAction = forwardRef<ComponentRef<typeof AlertPrimitive.Action>, ComponentPropsWithoutRef<typeof AlertPrimitive.Action>>(function AlertDialogAction({ className, ...props }, ref) {
  return <AlertPrimitive.Action {...props} ref={ref} className={classes("pk-button pk-alert-dialog-action", className)} data-size="md" data-variant="destructive" />;
});

export const Sheet = Dialog;
export const SheetTrigger = DialogTrigger;
export const SheetClose = DialogClose;
export const SheetHeader = DialogHeader;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;
export const SheetBody = DialogBody;
export const SheetFooter = DialogFooter;
export interface SheetContentProps extends DialogContentProps { side?: "start" | "end" }
export const SheetContent = forwardRef<ComponentRef<typeof DialogContent>, SheetContentProps>(function SheetContent({ className, side = "end", scroll = "body", size = "md", ...props }, ref) {
  return <DialogContent {...props} ref={ref} size={size} scroll={scroll} className={classes("pk-sheet-content", className)} data-side={side} />;
});

export type ToastTone = "success" | "info" | "warning" | "error";
export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Positive milliseconds, or Infinity for explicit dismissal. */
  duration?: number;
  action?: {
    label: string;
    altText: string;
    /** A familiar action glyph; label remains its accessible name and tooltip. */
    icon?: ReactNode;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  };
  returnFocusTo?: HTMLElement | null;
}
export interface ToastApi {
  /** Returns null when the provider is gone or this callback belongs to an old scope. */
  toast: (options: ToastOptions) => string | null;
  dismiss: (id: string) => void;
  clear: () => void;
}
export interface ToastProviderProps {
  children: ReactNode;
  /** A route/account/workspace identity; a change clears old notices without remounting children. */
  scopeKey?: string;
  /** A modal-local container also hosts its announcements. */
  container?: HTMLElement | null;
  label?: string;
  viewportLabel?: string;
  dismissLabel?: string;
  dir?: "ltr" | "rtl";
}
interface ToastScope { key: string | undefined }
interface ToastRecord extends ToastOptions { id: string; scope: ToastScope; fallback: HTMLElement | null }
const ToastContext = createContext<ToastApi | null>(null);
const toneIcons = { success: CircleCheckIcon, info: InfoIcon, warning: TriangleAlertIcon, error: CircleAlertIcon };

function focusIfAvailable(target: HTMLElement | null) {
  if (target?.isConnected && !target.matches(":disabled,[inert],[aria-hidden='true']") && !target.closest("[inert],[aria-hidden='true']")) target.focus({ preventScroll: true });
}

function ToastNotice({ notice, dismiss, dismissLabel, viewport, container }: { notice: ToastRecord; dismiss: (id: string) => void; dismissLabel: string; viewport: HTMLOListElement | null; container: HTMLElement }) {
  const root = useRef<HTMLLIElement>(null);
  const fallback = notice.returnFocusTo ?? notice.fallback;
  useLayoutEffect(() => {
    const node = root.current;
    return () => {
      if (node?.contains(document.activeElement)) focusIfAvailable(fallback);
    };
  }, [fallback]);
  const tone = notice.tone ?? "info";
  const Icon = toneIcons[tone];
  const inheritedDuration = Number.parseFloat(foundation.feedback.toastDuration[tone]);
  const duration = notice.duration === Infinity || (Number.isFinite(notice.duration) && (notice.duration ?? 0) > 0) ? notice.duration : inheritedDuration;
  return <ToastPrimitive.Root ref={root} className="pk-toast" data-tone={tone} duration={duration} open onOpenChange={open => {
    if (open) return;
    // Radix first moves a focused closing toast to its viewport; restore the host destination.
    if (root.current?.contains(document.activeElement) || document.activeElement === viewport) focusIfAvailable(fallback);
    dismiss(notice.id);
  }}>
    <span className="pk-toast-icon" aria-hidden="true"><Icon size="sm" /></span>
    <div className="pk-toast-content"><ToastPrimitive.Title className="pk-toast-title">{notice.title}</ToastPrimitive.Title>{notice.description ? <ToastPrimitive.Description className="pk-toast-description">{notice.description}</ToastPrimitive.Description> : null}
      {notice.action && !notice.action.icon ? <ToastPrimitive.Action asChild altText={notice.action.altText}><Button className="pk-toast-text-action" size="sm" variant="outline" onClick={notice.action.onClick}>{notice.action.label}</Button></ToastPrimitive.Action> : null}
    </div>
    <div className="pk-toast-actions">
      {notice.action?.icon ? <Tooltip>
        <TooltipTrigger asChild><ToastPrimitive.Action asChild altText={notice.action.altText}><Button size="xs" variant="ghost" shape="icon" aria-label={notice.action.label} onClick={notice.action.onClick}>{notice.action.icon}</Button></ToastPrimitive.Action></TooltipTrigger>
        <TooltipContent container={container}>{notice.action.label}</TooltipContent>
      </Tooltip> : null}
      <Tooltip><TooltipTrigger asChild><ToastPrimitive.Close asChild><Button className="pk-toast-dismiss" size="xs" variant="ghost" shape="icon" aria-label={dismissLabel}><XIcon size="sm" /></Button></ToastPrimitive.Close></TooltipTrigger><TooltipContent container={container}>{dismissLabel}</TooltipContent></Tooltip>
    </div>
  </ToastPrimitive.Root>;
}

export function ToastProvider({ children, scopeKey, container, label = "Notification", viewportLabel = "Notifications ({hotkey})", dismissLabel = "Dismiss notification", dir }: ToastProviderProps) {
  const [notices, setNotices] = useState<ToastRecord[]>([]);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [viewport, setViewport] = useState<HTMLOListElement | null>(null);
  const sequence = useRef(0);
  const prefix = useId();
  const scope = useMemo(() => ({ key: scopeKey }), [scopeKey, container]);
  const currentScope = useRef(scope);
  const mounted = useRef(true);
  useLayoutEffect(() => {
    currentScope.current = scope;
    setNotices(previous => previous.filter(item => item.scope === scope));
  }, [scope]);
  useEffect(() => {
    mounted.current = true;
    setHost(container ?? document.body);
    return () => { mounted.current = false; };
  }, [container]);
  const dismiss = useCallback((id: string) => setNotices(previous => previous.filter(item => item.id !== id)), []);
  const clear = useCallback(() => setNotices([]), []);
  const toast = useCallback((options: ToastOptions) => {
    if (!mounted.current || currentScope.current !== scope) return null;
    const id = `${prefix}-${++sequence.current}`;
    const active = document.activeElement;
    const fallback = active instanceof HTMLElement && active !== document.body ? active : null;
    setNotices(previous => [...previous.filter(item => item.scope === scope).slice(-2), { ...options, id, scope, fallback }]);
    return id;
  }, [prefix, scope]);
  const api = useMemo(() => ({ toast, dismiss, clear }), [toast, dismiss, clear]);
  return <ToastContext.Provider value={api}><ToastPrimitive.Provider label={label} {...(container ? { announcerContainer: container } : {})} swipeDirection={dir === "rtl" ? "left" : "right"}>
    {children}
    {host ? createPortal(<TooltipProvider><div className="pk-toast-stack" dir={dir}>{notices.filter(notice => notice.scope === scope).map(notice => <ToastNotice key={notice.id} notice={notice} dismiss={dismiss} dismissLabel={dismissLabel} viewport={viewport} container={host} />)}<ToastPrimitive.Viewport ref={setViewport} className="pk-toast-viewport" label={viewportLabel} /></div></TooltipProvider>, host) : null}
  </ToastPrimitive.Provider></ToastContext.Provider>;
}

export function useToast(): ToastApi {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within ToastProvider.");
  return value;
}

export interface AccountMenuLink { id: string; label: string; href: string; disabled?: boolean }
export interface AccountMenuLabels {
  trigger: string;
  appearance: string;
  light: string;
  dark: string;
  system: string;
  signOut: string;
  signingOut: string;
}
export interface AccountMenuProps {
  name: string;
  description?: string;
  links: readonly AccountMenuLink[];
  appearance?: { value: "light" | "dark" | "system"; onValueChange: (value: "light" | "dark" | "system") => void };
  onSignOut?: () => void;
  signOutPending?: boolean;
  signOutError?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: "ltr" | "rtl";
  labels?: Partial<AccountMenuLabels>;
}

export function AccountMenu({ name, description, links, appearance, onSignOut, signOutPending = false, signOutError, open, defaultOpen, onOpenChange, dir, labels }: AccountMenuProps) {
  const text: AccountMenuLabels = { trigger: `Open account menu for ${name}`, appearance: "Appearance", light: "Light", dark: "Dark", system: "System", signOut: "Sign out", signingOut: "Signing out…", ...labels };
  const content = useRef<HTMLDivElement>(null);
  const signOut = useRef<HTMLDivElement>(null);
  const errorId = useId();
  const appearanceId = useId();
  useLayoutEffect(() => {
    if (signOutPending && signOut.current?.contains(document.activeElement)) content.current?.focus({ preventScroll: true });
  }, [signOutPending]);
  return <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} dir={dir}>
    <DropdownMenuTrigger asChild><Button className="pk-account-trigger" variant="ghost" dir={dir} aria-label={text.trigger}><Avatar name={name} size="sm" decorative /><span className="pk-account-identity"><span className="pk-account-name">{name}</span>{description ? <span className="pk-account-description">{description}</span> : null}</span><span className="pk-account-chevron" aria-hidden="true"><ChevronDownIcon size="sm" /></span></Button></DropdownMenuTrigger>
    <DropdownMenuContent ref={content} className="pk-account-menu" align="end" aria-busy={signOutPending || undefined} onFocus={event => {
      // Keep pending focus on the surface instead of Radix re-entering the disabling item.
      if (signOutPending && event.target === event.currentTarget) event.preventDefault();
    }}>
      <DropdownMenuLabel className="pk-account-header"><Avatar name={name} decorative /><span className="pk-account-identity"><span className="pk-account-name">{name}</span>{description ? <span className="pk-account-description">{description}</span> : null}</span></DropdownMenuLabel>
      {links.length > 0 ? <><DropdownMenuSeparator /><DropdownMenuGroup>{links.map(link => link.disabled ? <DropdownMenuItem key={link.id} disabled>{link.label}</DropdownMenuItem> : <DropdownMenuItem key={link.id} asChild><a href={link.href}>{link.label}</a></DropdownMenuItem>)}</DropdownMenuGroup></> : null}
      {appearance ? <><DropdownMenuSeparator /><DropdownMenuLabel id={appearanceId}>{text.appearance}</DropdownMenuLabel><DropdownMenuRadioGroup aria-labelledby={appearanceId} value={appearance.value} onValueChange={value => { if (value === "light" || value === "dark" || value === "system") appearance.onValueChange(value); }}>
        {(["light", "dark", "system"] as const).map(value => {
          const Icon = { light: SunIcon, dark: MoonIcon, system: SettingsIcon }[value];
          return <DropdownMenuRadioItem key={value} value={value} onSelect={event => event.preventDefault()}><span className="pk-account-option-label"><Icon size="sm" /><span>{text[value]}</span></span></DropdownMenuRadioItem>;
        })}
      </DropdownMenuRadioGroup></> : null}
      {onSignOut || signOutError ? <><DropdownMenuSeparator /><DropdownMenuGroup>
        {onSignOut ? <DropdownMenuItem ref={signOut} destructive disabled={signOutPending} aria-describedby={signOutError ? errorId : undefined} onSelect={event => { event.preventDefault(); onSignOut(); }}><span className="pk-account-action-icon" aria-hidden="true">{signOutPending ? <Spinner size="sm" aria-hidden="true" /> : <LogOutIcon size="sm" />}</span><span className="pk-menu-item-text">{signOutPending ? text.signingOut : text.signOut}</span></DropdownMenuItem> : null}
        {signOutError ? <div id={errorId} className="pk-account-error" role="alert"><CircleAlertIcon size="sm" /><div>{signOutError}</div></div> : null}
      </DropdownMenuGroup></> : null}
    </DropdownMenuContent>
  </DropdownMenu>;
}
