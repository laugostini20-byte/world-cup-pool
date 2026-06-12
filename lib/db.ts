import postgres from "postgres";

// Single connection to the Railway Postgres database. The chat is the only feature
// that needs a backend; if DATABASE_URL isn't set the chat APIs report "not configured"
// and the rest of the app is unaffected.

let sql: ReturnType<typeof postgres> | null = null;
let ensured = false;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) {
    sql = postgres(url, {
      max: 1, // serverless: keep the pool tiny
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: "require",
    });
  }
  return sql;
}

/** Create the messages table once per process. */
export async function ensureSchema() {
  const db = getSql();
  if (!db || ensured) return db;
  await db`
    CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  ensured = true;
  return db;
}
