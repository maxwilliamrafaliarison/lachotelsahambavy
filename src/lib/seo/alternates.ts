/**
 * Helper canonique + hreflang, à appeler depuis le `generateMetadata` de
 * CHAQUE page. Cf. Phase 5 §5.6 (SEO technique trilingue).
 *
 * Usage :
 *   import { pageAlternates } from "@/lib/seo/alternates";
 *
 *   export async function generateMetadata({ params }) {
 *     const { locale } = await params;
 *     return {
 *       title: …,
 *       description: …,
 *       alternates: pageAlternates(locale as Locale, "restaurant"),
 *     };
 *   }
 *
 * POURQUOI PAS DANS LE LAYOUT [locale] ?
 * Le `generateMetadata` d'un layout ne reçoit que ses propres paramètres,
 * jamais le chemin de la page enfant : la valeur posée là serait héritée
 * telle quelle par les quinze pages intérieures, qui se déclareraient
 * toutes canoniques de l'accueil. Et la fusion des métadonnées de Next est
 * superficielle : un enfant qui redéfinit `alternates` écrase entièrement
 * celui du parent, sans fusion clé à clé. L'appel doit donc être posé page
 * par page.
 *
 * Forme des URL produites : apex sans « www », barre finale (le site tourne
 * en `trailingSlash: true`, toute URL sans barre est une redirection 308).
 */

import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { locales, defaultLocale, type Locale } from "@/lib/utils";

type Alternates = NonNullable<Metadata["alternates"]>;

/* Barre finale et « www. » retirés une fois pour toutes : `siteConfig.url`
   reste la source unique de l'origine, ici normalisée sur l'apex. */
const APEX = siteConfig.url.replace(/\/+$/, "").replace(/^(https?:\/\/)www\./i, "$1");

/**
 * URL absolue d'une page, dans une langue donnée.
 * `chemin` est le segment de la page sans barre ni langue (« restaurant »,
 * « plantation-de-the »). Chaîne vide pour l'accueil.
 */
export function pageUrl(locale: Locale, chemin: string): string {
  const segment = chemin.replace(/^\/+|\/+$/g, "");
  return segment ? `${APEX}/${locale}/${segment}/` : `${APEX}/${locale}/`;
}

/**
 * `{ canonical, languages }` prêt à être passé à `alternates`.
 * `x-default` pointe vers le français, langue éditoriale de référence,
 * comme dans le sitemap.
 */
export function pageAlternates(locale: Locale, chemin: string): Alternates {
  const languages: Partial<Record<Locale | "x-default", string>> = {
    "x-default": pageUrl(defaultLocale, chemin),
  };
  for (const l of locales) languages[l] = pageUrl(l, chemin);

  return {
    canonical: pageUrl(locale, chemin),
    languages,
  };
}
