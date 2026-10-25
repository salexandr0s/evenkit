/** Action outcomes describe UI feedback. Applications still authorize every request. */
export type TeamActionResult =
  | { status: "success"; message?: string }
  | { status: "denied" | "error" | "stale"; message: string };

export interface TeamActionContext {
  signal: AbortSignal;
  /** Include team, principal, policy and record revisions where relevant. */
  contextKey: string;
}

/** Labels and IDs come from the application; the kit does not interpret grants. */
export interface TeamRoleDefinition {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
