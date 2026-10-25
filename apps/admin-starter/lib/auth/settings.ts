import "server-only";
import { parseAuthConfig, trustedOrigin } from "@evenkit/auth-next/server";
import { z } from "zod";

export function starterAuthSettings() {
  const mode = z.enum(["demo", "supabase"]).parse(process.env.EVENKIT_AUTH_MODE ?? "demo");
  if (mode === "demo") return { mode, origin: trustedOrigin(process.env.EVENKIT_APP_ORIGIN ?? "http://127.0.0.1:5396") } as const;
  return {
    mode,
    config: parseAuthConfig({ url: process.env.SUPABASE_URL, publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY }),
    origin: trustedOrigin(z.string().parse(process.env.EVENKIT_APP_ORIGIN)),
    allowedUserIds: z.array(z.uuid()).parse((process.env.EVENKIT_ALLOWED_USER_IDS ?? "").split(",").map(value => value.trim()).filter(Boolean)),
    allowSignup: process.env.EVENKIT_ALLOW_SIGNUP === "true",
  } as const;
}
