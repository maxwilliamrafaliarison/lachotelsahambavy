#!/usr/bin/env node
/**
 * Transforme les avis Google copiés depuis la fiche d'établissement en
 * entrées prêtes à coller dans src/data/testimonials.ts.
 *
 * POURQUOI CE SCRIPT EXISTE. Google sert un contrôle anti-robot à toute
 * lecture automatisée de ses avis, et son API Places facture le champ
 * `reviews` au tarif le plus élevé de la grille. Restait une voie, la
 * seule qui ne demande ni clé ni carte : la direction possède la fiche
 * et voit ses 177 avis dans son espace professionnel. Elle les copie,
 * ce script les met en forme.
 *
 * CE N'EST PAS LA MÊME CHOSE qu'une collecte automatisée : c'est
 * l'exploitante qui lit les avis de son propre établissement dans son
 * propre tableau de bord.
 *
 * FORMAT ATTENDU, un avis par bloc, blocs séparés par une ligne vide.
 * Trois lignes puis le texte :
 *
 *     Jean-Pierre M.
 *     5
 *     juillet 2025
 *     Le cadre est exceptionnel, entre lac et plantation de thé.
 *     Nous y retournerons sans hésiter.
 *
 *     Sarah L.
 *     4
 *     mars 2025
 *     Très bel endroit, personnel attentionné.
 *
 * La note est un entier de 1 à 5. La date est celle que Google affiche.
 * Le texte peut tenir sur plusieurs lignes ; elles sont conservées.
 *
 * EMPLOI :  node scripts/importer-avis-google.mjs avis-google.txt
 *
 * Le script N'ÉCRIT RIEN tout seul : il imprime, et c'est un humain qui
 * colle. Les traductions restent à écrire à la main, comme pour les
 * avis Tripadvisor : une traduction automatique posée sous le nom d'un
 * client resterait une phrase qu'il n'a pas écrite.
 */

import { readFileSync } from "node:fs";

const fichier = process.argv[2];
if (!fichier) {
  console.error("Emploi : node scripts/importer-avis-google.mjs <fichier.txt>");
  process.exit(1);
}

const echapper = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

const blocs = readFileSync(fichier, "utf8")
  .split(/\n\s*\n/)
  .map((b) => b.trim())
  .filter(Boolean);

const sorties = [];
const rejets = [];

for (const [i, bloc] of blocs.entries()) {
  const lignes = bloc.split("\n").map((l) => l.trim());
  const [auteur, noteBrute, date, ...reste] = lignes;
  const note = Number(noteBrute);
  const texte = reste.join("\n").trim();

  if (!auteur || !Number.isInteger(note) || note < 1 || note > 5 || !date || !texte) {
    rejets.push(`bloc ${i + 1} : « ${lignes[0] ?? ""} » — format non reconnu`);
    continue;
  }

  sorties.push(`  {
    auteur: "${echapper(auteur)}",
    plateforme: "google",
    note: ${note},
    bareme: 5,
    dateAvis: { fr: "${echapper(date)}", en: "${echapper(date)}", es: "${echapper(date)}" },
    langueOriginale: "fr",
    original:
      "${echapper(texte)}",
    traduction: {
      // À ÉCRIRE À LA MAIN. Une traduction automatique posée sous le nom
      // d'un client resterait une phrase qu'il n'a pas écrite.
      en: "",
      es: "",
    },
    source: "https://www.google.com/maps?cid=9763325951372533936",
  },`);
}

console.log(`/* ${sorties.length} avis Google mis en forme. */\n`);
console.log(sorties.join("\n"));

if (rejets.length) {
  console.error(`\n${rejets.length} bloc(s) écarté(s) :`);
  for (const r of rejets) console.error("  " + r);
}

console.error(`\nÀ FAIRE ENSUITE :
  1. coller ces entrées dans tousLesAvis, dans src/data/testimonials.ts ;
  2. écrire les traductions anglaise et espagnole de chaque avis ;
  3. vérifier que les dates sont bien celles que Google affiche ;
  4. ne retenir que les avis SANS RÉSERVE, cités intégralement, comme
     pour Tripadvisor. La mention de transparence dit que c'est un tri.`);
