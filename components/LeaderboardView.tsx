"use client";

import { useMemo, useState } from "react";
import type { Scoreboard, ScoredParticipant } from "@/lib/types";
import { useScoreboard } from "@/lib/useScoreboard";
import { rankColor } from "@/lib/format";
import { RefreshBar } from "./RefreshBar";
import { LiveStrip } from "./LiveStrip";
import { PickCard } from "./PickCard";

const MEDAL = ["🥇", "🥈", "🥉"];
const PAYOUT = ["$602", "$238", "$20"];

export function LeaderboardView({
  initialBoard,
  placeholder,
}: {
  initialBoard: Scoreboard;
  placeholder: boolean;
}) {
  const { board, refreshing, refresh } = useScoreboard(initialBoard);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return board.participants;
    return board.participants.filter((p) => p.name.toLowerCase().includes(q));
  }, [board.participants, query]);

  const strip =
    board.liveMatches.length > 0
      ? { title: "Live Now", matches: board.liveMatches }
      : board.todayMatches.length > 0
        ? { title: "Today", matches: board.todayMatches }
        : { title: "Up Next", matches: board.upcomingMatches };

  const top3 = board.participants.slice(0, 3);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-sm text-ink-dim mt-0.5">
            {board.participants.length} entries ·{" "}
            {board.tournamentStarted ? "tournament underway" : "kicks off June 11"}
          </p>
        </div>
        <RefreshBar updatedAt={board.updatedAt} refreshing={refreshing} onRefresh={refresh} />
      </div>

      {placeholder && (
        <div className="card border-gold/30 bg-gold/5 p-3 mb-5 text-sm text-ink-dim">
          <span className="text-gold font-semibold">Sample data.</span> These are placeholder
          entries so you can see the app live. Real picks load once the pool closes (Wed 6/10,
          8pm&nbsp;ET).
        </div>
      )}

      <LiveStrip title={strip.title} matches={strip.matches} />

      {top3.length === 3 && !query && (
        <section className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {top3.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setOpen(open === p.id ? null : p.id)}
              className={`card p-3 sm:p-4 text-left rise relative ${
                i === 0 ? "border-gold/40" : i === 1 ? "border-silver/30" : "border-bronze/30"
              }`}
            >
              <span className="absolute top-2.5 right-2.5 text-xs sm:text-sm font-bold text-gold">
                {PAYOUT[i]}
              </span>
              <div className="text-2xl">{MEDAL[i]}</div>
              <div className="font-semibold text-sm mt-1 truncate">{p.name}</div>
              <div className={`text-2xl font-extrabold tabular-nums ${rankColor(p.rank)}`}>
                {p.total}
              </div>
              <div className="text-[10px] text-ink-faint uppercase tracking-wide">points</div>
            </button>
          ))}
        </section>
      )}

      <div className="mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search participants…"
          className="w-full rounded-xl bg-surface border border-line px-4 py-2.5 text-sm outline-none focus:border-pitch transition-colors placeholder:text-ink-faint"
        />
      </div>

      <ul className="space-y-1.5">
        {filtered.map((p) => (
          <ParticipantRow
            key={p.id}
            p={p}
            board={board}
            open={open === p.id}
            onToggle={() => setOpen(open === p.id ? null : p.id)}
          />
        ))}
        {filtered.length === 0 && (
          <li className="text-center text-sm text-ink-faint py-8">No participants match.</li>
        )}
      </ul>
    </div>
  );
}

function ParticipantRow({
  p,
  board,
  open,
  onToggle,
}: {
  p: ScoredParticipant;
  board: Scoreboard;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-left hover:bg-surface-2/40 transition-colors"
      >
        <span className={`w-8 text-center font-bold tabular-nums ${rankColor(p.rank)}`}>
          {p.rank}
        </span>
        <span className="flex-1 font-medium truncate">{p.name}</span>
        <span className="text-lg font-extrabold tabular-nums text-gradient">{p.total}</span>
        <span
          className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-line p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-midnight/40">
          {p.picks.map((pick) => (
            <PickCard key={pick.espnId} pick={pick} state={board.teamStates[pick.espnId]} />
          ))}
        </div>
      )}
    </li>
  );
}
