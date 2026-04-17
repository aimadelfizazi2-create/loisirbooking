import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import logo from "@/assets/logo-loisirbooking.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — LoisirBooking" },
      { name: "description", content: "Connectez-vous ou créez un compte LoisirBooking pour réserver vos activités au Maroc." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, fullName);
    setSubmitting(false);
    if (res.error) {
      setError(res.error.includes("already") ? "Ce compte existe déjà. Connectez-vous." : res.error);
    } else {
      navigate({ to: "/" });
    }
  };

  const fillDemo = (kind: "client" | "partner") => {
    if (kind === "client") {
      setEmail("client.tanger@demo.lb");
      setPassword("demo1234");
    } else {
      setEmail("partner.tanger@demo.lb");
      setPassword("demo1234");
    }
    setMode("signin");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-secondary/30 via-background to-mint/10 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-3">
          <img src={logo} alt="LoisirBooking" className="h-14 w-auto" />
        </Link>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
          <h1 className="font-display text-2xl font-bold">
            {mode === "signin" ? "Bon retour 👋" : "Créer un compte"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Connectez-vous pour accéder à vos réservations"
              : "Rejoignez la communauté LoisirBooking"}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (6+ caractères)"
                className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm">
            {mode === "signin" ? (
              <button onClick={() => setMode("signup")} className="text-primary hover:underline">
                Pas encore de compte ? S'inscrire
              </button>
            ) : (
              <button onClick={() => setMode("signin")} className="text-primary hover:underline">
                Déjà inscrit ? Se connecter
              </button>
            )}
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Comptes de démonstration
            </p>
            <div className="mt-3 grid gap-2">
              <button
                onClick={() => fillDemo("client")}
                type="button"
                className="rounded-xl border border-border bg-secondary/50 px-3 py-2 text-left text-xs hover:border-primary"
              >
                <div className="font-semibold">👤 Client — Yasmine (Tanger)</div>
                <div className="text-muted-foreground">client.tanger@demo.lb / demo1234</div>
              </button>
              <button
                onClick={() => fillDemo("partner")}
                type="button"
                className="rounded-xl border border-saffron/40 bg-saffron/10 px-3 py-2 text-left text-xs hover:border-saffron"
              >
                <div className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="h-3 w-3" /> Partenaire — Tanger Discovery
                </div>
                <div className="text-muted-foreground">partner.tanger@demo.lb / demo1234</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
