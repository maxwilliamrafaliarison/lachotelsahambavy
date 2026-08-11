/**
 * Helper breadcrumbs trilingue : génère un trail localisé pour chaque page.
 * Cf. Phase 5 §5.6 (SEO technique).
 *
 * Usage :
 *   import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
 *   import { breadcrumbSchema } from "@/lib/schema-org";
 *
 *   const crumbs = buildBreadcrumb(locale, "restaurant");
 *   <JsonLd schemas={[breadcrumbSchema(crumbs)]} />
 */

import { siteConfig } from "@/data/site";
import type { Locale } from "@/lib/utils";

export type BreadcrumbKey =
  | "hotel"
  | "hebergements"
  | "restaurant"
  | "experiences"
  | "activites"
  | "plantation"
  | "galerie"
  | "contact"
  | "notre-equipe"
  | "le-repos"
  | "mariages-seminaires"
  | "train-fce"
  | "jardins"
  | "conditions";

type LocalizedLabel = Record<Locale, string>;

const HOME_LABEL: LocalizedLabel = {
  fr: "Accueil",
  en: "Home",
  es: "Inicio",
};

const PAGE_LABELS: Record<BreadcrumbKey, { slug: string; label: LocalizedLabel }> = {
  hotel: {
    slug: "hotel",
    label: { fr: "L'Hôtel", en: "The Hotel", es: "El Hotel" },
  },
  hebergements: {
    slug: "hebergements",
    label: { fr: "Hébergements", en: "Accommodations", es: "Alojamientos" },
  },
  restaurant: {
    slug: "restaurant",
    label: { fr: "Restaurant & Bar", en: "Restaurant & Bar", es: "Restaurante y Bar" },
  },
  experiences: {
    slug: "experiences",
    label: { fr: "Expériences", en: "Experiences", es: "Experiencias" },
  },
  activites: {
    slug: "activites",
    label: { fr: "Activités", en: "Activities", es: "Actividades" },
  },
  plantation: {
    slug: "plantation-de-the",
    label: { fr: "Plantation de thé", en: "Tea Plantation", es: "Plantación de té" },
  },
  galerie: {
    slug: "galerie",
    label: { fr: "Galerie", en: "Gallery", es: "Galería" },
  },
  contact: {
    slug: "contact",
    label: { fr: "Réserver", en: "Book", es: "Reservar" },
  },
  "notre-equipe": {
    slug: "notre-equipe",
    label: { fr: "Notre équipe", en: "Our team", es: "Nuestro equipo" },
  },
  "le-repos": {
    slug: "le-repos",
    label: { fr: "Le Repos", en: "Le Repos", es: "Le Repos" },
  },
  "mariages-seminaires": {
    slug: "mariages-seminaires",
    label: {
      fr: "Mariages & Séminaires",
      en: "Weddings & Seminars",
      es: "Bodas y Seminarios",
    },
  },
  "train-fce": {
    slug: "train-fce",
    label: { fr: "Train FCE", en: "FCE Train", es: "Tren FCE" },
  },
  jardins: {
    slug: "jardins",
    label: { fr: "Nos Jardins", en: "Our Gardens", es: "Nuestros Jardines" },
  },
  conditions: {
    slug: "conditions-reservation",
    label: {
      fr: "Conditions de réservation",
      en: "Booking conditions",
      es: "Condiciones de reserva",
    },
  },
};

export function buildBreadcrumb(
  locale: Locale,
  page: BreadcrumbKey
): Array<{ name: string; url: string }> {
  const root = `${siteConfig.url}/${locale}`;
  const page_ = PAGE_LABELS[page];

  return [
    { name: HOME_LABEL[locale], url: `${root}/` },
    { name: page_.label[locale], url: `${root}/${page_.slug}/` },
  ];
}
