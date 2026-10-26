"use client";

import { createBrowserAuth } from "@evenkit/auth-next/client";

export function AuthClientFixture() {
  return <p>Packed auth client: {typeof createBrowserAuth === "function" ? "available" : "missing"}</p>;
}
