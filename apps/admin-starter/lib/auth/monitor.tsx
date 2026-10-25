import "server-only";
import { starterAuthSettings } from "./settings";
import { SessionRecovery } from "./session-recovery";

export function StarterSessionMonitor() {
  const settings = starterAuthSettings();
  return settings.mode === "supabase" ? <SessionRecovery config={settings.config} /> : null;
}
