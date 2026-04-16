"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getBasePath } from "@/lib/utils";

const basePath = getBasePath();
const slides = [
  {
    image: `${basePath}/images/hero/hero-pilotis.jpg`,
    alt: "Allée en pierre vers les bungalows sur pilotis du Lac Hôtel Sahambavy",
  },
  {
    image: `${basePath}/images/hero/hero-lake.jpg`,
    alt: "Vue panoramique des bungalows sur le lac Sahambavy",
  },
  {
    image: `${basePath}/images/hero/hero-sunset.jpg`,
    alt: "Coucher de soleil sur le lac depuis le Lac Hôtel",
  },
  {
    image: `${basePath}/images/hero/hero-garden.jpg`,
    alt: "Jardins et bungalows du Lac Hôtel Sahambavy",
  },
  {
    image: `${basePath}/images/hero/hero-drone-sunrise.jpg`,
    alt: "Vue aérienne du Lac Hôtel au lever du soleil",
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HeroSlider({ dict }: { dict: any }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        el.style.transform = `translateY(${y * 0.25}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative w-full h-[100svh] min-h-[560px] md:min-h-[700px] overflow-hidden">
      {/* Slides with parallax container */}
      <div ref={containerRef} className="absolute inset-0 will-change-transform">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === current ? "active" : ""}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center animate-kenburns"
              style={{ backgroundImage: `url(${slide.image})` }}
              role="img"
              aria-label={slide.alt}
            />
          </div>
        ))}
      </div>

      {/* Minimal cinematic overlay — very subtle, mostly bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Content — bottom-left aligned like luxury hotels */}
      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-32 md:pb-40">
        <div className="max-w-2xl">
          <span className="inline-block text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-gold mb-6">
            {dict.hero.eyebrow}
          </span>
          <h1
            className="mb-6 leading-[1.05]"
            style={{
              color: "#FFFFFF",
              textShadow: "0 2px 40px rgba(0,0,0,0.3)",
            }}
          >
            {dict.hero.title}
            <br />
            <em className="font-[family-name:var(--font-sub)] font-normal text-white/90">
              {dict.hero.titleEm}
            </em>
          </h1>
          <p
            className="max-w-lg text-base md:text-lg text-white/80 mb-10 font-[family-name:var(--font-sub)] leading-relaxed"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.3)" }}
          >
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Slide indicators — minimal line style */}
      <div className="absolute bottom-12 left-6 md:left-12 lg:left-20 z-10 flex items-center gap-3">
        <span className="text-[0.6rem] text-white/50 font-mono tabular-nums">
          {String(current + 1).padStart(2, "0")}
        </span>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`h-[2px] rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-gold" : "w-4 bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-[0.6rem] text-white/30 font-mono tabular-nums">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* Scroll indicator — elegant line */}
      <div className="absolute bottom-12 right-6 md:right-12 lg:right-20 z-10 flex flex-col items-center gap-3">
        <span className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40 [writing-mode:vertical-lr]">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute inset-x-0 h-full bg-gold animate-scrollLine" />
        </div>
      </div>
    </section>
  );
}
