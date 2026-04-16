import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { locales, defaultLocale } from "@/lib/utils";

/**
 * Sitemap généré avec hreflang FR/EN/ES + x-default.
 * Cf. Phase 5 §5.6 — SEO technique trilingue.
 *
 * Le `x-default` pointe vers la version FR (défaut éditorial).
 * `force-static` requis pour le mode `output: export` (GitHub Pages).
 */
export const dynamic = "force-static";

// Routes publiques du site (slugs internes — non localisés pour l'instant)
const publicRoutes = [
  { path: "", priority: 1.0, changeFreq: "weekly" as const },
  { path: "/hotel", priority: 0.9, changeFreq: "monthly" as const },
  { path: "/hebergements", priority: 0.95, changeFreq: "weekly" as const },
  { path: "/restaurant", priority: 0.85, changeFreq: "monthly" as const },
  { path: "/experiences", priority: 0.85, changeFreq: "monthly" as const },
  { path: "/plantation-de-the", priority: 0.9, changeFreq: "monthly" as const },
  { path: "/activites", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/le-repos", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/notre-equipe", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/galerie", priority: 0.7, changeFreq: "weekly" as const },
  { path: "/contact", priority: 0.95, changeFreq: "monthly" as const },
  { path: "/conditions-reservation", priority: 0.3, changeFreq: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const lastModified = new Date();

  return publicRoutes.map((route) => {
    // URL canonique = version par défaut (FR)
    const canonicalUrl = `${baseUrl}/${defaultLocale}${route.path}`;

    // Alternates hreflang : toutes les langues + x-default
    const languages: Record<string, string> = {
      "x-default": canonicalUrl,
    };
    for (const locale of locales) {
      languages[locale] = `${baseUrl}/${locale}${route.path}`;
    }

    return {
      url: canonicalUrl,
      lastModified,
      changeFrequency: route.changeFreq,
      priority: route.priority,
      alternates: { languages },
    };
  });
}
