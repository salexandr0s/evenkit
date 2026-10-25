"use client";

import { createBrowserClient } from "@supabase/ssr";
import { parseAuthConfig, type AuthConfig } from "./config.js";

export type { AuthConfig } from "./config.js";

/** Only public connection settings cross this boundary. Never pass server credentials. */
export function createBrowserAuth(config: AuthConfig) {
  const parsed = parseAuthConfig(config);
  return createBrowserClient(parsed.url, parsed.publishableKey);
}
