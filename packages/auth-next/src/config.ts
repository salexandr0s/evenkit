import { z } from "zod";

const httpUrl = z.url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" || (url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname));
}, "Use HTTPS or a loopback URL for a local test provider.");

export const authConfigSchema = z.object({
  url: httpUrl,
  publishableKey: z.string().min(1).refine(value => {
    if (value.startsWith("sb_publishable_")) return true;
    try {
      const payload = value.split(".")[1];
      if (!payload) return false;
      const decoded: unknown = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
      return z.object({ role: z.literal("anon") }).safeParse(decoded).success;
    } catch { return false; }
  }, "Use a Supabase publishable or legacy anon key, never a secret/service-role key."),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;

export function parseAuthConfig(value: unknown): AuthConfig {
  return authConfigSchema.parse(value);
}

export function trustedOrigin(value: string): string {
  const url = new URL(httpUrl.parse(value));
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("The application origin must have no credentials, path, query, or fragment.");
  return url.origin;
}
