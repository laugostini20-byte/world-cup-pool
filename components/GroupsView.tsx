"use client";

import { useEffect, useRef, useState } from "react";
import type { GroupTable } from "@/lib/types";
import { RefreshBar } from "./RefreshBar";

interface GroupsPayload {
  updatedAt: string;
  tables: GroupTable[];
}

export function GroupsView({ initial }: { initial: GroupsPayload }) {
  const [data, setData] = useState(initial);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/groups", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch {
      /* keep last good */
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    timer.current = setInterval(refresh, 60_000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-gradient">Group Tables</span>
          </h1>
          <p className="text-sm text-ink-dim mt-0.5">
            The real World Cup groups · top 2 advance (plus 8 best 3rd-place teams)
          </p>
        </div>
        <RefreshBar updatedAt={data.updatedAt} refreshing={refreshing} onRefresh={refresh} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {data.tables.map((g) => (
          <GroupCard key={g.name} table={g} />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ table }: { table: GroupTable }) {
  const played = table.rows.some((r) => r.played > 0);
  return (
    <div className="card p-3">
      <h2 className="text-sm font-bold mb-2">{table.name}</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ink-faint text-[10px] uppercase tracking-wider">
            <th className="w-6 text-left font-medium">#</th>
            <th className="text-left font-medium">Team</th>
            <th className="w-6 text-center font-medium">P</th>
            <th className="w-6 text-center font-medium">W</th>
            <th className="w-6 text-center font-medium">D</th>
            <th className="w-6 text-center font-medium">L</th>
            <th className="w-8 text-center font-medium">GD</th>
            <th className="w-8 text-center font-medium text-ink">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => {
            const qualifies = played && i < 2;
            const playoff = played && i === 2;
            return (
              <tr
                key={r.espnId || r.name}
                className={`border-t border-line/60 ${
                  qualifies ? "bg-pitch/5" : playoff ? "bg-gold/5" : ""
                }`}
              >
                <td className="py-1.5">
                  <span
                    className={`inline-block w-1 h-4 rounded mr-1 align-middle ${
                      qualifies ? "bg-pitch" : playoff ? "bg-gold/70" : "bg-transparent"
                    }`}
                  />
                  {i + 1}
                </td>
                <td className="py-1.5">
                  <span className="flex items-center gap-1.5 min-w-0">
                    {r.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.logo} alt="" className="w-4 h-4 object-contain shrink-0" />
                    ) : null}
                    <span className="truncate">{r.name}</span>
                  </span>
                </td>
                <td className="text-center text-ink-dim">{r.played}</td>
                <td className="text-center text-ink-dim">{r.wins}</td>
                <td className="text-center text-ink-dim">{r.draws}</td>
                <td className="text-center text-ink-dim">{r.losses}</td>
                <td className="text-center text-ink-dim tabular-nums">
                  {r.gd > 0 ? `+${r.gd}` : r.gd}
                </td>
                <td className="text-center font-bold tabular-nums">{r.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
