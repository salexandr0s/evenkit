"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ActionMessage, Button, Checkbox, FormErrorSummary, Heading, Spinner, Stack, TextField } from "@evenkit/ui";
import type { WebsiteConsent, WebsiteFormMessages, WebsiteSubmitHandler } from "./form-types";
import { useWebsiteSubmission } from "./use-website-submission";
import "./website-forms.css";

export interface NewsletterFormValues {
  email: string;
  /** null means this form did not request consent. */
  consent: boolean | null;
}

export interface NewsletterFormProps {
  heading: ReactNode;
  description?: ReactNode;
  headingAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  onSubmit: WebsiteSubmitHandler<NewsletterFormValues>;
  consent?: WebsiteConsent;
  messages?: Partial<WebsiteFormMessages>;
  id?: string;
  className?: string;
  dir?: "ltr" | "rtl" | "auto";
}

const defaults: WebsiteFormMessages = {
  email: "Email", required: "Required", optional: "Optional", invalidEmail: "Enter a valid email address.",
  errorSummary: "Check the following fields", submit: "Subscribe", pending: "Submitting subscription…",
  sentHeading: "Request received", sent: "Your subscription request has been submitted.",
  failureHeading: "Subscription could not be submitted", failure: "Your email is still here. Try submitting again.",
  retry: "Try again", startAgain: "Use another email",
};
type Errors = Partial<Record<keyof NewsletterFormValues, string>>;

/** Editable signup. The host owns confirmation email, unsubscribe and consent policy. */
export function NewsletterForm({ heading, description, headingAs = "h2", onSubmit, consent, messages, id, className, dir }: NewsletterFormProps) {
  const generatedId = useId();
  const baseId = id ?? `website-newsletter-${generatedId}`;
  const copy = { ...defaults, ...messages };
  const [values, setValues] = useState<NewsletterFormValues>({ email: "", consent: false });
  const [errors, setErrors] = useState<Errors>({});
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
    if (submission.status === "idle" && focusFirst.current) { focusFirst.current = false; emailField.current?.focus(); }
  }, [submission.status]);

  function change<Key extends keyof NewsletterFormValues>(field: Key, value: NewsletterFormValues[Key]) {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => { const next = { ...current }; delete next[field]; return next; });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || submission.status === "sent") return;
    const next: Errors = {};
    if (!values.email.trim() || emailField.current?.validity.typeMismatch) next.email = copy.invalidEmail;
    if (consent?.required && !values.consent) next.consent = consent.errorMessage;
    focusSummary.current = Object.keys(next).length > 0;
    setErrors(next);
    if (Object.keys(next).length) return;
    // Keep keyboard focus in the form before its fields become disabled.
    if (event.currentTarget.contains(document.activeElement)) submitButton.current?.focus();
    void submission.send({ email: values.email.trim(), consent: consent ? values.consent === true : null });
  }

  function startAgain() {
    setValues({ email: "", consent: false });
    setErrors({});
    focusFirst.current = true;
    submission.reset();
  }

  return <section id={baseId} dir={dir} className={["pk-website-form", "pk-website-newsletter", className].filter(Boolean).join(" ")} aria-labelledby={`${baseId}-heading`}>
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
                <TextField ref={emailField} id={`${baseId}-email`} name="email" type="email" label={<span className="pk-website-form-label">{copy.email}<span className="pk-website-form-cue" aria-hidden="true">{copy.required}</span></span>} autoComplete="email" required value={values.email} error={errors.email} onChange={event => change("email", event.currentTarget.value)} />
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
