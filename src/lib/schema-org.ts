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
    /* Ces trois URL renvoyaient 404 — le préfixe « hero- » manquait. Le bloc
       étant injecté depuis [locale]/layout.tsx, l'erreur portait sur les
       ~51 pages du site, et `image` est un attribut REQUIS pour les
       résultats enrichis hôtel : le balisage était donc invalide partout.
       Repointé sur les vues réellement servies par le hero défilant. */
    image: [
      `${siteConfig.url}/images/hero/hotel-vu-du-lac-bungalows-pilotis.jpg`,
      `${siteConfig.url}/images/hero/hero-lever-de-soleil-lac.jpg`,
      `${siteConfig.url}/images/hero/hero-piscine-jardins.jpg`,
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

/**
 * Les hébergements n'ont PAS de page propre : ils sont tous présentés sur
 * /hebergements/, chacun dans sa section ancrée. On balise donc l'ancre
 * réelle, `…/hebergements/#pilotis-nuptial`, et non une URL par chambre —
 * celle-ci renvoyait 404, si bien que Google suivait le lien d'une fiche
 * qu'il venait de lire et tombait sur une page d'erreur. Les `id` des
 * sections de la page valent exactement `room.slug` : les deux doivent
 * être changés ensemble.
 */
function ancreChambre(room: Room, locale: Locale): string {
  return `${siteConfig.url}/${locale}/hebergements/#${room.slug}`;
}

export function hotelRoomSchema(room: Room, locale: Locale): SchemaType {
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "@id": ancreChambre(room, locale),
    name: room.name[locale],
    description: room.description[locale],
    url: ancreChambre(room, locale),
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
  const nom: Record<Locale, string> = {
    fr: `Restaurant du ${siteConfig.name}`,
    en: `${siteConfig.name} Restaurant`,
    es: `Restaurante del ${siteConfig.name}`,
  };

  const description: Record<Locale, string> = {
    fr: "Cuisine malgache et internationale au bord du lac Sahambavy. Spécialités : canard, poisson du lac, rhum arrangé maison.",
    en: "Malagasy and international cuisine on the shores of Lake Sahambavy. Specialties: duck, lake fish, house-infused rum.",
    es: "Cocina malgache e internacional a orillas del lago Sahambavy. Especialidades: pato, pescado del lago, ron casero infusionado.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteConfig.url}/${locale}/restaurant/#restaurant`,
    name: nom[locale],
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

/**
 * `chemin` est le segment de la page qui présente réellement l'attraction —
 * « restaurant », « plantation-de-the », « train-fce » — et non un slug
 * imaginaire sous /experiences/, qui n'a jamais existé et renvoyait 404.
 *
 * L'`@id` est construit sur ce même chemin : c'est voulu. La plantation et
 * le train sont balisés à la fois sur /experiences/ et sur leur propre
 * page ; le même identifiant des deux côtés dit à Google qu'il s'agit
 * d'une seule et même entité vue depuis deux pages, ce qui est le cas.
 */
export function touristAttractionSchema(args: {
  locale: Locale;
  chemin: string;
  name: string;
  description: string;
  image?: string;
}): SchemaType {
  const url = `${siteConfig.url}/${args.locale}/${args.chemin}/`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": `${url}#attraction`,
    name: args.name,
    description: args.description,
    url,
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
// VideoObject (section « Bienvenue » de l'accueil)
// =====================================================

/**
 * Schema VideoObject de la vidéo d'ambiance de la page d'accueil. Google
 * peut en tirer un résultat enrichi vidéo si les attributs requis sont
 * présents : name, description, thumbnailUrl, uploadDate. Les attributs
 * recommandés (contentUrl, duration) améliorent l'éligibilité.
 *
 * ATTENTION — ce schéma décrivait jusqu'au 08/08/2026 la vidéo drone du
 * hero, remplacée depuis par une photographie : il annonçait donc une
 * vidéo absente de la page. Il n'était heureusement émis nulle part, mais
 * un balisage qui ne correspond à aucun contenu visible est une donnée
 * structurée invalide, sanctionnée par Google. Il pointe désormais sur la
 * vidéo réellement présente dans la section « Bienvenue », et il est émis
 * depuis src/app/[locale]/page.tsx — l'accueil uniquement, jamais les
 * pages intérieures qui ne portent pas cette vidéo.
 *
 * Durée = PT30S (29,84 s mesurées après réencodage).
 *
 * Réf : https://developers.google.com/search/docs/appearance/structured-data/video
 */
export function videoObjectSchema(locale: Locale): SchemaType {
  const TITLES: Record<Locale, string> = {
    fr: "Vue aérienne par drone du Lac Hôtel Sahambavy",
    en: "Aerial drone view of Lac Hôtel Sahambavy",
    es: "Vista aérea con dron del Lac Hôtel Sahambavy",
  };
  const DESCRIPTIONS: Record<Locale, string> = {
    fr:
      "Survol du Lac Hôtel Sahambavy à Madagascar : le bâtiment principal aux teintes de terre cuite, les jardins tropicaux, la piscine et, à l’arrière-plan, les collines de l’unique plantation de thé de Madagascar. Filmé au drone.",
    en:
      "Flying over Lac Hôtel Sahambavy in Madagascar: the terracotta-toned main building, tropical gardens, swimming pool and, in the background, the hills of Madagascar's only tea plantation. Shot by drone.",
    es:
      "Sobrevuelo del Lac Hôtel Sahambavy en Madagascar: el edificio principal en tonos de terracota, los jardines tropicales, la piscina y, al fondo, las colinas de la única plantación de té de Madagascar. Filmado con dron.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${siteConfig.url}/${locale}/#video-bienvenue`,
    name: TITLES[locale],
    description: DESCRIPTIONS[locale],
    thumbnailUrl: `${siteConfig.url}/videos/bienvenue-lac-hotel.jpg`,
    contentUrl: `${siteConfig.url}/videos/bienvenue-lac-hotel.mp4`,
    uploadDate: "2026-08-08",
    duration: "PT30S",
    width: 480,
    height: 854,
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
