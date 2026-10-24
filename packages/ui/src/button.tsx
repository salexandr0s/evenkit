"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { classes } from "./classes.js";
import { Spinner } from "./feedback.js";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
export type ControlSize = "sm" | "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ControlSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading = false, disabled, children, type = "button", ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={classes("pk-button", className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      <span className="pk-button-label">{children}</span>
      {loading ? <span className="pk-button-spinner"><Spinner aria-hidden="true" /></span> : null}
    </button>
  );
});

export interface ButtonLinkProps extends ComponentPropsWithoutRef<"a"> {
  variant?: ButtonVariant;
  size?: ControlSize;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { className, variant = "primary", size = "md", children, ...props },
  ref,
) {
  return (
    <a {...props} ref={ref} className={classes("pk-button", className)} data-variant={variant} data-size={size}>
      <span className="pk-button-label">{children}</span>
    </a>
  );
});
