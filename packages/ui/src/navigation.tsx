"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { foundation } from "@project-kit/tokens";
import { forwardRef, useLayoutEffect, useRef, useState, type AnchorHTMLAttributes, type ComponentPropsWithoutRef, type ComponentRef, type FocusEvent, type MouseEvent, type ReactNode, type Ref } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog.js";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, MenuIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

export interface TabsProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: "underline" | "pills";
  size?: "sm" | "md";
}

export const Tabs = forwardRef<ComponentRef<typeof TabsPrimitive.Root>, TabsProps>(function Tabs(
  { className, variant = "underline", size = "md", ...props }, ref,
) {
  return <TabsPrimitive.Root {...props} ref={ref} className={classes("pk-tabs", className)} data-variant={variant} data-size={size} />;
});

export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>;
export const TabsList = forwardRef<ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(function TabsList({ className, ...props }, ref) {
  return <TabsPrimitive.List {...props} ref={ref} className={classes("pk-tabs-list", className)} />;
});
export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;
export const TabsTrigger = forwardRef<ComponentRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(function TabsTrigger({ className, ...props }, ref) {
  return <TabsPrimitive.Trigger {...props} ref={ref} className={classes("pk-tabs-trigger", className)} />;
});
export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;
export const TabsContent = forwardRef<ComponentRef<typeof TabsPrimitive.Content>, TabsContentProps>(function TabsContent({ className, ...props }, ref) {
  return <TabsPrimitive.Content {...props} ref={ref} className={classes("pk-tabs-content", className)} />;
});

export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;
export const Accordion = forwardRef<ComponentRef<typeof AccordionPrimitive.Root>, AccordionProps>(function Accordion({ className, ...props }, ref) {
  return <AccordionPrimitive.Root {...props} ref={ref} className={classes("pk-accordion", className)} />;
});
export type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;
export const AccordionItem = forwardRef<ComponentRef<typeof AccordionPrimitive.Item>, AccordionItemProps>(function AccordionItem({ className, ...props }, ref) {
  return <AccordionPrimitive.Item {...props} ref={ref} className={classes("pk-accordion-item", className)} />;
});
export type AccordionHeaderProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>;
export const AccordionHeader = forwardRef<ComponentRef<typeof AccordionPrimitive.Header>, AccordionHeaderProps>(function AccordionHeader({ className, ...props }, ref) {
  return <AccordionPrimitive.Header {...props} ref={ref} className={classes("pk-accordion-header", className)} />;
});
export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;
export const AccordionTrigger = forwardRef<ComponentRef<typeof AccordionPrimitive.Trigger>, AccordionTriggerProps>(function AccordionTrigger({ className, children, asChild, ...props }, ref) {
  return <AccordionPrimitive.Trigger {...props} asChild={asChild} ref={ref} className={classes("pk-accordion-trigger", className)}>{asChild ? children : <><span>{children}</span><ChevronDownIcon size="sm" /></>}</AccordionPrimitive.Trigger>;
});
export type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;
export const AccordionContent = forwardRef<ComponentRef<typeof AccordionPrimitive.Content>, AccordionContentProps>(function AccordionContent({ className, ...props }, ref) {
  return <AccordionPrimitive.Content {...props} ref={ref} className={classes("pk-accordion-content", className)} />;
});

