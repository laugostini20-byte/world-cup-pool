"use client";

import { useEffect, useState } from "react";

type Phase = "pending" | "playing" | "leaving" | "done";

const SESSION_KEY = "wcp-intro-seen";

export function IntroAnimation() {
  // Both server and client first-render as "pending" (renders nothing) so there's
  // no hydration mismatch. The effect then decides whether to actually play.
  const [phase, setPhase] = useState<Phase>("pending");

  useEffect(() => {
    const seen =
      typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      setPhase("done");
      return;
    }

    setPhase("playing");
    sessionStorage.setItem(SESSION_KEY, "1");

    const toLeaving = setTimeout(() => setPhase("leaving"), 1850);
    const toDone = setTimeout(() => setPhase("done"), 2300);
    return () => {
      clearTimeout(toLeaving);
      clearTimeout(toDone);
    };
  }, []);

  if (phase === "pending" || phase === "done") return null;

  const skip = () => setPhase("done");

  return (
    <div
      className={`intro-overlay ${phase === "leaving" ? "leaving" : ""}`}
      onClick={skip}
      role="presentation"
    >
      <div className="intro-mark">
        <div className="intro-trophy">🏆</div>
        <div className="mt-3 intro-sweep">
          <div className="intro-line text-2xl sm:text-4xl text-ink">WORLD CUP</div>
          <div className="intro-line text-4xl sm:text-6xl text-gradient">POOL</div>
        </div>
        <div className="mt-2 text-sm sm:text-base uppercase tracking-[0.5em] text-ink-faint">
          2026
        </div>
      </div>
      <button
        onClick={skip}
        className="absolute bottom-8 text-[11px] uppercase tracking-widest text-ink-faint hover:text-ink transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
