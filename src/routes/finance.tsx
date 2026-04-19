import { createFileRoute } from "@tanstack/react-router";
import { Building2, Download, FileText, TrendingUp, Calendar, Wallet, Receipt, Megaphone, Target, Users, Lightbulb, HelpCircle, Cog, ArrowRight } from "lucide-react";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Communication Financière — LoisirBooking" },
      { name: "description", content: "Rapport financier annuel 2025 de Loisirbooking SARL : ESG, plan de trésorerie, budget TVA, plan média, équipe et jalons projet aux normes CGNC marocaines." },
    ],
  }),
  component: FinancePage,
});

/* ============================================================
   MODÈLE FINANCIER COHÉRENT — Loisirbooking SARL
   Année N = 2025  |  Toutes les lignes sont liées entre elles
   ============================================================ */

const COMPANY = {
  raisonSociale: "Loisirbooking SARL",
  formeJuridique: "Société à Responsabilité Limitée (SARL)",
  capital: 500_000, // MAD
  rc: "RC Tanger n° 98 547",
  ice: "ICE 002 458 791 000 037",
  if: "IF 41 287 365",
  cnss: "CNSS 8 547 219",
  patente: "Patente 47 256 893",
  siege: "12, Rue Ibn Batouta, Marshan — 90 000 Tanger",
  effectif: 10,
  exercice: "Du 1er janvier au 31 décembre 2025",
  activite: "Plateforme numérique de réservation d'activités de loisirs",
  gerant: "Mme Kaoutar BOUAGLOU",
  expertComptable: "Cabinet Bennani & Associés — Tanger",
};

// === ÉQUIPE LOISIRBOOKING (10 collaborateurs) ===
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

// === COMPTE DE PRODUITS ET CHARGES (base CGNC) ===
const VENTES_SERVICES = 4_280_000;
const VARIATION_STOCK = 0;
const IMMO_PRODUITES = 0;
const PRODUCTION = VENTES_SERVICES + VARIATION_STOCK + IMMO_PRODUITES;

const ACHATS_MATIERES = 312_000;
const AUTRES_CHARGES_EXT = 1_485_000;
const CONSOMMATION = ACHATS_MATIERES + AUTRES_CHARGES_EXT;

const VALEUR_AJOUTEE = PRODUCTION - CONSOMMATION;

const SUBVENTIONS = 80_000;
const IMPOTS_TAXES = 96_000;
const CHARGES_PERSONNEL = 1_240_000; // 10 salariés
const EBE = VALEUR_AJOUTEE + SUBVENTIONS - IMPOTS_TAXES - CHARGES_PERSONNEL;

const AUTRES_PRODUITS_EXP = 24_000;
const AUTRES_CHARGES_EXP = 18_000;
const REPRISES_EXP = 12_000;
const DOTATIONS_EXP = 185_000;
const RESULTAT_EXP = EBE + AUTRES_PRODUITS_EXP - AUTRES_CHARGES_EXP + REPRISES_EXP - DOTATIONS_EXP;

const RESULTAT_FINANCIER = -42_000;
const RESULTAT_COURANT = RESULTAT_EXP + RESULTAT_FINANCIER;
const RESULTAT_NON_COURANT = -15_000;
const RESULTAT_AVANT_IMPOT = RESULTAT_COURANT + RESULTAT_NON_COURANT;
const IS = Math.round(RESULTAT_AVANT_IMPOT * 0.31);
const RESULTAT_NET = RESULTAT_AVANT_IMPOT - IS;

// CAF
const DOTATIONS_FIN = 0;
const DOTATIONS_NC = 8_000;
const REPRISES_FIN = 0;
const REPRISES_NC = 0;
const PROD_CESSION = 0;
const VNA_CEDEES = 0;
const CAF = RESULTAT_NET + DOTATIONS_EXP + DOTATIONS_FIN + DOTATIONS_NC - REPRISES_EXP - REPRISES_FIN - REPRISES_NC - PROD_CESSION + VNA_CEDEES;
const DISTRIBUTIONS = 150_000;
const AUTOFINANCEMENT = CAF - DISTRIBUTIONS;

