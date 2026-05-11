import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { searchPexels, type PexelsPhoto } from "@/lib/pexels-search.functions";
import { CITIES } from "@/data/cities";
import { User as UserIcon, Building2, MapPin, Save, Loader2, CheckCircle2, Briefcase, Search, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Paramètres du compte — LoisirBooking" },
      { name: "description", content: "Modifiez vos informations personnelles, votre ville préférée et — si vous êtes partenaire — votre fiche activité libre." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, profile, isPartner, loading } = useAuth();
  const navigate = useNavigate();
  const pexels = useServerFn(searchPexels);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [priceMad, setPriceMad] = useState<string>("");
  const [duration, setDuration] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pexels search state
  const [pexelsQuery, setPexelsQuery] = useState("");
  const [pexelsLoading, setPexelsLoading] = useState(false);
  const [pexelsPhotos, setPexelsPhotos] = useState<PexelsPhoto[]>([]);
  const [pexelsError, setPexelsError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setCity(profile.city ?? "tanger");
      setAvatarUrl(profile.avatar_url ?? "");
      setBusinessName((profile as any).partner_business_name ?? "");
      setDescription((profile as any).partner_description ?? "");
      setPriceMad(
        (profile as any).partner_price_mad != null
          ? String((profile as any).partner_price_mad)
          : ""
      );
      setDuration((profile as any).partner_duration ?? "");
      setHeroUrl((profile as any).partner_hero_url ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const runPexels = async () => {
    if (!pexelsQuery.trim()) return;
    setPexelsLoading(true);
    setPexelsError(null);
    const res = await pexels({ data: { query: pexelsQuery.trim(), perPage: 12 } });
    setPexelsPhotos(res.photos);
    if (res.error) setPexelsError(res.error);
    setPexelsLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    const updates: Record<string, unknown> = {
      full_name: fullName.trim() || null,
      city: city || null,
      avatar_url: avatarUrl.trim() || null,
    };
    if (isPartner) {
      updates.partner_business_name = businessName.trim() || null;
      updates.partner_description = description.trim() || null;
      updates.partner_price_mad = priceMad ? parseInt(priceMad, 10) : null;
      updates.partner_duration = duration.trim() || null;
      updates.partner_hero_url = heroUrl.trim() || null;
    }

    const { error: err } = await supabase
      .from("profiles")
      .update(updates as any)
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
          Vos informations personnelles{isPartner ? " et votre fiche partenaire libre" : ""}.
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

      {/* Partner section — free-form */}
      {isPartner && (
        <section className="mt-6 rounded-3xl border border-saffron/30 bg-saffron/5 p-6 shadow-soft md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-saffron-foreground" />
            <h2 className="font-display text-xl font-bold">Fiche partenaire libre</h2>
          </div>

          <div className="grid gap-4">
            <Field label="Nom de votre activité" icon={<Building2 className="h-4 w-4" />}>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex. Atelier de zellige à Fès"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </Field>

            <Field label="Description" hint="Décrivez votre expérience en quelques phrases">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Initiez-vous à l'art ancestral du zellige dans notre atelier familial..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prix (MAD / personne)">
                <input
                  type="number"
                  min={0}
                  value={priceMad}
                  onChange={(e) => setPriceMad(e.target.value)}
                  placeholder="350"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Durée">
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="3h"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </Field>
            </div>

            {/* Pexels image picker */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Image de couverture</span>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={pexelsQuery}
                  onChange={(e) => setPexelsQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), runPexels())}
                  placeholder="ex. zellige fès atelier"
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={runPexels}
                  disabled={pexelsLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {pexelsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Rechercher
                </button>
              </div>
              {pexelsError && (
                <div className="mt-2 text-xs text-destructive">{pexelsError}</div>
              )}
              {pexelsPhotos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {pexelsPhotos.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setHeroUrl(p.large)}
                      className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${
                        heroUrl === p.large ? "border-primary" : "border-transparent hover:border-primary/40"
                      }`}
                      title={p.photographer}
                    >
                      <img src={p.thumb} alt={p.photographer} className="h-full w-full object-cover" loading="lazy" />
                      {heroUrl === p.large && (
                        <span className="absolute inset-0 flex items-center justify-center bg-primary/30">
                          <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <Field label="URL de l'image (modifiable)" hint="Ou collez un lien direct">
                <input
                  type="url"
                  value={heroUrl}
                  onChange={(e) => setHeroUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </Field>
            </div>

            {/* Preview */}
            {(businessName || description || heroUrl) && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aperçu de votre fiche</div>
                <div className="mt-3 flex gap-4">
                  {heroUrl ? (
                    <img src={heroUrl} alt={businessName} className="h-24 w-24 flex-shrink-0 rounded-xl object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-display font-bold">{businessName || "Sans nom"}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {CITIES.find((c) => c.id === city)?.name}
                      {duration && <> · {duration}</>}
                    </div>
                    {description && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{description}</p>
                    )}
                    {priceMad && (
                      <div className="mt-1.5 text-sm font-semibold text-primary">
                        {priceMad} MAD <span className="text-xs font-normal text-muted-foreground">/ pers.</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Gérez vos créneaux depuis le{" "}
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
