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

const FALLBACK_POOL = [
  "https://images.pexels.com/photos/4502973/pexels-photo-4502973.jpeg?auto=compress&w=1600",
  "https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&w=1600",
  "https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&w=1600",
  "https://images.pexels.com/photos/3290070/pexels-photo-3290070.jpeg?auto=compress&w=1600",
  "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&w=1600",
  "https://images.pexels.com/photos/2245436/pexels-photo-2245436.jpeg?auto=compress&w=1600",
];

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

async function fetchPexels(query: string): Promise<string[] | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`,
      { headers: { Authorization: key } }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    const photos: any[] = data?.photos ?? [];
    const urls = photos.map((p) => p.src?.large2x || p.src?.large || p.src?.original).filter(Boolean);
    return urls.length ? urls : null;
  } catch {
    return null;
  }
}

async function fetchUnsplash(query: string): Promise<string[] | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    const results: any[] = data?.results ?? [];
    const urls = results.map((p) => p.urls?.regular || p.urls?.full).filter(Boolean);
    return urls.length ? urls : null;
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

    // 2. Fetch a pool of candidates (Pexels first, then Unsplash)
    let pool: string[] | null = null;
    let source: ImageResult["source"] = "fallback";
    const p = await fetchPexels(data.query);
    if (p) {
      pool = p;
      source = "pexels";
    } else {
      const u = await fetchUnsplash(data.query);
      if (u) {
        pool = u;
        source = "unsplash";
      }
    }

    if (!pool || pool.length === 0) {
      const idx = hashId(data.activityId) % FALLBACK_POOL.length;
      const ordered = [...FALLBACK_POOL.slice(idx), ...FALLBACK_POOL.slice(0, idx)];
      return {
        hero_url: ordered[0],
        gallery_urls: ordered.slice(1, 5),
        source: "fallback" as const,
      };
    }

    // 3. Avoid duplicates: fetch already used hero_urls and pick a unique one
    const { data: used } = await supabaseAdmin
      .from("activity_images")
      .select("hero_url");
    const usedSet = new Set((used ?? []).map((r: any) => r.hero_url));

    const offset = hashId(data.activityId) % pool.length;
    const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
    const hero =
      rotated.find((url) => !usedSet.has(url)) ?? rotated[0];

    const gallery = rotated.filter((u) => u !== hero).slice(0, 5);

    const result: ImageResult = { hero_url: hero, gallery_urls: gallery, source };

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

    return result;
  });
