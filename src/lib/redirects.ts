/**
 * Redirections 301 depuis l'ancien site WordPress.
 * Cf. Phase 5 §5.6 — Plan de migration SEO trilingue.
 *
 * Note technique Next.js 16 / path-to-regexp v8 :
 *   Le modifier `*` (repeat) ne peut pas être à la fin d'un pattern sans suffixe.
 *   Solution : pour chaque chemin "racine + sous-chemin", on déclare DEUX redirections :
 *     1. exact match (ex: "/wp-content")
 *     2. sub-paths via catch-all nommé avec suffixe explicite
 *   OU on utilise un wildcard unique `/:slug*` quand il est suivi d'autre chose.
 */

import type { NextConfig } from "next";

type Redirect = NonNullable<Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>>[number];

/**
 * Helper — crée deux redirections pour gérer la racine ET les sous-chemins.
 * Évite le bug path-to-regexp v8 avec `:path*` en fin de pattern.
 */
function both(source: string, destination: string): Redirect[] {
  return [
    { source, destination, permanent: true },
    { source: `${source}/:rest*`, destination, permanent: true },
  ];
}

/**
 * Comme `both`, mais SANS l'attrape-tout des sous-chemins.
 *
 * À réserver aux segments hérités qui portent aujourd'hui une vraie page
 * enfant. Cas vécu : `/fr/reservation` redirigeait vers `/fr/contact/`
 * avec son `:rest*`, lequel avalait `/fr/reservation/confirmation/` — la
 * page vers laquelle le formulaire pousse après envoi. Le client validait
 * sa demande et atterrissait sur le formulaire de contact au lieu de sa
 * confirmation, en français comme en anglais. L'espagnol fonctionnait,
 * faute de redirection équivalente : c'est ce qui a mis la puce à
 * l'oreille.
 *
 * Les redirections Next sont évaluées AVANT le routage : on ne peut pas
 * compter sur la page pour « gagner » contre le motif. Il faut donc que
 * le motif ne corresponde pas.
 */
function racineSeule(source: string, destination: string): Redirect[] {
  return [{ source, destination, permanent: true }];
}

