"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { classes } from "./classes.js";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = "neutral", ...props },
  ref,
) {
  return <span {...props} ref={ref} className={classes("pk-badge", className)} data-tone={tone} />;
});

export interface SpinnerProps extends ComponentPropsWithoutRef<"span"> {
  label?: string;
}

export function Spinner({ className, label = "Loading", "aria-hidden": hidden, "aria-label": ariaLabel, role, ...props }: SpinnerProps) {
  const decorative = hidden === true || hidden === "true";
  return (
    <span
      {...props}
      className={classes("pk-spinner", className)}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : (role ?? "status")}
      aria-label={decorative ? undefined : (ariaLabel ?? label)}
    />
  );
}

export const Skeleton = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(function Skeleton(
  { className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={classes("pk-skeleton", className)} aria-hidden="true" />;
});

export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { className, title, description, action, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={classes("pk-empty-state", className)}>
      <p className="pk-empty-title">{title}</p>
      {description ? <div className="pk-empty-description">{description}</div> : null}
      {action ? <div className="pk-empty-action">{action}</div> : null}
    </div>
  );
});

export interface ActionMessageProps extends ComponentPropsWithoutRef<"div"> {
  tone?: "success" | "error" | "info";
}

export const ActionMessage = forwardRef<HTMLDivElement, ActionMessageProps>(function ActionMessage(
  { className, tone = "info", children, role, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={classes("pk-action-message", className)} data-tone={tone} role={role ?? (tone === "error" ? "alert" : "status")}>
      <span className="pk-feedback-symbol" aria-hidden="true">{tone === "success" ? "✓" : tone === "error" ? "!" : "i"}</span>
      <div>{children}</div>
    </div>
  );
});
