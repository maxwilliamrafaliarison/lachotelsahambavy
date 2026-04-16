/**
 * Hash SHA-256 salé d'une IP (RGPD — pas de stockage IP en clair).
 * Cf. Phase 6 §6.3 — Gouvernance RGPD.
 *
 * Utilisé uniquement comme identifiant anonyme pour le rate-limiting.
 * Le sel doit être défini via HASH_SALT (min 32 chars recommandé).
 */

import { createHash } from "node:crypto";

export function hashIp(ip: string | null | undefined): string {
  if (!ip) return "anonymous";
  const salt = process.env.HASH_SALT || "default-salt-change-me";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Extrait l'IP client depuis les headers standard (Vercel, Cloudflare, etc.).
 * Priorité : x-forwarded-for > x-real-ip > fallback.
 */
export function extractIp(headers: Headers): string | null {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    // Format : "client-ip, proxy-1, proxy-2…"
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = headers.get("x-real-ip");
  if (xri) return xri.trim();
  return null;
}
