/**
 * Pré-build : retire les routes serveur incompatibles avec `output: export`
 * (GitHub Pages) — l'API de réservation et l'espace admin (Auth.js + Server
 * Actions). Exécuté automatiquement via le hook npm `prebuild`.
 *
 * Garde stricte — n'agit QUE pendant un export statique CI :
 *   - process.env.CI              → vrai sur GitHub Actions (et Vercel)
 *   - process.env.NEXT_PUBLIC_BASE_PATH non vide → signal « export GitHub Pages »
 *
 * Résultat par contexte :
 *   - GitHub Actions (CI + basePath)        → api + admin retirés  ✅
 *   - Vercel (CI, basePath VIDE)            → no-op (SSR complet)  ✅
 *   - `npm run build` local (pas de CI)     → no-op (rien supprimé) ✅
 *
 * Remplace l'ancien `rm -rf src/app/admin` du workflow : garde le pipeline
 * CI hors de `.github/` (évite d'exiger le scope OAuth `workflow` au push).
 */
import { rmSync, existsSync } from "node:fs";

const isCi = !!process.env.CI;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

if (isCi && basePath) {
  for (const dir of ["src/app/api", "src/app/admin"]) {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`[prepare-static-export] retiré ${dir} (export statique)`);
    }
  }
} else {
  console.log("[prepare-static-export] no-op (build SSR / local)");
}
