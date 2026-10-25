"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { classes } from "./classes.js";
import { CheckIcon, CircleAlertIcon } from "./icons.js";

export interface StepIndicatorItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  status?: "complete" | "error" | "upcoming";
}
export interface StepIndicatorProps extends Omit<ComponentPropsWithoutRef<"nav">, "children" | "onChange"> {
  steps: readonly StepIndicatorItem[];
  currentStep: string;
  /** Only completed steps become buttons. The host owns validation and navigation. */
  onStepChange?: (id: string) => void;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  labels?: { complete?: string; current?: string; error?: string; upcoming?: string };
}

export function StepIndicator({ steps, currentStep, onStepChange, disabled = false, orientation = "horizontal", labels,
  className, "aria-label": label = "Progress", ...props }: StepIndicatorProps) {
  const text = { complete: "Complete", current: "Current step", error: "Needs attention", upcoming: "Upcoming", ...labels };
  return <nav {...props} className={classes("pk-step-indicator", className)} aria-label={label} data-orientation={orientation}>
    <ol>{steps.map((step, index) => {
      const current = step.id === currentStep;
      const state = step.status === "error" ? "error" : current ? "current" : step.status ?? "upcoming";
      const body = <><span className="pk-step-marker" aria-hidden="true">{state === "complete" ? <CheckIcon size="sm" /> : state === "error" ? <CircleAlertIcon size="sm" /> : index + 1}</span><span className="pk-step-copy"><span className="pk-step-label">{step.label}</span><span className="pk-step-state">{text[state]}</span>{step.description ? <span className="pk-step-description">{step.description}</span> : null}</span></>;
      return <li key={step.id} data-state={state} aria-current={current ? "step" : undefined}>
        {onStepChange && state === "complete" && !current ? <button type="button" className="pk-step-content" disabled={disabled} onClick={() => onStepChange(step.id)}>{body}</button> : <span className="pk-step-content">{body}</span>}
      </li>;
    })}</ol>
  </nav>;
}
