import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";

const offers = [
  { icon: "🍽", key: "restaurant", image: "https://www.lachotel.com/wp-content/uploads/Restaurant_03-605x465.jpg" },
  { icon: "🏊", key: "pool", image: "https://www.lachotel.com/wp-content/uploads/piscine-4-605x465.jpg" },
  { icon: "🚶", key: "lake", image: "https://www.lachotel.com/wp-content/uploads/lac-hotel-slide_home-2-605x465.jpg" },
  { icon: "💆", key: "massage", image: "https://www.lachotel.com/wp-content/uploads/25311141_1541685912593027_4-605x465.jpg" },
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
