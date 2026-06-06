import { NextResponse } from "next/server";
import { getScoreboard } from "@/lib/board";

// Cache the computed scoreboard for 60s so we never hammer ESPN and pages stay fast.
export const revalidate = 60;

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
