import { Resend } from "resend";

/**
 * Alerte « connexion depuis un nouvel appareil » à l'espace équipe.
 *
 * Destinataires : Max + Maggie (choix du 17/07/2026). Paramétrable via
 * ADMIN_ALERT_TO (liste séparée par des virgules).
 *
 * Ne lève JAMAIS : une panne d'e-mail ne doit pas empêcher l'équipe de
 * travailler. En l'absence de RESEND_API_KEY, on trace dans les logs Vercel.
 */
type Contexte = {
  nom: string;
  email: string;
  role: string;
  ip: string | null;
  userAgent: string | null;
  date: Date;
};

const DESTINATAIRES_DEFAUT = ["max.fianar@gmail.com", "mleongformentin@gmail.com"];

/** « Chrome sur macOS » à partir d'un User-Agent, au mieux. */
function decritAppareil(ua: string | null): string {
  if (!ua) return "appareil inconnu";
  const nav = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : /Firefox\//.test(ua)
            ? "Firefox"
            : "navigateur inconnu";
  const os = /iPhone|iPad/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Mac OS X/.test(ua)
        ? "macOS"
        : /Windows/.test(ua)
          ? "Windows"
          : /Linux/.test(ua)
            ? "Linux"
            : "système inconnu";
  return `${nav} sur ${os}`;
}

function echappe(s: string): string {
  return s.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

export async function notifierNouvelleConnexion(ctx: Contexte): Promise<void> {
  const quand = ctx.date.toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Indian/Antananarivo",
  });
  const appareil = decritAppareil(ctx.userAgent);
  const profil = ctx.role === "admin" ? "Direction" : "Réception";

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(
      `[admin] Nouvelle connexion (e-mail non envoyé, RESEND_API_KEY absente) : ${ctx.nom} <${ctx.email}> · ${appareil} · ${quand}`
    );
    return;
  }

  const to = (process.env.ADMIN_ALERT_TO ?? DESTINATAIRES_DEFAUT.join(","))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (to.length === 0) return;

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#1B1B17;max-width:520px">
      <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#2F5D46;font-weight:600;margin:0 0 6px">
        Lac Hôtel · Espace équipe
      </p>
      <h1 style="font-size:22px;font-weight:400;margin:0 0 16px">Connexion depuis un nouvel appareil</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:9px 0;border-bottom:1px solid #E7E4DC;color:#726E64">Compte</td>
            <td style="padding:9px 0;border-bottom:1px solid #E7E4DC;text-align:right;font-weight:600">${echappe(ctx.nom)}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #E7E4DC;color:#726E64">Identifiant</td>
            <td style="padding:9px 0;border-bottom:1px solid #E7E4DC;text-align:right">${echappe(ctx.email)}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #E7E4DC;color:#726E64">Profil</td>
            <td style="padding:9px 0;border-bottom:1px solid #E7E4DC;text-align:right">${profil}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #E7E4DC;color:#726E64">Appareil</td>
            <td style="padding:9px 0;border-bottom:1px solid #E7E4DC;text-align:right">${echappe(appareil)}</td></tr>
        <tr><td style="padding:9px 0;border-bottom:1px solid #E7E4DC;color:#726E64">Adresse IP</td>
            <td style="padding:9px 0;border-bottom:1px solid #E7E4DC;text-align:right">${echappe(ctx.ip ?? "inconnue")}</td></tr>
        <tr><td style="padding:9px 0;color:#726E64">Date</td>
            <td style="padding:9px 0;text-align:right">${echappe(quand)}</td></tr>
      </table>
      <p style="font-size:13px;color:#4A4A44;line-height:1.6;margin:20px 0 0">
        Vous ne recevez cette alerte que lors d'une connexion depuis un appareil inconnu —
        pas à chaque connexion.
      </p>
      <p style="font-size:13px;color:#4A4A44;line-height:1.6;margin:10px 0 0">
        <strong>Si cette connexion vous est étrangère</strong>, changez le mot de passe du compte
        concerné (script <code>generer-comptes-vercel.sh</code>, puis redéploiement Vercel).
      </p>
    </div>`;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Lac Hôtel <booking@lachotel.com>",
      to,
      subject: `[Espace équipe] Nouvelle connexion — ${ctx.nom} (${appareil})`,
      html,
    });
    if (error) console.error("[admin] Resend a refusé l'alerte de connexion :", error);
  } catch (e) {
    // Jamais bloquant pour la connexion.
    console.error("[admin] Envoi de l'alerte de connexion impossible :", e);
  }
}
