"use client";

import { useState, useEffect, useCallback } from "react";

const basePath = "/lachotelsahambavy";
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
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HeroSlider({ dict }: { dict: any }) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <span className="section-label !text-cream mb-6 drop-shadow-lg">{dict.hero.eyebrow}</span>
        <h1 className="text-white mb-4 drop-shadow-xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
          {dict.hero.title}
          <br />
          <em className="font-[family-name:var(--font-sub)] font-normal">{dict.hero.titleEm}</em>
        </h1>
        <p className="max-w-xl text-lg text-white mb-8 font-[family-name:var(--font-sub)] drop-shadow-lg">
          {dict.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#rooms" className="btn btn--primary" onClick={(e) => { e.preventDefault(); document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" }); }}>{dict.hero.cta1}</a>
          <a href="#contact" className="btn btn--outline-white" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>{dict.hero.cta2}</a>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <a href="#welcome" className="flex flex-col items-center text-white/60 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
