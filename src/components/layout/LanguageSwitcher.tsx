"use client";

/**
 * Sélecteur de langue à drapeaux SVG inline.
 *
 * Pourquoi du SVG inline et surtout PAS d'emoji drapeau (🇫🇷) : Windows
 * (toutes versions, Chrome/Edge/Firefox) n'embarque aucune police avec les
 * glyphes de drapeaux régionaux. L'emoji se dégrade en « FR », « GB », « ES »
 * en lettres carrées. Inacceptable pour une clientèle européenne desktop.
 *
 * Un drapeau n'est pas une langue : le code (FR/EN/ES) reste affiché à côté
 * du drapeau, et chaque lien porte un aria-label explicite dans sa propre
 * langue (endonyme) + hrefLang/lang pour la synthèse vocale.
 *
 * Les SVG n'utilisent AUCUN id / clipPath / <style> : ils sont répétés
 * plusieurs fois par page (barre desktop + overlay mobile) sans collision.
 * Le drapeau britannique est tracé en polygones explicites (pas de stroke
 * débordant, pas de clip-path) : géométrie officielle transposée en 3:2.
 */

import type { ComponentType, CSSProperties } from "react";
import Link from "next/link";
import { locales, type Locale } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Chemin : remplace le segment de locale du chemin courant.
   Déplacé depuis Navbar.tsx (lignes 24-33), comportement inchangé.
   `pathname` vient de usePathname() : Next retire déjà le basePath,
   et <Link> le remet, donc ne PAS le préfixer ici.
   ───────────────────────────────────────────────────────────── */
export function replaceLocale(pathname: string, code: string): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && (locales as readonly string[]).includes(segments[1])) {
    segments[1] = code;
    const joined = segments.join("/") || `/${code}/`;
    return joined.endsWith("/") ? joined : `${joined}/`;
  }
  return `/${code}/`;
}

/* ─────────────────────────────────────────────────────────────
   Libellés : endonymes (chaque langue nommée dans sa langue).
   ───────────────────────────────────────────────────────────── */
const LANGUAGE_NAME: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
};

/** Libellé du groupe. À basculer plus tard dans les dictionnaires
 *  (clé suggérée : nav.language, dans src/i18n/dictionaries/{fr,en,es}.json). */
const GROUP_LABEL: Record<Locale, string> = {
  fr: "Choisir la langue",
  en: "Choose language",
  es: "Elegir idioma",
};

/* ─────────────────────────────────────────────────────────────
   Drapeaux : viewBox commun 0 0 45 30 (ratio 3:2 pour les trois,
   donc alignement parfait en ligne). Le drapeau britannique est
   officiellement 1:2 ; il est ici redessiné en 3:2 en conservant
   les épaisseurs relatives à la hauteur (croix blanche H/3, croix
   rouge H/5, sautoir blanc H/5, sautoir rouge 2H/15). C'est la
   convention des jeux d'icônes (variante « 3x2 »).
   ───────────────────────────────────────────────────────────── */

type FlagProps = { width: number; className?: string; style?: CSSProperties };

function FlagFR({ width, className, style }: FlagProps) {
  return (
    <svg
      viewBox="0 0 45 30"
      width={width}
      height={(width * 2) / 3}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="15" height="30" fill="#002654" />
      <rect x="15" width="15" height="30" fill="#FFFFFF" />
      <rect x="30" width="15" height="30" fill="#ED2939" />
    </svg>
  );
}

function FlagGB({ width, className, style }: FlagProps) {
  return (
    <svg
      viewBox="0 0 45 30"
      width={width}
      height={(width * 2) / 3}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {/* Champ bleu */}
      <rect width="45" height="30" fill="#012169" />
      {/* Sautoir de Saint-André (blanc), demi-largeur 3 → |2x−3y| ≤ 3√13 */}
      <polygon fill="#FFFFFF" points="5.408,0 45,26.394 45,30 39.592,30 0,3.606 0,0" />
      <polygon fill="#FFFFFF" points="39.592,0 0,26.394 0,30 5.408,30 45,3.606 45,0" />
      {/* Sautoir de Saint-Patrick (rouge), contre-changé : blanc large
          au-dessus du rouge côté guindant, en dessous côté battant */}
      <polygon fill="#C8102E" points="0,0 0,2.404 18.894,15 22.5,15" />
      <polygon fill="#C8102E" points="45,30 45,27.596 26.106,15 22.5,15" />
      <polygon fill="#C8102E" points="45,0 41.394,0 22.5,12.596 22.5,15" />
      <polygon fill="#C8102E" points="0,30 3.606,30 22.5,17.404 22.5,15" />
      {/* Croix de Saint-Georges : rouge bordée de blanc */}
      <rect x="17.5" width="10" height="30" fill="#FFFFFF" />
      <rect y="10" width="45" height="10" fill="#FFFFFF" />
      <rect x="19.5" width="6" height="30" fill="#C8102E" />
      <rect y="12" width="45" height="6" fill="#C8102E" />
    </svg>
  );
}

