"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    image: "https://www.lachotel.com/wp-content/uploads/piscine-4-605x465.jpg",
    alt: "Piscine en ardoise du Lac Hôtel Sahambavy avec vue sur le lac",
  },
  {
    image: "https://www.lachotel.com/wp-content/uploads/lachotel-terrasse-605x465.jpg",
    alt: "Terrasse des bungalows sur pilotis au coucher du soleil",
  },
  {
    image: "https://www.lachotel.com/wp-content/uploads/lac-hotel-slide_home-2-605x465.jpg",
    alt: "Vue panoramique du lac Sahambavy depuis le Lac Hôtel",
  },
  {
    image: "https://www.lachotel.com/wp-content/uploads/ramasseur-de-the-605x465.jpg",
    alt: "Cueilleuses de thé dans la plantation de Sahambavy",
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/75" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <span className="section-label !text-gold mb-6">{dict.hero.eyebrow}</span>
        <h1 className="text-white mb-4">
          {dict.hero.title}
          <br />
          <em className="font-[family-name:var(--font-sub)] font-normal">{dict.hero.titleEm}</em>
        </h1>
        <p className="max-w-xl text-lg text-white/80 mb-8 font-[family-name:var(--font-sub)]">
          {dict.hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#rooms" className="btn btn--primary">{dict.hero.cta1}</a>
          <a href="#contact" className="btn btn--outline-white">{dict.hero.cta2}</a>
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
