import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare, hashSync } from "bcryptjs";
import { hashIp, extractIp } from "@/lib/booking/hash-ip";
import { loginAttemptAllowed } from "@/lib/admin/rate-limit";

/**
 * Hash bcrypt VALIDE (cost 12) précalculé une fois au chargement du module.
 * Sert de repli quand l'e-mail est inconnu : compare() effectue alors le même
 * travail cryptographique (~200 ms) que pour un compte réel → pas d'oracle
 * temporel d'énumération d'e-mails. Un hash malformé serait rejeté en < 1 ms
 * par bcryptjs, rétablissant l'oracle. Cf. revue sécurité 16/07/2026.
 */
const DUMMY_HASH = hashSync("timing-attack-mitigation", 12);

/**
 * Authentification de l'espace admin (Phase 2 — simulateur proforma).
 *
 * Choix validé le 16/07/2026 : authentification complète par comptes
 * utilisateurs (et non mot de passe partagé). Les comptes vivent dans la
 * variable d'environnement ADMIN_USERS_JSON — pas de base de données à
 * maintenir pour 2-3 comptes :
 *
 *   ADMIN_USERS_JSON='[{"email":"maggie@lachotel.com","name":"Maggie","hash":"$2a$12$…"}]'
 *
 * Le hash bcrypt d'un mot de passe se génère avec :
 *   node scripts/hash-admin-password.mjs "le-mot-de-passe"
 *
 * L'espace admin n'existe que sur Vercel (le workflow GitHub Pages supprime
 * src/app/admin et src/app/api avant l'export statique).
 */

type AdminUser = { email: string; name: string; hash: string };

function loadUsers(): AdminUser[] {
  // Deux formes acceptées :
  // - ADMIN_USERS_JSON : le JSON brut (pratique dans le dashboard Vercel) ;
  // - ADMIN_USERS_B64  : le même JSON encodé base64 — OBLIGATOIRE dans un
  //   fichier .env* local, car dotenv-expand mange les « $ » des hash bcrypt.
  //   Encoder : node -e "console.log(Buffer.from(process.argv[1]).toString('base64'))" '<json>'
  const raw =
    process.env.ADMIN_USERS_JSON ??
    (process.env.ADMIN_USERS_B64
      ? Buffer.from(process.env.ADMIN_USERS_B64, "base64").toString("utf8")
      : "");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error("ADMIN_USERS_JSON / ADMIN_USERS_B64 invalide (JSON attendu)");
    return [];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 }, // 12 h — journée de travail
  pages: { signIn: "/admin/connexion" },
  trustHost: true,
  providers: [
    Credentials({
      name: "Compte Lac Hôtel",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, request) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        // Rate-limit par IP hachée + e-mail : bloque le brute-force / le
        // credential-stuffing avant même la comparaison bcrypt.
        const ip = extractIp(request.headers);
        const allowed = await loginAttemptAllowed(`${hashIp(ip)}:${email}`);
        if (!allowed) return null;

        const user = loadUsers().find((u) => u.email.toLowerCase() === email);
        // compare() contre un hash VALIDE même si l'utilisateur n'existe pas
        // → même coût cryptographique, pas d'oracle d'énumération d'e-mails.
        const ok = await compare(password, user?.hash ?? DUMMY_HASH);
        if (!user || !ok) return null;
        return { email: user.email, name: user.name };
      },
    }),
  ],
});
