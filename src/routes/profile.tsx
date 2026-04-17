import { createFileRoute, Link } from "@tanstack/react-router";
import { ACTIVITIES } from "@/data/activities";
import { CITIES } from "@/data/cities";
import { Award, MapPin, Calendar, Star, Trophy, Sparkles, Heart, Settings, Share2 } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Mon Passeport Digital — LoisirBooking" },
      { name: "description", content: "Profil, badges collectionnés, activités passées et à venir, favoris et préférences sensorielles." },
      { property: "og:title", content: "Passeport Digital — LoisirBooking" },
      { property: "og:description", content: "Collectionne des badges en explorant le Maroc." },
    ],
  }),
  component: ProfilePage,
});

const BADGES = [
  { id: "explorer", name: "Explorateur", icon: "🧭", desc: "5 activités réalisées", earned: true, progress: 100 },
  { id: "foodie", name: "Foodie Marocain", icon: "🍲", desc: "3 expériences gastronomiques", earned: true, progress: 100 },
  { id: "atlas", name: "Atlas Lover", icon: "⛰️", desc: "Trek dans l'Atlas", earned: true, progress: 100 },
  { id: "zen", name: "Zen Master", icon: "🧘", desc: "5 séances bien-être", earned: true, progress: 100 },
  { id: "lightning", name: "Lightning", icon: "⚡", desc: "Premier groupe rejoint", earned: true, progress: 100 },
  { id: "saharian", name: "Saharien", icon: "🐪", desc: "Nuit dans le désert", earned: false, progress: 60 },
  { id: "surfer", name: "Surfeur", icon: "🏄", desc: "3 sessions surf", earned: false, progress: 33 },
  { id: "artisan", name: "Artisan", icon: "🏺", desc: "5 ateliers d'artisanat", earned: false, progress: 40 },
  { id: "city14", name: "Tour du Maroc", icon: "🗺️", desc: "14 villes visitées", earned: false, progress: 50 },
  { id: "luxe", name: "Royal", icon: "👑", desc: "3 expériences Luxe", earned: false, progress: 0 },
];

const HISTORY = [
  { activityId: "mrk-1", date: "12 mars 2026", rating: 5 },
  { activityId: "che-1", date: "28 février 2026", rating: 5 },
  { activityId: "ess-1", date: "10 février 2026", rating: 4 },
  { activityId: "fes-1", date: "22 janvier 2026", rating: 5 },
  { activityId: "ifr-1", date: "8 janvier 2026", rating: 4 },
];

const UPCOMING = [
  { activityId: "mer-1", date: "5 mai 2026", time: "16h00", group: 4 },
  { activityId: "tag-1", date: "18 mai 2026", time: "08h30", group: 2 },
];

function ProfilePage() {
  const earnedBadges = BADGES.filter((b) => b.earned);
  const stamps = HISTORY.length;
  const cities = new Set(HISTORY.map((h) => ACTIVITIES.find((a) => a.id === h.activityId)?.city)).size;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-warm p-8 text-primary-foreground shadow-elegant md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-4xl backdrop-blur md:h-24 md:w-24">
              🌟
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">Passeport Digital</div>
              <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">Yasmine Bennani</h1>
              <div className="mt-1 flex items-center gap-1.5 text-sm opacity-90">
                <MapPin className="h-3.5 w-3.5" /> Casablanca, Maroc · Membre depuis 2024
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30">
              <Share2 className="h-4 w-4" /> Partager
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur transition hover:bg-white/30">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={<Trophy />} value={`${earnedBadges.length}`} label="Badges" />
          <Stat icon={<Sparkles />} value={`${stamps}`} label="Tampons" />
          <Stat icon={<MapPin />} value={`${cities}`} label="Villes" />
          <Stat icon={<Heart />} value="12" label="Favoris" />
        </div>
      </div>

      {/* Badges */}
      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">
            <Award className="mr-2 inline h-6 w-6 text-primary" />
            Badges collectionnés
          </h2>
          <span className="text-sm text-muted-foreground">
            {earnedBadges.length}/{BADGES.length}
          </span>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={`relative overflow-hidden rounded-2xl border p-5 text-center transition ${
                b.earned
                  ? "border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-soft"
                  : "border-dashed border-border bg-muted/30 opacity-70"
              }`}
            >
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${b.earned ? "bg-accent/30" : "bg-muted grayscale"}`}>
                {b.icon}
              </div>
              <div className="mt-3 font-display text-sm font-bold">{b.name}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{b.desc}</div>
              {!b.earned && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${b.progress}%` }}
                  />
                </div>
              )}
              {b.earned && (
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-mint text-xs">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold">
            <Calendar className="mr-2 inline h-5 w-5 text-primary" />
            À venir
          </h2>
          <div className="space-y-3">
            {UPCOMING.map((u, i) => {
              const a = ACTIVITIES.find((x) => x.id === u.activityId);
              if (!a) return null;
              const city = CITIES.find((c) => c.id === a.city);
              return (
                <Link
                  key={i}
                  to="/activity/$id"
                  params={{ id: a.id }}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:border-primary"
                >
                  <img src={a.image} alt={a.title} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 font-display font-bold">{a.title}</div>
                    <div className="text-xs text-muted-foreground">📍 {city?.name}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                        {u.date} · {u.time}
                      </span>
                      <span className="rounded-full bg-secondary px-2 py-0.5">{u.group} pers.</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-2xl font-bold">
            <Star className="mr-2 inline h-5 w-5 text-primary" />
            Mes tampons
          </h2>
          <div className="space-y-3">
            {HISTORY.map((h, i) => {
              const a = ACTIVITIES.find((x) => x.id === h.activityId);
              if (!a) return null;
              const city = CITIES.find((c) => c.id === a.city);
              return (
                <div key={i} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                  <img src={a.image} alt={a.title} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground">📍 {city?.name} · {h.date}</div>
                    <div className="mt-1 flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`h-3.5 w-3.5 ${j < h.rating ? "fill-accent text-accent" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex h-12 w-12 flex-shrink-0 rotate-[-8deg] items-center justify-center rounded-full border-2 border-dashed border-primary/40 text-xl">
                    ✓
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sensory preferences */}
      <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
        <h2 className="font-display text-xl font-bold">Préférences sensorielles</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Transmises automatiquement aux prestataires pour un accueil sur-mesure (O2O).
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Pref label="Ambiance" value="Calme & cosy" />
          <Pref label="Intensité" value="Modérée" />
          <Pref label="Boisson d'accueil" value="Thé à la menthe" />
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
      <div className="flex items-center gap-2 opacity-90">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}

function Pref({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/50 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-base font-bold">{value}</div>
    </div>
  );
}
