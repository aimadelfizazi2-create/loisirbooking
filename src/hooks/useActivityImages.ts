import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getActivityImages } from "@/lib/activity-images.functions";
import { CITIES } from "@/data/cities";
import type { Activity } from "@/data/activities";

export function buildImageQuery(activity: Activity): string {
  const city = CITIES.find((c) => c.id === activity.city)?.name ?? activity.city;
  // Optimized: title + city + Morocco + category
  return `${activity.title} ${city} Morocco ${activity.category}`;
}

export function useActivityImages(activity: Activity) {
  const fn = useServerFn(getActivityImages);
  return useQuery({
    queryKey: ["activity-images", activity.id],
    queryFn: () => fn({ data: { activityId: activity.id, query: buildImageQuery(activity) } }),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    gcTime: 1000 * 60 * 60 * 24,
  });
}
