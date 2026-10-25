import type { ReactNode } from "react";
import { StarterProviders } from "../../components/starter-providers";
import { StarterSessionMonitor } from "../../lib/auth/monitor";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <StarterProviders><StarterSessionMonitor />{children}</StarterProviders>;
}
