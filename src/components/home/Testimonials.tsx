"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import {
  bookingReviews,
  googleReviews,
  tripadvisorReviews,
  type Review,
} from "@/data/testimonials";
import type { Locale } from "@/lib/utils";

/**
 * Section Témoignages — version éditoriale 3 colonnes.
 *
 * Trois sources côte à côte (Booking / Google / TripAdvisor), chacune
 * un carrousel de paires d'avis (2 visibles à la fois). Auto-rotation
 * toutes les 6.5s, mise en pause pendant 15s après toute interaction
 * manuelle. Glissement horizontal via Pointer Events (touch + souris).
 *
 * Le header de chaque colonne — nom de source + note + étoiles + total —
 * est un lien cliquable qui ouvre la page d'avis sur la plateforme.
 *
 * Inspiration : Rosewood, Belmond, Six Senses — afficher de l'agrégé
 * source-par-source plutôt qu'un slider monolithique "tous les sites
 * confondus". Permet au visiteur de jauger rapidement la constance de
 * la réputation sur chaque canal.
 */

const ROTATE_MS = 6500;
const PAUSE_AFTER_INTERACTION_MS = 15000;
const DRAG_THRESHOLD_PX = 50;

type SourceScale = 5 | 10;

interface SourceDef {
  id: string;
  name: string;
  score: number;
  total: number;
  scale: SourceScale;
  reviews: Review[];
  url: string;
}

const sources: SourceDef[] = [
  {
    id: "booking",
    name: "Booking.com",
    score: siteConfig.ratings.booking.score,
    total: siteConfig.ratings.booking.total,
    scale: 10,
    reviews: bookingReviews,
    url: siteConfig.social.booking,
  },
  {
    id: "google",
    name: "Google",
    score: siteConfig.ratings.google.score,
    total: siteConfig.ratings.google.total,
    scale: 5,
    reviews: googleReviews,
    url: siteConfig.social.google,
  },
  {
    id: "tripadvisor",
    name: "TripAdvisor",
    score: siteConfig.ratings.tripadvisor.score,
    total: siteConfig.ratings.tripadvisor.total,
    scale: 5,
    reviews: tripadvisorReviews,
    url: siteConfig.social.tripadvisor,
  },
];

const REVIEW_NOUN: Record<Locale, string> = {
  fr: "avis",
  en: "reviews",
  es: "reseñas",
};

