/**
 * Générateurs JSON-LD Schema.org pour le Lac Hôtel Sahambavy.
 * Cf. Phase 5 §5.6 — SEO technique trilingue.
 *
 * Tous les helpers retournent un objet sérialisable à injecter via <JsonLd>.
 *
 * Schemas supportés :
 *   - LodgingBusiness (homepage)
 *   - HotelRoom (page chambre)
 *   - Restaurant (page restaurant)
 *   - TouristAttraction (expériences)
 *   - AggregateRating (avis consolidés)
 *   - Review (témoignage individuel)
 *   - BreadcrumbList (fil d'Ariane)
 *   - FAQPage
 *   - ImageGallery
 *   - WebSite + SearchAction
 *   - Organization
 */

import { siteConfig } from "@/data/site";
import type { Locale } from "@/lib/utils";
import type { Room } from "@/data/rooms";

// =====================================================
// Types
// =====================================================

type SchemaType = Record<string, unknown>;

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ReviewItem {
  author: string;
  rating: number;
  ratingMax?: number;
  text: string;
  date?: string;
  language?: string;
}

// =====================================================
// AggregateRating (consolidé Google + Tripadvisor + Booking)
// =====================================================

/**
 * Agrégats officiels collectés le 16/04/2026 (cf. _RESSOURCES/18_AVIS_CLIENTS).
 *   - Google     : 4,6 / 5 · 157 avis
 *   - Tripadvisor: 4,1 / 5 · 229 avis
 *   - Booking    : 9,0 / 10 · 34 avis (= 4,5 / 5)
 *   - Pondéré    : 4,3 / 5 · 420 avis
 */
export const AGGREGATE_RATING = {
  ratingValue: 4.3,
  reviewCount: 420,
  bestRating: 5,
  worstRating: 1,
} as const;

export function aggregateRatingSchema(): SchemaType {
  return {
    "@type": "AggregateRating",
    ratingValue: AGGREGATE_RATING.ratingValue.toString(),
    reviewCount: AGGREGATE_RATING.reviewCount.toString(),
    bestRating: AGGREGATE_RATING.bestRating.toString(),
    worstRating: AGGREGATE_RATING.worstRating.toString(),
  };
}

// =====================================================
// Organization (commune à toutes les pages via WebSite)
// =====================================================

export function organizationSchema(): SchemaType {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/logo/logo-color.png`,
      width: 769,
      height: 837,
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.tripadvisor,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "reservations",
      availableLanguage: ["French", "English", "Spanish", "Malagasy"],
      email: siteConfig.email,
    },
  };
}

// =====================================================
// LodgingBusiness (homepage + about)
// =====================================================

export function lodgingBusinessSchema(locale: Locale): SchemaType {
  const description: Record<Locale, string> = {
    fr: "Éco-lodge de charme au bord du lac Sahambavy, à 45 min de Fianarantsoa. Bungalows sur pilotis, restaurant panoramique, plantation de thé et accès direct à la ligne ferroviaire FCE.",
    en: "Boutique eco-lodge on the shores of Lake Sahambavy, 45 min from Fianarantsoa. Overwater bungalows, panoramic restaurant, tea plantation and direct access to the FCE railway line.",
    es: "Eco-lodge boutique a orillas del lago Sahambavy, a 45 min de Fianarantsoa. Bungalows sobre pilotes, restaurante panorámico, plantación de té y acceso directo a la línea ferroviaria FCE.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${siteConfig.url}/#lodging`,
    name: siteConfig.name,
    description: description[locale],
    url: `${siteConfig.url}/${locale}/`,
    image: [
      `${siteConfig.url}/images/hero/pilotis.jpg`,
      `${siteConfig.url}/images/hero/sunset.jpg`,
      `${siteConfig.url}/images/hero/lake.jpg`,
    ],
    logo: `${siteConfig.url}/images/logo/logo-color.png`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sahambavy",
      addressLocality: "Sahambavy",
      addressRegion: "Haute Matsiatra",
      postalCode: "301",
      addressCountry: "MG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    priceRange: "€€",
    starRating: { "@type": "Rating", ratingValue: "3" },
    aggregateRating: aggregateRatingSchema(),
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free WiFi (restaurant)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
      { "@type": "LocationFeatureSpecification", name: "Bar", value: true },
      { "@type": "LocationFeatureSpecification", name: "Lake views", value: true },
      { "@type": "LocationFeatureSpecification", name: "Tea plantation", value: true },
    ],
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.tripadvisor,
      siteConfig.social.google,
    ],
    checkinTime: "14:00",
    checkoutTime: "11:00",
    petsAllowed: false,
    smokingAllowed: false,
    numberOfRooms: 24,
  };
}

