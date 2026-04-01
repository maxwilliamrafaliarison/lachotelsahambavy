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
  priceTOEUR?: number;
  amenities: { icon: string; label: { fr: string; en: string; es: string } }[];
  images: string[];
  featured?: boolean;
}

export const rooms: Room[] = [
  {
    id: "pilotis",
    slug: "pilotis-nuptial",
    name: {
      fr: "Nuptial Pilotis sur l'eau",
      en: "Overwater Honeymoon Bungalow",
      es: "Bungalow Nupcial sobre el Agua",
    },
    type: {
      fr: "Hébergement insolite",
      en: "Unique accommodation",
      es: "Alojamiento insólito",
    },
    badge: "Signature",
    description: {
      fr: "9 bungalows sur pilotis directement sur le lac Sahambavy. Lit King Size 2m\u00d72,20m, décoration artisanale malgache, terrasse privée face à l'eau. L'expérience ultime.",
      en: "9 overwater bungalows on Lake Sahambavy. King Size bed 2m\u00d72.20m, Malagasy artisan decor, private terrace facing the water. The ultimate experience.",
      es: "9 bungalows sobre pilotes directamente en el lago Sahambavy. Cama King Size 2m\u00d72,20m, decoración artesanal malgache, terraza privada frente al agua.",
    },
    longDescription: {
      fr: "Nos bungalows nuptiaux sur pilotis sont l'expérience la plus immersive du Lac Hôtel Sahambavy. Construits en bois précieux, ils s'avancent directement sur le lac, vous offrant un panorama époustouflant sur l'eau et les montagnes.\n\nChaque bungalow est décoré avec des matériaux et des sculptures artisanales réalisées par des artisans malgaches locaux. Une expérience à la fois luxueuse et authentique.",
      en: "Our overwater honeymoon bungalows are the most immersive experience at Lac Hôtel Sahambavy. Built with precious wood, they extend directly over the lake, offering breathtaking panoramic views of the water and mountains.\n\nEach bungalow is decorated with materials and artisan sculptures crafted by local Malagasy artisans. A luxurious yet authentic experience.",
      es: "Nuestros bungalows nupciales sobre pilotes son la experiencia más inmersiva del Lac Hôtel Sahambavy. Construidos en madera preciosa, se adentran directamente en el lago, ofreciendo un panorama impresionante del agua y las montañas.",
    },
    units: 9,
    capacity: "2",
    priceEUR: 50,
    priceAR: 360000,
    priceTOEUR: 50,
    amenities: [
      { icon: "🛏", label: { fr: "King Size 2\u00d72,20m", en: "King Size 2\u00d72.20m", es: "King Size 2\u00d72,20m" } },
      { icon: "🌊", label: { fr: "Sur l'eau", en: "Overwater", es: "Sobre el agua" } },
      { icon: "🛁", label: { fr: "Salle de bain privée", en: "Private bathroom", es: "Baño privado" } },
      { icon: "📺", label: { fr: "Canal+", en: "Canal+", es: "Canal+" } },
      { icon: "🏠", label: { fr: "Terrasse privée", en: "Private terrace", es: "Terraza privada" } },
      { icon: "📶", label: { fr: "WiFi au restaurant", en: "WiFi at restaurant", es: "WiFi en restaurante" } },
    ],
    images: [
      "/images/rooms/pilotis-01.jpg",
      "/images/rooms/pilotis-02.jpg",
      "/images/rooms/pilotis-03.jpg",
    ],
    featured: true,
  },
  {
    id: "wagon",
    slug: "wagon-nuptial-1930",
    name: {
      fr: "Wagon Lit Nuptial 1930",
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
      fr: "Wagon suisse de 1930 rénové, 30m de longueur. Service en chambre, mini-bar, terrasse privée et vue sur le lac.",
      en: "Renovated 1930 Swiss wagon, 30m long. Room service, mini-bar, private terrace and lake view.",
      es: "Vagón suizo de 1930 renovado, 30m de longitud. Servicio de habitaciones, mini-bar, terraza privada y vista al lago.",
    },
    longDescription: {
      fr: "Dormez dans un authentique wagon suisse de 1930 entièrement rénové en suite nuptiale de luxe. Avec ses 30 mètres de longueur, ce wagon unique en son genre vous transporte dans une autre époque tout en vous offrant le confort moderne.\n\nService en chambre, mini-bar, terrasse privée fleurie et vue sur le lac. Une nuit dans ce wagon est une expérience que vous n'oublierez jamais — idéale pour un voyage de noces ou une célébration.",
      en: "Sleep in an authentic 1930 Swiss wagon fully renovated into a luxury honeymoon suite. At 30 meters long, this one-of-a-kind wagon transports you to another era while offering modern comfort.\n\nRoom service, mini-bar, private flowered terrace and lake view. A night in this wagon is an unforgettable experience — ideal for a honeymoon or celebration.",
      es: "Duerma en un auténtico vagón suizo de 1930 completamente renovado en suite nupcial de lujo. Con sus 30 metros de longitud, este vagón único le transporta a otra época ofreciendo confort moderno.",
    },
    units: 1,
    capacity: "2",
    surface: "30m linéaires",
    priceEUR: 50,
    priceAR: 360000,
    priceTOEUR: 50,
    amenities: [
      { icon: "🚂", label: { fr: "Wagon suisse 1930, 30m", en: "1930 Swiss wagon, 30m", es: "Vagón suizo 1930, 30m" } },
      { icon: "🛏", label: { fr: "Lit double", en: "Double bed", es: "Cama doble" } },
      { icon: "🍸", label: { fr: "Mini-bar inclus", en: "Mini-bar included", es: "Mini-bar incluido" } },
      { icon: "🌺", label: { fr: "Terrasse privée fleurie", en: "Flowered private terrace", es: "Terraza privada florida" } },
      { icon: "🍽", label: { fr: "Service en chambre", en: "Room service", es: "Servicio de habitaciones" } },
      { icon: "🌊", label: { fr: "Vue sur le lac", en: "Lake view", es: "Vista al lago" } },
    ],
    images: [
      "/images/rooms/wagon-01.jpg",
      "/images/rooms/wagon-02.jpg",
    ],
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
      fr: "Construites récemment, les Superior Lake View Rooms offrent un confort européen haut de gamme avec vue imprenable sur la piscine et le lac. Chaque chambre dispose d'un superbe parquet en bois précieux et d'une terrasse privée.\n\nFace à la piscine en ardoise en eau salée, ces chambres combinent confort moderne et cadre naturel exceptionnel. À seulement 3 minutes à pied du restaurant.",
      en: "Recently built, the Superior Lake View Rooms offer high-end European comfort with stunning views of the pool and lake. Each room features beautiful precious wood parquet and a private terrace.\n\nFacing the saltwater slate pool, these rooms combine modern comfort with an exceptional natural setting. Just 3 minutes walk from the restaurant.",
      es: "Construidas recientemente, las Superior Lake View Rooms ofrecen confort europeo de alta gama con vistas impresionantes a la piscina y el lago. Cada habitación cuenta con parquet de madera preciosa y terraza privada.",
    },
    units: 8,
    capacity: "2",
    surface: "25m²",
    priceEUR: 42,
    priceAR: 300000,
    priceTOEUR: 42,
    amenities: [
      { icon: "🛏", label: { fr: "Queen Bed", en: "Queen Bed", es: "Cama Queen" } },
      { icon: "🏊", label: { fr: "Vue piscine", en: "Pool view", es: "Vista piscina" } },
      { icon: "🌅", label: { fr: "Vue lac", en: "Lake view", es: "Vista lago" } },
      { icon: "🪵", label: { fr: "Parquet bois précieux", en: "Precious wood parquet", es: "Parquet madera preciosa" } },
      { icon: "🛁", label: { fr: "Salle de bain privée", en: "Private bathroom", es: "Baño privado" } },
      { icon: "📺", label: { fr: "Canal+ Satellite", en: "Canal+ Satellite", es: "Canal+ Satellite" } },
    ],
    images: [
      "/images/rooms/superior-01.jpg",
      "/images/rooms/superior-02.jpg",
    ],
  },
  {
    id: "villa",
    slug: "villa-familiale",
    name: {
      fr: "Villa basse Familiale 5 PAX",
      en: "Family Villa 5 PAX",
      es: "Villa Familiar 5 PAX",
    },
    type: {
      fr: "Villa familiale",
      en: "Family villa",
      es: "Villa familiar",
    },
    badge: "Famille",
    description: {
      fr: "4 villas basses pour 5 personnes. Idéal pour les familles, à 800m du bâtiment principal dans un écrin de nature.",
      en: "4 low villas for 5 people. Ideal for families, 800m from the main building in a nature setting.",
      es: "4 villas bajas para 5 personas. Ideal para familias, a 800m del edificio principal en plena naturaleza.",
    },
    units: 4,
    capacity: "5",
    priceEUR: 34,
    priceAR: 250000,
    priceTOEUR: 34,
    amenities: [
      { icon: "👨‍👩‍👧", label: { fr: "Jusqu'à 5 personnes", en: "Up to 5 people", es: "Hasta 5 personas" } },
      { icon: "🔒", label: { fr: "Espace privatif sécurisé", en: "Secure private space", es: "Espacio privado seguro" } },
      { icon: "🌿", label: { fr: "Nature environnante", en: "Surrounding nature", es: "Naturaleza circundante" } },
      { icon: "🛁", label: { fr: "Salle de bain privée", en: "Private bathroom", es: "Baño privado" } },
    ],
    images: [
      "/images/rooms/villa-01.jpg",
    ],
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
      fr: "Bungalow",
      en: "Bungalow",
      es: "Bungalow",
    },
    description: {
      fr: "26 bungalows dans un jardin tropical. Double, twin ou single, 16m² de confort authentique malgache.",
      en: "26 bungalows in a tropical garden. Double, twin or single, 16m² of authentic Malagasy comfort.",
      es: "26 bungalows en un jardín tropical. Doble, twin o single, 16m² de confort auténtico malgache.",
    },
    longDescription: {
      fr: "Nos bungalows standards sont disséminés dans un jardin tropical luxuriant. Construits en matériaux locaux, ils offrent un confort authentique et chaleureux en harmonie totale avec la nature malgache.\n\nDisponibles en version double, twin ou single, ils conviennent aussi bien aux voyageurs solo qu'aux couples. L'option idéale pour découvrir le charme du Lac Hôtel à un prix accessible.",
      en: "Our standard bungalows are scattered throughout a lush tropical garden. Built with local materials, they offer authentic and warm comfort in total harmony with Malagasy nature.\n\nAvailable in double, twin or single, they suit solo travelers and couples alike. The ideal option to discover the charm of Lac Hôtel at an accessible price.",
      es: "Nuestros bungalows estándar están diseminados en un exuberante jardín tropical. Construidos con materiales locales, ofrecen un confort auténtico y cálido en armonía total con la naturaleza malgache.",
    },
    units: 26,
    capacity: "1-2",
    surface: "16m²",
    priceEUR: 18,
    priceAR: 150000,
    priceTOEUR: 18,
    amenities: [
      { icon: "🛏", label: { fr: "Double, twin ou single", en: "Double, twin or single", es: "Doble, twin o single" } },
      { icon: "📐", label: { fr: "16m²", en: "16m²", es: "16m²" } },
      { icon: "🌴", label: { fr: "Jardin tropical", en: "Tropical garden", es: "Jardín tropical" } },
      { icon: "🛁", label: { fr: "Salle de bain privée", en: "Private bathroom", es: "Baño privado" } },
    ],
    images: [
      "/images/rooms/standard-01.jpg",
    ],
  },
  {
    id: "arbre",
    slug: "bungalow-sur-arbre",
    name: {
      fr: "Bungalow sur Arbre",
      en: "Treehouse Bungalow",
      es: "Bungalow en el Árbol",
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
    units: 2,
    capacity: "1-2",
    priceEUR: null,
    priceAR: 150000,
    amenities: [
      { icon: "🌳", label: { fr: "Dans les arbres", en: "In the trees", es: "En los árboles" } },
      { icon: "👶", label: { fr: "Pour enfants", en: "For kids", es: "Para niños" } },
    ],
    images: [],
  },
];

