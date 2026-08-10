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
        <p className="ge-label mb-4">{title}</p>
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
