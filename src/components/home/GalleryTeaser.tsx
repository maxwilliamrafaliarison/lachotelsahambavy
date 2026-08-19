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
 * LE COMPTE TOMBE JUSTE, et ce n'est pas un hasard. Trois colonnes, la
 * vedette sur deux colonnes et deux rangées : elle occupe quatre cases, il
 * en reste cinq pour les cinq autres photos, soit une grille de neuf sans
 * un trou. Une grille de quatre colonnes, essayée d'abord, laissait la
 * sixième photo seule sur une troisième rangée, avec trois cases vides à
 * côté d'elle.
 *
 * LA VEDETTE ne l'est qu'à partir de md. En dessous, les six passent en
 * deux colonnes égales : une image en vedette sur un écran de téléphone ne
 * domine rien, elle prend juste la place de deux autres.
 *
 * CHARGEMENT. Six images qui ne sont pas au-dessus de la ligne de flottaison
 * n'ont aucune raison de retarder le premier rendu : toutes en paresseux,
 * aucune en priorité. Les tailles déclarées suivent la grille pour que le
 * navigateur ne télécharge pas du 2560 px pour une vignette de 200.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function GalleryTeaser({ dict, locale }: { dict: any; locale: Locale }) {
  const t = dict.galleryTeaser ?? {};

  const vues = [
    {
      src: "/images/gallery/gallery-01.jpg",
      alt: {
        fr: "Allée de pierre entre les bungalows sur pilotis, au-dessus du lac",
        en: "Stone causeway crossing the lake between the overwater bungalows",
        es: "Pasarela de piedra que cruza el lago entre los bungalós sobre pilotes",
      },
      vedette: true,
    },
    {
      src: "/images/gallery/gallery-02.jpg",
      alt: {
        fr: "Lit à baldaquin sous moustiquaire, murs ocre et baie ouverte sur le lac",
        en: "Four-poster bed under a mosquito net, ochre walls and a window onto the lake",
        es: "Cama con dosel y mosquitera, paredes ocres y ventanal al lago",
      },
    },
    {
      src: "/images/gallery/gallery-09.jpg",
      alt: {
        fr: "Cheminée de pierre du restaurant, bûches dans l'âtre, tables dressées",
        en: "The restaurant's stone fireplace, logs in the hearth, laid tables",
        es: "Chimenea de piedra del restaurante, leña en el hogar, mesas puestas",
      },
    },
    {
      src: "/images/jardins/bougainvillier-violet-jardin.jpg",
      alt: {
        fr: "Bractées mauves de bougainvillier éclairées par le soleil dans le jardin",
        en: "Mauve bougainvillea bracts lit by the sun in the garden",
        es: "Brácteas malvas de buganvilla iluminadas por el sol en el jardín",
      },
    },
    {
      src: "/images/tea/cueilleuse-the-panier-brume.jpg",
      alt: {
        fr: "Cueilleuse au panier d'osier dans les théiers, sous la brume du matin",
        en: "A picker with her wicker basket among the tea bushes, in the morning mist",
        es: "Recolectora con su cesta de mimbre entre los tés, bajo la bruma matinal",
      },
    },
    {
      src: "/images/village/scene-village-zebus-grand-arbre.jpg",
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
                className={`group relative block overflow-hidden rounded-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
                  v.vedette ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className="aspect-square">
                  <Image
                    src={`${basePath}${v.src}`}
                    alt={alt(v.alt, locale)}
                    fill
                    loading="lazy"
                    sizes={v.vedette ? "(min-width: 768px) 44vw, 50vw" : "(min-width: 768px) 22vw, 50vw"}
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
