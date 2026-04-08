"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Locale, getBasePath } from "@/lib/utils";
import { navigation, siteConfig } from "@/data/site";

const basePath = getBasePath();

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Navbar({ locale, dict }: { locale: Locale; dict: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const localeLinks = [
    { code: "fr" as const, flag: "🇫🇷" },
    { code: "en" as const, flag: "🇬🇧" },
    { code: "es" as const, flag: "🇪🇸" },
  ];

  function handleNav(href: string) {
    setMenuOpen(false);
    router.push(href);
  }

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : "navbar--transparent"}`}>
      {/* Main nav */}
      <div className="py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${locale}/`} className="flex items-center gap-2">
            <img
              src={`${basePath}/images/logo/logo-white.png`}
              alt="Lac Hôtel Sahambavy"
              className={`h-16 md:h-20 w-auto transition-all duration-500 ${scrolled ? "brightness-0 h-10 md:h-12" : ""}`}
            />
          </Link>

          {/* Desktop menu — minimal */}
          <div className="hidden lg:flex items-center gap-10">
            {navigation.filter((n) => n.href !== "/" && n.href !== "/contact").map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}/`}
                className={`text-[0.7rem] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:text-gold ${
                  scrolled ? "text-text-body" : "text-white/90"
                }`}
              >
                {item.label[locale]}
              </Link>
            ))}

            {/* Locale switcher */}
            <div className="flex gap-1.5 ml-2">
              {localeLinks.map((l) => (
                <Link
                  key={l.code}
                  href={`/${l.code}/`}
                  className={`text-sm transition-all ${locale === l.code ? "opacity-100 scale-110" : "opacity-40 hover:opacity-70"}`}
                >
                  {l.flag}
                </Link>
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
            <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-brown-deep" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-brown-deep" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-brown-deep" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu — glass overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 z-[999] overflow-y-auto"
          style={{ background: "rgba(248, 245, 240, 0.92)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}
        >
          <div className="flex justify-between items-center p-6">
            <img
              src={`${basePath}/images/logo/logo-white.png`}
              alt="Lac Hôtel Sahambavy"
              className="h-14 w-auto brightness-0"
            />
            <button onClick={() => setMenuOpen(false)} className="p-2 text-2xl text-brown-deep">
              ✕
            </button>
          </div>
          <div className="flex flex-col px-8 py-6 gap-1">
            {navigation.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(`/${locale}${item.href === "/" ? "" : item.href}/`)}
                className="text-2xl font-[family-name:var(--font-heading)] font-medium text-brown-deep hover:text-gold transition-colors py-4 text-left"
              >
                {item.label[locale]}
              </button>
            ))}
            <div className="flex gap-4 pt-6 mt-4 border-t border-brown-deep/10">
              {localeLinks.map((l) => (
                <Link
                  key={l.code}
                  href={`/${l.code}/`}
                  className={`text-2xl ${locale === l.code ? "opacity-100" : "opacity-40"}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.flag}
                </Link>
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
              <a href={`mailto:${siteConfig.email}`} className="block hover:text-gold">{siteConfig.email}</a>
              <a href={`tel:${siteConfig.whatsapp}`} className="block hover:text-gold">{siteConfig.phone}</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
