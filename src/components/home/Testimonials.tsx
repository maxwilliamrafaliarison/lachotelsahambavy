"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import {
  bookingReviews,
  googleReviews,
  tripadvisorReviews,
} from "@/data/testimonials";
import type { Locale } from "@/lib/utils";

const sources = [
  {
    id: "booking",
    name: "Booking.com",
    score: siteConfig.ratings.booking.score,
    total: siteConfig.ratings.booking.total,
    reviews: bookingReviews,
  },
  {
    id: "google",
    name: "Google",
    score: siteConfig.ratings.google.score,
    total: siteConfig.ratings.google.total,
    reviews: googleReviews,
  },
  {
    id: "tripadvisor",
    name: "TripAdvisor",
    score: siteConfig.ratings.tripadvisor.score,
    total: siteConfig.ratings.tripadvisor.total,
    reviews: tripadvisorReviews,
  },
];

// Labels trilingues pour l'accessibilité des boutons de navigation.
const NAV_LABELS = {
  previous: { fr: "Avis précédent", en: "Previous review", es: "Reseña anterior" },
  next: { fr: "Avis suivant", en: "Next review", es: "Reseña siguiente" },
  review: { fr: "Avis", en: "Review", es: "Reseña" },
} as const;

const AUTO_ROTATE_MS = 7000;
const PAUSE_AFTER_INTERACTION_MS = 12000;

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({ dict, locale }: { dict: any; locale: Locale }) {
  const [activeSource, setActiveSource] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  // Pause l'auto-rotation quelques secondes après une interaction manuelle,
  // puis la reprend automatiquement — UX standard des carrousels modernes.
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSource = sources[activeSource];
  const reviewCount = currentSource.reviews.length;

  // Auto-rotation.
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviewCount);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [activeSource, reviewCount, isPaused]);

  // Cleanup timer au démontage.
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const pauseThenResume = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, PAUSE_AFTER_INTERACTION_MS);
  }, []);

  const goPrev = useCallback(() => {
    setActiveReview((prev) => (prev - 1 + reviewCount) % reviewCount);
    pauseThenResume();
  }, [reviewCount, pauseThenResume]);

  const goNext = useCallback(() => {
    setActiveReview((prev) => (prev + 1) % reviewCount);
    pauseThenResume();
  }, [reviewCount, pauseThenResume]);

  const goTo = useCallback(
    (i: number) => {
      setActiveReview(i);
      pauseThenResume();
    },
    [pauseThenResume]
  );

  return (
    <section className="py-32 md:py-40">
      <div className="max-w-[900px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="section-label">{dict.testimonials.label}</span>
            <h2>{dict.testimonials.title}</h2>
            <div className="section-divider" />
          </ScrollReveal>
        </div>

        {/* Source tabs — minimal */}
        <ScrollReveal>
          <div className="flex justify-center gap-8 mb-16">
            {sources.map((source, i) => (
              <button
                key={source.id}
                onClick={() => {
                  // Reset review + switch source in a single batch — évite
                  // l'effet (interdit par react-hooks/set-state-in-effect en React 19)
                  // et garantit qu'on n'affiche jamais un index hors-borne.
                  setActiveSource(i);
                  setActiveReview(0);
                  pauseThenResume();
                }}
                className={`flex flex-col items-center gap-2 transition-all duration-300 group ${
                  activeSource === i ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
                aria-label={`${source.name} — ${source.score}/${source.id === "booking" ? "10" : "5"}`}
              >
                <span className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-brown-deep">
                  {source.score}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span
                      key={j}
                      className={`text-[0.6rem] ${
                        j < Math.round(source.id === "booking" ? source.score / 2 : source.score)
                          ? "text-gold"
                          : "text-text-light"
                      }`}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <span className="text-[0.6rem] uppercase tracking-[0.15em] text-text-muted">
                  {source.name}
                </span>
                <span className="text-[0.6rem] text-text-muted">
                  {source.total} {locale === "fr" ? "avis" : locale === "es" ? "reseñas" : "reviews"}
                </span>
                {/* Active indicator */}
                <div
                  className={`h-[2px] w-full transition-all duration-300 ${
                    activeSource === i ? "bg-gold" : "bg-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Review carousel — centered, minimal */}
        <div className="relative">
          {/* Prev button — desktop: latéral ; mobile : masqué (arrows sous les avis) */}
          <button
            onClick={goPrev}
            aria-label={NAV_LABELS.previous[locale]}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-11 h-11 items-center justify-center rounded-full border border-brown-deep/15 bg-white/70 backdrop-blur-sm text-brown-deep hover:bg-gold hover:text-white hover:border-gold transition-all duration-300 shadow-sm hover:shadow-md z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={goNext}
            aria-label={NAV_LABELS.next[locale]}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-11 h-11 items-center justify-center rounded-full border border-brown-deep/15 bg-white/70 backdrop-blur-sm text-brown-deep hover:bg-gold hover:text-white hover:border-gold transition-all duration-300 shadow-sm hover:shadow-md z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Review slides */}
          <div className="relative min-h-[240px]">
            {currentSource.reviews.map((review, i) => (
              <div
                key={`${currentSource.id}-${i}`}
                className={`transition-all duration-700 ${
                  i === activeReview
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}
                aria-hidden={i !== activeReview}
              >
                <div className="text-center">
                  {/* Large quote */}
                  <blockquote className="text-xl md:text-2xl font-[family-name:var(--font-sub)] text-text-body italic leading-relaxed mb-10 max-w-2xl mx-auto px-6 md:px-14">
                    &ldquo;{review.text[locale]}&rdquo;
                  </blockquote>

                  {/* Author — minimal */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-[1px] h-6 bg-gold" />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-brown-deep">{review.name}</div>
                      <div className="text-[0.6rem] text-text-muted uppercase tracking-wider">
                        {review.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile arrows + dots — regroupés sous les avis */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={goPrev}
            aria-label={NAV_LABELS.previous[locale]}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-full border border-brown-deep/15 text-brown-deep hover:bg-gold hover:text-white hover:border-gold active:bg-gold active:text-white transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Dots — minimal */}
          <div className="flex items-center gap-2">
            {currentSource.reviews.map((_, i) => (
              <button
                key={i}
                className={`h-[2px] rounded-full transition-all duration-300 ${
                  i === activeReview ? "w-8 bg-gold" : "w-4 bg-brown-deep/15 hover:bg-brown-deep/30"
                }`}
                onClick={() => goTo(i)}
                aria-label={`${NAV_LABELS.review[locale]} ${i + 1}`}
                aria-current={i === activeReview ? "true" : undefined}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            aria-label={NAV_LABELS.next[locale]}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-full border border-brown-deep/15 text-brown-deep hover:bg-gold hover:text-white hover:border-gold active:bg-gold active:text-white transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Compteur discret */}
        <div className="text-center mt-4">
          <span className="text-[0.65rem] text-text-muted tracking-wider tabular-nums">
            {String(activeReview + 1).padStart(2, "0")}{" "}
            <span className="opacity-40">/</span>{" "}
            {String(reviewCount).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
