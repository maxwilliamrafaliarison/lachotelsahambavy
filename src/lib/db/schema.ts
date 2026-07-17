/**
 * Schéma de la base (Drizzle / PostgreSQL) — facturation & tableau de bord.
 *
 * Modèle dérivé de l'analyse des 200+ factures réelles 2026 (parser Excel).
 * Postgres cible : Neon (région UE, RGPD). Testé localement via PGlite.
 *
 * Principes :
 *  - Montants stockés en ariary ENTIERS (bigint via mode number → number JS
 *    reste exact jusqu'à 9e15 ; les factures plafonnent à ~1e8).
 *  - Une facture est un « document » (PROFORMA | FACTURE | AVOIR). Le numéro
 *    n'est PAS unique globalement (constat réel) → clé = id synthétique ;
 *    unicité applicative par (agence, type, numero, annee) quand le numéro existe.
 *  - date_in = date d'arrivée (fiable) ; date_emission = =TODAY() d'origine,
 *    donc peu fiable, conservée pour mémoire.
 */
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  bigint,
  boolean,
  date,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const typeDocumentEnum = pgEnum("type_document", ["PROFORMA", "FACTURE", "AVOIR"]);
export const modePaiementEnum = pgEnum("mode_paiement", [
  "especes",
  "cheque",
  "virement_mga",
  "virement_eur",
  "mvola",
  "autre",
]);
export const sourceEnum = pgEnum("source_document", ["import_2026", "outil"]);

/** Agences de voyage & clients directs (« PARTICULIER »). */
export const agences = pgTable("agences", {
  id: uuid("id").defaultRandom().primaryKey(),
  nom: text("nom").notNull().unique(),
  nif: text("nif"),
  stat: text("stat"),
  adresse: text("adresse"),
  email: text("email"),
  pays: text("pays"),
  creeLe: timestamp("cree_le", { withTimezone: true }).defaultNow().notNull(),
});

/** Séjours (un groupe / un client sur une période). */
export const sejours = pgTable(
  "sejours",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agenceId: uuid("agence_id").references(() => agences.id),
    client: text("client"),
    codeGroupe: text("code_groupe"),
    dateIn: date("date_in"),
    dateOut: date("date_out"),
    nuits: integer("nuits"),
    pax: integer("pax"),
    paxBrut: text("pax_brut"),
    formule: text("formule"), // BB, DP, AP…
  },
  (t) => [index("sejours_date_in_idx").on(t.dateIn)],
);

/** Documents : proforma, facture, avoir. */
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: typeDocumentEnum("type").notNull(),
    numero: text("numero"),
    annee: integer("annee"),
    agenceId: uuid("agence_id").references(() => agences.id),
    sejourId: uuid("sejour_id").references(() => sejours.id),
    /** Avoir : facture d'origine rattachée. */
    documentOrigineId: uuid("document_origine_id"),
    dateEmission: date("date_emission"), // d'origine =TODAY(), peu fiable
    devise: text("devise").default("MGA").notNull(),
    tauxEur: integer("taux_eur"),
    exoneration: boolean("exoneration").default(false).notNull(),
    // Totaux en ariary (entiers)
    sousTotalHt: bigint("sous_total_ht", { mode: "number" }),
    tva: bigint("tva", { mode: "number" }),
    vignette: bigint("vignette", { mode: "number" }),
    remise: bigint("remise", { mode: "number" }),
    totalTtc: bigint("total_ttc", { mode: "number" }),
    /** Montant CA canonique (TTC, ou somme lignes ; avoir = négatif). */
    montantCa: bigint("montant_ca", { mode: "number" }),
    source: sourceEnum("source").default("outil").notNull(),
    /** Chemin du fichier Excel d'origine (traçabilité de l'import). */
    fichierSource: text("fichier_source"),
    creeLe: timestamp("cree_le", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("documents_type_idx").on(t.type),
    index("documents_agence_idx").on(t.agenceId),
    index("documents_annee_idx").on(t.annee),
  ],
);

/** Lignes de prestation d'un document. */
export const lignes = pgTable("lignes", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id")
    .references(() => documents.id, { onDelete: "cascade" })
    .notNull(),
  ordre: integer("ordre").notNull().default(0),
  nombre: integer("nombre"),
  designation: text("designation").notNull(),
  pu: bigint("pu", { mode: "number" }),
  nuitees: integer("nuitees"),
  total: bigint("total", { mode: "number" }),
  soumisTva: boolean("soumis_tva").default(true).notNull(),
});

/** Paiements enregistrés (pas d'encaissement en ligne). */
export const paiements = pgTable("paiements", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id")
    .references(() => documents.id, { onDelete: "cascade" })
    .notNull(),
  mode: modePaiementEnum("mode").notNull(),
  montant: bigint("montant", { mode: "number" }).notNull(),
  devise: text("devise").default("MGA").notNull(),
  dateEncaissement: date("date_encaissement"),
  reference: text("reference"),
  /** Mention brute d'origine (« VIRE BRED MADA LE … ») pour l'import. */
  mentionBrute: text("mention_brute"),
});

/** Métadonnées libres éventuelles (agence_bloc brut, etc.). */
export const documentsMeta = pgTable("documents_meta", {
  documentId: uuid("document_id")
    .references(() => documents.id, { onDelete: "cascade" })
    .primaryKey(),
  brut: jsonb("brut"),
});
