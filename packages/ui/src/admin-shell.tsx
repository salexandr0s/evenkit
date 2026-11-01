"use client";

import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState, type AnchorHTMLAttributes, type CSSProperties, type FocusEvent, type MouseEventHandler, type ReactNode, type Ref } from "react";
import { foundation } from "@evenkit/tokens";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog.js";
import { ChevronDownIcon, CircleIcon, LayoutDashboardIcon, MenuIcon, PanelLeftCloseIcon, PanelLeftIcon, PanelLeftOpenIcon } from "./icons.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";
import { sidebarWidths, useAdminSidebarDrag } from "./use-admin-sidebar-drag.js";

export type AdminSidebarState = "expanded" | "collapsed" | "hidden";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  end?: ReactNode;
}

export interface AdminNavGroup {
  id?: string;
  label?: string;
  icon?: ReactNode;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
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
  suppressTooltips?: boolean;
}

interface NavLinkProps extends Omit<AdminLinkProps, "ref"> {
  renderLink: AdminShellProps["renderLink"];
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink({ renderLink, ...props }, ref) {
  return renderLink ? renderLink({ ...props, ref }) : <a {...props} ref={ref} />;
});

function Navigation({ groups, activeItemId, label, renderLink, onNavigate, collapsed = false, tooltipsEnabled = true, suppressTooltips = false }: NavigationProps) {
  const navigationId = useId();
  const navigationRef = useRef<HTMLElement>(null);
  const [tooltipSide, setTooltipSide] = useState<"left" | "right">("right");
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const activeGroupExpanded = groups.find(group => group.items.some(item => item.id === activeItemId))?.expanded;
  const navigate: MouseEventHandler<HTMLAnchorElement> = (event) => {
    const link = event.currentTarget;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    onNavigate?.();
  };

  useEffect(() => {
    // A new desktop focus can arrive before the observer's width update commits.
    if (suppressTooltips || !collapsed || (!tooltipsEnabled && navigationRef.current?.getClientRects().length === 0)) setOpenItemId(null);
  }, [collapsed, tooltipsEnabled, suppressTooltips]);

  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;
    const revealActive = () => {
      const active = navigation.querySelector<HTMLElement>(".pk-admin-nav-link[aria-current='page']");
      if (!active || active.closest("[inert]") || active.getClientRects().length === 0 || navigation.clientHeight === 0) return;
      const bounds = navigation.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      const style = window.getComputedStyle(navigation);
      const top = bounds.top + Number.parseFloat(style.paddingTop);
      const bottom = bounds.bottom - Number.parseFloat(style.paddingBottom);
      if (item.bottom > bottom) navigation.scrollTop += item.bottom - bottom;
      else if (item.top < top) navigation.scrollTop -= top - item.top;
    };
    revealActive();
    const observer = new ResizeObserver(revealActive);
    observer.observe(navigation);
    const activeDisclosure = navigation.querySelector(".pk-admin-nav-group[data-active] .pk-admin-nav-disclosure");
    if (activeDisclosure) observer.observe(activeDisclosure);
    return () => observer.disconnect();
  }, [activeItemId, activeGroupExpanded, collapsed]);

  function changeTooltipOpen(itemId: string, open: boolean) {
    if (suppressTooltips || !collapsed || (open && navigationRef.current?.getClientRects().length === 0)) return;
    if (open && navigationRef.current) setTooltipSide(window.getComputedStyle(navigationRef.current).direction === "rtl" ? "left" : "right");
    setOpenItemId((current) => open ? itemId : current === itemId ? null : current);
  }

  return (
    <nav ref={navigationRef} className="pk-admin-navigation" data-grouped={groups.some(group => group.expanded !== undefined && group.onExpandedChange) || undefined} aria-label={label}>
      {groups.map((group, index) => {
        const disclosure = !!group.label && group.expanded !== undefined && !!group.onExpandedChange;
        const groupId = group.id ?? String(index);
        const listId = `${navigationId}-group-${groupId}`;
        const tooltipId = `group:${groupId}`;
        return (
        <div className="pk-admin-nav-group" key={groupId} data-collapsible={disclosure || undefined} data-active={group.items.some(item => item.id === activeItemId) || undefined}>
          {disclosure ? (
            <Tooltip open={collapsed && tooltipsEnabled && !suppressTooltips && openItemId === tooltipId} onOpenChange={(open) => changeTooltipOpen(tooltipId, open)}>
              <TooltipTrigger asChild>
                <button type="button" className="pk-admin-nav-group-trigger" aria-expanded={group.expanded} aria-controls={listId} aria-label={group.label} onClick={() => { setOpenItemId(null); group.onExpandedChange?.(!group.expanded); }}>
                  <span className="pk-admin-nav-icon" aria-hidden="true">{group.icon ?? <LayoutDashboardIcon />}</span>
                  <span className="pk-admin-nav-group-text">{group.label}</span>
                  <span className="pk-admin-nav-group-count" aria-hidden="true">{group.items.length}</span>
                  <ChevronDownIcon className="pk-admin-nav-group-chevron" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side={tooltipSide}>{group.label}</TooltipContent>
            </Tooltip>
          ) : group.label ? <p className="pk-admin-nav-label">{group.label}</p> : null}
          <div className="pk-admin-nav-disclosure" data-expanded={disclosure ? group.expanded : undefined} aria-hidden={disclosure && !group.expanded || undefined} inert={disclosure && !group.expanded}>
          <div className="pk-admin-nav-disclosure-inner">
          <ul id={listId} className="pk-admin-nav-list" role="list">
            {group.items.map((item) => {
              const linkProps: AdminLinkProps = {
                href: item.href,
                className: "pk-admin-nav-link",
                "aria-label": item.label,
                ...(item.id === activeItemId ? { "aria-current": "page" as const } : {}),
                onClick: navigate,
                children: <><span className="pk-admin-nav-icon" aria-hidden="true">{item.icon ?? <CircleIcon />}</span><span className="pk-admin-nav-text">{item.label}</span>{item.end !== undefined && item.end !== null ? <span className="pk-admin-nav-end">{item.end}</span> : null}</>,
              };
              return <li key={item.id}><Tooltip open={collapsed && tooltipsEnabled && !suppressTooltips && openItemId === item.id} onOpenChange={(open) => changeTooltipOpen(item.id, open)}><TooltipTrigger asChild><NavLink {...linkProps} renderLink={renderLink} /></TooltipTrigger><TooltipContent side={tooltipSide}>{item.label}</TooltipContent></Tooltip></li>;
            })}
          </ul>
          </div>
          </div>
        </div>
        );
      })}
    </nav>
  );
}

