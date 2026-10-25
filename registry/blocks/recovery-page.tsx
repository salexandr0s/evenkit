"use client";

import { CircleHelpIcon, Container, EmptyState, InfoIcon, SettingsIcon, ShieldIcon, TriangleAlertIcon, type EmptyStateTitleTag } from "@evenkit/ui";
import type { ReactNode } from "react";

export type RecoveryKind = "not-found" | "unavailable" | "denied" | "offline" | "maintenance";
export interface RecoveryPageProps {
  kind: RecoveryKind;
  action: ReactNode;
  secondaryAction?: ReactNode;
  title?: string;
  description?: string;
  headingAs?: EmptyStateTitleTag;
}
const content: Record<RecoveryKind, { title: string; description: string; icon: ReactNode }> = {
  "not-found": { title: "Page not found", description: "This page may have moved, or the address may be incomplete. Return to a page you know.", icon: <CircleHelpIcon size="lg" /> },
  unavailable: { title: "This page is unavailable", description: "The request could not be completed. Try again, or return to your workspace.", icon: <TriangleAlertIcon size="lg" /> },
  denied: { title: "Access is restricted", description: "Your account does not have access to this page. Contact your workspace administrator if you need access.", icon: <ShieldIcon size="lg" /> },
  offline: { title: "You are offline", description: "Reconnect to load the latest information. Any draft retained by your application remains available there.", icon: <InfoIcon size="lg" /> },
  maintenance: { title: "Maintenance in progress", description: "This service is temporarily unavailable. Check its status or return later.", icon: <SettingsIcon size="lg" /> },
};
/** Editable presentation block. The application decides which state applies. */
export function RecoveryPage({ kind, action, secondaryAction, title, description, headingAs = "h1" }: RecoveryPageProps) {
  return <section className="pk-recovery-page" data-kind={kind}><Container width="form"><EmptyState title={title ?? content[kind].title} description={description ?? content[kind].description} titleAs={headingAs} icon={content[kind].icon} action={action} secondaryAction={secondaryAction} /></Container></section>;
}
