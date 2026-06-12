"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Leaderboard" },
  { href: "/chat", label: "Chat" },
  { href: "/compare", label: "Compare" },
  { href: "/teams", label: "Pool Groups" },
  { href: "/groups", label: "Groups" },
  { href: "/matches", label: "Matches" },
  { href: "/rules", label: "Rules" },
];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-midnight/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl leading-none">🏆</span>
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-gradient text-[15px] sm:text-base">
                World Cup Pool
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                2026 · Live Scoring
              </div>
            </div>
          </Link>
        </div>
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`px-3.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive(t.href)
                  ? "border-pitch text-ink"
                  : "border-transparent text-ink-dim hover:text-ink"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
