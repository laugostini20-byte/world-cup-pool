import { getScoreboard } from "@/lib/board";
import { MatchesView } from "@/components/MatchesView";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const board = await getScoreboard();
  return <MatchesView initialBoard={board} />;
}