// === PRÉVISIONS N+1 (2026) et N+2 (2027) ===
// Hypothèses : croissance CA +25% puis +30%, charges +12% puis +15%, économies d'échelle
const fc = (n: number, g1: number, g2: number) => [n, Math.round(n * g1), Math.round(n * g2)] as const;
const F_VENTES = fc(VENTES_SERVICES, 1.25, 1.625);
const F_PROD = F_VENTES;
const F_ACHATS = fc(ACHATS_MATIERES, 1.20, 1.50);
const F_AUTRES_CHARGES = fc(AUTRES_CHARGES_EXT, 1.18, 1.40);
const F_CONSO: readonly [number, number, number] = [F_ACHATS[0] + F_AUTRES_CHARGES[0], F_ACHATS[1] + F_AUTRES_CHARGES[1], F_ACHATS[2] + F_AUTRES_CHARGES[2]];
const F_VA: readonly [number, number, number] = [F_PROD[0] - F_CONSO[0], F_PROD[1] - F_CONSO[1], F_PROD[2] - F_CONSO[2]];
const F_SUBV = fc(SUBVENTIONS, 1.10, 1.10);
const F_IMP = fc(IMPOTS_TAXES, 1.10, 1.20);
const F_PERSO = fc(CHARGES_PERSONNEL, 1.20, 1.45); // recrutements
const F_EBE: readonly [number, number, number] = [F_VA[0] + F_SUBV[0] - F_IMP[0] - F_PERSO[0], F_VA[1] + F_SUBV[1] - F_IMP[1] - F_PERSO[1], F_VA[2] + F_SUBV[2] - F_IMP[2] - F_PERSO[2]];
const F_AUTRES_PROD = fc(AUTRES_PRODUITS_EXP, 1.15, 1.30);
const F_AUTRES_CH = fc(AUTRES_CHARGES_EXP, 1.10, 1.20);
const F_REPR = fc(REPRISES_EXP, 1.0, 1.0);
const F_DOT = fc(DOTATIONS_EXP, 1.30, 1.55);
const F_REXP: readonly [number, number, number] = [F_EBE[0] + F_AUTRES_PROD[0] - F_AUTRES_CH[0] + F_REPR[0] - F_DOT[0], F_EBE[1] + F_AUTRES_PROD[1] - F_AUTRES_CH[1] + F_REPR[1] - F_DOT[1], F_EBE[2] + F_AUTRES_PROD[2] - F_AUTRES_CH[2] + F_REPR[2] - F_DOT[2]];
const F_RFIN = fc(RESULTAT_FINANCIER, 0.85, 0.60);
const F_RCOUR: readonly [number, number, number] = [F_REXP[0] + F_RFIN[0], F_REXP[1] + F_RFIN[1], F_REXP[2] + F_RFIN[2]];
const F_RNC = fc(RESULTAT_NON_COURANT, 0.5, 0.3);
const F_RAI: readonly [number, number, number] = [F_RCOUR[0] + F_RNC[0], F_RCOUR[1] + F_RNC[1], F_RCOUR[2] + F_RNC[2]];
const F_IS: readonly [number, number, number] = [Math.round(F_RAI[0] * 0.31), Math.round(F_RAI[1] * 0.31), Math.round(F_RAI[2] * 0.31)];
const F_RNET: readonly [number, number, number] = [F_RAI[0] - F_IS[0], F_RAI[1] - F_IS[1], F_RAI[2] - F_IS[2]];

// === PLAN MÉDIA ===
const MEDIA_PLAN: { action: string; section: "media-trad" | "internet" | "alt" | "direct" | "hors-web"; values: number[] }[] = [
  { action: "TV", section: "media-trad", values: [0, 0, 0, 0, 8000, 12000, 12000, 8000, 0, 0, 0, 0] },
  { action: "Radio", section: "media-trad", values: [2000, 2000, 3000, 3000, 4000, 5000, 5000, 4000, 2000, 2000, 2000, 3000] },
  { action: "Affichage", section: "media-trad", values: [3000, 3000, 4000, 4000, 5000, 6000, 6000, 5000, 3000, 3000, 3000, 4000] },
  { action: "Presse", section: "media-trad", values: [1000, 1000, 1500, 1500, 2000, 2000, 2000, 1500, 1000, 1000, 1000, 1500] },
  { action: "Médias sociaux", section: "internet", values: [3500, 3500, 4000, 4500, 5500, 6500, 6500, 5500, 4000, 3500, 3500, 4000] },
  { action: "Blogs", section: "internet", values: [800, 800, 1000, 1000, 1200, 1500, 1500, 1200, 1000, 800, 800, 1000] },
  { action: "Forum / Salon", section: "alt", values: [0, 5000, 0, 0, 4000, 0, 0, 0, 6000, 0, 0, 0] },
  { action: "Conférence", section: "alt", values: [0, 0, 0, 2000, 0, 0, 0, 0, 0, 2000, 0, 0] },
  { action: "Street-Marketing", section: "alt", values: [0, 0, 1500, 1500, 2000, 2000, 2000, 1500, 1500, 0, 0, 0] },
  { action: "PLV", section: "alt", values: [500, 500, 700, 700, 900, 900, 900, 700, 700, 500, 500, 500] },
  { action: "Promotion produit 1", section: "alt", values: [0, 0, 0, 1500, 0, 0, 1500, 0, 0, 0, 0, 1500] },
  { action: "Promotion produit 2", section: "alt", values: [0, 0, 0, 0, 1500, 0, 0, 1500, 0, 0, 0, 0] },
  { action: "Courriers postaux", section: "direct", values: [200, 200, 300, 300, 400, 400, 400, 300, 300, 200, 200, 300] },
  { action: "E-mailings", section: "direct", values: [400, 400, 500, 500, 700, 800, 800, 700, 500, 400, 400, 500] },
  { action: "Catalogue", section: "direct", values: [0, 0, 2500, 0, 0, 0, 0, 0, 2500, 0, 0, 0] },
  { action: "Application mobile", section: "hors-web", values: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800] },
  { action: "Site Web / Blog", section: "hors-web", values: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600] },
  { action: "Forum en ligne", section: "hors-web", values: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200] },
];
const sumRow = (vals: number[]) => vals.reduce((a, b) => a + b, 0);
const monthlyMarketing = Array.from({ length: 12 }, (_, m) => MEDIA_PLAN.reduce((s, r) => s + r.values[m], 0));
const TOTAL_MARKETING = sumRow(monthlyMarketing);

// === PLAN DE TRÉSORERIE ===
const SAISON = [0.05, 0.05, 0.07, 0.08, 0.09, 0.11, 0.13, 0.13, 0.11, 0.08, 0.05, 0.05];
const ventesHTMois = SAISON.map((p) => Math.round(VENTES_SERVICES * p));
const ventesTTCMois = ventesHTMois.map((v) => Math.round(v * 1.20));
const prestaServicesTTC = ventesTTCMois;
const venteMarchTTC = SAISON.map(() => 0);

const COMPTE_COURANT = SAISON.map(() => 0);
const PRET_HONNEUR = SAISON.map(() => 0);
const EMPRUNT = SAISON.map(() => 0);
const SUBVENTIONS_M = SAISON.map((_, i) => (i === 5 ? SUBVENTIONS : 0));

