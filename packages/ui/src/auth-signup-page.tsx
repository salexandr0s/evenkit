"use client";

import { AuthAdditionalMethods, AuthErrorSummary, AuthLayout, AuthSuccess } from "./auth-layout.js";
import { Button } from "./button.js";
import { TextField } from "./field.js";
import { MailIcon } from "./icons.js";
import { PasswordField } from "./form-controls.js";
import { emailError, formString, useAuthSubmission } from "./use-auth-submission.js";
import type { AuthSubmissionContext, AuthPageProps, PasswordPolicyProps, SignupField, SignupResult, SignupValues } from "./auth-types.js";

export interface SignupPageProps extends AuthPageProps, PasswordPolicyProps {
  onSubmit: (values: SignupValues, context: AuthSubmissionContext) => Promise<SignupResult>;
}

interface SignupFormValues extends SignupValues { confirmPassword: string }

export function SignupPage({ onSubmit, contextKey, validatePassword, passwordHint, brand, title = "Create an account", description = "Use your email address and choose a password.", footer, successFooter, additionalMethods, contentAs = "main", headingAs = "h1", className }: SignupPageProps) {
  const submission = useAuthSubmission<SignupFormValues, SignupField>({
    onSubmit: ({ email, password }, context) => onSubmit({ email, password }, context),
    contextKey,
    getValues(form) {
      const data = new FormData(form);
      return { email: formString(data, "email").trim(), password: formString(data, "password"), confirmPassword: formString(data, "confirmPassword") };
    },
    validate(values) {
      const errors: Partial<Record<SignupField, string>> = {};
      const invalidEmail = emailError(values.email);
      if (invalidEmail) errors.email = invalidEmail;
      if (!values.password) errors.password = "Enter a password.";
      else {
        const policyError = validatePassword?.(values.password);
        if (policyError?.trim()) errors.password = policyError;
      }
      if (!values.confirmPassword) errors.confirmPassword = "Confirm your password.";
      else if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords must match.";
      return errors;
    },
    fieldOrder: ["email", "password", "confirmPassword"],
    successMessage: "",
    requireSuccessMessage: true,
  });

  return (
    <AuthLayout brand={brand} title={title} description={description} footer={footer} contentAs={contentAs} headingAs={headingAs} className={className}>
      {submission.succeeded ? <AuthSuccess ref={submission.messageRef} message={submission.successMessage} footer={successFooter} /> : (
        <>
          <form ref={submission.formRef} className="pk-auth-form" aria-label="Create an account" aria-busy={submission.pending || undefined} method="post" noValidate onSubmit={submission.handleSubmit}>
            {submission.error ? <AuthErrorSummary ref={submission.messageRef} message={submission.error} /> : null}
            <TextField label="Email" name="email" type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} required readOnly={submission.pending} error={submission.fieldErrors.email} startAdornment={<MailIcon />} />
            <PasswordField label="Password" name="password" autoComplete="new-password" required readOnly={submission.pending} hint={passwordHint} error={submission.fieldErrors.password} />
            <PasswordField label="Confirm password" name="confirmPassword" autoComplete="new-password" required readOnly={submission.pending} error={submission.fieldErrors.confirmPassword} showLabel="Show confirm password" hideLabel="Hide confirm password" />
            <Button type="submit" loading={submission.pending} fullWidth>Create account</Button>
            {submission.pending ? <Button type="button" variant="secondary" onClick={submission.cancel}>Cancel request</Button> : null}
          </form>
          <AuthAdditionalMethods>{additionalMethods}</AuthAdditionalMethods>
        </>
      )}
    </AuthLayout>
  );
}
