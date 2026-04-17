import { useState } from "react";
import { useFilters } from "@/contexts/FiltersContext";
import { useWeather } from "@/hooks/useWeather";
import { CITIES } from "@/data/cities";
import { PRICE_TIERS, type PriceTier } from "@/data/activities";
import { MapPin, Wallet, Users, Search, ChevronDown, AlertTriangle, X } from "lucide-react";

export function FilterBar() {
  const f = useFilters();
  const [openCities, setOpenCities] = useState(false);
  const [openBudget, setOpenBudget] = useState(false);

  const { weather } = useWeather(f.detectedCity?.lat, f.detectedCity?.lon);

  const toggleCity = (id: string) => {
    f.setSelectedCities(
      f.selectedCities.includes(id)
        ? f.selectedCities.filter((c) => c !== id)
        : [...f.selectedCities, id],
    );
  };

  const citiesLabel = f.selectedCities.length === 0
    ? "Toutes les villes"
    : f.selectedCities.length === 1
    ? CITIES.find((c) => c.id === f.selectedCities[0])?.name
    : `${f.selectedCities.length} villes`;

  const budgetLabel = f.budget === "all" ? "Tous budgets" : PRICE_TIERS.find((t) => t.id === f.budget)?.label;

  return (
    <div className="space-y-3">
      {/* Weather alert */}
      {weather && !weather.isOutdoorFriendly && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <strong>Alerte météo à {f.detectedCity?.name} :</strong>{" "}
            {weather.description.toLowerCase()} {weather.emoji} ({weather.tempC}°C, vent {weather.windKmh} km/h).
            Les activités en extérieur peuvent être déconseillées — privilégiez les expériences en intérieur.
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-3 shadow-soft md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={f.search}
              onChange={(e) => f.setSearch(e.target.value)}
              placeholder="Rechercher une activité, un lieu, un mood…"
              className="h-12 w-full rounded-2xl border border-input bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Cities */}
          <div className="relative">
            <button
              onClick={() => { setOpenCities(!openCities); setOpenBudget(false); }}
              className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-input bg-background px-4 text-sm transition hover:border-primary md:w-56"
            >
              <span className="flex items-center gap-2 truncate">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate">{citiesLabel}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {openCities && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-80 overflow-auto rounded-2xl border border-border bg-popover p-2 shadow-elegant md:w-72">
                {f.detectedCity && (
                  <div className="mb-2 rounded-xl bg-mint/10 px-3 py-2 text-xs text-muted-foreground">
                    📍 Position détectée : <strong className="text-foreground">{f.detectedCity.name}</strong>
                  </div>
                )}
                <button
                  onClick={() => f.setSelectedCities([])}
                  className="mb-1 w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary"
                >
                  Toutes les villes
                </button>
                {CITIES.map((c) => {
                  const active = f.selectedCities.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCity(c.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${active ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                    >
                      <span>{c.name}</span>
                      {active && <span className="text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="relative">
            <button
              onClick={() => { setOpenBudget(!openBudget); setOpenCities(false); }}
              className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-input bg-background px-4 text-sm transition hover:border-primary md:w-44"
            >
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                {budgetLabel}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {openBudget && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-border bg-popover p-2 shadow-elegant md:w-56">
                <button
                  onClick={() => { f.setBudget("all"); setOpenBudget(false); }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary"
                >
                  Tous budgets
                </button>
                {PRICE_TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { f.setBudget(t.id as PriceTier); setOpenBudget(false); }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${f.budget === t.id ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
                  >
                    <span className="font-medium">{t.label}</span>
                    <span className="text-xs text-muted-foreground">{t.range}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Group size */}
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-input bg-background px-4 md:w-44">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Pers.</span>
            <button
              onClick={() => f.setGroupSize(Math.max(1, f.groupSize - 1))}
              className="h-7 w-7 rounded-full bg-secondary text-sm hover:bg-primary hover:text-primary-foreground"
            >−</button>
            <span className="w-6 text-center font-semibold">{f.groupSize}</span>
            <button
              onClick={() => f.setGroupSize(Math.min(50, f.groupSize + 1))}
              className="h-7 w-7 rounded-full bg-secondary text-sm hover:bg-primary hover:text-primary-foreground"
            >+</button>
          </div>
        </div>

        {/* Active chips */}
        {(f.selectedCities.length > 0 || f.budget !== "all" || f.moods.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border/50 pt-3">
            {f.selectedCities.map((id) => {
              const c = CITIES.find((x) => x.id === id);
              return (
                <Chip key={id} onRemove={() => toggleCity(id)}>
                  📍 {c?.name}
                </Chip>
              );
            })}
            {f.budget !== "all" && (
              <Chip onRemove={() => f.setBudget("all")}>
                💰 {PRICE_TIERS.find((t) => t.id === f.budget)?.label}
              </Chip>
            )}
            {f.moods.map((m) => (
              <Chip key={m} onRemove={() => f.setMoods(f.moods.filter((x) => x !== m))}>
                {m}
              </Chip>
            ))}
          </div>
        )}

        {/* Weather badge */}
        {weather && f.detectedCity && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-base">{weather.emoji}</span>
            <span>
              {f.detectedCity.name} · {weather.tempC}°C · {weather.description} · vent {weather.windKmh} km/h
            </span>
            <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${weather.isOutdoorFriendly ? "bg-mint/15 text-foreground" : "bg-destructive/15 text-destructive"}`}>
              {weather.isOutdoorFriendly ? "Idéal pour l'extérieur" : "Préférez l'intérieur"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
      {children}
      <button onClick={onRemove} className="ml-1 rounded-full p-0.5 hover:bg-background">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
