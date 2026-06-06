import type { ScoredPick, TeamState } from "@/lib/types";
import { teamStatus, type StatusTone } from "@/lib/format";

const TONE_CLASS: Record<StatusTone, string> = {
  champion: "text-gold border-gold/40 bg-gold/10",
  alive: "text-pitch-bright border-pitch/30 bg-pitch/10",
  out: "text-ink-faint border-line bg-surface-2/40 line-through decoration-ink-faint/50",
  neutral: "text-ink-dim border-line bg-surface-2/40",
};

export function PickCard({
  pick,
  state,
}: {
  pick: ScoredPick;
  state?: TeamState;
}) {
  const status = teamStatus(state);
  return (
    <div className="rounded-xl border border-line bg-midnight-2/60 p-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">
            Group {pick.tier}
          </div>
          <div className="font-semibold text-sm truncate">{pick.teamName}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold tabular-nums text-gradient">{pick.total}</div>
          {pick.doubled && (
            <span className="text-[9px] font-bold text-gold tracking-wide">2× pts</span>
          )}
        </div>
      </div>

      <span
        className={`self-start text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${TONE_CLASS[status.tone]}`}
      >
        {status.label}
      </span>

      {pick.lines.length > 0 && (
        <ul className="text-[11px] text-ink-dim space-y-0.5">
          {pick.lines.map((l, i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <span className="truncate">{l.label}</span>
              <span className="tabular-nums text-ink shrink-0">+{l.points}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
