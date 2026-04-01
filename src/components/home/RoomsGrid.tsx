import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { rooms } from "@/data/rooms";
import type { Locale } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RoomsGrid({ dict, locale }: { dict: any; locale: Locale }) {
  const basePath = "/lachotelsahambavy";
  const displayRooms = rooms.filter((r) => r.priceEUR);

  return (
    <section id="rooms" className="py-24 bg-cream">
      <div className="max-w-[1200px] mx-auto px-4">
        <SectionHeader
          label={dict.rooms.label}
          title={dict.rooms.title}
          subtitle={dict.rooms.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayRooms.map((room, i) => (
            <ScrollReveal key={room.id} delay={i * 100} className={room.featured ? "md:col-span-2 lg:col-span-2" : ""}>
              <div className="room-card h-full flex flex-col">
                <div className={`relative overflow-hidden ${room.featured ? "h-72" : "h-56"}`}>
                  <img
                    src={room.images[0] ? `${basePath}${room.images[0]}` : `${basePath}/images/hero/hero-pilotis.jpg`}
                    alt={room.name[locale]}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                  />
                  {room.badge && (
                    <span className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold px-3 py-1 rounded">
                      {room.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs text-text-muted uppercase tracking-wider">{room.type[locale]}</span>
                  <h3 className="text-lg mt-1 mb-2">{room.name[locale]}</h3>
                  <p className="text-sm text-text-body mb-4 flex-1">{room.description[locale]}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 4).map((a, j) => (
                      <span key={j} className="text-xs bg-cream-dark px-2 py-1 rounded">
                        {a.icon} {a.label[locale]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-xs text-text-muted">{dict.rooms.from}</span>
                      <span className="font-[family-name:var(--font-heading)] text-2xl text-brown-brand ml-2">
                        €{room.priceEUR}
                      </span>
                      <span className="text-sm text-text-muted">{dict.rooms.night}</span>
                    </div>
                    <Link href={`${basePath}/${locale}/hebergements/`} className="btn btn--primary text-xs py-2 px-4">
                      {dict.rooms.book}
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href={`${basePath}/${locale}/hebergements/`} className="btn btn--outline">
            {dict.rooms.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
