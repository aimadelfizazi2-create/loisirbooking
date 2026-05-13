import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Users, Clock, MapPin, Zap, TrendingDown } from "lucide-react";
import { type Activity, PRICE_TIERS, getEffectivePrice } from "@/data/activities";
import { CITIES } from "@/data/cities";
import { useActivityImages } from "@/hooks/useActivityImages";

const tierStyles: Record<Activity["tier"], string> = {
  budget: "bg-mint/15 text-foreground border-mint/40",
  standard: "bg-zellige/10 text-foreground border-zellige/30",
  premium: "bg-clay/10 text-clay border-clay/30",
  luxe: "bg-saffron/20 text-foreground border-saffron/50",
};

export function ActivityCard({ activity }: { activity: Activity }) {
  const city = CITIES.find((c) => c.id === activity.city);
  const tier = PRICE_TIERS.find((t) => t.id === activity.tier);
  const { data: images } = useActivityImages(activity);
  const heroSrc = images?.hero_url ?? activity.image;

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
    <Link
      to="/activity/$id"
      params={{ id: activity.id }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition duration-500 hover:shadow-elegant"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={heroSrc}
          alt={activity.title}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {activity.flashDeal && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-1 text-[11px] font-bold text-destructive-foreground shadow">
              <TrendingDown className="h-3 w-3" /> -{activity.flashDeal.discountPct}%
            </span>
          )}
          {activity.lightning && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zellige px-2.5 py-1 text-[11px] font-bold text-white shadow">
              <Zap className="h-3 w-3" /> Lightning
            </span>
          )}
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${tierStyles[activity.tier]}`}>
            {tier?.label}
          </span>
          {activity.weather === "indoor" && (
            <span className="rounded-full border border-white/40 bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              Intérieur
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
          <Star className="h-3 w-3 fill-saffron text-saffron" />
          {activity.rating}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {city?.name} · {activity.category}
        </div>
        <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
          {activity.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{activity.short}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          {activity.moods.slice(0, 2).map((m) => (
            <span key={m} className="text-[10px] font-medium text-primary">
              {m}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-end justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {activity.duration}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> ≤{activity.maxGroup}</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-muted-foreground">à partir de</div>
            {activity.flashDeal ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground line-through">{activity.price}</span>
                <span className="font-display text-xl font-bold text-destructive">
                  {getEffectivePrice(activity)} <span className="text-xs font-normal">MAD</span>
                </span>
              </div>
            ) : (
              <div className="font-display text-xl font-bold text-primary">
                {activity.price} <span className="text-xs font-normal">MAD</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
