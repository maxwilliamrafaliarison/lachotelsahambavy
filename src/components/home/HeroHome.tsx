"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/**
 * Hero d'accueil — photo plein écran (KimPaffen : l'hôtel vu du lac).
 *
 * Remplace l'ancien hero vidéo (choix de Maggie, 16/07/2026) : la photo
 * porte mieux la direction « Panorama » — titrage géant ultra-light posé
 * sur le plan d'eau, dont l'uniformité garantit le contraste.
 *
 * Parallaxe douce, inerte si prefers-reduced-motion. L'image est en
 * `preload` (LCP) et sert d'unique point d'entrée visuel du site.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HeroHome({ dict }: { dict: any }) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      if (bgRef.current) bgRef.current.style.transform = "none";
      return;
    }
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (bgRef.current && window.scrollY < window.innerHeight) {
          bgRef.current.style.transform = `translateY(${window.scrollY * 0.2}px) scale(1.05)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden md:min-h-[700px]">
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.05)" }}
      >
        <Image
          src={`${basePath}/images/hero/hotel-vu-du-lac-bungalows-pilotis.jpg`}
          alt="Les bungalows sur pilotis du Lac Hôtel vus depuis le lac Sahambavy"
          fill
          sizes="100vw"
          preload
          className="object-cover object-center"
        />
      </div>

      {/* Voile de contraste. Le ciel et les nuages (moitié haute) restent
          lumineux ; la moitié basse — où le titrage ultra-light croise la
          bande texturée des bungalows — est nettement assombrie. Sans cela,
          l'Inter Tight 200 devient illisible sur le feuillage. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.10) 20%, rgba(0,0,0,0.02) 38%, rgba(0,0,0,0.38) 58%, rgba(0,0,0,0.64) 78%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:px-12 md:pb-36 lg:px-20">
        <div className="max-w-4xl">
          {/* Le sur-titre « Sahambavy · Madagascar » a été retiré : l'emblème
              géant, juste au-dessus, écrit déjà « Sahambavy - Fianarantsoa /
              Madagascar ». La clé dict.hero.eyebrow reste en place, elle sert
              encore de label au hero de la page « L'Hôtel », où l'emblème
              géant ne s'affiche pas. */}
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
            className="mb-8 max-w-[52ch] text-[15px] leading-relaxed text-white/90 md:mb-10 md:text-base"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
          >
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
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

    </section>
  );
}
