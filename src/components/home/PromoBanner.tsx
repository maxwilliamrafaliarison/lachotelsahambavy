/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Bandeau promo — fine bande « Panorama » : fond brume, texte vert thé,
 * filet hairline en dessous. Remplace l'ancienne bande brun/or.
 */
export default function PromoBanner({ dict }: { dict: any }) {
  return (
    <div className="border-b border-hairline bg-mist-bg px-4 py-3 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-tea">
        <span className="text-muted">{dict.promo.prefix}</span>{" "}
        <strong className="font-semibold">{dict.promo.text}</strong>{" "}
        <span className="text-muted">{dict.promo.suffix}</span>
      </p>
    </div>
  );
}
