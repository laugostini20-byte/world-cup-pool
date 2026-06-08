"use client";

import { useEffect, useState } from "react";
import type { PoolTeam } from "@/data/teams";
import { isDoubledTier } from "@/data/teams";
import type { SquadPlayer, TeamDetail, TeamState } from "@/lib/types";
import { teamStatus } from "@/lib/format";

const POS_GROUPS: { key: string; label: string }[] = [
  { key: "G", label: "Goalkeepers" },
  { key: "D", label: "Defenders" },
  { key: "M", label: "Midfielders" },
  { key: "F", label: "Forwards" },
];

function groupSquad(squad: SquadPlayer[]) {
  const groups = POS_GROUPS.map((g) => ({
    ...g,
    players: squad.filter((p) => p.position === g.key),
  }));
  const known = new Set(POS_GROUPS.map((g) => g.key));
  const others = squad.filter((p) => !known.has(p.position));
  if (others.length) groups.push({ key: "?", label: "Other", players: others });
  return groups.filter((g) => g.players.length > 0);
}

export function TeamModal({
  team,
  state,
  pickedBy,
  onClose,
}: {
  team: PoolTeam;
  state?: TeamState;
  pickedBy: string[];
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/team/${team.espnId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setDetail(d))
      .catch(() => alive && setDetail(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [team.espnId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const status = teamStatus(state);
  const doubled = isDoubledTier(team.tier);
  const accent = detail?.color ? `#${detail.color}` : "var(--color-pitch)";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="card w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-b-none sm:rounded-2xl rise"
        onClick={(e) => e.stopPropagation()}
      >
        {/* accent bar */}
        <div className="h-1.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${accent}, var(--color-gold))` }} />

        <div className="p-4 sm:p-5">
          {/* header */}
          <div className="flex items-start gap-3">
            {detail?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={detail.logo} alt="" className="w-12 h-12 object-contain shrink-0" />
            ) : (
              <span className="w-12 h-12 shrink-0 rounded-lg bg-surface-2 grid place-items-center text-xs font-bold text-ink-dim">
                {team.abbr}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold tracking-tight">{team.name}</h2>
                {doubled && (
                  <span className="text-[10px] font-bold text-gold border border-gold/40 bg-gold/10 px-1.5 py-0.5 rounded">
                    2× POINTS
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-dim mt-0.5">
                Group {team.tier} · FIFA #{team.fifaRank} · {team.odds} to win
              </p>
              <p className="text-xs text-pitch-bright mt-0.5">
                {detail?.standingSummary || status.label}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 grid place-items-center rounded-lg border border-line text-ink-dim hover:text-ink hover:border-pitch transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* live stats */}
          {state && (state.gamesPlayed > 0 || state.goals > 0) && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Stat label="Goals" value={state.goals} />
              <Stat label="Group Pts" value={state.groupPoints} />
              <Stat label="Record" value={`${state.wins}-${state.draws}-${state.losses}`} />
            </div>
          )}

          {/* picked by */}
          <Section title={`Picked by ${pickedBy.length} ${pickedBy.length === 1 ? "entry" : "entries"}`}>
            {pickedBy.length ? (
              <div className="flex flex-wrap gap-1.5">
                {pickedBy.map((name) => (
                  <span key={name} className="text-xs px-2 py-1 rounded-md bg-surface-2 border border-line">
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-faint">No one picked this team.</p>
            )}
          </Section>

          {/* squad */}
          <Section title="Squad">
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 rounded-md skeleton" />
                ))}
              </div>
            ) : detail && detail.squad.length ? (
              <div className="space-y-3">
                {detail.coach && (
                  <p className="text-xs text-ink-dim">
                    <span className="text-ink-faint">Coach:</span> {detail.coach}
                  </p>
                )}
                {groupSquad(detail.squad).map((g) => (
                  <div key={g.key}>
                    <div className="text-[10px] uppercase tracking-wider text-ink-faint mb-1">
                      {g.label}
                    </div>
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                      {g.players.map((p) => (
                        <li key={p.name} className="flex items-center gap-2 text-sm">
                          <span className="w-5 text-right text-ink-faint tabular-nums text-xs">
                            {p.jersey}
                          </span>
                          <span className="truncate">{p.name}</span>
                          {p.age && <span className="text-[10px] text-ink-faint ml-auto">{p.age}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-faint">Squad not available yet.</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-midnight-2/60 border border-line p-2 text-center">
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-ink-faint">{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 pt-4 border-t border-line">
      <h3 className="text-sm font-bold mb-2">{title}</h3>
      {children}
    </div>
  );
}
