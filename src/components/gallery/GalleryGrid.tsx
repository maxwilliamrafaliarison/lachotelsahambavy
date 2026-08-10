"use client";

import { useState } from "react";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";

/**
 * Îlot client de la galerie : filtres, grille et visionneuse.
 *
 * La page /galerie était entièrement en "use client" avec
 * `if (!dict) return null` : le HTML servi se réduisait à
 * `<main class="flex-1"></main>`. Aucune photo, aucun titre, aucune
 * métadonnée propre. Une galerie invisible aux moteurs, et une page
 * blanche pour qui navigue sans JavaScript.
 *
 * La page redevient un composant serveur ; seul ce bloc reste client,
 * parce qu'il porte réellement de l'état : la catégorie active et
 * l'index de la visionneuse.
 *
 * Les photos sont passées en props depuis le serveur : elles sont donc
 * dans le HTML d'origine, indexables, même avant hydratation.
 */

export type Photo = { src: string; alt: string; category: string };

export default function GalleryGrid({
  photos,
  filtres,
  ouvrirLabel,
}: {
  photos: Photo[];
  filtres: { key: string; label: string }[];
  /** Gabarit du libellé d'ouverture, « {alt} » remplacé par la légende. */
  ouvrirLabel: string;
}) {
  const [actif, setActif] = useState("all");
  const [visionneuse, setVisionneuse] = useState<number | null>(null);

  const filtrees = actif === "all" ? photos : photos.filter((p) => p.category === actif);

  return (
    <>
      {/* Filtres : pastilles hairline */}
      <div className="mb-10 flex flex-wrap gap-2 md:mb-14 md:gap-3">
        {filtres.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setActif(f.key);
              setVisionneuse(null);
            }}
            aria-pressed={actif === f.key}
            className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 md:px-5 md:py-2.5 ${
              actif === f.key
                ? "border-lake bg-lake text-white"
                : "border-hairline bg-white text-muted hover:border-lake hover:text-lake"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="masonry-grid">
        {filtrees.map((photo, i) => (
          <button
            key={photo.src}
            className="group block w-full cursor-pointer overflow-hidden rounded-[3px] border border-hairline bg-white text-left"
            onClick={() => setVisionneuse(i)}
            aria-label={ouvrirLabel.replace("{alt}", photo.alt)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="block w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {visionneuse !== null && (
        <GalleryLightbox
          photos={filtrees}
          index={visionneuse}
          onClose={() => setVisionneuse(null)}
          onIndexChange={setVisionneuse}
        />
      )}
    </>
  );
}
