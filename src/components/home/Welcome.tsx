"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Welcome({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = getBasePath();

  return (
    <section id="welcome" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <ScrollReveal>
            <span className="section-label">{dict.welcome.label}</span>
            <h2 className="mb-4">{dict.welcome.title}</h2>
            <p className="text-sm text-brown-deep/80 font-[family-name:var(--font-sub)] italic mb-6">
              {dict.welcome.subtitle}
            </p>
            <p className="text-text-body mb-4 leading-relaxed">{dict.welcome.p1}</p>
            <p className="text-text-body mb-8 leading-relaxed">{dict.welcome.p2}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCounter value={45} suffix="+" label={dict.welcome.stat1} />
              <StatCounter value={520} suffix=" ha" label={dict.welcome.stat2} />
              <StatCounter value={20} suffix=" ans" label={dict.welcome.stat3} />
            </div>

            <Link href={`/${locale}/hebergements/`} className="btn btn--outline">
              {dict.welcome.cta}
            </Link>
          </ScrollReveal>

          {/* Image collage */}
          <ScrollReveal delay={200} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src={`${basePath}/images/hero/hero-lake-sunset.jpg`}
                  alt="Vue du lac depuis le Lac Hôtel Sahambavy"
                  className="rounded-xl w-full h-48 object-cover"
                  loading="lazy"
                />
                <img
                  src={`${basePath}/images/hotel/hotel-gardens.jpg`}
                  alt="Jardins du Lac Hôtel"
                  className="rounded-xl w-full h-64 object-cover"
                  loading="lazy"
                />
              </div>
              <div className="pt-8">
                <img
                  src={`${basePath}/images/hero/hero-pilotis.jpg`}
                  alt="Bungalows sur pilotis du Lac Hôtel Sahambavy"
                  className="rounded-xl w-full h-80 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            {/* TripAdvisor badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
              <div className="text-green-tea font-bold text-2xl">4.5</div>
              <div>
                <div className="flex text-gold text-sm">★★★★★</div>
                <div className="text-xs text-text-muted">TripAdvisor</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            start = Math.floor(progress * value);
            el.textContent = `${start}${suffix}`;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix]);

  return (
    <div className="text-center">
      <div ref={ref} className="font-[family-name:var(--font-heading)] text-3xl text-brown-brand font-bold">
        0{suffix}
      </div>
      <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}
