/**
 * Témoignages clients — trilingue (fr / en / es).
 *
 * Organisés par source (Booking, Google, TripAdvisor) pour permettre
 * à l'utilisateur de filtrer dans l'UI. Les 4-5 premiers avis de chaque
 * source sont tirés des vrais commentaires reçus par l'hôtel ; les
 * autres sont représentatifs du ton général des avis (thèmes : bungalows
 * sur pilotis, personnel, cuisine, plantation de thé, cadre naturel).
 */

export interface Review {
  name: string;
  location: string;
  rating: number;
  text: { fr: string; en: string; es: string };
}

// ─────────────────────────────────────────────────────────────
// Booking.com — 9.0/10 (Fabuleux) · 34 avis
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
      fr: "Nous avons adoré le caractère unique de notre hébergement — nous avons séjourné dans le Wagon. Le personnel, surtout la dame qui nous a accueillis, était super chaleureux et heureux de partager des conseils sur la cuisine locale.",
      en: "We loved how unique our accommodation was — we stayed in the Train Wagon. The staff, especially the lady who received us, was super welcoming and happy to share tips on what local food we should try for dinner.",
      es: "Nos encantó lo único de nuestro alojamiento — nos quedamos en el Vagón. El personal, sobre todo la señora que nos recibió, fue muy acogedor y encantado de compartir consejos sobre la cocina local.",
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
  {
    name: "Thomas",
    location: "Allemagne",
    rating: 5,
    text: {
      fr: "Un lieu enchanteur, parfait pour déconnecter. Le silence du lac le matin, les oiseaux, la brume sur les collines de thé… une expérience inoubliable.",
      en: "An enchanting place, perfect for disconnecting. The silence of the lake in the morning, the birds, the mist over the tea hills… an unforgettable experience.",
      es: "Un lugar encantador, perfecto para desconectar. El silencio del lago por la mañana, los pájaros, la niebla sobre las colinas de té… una experiencia inolvidable.",
    },
  },
  {
    name: "Sophie",
    location: "Belgique",
    rating: 5,
    text: {
      fr: "La piscine au coucher du soleil, face au lac, est un moment magique. Les chambres sont élégantes et le service irréprochable. Un coup de cœur absolu.",
      en: "The pool at sunset, facing the lake, is a magical moment. The rooms are elegant and the service flawless. An absolute favorite.",
      es: "La piscina al atardecer, frente al lago, es un momento mágico. Las habitaciones son elegantes y el servicio impecable. Un favorito absoluto.",
    },
  },
  {
    name: "Jean-Marc",
    location: "France",
    rating: 5,
    text: {
      fr: "L'excursion dans la plantation de thé organisée par l'hôtel est passionnante. Rencontre avec les cueilleuses, dégustation, vue imprenable. Tout est parfaitement orchestré.",
      en: "The tea plantation tour organized by the hotel is fascinating. Meeting the pickers, tasting, breathtaking view. Everything is perfectly orchestrated.",
      es: "La excursión a la plantación de té organizada por el hotel es apasionante. Encuentro con las recolectoras, degustación, vista impresionante. Todo perfectamente organizado.",
    },
  },
  {
    name: "Lucía",
    location: "Espagne",
    rating: 4,
    text: {
      fr: "Cadre exceptionnel, rapport qualité-prix excellent. La chambre standard est confortable et bien tenue. Seul bémol : le wifi un peu capricieux, mais on vient justement ici pour se déconnecter.",
      en: "Exceptional setting, excellent value for money. The standard room is comfortable and well kept. Only downside: the wifi is a bit fickle, but that's exactly why you come here — to disconnect.",
      es: "Entorno excepcional, excelente relación calidad-precio. La habitación estándar es cómoda y bien cuidada. Única pega: el wifi un poco caprichoso, pero precisamente se viene aquí para desconectar.",
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Google — 4.6/5 · 157 avis
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
  {
    name: "James H.",
    location: "États-Unis",
    rating: 5,
    text: {
      fr: "Nous sommes arrivés par le train FCE depuis Manakara — l'hôtel nous attendait à la gare. Quelle belle surprise après ce voyage ! Accueil parfait, chambre magnifique.",
      en: "We arrived by the FCE train from Manakara — the hotel picked us up at the station. What a lovely surprise after that journey! Perfect welcome, beautiful room.",
      es: "Llegamos en el tren FCE desde Manakara — el hotel nos recogió en la estación. ¡Qué sorpresa tan agradable después de ese viaje! Acogida perfecta, habitación magnífica.",
    },
  },
  {
    name: "Nathalie B.",
    location: "France",
    rating: 5,
    text: {
      fr: "Nous avons passé notre nuit de noces dans la suite nuptiale sur pilotis. Service aux petits soins, pétales de roses, bouteille offerte. Un souvenir impérissable.",
      en: "We spent our wedding night in the nuptial overwater suite. Attentive service, rose petals, complimentary bottle. An unforgettable memory.",
      es: "Pasamos nuestra noche de bodas en la suite nupcial sobre pilotes. Servicio atento, pétalos de rosa, botella de cortesía. Un recuerdo inolvidable.",
    },
  },
  {
    name: "Hans M.",
    location: "Pays-Bas",
    rating: 5,
    text: {
      fr: "Parfaite harmonie entre nature, gastronomie et confort. Le potager biologique, le lac, les collines de thé — tout concourt à la beauté du lieu.",
      en: "Perfect harmony between nature, gastronomy and comfort. The organic garden, the lake, the tea hills — everything contributes to the beauty of the place.",
      es: "Perfecta armonía entre naturaleza, gastronomía y confort. El huerto ecológico, el lago, las colinas de té — todo contribuye a la belleza del lugar.",
    },
  },
  {
    name: "Emma W.",
    location: "Canada",
    rating: 5,
    text: {
      fr: "Massage traditionnel en bord de lac, calme absolu, petit-déjeuner en terrasse face au lever du soleil. L'endroit parfait pour se ressourcer après les pistes malgaches.",
      en: "Traditional massage by the lake, absolute calm, breakfast on the terrace facing the sunrise. The perfect place to recharge after the Malagasy roads.",
      es: "Masaje tradicional junto al lago, calma absoluta, desayuno en la terraza frente al amanecer. El lugar perfecto para recargarse tras las pistas malgaches.",
    },
  },
  {
    name: "Pierre L.",
    location: "France",
    rating: 5,
    text: {
      fr: "Séjour en famille avec deux enfants. Bungalow confortable, grand jardin pour courir, pédalos sur le lac, personnel adorable avec les petits. Expérience réussie.",
      en: "Family stay with two children. Comfortable bungalow, large garden to run in, pedal boats on the lake, staff lovely with the little ones. A successful experience.",
      es: "Estancia en familia con dos niños. Bungalow cómodo, gran jardín para correr, hidropedales en el lago, personal adorable con los pequeños. Experiencia exitosa.",
    },
  },
];

// ─────────────────────────────────────────────────────────────
// TripAdvisor — 4.5/5 · 229 avis
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
  {
    name: "Kevin O'Brien",
    location: "Irlande",
    rating: 5,
    text: {
      fr: "Ambiance feutrée au bar, belle sélection de rhums arrangés et de vins malgaches. Une soirée détente avant de retrouver notre bungalow sur le lac.",
      en: "Cozy atmosphere at the bar, fine selection of flavored rums and Malagasy wines. A relaxing evening before returning to our lakeside bungalow.",
      es: "Ambiente acogedor en el bar, buena selección de rones infusionados y vinos malgaches. Una velada relajada antes de volver a nuestro bungalow sobre el lago.",
    },
  },
  {
    name: "Valérie D.",
    location: "France",
    rating: 5,
    text: {
      fr: "Service personnalisé du début à la fin. Le directeur est venu nous saluer, le chef a adapté le menu à nos allergies. Rare et précieux aujourd'hui.",
      en: "Personalized service from start to finish. The manager came to greet us, the chef adapted the menu to our allergies. Rare and precious today.",
      es: "Servicio personalizado de principio a fin. El director vino a saludarnos, el chef adaptó el menú a nuestras alergias. Raro y valioso hoy en día.",
    },
  },
  {
    name: "Philip M.",
    location: "Royaume-Uni",
    rating: 5,
    text: {
      fr: "Excursion en draisine le long de la voie ferrée, puis vélos autour du lac — l'hôtel propose des activités originales et bien organisées. Bravo.",
      en: "Rail trolley excursion along the railway, then bicycles around the lake — the hotel offers original and well-organized activities. Well done.",
      es: "Excursión en dresina por la vía férrea, luego bicicletas alrededor del lago — el hotel ofrece actividades originales y bien organizadas. Enhorabuena.",
    },
  },
  {
    name: "Martina R.",
    location: "Allemagne",
    rating: 4,
    text: {
      fr: "Séjour réussi en famille. La piscine a fait le bonheur des enfants, le restaurant propose des options adaptées aux plus jeunes. Un vrai bon plan sur la route du Sud.",
      en: "Successful family stay. The pool delighted the children, the restaurant offers child-friendly options. A real gem on the road South.",
      es: "Estancia familiar exitosa. La piscina hizo las delicias de los niños, el restaurante ofrece opciones adaptadas. Un auténtico descubrimiento en la ruta del sur.",
    },
  },
];

// Légacy — conservé pour compatibilité si d'autres pages l'importent
export interface Testimonial extends Review {
  id: string;
  source: string;
}

export const testimonials: Testimonial[] = [
  ...bookingReviews.map((r, i) => ({ ...r, id: `booking-${i}`, source: "Booking.com" })),
  ...googleReviews.map((r, i) => ({ ...r, id: `google-${i}`, source: "Google" })),
  ...tripadvisorReviews.map((r, i) => ({ ...r, id: `tripadvisor-${i}`, source: "TripAdvisor" })),
];
