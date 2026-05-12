import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CITIES, findNearestCity, type City } from "@/data/cities";
import type { PriceTier } from "@/data/activities";

const STORAGE_KEY = "lb.activeCity";

type FiltersState = {
  selectedCities: string[]; // city ids; empty = all
  budget: PriceTier | "all";
  groupSize: number;
  moods: string[];
  search: string;
  detectedCity: City | null; // geo-detected
  manualCity: City | null;   // user-chosen override
  activeCity: City | null;   // manual ?? detected
  setSelectedCities: (v: string[]) => void;
  setBudget: (v: PriceTier | "all") => void;
  setGroupSize: (n: number) => void;
  setMoods: (v: string[]) => void;
  setSearch: (s: string) => void;
  setManualCity: (cityId: string | null) => void;
};

const Ctx = createContext<FiltersState | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [budget, setBudget] = useState<PriceTier | "all">("all");
  const [groupSize, setGroupSize] = useState(1);
  const [moods, setMoods] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [detectedCity, setDetectedCity] = useState<City | null>(null);
  const [manualCity, setManualCityState] = useState<City | null>(null);

  // Load persisted manual city
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const city = CITIES.find((c) => c.id === stored);
      if (city) {
        setManualCityState(city);
        setSelectedCities([city.id]);
      }
    }
  }, []);

  const setManualCity = (cityId: string | null) => {
    if (typeof window !== "undefined") {
      if (cityId) localStorage.setItem(STORAGE_KEY, cityId);
      else localStorage.removeItem(STORAGE_KEY);
    }
    if (!cityId) {
      setManualCityState(null);
      if (detectedCity) setSelectedCities([detectedCity.id]);
      return;
    }
    const city = CITIES.find((c) => c.id === cityId) ?? null;
    setManualCityState(city);
    if (city) setSelectedCities([city.id]);
  };

  // Default city: Tanger (siège social). Geolocation only refines if user allows it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return; // user has manual choice

    const defaultCity = CITIES.find((c) => c.id === "tanger")!;
    setDetectedCity(defaultCity);
    setSelectedCities((prev) => (prev.length === 0 ? [defaultCity.id] : prev));

    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        setDetectedCity(c);
        setSelectedCities((prev) => (prev.length <= 1 ? [c.id] : prev));
      },
      () => { /* keep Tanger fallback */ },
      { timeout: 5000 },
    );
  }, []);

  // activeCity reflects the search filter: exactly 1 city → that city, otherwise null
  // (0 = toutes les villes, 2+ = comparaison Maroc entier).
  const activeCity = selectedCities.length === 1
    ? (CITIES.find((c) => c.id === selectedCities[0]) ?? null)
    : null;

  const value = useMemo<FiltersState>(
    () => ({
      selectedCities, budget, groupSize, moods, search,
      detectedCity, manualCity, activeCity,
      setSelectedCities, setBudget, setGroupSize, setMoods, setSearch, setManualCity,
    }),
    [selectedCities, budget, groupSize, moods, search, detectedCity, manualCity, activeCity],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFilters() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFilters must be used within FiltersProvider");
  return v;
}
