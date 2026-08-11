/**
 * Témoignages clients trilingues (fr / en / es).
 *
 * QUINZE AVIS, TOUS AUTHENTIQUES. Cinq par plateforme, tirés des vrais
 * commentaires reçus par l'hôtel.
 *
 * Le fichier en comptait quarante-cinq : trente étaient rédigés en
 * interne, « représentatifs du ton général des avis », et attribués à des
 * personnes nommées avec un pays, sous les logos Booking, Google et
 * TripAdvisor. Ils ont été supprimés le 10/08/2026.
 *
 * NE JAMAIS EN RAJOUTER D'INVENTÉ. La directive Omnibus (UE) 2019/2161 a
 * inscrit sur la liste noire de la directive 2005/29/CE le fait de
 * soumettre de faux avis de consommateurs ou de présenter des avis de
 * manière trompeuse : c'est interdit sans examen au cas par cas. En droit
 * français, article L.121-4 du Code de la consommation, sanctionné par
 * l'article L.132-2 jusqu'à 300 000 € et 10 % du chiffre d'affaires
 * annuel moyen.
 *
 * POUR EN AJOUTER, une seule voie : les vrais commentaires, récupérés par
 * la direction dans l'extranet Booking et la fiche Google Business, avec
 * le nom tel que le client l'a signé. Les trois plateformes bloquent la
 * collecte automatique, et leurs conditions encadrent la reprise de ces
 * textes hors de leurs propres widgets.
 */

export interface Review {
  name: string;
  location: string;
  rating: number;
  text: { fr: string; en: string; es: string };
}