const encExploit = ventesTTCMois;
const encHorsExp = SUBVENTIONS_M.map((s, i) => s + COMPTE_COURANT[i] + PRET_HONNEUR[i] + EMPRUNT[i]);
const totalEnc = encExploit.map((v, i) => v + encHorsExp[i]);

const marchandisesM = SAISON.map(() => 0);
const matieresM = SAISON.map((p) => Math.round(ACHATS_MATIERES * p));
const eauElecM = Array(12).fill(2800);
const fournEntretienM = Array(12).fill(900);
const fournAdminM = Array(12).fill(700);
const petitMatM = Array(12).fill(1200);
const sousTraitanceM = SAISON.map((p) => Math.round(180_000 * p));
const entretienRepM = Array(12).fill(2500);
const loyerM = Array(12).fill(18_000);
const assurancesM = [0, 0, 14_000, 0, 0, 14_000, 0, 0, 14_000, 0, 0, 14_000];
const honorairesM = [0, 0, 9_000, 0, 0, 9_000, 0, 0, 9_000, 0, 0, 9_000];
const fraisPostauxM = Array(12).fill(450);
const telInternetM = Array(12).fill(1800);
const pubCommM = monthlyMarketing;
const transportCarbM = SAISON.map((p) => Math.round(95_000 * p));
const servBancairesM = Array(12).fill(1100);
const impotsTaxesM = [0, 0, 24_000, 0, 0, 24_000, 0, 0, 24_000, 0, 0, 24_000];
const salairesM = Array(12).fill(Math.round(CHARGES_PERSONNEL / 12));
const chargesSocialesM = salairesM.map((s) => Math.round(s * 0.18));

const decExploitBrut = (i: number) =>
  marchandisesM[i] + matieresM[i] + eauElecM[i] + fournEntretienM[i] + fournAdminM[i] + petitMatM[i] +
  sousTraitanceM[i] + entretienRepM[i] + loyerM[i] + assurancesM[i] + honorairesM[i] + fraisPostauxM[i] +
  telInternetM[i] + pubCommM[i] + transportCarbM[i] + servBancairesM[i] + impotsTaxesM[i] +
  salairesM[i] + chargesSocialesM[i];

const TAUX_TVA = 0.20;
const tvaCollectee = ventesHTMois.map((v) => Math.round(v * TAUX_TVA));
const achatsTVAMois = matieresM.map((_, i) =>
  matieresM[i] + sousTraitanceM[i] + transportCarbM[i] + telInternetM[i] +
  entretienRepM[i] + petitMatM[i] + fournEntretienM[i] + fournAdminM[i] + eauElecM[i]
);
const tvaDedAchats = achatsTVAMois.map((v) => Math.round(v * TAUX_TVA));
const investTTCMois = [0, 0, 0, 60_000, 0, 0, 0, 0, 90_000, 0, 0, 0];
const tvaDedInvest = investTTCMois.map((v) => Math.round(v / 1.20 * TAUX_TVA));

let creditPrec = 0;
const tvaAPayer: number[] = [];
const creditReporte: number[] = [];
for (let i = 0; i < 12; i++) {
  const net = tvaCollectee[i] - tvaDedAchats[i] - tvaDedInvest[i] - creditPrec;
  if (net >= 0) {
    tvaAPayer.push(net);
    creditReporte.push(0);
    creditPrec = 0;
  } else {
    tvaAPayer.push(0);
    creditReporte.push(-net);
    creditPrec = -net;
  }
}
const tvaPaiementM = [0, ...tvaAPayer.slice(0, 11)];

const remboursementEmpruntM = Array(12).fill(8_500);
const decHorsExp = investTTCMois.map((v, i) => v + remboursementEmpruntM[i]);
const decExploitTotal = Array.from({ length: 12 }, (_, i) => decExploitBrut(i) + tvaPaiementM[i]);
const totalDecMois = decExploitTotal.map((v, i) => v + decHorsExp[i]);

const SOLDE_OUVERTURE = 380_000;
const soldeFin: number[] = [];
const soldeDebut: number[] = [];
let cur = SOLDE_OUVERTURE;
for (let i = 0; i < 12; i++) {
  soldeDebut.push(cur);
  cur = cur + totalEnc[i] - totalDecMois[i];
  soldeFin.push(cur);
}

const MOIS = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

// === JALONS PROJET 2025 — réalistes pour une plateforme numérique ===
const JALONS = [
  { date: "20 janv.", label: "Lancement v2 plateforme", pos: 25 },
  { date: "10 févr.", label: "Onboarding 50 partenaires", pos: -20 },
  { date: "05 mars", label: "Sortie app mobile iOS/Android", pos: 30 },
  { date: "15 avr.", label: "Mise en prod Yasmine IA", pos: -25 },
  { date: "10 mai", label: "Campagne TV nationale", pos: 20 },
  { date: "15 juin", label: "Versement subvention ONMT", pos: -15 },
  { date: "01 juil.", label: "Pic saison estivale", pos: 30 },
  { date: "20 août", label: "Module paiement mobile (Inwi/Maroc Telecom)", pos: -20 },
  { date: "15 sept.", label: "Levée de fonds série A", pos: 25 },
  { date: "20 oct.", label: "Expansion Casablanca & Marrakech", pos: -20 },
  { date: "15 nov.", label: "Audit SOC 2 + PCI-DSS", pos: 20 },
  { date: "20 déc.", label: "Clôture exercice & bilan", pos: -25 },
];

