// Original soccer-ball mark, drawn as an SVG so it spins crisply and matches the theme.
// Geometry is generated: one center pentagon, seams to the rim, and five edge pentagons.

const WHITE = "#eef3fb";
const DARK = "#10192c";

function pentagon(cx: number, cy: number, r: number, rotDeg = 0): string {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = ((-90 + rotDeg + i * 72) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

export function SoccerBall({ size = 72 }: { size?: number }) {
  const C = 50;
  const centerR = 13;
  const edgeRadius = 35; // distance of edge-panel centers from middle
  const edgeSize = 8; // edge pentagon radius
  // Center pentagon vertices (rim seams start here) and the gap angles for edge panels.
  const seamAngles = [0, 1, 2, 3, 4].map((i) => -90 + i * 72);
  const gapAngles = [0, 1, 2, 3, 4].map((i) => -54 + i * 72);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.45))" }}
      aria-hidden
    >
      <circle cx={C} cy={C} r={47} fill={WHITE} stroke={DARK} strokeWidth={2.5} />
      {/* seams from center pentagon vertices out to the rim */}
      {seamAngles.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={`s${i}`}
            x1={C + centerR * Math.cos(a)}
            y1={C + centerR * Math.sin(a)}
            x2={C + 47 * Math.cos(a)}
            y2={C + 47 * Math.sin(a)}
            stroke={DARK}
            strokeWidth={2}
          />
        );
      })}
      {/* edge panels */}
      {gapAngles.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const cx = C + edgeRadius * Math.cos(a);
        const cy = C + edgeRadius * Math.sin(a);
        return (
          <polygon key={`e${i}`} points={pentagon(cx, cy, edgeSize, deg + 90)} fill={DARK} />
        );
      })}
      {/* center panel */}
      <polygon points={pentagon(C, C, centerR, 0)} fill={DARK} />
    </svg>
  );
}
