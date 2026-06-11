// The 10 odds-based pool tiers (NOT real World Cup groups). Each participant picks one
// team per tier. Tiers 7-10 have their point values DOUBLED.
//
// Every team is bound to its ESPN team id so live data matches exactly, regardless of how
// ESPN spells the name (e.g. USA -> United States, Czech Republic -> Czechia).

export interface PoolTeam {
  /** Template display name used in the pool sheet. */
  name: string;
  /** ESPN team id — the join key for all live data. */
  espnId: string;
  /** ESPN display name (for reference / fixture matching). */
  espnName: string;
  /** 3-letter code. */
  abbr: string;
  /** Pre-tournament odds to win, e.g. "+450". */
  odds: string;
  /** FIFA ranking at pool creation. */
  fifaRank: number;
  /** Pool tier 1-10. */
  tier: number;
}

export const DOUBLED_TIERS = [7, 8, 9, 10] as const;
export const isDoubledTier = (tier: number) => tier >= 7;

export const POOL_TEAMS: PoolTeam[] = [
  // Tier 1
  { tier: 1, name: "Spain", espnId: "164", espnName: "Spain", abbr: "ESP", odds: "+450", fifaRank: 2 },
  { tier: 1, name: "France", espnId: "478", espnName: "France", abbr: "FRA", odds: "+475", fifaRank: 3 },
  { tier: 1, name: "England", espnId: "448", espnName: "England", abbr: "ENG", odds: "+700", fifaRank: 4 },
  { tier: 1, name: "Portugal", espnId: "482", espnName: "Portugal", abbr: "POR", odds: "+850", fifaRank: 5 },
  // Tier 2
  { tier: 2, name: "Argentina", espnId: "202", espnName: "Argentina", abbr: "ARG", odds: "+900", fifaRank: 1 },
  { tier: 2, name: "Brazil", espnId: "205", espnName: "Brazil", abbr: "BRA", odds: "+950", fifaRank: 6 },
  { tier: 2, name: "Germany", espnId: "481", espnName: "Germany", abbr: "GER", odds: "+1400", fifaRank: 10 },
  { tier: 2, name: "Netherlands", espnId: "449", espnName: "Netherlands", abbr: "NED", odds: "+2000", fifaRank: 8 },
  // Tier 3
  { tier: 3, name: "Norway", espnId: "464", espnName: "Norway", abbr: "NOR", odds: "+3500", fifaRank: 31 },
  { tier: 3, name: "Colombia", espnId: "208", espnName: "Colombia", abbr: "COL", odds: "+4000", fifaRank: 13 },
  { tier: 3, name: "Belgium", espnId: "459", espnName: "Belgium", abbr: "BEL", odds: "+4000", fifaRank: 9 },
  { tier: 3, name: "Morocco", espnId: "2869", espnName: "Morocco", abbr: "MAR", odds: "+5000", fifaRank: 7 },
  // Tier 4
  { tier: 4, name: "Japan", espnId: "627", espnName: "Japan", abbr: "JPN", odds: "+5500", fifaRank: 18 },
  { tier: 4, name: "USA", espnId: "660", espnName: "United States", abbr: "USA", odds: "+6000", fifaRank: 16 },
  { tier: 4, name: "Switzerland", espnId: "475", espnName: "Switzerland", abbr: "SUI", odds: "+6500", fifaRank: 19 },
  { tier: 4, name: "Mexico", espnId: "203", espnName: "Mexico", abbr: "MEX", odds: "+7000", fifaRank: 14 },
  // Tier 5
  { tier: 5, name: "Uruguay", espnId: "212", espnName: "Uruguay", abbr: "URU", odds: "+7000", fifaRank: 17 },
  { tier: 5, name: "Ecuador", espnId: "209", espnName: "Ecuador", abbr: "ECU", odds: "+8000", fifaRank: 24 },
  { tier: 5, name: "Turkey", espnId: "465", espnName: "Türkiye", abbr: "TUR", odds: "+9000", fifaRank: 22 },
  { tier: 5, name: "Croatia", espnId: "477", espnName: "Croatia", abbr: "CRO", odds: "+9000", fifaRank: 11 },
  // Tier 6
  { tier: 6, name: "Senegal", espnId: "654", espnName: "Senegal", abbr: "SEN", odds: "+9000", fifaRank: 15 },
  { tier: 6, name: "Sweden", espnId: "466", espnName: "Sweden", abbr: "SWE", odds: "+12000", fifaRank: 38 },
  { tier: 6, name: "Austria", espnId: "474", espnName: "Austria", abbr: "AUT", odds: "+15000", fifaRank: 23 },
  { tier: 6, name: "Canada", espnId: "206", espnName: "Canada", abbr: "CAN", odds: "+20000", fifaRank: 30 },
  // Tier 7 (doubled)
  { tier: 7, name: "Scotland", espnId: "580", espnName: "Scotland", abbr: "SCO", odds: "+20000", fifaRank: 43 },
  { tier: 7, name: "Czech Republic", espnId: "450", espnName: "Czechia", abbr: "CZE", odds: "+25000", fifaRank: 39 },
  { tier: 7, name: "Ivory Coast", espnId: "4789", espnName: "Ivory Coast", abbr: "CIV", odds: "+25000", fifaRank: 33 },
  { tier: 7, name: "Ghana", espnId: "4469", espnName: "Ghana", abbr: "GHA", odds: "+30000", fifaRank: 73 },
  { tier: 7, name: "Egypt", espnId: "2620", espnName: "Egypt", abbr: "EGY", odds: "+30000", fifaRank: 29 },
  { tier: 7, name: "Paraguay", espnId: "210", espnName: "Paraguay", abbr: "PAR", odds: "+30000", fifaRank: 40 },
  // Tier 8 (doubled)
  { tier: 8, name: "Algeria", espnId: "624", espnName: "Algeria", abbr: "ALG", odds: "+35000", fifaRank: 28 },
  { tier: 8, name: "South Korea", espnId: "451", espnName: "South Korea", abbr: "KOR", odds: "+40000", fifaRank: 25 },
  { tier: 8, name: "Tunisia", espnId: "659", espnName: "Tunisia", abbr: "TUN", odds: "+50000", fifaRank: 46 },
  { tier: 8, name: "Bosnia and Herzegovina", espnId: "452", espnName: "Bosnia-Herzegovina", abbr: "BIH", odds: "+50000", fifaRank: 64 },
  { tier: 8, name: "Australia", espnId: "628", espnName: "Australia", abbr: "AUS", odds: "+60000", fifaRank: 27 },
  { tier: 8, name: "Iran", espnId: "469", espnName: "Iran", abbr: "IRN", odds: "+70000", fifaRank: 20 },
  // Tier 9 (doubled)
  { tier: 9, name: "DR Congo", espnId: "2850", espnName: "Congo DR", abbr: "COD", odds: "+100000", fifaRank: 45 },
  { tier: 9, name: "South Africa", espnId: "467", espnName: "South Africa", abbr: "RSA", odds: "+100000", fifaRank: 60 },
  { tier: 9, name: "Cape Verde", espnId: "2597", espnName: "Cape Verde", abbr: "CPV", odds: "+100000", fifaRank: 68 },
  { tier: 9, name: "Saudi Arabia", espnId: "655", espnName: "Saudi Arabia", abbr: "KSA", odds: "+100000", fifaRank: 61 },
  { tier: 9, name: "Panama", espnId: "2659", espnName: "Panama", abbr: "PAN", odds: "+100000", fifaRank: 34 },
  { tier: 9, name: "Uzbekistan", espnId: "2570", espnName: "Uzbekistan", abbr: "UZB", odds: "+150000", fifaRank: 50 },
  // Tier 10 (doubled)
  { tier: 10, name: "Qatar", espnId: "4398", espnName: "Qatar", abbr: "QAT", odds: "+150000", fifaRank: 55 },
  { tier: 10, name: "New Zealand", espnId: "2666", espnName: "New Zealand", abbr: "NZL", odds: "+150000", fifaRank: 86 },
  { tier: 10, name: "Iraq", espnId: "4375", espnName: "Iraq", abbr: "IRQ", odds: "+150000", fifaRank: 56 },
  { tier: 10, name: "Haiti", espnId: "2654", espnName: "Haiti", abbr: "HAI", odds: "+250000", fifaRank: 81 },
  { tier: 10, name: "Curacao", espnId: "11678", espnName: "Curaçao", abbr: "CUW", odds: "+250000", fifaRank: 83 },
  { tier: 10, name: "Jordan", espnId: "2917", espnName: "Jordan", abbr: "JOR", odds: "+250000", fifaRank: 63 },
];

