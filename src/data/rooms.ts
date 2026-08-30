export interface Room {
  id: string;
  slug: string;
  name: { fr: string; en: string; es: string };
  type: { fr: string; en: string; es: string };
  badge?: string;
  description: { fr: string; en: string; es: string };
  longDescription?: { fr: string; en: string; es: string };
  units: number;
  capacity: string;
  surface?: string;
  priceEUR: number | null;
  priceAR: number;
  amenities: { icon: string; label: { fr: string; en: string; es: string } }[];
  images: string[];
  featured?: boolean;
  category?: "hotel" | "repos";
  /**
   * Ordre d'affichage voulu par la direction (08/08/2026) : les hébergements
   * courants d'abord, du plus cher au moins cher, puis les deux hébergements
   * d'exception, puis l'extension Le Repos.
   */
  groupe?: "courant" | "exception" | "repos";
  /**
   * Localisation à signaler explicitement : pastille posée SUR la photo.
   * La villa basse n'est pas dans l'enceinte principale mais à l'annexe
   * « Le Repos », à 800 m : un client qui réserve sans le savoir découvre
   * la marche à l'arrivée. La pastille éditoriale sous la photo ne suffit
   * pas, elle se lit comme un label de gamme.
   */
  localisation?: { fr: string; en: string; es: string };
  /**
   * Tarif agence HT (« PRIX AGV HT » des tarifs officiels). Conservé pour la
   * facturation interne : il n'est JAMAIS affiché sur le site public, seul le
   * tarif public l'est (arbitrage direction du 08/08/2026).
   */
  priceARTO?: number;
}

