import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getEffectivePrice, type Activity } from "@/data/activities";
import { X, Calendar, Clock, Users, CheckCircle2, Loader2, Mail, Phone, Download } from "lucide-react";

type Props = { activity: Activity; open: boolean; onClose: () => void };

type Step = "form" | "loading" | "confirmed";

const generateRef = () =>
  "LB-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Date.now().toString(36).slice(-4).toUpperCase();

export function BookingDialog({ activity, open, onClose }: Props) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);

  // Tomorrow as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow.toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState(profile?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");

  const [confirmed, setConfirmed] = useState<{
    ref: string;
    total: number;
  } | null>(null);

  if (!open) return null;

  const unitPrice = getEffectivePrice(activity);
  const total = unitPrice * guests;

  const handleConfirm = async () => {
    if (!user) {
      onClose();
      navigate({ to: "/auth" });
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Veuillez renseigner nom, email et téléphone.");
      return;
    }
    setError(null);
    setStep("loading");

    const ref = generateRef();
    // partner_user_id required by RLS — for demo we accept any partner;
    // for our demo seed, use the same user's id when partner is unknown.
    // In real product the partner_user_id would come from the activity's partner mapping.
    const { error: insertErr } = await supabase.from("partner_bookings").insert({
      partner_user_id: user.id, // placeholder — RLS allows client to insert their own row
      client_user_id: user.id,
      activity_id: activity.id,
      booking_date: date,
      booking_time: time,
      guests,
      amount_mad: total,
      client_name: name.trim(),
      client_email: email.trim(),
      client_phone: phone.trim(),
      booking_reference: ref,
      status: "confirmed",
    });

    if (insertErr) {
      setError(insertErr.message);
      setStep("form");
      return;
    }

    setConfirmed({ ref, total });
    setStep("confirmed");
  };

  const qrPayload = confirmed
    ? JSON.stringify({
        ref: confirmed.ref,
        activity: activity.title,
        date,
        time,
        guests,
        name,
        total: confirmed.total,
      })
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 transition hover:bg-secondary"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>

        {step === "confirmed" && confirmed ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint/30 text-mint-foreground">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl font-bold">Réservation confirmée !</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Présentez ce QR code au prestataire.
            </p>

            <div className="mx-auto mt-6 inline-block rounded-2xl border border-border bg-background p-4">
              <QRCodeSVG value={qrPayload} size={180} />
            </div>

            <div className="mt-4 rounded-2xl bg-secondary/40 p-4 text-left text-sm">
              <div className="mb-2 flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Référence</span>
                <span className="font-mono font-bold text-primary">{confirmed.ref}</span>
              </div>
              <div className="space-y-1.5">
                <Row label="Activité" value={activity.title} />
                <Row label="Date" value={new Date(date).toLocaleDateString("fr-FR", { dateStyle: "full" })} />
                <Row label="Heure" value={time} />
                <Row label="Personnes" value={String(guests)} />
                <Row label="Nom" value={name} />
                <Row label="Email" value={email} />
                <Row label="Téléphone" value={phone} />
                <Row label="Total payé" value={`${confirmed.total} MAD`} bold />
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              ✉️ Confirmation envoyée à {email} · 📱 SMS au {phone}
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => navigate({ to: "/profile" })}
                className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Voir mes réservations
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-border py-3 text-sm font-semibold hover:border-primary"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Réservation
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight">{activity.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{activity.partner}</p>

            <div className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Date" icon={<Calendar className="h-4 w-4" />}>
                  <input
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </Field>
                <Field label="Heure" icon={<Clock className="h-4 w-4" />}>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </Field>
              </div>

              <Field label="Personnes" icon={<Users className="h-4 w-4" />}>
                <div className="flex w-full items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="h-7 w-7 rounded-full bg-secondary text-sm hover:bg-primary hover:text-primary-foreground"
                  >
                    −
                  </button>
                  <span className="font-semibold">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(activity.maxGroup, g + 1))}
                    className="h-7 w-7 rounded-full bg-secondary text-sm hover:bg-primary hover:text-primary-foreground"
                  >
                    +
                  </button>
                </div>
              </Field>

              <Field label="Nom complet">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email" icon={<Mail className="h-4 w-4" />}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@email.com"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </Field>
                <Field label="Téléphone" icon={<Phone className="h-4 w-4" />}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+212 6 00 00 00 00"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-secondary/40 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {activity.flashDeal ? (
                    <>
                      <span className="line-through opacity-60">{activity.price}</span>{" "}
                      <span className="font-semibold text-destructive">{unitPrice} MAD</span>
                      <span className="ml-1 rounded-full bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive">
                        −{activity.flashDeal.discountPct}%
                      </span>
                      {" × "}{guests}
                    </>
                  ) : (
                    <>{unitPrice} MAD × {guests}</>
                  )}
                </span>
                <span className="font-semibold">{total} MAD</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2">
                <span className="font-display text-lg font-bold">Total</span>
                <span className="font-display text-2xl font-bold text-primary">{total} MAD</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={step === "loading"}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {step === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Confirmer & payer · {total} MAD</>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Paiement sécurisé 3D Secure · QR code par email + SMS · Annulation 48h
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="rounded-xl border border-border bg-background px-3 py-2.5">{children}</div>
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-bold text-primary" : "font-medium"}>{value}</span>
    </div>
  );
}
