import type { ReactNode } from "react";
import { StarterProviders } from "../../components/starter-providers";
import { NotificationDemoProvider } from "../../components/notification-demo-provider";
import { StarterSessionMonitor } from "../../lib/auth/monitor";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <StarterProviders><NotificationDemoProvider><StarterSessionMonitor />{children}</NotificationDemoProvider></StarterProviders>;
}
