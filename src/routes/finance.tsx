import { createFileRoute } from "@tanstack/react-router";
import { Building2, Download, FileText, TrendingUp, Calendar, Wallet, Receipt, Megaphone, Target, Users, Lightbulb, HelpCircle, Cog, ArrowRight, Scale, Compass } from "lucide-react";
import * as XLSX from "xlsx";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Communication Financière 2026 — LoisirBooking" },
      { name: "description", content: "Rapport financier prévisionnel 2026 de Loisirbooking SARL : SIG N/N+1/N+2, bilans, plan de trésorerie, budget TVA, Hexagone sectoriel de Porter, plan média et jalons projet." },
    ],
  }),
  component: FinancePage,
});

/* ============================================================
   MODÈLE FINANCIER COHÉRENT — Loisirbooking SARL
   Année N = 2026 (Pré-lancement Mai → Go-Live 1er Septembre)
   Toutes les valeurs sont issues du dossier de prévision validé
   ============================================================ */

const COMPANY = {
  raisonSociale: "Loisirbooking SARL",
  formeJuridique: "Société à Responsabilité Limitée (SARL)",
  capital: 550_000,
  rc: "RC Tanger n° 98 547",
  ice: "ICE 002 458 791 000 037",
  if: "IF 41 287 365",
  cnss: "CNSS 8 547 219",
  patente: "Patente 47 256 893",
  siege: "12, Rue Ibn Batouta, Marshan — 90 000 Tanger",
  effectif: 10,
  exercice: "Du 1er juin au 31 décembre 2026 (exercice de constitution)",
  activite: "Plateforme numérique de réservation d'activités de loisirs",
  gerant: "Mme Kaoutar BOUAGLOU",
  expertComptable: "Cabinet Bennani & Associés — Tanger",
};

const EQUIPE = [
  { nom: "BOUAGLOU", prenom: "Kaoutar", poste: "Directrice Générale" },
  { nom: "BARI", prenom: "Abdelkrim", poste: "Directeur Administratif et Financier" },
  { nom: "AMZIR", prenom: "Nowar", poste: "Directeur Technique" },
  { nom: "ABERKANE", prenom: "Basma", poste: "Chef Comptable" },
  { nom: "GUIGMA", prenom: "Boubacar", poste: "Directeur Commercial" },
  { nom: "BEN SLIMAN", prenom: "Nour Houda", poste: "Directrice des RH" },
  { nom: "ABDELAALI", prenom: "Salma", poste: "Community Manager" },
  { nom: "EL FIZAZI", prenom: "Aimade", poste: "Développeur Web" },
  { nom: "MAHJOUBI", prenom: "Fairouz", poste: "Responsable Service Clients" },
  { nom: "MACHICHI", prenom: "Adam", poste: "Responsable Marketing Digital" },
];

/* ============================================================
   SOLDES INTERMÉDIAIRES DE GESTION (valeurs du dossier 2026)
   N = 2026 (juin → déc) | N+1 = 2027 | N+2 = 2028
   ============================================================ */
const SIG = {
  // Production
  production:        [641_550,    1_603_875,   2_245_425  ],
  ventesServices:    [641_550,    1_603_875,   2_245_425  ],
  // Consommation
  consommation:      [288_400,    374_920,     576_800    ],
  achatsMatieres:    [0,          0,           0          ],
  autresChargesExt:  [288_400,    374_920,     576_800    ],
  // VA
  valeurAjoutee:     [353_150,    1_228_955,   1_668_625  ],
  // EBE
  subventions:       [0,          0,           0          ],
  impotsTaxes:       [28_000,     28_000,      28_000     ],
  chargesPersonnel:  [865_304,    1_038_364.80,1_471_016.80],
  ebe:               [0,          162_590.20,  169_608.20 ],
  insuffisanceBE:    [-540_154,   0,           0          ],
  // Résultat exploitation
  autresProduitsExp: [0,          0,           0          ],
  autresChargesExp:  [0,          0,           0          ],
  reprisesExp:       [0,          0,           0          ],
  dotationsExp:      [18_666,     18_666,      18_666     ],
  resultatExp:       [-558_820,   143_924.20,  150_942.20 ],
  // Financier
  resultatFin:       [-11_363,    -11_363,     -11_363    ],
  resultatCourant:   [-570_183,   132_561.20,  139_579.20 ],
  resultatNonCour:   [0,          0,           0          ],
  is:                [0,          0,           0          ], // exonéré IS 5 ans + perte N
  resultatNet:       [-570_183,   132_561.20,  139_579.20 ],
  // CAF
  caf:               [-551_517,   151_227.20,  158_245.20 ],
  distributions:     [0,          0,           0          ],
  autofinancement:   [-551_517,   151_227.20,  158_245.20 ],
};

/* ============================================================
   CHIFFRE D'AFFAIRES MENSUEL 2026 (extrait du dossier financier)
   ============================================================ */
const CA_2026 = [
  { mois: "Juin",      reservations: 750,   commissions: 33_750,  fraisService: 15_000, abonnements: 1_250, total: 50_000 },
  { mois: "Juillet",   reservations: 1_860, commissions: 83_700,  fraisService: 37_200, abonnements: 2_500, total: 123_400 },
  { mois: "Août",      reservations: 3_100, commissions: 139_500, fraisService: 62_000, abonnements: 3_750, total: 205_250 },
  { mois: "Septembre", reservations: 1_200, commissions: 54_000,  fraisService: 24_000, abonnements: 5_000, total: 83_000 },
  { mois: "Octobre",   reservations: 775,   commissions: 34_875,  fraisService: 15_500, abonnements: 6_250, total: 56_625 },
  { mois: "Novembre",  reservations: 600,   commissions: 27_000,  fraisService: 12_000, abonnements: 6_250, total: 45_250 },
  { mois: "Décembre",  reservations: 1_085, commissions: 48_825,  fraisService: 21_700, abonnements: 7_500, total: 78_025 },
];
const CA_TOTAL = CA_2026.reduce((s, r) => s + r.total, 0);
const RES_TOTAL = CA_2026.reduce((s, r) => s + r.reservations, 0);

/* ============================================================
   PLAN DE TRÉSORERIE 2026 — valeurs exactes
   12 mois, l'activité démarre en juin (apport capital + ventes)
   ============================================================ */
const MOIS = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
const Z = () => Array(12).fill(0);
const M = (jun: number, jul: number, aug: number, sep: number, oct: number, nov: number, dec: number) =>
  [0, 0, 0, 0, 0, jun, jul, aug, sep, oct, nov, dec];

const venteMarchTTC = Z();
const prestaServicesTTC = M(60_000, 148_080, 246_300, 99_600, 67_950, 54_300, 93_630);
const apportCapital = M(304_400, 0, 0, 0, 0, 0, 0);
const compteCourant = Z();
const pretHonneur = Z();
const empruntM = M(0, 500_000, 0, 0, 0, 0, 0);
const subventionsM = Z();

const encExploit = prestaServicesTTC.map((v, i) => v + venteMarchTTC[i]);
const encHorsExp = apportCapital.map((v, i) => v + compteCourant[i] + pretHonneur[i] + empruntM[i] + subventionsM[i]);
const totalEnc = encExploit.map((v, i) => v + encHorsExp[i]);

const matieresM = M(3_000, 3_000, 3_000, 3_000, 3_000, 3_000, 3_000);
const eauElecM = M(400, 400, 400, 400, 400, 400, 400);
const fournEntretienM = Z();
const fournAdminM = Z();
const petitMatM = Z();
const sousTraitanceM = Z();
const entretienRepM = M(9_600, 9_600, 9_600, 9_600, 9_600, 9_600, 9_600);
const loyerM = M(10_000, 10_000, 10_000, 10_000, 10_000, 10_000, 10_000);
const assurancesM = Z();
const honorairesM = Z();
const fraisPostauxM = Z();
const telInternetM = M(2_640, 2_640, 2_640, 2_640, 2_640, 2_640, 2_640);
const pubCommM = M(24_000, 24_000, 24_000, 24_000, 24_000, 24_000, 24_000);
const transportCarbM = Z();
const servBancairesM = M(1_100, 1_100, 1_100, 1_100, 1_100, 1_100, 1_100);
const impotsTaxesM = M(4_000, 4_000, 4_000, 4_000, 4_000, 4_000, 4_000);
const salairesM = M(110_000, 110_000, 110_000, 110_000, 110_000, 110_000, 110_000);
const chargesSocialesM = M(0, 15_884, 15_884, 15_884, 15_884, 15_884, 15_884);
const tvaPaiementM = M(0, 0, 0, 17_370, 9_680, 4_405, 2_130);

