import { notFound } from "next/navigation";
import { AdminWorkspace } from "../../../components/admin-workspace";
import { isAdminSection } from "../../../lib/navigation";
import { requireStarterSession } from "../../../lib/auth/server";

export default async function AdminPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isAdminSection(section)) notFound();
  const session = await requireStarterSession(`/${section}`);
  return <AdminWorkspace section={section} session={session} />;
}
