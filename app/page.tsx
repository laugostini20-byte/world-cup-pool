import { getScoreboard } from "@/lib/board";
import { PICKS_ARE_PLACEHOLDER } from "@/data/picks";
import { LeaderboardView } from "@/components/LeaderboardView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const board = await getScoreboard();
  return <LeaderboardView initialBoard={board} placeholder={PICKS_ARE_PLACEHOLDER} />;
}
