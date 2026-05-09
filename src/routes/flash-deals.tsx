import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ACTIVITIES, type Activity, getEffectivePrice } from "@/data/activities";
import { CITIES } from "@/data/cities";
import { Zap, Clock, MapPin, TrendingDown, Flame } from "lucide-react";
import { useFilters } from "@/contexts/FiltersContext";
import { useActivityImages } from "@/hooks/useActivityImages";

export const Route = createFileRoute("/flash-deals")({
  head: () => ({
    meta: [
      { title: "Flash Deals — Offres dernière minute au Maroc | LoisirBooking" },
      { name: "description", content: "Activités à prix cassés : -20% à -40% sur les créneaux invendus du jour. Yield management automatisé." },
    ],
  }),
  component: FlashDealsPage,
});

type Deal = { id: string; activity: Activity; expiresAt: number; spotsLeft: number };

function buildDeals(activities: Activity[]): Deal[] {
  const now = Date.now();
  return activities
    .filter((a) => a.flashDeal)
    .map((a, i) => ({
      id: `deal-${a.id}`,
      activity: a,
      expiresAt: now + (1 + (i % 9)) * 60 * 60 * 1000,
      spotsLeft: 1 + (i % 7),
    }));
}

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, expired: diff <= 0 };
}

function FlashDealsPage() {
  const f = useFilters();
  const cityId = f.activeCity?.id;
  const cityName = f.activeCity?.name;

  const filteredActivities = useMemo(() => {
    const all = ACTIVITIES.filter((a) => !!a.flashDeal);
    if (!cityId) return all;
    const local = all.filter((a) => a.city === cityId);
    return local.length >= 2 ? local : all;
  }, [cityId]);

  const [deals, setDeals] = useState<Deal[]>(() => buildDeals(filteredActivities));
  useEffect(() => { setDeals(buildDeals(filteredActivities)); }, [filteredActivities]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-destructive via-primary to-accent p-8 text-primary-foreground md:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Flame className="h-6 w-6" />
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
            Yield Management
          </span>
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">
          Flash <span className="italic">Deals</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
          {cityName ? <>Offres flash autour de <strong>{cityName}</strong>. </> : null}
          Réductions <strong>réelles</strong> sur une sélection d'activités — appliquées automatiquement à la réservation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">⚡ {deals.length} deals</span>
          <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">📍 {cityName ?? "Autour de toi"}</span>
          <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">⏱ Expire bientôt</span>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
          <h3 className="font-display text-xl font-semibold">Aucun Flash Deal pour le moment</h3>
          <p className="mt-2 text-sm text-muted-foreground">Reviens plus tard, les créneaux invendus apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      )}
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const { h, m, s, expired } = useCountdown(deal.expiresAt);
  const a = deal.activity;
  const city = CITIES.find((c) => c.id === a.city);
  const newPrice = getEffectivePrice(a);
  const discount = a.flashDeal!.discountPct;
  const { data: images } = useActivityImages(a);
  const heroSrc = images?.hero_url ?? a.image;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:shadow-elegant">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1.5 text-xs font-bold text-destructive-foreground shadow-elegant">
        <TrendingDown className="h-3.5 w-3.5" />
        −{discount}%
      </div>
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold backdrop-blur">
        <Zap className="h-3.5 w-3.5 text-accent" />
        {deal.spotsLeft} place{deal.spotsLeft > 1 ? "s" : ""}
      </div>
      <div className="aspect-[4/3] overflow-hidden">
        <img src={heroSrc} alt={a.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {city?.name} · {a.category}
        </div>
        <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold">{a.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground italic">{a.flashDeal!.reason}</p>
        <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-mono tabular-nums ${expired ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive"}`}>
          <Clock className="h-4 w-4" />
          {expired ? "Expiré" : <span>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</span>}
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-xs text-muted-foreground line-through">{a.price} MAD</div>
            <div className="font-display text-2xl font-bold text-primary">{newPrice} MAD</div>
          </div>
          <Link to="/activity/$id" params={{ id: a.id }} className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:opacity-90">
            Réserver
          </Link>
        </div>
      </div>
    </article>
  );
}
