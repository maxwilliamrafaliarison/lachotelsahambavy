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
 * Chaque colonne (Booking / Google / TripAdvisor) affiche EN PERMANENCE
 * deux cartes (jamais de tuile vide : les avis défilent en boucle par
 * arithmétique modulaire sur l'index). Auto-rotation toutes les 6.5 s,
 * mise en pause 15 s après toute interaction manuelle. Glissement
 * horizontal carte-par-carte (drag → ±1 avis, pas ±2) via Pointer
 * Events — touch + souris unifiés.
 *
 * Les cartes ont une hauteur fixe : la grille reste parfaitement
 * régulière même si les textes varient, et on privilégie le fixed-
 * height + line-clamp à un lien « Lire la suite » (Belmond, Aman,
 * Rosewood procèdent ainsi — discrétion éditoriale). Un drapeau du
 * pays accompagne la localisation pour souligner la dimension
 * internationale des avis.
 *
 * En bas de colonne : un compteur tabulaire « 03 / 15 » + deux flèches
 * de navigation discrètes remplacent les dots (15 pastilles seraient
 * illisibles). Header de colonne = lien vers la plateforme d'origine.
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

const NAV_PREV: Record<Locale, string> = {
  fr: "Avis précédent",
  en: "Previous review",
  es: "Reseña anterior",
};

const NAV_NEXT: Record<Locale, string> = {
  fr: "Avis suivant",
  en: "Next review",
  es: "Reseña siguiente",
};

// Drapeaux Unicode (paires région-indicateur) — clé = nom de pays
// en français tel que stocké dans testimonials.ts. Discret, lisible,
// zéro dépendance externe. Fallback = rien si pays inconnu.
const COUNTRY_FLAGS: Record<string, string> = {
  "Allemagne": "🇩🇪",
  "Australie": "🇦🇺",
  "Autriche": "🇦🇹",
  "Belgique": "🇧🇪",
  "Brésil": "🇧🇷",
  "Canada": "🇨🇦",
  "Espagne": "🇪🇸",
  "États-Unis": "🇺🇸",
  "Finlande": "🇫🇮",
  "France": "🇫🇷",
  "Irlande": "🇮🇪",
  "Italie": "🇮🇹",
  "Japon": "🇯🇵",
  "La Réunion": "🇷🇪",
  "Luxembourg": "🇱🇺",
  "Madagascar": "🇲🇬",
  "Norvège": "🇳🇴",
  "Pays-Bas": "🇳🇱",
  "Portugal": "🇵🇹",
  "Royaume-Uni": "🇬🇧",
  "Suède": "🇸🇪",
  "Suisse": "🇨🇭",
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
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <span className="ge-label mb-4">{dict.testimonials.label}</span>
            <h2 style={{ textWrap: "balance" }}>{dict.testimonials.title}</h2>
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
//  One source column = clickable header + looped 2-card carousel + counter
// ─────────────────────────────────────────────────────────────────────────

function SourceColumn({
  source,
  locale,
}: {
  source: SourceDef;
  locale: Locale;
}) {
  const N = source.reviews.length;
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setDragging] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownX = useRef<number | null>(null);

  // Auto-rotate par pas de 1 (carte-par-carte). Pause pendant le drag et
  // dans la fenêtre de 15 s après toute interaction manuelle.
  useEffect(() => {
    if (isPaused || isDragging) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % N);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [isPaused, isDragging, N]);

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

  const advance = useCallback(
    (delta: number) => {
      setIndex((i) => (((i + delta) % N) + N) % N);
      pauseThenResume();
    },
    [N, pauseThenResume]
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
        advance(dx < 0 ? 1 : -1);
      }
    },
    [advance]
  );

  // Toujours DEUX cartes — modulo N garantit qu'il n'y a jamais de tuile
  // vide, même si on « dépasse » la fin de la liste.
  const topIdx = ((index % N) + N) % N;
  const bottomIdx = (topIdx + 1) % N;
  const topReview = source.reviews[topIdx];
  const bottomReview = source.reviews[bottomIdx];

  // Normalise chaque score vers une étoile /5 (Booking /10 → /5).
  const starRating = source.scale === 10 ? source.score / 2 : source.score;
  const scoreDisplay = source.score.toFixed(1);
  const scoreSuffix = source.scale === 10 ? "/10" : "/5";

  // Compteur tabulaire « 03 / 15 » — plus lisible que 15 dots.
  const counter = `${String(topIdx + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;

  return (
    <div className="flex flex-col h-full">
      {/* Clickable header — name + score + stars + count all link to source */}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group text-center mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake/40 rounded-[3px] p-2 -m-2"
        aria-label={`${VIEW_ON[locale]} ${source.name} (${scoreDisplay}${scoreSuffix}, ${source.total} ${REVIEW_NOUN[locale]})`}
      >
        <span className="ge-label mb-3 transition-colors duration-300 group-hover:text-lake-deep">
          {source.name}
        </span>
        <span className="block text-3xl md:text-4xl font-light text-ink group-hover:text-lake tabular-nums transition-colors duration-300 [font-variant-numeric:lining-nums_proportional-nums]">
          {scoreDisplay}
          <span className="text-base text-muted font-normal">
            {scoreSuffix}
          </span>
        </span>
        <span className="flex justify-center gap-0.5 mt-2 mb-2.5">
          {Array.from({ length: 5 }).map((_, j) => {
            const filled = j < Math.round(starRating);
            return (
              <span
                key={j}
                className={`text-[0.7rem] ${filled ? "text-terracotta" : "text-ink/15"}`}
                aria-hidden="true"
              >
                ★
              </span>
            );
          })}
        </span>
        <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-muted tabular-nums">
          {source.total} {REVIEW_NOUN[locale]}
        </span>
      </a>

      {/* Two cards — drag-able, auto-rotating, always populated */}
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
          key={`${source.id}-${topIdx}`}
          className="space-y-4"
        >
          <div className="animate-testimonialCard">
            <ReviewCard review={topReview} locale={locale} />
          </div>
          <div
            className="animate-testimonialCard"
            style={{ animationDelay: "80ms" }}
          >
            <ReviewCard review={bottomReview} locale={locale} />
          </div>
        </div>
      </div>

      {/* Counter + prev/next — sobriety over dots (15 pastilles seraient illisibles) */}
      <div className="flex items-center justify-center gap-4 mt-7">
        <button
          type="button"
          onClick={() => advance(-1)}
          aria-label={NAV_PREV[locale]}
          className="text-ink/40 hover:text-lake transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake/40 rounded-full p-1"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-[0.65rem] tabular-nums uppercase tracking-[0.25em] text-muted min-w-[5ch] text-center">
          {counter}
        </span>
        <button
          type="button"
          onClick={() => advance(1)}
          aria-label={NAV_NEXT[locale]}
          className="text-ink/40 hover:text-lake transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake/40 rounded-full p-1"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  Review card — fixed-height editorial block with country flag
// ─────────────────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  locale,
}: {
  review: Review;
  locale: Locale;
}) {
  const flag = COUNTRY_FLAGS[review.location];
  return (
    <article className="bg-white border border-hairline rounded-[3px] p-6 md:p-7 h-[260px] flex flex-col">
      {/* Per-review star rating */}
      <div className="flex gap-0.5 mb-4" aria-label={`${review.rating} / 5`}>
        {Array.from({ length: 5 }).map((_, j) => {
          const filled = j < review.rating;
          return (
            <span
              key={j}
              className={`text-[0.75rem] ${filled ? "text-terracotta" : "text-ink/15"}`}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>

      <blockquote className="text-sm md:text-[0.95rem] text-body leading-[1.7] mb-5 line-clamp-5 flex-1">
        &ldquo;{review.text[locale]}&rdquo;
      </blockquote>

      <div className="flex items-center gap-2.5 pt-1 mt-auto">
        <span className="block w-5 h-px bg-terracotta/60 shrink-0" />
        <span className="text-xs font-semibold text-ink shrink-0">
          {review.name}
        </span>
        <span className="text-[0.7rem] text-muted uppercase tracking-wider inline-flex items-center gap-1.5 min-w-0 truncate">
          <span className="truncate">{review.location}</span>
          {flag && (
            <span
              aria-hidden="true"
              className="text-sm leading-none shrink-0"
            >
              {flag}
            </span>
          )}
        </span>
      </div>
    </article>
  );
}
