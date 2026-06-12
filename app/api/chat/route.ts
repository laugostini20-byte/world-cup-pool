import { NextResponse } from "next/server";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_NAME = 30;
const MAX_BODY = 500;

export async function GET(req: Request) {
  const after = Number(new URL(req.url).searchParams.get("after") ?? 0);
  try {
    const db = await ensureSchema();
    if (!db) return NextResponse.json({ configured: false, messages: [] });
    const rows = after
      ? await db`SELECT id, name, body, created_at FROM messages WHERE id > ${after} ORDER BY id ASC LIMIT 200`
      : await db`SELECT id, name, body, created_at FROM messages ORDER BY id DESC LIMIT 100`;
    const messages = after ? rows : [...rows].reverse();
    return NextResponse.json({ configured: true, messages });
  } catch (err) {
    // DATABASE_URL is set but the DB is unreachable (e.g. wrong/internal host).
    return NextResponse.json(
      { configured: true, error: "Database unreachable", detail: String(err), messages: [] },
      { status: 200 },
    );
  }
}

export async function POST(req: Request) {
  let payload: { name?: string; body?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const name = (payload.name ?? "").trim().slice(0, MAX_NAME);
  const body = (payload.body ?? "").trim().slice(0, MAX_BODY);
  if (!name || !body) {
    return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
  }

  try {
    const db = await ensureSchema();
    if (!db) return NextResponse.json({ error: "Chat is not set up yet." }, { status: 503 });
    const [row] = await db`
      INSERT INTO messages (name, body) VALUES (${name}, ${body})
      RETURNING id, name, body, created_at
    `;
    return NextResponse.json({ message: row });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the chat database." },
      { status: 503 },
    );
  }
}
