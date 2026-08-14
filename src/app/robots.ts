import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

/**
 * Robots.txt généré dynamiquement.
 * Cf. Phase 5 §5.6 (SEO technique).
 *
 * `force-static` requis pour le mode `output: export` (GitHub Pages).
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* La page de confirmation de réservation n'est PAS listée ici : la
           règle « /reservation/confirmation/ » qui s'y trouvait ne visait
           aucune URL réelle, celles-ci étant préfixées par la langue
           (/fr/reservation/confirmation/). Elle n'a pas été corrigée mais
           supprimée : la page porte déjà un `robots: { index: false }`, et
           un Disallow empêcherait justement Googlebot de venir lire ce
           noindex. */
        /* « /_next/ » a été RETIRÉ le 14/08/2026, et il ne faut pas le
           remettre. Tout le rendu du site passe par ce préfixe : l'unique
           feuille de styles, le JavaScript, et surtout les images, servies
           par /_next/image (129 références sur la seule page d'accueil).

           Google applique la correspondance la plus longue : « Disallow:
           /_next/ » l'emportait sur « Allow: / » pour chacune de ces URL.
           Googlebot lisait donc le HTML, prérendu et indexable, mais ne
           pouvait charger ni la feuille de styles pour juger du rendu, ni
           une seule photo. Aucune image du site ne pouvait entrer dans
           Google Images, à commencer par les trente et une de la galerie,
           dont c'est pourtant la seule raison d'être.

           Les fichiers de /_next/static/ ne risquent rien : leurs types
           MIME ne sont pas indexables. */
        disallow: [
          "/api/",
          "/admin/",
          "/*?ref=*",
          "/*?utm_*",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
