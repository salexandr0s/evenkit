"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ActionMessage, Button, Checkbox, FormErrorSummary, Heading, Spinner, Stack, TextareaField, TextField } from "@evenkit/ui";
import type { WebsiteConsent, WebsiteFormMessages, WebsiteSubmitHandler } from "./form-types";
import { useWebsiteSubmission } from "./use-website-submission";
import "./website-forms.css";

export interface ContactFormValues {
  name: string;
  email: string;
  organization: string;
  message: string;
  /** null means this form did not request consent. */
  consent: boolean | null;
}

export interface ContactFormMessages extends WebsiteFormMessages {
  name: string;
  organization: string;
  message: string;
  missingName: string;
  missingMessage: string;
}

export interface ContactFormProps {
  heading: ReactNode;
  description?: ReactNode;
  headingAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  onSubmit: WebsiteSubmitHandler<ContactFormValues>;
  consent?: WebsiteConsent;
  messages?: Partial<ContactFormMessages>;
  id?: string;
  className?: string;
  dir?: "ltr" | "rtl" | "auto";
}

const defaults: ContactFormMessages = {
  name: "Name", email: "Email", organization: "Organization", message: "Message",
  required: "Required", optional: "Optional", missingName: "Enter your name.",
  invalidEmail: "Enter a valid email address.", missingMessage: "Enter a message.",
  errorSummary: "Check the following fields", submit: "Send inquiry", pending: "Sending inquiry…",
  sentHeading: "Inquiry sent", sent: "Your inquiry has been submitted.",
  failureHeading: "Inquiry could not be sent", failure: "Your answers are still here. Try sending again.",
  retry: "Try again", startAgain: "Write another inquiry",
};
const emptyValues: ContactFormValues = { name: "", email: "", organization: "", message: "", consent: false };
type Errors = Partial<Record<keyof ContactFormValues, string>>;