const VIEW_ON: Record<Locale, string> = {
  fr: "Voir sur",
  en: "View on",
  es: "Ver en",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({
  dict,
  locale,
}: {
  dict: any;
  locale: Locale;
}) {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <ScrollReveal>
            <span className="section-label">{dict.testimonials.label}</span>
            <h2 className="mb-4">{dict.testimonials.title}</h2>
            <div className="section-divider" />
          </ScrollReveal>
        </div>

        {/* 3 source columns — stack on mobile, 3-up on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          {sources.map((src, i) => (
            <ScrollReveal key={src.id} delay={i * 120}>
              <SourceColumn source={src} locale={locale} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  One source column = clickable header + paired carousel + dots
// ─────────────────────────────────────────────────────────────────────────

function SourceColumn({
  source,
  locale,
}: {
  source: SourceDef;
  locale: Locale;
}) {
  const pairsCount = Math.max(1, Math.ceil(source.reviews.length / 2));
  const [page, setPage] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownX = useRef<number | null>(null);

  // Auto-rotate. Pauses while user is actively dragging or within the
  // recent-interaction window.
  useEffect(() => {
    if (isPaused || isDragging) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % pairsCount);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [isPaused, isDragging, pairsCount]);

  // Cleanup on unmount.
  useEffect(
    () => () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    },
    []
  );

  const pauseThenResume = useCallback(() => {
    setPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setPaused(false);
    }, PAUSE_AFTER_INTERACTION_MS);
  }, []);

  const goTo = useCallback(
    (p: number) => {
      setPage(((p % pairsCount) + pairsCount) % pairsCount);
      pauseThenResume();
    },
    [pairsCount, pauseThenResume]
  );

  // ── Drag handlers (Pointer Events — touch + mouse unified) ───────────
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      pointerDownX.current = e.clientX;
      setDragX(0);
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerDownX.current === null) return;
      setDragX(e.clientX - pointerDownX.current);
    },
    []
  );

  const endDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (pointerDownX.current === null) return;
      const dx = e.clientX - pointerDownX.current;
      pointerDownX.current = null;
      setDragging(false);
      setDragX(0);
      if (Math.abs(dx) > DRAG_THRESHOLD_PX) {
        goTo(page + (dx < 0 ? 1 : -1));
      }
    },
    [goTo, page]
  );

  // Current pair of reviews.
  const pair: Review[] = source.reviews.slice(page * 2, page * 2 + 2);

  // Normalise every score to a 5-star display (Booking is on /10).
  const starRating = source.scale === 10 ? source.score / 2 : source.score;
  const scoreDisplay = source.score.toFixed(1);
  const scoreSuffix = source.scale === 10 ? "/10" : "/5";

  return (
    <div className="flex flex-col h-full">
      {/* Clickable header — name + score + stars + count all link to source */}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group text-center mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 rounded-sm p-2 -m-2"
        aria-label={`${VIEW_ON[locale]} ${source.name} — ${scoreDisplay}${scoreSuffix}, ${source.total} ${REVIEW_NOUN[locale]}`}
      >
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.3em] text-text-muted group-hover:text-gold transition-colors duration-300 mb-3">
          {source.name}
        </span>
        <span className="block font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-medium text-brown-deep group-hover:text-gold tabular-nums transition-colors duration-300 [font-variant-numeric:lining-nums_proportional-nums]">
          {scoreDisplay}
          <span className="text-base text-text-muted font-normal">
            {scoreSuffix}
          </span>
        </span>
        <span className="flex justify-center gap-0.5 mt-2 mb-2.5">
          {Array.from({ length: 5 }).map((_, j) => {
            const filled = j < Math.round(starRating);
            return (
              <span
                key={j}
                className={`text-[0.7rem] ${filled ? "text-gold" : "text-brown-deep/15"}`}
                aria-hidden="true"
              >
                ★
              </span>
            );
          })}
        </span>
        <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-text-muted tabular-nums">
          {source.total} {REVIEW_NOUN[locale]}
        </span>
      </a>

      {/* Pair — drag-able, auto-rotating */}
      <div
        className="flex-1 touch-pan-y cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          transform: `translate3d(${dragX * 0.25}px, 0, 0)`,
          transition: isDragging
            ? "none"
            : "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        <div
          key={`${source.id}-${page}`}
          className="space-y-4 animate-testimonialPair"
        >
          {pair.map((review, i) => (
            <ReviewCard
              key={`${source.id}-${page}-${i}`}
              review={review}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5 mt-7">
        {Array.from({ length: pairsCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`h-[2px] rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${
              i === page
                ? "w-7 bg-gold"
                : "w-3.5 bg-brown-deep/15 hover:bg-brown-deep/30"
            }`}
            aria-label={`${i + 1} / ${pairsCount}`}
            aria-current={i === page ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Review card — cream-tinted editorial block
// ─────────────────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  locale,
}: {
  review: Review;
  locale: Locale;
}) {
  return (
    <article className="bg-cream/40 border border-border/70 rounded-md p-6 md:p-7 min-h-[220px]">
      {/* Per-review star rating */}
      <div className="flex gap-0.5 mb-4" aria-label={`${review.rating} / 5`}>
        {Array.from({ length: 5 }).map((_, j) => {
          const filled = j < review.rating;
          return (
            <span
              key={j}
              className={`text-[0.75rem] ${filled ? "text-gold" : "text-brown-deep/15"}`}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>

      <blockquote className="font-[family-name:var(--font-sub)] text-[0.95rem] md:text-base text-text-body leading-[1.75] italic mb-5 line-clamp-[9]">
        &ldquo;{review.text[locale]}&rdquo;
      </blockquote>

      <div className="flex items-center gap-2.5 pt-1">
        <span className="block w-5 h-px bg-gold/70" />
        <span className="text-xs font-semibold text-brown-deep">
          {review.name}
        </span>
        <span className="text-[0.7rem] text-text-muted uppercase tracking-wider">
          {review.location}
        </span>
      </div>
    </article>
  );
}
