"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/format";

export function RefreshBar({
  updatedAt,
  refreshing,
  onRefresh,
}: {
  updatedAt: string;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const [, tick] = useState(0);
  // Re-render every 10s so the "updated Xs ago" label stays current.
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-ink-faint">
      <span className="flex items-center gap-1.5">
        <span className="live-dot w-1.5 h-1.5 rounded-full bg-pitch" />
        Live
      </span>
      <span>·</span>
      <span>Updated {relativeTime(updatedAt)}</span>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="ml-1 px-2 py-0.5 rounded-md border border-line hover:border-pitch hover:text-ink transition-colors disabled:opacity-50"
      >
        {refreshing ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
