"use client";

import { useEffect } from "react";
import type { AuthConfig } from "@evenkit/auth-next/client";
import { safeReturnPath } from "@evenkit/auth-next/paths";

/** Load the provider SDK only for an authenticated provider-mode application page. */
export function SessionRecovery({ config }: { config: AuthConfig }) {
  useEffect(() => {
    let active = true;
    let cleanup: (() => void) | undefined;
    function recover() {
      if (!active) return;
      active = false;
      const returnTo = safeReturnPath(`${window.location.pathname}${window.location.search}${window.location.hash}`);
      window.location.assign(`/session-expired?returnTo=${encodeURIComponent(returnTo)}`);
    }
    void import("@evenkit/auth-next/client").then(({ createBrowserAuth }) => {
      if (!active) return;
      const client = createBrowserAuth(config);
      const { data } = client.auth.onAuthStateChange(event => { if (event === "SIGNED_OUT") recover(); });
      async function checkSession() {
        const { data, error } = await client.auth.getUser();
        if (active && ((!error && !data.user) || error?.status === 401 || error?.name === "AuthSessionMissingError")) recover();
      }
      const onFocus = () => { void checkSession().catch(() => undefined); };
      window.addEventListener("focus", onFocus);
      const timer = window.setInterval(onFocus, 60_000);
      cleanup = () => { data.subscription.unsubscribe(); window.removeEventListener("focus", onFocus); window.clearInterval(timer); };
      onFocus();
    }).catch(() => { /* The next server request also checks session and provider availability. */ });
    return () => { active = false; cleanup?.(); };
  }, [config]);
  return null;
}
