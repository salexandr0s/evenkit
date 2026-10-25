import { AdminWorkspace } from "../../../../components/admin-workspace";
import { requireStarterSession } from "../../../../lib/auth/server";

export default async function RecordPage({ params }: { params: Promise<{ recordId: string }> }) {
  const { recordId } = await params;
  const session = await requireStarterSession(`/records/${encodeURIComponent(recordId)}`);
  return <AdminWorkspace section="records" recordId={recordId} session={session} />;
}
