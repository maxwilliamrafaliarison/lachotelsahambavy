/* eslint-disable @typescript-eslint/no-explicit-any */
export default function PromoBanner({ dict }: { dict: any }) {
  return (
    <div className="bg-gold text-white text-center py-3 px-4 text-sm font-medium tracking-wide">
      {dict.promo.prefix} <strong className="text-white font-bold">{dict.promo.text}</strong> {dict.promo.suffix}
    </div>
  );
}