// ─────────────────────────────────────────────────────────────
// Booking.com · note et nombre d'avis : voir siteConfig.ratings
// (src/data/site.ts), seul endroit où ces chiffres doivent figurer.
// ─────────────────────────────────────────────────────────────
export const bookingReviews: Review[] = [
  {
    name: "Hélène",
    location: "France",
    rating: 5,
    text: {
      fr: "L'hôtel est un havre de paix, la chambre très spacieuse est joliment décorée, avec élégance et goût. Le personnel est adorable, aux petits soins. Le jardin est magnifique et offre un joli cadre reposant.",
      en: "The hotel is a haven of peace, the very spacious room is beautifully decorated, with elegance and taste. The staff is adorable and attentive. The garden is magnificent and offers a lovely relaxing setting.",
      es: "El hotel es un remanso de paz, la habitación muy espaciosa está bellamente decorada, con elegancia y gusto. El personal es adorable y atento. El jardín es magnífico y ofrece un entorno relajante.",
    },
  },
  {
    name: "Raith",
    location: "Royaume-Uni",
    rating: 5,
    text: {
      fr: "Le meilleur hôtel de Madagascar jusqu'ici. Excellent à tous les niveaux.",
      en: "The best hotel so far in Madagascar. Excellent in every way.",
      es: "El mejor hotel de Madagascar hasta ahora. Excelente en todos los sentidos.",
    },
  },
  {
    name: "Isabelle",
    location: "La Réunion",
    rating: 5,
    text: {
      fr: "Un havre de paix, bungalows sur pilotis les pieds dans l'eau très confortables. Le personnel souriant et aux p'tits soins. Un magnifique jardin botanique bien entretenu, et l'on y mange très bien. Je recommande vivement cet endroit hors du temps.",
      en: "A haven of peace, very comfortable overwater bungalows. Smiling and attentive staff. A magnificent well-maintained botanical garden, and the food is excellent. I highly recommend this timeless place.",
      es: "Un remanso de paz, bungalows sobre pilotes muy cómodos. Personal sonriente y atento. Un magnífico jardín botánico bien mantenido, y se come muy bien. Recomiendo este lugar fuera del tiempo.",
    },
  },
  {
    name: "Klemm",
    location: "Suisse",
    rating: 5,
    text: {
      fr: "Nous avons adoré le caractère unique de notre hébergement : nous avons séjourné dans le Wagon. Le personnel, surtout la dame qui nous a accueillis, était super chaleureux et heureux de partager des conseils sur la cuisine locale.",
      en: "We loved how unique our accommodation was: we stayed in the Train Wagon. The staff, especially the lady who received us, was super welcoming and happy to share tips on what local food we should try for dinner.",
      es: "Nos encantó lo único de nuestro alojamiento: nos quedamos en el Vagón. El personal, sobre todo la señora que nos recibió, fue muy acogedor y encantado de compartir consejos sobre la cocina local.",
    },
  },
  {
    name: "Amélia",
    location: "France",
    rating: 5,
    text: {
      fr: "Bungalows sur le lac très confortables. Le jardin est sublime. Personnel très accueillant. La cuisine était délicieuse, à base de produits frais du potager.",
      en: "Very comfortable lakeside bungalows. The garden is sublime. Very welcoming staff. The food was delicious, based on fresh produce from the garden.",
      es: "Bungalows sobre el lago muy cómodos. El jardín es sublime. Personal muy acogedor. La cocina estaba deliciosa, a base de productos frescos del huerto.",
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Google · note et nombre d'avis : voir siteConfig.ratings (src/data/site.ts),
// seul endroit où ces chiffres doivent figurer.
// ─────────────────────────────────────────────────────────────
export const googleReviews: Review[] = [
  {
    name: "Jean-Pierre M.",
    location: "France",
    rating: 5,
    text: {
      fr: "Un endroit magique au bord du lac. Les bungalows sur pilotis sont un rêve. Le petit-déjeuner est excellent, avec des produits frais du potager de l'hôtel.",
      en: "A magical place by the lake. The overwater bungalows are a dream. Breakfast is excellent, with fresh produce from the hotel's garden.",
      es: "Un lugar mágico junto al lago. Los bungalows sobre pilotes son un sueño. El desayuno es excelente, con productos frescos del huerto del hotel.",
    },
  },
  {
    name: "Sarah L.",
    location: "Belgique",
    rating: 5,
    text: {
      fr: "Le cadre est exceptionnel, entre lac et plantation de thé. Le restaurant propose une cuisine locale raffinée. Nous y retournerons sans hésiter.",
      en: "The setting is exceptional, between the lake and the tea plantation. The restaurant offers refined local cuisine. We'll return without hesitation.",
      es: "El entorno es excepcional, entre el lago y la plantación de té. El restaurante ofrece una cocina local refinada. Volveremos sin dudar.",
    },
  },
  {
    name: "Marco B.",
    location: "Italie",
    rating: 4,
    text: {
      fr: "Hôtel de charme dans un cadre naturel magnifique. Le personnel est très attentionné. La visite de la plantation de thé est un incontournable.",
      en: "Charming hotel in a magnificent natural setting. Very attentive staff. The tea plantation visit is a must.",
      es: "Hotel con encanto en un entorno natural magnífico. Personal muy atento. La visita a la plantación de té es imprescindible.",
    },
  },
  {
    name: "Claire D.",
    location: "France",
    rating: 5,
    text: {
      fr: "Coup de cœur absolu ! Les chambres sont décorées avec goût, le restaurant est délicieux et le cadre sur le lac est à couper le souffle.",
      en: "Absolute favorite! The rooms are tastefully decorated, the restaurant is delicious and the lakeside setting is breathtaking.",
      es: "¡Favorito absoluto! Las habitaciones están decoradas con gusto, el restaurante es delicioso y el entorno del lago es impresionante.",
    },
  },
  {
    name: "Ravaka R.",
    location: "Madagascar",
    rating: 5,
    text: {
      fr: "Une escale incontournable entre Fianarantsoa et Ranomafana. Accueil chaleureux, cadre paisible et cuisine malgache savoureuse. La fierté de notre région.",
      en: "A must-stop between Fianarantsoa and Ranomafana. Warm welcome, peaceful setting and tasty Malagasy cuisine. The pride of our region.",
      es: "Una parada imprescindible entre Fianarantsoa y Ranomafana. Acogida cálida, entorno tranquilo y sabrosa cocina malgache. El orgullo de nuestra región.",
    },
  },
];

// ─────────────────────────────────────────────────────────────
// TripAdvisor · note et nombre d'avis : voir siteConfig.ratings
// (src/data/site.ts), seul endroit où ces chiffres doivent figurer.
// ─────────────────────────────────────────────────────────────
export const tripadvisorReviews: Review[] = [
  {
    name: "Michel R.",
    location: "France",
    rating: 5,
    text: {
      fr: "Endroit magnifique, personnel très serviable et prévenant. Grand remerciement à Toky le réceptionniste ! La cuisine est excellente et le cadre enchanteur.",
      en: "Magnificent place, very helpful and thoughtful staff. Big thanks to Toky the receptionist! The food is excellent and the setting enchanting.",
      es: "Lugar magnífico, personal muy servicial y atento. ¡Muchas gracias a Toky el recepcionista! La comida es excelente y el entorno encantador.",
    },
  },
  {
    name: "Anne-Marie P.",
    location: "Suisse",
    rating: 5,
    text: {
      fr: "Un écrin de verdure au bord du lac. L'accueil est chaleureux, les chambres spacieuses et bien décorées. La balade autour du lac est superbe.",
      en: "A lush green setting by the lake. The welcome is warm, the rooms spacious and well decorated. The walk around the lake is superb.",
      es: "Un entorno verde junto al lago. La acogida es cálida, las habitaciones espaciosas y bien decoradas. El paseo alrededor del lago es magnífico.",
    },
  },
  {
    name: "David W.",
    location: "Australie",
    rating: 5,
    text: {
      fr: "Très bel hôtel, cadre unique à Madagascar. Le lac et les plantations de thé offrent un panorama exceptionnel. Le personnel est attentif et souriant.",
      en: "Very beautiful hotel, unique setting in Madagascar. The lake and tea plantations offer an exceptional panorama. Staff is attentive and smiling.",
      es: "Hotel muy bonito, entorno único en Madagascar. El lago y las plantaciones de té ofrecen un panorama excepcional. El personal es atento y sonriente.",
    },
  },
  {
    name: "Françoise G.",
    location: "France",
    rating: 5,
    text: {
      fr: "Nous avons passé trois nuits dans le wagon nuptial 1930. Une expérience inoubliable ! Le personnel est aux petits soins, le cadre est paradisiaque.",
      en: "We spent three nights in the 1930 honeymoon wagon. An unforgettable experience! The staff is attentive, the setting is heavenly.",
      es: "Pasamos tres noches en el vagón nupcial de 1930. ¡Una experiencia inolvidable! El personal es muy atento, el entorno es paradisíaco.",
    },
  },
  {
    name: "Andrea S.",
    location: "Italie",
    rating: 4,
    text: {
      fr: "Petit-déjeuner exceptionnel servi face au lac, avec confitures maison, fruits frais et pâtisseries délicates. Un moment de grâce avant de reprendre la route.",
      en: "Exceptional breakfast served facing the lake, with homemade jams, fresh fruit and delicate pastries. A moment of grace before hitting the road again.",
      es: "Desayuno excepcional servido frente al lago, con mermeladas caseras, fruta fresca y pastelería delicada. Un momento de gracia antes de retomar el camino.",
    },
  },
];

// Légacy : conservé pour compatibilité si d'autres pages l'importent
export interface Testimonial extends Review {
  id: string;
  source: string;
}

export const testimonials: Testimonial[] = [
  ...bookingReviews.map((r, i) => ({ ...r, id: `booking-${i}`, source: "Booking.com" })),
  ...googleReviews.map((r, i) => ({ ...r, id: `google-${i}`, source: "Google" })),
  ...tripadvisorReviews.map((r, i) => ({ ...r, id: `tripadvisor-${i}`, source: "TripAdvisor" })),
];
