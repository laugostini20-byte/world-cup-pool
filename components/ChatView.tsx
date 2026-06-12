"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: number;
  name: string;
  body: string;
  created_at: string;
}

const NAME_KEY = "wcp-chat-name";
const POLL_MS = 3000;

export function ChatView() {
  const [name, setName] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const lastId = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setName(localStorage.getItem(NAME_KEY));
  }, []);

  async function load(initial = false) {
    try {
      const url = lastId.current ? `/api/chat?after=${lastId.current}` : "/api/chat";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      setConfigured(data.configured);
      if (data.messages?.length) {
        setMessages((prev) => {
          const merged = initial || !lastId.current ? data.messages : [...prev, ...data.messages];
          lastId.current = merged[merged.length - 1].id;
          return merged;
        });
      }
    } catch {
      /* keep last good */
    }
  }

  useEffect(() => {
    load(true);
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const body = draft.trim();
    if (!body || !name || sending) return;
    setSending(true);
    setDraft("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, body }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          lastId.current = Math.max(lastId.current, message.id);
          return [...prev, message];
        });
      }
    } finally {
      setSending(false);
    }
  }

  const saveName = () => {
    const n = nameDraft.trim().slice(0, 30);
    if (!n) return;
    localStorage.setItem(NAME_KEY, n);
    setName(n);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="text-gradient">Trash Talk</span>
        </h1>
        <p className="text-sm text-ink-dim mt-0.5">
          {name ? (
            <>
              Posting as <span className="text-pitch-bright font-medium">{name}</span> ·{" "}
              <button onClick={() => { localStorage.removeItem(NAME_KEY); setName(null); }} className="underline hover:text-ink">
                change
              </button>
            </>
          ) : (
            "Pick a name to join the smack talk"
          )}
        </p>
      </div>

      {configured === false && (
        <div className="card p-6 text-center text-sm text-ink-dim">
          💬 Chat is being set up. Check back soon!
        </div>
      )}

      {configured !== false && (
        <div className="card flex flex-col h-[68vh]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.length === 0 ? (
              <p className="text-center text-ink-faint text-sm py-10">
                No messages yet. Be the first to talk some trash. 🔥
              </p>
            ) : (
              messages.map((m) => <Bubble key={m.id} m={m} mine={m.name === name} />)
            )}
            <div ref={bottomRef} />
          </div>

          {name ? (
            <div className="border-t border-line p-2 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                maxLength={500}
                placeholder="Say something…"
                className="flex-1 rounded-xl bg-surface border border-line px-3 py-2.5 text-sm outline-none focus:border-pitch placeholder:text-ink-faint"
              />
              <button
                onClick={send}
                disabled={sending || !draft.trim()}
                className="px-4 rounded-xl bg-pitch/20 border border-pitch/40 text-pitch-bright font-semibold text-sm hover:bg-pitch/30 disabled:opacity-40 transition-colors"
              >
                Send
              </button>
            </div>
          ) : (
            <div className="border-t border-line p-2 flex gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                maxLength={30}
                placeholder="Enter your name to chat…"
                className="flex-1 rounded-xl bg-surface border border-line px-3 py-2.5 text-sm outline-none focus:border-pitch placeholder:text-ink-faint"
              />
              <button
                onClick={saveName}
                disabled={!nameDraft.trim()}
                className="px-4 rounded-xl bg-pitch/20 border border-pitch/40 text-pitch-bright font-semibold text-sm hover:bg-pitch/30 disabled:opacity-40 transition-colors"
              >
                Join
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Bubble({ m, mine }: { m: ChatMessage; mine: boolean }) {
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(m.created_at));
  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div className="flex items-baseline gap-2 mb-0.5 px-1">
        <span className={`text-xs font-semibold ${mine ? "text-pitch-bright" : "text-ink-dim"}`}>
          {mine ? "You" : m.name}
        </span>
        <span className="text-[10px] text-ink-faint">{time}</span>
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm break-words ${
          mine
            ? "bg-pitch/15 border border-pitch/30 rounded-br-sm"
            : "bg-surface-2 border border-line rounded-bl-sm"
        }`}
      >
        {m.body}
      </div>
    </div>
  );
}
