import { getScoreboard } from "@/lib/board";
import { MatchesView } from "@/components/MatchesView";

export const revalidate = 60;

export default async function MatchesPage() {
  const board = await getScoreboard();
  return <MatchesView initialBoard={board} />;
}
