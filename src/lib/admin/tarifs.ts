/**
 * Tarifs 2026 officiels — source : « TExte proposition de Maggie » (16/07/2026).
 * Base du simulateur de facture proforma. Montants en ariary.
 * Le taux AR/EUR par défaut est paramétrable dans l'outil (persisté par poste).
 */

export const TAUX_EUR_DEFAUT = 4900; // 1 € = 4 900 Ar (doc Maggie)

export type CatalogueItem = {
  id: string;
  label: string;
  prixAr: number;
  /** Unité affichée sur la facture (et logique de quantité par défaut). */
  unite: "nuit" | "personne" | "pers./nuit" | "trajet" | "unité";
  groupe: "Hébergement" | "Restauration" | "Suppléments";
};

export const CATALOGUE: CatalogueItem[] = [
  // — Hébergement (par nuit, double/twin/single) —
  { id: "pilotis-nuptial", label: "Pilotis Nuptial (double/twin/single)", prixAr: 360_000, unite: "nuit", groupe: "Hébergement" },
  { id: "superior-lake-view", label: "Superior Lake View Room (double/twin/single)", prixAr: 300_000, unite: "nuit", groupe: "Hébergement" },
  { id: "wagon-nuptial", label: "Wagon Nuptial", prixAr: 360_000, unite: "nuit", groupe: "Hébergement" },
  { id: "standard", label: "Bungalow standard (double/twin/single)", prixAr: 140_000, unite: "nuit", groupe: "Hébergement" },
  { id: "le-repos", label: "Bungalow traditionnel — Extension « Le Repos »", prixAr: 250_000, unite: "nuit", groupe: "Hébergement" },
  // — Restauration —
  { id: "petit-dejeuner", label: "Petit-déjeuner", prixAr: 40_000, unite: "pers./nuit", groupe: "Restauration" },
  { id: "menu", label: "Menu (déjeuner ou dîner)", prixAr: 70_000, unite: "personne", groupe: "Restauration" },
  // — Suppléments —
  { id: "taxe-sejour", label: "Taxe de séjour", prixAr: 5_000, unite: "pers./nuit", groupe: "Suppléments" },
  { id: "lit-supplementaire", label: "Lit supplémentaire", prixAr: 30_000, unite: "nuit", groupe: "Suppléments" },
  { id: "transfert-4x4", label: "Transfert privé 4×4 Lac Hôtel ↔ Fianarantsoa", prixAr: 120_000, unite: "trajet", groupe: "Suppléments" },
];

/** Formatte un montant ariary : 360 000 Ar */
export function formatAr(n: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n))} Ar`;
}

/** Formatte l'équivalent euro : 73,47 € */
export function formatEur(ar: number, taux: number): string {
  if (!taux || taux <= 0) return "—";
  return `${new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(ar / taux)} €`;
}
