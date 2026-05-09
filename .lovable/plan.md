Le périmètre est très large — voici le plan structuré que je propose. Confirme (ou ajuste) avant que je code.

## 1. Images & cohérence activités
- Corriger la requête d'images pour "Visite Medina + Café Hafa" (Tanger) : forcer un mot-clé spécifique par activité (override) au lieu de la requête générique. Ajout d'un champ optionnel `imageKeywords` dans `data/activities.ts`.
- Mêmes images réelles (Pexels/Unsplash) sur les "tampons" / badges encore en dur (audit `ItineraryThumb`, badges, modales de confirmation, etc.).

## 2. Flash Deals — vraie réduction
- Ajouter `flashDeal?: { discountPct: number; until: string }` sur ~50% des activités seulement (pas toutes).
- La page `/activity/$id` :
  - Bandeau rouge "Flash Deal -X%" si l'activité en a un.
  - Prix barré + nouveau prix réellement appliqué dans `BookingDialog`.
- La page `/flash-deals` ne liste QUE les activités ayant `flashDeal`.
- Ville-aware déjà OK, on garde.

## 3. Lightning Match — sélectif
- Ajouter `lightning?: boolean` sur ~40% des activités.
- `/lightning` ne liste que celles-ci.
- Sur `/activity/$id` : badge "⚡ Lightning Match disponible" + bouton "Rejoindre le groupe" + bouton **Message** (ouvre le chat existant) si l'utilisateur a réservé.

## 4. Espace Partenaire — fiche libre
Dans **Paramètres → Fiche partenaire** ET **Espace Partenaire → Description** (mêmes données, source unique = `profiles`):
- Champs libres : nom de l'activité, ville, catégorie, description longue, prix, durée.
- Sélecteur d'images : recherche Pexels/Unsplash en direct (réutilise notre fonction serveur) → choix de 1 hero + jusqu'à 4 gallery.
- Aperçu en direct (mini-card style ActivityCard).
- Si le partenaire n'a pas encore d'activité → bouton "Créer mon activité de zéro" qui ouvre le même formulaire.
- Nouvelle table `partner_activities` (user_id, name, city, category, description, price, duration, hero_url, gallery_urls). Affichage de ces activités créées dans le dashboard partenaire (KPI, planning, historique pointent dessus).
- Suppression de l'ancien sélecteur "choisir dans une liste".

## 5. Nouvelles activités à Tanger
Ajout de 6 activités Tanger (toutes avec `imageKeywords` ciblés) :
- Balade en bateau Cap Spartel
- Visite Grottes d'Hercule + Cap Spartel
- Cours de surf à Plage Achakar
- Soirée jazz au Café Hafa
- Atelier calligraphie arabe Médina
- Excursion Chefchaouen depuis Tanger

## 6. Yasmine (chatbot)
- Garder le bouton flottant mais ajouter un **bouton CTA visible** dans le Header ("💬 Yasmine") + un dans le Hero de l'index.
- La conversation s'adapte à `activeCity` : Yasmine ouvre par "Bonjour ! Je vois que tu es à {ville}…".
- À la fin de cette session, lui faire **lister les changements** (message système ajouté à `chat.functions.ts`).

## 7. Section "ville" dans Hero/landing
La grande image hero de l'accueil doit changer selon `activeCity` (Tanger → image Tanger, Marrakech → Marrakech…). Mappage city→Pexels query.

## 8. Communication financière (page `/finance`)
Refonte complète à partir des images fournies, prévisions **2026** :
- **Soldes Intermédiaires de Gestion** (N, N+1, N+2) — tableau exact de l'image 12.
- **Plan de trésorerie 2026** (12 mois) — image 13.
- **Budget de TVA 2026** — image 14.
- **Bilans entreprise** (extraits du .docx) — nouveau bloc.
- **Hexagone Sectoriel de Porter** — radar chart (recharts) + tableau des 6 forces avec notes/explications de l'image 16.
- **Plan média & budget communication 2026** — image 17.
- **Timeline jalons projet** — image 15.
- Les blocs existants sont mis à jour avec les nouveaux chiffres.

---

## Détails techniques
- Migrations SQL : `partner_activities` (RLS owner-only write, lecture publique pour les actives), ajout colonnes `flash_deal_pct`, `is_lightning` côté front uniquement (data file, pas DB).
- Réutilisation de `getActivityImages` côté partenaire pour la recherche d'images en direct (nouvelle fn `searchImages(query)`).
- Mise à jour de `useActivityImages` pour respecter `imageKeywords` si présent.
- `BookingDialog` : prix calculé via util `getEffectivePrice(activity)`.

## Question rapide
Vu l'ampleur (≈ 8 chantiers indépendants), veux-tu que je :
- **(A)** Tout livrer en une seule passe (long, ~ beaucoup de fichiers modifiés, risque de régressions plus élevé), ou
- **(B)** Livrer par lots dans cet ordre : 1+2+3 (cohérence prix/images) → 4 (partenaire libre) → 5+7 (nouvelles activités + hero ville) → 6 (Yasmine) → 8 (finance 2026) ?

Réponds A ou B (ou ajuste le plan) et je démarre.