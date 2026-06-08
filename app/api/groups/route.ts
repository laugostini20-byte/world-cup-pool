import { NextResponse } from "next/server";
import { getGroupTables } from "@/lib/espn";

export const revalidate = 60;

export async function GET() {
  try {
    const tables = await getGroupTables();
    return NextResponse.json(
      { updatedAt: new Date().toISOString(), tables },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load group tables", detail: String(err) },
      { status: 500 },
    );
  }
}
