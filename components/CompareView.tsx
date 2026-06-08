"use client";

import { useMemo, useState } from "react";
import type { Scoreboard, ScoredParticipant, ScoredPick } from "@/lib/types";
import { useScoreboard } from "@/lib/useScoreboard";
import { RefreshBar } from "./RefreshBar";

export function CompareView({ initialBoard }: { initialBoard: Scoreboard }) {
  const { board, refreshing, refresh } = useScoreboard(initialBoard);
  const people = board.participants;

  const [idA, setIdA] = useState(people[0]?.id ?? "");
  const [idB, setIdB] = useState(people[1]?.id ?? people[0]?.id ?? "");

  const a = people.find((p) => p.id === idA);
  const b = people.find((p) => p.id === idB);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Head to Head</span>
          </h1>
          <p className="text-sm text-ink-dim mt-0.5">Compare any two entries, pick by pick</p>
        </div>
        <RefreshBar updatedAt={board.updatedAt} refreshing={refreshing} onRefresh={refresh} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <PersonPicker value={idA} onChange={setIdA} people={people} />
        <PersonPicker value={idB} onChange={setIdB} people={people} />
      </div>

      {a && b ? <Comparison a={a} b={b} /> : <p className="text-ink-faint text-sm">Pick two entries.</p>}
    </div>
  );
}

function PersonPicker({
  value,
  onChange,
  people,
}: {
  value: string;
  onChange: (id: string) => void;
  people: ScoredParticipant[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl bg-surface border border-line px-3 py-2.5 text-sm outline-none focus:border-pitch transition-colors"
    >
      {people.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}

function byTier(picks: ScoredPick[]) {
  const map = new Map<number, ScoredPick>();
  for (const p of picks) map.set(p.tier, p);
  return map;
}

function Comparison({ a, b }: { a: ScoredParticipant; b: ScoredParticipant }) {
  const aByTier = useMemo(() => byTier(a.picks), [a]);
  const bByTier = useMemo(() => byTier(b.picks), [b]);

  const aWins = a.total > b.total;
  const bWins = b.total > a.total;

  return (
    <div className="card overflow-hidden">
      {/* totals header */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3 border-b border-line bg-midnight/40">
        <div className="text-right">
          <div className="font-semibold truncate">{a.name}</div>
          <div className={`text-2xl font-extrabold tabular-nums ${aWins ? "text-pitch-bright" : "text-ink"}`}>
            {a.total}
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-wider text-ink-faint px-1">vs</div>
        <div className="text-left">
          <div className="font-semibold truncate">{b.name}</div>
          <div className={`text-2xl font-extrabold tabular-nums ${bWins ? "text-pitch-bright" : "text-ink"}`}>
            {b.total}
          </div>
        </div>
      </div>

      {/* per-tier rows */}
      <div>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((tier) => {
          const pa = aByTier.get(tier);
          const pb = bByTier.get(tier);
          const aLead = (pa?.total ?? 0) > (pb?.total ?? 0);
          const bLead = (pb?.total ?? 0) > (pa?.total ?? 0);
          return (
            <div
              key={tier}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2 border-t border-line/60"
            >
              <Cell
                name={pa?.teamName ?? "—"}
                points={pa?.total ?? 0}
                doubled={pa?.doubled ?? false}
                lead={aLead}
                align="right"
              />
              <div className="text-[10px] text-ink-faint text-center w-12">
                <div className="font-semibold">G{tier}</div>
                {tier >= 7 && <div className="text-gold">2×</div>}
              </div>
              <Cell
                name={pb?.teamName ?? "—"}
                points={pb?.total ?? 0}
                doubled={pb?.doubled ?? false}
                lead={bLead}
                align="left"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Cell({
  name,
  points,
  lead,
  align,
}: {
  name: string;
  points: number;
  doubled: boolean;
  lead: boolean;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
        align === "right" ? "flex-row-reverse text-right" : "text-left"
      } ${lead ? "bg-pitch/10" : ""}`}
    >
      <span className={`text-base font-bold tabular-nums shrink-0 ${lead ? "text-pitch-bright" : "text-ink-dim"}`}>
        {points}
      </span>
      <span className="text-sm truncate">{name}</span>
    </div>
  );
}
