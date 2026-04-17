import {
  ArrowRight,
  Baby,
  Backpack,
  Basket,
  Bathtub,
  Bed,
  Binoculars,
  Boat,
  Butterfly,
  CellSignalHigh,
  ChefHat,
  Clock,
  ClipboardText,
  Coffee,
  CookingPot,
  Drop,
  Fish,
  Flower,
  FlowerLotus,
  ForkKnife,
  GridFour,
  HandHeart,
  House,
  Info,
  Leaf,
  Martini,
  MaskHappy,
  Mountains,
  PersonSimpleHike,
  PersonSimpleWalk,
  PicnicTable,
  Plant,
  Recycle,
  Ruler,
  Storefront,
  SwimmingPool,
  TelevisionSimple,
  TennisBall,
  Train,
  Tree,
  TreePalm,
  UsersThree,
  Waves,
  WifiHigh,
} from "@phosphor-icons/react/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react/lib";

/**
 * Icon — mapping nom sémantique → composant Phosphor.
 *
 * Source unique pour toutes les icônes du site. Les fichiers data
 * (rooms.ts, activities.ts) stockent un nom court ("bed", "wifi"…)
 * plutôt qu'un emoji ou un composant React — ce qui permet aux fichiers
 * .ts de rester agnostiques du rendu et aux .tsx d'importer un seul
 * composant <Icon name="…" />.
 *
 * On utilise la variante SSR (`/dist/ssr`) car la plupart des pages du
 * site sont rendues server-side — évite le surcoût d'un icon package
 * client-only sur des pages statiques.
 *
 * Style par défaut : weight "regular", size 20, couleur héritée via
 * currentColor. Ajustable par `size` et `className`.
 */

// Dictionnaire nom → composant Phosphor
const ICONS: Record<string, PhosphorIcon> = {
  // Hébergements — commodités chambres
  bed: Bed,
  water: Waves,
  bath: Bathtub,
  tv: TelevisionSimple,
  house: House,
  wifi: WifiHigh,
  pool: SwimmingPool,
  wood: GridFour, // parquet pattern
  train: Train,
  drinks: Martini, // mini-bar / cocktail
  flower: Flower,
  utensils: ForkKnife, // service en chambre
  family: UsersThree,
  ruler: Ruler, // surface / dimensions
  palm: TreePalm,
  tree: Tree,
  baby: Baby,
  cooking: CookingPot,

  // Activités
  walk: PersonSimpleWalk,
  leaf: Leaf, // thé, nature
  boat: Boat, // canoë, pédalos
  wellness: FlowerLotus, // massage / spa
  tennis: TennisBall,
  binoculars: Binoculars, // trekking / observation faune
  shop: Storefront,

  // Filtres catégories
  nature: Plant,
  culture: MaskHappy,

  // Fiche excursion / infos pratiques
  clock: Clock,
  clipboard: ClipboardText,
  mountain: Mountains,
  difficulty: CellSignalHigh, // gauge / difficulté
  hike: PersonSimpleHike,

  // Restaurant
  fish: Fish,
  chef: ChefHat,
  coffee: Coffee,
  dining: ForkKnife,
  picnic: PicnicTable,
  basket: Basket,

  // Indicateurs / notes contextuelles
  arrow: ArrowRight,
  backpack: Backpack,
  info: Info,

  // Engagement éco-responsable — filigranes / pictos RSE
  bio: Plant, // potager bio (alias sémantique de plant)
  hiring: HandHeart, // recrutement humain, local
  shortSupply: Basket, // achats circuit court (alias sémantique)
  bees: Butterfly, // apiculture / biodiversité
  soap: Drop, // savons artisanaux (goutte)
  forest: Tree, // corridor forestier (alias sémantique)
  zeroWaste: Recycle, // zéro gaspillage
};

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: string;
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
  "aria-hidden"?: boolean;
}

export function Icon({
  name,
  size = 20,
  weight = "regular",
  className,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const Component = ICONS[name];
  if (!Component) {
    // Fallback silencieux — en dev on voit qu'il manque le nom dans la console.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Icon] unknown name: ${name}`);
    }
    return null;
  }
  return (
    <Component
      size={size}
      weight={weight}
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}