export type CollapsibleProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>;
export const Collapsible = forwardRef<ComponentRef<typeof CollapsiblePrimitive.Root>, CollapsibleProps>(function Collapsible({ className, ...props }, ref) {
  return <CollapsiblePrimitive.Root {...props} ref={ref} className={classes("pk-collapsible", className)} />;
});
export type CollapsibleTriggerProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>;
export const CollapsibleTrigger = forwardRef<ComponentRef<typeof CollapsiblePrimitive.Trigger>, CollapsibleTriggerProps>(function CollapsibleTrigger({ className, children, asChild, ...props }, ref) {
  return <CollapsiblePrimitive.Trigger {...props} asChild={asChild} ref={ref} className={classes("pk-collapsible-trigger", className)}>{asChild ? children : <><span>{children}</span><ChevronDownIcon size="sm" className="pk-collapsible-chevron" /></>}</CollapsiblePrimitive.Trigger>;
});
export type CollapsibleContentProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>;
export const CollapsibleContent = forwardRef<ComponentRef<typeof CollapsiblePrimitive.Content>, CollapsibleContentProps>(function CollapsibleContent({ className, ...props }, ref) {
  return <CollapsiblePrimitive.Content {...props} ref={ref} className={classes("pk-collapsible-content", className)} />;
});

export interface NavigationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className: string;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
}

export interface BreadcrumbItem {
  id: string;
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  items: readonly BreadcrumbItem[];
  label?: string;
  renderLink?: (props: NavigationLinkProps) => ReactNode;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, label = "Breadcrumb", renderLink, className, ...props }, ref,
) {
  return <nav aria-label={label} {...props} ref={ref} className={classes("pk-breadcrumbs", className)}><ol role="list">
    {items.map((item, index) => {
      const current = index === items.length - 1;
      const linkProps: NavigationLinkProps = { href: item.href ?? "", className: "pk-breadcrumb-link", children: item.label };
      return <li key={item.id}>
        {index > 0 ? <span className="pk-breadcrumb-separator" aria-hidden="true"><ChevronRightIcon size="sm" /></span> : null}
        {current ? <span aria-current="page" className="pk-breadcrumb-current">{item.label}</span> : item.href ? renderLink ? renderLink(linkProps) : <a {...linkProps} /> : <span>{item.label}</span>}
      </li>;
    })}
  </ol></nav>;
});

export interface NavbarItem {
  id: string;
  label: string;
  href: string;
  disabled?: boolean;
}

export interface NavbarProps extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
  brand: ReactNode;
  items: readonly NavbarItem[];
  activeItemId?: string;
  actions?: ReactNode;
  contentId?: string;
  skipLabel?: string;
  navLabel?: string;
  menuLabel?: string;
  closeMenuLabel?: string;
  menuDescription?: string;
  renderLink?: (props: NavigationLinkProps) => ReactNode;
}

