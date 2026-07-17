import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Marqueur d'appareil connu — sert à n'alerter QUE sur les connexions
 * depuis un appareil/navigateur inconnu (modèle Google), plutôt qu'à chaque
 * connexion (choix de Max, 17/07/2026 : une alerte quotidienne finit ignorée).
 *
 * Sans base de données : un cookie signé HMAC-SHA256 avec AUTH_SECRET.
 * Sa simple présence — et sa signature valide — prouve que ce navigateur
 * s'est déjà connecté avec succès, donc qu'une alerte est déjà partie.
 * Un cookie forgé n'est pas signable sans AUTH_SECRET ; un cookie effacé
 * provoque une alerte de plus, jamais une alerte de moins.
 */
export const DEVICE_COOKIE = "lh-device";
export const DEVICE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an

function secret(): string {
  return process.env.AUTH_SECRET ?? "";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

/** Nouveau jeton d'appareil : "<aléa>.<signature>". */
export function createDeviceToken(): string {
  const id = randomBytes(16).toString("hex");
  return `${id}.${sign(id)}`;
}

/** Le jeton a-t-il été émis par nous ? (comparaison à temps constant) */
export function isKnownDevice(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [id, mac] = token.split(".");
  if (!id || !mac) return false;
  const expected = sign(id);
  const a = Buffer.from(mac, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
