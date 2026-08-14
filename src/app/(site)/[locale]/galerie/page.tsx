/**
 * Page Galerie : COMPOSANT SERVEUR.
 *
 * Elle était en "use client" avec `if (!dict) return null` : le HTML servi
 * ne contenait ni titre, ni photo, ni métadonnée propre. Une galerie que
 * les moteurs ne voyaient pas.
 *
 * Les photos et les libellés de filtre partent maintenant du serveur ;
 * seul GalleryGrid (filtres, grille, visionneuse) reste un îlot client,
 * parce qu'il porte de l'état.
 */

 

import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import { alt, type TexteAlternatif } from "@/lib/alt";
import PanoramaHero from "@/components/ui/PanoramaHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { pageAlternates } from "@/lib/seo/alternates";

const basePath = getBasePath();

type Category =
  | "all"
  | "rooms"
  | "restaurant"
  | "nature"
  | "plantation"
  | "train"
  | "village"
  | "jardins"
  | "boutique";

/**
 * Une photo de la galerie. Son texte alternatif est trilingue : il est résolu
 * dans la langue de la page juste avant d'être passé à GalleryGrid, qui reste
 * un composant client sans notion de locale.
 */
interface Photo {
  src: string;
  alt: TexteAlternatif;
  category: Category;
}

