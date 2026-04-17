import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { CityPicker } from "./CityPicker";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-loisirbooking.png";

const baseNav: { to: string; label: string; exact?: boolean }[] = [
  { to: "/", label: "Découvrir", exact: true },
  { to: "/activities", label: "Activités" },
  { to: "/nearby", label: "Près de toi" },
  { to: "/itineraries", label: "Itinéraires" },
  { to: "/flash-deals", label: "Flash Deals" },
  { to: "/lightning", label: "Lightning" },
  { to: "/weather", label: "Météo" },
  { to: "/profile", label: "Passeport" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, isPartner, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = isPartner
    ? [...baseNav, { to: "/partner", label: "Espace Partenaire" }]
    : [...baseNav, { to: "/partner", label: "Devenir Partenaire" }];

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    navigate({ to: "/auth" });
  };

  const initial = (profile?.full_name ?? user?.email ?? "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={logo} alt="LoisirBooking" className="h-10 w-auto" />
          <span className="hidden font-display text-lg font-bold tracking-tight sm:inline">
            Loisir<span className="text-primary">Booking</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-primary" }}
              className="transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CityPicker />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 items-center gap-2 rounded-full border border-border bg-background px-2 pr-3 text-sm font-semibold transition hover:border-primary"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {initial}
                </span>
                <span className="hidden max-w-[100px] truncate sm:inline">
                  {profile?.full_name ?? user.email?.split("@")[0]}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-border bg-popover shadow-elegant">
                  <div className="border-b border-border bg-secondary/40 px-4 py-3">
                    <div className="text-xs text-muted-foreground">Connecté en tant que</div>
                    <div className="truncate text-sm font-semibold">{user.email}</div>
                    {isPartner && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-saffron/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-saffron-foreground">
                        Partenaire
                      </div>
                    )}
                  </div>
                  <div className="p-1">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <UserIcon className="h-4 w-4" /> Mon Passeport
                    </Link>
                    {isPartner && (
                      <Link
                        to="/partner"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard Partenaire
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" /> Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 md:inline-flex"
            >
              Connexion
            </Link>
          )}

          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={item.exact ? { exact: true } : undefined}
                activeProps={{ className: "text-primary" }}
                className="rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