// === CANVAS D'OPPORTUNITÉ ===
const CANVAS = {
  probleme: "Au Maroc, réserver une activité de loisirs reste un parcours fragmenté : appels, WhatsApp, paiements en cash, créneaux invendus côté prestataires et touristes/locaux qui passent à côté d'expériences authentiques.",
  idee: "Une super-app marocaine qui agrège, recommande et permet de réserver en 2 clics les meilleures activités locales — selon la météo, l'humeur, la position et le budget de chacun.",
  cible: "Touristes étrangers (FR, ES, UK, GCC), MRE en visite, jeunes actifs urbains marocains 25-45 ans, familles, et groupes éphémères via Lightning Matching.",
  fait: "Marketplace mobile-first, paiement sécurisé, IA Yasmine, Flash Deals géolocalisés, dashboard SaaS partenaires, QR-code de réservation, reversement hebdomadaire.",
  change: "Transforme le secteur informel des loisirs en une économie numérique structurée : +revenus pour les prestataires (yield management), +confiance pour les clients (avis vérifiés, paiement sécurisé), +visibilité pour les régions (Tanger, Chefchaouen, Merzouga…).",
};

/* ============================================================
   EXCEL EXPORT HELPERS
   ============================================================ */
const aoaToExcel = (filename: string, sheets: { name: string; data: (string | number)[][] }[]) => {
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
    ["", "", "", "Libellé", "N (2025)", "N+1 (2026)", "N+2 (2027)"],
    ["II", "", "+", "PRODUCTION DE L'EXERCICE", PRODUCTION, F_PROD[1], F_PROD[2]],
    ["III", "", "-", "CONSOMMATION DE L'EXERCICE", CONSOMMATION, F_CONSO[1], F_CONSO[2]],
    ["IV", "", "=", "VALEUR AJOUTÉE", VALEUR_AJOUTEE, F_VA[1], F_VA[2]],
    ["", "8", "+", "Subventions d'exploitation", SUBVENTIONS, F_SUBV[1], F_SUBV[2]],
    ["V", "9", "-", "Impôts et taxes", IMPOTS_TAXES, F_IMP[1], F_IMP[2]],
    ["", "10", "-", "Charges de personnel", CHARGES_PERSONNEL, F_PERSO[1], F_PERSO[2]],
    ["", "", "=", "EXCÉDENT BRUT D'EXPLOITATION", EBE, F_EBE[1], F_EBE[2]],
    ["VI", "", "=", "RÉSULTAT D'EXPLOITATION", RESULTAT_EXP, F_REXP[1], F_REXP[2]],
    ["VII", "", "", "RÉSULTAT FINANCIER", RESULTAT_FINANCIER, F_RFIN[1], F_RFIN[2]],
    ["VIII", "", "=", "RÉSULTAT COURANT", RESULTAT_COURANT, F_RCOUR[1], F_RCOUR[2]],
    ["IX", "", "", "RÉSULTAT NON COURANT", RESULTAT_NON_COURANT, F_RNC[1], F_RNC[2]],
    ["X", "15", "-", "Impôts sur les résultats", IS, F_IS[1], F_IS[2]],
    ["", "", "=", "RÉSULTAT NET DE L'EXERCICE", RESULTAT_NET, F_RNET[1], F_RNET[2]],
  ];
  aoaToExcel("ESG_Loisirbooking_2025.xlsx", [{ name: "ESG", data }]);
};

const exportTreso = () => {
  const header = ["Libellé", ...MOIS, "Total"];
  const rowOf = (label: string, vals: number[]) => [label, ...vals, sumRow(vals)] as (string | number)[];
  const data: (string | number)[][] = [
    ["Plan de trésorerie 2025 — Loisirbooking SARL"],
    header,
    rowOf("Solde de début de mois", soldeDebut),
    rowOf("Ventes de marchandises TTC", venteMarchTTC),
    rowOf("Prestations de services TTC", prestaServicesTTC),
    rowOf("Subventions", SUBVENTIONS_M),
    rowOf("TOTAL ENCAISSEMENTS", totalEnc),
    rowOf("Matières et fournitures", matieresM),
    rowOf("Eau / Électricité", eauElecM),
    rowOf("Sous-traitance", sousTraitanceM),
    rowOf("Loyer", loyerM),
    rowOf("Assurances", assurancesM),
    rowOf("Honoraires", honorairesM),
    rowOf("Téléphone / Internet", telInternetM),
    rowOf("Publicité / Communication", pubCommM),
    rowOf("Transport / Carburant", transportCarbM),
    rowOf("Salaires", salairesM),
    rowOf("Charges sociales", chargesSocialesM),
    rowOf("TVA à payer", tvaPaiementM),
    rowOf("Investissements TTC", investTTCMois),
    rowOf("Remboursement emprunt", remboursementEmpruntM),
    rowOf("TOTAL DÉCAISSEMENTS", totalDecMois),
    rowOf("Solde fin de mois", soldeFin),
  ];
  aoaToExcel("Tresorerie_Loisirbooking_2025.xlsx", [{ name: "Trésorerie 2025", data }]);
};

const exportTVA = () => {
  const header = ["Libellé", ...MOIS, "Total"];
  const r = (label: string, v: number[]) => [label, ...v, sumRow(v)] as (string | number)[];
  const data: (string | number)[][] = [
    ["Budget de TVA 2025 — Loisirbooking SARL — Taux 20%"],
    header,
    r("TVA collectée sur les ventes", tvaCollectee),
    r("TVA déductible sur les achats", tvaDedAchats),
    r("TVA déductible sur les investissements", tvaDedInvest),
    r("Crédit de TVA reporté", [0, ...creditReporte.slice(0, 11)]),
    r("TVA à payer / crédit à reporter", tvaAPayer),
    r("Paiement de la TVA (M+1)", tvaPaiementM),
  ];
  aoaToExcel("Budget_TVA_Loisirbooking_2025.xlsx", [{ name: "Budget TVA", data }]);
};

