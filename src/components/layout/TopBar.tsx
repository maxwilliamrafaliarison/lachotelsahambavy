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
        <div className="flex items-center gap-3 md:gap-5 text-[0.6875rem] tracking-[0.12em] uppercase font-medium">
          {/* Ratings — desktop only */}
          <div className="hidden lg:flex items-center gap-4">
            <RatingLink
              href={siteConfig.social.tripadvisor}
              score={siteConfig.ratings.tripadvisor.score}
              max={5}
              label={`Avis TripAdvisor — ${siteConfig.ratings.tripadvisor.score} sur 5`}
              Logo={LogoTripAdvisor}
            />
            <span className="w-px h-3 bg-cream/15" />
            <RatingLink
              href={siteConfig.social.google}
              score={siteConfig.ratings.google.score}
              max={5}
              label={`Avis Google — ${siteConfig.ratings.google.score} sur 5`}
              Logo={LogoGoogle}
            />
            <span className="w-px h-3 bg-cream/15" />
            <RatingLink
              href={siteConfig.social.booking}
              score={siteConfig.ratings.booking.score}
              max={10}
              label={`Note Booking — ${siteConfig.ratings.booking.score} sur 10`}
              Logo={LogoBooking}
            />
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

/* ── Rating link — star + score /max + brand logo, colorizes on hover ─── */

function RatingLink({
  href,
  score,
  max,
  label,
  Logo,
}: {
  href: string;
  score: number;
  max: 5 | 10;
  label: string;
  Logo: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex items-center gap-1.5"
    >
      <IconStar className="text-cream/50 transition-colors duration-300 group-hover:text-gold" />
      <span className="tabular-nums text-cream/70 transition-colors duration-300 group-hover:text-gold">
        {score.toFixed(1)}
      </span>
      <span className="text-cream/30 transition-colors duration-300 group-hover:text-gold/70">
        /{max}
      </span>
      <Logo className="ml-1 grayscale opacity-55 brightness-125 transition-[filter,opacity] duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100" />
    </a>
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

function IconStar({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z" />
    </svg>
  );
}

/* ── Brand logo marks — rendered in brand colors, desaturated by CSS ─── */

function LogoTripAdvisor({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="11"
      viewBox="0 0 128 79"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Official owl mark — two eyes + body, in TripAdvisor green */}
      <g fill="#34E0A1">
        <path d="M64 0C49.7 0 36 3.3 23.7 9.6H0l12 12.9C4.8 29 .5 38.5.5 49c0 16.4 13.3 29.7 29.7 29.7 7.8 0 14.9-3 20.2-7.9L64 78.7l13.6-7.9c5.3 4.9 12.4 7.9 20.2 7.9 16.4 0 29.7-13.3 29.7-29.7 0-10.5-4.3-20-11.4-26.5l11.9-12.9h-23.8C91.9 3.3 78.3 0 64 0zM30.2 71.7c-12.5 0-22.7-10.2-22.7-22.7s10.2-22.7 22.7-22.7 22.7 10.2 22.7 22.7S42.7 71.7 30.2 71.7zm33.8-3.9c-3.1-6.2-9.2-10.5-16.5-11.2 5-5.3 8.1-12.4 8.1-20.2 0-11-6.2-20.5-15.3-25.3 7.9-3.5 16.6-5.5 23.7-5.5s15.8 2 23.7 5.5c-9.1 4.8-15.3 14.3-15.3 25.3 0 7.8 3.1 14.9 8.1 20.2-7.3.7-13.4 5-16.5 11.2zm33.8 3.9c-12.5 0-22.7-10.2-22.7-22.7s10.2-22.7 22.7-22.7 22.7 10.2 22.7 22.7-10.2 22.7-22.7 22.7z" />
        <circle cx="30.2" cy="49" r="11.1" fill="#000" />
        <circle cx="97.8" cy="49" r="11.1" fill="#000" />
      </g>
    </svg>
  );
}

function LogoGoogle({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 9.5c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 2.69 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function LogoBooking({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Booking.com "B." lettermark — navy square, white B + dot */}
      <rect width="32" height="32" rx="5" fill="#003580" />
      <path
        fill="#ffffff"
        d="M10.4 8h6.1c3.1 0 5 1.2 5 3.9 0 1.4-.7 2.5-1.9 3.1 1.6.5 2.6 1.9 2.6 3.8 0 3.2-2.3 4.6-5.7 4.6h-6.1V8zm5.8 6.4c1.3 0 2-.5 2-1.7s-.7-1.7-2-1.7h-2.7v3.4h2.7zm.4 6.4c1.5 0 2.3-.6 2.3-2 0-1.3-.8-2-2.3-2h-3.1v4h3.1z"
      />
      <circle cx="25" cy="24" r="2.2" fill="#00a4f0" />
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
