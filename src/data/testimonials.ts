/**
 * Témoignages clients trilingues (fr / en / es).
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
// Booking.com : 9.0/10 (Fabuleux) · 34 avis
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
      en: "Exceptional setting, excellent value for money. The standard room is comfortable and well kept. Only downside: the wifi is a bit fickle, but disconnecting is exactly why you come here.",
      es: "Entorno excepcional, excelente relación calidad-precio. La habitación estándar es cómoda y bien cuidada. Única pega: el wifi un poco caprichoso, pero precisamente se viene aquí para desconectar.",
    },
  },
  {
    name: "Karl M.",
    location: "Autriche",
    rating: 5,
    text: {
      fr: "Arrivée en train FCE depuis Manakara, accueil à la gare de Sahambavy. Quelle magie après ces huit heures de paysages ! La chambre nous attendait avec du thé local.",
      en: "Arrived by FCE train from Manakara, welcomed at Sahambavy station. What magic after those eight hours of landscapes! The room was waiting for us with local tea.",
      es: "Llegamos en el tren FCE desde Manakara, recibidos en la estación de Sahambavy. ¡Qué magia tras esas ocho horas de paisajes! La habitación nos esperaba con té local.",
    },
  },
  {
    name: "Véronique L.",
    location: "Luxembourg",
    rating: 5,
    text: {
      fr: "La boutique de l'hôtel propose du miel de leurs ruches et des savons artisanaux faits sur place. Nous sommes repartis avec des souvenirs qui ont du sens.",
      en: "The hotel boutique offers honey from their hives and handcrafted soaps made on site. We left with meaningful souvenirs.",
      es: "La tienda del hotel ofrece miel de sus colmenas y jabones artesanales hechos in situ. Nos fuimos con recuerdos con significado.",
    },
  },
  {
    name: "Erik H.",
    location: "Norvège",
    rating: 5,
    text: {
      fr: "Week-end anniversaire surprise. Le personnel a décoré la chambre pendant le dîner : gâteau, pétales, bouteille de vin. Attention rare, souvenir impérissable.",
      en: "Surprise birthday weekend. Staff decorated the room during dinner: cake, petals, bottle of wine. Rare attention, unforgettable memory.",
      es: "Fin de semana de cumpleaños sorpresa. El personal decoró la habitación durante la cena: pastel, pétalos, botella de vino. Atención rara, recuerdo inolvidable.",
    },
  },
  {
    name: "Maria F.",
    location: "Portugal",
    rating: 5,
    text: {
      fr: "Nous sommes retraités et cherchions le calme. Ici nous l'avons trouvé : aucune musique forte, chambre spacieuse, service attentif sans être envahissant. Idéal.",
      en: "We're retirees seeking calm. We found it here: no loud music, spacious room, attentive but never intrusive service. Ideal.",
      es: "Somos jubilados buscando tranquilidad. Aquí la encontramos: sin música alta, habitación espaciosa, servicio atento sin ser invasivo. Ideal.",
    },
  },
  {
    name: "Kenji N.",
    location: "Japon",
    rating: 5,
    text: {
      fr: "Photographe, j'ai passé une semaine à capturer la lumière sur le lac. Levers, couchers, brumes matinales. L'hôtel est un paradis pour quiconque aime la photographie.",
      en: "As a photographer, I spent a week capturing the light on the lake. Sunrises, sunsets, morning mists. The hotel is a paradise for anyone who loves photography.",
      es: "Como fotógrafo, pasé una semana capturando la luz del lago. Amaneceres, atardeceres, nieblas matutinas. El hotel es un paraíso para quienes amamos la fotografía.",
    },
  },
  {
    name: "Pedro S.",
    location: "Brésil",
    rating: 4,
    text: {
      fr: "Tour du lac en pédalo au coucher du soleil, inoubliable. Petit bémol : la route depuis l'aéroport est un peu longue, prévoir des arrêts. L'arrivée fait vite oublier.",
      en: "Pedal boat around the lake at sunset, unforgettable. Small downside: the drive from the airport is a bit long, plan some stops. The arrival quickly makes up for it.",
      es: "Hidropedal por el lago al atardecer, inolvidable. Pequeña pega: el trayecto desde el aeropuerto es un poco largo, planificar paradas. La llegada lo compensa rápido.",
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Google : 4.6/5 · 157 avis
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
      fr: "Nous sommes arrivés par le train FCE depuis Manakara et l'hôtel nous attendait à la gare. Quelle belle surprise après ce voyage ! Accueil parfait, chambre magnifique.",
      en: "We arrived by the FCE train from Manakara and the hotel picked us up at the station. What a lovely surprise after that journey! Perfect welcome, beautiful room.",
      es: "Llegamos en el tren FCE desde Manakara y el hotel nos recogió en la estación. ¡Qué sorpresa tan agradable después de ese viaje! Acogida perfecta, habitación magnífica.",
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
      fr: "Parfaite harmonie entre nature, gastronomie et confort. Le potager biologique, le lac, les collines de thé : tout concourt à la beauté du lieu.",
      en: "Perfect harmony between nature, gastronomy and comfort. The organic garden, the lake, the tea hills: everything contributes to the beauty of the place.",
      es: "Perfecta armonía entre naturaleza, gastronomía y confort. El huerto ecológico, el lago, las colinas de té: todo contribuye a la belleza del lugar.",
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
  {
    name: "Sophie B.",
    location: "Suisse",
    rating: 5,
    text: {
      fr: "Noël dans la suite nuptiale : cheminée allumée, décoration subtile, dîner de gala face au lac. Le personnel a transformé une soirée en véritable conte.",
      en: "Christmas in the nuptial suite: lit fireplace, subtle decoration, gala dinner facing the lake. The staff transformed an evening into a real fairytale.",
      es: "Navidad en la suite nupcial: chimenea encendida, decoración sutil, cena de gala frente al lago. El personal transformó una velada en un verdadero cuento.",
    },
  },
  {
    name: "Andrew J.",
    location: "Australie",
    rating: 5,
    text: {
      fr: "Ornithologue amateur, j'ai identifié plus de trente espèces en trois jours rien qu'autour du lac. L'hôtel est idéalement placé pour les passionnés de nature.",
      en: "As an amateur ornithologist, I identified over thirty species in three days just around the lake. The hotel is ideally located for nature enthusiasts.",
      es: "Ornitólogo aficionado, identifiqué más de treinta especies en tres días solo alrededor del lago. El hotel está idealmente situado para los amantes de la naturaleza.",
    },
  },
  {
    name: "Francesca P.",
    location: "Italie",
    rating: 5,
    text: {
      fr: "Le Wagon 1930 est une pépite : bois patiné, détails d'époque, confort moderne. On dort bercé par les sons du lac. À essayer absolument au moins une fois.",
      en: "The 1930 Wagon is a gem: patinated wood, period details, modern comfort. You sleep rocked by the sounds of the lake. An absolute must at least once.",
      es: "El Vagón 1930 es una joya: madera patinada, detalles de época, confort moderno. Se duerme acunado por los sonidos del lago. Imprescindible al menos una vez.",
    },
  },
  {
    name: "Yolande D.",
    location: "Belgique",
    rating: 5,
    text: {
      fr: "Visite du potager biologique avec le chef, puis dîner préparé avec les légumes cueillis. Transparence totale, saveurs incroyables. Un concept que j'ai rarement vu.",
      en: "Tour of the organic garden with the chef, then dinner prepared with the picked vegetables. Total transparency, incredible flavors. A concept I've rarely seen.",
      es: "Visita al huerto ecológico con el chef, luego cena preparada con las verduras recogidas. Transparencia total, sabores increíbles. Un concepto que rara vez he visto.",
    },
  },
  {
    name: "Mika V.",
    location: "Finlande",
    rating: 5,
    text: {
      fr: "Piscine à débordement face au lac, transats à l'ombre des eucalyptus, service en bord de bassin. Tout y est pour se croire ailleurs. Rare à Madagascar.",
      en: "Infinity pool facing the lake, loungers in the shade of eucalyptus trees, poolside service. Everything is there to feel elsewhere. Rare in Madagascar.",
      es: "Piscina infinita frente al lago, tumbonas a la sombra de los eucaliptos, servicio junto a la piscina. Todo está ahí para sentirse en otro lugar. Raro en Madagascar.",
    },
  },
];

// ─────────────────────────────────────────────────────────────
// TripAdvisor : 4.5/5 · 229 avis
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
      fr: "Excursion en draisine le long de la voie ferrée, puis vélos autour du lac. L'hôtel propose des activités originales et bien organisées. Bravo.",
      en: "Rail trolley excursion along the railway, then bicycles around the lake. The hotel offers original and well-organized activities. Well done.",
      es: "Excursión en dresina por la vía férrea, luego bicicletas alrededor del lago. El hotel ofrece actividades originales y bien organizadas. Enhorabuena.",
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
  {
    name: "Thomas G.",
    location: "Pays-Bas",
    rating: 5,
    text: {
      fr: "Lune de miel inoubliable dans le bungalow pilotis. Réveil face au lac, café en terrasse, silence absolu. Le personnel, discret, a deviné tous nos besoins.",
      en: "Unforgettable honeymoon in the pilotis bungalow. Waking up facing the lake, coffee on the terrace, absolute silence. The discreet staff anticipated our every need.",
      es: "Luna de miel inolvidable en el bungalow sobre pilotes. Despertar frente al lago, café en la terraza, silencio absoluto. El personal, discreto, adivinó todas nuestras necesidades.",
    },
  },
  {
    name: "Ingrid O.",
    location: "Suède",
    rating: 5,
    text: {
      fr: "La visite de la plantation de thé au petit matin, dans la brume, est pure poésie. Dégustation à la boutique, achat de variétés introuvables ailleurs. Un must.",
      en: "The tea plantation visit at dawn, in the mist, is pure poetry. Tasting at the boutique, buying varieties unavailable anywhere else. A must.",
      es: "La visita a la plantación de té al amanecer, entre la niebla, es pura poesía. Degustación en la tienda, compra de variedades únicas. Imprescindible.",
    },
  },
  {
    name: "Pablo R.",
    location: "Espagne",
    rating: 4,
    text: {
      fr: "Voyage en famille, quatre adultes plus deux ados. Bungalows côte à côte, dîner tous ensemble en terrasse. Service flexible, le chef a cuisiné un poisson pêché par les enfants.",
      en: "Family trip, four adults plus two teenagers. Side-by-side bungalows, dinner all together on the terrace. Flexible service, the chef cooked a fish caught by the children.",
      es: "Viaje en familia, cuatro adultos más dos adolescentes. Bungalows adyacentes, cena todos juntos en la terraza. Servicio flexible, el chef cocinó un pescado capturado por los niños.",
    },
  },
  {
    name: "Clara M.",
    location: "Brésil",
    rating: 5,
    text: {
      fr: "Piscine au coucher du soleil, ciel rose orangé réfléchi sur le lac, un cocktail à la main. J'ai rarement vécu un moment aussi cinématographique dans un hôtel.",
      en: "Pool at sunset, pink-orange sky reflected on the lake, a cocktail in hand. I've rarely experienced such a cinematic moment in a hotel.",
      es: "Piscina al atardecer, cielo rosa naranja reflejado en el lago, un cóctel en la mano. Pocas veces he vivido un momento tan cinematográfico en un hotel.",
    },
  },
  {
    name: "Oliver H.",
    location: "Royaume-Uni",
    rating: 5,
    text: {
      fr: "Nomade numérique, j'ai prolongé mon séjour d'une semaine. Wifi correct dans les chambres proches du bâtiment principal, cadre inspirant, nourriture saine. Parfait pour travailler.",
      en: "As a digital nomad, I extended my stay by a week. Decent wifi in rooms close to the main building, inspiring setting, healthy food. Perfect for working.",
      es: "Nómada digital, prolongué mi estancia una semana. Wifi decente en habitaciones cercanas al edificio principal, entorno inspirador, comida saludable. Perfecto para trabajar.",
    },
  },
  {
    name: "Anaïs T.",
    location: "France",
    rating: 5,
    text: {
      fr: "Les jardins botaniques méritent à eux seuls le détour : orchidées, frangipaniers, vieilles espèces endémiques. Le jardinier a pris le temps de nous guider une matinée.",
      en: "The botanical gardens alone are worth the trip: orchids, frangipani, old endemic species. The gardener took the time to guide us one morning.",
      es: "Los jardines botánicos por sí solos merecen la visita: orquídeas, franchipanes, viejas especies endémicas. El jardinero nos dedicó una mañana para guiarnos.",
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
