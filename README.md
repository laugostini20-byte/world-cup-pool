# 2026 World Cup Pool — Live Scoreboard

A public, view-only web app that shows live standings for our 2026 World Cup pool.
Participants pick one team from each of 10 odds-based tiers; the app pulls live results from
ESPN's free FIFA World Cup feed, scores every pick per the pool rules, and ranks everyone.

See [`docs/DESIGN.md`](docs/DESIGN.md) for the full design and scoring rules.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

## Verify the scoring engine

```bash
npm run test:scoring
```

Simulates synthetic tournament runs and asserts the point math (doubling, cumulative
milestones, placement, ties).

## Loading real picks

Picks live in `data/picks.ts` (placeholder sample data until the pool closes). When the host's
responses Excel is ready:

```bash
npm run import-picks -- "data-source/<responses-file>.xlsx"
```

The importer scans the sheet, resolves each team name to a pool team (one per tier), writes
`data/picks.ts`, and prints any rows it couldn't fully resolve. Unmatched spellings are added to
the `aliases` map in `data/teams.ts`. Commit + redeploy to publish.

## How it works

- **`lib/espn.ts`** — fetches ESPN standings + fixtures (cached 60s), normalizes them, derives
  each match's round from the tournament calendar.
- **`lib/scoring.ts`** — pure scoring engine: ESPN team state → pool points.
- **`lib/board.ts`** — assembles the full scoreboard (ranked participants, live/upcoming matches).
- **`app/api/scores`** — cached endpoint the client polls every 60s for live updates.
- Pages: Leaderboard (`/`), Teams (`/teams`), Matches (`/matches`), Rules (`/rules`).

Data source: ESPN's free public API — no key, no cost. Deployed on Vercel.
