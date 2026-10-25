"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { classes } from "./classes.js";
import type { ControlSize } from "./button.js";
import { FieldFrame, useFieldDescription, type FieldContentProps } from "./field-frame.js";

export { Label, type LabelProps } from "./field-frame.js";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  controlSize?: ControlSize;
  /** Icons are decorative by default; name interactive adornments on their own controls. */
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, controlSize = "md", startAdornment, endAdornment, disabled, readOnly, dir, "aria-invalid": invalid, ...props },
  ref,
) {
  const hasStart = startAdornment !== undefined && startAdornment !== null && startAdornment !== false;
  const hasEnd = endAdornment !== undefined && endAdornment !== null && endAdornment !== false;
  return (
    <span className="pk-input-container" dir={dir} data-size={controlSize} data-adorned={(hasStart || hasEnd) || undefined} data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-invalid={(invalid === true || invalid === "true") || undefined}>
      {hasStart ? <span className="pk-input-adornment" data-side="start">{startAdornment}</span> : null}
      <input {...props} ref={ref} dir={dir} disabled={disabled} readOnly={readOnly} aria-invalid={invalid} className={classes("pk-input", className)} data-size={controlSize} />
      {hasEnd ? <span className="pk-input-adornment" data-side="end">{endAdornment}</span> : null}
    </span>
  );
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

export interface TextFieldProps extends InputProps, FieldContentProps {}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, optional = false, id, fieldClassName, "aria-describedby": describedBy, "aria-invalid": invalid, ...props },
  ref,
) {
  const description = useFieldDescription({ id, hint, error, describedBy });
  return (
    <FieldFrame label={label} hint={hint} error={error} optional={optional} fieldClassName={fieldClassName} description={description} required={props.required}>
      <Input {...props} ref={ref} id={description.controlId} aria-describedby={description.descriptionIds} aria-invalid={description.hasError ? true : invalid} />
    </FieldFrame>
  );
});

export interface TextareaFieldProps extends TextareaProps, FieldContentProps {}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, hint, error, optional = false, id, fieldClassName, "aria-describedby": describedBy, "aria-invalid": invalid, ...props },
  ref,
) {
  const description = useFieldDescription({ id, hint, error, describedBy });
  return (
    <FieldFrame label={label} hint={hint} error={error} optional={optional} fieldClassName={fieldClassName} description={description} required={props.required}>
      <Textarea {...props} ref={ref} id={description.controlId} aria-describedby={description.descriptionIds} aria-invalid={description.hasError ? true : invalid} />
    </FieldFrame>
  );
});
