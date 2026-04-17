export type City = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  region: string;
};

export const CITIES: City[] = [
  { id: "casablanca", name: "Casablanca", lat: 33.5731, lon: -7.5898, region: "Casablanca-Settat" },
  { id: "rabat", name: "Rabat", lat: 34.0209, lon: -6.8417, region: "Rabat-Salé-Kénitra" },
  { id: "marrakech", name: "Marrakech", lat: 31.6295, lon: -7.9811, region: "Marrakech-Safi" },
  { id: "tanger", name: "Tanger", lat: 35.7595, lon: -5.834, region: "Tanger-Tétouan-Al Hoceïma" },
  { id: "fes", name: "Fès", lat: 34.0181, lon: -5.0078, region: "Fès-Meknès" },
  { id: "chefchaouen", name: "Chefchaouen", lat: 35.1689, lon: -5.2636, region: "Tanger-Tétouan-Al Hoceïma" },
  { id: "agadir", name: "Agadir", lat: 30.4278, lon: -9.5981, region: "Souss-Massa" },
  { id: "essaouira", name: "Essaouira", lat: 31.5085, lon: -9.7595, region: "Marrakech-Safi" },
  { id: "merzouga", name: "Merzouga", lat: 31.0996, lon: -4.0125, region: "Drâa-Tafilalet" },
  { id: "ouarzazate", name: "Ouarzazate", lat: 30.9189, lon: -6.8934, region: "Drâa-Tafilalet" },
  { id: "meknes", name: "Meknès", lat: 33.8935, lon: -5.5473, region: "Fès-Meknès" },
  { id: "tetouan", name: "Tétouan", lat: 35.5784, lon: -5.3684, region: "Tanger-Tétouan-Al Hoceïma" },
  { id: "ifrane", name: "Ifrane", lat: 33.5333, lon: -5.1, region: "Fès-Meknès" },
  { id: "taghazout", name: "Taghazout", lat: 30.5446, lon: -9.7099, region: "Souss-Massa" },
];

export function findNearestCity(lat: number, lon: number): City {
  let best = CITIES[0];
  let bestDist = Infinity;
  for (const c of CITIES) {
    const d = Math.hypot(c.lat - lat, c.lon - lon);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}
