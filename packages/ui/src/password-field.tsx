"use client";

import { forwardRef, useId, useState } from "react";
import { Button } from "./button.js";
import { TextField, type TextFieldProps } from "./field.js";

export interface PasswordFieldProps extends Omit<TextFieldProps, "type" | "endAdornment"> {
  showText?: string;
  hideText?: string;
  showLabel?: string;
  hideLabel?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { id, disabled, showText = "Show", hideText = "Hide", showLabel = "Show password", hideLabel = "Hide password", ...props },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? `pk-password-${generatedId}`;
  const [visible, setVisible] = useState(false);
  const visibleText = (visible ? hideText : showText).trim() || (visible ? "Hide" : "Show");
  const contextualLabel = (visible ? hideLabel : showLabel).trim();
  const accessibleLabel = contextualLabel.toLowerCase().includes(visibleText.toLowerCase())
    ? contextualLabel
    : `${visibleText}${contextualLabel ? ` ${contextualLabel}` : ""}`;
  return (
    <TextField
      {...props}
      ref={ref}
      id={controlId}
      disabled={disabled}
      type={visible ? "text" : "password"}
      endAdornment={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          aria-label={accessibleLabel}
          aria-controls={controlId}
          onClick={() => setVisible((current) => !current)}
          className="pk-auth-password-toggle"
        >
          {visibleText}
        </Button>
      }
    />
  );
});
