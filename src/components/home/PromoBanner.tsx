/* eslint-disable @typescript-eslint/no-explicit-any */
export default function PromoBanner({ dict }: { dict: any }) {
  return (
    <div className="bg-brown-deep/95 backdrop-blur-sm text-cream text-center py-3.5 px-4">
      <p className="text-[0.65rem] uppercase tracking-[0.2em] font-medium">
        <span className="text-cream/60">{dict.promo.prefix}</span>
        {" "}
        <strong className="text-gold font-bold">{dict.promo.text}</strong>
        {" "}
        <span className="text-cream/60">{dict.promo.suffix}</span>
      </p>
    </div>
  );
}
