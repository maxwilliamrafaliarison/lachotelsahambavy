/**
 * Wrapper de tracking client (Plausible).
 * Cf. Phase 7 §7.9 — Événements custom moteur de réservation.
 *
 * Usage :
 *
 *   import { track } from "@/lib/analytics";
 *
 *   track("booking_form_opened", { entry_point: "hero-bar" });
 *
 * Si Plausible n'est pas chargé (dev ou consentement refusé), no-op silencieux.
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
  }
}

export type AnalyticsEvent =
  | "booking_form_opened"
  | "booking_form_started"
  | "booking_form_step_2"
  | "booking_form_step_3"
  | "booking_form_validation_error"
  | "booking_submitted"
  | "booking_failed"
  | "newsletter_submitted"
  | "whatsapp_clicked"
  | "phone_clicked"
  | "language_switched"
  | "outbound_clicked"
  | "lightbox_opened"
  | "experience_viewed";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;

  try {
    window.plausible(event, props ? { props } : undefined);
  } catch {
    // No-op — analytics ne doit JAMAIS casser l'expérience user
  }
}
