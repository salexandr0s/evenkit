"use client";

import { Container, Heading, Inline, Navbar, Prose, Stack, type HeadingTag, type NavbarProps, type NavigationLinkProps } from "@evenkit/ui";
import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import "./website.css";

export interface WebsiteHeaderProps extends NavbarProps {
  /** ID of the host's main element. Give that element tabIndex={-1}. */
  contentId: string;
}

/** Navbar owns disclosure; local destinations receive focus after its dialog closes. */
export function WebsiteHeader({ className, onClick, ...props }: WebsiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const cancelFocus = useRef<(() => void) | undefined>(undefined);
  useEffect(() => () => cancelFocus.current?.(), []);

  return <Navbar {...props} ref={headerRef} className={["pk-website-header", className].filter(Boolean).join(" ")} onClick={event => {
    onClick?.(event);
    cancelFocus.current?.();
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    const header = headerRef.current;
    if (!anchor || !header || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
    const ownerDocument = header.ownerDocument;
    const current = new URL(ownerDocument.URL);
    const destination = new URL(anchor.href, current);
    if (!destination.hash || destination.origin !== current.origin || destination.pathname !== current.pathname || destination.search !== current.search) return;
    let targetId: string;
    try { targetId = decodeURIComponent(destination.hash.slice(1)); } catch { return; }
    const target = ownerDocument.getElementById(targetId);
    const trigger = header.querySelector<HTMLElement>(".pk-navbar-mobile-trigger[aria-controls][aria-expanded='true']");
    const dialogId = trigger?.getAttribute("aria-controls");
    const dialog = dialogId ? ownerDocument.getElementById(dialogId) : null;
    if (!target || !dialog || dialog.dataset.state !== "open" || !dialog.contains(anchor) || dialog.contains(target)) return;

    let frame = 0;
    const observer = new MutationObserver(afterClose);
    function cleanup() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      header?.removeEventListener("focusin", afterClose);
      ownerDocument.removeEventListener("pointerdown", cleanup, true);
      ownerDocument.removeEventListener("keydown", cleanup, true);
      cancelFocus.current = undefined;
    }
    function afterClose() {
      // Dialog restores focus asynchronously after removal. Observe that owned
      // restoration instead of guessing the duration of its exit animation.
      if (dialog?.isConnected || !header?.contains(ownerDocument.activeElement)) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        cleanup();
        if (!header?.isConnected || !target?.isConnected) return;
        const temporaryTabIndex = !target.hasAttribute("tabindex") && target.tabIndex < 0;
        if (temporaryTabIndex) target.setAttribute("tabindex", "-1");
        target.focus();
        if (temporaryTabIndex) {
          const restore = () => { if (target.getAttribute("tabindex") === "-1") target.removeAttribute("tabindex"); };
          if (ownerDocument.activeElement === target) target.addEventListener("blur", restore, { once: true });
          else restore();
        }
      });
    }
    cancelFocus.current = cleanup;
    header.addEventListener("focusin", afterClose);
    if (dialog.parentNode) observer.observe(dialog.parentNode, { childList: true });
    // A new gesture supersedes the link's pending focus intent.
    ownerDocument.addEventListener("pointerdown", cleanup, true);
    ownerDocument.addEventListener("keydown", cleanup, true);
  }} />;
}

export interface WebsiteFooterGroup {
  id: string;
  label: string;
  links: readonly { id: string; label: ReactNode; href: string }[];
}

export interface WebsiteFooterProps extends Omit<ComponentPropsWithoutRef<"footer">, "children"> {
  brand: ReactNode;
  description?: ReactNode;
  groups?: readonly WebsiteFooterGroup[];
  /** Supply contact details, locale controls and legal links from the host. */
  contact?: ReactNode;
  locale?: ReactNode;
  legal?: ReactNode;
  note?: ReactNode;
  headingAs?: HeadingTag;
  renderLink?: (props: NavigationLinkProps) => ReactNode;
}

export function WebsiteFooter({ brand, description, groups = [], contact, locale, legal, note, headingAs = "h2", renderLink, className, ...props }: WebsiteFooterProps) {
  return <footer {...props} className={["pk-website-footer", className].filter(Boolean).join(" ")}>
    <Container>
      <div className="pk-website-footer-main">
        <Stack gap="3" className="pk-website-footer-brand">
          <div>{brand}</div>
          {description ? <Prose className="pk-website-description">{description}</Prose> : null}
          {contact ? <div className="pk-website-footer-contact">{contact}</div> : null}
        </Stack>
        {groups.map(group => <nav key={group.id} aria-label={group.label} className="pk-website-footer-group">
          <Heading as={headingAs} size="4">{group.label}</Heading>
          <ul role="list">{group.links.map(link => {
            const linkProps: NavigationLinkProps = { href: link.href, children: link.label, className: "pk-website-link" };
            return <li key={link.id}>{renderLink ? renderLink(linkProps) : <a {...linkProps} />}</li>;
          })}</ul>
        </nav>)}
      </div>
      {legal || locale || note ? <Inline gap="4" justify="between" align="start" className="pk-website-footer-bottom">
        {note ? <div>{note}</div> : null}
        {legal ? <div>{legal}</div> : null}
        {locale ? <div>{locale}</div> : null}
      </Inline> : null}
    </Container>
  </footer>;
}
