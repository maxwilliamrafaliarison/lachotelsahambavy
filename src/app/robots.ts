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
        disallow: [
          "/api/",
          "/_next/",
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
