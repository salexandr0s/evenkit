"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { classes } from "./classes.js";
import { Spinner } from "./feedback.js";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
export type ControlSize = "sm" | "md" | "lg";
export type ButtonShape = "default" | "icon";

interface ButtonAppearanceProps {
  variant?: ButtonVariant;
  size?: ControlSize;
  /** Icon shape accepts a single glyph child and requires an accessible name on the control. */
  shape?: ButtonShape;
  /** Fill the available width. Icon shape takes precedence and stays square. */
  fullWidth?: boolean;
  /** Decorative content before the label; keep the action's name in children. */
  startIcon?: ReactNode;
  /** Decorative content after the label; keep the action's name in children. */
  endIcon?: ReactNode;
}

export interface ButtonProps extends ComponentPropsWithoutRef<"button">, ButtonAppearanceProps {
  loading?: boolean;
}

function ButtonContent({ children, startIcon, endIcon, shape }: Pick<ButtonAppearanceProps, "startIcon" | "endIcon" | "shape"> & { children: ReactNode }) {
  return (
    <span className="pk-button-label" aria-hidden={shape === "icon" || undefined}>
      {startIcon ? <span className="pk-button-icon" aria-hidden="true">{startIcon}</span> : null}
      <span className="pk-button-text">{children}</span>
      {endIcon ? <span className="pk-button-icon" aria-hidden="true">{endIcon}</span> : null}
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", shape = "default", fullWidth = false, startIcon, endIcon, loading = false, disabled, children, type = "button", "aria-busy": busy, ...props },
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
      data-shape={shape}
      data-full-width={(fullWidth && shape !== "icon") || undefined}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-busy={loading ? true : busy}
    >
      <ButtonContent shape={shape} startIcon={startIcon} endIcon={endIcon}>{children}</ButtonContent>
      {loading ? <span className="pk-button-spinner"><Spinner aria-hidden="true" /></span> : null}
    </button>
  );
});

export interface ButtonLinkProps extends ComponentPropsWithoutRef<"a">, ButtonAppearanceProps {}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { className, variant = "primary", size = "md", shape = "default", fullWidth = false, startIcon, endIcon, children, ...props },
  ref,
) {
  return (
    <a {...props} ref={ref} className={classes("pk-button", className)} data-variant={variant} data-size={size} data-shape={shape} data-full-width={(fullWidth && shape !== "icon") || undefined}>
      <ButtonContent shape={shape} startIcon={startIcon} endIcon={endIcon}>{children}</ButtonContent>
    </a>
  );
});
