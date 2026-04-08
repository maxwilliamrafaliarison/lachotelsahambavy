import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { getBasePath } from "@/lib/utils";

const basePath = getBasePath();
const offers = [
  { icon: "🍽", key: "restaurant", image: `${basePath}/images/restaurant/restaurant-01.jpg` },
  { icon: "🏊", key: "pool", image: `${basePath}/images/hotel/hotel-facade.jpg` },
  { icon: "🚶", key: "lake", image: `${basePath}/images/hero/hero-lake.jpg` },
  { icon: "💆", key: "massage", image: `${basePath}/images/activities/massage.jpg` },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Offers({ dict }: { dict: any }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader
          label={dict.offers.label}
          title={dict.offers.title}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, i) => (
            <ScrollReveal key={offer.key} delay={i * 100}>
              <div className="group relative rounded-xl overflow-hidden h-72">
                <img
                  src={offer.image}
                  alt={dict.offers[offer.key]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-2xl mb-2">{offer.icon}</div>
                  <h3 className="text-lg text-white mb-1">{dict.offers[offer.key]}</h3>
                  <p className="text-sm text-white/70">{dict.offers[`${offer.key}Desc`]}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
