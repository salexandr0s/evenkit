"use client";

import { AuthAdditionalMethods, AuthErrorSummary, AuthLayout, AuthSuccess } from "./auth-layout.js";
import { Button } from "./button.js";
import { TextField } from "./field.js";
import { MailIcon } from "./icons.js";
import { PasswordField } from "./form-controls.js";
import { emailError, formString, useAuthSubmission } from "./use-auth-submission.js";
import type { ReactNode } from "react";
import type { AuthSubmissionContext, AuthPageProps, AuthResult, LoginField, LoginValues } from "./auth-types.js";

export interface LoginPageProps extends AuthPageProps {
  onSubmit: (values: LoginValues, context: AuthSubmissionContext) => Promise<AuthResult<LoginField>>;
  forgotPasswordLink?: ReactNode;
}

export function LoginPage({ onSubmit, contextKey, forgotPasswordLink, brand, title = "Sign in", description = "Enter your email and password to continue.", footer, successFooter, additionalMethods, contentAs = "main", headingAs = "h1", className }: LoginPageProps) {
  const submission = useAuthSubmission<LoginValues, LoginField>({
    onSubmit,
    contextKey,
    getValues(form) {
      const data = new FormData(form);
      return { email: formString(data, "email").trim(), password: formString(data, "password") };
    },
    validate(values) {
      const errors: Partial<Record<LoginField, string>> = {};
      const invalidEmail = emailError(values.email);
      if (invalidEmail) errors.email = invalidEmail;
      if (!values.password) errors.password = "Enter your password.";
      return errors;
    },
    fieldOrder: ["email", "password"],
    successMessage: "Sign-in completed.",
  });

  return (
    <AuthLayout brand={brand} title={title} description={description} footer={footer} contentAs={contentAs} headingAs={headingAs} className={className}>
      {submission.succeeded ? <AuthSuccess ref={submission.messageRef} message={submission.successMessage} footer={successFooter} /> : (
        <>
          <form ref={submission.formRef} className="pk-auth-form" aria-label="Sign in" aria-busy={submission.pending || undefined} method="post" noValidate onSubmit={submission.handleSubmit}>
            {submission.error ? <AuthErrorSummary ref={submission.messageRef} message={submission.error} /> : null}
            <TextField label="Email" name="email" type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} required readOnly={submission.pending} error={submission.fieldErrors.email} startAdornment={<MailIcon />} />
            <PasswordField label="Password" name="password" autoComplete="current-password" required readOnly={submission.pending} error={submission.fieldErrors.password} />
            {forgotPasswordLink ? <div className="pk-auth-inline-navigation">{forgotPasswordLink}</div> : null}
            <Button type="submit" loading={submission.pending} fullWidth>Sign in</Button>
            {submission.pending ? <Button type="button" variant="secondary" onClick={submission.cancel}>Cancel request</Button> : null}
          </form>
          <AuthAdditionalMethods>{additionalMethods}</AuthAdditionalMethods>
        </>
      )}
    </AuthLayout>
  );
}
