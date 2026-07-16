export const siteConfig = {
  name: "Lac Hôtel Sahambavy",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lachotel.com",
  email: "booking@lachotel.com",
  emailSecondary: "lachotelsahambavy@gmail.com",
  phone: "(+261) 034 99 161 76",
  whatsapp: "+261349916176",
  whatsappDisplay: "(+261) 034 99 161 76",
  address: "Sahambavy, Fianarantsoa 301, Madagascar",
  geo: { lat: -21.0667, lng: 47.25 },
  social: {
    facebook: "https://www.facebook.com/lachotelsahambavy/",
    instagram: "https://www.instagram.com/lachotelsahambavy",
    tripadvisor:
      "https://www.tripadvisor.fr/Hotel_Review-g298271-d649892-Reviews-Lac_Hotel-Fianarantsoa_Fianarantsoa_Province.html",
    google: "https://maps.app.goo.gl/SoYLD9ifu8fVcgrt7",
    // URL canonique (langue-neutre) — Booking.com négocie automatiquement la
    // locale du visiteur (fr / en / es …). Confirmée en recherche Google.
    booking: "https://www.booking.com/hotel/mg/lac-sahambavy.html",
  },
  legal: {
    rcs: "2004-B-013",
    stat: "55221 21 1998 0 00025",
    nif: "3000204565",
  },
  ratings: {
    booking: { score: 9.0, total: 34, label: "Fabuleux" },
    google: { score: 4.6, total: 157 },
    tripadvisor: { score: 4.5, total: 229 },
  },
  specialOffer: {
    fr: "50 % sur la 2ᵉ nuitée pour toute réservation de 2 nuits consécutives",
    en: "50% off the 2nd night for any booking of 2 consecutive nights",
    es: "50 % en la 2.ª noche para cualquier reserva de 2 noches consecutivas",
  },
};

/**
 * Navigation globale du site — arborescence du document de référence de
 * Maggie (« TExte proposition de Maggie », 16/07/2026), qui fait foi.
 *
 * - Item AVEC `children` → méga-menu déroulant en desktop, accordéon en mobile.
 * - `primary: false` → entrée secondaire : footer + menu mobile uniquement.
 * - L'Accueil est porté par le logo ; le CTA « Réserver » (→ /contact) est
 *   rendu à part par la Navbar.
 */
export type NavLabel = { fr: string; en: string; es: string };
export type NavChild = { href: string; label: NavLabel };
export type NavItem = {
  href: string;
  label: NavLabel;
  children?: NavChild[];
  primary?: boolean;
};

