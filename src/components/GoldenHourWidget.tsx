import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sun, Moon, Coffee, Wine, Sunrise } from "lucide-react";
import { useFilters } from "@/contexts/FiltersContext";
import { ACTIVITIES, type Activity } from "@/data/activities";
import { useActivityImages } from "@/hooks/useActivityImages";

type TimeSlot = {
  id: string;
  label: string;
  desc: string;
  hours: [number, number];
  icon: React.ReactNode;
  moods: string[];
  prefer: "outdoor" | "indoor" | "any";
};

const SLOTS: TimeSlot[] = [
  { id: "dawn", label: "Aurore", desc: "Décollages, sunrises, méditation",
    hours: [5, 9], icon: <Sunrise className="h-5 w-5" />, moods: ["#MomentMagique", "#AventureForte"], prefer: "outdoor" },
  { id: "morning", label: "Matinée", desc: "Visites culturelles & ateliers",
    hours: [9, 12], icon: <Coffee className="h-5 w-5" />, moods: ["#PatrimoineVivant", "#SaveursAuthentiques"], prefer: "any" },
  { id: "afternoon", label: "Après-midi", desc: "Aventure, plage, sport",
    hours: [12, 17], icon: <Sun className="h-5 w-5" />, moods: ["#BesoinDeTranspirer", "#AventureForte"], prefer: "outdoor" },
  { id: "golden", label: "Heure dorée", desc: "Couchers de soleil & vues panoramiques",
    hours: [17, 20], icon: <Wine className="h-5 w-5" />, moods: ["#MomentMagique", "#MomentLuxe"], prefer: "any" },
  { id: "night", label: "Soirée", desc: "Hammams, dîners, ambiance lounge",
    hours: [20, 24], icon: <Moon className="h-5 w-5" />, moods: ["#DéconnexionTotale", "#MomentLuxe"], prefer: "indoor" },
];

function slotForHour(h: number): TimeSlot {
  return SLOTS.find((s) => h >= s.hours[0] && h < s.hours[1]) ?? SLOTS[1];
}

export function GoldenHourWidget() {
  const f = useFilters();
  const [hour, setHour] = useState<number>(() => new Date().getHours());

  useEffect(() => {
    const t = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(t);
  }, []);

  const current = slotForHour(hour);

  const suggestions = useMemo(() => {
    const cityFilter = f.activeCity?.id;
    let pool = ACTIVITIES.filter((a) => {
      if (cityFilter && a.city !== cityFilter) return false;
      if (current.prefer !== "any" && a.weather !== current.prefer && a.weather !== "any") return false;
      return current.moods.some((m) => a.moods.includes(m));
    });
    // Fallback if not enough in city
    if (pool.length < 3) {
      pool = ACTIVITIES.filter((a) => current.moods.some((m) => a.moods.includes(m)));
    }
    return pool.slice(0, 3);
  }, [current, f.activeCity]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-saffron/15 via-card to-primary/10 p-6 shadow-soft md:p-10">
        <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-center md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur">
              {current.icon} {hour.toString().padStart(2, "0")}h00 · {current.label}
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
              Le bon moment pour <span className="italic text-primary">{current.label.toLowerCase()}</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{current.desc}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {SLOTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setHour(s.hours[0])}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    s.id === current.id ? "bg-primary text-primary-foreground" : "bg-background/70 text-muted-foreground hover:bg-background"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {suggestions.map((a) => (
              <SuggestionCard key={a.id} activity={a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuggestionCard({ activity }: { activity: Activity }) {
  const { data: images } = useActivityImages(activity);
  const src = images?.hero_url ?? activity.image;
  return (
    <Link
      to="/activity/$id"
      params={{ id: activity.id }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
    >
      <img src={src} alt={activity.title} loading="lazy" className="h-32 w-full object-cover transition group-hover:scale-105" />
      <div className="p-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-primary">{activity.category}</div>
        <div className="line-clamp-2 mt-0.5 font-display text-sm font-bold leading-tight">{activity.title}</div>
        <div className="mt-1.5 text-xs text-muted-foreground">{activity.duration} · {activity.price} MAD</div>
      </div>
    </Link>
  );
}