const photos: Photo[] = [
  {
    src: `${basePath}/images/gallery/gallery-01.jpg`,
    alt: {
      fr: "Allée de pierre entre les bungalows sur pilotis, au-dessus du lac",
      en: "Stone causeway crossing the lake between the overwater bungalows",
      es: "Pasarela de piedra que cruza el lago entre los bungalós sobre pilotes",
    },
    category: "rooms",
  },
  {
    src: `${basePath}/images/gallery/gallery-02.jpg`,
    alt: {
      fr: "Lit à baldaquin sous moustiquaire, murs ocre et baie ouverte sur le lac",
      en: "Four-poster bed under a mosquito net, ochre walls and a window onto the lake",
      es: "Cama con dosel y mosquitera, paredes ocres y ventanal al lago",
    },
    category: "rooms",
  },
  {
    src: `${basePath}/images/gallery/gallery-07.jpg`,
    alt: {
      fr: "Coin salon d'une chambre au soleil couchant, fauteuils face au lac",
      en: "Sitting area at sunset, armchairs facing the picture window and the lake beyond",
      es: "Rincón de estar al atardecer, butacas ante el ventanal con vistas al lago",
    },
    category: "rooms",
  },
  {
    src: `${basePath}/images/gallery/gallery-09.jpg`,
    alt: {
      fr: "Cheminée de pierre du restaurant, bûches dans l'âtre, tables dressées et fauteuils en rotin",
      en: "The restaurant's stone fireplace, logs in the hearth, laid tables and cane armchairs",
      es: "Chimenea de piedra del restaurante, leña en el hogar, mesas puestas y butacas de ratán",
    },
    category: "restaurant",
  },
  {
    src: `${basePath}/images/gallery/gallery-05.jpg`,
    alt: {
      fr: "Table et chaises en fer forgé devant le bâtiment principal et sa véranda",
      en: "Wrought-iron table and chairs facing the main building and its veranda",
      es: "Mesa y sillas de hierro forjado ante el edificio principal y su porche",
    },
    category: "restaurant",
  },
  {
    src: `${basePath}/images/gallery/gallery-03.jpg`,
    alt: {
      fr: "Bungalows ocre à toit de chaume alignés au bord du lac, vus de l'eau",
      en: "Ochre thatched bungalows in a row along the lake shore, seen from the water",
      es: "Bungalós ocres con techo de paja alineados en la orilla, vistos desde el agua",
    },
    category: "nature",
  },
  {
    src: `${basePath}/images/gallery/gallery-08.jpg`,
    alt: {
      fr: "Ciel orangé du couchant reflété sur le lac, un bungalow sur pilotis à droite",
      en: "Sunset sky reflected in the lake, an overwater bungalow on the right",
      es: "Cielo del atardecer reflejado en el lago y un bungaló sobre pilotes a la derecha",
    },
    category: "nature",
  },
  {
    src: `${basePath}/images/gallery/gallery-06.jpg`,
    alt: {
      fr: "Une visiteuse en pédalo contemple le lac Sahambavy, les bungalows au loin",
      en: "A guest in a pedalo looks out across Lake Sahambavy, bungalows in the distance",
      es: "Una visitante en hidropedal contempla el lago Sahambavy, con los bungalós al fondo",
    },
    category: "nature",
  },
  {
    src: `${basePath}/images/pool/piscine-jardin-palmiers-jour.jpg`,
    alt: {
      fr: "Piscine et rangée de transats sur la pelouse, palmiers et bungalows alentour",
      en: "Pool with a row of sun loungers on the lawn, palms and bungalows around",
      es: "Piscina y una fila de tumbonas en el césped, con palmeras y bungalós alrededor",
    },
    category: "nature",
  },
  /* Les deux seules photos de théiers de la galerie. Sans elles, le filtre
     « Plantation » serait vide depuis que gallery-04 l'a quitté, alors que
     la plantation est la signature de l'hôtel. */
  {
    src: `${basePath}/images/tea/plantation-the-rangees-vue-aerienne.jpg`,
    alt: {
      fr: "Rangées de théiers de Sahambavy vues à la verticale, deux cueilleuses entre les allées",
      en: "Rows of Sahambavy tea bushes seen from directly above, two pickers between the lanes",
      es: "Hileras de tés de Sahambavy vistas desde arriba, dos recolectoras entre los pasillos",
    },
    category: "plantation",
  },
  {
    src: `${basePath}/images/tea/cueilleuse-the-panier-brume.jpg`,
    alt: {
      fr: "Cueilleuse au panier d'osier dans les théiers, sous la brume du matin",
      en: "A picker with her wicker basket among the tea bushes, in the morning mist",
      es: "Recolectora con su cesta de mimbre entre los tés, bajo la bruma matinal",
    },
    category: "plantation",
  },
  {
    src: `${basePath}/images/gallery/gallery-04.jpg`,
    alt: {
      fr: "Jardins en pente aux buissons taillés en boule, bungalows et lac derrière",
      en: "Sloping gardens of rounded clipped shrubs, with bungalows and the lake beyond",
      es: "Jardines en pendiente con arbustos recortados en bola, bungalós y lago al fondo",
    },
    /* Rangée sous « plantation » jusqu'au 11/08/2026, alors qu'on n'y voit
       pas un théier : ce sont les buissons taillés des jardins d'agrément,
       les bungalows et le lac. Un visiteur qui filtrait « Plantation »
       tombait sur cette seule photo, et elle ne montrait pas de thé. */
    category: "jardins",
  },
  {
    src: `${basePath}/images/gallery/gallery-10.jpg`,
    alt: {
      fr: "Bâtiment à toit de chaume et balcons de bois, au-dessus des jardins fleuris",
      en: "Thatched building with wooden balconies standing above the flowering gardens",
      es: "Edificio con techo de paja y balcones de madera sobre los jardines floridos",
    },
    /* Rangée sous « train » jusqu'au 11/08/2026, sans le moindre rapport
       avec la ligne FCE. Classée « jardins » plutôt que « restaurant », où
       vit déjà la façade : ici les massifs occupent la moitié basse du
       cadre, et qui filtre « Restaurant » cherche la salle, pas un
       extérieur. */
    category: "jardins",
  },
  {
    src: `${basePath}/images/train/draisine-fce-embarquement-voyageurs.jpg`,
    alt: {
      fr: "Voyageurs autour de la draisine rouge et blanche du FCE, arrêtée sur la voie",
      en: "Travellers beside the red and white FCE railcar, halted on the track",
      es: "Viajeros junto a la dresina roja y blanca del FCE, detenida en la vía",
    },
    category: "train",
  },
  {
    src: `${basePath}/images/train/draisine-rails-gare-sahambavy.jpg`,
    alt: {
      fr: "Draisine du FCE à quai à la gare de Sahambavy, wagonnet attelé derrière",
      en: "The FCE railcar at Sahambavy station platform, a small wagon coupled behind",
      es: "Dresina del FCE en el andén de Sahambavy, con una vagoneta enganchada detrás",
    },
    category: "train",
  },
  {
    src: `${basePath}/images/village/rizieres-sahambavy-vue-aerienne.jpg`,
    alt: {
      fr: "Rizières et hameaux de la vallée de Sahambavy sous la brume, vus du ciel",
      en: "Paddy fields and hamlets in the misty Sahambavy valley, seen from above",
      es: "Arrozales y aldeas del valle de Sahambavy entre la bruma, vistos desde el aire",
    },
    category: "village",
  },
  {
    src: `${basePath}/images/village/femme-betsileo-maison-traditionnelle.jpg`,
    alt: {
      fr: "Villageoise betsileo en chapeau de paille devant une maison de terre au toit de chaume",
      en: "Betsileo villager in a straw hat outside a mud-walled, thatched house",
      es: "Aldeana betsileo con sombrero ante una casa de adobe con techo de paja",
    },
    category: "village",
  },
  {
    src: `${basePath}/images/village/portrait-homme-betsileo-sourire.jpg`,
    alt: {
      fr: "Homme betsileo souriant en chapeau, lamba sur l'épaule, devant une porte de bois",
      en: "Smiling Betsileo man in a hat, a lamba over his shoulder, at a wooden door",
      es: "Hombre betsileo sonriente con sombrero, lamba al hombro, ante una puerta de madera",
    },
    category: "village",
  },
  {
    src: `${basePath}/images/village/scene-village-zebus-grand-arbre.jpg`,
    alt: {
      fr: "Enfant menant deux zébus au village, habitants rassemblés sous un grand arbre",
      en: "A child drives two zebus through the village, people gathered under a large tree",
      es: "Un niño conduce dos cebúes por la aldea, vecinos reunidos bajo un gran árbol",
    },
    category: "village",
  },
  {
    src: `${basePath}/images/village/maison-betsileo-enfants-fenetres.jpg`,
    alt: {
      fr: "Enfant à la fenêtre d'une maison betsileo en terre, zébu à l'étable en dessous",
      en: "A child at the window of a Betsileo mud-brick house, a zebu stabled below",
      es: "Niño asomado a la ventana de una casa betsileo de adobe, cebú en el establo debajo",
    },
    category: "village",
  },
  {
    src: `${basePath}/images/jardins/orchidee-tigree-jardin-hotel.jpg`,
    alt: {
      fr: "Orchidée aux pétales jaunes tigrés de rouge, devant un bungalow du jardin",
      en: "Orchid with yellow petals streaked in red, in front of a garden bungalow",
      es: "Orquídea de pétalos amarillos veteados de rojo, ante un bungaló del jardín",
    },
    category: "jardins",
  },
  {
    src: `${basePath}/images/jardins/bougainvillier-violet-jardin.jpg`,
    alt: {
      fr: "Bractées mauves de bougainvillier éclairées par le soleil dans le feuillage sombre",
      en: "Mauve bougainvillea bracts caught by the sun against dark foliage",
      es: "Brácteas malvas de buganvilla iluminadas por el sol entre el follaje oscuro",
    },
    category: "jardins",
  },
  {
    src: `${basePath}/images/jardins/zinnia-orange-abeille-jardin.jpg`,
    alt: {
      fr: "Abeille butinant le cœur jaune d'un zinnia rouge orangé du jardin",
      en: "A bee feeding at the yellow centre of a red-orange zinnia in the garden",
      es: "Una abeja liba en el centro amarillo de una zinnia de color rojo anaranjado",
    },
    category: "jardins",
  },
  {
    src: `${basePath}/images/jardins/gaillarde-rouge-jaune-jardin.jpg`,
    alt: {
      fr: "Gaillarde aux pétales rouges frangés de jaune, ouverte dans un massif",
      en: "Gaillardia with red petals tipped in yellow, open in a flower bed",
      es: "Gallardía de pétalos rojos con puntas amarillas, abierta en un macizo",
    },
    category: "jardins",
  },
  {
    src: `${basePath}/images/jardins/statue-cherubin-jardin-fougeres.jpg`,
    alt: {
      fr: "Chérubin de pierre portant une amphore, fontaine du jardin parmi les fougères",
      en: "Stone cherub holding an amphora, a garden fountain among the ferns",
      es: "Querubín de piedra con un ánfora, fuente del jardín entre los helechos",
    },
    category: "jardins",
  },
  {
    src: `${basePath}/images/boutique/boutique-exterior.jpg`,
    alt: {
      fr: "Façade ocre de la boutique et de la salle de massage, au bord de l'allée pavée",
      en: "Ochre frontage of the shop and massage room, beside the cobbled path",
      es: "Fachada ocre de la tienda y la sala de masajes, junto al camino empedrado",
    },
    category: "boutique",
  },
  {
    src: `${basePath}/images/boutique/bio-mami-shop-entree-boutique.jpg`,
    alt: {
      fr: "Entrée de la boutique Bio Mami Shop, porte ouverte et plantes en pots",
      en: "Entrance to the Bio Mami Shop, door open and potted plants outside",
      es: "Entrada de la tienda Bio Mami Shop, con la puerta abierta y plantas en macetas",
    },
    category: "boutique",
  },
  {
    src: `${basePath}/images/boutique/etal-legumes-bio-mami-shop.jpg`,
    alt: {
      fr: "Paniers et sacs de légumes frais : brèdes, oignons nouveaux, chou et agrumes",
      en: "Baskets and sacks of fresh produce: leafy greens, spring onions, cabbage and citrus",
      es: "Cestas y sacos de productos frescos: verduras de hoja, cebolletas, col y cítricos",
    },
    category: "boutique",
  },
  {
    src: `${basePath}/images/boutique/savon-artisanal-curcuma-natural-by-maggie.jpg`,
    alt: {
      fr: "Savon artisanal au curcuma Natural by Maggie, sous son bandeau vert",
      en: "Natural by Maggie handmade turmeric soap in its green paper band",
      es: "Jabón artesanal de cúrcuma Natural by Maggie, con su faja verde",
    },
    category: "boutique",
  },
  {
    src: `${basePath}/images/boutique/savon-coco-artisanal-bois-sculpte.jpg`,
    alt: {
      fr: "Savon à la coco moulé d'arabesques, posé sur un plat de bois sculpté",
      en: "Coconut soap moulded with arabesques, resting on a carved wooden dish",
      es: "Jabón de coco con arabescos en relieve, sobre un plato de madera tallada",
    },
    category: "boutique",
  },
  {
    src: `${basePath}/images/boutique/savon-fleur-marguerite-artisanal.jpg`,
    alt: {
      fr: "Savon ivoire moulé en forme de marguerite, posé sur un tissu à fleurs",
      en: "Ivory soap moulded as a daisy, lying on floral fabric",
      es: "Jabón color marfil con forma de margarita, sobre una tela de flores",
    },
    category: "boutique",
  },
];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.gallery.heroTitle,
    description: dict.gallery.heroSubtitle,
    alternates: pageAlternates(locale as Locale, "galerie"),
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const dict = await getDictionary(loc);

  // GalleryGrid est un îlot client : il ne connaît pas la locale. Le texte
  // alternatif est donc résolu ici, avant que les photos ne lui soient passées.
  const photosLocalisees = photos.map((photo) => ({
    ...photo,
    alt: alt(photo.alt, loc),
  }));

  const filtres = [
    { key: "all", label: dict.gallery.all },
    { key: "rooms", label: dict.gallery.rooms },
    { key: "restaurant", label: dict.gallery.restaurant },
    { key: "nature", label: dict.gallery.nature },
    { key: "plantation", label: dict.gallery.plantation },
    { key: "train", label: dict.gallery.train },
    { key: "village", label: dict.gallery.village ?? "Village" },
    { key: "jardins", label: dict.gallery.jardins ?? "Jardins" },
    { key: "boutique", label: dict.gallery.boutique ?? "Boutique" },
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "galerie"))]} />

      <PanoramaHero
        image={`${basePath}/images/hero/hero-lake-sunset.jpg`}
        imageAlt={dict.gallery.heroSubtitle}
        label={dict.gallery.heroLabel ?? "Lac Hôtel Sahambavy"}
        title={dict.gallery.heroTitle}
        kicker={dict.gallery.heroSubtitle}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <GalleryGrid
            photos={photosLocalisees}
            filtres={filtres}
            ouvrirLabel={dict.gallery.openPhoto ?? "Ouvrir {alt}"}
            libellesVisionneuse={{
              galerie: alt({ fr: "Galerie photos", en: "Photo gallery", es: "Galería de fotos" }, loc),
              fermer: alt({ fr: "Fermer", en: "Close", es: "Cerrar" }, loc),
              precedente: alt({ fr: "Photo précédente", en: "Previous photo", es: "Foto anterior" }, loc),
              suivante: alt({ fr: "Photo suivante", en: "Next photo", es: "Foto siguiente" }, loc),
              glisser: alt({ fr: "Glissez pour naviguer", en: "Swipe to browse", es: "Deslice para navegar" }, loc),
            }}
          />
        </div>
      </section>
    </>
  );
}
