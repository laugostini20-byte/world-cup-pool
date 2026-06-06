"use client";

import type { Match, Scoreboard } from "@/lib/types";
import { useScoreboard } from "@/lib/useScoreboard";
import { MatchCard } from "./MatchCard";
import { RefreshBar } from "./RefreshBar";

function Section({ title, matches }: { title: string; matches: Match[] }) {
  if (!matches.length) return null;
  return (
    <section className="mb-6">
      <h2 className="text-xs uppercase tracking-wider text-ink-faint font-semibold mb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </section>
  );
}

export function MatchesView({ initialBoard }: { initialBoard: Scoreboard }) {
  const { board, refreshing, refresh } = useScoreboard(initialBoard);
  const empty =
    !board.liveMatches.length &&
    !board.todayMatches.length &&
    !board.upcomingMatches.length &&
    !board.recentMatches.length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Matches</span>
          </h1>
          <p className="text-sm text-ink-dim mt-0.5">Live scores and the fixture list</p>
        </div>
        <RefreshBar updatedAt={board.updatedAt} refreshing={refreshing} onRefresh={refresh} />
      </div>

      <Section title="Live Now" matches={board.liveMatches} />
      <Section title="Today" matches={board.todayMatches.filter((m) => m.state !== "in")} />
      <Section title="Recent Results" matches={board.recentMatches} />
      <Section title="Upcoming" matches={board.upcomingMatches} />

      {empty && (
        <div className="card p-8 text-center text-sm text-ink-faint">
          No fixtures available yet. The tournament kicks off June&nbsp;11.
        </div>
      )}
    </div>
  );
}
