import { PARTICIPANTS } from "@/data/picks";
import { cached } from "./cache";
import { getAllMatches, getRoundWindows, getStandings } from "./espn";
import { buildTeamStates, scoreParticipants } from "./scoring";
import type { Match, Scoreboard } from "./types";

const POOL_TZ = "America/New_York";

const etDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: POOL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));

export function getScoreboard(): Promise<Scoreboard> {
  return cached("scoreboard", 45_000, buildScoreboard);
}

async function buildScoreboard(): Promise<Scoreboard> {
  const windows = await getRoundWindows();
  const [matches, standings] = await Promise.all([
    getAllMatches(windows),
    getStandings(),
  ]);

  const teamStates = buildTeamStates(standings, matches);
  const participants = scoreParticipants(PARTICIPANTS, teamStates);

  const now = new Date();
  const todayKey = etDate(now.toISOString());

  const live = matches.filter((m) => m.state === "in");
  const today = matches.filter((m) => etDate(m.date) === todayKey);
  const upcoming = matches
    .filter((m) => m.state === "pre" && new Date(m.date).getTime() >= now.getTime())
    .slice(0, 16);
  const recent: Match[] = matches.filter((m) => m.state === "post").reverse().slice(0, 16);

  return {
    updatedAt: now.toISOString(),
    tournamentStarted: matches.some((m) => m.state !== "pre"),
    participants,
    teamStates,
    liveMatches: live,
    todayMatches: today,
    upcomingMatches: upcoming,
    recentMatches: recent,
  };
}
