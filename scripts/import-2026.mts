/**
 * Importe l'historique 2026 (factures.jsonl) dans la base Neon.
 *
 *   1. Générer le JSONL depuis les Excel (clé USB montée) :
 *        python3 scripts/parse-factures-2026.py    # → scratchpad/factures.jsonl
 *      ou pointer vers votre propre chemin de sortie.
 *   2. Migrer la base :   DATABASE_URL=… npm run db:migrate
 *   3. Importer :         DATABASE_URL=… npx tsx scripts/import-2026.mts <chemin factures.jsonl>
 *
 * Idempotent : rejouer l'import remplace les données source « import_2026 »
 * sans créer de doublon.
 */
import { readFileSync } from "node:fs";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { importFactures, type FactureRecord } from "../src/lib/db/import-2026";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquante. Ex : DATABASE_URL='postgres://…' npx tsx scripts/import-2026.mts factures.jsonl");
  process.exit(1);
}
const chemin = process.argv[2];
if (!chemin) {
  console.error("Usage : npx tsx scripts/import-2026.mts <chemin vers factures.jsonl>");
  process.exit(1);
}

const records: FactureRecord[] = readFileSync(chemin, "utf-8")
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((l) => JSON.parse(l));

const db = drizzle(neon(url));
const res = await importFactures(db, records);
console.log(`✅ Import terminé : ${res.documents} documents, ${res.lignes} lignes, ${res.agences} agences.`);
