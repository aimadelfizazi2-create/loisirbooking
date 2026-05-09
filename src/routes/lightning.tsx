import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ACTIVITIES, type Activity } from "@/data/activities";
import { CITIES } from "@/data/cities";
import { Zap, Users, Clock, MapPin, MessageCircle, Plus, Send, X } from "lucide-react";
import { useFilters } from "@/contexts/FiltersContext";
import { useActivityImages } from "@/hooks/useActivityImages";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/lightning")({
  head: () => ({
    meta: [
      { title: "Lightning Matching — Rejoignez un groupe au Maroc | LoisirBooking" },
      { name: "description", content: "Transformez votre réservation solo en aventure collective. Rejoignez des groupes éphémères pour vivre une activité ensemble." },
      { property: "og:title", content: "Lightning Matching — Voyagez ensemble" },
      { property: "og:description", content: "Groupes spontanés autour des activités." },
    ],
  }),
  component: LightningPage,
});

type Group = {
  id: string;
  activityId: string;
  host: string;
  hostAvatar: string;
  startsIn: string;
  current: number;
  capacity: number;
  vibe: string;
  languages: string[];
};

const AVATARS = ["🧗‍♀️", "🧘‍♂️", "🏄‍♀️", "👨‍🍳", "🏇", "🚴‍♀️", "🎨", "🎭", "🪂", "🐪"];

function buildGroups(activities: Activity[]): Group[] {
  return activities.slice(0, 24).map((a, i) => ({
    id: `grp-${a.id}`,
    activityId: a.id,
    host: ["Yasmine", "Karim", "Sofia", "Mehdi", "Léa", "Ayoub", "Amina", "Tariq"][i % 8],
    hostAvatar: AVATARS[i % AVATARS.length],
    startsIn: ["Dans 2h", "Demain 09h", "Aujourd'hui 18h", "Vendredi 15h", "Dimanche 11h"][i % 5],
    current: 1 + (i % 5),
    capacity: 4 + (i % 6),
    vibe: ["Chill 🌿", "Énergique ⚡", "Découverte 🌍", "Photo 📸", "Famille 👨‍👩‍👧"][i % 5],
    languages: [["FR", "EN"], ["FR", "AR"], ["FR", "EN", "ES"], ["AR", "FR"]][i % 4],
  }));
}

