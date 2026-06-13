import { POOL_TEAMS, TEAMS_BY_ID, isDoubledTier } from "@/data/teams";
import { roundOrder } from "./espn";
import type {
  Match,
  Participant,
  RoundKey,
  ScoredParticipant,
  ScoredPick,
  ScoreLine,
  TeamScore,
  TeamState,
} from "./types";

const EMPTY_REACHED: Record<RoundKey, boolean> = {
  group: false,
  r32: false,
  r16: false,
  qf: false,
  sf: false,
  third: false,
  final: false,
};

/** Combine standings + fixtures into one live state object per pool team. */
export function buildTeamStates(
  standings: Record<string, Partial<TeamState>>,
  matches: Match[],
): Record<string, TeamState> {
  const states: Record<string, TeamState> = {};

  for (const team of POOL_TEAMS) {
    const id = team.espnId;
    const s = standings[id] ?? {};
    states[id] = {
      espnId: id,
      groupLetter: s.groupLetter ?? null,
      groupPoints: s.groupPoints ?? 0,
      gamesPlayed: s.gamesPlayed ?? 0,
      wins: s.wins ?? 0,
      draws: s.draws ?? 0,
      losses: s.losses ?? 0,
      rank: s.rank ?? null,
      advanced: s.advanced ?? false,
      groupComplete: s.groupComplete ?? false,
      goals: 0,
      reached: { ...EMPTY_REACHED },
      wonFinal: false,
      eliminated: false,
      live: false,
    };
  }

  for (const m of matches) {
    if (m.state === "pre") continue; // not started — no goals or progression yet
    for (const side of [m.home, m.away]) {
      const st = states[side.espnId];
      if (!st) continue; // team not in this pool's universe
      if (typeof side.score === "number") st.goals += side.score;
      st.reached[m.round] = true;
      if (m.state === "in") st.live = true; // currently playing
      if (m.round === "final" && m.state === "post" && side.winner) st.wonFinal = true;
    }
  }

  // Best-effort elimination flag (for badges only).
  for (const id of Object.keys(states)) {
    const st = states[id];
    if (st.wonFinal) {
      st.eliminated = false;
      continue;
    }
    const knockoutLost = matches.some(
      (m) =>
        m.round !== "group" &&
        m.round !== "third" &&
        m.state === "post" &&
        ((m.home.espnId === id && !m.home.winner) ||
          (m.away.espnId === id && !m.away.winner)) &&
        !appearsInLaterRound(matches, id, m.round),
    );
    st.eliminated = (st.groupComplete && !st.advanced) || knockoutLost;
  }

  return states;
}

function appearsInLaterRound(matches: Match[], id: string, round: RoundKey): boolean {
  return matches.some(
    (m) =>
      roundOrder(m.round) > roundOrder(round) &&
      m.round !== "third" &&
      (m.home.espnId === id || m.away.espnId === id),
  );
}

/** Score a single team per the pool rules. `doubled` applies the tier 7-10 multiplier. */
export function scoreTeam(state: TeamState, doubled: boolean): TeamScore {
  const base: ScoreLine[] = [];

  if (state.goals > 0) {
    base.push({ label: "Goals scored", points: state.goals, detail: `${state.goals} goal${state.goals === 1 ? "" : "s"}` });
  }
  if (state.groupPoints > 0) {
    base.push({ label: "Group-play points", points: state.groupPoints, detail: `${state.wins}W-${state.draws}D-${state.losses}L` });
  }
  if (state.groupComplete) {
    if (state.rank === 1) base.push({ label: "Won group", points: 8 });
    else if (state.rank === 2) base.push({ label: "2nd in group", points: 4 });
    else if (state.rank === 3 && state.advanced) base.push({ label: "3rd — advanced", points: 2 });
  }
  if (state.reached.r16) base.push({ label: "Reached Round of 16", points: 12 });
  if (state.reached.qf) base.push({ label: "Reached Quarterfinals", points: 18 });
  if (state.reached.sf) base.push({ label: "Reached Semifinals", points: 24 });
  if (state.reached.final) base.push({ label: "Reached Final", points: 36 });
  if (state.wonFinal) base.push({ label: "Won the Final 🏆", points: 48 });

  const mult = doubled ? 2 : 1;
  const lines: ScoreLine[] = base.map((l) => ({ ...l, points: l.points * mult }));
  const baseTotal = base.reduce((sum, l) => sum + l.points, 0);

  return {
    espnId: state.espnId,
    doubled,
    lines,
    baseTotal,
    total: baseTotal * mult,
  };
}

/** Score every participant and rank them. */
export function scoreParticipants(
  participants: Participant[],
  states: Record<string, TeamState>,
): ScoredParticipant[] {
  const scored = participants.map((p) => {
    const picks: ScoredPick[] = p.picks.map((espnId) => {
      const team = TEAMS_BY_ID[espnId];
      const doubled = team ? isDoubledTier(team.tier) : false;
      const state = states[espnId];
      const ts = state
        ? scoreTeam(state, doubled)
        : { espnId, doubled, lines: [], baseTotal: 0, total: 0 };
      return {
        ...ts,
        tier: team?.tier ?? 0,
        teamName: team?.name ?? espnId,
        abbr: team?.abbr ?? "",
      };
    });
    const total = picks.reduce((sum, pk) => sum + pk.total, 0);
    return { id: p.id, name: p.name, total, picks, rank: 0 };
  });

  scored.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  // Standard competition ranking (ties share a rank).
  let lastTotal = Number.NaN;
  let lastRank = 0;
  scored.forEach((p, i) => {
    if (p.total !== lastTotal) {
      lastRank = i + 1;
      lastTotal = p.total;
    }
    p.rank = lastRank;
  });
  return scored;
}
