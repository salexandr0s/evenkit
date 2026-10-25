"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { classes } from "./classes.js";
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "./icons.js";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";
export type BadgeSize = "sm" | "md";
export type BadgeVariant = "soft" | "outline";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: BadgeTone;
  size?: BadgeSize;
  variant?: BadgeVariant;
  /** Decorative content before the label. Takes precedence over dot. */
  icon?: ReactNode;
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = "neutral", size = "md", variant = "soft", icon, dot = false, children, ...props },
  ref,
) {
  const hasIcon = icon !== undefined && icon !== null && icon !== false;
  return (
    <span {...props} ref={ref} className={classes("pk-badge", className)} data-tone={tone} data-size={size} data-variant={variant}>
      {hasIcon ? <span className="pk-badge-icon" aria-hidden="true">{icon}</span> : dot ? <span className="pk-badge-dot" aria-hidden="true" /> : null}
      <span className="pk-badge-label">{children}</span>
    </span>
  );
});

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends ComponentPropsWithoutRef<"span"> {
  label?: string;
  size?: SpinnerSize;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, label = "Loading", size = "md", "aria-hidden": hidden, "aria-label": ariaLabel, role, ...props },
  ref,
) {
  const decorative = hidden === true || hidden === "true";
  return (
    <span
      {...props}
      ref={ref}
      className={classes("pk-spinner", className)}
      data-size={size}
      aria-hidden={hidden}
      role={decorative ? undefined : (role ?? "status")}
      aria-label={decorative ? undefined : (ariaLabel ?? label)}
    />
  );
});

export type SkeletonVariant = "block" | "text" | "avatar";
export type SkeletonSize = "sm" | "md" | "lg";

export interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, variant = "block", size = "md", ...props },
  ref,
) {
  return <div {...props} ref={ref} className={classes("pk-skeleton", className)} data-variant={variant} data-size={size} aria-hidden="true" />;
});

export type EmptyStateSize = "sm" | "md";
export type EmptyStateAlign = "center" | "start";
export type EmptyStateTitleTag = "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  /** Decorative content above the title. */
  icon?: ReactNode;
  size?: EmptyStateSize;
  align?: EmptyStateAlign;
  /** Use div for block content, or a heading tag that fits the page hierarchy. */
  titleAs?: EmptyStateTitleTag;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { className, title, description, action, secondaryAction, icon, size = "md", align = "center", titleAs: Title = "p", ...props },
  ref,
) {
  const hasAction = action !== undefined && action !== null && action !== false;
  const hasSecondaryAction = secondaryAction !== undefined && secondaryAction !== null && secondaryAction !== false;
  return (
    <div {...props} ref={ref} className={classes("pk-empty-state", className)} data-size={size} data-align={align}>
      {icon !== undefined && icon !== null && icon !== false ? <div className="pk-empty-icon" aria-hidden="true">{icon}</div> : null}
      <Title className="pk-empty-title">{title}</Title>
      {description ? <div className="pk-empty-description">{description}</div> : null}
      {hasAction || hasSecondaryAction ? <div className="pk-empty-action">{action}{secondaryAction}</div> : null}
    </div>
  );
});

export type ActionMessageTone = "success" | "error" | "info" | "warning";

export interface ActionMessageProps extends ComponentPropsWithoutRef<"div"> {
  tone?: ActionMessageTone;
  heading?: ReactNode;
  actions?: ReactNode;
  /** Decorative status icon. Omit for the tone's icon, or pass false/null to hide it. */
  icon?: ReactNode;
}

export const ActionMessage = forwardRef<HTMLDivElement, ActionMessageProps>(function ActionMessage(
  { className, tone = "info", heading, actions, icon, children, role, ...props },
  ref,
) {
  const messageIcon = icon === undefined
    ? { success: <CircleCheckIcon />, error: <CircleAlertIcon />, info: <InfoIcon />, warning: <TriangleAlertIcon /> }[tone]
    : icon;
  return (
    <div {...props} ref={ref} className={classes("pk-action-message", className)} data-tone={tone} role={role ?? (tone === "error" ? "alert" : "status")}>
      {messageIcon !== null && messageIcon !== false ? <span className="pk-action-message-icon" aria-hidden="true">{messageIcon}</span> : null}
      <div className="pk-action-message-content">
        {heading !== undefined && heading !== null && heading !== false ? <div className="pk-action-message-heading">{heading}</div> : null}
        <div className="pk-action-message-body">{children}</div>
        {actions !== undefined && actions !== null && actions !== false ? <div className="pk-action-message-actions">{actions}</div> : null}
      </div>
    </div>
  );
});
