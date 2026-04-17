import { useEffect, useState } from "react";

export type Weather = {
  tempC: number;
  code: number;
  windKmh: number;
  description: string;
  emoji: string;
  isOutdoorFriendly: boolean;
};

const WMO: Record<number, { d: string; e: string; bad?: boolean }> = {
  0: { d: "Ensoleillé", e: "☀️" },
  1: { d: "Peu nuageux", e: "🌤️" },
  2: { d: "Partiellement nuageux", e: "⛅" },
  3: { d: "Couvert", e: "☁️" },
  45: { d: "Brouillard", e: "🌫️", bad: true },
  48: { d: "Brouillard givrant", e: "🌫️", bad: true },
  51: { d: "Bruine légère", e: "🌦️" },
  53: { d: "Bruine", e: "🌦️" },
  55: { d: "Bruine dense", e: "🌧️", bad: true },
  61: { d: "Pluie légère", e: "🌧️" },
  63: { d: "Pluie", e: "🌧️", bad: true },
  65: { d: "Pluie forte", e: "⛈️", bad: true },
  71: { d: "Neige légère", e: "🌨️", bad: true },
  73: { d: "Neige", e: "❄️", bad: true },
  75: { d: "Neige forte", e: "❄️", bad: true },
  80: { d: "Averses", e: "🌧️", bad: true },
  81: { d: "Averses fortes", e: "⛈️", bad: true },
  82: { d: "Averses violentes", e: "⛈️", bad: true },
  95: { d: "Orage", e: "⛈️", bad: true },
  96: { d: "Orage + grêle", e: "⛈️", bad: true },
  99: { d: "Orage violent", e: "⛈️", bad: true },
};

export function useWeather(lat?: number, lon?: number) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat == null || lon == null) return;
    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`,
    )
      .then((r) => r.json())
      .then((j) => {
        const code = j.current?.weather_code ?? 0;
        const meta = WMO[code] ?? { d: "Inconnu", e: "🌡️" };
        const wind = j.current?.wind_speed_10m ?? 0;
        const isOutdoorFriendly = !meta.bad && wind < 35;
        setWeather({
          tempC: Math.round(j.current?.temperature_2m ?? 0),
          code,
          windKmh: Math.round(wind),
          description: meta.d,
          emoji: meta.e,
          isOutdoorFriendly,
        });
      })
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  }, [lat, lon]);

  return { weather, loading };
}
