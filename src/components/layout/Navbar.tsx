"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation, siteConfig, type NavItem } from "@/data/site";
import { getBasePath, locales, type Locale } from "@/lib/utils";

const basePath = getBasePath();

/** Fin de la plage du glass progressif (px de scroll) — valeur éprouvée. */
const SCROLL_END = 180;

/**
 * Localise un href interne : "/hotel#philosophie" → "/fr/hotel/#philosophie".
 * Trailing slash obligatoire (config trailingSlash: true).
 */
function localizeHref(href: string, locale: string): string {
  const [path, hash] = href.split("#");
  const normalized = path === "/" ? `/${locale}/` : `/${locale}${path}/`;
  return hash ? `${normalized}#${hash}` : normalized;
}

/** Remplace le segment de locale du chemin courant (sélecteur de langue). */
function replaceLocale(pathname: string, code: string): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && (locales as readonly string[]).includes(segments[1])) {
    segments[1] = code;
    const joined = segments.join("/") || `/${code}/`;
    return joined.endsWith("/") ? joined : `${joined}/`;
  }
  return `/${code}/`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Navbar({ locale, dict }: { locale: Locale; dict: any }) {
  const pathname = usePathname();
  const [ratio, setRatio] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  /* — Scroll : ratio 0 (transparent sur hero) → 1 (papier opaque) — */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setRatio(Math.min(1, Math.max(0, window.scrollY / SCROLL_END)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* — Verrou scroll body quand l'overlay mobile est ouvert — */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* — Fermer menus à la navigation — */
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  /* — Fermeture au clic extérieur / Échap — */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  }, []);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const eased = ratio * ratio * (3 - 2 * ratio); // smoothstep
  const solid = openMenu !== null; // panneau ouvert → barre opaque immédiate
  const bg = solid ? 1 : eased;
  const darkText = bg > 0.55;

  const primaryItems = navigation.filter((n) => n.primary !== false);
  const mobileItems = navigation;

  const itemColor = darkText ? "text-ink" : "text-white";
  const itemShadow = darkText ? undefined : { textShadow: "0 1px 8px rgba(0,0,0,0.35)" };

  return (
    <>
      <header
        ref={navRef}
        className="fixed inset-x-0 z-[1000] transition-[top] duration-300"
        style={{ top: ratio > 0.33 ? 0 : 36 }}
        onMouseLeave={scheduleClose}
      >
        <nav
          aria-label="Navigation principale"
          className="relative"
          style={{
            background: `rgba(251, 250, 247, ${0.94 * bg})`,
            backdropFilter: bg > 0.05 ? `blur(${18 * bg}px) saturate(${100 + 60 * bg}%)` : undefined,
            WebkitBackdropFilter:
              bg > 0.05 ? `blur(${18 * bg}px) saturate(${100 + 60 * bg}%)` : undefined,
            borderBottom: `1px solid rgba(231, 228, 220, ${bg})`,
          }}
        >
          <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-5 md:px-8">
            {/* Marque — mark + lockup typographique */}
            <a
              href={`${basePath}/${locale}/`}
              className={`flex shrink-0 items-center gap-3 ${itemColor}`}
              style={itemShadow}
              aria-label="Lac Hôtel Sahambavy — Accueil"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/images/logo/${darkText ? "logo-mark-dark" : "logo-mark-white"}.png`}
                alt=""
                className="h-9 w-auto"
              />
              <span className="hidden flex-col leading-none xl:flex">
                <span className="font-[family-name:var(--font-display)] text-[17px] font-light tracking-[0.18em]">
                  LAC HÔTEL
                </span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] opacity-80">
                  Sahambavy · Madagascar
                </span>
              </span>
            </a>

            {/* Menu desktop */}
            <ul className="ml-auto hidden items-center gap-0.5 lg:flex">
              {primaryItems.map((item) => (
                <li key={item.href}>
                  {item.children ? (
                    <button
                      type="button"
                      aria-expanded={openMenu === item.href}
                      aria-haspopup="true"
                      onMouseEnter={() => {
                        cancelClose();
                        setOpenMenu(item.href);
                      }}
                      onFocus={() => setOpenMenu(item.href)}
                      onClick={() => setOpenMenu(openMenu === item.href ? null : item.href)}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded px-1.5 py-2 text-[11px] font-medium uppercase tracking-[0.09em] transition-colors ${itemColor} ${
                        darkText ? "hover:text-tea" : "hover:text-white/75"
                      }`}
                      style={itemShadow}
                    >
                      {(item.shortLabel ?? item.label)[locale]}
                      <svg
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${openMenu === item.href ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M1 1l3.5 3.5L8 1"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  ) : (
                    <a
                      href={`${basePath}${localizeHref(item.href, locale)}`}
                      className={`block whitespace-nowrap rounded px-1.5 py-2 text-[11px] font-medium uppercase tracking-[0.09em] transition-colors ${itemColor} ${
                        darkText ? "hover:text-tea" : "hover:text-white/75"
                      }`}
                      style={itemShadow}
                    >
                      {(item.shortLabel ?? item.label)[locale]}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Sélecteur de langue — préserve la page courante */}
            <div
              className={`hidden items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] lg:flex ${itemColor}`}
              style={itemShadow}
            >
              {locales.map((code, i) => (
                <span key={code} className="flex items-center gap-1.5">
                  {i > 0 && <span className="opacity-35">·</span>}
                  <a
                    href={`${basePath}${replaceLocale(pathname, code)}`}
                    aria-current={code === locale ? "page" : undefined}
                    className={
                      code === locale
                        ? darkText
                          ? "text-tea underline underline-offset-4"
                          : "underline underline-offset-4"
                        : "opacity-65 transition-opacity hover:opacity-100"
                    }
                  >
                    {code.toUpperCase()}
                  </a>
                </span>
              ))}
            </div>

            {/* CTA Réserver */}
            <a href={`${basePath}/${locale}/contact/`} className="ge-cta hidden !px-5 !py-2.5 !text-[11.5px] lg:inline-flex">
              {dict.nav.book}
            </a>

            {/* Burger mobile */}
            <button
              type="button"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={`ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden ${mobileOpen ? "text-ink" : itemColor}`}
              style={mobileOpen ? undefined : itemShadow}
            >
              <span
                className={`h-[1.5px] w-6 bg-current transition-transform duration-300 ${mobileOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-[1.5px] w-6 bg-current transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-[1.5px] w-6 bg-current transition-transform duration-300 ${mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>

          {/* Méga-menu desktop */}
          {primaryItems.map(
            (item) =>
              item.children &&
              openMenu === item.href && (
                <div
                  key={`panel-${item.href}`}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                  className="absolute inset-x-0 top-full hidden border-b border-hairline bg-paper/[0.97] backdrop-blur-xl lg:block"
                >
                  <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-10 gap-y-1 px-10 py-7 xl:grid-cols-3">
                    <a
                      href={`${basePath}${localizeHref(item.href, locale)}`}
                      className="col-span-full mb-2 flex items-baseline gap-3 text-ink transition-colors hover:text-tea"
                    >
                      <span className="font-[family-name:var(--font-display)] text-[22px] font-extralight tracking-[-0.01em]">
                        {item.label[locale]}
                      </span>
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-tea">
                        {locale === "fr" ? "Voir la page" : locale === "es" ? "Ver la página" : "View page"}
                      </span>
                    </a>
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={`${basePath}${localizeHref(child.href, locale)}`}
                        className="group flex items-center gap-2.5 rounded px-2 py-2 text-[14px] text-body transition-colors hover:text-tea"
                      >
                        <span className="h-px w-4 bg-hairline transition-all duration-200 group-hover:w-6 group-hover:bg-tea" />
                        {child.label[locale]}
                      </a>
                    ))}
                  </div>
                </div>
              )
          )}
        </nav>
      </header>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[900] overflow-y-auto bg-paper/[0.97] backdrop-blur-2xl lg:hidden">
          <div className="flex min-h-full flex-col px-6 pb-12 pt-24">
            <ul className="flex flex-col">
              <li>
                <a
                  href={`${basePath}/${locale}/`}
                  className="block border-b border-hairline py-4 font-[family-name:var(--font-display)] text-[22px] font-extralight text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {locale === "fr" ? "Accueil" : locale === "es" ? "Inicio" : "Home"}
                </a>
              </li>
              {mobileItems.map((item: NavItem) => (
                <li key={item.href} className="border-b border-hairline">
                  <div className="flex items-center">
                    <a
                      href={`${basePath}${localizeHref(item.href, locale)}`}
                      className="grow py-4 font-[family-name:var(--font-display)] text-[22px] font-extralight text-ink"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label[locale]}
                    </a>
                    {item.children && (
                      <button
                        type="button"
                        aria-label={`${item.label[locale]} — sous-menu`}
                        aria-expanded={mobileSection === item.href}
                        onClick={() => setMobileSection(mobileSection === item.href ? null : item.href)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center text-muted"
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 9 6"
                          fill="none"
                          aria-hidden="true"
                          className={`transition-transform duration-200 ${mobileSection === item.href ? "rotate-180" : ""}`}
                        >
                          <path
                            d="M1 1l3.5 3.5L8 1"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {item.children && mobileSection === item.href && (
                    <ul className="pb-4 pl-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={`${basePath}${localizeHref(child.href, locale)}`}
                            className="block py-2 text-[14.5px] text-body"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label[locale]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4 text-[13px] font-semibold tracking-[0.14em]">
              {locales.map((code) => (
                <a
                  key={code}
                  href={`${basePath}${replaceLocale(pathname, code)}`}
                  aria-current={code === locale ? "page" : undefined}
                  className={code === locale ? "text-tea underline underline-offset-4" : "text-muted"}
                >
                  {code.toUpperCase()}
                </a>
              ))}
            </div>

            <a href={`${basePath}/${locale}/contact/`} className="ge-cta mt-8 self-start">
              {dict.nav.book}
            </a>

            <div className="mt-8 flex flex-col gap-2 text-[13.5px] text-body">
              <a href={`mailto:${siteConfig.email}`} className="hover:text-tea">
                {siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.whatsapp}`} className="hover:text-tea">
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
