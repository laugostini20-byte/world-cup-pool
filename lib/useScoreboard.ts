"use client";

import { useEffect, useRef, useState } from "react";
import type { Scoreboard } from "./types";

const POLL_MS = 60_000;

/**
 * Holds the scoreboard and refreshes it from /api/scores on an interval.
 * Seeded with server-rendered data so first paint is instant.
 */
export function useScoreboard(initial: Scoreboard) {
  const [board, setBoard] = useState(initial);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/scores", { cache: "no-store" });
      if (res.ok) setBoard(await res.json());
    } catch {
      /* keep showing last good data */
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    timer.current = setInterval(refresh, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      if (timer.current) clearInterval(timer.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return { board, refreshing, refresh };
}