export function AdminShell({ brand, compactBrand, navigation, header, children, activeItemId, actions, footer, compactFooter, sidebarState: controlledSidebarState, defaultSidebarState = "expanded", onSidebarStateChange, contentId, navLabel = "Main navigation", className, contentAs: Content = "main", renderLink }: AdminShellProps) {
  const generatedId = useId();
  const mainId = contentId ?? `pk-admin-content-${generatedId}`;
  const sidebarId = `pk-admin-sidebar-${generatedId}`;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wideLayout, setWideLayout] = useState(true);
  const [openControl, setOpenControl] = useState(false);
  const [openMenuTooltip, setOpenMenuTooltip] = useState(false);
  const [internalSidebarState, setInternalSidebarState] = useState(defaultSidebarState);
  const sidebarState = controlledSidebarState ?? internalSidebarState;
  const shellRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const cycleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const restoringMenuFocus = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const sidebarFocusRef = useRef<HTMLElement | null>(null);

  function changeSidebarState(nextState: AdminSidebarState) {
    if (nextState === sidebarState) return;
    setOpenControl(false);
    if (controlledSidebarState === undefined) setInternalSidebarState(nextState);
    onSidebarStateChange?.(nextState);
  }

  const drag = useAdminSidebarDrag({ state: sidebarState, wideLayout, frameRef, sidebarRef, onChange: changeSidebarState });
  const cycle = sidebarState === "expanded"
    ? { state: "collapsed" as const, label: "Minimise sidebar", icon: <PanelLeftCloseIcon /> }
    : sidebarState === "collapsed"
      ? { state: "hidden" as const, label: "Hide sidebar", icon: <PanelLeftIcon /> }
      : { state: "expanded" as const, label: "Expand sidebar", icon: <PanelLeftOpenIcon /> };
  const sidebarView = drag.width === null ? sidebarState === "expanded" ? "expanded" : "collapsed"
    : drag.width < (sidebarWidths.collapsed + sidebarWidths.expanded) / 2 ? "collapsed" : "expanded";
  const frameStyle: CSSProperties & { "--pk-admin-sidebar-width"?: string } = drag.width === null ? {} : { "--pk-admin-sidebar-width": `${drag.width}px` };

  function changeControlTooltip(open: boolean) {
    if (drag.dragging || (open && cycleRef.current?.getClientRects().length === 0)) return;
    setOpenControl(open);
  }

  function restoreMobileFocus(event: FocusEvent<HTMLElement>) {
    const menu = menuRef.current;
    // CSS can hide the focused desktop control before ResizeObserver runs.
    if (event.relatedTarget === null && event.target.getClientRects().length === 0 && menu && menu.getClientRects().length > 0) {
      restoringMenuFocus.current = true;
      try { menu.focus(); }
      finally { restoringMenuFocus.current = false; }
    }
  }

  function sidebarBlur(event: FocusEvent<HTMLElement>) {
    restoreMobileFocus(event);
    if (event.relatedTarget !== null || !sidebarRef.current?.inert) sidebarFocusRef.current = null;
  }

  const closeDrawerFromBrand: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || !event.currentTarget.contains(link) || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    setDrawerOpen(false);
  };

  useLayoutEffect(() => {
    const header = headerRef.current;
    const content = contentRef.current;
    if (!header || !content) return;
    const measure = () => content.style.setProperty("--pk-admin-header-height", `${header.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (sidebarState !== "hidden" || (!sidebarRef.current?.contains(document.activeElement) && !(sidebarFocusRef.current && document.activeElement === document.body))) return;
    const restore = cycleRef.current;
    if (restore && restore.getClientRects().length > 0) restore.focus();
    else contentRef.current?.focus();
    sidebarFocusRef.current = null;
  }, [sidebarState]);

  useEffect(() => { if (drag.dragging) setOpenControl(false); }, [drag.dragging]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const breakpoint = Number.parseFloat(foundation.breakpoint.md);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const wide = entry.contentRect.width > breakpoint;
      setWideLayout(wide);
      if (wide) {
        setDrawerOpen(false);
        setOpenMenuTooltip(false);
      }
      else {
        drag.cancel();
        if (cycleRef.current?.getClientRects().length === 0) setOpenControl(false);
      }
    });
    observer.observe(shell);
    return () => observer.disconnect();
  }, [drag.cancel]);

  const navProps: NavigationProps = { groups: navigation, activeItemId, label: navLabel, renderLink };

  return (
    <TooltipProvider><div className={classes("pk-admin-shell", className)} ref={shellRef}>
      <a className="pk-admin-skip" href={`#${mainId}`}>Skip to main content</a>
      <div ref={frameRef} style={frameStyle} className="pk-admin-frame" data-sidebar-state={sidebarState} data-dragging={drag.dragging || undefined}>
        <aside ref={sidebarRef} id={sidebarId} onFocusCapture={(event) => { sidebarFocusRef.current = event.target; }} onBlurCapture={sidebarBlur} className="pk-admin-sidebar" data-sidebar-state={sidebarState} data-sidebar-view={sidebarView} aria-label="Application sidebar" aria-hidden={sidebarState === "hidden" || undefined} inert={sidebarState === "hidden"}>
          <div className="pk-admin-sidebar-inner">
          <div className="pk-admin-brand"><div className="pk-admin-full-brand">{brand}</div><div className="pk-admin-compact-brand">{compactBrand ?? <LayoutDashboardIcon />}</div></div>
          <Navigation {...navProps} collapsed={sidebarState === "collapsed"} tooltipsEnabled={wideLayout} suppressTooltips={drag.dragging} />
          {footer ? <div className="pk-admin-sidebar-footer pk-admin-full-footer">{footer}</div> : null}
          {compactFooter ? <div className="pk-admin-sidebar-footer pk-admin-compact-footer">{compactFooter}</div> : null}
          </div>
        </aside>
        <div {...drag.handleProps} onBlurCapture={restoreMobileFocus} className="pk-admin-resize" role="separator" tabIndex={0} aria-label="Resize sidebar" aria-orientation="vertical" aria-controls={sidebarId} aria-valuemin={0} aria-valuemax={sidebarWidths.expanded} aria-valuenow={Math.round(drag.width ?? sidebarWidths[sidebarState])} aria-valuetext={`${sidebarState[0]?.toUpperCase()}${sidebarState.slice(1)}`} />
        <div className="pk-admin-workspace">
          <header ref={headerRef} className="pk-admin-header">
            <Dialog open={drawerOpen} onOpenChange={(open) => { setDrawerOpen(open); if (open) setOpenMenuTooltip(false); }}>
              <Tooltip open={!wideLayout && !drawerOpen && openMenuTooltip} onOpenChange={(open) => setOpenMenuTooltip(open && !!menuRef.current?.getClientRects().length)}>
                <TooltipTrigger asChild onFocus={(event) => { if (restoringMenuFocus.current) event.preventDefault(); }}>
                  <DialogTrigger asChild>
                    <Button ref={menuRef} variant="ghost" shape="icon" className="pk-admin-menu" aria-label="Open navigation">
                      <MenuIcon />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                {/* The drawer replaces this hint and must own Escape immediately. */}
                {!drawerOpen ? <TooltipContent side="bottom">Open navigation</TooltipContent> : null}
              </Tooltip>
              <DialogContent
                className="pk-admin-drawer"
                closeLabel="Close navigation"
                onCloseAutoFocus={(event) => {
                  const menu = menuRef.current;
                  if (!menu) return;
                  event.preventDefault();
                  if (menu.getClientRects().length === 0) {
                    contentRef.current?.focus();
                  } else {
                    restoringMenuFocus.current = true;
                    try { menu.focus(); }
                    finally { restoringMenuFocus.current = false; }
                  }
                }}
              >
                <DialogTitle className="pk-admin-drawer-title">{navLabel}</DialogTitle>
                <DialogDescription className="pk-admin-visually-hidden">Choose a page in this application.</DialogDescription>
                <div className="pk-admin-brand pk-admin-drawer-brand" onClick={closeDrawerFromBrand}>{brand}</div>
                <Navigation {...navProps} onNavigate={() => setDrawerOpen(false)} />
                {footer ? <div className="pk-admin-sidebar-footer">{footer}</div> : null}
              </DialogContent>
            </Dialog>
            <div className="pk-admin-sidebar-controls" role="group" aria-label="Sidebar display" onBlurCapture={restoreMobileFocus}>
              <Tooltip open={wideLayout && !drag.dragging && openControl} onOpenChange={changeControlTooltip}><TooltipTrigger asChild><Button ref={cycleRef} variant="ghost" shape="icon" size="sm" aria-label={cycle.label} onClick={() => { drag.cancel(); changeSidebarState(cycle.state); }}>{cycle.icon}</Button></TooltipTrigger><TooltipContent side="bottom">{cycle.label}</TooltipContent></Tooltip>
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
