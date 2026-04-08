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
  category?: "hotel" | "repos";
}

export const rooms: Room[] = [
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
    longDescription: {
      fr: "Nos bungalows nuptiaux sur pilotis sont l'expérience la plus immersive du Lac Hôtel Sahambavy. Construits en bois précieux, ils s'avancent directement sur le lac, vous offrant un panorama époustouflant sur l'eau et les montagnes.\n\nChaque bungalow est décoré avec des matériaux et des sculptures artisanales réalisées par des artisans malgaches locaux. Les chambres sont équipées d'une télévision. L'accès au Wi-Fi est disponible dans la salle de restauration.",
      en: "Our honeymoon overwater bungalows are the most immersive experience at Lac Hôtel Sahambavy. Built with precious wood, they extend directly over the lake, offering breathtaking panoramic views of the water and mountains.\n\nEach bungalow is decorated with materials and artisan sculptures crafted by local Malagasy artisans. Rooms are equipped with a television. Wi-Fi is available in the restaurant area.",
      es: "Nuestros bungalows nupciales sobre pilotes son la experiencia más inmersiva del Lac Hôtel Sahambavy. Construidos en madera preciosa, se adentran directamente en el lago, ofreciendo un panorama impresionante del agua y las montañas.\n\nCada bungalow está decorado con materiales y esculturas artesanales de artesanos malgaches locales. Las habitaciones disponen de televisión. El Wi-Fi está disponible en el restaurante.",
    },
    units: 9,
    capacity: "2",
    priceEUR: 72,
    priceAR: 360000,
    priceTOEUR: 72,
    amenities: [
      { icon: "🛏", label: { fr: "Lit 2,20 × 2,20 m", en: "Bed 2.20 × 2.20 m", es: "Cama 2,20 × 2,20 m" } },
      { icon: "🌊", label: { fr: "Sur l'eau", en: "Overwater", es: "Sobre el agua" } },
      { icon: "🛁", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "📺", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
      { icon: "🏠", label: { fr: "Terrasse vue lac", en: "Lake view terrace", es: "Terraza vista lago" } },
      { icon: "📶", label: { fr: "Wi-Fi au restaurant", en: "Wi-Fi at restaurant", es: "Wi-Fi en restaurante" } },
    ],
    images: [
      "/images/rooms/pilotis-01.jpg",
      "/images/rooms/pilotis-02.jpg",
      "/images/rooms/pilotis-03.jpg",
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
      es: "Construidas recientemente, las Superior Lake View Rooms ofrecen confort europeo de alta gama con vistas impresionantes a la piscina y el lago. Cada habitación cuenta con parquet de madera preciosa, baño privado con agua caliente y terraza privada con vistas al lago.",
    },
    units: 8,
    capacity: "2",
    surface: "25m²",
    priceEUR: 60,
    priceAR: 300000,
    priceTOEUR: 60,
    amenities: [
      { icon: "🛏", label: { fr: "Lit 2,20 × 2,20 m", en: "Bed 2.20 × 2.20 m", es: "Cama 2,20 × 2,20 m" } },
      { icon: "🏊", label: { fr: "Vue piscine & lac", en: "Pool & lake view", es: "Vista piscina y lago" } },
      { icon: "🪵", label: { fr: "Parquet bois précieux", en: "Precious wood parquet", es: "Parquet madera preciosa" } },
      { icon: "🛁", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "📺", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
      { icon: "📶", label: { fr: "Wi-Fi au restaurant", en: "Wi-Fi at restaurant", es: "Wi-Fi en restaurante" } },
    ],
    images: [
      "/images/rooms/superior-01.jpg",
      "/images/rooms/superior-02.jpg",
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
      fr: "Dormez dans un authentique wagon suisse de 1930 entièrement rénové en suite nuptiale de luxe. Avec ses 30 mètres de longueur, ce wagon unique en son genre vous transporte dans une autre époque tout en vous offrant le confort moderne.\n\nService en chambre, mini-bar, terrasse privée fleurie et vue sur le lac. Une nuit dans ce wagon est une expérience inoubliable — idéale pour un voyage de noces ou une célébration.",
      en: "Sleep in an authentic 1930 Swiss wagon fully renovated into a luxury honeymoon suite. At 30 metres long, this one-of-a-kind wagon transports you to another era while offering modern comfort.\n\nRoom service, mini-bar, private flowered terrace and lake view. A night in this wagon is an unforgettable experience — ideal for a honeymoon or celebration.",
      es: "Duerma en un auténtico vagón suizo de 1930 completamente renovado en suite nupcial de lujo. Con sus 30 metros de longitud, este vagón único le transporta a otra época ofreciendo confort moderno.",
    },
    units: 1,
    capacity: "2",
    surface: "30m linéaires",
    priceEUR: 72,
    priceAR: 360000,
    priceTOEUR: 72,
    amenities: [
      { icon: "🚂", label: { fr: "Wagon suisse 1930, 30 m", en: "1930 Swiss wagon, 30 m", es: "Vagón suizo 1930, 30 m" } },
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
    units: 2,
    capacity: "4",
    priceEUR: 80,
    priceAR: 400000,
    priceTOEUR: 80,
    amenities: [
      { icon: "👨‍👩‍👧", label: { fr: "Jusqu'à 4 personnes", en: "Up to 4 people", es: "Hasta 4 personas" } },
      { icon: "🌊", label: { fr: "Sur l'eau", en: "Overwater", es: "Sobre el agua" } },
      { icon: "🛁", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "📺", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
      { icon: "🏠", label: { fr: "Terrasse vue lac", en: "Lake view terrace", es: "Terraza vista lago" } },
    ],
    images: [
      "/images/rooms/pilotis-01.jpg",
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
      es: "Nuestros bungalows estándar están diseminados en un exuberante jardín tropical. Construidos con materiales locales, ofrecen un confort auténtico y cálido en armonía total con la naturaleza malgache.",
    },
    units: 26,
    capacity: "1-2",
    surface: "16m²",
    priceEUR: null,
    priceAR: 140000,
    priceTOEUR: undefined,
    amenities: [
      { icon: "🛏", label: { fr: "Double, twin ou single", en: "Double, twin or single", es: "Doble, twin o single" } },
      { icon: "📐", label: { fr: "16m²", en: "16m²", es: "16m²" } },
      { icon: "🌴", label: { fr: "Jardin tropical", en: "Tropical garden", es: "Jardín tropical" } },
      { icon: "🛁", label: { fr: "Salle de bain privée · Eau chaude", en: "Private bathroom · Hot water", es: "Baño privado · Agua caliente" } },
      { icon: "📺", label: { fr: "Télévision", en: "Television", es: "Televisión" } },
    ],
    images: [
      "/images/rooms/standard-01.jpg",
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
    units: 2,
    capacity: "1-2",
    priceEUR: null,
    priceAR: 150000,
    amenities: [
      { icon: "🌳", label: { fr: "Dans les arbres", en: "In the trees", es: "En los árboles" } },
      { icon: "👶", label: { fr: "Pour enfants", en: "For kids", es: "Para niños" } },
    ],
    images: [
      "/images/hotel/hotel-bungalows.jpg",
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
      en: "\"Le Repos\" Extension",
      es: "Extensión « Le Repos »",
    },
    badge: "Le Repos",
    description: {
      fr: "4 maisons en duplex entièrement équipées pour les longs séjours. Kitchenette avec plaque de cuisson, réfrigérateur et vaisselle. Idéal pour les familles.",
      en: "4 fully equipped duplex houses for extended stays. Kitchenette with hob, fridge and crockery. Ideal for families.",
      es: "4 casas dúplex totalmente equipadas para estancias prolongadas. Cocina americana con placa, nevera y vajilla. Ideal para familias.",
    },
    units: 4,
    capacity: "5",
    priceEUR: null,
    priceAR: 250000,
    amenities: [
      { icon: "🏠", label: { fr: "Duplex 2 étages", en: "2-storey duplex", es: "Dúplex 2 plantas" } },
      { icon: "🍳", label: { fr: "Kitchenette complète", en: "Full kitchenette", es: "Cocina americana completa" } },
      { icon: "👨‍👩‍👧", label: { fr: "Jusqu'à 5 personnes", en: "Up to 5 people", es: "Hasta 5 personas" } },
      { icon: "🛁", label: { fr: "Salle de bain privée", en: "Private bathroom", es: "Baño privado" } },
    ],
    images: [
      "/images/rooms/le-repos-exterior.jpg",
      "/images/rooms/le-repos-nature.jpg",
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
  transfer: { priceAR: 120000, label: { fr: "Transfert 4×4 Fianarantsoa", en: "4×4 transfer Fianarantsoa", es: "Traslado 4×4 Fianarantsoa" } },
  camping: { priceAR: 250000, label: { fr: "Camping — 1 hectare privatif", en: "Camping — 1 private hectare", es: "Camping — 1 hectárea privada" } },
  conference: { priceAR: 350000, label: { fr: "Salle de conférence (80 pax)", en: "Conference room (80 pax)", es: "Sala de conferencias (80 pax)" } },
  draisine: { priceAR: 3200000, label: { fr: "Location Draisine", en: "Draisine rental", es: "Alquiler Dresina" } },
};
