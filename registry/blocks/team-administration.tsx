"use client";

import type { ReactNode } from "react";
import { PageHeader, SettingsLayout, Stack, TeamMembers, type TeamMembersProps } from "@evenkit/ui";

export interface TeamAdministrationProps {
  teamName: string;
  section: "members" | "roles" | "audit";
  onSectionChange: (section: "members" | "roles" | "audit") => void;
  members: TeamMembersProps;
  roles?: ReactNode;
  audit?: ReactNode;
}

/** Copy this layout and connect each section to your application's routing. */
export function TeamAdministration({ teamName, section, onSectionChange, members, roles, audit }: TeamAdministrationProps) {
  const items = [{ id: "members", label: "Members and invitations" }, ...(roles ? [{ id: "roles", label: "Roles and capabilities" }] : []), ...(audit ? [{ id: "audit", label: "Audit history" }] : [])];
  const active = items.some(item => item.id === section) ? section : "members";
  if (items.length === 1) return <TeamMembers {...members} />;
  return <Stack gap="6">
    <PageHeader title={teamName} headingAs="h2" description="Manage the people and access settings for this team." />
    <SettingsLayout items={items} activeId={active} navigationLabel="Team settings" onNavigate={next => { if (next === "members" || next === "roles" || next === "audit") onSectionChange(next); }}>
      {active === "members" ? <TeamMembers {...members} /> : active === "roles" ? roles : audit}
    </SettingsLayout>
  </Stack>;
}
