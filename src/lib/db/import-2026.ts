/**
 * Import de l'historique 2026 : enregistrements produits par le parser Excel
 * (parse_factures.py → factures.jsonl) vers la base.
 *
 * Idempotent : on efface d'abord les documents source = "import_2026" (et
 * leurs lignes / séjours via cascade et nettoyage), puis on réinsère. Rejouer
 * l'import ne crée pas de doublon.
 *
 * Découplé du fichier : prend un tableau d'enregistrements + une instance
 * Drizzle → testable sous PGlite comme exécutable sous Neon.
 */
import { eq, inArray } from "drizzle-orm";
import { agences, sejours, documents, lignes, documentsMeta } from "./schema";

export type FactureRecord = {
  fichier: string;
  agence_dossier: string;
  type: "PROFORMA" | "FACTURE" | "AVOIR";
  numero: string | null;
  titre_brut?: string | null;
  client?: string | null;
  agence_bloc?: string | null;
  date_emission?: string | null;
  date_in?: string | null;
  date_out?: string | null;
  prestations_code?: string | null;
  pax_brut?: string | null;
  pax?: number | null;
  nuits?: number | null;
  lignes: Array<{
    nombre?: number | null;
    designation: string;
    pu?: number | null;
    nuitees?: number | null;
    total?: number | null;
    soumis_tva?: boolean;
  }>;
  sous_total_ht?: number | null;
  tva?: number | null;
  vignette?: number | null;
  remise?: number | null;
  total_ttc?: number | null;
  montant_avoir?: number | null;
  montant_ca?: number | null;
  mention_paiement?: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type Db = any;

const rnd = (v?: number | null) => (v == null || !Number.isFinite(v) ? null : Math.round(v));

/** Décompose le bloc agence (C6) : « NOM\nNIF …\nSTAT …\nAdresse … ». */
function parseAgenceBloc(bloc?: string | null) {
  if (!bloc) return {};
  const nif = bloc.match(/NIF\s*:?\s*([0-9]{6,})/i)?.[1];
  const stat = bloc.match(/STAT\s*:?\s*([0-9 ]{6,})/i)?.[1]?.trim();
  const email = bloc.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0];
  const adresse = bloc.match(/Adresse\s*:?\s*(.+)/i)?.[1]?.trim();
  return { nif, stat, email, adresse };
}

const anneeDe = (r: FactureRecord) =>
  r.date_in ? Number(r.date_in.slice(0, 4)) : r.date_emission ? Number(r.date_emission.slice(0, 4)) : 2026;

const codeGroupe = (client?: string | null) =>
  client?.match(/\b([A-Z]{2,}\d{4,})\b/)?.[1] ?? null;

export async function importFactures(db: Db, records: FactureRecord[]) {
  // 1) Purge de l'import précédent (idempotence).
  const anciens = await db
    .select({ id: documents.id })
    .from(documents)
    .where(eq(documents.source, "import_2026"));
  const ids = anciens.map((d: { id: string }) => d.id);
  if (ids.length) {
    await db.delete(lignes).where(inArray(lignes.documentId, ids));
    await db.delete(documentsMeta).where(inArray(documentsMeta.documentId, ids));
    await db.delete(documents).where(inArray(documents.id, ids));
  }

  // 2) Agences (upsert par nom).
  const nomsAgences = [...new Set(records.map((r) => r.agence_dossier))];
  const agenceIdParNom = new Map<string, string>();
  for (const nom of nomsAgences) {
    const rec = records.find((r) => r.agence_dossier === nom && r.agence_bloc);
    const info = parseAgenceBloc(rec?.agence_bloc);
    const inserted = await db
      .insert(agences)
      .values({
        nom,
        nif: info.nif ?? null,
        stat: info.stat ?? null,
        adresse: info.adresse ?? null,
        email: info.email ?? null,
      })
      .onConflictDoUpdate({
        target: agences.nom,
        set: { nif: info.nif ?? null, email: info.email ?? null },
      })
      .returning({ id: agences.id });
    agenceIdParNom.set(nom, inserted[0].id);
  }

  // 3) Documents + séjours + lignes.
  let nbDocs = 0;
  let nbLignes = 0;
  for (const r of records) {
    const agenceId = agenceIdParNom.get(r.agence_dossier) ?? null;

    const [sej] = await db
      .insert(sejours)
      .values({
        agenceId,
        client: r.client ?? null,
        codeGroupe: codeGroupe(r.client),
        dateIn: r.date_in ?? null,
        dateOut: r.date_out ?? null,
        nuits: rnd(r.nuits),
        pax: rnd(r.pax),
        paxBrut: r.pax_brut != null ? String(r.pax_brut) : null,
        formule: r.prestations_code ?? null,
      })
      .returning({ id: sejours.id });

    const [doc] = await db
      .insert(documents)
      .values({
        type: r.type,
        numero: r.numero ?? null,
        annee: anneeDe(r),
        agenceId,
        sejourId: sej.id,
        dateEmission: r.date_emission ?? null,
        devise: "MGA",
        exoneration: r.type !== "AVOIR" && r.sous_total_ht == null && (r.total_ttc ?? 0) > 0 ? false : false,
        sousTotalHt: rnd(r.sous_total_ht),
        tva: rnd(r.tva),
        vignette: rnd(r.vignette),
        remise: rnd(r.remise),
        totalTtc: rnd(r.total_ttc),
        montantCa: rnd(r.montant_ca),
        source: "import_2026",
        fichierSource: r.fichier,
      })
      .returning({ id: documents.id });

    if (r.lignes?.length) {
      await db.insert(lignes).values(
        r.lignes.map((l, i) => ({
          documentId: doc.id,
          ordre: i,
          nombre: rnd(l.nombre),
          designation: l.designation || "…",
          pu: rnd(l.pu),
          nuitees: rnd(l.nuitees),
          total: rnd(l.total),
          soumisTva: l.soumis_tva !== false,
        })),
      );
      nbLignes += r.lignes.length;
    }

    if (r.agence_bloc || r.mention_paiement) {
      await db
        .insert(documentsMeta)
        .values({
          documentId: doc.id,
          brut: { agence_bloc: r.agence_bloc ?? null, mention_paiement: r.mention_paiement ?? null },
        })
        .onConflictDoNothing();
    }
    nbDocs++;
  }

  return { agences: nomsAgences.length, documents: nbDocs, lignes: nbLignes };
}
