import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-chefchaouen.jpg";
import { FilterBar } from "@/components/FilterBar";
import { MoodPicker } from "@/components/MoodPicker";
import { ActivitiesGrid } from "@/components/ActivitiesGrid";
import { ArrowRight, MapPin, Sparkles, Zap, Users, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LoisirBooking — Vivez le Maroc autrement" },
      { name: "description", content: "Recommandations contextuelles, réservation instantanée, prestataires vérifiés. La super-app des loisirs au Maroc." },
      { property: "og:title", content: "LoisirBooking — Vivez le Maroc autrement" },
      { property: "og:description", content: "Recommandations contextuelles selon météo, position et humeur. +50 activités au Maroc." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Chefchaouen au coucher du soleil"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-zellige/50 to-foreground/80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
          <div className="max-w-3xl text-primary-foreground animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Super-app marocaine des loisirs
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl text-balance">
              Le Maroc se vit.<br />
              <span className="italic text-saffron">Réservez l'instant.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/90 md:text-xl">
              De Chefchaouen aux dunes de Merzouga : découvrez +50 expériences locales, recommandées en temps réel selon votre humeur, la météo et votre position.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/activities"
                className="inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 font-semibold text-foreground shadow-elegant transition hover:scale-105"
              >
                Explorer les activités <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pro"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Je suis prestataire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 md:px-8">
        <FilterBar />
      </section>

      {/* Mood section */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Quelle est votre <span className="italic text-primary">humeur</span> ?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Notre algorithme contextuel sélectionne pour vous, selon le moment.
          </p>
        </div>
        <MoodPicker />
      </section>

      {/* Featured grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Sélection du moment</h2>
            <p className="mt-2 text-muted-foreground">Adaptée à votre position et à la météo en temps réel.</p>
          </div>
          <Link to="/activities" className="hidden text-sm font-semibold text-primary hover:underline md:inline">
            Voir tout →
          </Link>
        </div>
        <ActivitiesGrid limit={9} />
        <div className="mt-8 text-center md:hidden">
          <Link to="/activities" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Voir toutes les activités
          </Link>
        </div>
      </section>

      {/* Innovation pillars */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Nos 4 innovations</span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
              Bien plus qu'une plateforme de réservation
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Pillar icon={<Sparkles className="h-6 w-6" />} title="Recherche par Mood" desc="Météo + géoloc + humeur = la bonne activité au bon moment." />
            <Pillar icon={<Users className="h-6 w-6" />} title="Lightning Matching" desc="Rejoignez ou créez un groupe éphémère pour vivre l'expérience à plusieurs." />
            <Pillar icon={<Zap className="h-6 w-6" />} title="Flash Deals géolocalisés" desc="Yield management automatisé : profitez des créneaux de dernière minute." />
            <Pillar icon={<Shield className="h-6 w-6" />} title="Prestataires vérifiés" desc="Licences, assurances, qualité : chaque partenaire est contrôlé." />
          </div>
        </div>
      </section>

      {/* CTA Pro */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-warm p-10 text-primary-foreground md:p-16">
          <div className="pattern-zellige absolute inset-0" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-5xl">Vous êtes artisan, guide, prestataire ?</h2>
              <p className="mt-4 text-lg opacity-95">
                Remplissez vos créneaux creux. Zéro no-show. Tableau de bord SaaS, alertes Flash Deal, paiement sécurisé.
              </p>
            </div>
            <div className="flex justify-start md:justify-end">
              <Link
                to="/pro"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-primary shadow-soft transition hover:scale-105"
              >
                Devenir partenaire <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Pillar({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:shadow-elegant">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
