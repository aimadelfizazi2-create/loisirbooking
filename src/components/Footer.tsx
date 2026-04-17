import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <h3 className="font-display text-2xl font-bold">
            Loisir<span className="text-primary">Booking</span>
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            La super-app marocaine des loisirs locaux. Siège social à Tanger.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Explorer</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/activities" className="hover:text-primary">Toutes les activités</Link></li>
            <li><Link to="/" className="hover:text-primary">Recherche par mood</Link></li>
            <li><Link to="/about" className="hover:text-primary">Notre mission</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Partenaires</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/partner" className="hover:text-primary">Devenir partenaire</Link></li>
            <li><Link to="/partner" className="hover:text-primary">Dashboard B2B</Link></li>
            <li><Link to="/partner" className="hover:text-primary">Flash Deals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Légal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Conformité RGPD</li>
            <li>Paiements PCI-DSS</li>
            <li>Code du tourisme</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LoisirBooking — Fait avec 🧡 au Maroc
      </div>
    </footer>
  );
}
