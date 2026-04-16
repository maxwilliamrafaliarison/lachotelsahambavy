"use client";

/**
 * TopBar — Barre utilitaire fine en haut de page.
 *
 * S'inspire des codes des hôtels de luxe (Le Bristol Paris, La Mamounia,
 * Rosewood, Four Seasons) : typographie compressée, ton sombre discret,
 * contact côté gauche, notes & réseaux côté droit.
 *
 * UX scroll :
 *  - Au repos (top de page) : visible (≈36 px), sous la barre dorée.
 *  - Au scroll (> 60 px) : se rétracte vers le haut, laissant la navbar
 *    principale prendre toute la largeur → look plus minimal en lecture.
 *
 * Le TopBar reste fixé tout en haut (z-index 1001, au-dessus de la Navbar).
 * La Navbar applique un `top: var(--topbar-h)` pour s'aligner en dessous.
 */

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";

export default function TopBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={hidden || undefined}
      className={`fixed top-0 left-0 right-0 z-[1001] overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
      }`}
      style={{ background: "#1A1410" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-9 flex items-center justify-between gap-4">
        {/* Left — Contact */}
        <div className="flex items-center gap-3 md:gap-5 text-cream/60 text-[0.6875rem] tracking-[0.15em] uppercase font-medium">
          <a
            href={`tel:${siteConfig.whatsapp}`}
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
            aria-label={`Appeler ${siteConfig.phone}`}
          >
            <IconPhone />
            <span>{siteConfig.phone}</span>
          </a>
          <span className="hidden md:block w-px h-3 bg-cream/15" />
          <a
            href={`mailto:${siteConfig.email}`}
            className="hidden md:flex items-center gap-1.5 hover:text-gold transition-colors normal-case tracking-normal text-[0.75rem]"
            aria-label={`Écrire à ${siteConfig.email}`}
          >
            <IconMail />
            <span>{siteConfig.email}</span>
          </a>
        </div>

        {/* Right — Ratings + Social */}
        <div className="flex items-center gap-3 md:gap-5 text-cream/60 text-[0.6875rem] tracking-[0.12em] uppercase font-medium">
          {/* Ratings — desktop only */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={siteConfig.social.tripadvisor}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
              aria-label={`Avis TripAdvisor — ${siteConfig.ratings.tripadvisor.score} sur 5`}
            >
              <IconStar />
              <span className="tabular-nums">
                {siteConfig.ratings.tripadvisor.score.toFixed(1)}
              </span>
              <span className="text-cream/40">TripAdvisor</span>
            </a>
            <span className="w-px h-3 bg-cream/15" />
            <a
              href={siteConfig.social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
              aria-label={`Avis Google — ${siteConfig.ratings.google.score} sur 5`}
            >
              <IconStar />
              <span className="tabular-nums">
                {siteConfig.ratings.google.score.toFixed(1)}
              </span>
              <span className="text-cream/40">Google</span>
            </a>
            <span className="w-px h-3 bg-cream/15" />
            <div
              className="flex items-center gap-1.5"
              aria-label={`Note Booking — ${siteConfig.ratings.booking.score} sur 10`}
            >
              <IconStar />
              <span className="tabular-nums">
                {siteConfig.ratings.booking.score.toFixed(1)}
              </span>
              <span className="text-cream/40">Booking</span>
            </div>
          </div>

          <span className="hidden lg:block w-px h-3 bg-cream/15" />

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/50 hover:text-gold transition-colors"
              aria-label="Facebook"
            >
              <IconFacebook />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/50 hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <IconInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inline icons — minimal line-style ───────────────────────── */

function IconPhone() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}
