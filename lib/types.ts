export type RoundKey =
  | "group"
  | "r32"
  | "r16"
  | "qf"
  | "sf"
  | "third"
  | "final";

export interface RoundWindow {
  key: RoundKey;
  label: string;
  start: string; // ISO
  end: string; // ISO
}

/** A single match from ESPN, normalized. */
export interface Match {
  id: string;
  date: string; // ISO
  round: RoundKey;
  state: "pre" | "in" | "post";
  statusDetail: string; // e.g. "FT", "45'", "Today, 3:00 PM"
  home: MatchSide;
  away: MatchSide;
}

export interface MatchSide {
  espnId: string;
  name: string;
  abbr: string;
  logo?: string;
  score: number | null;
  winner: boolean;
}

/** Per-team live tournament state, derived from standings + fixtures. */
export interface TeamState {
  espnId: string;
  groupLetter: string | null; // real WC group, e.g. "A"
  groupPoints: number; // 3W+1D
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  rank: number | null; // position in real group
  advanced: boolean; // advanced to knockout
  groupComplete: boolean; // played all 3 group games
  goals: number; // total goals scored across ALL matches
  reached: Record<RoundKey, boolean>; // which rounds the team appeared in
  wonFinal: boolean;
  eliminated: boolean;
}

/** Point breakdown for one picked team. */
export interface TeamScore {
  espnId: string;
  doubled: boolean;
  lines: ScoreLine[];
  baseTotal: number; // before doubling
  total: number; // after doubling
}

export interface ScoreLine {
  label: string;
  points: number; // already includes the doubling multiplier
  detail?: string;
}

export interface Participant {
  id: string;
  name: string;
  /** ESPN team ids, one per tier (index 0 = tier 1 ... index 9 = tier 10). */
  picks: string[];
}

export interface ScoredPick extends TeamScore {
  tier: number;
  teamName: string;
  abbr: string;
}

export interface ScoredParticipant {
  id: string;
  name: string;
  total: number;
  rank: number;
  picks: ScoredPick[];
}

export interface SquadPlayer {
  name: string;
  jersey: string;
  position: string; // abbreviation: G/D/M/F
  positionName: string;
  age: number | null;
}

export interface TeamDetail {
  espnId: string;
  displayName: string;
  logo?: string;
  color?: string; // hex without '#'
  standingSummary?: string; // e.g. "1st in FIFA World Cup"
  coach?: string;
  squad: SquadPlayer[];
}

export interface GroupRow {
  espnId: string;
  name: string;
  abbr: string;
  logo?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  rank: number;
  advanced: boolean;
}

export interface GroupTable {
  name: string; // e.g. "Group A"
  rows: GroupRow[];
}

export interface Scoreboard {
  updatedAt: string;
  tournamentStarted: boolean;
  participants: ScoredParticipant[];
  teamStates: Record<string, TeamState>;
  liveMatches: Match[];
  todayMatches: Match[];
  upcomingMatches: Match[];
  recentMatches: Match[];
}