const exportMedia = () => {
  const header = ["Action", "Catégorie", ...MOIS, "Total", "Taux %"];
  const data: (string | number)[][] = [["Plan média 2025 — Loisirbooking SARL"], header];
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
  aoaToExcel("Plan_Media_Loisirbooking_2025.xlsx", [{ name: "Plan média", data }]);
};

const exportEquipe = () => {
  const data: (string | number)[][] = [
    ["Équipe Loisirbooking SARL — 2025"],
    ["Nom", "Prénom", "Poste / Responsabilité"],
    ...EQUIPE.map((e) => [e.nom, e.prenom, e.poste]),
  ];
  aoaToExcel("Equipe_Loisirbooking_2025.xlsx", [{ name: "Équipe", data }]);
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
    ["Libellé", "N (2025)", "N+1 (2026)", "N+2 (2027)"],
    ["Production", PRODUCTION, F_PROD[1], F_PROD[2]],
    ["Consommation", CONSOMMATION, F_CONSO[1], F_CONSO[2]],
    ["Valeur ajoutée", VALEUR_AJOUTEE, F_VA[1], F_VA[2]],
    ["EBE", EBE, F_EBE[1], F_EBE[2]],
    ["Résultat exploitation", RESULTAT_EXP, F_REXP[1], F_REXP[2]],
    ["Résultat net", RESULTAT_NET, F_RNET[1], F_RNET[2]],
  ]);
  XLSX.writeFile(wb, "Rapport_Financier_Loisirbooking_2025.xlsx");
};

/* ============================================================
   COMPONENT
   ============================================================ */
