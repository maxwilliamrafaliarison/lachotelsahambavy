/**
 * API Route — POST /api/booking
 *
 * Cf. Phase 7 §7.3 (validation), §7.4 (emails), §7.5 (CRM), §7.6 (anti-abus).
 *
 * Pipeline :
 *   1. Honeypot check (champ `website` doit être vide)
 *   2. Rate-limit Upstash (10 req/10min par IP hashée)
 *   3. Validation Zod stricte
 *   4. hCaptcha verify server-side
 *   5. Envoi Resend × 2 (confirmation client + notification interne)
 *   6. Push Google Sheet (best-effort, non bloquant)
 *   7. Response JSON (success | error)
 *
 * Failure modes :
 *   - Email provider down → 502 avec message localisé
 *   - Rate-limited → 429 + header Retry-After
 *   - Validation fail → 400 avec `issues[]`
 *   - CAPTCHA fail → 400 code `captcha-failed`
 *
 * Sécurité :
 *   - Aucun stockage IP en clair (hash SHA-256 salé)
 *   - Aucun log PII côté serveur hors email
 *   - CORS restreint à SITE_URL en prod
 */

import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";

import { bookingFormSchema, type BookingFormValues } from "@/lib/booking/schema";
import { rateLimitCheck } from "@/lib/booking/rate-limit";
import { verifyHCaptcha } from "@/lib/booking/hcaptcha";
import { extractIp, hashIp } from "@/lib/booking/hash-ip";
import { pushToGoogleSheet } from "@/lib/booking/google-sheet";
import { computeNights } from "@/lib/booking/schema";
import BookingConfirmation from "@/emails/BookingConfirmation";
import BookingNotification from "@/emails/BookingNotification";
import { siteConfig } from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Endpoint health-check (GET) → monitoring
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    service: "booking-api",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  // ─── 1. Parse body ───────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid-json", "Le corps de la requête n'est pas un JSON valide.");
  }

  // ─── 2. Validation Zod ───────────────────────────────────
  const parsed = bookingFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        code: "validation-failed",
        issues: parsed.error.issues.map((iss) => ({
          path: iss.path.map((p) => String(p)).join("."),
          code: iss.code,
          message: iss.message,
        })),
      },
      { status: 400 }
    );
  }
  const data: BookingFormValues = parsed.data;

  // ─── 3. Honeypot — si rempli, on simule un succès (piéger le bot) ───
  if (data.website && data.website.length > 0) {
    // Ne jamais révéler qu'on a détecté le bot — réponse "succès" fake
    return NextResponse.json({ success: true, code: "ok-decoy" }, { status: 200 });
  }

  // ─── 4. Rate-limiting (IP hashée) ────────────────────────
  const rawIp = extractIp(request.headers);
  const ipHash = hashIp(rawIp);
  const rl = await rateLimitCheck(`booking:${ipHash}`);
  if (!rl.success) {
    return NextResponse.json(
      { success: false, code: "rate-limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)),
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    );
  }

  // ─── 5. hCaptcha verify ──────────────────────────────────
  const captcha = await verifyHCaptcha(data.hcaptchaToken, rawIp ?? undefined);
  if (!captcha.valid) {
    return NextResponse.json(
      { success: false, code: "captcha-failed", reason: captcha.reason },
      { status: 400 }
    );
  }

  // ─── 6. Envoi emails via Resend ──────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    /* Pas de clé configurée → succès factice, sans e-mail.
       Le payload n'est journalisé QU'EN DÉVELOPPEMENT : il contient le nom,
       l'adresse, le téléphone et les dates de séjour du client. La branche
       se déclenche dès que RESEND_API_KEY manque — y compris sur une
       production mal configurée, ce qui n'a rien de théorique puisque
       .env.example livre la clé commentée. Ces données seraient alors
       parties en clair dans les journaux Vercel. La ligne voisine gardait
       déjà son `debug` derrière NODE_ENV ; celle-ci ne le faisait pas. */
    console.warn("[booking] RESEND_API_KEY missing — skipping email dispatch");
    if (process.env.NODE_ENV === "development") {
      console.log("[booking] Payload:", JSON.stringify(data, null, 2));
    }
    return NextResponse.json({
      success: true,
      code: "ok-dev-noemail",
      debug: process.env.NODE_ENV === "development" ? data : undefined,
    });
  }

  const resend = new Resend(resendKey);
  const emailFrom = process.env.EMAIL_FROM || `Lac Hôtel <booking@lachotel.com>`;
  const emailInternalTo = process.env.EMAIL_INTERNAL_TO || siteConfig.email;
  const emailInternalCc = process.env.EMAIL_INTERNAL_CC || siteConfig.emailSecondary;

  const [clientHtml, internalHtml] = await Promise.all([
    render(BookingConfirmation({ booking: data }), { pretty: false }),
    render(BookingNotification({ booking: data, receivedAt: new Date().toISOString() }), {
      pretty: false,
    }),
  ]);

  const nights = computeNights(data.checkin, data.checkout);
  const subjectClient = buildClientSubject(data.locale, data.checkin, data.checkout);
  const subjectInternal = `[Résa] ${data.name} · ${data.checkin} → ${data.checkout} (${nights}n)`;

  try {
    const [clientResult, internalResult] = await Promise.all([
      resend.emails.send({
        from: emailFrom,
        to: data.email,
        replyTo: emailInternalTo,
        subject: subjectClient,
        html: clientHtml,
      }),
      resend.emails.send({
        from: emailFrom,
        to: emailInternalTo,
        cc: emailInternalCc,
        replyTo: data.email,
        subject: subjectInternal,
        html: internalHtml,
      }),
    ]);

    if (clientResult.error || internalResult.error) {
      console.error("[booking] Resend error:", clientResult.error || internalResult.error);
      return errorResponse(502, "email-failed", "L'envoi de l'email a échoué. Merci de réessayer.");
    }
  } catch (err) {
    console.error("[booking] Resend exception:", err);
    return errorResponse(502, "email-failed", "L'envoi de l'email a échoué. Merci de réessayer.");
  }

  // ─── 7. Push Google Sheet (best effort — non bloquant) ──
  await pushToGoogleSheet({
    timestamp: new Date().toISOString(),
    locale: data.locale,
    name: data.name,
    email: data.email,
    phone: data.phone,
    nationality: data.nationality,
    checkin: data.checkin,
    checkout: data.checkout,
    nights,
    guests: data.guests,
    adults: data.adults,
    children: data.children,
    rooms: data.rooms,
    room: data.room,
    pension: data.pension,
    rate: data.rate,
    transfer: data.transfer,
    arrivalTime: data.arrivalTime,
    message: data.message,
    ipHash,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  // ─── 8. Success ──────────────────────────────────────────
  return NextResponse.json({
    success: true,
    code: "ok",
    durationMs: Date.now() - startTime,
  });
}

// ─── Helpers ──────────────────────────────────────────────
function errorResponse(status: number, code: string, message: string): NextResponse {
  return NextResponse.json({ success: false, code, message }, { status });
}

function buildClientSubject(locale: string, ci: string, co: string): string {
  const dateRange = `${ci} → ${co}`;
  switch (locale) {
    case "en":
      return `Your booking request · Lac Hôtel Sahambavy (${dateRange})`;
    case "es":
      return `Su solicitud de reserva · Lac Hôtel Sahambavy (${dateRange})`;
    default:
      return `Votre demande de réservation · Lac Hôtel Sahambavy (${dateRange})`;
  }
}
