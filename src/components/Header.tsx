import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Menu, X, LogOut, LayoutDashboard, User as UserIcon, ChevronDown, Compass, Zap, MapPin, Route as RouteIcon, CloudSun, Sparkles, Briefcase, Settings, Headphones, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CityPicker } from "./CityPicker";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-loisirbooking.png";

type NavLeaf = { to: string; label: string; exact?: boolean; icon?: React.ComponentType<{ className?: string }>; desc?: string };
type NavGroup = { label: string; icon: React.ComponentType<{ className?: string }>; items: NavLeaf[] };
type NavEntry = NavLeaf | NavGroup;

const isGroup = (e: NavEntry): e is NavGroup => "items" in e;

const NAV: NavEntry[] = [
  { to: "/", label: "Accueil", exact: true, icon: Compass },
  {
    label: "Explorer",
    icon: Sparkles,
    items: [
      { to: "/activities", label: "Toutes les activités", icon: Compass, desc: "Catalogue complet filtrable" },
      { to: "/nearby", label: "Près de toi", icon: MapPin, desc: "Activités autour de ta position" },
      { to: "/itineraries", label: "Itinéraires", icon: RouteIcon, desc: "Voyages multi-villes prêts à partir" },
      { to: "/finance", label: "Communication financière", icon: FileText, desc: "Rapports financiers partenaires (CGNC)" },
    ],
  },
  {
    label: "Live",
    icon: Zap,
    items: [
      { to: "/flash-deals", label: "Flash Deals", icon: Zap, desc: "Promos jusqu'à -50%" },
      { to: "/lightning", label: "Lightning Match", icon: Sparkles, desc: "Réservations en moins d'une heure" },
      { to: "/weather", label: "Météo & Alertes", icon: CloudSun, desc: "Recommandations selon la météo" },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const { user, profile, isPartner, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  // Click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) setOpenGroup(null);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUserMenu(false);
    navigate({ to: "/auth" });
  };

  const initial = (profile?.full_name ?? user?.email ?? "?").charAt(0).toUpperCase();

  const isGroupActive = (group: NavGroup) =>
    group.items.some((it) => location.pathname === it.to || location.pathname.startsWith(it.to + "/"));

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img src={logo} alt="LoisirBooking" className="h-9 w-auto" />
          <span className="hidden font-display text-lg font-bold tracking-tight sm:inline">
            Loisir<span className="text-primary">Booking</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-4 hidden flex-1 items-center gap-1 text-sm font-medium lg:flex" ref={groupRef}>
          {NAV.map((entry) => {
            if (!isGroup(entry)) {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.to}
                  to={entry.to}
                  activeOptions={entry.exact ? { exact: true } : undefined}
                  activeProps={{ className: "bg-secondary text-primary" }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 transition hover:bg-secondary"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {entry.label}
                </Link>
              );
            }
            const GroupIcon = entry.icon;
            const active = isGroupActive(entry);
            const isOpen = openGroup === entry.label;
            return (
              <div key={entry.label} className="relative">
                <button
                  onClick={() => setOpenGroup(isOpen ? null : entry.label)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-2 transition hover:bg-secondary ${
                    active ? "bg-secondary text-primary" : ""
                  }`}
                >
                  <GroupIcon className="h-4 w-4" />
                  {entry.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-elegant">
                    {entry.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpenGroup(null)}
                          className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-secondary"
                        >
                          {ItemIcon && (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <ItemIcon className="h-4 w-4" />
                            </span>
                          )}
                          <span className="flex-1">
                            <span className="block text-sm font-semibold">{item.label}</span>
                            {item.desc && (
                              <span className="block text-xs text-muted-foreground">{item.desc}</span>
                            )}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <CityPicker />

          {/* Partner CTA — desktop only, separate from nav */}
          <Link
            to="/partner"
            activeProps={{ className: "border-primary text-primary" }}
            className="hidden h-10 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold transition hover:border-primary hover:text-primary lg:inline-flex"
          >
            <Briefcase className="h-3.5 w-3.5" />
            {isPartner ? "Espace Partenaire" : "Devenir Partenaire"}
          </Link>

          {user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex h-10 items-center gap-2 rounded-full border border-border bg-background px-1.5 pr-3 text-sm font-semibold transition hover:border-primary"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {initial}
                </span>
                <span className="hidden max-w-[100px] truncate md:inline">
                  {profile?.full_name ?? user.email?.split("@")[0]}
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 md:inline" />
              </button>
              {userMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-popover shadow-elegant">
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
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <UserIcon className="h-4 w-4" /> Mon Passeport
                    </Link>
                    {isPartner && (
                      <Link
                        to="/partner"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                      >
                        <LayoutDashboard className="h-4 w-4" /> Dashboard Partenaire
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <Settings className="h-4 w-4" /> Paramètres
                    </Link>
                    <Link
                      to="/support"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <Headphones className="h-4 w-4" /> Support
                    </Link>
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

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((entry) => {
              if (!isGroup(entry)) {
                const Icon = entry.icon;
                return (
                  <Link
                    key={entry.to}
                    to={entry.to}
                    onClick={() => setMobileOpen(false)}
                    activeOptions={entry.exact ? { exact: true } : undefined}
                    activeProps={{ className: "bg-secondary text-primary" }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-secondary"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {entry.label}
                  </Link>
                );
              }
              return (
                <div key={entry.label} className="mt-2">
                  <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {entry.label}
                  </div>
                  {entry.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        activeProps={{ className: "bg-secondary text-primary" }}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-secondary"
                      >
                        {ItemIcon && <ItemIcon className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              );
            })}

            <div className="mt-2 border-t border-border pt-2">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                activeProps={{ className: "bg-secondary text-primary" }}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-secondary"
              >
                <UserIcon className="h-4 w-4" /> Mon Passeport
              </Link>
              <Link
                to="/partner"
                onClick={() => setMobileOpen(false)}
                activeProps={{ className: "bg-secondary text-primary" }}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-secondary"
              >
                <Briefcase className="h-4 w-4" />
                {isPartner ? "Espace Partenaire" : "Devenir Partenaire"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
