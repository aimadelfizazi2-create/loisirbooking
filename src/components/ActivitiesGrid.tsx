import { useMemo } from "react";
import { ACTIVITIES } from "@/data/activities";
import { useFilters } from "@/contexts/FiltersContext";
import { useWeather } from "@/hooks/useWeather";
import { ActivityCard } from "./ActivityCard";
import { CITIES } from "@/data/cities";

const tierMaxPrice = { budget: 200, standard: 600, premium: 1500, luxe: Infinity } as const;
const tierMinPrice = { budget: 0, standard: 200, premium: 600, luxe: 1500 } as const;

export function ActivitiesGrid({ limit }: { limit?: number }) {
  const f = useFilters();
  const { weather } = useWeather(f.detectedCity?.lat, f.detectedCity?.lon);

  const list = useMemo(() => {
    let res = ACTIVITIES.filter((a) => {
      if (f.selectedCities.length > 0 && !f.selectedCities.includes(a.city)) return false;
      if (f.budget !== "all") {
        if (a.price < tierMinPrice[f.budget] || a.price >= tierMaxPrice[f.budget]) return false;
      }
      if (a.maxGroup < f.groupSize) return false;
      if (f.moods.length > 0 && !f.moods.some((m) => a.moods.includes(m))) return false;
      if (f.search.trim()) {
        const q = f.search.toLowerCase();
        const city = CITIES.find((c) => c.id === a.city);
        if (!a.title.toLowerCase().includes(q)
          && !a.short.toLowerCase().includes(q)
          && !a.category.toLowerCase().includes(q)
          && !city?.name.toLowerCase().includes(q)
          && !a.moods.some((m) => m.toLowerCase().includes(q))) return false;
      }
      return true;
    });

    // If weather is bad, surface indoor first
    if (weather && !weather.isOutdoorFriendly) {
      res = [...res].sort((a, b) => {
        const score = (x: typeof a) => (x.weather === "indoor" ? 0 : x.weather === "any" ? 1 : 2);
        return score(a) - score(b);
      });
    }

    return limit ? res.slice(0, limit) : res;
  }, [f, weather, limit]);

  if (list.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
        <div className="text-4xl">🔍</div>
        <h3 className="mt-3 font-display text-xl font-semibold">Aucune activité ne correspond</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Essaie d'élargir tes critères ou choisis une autre ville.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((a) => (
        <ActivityCard key={a.id} activity={a} />
      ))}
    </div>
  );
}
