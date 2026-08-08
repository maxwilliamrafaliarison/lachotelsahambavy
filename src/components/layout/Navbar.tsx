"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, siteConfig, type NavItem } from "@/data/site";
import { getBasePath, type Locale } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";

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

/** La rubrique correspond-elle à la page affichée ? (pour le filet actif) */
function estActif(pathname: string, href: string, locale: string): boolean {
  const cible = href.split("#")[0];
  if (cible === "/") return pathname === `/${locale}/`;
  return pathname.startsWith(`/${locale}${cible}`);
}

/**
 * Teinte des pastilles, par rubrique.
 *
 * Elle n'est pas décorative : chaque rubrique prend la couleur de ce
 * qu'elle contient — la terre cuite des murs en pisé et des bungalows sur
 * pilotis, le bleu de l'eau pour les activités nautiques, le vert des
 * théiers pour les jardins et la plantation. Le visiteur apprend la
 * correspondance sans qu'on la lui explique.
 *
 * Deux triplets par teinte : le fond de la pastille (couleur vive, posée
 * à 12 % d'opacité) et son encre (variante foncée, seule à porter du
 * texte). Les ratios sont calculés dans l'en-tête du bloc CSS.
 */
type Teinte = { fond: string; pale: string; encre: string };

const TERRE: Teinte = { fond: "166 69 23", pale: "247 227 214", encre: "133 54 15" };
const LAC: Teinte = { fond: "23 104 168", pale: "220 234 244", encre: "18 84 127" };
const THE: Teinte = { fond: "38 71 27", pale: "223 232 218", encre: "27 53 19" };

const TEINTES: Record<string, Teinte> = {
  "/hotel": TERRE, // les murs en pisé
  "/hebergements": TERRE, // les bungalows ocre sur pilotis
  "/experiences": LAC, // canoë, pédalos, l'eau
  "/train-fce": TERRE, // le wagon 1930
  "/jardins": THE, // les jardins et la plantation
};

const TEINTE_DEFAUT = TERRE;

