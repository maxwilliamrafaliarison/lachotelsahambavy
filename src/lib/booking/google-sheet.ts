/**
 * Webhook Google Apps Script — mini-CRM réservations.
 * Cf. Phase 7 §7.5 — Mini-CRM Google Sheet.
 *
 * Le script reçoit un POST JSON et append une ligne.
 * Sécurité : secret partagé (HMAC-like via query param) + HTTPS only.
 * Failure silencieuse — on ne bloque JAMAIS l'envoi d'email si le CRM fail.
 */

export interface GoogleSheetPayload {
  timestamp: string;
  locale: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  checkin: string;
  checkout: string;
  nights: number;
  guests: number;
  /** Décomposition optionnelle — remplie quand la demande vient de la booking bar. */
  adults?: number;
  children?: number;
  rooms?: number;
  room: string;
  pension: string;
  rate: string;
  transfer: string;
  arrivalTime?: string;
  message?: string;
  ipHash: string;
  userAgent?: string;
}

export async function pushToGoogleSheet(payload: GoogleSheetPayload): Promise<boolean> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEET_SECRET;

  // Mode dev — pas de webhook configuré → skip silencieux.
  if (!url || !secret) return false;

  try {
    const res = await fetch(`${url}?secret=${encodeURIComponent(secret)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Timeout court pour ne pas bloquer la réponse API
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    // Erreur réseau / timeout → on log côté Sentry mais on n'interrompt pas le flow.
    console.warn("[booking] Google Sheet webhook failed (non-blocking)");
    return false;
  }
}
