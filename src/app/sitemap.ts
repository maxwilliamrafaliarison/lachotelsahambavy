import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { locales, defaultLocale } from "@/lib/utils";

/**
 * Sitemap généré avec hreflang FR/EN/ES + x-default.
 * Cf. Phase 5 §5.6 (SEO technique trilingue).
 *
 * Le `x-default` pointe vers la version FR (défaut éditorial).
 * `force-static` requis pour le mode `output: export` (GitHub Pages).
 */
export const dynamic = "force-static";

// Routes publiques du site (slugs internes, non localisés pour l'instant)
const publicRoutes = [
  { path: "", priority: 1.0, changeFreq: "weekly" as const },
  { path: "/hotel", priority: 0.9, changeFreq: "monthly" as const },
  { path: "/hebergements", priority: 0.95, changeFreq: "weekly" as const },
  { path: "/restaurant", priority: 0.85, changeFreq: "monthly" as const },
  { path: "/experiences", priority: 0.85, changeFreq: "monthly" as const },
  { path: "/plantation-de-the", priority: 0.9, changeFreq: "monthly" as const },
  { path: "/activites", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/train-fce", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/mariages-seminaires", priority: 0.75, changeFreq: "monthly" as const },
  { path: "/jardins", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/localisation", priority: 0.8, changeFreq: "yearly" as const },
  { path: "/le-repos", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/notre-equipe", priority: 0.6, changeFreq: "monthly" as const },
  { path: "/galerie", priority: 0.7, changeFreq: "weekly" as const },
  { path: "/contact", priority: 0.95, changeFreq: "monthly" as const },
  { path: "/conditions-reservation", priority: 0.3, changeFreq: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const lastModified = new Date();

  /* UNE ENTRÉE PAR COUPLE (LANGUE, PAGE), soit quarante-huit et non seize.

     Le sitemap ne déclarait que les seize URL françaises, chacune portant
     les alternates des trois langues. C'est une lecture courante mais
     fausse de la spécification : Google demande que CHAQUE page d'un
     groupe linguistique ait sa propre entrée <url>, portant le jeu complet
     d'alternates. Déclarées seulement en alternate, les trente-deux pages
     anglaises et espagnoles n'étaient jamais soumises pour exploration ;
     elles ne pouvaient être découvertes que par les liens du site.

     Barre finale obligatoire : le site tourne en `trailingSlash: true`, et
     des URL publiées sans barre pointeraient vers des redirections 308.
     L'accueil porte `path: ""` et non `"/"` : la barre ajoutée ici est la
     seule, il n'y a pas de doublon. */
  return publicRoutes.flatMap((route) => {
    const url = (locale: string) => `${baseUrl}/${locale}${route.path}/`;

    /* Le même jeu d'alternates sur les trois entrées du groupe, comme
       l'exige la spécification. x-default vise le français, langue
       éditoriale de référence, comme dans les métadonnées des pages. */
    const languages: Record<string, string> = { "x-default": url(defaultLocale) };
    for (const locale of locales) languages[locale] = url(locale);

    return locales.map((locale) => ({
      url: url(locale),
      lastModified,
      changeFrequency: route.changeFreq,
      /* Le français garde la priorité annoncée, les deux autres langues
         reçoivent un cran de moins : à contenu égal, c'est la version
         française que l'hôtel veut voir remonter en premier. */
      priority: locale === defaultLocale ? route.priority : Math.max(0.1, route.priority - 0.1),
      alternates: { languages },
    }));
  });
}
