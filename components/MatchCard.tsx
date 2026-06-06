import type { Match, MatchSide } from "@/lib/types";
import { ROUND_SHORT, matchTime } from "@/lib/format";

function SideRow({ side, dim, pending }: { side: MatchSide; dim: boolean; pending: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-2 ${dim ? "opacity-55" : ""}`}>
      <div className="flex items-center gap-2 min-w-0">
        {side.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={side.logo} alt="" className="w-5 h-5 object-contain shrink-0" />
        ) : (
          <span className="w-5 h-5 shrink-0 rounded bg-surface-2 text-[9px] font-bold grid place-items-center text-ink-dim">
            {side.abbr}
          </span>
        )}
        <span className="truncate text-sm font-medium">{side.name}</span>
      </div>
      <span className="text-sm font-bold tabular-nums text-ink-dim">
        {pending ? "–" : (side.score ?? "–")}
      </span>
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const live = match.state === "in";
  const post = match.state === "post";
  const homeLost = post && match.away.winner;
  const awayLost = post && match.home.winner;

  return (
    <div className="card p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-ink-faint font-semibold">
          {ROUND_SHORT[match.round]}
        </span>
        {live ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-pitch-bright">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-pitch-bright" />
            {match.statusDetail || "LIVE"}
          </span>
        ) : post ? (
          <span className="text-[10px] font-semibold text-ink-faint">{match.statusDetail || "FT"}</span>
        ) : (
          <span className="text-[10px] text-ink-faint">{matchTime(match.date)}</span>
        )}
      </div>
      <div className="space-y-1.5">
        <SideRow side={match.home} dim={homeLost} pending={match.state === "pre"} />
        <SideRow side={match.away} dim={awayLost} pending={match.state === "pre"} />
      </div>
    </div>
  );
}
