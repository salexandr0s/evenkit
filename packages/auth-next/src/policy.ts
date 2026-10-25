/** Identity is verified with the provider before application policy runs. */
export interface AuthIdentity { id: string; email?: string; emailConfirmed: boolean }
export type EligibilityPolicy = (identity: AuthIdentity) => boolean | Promise<boolean>;

export interface VerifiedUserPort {
  getUser(): Promise<{
    data: { user: { id: string; email?: string; email_confirmed_at?: string } | null };
    error: { name?: string | undefined; status?: number | undefined } | null;
  }>;
}

export type AccessResult =
  | { status: "allowed"; identity: AuthIdentity }
  | { status: "anonymous" | "denied" | "unavailable" };

/** No default permission and no decisions based on user-editable metadata. */
export async function verifyAccess(auth: VerifiedUserPort, eligible: EligibilityPolicy): Promise<AccessResult> {
  try {
    const { data, error } = await auth.getUser();
    if (error) return { status: error.name === "AuthSessionMissingError" || error.status === 401 ? "anonymous" : "unavailable" };
    if (!data.user) return { status: "anonymous" };
    const identity: AuthIdentity = { id: data.user.id, ...(data.user.email ? { email: data.user.email } : {}), emailConfirmed: Boolean(data.user.email_confirmed_at) };
    return await eligible(identity) ? { status: "allowed", identity } : { status: "denied" };
  } catch { return { status: "unavailable" }; }
}
