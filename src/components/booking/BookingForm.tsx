"use client";

/**
 * Formulaire de réservation multi-étapes.
 * Cf. Phase 7 §7.2 — Structure formulaire + §7.9 — Tracking Plausible.
 *
 * Étapes :
 *   1. Séjour (dates, voyageurs, hébergement, pension, transfert)
 *   2. Voyageur (nom, email, téléphone, nationalité, message)
 *   3. Confirmation (consentements RGPD + CGR + hCaptcha + honeypot)
 *
 * Pré-remplissage : URL params depuis la barre de réservation homepage
 *   (?checkin=...&checkout=...&guests=N&rate=standard|to|promo)
 *
 * Sans clés (mode dev / static export) : fallback mailto gracieux.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider, useFormContext, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rooms } from "@/data/rooms";
import { ROOM_IDS } from "@/lib/booking/schema";
import { siteConfig } from "@/data/site";
import { track } from "@/lib/analytics";
import type { Locale } from "@/lib/utils";
import { getBasePath } from "@/lib/utils";
import {
  bookingFormSchema,
  type BookingFormValues,
  PENSIONS,
  TRANSFERS,
  RATES,
  computeNights,
} from "@/lib/booking/schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Dict = any;

export interface BookingFormProps {
  locale: Locale;
  dict: Dict;
}

// ─── Helpers ──────────────────────────────────────────────
function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function translateError(err: FieldError | undefined, dict: Dict): string | undefined {
  if (!err) return undefined;
  const key = err.message;
  if (!key) return undefined;
  // Permet de traduire "booking.errors.xyz" en valeur du dict
  const parts = key.split(".");
  let node: any = dict;
  for (const p of parts) {
    if (node && typeof node === "object" && p in node) node = node[p];
    else return key;
  }
  return typeof node === "string" ? node : key;
}

/**
 * Rend la phrase de consentement CGR en transformant la portion
 * `termsConsentLinkLabel` (ex. "conditions de réservation") en lien vers la
 * page /conditions-reservation. Si le label ne figure pas dans la phrase
 * (jamais attendu — les dicts sont synchronisés), fallback plain text.
 */
