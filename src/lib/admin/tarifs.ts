/**
 * Tarifs 2026 officiels. Source : « TExte proposition de Maggie » (16/07/2026)
 * et grilles TO-PUBLIC. Base du simulateur de facture proforma.
 *
 * Décisions 17/07/2026 (Max) confirmées par l'analyse des vraies factures :
 *  - Prix catalogue = TTC (ce que le client paie, TVA 20 % comprise).
 *    La facture EXTRAIT la TVA (HT = TTC / 1,20). Voir proforma.ts.
 *  - « Vignette touristique » (et non « taxe de séjour ») : HORS base TVA.
 *  - Taux € par défaut = 5 000 Ar (les grilles 2026/2027 sont bâties à 5 000 :
 *    360 000/72, 300 000/60, 70 000/14…). Modifiable à chaque facture.
 *  - Exonération de TVA possible en option (ex. TO export). Voir Devis.
 */

export const TAUX_EUR_DEFAUT = 5000; // 1 € = 5 000 Ar (grilles TO-PUBLIC)
export const TVA_TAUX = 0.2; // TVA 20 % à Madagascar

export type CatalogueItem = {
  id: string;
  label: string;
  /** Prix TTC en ariary (ce que paie le client). */
  prixAr: number;
  unite: "nuit" | "personne" | "pers./nuit" | "trajet" | "unité";
  groupe: "Hébergement" | "Restauration" | "Suppléments";
  /** false → hors base TVA (vignette touristique). Défaut true. */
  tva?: boolean;
};

export const CATALOGUE: CatalogueItem[] = [
  // Hébergement (TTC, par nuit, double/twin/single)
  { id: "pilotis-nuptial", label: "Pilotis Nuptial (double/twin/single)", prixAr: 360_000, unite: "nuit", groupe: "Hébergement" },
  { id: "superior-lake-view", label: "Superior Lake View Room (double/twin/single)", prixAr: 300_000, unite: "nuit", groupe: "Hébergement" },
  { id: "wagon-nuptial", label: "Wagon Nuptial", prixAr: 360_000, unite: "nuit", groupe: "Hébergement" },
  { id: "standard", label: "Bungalow standard (double/twin/single)", prixAr: 150_000, unite: "nuit", groupe: "Hébergement" },
  { id: "le-repos", label: "Bungalow traditionnel de l'extension « Le Repos »", prixAr: 250_000, unite: "nuit", groupe: "Hébergement" },
  // Restauration (TTC)
  { id: "petit-dejeuner", label: "Petit-déjeuner", prixAr: 40_000, unite: "pers./nuit", groupe: "Restauration" },
  { id: "menu", label: "Menu (déjeuner ou dîner)", prixAr: 70_000, unite: "personne", groupe: "Restauration" },
  // Suppléments
  { id: "vignette-touristique", label: "Vignette touristique", prixAr: 5_000, unite: "pers./nuit", groupe: "Suppléments", tva: false },
  { id: "lit-supplementaire", label: "Lit supplémentaire", prixAr: 30_000, unite: "nuit", groupe: "Suppléments" },
  { id: "transfert-4x4", label: "Transfert privé 4×4 Lac Hôtel ↔ Fianarantsoa", prixAr: 130_000, unite: "trajet", groupe: "Suppléments" },
  { id: "transfert-ambalakely", label: "Transfert privé 4×4 Lac Hôtel ↔ Ambalakely Bifurcation", prixAr: 120_000, unite: "trajet", groupe: "Suppléments" },
];

/** Un item du catalogue est-il soumis à TVA ? (défaut oui) */
export function estSoumisTva(item: { tva?: boolean }): boolean {
  return item.tva !== false;
}

/** Formatte un montant ariary : 360 000 Ar */
export function formatAr(n: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n))} Ar`;
}

/** Formatte l'équivalent euro : 72,00 € */
export function formatEur(ar: number, taux: number): string {
  if (!taux || taux <= 0) return "n/c";
  return `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(ar / taux)} €`;
}
