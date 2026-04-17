import sahara from "@/assets/act-sahara.jpg";
import surf from "@/assets/act-surf.jpg";
import hammam from "@/assets/act-hammam.jpg";
import cooking from "@/assets/act-cooking.jpg";
import balloon from "@/assets/act-balloon.jpg";
import quad from "@/assets/act-quad.jpg";
import mosque from "@/assets/act-mosque.jpg";
import pottery from "@/assets/act-pottery-zellige.jpg";
import yacht from "@/assets/act-yacht.jpg";
import chefchaouen from "@/assets/hero-chefchaouen.jpg";
import medinaSouk from "@/assets/act-medina-souk.jpg";
import escapeGame from "@/assets/act-escape-game.jpg";
import calligraphy from "@/assets/act-calligraphy.jpg";
import tannery from "@/assets/act-tannery.jpg";
import zellige from "@/assets/act-zellige.jpg";
import indigo from "@/assets/act-indigo.jpg";
import thuya from "@/assets/act-thuya.jpg";

export type PriceTier = "budget" | "standard" | "premium" | "luxe";
export type WeatherSensitivity = "outdoor" | "indoor" | "any";

export type Activity = {
  id: string;
  title: string;
  city: string;
  category: string;
  moods: string[];
  duration: string;
  price: number; // MAD per person
  tier: PriceTier;
  rating: number;
  reviews: number;
  image: string;
  short: string;
  description: string;
  partner: string;
  maxGroup: number;
  weather: WeatherSensitivity;
};

const img = {
  sahara, surf, hammam, cooking, balloon, quad, mosque, pottery, yacht, chefchaouen,
  medinaSouk, escapeGame, calligraphy, tannery, zellige, indigo, thuya,
};

const tierFromPrice = (p: number): PriceTier =>
  p < 200 ? "budget" : p < 600 ? "standard" : p < 1500 ? "premium" : "luxe";

const a = (
  id: string, title: string, city: string, category: string, moods: string[],
  duration: string, price: number, rating: number, reviews: number, image: string,
  short: string, description: string, partner: string, maxGroup: number,
  weather: WeatherSensitivity,
): Activity => ({
  id, title, city, category, moods, duration, price, tier: tierFromPrice(price),
  rating, reviews, image, short, description, partner, maxGroup, weather,
});

