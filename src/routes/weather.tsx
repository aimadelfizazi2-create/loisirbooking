import { createFileRoute, Link } from "@tanstack/react-router";
import { useFilters } from "@/contexts/FiltersContext";
import { useWeather } from "@/hooks/useWeather";
import { CITIES } from "@/data/cities";
import { ACTIVITIES } from "@/data/activities";
import { CloudRain, Sun, Wind, Thermometer, AlertTriangle, MapPin, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Alertes météo & activités adaptées au Maroc | LoisirBooking" },
      { name: "description", content: "Météo en temps réel pour les 14 villes marocaines. Recommandations d'activités intérieures quand le ciel se gâte." },
      { property: "og:title", content: "Alertes météo intelligentes — LoisirBooking" },
      { property: "og:description", content: "Activités adaptées à la météo en direct." },
    ],
  }),
  component: WeatherPage,
});

function WeatherPage() {
  const f = useFilters();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold text-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-mint" />
          Données Open-Meteo en temps réel
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
          Alertes <span className="italic text-primary">Météo</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Pas envie de te retrouver sous l'orage en plein quad ?
          On vérifie la météo de chaque ville en direct et on te propose des alternatives en intérieur quand il faut.
        </p>
      </div>

      {f.detectedCity && <PrimaryCityWeather city={f.detectedCity.id} />}

      <h2 className="mt-12 mb-6 font-display text-2xl font-bold">Toutes les villes</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CITIES.map((c) => (
          <CityWeatherCard key={c.id} cityId={c.id} />
        ))}
      </div>
    </div>
  );
}

function PrimaryCityWeather({ cityId }: { cityId: string }) {
  const city = CITIES.find((c) => c.id === cityId);
  const { weather, loading } = useWeather(city?.lat, city?.lon);

  if (!city) return null;

  const indoor = ACTIVITIES.filter((a) => a.city === city.id && a.weather === "indoor").slice(0, 4);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div
        className={`p-8 text-primary-foreground md:p-10 ${
          weather && !weather.isOutdoorFriendly
            ? "bg-gradient-to-br from-zellige via-foreground to-destructive"
            : "bg-gradient-warm"
        }`}
      >
        <div className="flex items-center gap-2 text-sm opacity-90">
          <MapPin className="h-4 w-4" /> Ta position
        </div>
        <div className="mt-2 flex items-baseline gap-4">
          <h2 className="font-display text-4xl font-bold md:text-5xl">{city.name}</h2>
          {weather && <span className="text-5xl">{weather.emoji}</span>}
        </div>
        {loading && <p className="mt-2 text-sm opacity-80">Chargement météo…</p>}
        {weather && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat icon={<Thermometer className="h-4 w-4" />} label="Température" value={`${weather.tempC}°C`} />
            <Stat icon={<Wind className="h-4 w-4" />} label="Vent" value={`${weather.windKmh} km/h`} />
            <Stat icon={weather.isOutdoorFriendly ? <Sun className="h-4 w-4" /> : <CloudRain className="h-4 w-4" />} label="Ciel" value={weather.description} />
          </div>
        )}
      </div>

      {weather && !weather.isOutdoorFriendly && (
        <div className="border-t border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-destructive" />
            <div>
              <h3 className="font-display text-lg font-bold text-destructive">Activités extérieures déconseillées</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Conditions peu favorables à {city.name}. Voici des expériences en intérieur à privilégier :
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {indoor.map((a) => (
                  <Link
                    key={a.id}
                    to="/activity/$id"
                    params={{ id: a.id }}
                    className="flex gap-3 rounded-2xl bg-card p-3 transition hover:bg-secondary"
                  >
                    <img src={a.image} alt={a.title} className="h-14 w-14 flex-shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="line-clamp-1 text-sm font-semibold">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.category} · {a.price} MAD</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-xs opacity-90">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
    </div>
  );
}

function CityWeatherCard({ cityId }: { cityId: string }) {
  const city = CITIES.find((c) => c.id === cityId)!;
  const { weather } = useWeather(city.lat, city.lon);

  return (
    <div className={`rounded-2xl border p-4 transition ${weather && !weather.isOutdoorFriendly ? "border-destructive/30 bg-destructive/5" : "border-border bg-card hover:shadow-soft"}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{city.region}</div>
          <div className="font-display text-lg font-bold">{city.name}</div>
        </div>
        <div className="text-3xl">{weather?.emoji ?? "⏳"}</div>
      </div>
      {weather ? (
        <>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold">{weather.tempC}°</span>
            <span className="text-xs text-muted-foreground">{weather.description}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Vent {weather.windKmh} km/h</div>
          <div className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${weather.isOutdoorFriendly ? "bg-mint/20 text-foreground" : "bg-destructive/15 text-destructive"}`}>
            {weather.isOutdoorFriendly ? "Extérieur OK" : "Préférez l'intérieur"}
          </div>
        </>
      ) : (
        <div className="mt-2 h-12 animate-pulse rounded-lg bg-muted" />
      )}
    </div>
  );
}
