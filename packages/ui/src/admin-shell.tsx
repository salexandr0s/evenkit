"use client";

import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, type AnchorHTMLAttributes, type FocusEvent, type MouseEventHandler, type ReactNode, type Ref } from "react";
import { foundation } from "@project-kit/tokens";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog.js";
import { CircleIcon, LayoutDashboardIcon, MenuIcon, PanelLeftCloseIcon, PanelLeftIcon, PanelLeftOpenIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

export type AdminSidebarState = "expanded" | "collapsed" | "hidden";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  end?: ReactNode;
}

export interface AdminNavGroup {
  label?: string;
  items: readonly AdminNavItem[];
}

export interface AdminLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className: string;
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
}

export interface AdminShellProps {
  brand: ReactNode;
  compactBrand?: ReactNode;
  navigation: readonly AdminNavGroup[];
  header: ReactNode;
  children: ReactNode;
  activeItemId?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  compactFooter?: ReactNode;
  sidebarState?: AdminSidebarState;
  defaultSidebarState?: AdminSidebarState;
  onSidebarStateChange?: (state: AdminSidebarState) => void;
  contentId?: string;
  navLabel?: string;
  className?: string;
  contentAs?: "main" | "section";
  renderLink?: (props: AdminLinkProps) => ReactNode;
}

interface NavigationProps {
  groups: readonly AdminNavGroup[];
  activeItemId: string | undefined;
  label: string;
  renderLink: ((props: AdminLinkProps) => ReactNode) | undefined;
  onNavigate?: () => void;
  collapsed?: boolean;
  tooltipsEnabled?: boolean;
}

interface NavLinkProps extends Omit<AdminLinkProps, "ref"> {
  renderLink: AdminShellProps["renderLink"];
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ renderLink, ...props }, ref) {
  return renderLink ? renderLink({ ...props, ref }) : <a {...props} ref={ref} />;
});

