/* eslint-disable @typescript-eslint/no-explicit-any */
export default function PromoBanner({ dict }: { dict: any }) {
  return (
    <div className="promo-banner">
      {dict.promo.prefix} <strong className="text-gold">{dict.promo.text}</strong> {dict.promo.suffix}
    </div>
  );
}
