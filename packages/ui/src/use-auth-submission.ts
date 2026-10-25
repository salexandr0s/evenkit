"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AuthResult } from "./auth-types.js";

export const AUTH_REQUEST_ERROR = "We couldn’t complete your request. Please try again.";

interface SubmissionState<Field extends string> {
  pending: boolean;
  succeeded: boolean;
  error: string | undefined;
  successMessage: string;
  fieldErrors: Partial<Record<Field, string>>;
}

interface SubmissionOptions<Values, Field extends string> {
  onSubmit: (values: Values) => Promise<AuthResult<Field>>;
  getValues: (form: HTMLFormElement) => Values;
  validate: (values: Values) => Partial<Record<Field, string>>;
  fieldOrder: readonly Field[];
  successMessage: string;
  requireSuccessMessage?: boolean;
  useResultMessage?: boolean;
  enabled?: boolean;
}

type FocusTarget<Field extends string> = { kind: "field"; field: Field } | { kind: "message" };

export function useAuthSubmission<Values, Field extends string>({ onSubmit, getValues, validate, fieldOrder, successMessage, requireSuccessMessage = false, useResultMessage = true, enabled = true }: SubmissionOptions<Values, Field>) {
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  const busy = useRef(false);
  const completed = useRef(false);
  const requestId = useRef(0);
  const [state, setState] = useState<SubmissionState<Field>>({ pending: false, succeeded: false, error: undefined, successMessage: "", fieldErrors: {} });
  const [focusRequest, setFocusRequest] = useState<{ target: FocusTarget<Field>; request: number }>();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestId.current += 1;
      busy.current = false;
    };
  }, []);

  useEffect(() => {
    if (enabled) return;
    requestId.current += 1;
    busy.current = false;
    completed.current = false;
    setState({ pending: false, succeeded: false, error: undefined, successMessage: "", fieldErrors: {} });
  }, [enabled]);

  useEffect(() => {
    if (!focusRequest) return;
    if (focusRequest.target.kind === "message") {
      messageRef.current?.focus();
      return;
    }
    const field = formRef.current?.elements.namedItem(focusRequest.target.field);
    if (field instanceof HTMLElement) field.focus();
  }, [focusRequest]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || completed.current || !enabled) return;
    busy.current = true;
    const currentRequest = ++requestId.current;
    const form = event.currentTarget;
    const isCurrent = () => mounted.current && requestId.current === currentRequest;

    function focusErrors(fieldErrors: Partial<Record<Field, string>>) {
      const firstField = fieldOrder.find((field) => Boolean(fieldErrors[field]));
      setFocusRequest({ target: firstField ? { kind: "field", field: firstField } : { kind: "message" }, request: currentRequest });
    }

    try {
      const values = getValues(form);
      const localErrors = validate(values);
      if (fieldOrder.some((field) => Boolean(localErrors[field]))) {
        if (isCurrent()) {
          setState({ pending: false, succeeded: false, error: undefined, successMessage: "", fieldErrors: localErrors });
          focusErrors(localErrors);
        }
        return;
      }
      setState({ pending: true, succeeded: false, error: undefined, successMessage: "", fieldErrors: {} });
      const result = await onSubmit(values);
      if (!isCurrent()) return;

      if (result.status === "error") {
        const fieldErrors: Partial<Record<Field, string>> = {};
        for (const field of fieldOrder) {
          const message = result.error.fieldErrors?.[field];
          if (typeof message === "string" && message.trim()) fieldErrors[field] = message;
        }
        const message = typeof result.error.message === "string" && result.error.message.trim() ? result.error.message : AUTH_REQUEST_ERROR;
        setState({ pending: false, succeeded: false, error: message, successMessage: "", fieldErrors });
        focusErrors(fieldErrors);
        return;
      }
      if (result.status !== "success" || (requireSuccessMessage && (typeof result.message !== "string" || !result.message.trim()))) {
        throw new Error("Invalid authentication callback result.");
      }

      for (const name of ["password", "confirmPassword"]) {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement) field.value = "";
      }
      completed.current = true;
      const providedMessage = typeof result.message === "string" && result.message.trim() ? result.message : successMessage;
      setState({ pending: false, succeeded: true, error: undefined, successMessage: useResultMessage ? providedMessage : successMessage, fieldErrors: {} });
      setFocusRequest({ target: { kind: "message" }, request: currentRequest });
    } catch {
      if (isCurrent()) {
        setState({ pending: false, succeeded: false, error: AUTH_REQUEST_ERROR, successMessage: "", fieldErrors: {} });
        setFocusRequest({ target: { kind: "message" }, request: currentRequest });
      }
    } finally {
      if (requestId.current === currentRequest) busy.current = false;
    }
  }

  return { ...state, formRef, messageRef, handleSubmit };
}

export function formString(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

export function emailError(email: string): string | undefined {
  if (!email) return "Enter your email address.";
  const input = document.createElement("input");
  input.type = "email";
  input.value = email;
  return input.validity.typeMismatch ? "Enter a valid email address." : undefined;
}
