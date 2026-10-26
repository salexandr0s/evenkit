import { safeReturnPath } from "@evenkit/auth-next/paths";
import { trustedOrigin } from "@evenkit/auth-next/server";
import { AuthClientFixture } from "./preview-client";

export default function AuthPackagePage() {
  return <main>
    <h1>Packed auth boundaries</h1>
    <p>{trustedOrigin("http://localhost:3000")}</p>
    <p>{safeReturnPath("https://untrusted.example/continue")}</p>
    <AuthClientFixture />
  </main>;
}
