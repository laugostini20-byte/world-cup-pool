import type {
  GroupRow,
  GroupTable,
  Match,
  MatchSide,
  RoundKey,
  RoundWindow,
  SquadPlayer,
  TeamDetail,
  TeamState,
} from "./types";

import { cached } from "./cache";

const BASE = "https://site.api.espn.com/apis";
const LEAGUE = "soccer/fifa.world";

// Fallback round windows (used if the live calendar can't be read). Sourced from ESPN's
// FIFA World Cup 2026 calendar on 2026-06-05.
const FALLBACK_WINDOWS: RoundWindow[] = [
  { key: "group", label: "Group Stage", start: "2026-06-11", end: "2026-06-28" },
  { key: "r32", label: "Round of 32", start: "2026-06-28", end: "2026-07-04" },
  { key: "r16", label: "Round of 16", start: "2026-07-04", end: "2026-07-09" },
  { key: "qf", label: "Quarterfinals", start: "2026-07-09", end: "2026-07-14" },
  { key: "sf", label: "Semifinals", start: "2026-07-14", end: "2026-07-18" },
  { key: "third", label: "Third-Place Match", start: "2026-07-18", end: "2026-07-19" },
  { key: "final", label: "Final", start: "2026-07-19", end: "2026-08-01" },
];

const LABEL_TO_KEY: Record<string, RoundKey> = {
  group: "group",
  "round of 32": "r32",
  "rd of 16": "r16",
  "round of 16": "r16",
  quarterfinals: "qf",
  semifinals: "sf",
  "3rd-place match": "third",
  "third-place match": "third",
  final: "final",
};

const yyyymmdd = (iso: string) => iso.slice(0, 10).replace(/-/g, "");