export const rooms: Room[] = [
  {
    /* Catégorie créée au tarif 2027 : deux Pilotis (chambres 11 et 13) sont
       montés en Lake Suite, et le parc Pilotis passe de 9 à 7.
       PAS ENCORE AFFICHÉE : la direction publie la grille 2026 (arbitrage
       du 08/08/2026). D'où l'absence de `groupe` : la fiche est prête, il
       suffira de lui rendre `groupe: "courant"`, de remonter le wagon à
       420 000 / 84 € et les Pilotis à 7 unités le jour du basculement. */
    id: "lake-suite",
    slug: "lake-suite-nuptial",
    name: {
      fr: "Lake Suite Nuptial Pilotis",
      en: "Overwater Honeymoon Lake Suite",
      es: "Lake Suite Nupcial sobre Pilotes",
    },
    type: {
      fr: "Double King Size 2 m × 2,20 m",
      en: "Double King Size 2 m × 2.20 m",
      es: "Doble King Size 2 m × 2,20 m",
    },
    badge: "Suite",
    description: {
      fr: "Les deux suites nuptiales les plus vastes de l'hôtel, chambres 11 et 13, avancées sur le lac. Lit King Size de 2 m × 2,20 m, salle de bain privative avec eau chaude, terrasse face à l'eau.",
      en: "The hotel's two largest honeymoon suites, rooms 11 and 13, extending over the lake. King Size bed 2 m × 2.20 m, private bathroom with hot water, terrace facing the water.",
      es: "Las dos suites nupciales más amplias del hotel, habitaciones 11 y 13, sobre el lago. Cama King Size de 2 m × 2,20 m, baño privado con agua caliente, terraza frente al agua.",
    },
    longDescription: {
      fr: "Chambres 11 et 13 : les deux plus belles adresses du ponton. Elles reprennent du Pilotis Nuptial le bois précieux, les sculptures d'artisans betsileo et l'eau sous le plancher, avec l'espace en plus.\n\nLa terrasse privative donne plein lac, sans vis-à-vis. C'est la catégorie que nous réservons aux voyages de noces et aux séjours d'exception.",
      en: "Rooms 11 and 13: the two finest addresses on the pontoon. They carry over the Honeymoon Overwater Bungalow's precious wood, Betsileo artisan carvings and water beneath the floor, with more space besides.\n\nThe private terrace opens straight onto the lake, with no facing neighbour. This is the category we keep for honeymoons and special occasions.",
      es: "Habitaciones 11 y 13: las dos mejores direcciones del pontón. Heredan del Bungalow Nupcial sobre Pilotes la madera preciosa, las esculturas de artesanos betsileo y el agua bajo el suelo, con más espacio todavía.\n\nLa terraza privada da de lleno al lago, sin vecinos enfrente. Es la categoría que reservamos a las lunas de miel y las estancias excepcionales.",
    },
    units: 2,
    capacity: "2",
    priceEUR: 84,
    priceAR: 420000,
    priceARTO: 300000,
    amenities: [
      { icon: "bed", label: { fr: "Lit King Size 2 m × 2,20 m", en: "King Size bed 2 m × 2.20 m", es: "Cama King Size 2 m × 2,20 m" } },
      { icon: "water", label: { fr: "Sur l'eau", en: "Overwater", es: "Sobre el agua" } },
      { icon: "bath", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "tv", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
      { icon: "house", label: { fr: "Terrasse privative face au lac", en: "Private lake-facing terrace", es: "Terraza privada frente al lago" } },
    ],
    images: [
      "/images/rooms/pilotis-chambre-baldaquin-vue-lac.jpg",
      "/images/rooms/pilotis-lit-vue.jpg",
      "/images/rooms/pilotis-chambre-meridienne-mur-ocre.jpg",
      "/images/rooms/lit-baldaquin-linge-brode-cygnes.jpg",
      "/images/rooms/pilotis-salle-de-bain-bois.jpg",
      "/images/rooms/pilotis-lake-view.jpg",
      "/images/rooms/pilotis-crepuscule-rose-lac.jpg",
    ],
    featured: true,
    category: "hotel",
  },
  {
    id: "pilotis",
    slug: "pilotis-nuptial",
    name: {
      fr: "Pilotis Nuptial",
      en: "Honeymoon Overwater Bungalow",
      es: "Bungalow Nupcial sobre Pilotes",
    },
    type: {
      fr: "Double · Twin · Single",
      en: "Double · Twin · Single",
      es: "Doble · Twin · Single",
    },
    badge: "Signature",
    description: {
      fr: "Bungalows sur pilotis directement sur le lac Sahambavy. Lit spacieux de 2,20 m × 2,20 m, salle de bain privative avec eau chaude, terrasse avec vue sur le lac.",
      en: "Overwater bungalows on Lake Sahambavy. Spacious 2.20 m × 2.20 m bed, private bathroom with hot water, terrace with lake view.",
      es: "Bungalows sobre pilotes directamente en el lago Sahambavy. Cama amplia de 2,20 m × 2,20 m, baño privado con agua caliente, terraza con vistas al lago.",
    },
    /* LA PHRASE SUR LA TÉLÉVISION ET LE WI-FI A ÉTÉ RETIRÉE (29/08/2026).
       Le chapô de /hebergements (dict.rooms.intro) l'énonce déjà pour tout
       l'hôtel, quelques centimètres plus haut sur la même page : « Chaque
       chambre est équipée d'une télévision ; l'accès au Wi-Fi est
       disponible uniquement dans la salle de restauration. » Elle figurait
       ici une seconde fois, presque mot pour mot. */
    longDescription: {
      fr: "Nos bungalows nuptiaux sur pilotis sont l'expérience la plus immersive du Lac Hôtel Sahambavy. Construits en bois précieux, ils s'avancent directement sur le lac, vous offrant un panorama époustouflant sur l'eau et les montagnes.\n\nChaque bungalow est décoré avec des matériaux et des sculptures artisanales réalisées par des artisans malgaches locaux.",
      en: "Our honeymoon overwater bungalows are the most immersive experience at Lac Hôtel Sahambavy. Built with precious wood, they extend directly over the lake, offering breathtaking panoramic views of the water and mountains.\n\nEach bungalow is decorated with materials and artisan sculptures crafted by local Malagasy artisans.",
      es: "Nuestros bungalows nupciales sobre pilotes son la experiencia más inmersiva del Lac Hôtel Sahambavy. Construidos en madera preciosa, se adentran directamente en el lago, ofreciendo un panorama impresionante del agua y las montañas.\n\nCada bungalow está decorado con materiales y esculturas artesanales de artesanos malgaches locales.",
    },
    units: 9,
    capacity: "2",
    priceEUR: 72,
    priceAR: 360000,
    priceARTO: 250000,
    amenities: [
      { icon: "bed", label: { fr: "Lit 2,20 × 2,20 m", en: "Bed 2.20 × 2.20 m", es: "Cama 2,20 × 2,20 m" } },
      { icon: "water", label: { fr: "Sur l'eau", en: "Overwater", es: "Sobre el agua" } },
      { icon: "bath", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "tv", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
      { icon: "house", label: { fr: "Terrasse vue lac", en: "Lake view terrace", es: "Terraza vista lago" } },
      { icon: "wifi", label: { fr: "Wi-Fi au restaurant", en: "Wi-Fi at restaurant", es: "Wi-Fi en restaurante" } },
    ],
    groupe: "courant",
    images: [
      "/images/rooms/pilotis-01.jpg",
      "/images/rooms/pilotis-chambre-baldaquin-vue-lac.jpg",
      "/images/rooms/pilotis-chambre-meridienne-mur-ocre.jpg",
      "/images/rooms/pilotis-lit-vue.jpg",
      "/images/rooms/lit-baldaquin-linge-brode-cygnes.jpg",
      "/images/rooms/pilotis-suite-bed.jpg",
      "/images/rooms/pilotis-02.jpg",
      "/images/rooms/pilotis-03.jpg",
      "/images/rooms/pilotis-lake-view.jpg",
      "/images/rooms/pilotis-kim-0015.jpg",
      "/images/rooms/pilotis-kim-0025.jpg",
      "/images/rooms/pilotis-kim-0035.jpg",
      "/images/rooms/pilotis-kim-0037.jpg",
      "/images/rooms/pilotis-kim-0040.jpg",
      "/images/rooms/pilotis-salle-de-bain-bois.jpg",
      "/images/rooms/salle-de-bain-pilotis-double-vasque.jpg",
      "/images/rooms/salle-de-bain-artisanale-01.jpg",
      "/images/rooms/pilotis-detail-moustiquaire-mur-ocre.jpg",
      "/images/rooms/pilotis-detail-moustiquaire-lampe-baobab.jpg",
      "/images/rooms/pilotis-crepuscule-rose-lac.jpg",
      "/images/rooms/allee-pierre-bungalows-pilotis.jpg",
    ],
    featured: true,
    category: "hotel",
  },
  {
    id: "superior",
    slug: "superior-lake-view",
    name: {
      fr: "Superior Lake View Room",
      en: "Superior Lake View Room",
      es: "Habitación Superior Vista al Lago",
    },
    type: {
      fr: "Chambre supérieure",
      en: "Superior room",
      es: "Habitación superior",
    },
    description: {
      fr: "8 chambres face à la piscine et au lac. Confort européen haut de gamme avec parquet en bois précieux et terrasse.",
      en: "8 rooms facing the pool and lake. High-end European comfort with precious wood parquet and terrace.",
      es: "8 habitaciones frente a la piscina y el lago. Confort europeo de alta gama con parquet de madera preciosa y terraza.",
    },
    longDescription: {
      fr: "Construites récemment, les Superior Lake View Rooms offrent un confort européen haut de gamme avec vue imprenable sur la piscine et le lac. Chaque chambre dispose d'un superbe parquet en bois précieux, d'une salle de bain privative avec eau chaude et d'une terrasse privée avec vue sur le lac.\n\nFace à la piscine en ardoise à eau salée, ces chambres combinent confort moderne et cadre naturel exceptionnel.",
      en: "Recently built, the Superior Lake View Rooms offer high-end European comfort with stunning views of the pool and lake. Each room features beautiful precious wood parquet, a private bathroom with hot water and a private terrace with lake views.\n\nFacing the saltwater slate pool, these rooms combine modern comfort with an exceptional natural setting.",
      es: "Construidas recientemente, las Superior Lake View Rooms ofrecen confort europeo de alta gama con vistas impresionantes a la piscina y el lago. Cada habitación cuenta con parquet de madera preciosa, baño privado con agua caliente y terraza privada con vistas al lago.\n\nFrente a la piscina de pizarra de agua salada, estas habitaciones combinan confort moderno y un entorno natural excepcional.",
    },
    units: 8,
    capacity: "2",
    surface: "25m²",
    priceEUR: 60,
    priceAR: 300000,
    priceARTO: 210000,
    amenities: [
      { icon: "bed", label: { fr: "Lit 2,20 × 2,20 m", en: "Bed 2.20 × 2.20 m", es: "Cama 2,20 × 2,20 m" } },
      { icon: "pool", label: { fr: "Vue piscine & lac", en: "Pool & lake view", es: "Vista piscina y lago" } },
      { icon: "wood", label: { fr: "Parquet bois précieux", en: "Precious wood parquet", es: "Parquet madera preciosa" } },
      { icon: "bath", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "tv", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
      { icon: "wifi", label: { fr: "Wi-Fi au restaurant", en: "Wi-Fi at restaurant", es: "Wi-Fi en restaurante" } },
    ],
    groupe: "courant",
    images: [
      "/images/rooms/superior-chambre-01.jpg",
      "/images/rooms/superior-chambre-02.jpg",
      "/images/rooms/superior-chambre-03.jpg",
      "/images/rooms/superior-chambre-04.jpg",
      "/images/rooms/superior-01.jpg",
      "/images/rooms/superior-02.jpg",
      "/images/rooms/superior-kim-0064.jpg",
      "/images/rooms/superior-lit-linge-brode-logo.jpg",
      "/images/rooms/superior-terrasse-vue-piscine-jardins.jpg",
      "/images/rooms/superior-terrasse-table-vue-piscine.jpg",
      "/images/rooms/terrasse-chambre-vue-piscine-jardins.jpg",
      "/images/rooms/superior-petit-dejeuner-terrasse.jpg",
      "/images/rooms/salle-de-bain-artisanale-02.jpg",
      "/images/rooms/chambre-detail-bouquet-mur-ocre.jpg",
      "/images/rooms/chambre-detail-numero-azulejo.jpg",
    ],
    category: "hotel",
  },
  {
    id: "wagon",
    slug: "wagon-nuptial-1930",
    name: {
      fr: "Wagon Nuptial 1930",
      en: "1930 Honeymoon Wagon",
      es: "Vagón Nupcial 1930",
    },
    type: {
      fr: "Expérience unique",
      en: "Unique experience",
      es: "Experiencia única",
    },
    badge: "Unique",
    description: {
      fr: "Wagon suisse de 1930 rénové, 30 m de longueur. Service en chambre, mini-bar, terrasse privée et vue sur le lac.",
      en: "Renovated 1930 Swiss wagon, 30 m long. Room service, mini-bar, private terrace and lake view.",
      es: "Vagón suizo de 1930 renovado, 30 m de longitud. Servicio de habitaciones, mini-bar, terraza privada y vista al lago.",
    },
    longDescription: {
      fr: "Dormez dans un authentique wagon suisse de 1930 entièrement rénové en suite nuptiale de luxe. Avec ses 30 mètres de longueur, ce wagon unique en son genre vous transporte dans une autre époque tout en vous offrant le confort moderne.\n\nService en chambre, mini-bar, terrasse privée fleurie et vue sur le lac. Une nuit dans ce wagon est une expérience inoubliable, idéale pour un voyage de noces ou une célébration.",
      en: "Sleep in an authentic 1930 Swiss wagon fully renovated into a luxury honeymoon suite. At 30 metres long, this one-of-a-kind wagon transports you to another era while offering modern comfort.\n\nRoom service, mini-bar, private flowered terrace and lake view. A night in this wagon is an unforgettable experience, ideal for a honeymoon or celebration.",
      es: "Duerma en un auténtico vagón suizo de 1930 completamente renovado en suite nupcial de lujo. Con sus 30 metros de longitud, este vagón único le transporta a otra época ofreciendo confort moderno.\n\nServicio de habitaciones, minibar, terraza privada florida y vista al lago. Una noche en este vagón es una experiencia inolvidable, ideal para una luna de miel o una celebración.",
    },
    units: 1,
    capacity: "2",
    surface: "30m linéaires",
    priceEUR: 72,
    priceAR: 360000,
    priceARTO: 250000,
    amenities: [
      { icon: "train", label: { fr: "Wagon suisse 1930, 30 m", en: "1930 Swiss wagon, 30 m", es: "Vagón suizo 1930, 30 m" } },
      { icon: "bed", label: { fr: "Lit double", en: "Double bed", es: "Cama doble" } },
      { icon: "drinks", label: { fr: "Mini-bar inclus", en: "Mini-bar included", es: "Mini-bar incluido" } },
      { icon: "flower", label: { fr: "Terrasse privée fleurie", en: "Flowered private terrace", es: "Terraza privada florida" } },
      { icon: "utensils", label: { fr: "Service en chambre", en: "Room service", es: "Servicio de habitaciones" } },
      { icon: "water", label: { fr: "Vue sur le lac", en: "Lake view", es: "Vista al lago" } },
    ],
    groupe: "exception",
    images: [
      "/images/rooms/wagon-exterieur-jardin.jpg",
      "/images/rooms/wagon-chambre-lit.jpg",
      "/images/rooms/wagon-salon-bar.jpg",
      "/images/rooms/wagon-salon-detail.jpg",
      "/images/rooms/wagon-salle-de-bain.jpg",
      "/images/rooms/wagon-douche.jpg",
    ],
    category: "hotel",
  },
  {
    id: "familial",
    slug: "pilotis-familial",
    name: {
      fr: "Pilotis Familial",
      en: "Family Overwater Bungalow",
      es: "Bungalow Familiar sobre Pilotes",
    },
    type: {
      fr: "Familial",
      en: "Family",
      es: "Familiar",
    },
    badge: "Famille",
    description: {
      fr: "Bungalow sur pilotis spacieux pour les familles. Lit spacieux, salle de bain privative, terrasse avec vue sur le lac.",
      en: "Spacious overwater bungalow for families. Spacious bed, private bathroom, terrace with lake view.",
      es: "Bungalow sobre pilotes espacioso para familias. Cama amplia, baño privado, terraza con vistas al lago.",
    },
    units: 9, // configuration du Pilotis Nuptial, pas un parc distinct
    capacity: "4",
    priceEUR: 72,
    priceAR: 360000,
    priceARTO: 250000,
    amenities: [
      { icon: "family", label: { fr: "Jusqu'à 4 personnes", en: "Up to 4 people", es: "Hasta 4 personas" } },
      { icon: "water", label: { fr: "Sur l'eau", en: "Overwater", es: "Sobre el agua" } },
      { icon: "bath", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "tv", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
      { icon: "house", label: { fr: "Terrasse vue lac", en: "Lake view terrace", es: "Terraza vista lago" } },
    ],
    images: [
      "/images/rooms/superior-chambre-03.jpg",
      "/images/rooms/superior-chambre-04.jpg",
      "/images/rooms/terrasse-chambre-vue-piscine-jardins.jpg",
      "/images/rooms/salle-de-bain-artisanale-03.jpg",
    ],
    featured: true,
    category: "hotel",
  },
  {
    id: "standard",
    slug: "bungalow-standard",
    name: {
      fr: "Bungalow Standard",
      en: "Standard Bungalow",
      es: "Bungalow Estándar",
    },
    type: {
      fr: "Double · Twin · Single",
      en: "Double · Twin · Single",
      es: "Doble · Twin · Single",
    },
    description: {
      fr: "Bungalows dans un jardin tropical. Double, twin ou single, confort authentique malgache avec salle de bain privative.",
      en: "Bungalows in a tropical garden. Double, twin or single, authentic Malagasy comfort with private bathroom.",
      es: "Bungalows en un jardín tropical. Doble, twin o single, confort auténtico malgache con baño privado.",
    },
    longDescription: {
      fr: "Nos bungalows standards sont disséminés dans un jardin tropical luxuriant. Construits en matériaux locaux, ils offrent un confort authentique et chaleureux en harmonie totale avec la nature malgache.\n\nDisponibles en version double, twin ou single, ils conviennent aussi bien aux voyageurs solo qu'aux couples. Chaque bungalow est équipé d'une salle de bain privative avec eau chaude et d'une télévision.",
      en: "Our standard bungalows are scattered throughout a lush tropical garden. Built with local materials, they offer authentic and warm comfort in total harmony with Malagasy nature.\n\nAvailable in double, twin or single, they suit solo travellers and couples alike. Each bungalow has a private bathroom with hot water and a television.",
      es: "Nuestros bungalows estándar están diseminados en un exuberante jardín tropical. Construidos con materiales locales, ofrecen un confort auténtico y cálido en armonía total con la naturaleza malgache.\n\nDisponibles en versión doble, twin o single, convienen tanto a viajeros en solitario como a parejas. Cada bungalow dispone de baño privado con agua caliente y televisión.",
    },
    units: 26,
    capacity: "1-2",
    surface: "16m²",
    priceEUR: 30,
    priceAR: 150000,
    priceARTO: 90000,
    amenities: [
      { icon: "bed", label: { fr: "Double, twin ou single", en: "Double, twin or single", es: "Doble, twin o single" } },
      { icon: "ruler", label: { fr: "16m²", en: "16m²", es: "16m²" } },
      { icon: "palm", label: { fr: "Jardin tropical", en: "Tropical garden", es: "Jardín tropical" } },
      { icon: "bath", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "tv", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
    ],
    groupe: "courant",
    /* Deux vues seulement, retenues par la direction le 09/08/2026 : les
       quatre autres montraient des bungalows qui ne sont plus dans cet
       état, ou faisaient doublon. */
    images: [
      "/images/rooms/standard-annexe-kim-0047.jpg",
      "/images/rooms/bungalows-colores-annexe.jpg",
    ],
    category: "hotel",
  },
  {
    id: "arbre",
    slug: "bungalow-sur-arbre",
    name: {
      fr: "Bungalow Tarzan sur Arbre",
      en: "Tarzan Treehouse Bungalow",
      es: "Bungalow Tarzán en el Árbol",
    },
    type: {
      fr: "Bungalow enfant",
      en: "Kids bungalow",
      es: "Bungalow infantil",
    },
    description: {
      fr: "Bungalow perché pour enfants, single ou double. Une aventure unique dans les arbres du jardin tropical.",
      en: "Perched bungalow for kids, single or double. A unique adventure in the tropical garden trees.",
      es: "Bungalow elevado para niños, single o doble. Una aventura única en los árboles del jardín tropical.",
    },
    /* UN SEUL bungalow sur arbre, et non deux (direction, 29/08/2026). Le
       parc en annonçait deux depuis l'origine ; tous les textes qui en
       parlaient au pluriel ont été repris avec ce chiffre. */
    units: 1,
    capacity: "1-2",
    priceEUR: 30,
    priceAR: 150000,
    priceARTO: 90000,
    amenities: [
      { icon: "tree", label: { fr: "Dans les arbres", en: "In the trees", es: "En los árboles" } },
      { icon: "baby", label: { fr: "Pour enfants", en: "For kids", es: "Para niños" } },
    ],
    groupe: "exception",
    images: [
      "/images/rooms/tarzan-cabane-ciel-bleu.jpg",
      "/images/rooms/tarzan-toit-chaume-sculptures.jpg",
      "/images/rooms/tarzan-cabane-lumiere-doree.jpg",
      "/images/rooms/tarzan-interieur-bambou.jpg",
      "/images/rooms/tarzan-escalier-colimacon.jpg",
      "/images/rooms/tarzan-porte-sculptee-terrasse.jpg",
    ],
    category: "hotel",
  },
  {
    id: "villa-repos",
    slug: "villa-basse-kitchenette",
    name: {
      fr: "Villa basse avec kitchenette",
      en: "Low Villa with Kitchenette",
      es: "Villa baja con cocina americana",
    },
    type: {
      fr: "Extension « Le Repos »",
      en: "“Le Repos” Extension",
      es: "Extensión «Le Repos»",
    },
    /* Pas de `badge` ici : il répétait « Extension Le Repos » en français dans
       les trois langues, juste à côté du `type` ci-dessus qui dit la même
       chose et qui, lui, est traduit. */
    description: {
      fr: "4 maisons en duplex entièrement équipées pour les longs séjours. Kitchenette avec plaque de cuisson, réfrigérateur et vaisselle. Idéal pour les familles.",
      en: "4 fully equipped duplex houses for extended stays. Kitchenette with hob, fridge and crockery. Ideal for families.",
      es: "4 casas dúplex totalmente equipadas para estancias prolongadas. Cocina americana con placa, nevera y vajilla. Ideal para familias.",
    },
    units: 4,
    capacity: "5",
    priceEUR: 50,
    priceAR: 250000,
    priceARTO: 170000,
    amenities: [
      { icon: "house", label: { fr: "Duplex 2 étages", en: "2-storey duplex", es: "Dúplex 2 plantas" } },
      { icon: "cooking", label: { fr: "Kitchenette complète", en: "Full kitchenette", es: "Cocina americana completa" } },
      { icon: "family", label: { fr: "Jusqu'à 5 personnes", en: "Up to 5 people", es: "Hasta 5 personas" } },
      { icon: "bath", label: { fr: "Salle de bain privée", en: "Private bathroom", es: "Baño privado" } },
    ],
    localisation: {
      fr: "Annexe Le Repos · 800 m",
      en: "Le Repos annexe · 800 m",
      es: "Anexo Le Repos · 800 m",
    },
    groupe: "repos",
    /* Reportage Mamiarisolo commandé par l'hôtel (dossier « Repos et Lac
       Hotel »). Le filigrane d'auteur a été retiré avec l'accord de la
       direction : le photographe a été rémunéré et la cession des droits
       figure au contrat. */
    images: [
      "/images/rooms/villa-basse-facade-fenetres-cintrees.jpg",
      "/images/rooms/villa-basse-chambre-trois-lits.jpg",
      "/images/rooms/villa-basse-chambre-moustiquaire.jpg",
      "/images/rooms/villa-basse-kitchenette-coin-repas.jpg",
      "/images/rooms/villa-basse-kitchenette-refrigerateur.jpg",
      "/images/rooms/le-repos-vue-aerienne-lac.jpg",
    ],
    category: "repos",
  },
];

export const extras = {
  taxeSejour: { priceAR: 5000, label: { fr: "Taxe de séjour", en: "Tourist tax", es: "Tasa turística" } },
  extraBed: { priceAR: 30000, label: { fr: "Lit supplémentaire", en: "Extra bed", es: "Cama supletoria" } },
  breakfast: { priceAR: 40000, label: { fr: "Petit-déjeuner complet", en: "Full breakfast", es: "Desayuno completo" } },
  menu: { priceAR: 70000, label: { fr: "Menu", en: "Menu", es: "Menú" } },
  picnic: { priceAR: 40000, label: { fr: "Pique-nique complet", en: "Full picnic", es: "Picnic completo" } },
  transfer: { priceAR: 130000, label: { fr: "Transfert privé 4×4 (Fianarantsoa, 1 trajet)", en: "Private 4×4 transfer (Fianarantsoa, one way)", es: "Traslado privado 4×4 (Fianarantsoa, un trayecto)" } },
  transferAmbalakely: { priceAR: 120000, label: { fr: "Transfert privé 4×4 (Ambalakely Bifurcation, 1 trajet)", en: "Private 4×4 transfer (Ambalakely junction, one way)", es: "Traslado privado 4×4 (Bifurcación Ambalakely, un trayecto)" } },
  camping: { priceAR: 250000, label: { fr: "Camping sur 1 hectare privatif pour 3 tentes", en: "Camping on 1 private hectare for 3 tents", es: "Camping en 1 hectárea privada para 3 tiendas" } },
  conference: { priceAR: 350000, label: { fr: "Salle de conférence (40 personnes)", en: "Conference room (40 people)", es: "Sala de conferencias (40 personas)" } },
  draisine: { priceAR: 3200000, label: { fr: "Location draisine Fianarantsoa ↔ Manakara, la journée", en: "Draisine hire Fianarantsoa ↔ Manakara, per day", es: "Alquiler de dresina Fianarantsoa ↔ Manakara, por día" } },
  repasGuide: { priceAR: 8000, label: { fr: "Repas guide (chauffeur : gratuité)", en: "Guide meal (driver: complimentary)", es: "Comida del guía (chófer: gratuita)" } },
};

/**
 * Ordre d'affichage du parc, fixé par la direction le 08/08/2026 :
 *
 *   1. les hébergements courants, DU PLUS CHER AU MOINS CHER
 *      (Lake Suite → Pilotis → Superior Lake View → Bungalow Standard)
 *   2. les deux hébergements d'exception (Wagon Nuptial, Bungalow Tarzan)
 *   3. l'extension Le Repos (villa basse)
 *
 * Le tri se fait sur le tarif PUBLIC en ariary, seule référence commune :
 * l'euro est indicatif et le parc n'a pas de prix « à partir de ».
 *
 * « Pilotis Familial » n'apparaît pas ici : les tarifs officiels n'en font
 * pas une catégorie mais une configuration du Pilotis Nuptial (lit
 * supplémentaire à 30 000 Ar/personne). Il reste dans `rooms` pour le
 * formulaire de réservation.
 */
const RANG_GROUPE: Record<string, number> = { courant: 0, exception: 1, repos: 2 };

export const roomsAffichees: Room[] = rooms
  .filter((r) => r.groupe)
  .sort(
    (a, b) =>
      RANG_GROUPE[a.groupe!] - RANG_GROUPE[b.groupe!] || b.priceAR - a.priceAR,
  );
