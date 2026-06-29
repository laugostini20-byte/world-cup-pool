import { NextResponse } from "next/server";
import { getScoreboard } from "@/lib/board";

// Dynamic + edge-cached via Cache-Control (no ISR writes). The scoreboard itself is
// memoized in-memory (lib/cache) so ESPN isn't hammered and warm instances are instant.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const board = await getScoreboard();
    return NextResponse.json(board, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to build scoreboard", detail: String(err) },
      { status: 500 },
    );
  }
}