function Navigation({ groups, activeItemId, label, renderLink, onNavigate, collapsed = false, tooltipsEnabled = true }: NavigationProps) {
  const navigationRef = useRef<HTMLElement>(null);
  const [tooltipSide, setTooltipSide] = useState<"left" | "right">("right");
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const navigate: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onNavigate?.();
  };

  useEffect(() => {
    // A new desktop focus can arrive before the observer's width update commits.
    if (!collapsed || (!tooltipsEnabled && navigationRef.current?.getClientRects().length === 0)) setOpenItemId(null);
  }, [collapsed, tooltipsEnabled]);

  function changeTooltipOpen(itemId: string, open: boolean) {
    if (!collapsed || (open && navigationRef.current?.getClientRects().length === 0)) return;
    if (open && navigationRef.current) setTooltipSide(window.getComputedStyle(navigationRef.current).direction === "rtl" ? "left" : "right");
    setOpenItemId((current) => open ? itemId : current === itemId ? null : current);
  }

  return (
    <nav ref={navigationRef} className="pk-admin-navigation" aria-label={label}>
      {groups.map((group, index) => (
        <div className="pk-admin-nav-group" key={index}>
          {group.label ? <p className="pk-admin-nav-label">{group.label}</p> : null}
          <ul className="pk-admin-nav-list" role="list">
            {group.items.map((item) => {
              const linkProps: AdminLinkProps = {
                href: item.href,
                className: "pk-admin-nav-link",
                "aria-label": item.label,
                ...(item.id === activeItemId ? { "aria-current": "page" as const } : {}),
                onClick: navigate,
                children: <><span className="pk-admin-nav-icon" aria-hidden="true">{item.icon ?? <CircleIcon />}</span><span className="pk-admin-nav-text">{item.label}</span>{item.end !== undefined && item.end !== null ? <span className="pk-admin-nav-end">{item.end}</span> : null}</>,
              };
              return <li key={item.id}><Tooltip open={collapsed && tooltipsEnabled && openItemId === item.id} onOpenChange={(open) => changeTooltipOpen(item.id, open)}><TooltipTrigger asChild><NavLink {...linkProps} renderLink={renderLink} /></TooltipTrigger>{collapsed && tooltipsEnabled ? <TooltipContent side={tooltipSide}>{item.label}</TooltipContent> : null}</Tooltip></li>;
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ brand, compactBrand, navigation, header, children, activeItemId, actions, footer, compactFooter, sidebarState: controlledSidebarState, defaultSidebarState = "expanded", onSidebarStateChange, contentId, navLabel = "Main navigation", className, contentAs: Content = "main", renderLink }: AdminShellProps) {
  const generatedId = useId();
  const mainId = contentId ?? `pk-admin-content-${generatedId}`;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wideLayout, setWideLayout] = useState(true);
  const [openControl, setOpenControl] = useState<AdminSidebarState | null>(null);
  const [internalSidebarState, setInternalSidebarState] = useState(defaultSidebarState);
  const sidebarState = controlledSidebarState ?? internalSidebarState;
  const shellRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  function changeSidebarState(nextState: AdminSidebarState) {
    if (controlledSidebarState === undefined) setInternalSidebarState(nextState);
    onSidebarStateChange?.(nextState);
  }

  function changeControlTooltip(state: AdminSidebarState, open: boolean) {
    if (open && expandRef.current?.getClientRects().length === 0) return;
    setOpenControl((current) => open ? state : current === state ? null : current);
  }

  function restoreMobileFocus(event: FocusEvent<HTMLElement>) {
    const menu = menuRef.current;
    // CSS can hide the focused desktop control before ResizeObserver runs.
    if (event.relatedTarget === null && event.target.getClientRects().length === 0 && menu && menu.getClientRects().length > 0) menu.focus();
  }

  useLayoutEffect(() => {
    if (sidebarState !== "hidden" || !sidebarRef.current?.contains(document.activeElement)) return;
    const restore = expandRef.current;
    if (restore && restore.getClientRects().length > 0) restore.focus();
    else contentRef.current?.focus();
  }, [sidebarState]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const breakpoint = Number.parseFloat(foundation.breakpoint.md);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const wide = entry.contentRect.width > breakpoint;
      setWideLayout(wide);
      if (wide) setDrawerOpen(false);
      else if (expandRef.current?.getClientRects().length === 0) setOpenControl(null);
    });
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  const navProps: NavigationProps = { groups: navigation, activeItemId, label: navLabel, renderLink };

  return (
    <TooltipProvider><div className={classes("pk-admin-shell", className)} ref={shellRef}>
      <a className="pk-admin-skip" href={`#${mainId}`}>Skip to main content</a>
      <div className="pk-admin-frame" data-sidebar-state={sidebarState}>
        <aside ref={sidebarRef} onBlurCapture={restoreMobileFocus} className="pk-admin-sidebar" data-sidebar-state={sidebarState} aria-label="Application sidebar">
          <div className="pk-admin-brand"><div className="pk-admin-full-brand">{brand}</div><div className="pk-admin-compact-brand">{compactBrand ?? <LayoutDashboardIcon />}</div></div>
          <Navigation {...navProps} collapsed={sidebarState === "collapsed"} tooltipsEnabled={wideLayout} />
          {footer ? <div className="pk-admin-sidebar-footer pk-admin-full-footer">{footer}</div> : null}
          {compactFooter ? <div className="pk-admin-sidebar-footer pk-admin-compact-footer">{compactFooter}</div> : null}
        </aside>
        <div className="pk-admin-workspace">
          <header className="pk-admin-header">
            <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DialogTrigger asChild>
                <Button ref={menuRef} variant="ghost" shape="icon" className="pk-admin-menu" aria-label="Open navigation">
                  <MenuIcon />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="pk-admin-drawer"
                closeLabel="Close navigation"
                onCloseAutoFocus={(event) => {
                  if (menuRef.current && window.getComputedStyle(menuRef.current).display === "none") {
                    event.preventDefault();
                    contentRef.current?.focus();
                  }
                }}
              >
                <DialogTitle className="pk-admin-drawer-title">{navLabel}</DialogTitle>
                <DialogDescription className="pk-admin-visually-hidden">Choose a page in this application.</DialogDescription>
                <div className="pk-admin-brand pk-admin-drawer-brand">{brand}</div>
                <Navigation {...navProps} onNavigate={() => setDrawerOpen(false)} />
                {footer ? <div className="pk-admin-sidebar-footer">{footer}</div> : null}
              </DialogContent>
            </Dialog>
            <div className="pk-admin-sidebar-controls" role="group" aria-label="Sidebar display" onBlurCapture={restoreMobileFocus}>
              <Tooltip open={wideLayout && openControl === "expanded"} onOpenChange={(nextOpen) => changeControlTooltip("expanded", nextOpen)}><TooltipTrigger asChild><Button ref={expandRef} variant="ghost" shape="icon" size="sm" aria-label="Expand sidebar" aria-pressed={sidebarState === "expanded"} onClick={() => changeSidebarState("expanded")}><PanelLeftOpenIcon /></Button></TooltipTrigger><TooltipContent side="bottom">Expand sidebar</TooltipContent></Tooltip>
              <Tooltip open={wideLayout && openControl === "collapsed"} onOpenChange={(nextOpen) => changeControlTooltip("collapsed", nextOpen)}><TooltipTrigger asChild><Button variant="ghost" shape="icon" size="sm" aria-label="Minimise sidebar" aria-pressed={sidebarState === "collapsed"} onClick={() => changeSidebarState("collapsed")}><PanelLeftCloseIcon /></Button></TooltipTrigger><TooltipContent side="bottom">Minimise sidebar</TooltipContent></Tooltip>
              <Tooltip open={wideLayout && openControl === "hidden"} onOpenChange={(nextOpen) => changeControlTooltip("hidden", nextOpen)}><TooltipTrigger asChild><Button variant="ghost" shape="icon" size="sm" aria-label="Hide sidebar" aria-pressed={sidebarState === "hidden"} onClick={() => changeSidebarState("hidden")}><PanelLeftIcon /></Button></TooltipTrigger><TooltipContent side="bottom">Hide sidebar</TooltipContent></Tooltip>
            </div>
            <div className="pk-admin-header-content">{header}</div>
            {actions ? <div className="pk-admin-actions">{actions}</div> : null}
          </header>
          <Content className="pk-admin-content" id={mainId} ref={contentRef} tabIndex={-1}>{children}</Content>
        </div>
      </div>
    </div></TooltipProvider>
  );
}
