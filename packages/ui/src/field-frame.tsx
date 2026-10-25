"use client";

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { classes } from "./classes.js";

export interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  required?: boolean;
  optional?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, children, required = false, optional = false, ...props },
  ref,
) {
  return (
    <label {...props} ref={ref} className={classes("pk-label", className)}>
      {children}
      {required || optional ? <span className="pk-label-cue" aria-hidden="true">{required ? "Required" : "Optional"}</span> : null}
    </label>
  );
});

export interface FieldContentProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  fieldClassName?: string | undefined;
}

function hasContent(value: ReactNode): boolean {
  return value !== null && value !== undefined && value !== false && value !== "";
}

/** Keep consumer descriptions first and append the field's own messages once. */
export function useFieldDescription({ id, hint, error, describedBy }: {
  id: string | undefined;
  hint: ReactNode;
  error: ReactNode;
  describedBy: string | undefined;
}) {
  const generatedId = useId();
  const controlId = id ?? `pk-field-${generatedId}`;
  const hasHint = hasContent(hint);
  const hasError = hasContent(error);
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const descriptionIds = [...new Set([
    ...(describedBy?.split(/\s+/).filter(Boolean) ?? []),
    ...(hasHint ? [hintId] : []),
    ...(hasError ? [errorId] : []),
  ])].join(" ") || undefined;
  return { controlId, hintId, errorId, hasHint, hasError, descriptionIds };
}

interface FieldFrameProps extends FieldContentProps {
  description: ReturnType<typeof useFieldDescription>;
  required: boolean | undefined;
  children: ReactNode;
}

export function FieldFrame({ label, hint, error, optional, fieldClassName, description, required, children }: FieldFrameProps) {
  return (
    <div className={classes("pk-field", fieldClassName)}>
      <Label htmlFor={description.controlId} required={required ?? false} optional={optional ?? false}>{label}</Label>
      {children}
      {description.hasHint ? <div className="pk-field-hint" id={description.hintId}>{hint}</div> : null}
      {description.hasError ? (
        <div className="pk-field-error" id={description.errorId} role="alert">
          <span className="pk-feedback-symbol" aria-hidden="true">!</span>
          <div>{error}</div>
        </div>
      ) : null}
    </div>
  );
}
