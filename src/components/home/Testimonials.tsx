"use client";

import { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { testimonials } from "@/data/testimonials";
import type { Locale } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({ dict, locale }: { dict: any; locale: Locale }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-[800px] mx-auto px-4">
        <SectionHeader
          label={dict.testimonials.label}
          title={dict.testimonials.title}
        />

        <div className="relative min-h-[200px]">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`transition-all duration-500 ${
                i === current ? "opacity-100 relative" : "opacity-0 absolute inset-0"
              }`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-gold text-lg">★</span>
                  ))}
                </div>
                <blockquote className="text-lg font-[family-name:var(--font-sub)] text-text-body italic mb-6 leading-relaxed">
                  &ldquo;{t.text[locale]}&rdquo;
                </blockquote>
                <div className="font-semibold text-text-dark">{t.name}</div>
                <div className="text-sm text-text-muted">{t.location} · {t.source}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
