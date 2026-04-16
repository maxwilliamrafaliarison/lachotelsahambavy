"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { rooms } from "@/data/rooms";
import { type Locale, getBasePath } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RoomsGrid({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = getBasePath();
  const displayRooms = rooms.filter((r) => r.priceEUR && r.category !== "repos");

  return (
    <section id="rooms" className="py-32 md:py-40">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <ScrollReveal>
            <span className="section-label">{dict.rooms.label}</span>
            <h2 className="mb-4">{dict.rooms.title}</h2>
            <p className="text-text-muted font-[family-name:var(--font-sub)] text-lg leading-relaxed">
              {dict.rooms.subtitle}
            </p>
            <div className="section-divider" />
          </ScrollReveal>
        </div>

        {/* Immersive room cards — alternating layout */}
        <div className="space-y-24">
          {displayRooms.map((room, i) => (
            <ScrollReveal key={room.id} delay={100}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 items-stretch ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}>
                {/* Image — full height */}
                <div className={`relative overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="aspect-[4/3] lg:aspect-auto lg:absolute lg:inset-0">
                    <img
                      src={room.images[0] ? `${basePath}${room.images[0]}` : `${basePath}/images/hero/hero-pilotis.jpg`}
                      alt={room.name[locale]}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {room.badge && (
                    <span className="absolute top-6 left-6 bg-gold/90 backdrop-blur-sm text-white text-[0.6rem] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full">
                      {room.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className={`flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white ${
                  i % 2 === 1 ? "lg:order-1" : ""
                }`}>
                  <span className="text-[0.6rem] text-text-muted uppercase tracking-[0.25em] mb-3">
                    {room.type[locale]}
                  </span>
                  <h3 className="text-2xl md:text-3xl mb-4 leading-tight">{room.name[locale]}</h3>
                  <div className="w-8 h-[1.5px] bg-gold mb-6" />
                  <p className="text-text-body leading-[1.9] mb-8">
                    {room.description[locale]}
                  </p>

                  {/* Amenities — minimal icons */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {room.amenities.slice(0, 5).map((a, j) => (
                      <span
                        key={j}
                        className="text-[0.65rem] text-text-muted uppercase tracking-wider bg-cream px-3 py-1.5 rounded-full"
                      >
                        {a.icon} {a.label[locale]}
                      </span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-end justify-between pt-6 border-t border-border">
                    <div>
                      <span className="text-[0.6rem] text-text-muted uppercase tracking-wider block mb-1">
                        {dict.rooms.from}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-brown-deep font-bold">
                          {room.priceEUR ? `€${room.priceEUR}` : `${room.priceAR?.toLocaleString()} Ar`}
                        </span>
                        <span className="text-sm text-text-muted">{dict.rooms.night}</span>
                      </div>
                    </div>
                    <Link
                      href={`/${locale}/hebergements/`}
                      className="btn btn--primary text-[0.65rem] py-3 px-6"
                    >
                      {dict.rooms.book}
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-20">
          <ScrollReveal>
            <Link href={`/${locale}/hebergements/`} className="btn btn--outline">
              {dict.rooms.viewAll}
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
