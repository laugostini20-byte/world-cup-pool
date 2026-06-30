/**
 * Verification for the scoring engine. Run: npm run test:scoring
 * Simulates synthetic tournament states and asserts the point math matches the rules.
 */
import { buildTeamStates, scoreParticipants, scoreTeam } from "../lib/scoring";
import { matchStateFromStatus } from "../lib/espn";
import type { Match, MatchSide, RoundKey, TeamState } from "../lib/types";

let failures = 0;
function expect(label: string, got: number, want: number) {
  const ok = got === want;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ${label}: got ${got}, want ${want}`);
}

function baseState(over: Partial<TeamState>): TeamState {
  return {
    espnId: "x",
    groupLetter: "A",
    groupPoints: 0,
    gamesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    rank: null,
    advanced: false,
    groupComplete: false,
    goals: 0,
    reached: { group: false, r32: false, r16: false, qf: false, sf: false, third: false, final: false },
    wonFinal: false,
    eliminated: false,
    live: false,
    ...over,
  };
}

// 1. Group winner, group stage only: 9 group pts (3W) + 8 won-group + 6 goals = 23
{
  const s = baseState({ groupPoints: 9, wins: 3, gamesPlayed: 3, groupComplete: true, rank: 1, advanced: true, goals: 6 });
  expect("Group winner, 6 goals (single)", scoreTeam(s, false).total, 9 + 8 + 6);
  expect("Group winner, 6 goals (DOUBLED)", scoreTeam(s, true).total, (9 + 8 + 6) * 2);
}

// 2. Third place, advanced: 3 group pts + 2 (3rd advanced) + 2 goals = 7
{
  const s = baseState({ groupPoints: 3, gamesPlayed: 3, groupComplete: true, rank: 3, advanced: true, goals: 2 });
  expect("3rd-and-advanced", scoreTeam(s, false).total, 3 + 2 + 2);
}

// 3. Third place, NOT advanced: only group pts + goals, no placement bonus
{
  const s = baseState({ groupPoints: 1, gamesPlayed: 3, groupComplete: true, rank: 3, advanced: false, goals: 1 });
  expect("3rd-eliminated (no bonus)", scoreTeam(s, false).total, 1 + 1);
}

// 4. Placement NOT awarded until group complete
{
  const s = baseState({ groupPoints: 6, gamesPlayed: 2, groupComplete: false, rank: 1, goals: 4 });
  expect("Leading but group incomplete (no 8)", scoreTeam(s, false).total, 6 + 4);
}

// 5. Champion: 2nd in group (4) + cumulative milestones + win + group pts + goals.
//    group pts 7, goals 12, rank 2 (4), r16(12)+qf(18)+sf(24)+final(36)+win(48)
{
  const s = baseState({
    groupPoints: 7, gamesPlayed: 3, groupComplete: true, rank: 2, advanced: true, goals: 12,
    reached: { group: true, r32: true, r16: true, qf: true, sf: true, third: false, final: true },
    wonFinal: true,
  });
  const want = 7 + 4 + 12 + 12 + 18 + 24 + 36 + 48;
  expect("Champion cumulative (single)", scoreTeam(s, false).total, want);
  expect("Champion cumulative (DOUBLED)", scoreTeam(s, true).total, want * 2);
}

// 6. Semifinal loser who plays 3rd-place match: gets SF (24) but NOT Final/champion
{
  const s = baseState({
    groupPoints: 6, gamesPlayed: 3, groupComplete: true, rank: 1, advanced: true, goals: 8,
    reached: { group: true, r32: true, r16: true, qf: true, sf: true, third: true, final: false },
  });
  const want = 6 + 8 + 8 + 12 + 18 + 24; // group + goals + wongroup + r16 + qf + sf
  expect("SF loser (3rd-place match, no final pts)", scoreTeam(s, false).total, want);
}

// 7. buildTeamStates: goals summed across matches, reached flags set, final winner detected.
{
  const side = (id: string, score: number, winner: boolean): MatchSide => ({
    espnId: id, name: id, abbr: id, score, winner,
  });
  const mk = (id: string, round: RoundKey, h: MatchSide, a: MatchSide): Match => ({
    id, date: "2026-07-01", round, state: "post", statusDetail: "FT", home: h, away: a,
  });
  // Use a real pool team id (Spain=164) so it's in the universe.
  const matches: Match[] = [
    mk("m1", "group", side("164", 3, true), side("999", 1, false)),
    mk("m2", "r16", side("164", 2, true), side("888", 0, false)),
    mk("m3", "final", side("164", 1, true), side("777", 0, false)),
  ];
  const states = buildTeamStates({ "164": { groupLetter: "H", groupPoints: 0 } }, matches);
  expect("Goals summed across rounds (3+2+1)", states["164"].goals, 6);
  expect("Reached final flag", states["164"].reached.final ? 1 : 0, 1);
  expect("Won final flag", states["164"].wonFinal ? 1 : 0, 1);
}

// 8. scoreParticipants ranks correctly with ties sharing a rank.
{
  const states: Record<string, TeamState> = {
    "164": baseState({ goals: 10 }),
    "478": baseState({ goals: 5 }),
  };
  const ranked = scoreParticipants(
    [
      { id: "a", name: "Alpha", picks: ["164"] },
      { id: "b", name: "Bravo", picks: ["478"] },
      { id: "c", name: "Charlie", picks: ["164"] },
    ],
    states,
  );
  expect("Top score ranked #1", ranked[0].rank, 1);
  expect("Tie shares rank #1", ranked[1].rank, 1);
  expect("After a 2-way tie, next is #3", ranked[2].rank, 3);
}

// 9. Winning a knockout match marks the NEXT round reached — even before ESPN
//    creates that round's fixture (the real bug: Brazil won R32 but had no R16 fixture yet).
{
  const side = (id: string, score: number, winner: boolean): MatchSide => ({
    espnId: id, name: id, abbr: id, score, winner,
  });
  const mk = (id: string, round: RoundKey, h: MatchSide, a: MatchSide): Match => ({
    id, date: "2026-06-28", round, state: "post", statusDetail: "FT", home: h, away: a,
  });
  const matches: Match[] = [
    mk("g1", "group", side("205", 2, true), side("999", 0, false)), // Brazil group game
    mk("r1", "r32", side("205", 2, true), side("888", 1, false)), // Brazil WINS R32, no R16 fixture exists
  ];
  const states = buildTeamStates(
    { "205": { groupLetter: "C", groupPoints: 7, gamesPlayed: 3, groupComplete: true, rank: 1, advanced: true } },
    matches,
  );
  expect("Win R32 -> reached R16 flag set", states["205"].reached.r16 ? 1 : 0, 1);
  // goals 2+2=4, group pts 7, won group 8, reached R16 12 = 31
  expect("Win R32 awards +12 (reached R16)", scoreTeam(states["205"], false).total, 4 + 7 + 8 + 12);
  // The R32 loser only appeared in R32 — no R16, and eliminated.
  expect("R32 loser did NOT reach R16", states["888"]?.reached.r16 ? 1 : 0, 0);
}

// 10. Match-state mapping: penalty/extra-time finals must count as "post", not be
//     skipped (the Germany 1-1 Paraguay R32 was STATUS_FINAL_PEN and got dropped).
{
  const post = (st: object) => (matchStateFromStatus(st) === "post" ? 1 : 0);
  expect("STATUS_FINAL_PEN -> post", post({ name: "STATUS_FINAL_PEN", state: "post", completed: true }), 1);
  expect("STATUS_FULL_TIME -> post", post({ name: "STATUS_FULL_TIME", state: "post", completed: true }), 1);
  expect("completed flag alone -> post", post({ name: "STATUS_FINAL_AET", completed: true }), 1);
  expect("in-progress not post", post({ name: "STATUS_IN_PROGRESS", state: "in", completed: false }), 0);
  expect("scheduled not post", post({ name: "STATUS_SCHEDULED", state: "pre", completed: false }), 0);
}

console.log(failures === 0 ? "\nALL PASS ✅" : `\n${failures} FAILURE(S) ❌`);
process.exit(failures === 0 ? 0 : 1);
