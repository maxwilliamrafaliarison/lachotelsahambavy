"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Galerie d'une chambre — repère : la fiche « Types de chambre » de
 * Radisson Blu, où chaque hébergement annonce son nombre de vues
 * (« Chambre Supérieure (29) ») et se feuillette sur place.
 *
 * CE QUI EST REPRIS DE RADISSON
 * Le compteur affiché d'emblée : il dit au visiteur qu'il y a matière à
 * voir avant même qu'il clique. C'est ce qui transforme une photo unique,
 * qu'on subit, en une galerie qu'on explore.
 *
 * CE QUI NE L'EST PAS
 * Pas de vignettes en bandeau : à sept photos et plus elles deviennent des
 * timbres illisibles. Une pastille de progression suffit et reste dans le
 * registre du site.
 *
 * CHARGEMENT — le point délicat d'une galerie de 21 vues.
 * Seule la première image est réellement chargée au rendu. Les autres ne
 * sont montées dans le DOM que lorsqu'on approche d'elles (fenêtre de ±1),
 * ce qui évite de déclencher 21 requêtes pour un visiteur qui ne
 * feuillettera pas. `sizes` est renseigné pour que Next serve la bonne
 * largeur plutôt que l'original.
 *
 * ACCESSIBILITÉ
 * Le compteur est en `aria-live="polite"` : au clavier, on entend
 * « 3 sur 21 » à chaque changement. Les flèches portent un libellé
 * explicite, et la galerie répond aussi aux flèches du clavier lorsqu'elle
 * a le focus.
 */

type Props = {
  /** Chemins déjà préfixés du basePath par l'appelant. */
  images: string[];
  /** Nom de la chambre — sert à composer les textes alternatifs. */
  nom: string;
  /** Libellés localisés. */
  libelles: { precedent: string; suivant: string; sur: string };
  /** Priorité de chargement pour la première image (au-dessus de la ligne de flottaison). */
  prioritaire?: boolean;
  /**
   * `true` : la galerie se cale en `absolute inset-0` sur son parent
   * positionné — c'est le cas dans l'emplacement média d'EditorialSplit.
   *
   * C'est une PROP et non une classe passée de l'extérieur : `relative` et
   * `absolute` vivent dans la même couche Tailwind, et c'est l'ordre de la
   * feuille de style qui tranche, pas celui de l'attribut class. Une classe
   * `absolute` passée par l'appelant se faisait donc battre par le
   * `relative` de la classe de base, et la galerie tombait à une hauteur
   * de 0.
   */
  remplir?: boolean;
  className?: string;
};

export default function RoomGallery({
  images,
  nom,
  libelles,
  prioritaire = false,
  remplir = false,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const conteneur = useRef<HTMLDivElement>(null);
  const total = images.length;

  const aller = useCallback(
    (delta: number) => setIndex((i) => (i + delta + total) % total),
    [total],
  );

  useEffect(() => {
    const el = conteneur.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        aller(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        aller(1);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [aller]);

  if (total === 0) return null;

  /** Ne monte que les images voisines : une galerie de 21 vues ne doit pas
   *  provoquer 21 requêtes pour qui ne la feuillette pas. */
  const montee = (i: number) =>
    i === 0 || Math.abs(i - index) <= 1 || (index === 0 && i === total - 1) || (index === total - 1 && i === 0);

  return (
    <div
      ref={conteneur}
      tabIndex={total > 1 ? 0 : -1}
      role="group"
      aria-roledescription="carrousel"
      aria-label={nom}
      className={`group/gal overflow-hidden bg-hairline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake focus-visible:ring-inset ${
        remplir ? "absolute inset-0" : "relative aspect-[4/3] rounded-[6px]"
      } ${className}`}
    >
      {images.map((src, i) => (
        /* Toutes les vues sont en position absolue et se croisent en
           opacité : c'est le conteneur qui porte la hauteur, ce qui permet
           d'insérer la galerie dans un emplacement `absolute inset-0`
           comme celui d'EditorialSplit. */
        <div
          key={src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {montee(i) && (
            <Image
              src={src}
              alt={i === 0 ? nom : `${nom} — ${libelles.sur.replace("{n}", String(i + 1))}`}
              width={1600}
              height={1200}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
              {...(i === 0 && prioritaire ? { preload: true } : { loading: "lazy" as const })}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ))}

      {total > 1 && (
        <>
          {/* Compteur — la promesse Radisson : on sait qu'il y a à voir. */}
          <p
            aria-live="polite"
            className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[11.5px] font-semibold tabular-nums text-white backdrop-blur-md"
          >
            {index + 1} / {total}
          </p>

          <button
            type="button"
            onClick={() => aller(-1)}
            aria-label={libelles.precedent}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white opacity-0 backdrop-blur-md transition-opacity duration-200 hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group-hover/gal:opacity-100 max-md:opacity-100"
          >
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden="true">
              <path d="M7.5 1.5L2 7.5l5.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => aller(1)}
            aria-label={libelles.suivant}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white opacity-0 backdrop-blur-md transition-opacity duration-200 hover:bg-black/55 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group-hover/gal:opacity-100 max-md:opacity-100"
          >
            <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden="true">
              <path d="M1.5 1.5L7 7.5l-5.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Progression — discrète, elle remplace un bandeau de vignettes
              qui deviendrait illisible au-delà de six vues. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-black/20"
          >
            <div
              className="h-full bg-terracotta transition-[width] duration-300 ease-out"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