export const extras = {
  extraBed: { priceAR: 30000, label: { fr: "Lit supplémentaire", en: "Extra bed", es: "Cama supletoria" } },
  breakfast: { priceEUR: 8, priceAR: 40000, label: { fr: "Petit-déjeuner complet", en: "Full breakfast", es: "Desayuno completo" } },
  menu: { priceEUR: 14, priceAR: 70000, label: { fr: "Menu du jour/soir", en: "Daily menu", es: "Menú del día" } },
  picnic: { priceEUR: 8, priceAR: 40000, label: { fr: "Pique-nique complet", en: "Full picnic", es: "Picnic completo" } },
  transfer: { priceEUR: 15, priceAR: 120000, label: { fr: "Transfert 4×4 Fianarantsoa", en: "4×4 transfer Fianarantsoa", es: "Traslado 4×4 Fianarantsoa" } },
  camping: { priceAR: 250000, label: { fr: "Camping — 1 hectare privatif", en: "Camping — 1 private hectare", es: "Camping — 1 hectárea privada" } },
  conference: { priceAR: 350000, label: { fr: "Salle de conférence (80 pax)", en: "Conference room (80 pax)", es: "Sala de conferencias (80 pax)" } },
  draisine: { priceAR: 3200000, label: { fr: "Location Draisine", en: "Draisine rental", es: "Alquiler Dresina" } },
};