// =====================================================
// HotelRoom (page chambre individuelle)
// =====================================================

export function hotelRoomSchema(room: Room, locale: Locale): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "@id": `${siteConfig.url}/${locale}/hebergements/${room.slug}/#room`,
    name: room.name[locale],
    description: room.description[locale],
    url: `${siteConfig.url}/${locale}/hebergements/${room.slug}/`,
    image: room.images.map((img) => `${siteConfig.url}${img}`),
    occupancy: {
      "@type": "QuantitativeValue",
      value: parseInt(room.capacity, 10) || 2,
    },
    bed: {
      "@type": "BedDetails",
      typeOfBed: room.type[locale],
    },
    amenityFeature: room.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.label[locale],
    })),
    isPartOf: { "@id": `${siteConfig.url}/#lodging` },
    offers: room.priceAR
      ? {
          "@type": "Offer",
          priceCurrency: "MGA",
          price: room.priceAR,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: room.priceAR,
            priceCurrency: "MGA",
            unitCode: "DAY",
          },
          availability: "https://schema.org/InStock",
          url: `${siteConfig.url}/${locale}/contact/?room=${room.slug}`,
        }
      : undefined,
  };
}

// =====================================================
// Restaurant (page restaurant)
// =====================================================

export function restaurantSchema(locale: Locale): SchemaType {
  const description: Record<Locale, string> = {
    fr: "Cuisine malgache et internationale au bord du lac Sahambavy. Spécialités : canard, poisson du lac, rhum arrangé maison.",
    en: "Malagasy and international cuisine on the shores of Lake Sahambavy. Specialties: duck, lake fish, house-infused rum.",
    es: "Cocina malgache e internacional a orillas del lago Sahambavy. Especialidades: pato, pescado del lago, ron casero infusionado.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteConfig.url}/${locale}/restaurant/#restaurant`,
    name: `${siteConfig.name} — Restaurant`,
    description: description[locale],
    url: `${siteConfig.url}/${locale}/restaurant/`,
    image: [`${siteConfig.url}/images/restaurant/interior.jpg`],
    servesCuisine: ["Malagasy", "French", "International"],
    priceRange: "€€",
    acceptsReservations: true,
    hasMenu: `${siteConfig.url}/${locale}/restaurant/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sahambavy",
      addressRegion: "Haute Matsiatra",
      addressCountry: "MG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:00",
        closes: "22:00",
      },
    ],
    isPartOf: { "@id": `${siteConfig.url}/#lodging` },
  };
}

// =====================================================
// TouristAttraction (page expérience)
// =====================================================

export function touristAttractionSchema(args: {
  locale: Locale;
  slug: string;
  name: string;
  description: string;
  image?: string;
}): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": `${siteConfig.url}/${args.locale}/experiences/${args.slug}/#attraction`,
    name: args.name,
    description: args.description,
    url: `${siteConfig.url}/${args.locale}/experiences/${args.slug}/`,
    image: args.image ? `${siteConfig.url}${args.image}` : undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sahambavy",
      addressRegion: "Haute Matsiatra",
      addressCountry: "MG",
    },
  };
}