function FinancePage() {
  const fmt = (n: number) => n.toLocaleString("fr-MA");
  const fmtMAD = (n: number) => `${fmt(n)} MAD`;

  return (
    <div className="bg-secondary/20 pb-20">
      {/* Hero */}
      <section className="bg-gradient-cool py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                <FileText className="h-3.5 w-3.5" /> Communication financière
              </span>
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
                Rapport financier annuel 2025
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

      {/* === CANVAS D'OPPORTUNITÉ === */}
      <section className="mx-auto -mt-6 max-w-7xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border-2 border-cool/40 bg-card shadow-elegant">
          <div className="bg-cool px-6 py-3 text-cool-foreground">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <Lightbulb className="h-4 w-4" /> Canvas d'opportunité — Loisirbooking
            </div>
          </div>
          <div className="grid divide-y divide-cool/20 md:divide-y-0">
            <CanvasBlock icon={<HelpCircle className="h-5 w-5" />} title="Le problème" full>
              {CANVAS.probleme}
            </CanvasBlock>
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

      {/* Identité de l'entreprise */}
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

      {/* === ÉQUIPE === */}
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
          <Kpi label="Chiffre d'affaires HT" value={fmtMAD(VENTES_SERVICES)} sub="+18% vs N-1" tone="primary" />
          <Kpi label="Valeur ajoutée" value={fmtMAD(VALEUR_AJOUTEE)} sub={`${Math.round(VALEUR_AJOUTEE / VENTES_SERVICES * 100)}% du CA`} tone="mint" />
          <Kpi label="Résultat net" value={fmtMAD(RESULTAT_NET)} sub={`Marge nette ${(RESULTAT_NET / VENTES_SERVICES * 100).toFixed(1)}%`} tone="saffron" />
          <Kpi label="Capacité d'autofinancement" value={fmtMAD(CAF)} sub={`Autofinancement ${fmt(AUTOFINANCEMENT)} MAD`} tone="zellige" />
        </div>
      </section>

      {/* === ESG === */}
      <Section
        icon={<TrendingUp className="h-5 w-5" />}
        title="État des Soldes Intermédiaires de Gestion (ESG)"
        subtitle="Conforme au Code Général de Normalisation Comptable — Exercice 2025 et prévisions"
        action={<DownloadBtn onClick={exportESG} label="ESG (.xlsx)" />}
      >
        <ESGTable
          rows={[
            { rom: "", num: "1", op: "", label: "Ventes de marchandises (en l'état)", values: [0, 0, 0] },
            { rom: "", num: "2", op: "-", label: "Achats revendus de marchandises", values: [0, 0, 0] },
            { rom: "I", num: "", op: "=", label: "MARGE COMMERCIALE", values: [0, 0, 0], strong: true },
            { rom: "II", num: "", op: "+", label: "PRODUCTION DE L'EXERCICE (3+4+5)", values: [PRODUCTION, F_PROD[1], F_PROD[2]], strong: true },
            { rom: "", num: "3", op: "", label: "Ventes de biens et services produits", values: [VENTES_SERVICES, F_VENTES[1], F_VENTES[2]] },
            { rom: "", num: "4", op: "", label: "Variation de stocks de produits", values: [VARIATION_STOCK, 0, 0] },
            { rom: "", num: "5", op: "", label: "Immobilisations produites par l'Ese pour elle-même", values: [IMMO_PRODUITES, 0, 0] },
            { rom: "III", num: "", op: "-", label: "CONSOMMATION DE L'EXERCICE (6+7)", values: [CONSOMMATION, F_CONSO[1], F_CONSO[2]], strong: true },
            { rom: "", num: "6", op: "", label: "Achats consommés de matières et fournitures", values: [ACHATS_MATIERES, F_ACHATS[1], F_ACHATS[2]] },
            { rom: "", num: "7", op: "", label: "Autres charges externes", values: [AUTRES_CHARGES_EXT, F_AUTRES_CHARGES[1], F_AUTRES_CHARGES[2]] },
            { rom: "IV", num: "", op: "=", label: "VALEUR AJOUTÉE (I+II-III)", values: [VALEUR_AJOUTEE, F_VA[1], F_VA[2]], strong: true },
            { rom: "", num: "8", op: "+", label: "Subventions d'exploitation", values: [SUBVENTIONS, F_SUBV[1], F_SUBV[2]] },
            { rom: "V", num: "9", op: "-", label: "Impôts et taxes", values: [IMPOTS_TAXES, F_IMP[1], F_IMP[2]] },
            { rom: "", num: "10", op: "-", label: "Charges de personnel", values: [CHARGES_PERSONNEL, F_PERSO[1], F_PERSO[2]] },
            { rom: "", num: "", op: "=", label: "EXCÉDENT BRUT D'EXPLOITATION (E.B.E)", values: [EBE, F_EBE[1], F_EBE[2]], strong: true },
            { rom: "", num: "11", op: "+", label: "Autres produits d'exploitation", values: [AUTRES_PRODUITS_EXP, F_AUTRES_PROD[1], F_AUTRES_PROD[2]] },
            { rom: "", num: "12", op: "-", label: "Autres charges d'exploitation", values: [AUTRES_CHARGES_EXP, F_AUTRES_CH[1], F_AUTRES_CH[2]] },
            { rom: "", num: "13", op: "+", label: "Reprises d'exploitation : transfert de charges", values: [REPRISES_EXP, F_REPR[1], F_REPR[2]] },
            { rom: "", num: "14", op: "-", label: "Dotations d'exploitation", values: [DOTATIONS_EXP, F_DOT[1], F_DOT[2]] },
            { rom: "VI", num: "", op: "=", label: "RÉSULTAT D'EXPLOITATION (+ ou -)", values: [RESULTAT_EXP, F_REXP[1], F_REXP[2]], strong: true },
            { rom: "VII", num: "", op: "", label: "RÉSULTAT FINANCIER", values: [RESULTAT_FINANCIER, F_RFIN[1], F_RFIN[2]] },
            { rom: "VIII", num: "", op: "=", label: "RÉSULTAT COURANT AVANT IMPÔTS (+ ou -)", values: [RESULTAT_COURANT, F_RCOUR[1], F_RCOUR[2]], strong: true },
            { rom: "IX", num: "", op: "", label: "RÉSULTAT NON COURANT (+ ou -)", values: [RESULTAT_NON_COURANT, F_RNC[1], F_RNC[2]] },
            { rom: "X", num: "15", op: "-", label: "Impôts sur les résultats", values: [IS, F_IS[1], F_IS[2]] },
            { rom: "", num: "", op: "=", label: "RÉSULTAT NET DE L'EXERCICE (+ ou -)", values: [RESULTAT_NET, F_RNET[1], F_RNET[2]], strong: true, highlight: true },
          ]}
          headers={["N (2025)", "N+1 (2026)", "N+2 (2027)"]}
        />
        <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-5">
          <h4 className="mb-3 font-display text-lg font-bold">Calcul de la Capacité d'Autofinancement (C.A.F)</h4>
          <table className="w-full text-sm">
            <tbody>
              <CafRow n="1" label="Résultat net de l'exercice (Bénéfice)" value={RESULTAT_NET} op="" />
              <CafRow n="2" label="Dotations d'exploitation" value={DOTATIONS_EXP} op="+" />
              <CafRow n="3" label="Dotations financières" value={DOTATIONS_FIN} op="+" />
              <CafRow n="4" label="Dotations non courantes" value={DOTATIONS_NC} op="+" />
              <CafRow n="5" label="Reprises d'exploitation" value={REPRISES_EXP} op="-" />
              <CafRow n="6" label="Reprises financières" value={REPRISES_FIN} op="-" />
              <CafRow n="7" label="Reprises non courantes" value={REPRISES_NC} op="-" />
              <CafRow n="8" label="Produits des cessions des immobilisations" value={PROD_CESSION} op="-" />
              <CafRow n="9" label="Valeurs nettes des immobilisations cédées" value={VNA_CEDEES} op="+" />
              <tr className="border-t-2 border-primary bg-primary/5 font-bold">
                <td className="px-3 py-2">I</td>
                <td className="px-3 py-2">CAPACITÉ D'AUTOFINANCEMENT (C.A.F)</td>
                <td className="px-3 py-2 text-right text-primary">{fmtMAD(CAF)}</td>
              </tr>
              <CafRow n="10" label="Distributions de bénéfices" value={DISTRIBUTIONS} op="-" />
              <tr className="border-t-2 border-saffron bg-saffron/10 font-bold">
                <td className="px-3 py-2">II</td>
                <td className="px-3 py-2">AUTOFINANCEMENT</td>
                <td className="px-3 py-2 text-right text-saffron-foreground">{fmtMAD(AUTOFINANCEMENT)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* === PLAN DE TRÉSORERIE === */}
      <Section
        icon={<Wallet className="h-5 w-5" />}
        title="Plan de trésorerie — Année N (2025)"
        subtitle="Flux mensuels d'encaissements et décaissements (en MAD)"
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
            <TresoRow label="Apport en capital" values={SAISON.map(() => 0)} />
            <TresoRow label="Comptes courants d'associés" values={COMPTE_COURANT} />
            <TresoRow label="Prêt d'honneur" values={PRET_HONNEUR} />
            <TresoRow label="Emprunt" values={EMPRUNT} />
            <TresoRow label="Subventions" values={SUBVENTIONS_M} />
            <TresoRow label="TOTAL ENCAISSEMENTS HORS EXPLOITATION" values={encHorsExp} subtotal />
            <TresoRow label="TOTAL DES ENCAISSEMENTS" values={totalEnc} highlight />

            <TresoSection label="DÉCAISSEMENTS D'EXPLOITATION" />
            <TresoRow label="Stock de départ" values={SAISON.map(() => 0)} />
            <TresoRow label="Marchandises" values={marchandisesM} />
            <TresoRow label="Matières et fournitures" values={matieresM} />
            <TresoRow label="Eau / Électricité" values={eauElecM} />
            <TresoRow label="Fournitures d'entretien" values={fournEntretienM} />
            <TresoRow label="Fournitures administratives" values={fournAdminM} />
            <TresoRow label="Petit matériel" values={petitMatM} />
            <TresoRow label="Sous-traitance" values={sousTraitanceM} />
            <TresoRow label="Entretien et réparations" values={entretienRepM} />
            <TresoRow label="Loyer" values={loyerM} />
            <TresoRow label="Assurances" values={assurancesM} />
            <TresoRow label="Honoraires" values={honorairesM} />
            <TresoRow label="Frais postaux" values={fraisPostauxM} />
            <TresoRow label="Téléphone / Internet" values={telInternetM} />
            <TresoRow label="Publicité / Communication" values={pubCommM} />
            <TresoRow label="Frais de transport / Carburant" values={transportCarbM} />
            <TresoRow label="Services bancaires" values={servBancairesM} />
            <TresoRow label="Impôts et taxes" values={impotsTaxesM} />
            <TresoRow label="Salaires" values={salairesM} />
            <TresoRow label="Charges sociales" values={chargesSocialesM} />
            <TresoRow label="TVA à payer" values={tvaPaiementM} />
            <TresoRow label="TOTAL DÉCAISSEMENTS D'EXPLOITATION" values={decExploitTotal} subtotal />
            <TresoSection label="DÉCAISSEMENTS HORS EXPLOITATION" />
            <TresoRow label="Investissements TTC" values={investTTCMois} />
            <TresoRow label="Remboursement emprunt" values={remboursementEmpruntM} />
            <TresoRow label="TOTAL DÉCAISSEMENTS HORS EXPLOITATION" values={decHorsExp} subtotal />
            <TresoRow label="TOTAL DES DÉCAISSEMENTS" values={totalDecMois} highlight />

            <TresoRow label="SOLDE À LA FIN DU MOIS" values={soldeFin} highlight tone="saffron" />
            <TresoRow label="SOLDE CUMULÉ EN FIN DE MOIS" values={soldeFin} highlight tone="saffron" />
          </tbody>
        </ScrollableTable>
        <Legend />
      </Section>

      {/* === BUDGET TVA === */}
      <Section
        icon={<Receipt className="h-5 w-5" />}
        title="Budget de TVA — Année N (2025)"
        subtitle="TVA au taux de 20% conforme au Code Général des Impôts marocain"
        action={<DownloadBtn onClick={exportTVA} label="Budget TVA (.xlsx)" />}
      >
        <ScrollableTable>
          <thead>
            <tr className="bg-cool/10">
              <th className="sticky left-0 z-10 min-w-[260px] bg-cool/10 px-3 py-2 text-left font-semibold">BUDGET DE TVA — Année N</th>
              {MOIS.map((m) => <th key={m} className="px-2 py-2 text-right font-semibold">{m}</th>)}
            </tr>
          </thead>
          <tbody className="text-xs">
            <TresoRow label="TVA collectée sur les ventes" values={tvaCollectee} />
            <TresoRow label="TVA déductible sur les achats" values={tvaDedAchats} />
            <TresoRow label="TVA déductible sur les investissements" values={tvaDedInvest} />
            <TresoRow label="Crédit de TVA du mois précédent" values={[0, ...creditReporte.slice(0, 11)]} />
            <TresoRow label="TVA à payer ou crédit de TVA à reporter" values={tvaAPayer} highlight tone="saffron" />
            <TresoRow label="Paiement de la TVA" values={tvaPaiementM} subtotal />
          </tbody>
        </ScrollableTable>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <MiniStat label="TVA collectée annuelle" value={fmtMAD(sumRow(tvaCollectee))} />
          <MiniStat label="TVA déductible annuelle" value={fmtMAD(sumRow(tvaDedAchats) + sumRow(tvaDedInvest))} />
          <MiniStat label="TVA nette payée" value={fmtMAD(sumRow(tvaAPayer))} accent />
        </div>
        <Legend />
      </Section>

      {/* === PLAN MÉDIA === */}
      <Section
        icon={<Megaphone className="h-5 w-5" />}
        title="Plan média & Budget de communication — Année 2025"
        subtitle={`Budget total annuel : ${fmtMAD(TOTAL_MARKETING)} (intégré à la ligne « Publicité/Communication » du plan de trésorerie)`}
        action={<DownloadBtn onClick={exportMedia} label="Plan média (.xlsx)" />}
      >
        <ScrollableTable>
          <thead>
            <tr className="bg-saffron/30">
              <th colSpan={14} className="px-3 py-2 text-center font-bold">Plan média & Budget de communication — Année 2025</th>
            </tr>
            <tr className="bg-saffron/40">
              <th className="sticky left-0 z-10 min-w-[200px] bg-saffron/40 px-3 py-2 text-left font-semibold">Actions</th>
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

            <MediaSection label="Communication Média : Internet / Web" tone="bg-saffron/20" />
            {MEDIA_PLAN.filter((r) => r.section === "internet").map((r) => (
              <MediaRow key={r.action} action={r.action} values={r.values} total={TOTAL_MARKETING} />
            ))}
            <MediaSubtotal label="Total : Internet / Web" rows={MEDIA_PLAN.filter((r) => r.section === "internet")} grand={TOTAL_MARKETING} tone="bg-saffron/15" />

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
              {monthlyMarketing.map((v, i) => <td key={i} className="px-2 py-2 text-right">{fmt(v)}</td>)}
              <td className="px-2 py-2 text-right">{fmt(TOTAL_MARKETING)}</td>
              <td className="px-2 py-2 text-right">100%</td>
            </tr>
          </tbody>
        </ScrollableTable>
      </Section>

      {/* === JALONS === */}
      <Section icon={<Target className="h-5 w-5" />} title="Jalons clés du projet 2025" subtitle="Chronologie opérationnelle de l'exercice">
        <Timeline jalons={JALONS} />
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-cool/10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Jalon</th>
              </tr>
            </thead>
            <tbody>
              {JALONS.map((j, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium whitespace-nowrap">{j.date}</td>
                  <td className="px-4 py-2.5">{j.label}</td>
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
   Sub-components
   ============================================================ */

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

function CanvasBlock({ icon, title, children, full }: { icon: React.ReactNode; title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`p-5 ${full ? "" : ""}`}>
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

function ESGTable({ rows, headers }: { rows: { rom: string; num: string; op: string; label: string; values: number[]; strong?: boolean; highlight?: boolean }[]; headers: string[] }) {
  const fmt = (n: number) => n === 0 ? "0,00" : n.toLocaleString("fr-MA");
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="bg-mint/40">
            <th colSpan={4} className="px-3 py-3 text-center font-display text-base font-bold">État des Soldes Intermédiaires de Gestion</th>
            {headers.map((h) => <th key={h} className="px-3 py-3 text-right font-bold">{h}</th>)}
          </tr>
          <tr className="bg-mint/20">
            <th className="px-2 py-1 text-left text-xs">N°</th>
            <th className="px-2 py-1 text-left text-xs">N°</th>
            <th className="px-2 py-1 text-center text-xs">Op</th>
            <th className="px-2 py-1 text-left text-xs">Libellé</th>
            {headers.map((h) => <th key={h} className="px-2 py-1 text-xs">&nbsp;</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-t border-border ${r.highlight ? "bg-saffron/15" : r.strong ? "bg-mint/10" : ""}`}>
              <td className={`px-2 py-1.5 text-xs ${r.strong ? "font-bold" : ""}`}>{r.rom}</td>
              <td className="px-2 py-1.5 text-xs">{r.num}</td>
              <td className="px-2 py-1.5 text-center text-xs">{r.op}</td>
              <td className={`px-2 py-1.5 ${r.strong ? "font-bold" : ""}`}>{r.label}</td>
              {r.values.map((v, j) => (
                <td key={j} className={`px-2 py-1.5 text-right tabular-nums ${r.strong ? "font-bold" : ""}`}>{fmt(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CafRow({ n, label, value, op }: { n: string; label: string; value: number; op: string }) {
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-1.5 text-xs">{n} <span className="ml-1 text-muted-foreground">{op}</span></td>
      <td className="px-3 py-1.5 text-sm">{label}</td>
      <td className="px-3 py-1.5 text-right tabular-nums">{value.toLocaleString("fr-MA")}</td>
    </tr>
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
  const fmt = (n: number) => n === 0 ? "-" : n.toLocaleString("fr-MA");
  const cls = highlight
    ? tone === "saffron" ? "bg-saffron/25 font-bold" : "bg-cool/15 font-bold"
    : subtotal ? "bg-secondary/60 font-semibold" : "";
  return (
    <tr className={`border-t border-border ${cls}`}>
      <td className={`sticky left-0 z-10 px-3 py-1.5 ${cls || "bg-card"}`}>{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-2 py-1.5 text-right tabular-nums">{fmt(v)}{v !== 0 && <span className="ml-0.5 text-[10px] text-muted-foreground">DH</span>}</td>
      ))}
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
      <td colSpan={14} className={`sticky left-0 z-10 ${tone} px-3 py-1.5 text-center text-xs font-bold`}>{label}</td>
    </tr>
  );
}

function MediaRow({ action, values, total }: { action: string; values: number[]; total: number }) {
  const sum = values.reduce((a, b) => a + b, 0);
  const fmt = (n: number) => n === 0 ? "-" : n.toLocaleString("fr-MA");
  return (
    <tr className="border-t border-border">
      <td className="sticky left-0 z-10 bg-card px-3 py-1.5">{action}</td>
      {values.map((v, i) => <td key={i} className="px-2 py-1.5 text-right tabular-nums">{fmt(v)}</td>)}
      <td className="px-2 py-1.5 text-right font-semibold tabular-nums">{fmt(sum)}</td>
      <td className="px-2 py-1.5 text-right text-xs">{total ? `${(sum / total * 100).toFixed(1)}%` : "-"}</td>
    </tr>
  );
}

function MediaSubtotal({ label, rows, grand, tone }: { label: string; rows: { values: number[] }[]; grand: number; tone: string }) {
  const monthly = Array.from({ length: 12 }, (_, m) => rows.reduce((s, r) => s + r.values[m], 0));
  const sum = monthly.reduce((a, b) => a + b, 0);
  const fmt = (n: number) => n === 0 ? "-" : n.toLocaleString("fr-MA");
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
    <div className="relative h-64 overflow-x-auto rounded-2xl border border-border bg-secondary/20 p-4">
      <div className="relative h-full min-w-[1100px]">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border" />
        {jalons.map((j, i) => {
          const x = ((i + 0.5) / jalons.length) * 100;
          const above = j.pos > 0;
          const offset = Math.abs(j.pos) * 1.5;
          return (
            <div key={i} className="absolute" style={{ left: `${x}%`, top: "50%", transform: "translateX(-50%)" }}>
              <div className="relative">
                <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-saffron bg-card" />
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={above ? { bottom: `${offset}px` } : { top: `${offset}px` }}
                >
                  <div className="mx-auto w-px bg-saffron" style={{ height: `${offset}px` }} />
                  <div className={`whitespace-nowrap text-[11px] font-semibold ${above ? "mb-1" : "mt-1"}`}>
                    <div className="text-saffron-foreground">{j.label}</div>
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
