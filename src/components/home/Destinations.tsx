import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { type Locale, getBasePath } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Destinations({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = getBasePath();

  const items = [
    {
      key: "train",
      href: `/${locale}/train-fce/`,
      image: `${basePath}/images/train/train-hotel.jpg`,
    },
    {
      key: "plantation",
      href: `/${locale}/la-theicole/`,
      image: `${basePath}/images/tea/plantation.jpg`,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <ScrollReveal key={item.key} delay={i * 150}>
              <Link href={item.href} className="group block relative rounded-xl overflow-hidden h-96">
                <img
                  src={item.image}
                  alt={dict.destinations[item.key].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="section-label !text-gold">{dict.destinations[item.key].label}</span>
                  <h3 className="text-2xl text-white mb-2">{dict.destinations[item.key].title}</h3>
                  <p className="text-sm text-white/70 mb-4">{dict.destinations[item.key].desc}</p>
                  <span className="btn btn--outline-white text-xs py-2 px-4 inline-flex">
                    {dict.destinations[item.key].cta}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
