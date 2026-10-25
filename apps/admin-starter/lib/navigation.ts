export const adminSections = ["dashboard", "records", "team", "notifications", "documents", "settings"] as const;
export type AdminSection = typeof adminSections[number];
export function isAdminSection(value: string): value is AdminSection { return adminSections.some(section => section === value); }
export const sectionLabels: Record<AdminSection, string> = {
  dashboard: "Dashboard", records: "Records", team: "Team", notifications: "Notifications", documents: "Documents", settings: "Settings",
};
