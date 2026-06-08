import { NextResponse } from "next/server";
import { getTeamDetail } from "@/lib/espn";

// Squad/identity changes rarely — cache longer than the live scoreboard.
export const revalidate = 300;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const detail = await getTeamDetail(id);
  if (!detail) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }
  return NextResponse.json(detail, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
