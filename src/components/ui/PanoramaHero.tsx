"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Hero « Panorama » — pleine hauteur, photo immersive, titrage géant
 * ultra-light aligné bas-gauche (grammaire Glacier Express).
 *
 * Remplace PageHero sur toutes les pages intérieures. `image` reçoit une URL
 * déjà préfixée basePath par l'appelant (convention du repo).
 *
 * - `night` : bascule le titrage en serif Cormorant + em champagne
 *   (pages signature « Nuit sur le lac »).
 * - `height` : "tall" (78vh, défaut pages intérieures) ou "full" (100svh).
 * - Parallaxe douce (rAF-throttlée), inerte si prefers-reduced-motion.
 */
type PanoramaHeroProps = {
  image: string;
  imageAlt?: string;
  label?: string;
  title: ReactNode;
  kicker?: string;
  cta?: { href: string; label: string };
  height?: "tall" | "full";
  night?: boolean;
};

export default function PanoramaHero({
  image,
  imageAlt = "",
  label,
  title,
  kicker,
  cta,
  height = "tall",
  night = false,
}: PanoramaHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      // Reduced motion : image fixe, sans parallaxe ni sur-échantillonnage.
      if (bgRef.current) bgRef.current.style.transform = "none";
      return;
    }

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (bgRef.current && window.scrollY < window.innerHeight * 1.2) {
          bgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.06)`;
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
    <section
      className={`relative overflow-hidden ${
        height === "full"
          ? "h-[100svh] min-h-[560px]"
          : "h-[78vh] min-h-[480px] md:min-h-[560px]"
      }`}
    >
      {/* Photo de fond — parallaxe désactivée si reduced-motion */}
      <div
        ref={bgRef}
        role={imageAlt ? "img" : undefined}
        aria-label={imageAlt || undefined}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${image})`,
          transform: "scale(1.06)",
        }}
      />
      {/* Voile de contraste — obligatoire sous le titrage ultra-light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,14,12,0.28) 0%, rgba(10,14,12,0) 34%, rgba(10,14,12,0.55) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 md:px-10 md:pb-20">
          {label && (
            <p
              className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] ${
                night ? "text-champagne" : "text-white/90"
              }`}
            >
              {label}
            </p>
          )}
          <h1
            className={
              night
                ? "font-[family-name:var(--font-serif)] font-normal tracking-normal text-linen [&_em]:italic [&_em]:text-champagne"
                : "text-white"
            }
            style={{ textWrap: "balance" }}
          >
            {title}
          </h1>
          {kicker && (
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-white/90 md:text-base">
              {kicker}
            </p>
          )}
          {cta && (
            <a
              href={cta.href}
              className={`mt-7 ${night ? "ge-cta ge-cta--night" : "ge-cta ge-cta--onphoto"}`}
            >
              {cta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
