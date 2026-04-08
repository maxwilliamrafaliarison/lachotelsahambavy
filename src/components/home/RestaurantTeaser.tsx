"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RestaurantTeaser({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = getBasePath();

  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image composition */}
          <ScrollReveal>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={`${basePath}/images/restaurant/restaurant-01.jpg`}
                  alt="Restaurant panoramique du Lac Hotel"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Overlapping smaller image */}
              <div className="absolute -bottom-8 -right-4 md:-right-8 w-[45%] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src={`${basePath}/images/restaurant/restaurant-02.jpg`}
                  alt="Ambiance cheminee du restaurant"
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Text content */}
          <ScrollReveal delay={200}>
            <div className="lg:pl-4">
              <span className="section-label">{dict.restaurantSection.label}</span>
              <h2 className="mb-3">{dict.restaurantSection.title}</h2>
              <p className="text-gold font-[family-name:var(--font-sub)] italic text-lg mb-8">
                {dict.restaurantSection.subtitle}
              </p>
              <p className="text-text-body leading-[1.9] mb-8">{dict.restaurantSection.p1}</p>

              {/* Specialties — elegant list */}
              <ul className="space-y-3 mb-10">
                {dict.restaurantSection.specialties.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-text-body">
                    <span className="text-gold mt-1 text-xs">&#9670;</span>
                    <span className="text-sm leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>

              {/* Prices — glass cards */}
              <div className="flex gap-4 mb-10">
                {[
                  { price: "40 000 Ar", label: dict.restaurantSection.breakfast },
                  { price: "70 000 Ar", label: dict.restaurantSection.menu },
                ].map((item) => (
                  <div key={item.label} className="glass-card px-6 py-4 text-center flex-1">
                    <div className="font-[family-name:var(--font-heading)] text-xl text-brown-deep font-bold">
                      {item.price}
                    </div>
                    <div className="text-[0.6rem] text-text-muted uppercase tracking-[0.15em] mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <Link href={`/${locale}/experiences/#restaurant`} className="btn btn--outline">
                {dict.restaurantSection.cta}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
