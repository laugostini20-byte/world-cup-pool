import { getGroupTables } from "@/lib/espn";
import { GroupsView } from "@/components/GroupsView";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const tables = await getGroupTables();
  return <GroupsView initial={{ updatedAt: new Date().toISOString(), tables }} />;
}
