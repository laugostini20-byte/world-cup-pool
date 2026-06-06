# 2026 World Cup Pool — Live Scoreboard

A public, view-only web app that shows live standings for a World Cup pool. Participants pick
one team from each of 10 odds-based tiers; the app pulls live results from ESPN's free FIFA
World Cup feed, scores every pick per the pool rules, and ranks all participants.

## The pool

- **10 "groups"** = odds-based tiers (NOT the real World Cup groups), seeded from DraftKings
  odds as of 6/5/2026.
- Groups 1–6 have 4 teams each; Groups 7–10 have 6 teams each.
- Each participant picks **1 team per tier = 10 teams**.
- **Groups 7–10 picks have all point values doubled** (rewards dark horses). A team's tier is
  fixed by the template, so doubling is deterministic per team.

## Scoring (per picked team)

| Event | Points |
|---|---|
| Each goal scored (any round) | 1 |
| Each point earned in group play (W=3, D=1) | 1 |
| 3rd in group but advances to knockout | 2 |
| Finish 2nd in group | 4 |
| Win group | 8 |
| Reach Round of 16 | 12 |
| Reach Quarterfinals | 18 |
| Reach Semifinals | 24 |
| Reach Final | 36 |
| Win Final | 48 |

**Decisions:**
- **Milestone points are cumulative** — a finalist earns 12+18+24+36 as it passes each round
  (+48 if it wins), plus goals/group/placement points.
- **2026 format:** 48 teams → Round of 32 → R16 → QF → SF → Final. Advancing from the group
  awards placement points (8/4/2). "Reach Round of 16" (12) = winning the Round-of-32 match.
  No separate award for reaching the Round of 32.
- A team's total is doubled iff it sits in tiers 7–10.
- Participant score = sum of their 10 teams' totals.

## Data sources

- **Live:** ESPN public API (no key). Verified live for FIFA World Cup 2026:
  - Standings: `https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings`
    → 12 groups, per team: `points` (group pts), `pointsFor` (group goals), `rank`, `advanced`.
  - Scoreboard/fixtures: `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=YYYYMMDD-YYYYMMDD`
    → all matches with scores; round derived from the league **calendar** date buckets.
  - Calendar round windows: Group (Jun 11–27), Round of 32 (Jun 28–Jul 3), Rd of 16 (Jul 4–7),
    Quarterfinals (Jul 9–11), Semifinals (Jul 14–15), 3rd-Place (Jul 18), Final (Jul 19).
- **Static:** participant picks (generated from the host's responses Excel after the pool closes
  Wed 6/10 8pm EST) + the tier/team/odds table (from the template in `data-source/`).

## Architecture

- **Next.js (App Router) + TypeScript + Tailwind**, deployed on **Vercel**. No DB, no auth.
- `lib/espn.ts` — fetch + normalize ESPN standings and fixtures (cached server-side ~60s).
- `lib/scoring.ts` — pure scoring engine: ESPN team data → pool points. Unit-testable.
- `lib/teamMap.ts` — template name → ESPN name mapping (e.g. USA→United States,
  Czech Republic→Czechia, Bosnia and Herzegovina→Bosnia-Herzegovina, Curacao→Curaçao).
- `data/teams.ts` — the 10 tiers, teams, odds, isDoubled.
- `data/picks.ts` — participants and their 10 picks (placeholder until real file imported).
- `scripts/import-picks.ts` — parse the responses Excel into `data/picks.ts`.
- `app/api/scores/route.ts` — cached endpoint returning computed standings.
- Pages: Leaderboard (home), Participant detail, Team explorer, Today/Live.

## Pages

- **Leaderboard** — ranked participants (75+), search, totals, expandable rows, live refresh.
- **Participant** — their 10 picks with per-team point breakdown; doubled picks marked.
- **Team explorer** — every team's live status (goals, group, round) + who picked it.
- **Today / Live** — matches in progress / scheduled today with live scores.

## Known unknowns (handled gracefully)

- Exact responses-Excel layout — flexible importer, finalized when the real file arrives 6/10.
- Team-name matching — mapping table with a normalize-and-fallback step; unmatched names
  surfaced loudly so they can be fixed.
- Knockout round data quality — derived from calendar date buckets; any bad value is a small,
  editable override.