function ordinaryActivation(event: MouseEvent<HTMLAnchorElement>) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.hasAttribute("download") && (!event.currentTarget.target || event.currentTarget.target === "_self");
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { brand, items, activeItemId, actions, contentId, skipLabel = "Skip to content", navLabel = "Primary", menuLabel = "Open navigation", closeMenuLabel = "Close navigation", menuDescription = "Choose a destination.", renderLink, className, dir, ...props }, forwardedRef,
) {
  const rootRef = useRef<HTMLElement | null>(null);
  const desktopRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const compactRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;
  const resizeClose = useRef(false);
  // CSS can blur a hidden control before ResizeObserver runs. Retain only
  // navbar-owned focus intent; deliberate moves to other controls clear it.
  const desktopFocus = useRef<HTMLElement | null>(null);
  const menuFocus = useRef(false);

  function restoreMenuFocus() {
    const active = document.activeElement;
    const lostDesktopFocus = active === document.body && desktopFocus.current && desktopFocus.current.getClientRects().length === 0;
    const trigger = triggerRef.current;
    if (trigger && trigger.getClientRects().length > 0 && (desktopRef.current?.contains(active) || lostDesktopFocus)) {
      desktopFocus.current = null;
      trigger.focus({ preventScroll: true });
    } else if (active !== document.body) desktopFocus.current = null;
  }

  function desktopBlur(event: FocusEvent<HTMLElement>) {
    if (event.relatedTarget !== null || event.target.getClientRects().length > 0) desktopFocus.current = null;
    else restoreMenuFocus();
  }

  function menuBlur(event: FocusEvent<HTMLButtonElement>) {
    if (event.relatedTarget !== null || event.target.getClientRects().length > 0) menuFocus.current = false;
    else if (document.activeElement === document.body && desktopRef.current?.getClientRects().length) {
      menuFocus.current = false;
      focusDesktop();
    }
  }

  function focusDesktop() {
    const root = rootRef.current;
    if (!root) return;
    const candidates = [
      desktopRef.current?.querySelector<HTMLElement>('[aria-current="page"]:not([aria-disabled="true"])'),
      ...root.querySelectorAll<HTMLElement>('.pk-navbar-desktop a[href], .pk-navbar-brand a[href], .pk-navbar-brand button, .pk-navbar-actions a[href], .pk-navbar-actions button, .pk-navbar-actions input, .pk-navbar-actions select, .pk-navbar-actions textarea, .pk-navbar-actions [tabindex]:not([tabindex="-1"])'),
      root,
    ];
    candidates.find(candidate => candidate && candidate.getClientRects().length > 0 && !candidate.matches(':disabled, [aria-disabled="true"]'))?.focus({ preventScroll: true });
  }

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const update = () => {
      const compact = root.clientWidth < Number.parseFloat(foundation.breakpoint.md);
      const previous = compactRef.current;
      compactRef.current = compact;
      if (!compact && openRef.current) {
        resizeClose.current = true;
        setOpen(false);
      } else if (compact && !previous && (desktopRef.current?.contains(document.activeElement) || (desktopFocus.current && document.activeElement === document.body))) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(restoreMenuFocus);
      } else if (!compact && previous && (document.activeElement === triggerRef.current || (menuFocus.current && document.activeElement === document.body))) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (document.activeElement === triggerRef.current || (menuFocus.current && document.activeElement === document.body)) focusDesktop();
          menuFocus.current = false;
        });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  function renderItems(mobile: boolean) {
    return <ul role="list" className="pk-navbar-list">{items.map(item => {
      if (item.disabled) return <li key={item.id}><span role="link" aria-disabled="true" className="pk-navbar-link">{item.label}</span></li>;
      const linkProps: NavigationLinkProps = {
        href: item.href, className: "pk-navbar-link", children: item.label,
        ...(activeItemId === item.id ? { "aria-current": "page" as const } : {}),
        onClick: event => {
          if (mobile && ordinaryActivation(event)) setOpen(false);
        },
      };
      return <li key={item.id}>{renderLink ? renderLink(linkProps) : <a {...linkProps} />}</li>;
    })}</ul>;
  }

  return <header {...props} tabIndex={props.tabIndex ?? -1} dir={dir} className={classes("pk-navbar", className)} ref={node => {
    rootRef.current = node;
    if (typeof forwardedRef === "function") return forwardedRef(node);
    if (forwardedRef) forwardedRef.current = node;
  }}>
    {contentId ? <a className="pk-navbar-skip" href={`#${contentId}`} onClick={() => document.getElementById(contentId)?.focus({ preventScroll: false })}>{skipLabel}</a> : null}
    <div className="pk-navbar-inner">
      <div className="pk-navbar-brand">{brand}</div>
      <nav ref={desktopRef} className="pk-navbar-desktop" aria-label={navLabel} onFocusCapture={event => { desktopFocus.current = event.target; }} onBlurCapture={desktopBlur}>{renderItems(false)}</nav>
      {actions ? <div className="pk-navbar-actions">{actions}</div> : null}
      <Dialog open={open} onOpenChange={next => { resizeClose.current = false; setOpen(next); }}>
        <DialogTrigger asChild><Button ref={triggerRef} className="pk-navbar-mobile-trigger" variant="ghost" shape="icon" aria-label={menuLabel} onFocusCapture={() => { menuFocus.current = true; }} onBlurCapture={menuBlur}><MenuIcon /></Button></DialogTrigger>
        <DialogContent dir={dir} className="pk-navbar-drawer" closeLabel={closeMenuLabel} onCloseAutoFocus={event => {
          if (resizeClose.current || !compactRef.current) { event.preventDefault(); resizeClose.current = false; focusDesktop(); }
        }}>
          <DialogTitle>{navLabel}</DialogTitle><DialogDescription>{menuDescription}</DialogDescription>
          <nav aria-label={navLabel}>{renderItems(true)}</nav>
        </DialogContent>
      </Dialog>
    </div>
  </header>;
});