/** Variables CSS de teinte, à poser sur le plateau ou la feuille. */
function styleTeinte(href: string): React.CSSProperties {
  const t = TEINTES[href.split("#")[0]] ?? TEINTE_DEFAUT;
  return {
    "--lh-past": t.fond,
    "--lh-past-pale": t.pale,
    "--lh-past-ink": t.encre,
  } as React.CSSProperties;
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
  /**
   * Type de pointeur de la dernière interaction (souris / doigt / stylet).
   *
   * Sans cette distinction, le clic se battait avec le survol : le navigateur
   * ouvre le panneau sur `mouseenter`, puis le `click` qui suit le refermait
   * aussitôt. À la souris c'était un clignotement ; au doigt c'était bloquant,
   * car le tactile synthétise un `mouseenter` avant le `click` — le panneau
   * ne pouvait jamais rester ouvert sur les écrans tactiles ≥ 1280 px.
   */
  const pointerType = useRef<string>("");

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

  const closeAll = useCallback(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, []);

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
  /* La barre ne se rend plus opaque à l'ouverture d'un panneau. C'était une
     béquille du bandeau papier : un panneau blanc pleine largeur au-dessous
     d'une barre transparente donnait une marche visible. Le panneau étant
     désormais une carte de verre sombre détachée, la barre garde son état
     de défilement — transparente sur la photo, papier une fois descendue. */
  const bg = eased;
  const darkText = bg > 0.55;

  const primaryItems = navigation.filter((n) => n.primary !== false);
  const mobileItems = navigation;

  const itemColor = darkText ? "text-ink" : "text-white";
  const itemShadow = darkText ? undefined : { textShadow: "0 1px 8px rgba(0,0,0,0.35)" };

  /**
   * Marque géante de l'accueil (demande de Maggie, 17/07/2026) : le lockup
   * complet s'affiche très grand sur le ciel de la photo hero, puis rétrécit
   * et se fond dans la marque compacte au défilement.
   *
   * `brand` va de 1 (haut de page) à 0, plus vite que le fondu de la barre :
   * le lockup a fini de disparaître avant que la barre ne devienne claire —
   * sinon on verrait un logo blanc sur fond papier. Un lockup réduit à 36 px
   * serait illisible : on l'échelonne ET on le fond, la marque compacte
   * prenant le relais en fondu inverse.
   */
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const brand = isHome ? Math.max(0, 1 - eased * 1.9) : 0;
  const markOpacity = isHome ? 1 - brand : 1;

  return (
    <>
      <header
        ref={navRef}
        className="fixed inset-x-0 z-[1000] transition-[top] duration-300"
        style={{ top: ratio > 0.33 ? 0 : 36 }}
        onMouseLeave={scheduleClose}
      >
        {/* Le verre de la barre est posé dans un calque enfant, jamais sur
            <nav> : un élément qui porte backdrop-filter devient un
            « backdrop root », et ses descendants ne floutent plus que lui.
            Tant que le filtre vivait ici, le flou du méga-menu — qui en
            descend — ne floutait rien du tout. */}
        <nav aria-label="Navigation principale" className="lh-barre">
          <div
            aria-hidden="true"
            className="lh-barre__verre"
            style={{
              background: `rgba(251, 250, 247, ${0.94 * bg})`,
              backdropFilter: bg > 0.05 ? `blur(${18 * bg}px) saturate(${100 + 60 * bg}%)` : undefined,
              WebkitBackdropFilter:
                bg > 0.05 ? `blur(${18 * bg}px) saturate(${100 + 60 * bg}%)` : undefined,
              borderBottom: `1px solid rgba(231, 228, 220, ${bg})`,
            }}
          />

          <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-5 md:px-8">
            {/* Marque — mark + lockup typographique */}
            <Link
              href={`/${locale}/`}
              className={`flex shrink-0 items-center gap-3 ${itemColor}`}
              style={itemShadow}
              aria-label="Lac Hôtel Sahambavy — Accueil"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/images/logo/${darkText ? "logo-embleme-dark" : "logo-embleme-white"}.png`}
                alt=""
                className="h-9 w-auto transition-opacity duration-200"
                style={{ opacity: markOpacity }}
              />
            </Link>

            {/* Emblème géant — accueil, haut de page. Décoratif (la marque
                compacte au-dessous porte déjà le lien et le libellé).

                On affiche l'emblème SEUL, sans le bloc de signature
                « Lac Hotel Sahambavy / The Natural choice » ni les deux
                filets du cadre d'origine : le nom du lieu était écrit
                quatre fois sur ce seul écran. Débarrassé de sa signature,
                l'emblème récupère toute la hauteur — il passe d'environ
                98 px à 288 px, soit près de trois fois plus grand, sans
                dépasser sa définition native (406 × 420 px, plafond de la
                source fournie par l'hôtel). */}
            {/* `!mobileOpen` : l'en-tête est au-dessus de la feuille mobile
                (z-1000 contre z-900, pour que le bouton de fermeture reste
                cliquable). Sans cette garde, l'emblème géant traversait le
                verre et se superposait aux rubriques. */}
            {brand > 0.01 && !mobileOpen && (
              <div
                aria-hidden="true"
                /* top-[86px] : l'emblème est désormais recadré au plus juste,
                   sans la marge interne du cadre d'origine. Laissé à top-3 il
                   remontait dans la rangée du menu et passait sous « L'Hôtel »
                   et « Hébergements ». On le pose donc sous la barre (68 px)
                   plutôt que de le rapetisser pour éviter la collision. */
                className="pointer-events-none absolute left-5 top-[86px] origin-top-left md:left-8"
                style={{
                  opacity: brand,
                  transform: `scale(${0.32 + 0.68 * brand})`,
                  // Ombre en deux temps : un liseré net qui détache le tracé
                  // du ciel clair, puis un halo doux. Sans cela le logo blanc
                  // se dissout sur le bleu et la signature disparaît.
                  filter:
                    "drop-shadow(0 1px 2px rgba(0,0,0,0.55)) drop-shadow(0 4px 34px rgba(0,0,0,0.45))",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/images/logo/logo-embleme-white.png`}
                  alt=""
                  className="h-28 w-auto sm:h-36 md:h-44 lg:h-52"
                />
              </div>
            )}

            {/* Menu desktop */}
            <ul className="ml-auto hidden items-center gap-0.5 min-[1280px]:flex">
              {primaryItems.map((item, i) => (
                <li key={item.href} className="relative">
                  {item.children ? (
                    /* La rubrique est un LIEN, plus un bouton. C'est ce qui
                       permet de supprimer la mention « Voir la page » du
                       panneau : la page de section se rejoint en cliquant
                       son propre intitulé, ce qui est plus court et plus
                       naturel. Le survol continue d'ouvrir le panneau. */
                    <Link
                      href={localizeHref(item.href, locale)}
                      aria-expanded={openMenu === item.href}
                      aria-haspopup="true"
                      /* Le doigt n'a pas de survol : on ignore le `pointerenter`
                         que le tactile synthétise, sinon il ouvre le panneau
                         juste avant que le `click` ne le referme. */
                      onPointerEnter={(e) => {
                        if (e.pointerType !== "mouse") return;
                        cancelClose();
                        setOpenMenu(item.href);
                      }}
                      onPointerDown={(e) => {
                        pointerType.current = e.pointerType;
                      }}
                      onFocus={() => setOpenMenu(item.href)}
                      onClick={(e) => {
                        // Doigt : le premier appui OUVRE (on retient la
                        // navigation), le second suit le lien. Sans cela le
                        // sous-menu serait inatteignable au tactile.
                        if (pointerType.current !== "mouse" && e.detail !== 0) {
                          if (openMenu !== item.href) {
                            e.preventDefault();
                            setOpenMenu(item.href);
                          }
                          return;
                        }
                        // Souris et clavier : on laisse le lien naviguer, et
                        // on referme pour que le panneau ne survive pas au
                        // changement de page.
                        closeAll();
                      }}
                      className={`group/nav relative flex items-center gap-1.5 whitespace-nowrap px-2 py-2 text-[13px] font-medium uppercase tracking-[0.07em] transition-colors ${itemColor}`}
                      style={itemShadow}
                    >
                      {(item.shortLabel ?? item.label)[locale]}
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-2 bottom-0.5 h-[2px] origin-left rounded-full bg-terracotta transition-transform duration-300 ease-out ${
                          estActif(pathname, item.href, locale) || openMenu === item.href
                            ? "scale-x-100"
                            : "scale-x-0 group-hover/nav:scale-x-100"
                        }`}
                      />
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
                    </Link>
                  ) : null}

                  {/* Panneau — ancré dans son <li> et non après </ul>.
                      Outre le fait qu'il devient une carte posée sous sa
                      rubrique au lieu d'un bandeau pleine largeur, cela
                      corrige l'ordre de tabulation : rendu après la liste,
                      il envoyait le focus vers le sélecteur de langue au
                      lieu d'entrer dans le sous-menu. */}
                  {item.children && openMenu === item.href && (
                    <div
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                      style={styleTeinte(item.href)}
                      className={`lh-plateau hidden min-[1280px]:block ${
                        i >= primaryItems.length - 2 ? "lh-plateau--fin" : ""
                      }`}
                    >
                      <span aria-hidden="true" className="lh-plateau__reflet" />
                      <div className="lh-pastilles">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={localizeHref(child.href, locale)}
                            onClick={closeAll}
                            className="lh-pastille"
                          >
                            {child.label[locale]}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {!item.children && (
                    <Link
                      href={localizeHref(item.href, locale)}
                      className={`group/nav relative block whitespace-nowrap px-2 py-2 text-[13px] font-medium uppercase tracking-[0.07em] transition-colors ${itemColor}`}
                      style={itemShadow}
                    >
                      {(item.shortLabel ?? item.label)[locale]}
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-x-2 bottom-0.5 h-[2px] origin-left rounded-full bg-terracotta transition-transform duration-300 ease-out ${
                          estActif(pathname, item.href, locale)
                            ? "scale-x-100"
                            : "scale-x-0 group-hover/nav:scale-x-100"
                        }`}
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Sélecteur de langue à drapeaux — préserve la page courante */}
            <LanguageSwitcher
              locale={locale}
              pathname={pathname}
              onDark={!darkText}
              size="bar"
              hideCode
              className="hidden min-[1280px]:flex"
            />

            {/* CTA Réserver */}
            <Link href={`/${locale}/contact/`} className="ge-cta hidden !px-6 !py-3 !text-[12.5px] min-[1280px]:inline-flex">
              {dict.nav.book}
            </Link>

            {/* Burger mobile */}
            <button
              type="button"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className={`ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] min-[1280px]:hidden ${mobileOpen ? "text-ink" : itemColor}`}
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

        </nav>
      </header>

      {/* Feuille mobile — même verre clair, mêmes pastilles que le desktop */}
      {mobileOpen && (
        <div className="lh-feuille fixed inset-0 z-[900] overflow-y-auto min-[1280px]:hidden">
          <div className="flex min-h-full flex-col px-6 pb-12 pt-24">
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href={`/${locale}/`}
                  style={styleTeinte("/hotel")}
                  className="lh-feuille__rubrique"
                  onClick={closeAll}
                >
                  {locale === "fr" ? "Accueil" : locale === "es" ? "Inicio" : "Home"}
                </Link>
              </li>
              {mobileItems.map((item: NavItem) => (
                <li key={item.href} style={styleTeinte(item.href)}>
                  <div className="flex items-center gap-2">
                    <Link
                      href={localizeHref(item.href, locale)}
                      className="lh-feuille__rubrique"
                      onClick={closeAll}
                    >
                      {item.label[locale]}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        aria-label={`${item.label[locale]} — sous-menu`}
                        aria-expanded={mobileSection === item.href}
                        onClick={() => setMobileSection(mobileSection === item.href ? null : item.href)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[rgb(var(--lh-past-ink))] transition-colors hover:bg-[rgb(var(--lh-past)/0.12)]"
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
                    <div className="lh-pastilles mt-3 pb-2 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={localizeHref(child.href, locale)}
                          className="lh-pastille"
                          onClick={closeAll}
                        >
                          {child.label[locale]}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <LanguageSwitcher
              locale={locale}
              pathname={pathname}
              size="mobile"
              className="mt-8"
            />

            <Link href={`/${locale}/contact/`} className="ge-cta mt-8 self-start">
              {dict.nav.book}
            </Link>

            <div className="mt-8 flex flex-col gap-2 text-[13.5px] text-body">
              <a href={`mailto:${siteConfig.email}`} className="hover:text-lake">
                {siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.whatsapp}`} className="hover:text-lake">
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
