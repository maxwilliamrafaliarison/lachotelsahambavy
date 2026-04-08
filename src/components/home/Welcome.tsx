"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Welcome({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = getBasePath();

  return (
    <section id="welcome" className="py-32 md:py-40">
      <div className="max-w-[1300px] mx-auto px-6">
        {/* Top: editorial intro */}
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
          <ScrollReveal>
            <span className="section-label">{dict.welcome.label}</span>
            <h2 className="mb-6">{dict.welcome.title}</h2>
            <p className="text-gold font-[family-name:var(--font-sub)] italic text-lg mb-8">
              {dict.welcome.subtitle}
            </p>
            <p className="text-text-body leading-[1.9] text-base max-w-2xl mx-auto">
              {dict.welcome.p1}
            </p>
          </ScrollReveal>
        </div>

        {/* Middle: immersive image + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          {/* Main image */}
          <ScrollReveal className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src={`${basePath}/images/hero/hero-pilotis.jpg`}
                alt="Bungalows sur pilotis du Lac Hotel Sahambavy"
                className="w-full aspect-[4/3] object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                loading="lazy"
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 glass-card px-5 py-4 flex items-center gap-3">
                <div className="text-gold font-bold text-xl font-[family-name:var(--font-heading)]">4.5</div>
                <div>
                  <div className="flex text-gold text-xs gap-0.5">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                  </div>
                  <div className="text-[0.6rem] text-text-muted uppercase tracking-wider mt-0.5">TripAdvisor</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Side: paragraph + stats */}
          <div className="lg:col-span-5 space-y-10">
            <ScrollReveal delay={200}>
              <p className="text-text-body leading-[1.9] text-base">
                {dict.welcome.p2}
              </p>
            </ScrollReveal>

            {/* Stats — elegant minimal */}
            <ScrollReveal delay={300}>
              <div className="grid grid-cols-3 gap-6">
                <StatCounter value={50} suffix="+" label={dict.welcome.stat1} />
                <StatCounter value={520} suffix=" ha" label={dict.welcome.stat2} />
                <StatCounter value={28} suffix=" ans" label={dict.welcome.stat3} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <Link href={`/${locale}/hotel/`} className="btn btn--outline">
                {dict.welcome.cta}
              </Link>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom: 3-image mosaic */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <ScrollReveal className="col-span-1">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={`${basePath}/images/hero/hero-lake-sunset.jpg`}
                alt="Coucher de soleil sur le lac"
                className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100} className="col-span-1">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={`${basePath}/images/hotel/hotel-gardens.jpg`}
                alt="Jardins du Lac Hotel"
                className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200} className="col-span-1">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={`${basePath}/images/rooms/superior-02.jpg`}
                alt="Suite avec vue sur le lac"
                className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
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
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * value);
            el.textContent = `${current}${suffix}`;
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
    <div className="text-center py-4">
      <div
        ref={ref}
        className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-brown-deep font-bold leading-none"
      >
        0{suffix}
      </div>
      <div className="text-[0.6rem] text-text-muted mt-3 uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
}
