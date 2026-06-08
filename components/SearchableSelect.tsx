"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface Option {
  id: string;
  label: string;
}

/** A select that you can type into to filter — built for long lists (75+ entries). */
export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (id: string) => void;
  options: Option[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
        className="w-full flex items-center justify-between gap-2 rounded-xl bg-surface border border-line px-3 py-2.5 text-sm outline-none hover:border-pitch/60 focus:border-pitch transition-colors"
      >
        <span className="truncate text-left">{selected?.label ?? "Select…"}</span>
        <span className={`text-ink-faint transition-transform shrink-0 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full min-w-[12rem] card max-h-72 flex flex-col overflow-hidden rise">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Enter" && filtered[0]) pick(filtered[0].id);
            }}
            placeholder={placeholder}
            className="m-2 rounded-lg bg-midnight-2/60 border border-line px-3 py-2 text-sm outline-none focus:border-pitch placeholder:text-ink-faint"
          />
          <ul className="overflow-y-auto px-1 pb-1">
            {filtered.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => pick(o.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-surface-2 ${
                    o.id === value ? "text-pitch-bright" : "text-ink"
                  }`}
                >
                  <span className="w-3 shrink-0">{o.id === value ? "✓" : ""}</span>
                  <span className="truncate">{o.label}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-sm text-ink-faint">No matches</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
