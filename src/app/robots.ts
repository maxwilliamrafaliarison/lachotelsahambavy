import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

/**
 * Robots.txt généré dynamiquement.
 * Cf. Phase 5 §5.6 (SEO technique).
 *
 * `force-static` requis pour le mode `output: export` (GitHub Pages).
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/*?ref=*",
          "/*?utm_*",
          "/reservation/confirmation/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
