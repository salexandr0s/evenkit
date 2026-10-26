"use client";

import { Container, InvitationAcceptance, type InvitationAcceptanceProps } from "@evenkit/ui";

/** The host resolves the invitation and account state before rendering this page. */
export function InvitationPage(props: InvitationAcceptanceProps) {
  return <Container width="form"><InvitationAcceptance {...props} /></Container>;
}
