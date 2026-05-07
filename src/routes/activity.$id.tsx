import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ACTIVITIES, PRICE_TIERS } from "@/data/activities";
import { CITIES } from "@/data/cities";
import { BookingDialog } from "@/components/BookingDialog";
import { Star, Clock, Users, MapPin, Shield, Check, ArrowLeft } from "lucide-react";
import { useActivityImages } from "@/hooks/useActivityImages";

export const Route = createFileRoute("/activity/$id")({
  loader: ({ params }) => {
    const activity = ACTIVITIES.find((a) => a.id === params.id);
    if (!activity) throw notFound();
    return { activity };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.activity;
    return {
      meta: [
        { title: `${a?.title ?? "Activité"} — LoisirBooking` },
        { name: "description", content: a?.short ?? "" },
        { property: "og:title", content: a?.title ?? "Activité" },
        { property: "og:description", content: a?.short ?? "" },
        { property: "og:image", content: a?.image ?? "" },
      ],
    };
  },
  component: ActivityDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl font-bold">Activité introuvable</h1>
      <Link to="/activities" className="mt-6 inline-block text-primary hover:underline">← Retour aux activités</Link>
    </div>
  ),
});

function ActivityDetail() {
  const { activity } = Route.useLoaderData();
  const city = CITIES.find((c) => c.id === activity.city);
  const tier = PRICE_TIERS.find((t) => t.id === activity.tier);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <Link to="/activities" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl shadow-elegant">
            <img src={activity.image} alt={activity.title} width={1024} height={768} className="h-auto w-full object-cover" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {city?.name}</span>
            <span>·</span>
            <span>{activity.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-saffron text-saffron" />
              <strong className="text-foreground">{activity.rating}</strong> ({activity.reviews} avis)
            </span>
          </div>

          <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {activity.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {activity.moods.map((m: string) => (
              <span key={m} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{m}</span>
            ))}
          </div>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{activity.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat icon={<Clock className="h-5 w-5" />} label="Durée" value={activity.duration} />
            <Stat icon={<Users className="h-5 w-5" />} label="Groupe max" value={`${activity.maxGroup} pers.`} />
            <Stat icon={<Shield className="h-5 w-5" />} label="Tier" value={tier?.label ?? ""} />
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">Inclus dans l'expérience</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Prestataire vérifié", "Annulation flexible", "QR Code instantané", "Paiement sécurisé 3D Secure", "Support 7j/7", "Avis post-prestation"].map((x) => (
                <li key={x} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-mint" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="text-xs uppercase text-muted-foreground">à partir de</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-primary">{activity.price}</span>
              <span className="text-sm text-muted-foreground">MAD / pers.</span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Prestataire</span>
                <span className="font-medium">{activity.partner}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Confirmation</span>
                <span className="font-medium">Instantanée</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conditions</span>
                <span className="font-medium">Annulation 48h</span>
              </div>
            </div>
            <button
              onClick={() => setBookingOpen(true)}
              className="mt-6 w-full rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
            >
              Réserver maintenant
            </button>
            <Link
              to="/lightning"
              className="mt-2 block w-full rounded-2xl border border-border bg-background py-3 text-center text-sm font-medium transition hover:border-primary"
            >
              Lightning Match — rejoindre un groupe
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              QR Code envoyé par SMS + email après paiement
            </p>
          </div>
        </aside>
      </div>

      <BookingDialog activity={activity} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs uppercase tracking-wide">{label}</span></div>
      <div className="font-display text-lg font-semibold">{value}</div>
    </div>
  );
}
