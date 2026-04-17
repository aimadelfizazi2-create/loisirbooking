import { createFileRoute, Link } from "@tanstack/react-router";
import { ITINERARIES } from "@/data/itineraries";
import { CITIES } from "@/data/cities";
import { ACTIVITIES } from "@/data/activities";
import { Calendar, MapPin, Sparkles, ArrowRight, Gauge } from "lucide-react";

export const Route = createFileRoute("/itineraries")({
  head: () => ({
    meta: [
      { title: "Itinéraires multi-jours au Maroc | LoisirBooking" },
      { name: "description", content: "6 parcours conçus par des locaux : Tour Impérial, Sahara Express, Côte Atlantique, Nord Bleu… Réserve un voyage clé-en-main." },
      { property: "og:title", content: "Itinéraires Maroc — LoisirBooking" },
      { property: "og:description", content: "Parcours multi-villes prêts à vivre, conçus par des locaux." },
    ],
  }),
  component: ItinerariesPage,
});

function ItinerariesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-saffron/20 px-3 py-1 text-xs font-semibold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-zellige" /> Conçus par des locaux
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
          Itinéraires <span className="italic text-primary">multi-jours</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Pas le temps de planifier ? On a déjà combiné les meilleures expériences en parcours cohérents.
          Hébergement et transferts en option.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {ITINERARIES.map((it) => (
          <ItineraryCard key={it.id} id={it.id} />
        ))}
      </div>
    </div>
  );
}

function ItineraryCard({ id }: { id: string }) {
  const it = ITINERARIES.find((x) => x.id === id)!;
  const cities = it.cities.map((cid) => CITIES.find((c) => c.id === cid)?.name).filter(Boolean);
  const acts = it.activityIds
    .map((aid) => ACTIVITIES.find((a) => a.id === aid))
    .filter(Boolean)
    .slice(0, 3);

  const paceColor =
    it.pace === "Tranquille" ? "bg-mint/20 text-foreground"
    : it.pace === "Équilibré" ? "bg-saffron/20 text-foreground"
    : "bg-destructive/15 text-destructive";

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:shadow-elegant">
      <div className="relative h-48 overflow-hidden bg-gradient-warm">
        <div className="pattern-zellige absolute inset-0 opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center text-7xl">{it.emoji}</div>
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold backdrop-blur">
          <Calendar className="h-3 w-3 text-primary" /> {it.days} jours
        </div>
        <div className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur ${paceColor}`}>
          <Gauge className="h-3 w-3" /> {it.pace}
        </div>
      </div>

      <div className="p-6">
        <div className="text-xs font-semibold text-primary">{it.vibe}</div>
        <h3 className="mt-1 font-display text-2xl font-bold leading-tight">{it.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{it.tagline}</p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          {cities.map((name, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-semibold">
              <MapPin className="h-3 w-3 text-primary" /> {name}
            </span>
          ))}
        </div>

        <ul className="mt-4 space-y-1.5 text-sm">
          {it.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2">
              <span className="mt-1 text-primary">●</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {acts.length > 0 && (
          <div className="mt-5 border-t border-border/50 pt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Inclus dans ce parcours
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {acts.map((a) => (
                <Link
                  key={a!.id}
                  to="/activity/$id"
                  params={{ id: a!.id }}
                  className="flex-shrink-0"
                >
                  <img src={a!.image} alt={a!.title} className="h-14 w-14 rounded-xl object-cover transition hover:scale-105" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
          <div>
            <div className="text-[11px] text-muted-foreground">À partir de</div>
            <div className="font-display text-2xl font-bold">
              {it.totalPrice.toLocaleString("fr-FR")} <span className="text-sm">MAD</span>
            </div>
            <div className="text-[11px] text-muted-foreground">par personne · {it.best}</div>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90">
            Réserver <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
