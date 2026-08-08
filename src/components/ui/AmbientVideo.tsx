"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vidéo d'ambiance — muette, en boucle, verticale.
 *
 * POURQUOI CE COMPOSANT PLUTÔT QU'UNE BALISE <video autoPlay>
 *
 * 1. Chargement. `preload="none"` : tant que la vidéo n'est pas à l'écran,
 *    le navigateur ne télécharge RIEN — seule l'affiche (poster, 85 Ko) est
 *    servie. Le fichier de 2 Mo ne part qu'au moment où l'observateur
 *    d'intersection déclenche la lecture. La page d'accueil se charge donc
 *    exactement comme avant ; un visiteur qui ne descend pas jusqu'ici ne
 *    paie pas un octet. C'est décisif pour une clientèle qui consulte le
 *    site depuis Madagascar.
 *
 * 2. Accessibilité. WCAG 2.2.2 « Pause, Stop, Hide » : tout contenu animé
 *    qui démarre seul et dure plus de 5 secondes DOIT offrir un moyen de
 *    l'arrêter. D'où le bouton, qui n'est pas un ornement mais une
 *    obligation. Il apparaît au survol et reste toujours atteignable au
 *    clavier.
 *
 * 3. Mouvement réduit. Avec `prefers-reduced-motion: reduce`, la lecture ne
 *    démarre jamais d'elle-même : l'affiche reste, le visiteur lance s'il
 *    le souhaite.
 *
 * La vidéo est décorative : elle double une information déjà écrite dans la
 * colonne de prose voisine. D'où l'absence de piste audio (économie de
 * bande passante) et le `aria-hidden` sur l'habillage — le lecteur d'écran
 * reçoit le libellé porté par le bouton.
 */

type Props = {
  /** Chemin du MP4, basePath déjà appliqué par l'appelant. */
  src: string;
  /** Affiche (poster) affichée avant lecture, basePath déjà appliqué. */
  poster: string;
  /** Décrit la scène — sert de libellé accessible au bouton. */
  legende: string;
  /** Libellés du bouton, dans la langue courante. */
  libelles: { lire: string; pause: string };
  className?: string;
};

export default function AmbientVideo({
  src,
  poster,
  legende,
  libelles,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enLecture, setEnLecture] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mouvement réduit : on ne démarre jamais tout seul.
    const sobre = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (sobre.matches) return;

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          // C'est CE play() qui déclenche le téléchargement, pas le rendu :
          // avec preload="none" rien n'a encore transité sur le réseau.
          // `catch` : une politique d'autoplay restrictive rejette la
          // promesse — on laisse alors simplement l'affiche en place.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observateur.observe(video);
    return () => observateur.disconnect();
  }, []);

  function basculer() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  return (
    <div className={`group relative overflow-hidden rounded-[6px] bg-night ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        className="block h-full w-full object-cover"
        onPlay={() => setEnLecture(true)}
        onPause={() => setEnLecture(false)}
      />

      {/* Voile bas — détache le bouton du fond quel que soit le plan. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent"
      />

      <button
        type="button"
        onClick={basculer}
        aria-label={`${enLecture ? libelles.pause : libelles.lire} — ${legende}`}
        className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white opacity-0 backdrop-blur-md transition-opacity duration-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 group-hover:opacity-100 max-md:opacity-100"
      >
        {enLecture ? (
          <svg width="14" height="15" viewBox="0 0 14 15" aria-hidden="true">
            <rect x="1.5" y="1" width="3.5" height="13" rx="1" fill="currentColor" />
            <rect x="9" y="1" width="3.5" height="13" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="15" viewBox="0 0 14 15" aria-hidden="true">
            <path d="M2 1.6v11.8a1 1 0 0 0 1.53.85l9.2-5.9a1 1 0 0 0 0-1.7l-9.2-5.9A1 1 0 0 0 2 1.6Z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
