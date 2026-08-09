/**
 * Schéma Zod du formulaire de réservation (3 étapes).
 * Cf. Phase 7 §7.2 — Structure formulaire + §7.3 — Validation.
 *
 * Design :
 *   - Un schéma *objet* pur par étape (extensible via `.extend()`).
 *   - Les refines cross-champs sont appliqués directement sur les schémas finaux.
 *   - Le schéma complet = fusion des 3 objets + refines.
 *   - Messages d'erreur = clés de traduction (client les mappe via dictionnaire).
 */

import { z } from "zod";
import { locales, type Locale } from "@/lib/utils";

// ─── Énums ────────────────────────────────────────────────────────
export const RATES = ["standard", "to", "promo"] as const;
export const PENSIONS = ["room-only", "bb", "half-board", "full-board"] as const;
export const TRANSFERS = ["none", "fianarantsoa-4x4", "ambalakely"] as const;
/* « familial » n'est PAS une catégorie du parc : les tarifs officiels en
   font une configuration du Pilotis Nuptial (lit supplémentaire à
   30 000 Ar/personne). Il reste proposé ici — c'est une demande légitime
   — mais libellé comme une configuration, pour ne pas promettre une
   chambre que le catalogue n'affiche pas. */
export const ROOM_IDS = [
  "pilotis",
  "superior",
  "wagon",
  "familial",
  "standard",
  "arbre",
  "villa-repos",
  "any",
] as const;

export type Rate = (typeof RATES)[number];
export type Pension = (typeof PENSIONS)[number];
export type Transfer = (typeof TRANSFERS)[number];
export type RoomId = (typeof ROOM_IDS)[number];

const PHONE_REGEX = /^[+]?[0-9\s().-]{6,20}$/;

