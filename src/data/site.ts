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
    // TODO: remplacer par l'URL exacte de la fiche Booking.com une fois confirmée.
    booking:
      "https://www.booking.com/searchresults.html?ss=Lac+H%C3%B4tel+Sahambavy",
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

export const navigation = [
  { href: "/", label: { fr: "Accueil", en: "Home", es: "Inicio" } },
  { href: "/hotel", label: { fr: "L'Hôtel", en: "The Hotel", es: "El Hotel" } },
  { href: "/hebergements", label: { fr: "Séjourner", en: "Stay", es: "Alojarse" } },
  { href: "/experiences", label: { fr: "Expériences", en: "Experiences", es: "Experiencias" } },
  { href: "/galerie", label: { fr: "Galerie", en: "Gallery", es: "Galería" } },
  { href: "/contact", label: { fr: "Réserver", en: "Book", es: "Reservar" } },
];
