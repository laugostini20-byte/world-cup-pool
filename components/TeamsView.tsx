"use client";

import { useMemo, useState } from "react";
import type { Scoreboard } from "@/lib/types";
import { POOL_TEAMS, tiers, type PoolTeam } from "@/data/teams";
import { useScoreboard } from "@/lib/useScoreboard";
import { teamStatus, type StatusTone } from "@/lib/format";
import { RefreshBar } from "./RefreshBar";
import { TeamModal } from "./TeamModal";

const DOT: Record<StatusTone, string> = {
  champion: "bg-gold",
  alive: "bg-pitch-bright",
  out: "bg-ink-faint",
  neutral: "bg-ink-faint/50",
};

export function TeamsView({ initialBoard }: { initialBoard: Scoreboard }) {
  const { board, refreshing, refresh } = useScoreboard(initialBoard);
  const [selected, setSelected] = useState<PoolTeam | null>(null);

  const pickedBy = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const p of board.participants) {
      for (const id of p.picks.map((pick) => pick.espnId)) {
        (map[id] ??= []).push(p.name);
      }
    }
    return map;
  }, [board.participants]);

  const totalPicks = POOL_TEAMS.length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Teams</span>
          </h1>
          <p className="text-sm text-ink-dim mt-0.5">
            All {totalPicks} teams across 10 groups · Groups 7–10 score double
          </p>
        </div>
        <RefreshBar updatedAt={board.updatedAt} refreshing={refreshing} onRefresh={refresh} />
      </div>

      <div className="space-y-6">
        {tiers().map(({ tier, doubled, teams }) => (
          <section key={tier}>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-bold">Group {tier}</h2>
              {doubled && (
                <span className="text-[10px] font-bold text-gold border border-gold/40 bg-gold/10 px-1.5 py-0.5 rounded">
                  2× POINTS
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {teams.map((team) => {
                const state = board.teamStates[team.espnId];
                const status = teamStatus(state);
                const fans = pickedBy[team.espnId]?.length ?? 0;
                return (
                  <button
                    key={team.espnId}
                    onClick={() => setSelected(team)}
                    className="card p-3 text-left hover:border-pitch/50 hover:bg-surface-2/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm truncate">{team.name}</span>
                      <span className="text-[10px] text-ink-faint shrink-0">{team.odds}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className={`w-2 h-2 rounded-full ${DOT[status.tone]}`} />
                      <span className="text-[11px] text-ink-dim">{status.label}</span>
                    </div>
                    {state && (state.goals > 0 || state.groupPoints > 0) && (
                      <div className="text-[11px] text-ink-faint mt-1">
                        {state.goals} GF · {state.groupPoints} grp pts
                      </div>
                    )}
                    <div className="text-[11px] text-pitch-bright mt-1.5">
                      {fans} {fans === 1 ? "entry" : "entries"} picked
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <TeamModal
          team={selected}
          state={board.teamStates[selected.espnId]}
          pickedBy={pickedBy[selected.espnId] ?? []}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