export const TEAMS_BY_ID: Record<string, PoolTeam> = Object.fromEntries(
  POOL_TEAMS.map((t) => [t.espnId, t]),
);

/** Lookup a pool team by its template name (case/punctuation-insensitive). Used by the importer. */
const normalize = (s: string) =>
  s
    .replace(/\([^)]*\)/g, "") // drop trailing "(rank)" e.g. "France (3)"
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/^the/, "");

const BY_NORMALIZED_NAME: Record<string, PoolTeam> = (() => {
  const map: Record<string, PoolTeam> = {};
  for (const t of POOL_TEAMS) {
    map[normalize(t.name)] = t;
    map[normalize(t.espnName)] = t;
  }
  // Common alternate spellings the host's sheet might use.
  const aliases: Record<string, string> = {
    usa: "660", unitedstates: "660", usmnt: "660",
    czechia: "450", czechrepublic: "450",
    turkiye: "465", turkey: "465",
    bosnia: "452", bosniaandherzegovina: "452", bosniaherzegovina: "452",
    southkorea: "451", korearepublic: "451", korea: "451",
    drcongo: "2850", congodr: "2850", democraticrepublicofcongo: "2850",
    ivorycoast: "4789", cotedivoire: "4789",
    curacao: "11678", curaçao: "11678",
    capeverde: "2597", caboverde: "2597",
    saudiarabia: "655", iranislamicrepublic: "469",
  };
  for (const [alias, id] of Object.entries(aliases)) {
    const team = POOL_TEAMS.find((t) => t.espnId === id);
    if (team) map[normalize(alias)] = team;
  }
  return map;
})();

export function findPoolTeam(name: string): PoolTeam | undefined {
  return BY_NORMALIZED_NAME[normalize(name)];
}

export function tiers(): { tier: number; doubled: boolean; teams: PoolTeam[] }[] {
  const out: { tier: number; doubled: boolean; teams: PoolTeam[] }[] = [];
  for (let t = 1; t <= 10; t++) {
    out.push({
      tier: t,
      doubled: isDoubledTier(t),
      teams: POOL_TEAMS.filter((team) => team.tier === t),
    });
  }
  return out;
}
