"use client";

import { PageHeader, RoleCapabilityEditor, SelectField, Stack, type RoleCapabilityEditorProps } from "@evenkit/ui";

export interface RoleSettingsProps extends Omit<RoleCapabilityEditorProps, "role"> {
  roles: readonly RoleCapabilityEditorProps["role"][];
  roleId: string;
  onRoleChange: (id: string) => void;
}

/** Role IDs, capability meanings and every authorization decision belong to the host. */
export function RoleSettings({ roles, roleId, onRoleChange, ...editor }: RoleSettingsProps) {
  const role = roles.find(item => item.id === roleId);
  return <Stack gap="6">
    <PageHeader title="Roles and capabilities" headingAs="h2" description="Review what each role allows in this application." actions={<SelectField label="Role to edit" value={role?.id ?? ""} placeholder="Choose a role" options={roles.map(item => ({ value: item.id, label: item.label }))} onValueChange={onRoleChange} />} />
    {role ? <RoleCapabilityEditor {...editor} role={role} /> : <p>Select an available role to review its capabilities.</p>}
  </Stack>;
}