const decExploitTotal = M(164_740, 180_624, 180_624, 197_994, 190_304, 185_029, 182_754);
const investTTCMois = Z();
const remboursementEmpruntM = M(0, 0, 9_781.45, 9_781.45, 9_781.45, 9_781.45, 9_781.45);
const decHorsExp = investTTCMois.map((v, i) => v + remboursementEmpruntM[i]);
const totalDecMois = decExploitTotal.map((v, i) => v + decHorsExp[i]);

// Soldes cumulés exacts (image)
const soldeDebut = [0, 0, 0, 0, 0, 0, 199_660, 667_116, 723_010.55, 614_835.10, 482_699.65, 342_189.20];
const soldeFin   = [0, 0, 0, 0, 0, 199_660, 667_116, 723_010.55, 614_835.10, 482_699.65, 342_189.20, 243_283.75];

/* ============================================================
   BUDGET DE TVA 2026 (taux 20%) — colonnes Pré-lancement → Déc
   ============================================================ */
// 13 colonnes : Janv..Mai, Pré-lancement, Juin..Déc
const TVA_MOIS = ["Janv", "Févr", "Mars", "Avr", "Mai", "Pré-lanct", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
const tvaCollectee = [null, null, null, null, null, 0, 10_000, 24_680, 41_050, 16_600, 11_325, 9_050, 15_605];
const tvaDedAchats = [null, null, null, null, null, 37_600, 6_920, 6_920, 6_920, 6_920, 6_920, 6_920, 6_920];
const tvaDedInvest = [null, null, null, null, null, 0, 0, 0, 0, 0, 0, 0, 0];
const tvaCreditPrec = [null, null, null, null, null, 0, 37_600, 34_520, 16_760, 0, 0, 0, 0];
const tvaSolde =     [null, null, null, null, null, -37_600, -34_520, -16_760, 17_370, 9_680, 4_405, 2_130, 8_685];
const tvaPaiement =  [null, null, null, null, null, 0, 0, 0, 0, 17_370, 9_680, 4_405, 2_130];

/* ============================================================
   PLAN MÉDIA 2026 — valeurs exactes (Juin → Octobre uniquement)
   Total annuel = 69 500 MAD
   ============================================================ */
type MediaSec = "media-trad" | "internet" | "alt" | "direct" | "hors-web";
const PM = (jun: number, jul: number, aug: number, sep: number, oct: number) =>
  [0, 0, 0, 0, 0, jun, jul, aug, sep, oct, 0, 0, 0];
const MEDIA_PLAN: { action: string; section: MediaSec; values: number[] }[] = [
  { action: "TV",                              section: "media-trad", values: PM(0, 0, 0, 0, 0) },
  { action: "Radio",                           section: "media-trad", values: PM(1_500, 1_500, 1_500, 1_000, 0) },
  { action: "Affichage",                       section: "media-trad", values: PM(2_000, 2_500, 2_500, 1_500, 0) },
  { action: "Presse",                          section: "media-trad", values: PM(500, 500, 500, 500, 0) },
  { action: "Médias sociaux",                  section: "internet",   values: PM(5_000, 5_000, 5_000, 4_000, 0) },
  { action: "Blogs",                           section: "internet",   values: PM(1_000, 1_000, 500, 500, 0) },
  { action: "Forum / Exposition / Salon",      section: "alt",        values: PM(2_000, 0, 0, 1_000, 0) },
  { action: "Conférence",                      section: "alt",        values: PM(1_500, 0, 0, 0, 0) },
  { action: "Street-Marketing",                section: "alt",        values: PM(1_000, 500, 500, 500, 0) },
  { action: "PLV",                             section: "alt",        values: PM(1_000, 500, 500, 500, 0) },
  { action: "Promotion : Excursions & aventure", section: "alt",      values: PM(2_000, 1_500, 1_500, 1_000, 0) },
  { action: "Promotion : Activités culturelles", section: "alt",      values: PM(1_500, 1_000, 1_000, 500, 0) },
  { action: "Courriers postaux",               section: "direct",     values: PM(0, 0, 0, 0, 0) },
  { action: "E-mailings",                      section: "direct",     values: PM(500, 500, 500, 500, 0) },
  { action: "Catalogue",                       section: "direct",     values: PM(2_000, 0, 0, 0, 0) },
  { action: "Application mobile",              section: "hors-web",   values: PM(500, 500, 500, 500, 0) },
  { action: "Site Web / Blog",                 section: "hors-web",   values: PM(1_000, 1_000, 1_000, 1_000, 0) },
  { action: "Forum en ligne",                  section: "hors-web",   values: PM(500, 500, 500, 500, 0) },
];
const sumRow = (vals: number[]) => vals.reduce((a, b) => a + b, 0);
const monthlyMarketing = Array.from({ length: 12 }, (_, m) => MEDIA_PLAN.reduce((s, r) => s + r.values[m], 0));
const TOTAL_MARKETING = sumRow(monthlyMarketing);

/* ============================================================
   BILANS — Ouverture (Juin 2026) & Clôture (31 Déc 2026)
   ============================================================ */
const BILAN_OUVERTURE = {
  actif: [
    { groupe: "ACTIF IMMOBILISÉ", total: 201_000, lignes: [
      { sub: "Immobilisations en non-valeurs", montant: 25_000, details: [
        ["Frais de constitution", 5_000],
        ["Frais de prospection (Marketing initial)", 20_000],
      ]},
      { sub: "Immobilisations incorporelles", montant: 46_000, details: [
        ["Développement site web", 30_000],
        ["Base de données clients", 10_000],
        ["Logo et identité visuelle", 3_000],
        ["Logiciels et outils", 3_000],
      ]},
      { sub: "Immobilisations corporelles", montant: 110_000, details: [
        ["Matériel informatique (10 postes)", 60_000],
        ["Mobilier de bureau", 40_000],
        ["Téléphones (×10)", 10_000],
      ]},
      { sub: "Immobilisations financières", montant: 20_000, details: [
        ["Dépôts et cautionnements (Local)", 20_000],
      ]},
    ]},
    { groupe: "ACTIF CIRCULANT (Hors Trésorerie)", total: 44_600, lignes: [
      { sub: "Créances de l'Actif Circulant", montant: 37_600, details: [
        ["État, TVA Récupérable (sur investissements)", 37_600],
      ]},
      { sub: "Charges Constatées d'Avance (CCA)", montant: 7_000, details: [
        ["CMI / Paiement en ligne", 5_000],
        ["Hébergement initial", 1_000],
        ["Installation internet", 1_000],
      ]},
    ]},
    { groupe: "TRÉSORERIE — ACTIF", total: 304_400, lignes: [
      { sub: "Banque (solde disponible pour démarrer)", montant: 304_400, details: [] },
    ]},
  ],
  passif: [
    { groupe: "FINANCEMENT PERMANENT", total: 550_000, lignes: [
      { sub: "Capital Social", montant: 550_000, details: [] },
    ]},
    { groupe: "DETTES DE FINANCEMENT", total: 0, lignes: [
      { sub: "Emprunt (n'arrive qu'en juillet)", montant: 0, details: [] },
    ]},
    { groupe: "PASSIF CIRCULANT", total: 0, lignes: [
      { sub: "Dettes Fournisseurs (tout payé comptant)", montant: 0, details: [] },
    ]},
    { groupe: "TRÉSORERIE — PASSIF", total: 0, lignes: [
      { sub: "Découvert bancaire", montant: 0, details: [] },
    ]},
  ],
};

const BILAN_CLOTURE = {
  // colonnes: brut / amort / net / passif montant
  actif: [
    { lib: "ACTIF IMMOBILISÉ",        brut: 201_000,    amort: 18_666,  net: 182_334,    strong: true },
    { lib: "Immob. en non-valeurs",   brut: 25_000,     amort: 5_000,   net: 20_000 },
    { lib: "  · Frais de constitution",brut: 5_000,     amort: 1_000,   net: 4_000,      sub: true },
    { lib: "  · Frais de prospection",brut: 20_000,     amort: 4_000,   net: 16_000,     sub: true },
    { lib: "Immob. incorporelles",    brut: 46_000,     amort: 5_366,   net: 40_634 },
    { lib: "  · Site web & Logiciels",brut: 46_000,     amort: 5_366,   net: 40_634,     sub: true },
    { lib: "Immob. corporelles",      brut: 110_000,    amort: 8_300,   net: 101_700 },
    { lib: "  · Matériel IT & Mobilier", brut: 110_000, amort: 8_300,   net: 101_700,    sub: true },
    { lib: "Immob. financières",      brut: 20_000,     amort: 0,       net: 20_000 },
    { lib: "  · Caution loyer",       brut: 20_000,     amort: 0,       net: 20_000,     sub: true },
    { lib: "ACTIF CIRCULANT",         brut: 0,          amort: 0,       net: 0,          strong: true },
    { lib: "  · État - Crédit de TVA", brut: 0,         amort: 0,       net: 0,          sub: true },
    { lib: "TRÉSORERIE — ACTIF",      brut: 243_283.75, amort: 0,       net: 243_283.75, strong: true },
    { lib: "  · Banque / Caisse",     brut: 243_283.75, amort: 0,       net: 243_283.75, sub: true },
    { lib: "TOTAL ACTIF",             brut: 444_283.75, amort: 18_666,  net: 425_617.75, total: true },
  ],
  passif: [
    { lib: "CAPITAUX PROPRES",         net: -20_183.25,  strong: true },
    { lib: "  · Capital Social",       net: 550_000,     sub: true },
    { lib: "  · Résultat Net (Perte)", net: -570_183.25, sub: true },
    { lib: "DETTES DE FINANCEMENT",    net: 437_116,     strong: true },
    { lib: "  · Emprunt (reste à payer)", net: 437_116,  sub: true },
    { lib: "PASSIF CIRCULANT",         net: 8_685,       strong: true },
    { lib: "  · État — TVA à payer (Déc.)", net: 8_685,  sub: true },
    { lib: "TOTAL PASSIF",             net: 425_617.75,  total: true },
  ],
};

/* ============================================================
   HEXAGONE SECTORIEL DE PORTER
   ============================================================ */
const PORTER = [
  { force: "Fournisseurs",       note: 2, expli: "Les prestataires (hôtels, clubs) dépendent de la plateforme pour leur visibilité — ils subissent 85% de reversement imposé. Pouvoir de négociation limité." },
  { force: "Clients",            note: 2, expli: "Pouvoir client faible : commissions de 15% acceptées, abonnements B2B récurrents payés sans résistance, créances de 90 000 MAD facilement recouvrables." },
  { force: "Concurrents",        note: 3, expli: "Le marché marocain du loisir en ligne est encore émergent mais des acteurs internationaux (Booking, Airbnb Experiences) sont présents. Rivalité modérée." },
  { force: "Entrants potentiels",note: 4, expli: "Le secteur des plateformes digitales de loisirs est attractif (marge 15%, forte VA de 65% du CA). Barrières à l'entrée faibles : 550 000 MAD suffisent à démarrer." },
  { force: "Substituts",         note: 4, expli: "La réservation directe auprès des hôtels/clubs, les appels téléphoniques, ou des plateformes concurrentes (Booking, GetYourGuide) constituent des alternatives accessibles." },
  { force: "Pouvoirs publics",   note: 2, expli: "Régime TVA ordinaire à 20%, exonération de taxe professionnelle sur 5 ans, IS avantageux en démarrage. Le cadre réglementaire est favorable." },
];
const PORTER_TOTAL = PORTER.reduce((s, p) => s + p.note, 0);

/* ============================================================
   JALONS PROJET 2026 — selon timeline officielle (Juin → Oct)
   ============================================================ */
const JALONS = [
  { date: "1 juin",     label: "Début du projet",                              pos: 25 },
  { date: "8 juin",     label: "Étude de marché",                              pos: 10 },
  { date: "15 juin",    label: "Constitution légale de la SARL",               pos: -10 },
  { date: "25 juin",    label: "Signature du bail & Aménagement du local",     pos: 15 },
  { date: "10 juil.",   label: "Finalisation de l'interface du site web",     pos: -15 },
  { date: "25 juil.",   label: "Validation du système de billetterie QR Code", pos: 15 },
  { date: "5 août",     label: "Signature des contrats partenaires",           pos: -15 },
  { date: "15 août",    label: "Recrutement & Formation du service client",    pos: 20 },
  { date: "25 août",    label: "Lancement de la campagne Marketing",           pos: 5 },
  { date: "1 sept.",    label: "Ouverture officielle (Go-Live)",               pos: 15 },
  { date: "15 sept.",   label: "Suivi des premières réservations clients",     pos: 5 },
  { date: "1 oct.",     label: "Bilan du premier mois & Fin du projet",        pos: 25 },
];

/* ============================================================
   CANVAS D'OPPORTUNITÉ
   ============================================================ */
const CANVAS = {
  probleme: "Au Maroc, réserver une activité de loisirs reste un parcours fragmenté : appels, WhatsApp, paiements en cash, créneaux invendus côté prestataires et touristes/locaux qui passent à côté d'expériences authentiques.",
  idee: "Une super-app marocaine qui agrège, recommande et permet de réserver en 2 clics les meilleures activités locales — selon la météo, l'humeur, la position et le budget de chacun.",
  cible: "Touristes étrangers (FR, ES, UK, GCC), MRE en visite, jeunes actifs urbains marocains 25-45 ans, familles, et groupes éphémères via Lightning Matching.",
  fait: "Marketplace mobile-first, paiement sécurisé, IA Yasmine, Flash Deals géolocalisés, dashboard SaaS partenaires, QR-code de réservation, reversement hebdomadaire.",
  change: "Transforme le secteur informel des loisirs en une économie numérique structurée : +revenus pour les prestataires (yield management), +confiance pour les clients (avis vérifiés, paiement sécurisé), +visibilité pour les régions (Tanger, Chefchaouen, Merzouga…).",
};

/* ============================================================
   EXPORTS XLSX
   ============================================================ */
const aoaToExcel = (filename: string, sheets: { name: string; data: (string | number | null)[][] }[]) => {
  const wb = XLSX.utils.book_new();
  sheets.forEach((s) => {
    const ws = XLSX.utils.aoa_to_sheet(s.data);
    XLSX.utils.book_append_sheet(wb, ws, s.name.slice(0, 31));
  });
  XLSX.writeFile(wb, filename);
};

const exportESG = () => {
  const data: (string | number)[][] = [
    ["État des Soldes Intermédiaires de Gestion — Loisirbooking SARL"],
    ["Libellé", "N (2026)", "N+1 (2027)", "N+2 (2028)"],
    ["Production de l'exercice", SIG.production[0], SIG.production[1], SIG.production[2]],
    ["Consommation de l'exercice", SIG.consommation[0], SIG.consommation[1], SIG.consommation[2]],
    ["Valeur ajoutée", SIG.valeurAjoutee[0], SIG.valeurAjoutee[1], SIG.valeurAjoutee[2]],
    ["Charges de personnel", SIG.chargesPersonnel[0], SIG.chargesPersonnel[1], SIG.chargesPersonnel[2]],
    ["Excédent brut d'exploitation", SIG.ebe[0], SIG.ebe[1], SIG.ebe[2]],
    ["Résultat d'exploitation", SIG.resultatExp[0], SIG.resultatExp[1], SIG.resultatExp[2]],
    ["Résultat net de l'exercice", SIG.resultatNet[0], SIG.resultatNet[1], SIG.resultatNet[2]],
    ["Capacité d'autofinancement (CAF)", SIG.caf[0], SIG.caf[1], SIG.caf[2]],
  ];
  aoaToExcel("ESG_Loisirbooking_2026.xlsx", [{ name: "ESG", data }]);
};

const exportTreso = () => {
  const header = ["Libellé", ...MOIS, "Total"];
  const rowOf = (label: string, vals: number[]) => [label, ...vals, sumRow(vals)] as (string | number)[];
  const data: (string | number)[][] = [
    ["Plan de trésorerie 2026 — Loisirbooking SARL"],
    header,
    rowOf("Solde de début de mois", soldeDebut),
    rowOf("Prestations de services TTC", prestaServicesTTC),
    rowOf("Apport en capital", apportCapital),
    rowOf("Emprunt", empruntM),
    rowOf("TOTAL ENCAISSEMENTS", totalEnc),
    rowOf("Matières et fournitures", matieresM),
    rowOf("Eau / Électricité", eauElecM),
    rowOf("Entretien et réparations", entretienRepM),
    rowOf("Loyer", loyerM),
    rowOf("Téléphone / Internet", telInternetM),
    rowOf("Publicité / Communication", pubCommM),
    rowOf("Services bancaires", servBancairesM),
    rowOf("Impôts et taxes", impotsTaxesM),
    rowOf("Salaires", salairesM),
    rowOf("Charges patronales CNSS", chargesSocialesM),
    rowOf("TVA à payer", tvaPaiementM),
    rowOf("Remboursement emprunt", remboursementEmpruntM),
    rowOf("TOTAL DÉCAISSEMENTS", totalDecMois),
    rowOf("Solde fin de mois (cumulé)", soldeFin),
  ];
  aoaToExcel("Tresorerie_Loisirbooking_2026.xlsx", [{ name: "Trésorerie 2026", data }]);
};

const exportTVA = () => {
  const header = ["Libellé", ...TVA_MOIS, "Total"];
  const r = (label: string, v: (number | null)[]) => [label, ...v.map((x) => x ?? "-"), sumRow(v.map((x) => x ?? 0))] as (string | number)[];
  const data: (string | number)[][] = [
    ["Budget de TVA 2026 — Loisirbooking SARL — Taux 20%"],
    header,
    r("TVA collectée sur les ventes", tvaCollectee),
    r("TVA déductible sur les achats", tvaDedAchats),
    r("TVA déductible sur les investissements", tvaDedInvest),
    r("Crédit de TVA du mois précédent", tvaCreditPrec),
    r("TVA à payer / crédit à reporter", tvaSolde),
    r("Paiement de la TVA (M+1)", tvaPaiement),
  ];
  aoaToExcel("Budget_TVA_Loisirbooking_2026.xlsx", [{ name: "Budget TVA", data }]);
};

const exportMedia = () => {
  const header = ["Action", "Catégorie", ...MOIS, "Total", "Taux %"];
  const data: (string | number)[][] = [["Plan média 2026 — Loisirbooking SARL"], header];
  const sectionLabel: Record<string, string> = {
    "media-trad": "Médias traditionnels",
    "internet": "Internet / Web",
    "alt": "Publicité alternative",
    "direct": "Marketing direct",
    "hors-web": "Hors média web",
  };
  MEDIA_PLAN.forEach((row) => {
    const tot = sumRow(row.values);
    data.push([row.action, sectionLabel[row.section], ...row.values, tot, +(tot / TOTAL_MARKETING * 100).toFixed(2)]);
  });
  data.push(["TOTAL", "", ...monthlyMarketing, TOTAL_MARKETING, 100]);
  aoaToExcel("Plan_Media_Loisirbooking_2026.xlsx", [{ name: "Plan média", data }]);
};

const exportEquipe = () => {
  const data: (string | number)[][] = [
    ["Équipe Loisirbooking SARL — 2026"],
    ["Nom", "Prénom", "Poste / Responsabilité"],
    ...EQUIPE.map((e) => [e.nom, e.prenom, e.poste]),
  ];
  aoaToExcel("Equipe_Loisirbooking_2026.xlsx", [{ name: "Équipe", data }]);
};

const exportBilans = () => {
  const dataOuv: (string | number)[][] = [
    ["BILAN D'OUVERTURE — Loisirbooking SARL (Juin 2026)"],
    ["ACTIF (Emplois)", "Montant (MAD)", "PASSIF (Ressources)", "Montant (MAD)"],
  ];
  const maxLen = Math.max(BILAN_OUVERTURE.actif.flatMap((g) => [g, ...g.lignes, ...g.lignes.flatMap((l) => l.details)]).length,
                         BILAN_OUVERTURE.passif.flatMap((g) => [g, ...g.lignes]).length);
  // simple flat dump
  BILAN_OUVERTURE.actif.forEach((g) => {
    dataOuv.push([g.groupe, g.total, "", ""]);
    g.lignes.forEach((l) => {
      dataOuv.push([`  ${l.sub}`, l.montant, "", ""]);
      l.details.forEach((d) => dataOuv.push([`    - ${d[0]}`, d[1] as number, "", ""]));
    });
  });
  dataOuv.push(["TOTAL ACTIF", 550_000, "TOTAL PASSIF", 550_000]);

  const dataClot: (string | number)[][] = [
    ["BILAN DE CLÔTURE — Loisirbooking SARL (31 Décembre 2026)"],
    ["ACTIF", "Brut", "Amort./Prov.", "Net", "PASSIF", "Montant"],
  ];
  const max = Math.max(BILAN_CLOTURE.actif.length, BILAN_CLOTURE.passif.length);
  for (let i = 0; i < max; i++) {
    const a = BILAN_CLOTURE.actif[i];
    const p = BILAN_CLOTURE.passif[i];
    dataClot.push([
      a?.lib ?? "", a?.brut ?? "", a?.amort ?? "", a?.net ?? "",
      p?.lib ?? "", p?.net ?? "",
    ]);
  }
  aoaToExcel("Bilans_Loisirbooking_2026.xlsx", [
    { name: "Ouverture", data: dataOuv },
    { name: "Clôture", data: dataClot },
  ]);
};

const exportAll = () => {
  const wb = XLSX.utils.book_new();
  const add = (name: string, d: (string | number)[][]) => {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(d), name.slice(0, 31));
  };
  add("Identité", [
    ["Loisirbooking SARL — Identité"],
    ["Raison sociale", COMPANY.raisonSociale],
    ["Forme juridique", COMPANY.formeJuridique],
    ["Capital social (MAD)", COMPANY.capital],
    ["RC", COMPANY.rc], ["ICE", COMPANY.ice], ["IF", COMPANY.if],
    ["CNSS", COMPANY.cnss], ["Patente", COMPANY.patente],
    ["Siège", COMPANY.siege], ["Gérant", COMPANY.gerant],
    ["Effectif", COMPANY.effectif], ["Exercice", COMPANY.exercice],
  ]);
  add("Équipe", [["Nom", "Prénom", "Poste"], ...EQUIPE.map((e) => [e.nom, e.prenom, e.poste])]);
  add("ESG", [
    ["Libellé", "N (2026)", "N+1 (2027)", "N+2 (2028)"],
    ["Production", SIG.production[0], SIG.production[1], SIG.production[2]],
    ["Consommation", SIG.consommation[0], SIG.consommation[1], SIG.consommation[2]],
    ["Valeur ajoutée", SIG.valeurAjoutee[0], SIG.valeurAjoutee[1], SIG.valeurAjoutee[2]],
    ["EBE", SIG.ebe[0], SIG.ebe[1], SIG.ebe[2]],
    ["Résultat exploitation", SIG.resultatExp[0], SIG.resultatExp[1], SIG.resultatExp[2]],
    ["Résultat net", SIG.resultatNet[0], SIG.resultatNet[1], SIG.resultatNet[2]],
    ["CAF", SIG.caf[0], SIG.caf[1], SIG.caf[2]],
  ]);
  add("CA mensuel 2026", [
    ["Mois", "Réservations", "Commissions HT", "Frais service HT", "Abonnements HT", "Total CA HT"],
    ...CA_2026.map((r) => [r.mois, r.reservations, r.commissions, r.fraisService, r.abonnements, r.total]),
    ["TOTAL", RES_TOTAL, CA_2026.reduce((s, r) => s + r.commissions, 0), CA_2026.reduce((s, r) => s + r.fraisService, 0), CA_2026.reduce((s, r) => s + r.abonnements, 0), CA_TOTAL],
  ]);
  add("Hexagone Porter", [
    ["Force", "Note /5", "Explication"],
    ...PORTER.map((p) => [p.force, p.note, p.expli]),
    ["Intensité concurrentielle", PORTER_TOTAL, "Intensité modérée. Profits confortables."],
  ]);
  XLSX.writeFile(wb, "Rapport_Financier_Loisirbooking_2026.xlsx");
};

