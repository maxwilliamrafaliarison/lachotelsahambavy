import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";
import { alt } from "@/lib/alt";

const basePath = getBasePath();

/**
 * Aperçu de la galerie, sur l'accueil.
 *
 * POURQUOI UNE MOSAÏQUE ET NON UN ÉNIÈME BLOC ÉDITORIAL. Toutes les autres
 * sections de l'accueil sont bâties sur EditorialSplit : une photo, un
 * texte à côté. C'est le rythme du site et il ne faut pas le casser sans
 * raison. Ici il y en a une : l'argument de la galerie n'est pas telle
 * photo, c'est le NOMBRE. Une seule image ne peut pas dire « il y en a
 * trente et une », six images posées ensemble le disent d'un coup d'œil.
 *
 * LE CHOIX DES SIX. Une par univers, pour montrer l'étendue plutôt que la
 * plus belle : l'eau, la chambre, la table, le jardin, le thé, le village.
 * Le lecteur doit comprendre que la galerie couvre autre chose que des
 * chambres.
 *
 * SIX TUILES ÉGALES, et non plus une vedette sur deux colonnes. La vedette
 * occupait une case de 795 px de côté, qu'il aurait fallu servir en
 * 1590 px sur un écran à haute densité. Or les photos de la galerie sont
 * en 1200 × 800, et le recadrage au carré en retire encore un tiers : la
 * vedette était donc agrandie deux fois. Aucune photo du lac assez définie
 * n'existait pour la remplacer, la seule candidate étant déjà une vue du
 * hero, deux sections plus haut.
 *
 * En six cases égales, chacune fait 400 px au plus : les 800 px utiles du
 * recadrage carré suffisent, même en haute densité. La grille se remplit
 * en trois colonnes sur deux rangées, sans trou, et la section y gagne une
 * rangée de hauteur.
 *
 * CHARGEMENT. Six images qui ne sont pas au-dessus de la ligne de flottaison
 * n'ont aucune raison de retarder le premier rendu : toutes en paresseux,
 * aucune en priorité. Les tailles déclarées se calculent case par case
 * (voir `taillesCarre`) : elles étaient sous-déclarées de 19 à 29 %, ce qui
 * faisait choisir au navigateur une variante trop petite.
 */

/**
 * Tailles à déclarer pour une source de rapport `r` dans une case CARRÉE
 * remplie en `object-cover`.
 *
 * La case fait 390 px au plus (conteneur 1280, marges 2 × 40, trois
 * colonnes, deux gouttières de 16), 31 vw entre 768 et 1359, 47 vw en
 * dessous sur deux colonnes. Mais ces largeurs sont celles de la CASE, pas
 * de l'image : en `object-cover`, une photo plus large que haute est
 * agrandie jusqu'à ce que sa hauteur couvre le carré, et déborde donc en
 * largeur. Une source en 3/2 doit fournir une fois et demie la largeur de
 * la case ; une source en portrait, juste sa largeur. D'où le facteur
 * `max(1, r)`, sans lequel le navigateur choisissait une variante d'un
 * tiers trop petite pour les photos en paysage, et une variante inutilement
 * lourde pour celles en portrait.
 */
function taillesCarre(r: number): string {
  const k = Math.max(1, r);
  const px = Math.round(390 * k);
  const vwMd = Math.round(31 * k);
  const vwSm = Math.round(47 * k);
  return `(min-width: 1360px) ${px}px, (min-width: 768px) ${vwMd}vw, ${vwSm}vw`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function GalleryTeaser({ dict, locale }: { dict: any; locale: Locale }) {
  const t = dict.galleryTeaser ?? {};

  const vues = [
    {
      src: "/images/gallery/gallery-01.jpg",
      rapport: 1200 / 800,
      alt: {
        fr: "Allée de pierre entre les bungalows sur pilotis, au-dessus du lac",
        en: "Stone causeway crossing the lake between the overwater bungalows",
        es: "Pasarela de piedra que cruza el lago entre los bungalós sobre pilotes",
      },
    },
    {
      src: "/images/gallery/gallery-02.jpg",
      rapport: 1200 / 800,
      alt: {
        fr: "Lit à baldaquin sous moustiquaire, murs ocre et baie ouverte sur le lac",
        en: "Four-poster bed under a mosquito net, ochre walls and a window onto the lake",
        es: "Cama con dosel y mosquitera, paredes ocres y ventanal al lago",
      },
    },
    {
      src: "/images/gallery/gallery-09.jpg",
      rapport: 1200 / 800,
      alt: {
        fr: "Cheminée de pierre du restaurant, bûches dans l'âtre, tables dressées",
        en: "The restaurant's stone fireplace, logs in the hearth, laid tables",
        es: "Chimenea de piedra del restaurante, leña en el hogar, mesas puestas",
      },
    },
    {
      src: "/images/jardins/bougainvillier-violet-jardin.jpg",
      rapport: 2000 / 1501,
      alt: {
        fr: "Bractées mauves de bougainvillier éclairées par le soleil dans le jardin",
        en: "Mauve bougainvillea bracts lit by the sun in the garden",
        es: "Brácteas malvas de buganvilla iluminadas por el sol en el jardín",
      },
    },
    {
      src: "/images/tea/cueilleuse-the-panier-brume.jpg",
      rapport: 1334 / 2000,
      alt: {
        fr: "Cueilleuse au panier d'osier dans les théiers, sous la brume du matin",
        en: "A picker with her wicker basket among the tea bushes, in the morning mist",
        es: "Recolectora con su cesta de mimbre entre los tés, bajo la bruma matinal",
      },
    },
    {
      src: "/images/village/scene-village-zebus-grand-arbre.jpg",
      rapport: 1600 / 2000,
      alt: {
        fr: "Enfant menant deux zébus au village, habitants rassemblés sous un grand arbre",
        en: "A child leading two zebus through the village, people gathered under a large tree",
        es: "Un niño lleva dos cebúes por el pueblo, vecinos reunidos bajo un gran árbol",
      },
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-10 md:mb-14">
          <ScrollReveal>
            <span className="ge-label mb-4">{t.label ?? "En images"}</span>
            <h2 className="mb-4" style={{ textWrap: "balance" }}>
              {t.title ?? "Le Lac Hôtel en trente et une photos"}
            </h2>
            <p className="ge-measure text-[15px] leading-relaxed text-body md:text-base">
              {t.subtitle ??
                "Les pilotis sur l'eau, les chambres, la table, les jardins, la plantation de thé et le village de Sahambavy."}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={80}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {vues.map((v) => (
              <Link
                key={v.src}
                href={`/${locale}/galerie/`}
                className="group relative block overflow-hidden rounded-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
              >
                <div className="aspect-square">
                  <Image
                    src={`${basePath}${v.src}`}
                    alt={alt(v.alt, locale)}
                    fill
                    loading="lazy"
                    sizes={taillesCarre(v.rapport)}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={140}>
          <div className="mt-8 md:mt-10">
            <Link href={`/${locale}/galerie/`} className="ge-cta">
              {t.cta ?? "Voir toutes les photos"}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
