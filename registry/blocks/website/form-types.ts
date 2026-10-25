import type { ReactNode } from "react";

/** Resolve only after the application has accepted the submission. Reject to allow retry. */
export type WebsiteSubmitHandler<Values> = (values: Values, context: { signal: AbortSignal }) => Promise<void>;

/** The application supplies its own consent wording and decides whether it is required. */
export interface WebsiteConsent {
  label: ReactNode;
  hint?: ReactNode;
  required: boolean;
  errorMessage: string;
}

export interface WebsiteFormMessages {
  email: string;
  required: string;
  optional: string;
  invalidEmail: string;
  errorSummary: string;
  submit: string;
  pending: string;
  sentHeading: string;
  sent: string;
  failureHeading: string;
  failure: string;
  retry: string;
  startAgain: string;
}
