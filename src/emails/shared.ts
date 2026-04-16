/**
 * Traductions et tokens design partagés par tous les emails.
 * Cf. Phase 7 §7.4 — Workflow emails.
 */

import type { Locale } from "@/lib/utils";

export const EMAIL_COLORS = {
  brown: "#2C1810",
  gold: "#C4962A",
  goldLight: "#D4B059",
  cream: "#F8F5F0",
  text: "#1A1A1A",
  muted: "#4A4A4A",
  border: "#E6E0D5",
  white: "#FFFFFF",
} as const;

export const EMAIL_FONTS = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

export const EMAIL_COPY = {
  fr: {
    // Client confirmation
    greeting: "Bonjour",
    receivedTitle: "Nous avons bien reçu votre demande !",
    receivedP1:
      "Merci pour votre confiance. Notre équipe a reçu votre demande de réservation et vous répondra sous 24 heures avec la confirmation définitive.",
    summaryTitle: "Récapitulatif de votre demande",
    nights: "nuit",
    nightsPlural: "nuits",
    checkin: "Arrivée",
    checkout: "Départ",
    guests: "Voyageurs",
    room: "Hébergement",
    pension: "Pension",
    rate: "Tarif souhaité",
    transfer: "Transfert",
    arrivalTime: "Heure d'arrivée estimée",
    messageTitle: "Votre message",
    nextStepsTitle: "Et maintenant ?",
    nextSteps: [
      "Notre équipe vérifie les disponibilités et vous confirme la réservation par email sous 24 h.",
      "Aucun paiement n'est requis maintenant — règlement à l'arrivée en Ariary, Euros ou virement.",
      "Une question urgente ? Contactez-nous par WhatsApp.",
    ],
    contactWhatsapp: "Contacter par WhatsApp",
    signature: "Leong, Olga, Maggie & toute l'équipe du Lac Hôtel",
    footerLegal:
      "Vous recevez cet email suite à votre demande de réservation sur lachotel.com. Vos données ne sont pas partagées avec des tiers.",
    // Internal notification
    internalSubject: "Nouvelle demande de réservation",
    internalTitle: "Nouvelle demande de réservation",
    internalMeta: "Reçue le",
    contactBlock: "Contact voyageur",
    stayBlock: "Détails du séjour",
    replyTo: "Répondre directement au voyageur",
    addToCrm: "Ajouter au Google Sheet",
  },
  en: {
    greeting: "Hello",
    receivedTitle: "We've received your booking request!",
    receivedP1:
      "Thank you for your trust. Our team has received your booking request and will reply within 24 hours with the final confirmation.",
    summaryTitle: "Your booking request",
    nights: "night",
    nightsPlural: "nights",
    checkin: "Check-in",
    checkout: "Check-out",
    guests: "Guests",
    room: "Accommodation",
    pension: "Meal plan",
    rate: "Preferred rate",
    transfer: "Transfer",
    arrivalTime: "Estimated arrival time",
    messageTitle: "Your message",
    nextStepsTitle: "What's next?",
    nextSteps: [
      "Our team checks availability and confirms your booking by email within 24 hours.",
      "No payment required now — settle on arrival in Ariary, Euros or bank transfer.",
      "Urgent question? Reach us via WhatsApp.",
    ],
    contactWhatsapp: "Contact via WhatsApp",
    signature: "Leong, Olga, Maggie & the Lac Hôtel team",
    footerLegal:
      "You receive this email following your booking request on lachotel.com. Your data is not shared with third parties.",
    internalSubject: "New booking request",
    internalTitle: "New booking request",
    internalMeta: "Received",
    contactBlock: "Guest contact",
    stayBlock: "Stay details",
    replyTo: "Reply directly to the guest",
    addToCrm: "Add to Google Sheet",
  },
  es: {
    greeting: "Hola",
    receivedTitle: "¡Hemos recibido su solicitud!",
    receivedP1:
      "Gracias por su confianza. Nuestro equipo ha recibido su solicitud de reserva y le responderá en las próximas 24 horas con la confirmación definitiva.",
    summaryTitle: "Resumen de su solicitud",
    nights: "noche",
    nightsPlural: "noches",
    checkin: "Llegada",
    checkout: "Salida",
    guests: "Viajeros",
    room: "Alojamiento",
    pension: "Pensión",
    rate: "Tarifa deseada",
    transfer: "Traslado",
    arrivalTime: "Hora estimada de llegada",
    messageTitle: "Su mensaje",
    nextStepsTitle: "¿Y ahora qué?",
    nextSteps: [
      "Nuestro equipo verifica la disponibilidad y le confirma la reserva por email en 24 horas.",
      "Sin pago ahora — abono a la llegada en Ariary, Euros o transferencia.",
      "¿Pregunta urgente? Contáctenos por WhatsApp.",
    ],
    contactWhatsapp: "Contactar por WhatsApp",
    signature: "Leong, Olga, Maggie y el equipo del Lac Hôtel",
    footerLegal:
      "Recibe este email tras su solicitud de reserva en lachotel.com. Sus datos no se comparten con terceros.",
    internalSubject: "Nueva solicitud de reserva",
    internalTitle: "Nueva solicitud de reserva",
    internalMeta: "Recibida el",
    contactBlock: "Contacto del viajero",
    stayBlock: "Detalles de la estancia",
    replyTo: "Responder directamente al viajero",
    addToCrm: "Añadir al Google Sheet",
  },
} as const;

export type EmailCopy = (typeof EMAIL_COPY)[Locale];
