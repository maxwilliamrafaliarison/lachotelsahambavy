"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Locale, getBasePath } from "@/lib/utils";
import { navigation, siteConfig } from "@/data/site";

const basePath = getBasePath();

/**
 * Plages de scroll :
 *  - 0 → SCROLL_START : navbar 100 % transparente, logo blanc, texte clair.
 *  - SCROLL_START → SCROLL_END : opacité/flou augmentent progressivement.
 *  - > SCROLL_END : état "scrolled" complet (glass blanc, logo brun).
 *
 * Le seuil visuel (couleur de texte / logo) bascule à SCROLL_THRESHOLD,
 * légèrement plus tôt pour éviter d'avoir du texte blanc illisible sur fond
 * devenu trop laiteux.
 */
const SCROLL_START = 20;
const SCROLL_END = 180;
const SCROLL_THRESHOLD = 110;

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Navbar({ locale, dict }: { locale: Locale; dict: any }) {
  const [ratio, setRatio] = useState(0);
  const [topbarHidden, setTopbarHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rafRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const r = Math.max(0, Math.min((y - SCROLL_START) / (SCROLL_END - SCROLL_START), 1));
        setRatio(r);
        setTopbarHidden(y > 60);
        rafRef.current = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrolled = ratio >= 1;
  const darkText = ratio > SCROLL_THRESHOLD / SCROLL_END;

  // Hero-top mode — show the FULL lockup (logo gris + tagline "The natural
  // choice") à grande taille tant que l'utilisateur n'a pas commencé à
  // scroller, sur TOUTES les pages (accueil, L'Hôtel, Hébergements, etc.).
  // Dès qu'il scroll, morph vers le mark compact. Toutes les pages du site
  // ont un <PageHero> (70 vh min 500 px), donc l'espace est suffisant pour
  // que le lockup respire sans chevaucher le titre de la page.
  const heroBrandMode = ratio < 0.08;

  // Typographic locale switcher — emoji flags read as DIY, a two-letter
  // code in uppercase tracking sits better next to nav-links of the same
  // weight (cf. Le Bristol, La Mamounia).
  const localeLinks = [
    { code: "fr" as const },
    { code: "en" as const },
    { code: "es" as const },
  ];

  function handleNav(href: string) {
    setMenuOpen(false);
    router.push(href);
  }

  // Progressive glass — eases cubically for a more natural feel
  const eased = ratio * ratio * (3 - 2 * ratio);
  const navStyle = {
    top: topbarHidden ? 0 : 36,
    background: `rgba(255, 255, 255, ${0.6 * eased})`,
    backdropFilter: eased > 0.02 ? `blur(${24 * eased}px) saturate(${100 + 80 * eased}%)` : "none",
    WebkitBackdropFilter: eased > 0.02 ? `blur(${24 * eased}px) saturate(${100 + 80 * eased}%)` : "none",
    borderBottom: `1px solid rgba(255, 255, 255, ${0.3 * eased})`,
    boxShadow:
      eased > 0.05
        ? `0 4px 30px rgba(0, 0, 0, ${0.06 * eased}), inset 0 1px 0 rgba(255, 255, 255, ${0.5 * eased})`
        : "none",
    transition:
      "top 0.5s cubic-bezier(0.22, 1, 0.36, 1), background 0.15s linear, backdrop-filter 0.15s linear, -webkit-backdrop-filter 0.15s linear, border-color 0.15s linear, box-shadow 0.15s linear",
  } as React.CSSProperties;

  return (
    <nav className="fixed left-0 right-0 z-[1000]" style={navStyle}>
      {/* Main nav */}
      <div className="py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          {/* Logo — hero-top sur TOUTES les pages : lockup complet couleur
              avec la tagline "The natural choice" en grande taille. Dès que
              l'utilisateur scroll : morph vers le mark compact (brun sur fond
              glass, blanc tant qu'on est sur la photo du hero). */}
          <Link href={`/${locale}/`} className="flex items-center gap-2">
            <img
              src={`${basePath}/images/logo/${
                heroBrandMode
                  ? "logo-color"
                  : darkText
                  ? "logo-mark-dark"
                  : "logo-mark-white"
              }.png`}
              alt="Lac Hôtel Sahambavy — The natural choice"
              className={`w-auto transition-all duration-500 ${
                heroBrandMode
                  ? "h-28 md:h-36 lg:h-40"
                  : darkText
                  ? "h-11 md:h-14"
                  : "h-16 md:h-20"
              }`}
            />
          </Link>

          {/* Desktop menu — minimal */}
          <div className="hidden lg:flex items-center gap-10">
            {navigation
              .filter((n) => n.href !== "/" && n.href !== "/contact")
              .map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}/`}
                  className={`text-[0.7rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:text-gold ${
                    darkText ? "text-text-body" : "text-white/90"
                  }`}
                >
                  {item.label[locale]}
                </Link>
              ))}

            {/* Locale switcher */}
            <div className="flex items-center gap-3 ml-2">
              {localeLinks.map((l, i) => (
                <span key={l.code} className="flex items-center gap-3">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className={`inline-block w-px h-3 ${darkText ? "bg-brown-deep/20" : "bg-white/30"}`}
                    />
                  )}
                  <Link
                    href={`/${l.code}/`}
                    className={`text-[0.65rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                      locale === l.code
                        ? darkText ? "text-gold" : "text-white"
                        : darkText ? "text-text-body/50 hover:text-gold" : "text-white/55 hover:text-white"
                    }`}
                    aria-current={locale === l.code ? "page" : undefined}
                  >
                    {l.code.toUpperCase()}
                  </Link>
                </span>
              ))}
            </div>

            {/* Book CTA */}
            <Link
              href={`/${locale}/contact/`}
              className={`text-[0.7rem] font-semibold uppercase tracking-[0.2em] px-6 py-2.5 rounded-full transition-all duration-300 ${
                scrolled
                  ? "bg-gold text-white hover:bg-brown-deep"
                  : "bg-white/15 backdrop-blur-md text-white border border-white/30 hover:bg-white/25"
              }`}
            >
              {dict.nav.book}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                darkText ? "bg-brown-deep" : "bg-white"
              } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                darkText ? "bg-brown-deep" : "bg-white"
              } ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                darkText ? "bg-brown-deep" : "bg-white"
              } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu — glass overlay (covers TopBar too) */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-0 z-[1200] overflow-y-auto"
          style={{
            background: "rgba(248, 245, 240, 0.92)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
          }}
        >
          <div className="flex justify-between items-center p-6">
            <img
              src={`${basePath}/images/logo/logo-dark.png`}
              alt="Lac Hôtel Sahambavy"
              className="h-20 w-auto"
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-brown-deep"
              aria-label="Fermer le menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col px-8 py-6 gap-1">
            {navigation.map((item) => (
              <button
                key={item.href}
                onClick={() =>
                  handleNav(`/${locale}${item.href === "/" ? "" : item.href}/`)
                }
                className="text-2xl font-[family-name:var(--font-heading)] font-medium text-brown-deep hover:text-gold transition-colors py-4 text-left"
              >
                {item.label[locale]}
              </button>
            ))}
            <div className="flex items-center gap-4 pt-6 mt-4 border-t border-brown-deep/10">
              {localeLinks.map((l, i) => (
                <span key={l.code} className="flex items-center gap-4">
                  {i > 0 && <span aria-hidden="true" className="inline-block w-px h-4 bg-brown-deep/20" />}
                  <Link
                    href={`/${l.code}/`}
                    className={`text-sm font-medium uppercase tracking-[0.25em] transition-colors ${
                      locale === l.code ? "text-gold" : "text-brown-deep/60 hover:text-gold"
                    }`}
                    aria-current={locale === l.code ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.code.toUpperCase()}
                  </Link>
                </span>
              ))}
            </div>
            <button
              onClick={() => handleNav(`/${locale}/contact/`)}
              className="btn btn--primary mt-6 text-center"
            >
              {dict.nav.book}
            </button>

            {/* Contact info in mobile menu */}
            <div className="mt-8 pt-6 border-t border-brown-deep/10 space-y-2 text-sm text-text-muted">
              <a
                href={`mailto:${siteConfig.email}`}
                className="block hover:text-gold"
              >
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.whatsapp}`}
                className="block hover:text-gold"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
