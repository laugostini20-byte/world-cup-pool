export const metadata = { title: "Rules — 2026 World Cup Pool" };

const SCORING = [
  { event: "Each goal scored (any round)", pts: "1" },
  { event: "Each point earned in group play (W=3, D=1)", pts: "1" },
  { event: "Finish 3rd in group but advance to knockout", pts: "2" },
  { event: "Finish 2nd in group", pts: "4" },
  { event: "Win group", pts: "8" },
  { event: "Reach Round of 16", pts: "12" },
  { event: "Reach Quarterfinals", pts: "18" },
  { event: "Reach Semifinals", pts: "24" },
  { event: "Reach Final", pts: "36" },
  { event: "Win the Final", pts: "48" },
];

export default function RulesPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
        <span className="text-gradient">How Scoring Works</span>
      </h1>
      <p className="text-sm text-ink-dim mb-6">
        Each participant picks one team from each of the 10 groups. Your score is the sum of
        all 10 teams&apos; points, updated live as matches finish.
      </p>

      <div className="card p-4 mb-6">
        <h2 className="font-bold mb-3 text-sm">Points per team</h2>
        <ul className="divide-y divide-line">
          {SCORING.map((row) => (
            <li key={row.event} className="flex items-center justify-between py-2 gap-4">
              <span className="text-sm text-ink-dim">{row.event}</span>
              <span className="text-sm font-bold tabular-nums text-pitch-bright shrink-0">
                {row.pts}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4 mb-4 border-gold/30 bg-gold/5">
        <h2 className="font-bold mb-1 text-sm text-gold">Groups 7–10 score double 🔥</h2>
        <p className="text-sm text-ink-dim">
          Every point above is <strong>doubled</strong> for teams picked from Groups 7 through 10.
          These are the long shots — reward for backing a dark horse that goes deep.
        </p>
      </div>

      <div className="card p-4 space-y-2 text-sm text-ink-dim">
        <h2 className="font-bold text-sm text-ink">Notes</h2>
        <p>
          <strong>Milestone points are cumulative</strong> — a team that reaches the Final earns
          the Round-of-16, Quarterfinal, Semifinal, and Final points along the way (plus the
          winner&apos;s points if it lifts the trophy).
        </p>
        <p>
          The groups are odds-based tiers, not the real World Cup groups. Goals, group-stage
          points, and placement all come from each team&apos;s actual performance in the
          tournament, pulled live from ESPN.
        </p>
      </div>
    </div>
  );
}
