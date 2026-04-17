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
      {/* Vidéo background — sources mobile/desktop, poster pour LCP */}
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
        {/* Mobile : version 960 px, 850 Ko — suffit pour un écran téléphone */}
        <source
          src={`${basePath}/videos/hero-drone-mobile.mp4`}
          type="video/mp4"
          media="(max-width: 767px)"
        />
        {/* Desktop : 1600 px, 4,6 Mo */}
        <source
          src={`${basePath}/videos/hero-drone.mp4`}
          type="video/mp4"
        />
      </video>

      {/* Couche "filigrane clair" — cream translucide sur toute la surface
          pour désaturer un peu la vidéo et donner le mood éditorial doux
          demandé. Léger renfort noir en bas pour le contraste du texte. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(248,245,240,0.25) 0%, rgba(248,245,240,0.10) 35%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Contenu éditorial — bottom-left, inchangé vs l'ancien HeroSlider */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-24 md:pb-40">
        <div className="max-w-2xl">
          <span className="inline-block text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold-light mb-5 md:mb-6">
            {dict.hero.eyebrow}
          </span>
          <h1
            className="mb-5 md:mb-6 leading-[1.05]"
            style={{
              color: "#FFFFFF",
              textShadow: "0 2px 40px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            {dict.hero.title}
            <br />
            <em className="font-[family-name:var(--font-sub)] font-normal text-white/95">
              {dict.hero.titleEm}
            </em>
          </h1>
          <p
            className="max-w-lg text-base md:text-lg text-white/90 mb-8 md:mb-10 font-[family-name:var(--font-sub)] leading-relaxed"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
          >
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <a
              href="#rooms"
              className="btn btn--primary"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {dict.hero.cta1}
            </a>
            <a
              href="#contact"
              className="btn btn--glass"
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

      {/* Crédit discret du format — remplace les slide indicators,
          qui n'ont plus de sens avec une seule vidéo en boucle */}
      <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 lg:left-20 z-10 flex items-center gap-3">
        <span className="h-px w-8 bg-gold-light/60" />
        <span className="text-[0.6rem] text-white/60 font-mono tabular-nums uppercase tracking-[0.25em]">
          Sahambavy
        </span>
      </div>
    </section>
  );
}
