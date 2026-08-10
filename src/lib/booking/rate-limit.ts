/**
 * Rate-limiting via Upstash Redis (10 req / 10 min par IP hashée).
 * Cf. Phase 7 §7.6.2 (Anti-abus).
 *
 * Si UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN ne sont pas définis,
 * on retourne un "allow all" silencieux (mode dev / preview GitHub Pages).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (limiter) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 m"),
    analytics: true,
    prefix: "booking:ratelimit",
  });
  return limiter;
}

export async function rateLimitCheck(identifier: string): Promise<RateLimitResult> {
  const rl = getLimiter();
  if (!rl) {
    // Mode dev : pas de limiter configuré → on laisse passer.
    return { success: true, limit: 10, remaining: 10, reset: Date.now() + 600_000 };
  }
  try {
    const { success, limit, remaining, reset } = await rl.limit(identifier);
    return { success, limit, remaining, reset };
  } catch {
    // En cas d'erreur Upstash, on fail open pour ne pas bloquer les vrais clients.
    return { success: true, limit: 10, remaining: 10, reset: Date.now() + 600_000 };
  }
}