/** Editable contact form. The host owns submission, policy text and server validation. */
export function ContactForm({ heading, description, headingAs = "h2", onSubmit, consent, messages, id, className, dir }: ContactFormProps) {
  const generatedId = useId();
  const baseId = id ?? `website-contact-${generatedId}`;
  const copy = { ...defaults, ...messages };
  const [values, setValues] = useState<ContactFormValues>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const firstField = useRef<HTMLInputElement>(null);
  const emailField = useRef<HTMLInputElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const focusSummary = useRef(false);
  const focusFirst = useRef(false);
  const submission = useWebsiteSubmission(onSubmit);
  const pending = submission.status === "pending";

  useEffect(() => {
    if (focusSummary.current) { focusSummary.current = false; summary.current?.focus(); }
  }, [errors]);
  useEffect(() => {
    if (submission.status === "sent" || submission.status === "error") feedback.current?.focus();
    if (submission.status === "idle" && focusFirst.current) { focusFirst.current = false; firstField.current?.focus(); }
  }, [submission.status]);

  function change<Key extends keyof ContactFormValues>(field: Key, value: ContactFormValues[Key]) {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => { const next = { ...current }; delete next[field]; return next; });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || submission.status === "sent") return;
    const data = new FormData(event.currentTarget);
    const text = (name: string) => { const value = data.get(name); return typeof value === "string" ? value : ""; };
    const current: ContactFormValues = { name: text("name"), email: text("email"), organization: text("organization"), message: text("message"), consent: consent ? data.has("consent") : null };
    setValues(current);
    const next: Errors = {};
    if (!current.name.trim()) next.name = copy.missingName;
    if (!current.email.trim() || emailField.current?.validity.typeMismatch) next.email = copy.invalidEmail;
    if (!current.message.trim()) next.message = copy.missingMessage;
    if (consent?.required && !current.consent) next.consent = consent.errorMessage;
    focusSummary.current = Object.keys(next).length > 0;
    setErrors(next);
    if (Object.keys(next).length) return;
    // Keep keyboard focus in the form before its fields become disabled.
    if (event.currentTarget.contains(document.activeElement)) submitButton.current?.focus();
    void submission.send({ name: current.name.trim(), email: current.email.trim(), organization: current.organization.trim(), message: current.message.trim(), consent: current.consent });
  }

  function startAgain() {
    setValues(emptyValues);
    setErrors({});
    focusFirst.current = true;
    submission.reset();
  }

  const label = (text: string, required: boolean) => <span className="pk-website-form-label">{text}<span className="pk-website-form-cue" aria-hidden="true">{required ? copy.required : copy.optional}</span></span>;
  return <section id={baseId} dir={dir} className={["pk-website-form", "pk-website-contact", className].filter(Boolean).join(" ")} aria-labelledby={`${baseId}-heading`}>
    <div className="pk-website-form-layout">
      <header className="pk-website-form-header"><Heading as={headingAs} size="2" id={`${baseId}-heading`}>{heading}</Heading>{description != null ? <div className="pk-website-form-description" id={`${baseId}-description`}>{description}</div> : null}</header>
      <form className="pk-website-form-panel" noValidate onSubmit={submit} onReset={event => event.preventDefault()} aria-labelledby={`${baseId}-heading`} aria-describedby={description != null ? `${baseId}-description` : undefined}>
        <Stack gap="6">
          {submission.status === "sent" ? <>
            <ActionMessage tone="success" heading={copy.sentHeading} ref={feedback} tabIndex={-1}>{copy.sent}</ActionMessage>
            <div className="pk-website-form-actions"><Button variant="outline" onClick={startAgain}>{copy.startAgain}</Button></div>
          </> : <>
            <FormErrorSummary ref={summary} heading={copy.errorSummary} errors={Object.entries(errors).map(([field, message]) => ({ fieldId: `${baseId}-${field}`, message }))} />
            <fieldset className="pk-website-form-fields" disabled={pending} aria-busy={pending || undefined}>
              <legend className="pk-visually-hidden">{heading}</legend>
              <Stack gap="4">
                <div className="pk-website-form-pair">
                  <TextField ref={firstField} id={`${baseId}-name`} name="name" label={label(copy.name, true)} autoComplete="name" required value={values.name} error={errors.name} onChange={event => change("name", event.currentTarget.value)} />
                  <TextField ref={emailField} id={`${baseId}-email`} name="email" type="email" label={label(copy.email, true)} autoComplete="email" required value={values.email} error={errors.email} onChange={event => change("email", event.currentTarget.value)} />
                </div>
                <TextField id={`${baseId}-organization`} name="organization" label={label(copy.organization, false)} autoComplete="organization" value={values.organization} onChange={event => change("organization", event.currentTarget.value)} />
                <TextareaField id={`${baseId}-message`} name="message" label={label(copy.message, true)} required rows={5} value={values.message} error={errors.message} onChange={event => change("message", event.currentTarget.value)} />
                {consent ? <Checkbox id={`${baseId}-consent`} name="consent" label={<span className="pk-website-form-label">{consent.label}<span className="pk-website-form-cue" aria-hidden="true">{consent.required ? copy.required : copy.optional}</span></span>} hint={consent.hint} required={consent.required} checked={values.consent === true} error={errors.consent} onCheckedChange={checked => change("consent", checked === true)} /> : null}
              </Stack>
            </fieldset>
            {submission.status === "error" ? <ActionMessage tone="error" heading={copy.failureHeading} ref={feedback} tabIndex={-1}>{copy.failure}</ActionMessage> : null}
            <div className="pk-website-form-actions"><Button ref={submitButton} type="submit" aria-disabled={pending || undefined} aria-busy={pending || undefined} startIcon={pending ? <Spinner aria-hidden="true" /> : undefined}>{submission.status === "error" ? copy.retry : copy.submit}</Button><span className="pk-website-form-status" role="status">{pending ? copy.pending : ""}</span></div>
          </>}
        </Stack>
      </form>
    </div>
  </section>;
}
