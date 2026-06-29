import { NextResponse } from "next/server";
import { getTeamDetail } from "@/lib/espn";

// Dynamic + edge-cached; team detail is memoized in-memory for 5 min (lib/cache).
export const dynamic = "force-dynamic";

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
