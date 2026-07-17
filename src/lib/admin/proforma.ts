/**
 * Modèle et calculs du devis proforma — partagés entre l'écran et le PDF.
 */

export type LigneDevis = {
  id: string;
  label: string;
  qte: number;
  unite: string;
  prixAr: number;
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
  tauxEur: number;
  notes: string;
};

export function nbNuits(arrivee: string, depart: string): number {
  if (!arrivee || !depart) return 0;
  const a = new Date(arrivee + "T12:00:00");
  const d = new Date(depart + "T12:00:00");
  const ms = d.getTime() - a.getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function totaux(devis: Devis) {
  const sousTotal = devis.lignes.reduce((s, l) => s + l.qte * l.prixAr, 0);
  let remiseAr = 0;
  if (devis.remise.type === "pourcent") remiseAr = (sousTotal * devis.remise.valeur) / 100;
  if (devis.remise.type === "montant") remiseAr = devis.remise.valeur;
  remiseAr = Math.min(Math.max(0, Math.round(remiseAr)), sousTotal);
  const totalAr = sousTotal - remiseAr;
  const totalEur = devis.tauxEur > 0 ? totalAr / devis.tauxEur : 0;
  return { sousTotal, remiseAr, totalAr, totalEur };
}

export function libelleRemise(remise: Remise): string {
  if (remise.type === "pourcent") return `Remise ${new Intl.NumberFormat("fr-FR").format(remise.valeur)} %`;
  if (remise.type === "montant") return "Remise";
  return "";
}

/** Date française longue : 16 juillet 2026 */
export function formatDateFr(iso: string): string {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
