import type { Participant } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER DATA
//
// These are sample entries so the app looks alive before the pool closes.
// When the real responses Excel is ready (pool closes Wed 6/10 8pm EST), run:
//
//     npm run import-picks -- "data-source/<responses-file>.xlsx"
//
// …which overwrites this file with the real participants. Each pick is an ESPN
// team id; picks are ordered tier 1 → tier 10.
// ─────────────────────────────────────────────────────────────────────────────

export const PICKS_ARE_PLACEHOLDER = true;

export const PARTICIPANTS: Participant[] = [
  { id: "p01", name: "Sample — Mike D.", picks: ["164", "202", "459", "203", "477", "654", "210", "469", "2659", "2917"] },
  { id: "p02", name: "Sample — Sarah L.", picks: ["478", "205", "2869", "660", "212", "466", "2620", "451", "467", "4398"] },
  { id: "p03", name: "Sample — Tony R.", picks: ["448", "481", "208", "627", "465", "474", "4789", "624", "2570", "4375"] },
  { id: "p04", name: "Sample — Jess P.", picks: ["482", "449", "464", "475", "477", "206", "580", "452", "2597", "2654"] },
  { id: "p05", name: "Sample — Carlos M.", picks: ["164", "205", "459", "203", "209", "654", "210", "469", "2850", "11678"] },
  { id: "p06", name: "Sample — Dana K.", picks: ["478", "202", "2869", "660", "212", "466", "2620", "628", "655", "4398"] },
  { id: "p07", name: "Sample — Greg V.", picks: ["448", "481", "208", "627", "465", "474", "450", "451", "2659", "2917"] },
  { id: "p08", name: "Sample — Nina T.", picks: ["482", "449", "464", "475", "477", "206", "4469", "659", "2597", "4375"] },
  { id: "p09", name: "Sample — Omar S.", picks: ["164", "202", "459", "203", "212", "654", "4789", "469", "467", "2654"] },
  { id: "p10", name: "Sample — Lily W.", picks: ["478", "205", "2869", "660", "465", "466", "210", "451", "2570", "11678"] },
  { id: "p11", name: "Sample — Ben H.", picks: ["448", "481", "208", "627", "209", "474", "2620", "624", "655", "4398"] },
  { id: "p12", name: "Sample — Priya N.", picks: ["482", "449", "464", "475", "477", "206", "580", "452", "2659", "4375"] },
  { id: "p13", name: "Sample — Alex F.", picks: ["164", "205", "459", "660", "212", "654", "4789", "469", "2850", "2917"] },
  { id: "p14", name: "Sample — Rosa G.", picks: ["478", "202", "2869", "203", "465", "466", "2620", "451", "467", "2654"] },
];
