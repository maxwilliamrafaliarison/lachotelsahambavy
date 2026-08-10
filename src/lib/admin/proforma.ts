import { TVA_TAUX } from "@/lib/admin/tarifs";

/**
 * Modèle et calculs du devis proforma, partagés entre l'écran et le PDF.
 *
 * Règles de calcul (décisions Max 17/07/2026, conformes aux vraies factures) :
 *  - Les prix de ligne sont TTC (TVA 20 % comprise).
 *  - La facture EXTRAIT la TVA : HT = TTC / 1,20 ; TVA = TTC − HT.
 *  - « Vignette touristique » = ligne HORS base TVA (soumisTva = false).
 *  - Remise (% ou montant) appliquée sur les prestations TTC, pas sur la vignette.
 *  - Exonération de TVA (option) : les prestations sont facturées HT
 *    (le client paie TTC/1,20), la TVA n'est ni extraite ni due. Le total
 *    baisse de 20 % sur les prestations taxables. À confirmer par Maggie
 *    (formulation légale de l'exonération).
 */

export type LigneDevis = {
  id: string;
  label: string;
  qte: number;
  unite: string;
  prixAr: number;
  /** false = hors base TVA (vignette touristique). Défaut true. */
  soumisTva: boolean;
};

export type Remise =
  | { type: "aucune" }
  | { type: "pourcent"; valeur: number }
  | { type: "montant"; valeur: number };

export type Devis = {
  numero: string;
  dateEmission: string; // ISO yyyy-mm-dd
  validiteJours: number;
  client: { nom: string; contact: string };
  sejour: { arrivee: string; depart: string; personnes: number };
  lignes: LigneDevis[];
  remise: Remise;
  /** Exonération de TVA (option). */
  exoneration: boolean;
  tauxEur: number;
  notes: string;
};

export function nbNuits(arrivee: string, depart: string): number {
  if (!arrivee || !depart) return 0;
  const a = new Date(arrivee + "T12:00:00").getTime();
  const d = new Date(depart + "T12:00:00").getTime();
  if (!Number.isFinite(a) || !Number.isFinite(d)) return 0; // date invalide → 0
  return Math.max(0, Math.round((d - a) / 86_400_000));
}

export type Totaux = {
  /** Prestations soumises à TVA, en TTC, avant remise. */
  prestationsTtc: number;
  /** Vignette touristique (hors base TVA). */
  vignette: number;
  /** Remise appliquée (en ariary). */
  remiseAr: number;
  /** Base HT après remise. */
  ht: number;
  /** TVA due (0 si exonéré). */
  tva: number;
  /** Total à payer, en ariary. */
  totalAr: number;
  /** Équivalent en euros au taux du devis (0 si taux invalide). */
  totalEur: number;
  exoneration: boolean;
};

/** Montant d'une ligne, robuste aux valeurs non finies (0 par défaut). */
function montantLigne(l: LigneDevis): number {
  const q = Number.isFinite(l.qte) ? l.qte : 0;
  const p = Number.isFinite(l.prixAr) ? l.prixAr : 0;
  return q * p;
}

export function totaux(devis: Devis): Totaux {
  const prestationsTtc = devis.lignes
    .filter((l) => l.soumisTva)
    .reduce((s, l) => s + montantLigne(l), 0);
  const vignette = devis.lignes
    .filter((l) => !l.soumisTva)
    .reduce((s, l) => s + montantLigne(l), 0);

  let remiseAr = 0;
  if (devis.remise.type === "pourcent") remiseAr = (prestationsTtc * devis.remise.valeur) / 100;
  if (devis.remise.type === "montant") remiseAr = devis.remise.valeur;
  remiseAr = Math.min(Math.max(0, Math.round(remiseAr)), prestationsTtc);

  const baseApresRemise = prestationsTtc - remiseAr; // TTC

  let ht: number;
  let tva: number;
  let prestationsFinal: number;
  if (devis.exoneration) {
    ht = baseApresRemise / (1 + TVA_TAUX); // facturé HT
    tva = 0;
    prestationsFinal = ht; // le client paie le HT
  } else {
    ht = baseApresRemise / (1 + TVA_TAUX);
    tva = baseApresRemise - ht;
    prestationsFinal = baseApresRemise; // le client paie le TTC
  }

  const totalAr = Math.round(prestationsFinal + vignette);
  const totalEur = devis.tauxEur > 0 ? totalAr / devis.tauxEur : 0;

  return {
    prestationsTtc,
    vignette,
    remiseAr,
    ht: Math.round(ht),
    tva: Math.round(tva),
    totalAr,
    totalEur,
    exoneration: devis.exoneration,
  };
}

export function libelleRemise(remise: Remise): string {
  if (remise.type === "pourcent") return `Remise ${new Intl.NumberFormat("fr-FR").format(remise.valeur)} %`;
  if (remise.type === "montant") return "Remise";
  return "";
}

/** Date française longue : 16 juillet 2026 */
export function formatDateFr(iso: string): string {
  if (!iso) return "…";
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
