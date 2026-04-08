import ScrollReveal from "@/components/ui/ScrollReveal";
import { getBasePath } from "@/lib/utils";

const basePath = getBasePath();
const offers = [
  { key: "restaurant", image: `${basePath}/images/restaurant/restaurant-01.jpg` },
  { key: "pool", image: `${basePath}/images/pool/pool-night.jpg` },
  { key: "lake", image: `${basePath}/images/hero/hero-lake.jpg` },
  { key: "massage", image: `${basePath}/images/activities/massage.jpg` },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Offers({ dict }: { dict: any }) {
  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <ScrollReveal>
            <span className="section-label">{dict.offers.label}</span>
            <h2>{dict.offers.title}</h2>
            <div className="section-divider" />
          </ScrollReveal>
        </div>

        {/* Grid — 2x2 on desktop, cinematic hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {offers.map((offer, i) => (
            <ScrollReveal key={offer.key} delay={i * 120}>
              <div className="group relative rounded-2xl overflow-hidden aspect-[16/10] cursor-pointer">
                <img
                  src={offer.image}
                  alt={dict.offers[offer.key]}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  loading="lazy"
                />
                {/* Gradient overlay — subtle, stronger on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500" />

                {/* Content — bottom aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-xl md:text-2xl text-white mb-2 transition-transform duration-500 group-hover:translate-y-[-4px]">
                    {dict.offers[offer.key]}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed max-w-sm opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    {dict.offers[`${offer.key}Desc`]}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
