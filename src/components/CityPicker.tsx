import { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown, LocateFixed, Check } from "lucide-react";
import { useFilters } from "@/contexts/FiltersContext";
import { CITIES } from "@/data/cities";

export function CityPicker() {
  const { activeCity, manualCity, detectedCity, setManualCity } = useFilters();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const label = activeCity?.name ?? "Choisir une ville";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold transition hover:border-primary"
        aria-label="Choisir ma ville"
      >
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span className="max-w-[80px] truncate sm:max-w-none">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-popover shadow-elegant">
          <div className="border-b border-border bg-secondary/50 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Ma ville
            </div>
            {detectedCity && (
              <div className="mt-1 text-xs text-muted-foreground">
                Détectée : <strong className="text-foreground">{detectedCity.name}</strong>
              </div>
            )}
            {manualCity && (
              <button
                onClick={() => { setManualCity(null); setOpen(false); }}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-mint/20 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-mint/30"
              >
                <LocateFixed className="h-3 w-3" /> Auto-détection
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto p-1">
            {CITIES.map((c) => {
              const active = activeCity?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => { setManualCity(c.id); setOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    active ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{c.region}</span>
                  </span>
                  {active && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
