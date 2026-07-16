"use client";

import { useEffect, useRef } from "react";
import { getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/**
 * Hero vidéo — remplace le carrousel d'images d'accueil par un plan
 * drone lent (DJI_0626, segment 30-48 s) qui met en valeur l'hôtel
 * avec la plantation de thé dans les collines en arrière-plan.
 *
 * Approche "filigrane clair" : la vidéo tourne en fond, un overlay
 * crème/dégradé doux adoucit l'ensemble pour que ça ne crie pas — on
 * n'est pas sur une publicité télé, on est sur un mood éditorial à la
 * Aman / Belmond. Le texte et les CTA gardent un contraste correct grâce
 * à un léger dégradé noir translucide sur la moitié basse seulement.
 *
 * Optimisations :
 *  - `<source media>` split entre mobile (960 px) et desktop (1600 px)
 *    → l'iPhone ne charge pas la version 4,6 Mo en 4G
 *  - `poster` = frame du segment pour que le LCP soit quasi-instantané
 *    (l'image se peint avant que la vidéo ait fini de buffer)
 *  - `preload="metadata"` seulement (pas le fichier entier d'un coup)
 *  - Respect de `prefers-reduced-motion` : on fige l'affiche au lieu
 *    d'autoplay (les utilisateurs sensibles au mouvement voient juste
 *    la photo, le site reste utilisable)
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HeroVideo({ dict }: { dict: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax subtil sur la vidéo — pas trop marqué, juste de quoi donner
  // de la profondeur quand l'utilisateur commence à scroller.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        el.style.transform = `translateY(${y * 0.2}px) scale(1.05)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Respect du prefers-reduced-motion — on laisse la vidéo en pause
  // pour les utilisateurs qui ont désactivé les animations système.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const el = videoRef.current;
    if (!el) return;
    if (mql.matches) {
      el.pause();
      el.currentTime = 0.5; // une frame visible, pas l'écran noir
    }
  }, []);

  return (
    <section className="relative w-full h-[100svh] min-h-[560px] md:min-h-[700px] overflow-hidden">
      {/* Vidéo background — palindrome aller-retour pour que la boucle soit
          sans coupure visible (frame de fin = frame de début grâce au
          concat forward + reverse côté ffmpeg). Sources mobile/desktop.

          Pas de filtre CSS : le client a fait son propre color grading
          sur la source (accentuation des couleurs pour sortir du "fade")
          — la désaturer ici annulerait son travail. */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={`${basePath}/videos/hero-drone-poster.jpg`}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ transform: "scale(1.05)" }}
      >
        {/* Mobile : version 960 px, 800 Ko — suffit pour un écran téléphone */}
        <source
          src={`${basePath}/videos/hero-drone-mobile.mp4`}
          type="video/mp4"
          media="(max-width: 767px)"
        />
        {/* Desktop : 1600 px, 4,0 Mo */}
        <source
          src={`${basePath}/videos/hero-drone.mp4`}
          type="video/mp4"
        />
      </video>

      {/* Overlay — scrim haut léger pour la navbar (qui a son propre
          text-shadow côté nav-items), zone centrale quasi-transparente
          pour laisser respirer les couleurs vives du color grading
          client, puis renfort noir progressif en bas pour le contraste
          du H1 et des CTA. Plus de wash cream maintenant que la vidéo
          n'est plus fade. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0.62) 100%)",
        }}
      />

      {/* Contenu éditorial — bottom-left. Titrage « Panorama » : géant,
          ultra-light, une seule voix typographique (l'italique Cormorant
          est réservé au monde Nuit des pages signature). */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-24 md:pb-36">
        <div className="max-w-4xl">
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 mb-4 md:mb-5"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}
          >
            {dict.hero.eyebrow}
          </span>
          <h1
            className="mb-5 md:mb-6"
            style={{
              color: "#FFFFFF",
              textShadow: "0 2px 40px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.3)",
              textWrap: "balance",
            }}
          >
            {dict.hero.title}
            <br />
            {dict.hero.titleEm}
          </h1>
          <p
            className="max-w-[52ch] text-[15px] md:text-base text-white/90 mb-8 md:mb-10 leading-relaxed"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
          >
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <a
              href="#rooms"
              className="ge-cta"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {dict.hero.cta1}
            </a>
            <a
              href="#contact"
              className="ge-cta ge-cta--onphoto"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {dict.hero.cta2}
            </a>
          </div>
        </div>
      </div>

      {/* Signature discrète bas-gauche */}
      <div className="absolute bottom-8 md:bottom-10 left-6 md:left-12 lg:left-20 z-10 flex items-center gap-3">
        <span className="h-px w-8 bg-white/40" />
        <span className="text-[0.6rem] text-white/60 tabular-nums uppercase tracking-[0.25em]">
          Sahambavy
        </span>
      </div>
    </section>
  );
}
