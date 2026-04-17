import { createFileRoute } from "@tanstack/react-router";
import { FilterBar } from "@/components/FilterBar";
import { MoodPicker } from "@/components/MoodPicker";
import { ActivitiesGrid } from "@/components/ActivitiesGrid";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Toutes les activités au Maroc — LoisirBooking" },
      { name: "description", content: "Plus de 50 activités à réserver au Maroc : aventure, bien-être, culture, gastronomie." },
      { property: "og:title", content: "Activités de loisirs au Maroc — LoisirBooking" },
      { property: "og:description", content: "Filtrez par ville, budget, nombre de personnes et humeur." },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Toutes les <span className="italic text-primary">expériences</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Trouvez l'activité parfaite parmi plus de 50 expériences vérifiées à travers le Maroc.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <FilterBar />
        <MoodPicker />
      </div>

      <ActivitiesGrid />
    </div>
  );
}