function FlagES({ width, className, style }: FlagProps) {
  return (
    <svg
      viewBox="0 0 45 30"
      width={width}
      height={(width * 2) / 3}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {/* Bandes 1:2:1, armoiries volontairement omises (illisibles < 40 px) */}
      <rect width="45" height="30" fill="#AA151B" />
      <rect y="7.5" width="45" height="15" fill="#F1BF00" />
    </svg>
  );
}

const FLAGS: Record<Locale, ComponentType<FlagProps>> = {
  fr: FlagFR,
  en: FlagGB, // EN → Union Jack (demande explicite)
  es: FlagES,
};

/* Lisibilité sur fond papier ET sur photo/nuit : liseré interne + ombre.
   Le blanc du drapeau français/britannique ne se dissout plus sur le papier,
   et le bleu marine reste détaché d'un ciel sombre. */
const FLAG_BOX_LIGHT: CSSProperties = {
  borderRadius: 2,
  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.25)",
};
const FLAG_BOX_DARK: CSSProperties = {
  borderRadius: 2,
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.42), 0 1px 3px rgba(0,0,0,0.45)",
};

/* ─────────────────────────────────────────────────────────────
   Composant
   ───────────────────────────────────────────────────────────── */

type Props = {
  /** Locale active. */
  locale: Locale;
  /** usePathname() du composant appelant (Navbar est déjà "use client"). */
  pathname: string;
  /** true = posé sur fond sombre / photo hero (texte blanc, liseré clair). */
  onDark?: boolean;
  /** "bar" = barre desktop (cible 40 px) · "mobile" = overlay (cible 44 px). */
  size?: "bar" | "mobile";
  /** Masque le code texte et ne laisse que le drapeau (aria-label conservé).
   *  À n'utiliser que si la barre desktop devient trop étroite. */
  hideCode?: boolean;
  className?: string;
};

export default function LanguageSwitcher({
  locale,
  pathname,
  onDark = false,
  size = "bar",
  hideCode = false,
  className = "",
}: Props) {
  const isMobile = size === "mobile";
  const flagWidth = isMobile ? 22 : 18;
  const flagStyle = onDark ? FLAG_BOX_DARK : FLAG_BOX_LIGHT;

  return (
    <div
      role="group"
      aria-label={GROUP_LABEL[locale]}
      className={`flex items-center ${isMobile ? "gap-2" : "gap-1"} ${className}`}
    >
      {locales.map((code) => {
        const Flag = FLAGS[code];
        const active = code === locale;

        // Cibles tactiles : 40 px (bar) / 44 px (mobile) de haut, largeur mini
        // identique quand le code est masqué.
        const base = isMobile
          ? "h-11 min-w-11 px-3 gap-2 text-[13px]"
          : "h-10 min-w-10 px-2.5 gap-1.5 text-[11px]";

        const state = active
          ? onDark
            ? "bg-white/20 text-white"
            : "bg-lake/10 text-lake"
          : onDark
            ? "text-white/85 hover:bg-white/12 hover:text-white"
            : "text-ink/70 hover:bg-ink/5 hover:text-ink";

        const focus = onDark
          ? "focus-visible:ring-white/80"
          : "focus-visible:ring-lake/60";

        return (
          <Link
            key={code}
            href={replaceLocale(pathname, code)}
            hrefLang={code}
            lang={code}
            aria-label={LANGUAGE_NAME[code]}
            aria-current={active ? "page" : undefined}
            title={LANGUAGE_NAME[code]}
            className={`inline-flex items-center justify-center rounded-full font-semibold tracking-[0.12em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 ${base} ${state} ${focus}`}
            style={onDark ? { textShadow: "0 1px 8px rgba(0,0,0,0.35)" } : undefined}
          >
            <Flag width={flagWidth} className="shrink-0" style={flagStyle} />
            {!hideCode && <span aria-hidden="true">{code.toUpperCase()}</span>}
          </Link>
        );
      })}
    </div>
  );
}
