import { getScoreboard } from "@/lib/board";
import { TeamsView } from "@/components/TeamsView";

export const revalidate = 60;

export default async function TeamsPage() {
  const board = await getScoreboard();
  return <TeamsView initialBoard={board} />;
}
