"use client";

import { AuthAdditionalMethods, AuthErrorSummary, AuthLayout, AuthSuccess } from "./auth-layout.js";
import { Button } from "./button.js";
import { TextField } from "./field.js";
import { MailIcon } from "./icons.js";
import { emailError, formString, useAuthSubmission } from "./use-auth-submission.js";
import type { AuthPageProps, AuthResult, PasswordResetField, PasswordResetValues } from "./auth-types.js";

export interface PasswordResetPageProps extends AuthPageProps {
  onSubmit: (values: PasswordResetValues) => Promise<AuthResult<PasswordResetField>>;
}

export function PasswordResetPage({ onSubmit, brand, title = "Reset your password", description = "Enter your email address to request reset instructions.", footer, successFooter, additionalMethods, contentAs = "main", headingAs = "h1", className }: PasswordResetPageProps) {
  const submission = useAuthSubmission<PasswordResetValues, PasswordResetField>({
    onSubmit,
    getValues(form) { return { email: formString(new FormData(form), "email").trim() }; },
    validate(values) {
      const invalidEmail = emailError(values.email);
      return invalidEmail ? { email: invalidEmail } : {};
    },
    fieldOrder: ["email"],
    successMessage: "If an account matches that email, you’ll receive reset instructions.",
    useResultMessage: false,
  });

  return (
    <AuthLayout brand={brand} title={title} description={description} footer={footer} contentAs={contentAs} headingAs={headingAs} className={className}>
      {submission.succeeded ? <AuthSuccess ref={submission.messageRef} message={submission.successMessage} footer={successFooter} /> : (
        <>
          <form ref={submission.formRef} className="pk-auth-form" aria-label="Reset your password" aria-busy={submission.pending || undefined} method="post" noValidate onSubmit={submission.handleSubmit}>
            {submission.error ? <AuthErrorSummary ref={submission.messageRef} message={submission.error} /> : null}
            <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required readOnly={submission.pending} error={submission.fieldErrors.email} startAdornment={<MailIcon />} />
            <Button type="submit" loading={submission.pending} fullWidth>Send reset instructions</Button>
          </form>
          <AuthAdditionalMethods>{additionalMethods}</AuthAdditionalMethods>
        </>
      )}
    </AuthLayout>
  );
}
