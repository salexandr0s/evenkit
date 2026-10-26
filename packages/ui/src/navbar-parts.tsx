"use client";

import { forwardRef, useId, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from "react";
import { foundation } from "@evenkit/tokens";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { ArrowRightIcon, UserIcon } from "./icons.js";
import type { NavigationLinkProps } from "./navigation.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./overlays.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

export type NavbarAction = { label: string; href: string; onSelect?: () => void } | { label: string; href?: never; onSelect: () => void };
export type NavbarAccountItem = NavbarAction & { id: string; disabled?: boolean; destructive?: boolean };
export type NavbarAccount = (NavbarAction & { icon?: ReactNode }) | {
  label: string;
  name: string;
  description?: string;
  items: readonly NavbarAccountItem[];
  icon?: ReactNode;
};

export interface NavbarBrandProps extends ComponentPropsWithoutRef<"a"> {
  logo?: ReactNode;
  description?: ReactNode;
}

export const NavbarBrand = forwardRef<HTMLAnchorElement, NavbarBrandProps>(function NavbarBrand(
  { logo, description, children, className, ...props }, ref,
) {
  return <a {...props} ref={ref} className={classes("pk-navbar-brand-link", className)}>
    {logo ? <span className="pk-navbar-brand-logo" aria-hidden="true">{logo}</span> : null}
    <span className="pk-navbar-brand-copy"><span className="pk-navbar-brand-name">{children}</span>{description ? <span className="pk-navbar-brand-description">{description}</span> : null}</span>
  </a>;
});

export function ordinaryNavbarActivation(event: MouseEvent<HTMLAnchorElement>) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.currentTarget.hasAttribute("download") && (!event.currentTarget.target || event.currentTarget.target === "_self");
}

interface ActionControlProps {
  action: NavbarAction;
  renderLink?: ((props: NavigationLinkProps) => ReactNode) | undefined;
  icon?: ReactNode;
  iconOnly?: boolean;
  descriptionId?: string | undefined;
  onActivate?: (callback?: () => void) => void;
}

export function NavbarActionControl({ action, renderLink, iconOnly = false, icon, descriptionId, onActivate }: ActionControlProps) {
  const activate = () => { if (onActivate) onActivate(action.onSelect); else action.onSelect?.(); };
  const content = iconOnly ? icon ?? <UserIcon /> : <><span>{action.label}</span><ArrowRightIcon size="sm" /></>;
  const className = iconOnly ? "pk-navbar-account-control" : "pk-navbar-contact-action";
  if (action.href !== undefined) {
    const appearance = { "data-variant": iconOnly ? "outline" : "primary", "data-size": "md", "data-shape": iconOnly ? "icon" : "default" };
    const linkProps: NavigationLinkProps = {
      ...appearance, href: action.href, className: classes("pk-button", className),
      "aria-label": iconOnly ? action.label : undefined,
      "aria-describedby": descriptionId,
      children: content,
      onClick: event => {
        if (ordinaryNavbarActivation(event)) { action.onSelect?.(); onActivate?.(); }
      },
    };
    return renderLink ? renderLink(linkProps) : <a {...linkProps} />;
  }
  return <Button variant={iconOnly ? "outline" : "primary"} shape={iconOnly ? "icon" : "default"} aria-label={iconOnly ? action.label : undefined} aria-describedby={descriptionId} className={className} onClick={activate}>{content}</Button>;
}

export function NavbarAccountControl({ account, renderLink, dir }: { account: NavbarAccount; renderLink?: ((props: NavigationLinkProps) => ReactNode) | undefined; dir?: "ltr" | "rtl" }) {
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipId = useId();
  const descriptionId = tooltipOpen && !open ? tooltipId : undefined;
  const pendingAction = useRef<(() => void) | undefined>(undefined);
  const trigger = useRef<HTMLButtonElement>(null);
  const wrapper = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const ownedFocus = useRef(false);
  useLayoutEffect(() => {
    if (!("items" in account)) setOpen(false);
    if (ownedFocus.current && document.activeElement === document.body) wrapper.current?.querySelector<HTMLElement>(".pk-navbar-account-control")?.focus({ preventScroll: true });
  }, [account]);
  // Anchor to the existing wrapper so custom links need no additional ref contract.
  // Focus from its actual button or link bubbles to the tooltip trigger.
  return <TooltipProvider><Tooltip open={tooltipOpen && !open} onOpenChange={setTooltipOpen}><TooltipTrigger asChild><span ref={wrapper} className="pk-navbar-account-wrapper" onFocusCapture={event => {
    if (event.currentTarget.contains(event.target) || menu.current?.contains(event.target)) ownedFocus.current = true;
  }} onBlurCapture={event => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) && !menu.current?.contains(event.relatedTarget)) ownedFocus.current = false;
  }}>{!("items" in account) ? <NavbarActionControl action={account} renderLink={renderLink} iconOnly icon={account.icon} descriptionId={descriptionId} /> : <DropdownMenu open={open} onOpenChange={setOpen} dir={dir}>
    <DropdownMenuTrigger asChild><Button ref={trigger} variant="outline" shape="icon" className="pk-navbar-account-control" aria-label={account.label} aria-describedby={descriptionId}>{account.icon ?? <UserIcon />}</Button></DropdownMenuTrigger>
    <DropdownMenuContent ref={menu} align="end" sideOffset={Number.parseFloat(foundation.space["6"])} className="pk-navbar-account-menu" onCloseAutoFocus={event => {
      if (pendingAction.current) {
        event.preventDefault();
        trigger.current?.focus({ preventScroll: true });
        const callback = pendingAction.current;
        pendingAction.current = undefined;
        queueMicrotask(callback);
      }
    }}>
      <DropdownMenuLabel><span className="pk-navbar-account-name">{account.name}</span>{account.description ? <span className="pk-navbar-account-description">{account.description}</span> : null}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {account.items.map(item => {
        if (item.disabled) return <DropdownMenuItem key={item.id} disabled>{item.label}</DropdownMenuItem>;
        if (item.href !== undefined) {
          const linkProps: NavigationLinkProps = {
            href: item.href, className: "pk-navbar-account-link", children: item.label,
            onClick: event => {
              if (ordinaryNavbarActivation(event)) { item.onSelect?.(); setOpen(false); }
            },
          };
          return <DropdownMenuItem key={item.id} asChild destructive={!!item.destructive} onSelect={event => event.preventDefault()}>{renderLink ? renderLink(linkProps) : <a {...linkProps} />}</DropdownMenuItem>;
        }
        return <DropdownMenuItem key={item.id} destructive={!!item.destructive} onSelect={() => { pendingAction.current = item.onSelect; }}>{item.label}</DropdownMenuItem>;
      })}
    </DropdownMenuContent>
  </DropdownMenu>}</span></TooltipTrigger><TooltipContent id={tooltipId}>{account.label}</TooltipContent></Tooltip></TooltipProvider>;
}
