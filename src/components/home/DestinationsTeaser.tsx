"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";

const basePath = getBasePath();

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DestinationsTeaser({ dict, locale }: { dict: any; locale: Locale }) {
  return (
    <section className="py-16 md:py-40">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Two side-by-side feature blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plantation de Thé */}
          <ScrollReveal>
            <Link
              href={`/${locale}/plantation-de-the/`}
              className="group relative block rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[3/4]"
            >
              <img
                src={`${basePath}/images/tea/plantation-drone-overhead.jpg`}
                alt={dict.destinations.plantation.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <span className="inline-block text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gold mb-3">
                  {dict.destinations.plantation.label}
                </span>
                <h3 className="text-2xl md:text-3xl text-white mb-3 leading-tight">
                  {dict.destinations.plantation.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-md">
                  {dict.destinations.plantation.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold group-hover:tracking-[0.25em] transition-all duration-300">
                  {dict.destinations.plantation.cta}
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </ScrollReveal>

          {/* Le Repos */}
          <ScrollReveal delay={150}>
            <Link
              href={`/${locale}/le-repos/`}
              className="group relative block rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-[3/4]"
            >
              <img
                src={`${basePath}/images/rooms/le-repos-exterior.jpg`}
                alt={dict.destinations.repos.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <span className="inline-block text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gold mb-3">
                  {dict.destinations.repos.label}
                </span>
                <h3 className="text-2xl md:text-3xl text-white mb-3 leading-tight">
                  {dict.destinations.repos.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-md">
                  {dict.destinations.repos.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold group-hover:tracking-[0.25em] transition-all duration-300">
                  {dict.destinations.repos.cta}
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