async function getJson<T>(url: string): Promise<T | null> {
  try {
    // no-store: don't write to Next's Data Cache. Freshness is handled by our own
    // in-memory cache around the higher-level fetchers (getScoreboard, etc.).
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Read the tournament's round windows from ESPN's calendar (falls back to constants). */
export async function getRoundWindows(): Promise<RoundWindow[]> {
  const data = await getJson<any>(`${BASE}/site/v2/sports/${LEAGUE}/scoreboard`);
  const entries = data?.leagues?.[0]?.calendar?.[0]?.entries;
  if (!Array.isArray(entries)) return FALLBACK_WINDOWS;
  const windows: RoundWindow[] = [];
  for (const e of entries) {
    const key = LABEL_TO_KEY[String(e.label ?? "").toLowerCase().trim()];
    if (!key) continue;
    windows.push({
      key,
      label: e.label,
      start: e.startDate,
      end: e.endDate,
    });
  }
  return windows.length ? windows : FALLBACK_WINDOWS;
}

function parseSide(c: any): MatchSide {
  const score = c?.score === undefined || c?.score === null || c?.score === ""
    ? null
    : Number(c.score);
  return {
    espnId: String(c?.team?.id ?? ""),
    name: c?.team?.displayName ?? c?.team?.name ?? "",
    abbr: c?.team?.abbreviation ?? "",
    logo: c?.team?.logos?.[0]?.href ?? c?.team?.logo,
    score: Number.isFinite(score as number) ? (score as number) : null,
    winner: Boolean(c?.winner),
  };
}

/**
 * Map an ESPN status type to our match state. Prefer ESPN's own `state`/`completed`
 * fields — they correctly cover finals decided on penalties (STATUS_FINAL_PEN) or after
 * extra time, which name-only matching missed (those matches were skipped entirely).
 */
export function matchStateFromStatus(statusType: any): Match["state"] {
  if (statusType?.completed === true || statusType?.state === "post") return "post";
  if (statusType?.state === "in") return "in";
  if (statusType?.state === "pre") return "pre";
  // Fallback for payloads without a `state` field.
  const name: string = statusType?.name ?? "";
  if (name.startsWith("STATUS_FINAL") || name === "STATUS_FULL_TIME") return "post";
  if (
    name === "STATUS_IN_PROGRESS" ||
    name === "STATUS_HALFTIME" ||
    name === "STATUS_FIRST_HALF" ||
    name === "STATUS_SECOND_HALF" ||
    name === "STATUS_END_PERIOD"
  )
    return "in";
  return "pre";
}

function parseMatch(event: any, round: RoundKey): Match | null {
  const comp = event?.competitions?.[0];
  if (!comp) return null;
  const competitors = comp.competitors ?? [];
  const home = competitors.find((c: any) => c.homeAway === "home") ?? competitors[0];
  const away = competitors.find((c: any) => c.homeAway === "away") ?? competitors[1];
  if (!home || !away) return null;
  const statusType = event?.status?.type ?? comp?.status?.type;
  return {
    id: String(event.id),
    date: event.date,
    round,
    state: matchStateFromStatus(statusType),
    statusDetail: statusType?.shortDetail ?? statusType?.detail ?? "",
    home: parseSide(home),
    away: parseSide(away),
  };
}

/** Fetch every match in the tournament, tagged with its round. */
export async function getAllMatches(windows: RoundWindow[]): Promise<Match[]> {
  const results = await Promise.all(
    windows.map(async (w) => {
      const range = `${yyyymmdd(w.start)}-${yyyymmdd(w.end)}`;
      const data = await getJson<any>(
        `${BASE}/site/v2/sports/${LEAGUE}/scoreboard?dates=${range}&limit=300`,
      );
      const events = data?.events ?? [];
      return events
        .map((e: any) => parseMatch(e, w.key))
        .filter((m: Match | null): m is Match => m !== null);
    }),
  );
  // Dedupe by match id (round windows can overlap by a day at the boundaries).
  const byId = new Map<string, Match>();
  for (const m of results.flat()) {
    const existing = byId.get(m.id);
    // Prefer the later (more advanced) round label if a match shows up in two windows.
    if (!existing || roundOrder(m.round) > roundOrder(existing.round)) byId.set(m.id, m);
  }
  return [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const ROUND_SEQUENCE: RoundKey[] = ["group", "r32", "r16", "qf", "sf", "third", "final"];
export const roundOrder = (r: RoundKey) => ROUND_SEQUENCE.indexOf(r);

/** Fetch a single team's detail (identity, standing, full squad, coach) from ESPN. */
export function getTeamDetail(id: string): Promise<TeamDetail | null> {
  return cached(`team:${id}`, 300_000, () => fetchTeamDetail(id));
}

async function fetchTeamDetail(id: string): Promise<TeamDetail | null> {
  const [info, roster] = await Promise.all([
    getJson<any>(`${BASE}/site/v2/sports/${LEAGUE}/teams/${id}`),
    getJson<any>(`${BASE}/site/v2/sports/${LEAGUE}/teams/${id}/roster`),
  ]);

  const t = info?.team;
  const squad: SquadPlayer[] = (roster?.athletes ?? []).map((a: any) => ({
    name: a.displayName ?? a.fullName ?? "",
    jersey: a.jersey ?? "",
    position: a.position?.abbreviation ?? "",
    positionName: a.position?.name ?? "",
    age: typeof a.age === "number" ? a.age : null,
  }));

  const coachRaw = Array.isArray(roster?.coach) ? roster.coach[0] : roster?.coach;
  const coach = coachRaw
    ? `${coachRaw.firstName ?? ""} ${coachRaw.lastName ?? ""}`.trim() || undefined
    : undefined;

  if (!t && squad.length === 0) return null;

  return {
    espnId: id,
    displayName: t?.displayName ?? "",
    logo: t?.logos?.[0]?.href,
    color: t?.color,
    standingSummary: t?.standingSummary,
    coach,
    squad,
  };
}

/** Fetch the real WC group tables (A–L) with full standings for display. */
export function getGroupTables(): Promise<GroupTable[]> {
  return cached("groupTables", 45_000, fetchGroupTables);
}

async function fetchGroupTables(): Promise<GroupTable[]> {
  const data = await getJson<any>(`${BASE}/v2/sports/${LEAGUE}/standings`);
  const groups = data?.children ?? [];
  const tables: GroupTable[] = [];
  for (const g of groups) {
    const entries = g?.standings?.entries ?? [];
    const rows: GroupRow[] = entries.map((e: any) => {
      const stat = (name: string) =>
        Number(e.stats?.find((s: any) => s.type === name)?.value ?? 0);
      const t = e.team;
      return {
        espnId: String(t?.id ?? ""),
        name: t?.displayName ?? t?.name ?? "",
        abbr: t?.abbreviation ?? "",
        logo: t?.logos?.[0]?.href,
        played: stat("gamesplayed"),
        wins: stat("wins"),
        draws: stat("ties"),
        losses: stat("losses"),
        gf: stat("pointsfor"),
        ga: stat("pointsagainst"),
        gd: stat("pointdifferential"),
        points: stat("points"),
        rank: stat("rank"),
        advanced: stat("advanced") > 0,
      };
    });
    rows.sort((a, b) => (a.rank || 99) - (b.rank || 99));
    tables.push({ name: g?.name ?? g?.abbreviation ?? "", rows });
  }
  return tables;
}

/** Fetch real WC group standings, keyed by ESPN team id. */
export async function getStandings(): Promise<Record<string, Partial<TeamState>>> {
  const data = await getJson<any>(`${BASE}/v2/sports/${LEAGUE}/standings`);
  const out: Record<string, Partial<TeamState>> = {};
  const groups = data?.children ?? [];
  for (const g of groups) {
    const groupLetter = String(g?.abbreviation ?? g?.name ?? "").replace(/group\s*/i, "").trim();
    const entries = g?.standings?.entries ?? [];
    for (const e of entries) {
      const id = String(e?.team?.id ?? "");
      if (!id) continue;
      const stat = (name: string) =>
        Number(e.stats?.find((s: any) => s.type === name)?.value ?? 0);
      const gamesPlayed = stat("gamesplayed");
      out[id] = {
        groupLetter,
        groupPoints: stat("points"),
        gamesPlayed,
        wins: stat("wins"),
        draws: stat("ties"),
        losses: stat("losses"),
        rank: stat("rank") || null,
        advanced: stat("advanced") > 0,
        groupComplete: gamesPlayed >= 3,
      };
    }
  }
  return out;
}
