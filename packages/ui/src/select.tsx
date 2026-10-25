"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { foundation } from "@project-kit/tokens";
import { forwardRef, useEffect, useId, useState, type ComponentPropsWithoutRef } from "react";
import { classes } from "./classes.js";
import type { ControlSize } from "./button.js";
import { FieldFrame, useFieldDescription, type FieldContentProps } from "./field-frame.js";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "./icons.js";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  id: string;
  label: string;
  options: readonly SelectOption[];
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, "asChild" | "children" | "value" | "defaultValue" | "onChange" | "type" | "dir"> {
  /** Values must be nonempty and unique across flat items and groups. Empty groups are omitted. */
  options: readonly (SelectOption | SelectOptionGroup)[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  dir?: "ltr" | "rtl";
  container?: ComponentPropsWithoutRef<typeof SelectPrimitive.Portal>["container"];
  placeholder?: string;
  emptyMessage?: string;
  controlSize?: ControlSize;
}

function SelectItem({ option }: { option: SelectOption }) {
  const descriptionId = useId();
  return (
    <SelectPrimitive.Item className="pk-select-item" value={option.value} disabled={option.disabled ?? false} textValue={option.label} aria-describedby={option.description ? descriptionId : undefined} data-described={!!option.description || undefined}>
      <span className="pk-select-item-copy">
        <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
        {option.description ? <span className="pk-select-description" id={descriptionId}>{option.description}</span> : null}
      </span>
      <SelectPrimitive.ItemIndicator className="pk-select-indicator" aria-hidden="true"><CheckIcon /></SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { options, value, defaultValue, onValueChange, name, form, disabled = false, required = false, placeholder = "Choose an option", emptyMessage = "No options available.", className, controlSize = "md", dir, container, ...props },
  ref,
) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

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
  const hasOptions = options.some((option) => !("options" in option) || option.options.length > 0);

  return (
    <SelectPrimitive.Root {...rootProps} open={open && !disabled} onOpenChange={(nextOpen) => setOpen(!disabled && nextOpen)}>
      <SelectPrimitive.Trigger {...props} ref={ref} type="button" className={classes("pk-select", className)} data-size={controlSize}>
        <span className="pk-select-value"><SelectPrimitive.Value placeholder={placeholder} /></span>
        <SelectPrimitive.Icon className="pk-select-chevron" aria-hidden="true"><ChevronDownIcon /></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal container={container}>
        <SelectPrimitive.Content
          className="pk-select-content"
          data-disabled={disabled || undefined}
          tabIndex={-1}
          position="popper"
          align="start"
          sideOffset={Number.parseFloat(foundation.space["1_5"])}
          collisionPadding={Number.parseFloat(foundation.space["3"])}
          onKeyDownCapture={(event) => {
            // Exit content stays mounted for motion but must not select again.
            if (!open || disabled) { event.preventDefault(); event.stopPropagation(); }
          }}
        >
          <SelectPrimitive.ScrollUpButton className="pk-select-scroll" aria-hidden="true"><ChevronUpIcon /></SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="pk-select-viewport">
            {hasOptions ? options.map((option) => (
              "options" in option ? option.options.length > 0 ? (
                <SelectPrimitive.Group key={`group:${option.id}`} className="pk-select-group">
                  <SelectPrimitive.Label className="pk-select-group-label">{option.label}</SelectPrimitive.Label>
                  {option.options.map((item) => <SelectItem key={`item:${item.value}`} option={item} />)}
                </SelectPrimitive.Group>
              ) : null : <SelectItem key={`item:${option.value}`} option={option} />
            )) : <div className="pk-select-empty" role="status">{emptyMessage}</div>}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="pk-select-scroll" aria-hidden="true"><ChevronDownIcon /></SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});

export interface SelectFieldProps extends SelectProps, FieldContentProps {}

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(function SelectField(
  { label, hint, error, optional = false, id, fieldClassName, "aria-describedby": describedBy, "aria-invalid": invalid, ...props },
  ref,
) {
  const description = useFieldDescription({ id, hint, error, describedBy });
  return (
    <FieldFrame label={label} hint={hint} error={error} optional={optional} fieldClassName={fieldClassName} description={description} required={props.required}>
      <Select {...props} ref={ref} id={description.controlId} aria-describedby={description.descriptionIds} aria-invalid={description.hasError ? true : invalid} />
    </FieldFrame>
  );
});
