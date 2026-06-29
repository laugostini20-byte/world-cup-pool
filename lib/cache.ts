// Tiny in-memory TTL cache. Lives in the serverless function's module scope, so warm
// instances reuse results across requests — this replaces Next's ISR/Data cache (which
// is metered as "writes" on the free tier) for our frequently-changing live data.

interface Entry<T> {
  value: T;
  expires: number;
}

const store = new Map<string, Entry<unknown>>();

export async function cached<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const hit = store.get(key) as Entry<T> | undefined;
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await fn();
  store.set(key, { value, expires: Date.now() + ttlMs });
  return value;
}
