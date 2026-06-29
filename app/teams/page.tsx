import { getScoreboard } from "@/lib/board";
import { TeamsView } from "@/components/TeamsView";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const board = await getScoreboard();
  return <TeamsView initialBoard={board} />;
}
