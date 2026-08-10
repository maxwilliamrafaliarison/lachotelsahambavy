/**
 * Rate-limiting du login admin : défense brute-force / credential-stuffing.
 *
 * Deux couches :
 *  1. Upstash Redis (partagé entre instances serverless) si configuré :
 *     8 tentatives / 15 min par clé (IP hachée + e-mail).
 *  2. Repli mémoire best-effort (par instance) quand Upstash est absent :
 *     ne survit pas au cold-start ni au multi-instance, mais élève tout de
 *     même la barre en dev/preview et sur une instance chaude. Combiné à
 *     bcrypt cost 12 (~200 ms/essai), suffisant pour l'enjeu (outil interne,
 *     aucune donnée client). Cf. revue sécurité 16/07/2026.
 *
 * Contrairement au pipeline booking, on NE fail-open PAS silencieusement sur
 * un login : sans Upstash, le repli mémoire prend le relais.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

let upstash: Ratelimit | null = null;
let upstashTried = false;

function getUpstash(): Ratelimit | null {
  if (upstashTried) return upstash;
  upstashTried = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  upstash = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_ATTEMPTS, "15 m"),
    prefix: "admin-login:ratelimit",
  });
  return upstash;
}

/** Fenêtre glissante en mémoire, par clé. */
const memory = new Map<string, number[]>();

function memoryAllow(key: string): boolean {
  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_ATTEMPTS) {
    memory.set(key, hits);
    return false;
  }
  hits.push(now);
  memory.set(key, hits);
  // Purge opportuniste pour éviter une fuite mémoire sur les serveurs longue durée.
  if (memory.size > 5000) {
    for (const [k, v] of memory) {
      if (v.every((t) => now - t >= WINDOW_MS)) memory.delete(k);
    }
  }
  return true;
}

/** true = tentative autorisée ; false = quota dépassé (bloquer). */
export async function loginAttemptAllowed(key: string): Promise<boolean> {
  const rl = getUpstash();
  if (rl) {
    try {
      const { success } = await rl.limit(key);
      return success;
    } catch {
      // Upstash injoignable → bascule sur le repli mémoire plutôt que fail-open.
      return memoryAllow(key);
    }
  }
  return memoryAllow(key);
}
