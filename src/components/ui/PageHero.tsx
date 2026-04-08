"use client";

import { useEffect, useRef } from "react";

export default function PageHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string;
  image: string;
}) {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translateY(${y * 0.3}px) scale(1.05)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
      <div
        ref={imgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${image})`, transform: "scale(1.05)" }}
      />
      {/* Cinematic gradient — darker at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pb-16 md:pb-20">
        <div className="max-w-2xl">
          <div className="w-12 h-[2px] bg-gold mb-6" />
          <h1
            className="mb-4"
            style={{
              color: "#FFFFFF",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/80 font-[family-name:var(--font-sub)] max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