/* ============================================================
   COMPONENT
   ============================================================ */
function FinancePage() {
  const fmt = (n: number) => n.toLocaleString("fr-MA");
  const fmtN = (n: number) => n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtMAD = (n: number) => `${fmt(n)} MAD`;
  const fmtSigned = (n: number) =>
    n < 0 ? `(${fmt(Math.abs(Math.round(n)))})` : fmt(Math.round(n));

  return (
    <div className="bg-secondary/20 pb-20">
      {/* Hero */}
      <section className="bg-gradient-cool py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                <FileText className="h-3.5 w-3.5" /> Communication financière 2026
              </span>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
                Rapport financier prévisionnel 2026
              </h1>
              <p className="mt-2 text-white/90">{COMPANY.raisonSociale} — Conforme aux normes CGNC marocaines</p>
            </div>
            <button
              onClick={exportAll}
              className="inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-sm font-bold text-foreground shadow-soft transition hover:scale-105"
            >
              <Download className="h-4 w-4" /> Télécharger le rapport complet (.xlsx)
            </button>
          </div>
        </div>
      </section>

      {/* Canvas */}
      <section className="mx-auto -mt-6 max-w-7xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border-2 border-cool/40 bg-card shadow-elegant">
          <div className="bg-cool px-6 py-3 text-cool-foreground">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <Lightbulb className="h-4 w-4" /> Canvas d'opportunité — Loisirbooking
            </div>
          </div>
          <div className="grid divide-y divide-cool/20 md:divide-y-0">
            <CanvasBlock icon={<HelpCircle className="h-5 w-5" />} title="Le problème">{CANVAS.probleme}</CanvasBlock>
            <div className="grid md:grid-cols-2 md:divide-x divide-cool/20">
              <CanvasBlock icon={<Lightbulb className="h-5 w-5" />} title="L'idée">{CANVAS.idee}</CanvasBlock>
              <CanvasBlock icon={<Users className="h-5 w-5" />} title="Qui elle concerne ?">{CANVAS.cible}</CanvasBlock>
            </div>
            <div className="grid md:grid-cols-2 md:divide-x divide-cool/20">
              <CanvasBlock icon={<Cog className="h-5 w-5" />} title="Ce qu'elle fait">{CANVAS.fait}</CanvasBlock>
              <CanvasBlock icon={<ArrowRight className="h-5 w-5" />} title="Ce qu'elle change">{CANVAS.change}</CanvasBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Identité */}
      <section className="mx-auto mt-6 max-w-7xl px-4 md:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">Identité de l'entreprise</h2>
              <p className="text-sm text-muted-foreground">Informations légales & administratives</p>
            </div>
          </div>
          <div className="grid gap-x-8 gap-y-3 text-sm md:grid-cols-2">
            <Info label="Raison sociale" value={COMPANY.raisonSociale} />
            <Info label="Forme juridique" value={COMPANY.formeJuridique} />
            <Info label="Capital social" value={`${fmt(COMPANY.capital)} MAD (entièrement libéré)`} />
            <Info label="Activité" value={COMPANY.activite} />
            <Info label="Siège social" value={COMPANY.siege} />
            <Info label="Gérante" value={COMPANY.gerant} />
            <Info label="Registre du commerce" value={COMPANY.rc} />
            <Info label="ICE" value={COMPANY.ice} />
            <Info label="Identifiant fiscal" value={COMPANY.if} />
            <Info label="N° Patente" value={COMPANY.patente} />
            <Info label="N° CNSS" value={COMPANY.cnss} />
            <Info label="Effectif" value={`${COMPANY.effectif} collaborateurs`} />
            <Info label="Exercice social" value={COMPANY.exercice} />
            <Info label="Expert-comptable" value={COMPANY.expertComptable} />
          </div>
        </div>
      </section>

      {/* Équipe */}
      <Section
        icon={<Users className="h-5 w-5" />}
        title="L'équipe Loisirbooking"
        subtitle="10 collaborateurs au service de la super-app marocaine des loisirs"
        action={<DownloadBtn onClick={exportEquipe} label="Équipe (.xlsx)" />}
      >
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-cool/15">
              <tr>
                <th className="px-4 py-3 text-left font-semibold italic">Nom</th>
                <th className="px-4 py-3 text-left font-semibold italic">Prénom</th>
                <th className="px-4 py-3 text-left font-semibold italic">Responsabilité</th>
              </tr>
            </thead>
            <tbody>
              {EQUIPE.map((e, i) => (
                <tr key={i} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-4 py-2.5 font-bold">{e.nom}</td>
                  <td className="px-4 py-2.5">{e.prenom}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{e.poste}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* KPIs */}
      <section className="mx-auto mt-6 max-w-7xl px-4 md:px-8">
        <div className="grid gap-3 md:grid-cols-4">
          <Kpi label="CA prévisionnel 2026" value={fmtMAD(SIG.ventesServices[0])} sub={`${RES_TOTAL.toLocaleString("fr-MA")} réservations`} tone="primary" />
          <Kpi label="Valeur ajoutée 2026" value={fmtMAD(SIG.valeurAjoutee[0])} sub={`${Math.round(SIG.valeurAjoutee[0] / SIG.ventesServices[0] * 100)}% du CA`} tone="mint" />
          <Kpi label="Résultat net 2026" value={fmtSigned(SIG.resultatNet[0]) + " MAD"} sub="Année de constitution — perte normale" tone="saffron" />
          <Kpi label="Trésorerie au 31 déc." value={fmtMAD(243_283.75)} sub="Solde bancaire confortable" tone="zellige" />
        </div>
      </section>

      {/* CA mensuel */}
      <Section icon={<TrendingUp className="h-5 w-5" />} title="Chiffre d'affaires mensuel 2026" subtitle="Détail des recettes : commissions partenaires (45%), frais de service clients (29%), abonnements pros (5%)">
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-cool/15">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold">Mois (2026)</th>
                <th className="px-3 py-2.5 text-right font-semibold">Réservations</th>
                <th className="px-3 py-2.5 text-right font-semibold">Commissions HT</th>
                <th className="px-3 py-2.5 text-right font-semibold">Frais service HT</th>
                <th className="px-3 py-2.5 text-right font-semibold">Abonnements HT</th>
                <th className="px-3 py-2.5 text-right font-semibold">Total CA HT</th>
              </tr>
            </thead>
            <tbody>
              {CA_2026.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{r.mois}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmt(r.reservations)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmt(r.commissions)} MAD</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmt(r.fraisService)} MAD</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmt(r.abonnements)} MAD</td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums">{fmt(r.total)} MAD</td>
                </tr>
              ))}
              <tr className="border-t-2 border-primary bg-primary/10 font-bold">
                <td className="px-3 py-2.5">TOTAL 2026</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(RES_TOTAL)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(CA_2026.reduce((s, r) => s + r.commissions, 0))} MAD</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(CA_2026.reduce((s, r) => s + r.fraisService, 0))} MAD</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(CA_2026.reduce((s, r) => s + r.abonnements, 0))} MAD</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-primary">{fmt(CA_TOTAL)} MAD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* SIG */}
      <Section
        icon={<TrendingUp className="h-5 w-5" />}
        title="État des Soldes Intermédiaires de Gestion (SIG)"
        subtitle="Conforme au Code Général de Normalisation Comptable — Prévisions N (2026), N+1 (2027), N+2 (2028)"
        action={<DownloadBtn onClick={exportESG} label="SIG (.xlsx)" />}
      >
        <SIGTable />
      </Section>

      {/* Bilan ouverture */}
      <Section
        icon={<Scale className="h-5 w-5" />}
        title="Bilan d'ouverture — Juin 2026"
        subtitle="Affectation du capital social de 550 000 MAD au démarrage de l'activité"
        action={<DownloadBtn onClick={exportBilans} label="Bilans (.xlsx)" />}
      >
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-mint/40">
                <th className="px-3 py-2.5 text-left font-bold">ACTIF (Emplois de l'argent)</th>
                <th className="px-3 py-2.5 text-right font-bold">Montant (MAD)</th>
                <th className="px-3 py-2.5 text-left font-bold">PASSIF (Ressources de l'argent)</th>
                <th className="px-3 py-2.5 text-right font-bold">Montant (MAD)</th>
              </tr>
            </thead>
            <tbody>
              <BilanOuvertureRows />
              <tr className="border-t-2 border-primary bg-primary/10 font-bold">
                <td className="px-3 py-2.5">TOTAL ACTIF</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-primary">{fmt(550_000)}</td>
                <td className="px-3 py-2.5">TOTAL PASSIF</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-primary">{fmt(550_000)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Plan de trésorerie */}
      <Section
        icon={<Wallet className="h-5 w-5" />}
        title="Plan de trésorerie — Année N (2026)"
        subtitle="Flux mensuels d'encaissements et décaissements (en MAD) — démarrage opérationnel en juin"
        action={<DownloadBtn onClick={exportTreso} label="Trésorerie (.xlsx)" />}
      >
        <ScrollableTable>
          <thead>
            <tr className="bg-cool/10">
              <th className="sticky left-0 z-10 min-w-[260px] bg-cool/10 px-3 py-2 text-left font-semibold">&nbsp;</th>
              {MOIS.map((m) => <th key={m} className="px-2 py-2 text-right font-semibold">{m}</th>)}
            </tr>
          </thead>
          <tbody className="text-xs">
            <TresoRow label="SOLDE DE DÉBUT DE MOIS" values={soldeDebut} highlight />
            <TresoSection label="ENCAISSEMENTS D'EXPLOITATION" />
            <TresoRow label="Vente de marchandises TTC" values={venteMarchTTC} />
            <TresoRow label="Prestation de services TTC" values={prestaServicesTTC} />
            <TresoRow label="TOTAL ENCAISSEMENTS D'EXPLOITATION" values={encExploit} subtotal />
            <TresoSection label="ENCAISSEMENTS HORS EXPLOITATION" />
            <TresoRow label="Apport en capital" values={apportCapital} />
            <TresoRow label="Comptes courants d'associés" values={compteCourant} />
            <TresoRow label="Prêt d'honneur" values={pretHonneur} />
            <TresoRow label="Emprunt" values={empruntM} />
            <TresoRow label="Subventions" values={subventionsM} />
            <TresoRow label="TOTAL ENCAISSEMENTS HORS EXPLOITATION" values={encHorsExp} subtotal />
            <TresoRow label="TOTAL DES ENCAISSEMENTS" values={totalEnc} highlight />

            <TresoSection label="DÉCAISSEMENTS D'EXPLOITATION" />
            <TresoRow label="Matières et fournitures" values={matieresM} />
            <TresoRow label="Eau / Électricité" values={eauElecM} />
            <TresoRow label="Entretien et réparations" values={entretienRepM} />
            <TresoRow label="Loyer" values={loyerM} />
            <TresoRow label="Téléphone / Internet" values={telInternetM} />
            <TresoRow label="Publicité / Communication" values={pubCommM} />
            <TresoRow label="Services bancaires" values={servBancairesM} />
            <TresoRow label="Impôts et taxes" values={impotsTaxesM} />
            <TresoRow label="Salaires" values={salairesM} />
            <TresoRow label="Charges patronales CNSS" values={chargesSocialesM} />
            <TresoRow label="TVA à payer" values={tvaPaiementM} />
            <TresoRow label="TOTAL DÉCAISSEMENTS D'EXPLOITATION" values={decExploitTotal} subtotal />

            <TresoSection label="DÉCAISSEMENTS HORS EXPLOITATION" />
            <TresoRow label="Investissements TTC" values={investTTCMois} />
            <TresoRow label="Remboursement emprunt" values={remboursementEmpruntM} />
            <TresoRow label="TOTAL DÉCAISSEMENTS HORS EXPLOITATION" values={decHorsExp} subtotal />
            <TresoRow label="TOTAL DES DÉCAISSEMENTS" values={totalDecMois} highlight />

            <TresoRow label="SOLDE CUMULÉ EN FIN DE MOIS" values={soldeFin} highlight tone="saffron" />
          </tbody>
        </ScrollableTable>
        <Legend />
      </Section>

      {/* Budget TVA */}
      <Section
        icon={<Receipt className="h-5 w-5" />}
        title="Budget de TVA — Année N (2026)"
        subtitle="TVA au taux ordinaire de 20% — La TVA déductible de pré-lancement (37 600 MAD) crée un crédit reporté résorbé en septembre"
        action={<DownloadBtn onClick={exportTVA} label="Budget TVA (.xlsx)" />}
      >
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-cool/10">
                <th className="sticky left-0 z-10 min-w-[260px] bg-cool/10 px-3 py-2 text-left font-semibold">BUDGET DE TVA — Année N</th>
                {TVA_MOIS.map((m) => (
                  <th key={m} className={`px-2 py-2 text-right font-semibold ${m === "Pré-lanct" ? "bg-saffron/30" : ""}`}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">
              <TVARow label="TVA collectée sur les ventes" values={tvaCollectee} />
              <TVARow label="TVA déductible sur les achats" values={tvaDedAchats} />
              <TVARow label="TVA déductible sur les investissements" values={tvaDedInvest} />
              <TVARow label="Crédit de TVA du mois précédent" values={tvaCreditPrec} />
              <TVARow label="TVA à payer ou crédit de TVA à reporter" values={tvaSolde} highlight />
              <TVARow label="Paiement de la TVA (M+1)" values={tvaPaiement} subtotal />
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <MiniStat label="TVA collectée annuelle" value={fmtMAD(sumRow(tvaCollectee.map((x) => x ?? 0)))} />
          <MiniStat label="TVA déductible annuelle" value={fmtMAD(sumRow(tvaDedAchats.map((x) => x ?? 0)) + sumRow(tvaDedInvest.map((x) => x ?? 0)))} />
          <MiniStat label="TVA à payer (déc.)" value={`${fmt(8_685)} MAD`} accent />
        </div>
        <Legend />
      </Section>

      {/* Plan média */}
      <Section
        icon={<Megaphone className="h-5 w-5" />}
        title="Plan média & Budget de communication 2026"
        subtitle={`Projet Tanger (Juin → Octobre 2026) · Budget total : ${fmtMAD(TOTAL_MARKETING)}`}
        action={<DownloadBtn onClick={exportMedia} label="Plan média (.xlsx)" />}
      >
        <ScrollableTable>
          <thead>
            <tr className="bg-saffron/30">
              <th colSpan={15} className="px-3 py-2 text-center font-bold">Plan média & Budget de communication — Projet Tanger (Juin – Octobre 2026)</th>
            </tr>
            <tr className="bg-saffron/40">
              <th className="sticky left-0 z-10 min-w-[220px] bg-saffron/40 px-3 py-2 text-left font-semibold">Actions</th>
              {MOIS.map((m) => <th key={m} className="px-2 py-2 text-right font-semibold">{m}</th>)}
              <th className="px-2 py-2 text-right font-semibold">Total</th>
              <th className="px-2 py-2 text-right font-semibold">Taux</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            <MediaSection label="Communication Média : Médias traditionnels" tone="bg-cool/30" />
            {MEDIA_PLAN.filter((r) => r.section === "media-trad").map((r) => (
              <MediaRow key={r.action} action={r.action} values={r.values} total={TOTAL_MARKETING} />
            ))}
            <MediaSubtotal label="Total : Médias traditionnels" rows={MEDIA_PLAN.filter((r) => r.section === "media-trad")} grand={TOTAL_MARKETING} tone="bg-cool/20" />

            <MediaSection label="Communication Média : Internet / Web" tone="bg-clay/30" />
            {MEDIA_PLAN.filter((r) => r.section === "internet").map((r) => (
              <MediaRow key={r.action} action={r.action} values={r.values} total={TOTAL_MARKETING} />
            ))}
            <MediaSubtotal label="Total : Internet / Web" rows={MEDIA_PLAN.filter((r) => r.section === "internet")} grand={TOTAL_MARKETING} tone="bg-clay/15" />

            <MediaSection label="Communication Hors-média : Publicité alternative" tone="bg-mint/30" />
            {MEDIA_PLAN.filter((r) => r.section === "alt").map((r) => (
              <MediaRow key={r.action} action={r.action} values={r.values} total={TOTAL_MARKETING} />
            ))}
            <MediaSubtotal label="Total : Publicité alternative" rows={MEDIA_PLAN.filter((r) => r.section === "alt")} grand={TOTAL_MARKETING} tone="bg-mint/20" />

            <MediaSection label="Communication Hors-média : Marketing Direct" tone="bg-secondary" />
            {MEDIA_PLAN.filter((r) => r.section === "direct").map((r) => (
              <MediaRow key={r.action} action={r.action} values={r.values} total={TOTAL_MARKETING} />
            ))}
            <MediaSubtotal label="Total : Marketing Direct" rows={MEDIA_PLAN.filter((r) => r.section === "direct")} grand={TOTAL_MARKETING} tone="bg-secondary/60" />

            <MediaSection label="Communication Hors-média : Hors Média Web" tone="bg-zellige/20" />
            {MEDIA_PLAN.filter((r) => r.section === "hors-web").map((r) => (
              <MediaRow key={r.action} action={r.action} values={r.values} total={TOTAL_MARKETING} />
            ))}
            <MediaSubtotal label="Total : Hors Média Web" rows={MEDIA_PLAN.filter((r) => r.section === "hors-web")} grand={TOTAL_MARKETING} tone="bg-zellige/15" />

            <tr className="border-t-2 border-saffron bg-saffron/30 font-bold">
              <td className="sticky left-0 z-10 bg-saffron/30 px-3 py-2">TOTAL BUDGET ANNUEL</td>
              {monthlyMarketing.map((v, i) => <td key={i} className="px-2 py-2 text-right">{v ? fmt(v) : "-"}</td>)}
              <td className="px-2 py-2 text-right">{fmt(TOTAL_MARKETING)}</td>
              <td className="px-2 py-2 text-right">100%</td>
            </tr>
          </tbody>
        </ScrollableTable>
      </Section>

      {/* Hexagone Porter */}
      <Section
        icon={<Compass className="h-5 w-5" />}
        title="Hexagone sectoriel de Porter"
        subtitle={`Analyse des 6 forces concurrentielles — Score total : ${PORTER_TOTAL}/30 → intensité concurrentielle modérée, profits confortables`}
      >
        <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-4">
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={PORTER.map((p) => ({ force: p.force, note: p.note }))} outerRadius="80%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="force" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Note" dataKey="note" stroke="hsl(var(--saffron))" fill="hsl(var(--saffron))" fillOpacity={0.4} strokeWidth={2} dot />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-cool/15">
                <tr>
                  <th className="px-3 py-2.5 text-left font-bold">Force</th>
                  <th className="px-3 py-2.5 text-center font-bold">Note /5</th>
                  <th className="px-3 py-2.5 text-left font-bold">Explication</th>
                </tr>
              </thead>
              <tbody>
                {PORTER.map((p, i) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="px-3 py-2.5 font-semibold text-saffron-foreground">{p.force}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-saffron/20 px-2 font-bold text-saffron-foreground">{p.note}</span>
                    </td>
                    <td className="px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">{p.expli}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-saffron bg-saffron/15 font-bold">
                  <td className="px-3 py-2.5">Intensité concurrentielle</td>
                  <td className="px-3 py-2.5 text-center text-saffron-foreground">{PORTER_TOTAL}</td>
                  <td className="px-3 py-2.5 text-xs">Intensité modérée. Profits confortables.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Bilan clôture */}
      <Section
        icon={<Scale className="h-5 w-5" />}
        title="Bilan de clôture — 31 Décembre 2026"
        subtitle="Bilan après amortissements, intégrant la perte de l'exercice de constitution (–570 183 MAD)"
        action={<DownloadBtn onClick={exportBilans} label="Bilans (.xlsx)" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-mint/30">
                <tr>
                  <th className="px-3 py-2.5 text-left font-bold">ACTIF</th>
                  <th className="px-3 py-2.5 text-right font-bold">Brut</th>
                  <th className="px-3 py-2.5 text-right font-bold">Amort./Prov.</th>
                  <th className="px-3 py-2.5 text-right font-bold">Net</th>
                </tr>
              </thead>
              <tbody>
                {BILAN_CLOTURE.actif.map((r, i) => (
                  <tr key={i} className={`border-t border-border ${r.total ? "border-t-2 border-primary bg-primary/10 font-bold" : r.strong ? "bg-mint/15 font-semibold" : r.sub ? "text-muted-foreground" : ""}`}>
                    <td className="px-3 py-1.5">{r.lib}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{r.brut ? fmtN(r.brut) : "-"}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{r.amort ? fmtN(r.amort) : "-"}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{r.net !== 0 ? fmtN(r.net) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-clay/20">
                <tr>
                  <th className="px-3 py-2.5 text-left font-bold">PASSIF</th>
                  <th className="px-3 py-2.5 text-right font-bold">Montant</th>
                </tr>
              </thead>
              <tbody>
                {BILAN_CLOTURE.passif.map((r, i) => (
                  <tr key={i} className={`border-t border-border ${r.total ? "border-t-2 border-primary bg-primary/10 font-bold" : r.strong ? "bg-clay/10 font-semibold" : r.sub ? "text-muted-foreground" : ""}`}>
                    <td className="px-3 py-1.5">{r.lib}</td>
                    <td className={`px-3 py-1.5 text-right tabular-nums ${r.net < 0 ? "text-destructive" : ""}`}>
                      {r.net < 0 ? `(${fmtN(Math.abs(r.net))})` : fmtN(r.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          La perte de constitution est <b>cohérente</b> : l'activité ne couvre que 7 mois (juin → décembre) avec des charges fixes mensuelles (salaires 110 k MAD, loyer 10 k, marketing 24 k, charges sociales 15,9 k). Dès N+1 (2027), l'EBE devient positif (+162 590 MAD) grâce au plein effet d'année.
        </p>
      </Section>

      {/* Jalons */}
      <Section icon={<Target className="h-5 w-5" />} title="Jalons clés du projet 2026" subtitle="Chronologie opérationnelle : du Début du projet (1er juin) au Bilan du premier mois (1er octobre)">
        <Timeline jalons={JALONS} />
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-cool/10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Jalon</th>
                <th className="px-4 py-3 text-right font-semibold">Position</th>
              </tr>
            </thead>
            <tbody>
              {JALONS.map((j, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{j.date}</td>
                  <td className="px-4 py-2.5">{j.label}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{j.pos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function SIGTable() {
  const fmt = (n: number) => {
    if (n === 0) return "0,00";
    const r = Math.round(n * 100) / 100;
    return r.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  type Row = { rom?: string; num?: string; op?: string; label: string; values: number[]; strong?: boolean; highlight?: boolean };
  const rows: Row[] = [
    { num: "1", label: "Ventes de marchandises (en l'état)", values: [0, 0, 0] },
    { num: "2", label: "Achats revendus de marchandises", op: "-", values: [0, 0, 0] },
    { rom: "I", op: "=", label: "MARGE COMMERCIALE", values: [0, 0, 0], strong: true },
    { rom: "II", op: "+", label: "PRODUCTION DE L'EXERCICE (3+4+5)", values: SIG.production, strong: true },
    { num: "3", label: "Ventes de biens et services produits", values: SIG.ventesServices },
    { num: "4", label: "Variation de stocks de produits", values: [0, 0, 0] },
    { num: "5", label: "Immobilisations produites par l'Ese pour elle-même", values: [0, 0, 0] },
    { rom: "III", op: "-", label: "CONSOMMATION DE L'EXERCICE (6+7)", values: SIG.consommation, strong: true },
    { num: "6", label: "Achats consommés de matières et fournitures", values: SIG.achatsMatieres },
    { num: "7", label: "Autres charges externes", values: SIG.autresChargesExt },
    { rom: "IV", op: "=", label: "VALEUR AJOUTÉE (I+II-III)", values: SIG.valeurAjoutee, strong: true },
    { num: "8", op: "+", label: "Subventions d'exploitation", values: SIG.subventions },
    { rom: "V", num: "9", op: "-", label: "Impôts et taxes", values: SIG.impotsTaxes },
    { num: "10", op: "-", label: "Charges de personnel", values: SIG.chargesPersonnel },
    { op: "=", label: "EXCÉDENT BRUT D'EXPLOITATION (E.B.E)", values: SIG.ebe, strong: true },
    { op: "=", label: "INSUFFISANCE BRUTE D'EXPLOITATION", values: SIG.insuffisanceBE },
    { num: "11", op: "+", label: "Autres produits d'exploitation", values: SIG.autresProduitsExp },
    { num: "12", op: "-", label: "Autres charges d'exploitation", values: SIG.autresChargesExp },
    { num: "13", op: "+", label: "Reprises d'exploitation : transfert de charges", values: SIG.reprisesExp },
    { num: "14", op: "-", label: "Dotations d'exploitation", values: SIG.dotationsExp },
    { rom: "VI", op: "=", label: "RÉSULTAT D'EXPLOITATION (+ ou -)", values: SIG.resultatExp, strong: true },
    { rom: "VII", label: "RÉSULTAT FINANCIER", values: SIG.resultatFin },
    { rom: "VIII", op: "=", label: "RÉSULTAT COURANT AVANT IMPÔTS (+ ou -)", values: SIG.resultatCourant, strong: true },
    { rom: "IX", label: "RÉSULTAT NON COURANT (+ ou -)", values: SIG.resultatNonCour },
    { rom: "X", num: "15", op: "-", label: "Impôts sur les résultats", values: SIG.is },
    { op: "=", label: "RÉSULTAT NET DE L'EXERCICE (+ ou -)", values: SIG.resultatNet, strong: true, highlight: true },
    { rom: "I", op: "=", label: "CAPACITÉ D'AUTOFINANCEMENT (C.A.F)", values: SIG.caf, strong: true, highlight: true },
    { rom: "II", op: "=", label: "AUTOFINANCEMENT", values: SIG.autofinancement, strong: true },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="bg-mint/40">
            <th colSpan={4} className="px-3 py-3 text-center font-display text-base font-bold">État des Soldes Intermédiaires de Gestion</th>
            <th className="px-3 py-3 text-right font-bold">N (2026)</th>
            <th className="px-3 py-3 text-right font-bold">N+1 (2027)</th>
            <th className="px-3 py-3 text-right font-bold">N+2 (2028)</th>
          </tr>
          <tr className="bg-mint/20">
            <th className="px-2 py-1 text-left text-xs">Rom.</th>
            <th className="px-2 py-1 text-left text-xs">N°</th>
            <th className="px-2 py-1 text-center text-xs">Op</th>
            <th className="px-2 py-1 text-left text-xs">Libellé</th>
            <th className="px-2 py-1" />
            <th className="px-2 py-1" />
            <th className="px-2 py-1" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-t border-border ${r.highlight ? "bg-saffron/15" : r.strong ? "bg-mint/10" : ""}`}>
              <td className={`px-2 py-1.5 text-xs ${r.strong ? "font-bold" : ""}`}>{r.rom ?? ""}</td>
              <td className="px-2 py-1.5 text-xs">{r.num ?? ""}</td>
              <td className="px-2 py-1.5 text-center text-xs">{r.op ?? ""}</td>
              <td className={`px-2 py-1.5 ${r.strong ? "font-bold" : ""}`}>{r.label}</td>
              {r.values.map((v, j) => (
                <td key={j} className={`px-2 py-1.5 text-right tabular-nums ${r.strong ? "font-bold" : ""} ${v < 0 ? "text-destructive" : ""}`}>
                  {v < 0 ? `(${fmt(Math.abs(v))})` : fmt(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BilanOuvertureRows() {
  const fmt = (n: number) => n.toLocaleString("fr-MA");
  const actif = BILAN_OUVERTURE.actif;
  const passif = BILAN_OUVERTURE.passif;
  // flatten actif rows
  const actifRows: { lib: string; m: number | null; lvl: 0 | 1 | 2; group?: boolean }[] = [];
  actif.forEach((g) => {
    actifRows.push({ lib: g.groupe, m: g.total, lvl: 0, group: true });
    g.lignes.forEach((l) => {
      actifRows.push({ lib: l.sub, m: l.montant, lvl: 1 });
      l.details.forEach((d) => actifRows.push({ lib: `– ${d[0]}`, m: d[1] as number, lvl: 2 }));
    });
  });
  const passifRows: { lib: string; m: number | null; lvl: 0 | 1; group?: boolean }[] = [];
  passif.forEach((g) => {
    passifRows.push({ lib: g.groupe, m: g.total, lvl: 0, group: true });
    g.lignes.forEach((l) => passifRows.push({ lib: l.sub, m: l.montant, lvl: 1 }));
  });
  const rows = Math.max(actifRows.length, passifRows.length);
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => {
        const a = actifRows[i];
        const p = passifRows[i];
        return (
          <tr key={i} className="border-t border-border align-top">
            <td className={`px-3 py-1.5 ${a?.group ? "bg-mint/15 font-bold" : a?.lvl === 1 ? "italic" : a?.lvl === 2 ? "pl-8 text-xs text-muted-foreground" : ""}`}>{a?.lib ?? ""}</td>
            <td className={`px-3 py-1.5 text-right tabular-nums ${a?.group ? "bg-mint/15 font-bold" : a?.lvl === 2 ? "text-xs text-muted-foreground" : ""}`}>{a?.m != null ? fmt(a.m) : ""}</td>
            <td className={`px-3 py-1.5 ${p?.group ? "bg-clay/10 font-bold" : p?.lvl === 1 ? "italic" : ""}`}>{p?.lib ?? ""}</td>
            <td className={`px-3 py-1.5 text-right tabular-nums ${p?.group ? "bg-clay/10 font-bold" : ""}`}>{p?.m != null ? fmt(p.m) : ""}</td>
          </tr>
        );
      })}
    </>
  );
}

function DownloadBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft transition hover:scale-105"
    >
      <Download className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function CanvasBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="p-5">
      <div className="mb-2 flex items-center gap-2 text-cool">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cool/15">{icon}</span>
        <h3 className="font-display text-sm font-bold uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border/50 pb-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "primary" | "mint" | "saffron" | "zellige" }) {
  const bgMap = { primary: "bg-primary/10 text-primary", mint: "bg-mint/30 text-mint-foreground", saffron: "bg-saffron/20 text-saffron-foreground", zellige: "bg-zellige/15 text-zellige" };
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bgMap[tone]}`}>{label}</div>
      <div className="font-display text-2xl font-bold leading-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function Section({ icon, title, subtitle, children, action }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 md:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</span>
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="rounded-3xl border border-border bg-card p-4 shadow-soft md:p-6">{children}</div>
    </section>
  );
}

function ScrollableTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[1100px]">{children}</table>
    </div>
  );
}

function TresoSection({ label }: { label: string }) {
  return (
    <tr className="bg-saffron/20">
      <td colSpan={13} className="sticky left-0 z-10 bg-saffron/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">{label}</td>
    </tr>
  );
}

function TresoRow({ label, values, highlight, subtotal, tone }: { label: string; values: number[]; highlight?: boolean; subtotal?: boolean; tone?: "saffron" }) {
  const fmt = (n: number) => {
    if (n === 0) return "-";
    if (Number.isInteger(n)) return n.toLocaleString("fr-MA");
    return n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const cls = highlight
    ? tone === "saffron" ? "bg-saffron/25 font-bold" : "bg-cool/15 font-bold"
    : subtotal ? "bg-secondary/60 font-semibold" : "";
  return (
    <tr className={`border-t border-border ${cls}`}>
      <td className={`sticky left-0 z-10 px-3 py-1.5 ${cls || "bg-card"}`}>{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-2 py-1.5 text-right tabular-nums">
          {fmt(v)}
          {v !== 0 && <span className="ml-0.5 text-[10px] text-muted-foreground">DH</span>}
        </td>
      ))}
    </tr>
  );
}

function TVARow({ label, values, highlight, subtotal }: { label: string; values: (number | null)[]; highlight?: boolean; subtotal?: boolean }) {
  const fmt = (n: number) => {
    if (n === 0) return "0,00";
    return Math.abs(n).toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const cls = highlight ? "bg-saffron/25 font-bold" : subtotal ? "bg-secondary/60 font-semibold" : "";
  return (
    <tr className={`border-t border-border ${cls}`}>
      <td className={`sticky left-0 z-10 px-3 py-1.5 ${cls || "bg-card"}`}>{label}</td>
      {values.map((v, i) => {
        const isPre = i === 5;
        if (v == null) return <td key={i} className={`px-2 py-1.5 text-right text-muted-foreground ${isPre ? "bg-saffron/10" : ""}`}>-</td>;
        return (
          <td key={i} className={`px-2 py-1.5 text-right tabular-nums ${isPre ? "bg-saffron/10" : ""} ${v < 0 ? "text-destructive" : ""}`}>
            {v < 0 ? `(${fmt(v)})` : fmt(v)}
            <span className="ml-0.5 text-[10px] text-muted-foreground">DH</span>
          </td>
        );
      })}
    </tr>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-saffron/40 bg-saffron/10" : "border-border bg-secondary/30"}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
    </div>
  );
}

function MediaSection({ label, tone }: { label: string; tone: string }) {
  return (
    <tr className={tone}>
      <td colSpan={15} className={`sticky left-0 z-10 ${tone} px-3 py-1.5 text-center text-xs font-bold`}>{label}</td>
    </tr>
  );
}

function MediaRow({ action, values, total }: { action: string; values: number[]; total: number }) {
  const sum = values.reduce((a, b) => a + b, 0);
  const fmt = (n: number) => n === 0 ? "-" : `${n.toLocaleString("fr-MA")} MAD`;
  return (
    <tr className="border-t border-border">
      <td className="sticky left-0 z-10 bg-card px-3 py-1.5">{action}</td>
      {values.map((v, i) => <td key={i} className="px-2 py-1.5 text-right tabular-nums text-xs">{fmt(v)}</td>)}
      <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{fmt(sum)}</td>
      <td className="px-2 py-1.5 text-right text-xs">{total ? `${(sum / total * 100).toFixed(1)}%` : "-"}</td>
    </tr>
  );
}

function MediaSubtotal({ label, rows, grand, tone }: { label: string; rows: { values: number[] }[]; grand: number; tone: string }) {
  const monthly = Array.from({ length: 12 }, (_, m) => rows.reduce((s, r) => s + r.values[m], 0));
  const sum = monthly.reduce((a, b) => a + b, 0);
  const fmt = (n: number) => n === 0 ? "-" : `${n.toLocaleString("fr-MA")} MAD`;
  return (
    <tr className={`border-t border-border font-bold ${tone}`}>
      <td className={`sticky left-0 z-10 ${tone} px-3 py-1.5`}>{label}</td>
      {monthly.map((v, i) => <td key={i} className="px-2 py-1.5 text-right tabular-nums">{fmt(v)}</td>)}
      <td className="px-2 py-1.5 text-right tabular-nums">{fmt(sum)}</td>
      <td className="px-2 py-1.5 text-right text-xs">{grand ? `${(sum / grand * 100).toFixed(1)}%` : "-"}</td>
    </tr>
  );
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-card border border-border" /> Chiffres à renseigner</span>
      <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-saffron/25" /> Chiffres calculés automatiquement</span>
    </div>
  );
}

function Timeline({ jalons }: { jalons: { date: string; label: string; pos: number }[] }) {
  return (
    <div className="relative h-72 overflow-x-auto rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="relative h-full min-w-[1300px]">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-saffron/40" />
        {jalons.map((j, i) => {
          const x = ((i + 0.5) / jalons.length) * 100;
          const above = j.pos > 0;
          const offset = Math.abs(j.pos) * 3;
          return (
            <div key={i} className="absolute" style={{ left: `${x}%`, top: "50%", transform: "translateX(-50%)" }}>
              <div className="relative">
                <div className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-saffron bg-saffron/30" />
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={above ? { bottom: `${offset}px` } : { top: `${offset}px` }}
                >
                  <div className="mx-auto w-px bg-saffron/50" style={{ height: `${offset}px` }} />
                  <div className={`whitespace-nowrap text-[11px] font-semibold ${above ? "mb-1" : "mt-1"}`}>
                    <div className="font-display text-saffron-foreground">{j.label}</div>
                    <div className="text-muted-foreground">{j.date}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