export interface PaginationPageLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  page: number;
  className: string;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
}

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<"nav">, "children" | "onChange"> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  busy?: boolean;
  compact?: boolean;
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  pageLabel?: (page: number) => string;
  showStatus?: boolean;
  statusText?: ReactNode;
  renderPageLink?: (props: PaginationPageLinkProps) => ReactNode;
}

function pageChoices(page: number, count: number): readonly (number | string)[] {
  const choices = [...new Set([1, page - 1, page, page + 1, count].filter(value => value >= 1 && value <= count))].sort((a, b) => a - b);
  return choices.flatMap((value, index) => {
    const previous = choices[index - 1];
    return previous !== undefined && value - previous > 1 ? [`gap-${previous}`, value] : [value];
  });
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, pageCount, onPageChange, disabled = false, busy = false, compact = false, label = "Pagination", previousLabel = "Previous page", nextLabel = "Next page", pageLabel = value => `Page ${value}`, showStatus = true, statusText, renderPageLink, className, ...props }, ref,
) {
  const count = Number.isFinite(pageCount) ? Math.max(0, Math.floor(pageCount)) : 0;
  const current = count === 0 ? 0 : Math.min(count, Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1));
  const blocked = disabled || busy || count === 0;

  function pageControl(target: number, children: ReactNode, accessibleLabel: string, unavailable: boolean, selected = false) {
    const ariaCurrent = selected ? "page" as const : undefined;
    const activate = () => { if (!unavailable && target !== current) onPageChange(target); };
    const control = renderPageLink && !unavailable
      ? renderPageLink({ page: target, className: "pk-pagination-link", "aria-label": accessibleLabel, "aria-current": ariaCurrent, children, onClick: event => { if (ordinaryActivation(event)) activate(); } })
      : <Button size="sm" variant={selected ? "secondary" : "ghost"} className="pk-pagination-button" aria-label={accessibleLabel} aria-current={ariaCurrent} disabled={unavailable} onClick={activate}>{children}</Button>;
    return compact ? <Tooltip><TooltipTrigger asChild>{control}</TooltipTrigger><TooltipContent>{accessibleLabel}</TooltipContent></Tooltip> : control;
  }

  return <TooltipProvider><nav aria-label={label} {...props} ref={ref} aria-busy={busy || props["aria-busy"]} className={classes("pk-pagination", className)} data-compact={compact || undefined}>
    {showStatus ? <span className="pk-pagination-status" role="status">{statusText ?? `Page ${current} of ${count}`}</span> : null}
    <div className="pk-pagination-controls">
      {!compact && count > 0 ? <div className="pk-pagination-pages">{pageChoices(current, count).map(choice => <span key={choice} className="pk-pagination-choice" data-gap={typeof choice === "string" || undefined}>{typeof choice === "number" ? pageControl(choice, choice, pageLabel(choice), blocked, choice === current) : <span className="pk-pagination-gap" aria-hidden="true">…</span>}</span>)}</div> : null}
      <div className="pk-pagination-navigation">
        {pageControl(Math.max(1, current - 1), <><ChevronLeftIcon size="sm" /><span>{previousLabel}</span></>, previousLabel, blocked || current <= 1)}
        {pageControl(Math.min(count, current + 1), <><span>{nextLabel}</span><ChevronRightIcon size="sm" /></>, nextLabel, blocked || current >= count)}
      </div>
    </div>
  </nav></TooltipProvider>;
});
