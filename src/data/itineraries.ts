export type Itinerary = {
  id: string;
  title: string;
  tagline: string;
  days: number;
  cities: string[]; // city ids
  totalPrice: number;
  vibe: string;
  emoji: string;
  highlights: string[];
  best: string; // best season
  pace: "Tranquille" | "Équilibré" | "Intense";
  activityIds: string[]; // ids from ACTIVITIES
};

export const ITINERARIES: Itinerary[] = [
  {
    id: "imperial",
    title: "Le Tour Impérial",
    tagline: "Quatre capitales, mille dynasties",
    days: 7,
    cities: ["rabat", "meknes", "fes", "marrakech"],
    totalPrice: 4200,
    vibe: "#PatrimoineVivant",
    emoji: "👑",
    highlights: ["Médina de Fès UNESCO", "Volubilis & Meknès", "Jardin Majorelle", "Hammam royal"],
    best: "Mars — Mai · Sept — Nov",
    pace: "Équilibré",
    activityIds: ["fez-1", "fez-2", "mrk-1", "mrk-4"],
  },
  {
    id: "atlantic",
    title: "Côte Atlantique Surf & Soul",
    tagline: "De Tanger à Taghazout, vagues et brise",
    days: 6,
    cities: ["tanger", "rabat", "casablanca", "essaouira", "taghazout", "agadir"],
    totalPrice: 3500,
    vibe: "#BesoinDeTranspirer",
    emoji: "🏄",
    highlights: ["Cap Spartel", "Surf à Taghazout", "Coucher de soleil Essaouira", "Yacht Agadir"],
    best: "Avril — Octobre",
    pace: "Intense",
    activityIds: ["tng-1", "tng-2", "agd-2", "agd-3"],
  },
  {
    id: "sahara",
    title: "Sahara Express",
    tagline: "Bivouac sous les étoiles de Merzouga",
    days: 4,
    cities: ["marrakech", "ouarzazate", "merzouga"],
    totalPrice: 2800,
    vibe: "#MomentMagique",
    emoji: "🐪",
    highlights: ["Vallée du Drâa", "Studios cinéma Atlas", "Dunes Erg Chebbi", "Nuit berbère"],
    best: "Octobre — Avril",
    pace: "Intense",
    activityIds: ["mrz-1", "mrz-2", "mrz-3"],
  },
  {
    id: "blue-north",
    title: "Le Nord Bleu",
    tagline: "Chefchaouen, Tétouan et la Méditerranée",
    days: 5,
    cities: ["tanger", "tetouan", "chefchaouen"],
    totalPrice: 2400,
    vibe: "#DéconnexionTotale",
    emoji: "💙",
    highlights: ["Ruelles bleues", "Cascades d'Akchour", "Médina UNESCO Tétouan", "Atelier indigo"],
    best: "Avril — Juin · Sept — Oct",
    pace: "Tranquille",
    activityIds: ["tng-1", "chf-1", "chf-2", "chf-3"],
  },
  {
    id: "wellness",
    title: "Détox Atlas & Bien-être",
    tagline: "Hammams, yoga et air pur d'Ifrane",
    days: 5,
    cities: ["ifrane", "fes", "marrakech"],
    totalPrice: 3900,
    vibe: "#DéconnexionTotale",
    emoji: "🧘",
    highlights: ["Cèdre Gouraud", "Hammam royal", "Massages argan", "Cuisine bio"],
    best: "Toute l'année",
    pace: "Tranquille",
    activityIds: ["mrk-4", "mrk-1", "ifr-1"],
  },
  {
    id: "foodie",
    title: "Route des Saveurs",
    tagline: "Tajine, pastilla et street-food de Casa à Marrakech",
    days: 6,
    cities: ["casablanca", "rabat", "fes", "marrakech"],
    totalPrice: 3100,
    vibe: "#SaveursAuthentiques",
    emoji: "🍽️",
    highlights: ["Marché central Casa", "Cours de cuisine en riad", "Souk aux épices", "Dîner berbère"],
    best: "Toute l'année",
    pace: "Équilibré",
    activityIds: ["mrk-1", "csa-1", "fez-3"],
  },
];
