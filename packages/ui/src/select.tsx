"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { foundation } from "@project-kit/tokens";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { classes } from "./classes.js";
import type { ControlSize } from "./button.js";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, "asChild" | "children" | "value" | "defaultValue" | "onChange" | "type" | "dir"> {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  dir?: "ltr" | "rtl";
  container?: ComponentPropsWithoutRef<typeof SelectPrimitive.Portal>["container"];
  placeholder?: string;
  controlSize?: ControlSize;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { options, value, defaultValue, onValueChange, name, form, disabled = false, required = false, placeholder = "Choose an option", className, controlSize = "md", dir, container, ...props },
  ref,
) {
  const rootProps = {
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    ...(onValueChange !== undefined ? { onValueChange } : {}),
    ...(name !== undefined ? { name } : {}),
    ...(form !== undefined ? { form } : {}),
    ...(dir !== undefined ? { dir } : {}),
    disabled,
    required,
  };

  return (
    <SelectPrimitive.Root {...rootProps}>
      <SelectPrimitive.Trigger {...props} ref={ref} type="button" className={classes("pk-select", className)} data-size={controlSize}>
        <span className="pk-select-value"><SelectPrimitive.Value placeholder={placeholder} /></span>
        <SelectPrimitive.Icon className="pk-select-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal container={container}>
        <SelectPrimitive.Content
          className="pk-select-content"
          position="popper"
          align="start"
          sideOffset={Number.parseFloat(foundation.space["1"])}
          collisionPadding={Number.parseFloat(foundation.space["3"])}
        >
          <SelectPrimitive.ScrollUpButton className="pk-select-scroll" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 15 6-6 6 6" /></svg>
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="pk-select-viewport">
            {options.map((option) => (
              <SelectPrimitive.Item key={option.value} className="pk-select-item" value={option.value} disabled={option.disabled ?? false} textValue={option.label}>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="pk-select-indicator" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="pk-select-scroll" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});
