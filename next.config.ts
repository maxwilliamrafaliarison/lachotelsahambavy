import type { NextConfig } from "next";
import { wordpressRedirects, securityHeaders } from "./src/lib/redirects";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isStaticExport = Boolean(basePath);

/**
 * Configuration Next.js 16, bi-mode :
 *   1. Vercel (par défaut)            → SSR + headers + redirects + ISR + image optim
 *   2. GitHub Pages (NEXT_PUBLIC_BASE_PATH défini) → static export
 *
 * Cf. Phase 8 §8.3.2 (Configuration tech stack).
 */
const nextConfig: NextConfig = {
  // Mode export statique (uniquement quand basePath défini)
  ...(isStaticExport ? { basePath, output: "export" as const } : {}),

  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // PGlite (mode dev local du tableau de bord) charge des assets WASM via
  // import.meta.url : à laisser hors du bundle serveur pour éviter que le
  // bundler ne casse la résolution des chemins. Sans effet en prod (Neon).
  serverExternalPackages: ["@electric-sql/pglite"],

  images: {
    // Static export ne supporte pas l'optimisation Next/Image
    unoptimized: isStaticExport,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 an
  },

  experimental: {
    optimizePackageImports: ["date-fns"],
  },

  // Headers + redirects ne s'appliquent qu'en mode SSR (Vercel)
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return securityHeaders;
        },
        async redirects() {
          return wordpressRedirects;
        },
      }),
};

export default nextConfig;
