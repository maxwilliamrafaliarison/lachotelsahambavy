/**
 * Vérification server-side du token hCaptcha.
 * Cf. Phase 7 §7.6.1 (CAPTCHA invisible).
 *
 * Si HCAPTCHA_SECRET n'est pas défini, on fait confiance (mode dev).
 */

interface HCaptchaVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  score?: number;
}

export async function verifyHCaptcha(
  token: string | undefined,
  remoteIp?: string
): Promise<{ valid: boolean; reason?: string }> {
  const secret = process.env.HCAPTCHA_SECRET;

  // Mode dev : pas de secret → on laisse passer.
  if (!secret) return { valid: true };

  if (!token) return { valid: false, reason: "missing-token" };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      // Pas de cache
      cache: "no-store",
    });
    if (!res.ok) return { valid: false, reason: `http-${res.status}` };
    const data = (await res.json()) as HCaptchaVerifyResponse;
    if (!data.success) {
      return { valid: false, reason: data["error-codes"]?.join(",") || "unknown" };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: "network-error" };
  }
}
