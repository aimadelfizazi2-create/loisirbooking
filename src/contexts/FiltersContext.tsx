import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CITIES, findNearestCity, type City } from "@/data/cities";
import type { PriceTier } from "@/data/activities";

type FiltersState = {
  selectedCities: string[]; // city ids; empty = all
  budget: PriceTier | "all";
  groupSize: number;
  moods: string[];
  search: string;
  detectedCity: City | null;
  setSelectedCities: (v: string[]) => void;
  setBudget: (v: PriceTier | "all") => void;
  setGroupSize: (n: number) => void;
  setMoods: (v: string[]) => void;
  setSearch: (s: string) => void;
};

const Ctx = createContext<FiltersState | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [budget, setBudget] = useState<PriceTier | "all">("all");
  const [groupSize, setGroupSize] = useState(2);
  const [moods, setMoods] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [detectedCity, setDetectedCity] = useState<City | null>(null);

  // Geolocation auto-detect
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      const fallback = CITIES.find((c) => c.id === "casablanca")!;
      setDetectedCity(fallback);
      setSelectedCities([fallback.id]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        setDetectedCity(c);
        setSelectedCities([c.id]);
      },
      () => {
        const fallback = CITIES.find((c) => c.id === "casablanca")!;
        setDetectedCity(fallback);
        setSelectedCities([fallback.id]);
      },
      { timeout: 5000 },
    );
  }, []);

  const value = useMemo<FiltersState>(
    () => ({
      selectedCities, budget, groupSize, moods, search, detectedCity,
      setSelectedCities, setBudget, setGroupSize, setMoods, setSearch,
    }),
    [selectedCities, budget, groupSize, moods, search, detectedCity],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFilters() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFilters must be used within FiltersProvider");
  return v;
}
