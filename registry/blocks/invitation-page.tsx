"use client";

import { Container, InvitationAcceptance, PageHeader, Stack, type InvitationAcceptanceProps } from "@evenkit/ui";

/** The host resolves the invitation and account state before rendering this page. */
export function InvitationPage(props: InvitationAcceptanceProps) {
  return <Container width="form"><Stack gap="6">
    <PageHeader title="Your team invitation" headingAs="h2" description="Review the invitation and the account you want to use." />
    <InvitationAcceptance {...props} />
  </Stack></Container>;
}
