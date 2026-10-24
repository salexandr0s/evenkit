"use client";

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { classes } from "./classes.js";
import type { ControlSize } from "./button.js";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  controlSize?: ControlSize;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, controlSize = "md", ...props },
  ref,
) {
  return <input {...props} ref={ref} className={classes("pk-input", className)} data-size={controlSize} />;
});

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  controlSize?: ControlSize;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, controlSize = "md", rows = 4, ...props },
  ref,
) {
  return <textarea {...props} ref={ref} rows={rows} className={classes("pk-textarea", className)} data-size={controlSize} />;
});

export const Label = forwardRef<HTMLLabelElement, ComponentPropsWithoutRef<"label">>(function Label(
  { className, ...props },
  ref,
) {
  return <label {...props} ref={ref} className={classes("pk-label", className)} />;
});

export interface TextFieldProps extends InputProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  fieldClassName?: string;
}

function hasContent(value: ReactNode): boolean {
  return value !== null && value !== undefined && value !== false && value !== "";
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, id, fieldClassName, "aria-describedby": describedBy, "aria-invalid": invalid, ...props },
  ref,
) {
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

  return (
    <div className={classes("pk-field", fieldClassName)}>
      <Label htmlFor={controlId}>{label}</Label>
      <Input {...props} ref={ref} id={controlId} aria-describedby={descriptionIds} aria-invalid={hasError ? true : invalid} />
      {hasHint ? <p className="pk-field-hint" id={hintId}>{hint}</p> : null}
      {hasError ? (
        <p className="pk-field-error" id={errorId} role="alert">
          <span className="pk-feedback-symbol" aria-hidden="true">!</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
});
