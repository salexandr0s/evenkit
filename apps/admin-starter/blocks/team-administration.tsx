"use client";

import type { ReactNode } from "react";
import { SectionHeader, SettingsLayout, Stack, TeamMembers, type TeamMembersProps } from "@evenkit/ui";

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
  return <Stack gap="6">
    <SectionHeader title={teamName} description="Members, roles and team activity." />
    <SettingsLayout items={items} activeId={active} navigationLabel="Team settings" onNavigate={next => { if (next === "members" || next === "roles" || next === "audit") onSectionChange(next); }}>
      {active === "members" ? <TeamMembers {...members} /> : active === "roles" ? roles : audit}
    </SettingsLayout>
  </Stack>;
}
