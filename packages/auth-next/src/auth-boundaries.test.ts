import { describe, expect, it } from "vitest";
import { safeReturnPath } from "./paths.js";
import { parseAuthConfig, trustedOrigin } from "./config.js";
import { verifyAccess, type VerifiedUserPort } from "./policy.js";

const user = { id: "fixture-user", email: "alex@example.test", email_confirmed_at: "2026-01-01" };
const port = (result: Awaited<ReturnType<VerifiedUserPort["getUser"]>>): VerifiedUserPort => ({ getUser: async () => result });

describe("authentication boundaries", () => {
  it("rejects external and parser-ambiguous continuation paths", () => {
    for (const value of ["https://evil.test", "//evil.test", "/\\evil.test", "/%2f%2fevil.test", "/%255cevil.test", "/%0aevil.test", "/foo\nbar", "javascript:alert(1)", "/%zz", "/a/..//evil.test", "/%2e//evil.test"]) expect(safeReturnPath(value)).toBe("/dashboard");
    expect(safeReturnPath("/records?workspace=studio#detail")).toBe("/records?workspace=studio#detail");
    expect(safeReturnPath("/records/../team")).toBe("/team");
    expect(safeReturnPath(null, "//evil.test")).toBe("/dashboard");
  });
  it("refuses secret keys and untrusted origin configuration", () => {
    expect(() => parseAuthConfig({ url: "https://project.supabase.co", publishableKey: "sb_secret_do-not-use" })).toThrow();
    const legacy = `header.${btoa(JSON.stringify({ role: "anon" }))}.signature`;
    expect(parseAuthConfig({ url: "http://127.0.0.1:54321", publishableKey: legacy }).publishableKey).toBe(legacy);
    expect(() => trustedOrigin("https://site.test/callback")).toThrow();
    expect(() => trustedOrigin("http://public.test")).toThrow();
    expect(trustedOrigin("http://localhost:3040")).toBe("http://localhost:3040");
  });
  it("requires both verified identity and explicit application eligibility", async () => {
    expect(await verifyAccess(port({ data: { user }, error: null }), () => false)).toEqual({ status: "denied" });
    const allowed = await verifyAccess(port({ data: { user }, error: null }), identity => identity.id === "fixture-user" && identity.emailConfirmed);
    expect(allowed.status).toBe("allowed");
    expect(await verifyAccess(port({ data: { user: null }, error: { name: "AuthSessionMissingError" } }), () => true)).toEqual({ status: "anonymous" });
    expect(await verifyAccess(port({ data: { user }, error: { status: 503 } }), () => true)).toEqual({ status: "unavailable" });
    expect(await verifyAccess(port({ data: { user }, error: null }), () => { throw new Error("Policy offline"); })).toEqual({ status: "unavailable" });
  });
});
