import type { ReactNode } from "react";

/**
 * Récapitulatif à filets fins, pattern « Aperçu » Glacier Express.
 * Utilisé pour tarifs, prestations, horaires. Hérite du monde clair par
 * défaut ; posé dans un parent `.ge-night`, les filets et accents basculent
 * automatiquement (voir globals.css).
 */
type RecapRowsProps = {
  title?: string;
  rows: Array<{ label: ReactNode; value: ReactNode }>;
  footnote?: string;
  className?: string;
};

export default function RecapRows({ title, rows, footnote, className = "" }: RecapRowsProps) {
  return (
    <div className={className}>
      {title && (
        /* `ge-rows__titre` ne porte AUCUN style : c'est un marqueur, et il
           faut le garder. Il distingue le titre d'un tableau récapitulatif du
           chapeau d'une vraie section, qui porte le même `ge-label`. Sans lui,
           scripts/verifier-repetitions.py signalait deux tableaux « Aperçu »
           voisins — deux excursions, deux récapitulatifs — comme une redite,
           alors que deux chapeaux de section identiques en sont une. */
        <p className="ge-label ge-rows__titre mb-4">{title}</p>
      )}
      <div className="ge-rows">
        {rows.map((r, i) => (
          <div key={i} className="ge-row">
            <span>{r.label}</span>
            <span>{r.value}</span>
          </div>
        ))}
      </div>
      {footnote && (
        <p className="mt-3 text-xs text-muted">{footnote}</p>
      )}
    </div>
  );
}