export const ACTIVITIES: Activity[] = [
  // Marrakech
  a("mrk-1", "Cours de cuisine marocaine en riad", "marrakech", "Gastronomie",
    ["#SaveursAuthentiques", "#DéconnexionTotale"], "3h", 450, 4.9, 1284, img.cooking,
    "Préparez tajine, msemen et thé à la menthe avec Chef Khadija.",
    "Plongez dans la cuisine marocaine traditionnelle au cœur d'un riad du XVIIIᵉ siècle. Marché des épices inclus, recettes à emporter.",
    "Riad Dar Khadija", 8, "indoor"),
  a("mrk-2", "Montgolfière au lever du soleil", "marrakech", "Aventure",
    ["#AventureForte", "#MomentMagique"], "4h", 1800, 4.9, 642, img.balloon,
    "Survolez l'Atlas et la palmeraie au petit matin.",
    "Décollage à l'aube, vol d'1h, petit-déjeuner berbère sous tente, transferts depuis hôtel inclus.",
    "Ciel d'Atlas Aventure", 12, "outdoor"),
  a("mrk-3", "Quad dans le désert d'Agafay", "marrakech", "Aventure",
    ["#AventureForte", "#BesoinDeTranspirer"], "2h", 380, 4.7, 891, img.quad,
    "Pilotez un quad sur les pistes de l'Agafay.",
    "Briefing sécurité, équipement fourni, pause thé berbère panoramique.",
    "Agafay Riders", 15, "outdoor"),
  a("mrk-4", "Hammam royal & gommage rose", "marrakech", "Bien-être",
    ["#DéconnexionTotale", "#MomentLuxe"], "2h", 850, 4.9, 2103, img.hammam,
    "Rituel ancestral dans un spa luxueux de la Médina.",
    "Hammam vapeur, gommage savon noir, gommage rose, massage à l'huile d'argan, thé.",
    "La Maison Arabe Spa", 1, "indoor"),
  a("mrk-5", "Visite guidée Médina & Souks", "marrakech", "Culture",
    ["#SaveursAuthentiques", "#TraditionVivante"], "3h", 180, 4.6, 1567, img.medinaSouk,
    "Découvrez la Médina avec un guide local diplômé.",
    "Place Jemaa el-Fna, Madrasa Ben Youssef, souks, palais Bahia. Petit groupe, 3h.",
    "Marrakech Walks", 10, "outdoor"),
  a("mrk-6", "Atelier poterie & zellige", "marrakech", "Artisanat",
    ["#TraditionVivante", "#DéconnexionTotale"], "2h30", 320, 4.8, 412, img.pottery,
    "Façonnez votre propre pièce avec un maître artisan.",
    "Initiation au tour, peinture, cuisson : repartez avec votre création.",
    "Atelier Moulay Driss", 6, "indoor"),
  a("mrk-7", "Soirée gala Chez Ali", "marrakech", "Spectacle",
    ["#AmbianceFestive", "#TraditionVivante"], "4h", 720, 4.5, 989, img.cooking,
    "Dîner-spectacle équestre Fantasia.",
    "Cavaliers berbères, danseuses, repas marocain, transferts inclus.",
    "Chez Ali Heritage", 200, "outdoor"),

  // Casablanca
  a("csa-1", "Visite Mosquée Hassan II + skip-line", "casablanca", "Culture",
    ["#TraditionVivante", "#MomentMagique"], "1h30", 220, 4.8, 3401, img.mosque,
    "Découvrez l'un des plus grands lieux de culte au monde.",
    "Audio-guide multilingue, accès prioritaire, explications historiques et architecturales.",
    "Casa Tours", 25, "indoor"),
  a("csa-2", "Yacht privé Côte Atlantique", "casablanca", "Bien-être",
    ["#MomentLuxe", "#MomentMagique"], "3h", 2400, 4.9, 187, img.yacht,
    "Navigation au coucher du soleil, capitaine privé.",
    "Apéritif inclus, plongeon possible, photos pro offertes.",
    "Atlantic Yacht Club", 8, "outdoor"),
  a("csa-3", "Food tour street-food à Derb Omar", "casablanca", "Gastronomie",
    ["#SaveursAuthentiques", "#AmbianceFestive"], "3h", 290, 4.7, 712, img.cooking,
    "10 dégustations dans le vieux Casa.",
    "Sfenj, harira, sardines grillées, pâtisseries… avec un guide passionné.",
    "Casa Foodies", 12, "outdoor"),
  a("csa-4", "Escape Game Casa Mystère", "casablanca", "Loisirs",
    ["#AventureLudique", "#AmbianceFestive"], "1h", 150, 4.6, 528, img.escapeGame,
    "Résolvez l'énigme du palais perdu en équipe.",
    "Salle thématique immersive, animateur dédié, 2 à 6 joueurs.",
    "Lock'n Go Casa", 6, "indoor"),
  a("csa-5", "Spa Four Seasons – journée détente", "casablanca", "Bien-être",
    ["#MomentLuxe", "#DéconnexionTotale"], "Journée", 1650, 4.9, 234, img.hammam,
    "Accès piscine, hammam, soins signature.",
    "Massage 60min, déjeuner sain, accès lounge premium.",
    "Four Seasons Casablanca", 1, "indoor"),

  // Rabat
  a("rba-1", "Visite Kasbah des Oudayas + thé", "rabat", "Culture",
    ["#TraditionVivante", "#DéconnexionTotale"], "2h", 140, 4.7, 891, img.mosque,
    "Promenade dans la kasbah bleue et blanche.",
    "Guide diplômé, jardin andalou, dégustation de thé à la menthe au café Maure.",
    "Rabat Heritage", 12, "outdoor"),
  a("rba-2", "Atelier calligraphie arabe", "rabat", "Artisanat",
    ["#TraditionVivante", "#DéconnexionTotale"], "2h", 250, 4.8, 156, img.calligraphy,
    "Apprenez l'art de la calligraphie maghrébine.",
    "Initié par un maître, repartez avec votre œuvre encadrée.",
    "Madrassat Al Khat", 8, "indoor"),
  a("rba-3", "Balade à vélo Bouregreg", "rabat", "Sport",
    ["#BesoinDeTranspirer", "#DéconnexionTotale"], "2h30", 180, 4.6, 342, img.surf,
    "Vélo électrique le long du fleuve.",
    "Vélo + casque + guide. Pause photo aux remparts.",
    "Rabat Bike Tours", 10, "outdoor"),
  a("rba-4", "Dîner gastronomique Dar Naji", "rabat", "Gastronomie",
    ["#SaveursAuthentiques", "#MomentLuxe"], "2h", 380, 4.7, 624, img.cooking,
    "Menu dégustation 7 plats traditionnels.",
    "Cadre raffiné, musique andalouse live, vin de Meknès en option.",
    "Dar Naji", 4, "indoor"),

  // Tanger
  a("tng-1", "Excursion Cap Spartel & Grottes Hercule", "tanger", "Aventure",
    ["#MomentMagique", "#DéconnexionTotale"], "4h", 350, 4.7, 873, img.surf,
    "Là où l'Atlantique rencontre la Méditerranée.",
    "Transport AC, guide, déjeuner poisson grillé en option.",
    "Tanger Discovery", 16, "outdoor"),
  a("tng-2", "Sunset cruise dans le détroit", "tanger", "Bien-être",
    ["#MomentMagique", "#MomentLuxe"], "2h30", 480, 4.8, 245, img.yacht,
    "Croisière coucher de soleil avec vue sur l'Espagne.",
    "Boissons incluses, musique douce, photos panoramiques.",
    "Strait of Gibraltar Sailing", 25, "outdoor"),
  a("tng-3", "Visite Médina + Café Hafa", "tanger", "Culture",
    ["#TraditionVivante", "#SaveursAuthentiques"], "3h", 160, 4.6, 489, img.mosque,
    "Sur les traces de Bowles et des Rolling Stones.",
    "Visite guidée littéraire de la Médina, thé au mythique café Hafa.",
    "Tanger Stories", 10, "outdoor"),
  a("tng-4", "Plongée à la grotte sous-marine", "tanger", "Sport",
    ["#AventureForte", "#BesoinDeTranspirer"], "3h", 650, 4.7, 134, img.surf,
    "Baptême ou plongée loisirs avec moniteur PADI.",
    "Équipement complet, briefing, 2 plongées, snack.",
    "Atlas Diving Tanger", 6, "outdoor"),

  // Fès
  a("fez-1", "Tour artisans tanneurs Chouara", "fes", "Artisanat",
    ["#TraditionVivante", "#SaveursAuthentiques"], "3h", 200, 4.7, 1432, img.tannery,
    "La plus vieille tannerie au monde.",
    "Guide local, vue panoramique, atelier maroquinerie.",
    "Fès Authentic", 12, "outdoor"),
  a("fez-2", "Atelier zellige avec maître artisan", "fes", "Artisanat",
    ["#TraditionVivante", "#DéconnexionTotale"], "3h", 380, 4.9, 287, img.zellige,
    "Découvrez l'art du zellige fassi millénaire.",
    "Démonstration, initiation pratique, votre création offerte.",
    "Naji Zellige House", 6, "indoor"),
  a("fez-3", "Cours cuisine fassia chez l'habitant", "fes", "Gastronomie",
    ["#SaveursAuthentiques", "#TraditionVivante"], "4h", 420, 4.9, 512, img.cooking,
    "Pastilla et tajine fassi avec une famille locale.",
    "Marché, cuisine, repas partagé, recettes traditionnelles.",
    "Dar Bensouda Cooking", 8, "indoor"),
  a("fez-4", "Visite nocturne Médina + dîner riad", "fes", "Culture",
    ["#MomentMagique", "#SaveursAuthentiques"], "3h30", 320, 4.8, 198, img.mosque,
    "La Médina s'illumine de mille feux.",
    "Guide passionné, dîner traditionnel dans un riad authentique.",
    "Fès by Night", 10, "indoor"),

  // Chefchaouen
  a("chf-1", "Photo tour la perle bleue", "chefchaouen", "Culture",
    ["#MomentMagique", "#DéconnexionTotale"], "3h", 220, 4.9, 876, img.chefchaouen,
    "Les plus beaux spots photo de la ville bleue.",
    "Photographe local, conseils prise de vue, retouches inclus.",
    "Chaouen Lens", 6, "outdoor"),
  a("chf-2", "Randonnée Akchour cascades", "chefchaouen", "Sport",
    ["#BesoinDeTranspirer", "#AventureForte"], "Journée", 280, 4.8, 654, img.surf,
    "Trek vers les cascades et le Pont de Dieu.",
    "Guide montagne, déjeuner pique-nique, transferts.",
    "Rif Trekking", 12, "outdoor"),
  a("chf-3", "Atelier teinture indigo", "chefchaouen", "Artisanat",
    ["#TraditionVivante", "#DéconnexionTotale"], "2h", 180, 4.7, 142, img.indigo,
    "Le secret du fameux bleu Chaouen.",
    "Histoire, démonstration, créez votre tissu indigo à emporter.",
    "Bleu de Chefchaouen", 8, "indoor"),
  a("chf-4", "Yoga sunrise sur les toits bleus", "chefchaouen", "Bien-être",
    ["#DéconnexionTotale", "#MomentMagique"], "1h30", 150, 4.9, 88, img.hammam,
    "Séance énergisante face à la kasbah.",
    "Tapis fournis, professeure certifiée, thé après séance.",
    "Chaouen Yoga Studio", 12, "outdoor"),

  // Agadir / Taghazout
  a("agd-1", "Cours surf débutants à Taghazout", "taghazout", "Sport",
    ["#BesoinDeTranspirer", "#AventureLudique"], "2h", 280, 4.8, 1023, img.surf,
    "Initiation surf sur les meilleures vagues d'Atlantique.",
    "Combinaison, planche, moniteur diplômé, photos vidéo offertes.",
    "Surf Taghazout Camp", 8, "outdoor"),
  a("agd-2", "Excursion Paradise Valley", "agadir", "Aventure",
    ["#DéconnexionTotale", "#MomentMagique"], "Journée", 320, 4.7, 567, img.surf,
    "Piscines naturelles dans les montagnes de l'Atlas.",
    "4x4, guide, baignade, déjeuner berbère.",
    "Agadir Excursions", 16, "outdoor"),
  a("agd-3", "Pêche en haute mer", "agadir", "Sport",
    ["#AventureLudique", "#AmbianceFestive"], "4h", 580, 4.6, 234, img.yacht,
    "Sortie pêche avec capitaine local.",
    "Matériel inclus, dégustation des prises, boissons.",
    "Agadir Sea Adventures", 8, "outdoor"),
  a("agd-4", "Spa marin & thalasso Sofitel", "agadir", "Bien-être",
    ["#MomentLuxe", "#DéconnexionTotale"], "Journée", 1450, 4.9, 178, img.hammam,
    "Journée thalassothérapie front de mer.",
    "Bassin marin, soins, déjeuner gourmet, accès plage privée.",
    "Sofitel Thalassa Sea & Spa", 1, "indoor"),

  // Essaouira
  a("ess-1", "Cours kitesurf à Essaouira", "essaouira", "Sport",
    ["#AventureForte", "#BesoinDeTranspirer"], "3h", 650, 4.8, 312, img.surf,
    "La capitale mondiale du kitesurf.",
    "Matériel + moniteur IKO. Vent garanti.",
    "Kite World Essaouira", 4, "outdoor"),
  a("ess-2", "Balade dromadaire sur la plage", "essaouira", "Aventure",
    ["#MomentMagique", "#AventureLudique"], "2h", 220, 4.7, 489, img.sahara,
    "Coucher de soleil à dos de dromadaire.",
    "Encadrement, photos, thé sur la plage.",
    "Essaouira Camel Tours", 12, "outdoor"),
  a("ess-3", "Atelier marqueterie thuya", "essaouira", "Artisanat",
    ["#TraditionVivante", "#DéconnexionTotale"], "2h30", 290, 4.8, 167, img.thuya,
    "Travail du bois de thuya, spécialité d'Essaouira.",
    "Initiation, votre boîte à secret à emporter.",
    "Coopérative Thuya", 6, "indoor"),
  a("ess-4", "Dégustation poisson port", "essaouira", "Gastronomie",
    ["#SaveursAuthentiques", "#AmbianceFestive"], "2h", 180, 4.7, 723, img.cooking,
    "Choisissez votre poisson au port, on le grille.",
    "Visite marché aux poissons, dégustation 3 espèces.",
    "Port d'Essaouira Food", 10, "outdoor"),

  // Merzouga / Sahara
  a("mrz-1", "Bivouac de luxe désert Merzouga", "merzouga", "Aventure",
    ["#MomentMagique", "#MomentLuxe"], "2 jours", 2200, 4.9, 932, img.sahara,
    "Nuit en tente berbère premium, dunes Erg Chebbi.",
    "Dromadaire, dîner sous étoiles, musique berbère, lever de soleil sur les dunes.",
    "Sahara Stars Camp", 20, "outdoor"),
  a("mrz-2", "Balade dromadaire 1h coucher soleil", "merzouga", "Aventure",
    ["#MomentMagique", "#TraditionVivante"], "1h30", 250, 4.8, 1456, img.sahara,
    "Au sommet des dunes au moment magique.",
    "Encadrement, thé berbère, photos sunset.",
    "Berber Camel Co", 15, "outdoor"),
  a("mrz-3", "Sandboard sur les dunes", "merzouga", "Sport",
    ["#AventureForte", "#BesoinDeTranspirer"], "2h", 320, 4.6, 287, img.sahara,
    "Glissez sur les plus hautes dunes du Maroc.",
    "Planche fournie, cours rapide, eau et collation.",
    "Erg Chebbi Sports", 10, "outdoor"),

  // Ouarzazate
  a("orz-1", "Visite Aït Benhaddou + studios cinéma", "ouarzazate", "Culture",
    ["#TraditionVivante", "#MomentMagique"], "Journée", 380, 4.8, 765, img.mosque,
    "Kasbah UNESCO et Hollywood marocain.",
    "Guide francophone, déjeuner berbère, transport AC.",
    "Atlas Movies Tour", 16, "outdoor"),
  a("orz-2", "4x4 vallée des roses & Dadès", "ouarzazate", "Aventure",
    ["#AventureForte", "#MomentMagique"], "Journée", 520, 4.8, 423, img.quad,
    "Gorges spectaculaires en tout-terrain.",
    "Pilote-guide, déjeuner kasbah, arrêts photo.",
    "Sahara 4x4 Adventures", 6, "outdoor"),

  // Meknès
  a("mkn-1", "Visite Volubilis romaine + Moulay Idriss", "meknes", "Culture",
    ["#TraditionVivante", "#MomentMagique"], "Journée", 320, 4.7, 412, img.mosque,
    "Ruines romaines exceptionnelles + ville sainte.",
    "Guide archéologue, déjeuner local, transferts.",
    "Meknès Heritage Tours", 14, "outdoor"),
  a("mkn-2", "Dégustation vins Meknès", "meknes", "Gastronomie",
    ["#SaveursAuthentiques", "#MomentLuxe"], "3h", 480, 4.6, 189, img.cooking,
    "Visite domaine + dégustation 6 cuvées.",
    "Vignoble historique, accord mets-vins, planche du chef.",
    "Domaine de Meknès", 12, "indoor"),

  // Tétouan
  a("tet-1", "Médina UNESCO de Tétouan", "tetouan", "Culture",
    ["#TraditionVivante", "#SaveursAuthentiques"], "2h30", 150, 4.7, 234, img.mosque,
    "Une médina andalouse préservée.",
    "Guide passionné, atelier brodeuse, dégustation pâtisseries.",
    "Tétouan Walks", 12, "outdoor"),

  // Ifrane
  a("ifr-1", "Ski station Michlifen Ifrane", "ifrane", "Sport",
    ["#BesoinDeTranspirer", "#AventureForte"], "Journée", 580, 4.5, 312, img.quad,
    "Forfait journée + matériel + moniteur.",
    "Le ski au Maroc ! Saison décembre-mars.",
    "Michlifen Ski School", 6, "outdoor"),
  a("ifr-2", "Forêt cèdres & singes Magot", "ifrane", "Aventure",
    ["#DéconnexionTotale", "#AventureLudique"], "3h", 220, 4.7, 524, img.surf,
    "Rencontre avec les macaques de Berbérie.",
    "Guide naturaliste, sensibilisation environnement.",
    "Cedar Forest Tours", 14, "outdoor"),
];

export const PRICE_TIERS: { id: PriceTier; label: string; range: string; color: string }[] = [
  { id: "budget", label: "Budget", range: "< 200 MAD", color: "var(--mint)" },
  { id: "standard", label: "Standard", range: "200–600 MAD", color: "var(--zellige)" },
  { id: "premium", label: "Premium", range: "600–1500 MAD", color: "var(--clay)" },
  { id: "luxe", label: "Luxe", range: "> 1500 MAD", color: "var(--saffron)" },
];

export const MOODS = [
  "#BesoinDeTranspirer", "#DéconnexionTotale", "#MomentMagique", "#SaveursAuthentiques",
  "#AventureForte", "#AventureLudique", "#TraditionVivante", "#MomentLuxe",
  "#AmbianceFestive",
];

export const CATEGORIES = ["Aventure", "Bien-être", "Culture", "Gastronomie", "Sport", "Artisanat", "Spectacle", "Loisirs"];
