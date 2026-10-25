export interface TokenIssue { token: string; reason: "duplicate" | "invalid" | "limit"; message: string }

/** Tokens preserve their spelling; duplicate comparison ignores case by default. */
export function appendTokens(existing: readonly string[], candidates: readonly string[], options: {
  caseSensitive?: boolean;
  maxTokens?: number;
  validate?: (token: string) => string | undefined;
} = {}): { values: string[]; issues: TokenIssue[] } {
  const values = [...new Set(existing)];
  const key = (text: string) => options.caseSensitive ? text : text.toLowerCase();
  const seen = new Set(values.map(key));
  const issues: TokenIssue[] = [];
  for (const raw of candidates) {
    const token = raw.trim();
    if (!token) continue;
    const issue = options.validate?.(token);
    if (seen.has(key(token))) issues.push({ token, reason: "duplicate", message: `${token} is already added.` });
    else if (issue) issues.push({ token, reason: "invalid", message: issue });
    else if (options.maxTokens !== undefined && values.length >= options.maxTokens) issues.push({ token, reason: "limit", message: `Add up to ${options.maxTokens} values.` });
    else { values.push(token); seen.add(key(token)); }
  }
  return { values, issues };
}