export const wordpressRedirects: Redirect[] = [
  // ─── WordPress assets / admin ───────────────────────────────
  ...both("/wp-content", "/"),
  ...both("/wp-admin", "/"),
  ...both("/wp-includes", "/"),
  { source: "/wp-login.php", destination: "/", permanent: true },
  { source: "/xmlrpc.php", destination: "/", permanent: true },
  ...both("/feed", "/"),
  ...both("/comments/feed", "/"),
  ...both("/trackback", "/"),

  // ─── Anciennes URLs FR ──────────────────────────────────────
  ...both("/fr/chambres-et-hebergements", "/fr/hebergements/"),
  ...both("/fr/chambres", "/fr/hebergements/"),
  ...both("/fr/our-rooms", "/fr/hebergements/"),
  ...both("/fr/restaurant-bar", "/fr/restaurant/"),
  ...both("/fr/notre-restaurant", "/fr/restaurant/"),
  ...both("/fr/plantation", "/fr/plantation-de-the/"),
  ...both("/fr/the", "/fr/plantation-de-the/"),
  ...both("/fr/the-fce", "/fr/train-fce/"),
  ...both("/fr/train", "/fr/train-fce/"),
  ...both("/fr/excursions", "/fr/experiences/"),
  // NOTE : /fr/activites est une vraie page (Loisirs, sous-page d'Expériences)
  // depuis la refonte 2026 — ne pas la rediriger.
  ...both("/fr/about", "/fr/hotel/"),
  ...both("/fr/a-propos", "/fr/hotel/"),
  ...both("/fr/galerie-photos", "/fr/galerie/"),
  ...both("/fr/photos", "/fr/galerie/"),
  ...both("/fr/contact-us", "/fr/contact/"),
  ...both("/fr/reserver", "/fr/contact/"),
  ...racineSeule("/fr/reservation", "/fr/contact/"), // page enfant : /reservation/confirmation/
  ...both("/fr/booking", "/fr/contact/"),

  // ─── Anciennes URLs EN ──────────────────────────────────────
  ...both("/en/rooms-accomodations", "/en/hebergements/"),
  ...both("/en/rooms-accommodations", "/en/hebergements/"),
  ...both("/en/rooms", "/en/hebergements/"),
  ...both("/en/our-rooms", "/en/hebergements/"),
  ...both("/en/accommodation", "/en/hebergements/"),
  ...both("/en/restaurant-bar", "/en/restaurant/"),
  ...both("/en/our-restaurant", "/en/restaurant/"),
  ...both("/en/plantation", "/en/plantation-de-the/"),
  ...both("/en/tea", "/en/plantation-de-the/"),
  ...both("/en/tea-plantation", "/en/plantation-de-the/"),
  ...both("/en/fce-train", "/en/train-fce/"),
  ...both("/en/train", "/en/train-fce/"),
  ...both("/en/excursions", "/en/experiences/"),
  ...both("/en/activities", "/en/experiences/"),
  ...both("/en/about", "/en/hotel/"),
  ...both("/en/about-us", "/en/hotel/"),
  ...both("/en/team", "/en/notre-equipe/"),
  ...both("/en/our-team", "/en/notre-equipe/"),
  ...both("/en/photos", "/en/galerie/"),
  ...both("/en/gallery", "/en/galerie/"),
  ...both("/en/contact-us", "/en/contact/"),
  ...both("/en/booking", "/en/contact/"),
  ...racineSeule("/en/reservation", "/en/contact/"), // page enfant : /reservation/confirmation/

  // ─── Anciennes URLs ES ──────────────────────────────────────
  ...both("/es/habitaciones", "/es/hebergements/"),
  ...both("/es/alojamiento", "/es/hebergements/"),
  ...both("/es/restaurante", "/es/restaurant/"),
  ...both("/es/plantacion-te", "/es/plantation-de-the/"),
  ...both("/es/te", "/es/plantation-de-the/"),
  ...both("/es/tren-fce", "/es/train-fce/"),
  ...both("/es/excursiones", "/es/experiences/"),
  ...both("/es/actividades", "/es/experiences/"),
  ...both("/es/nuestro-equipo", "/es/notre-equipe/"),
  ...both("/es/galeria", "/es/galerie/"),
  ...both("/es/contacto", "/es/contact/"),
  ...both("/es/reservar", "/es/contact/"),

  // ─── Pages chambres individuelles → liste (3 langues) ───────
  ...both("/fr/bungalow-pilotis", "/fr/hebergements/"),
  ...both("/en/bungalow-pilotis", "/en/hebergements/"),
  ...both("/es/bungalow-pilotis", "/es/hebergements/"),
  ...both("/fr/wagon-1930", "/fr/hebergements/"),
  ...both("/en/wagon-1930", "/en/hebergements/"),
  ...both("/es/wagon-1930", "/es/hebergements/"),
  ...both("/fr/chambre-superieure", "/fr/hebergements/"),
  ...both("/en/superior-room", "/en/hebergements/"),
  ...both("/en/family-room", "/en/hebergements/"),

  // ─── Sitemaps WordPress legacy ──────────────────────────────
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
  { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
  { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },

  // ─── AMP legacy (par langue) ────────────────────────────────
  { source: "/fr/:slug/amp/", destination: "/fr/:slug/", permanent: true },
  { source: "/en/:slug/amp/", destination: "/en/:slug/", permanent: true },
  { source: "/es/:slug/amp/", destination: "/es/:slug/", permanent: true },

  // ─── WPtouch switcher (query param) ─────────────────────────
  {
    source: "/",
    has: [{ type: "query", key: "wptouch_switch" }],
    destination: "/",
    permanent: true,
  },
];

/**
 * Headers de sécurité (cf. Phase 8 §8.9).
 * NB : Ne s'appliquent qu'en mode SSR Vercel (pas en static export GitHub Pages).
 *
 * HSTS et `upgrade-insecure-requests` ne sont émis QUE sur Vercel : en
 * `next start` local (http), ils forcent le navigateur à réécrire toutes les
 * requêtes en https → l'app devient intestable en local (et pollue le cache
 * HSTS du navigateur pour localhost). Sur Vercel, le https est garanti.
 */
const isVercel = !!process.env.VERCEL;

export const securityHeaders: Awaited<
  ReturnType<NonNullable<NextConfig["headers"]>>
> = [
  {
    source: "/:path*",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      ...(isVercel
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : []),
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://js.hcaptcha.com https://*.hcaptcha.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https:",
          "font-src 'self' https://fonts.gstatic.com data:",
          "connect-src 'self' https://plausible.io https://api.hcaptcha.com https://*.upstash.io https://*.sentry.io",
          "frame-src https://newassets.hcaptcha.com https://www.google.com https://maps.google.com",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          ...(isVercel ? ["upgrade-insecure-requests"] : []),
        ].join("; "),
      },
    ],
  },
  // Cache long pour assets statiques
  {
    source: "/:all*.(jpg|jpeg|png|webp|avif|svg|woff|woff2|ico)",
    headers: [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ],
  },
];
