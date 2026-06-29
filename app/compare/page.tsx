import { getScoreboard } from "@/lib/board";
import { CompareView } from "@/components/CompareView";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const board = await getScoreboard();
  return <CompareView initialBoard={board} />;
}
