import type { Match } from "@/lib/types";
import { MatchCard } from "./MatchCard";

/** Horizontal strip of live + today's matches, shown above the leaderboard. */
export function LiveStrip({ matches, title }: { matches: Match[]; title: string }) {
  if (!matches.length) return null;
  return (
    <section className="mb-5">
      <h2 className="text-xs uppercase tracking-wider text-ink-faint font-semibold mb-2">
        {title}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {matches.map((m) => (
          <div key={m.id} className="min-w-[230px] snap-start">
            <MatchCard match={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
