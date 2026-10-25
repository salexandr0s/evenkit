"use client";

import { useEffect, useId, useRef, useState, type AnchorHTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { foundation } from "@project-kit/tokens";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog.js";
import { MenuIcon } from "./icons.js";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface AdminNavGroup {
  label?: string;
  items: readonly AdminNavItem[];
}

export interface AdminLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className: string;
  children: ReactNode;
}

export interface AdminShellProps {
  brand: ReactNode;
  navigation: readonly AdminNavGroup[];
  header: ReactNode;
  children: ReactNode;
  activeItemId?: string;
  actions?: ReactNode;
  footer?: ReactNode;
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
}

function Navigation({ groups, activeItemId, label, renderLink, onNavigate }: NavigationProps) {
  const navigate: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onNavigate?.();
  };

  return (
    <nav className="pk-admin-navigation" aria-label={label}>
      {groups.map((group, index) => (
        <div className="pk-admin-nav-group" key={index}>
          {group.label ? <p className="pk-admin-nav-label">{group.label}</p> : null}
          <ul className="pk-admin-nav-list">
            {group.items.map((item) => {
              const linkProps: AdminLinkProps = {
                href: item.href,
                className: "pk-admin-nav-link",
                ...(item.id === activeItemId ? { "aria-current": "page" as const } : {}),
                onClick: navigate,
                children: <>{item.icon ? <span className="pk-admin-nav-icon" aria-hidden="true">{item.icon}</span> : null}<span>{item.label}</span></>,
              };
              return <li key={item.id}>{renderLink ? renderLink(linkProps) : <a {...linkProps} />}</li>;
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ brand, navigation, header, children, activeItemId, actions, footer, contentId, navLabel = "Main navigation", className, contentAs: Content = "main", renderLink }: AdminShellProps) {
  const generatedId = useId();
  const mainId = contentId ?? `pk-admin-content-${generatedId}`;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const breakpoint = Number.parseFloat(foundation.breakpoint.md);
    const observer = new ResizeObserver((entries) => {
      if (entries.some((entry) => entry.contentRect.width > breakpoint)) setDrawerOpen(false);
    });
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  const navProps: NavigationProps = { groups: navigation, activeItemId, label: navLabel, renderLink };

  return (
    <div className={classes("pk-admin-shell", className)} ref={shellRef}>
      <a className="pk-admin-skip" href={`#${mainId}`}>Skip to main content</a>
      <div className="pk-admin-frame">
        <aside className="pk-admin-sidebar" aria-label="Application sidebar">
          <div className="pk-admin-brand">{brand}</div>
          <Navigation {...navProps} />
          {footer ? <div className="pk-admin-sidebar-footer">{footer}</div> : null}
        </aside>
        <div className="pk-admin-workspace">
          <header className="pk-admin-header">
            <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DialogTrigger asChild>
                <Button ref={menuRef} variant="ghost" className="pk-admin-menu" aria-label="Open navigation">
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
            <div className="pk-admin-header-content">{header}</div>
            {actions ? <div className="pk-admin-actions">{actions}</div> : null}
          </header>
          <Content className="pk-admin-content" id={mainId} ref={contentRef} tabIndex={-1}>{children}</Content>
        </div>
      </div>
    </div>
  );
}
