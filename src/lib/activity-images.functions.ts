import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const InputSchema = z.object({
  activityId: z.string().min(1).max(120),
  query: z.string().min(1).max(200),
});

type ImageResult = {
  hero_url: string;
  gallery_urls: string[];
  source: "pexels" | "unsplash" | "fallback";
};

const FALLBACK: ImageResult = {
  hero_url: "https://images.pexels.com/photos/4502973/pexels-photo-4502973.jpeg?auto=compress&w=1600",
  gallery_urls: [
    "https://images.pexels.com/photos/4502973/pexels-photo-4502973.jpeg?auto=compress&w=1200",
    "https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&w=1200",
    "https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&w=1200",
    "https://images.pexels.com/photos/3290070/pexels-photo-3290070.jpeg?auto=compress&w=1200",
  ],
  source: "fallback",
};

async function fetchPexels(query: string): Promise<ImageResult | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`,
      { headers: { Authorization: key } }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    const photos: any[] = data?.photos ?? [];
    if (photos.length === 0) return null;
    const urls = photos.map((p) => p.src?.large2x || p.src?.large || p.src?.original).filter(Boolean);
    if (urls.length === 0) return null;
    return { hero_url: urls[0], gallery_urls: urls.slice(1, 6), source: "pexels" };
  } catch {
    return null;
  }
}

async function fetchUnsplash(query: string): Promise<ImageResult | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    const results: any[] = data?.results ?? [];
    if (results.length === 0) return null;
    const urls = results.map((p) => p.urls?.regular || p.urls?.full).filter(Boolean);
    if (urls.length === 0) return null;
    return { hero_url: urls[0], gallery_urls: urls.slice(1, 6), source: "unsplash" };
  } catch {
    return null;
  }
}

export const getActivityImages = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Cache lookup
    const { data: cached } = await supabaseAdmin
      .from("activity_images")
      .select("hero_url, gallery_urls, source")
      .eq("activity_id", data.activityId)
      .maybeSingle();
    if (cached) {
      return {
        hero_url: cached.hero_url as string,
        gallery_urls: (cached.gallery_urls as string[]) ?? [],
        source: cached.source as ImageResult["source"],
      };
    }

    // 2. Pexels → Unsplash → fallback
    const result =
      (await fetchPexels(data.query)) ||
      (await fetchUnsplash(data.query)) ||
      FALLBACK;

    // 3. Persist (ignore errors silently)
    if (result.source !== "fallback") {
      await supabaseAdmin.from("activity_images").upsert(
        {
          activity_id: data.activityId,
          query: data.query,
          hero_url: result.hero_url,
          gallery_urls: result.gallery_urls,
          source: result.source,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "activity_id" }
      );
    }

    return result;
  });