export const navigation: NavItem[] = [
  {
    href: "/hotel",
    label: { fr: "Le Lac Hôtel", en: "The Lac Hôtel", es: "El Lac Hôtel" },
    children: [
      {
        href: "/hotel#philosophie",
        label: {
          fr: "Notre philosophie",
          en: "Our philosophy",
          es: "Nuestra filosofía",
        },
      },
      {
        href: "/hotel#histoire",
        label: {
          fr: "La petite histoire",
          en: "Our story",
          es: "Nuestra historia",
        },
      },
      {
        href: "/hotel#rse",
        label: {
          fr: "RSE & développement durable",
          en: "CSR & sustainability",
          es: "RSE y sostenibilidad",
        },
      },
      {
        href: "/notre-equipe",
        label: { fr: "L'équipe", en: "The team", es: "El equipo" },
      },
    ],
  },
  {
    href: "/hebergements",
    label: { fr: "Hébergements", en: "Accommodation", es: "Alojamientos" },
    children: [
      {
        href: "/hebergements#pilotis-nuptial",
        label: { fr: "Pilotis Nuptial", en: "Pilotis Nuptial", es: "Pilotis Nuptial" },
      },
      {
        href: "/hebergements#superior-lake-view",
        label: {
          fr: "Superior Lake View Room",
          en: "Superior Lake View Room",
          es: "Superior Lake View Room",
        },
      },
      {
        href: "/hebergements#bungalow-standard",
        label: { fr: "Bungalow standard", en: "Standard bungalow", es: "Bungaló estándar" },
      },
      {
        href: "/hebergements#wagon-nuptial",
        label: { fr: "Wagon Nuptial", en: "Wagon Nuptial", es: "Wagon Nuptial" },
      },
      {
        href: "/hebergements#bungalow-tarzan",
        label: {
          fr: "Bungalow Tarzan sur arbre",
          en: "Tarzan tree bungalow",
          es: "Bungaló Tarzán en árbol",
        },
      },
      {
        href: "/le-repos",
        label: {
          fr: "Extension « Le Repos »",
          en: "“Le Repos” extension",
          es: "Extensión «Le Repos»",
        },
      },
    ],
  },
  {
    href: "/restaurant",
    label: { fr: "Restaurant & Bar", en: "Restaurant & Bar", es: "Restaurante y Bar" },
  },
  {
    href: "/experiences",
    label: { fr: "Expériences", en: "Experiences", es: "Experiencias" },
    children: [
      {
        href: "/experiences#loisirs",
        label: { fr: "Loisirs", en: "Leisure", es: "Ocio" },
      },
      {
        href: "/experiences#massage",
        label: {
          fr: "Massages & bien-être",
          en: "Massages & wellness",
          es: "Masajes y bienestar",
        },
      },
      {
        href: "/experiences#salle-de-conference",
        label: {
          fr: "Salle de conférence",
          en: "Conference room",
          es: "Sala de conferencias",
        },
      },
      {
        href: "/experiences#mami-bio-shop",
        label: { fr: "Mami Bio Shop", en: "Mami Bio Shop", es: "Mami Bio Shop" },
      },
      {
        href: "/mariages-seminaires",
        label: { fr: "Mariage", en: "Weddings", es: "Bodas" },
      },
      {
        href: "/plantation-de-the",
        label: {
          fr: "La Plantation de thé de Sahambavy",
          en: "The Sahambavy tea plantation",
          es: "La plantación de té de Sahambavy",
        },
      },
      {
        href: "/experiences#riviere-matsiatra",
        label: {
          fr: "Descente de la Rivière Matsiatra",
          en: "Matsiatra River descent",
          es: "Descenso del río Matsiatra",
        },
      },
    ],
  },
  {
    href: "/train-fce",
    label: { fr: "Ligne ferroviaire FCE", en: "FCE railway line", es: "Línea férrea FCE" },
    children: [
      {
        href: "/train-fce#ligne-fce",
        label: { fr: "La ligne FCE", en: "The FCE line", es: "La línea FCE" },
      },
      {
        href: "/train-fce#draisine",
        label: {
          fr: "Location privative de la draisine",
          en: "Private draisine hire",
          es: "Alquiler privado de la dresina",
        },
      },
    ],
  },
  {
    href: "/jardins",
    label: { fr: "Nos Jardins", en: "Our Gardens", es: "Nuestros Jardines" },
    children: [
      {
        href: "/jardins#jardins-eden",
        label: { fr: "Jardins d'Éden", en: "Gardens of Eden", es: "Jardines del Edén" },
      },
      {
        href: "/jardins#village",
        label: {
          fr: "Le Village de Sahambavy",
          en: "Sahambavy village",
          es: "El pueblo de Sahambavy",
        },
      },
    ],
  },
  {
    href: "/localisation",
    label: { fr: "Localisation", en: "Location", es: "Ubicación" },
  },
  // Secondaires — footer + menu mobile uniquement
  {
    href: "/galerie",
    label: { fr: "Galerie", en: "Gallery", es: "Galería" },
    primary: false,
  },
  {
    href: "/contact",
    label: { fr: "Contactez-nous", en: "Contact us", es: "Contáctenos" },
    primary: false,
  },
  {
    href: "/conditions-reservation",
    label: {
      fr: "Conditions de réservation",
      en: "Booking conditions",
      es: "Condiciones de reserva",
    },
    primary: false,
  },
];
