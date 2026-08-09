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

/**
 * Chemins à retirer. Ils ont changé le 08/08/2026 avec le passage aux
 * layouts racines multiples : l'admin est descendu sous le groupe
 * (admin)/. Le script ne le trouvait plus, ne le retirait donc plus, et
 * l'export statique échouait sur « Server Actions are not supported »
 * — Auth.js en utilise. Le message ne nommait pas le coupable : d'où ce
 * garde-fou, qui refuse de continuer si un chemin attendu a disparu. */
const A_RETIRER = ["src/app/api", "src/app/(admin)"];

const isCi = !!process.env.CI;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

if (isCi && basePath) {
  const manquants = A_RETIRER.filter((d) => !existsSync(d));
  if (manquants.length) {
    console.error(
      `[prepare-static-export] ERREUR — chemin(s) introuvable(s) : ${manquants.join(", ")}.\n` +
        "L'arborescence a bougé sans que ce script soit mis à jour. Sans lui, " +
        "l'export statique échouera plus loin sur un message qui ne nommera pas la cause.",
    );
    process.exit(1);
  }
  for (const dir of A_RETIRER) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`[prepare-static-export] retiré ${dir} (export statique)`);
  }
} else {
  console.log("[prepare-static-export] no-op (build SSR / local)");
}
