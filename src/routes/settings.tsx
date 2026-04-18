import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVITIES } from "@/data/activities";
import { CITIES } from "@/data/cities";
import { User as UserIcon, Building2, MapPin, Save, Loader2, CheckCircle2, Briefcase } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Paramètres du compte — LoisirBooking" },
      { name: "description", content: "Modifiez vos informations personnelles, votre ville préférée et — si vous êtes partenaire — votre fiche activité." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, profile, isPartner, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [activityId, setActivityId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setCity(profile.city ?? "tanger");
      setAvatarUrl(profile.avatar_url ?? "");
      setBusinessName(profile.partner_business_name ?? "");
      setActivityId(profile.partner_activity_id ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const partnerActivity = ACTIVITIES.find((a) => a.id === activityId);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    const updates: {
      full_name: string | null;
      city: string | null;
      avatar_url: string | null;
      partner_business_name?: string | null;
      partner_activity_id?: string | null;
    } = {
      full_name: fullName.trim() || null,
      city: city || null,
      avatar_url: avatarUrl.trim() || null,
    };
    if (isPartner) {
      updates.partner_business_name = businessName.trim() || null;
      updates.partner_activity_id = activityId || null;
    }

    const { error: err } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Compte</div>
        <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">Paramètres</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vos informations personnelles{isPartner ? " et votre fiche partenaire" : ""}.
        </p>
      </div>

      {/* Account section */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold">Profil personnel</h2>
        </div>

        <div className="grid gap-4">
          <Field label="Email" hint="Lecture seule">
            <input
              type="email"
              value={user.email ?? ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm text-muted-foreground"
            />
          </Field>

          <Field label="Nom complet">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Yasmine Bennani"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </Field>

          <Field label="Ville préférée">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="URL de l'avatar" hint="Lien vers une image (optionnel)">
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </Field>
        </div>
      </section>

      {/* Partner section */}
      {isPartner && (
        <section className="mt-6 rounded-3xl border border-saffron/30 bg-saffron/5 p-6 shadow-soft md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-saffron-foreground" />
            <h2 className="font-display text-xl font-bold">Fiche partenaire</h2>
          </div>

          <div className="grid gap-4">
            <Field label="Nom de l'activité / structure" icon={<Building2 className="h-4 w-4" />}>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Tanger Discovery"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </Field>

            <Field label="Activité gérée">
              <select
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">— Aucune —</option>
                {ACTIVITIES.map((a) => (
                  <option key={a.id} value={a.id}>{a.title} · {a.city}</option>
                ))}
              </select>
            </Field>

            {partnerActivity && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aperçu de votre fiche</div>
                <div className="mt-3 flex gap-4">
                  <img src={partnerActivity.image} alt={partnerActivity.title} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-bold">{partnerActivity.title}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {CITIES.find((c) => c.id === partnerActivity.city)?.name} · {partnerActivity.duration}
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-primary">
                      {partnerActivity.price} MAD <span className="text-xs font-normal text-muted-foreground">/ pers.</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Le détail des créneaux et tarifs se modifie depuis le{" "}
                  <Link to="/partner" className="text-primary hover:underline">Dashboard Partenaire</Link>.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Save bar */}
      <div className="sticky bottom-4 mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-elegant backdrop-blur">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-mint-foreground">
            <CheckCircle2 className="h-4 w-4" /> Modifications enregistrées
          </span>
        )}
        {error && <span className="text-sm text-destructive">{error}</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          {icon}
          {label}
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
