import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      /**
       * Projet bi-mode (Vercel SSR / GitHub Pages static export).
       *
       * En mode static export, `next.config.ts` force `images.unoptimized: true`,
       * ce qui fait que <Image /> se contente de rendre un <img> derrière le
       * rideau — sans apporter le moindre bénéfice d'optimisation.
       *
       * En mode Vercel, les <img> utilisés ici ont tous `loading="lazy"` et
       * s'insèrent dans des conteneurs à ratio fixe (aspect-*) : le gain CLS
       * de next/image serait marginal et demanderait de documenter width/height
       * pour ~19 images — complexité supérieure au bénéfice.
       *
       * On désactive donc cette règle globalement. Une migration vers
       * next/image reste possible ponctuellement (hero, LCP) si besoin.
       */
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
