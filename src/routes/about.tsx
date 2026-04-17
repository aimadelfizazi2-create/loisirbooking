import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — LoisirBooking" },
      { name: "description", content: "Notre mission : valoriser les loisirs locaux au Maroc et soutenir les petits prestataires." },
      { property: "og:title", content: "À propos de LoisirBooking" },
      { property: "og:description", content: "Une super-app inspirée de l'Asie, ancrée au Maroc." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
      <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
        Notre <span className="italic text-primary">mission</span>
      </h1>
      <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
        LoisirBooking est née d'une conviction : les savoir-faire marocains méritent une vitrine numérique à la hauteur de leur richesse — accessible, fluide, sociale, ludique.
      </p>

      <div className="mt-12 space-y-10">
        <Block title="Une super-app, deux interfaces">
          Inspirée des super-apps asiatiques, LoisirBooking dépasse le simple rôle d'annuaire. C'est une expérience de bout en bout : de la découverte inspirante jusqu'à l'accueil personnalisé sur place.
        </Block>
        <Block title="Une technologie au service du local">
          Cloud-native, méthode Agile, conformité RGPD et PCI-DSS. Mais surtout : un outil pensé pour les artisans, guides et petites structures qui font la richesse du Maroc.
        </Block>
        <Block title="Quatre innovations majeures">
          Recherche par <strong>Mood</strong>, <strong>Lightning Matching</strong> social, <strong>Flash Deals</strong> géolocalisés, et soutien direct à <strong>l'économie locale</strong>.
        </Block>
        <Block title="Cap sur l'international">
          Après le Maroc, nous visons la Belgique, la Suisse, le Maghreb et l'Afrique francophone, puis l'Europe du Sud — partout où les loisirs locaux restent peu structurés numériquement.
        </Block>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-primary pl-6">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