function LightningPage() {
  const f = useFilters();
  const cityId = f.activeCity?.id;
  const cityName = f.activeCity?.name;
  const localActivities = useMemo(() => {
    const eligible = ACTIVITIES.filter((a) => a.lightning);
    if (!cityId) return eligible;
    const local = eligible.filter((a) => a.city === cityId);
    return local.length >= 2 ? local : eligible;
  }, [cityId]);

  const [groups, setGroups] = useState<Group[]>(() => buildGroups(localActivities));
  useEffect(() => { setGroups(buildGroups(localActivities)); }, [localActivities]);

  const [filter, setFilter] = useState<"all" | "open" | "starting">("all");
  const [chatGroupId, setChatGroupId] = useState<string | null>(null);

  const filtered = groups.filter((g) => {
    if (filter === "open") return g.current < g.capacity;
    if (filter === "starting") return g.startsIn.includes("2h") || g.startsIn.includes("Aujourd'hui");
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-zellige/10 px-3 py-1 text-xs font-semibold text-zellige">
            <Zap className="h-3.5 w-3.5" />
            Innovation sociale
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
            Lightning <span className="italic text-primary">Matching</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
            Voyager seul, partager à plusieurs. Rejoins ou crée un groupe éphémère
            {cityName ? <> autour de <strong>{cityName}</strong></> : null} pour
            vivre la même activité avec d'autres explorateurs.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["all", "open", "starting"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === k ? "bg-foreground text-background" : "bg-secondary hover:bg-secondary/70"
                }`}
              >
                {k === "all" ? "Tous" : k === "open" ? "Places dispo" : "Commence bientôt"}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold">Comment ça marche ?</h3>
          <ol className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
              <span>Tu choisis une activité ou un créneau libre.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
              <span>Le système te matche avec d'autres voyageurs au profil compatible.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
              <span>Chat de groupe instantané, paiement fractionné automatique (split).</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span>
              <span>RDV sur place, badge "Lightning" ajouté à ton passeport.</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Groupes ouverts</h2>
        <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          <Plus className="h-4 w-4" />
          Créer un groupe
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => {
          const a = ACTIVITIES.find((x) => x.id === g.activityId)!;
          return (
            <GroupCard key={g.id} group={g} activity={a} onOpenChat={() => setChatGroupId(g.id)} />
          );
        })}
      </div>

      {chatGroupId && (
        <ChatDialog groupId={chatGroupId} onClose={() => setChatGroupId(null)} />
      )}
    </div>
  );
}

function GroupCard({
  group: g,
  activity: a,
  onOpenChat,
}: {
  group: Group;
  activity: Activity;
  onOpenChat: () => void;
}) {
  const city = CITIES.find((c) => c.id === a.city);
  const full = g.current >= g.capacity;
  const { data: images } = useActivityImages(a);
  const heroSrc = images?.hero_url ?? a.image;

  return (
    <article className="group block overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
      <Link to="/activity/$id" params={{ id: a.id }} className="block">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={heroSrc}
            alt={a.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <MapPin className="h-3 w-3" /> {city?.name}
            </div>
            <h3 className="mt-1 line-clamp-1 font-display text-lg font-bold text-white">{a.title}</h3>
          </div>
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xl">{g.hostAvatar}</div>
          <div>
            <div className="text-sm font-semibold">{g.host}</div>
            <div className="text-xs text-muted-foreground">Hôte du groupe</div>
          </div>
          <span className="ml-auto rounded-full bg-accent/20 px-2.5 py-1 text-xs font-medium">{g.vibe}</span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" /> {g.startsIn}
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <Users className="h-4 w-4 text-primary" />
            {g.current}/{g.capacity}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {g.languages.map((l) => (
            <span key={l} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">{l}</span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to="/activity/$id"
            params={{ id: a.id }}
            className={`flex-1 rounded-full px-4 py-2 text-center text-xs font-semibold transition ${
              full ? "bg-muted text-muted-foreground" : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            {full ? "Complet — voir l'activité" : "Rejoindre & réserver"}
          </Link>
          <button
            type="button"
            onClick={onOpenChat}
            title="Ouvrir le chat de groupe"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-primary"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

type ChatMessage = {
  id: string;
  group_id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
};

function ChatDialog({ groupId, onClose }: { groupId: string; onClose: () => void }) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("lightning_messages")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: true })
        .limit(200);
      if (!cancelled) {
        setMessages((data ?? []) as ChatMessage[]);
        setLoading(false);
      }
    })();

    const channel = supabase
      .channel(`lightning-${groupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "lightning_messages", filter: `group_id=eq.${groupId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!text.trim() || !user) return;
    const msg = text.trim();
    setText("");
    await supabase.from("lightning_messages").insert({
      group_id: groupId,
      user_id: user.id,
      user_name: profile?.full_name ?? user.email?.split("@")[0] ?? "Anonyme",
      message: msg,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center">
      <div className="flex h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <h3 className="font-display text-base font-bold">Chat du groupe</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {loading && <p className="text-center text-xs text-muted-foreground">Chargement…</p>}
          {!loading && messages.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">Sois le premier à écrire dans ce groupe.</p>
          )}
          {messages.map((m) => {
            const mine = m.user_id === user?.id;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {!mine && <div className="mb-0.5 text-[10px] font-bold uppercase opacity-70">{m.user_name}</div>}
                  <div className="whitespace-pre-wrap">{m.message}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border p-3">
          {user ? (
            <form
              className="flex gap-2"
              onSubmit={(e) => { e.preventDefault(); send(); }}
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Écrire un message…"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              <Link to="/auth" className="font-semibold text-primary underline">Connecte-toi</Link> pour discuter avec le groupe.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
