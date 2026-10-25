import { AuthLayout, Button } from "@evenkit/ui";

export default function Page() {
  return <AuthLayout brand="Evenkit admin" title="Access is not enabled" description="Your account does not meet this application's access policy. Ask the application owner to review your access.">
    <div className="pk-auth-recovery"><a href="/login">Use another account</a><form action="/auth/sign-out" method="post"><Button type="submit" variant="secondary">Sign out</Button></form></div>
  </AuthLayout>;
}
