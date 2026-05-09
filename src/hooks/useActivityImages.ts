import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getActivityImages } from "@/lib/activity-images.functions";
import { CITIES } from "@/data/cities";
import type { Activity } from "@/data/activities";

export function buildImageQuery(activity: Activity): string {
  // Per-activity override wins (best for non-obvious places like Café Hafa)
  if (activity.imageKeywords && activity.imageKeywords.trim()) {
    return activity.imageKeywords.trim();
  }
  const city = CITIES.find((c) => c.id === activity.city)?.name ?? activity.city;
  return `${activity.title} ${city} Morocco ${activity.category}`;
}

export function useActivityImages(activity: Activity) {
  const fn = useServerFn(getActivityImages);
  return useQuery({
    queryKey: ["activity-images", activity.id, activity.imageKeywords ?? ""],
    queryFn: () => fn({ data: { activityId: activity.id, query: buildImageQuery(activity) } }),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