function TermsConsentLabel({ dict, locale }: { dict: Dict; locale: Locale }) {
  const text: string = dict.contact.form.termsConsent;
  const linkLabel: string | undefined = dict.conditions?.termsConsentLinkLabel;
  const slug: string = dict.conditions?.slug || "conditions-reservation";
  if (!linkLabel) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(linkLabel.toLowerCase());
  if (idx === -1) return <>{text}</>;
  const before = text.slice(0, idx);
  const matched = text.slice(idx, idx + linkLabel.length);
  const after = text.slice(idx + linkLabel.length);
  return (
    <>
      {before}
      <Link
        href={`/${locale}/${slug}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink underline decoration-gold/60 hover:decoration-gold"
      >
        {matched}
      </Link>
      {after}
    </>
  );
}

// ─── Step indicator ───────────────────────────────────────
function StepIndicator({
  step,
  labels,
}: {
  step: 1 | 2 | 3;
  labels: [string, string, string];
}) {
  return (
    <div className="flex items-center justify-between mb-10 px-2" aria-label="Progression">
      {[1, 2, 3].map((n, i) => {
        const active = step === n;
        const done = step > n;
        return (
          <div key={n} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
                done
                  ? "bg-gold text-white"
                  : active
                  ? "bg-ink text-white ring-4 ring-gold/20"
                  : "bg-white text-muted border border-ink/20"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? "✓" : n}
            </div>
            <span
              className={`ml-2 text-xs md:text-sm font-medium hidden sm:block ${
                active || done ? "text-ink" : "text-muted"
              }`}
            >
              {labels[i]}
            </span>
            {n < 3 ? (
              <div
                className={`flex-1 h-0.5 mx-2 md:mx-3 transition-colors ${
                  done ? "bg-gold" : "bg-ink/15"
                }`}
                aria-hidden
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// ─── Reusable field wrapper ───────────────────────────────
function Field({
  label,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">
        {label} {required ? <span className="text-gold">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted/80 mt-1">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full bg-white border border-ink/20 rounded-[3px] px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors";

// ─── Occupancy stepper (rooms / adults / children) ─────────
function OccupancyStepper({
  label,
  value,
  min,
  max,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const canDec = value > min;
  const canInc = value < max;
  return (
    <div className="flex items-center justify-between bg-white border border-ink/15 rounded-[3px] px-4 py-3">
      <div className="flex flex-col">
        <span className="text-sm text-ink font-medium">{label}</span>
        {hint ? <span className="text-[0.7rem] text-muted/70">{hint}</span> : null}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => canDec && onChange(value - 1)}
          disabled={!canDec}
          aria-label={`− ${label}`}
          className="w-11 h-11 rounded-full border border-ink/25 text-ink text-lg leading-none flex items-center justify-center hover:bg-ink/5 active:bg-ink/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="text-base font-semibold w-7 text-center tabular-nums text-ink">
          {value}
        </span>
        <button
          type="button"
          onClick={() => canInc && onChange(value + 1)}
          disabled={!canInc}
          aria-label={`+ ${label}`}
          className="w-11 h-11 rounded-full border border-gold/40 bg-gold/10 text-gold text-lg leading-none flex items-center justify-center hover:bg-gold/20 active:bg-gold/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Step 1: Séjour ───────────────────────────────────────
function StayStep({ locale, dict }: { locale: Locale; dict: Dict }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BookingFormValues>();
  const b = dict.booking;
  const bb = dict.bookingBar;

  // Sync guests = adults + children en temps réel
  const adults = watch("adults") ?? 2;
  const children = watch("children") ?? 0;
  const totalGuests = (adults || 0) + (children || 0);
  useEffect(() => {
    setValue("guests", totalGuests, { shouldValidate: false, shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalGuests]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          label={dict.contact.form.checkin}
          required
          error={translateError(errors.checkin, dict)}
        >
          <input
            type="date"
            min={todayISO()}
            className={inputClass}
            {...register("checkin")}
          />
        </Field>

        <Field
          label={dict.contact.form.checkout}
          required
          error={translateError(errors.checkout, dict)}
        >
          <input
            type="date"
            min={addDaysISO(todayISO(), 1)}
            className={inputClass}
            {...register("checkout")}
          />
        </Field>
      </div>

      {/* Occupation : 3 steppers au lieu d'un champ "nombre de voyageurs" */}
      <Field
        label={bb?.guests || dict.contact.form.guests}
        required
        error={translateError(errors.guests, dict) || translateError(errors.adults, dict) || translateError(errors.children, dict) || translateError(errors.rooms, dict)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <OccupancyStepper
            label={bb?.rooms || "Chambres"}
            value={watch("rooms") ?? 1}
            min={1}
            max={4}
            onChange={(v) => setValue("rooms", v, { shouldDirty: true })}
          />
          <OccupancyStepper
            label={bb?.adults || "Adultes"}
            value={adults}
            min={1}
            max={20}
            onChange={(v) => setValue("adults", v, { shouldDirty: true })}
          />
          <OccupancyStepper
            label={bb?.child ? `${bb.child.charAt(0).toUpperCase()}${bb.child.slice(1)}s` : "Enfants"}
            hint={bb?.children && bb.children.includes("(") ? bb.children.match(/\(([^)]+)\)/)?.[1] : undefined}
            value={children}
            min={0}
            max={10}
            onChange={(v) => setValue("children", v, { shouldDirty: true })}
          />
        </div>
        {/* Guests reste géré en champ caché pour le submit (sync via useEffect) */}
        <input type="hidden" {...register("guests", { valueAsNumber: true })} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          label={dict.contact.form.arrivalTime}
          error={translateError(errors.arrivalTime, dict)}
        >
          <select className={inputClass} {...register("arrivalTime")}>
            <option value="">—</option>
            <option value="10:00 - 12:00">10:00 - 12:00</option>
            <option value="12:00 - 14:00">12:00 - 14:00</option>
            <option value="14:00 - 16:00">14:00 - 16:00</option>
            <option value="16:00 - 18:00">16:00 - 18:00</option>
            <option value="18:00 - 20:00">18:00 - 20:00</option>
            <option value="20:00+">20:00+</option>
          </select>
        </Field>

        <Field
          label={dict.contact.form.room}
          required
          error={translateError(errors.room, dict)}
        >
          {/* On n'itère PLUS sur `rooms` : ce tableau contient aussi les
              catégories non publiées — la Lake Suite y figure, prête pour la
              grille 2027. Elle apparaissait donc en tête du menu, alors que
              `ROOM_IDS` ne la connaît pas : le client la choisissait et le
              passage à l'étape suivante échouait sur une erreur Zod brute,
              en anglais, exposant les identifiants internes. Réservation
              impossible. On ne propose donc que ce que le schéma accepte. */}
          <select className={inputClass} {...register("room")}>
            <option value="">—</option>
            {rooms
              .filter((r) => (ROOM_IDS as readonly string[]).includes(r.id))
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name[locale]}
                  {r.priceEUR ? ` — ${r.priceEUR} €` : ""}
                </option>
              ))}
            <option value="any">{b?.anyRoom || "Je fais confiance à l'hôtel"}</option>
          </select>
        </Field>

        <Field label={dict.contact.form.pension} error={translateError(errors.pension, dict)}>
          <select className={inputClass} {...register("pension")}>
            {PENSIONS.map((p) => (
              <option key={p} value={p}>
                {b?.pensions?.[p] || p}
              </option>
            ))}
          </select>
        </Field>

        <Field label={b?.rate || "Tarif"} error={translateError(errors.rate, dict)}>
          <select className={inputClass} {...register("rate")}>
            {RATES.map((r) => (
              <option key={r} value={r}>
                {b?.rates?.[r] || r}
              </option>
            ))}
          </select>
        </Field>

        <Field label={dict.contact.form.transfer} error={translateError(errors.transfer, dict)}>
          <select className={inputClass} {...register("transfer")}>
            {TRANSFERS.map((t) => (
              <option key={t} value={t}>
                {b?.transfers?.[t] || t}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

// ─── Step 2: Voyageur ─────────────────────────────────────
function TravelerStep({ dict }: { dict: Dict }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingFormValues>();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          label={dict.contact.form.name}
          required
          error={translateError(errors.name, dict)}
        >
          <input type="text" autoComplete="name" className={inputClass} {...register("name")} />
        </Field>

        <Field
          label={dict.contact.form.email}
          required
          error={translateError(errors.email, dict)}
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
        </Field>

        <Field
          label={dict.contact.form.phone}
          required
          error={translateError(errors.phone, dict)}
          hint="+33 6 12 34 56 78"
        >
          <input type="tel" autoComplete="tel" className={inputClass} {...register("phone")} />
        </Field>

        <Field
          label={dict.contact.form.nationality}
          required
          error={translateError(errors.nationality, dict)}
        >
          <input
            type="text"
            autoComplete="country-name"
            className={inputClass}
            {...register("nationality")}
          />
        </Field>
      </div>

      <Field label={dict.contact.form.message} error={translateError(errors.message, dict)}>
        <textarea rows={4} className={inputClass} {...register("message")} />
      </Field>
    </div>
  );
}

// ─── Step 3: Confirmation ─────────────────────────────────
function ReviewStep({ dict, locale }: { dict: Dict; locale: Locale }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BookingFormValues>();
  const v = watch();
  const nights = v.checkin && v.checkout ? computeNights(v.checkin, v.checkout) : 0;
  const b = dict.booking;
  const bb = dict.bookingBar;
  const roomLabel = useMemo(() => {
    const room = rooms.find((r) => r.id === v.room);
    return room ? room.name[locale] : v.room === "any" ? b?.anyRoom || "—" : "—";
  }, [v.room, locale, b]);

  // Construit "2 adultes, 1 enfant · 2 chambres" à partir des champs décomposés.
  // Se replie gracieusement sur le total `guests` si adults/children absents (legacy).
  const occupancyLabel = useMemo(() => {
    const a = v.adults;
    const c = v.children;
    const r = v.rooms;
    if (a == null && c == null) {
      return v.guests ? String(v.guests) : "—";
    }
    const aLabel = (a ?? 0) > 1 ? bb?.adultPlural || "adultes" : bb?.adult || "adulte";
    const cLabel = (c ?? 0) > 1 ? bb?.childPlural || "enfants" : bb?.child || "enfant";
    const parts: string[] = [];
    if (a != null) parts.push(`${a} ${aLabel}`);
    if (c != null && c > 0) parts.push(`${c} ${cLabel}`);
    const rLabel = (r ?? 1) > 1 ? bb?.roomPlural || "chambres" : bb?.room || "chambre";
    if (r != null) parts.push(`${r} ${rLabel}`);
    return parts.join(" · ");
  }, [v.adults, v.children, v.rooms, v.guests, bb]);

  return (
    <div className="space-y-6">
      {/* Récap */}
      <div className="bg-white rounded-[3px] border border-ink/10 p-5 md:p-6">
        <h4 className="text-base font-semibold text-ink mb-3">{b?.review?.title || "Vérifiez votre demande"}</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <Item label={dict.contact.form.checkin} value={v.checkin || "—"} />
          <Item label={dict.contact.form.checkout} value={v.checkout || "—"} />
          <Item label={b?.nights || "Nuits"} value={nights > 0 ? String(nights) : "—"} emphasis />
          <Item label={bb?.guests || dict.contact.form.guests} value={occupancyLabel} />
          <Item label={dict.contact.form.room} value={roomLabel} />
          <Item label={dict.contact.form.pension} value={b?.pensions?.[v.pension] || v.pension || "—"} />
          <Item label={b?.rate || "Tarif"} value={b?.rates?.[v.rate] || v.rate || "—"} />
          <Item label={dict.contact.form.transfer} value={b?.transfers?.[v.transfer] || v.transfer || "—"} />
          <Item label={dict.contact.form.name} value={v.name || "—"} />
          <Item label={dict.contact.form.email} value={v.email || "—"} />
          <Item label={dict.contact.form.phone} value={v.phone || "—"} />
          <Item label={dict.contact.form.nationality} value={v.nationality || "—"} />
        </dl>
        {v.message ? (
          <div className="mt-4 pt-4 border-t border-ink/10">
            <p className="text-xs uppercase tracking-wider text-gold font-semibold mb-1">
              {dict.contact.form.message}
            </p>
            <p className="text-sm text-muted whitespace-pre-wrap">{v.message}</p>
          </div>
        ) : null}
      </div>

      {/* Consentements */}
      <div className="space-y-4 bg-white rounded-[3px] p-5 border border-ink/10">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-1 w-4 h-4 rounded-[3px] border-ink/30 text-gold focus:ring-gold/40 flex-shrink-0"
            {...register("gdpr")}
          />
          <span className="text-xs text-muted leading-relaxed">
            {dict.contact.form.gdprConsent} <span className="text-gold">*</span>
          </span>
        </label>
        {errors.gdpr ? (
          <p className="text-xs text-red-600 ml-7">⚠ {translateError(errors.gdpr, dict)}</p>
        ) : null}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-1 w-4 h-4 rounded-[3px] border-ink/30 text-gold focus:ring-gold/40 flex-shrink-0"
            {...register("terms")}
          />
          <span className="text-xs text-muted leading-relaxed">
            <TermsConsentLabel dict={dict} locale={locale} />{" "}
            <span className="text-gold">*</span>
          </span>
        </label>
        {errors.terms ? (
          <p className="text-xs text-red-600 ml-7">⚠ {translateError(errors.terms, dict)}</p>
        ) : null}
      </div>

      {/* Honeypot — invisible pour les humains, rempli par les bots */}
      <div aria-hidden className="hidden" tabIndex={-1} style={{ position: "absolute", left: "-9999px" }}>
        <label>
          Leave this empty
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>
    </div>
  );
}

function Item({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <dt className="text-muted">{label}</dt>
      <dd
        className={`text-right break-words ${emphasis ? "text-gold font-semibold" : "text-ink font-medium"}`}
      >
        {value}
      </dd>
    </div>
  );
}

// ─── Main multi-step form ─────────────────────────────────
export function BookingForm({ locale, dict }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const b = dict.booking;

  // Pré-remplissage URL params
  const prefill = useMemo<Partial<BookingFormValues>>(() => {
    const checkin = searchParams.get("checkin") || "";
    const checkout = searchParams.get("checkout") || "";
    const rateParam = searchParams.get("rate");
    const rate = (RATES as readonly string[]).includes(rateParam ?? "")
      ? (rateParam as BookingFormValues["rate"])
      : "standard";

    // Occupation : priorité aux champs décomposés de la booking bar,
    // fallback sur `guests` (legacy) puis valeurs par défaut.
    const clampInt = (raw: string | null, min: number, max: number, def: number) => {
      const n = Number(raw);
      if (!Number.isFinite(n)) return def;
      return Math.min(max, Math.max(min, Math.round(n)));
    };
    const hasAdults = searchParams.get("adults") != null;
    const hasChildren = searchParams.get("children") != null;
    const adults = hasAdults ? clampInt(searchParams.get("adults"), 1, 20, 2) : 2;
    const children = hasChildren ? clampInt(searchParams.get("children"), 0, 10, 0) : 0;
    const rooms = clampInt(searchParams.get("rooms"), 1, 4, 1);

    // Guests : si adults ou children est passé, on recalcule pour garantir cohérence.
    // Sinon, lecture directe du param `guests` (legacy).
    const guests =
      hasAdults || hasChildren
        ? adults + children
        : clampInt(searchParams.get("guests"), 1, 20, adults + children);

    return {
      checkin,
      checkout,
      guests,
      adults,
      children,
      rooms,
      rate,
      pension: "bb",
      transfer: "none",
    };
  }, [searchParams]);

  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema) as any,
    mode: "onBlur",
    defaultValues: {
      ...prefill,
      locale,
      pension: "bb",
      rate: prefill.rate || "standard",
      transfer: "none",
      adults: prefill.adults ?? 2,
      children: prefill.children ?? 0,
      rooms: prefill.rooms ?? 1,
      name: "",
      email: "",
      phone: "",
      nationality: "",
      message: "",
      gdpr: false as unknown as true,
      terms: false as unknown as true,
      website: "",
      hcaptchaToken: "",
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  // Scroll to form when pre-filled
  useEffect(() => {
    if (searchParams.get("checkin") && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
    // Event Plausible : form opened
    track("booking_form_opened", {
      entry_point: searchParams.get("checkin") ? "booking-bar" : "direct",
      locale,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNext = useCallback(async () => {
    const stepFields: Record<1 | 2, (keyof BookingFormValues)[]> = {
      1: ["checkin", "checkout", "guests", "adults", "children", "rooms", "room", "pension", "rate", "transfer", "arrivalTime"],
      2: ["name", "email", "phone", "nationality", "message"],
    };
    const fields = stepFields[step as 1 | 2];
    const ok = await trigger(fields);
    if (!ok) {
      track("booking_form_validation_error", { step, locale });
      return;
    }
    const next = (step + 1) as 1 | 2 | 3;
    setStep(next);
    track(next === 2 ? "booking_form_step_2" : "booking_form_step_3", { locale });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, trigger, locale]);

  const goBack = useCallback(() => {
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    track("booking_form_started", { locale });

    try {
      /* Barre oblique finale obligatoire : `trailingSlash: true` fait
         répondre 308 à /api/booking, et chaque envoi payait donc un
         aller-retour de plus. Le 308 préserve bien la méthode et le corps
         — rien n'était cassé — mais certains proxys d'entreprise
         rétrogradent un POST redirigé en GET, et la demande se perdrait
         sans message d'erreur. */
      const res = await fetch("/api/booking/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        // Mapping code → clé dict
        const code = (json.code as string) || "genericError";
        const msgKey: Record<string, string> = {
          "rate-limited": b?.errors?.rateLimited || "Trop de demandes. Merci de réessayer dans quelques minutes.",
          "captcha-failed": b?.errors?.captchaFailed || "Vérification anti-spam échouée.",
          "validation-failed": b?.errors?.genericError || "Données invalides.",
          "email-failed": b?.errors?.genericError || "Impossible d'envoyer l'email. Merci de réessayer.",
        };
        setServerError(msgKey[code] || b?.errors?.genericError || "Une erreur est survenue.");
        track("booking_failed", { code, locale });
        return;
      }

      track("booking_submitted", { locale });
      // Redirect vers page confirmation avec quelques params non-sensibles
      const qs = new URLSearchParams({
        name: data.name.split(" ")[0] || data.name,
        checkin: data.checkin,
        checkout: data.checkout,
      });
      router.push(`/${locale}/reservation/confirmation/?${qs.toString()}`);
    } catch {
      // Fallback mailto si l'API est indisponible (ex: mode static export GH Pages)
      track("booking_failed", { code: "network", locale });
      const subject = encodeURIComponent(`Réservation ${data.name} — ${data.checkin} → ${data.checkout}`);
      const body = encodeURIComponent(buildMailtoBody(data));
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    }
  });

  const stepLabels: [string, string, string] = [
    b?.steps?.stay || "Séjour",
    b?.steps?.traveler || "Voyageur",
    b?.steps?.confirm || "Confirmation",
  ];

  return (
    <FormProvider {...methods}>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="space-y-6"
        noValidate
        aria-label={dict.contact.title}
      >
        {/* Pre-fill indicator */}
        {prefill.checkin ? (
          <div className="bg-gold/10 border border-gold/20 rounded-[3px] p-4 text-sm text-ink text-center">
            <span className="font-semibold">✓ </span>
            {b?.prefilledNotice ||
              (locale === "fr"
                ? "Vos dates ont été pré-remplies depuis la barre de réservation."
                : locale === "es"
                ? "Sus fechas han sido prellenadas desde la barra de reserva."
                : "Your dates have been pre-filled from the booking bar.")}
          </div>
        ) : null}

        <StepIndicator step={step} labels={stepLabels} />

        {step === 1 ? <StayStep locale={locale} dict={dict} /> : null}
        {step === 2 ? <TravelerStep dict={dict} /> : null}
        {step === 3 ? <ReviewStep dict={dict} locale={locale} /> : null}

        {serverError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-[3px] p-4 text-sm">
            <strong>⚠ </strong>
            {serverError}
          </div>
        ) : null}

        {/* Nav buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between pt-2">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-medium border border-ink/20 text-ink hover:bg-ink/5 transition-colors"
              >
                ← {b?.steps?.back || "Retour"}
              </button>
            ) : null}
          </div>
          <div>
            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="w-full sm:w-auto bg-ink text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-ink/90 transition-colors shadow-md"
              >
                {b?.steps?.next || "Suivant"} →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gold text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-champagne transition-colors shadow-md disabled:opacity-60 uppercase tracking-wider"
              >
                {isSubmitting
                  ? dict.contact.form.sending
                  : b?.steps?.submit || dict.contact.form.submit}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted/70">
          * {dict.contact.form.required}
        </p>
      </form>
    </FormProvider>
  );
}

// ─── Mailto fallback ──────────────────────────────────────
function buildMailtoBody(data: BookingFormValues): string {
  const nights = computeNights(data.checkin, data.checkout);
  const occupancyLine =
    data.adults != null || data.children != null
      ? `Occupation: ${data.adults ?? 0} adulte(s) + ${data.children ?? 0} enfant(s) · ${data.rooms ?? 1} chambre(s)`
      : `Personnes / Guests: ${data.guests}`;
  return [
    "=== DEMANDE DE RESERVATION / BOOKING REQUEST ===",
    "",
    `Nom / Name: ${data.name}`,
    `Email: ${data.email}`,
    `Tel / Phone: ${data.phone}`,
    `Nationalite / Nationality: ${data.nationality}`,
    "",
    "--- SEJOUR / STAY ---",
    `Arrivee / Check-in: ${data.checkin}`,
    `Depart / Check-out: ${data.checkout} (${nights} nuits)`,
    `Personnes / Guests: ${data.guests}`,
    occupancyLine,
    `Chambre / Room: ${data.room}`,
    `Pension: ${data.pension}`,
    `Tarif: ${data.rate}`,
    `Transfert: ${data.transfer}`,
    data.arrivalTime ? `Arrivee estimee: ${data.arrivalTime}` : "",
    "",
    "--- MESSAGE ---",
    data.message || "(aucun)",
    "",
    "---",
    "Consentement RGPD accepte. Conditions acceptees.",
  ]
    .filter(Boolean)
    .join("\n");
}

// Suppress unused var warnings for basePath import
void getBasePath;

export default BookingForm;
