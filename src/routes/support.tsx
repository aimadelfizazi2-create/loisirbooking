import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Headphones, ShieldCheck, Clock } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support technique — LoisirBooking" },
      { name: "description", content: "Une question, un souci de réservation ? Notre équipe support vous répond 7j/7." },
    ],
  }),
  component: SupportPage,
});

type Message = {
  id: string;
  sender: "user" | "support";
  message: string;
  created_at: string;
};

const AUTO_REPLIES = [
  "Bonjour ! Merci pour votre message, un conseiller revient vers vous sous peu. ⏱️",
  "C'est noté. Pouvez-vous nous indiquer la référence de votre réservation (LB-XXXX) si concernée ?",
  "Nous regardons cela tout de suite. Notre équipe est dispo 7j/7 de 8h à 22h.",
];

function SupportPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as Message[]);
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !user) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    await supabase.from("support_messages").insert({
      user_id: user.id,
      sender: "user",
      message: text,
    });

    // Simulated auto-reply (in production this would be a real agent)
    setTimeout(async () => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      await supabase.from("support_messages").insert({
        user_id: user.id,
        sender: "support",
        message: reply,
      });
      load();
      setSending(false);
    }, 1200);

    load();
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Aide</div>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            <Headphones className="mr-2 inline h-7 w-7 text-primary" />
            Support technique
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Une question sur une réservation, un QR code, un partenaire ? Écrivez-nous.
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Badge icon={<Clock className="h-4 w-4" />} label="Réponse en < 2h" />
        <Badge icon={<ShieldCheck className="h-4 w-4" />} label="Conversation chiffrée" />
        <Badge icon={<Headphones className="h-4 w-4" />} label="7j/7 · 8h–22h" />
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div
          ref={scrollRef}
          className="h-[480px] overflow-y-auto bg-secondary/20 p-4 md:p-6"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Headphones className="h-6 w-6" />
              </div>
              <p className="font-display text-base font-semibold text-foreground">Aucune conversation</p>
              <p className="mt-1 max-w-xs">
                Décrivez votre demande ci-dessous, notre équipe vous répond en moins de 2h.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-soft ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    }`}
                  >
                    {m.sender === "support" && (
                      <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                        <Headphones className="h-3 w-3" /> Support LoisirBooking
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{m.message}</div>
                    <div
                      className={`mt-1 text-[10px] ${
                        m.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {new Date(m.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </li>
              ))}
              {sending && (
                <li className="flex justify-start">
                  <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /> Le support écrit…
                    </span>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-border bg-card p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Écrivez votre message…"
            className="flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm">
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
