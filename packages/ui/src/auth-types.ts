import type { ReactNode } from "react";

export interface AuthError<Field extends string> {
  /** Application-safe feedback; adapt raw provider errors before returning them. */
  message: string;
  fieldErrors?: Partial<Record<Field, string>>;
}

export type AuthResult<Field extends string> =
  | { status: "success"; message?: string }
  | { status: "error"; error: AuthError<Field> };

export interface LoginValues { email: string; password: string }
export interface SignupValues { email: string; password: string }
export interface PasswordResetValues { email: string }
export interface NewPasswordValues { password: string }

export type LoginField = "email" | "password";
export type SignupField = "email" | "password" | "confirmPassword";
export type PasswordResetField = "email";
export type NewPasswordField = "password" | "confirmPassword";

/** Signup may require verification or further steps; the application names the actual outcome. */
export type SignupResult =
  | { status: "success"; message: string }
  | { status: "error"; error: AuthError<SignupField> };

export interface AuthPageProps {
  brand?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  successFooter?: ReactNode;
  additionalMethods?: ReactNode;
  contentAs?: "main" | "section";
  headingAs?: "h1" | "h2";
  className?: string;
}

export interface PasswordPolicyProps {
  /** Return an application-safe error message, or undefined when the password is accepted. */
  validatePassword?: (password: string) => string | undefined;
  passwordHint?: ReactNode;
}
