"use client";

import { forwardRef, useId, useState } from "react";
import { Button } from "./button.js";
import { TextField, type TextFieldProps } from "./field.js";

export interface PasswordFieldProps extends Omit<TextFieldProps, "type" | "endAdornment"> {
  showLabel?: string;
  hideLabel?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { id, disabled, showLabel = "Show password", hideLabel = "Hide password", ...props },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? `pk-password-${generatedId}`;
  const [visible, setVisible] = useState(false);
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
          aria-label={visible ? hideLabel : showLabel}
          aria-controls={controlId}
          onClick={() => setVisible((current) => !current)}
          className="pk-auth-password-toggle"
        >
          {visible ? "Hide" : "Show"}
        </Button>
      }
    />
  );
});
