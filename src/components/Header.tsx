import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-warm shadow-soft">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Loisir<span className="text-primary">Booking</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
            Découvrir
          </Link>
          <Link to="/activities" activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
            Activités
          </Link>
          <Link to="/pro" activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
            Espace Pro
          </Link>
          <Link to="/about" activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
            À propos
          </Link>
        </nav>
        <Link
          to="/activities"
          className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 md:inline-flex"
        >
          Réserver
        </Link>
      </div>
    </header>
  );
}