// =====================================================
// BreadcrumbList
// =====================================================

export function breadcrumbSchema(items: BreadcrumbItem[]): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// =====================================================
// FAQPage
// =====================================================

export function faqSchema(items: FaqItem[]): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// =====================================================
// Review (témoignage individuel)
// =====================================================

export function reviewSchema(review: ReviewItem): SchemaType {
  return {
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating.toString(),
      bestRating: (review.ratingMax ?? 5).toString(),
      worstRating: "1",
    },
    reviewBody: review.text,
    datePublished: review.date,
    inLanguage: review.language,
  };
}

// =====================================================
// WebSite (root, avec SearchAction potentielle)
// =====================================================

export function websiteSchema(locale: Locale): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: locale,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

// =====================================================
// ImageGallery (page galerie)
// =====================================================

export function imageGallerySchema(args: {
  locale: Locale;
  name: string;
  description: string;
  images: { url: string; caption?: string }[];
}): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${siteConfig.url}/${args.locale}/galerie/#gallery`,
    name: args.name,
    description: args.description,
    url: `${siteConfig.url}/${args.locale}/galerie/`,
    associatedMedia: args.images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: `${siteConfig.url}${img.url}`,
      caption: img.caption,
    })),
  };
}

// =====================================================
// VideoObject (hero d'accueil — plan drone Sahambavy)
// =====================================================

/**
 * Schema VideoObject pour la vidéo hero de la homepage. Google peut
 * indexer cette entrée dans les résultats vidéo enrichis (rich snippets)
 * si les attributs requis sont présents : name, description, thumbnailUrl,
 * uploadDate. Les attributs recommandés (contentUrl, duration, embedUrl)
 * améliorent le taux d'éligibilité.
 *
 * Durée = PT24S (palindrome 12 s × 2 aller-retour côté ffmpeg).
 *
 * Réf : https://developers.google.com/search/docs/appearance/structured-data/video
 */
export function videoObjectSchema(locale: Locale): SchemaType {
  const TITLES: Record<Locale, string> = {
    fr: "Lac Hôtel Sahambavy — vue drone aérienne",
    en: "Lac Hôtel Sahambavy — aerial drone view",
    es: "Lac Hôtel Sahambavy — vista aérea con dron",
  };
  const DESCRIPTIONS: Record<Locale, string> = {
    fr:
      "Survol cinématique du Lac Hôtel Sahambavy à Madagascar. Bungalows sur pilotis au bord du lac, collines verdoyantes et plantation de thé — la seule de Madagascar — en arrière-plan. Filmé au drone.",
    en:
      "Cinematic drone flight over Lac Hôtel Sahambavy in Madagascar. Overwater pilotis bungalows on the lake, green hills and tea plantation — the only one in Madagascar — in the background.",
    es:
      "Vuelo cinematográfico con dron sobre el Lac Hôtel Sahambavy en Madagascar. Bungalows sobre pilotes al borde del lago, colinas verdes y plantación de té — la única de Madagascar — al fondo.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${siteConfig.url}/${locale}/#hero-video`,
    name: TITLES[locale],
    description: DESCRIPTIONS[locale],
    thumbnailUrl: `${siteConfig.url}/videos/hero-drone-poster.jpg`,
    contentUrl: `${siteConfig.url}/videos/hero-drone.mp4`,
    uploadDate: "2026-04-17",
    duration: "PT24S",
    width: 1600,
    height: 900,
    encodingFormat: "video/mp4",
    inLanguage: locale,
    isFamilyFriendly: true,
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}#organization`,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo/logo-color.png`,
      },
    },
    contentLocation: {
      "@type": "Place",
      name: "Sahambavy, Fianarantsoa, Madagascar",
      geo: {
        "@type": "GeoCoordinates",
        latitude: siteConfig.geo.lat,
        longitude: siteConfig.geo.lng,
      },
    },
  };
}
