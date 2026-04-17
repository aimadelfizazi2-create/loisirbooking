import { createFileRoute } from "@tanstack/react-router";
import { Calendar, TrendingUp, Zap, Shield, BarChart3, Bell, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Espace Pro — Devenez partenaire LoisirBooking" },
      { name: "description", content: "Outil SaaS clé en main pour artisans, guides et prestataires de loisirs au Maroc. Dashboard, Flash Deals, paiement sécurisé." },
      { property: "og:title", content: "Espace Pro — LoisirBooking" },
      { property: "og:description", content: "Remplissez vos créneaux. Zéro no-show. Visibilité digitale sans effort." },
    ],
  }),
  component: ProPage,
});

function ProPage() {
  return (
    <div>
      <section className="bg-gradient-cool py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Espace Prestataires</span>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-6xl">
            Votre activité.<br />
            <span className="italic">Notre technologie.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg opacity-95">
            Un dashboard SaaS pensé pour les artisans, guides et petites structures. Aucun coût d'installation, aucune compétence technique requise.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-zellige shadow-elegant transition hover:scale-105">
            Devenir partenaire <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Tout ce qu'il faut pour grandir</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Calendar />} title="Planning intelligent" desc="Visualisez et gérez tous vos créneaux en un coup d'œil." />
          <Feature icon={<Zap />} title="Flash Deals automatisés" desc="Yield management : vos créneaux invendus sont monétisés tout seuls." />
          <Feature icon={<TrendingUp />} title="Suivi des revenus" desc="Reporting clair, prévisions, exports comptables." />
          <Feature icon={<Bell />} title="Notifications temps réel" desc="Réservations, annulations, avis : restez toujours connecté." />
          <Feature icon={<Shield />} title="Paiements sécurisés" desc="PCI-DSS, 3D Secure. Reversement hebdomadaire." />
          <Feature icon={<BarChart3 />} title="Analytics avancés" desc="Comprenez vos clients, optimisez vos offres." />
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3 md:px-8">
          <Stat n="0%" label="Frais d'installation" />
          <Stat n="48h" label="Mise en ligne" />
          <Stat n="< 5%" label="Commission par réservation" />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zellige/10 text-zellige">{icon}</div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-5xl font-bold text-primary md:text-6xl">{n}</div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
