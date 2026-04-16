export interface Activity {
  id: string;
  icon: string;
  name: { fr: string; en: string; es: string };
  category: string;
  description: { fr: string; en: string; es: string };
  included: boolean;
  image: string;
}

export const activities: Activity[] = [
  {
    id: "tour-du-lac",
    icon: "walk",
    name: { fr: "Tour du Lac", en: "Lake Walk", es: "Paseo del Lago" },
    category: "nature",
    description: {
      fr: "Piste de 8 km balisée et sécurisée autour du lac",
      en: "8 km marked and secured trail around the lake",
      es: "Pista de 8 km señalizada y segura alrededor del lago",
    },
    included: true,
    image: "/images/activities/tour-lac.jpg",
  },
  {
    id: "plantation-the",
    icon: "leaf",
    name: { fr: "Plantation de Thé", en: "Tea Plantation", es: "Plantación de Té" },
    category: "decouverte",
    description: {
      fr: "Visite de l'unique plantation de thé de Madagascar (520 ha)",
      en: "Visit the only tea plantation in Madagascar (520 ha)",
      es: "Visita de la única plantación de té de Madagascar (520 ha)",
    },
    included: false,
    image: "/images/activities/plantation.jpg",
  },
  {
    id: "pedalos",
    icon: "boat",
    name: { fr: "Pédalos & Canoë", en: "Pedalos & Canoe", es: "Pedalos y Canoa" },
    category: "sport",
    description: {
      fr: "Promenade sur le lac en pédalo, canoë ou vedette",
      en: "Lake ride by pedalo, canoe or motorboat",
      es: "Paseo en el lago en pedalo, canoa o lancha",
    },
    included: false,
    image: "/images/activities/pedalos.jpg",
  },
  {
    id: "massage",
    icon: "wellness",
    name: { fr: "Massage", en: "Massage", es: "Masaje" },
    category: "bienetre",
    description: {
      fr: "Massage relaxant, de dos et des pieds dans notre salle dédiée",
      en: "Relaxing back and foot massage in our dedicated room",
      es: "Masaje relajante, de espalda y pies en nuestra sala dedicada",
    },
    included: false,
    image: "/images/activities/massage.jpg",
  },
  {
    id: "tennis",
    icon: "tennis",
    name: { fr: "Tennis & Sports", en: "Tennis & Sports", es: "Tenis y Deportes" },
    category: "sport",
    description: {
      fr: "Terrain de tennis, baby-foot, ping pong",
      en: "Tennis court, foosball, ping pong",
      es: "Cancha de tenis, futbolín, ping pong",
    },
    included: true,
    image: "/images/activities/tennis.jpg",
  },
  {
    id: "train-fce",
    icon: "train",
    name: { fr: "Train FCE", en: "FCE Train", es: "Tren FCE" },
    category: "decouverte",
    description: {
      fr: "Le dernier train de voyageurs de Madagascar — Fianarantsoa côte Est",
      en: "The last passenger train in Madagascar — Fianarantsoa East Coast",
      es: "El último tren de pasajeros de Madagascar — Fianarantsoa costa Este",
    },
    included: false,
    image: "/images/activities/train.jpg",
  },
  {
    id: "trekking",
    icon: "binoculars",
    name: { fr: "Trekking", en: "Trekking", es: "Trekking" },
    category: "nature",
    description: {
      fr: "Circuit Andrambovato, forêt primaire, faune endémique",
      en: "Andrambovato circuit, primary forest, endemic fauna",
      es: "Circuito Andrambovato, bosque primario, fauna endémica",
    },
    included: false,
    image: "/images/activities/trekking.jpg",
  },
  {
    id: "boutique",
    icon: "shop",
    name: { fr: "Boutique Mami", en: "Mami Shop", es: "Tienda Mami" },
    category: "bienetre",
    description: {
      fr: "Savons artisanaux, huiles essentielles, miels de Madagascar",
      en: "Artisan soaps, essential oils, Madagascar honey",
      es: "Jabones artesanales, aceites esenciales, mieles de Madagascar",
    },
    included: true,
    image: "/images/activities/boutique.jpg",
  },
];
