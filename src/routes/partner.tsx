import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVITIES } from "@/data/activities";
import {
  Calendar, TrendingUp, Zap, Shield, BarChart3, Bell, ArrowRight,
  Users, DollarSign, Star, Loader2, Plus, CheckCircle2, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Espace Partenaire — LoisirBooking" },
      { name: "description", content: "Dashboard SaaS pour artisans, guides et prestataires de loisirs au Maroc. Planning, Flash Deals, analytics." },
    ],
  }),
  component: PartnerPage,
});

function PartnerPage() {
  const { user, profile, isPartner, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!isPartner) return <PartnerLanding userEmail={user?.email} />;
  return <PartnerDashboard partnerName={profile?.partner_business_name ?? "Partenaire"} activityId={profile?.partner_activity_id} />;
}

/* ---------------- LANDING (clients curieux) ---------------- */

function PartnerLanding({ userEmail }: { userEmail?: string }) {
  return (
    <div>
      <section className="bg-gradient-cool py-16 text-primary-foreground md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Espace Partenaires</span>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-6xl">
            Votre activité.<br /><span className="italic">Notre technologie.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg opacity-95">
            Un dashboard SaaS pensé pour les artisans, guides et petites structures. Aucun coût d'installation, aucune compétence technique requise.
          </p>
          <div className="mt-8 inline-flex flex-col items-center gap-2 rounded-2xl bg-white/15 px-6 py-4 backdrop-blur">
            <p className="text-sm">Vous avez une activité à proposer ?</p>
            <p className="text-xs opacity-80">Contactez-nous : <strong>partner@loisirbooking.ma</strong></p>
            {userEmail && (
              <p className="mt-1 text-xs opacity-70">Compte actuel : {userEmail}</p>
            )}
          </div>
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

      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
        <div className="rounded-3xl border border-saffron/40 bg-saffron/10 p-8">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-saffron" />
          <h3 className="font-display text-2xl font-bold">Démo Partenaire disponible</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous avec le compte démo <strong>partner.tanger@demo.lb / demo1234</strong> pour explorer le dashboard complet de "Tanger Discovery".
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------------- DASHBOARD (partenaire connecté) ---------------- */

type Booking = {
  id: string; client_name: string; booking_date: string; booking_time: string;
  guests: number; amount_mad: number; status: string;
};
type Slot = {
  id: string; slot_date: string; slot_time: string; capacity: number;
  booked: number; price_mad: number; is_flash_deal: boolean; flash_discount_pct: number | null;
};

function PartnerDashboard({ partnerName, activityId }: { partnerName: string; activityId: string | null | undefined }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const activity = ACTIVITIES.find((x) => x.id === activityId);

  const load = async () => {
    setLoading(true);
    const [{ data: b }, { data: s }] = await Promise.all([
      supabase.from("partner_bookings").select("*").order("booking_date", { ascending: false }),
      supabase.from("partner_slots").select("*").order("slot_date", { ascending: true }).order("slot_time", { ascending: true }),
    ]);
    setBookings((b ?? []) as Booking[]);
    setSlots((s ?? []) as Slot[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const totalRevenue = bookings.reduce((s, b) => s + b.amount_mad, 0);
  const totalGuests = bookings.reduce((s, b) => s + b.guests, 0);
  const flashCount = slots.filter((s) => s.is_flash_deal).length;
  const occupancy = slots.length
    ? Math.round((slots.reduce((s, x) => s + x.booked, 0) / slots.reduce((s, x) => s + x.capacity, 0)) * 100)
    : 0;

  const toggleFlash = async (slot: Slot) => {
    await supabase.from("partner_slots").update({
      is_flash_deal: !slot.is_flash_deal,
      flash_discount_pct: !slot.is_flash_deal ? 30 : 0,
    }).eq("id", slot.id);
    load();
  };

  const addSlot = async () => {
    const date = new Date(); date.setDate(date.getDate() + 7);
    await supabase.from("partner_slots").insert({
      partner_user_id: (await supabase.auth.getUser()).data.user!.id,
      activity_id: activityId ?? "tng-1",
      slot_date: date.toISOString().slice(0, 10),
      slot_time: "10:00",
      capacity: 12,
      booked: 0,
      price_mad: activity?.price ?? 350,
    });
    load();
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="bg-secondary/20 pb-16">
      {/* Header */}
      <section className="bg-gradient-cool py-10 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Dashboard Partenaire</span>
              <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{partnerName}</h1>
              {activity && (
                <p className="mt-1 text-sm opacity-90">📍 {activity.title} • {activity.city}</p>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
              <CheckCircle2 className="h-4 w-4" /> Compte actif
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="mx-auto -mt-6 max-w-7xl px-4 md:px-8">
        <div className="grid gap-3 md:grid-cols-4">
          <Kpi icon={<DollarSign />} label="Revenus 30j" value={`${totalRevenue.toLocaleString()} MAD`} accent="text-mint-foreground" bg="bg-mint/30" />
          <Kpi icon={<Users />} label="Clients accueillis" value={String(totalGuests)} accent="text-primary" bg="bg-primary/10" />
          <Kpi icon={<TrendingUp />} label="Taux remplissage" value={`${occupancy}%`} accent="text-saffron-foreground" bg="bg-saffron/20" />
          <Kpi icon={<Zap />} label="Flash Deals actifs" value={String(flashCount)} accent="text-zellige" bg="bg-zellige/15" />
        </div>
      </section>

      {/* Planning */}
      <section className="mx-auto mt-10 max-w-7xl px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Planning intelligent</h2>
            <p className="text-sm text-muted-foreground">Activez Flash Deal sur un créneau invendu pour booster les ventes.</p>
          </div>
          <button
            onClick={addSlot}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Ajouter un créneau
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Heure</th>
                <th className="px-4 py-3">Réservations</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Flash Deal</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Aucun créneau. Cliquez sur "Ajouter".</td></tr>
              )}
              {slots.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{new Date(s.slot_date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</td>
                  <td className="px-4 py-3">{s.slot_time.slice(0, 5)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${(s.booked / s.capacity) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium">{s.booked}/{s.capacity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {s.is_flash_deal && s.flash_discount_pct ? (
                      <span className="text-zellige">{Math.round(s.price_mad * (1 - s.flash_discount_pct / 100))} MAD <s className="ml-1 text-xs font-normal text-muted-foreground">{s.price_mad}</s></span>
                    ) : (
                      <span>{s.price_mad} MAD</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {s.is_flash_deal ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zellige/15 px-2 py-0.5 text-[11px] font-bold text-zellige"><Zap className="h-3 w-3" />-{s.flash_discount_pct}%</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFlash(s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        s.is_flash_deal ? "bg-secondary text-foreground hover:bg-secondary/70" : "bg-zellige text-white hover:opacity-90"
                      }`}
                    >
                      {s.is_flash_deal ? "Désactiver" : "Activer Flash"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Réservations + Analytics */}
      <section className="mx-auto mt-10 grid max-w-7xl gap-6 px-4 md:grid-cols-3 md:px-8">
        <div className="md:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Réservations récentes</h2>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          {bookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aucune réservation pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {bookings.slice(0, 8).map((b) => (
                <li key={b.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-semibold">{b.client_name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(b.booking_date).toLocaleDateString("fr-FR")} • {b.booking_time.slice(0, 5)} • {b.guests} pers.</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{b.amount_mad} MAD</div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-mint-foreground">
                      <CheckCircle2 className="h-3 w-3" /> {b.status}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold">Avis clients</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold">{activity?.rating ?? 4.8}</span>
              <Star className="h-5 w-5 fill-saffron text-saffron" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Sur {activity?.reviews ?? 0} avis</p>
          </div>
          <div className="rounded-3xl border border-saffron/30 bg-saffron/10 p-6">
            <Shield className="h-5 w-5 text-saffron" />
            <h3 className="mt-2 font-display text-base font-bold">Reversement</h3>
            <p className="mt-1 text-xs text-muted-foreground">Prochain virement : <strong>vendredi</strong></p>
            <p className="mt-2 text-2xl font-bold text-saffron-foreground">{Math.round(totalRevenue * 0.95).toLocaleString()} MAD</p>
            <p className="text-[11px] text-muted-foreground">après commission 5%</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function Kpi({ icon, label, value, accent, bg }: { icon: React.ReactNode; label: string; value: string; accent: string; bg: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl ${bg} ${accent}`}>{icon}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
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
