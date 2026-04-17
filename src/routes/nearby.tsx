import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useFilters } from "@/contexts/FiltersContext";
import { ACTIVITIES } from "@/data/activities";
import { CITIES } from "@/data/cities";
import { ActivityCard } from "@/components/ActivityCard";
import { MapPin, Navigation, Compass } from "lucide-react";

export const Route = createFileRoute("/nearby")({
  head: () => ({
    meta: [
      { title: "Activités près de toi au Maroc | LoisirBooking" },
      { name: "description", content: "Découvre les expériences les plus proches de ta position : Tanger, Casablanca, Marrakech et 11 autres villes marocaines." },
      { property: "og:title", content: "Près de toi — LoisirBooking" },
      { property: "og:description", content: "Activités classées par distance depuis ta position." },
    ],
  }),
  component: NearbyPage,
});

// Haversine distance (km)
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function NearbyPage() {
  const f = useFilters();
  const origin = f.activeCity;

  const ranked = useMemo(() => {
    if (!origin) return [];
    return ACTIVITIES.map((a) => {
      const c = CITIES.find((x) => x.id === a.city);
      const dist = c ? distanceKm(origin.lat, origin.lon, c.lat, c.lon) : Infinity;
      return { activity: a, city: c, dist };
    }).sort((a, b) => a.dist - b.dist);
  }, [origin]);

  const nearbyCities = useMemo(() => {
    if (!origin) return [];
    return CITIES
      .filter((c) => c.id !== origin.id)
      .map((c) => ({ city: c, dist: distanceKm(origin.lat, origin.lon, c.lat, c.lon) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5);
  }, [origin]);

  if (!origin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Compass className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-bold">Localisation en cours…</h1>
        <p className="mt-2 text-muted-foreground">Active la géolocalisation ou choisis ta ville en haut à droite.</p>
      </div>
    );
  }

  const sameCity = ranked.filter((r) => r.activity.city === origin.id);
  const around = ranked.filter((r) => r.activity.city !== origin.id).slice(0, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Navigation className="h-3.5 w-3.5" /> Géo-classement intelligent
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
          Près de <span className="italic text-primary">{origin.name}</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Tu es à {origin.name} ? Voici tout ce que tu peux vivre dans ta ville et dans un rayon proche.
        </p>
      </div>

      {/* Same city */}
      <section className="mb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            🎯 Dans {origin.name} <span className="text-base font-normal text-muted-foreground">({sameCity.length})</span>
          </h2>
          <Link to="/activities" className="text-sm font-semibold text-primary hover:underline">
            Voir tout →
          </Link>
        </div>
        {sameCity.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sameCity.slice(0, 6).map((r) => (
              <ActivityCard key={r.activity.id} activity={r.activity} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Pas encore d'activité référencée à {origin.name}. Découvre les villes voisines ↓
          </p>
        )}
      </section>

      {/* Nearby cities chips */}
      <section className="mb-14">
        <h2 className="mb-4 font-display text-xl font-bold">📍 Villes voisines</h2>
        <div className="flex flex-wrap gap-2">
          {nearbyCities.map(({ city, dist }) => (
            <button
              key={city.id}
              onClick={() => f.setManualCity(city.id)}
              className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{city.name}</span>
              <span className="text-xs text-muted-foreground">{Math.round(dist)} km</span>
            </button>
          ))}
        </div>
      </section>

      {/* Around */}
      <section>
        <h2 className="mb-6 font-display text-2xl font-bold md:text-3xl">
          🚗 Autour de {origin.name}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {around.map((r) => (
            <div key={r.activity.id} className="relative">
              <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-bold text-background backdrop-blur">
                <Navigation className="h-3 w-3" /> {Math.round(r.dist)} km
              </span>
              <ActivityCard activity={r.activity} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