// ─── Objets de base (composables via .extend) ─────────────────────
const stayStepObject = z.object({
  checkin: z
    .string()
    .min(1, "booking.errors.required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "booking.errors.invalidDate"),
  checkout: z
    .string()
    .min(1, "booking.errors.required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "booking.errors.invalidDate"),
  guests: z
    .number()
    .int()
    .min(1, "booking.errors.guestsMin")
    .max(20, "booking.errors.guestsMax"),
  // Décomposition facultative (héritée de la booking bar) — informationnelle.
  // `guests` reste la source de vérité côté email/CRM pour compat rétro.
  adults: z.number().int().min(1, "booking.errors.adultsMin").max(20).optional(),
  children: z.number().int().min(0).max(10, "booking.errors.childrenMax").optional(),
  rooms: z.number().int().min(1, "booking.errors.roomsMin").max(4, "booking.errors.roomsMax").optional(),
  room: z.enum(ROOM_IDS),
  pension: z.enum(PENSIONS).default("bb"),
  rate: z.enum(RATES).default("standard"),
  transfer: z.enum(TRANSFERS).default("none"),
  arrivalTime: z.string().optional(),
});

const travelerStepObject = z.object({
  name: z.string().trim().min(2, "booking.errors.nameMin").max(100, "booking.errors.nameMax"),
  email: z.string().email("booking.errors.invalidEmail").max(254, "booking.errors.emailTooLong"),
  phone: z.string().trim().regex(PHONE_REGEX, "booking.errors.invalidPhone"),
  nationality: z.string().trim().min(2, "booking.errors.required").max(80),
  message: z.string().max(2000, "booking.errors.messageTooLong").optional(),
});

const consentStepObject = z.object({
  gdpr: z.literal(true, { message: "booking.errors.gdprRequired" }),
  terms: z.literal(true, { message: "booking.errors.termsRequired" }),
  website: z.string().max(0, "booking.errors.botDetected").optional(), // honeypot
  hcaptchaToken: z.string().optional(),
});

// ─── Exports finaux avec refines inlined ──────────────────────────
export const stayStepSchema = stayStepObject
  .refine(
    (d) => new Date(d.checkout).getTime() > new Date(d.checkin).getTime(),
    { message: "booking.errors.checkoutBeforeCheckin", path: ["checkout"] }
  )
  .refine(
    (d) => {
      const ci = new Date(d.checkin);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return ci.getTime() >= today.getTime();
    },
    { message: "booking.errors.datesInPast", path: ["checkin"] }
  );

export const travelerStepSchema = travelerStepObject;
export const consentStepSchema = consentStepObject;

const fullObject = stayStepObject
  .extend(travelerStepObject.shape)
  .extend(consentStepObject.shape)
  .extend({ locale: z.enum(locales).default("fr") });

export const bookingFormSchema = fullObject
  .refine(
    (d) => new Date(d.checkout).getTime() > new Date(d.checkin).getTime(),
    { message: "booking.errors.checkoutBeforeCheckin", path: ["checkout"] }
  )
  .refine(
    (d) => {
      const ci = new Date(d.checkin);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return ci.getTime() >= today.getTime();
    },
    { message: "booking.errors.datesInPast", path: ["checkin"] }
  )
  .refine(
    // Si adults + children sont tous deux fournis, leur somme doit matcher guests.
    // (Laisse passer les soumissions legacy avec `guests` seul.)
    (d) =>
      d.adults == null || d.children == null
        ? true
        : d.adults + d.children === d.guests,
    { message: "booking.errors.guestsMismatch", path: ["guests"] }
  );

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type StayStepValues = z.infer<typeof stayStepSchema>;
export type TravelerStepValues = z.infer<typeof travelerStepSchema>;
export type ConsentStepValues = z.infer<typeof consentStepSchema>;

// ─── Helpers (calcul nuits) ───────────────────────────────────────
export function computeNights(checkin: string, checkout: string): number {
  const ci = new Date(checkin);
  const co = new Date(checkout);
  const diffMs = co.getTime() - ci.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

// ─── Labels humains (utilisés dans emails + review UI) ────────────
type LabelsShape = {
  rate: Record<Locale, Record<Rate, string>>;
  pension: Record<Locale, Record<Pension, string>>;
  transfer: Record<Locale, Record<Transfer, string>>;
  room: Record<Locale, Record<RoomId, string>>;
};

export const LABELS: LabelsShape = {
  rate: {
    fr: { standard: "Tarif Standard", to: "Tarif Tour-Opérateur", promo: "Offre 2 nuits (-50 %)" },
    en: { standard: "Standard rate", to: "Tour Operator rate", promo: "2-night offer (-50%)" },
    es: { standard: "Tarifa estándar", to: "Tarifa Tour-Operador", promo: "Oferta 2 noches (-50 %)" },
  },
  pension: {
    fr: {
      "room-only": "Logement seul",
      bb: "Logement + Petit-déjeuner",
      "half-board": "Demi-pension",
      "full-board": "Pension complète",
    },
    en: {
      "room-only": "Room only",
      bb: "Room + Breakfast",
      "half-board": "Half-board",
      "full-board": "Full-board",
    },
    es: {
      "room-only": "Solo alojamiento",
      bb: "Alojamiento + Desayuno",
      "half-board": "Media pensión",
      "full-board": "Pensión completa",
    },
  },
  transfer: {
    fr: {
      none: "Pas de transfert",
      "fianarantsoa-4x4": "Transfert privé 4×4 depuis Fianarantsoa (130 000 AR)",
      ambalakely: "Transfert depuis Ambalakely (120 000 AR)",
    },
    en: {
      none: "No transfer",
      "fianarantsoa-4x4": "Private 4×4 transfer from Fianarantsoa (130,000 AR)",
      ambalakely: "Transfer from Ambalakely (120,000 AR)",
    },
    es: {
      none: "Sin traslado",
      "fianarantsoa-4x4": "Traslado privado 4×4 desde Fianarantsoa (130 000 AR)",
      ambalakely: "Traslado desde Ambalakely (120 000 AR)",
    },
  },
  room: {
    fr: {
      pilotis: "Bungalow sur Pilotis Nuptial",
      superior: "Superior Lake View Room",
      wagon: "Wagon Nuptial 1930",
      familial: "Pilotis Nuptial — configuration familiale",
      standard: "Bungalow Standard",
      arbre: "Bungalow Tarzan sur Arbre",
      "villa-repos": "Villa avec kitchenette (Le Repos)",
      any: "Je fais confiance à l'hôtel",
    },
    en: {
      pilotis: "Honeymoon Overwater Bungalow",
      superior: "Superior Lake View Room",
      wagon: "1930 Honeymoon Wagon",
      familial: "Honeymoon Overwater Bungalow — family setup",
      standard: "Standard Bungalow",
      arbre: "Tarzan Treehouse Bungalow",
      "villa-repos": "Villa with kitchenette (Le Repos)",
      any: "Let the hotel decide",
    },
    es: {
      pilotis: "Bungalow Nupcial sobre Pilotes",
      superior: "Habitación Superior Vista al Lago",
      wagon: "Vagón Nupcial 1930",
      familial: "Bungalow Nupcial sobre Pilotes — configuración familiar",
      standard: "Bungalow Estándar",
      arbre: "Bungalow Tarzán en el Árbol",
      "villa-repos": "Villa con cocina (Le Repos)",
      any: "Confío en el hotel",
    },
  },
};
