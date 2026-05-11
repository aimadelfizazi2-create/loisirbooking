import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithAI } from "@/server/chat.functions";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Salam 👋 Je suis Yasmine, ton assistante LoisirBooking. Que veux-tu faire aujourd'hui ? Aventure dans le désert, hammam, cours de cuisine… Dis-moi tout !",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const askAI = useServerFn(chatWithAI);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("yasmine:open", handler);
    return () => window.removeEventListener("yasmine:open", handler);
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await askAI({ data: { messages: next } });
      if (res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: res.content }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${res.error}` }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Erreur réseau." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Activités à Chefchaouen",
    "Quelque chose de luxe à Marrakech",
    "Sport pour 4 personnes",
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Ouvrir le chat"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-warm shadow-elegant transition hover:scale-105"
      >
        {open ? <X className="h-6 w-6 text-primary-foreground" /> : <MessageCircle className="h-6 w-6 text-primary-foreground" />}
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-saffron">
            <Sparkles className="h-3 w-3 text-foreground" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elegant md:right-6">
          <div className="flex items-center gap-3 border-b border-border bg-gradient-warm p-4 text-primary-foreground">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-bold">Yasmine</div>
              <div className="text-xs opacity-90">Assistante LoisirBooking · IA</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-secondary text-foreground"}`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Yasmine réfléchit…
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-medium text-muted-foreground">Suggestions :</div>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); setTimeout(send, 50); }}
                    className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-sm transition hover:border-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border bg-background p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Pose ta question…"
              disabled={loading}
              className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
