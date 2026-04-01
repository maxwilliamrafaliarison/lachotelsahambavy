import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Locale } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RestaurantTeaser({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = "/lachotelsahambavy";

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={`${basePath}/images/restaurant/restaurant-01.jpg`}
                alt="Restaurant panoramique du Lac Hôtel"
                className="rounded-xl w-full h-64 object-cover col-span-2"
                loading="lazy"
              />
              <img
                src={`${basePath}/images/restaurant/restaurant-02.jpg`}
                alt="Cheminée du restaurant"
                className="rounded-xl w-full h-40 object-cover"
                loading="lazy"
              />
              <img
                src={`${basePath}/images/rooms/superior-02.jpg`}
                alt="Chambre avec vue lac au coucher du soleil"
                className="rounded-xl w-full h-40 object-cover"
                loading="lazy"
              />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal delay={200}>
            <span className="section-label">{dict.restaurantSection.label}</span>
            <h2 className="mb-2">{dict.restaurantSection.title}</h2>
            <p className="text-gold font-[family-name:var(--font-sub)] italic mb-6">
              {dict.restaurantSection.subtitle}
            </p>
            <p className="text-text-body mb-6 leading-relaxed">{dict.restaurantSection.p1}</p>

            <ul className="space-y-2 mb-8">
              {dict.restaurantSection.specialties.map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-body">
                  <span className="text-gold mt-0.5">✦</span>
                  {s}
                </li>
              ))}
            </ul>

            {/* Prices */}
            <div className="flex gap-6 mb-8">
              {[
                { price: "€8", label: dict.restaurantSection.breakfast },
                { price: "€14", label: dict.restaurantSection.menu },
                { price: "€8", label: dict.restaurantSection.picnic },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="font-[family-name:var(--font-heading)] text-2xl text-brown-brand">{item.price}</div>
                  <div className="text-xs text-text-muted uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>

            <Link href={`/${locale}/restaurant/`} className="btn btn--outline">
              {dict.restaurantSection.cta}
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
