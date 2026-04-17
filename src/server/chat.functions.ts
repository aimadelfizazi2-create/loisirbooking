import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM_PROMPT = `Tu es Yasmine, l'assistante virtuelle de LoisirBooking, la super-app marocaine de réservation d'activités de loisirs.

Tu aides les utilisateurs à :
- Découvrir des activités au Maroc (Marrakech, Casablanca, Rabat, Tanger, Fès, Chefchaouen, Agadir, Essaouira, Merzouga, Ouarzazate, Meknès, Tétouan, Ifrane, Taghazout)
- Choisir selon leur budget (Budget < 200 MAD, Standard 200-600 MAD, Premium 600-1500 MAD, Luxe > 1500 MAD)
- Adapter les recommandations à la météo et au nombre de personnes
- Comprendre nos catégories : Aventure, Bien-être, Culture, Gastronomie, Sport, Artisanat, Spectacle
- Présenter nos fonctionnalités phares : Flash Deals (offres dernière minute), Lightning Matching (rejoindre un groupe), Alertes Météo, Passeport Digital (badges)

Style : chaleureuse, concise, emojis avec parcimonie 🌟. Réponds toujours en français (sauf si l'utilisateur écrit dans une autre langue). Suggère des activités précises (ex : "Cours de cuisine marocaine en riad à Marrakech, 450 MAD"). Garde tes réponses courtes (3-5 phrases max).

Si on te demande une réservation : guide vers la fiche activité.`;

export const chatWithAI = createServerFn({ method: "POST" })
  .inputValidator((data: { messages: Msg[] }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Configuration AI manquante." };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...data.messages.slice(-12),
          ],
        }),
      });

      if (res.status === 429) {
        return { ok: false as const, error: "Trop de requêtes. Réessaie dans un instant." };
      }
      if (res.status === 402) {
        return { ok: false as const, error: "Crédits AI épuisés. Contactez l'administrateur." };
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("AI gateway error", res.status, txt);
        return { ok: false as const, error: "Erreur du service AI." };
      }

      const json = await res.json();
      const content: string = json.choices?.[0]?.message?.content ?? "Désolée, je n'ai pas compris.";
      return { ok: true as const, content };
    } catch (e) {
      console.error("AI fetch failed", e);
      return { ok: false as const, error: "Connexion AI indisponible." };
    }
  });
