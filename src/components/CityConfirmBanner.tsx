import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { useFilters } from "@/contexts/FiltersContext";

const POPULAR = ["tanger", "casablanca", "marrakech", "rabat", "fes", "agadir"];
const KEY = "lb.cityConfirmed";

export function CityConfirmBanner() {
  const { activeCity, manualCity, setManualCity } = useFilters();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const confirmed = localStorage.getItem(KEY);
    setDismissed(!!confirmed || !!manualCity);
  }, [manualCity]);

  if (dismissed || !activeCity) return null;

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setDismissed(true);
  };

  const choose = (id: string) => {
    setManualCity(id);
    localStorage.setItem(KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="border-b border-saffron/30 bg-gradient-to-r from-saffron/15 via-primary/10 to-saffron/15">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2.5 md:px-8">
        <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
        <p className="text-xs font-medium md:text-sm">
          On t'a placé à <strong>{activeCity.name}</strong>. Pas la bonne ville ?
        </p>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR.filter((id) => id !== activeCity.id).slice(0, 4).map((id) => {
            const name = id.charAt(0).toUpperCase() + id.slice(1);
            return (
              <button
                key={id}
                onClick={() => choose(id)}
                className="rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold transition hover:bg-primary hover:text-primary-foreground"
              >
                {name === "Fes" ? "Fès" : name}
              </button>
            );
          })}
        </div>
        <button
          onClick={dismiss}
          className="ml-auto rounded-full p-1 text-muted-foreground transition hover:bg-background"
          aria-label="Fermer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
