"use client";

import { forwardRef, useId, type ReactNode } from "react";
import { classes } from "./classes.js";
import { ActionMessage } from "./feedback.js";
import { CheckIcon, ShieldIcon } from "./icons.js";

export interface AuthLayoutProps {
  brand?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  contentAs?: "main" | "section";
  headingAs?: "h1" | "h2";
  className?: string | undefined;
}

export function AuthLayout({ brand, title, description, footer, children, contentAs: Content = "main", headingAs: Heading = "h1", className }: AuthLayoutProps) {
  const headingId = useId();
  return (
    <Content className={classes("pk-auth-layout", className)} data-content-as={Content} aria-labelledby={headingId}>
      <div className="pk-auth-stack">
        {brand ? <div className="pk-auth-brand">{brand}</div> : null}
        <div className="pk-auth-card">
          <header className="pk-auth-header">
            <span className="pk-auth-mark" aria-hidden="true"><ShieldIcon /></span>
            <Heading className="pk-auth-title" id={headingId}>{title}</Heading>
            {description ? <div className="pk-auth-description">{description}</div> : null}
          </header>
          {children}
        </div>
        {footer ? <div className="pk-auth-footer">{footer}</div> : null}
      </div>
    </Content>
  );
}

export const AuthErrorSummary = forwardRef<HTMLDivElement, { message: string }>(function AuthErrorSummary({ message }, ref) {
  return <ActionMessage ref={ref} tone="error" tabIndex={-1} className="pk-auth-error">{message}</ActionMessage>;
});

export const AuthSuccess = forwardRef<HTMLDivElement, { message: string; footer?: ReactNode }>(function AuthSuccess({ message, footer }, ref) {
  return (
    <div ref={ref} className="pk-auth-success" role="status" tabIndex={-1}>
      <span className="pk-auth-success-mark" aria-hidden="true"><CheckIcon /></span>
      <p>{message}</p>
      {footer ? <div className="pk-auth-success-footer">{footer}</div> : null}
    </div>
  );
});

export function AuthAdditionalMethods({ children }: { children: ReactNode }) {
  return children ? <div className="pk-auth-additional">{children}</div> : null;
}
