import type { RoundKey, TeamState } from "./types";

export const ROUND_LABEL: Record<RoundKey, string> = {
  group: "Group Stage",
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarterfinal",
  sf: "Semifinal",
  third: "Third-Place",
  final: "Final",
};

export const ROUND_SHORT: Record<RoundKey, string> = {
  group: "Group",
  r32: "R32",
  r16: "R16",
  qf: "QF",
  sf: "SF",
  third: "3rd",
  final: "Final",
};

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.max(0, Math.round(diff / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

export function matchTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export type StatusTone = "champion" | "alive" | "out" | "neutral";

const FURTHEST: RoundKey[] = ["final", "sf", "qf", "r16", "r32"];

export function teamStatus(
  state: TeamState | undefined,
): { label: string; tone: StatusTone } {
  if (!state) return { label: "—", tone: "neutral" };
  if (state.wonFinal) return { label: "Champion 🏆", tone: "champion" };
  if (state.eliminated) return { label: "Eliminated", tone: "out" };

  const furthest = FURTHEST.find((r) => state.reached[r]);
  if (furthest) {
    const labels: Partial<Record<RoundKey, string>> = {
      final: "In the Final",
      sf: "In the Semis",
      qf: "In the Quarters",
      r16: "In Round of 16",
      r32: "In Round of 32",
    };
    return { label: labels[furthest] ?? "Advancing", tone: "alive" };
  }
  if (state.groupComplete && state.advanced) return { label: "Advanced", tone: "alive" };
  if (state.gamesPlayed > 0 && state.rank)
    return { label: `Group: ${ordinal(state.rank)}`, tone: "neutral" };
  return { label: "Not started", tone: "neutral" };
}

export const rankColor = (rank: number): string =>
  rank === 1
    ? "text-gold"
    : rank === 2
      ? "text-silver"
      : rank === 3
        ? "text-bronze"
        : "text-ink-dim";
