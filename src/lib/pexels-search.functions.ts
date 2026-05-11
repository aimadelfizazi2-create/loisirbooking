import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  query: z.string().min(1).max(120),
  perPage: z.number().int().min(1).max(24).optional(),
});

export type PexelsPhoto = {
  id: number;
  thumb: string;
  large: string;
  photographer: string;
};

export const searchPexels = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<{ photos: PexelsPhoto[]; error: string | null }> => {
    const key = process.env.PEXELS_API_KEY;
    if (!key) return { photos: [], error: "PEXELS_API_KEY manquant" };
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(data.query)}&per_page=${data.perPage ?? 12}&orientation=landscape`,
        { headers: { Authorization: key } }
      );
      if (!res.ok) return { photos: [], error: `Pexels ${res.status}` };
      const json: any = await res.json();
      const photos: PexelsPhoto[] = (json?.photos ?? []).map((p: any) => ({
        id: p.id,
        thumb: p.src?.medium ?? p.src?.small ?? p.src?.tiny,
        large: p.src?.large2x ?? p.src?.large ?? p.src?.original,
        photographer: p.photographer,
      })).filter((p: PexelsPhoto) => p.large && p.thumb);
      return { photos, error: null };
    } catch (e: any) {
      return { photos: [], error: e?.message ?? "Erreur réseau" };
    }
  });
