import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { rooms, extras } from "@/data/rooms";
import Link from "next/link";

const basePath = "/lachotelsahambavy";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.rooms.title} — Lac Hôtel Sahambavy`,
    description: dict.rooms.subtitle,
  };
}

export default async function HebergementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  return (
    <>
      {/* Hero */}
      <PageHero
        title={dict.rooms.title}
        subtitle={dict.rooms.subtitle}
        image="/lachotelsahambavy/images/rooms/pilotis-01.jpg"
      />

      {/* Rate summary table */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.rooms.label}
            title={dict.rooms.tableTitle}
            subtitle={dict.rooms.subtitle}
          />

          <ScrollReveal>
            <div className="overflow-x-auto rounded-xl border border-brown-deep/10 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brown-deep text-white">
                    <th className="text-left px-6 py-4 font-semibold">
                      {loc === "fr" ? "Hébergement" : loc === "es" ? "Alojamiento" : "Accommodation"}
                    </th>
                    <th className="text-center px-6 py-4 font-semibold">
                      {loc === "fr" ? "Capacité" : loc === "es" ? "Capacidad" : "Capacity"}
                    </th>
                    <th className="text-center px-6 py-4 font-semibold">{dict.rooms.rateTO}</th>
                    <th className="text-center px-6 py-4 font-semibold">{dict.rooms.ratePublic}</th>
                    <th className="text-center px-6 py-4 font-semibold">Ariary</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, i) => (
                    <tr
                      key={room.id}
                      className={`border-b border-brown-deep/5 ${i % 2 === 0 ? "bg-cream/40" : "bg-white"}`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text-dark">{room.name[loc]}</div>
                        <div className="text-text-muted text-xs mt-0.5">
                          {room.units} {dict.rooms.units}
                          {room.surface ? ` · ${room.surface}` : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-text-muted">{room.capacity} pers.</td>
                      <td className="px-6 py-4 text-center font-semibold text-gold">
                        {room.priceTOEUR ? `${room.priceTOEUR}\u20AC` : "—"}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-text-dark">
                        {room.priceEUR ? `${room.priceEUR}\u20AC` : "—"}
                      </td>
                      <td className="px-6 py-4 text-center text-text-muted">
                        {room.priceAR.toLocaleString("fr-FR")} AR
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="text-center text-xs text-text-muted mt-4">
              {dict.rooms.extraBed}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Detailed room sections */}
      {rooms.map((room, index) => (
        <section
          key={room.id}
          id={room.id}
          className={`py-24 ${index % 2 === 0 ? "bg-cream" : "bg-white"}`}
        >
          <div className="max-w-[1200px] mx-auto px-4">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}>
              {/* Image */}
              <ScrollReveal className={index % 2 !== 0 ? "lg:order-2" : ""}>
                <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[4/3]">
                  {room.images[0] ? (
                    <img
                      src={`${basePath}${room.images[0]}`}
                      alt={room.name[loc]}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-brown-deep/10 flex items-center justify-center text-text-muted">
                      {room.name[loc]}
                    </div>
                  )}
                  {room.badge && (
                    <span className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      {room.badge}
                    </span>
                  )}
                </div>
              </ScrollReveal>

              {/* Info */}
              <ScrollReveal delay={150} className={index % 2 !== 0 ? "lg:order-1" : ""}>
                <div>
                  <span className="section-label">{room.type[loc]}</span>
                  <h2 className="mt-2 mb-4">{room.name[loc]}</h2>
                  <p className="text-text-muted leading-relaxed mb-6">
                    {room.longDescription ? room.longDescription[loc] : room.description[loc]}
                  </p>

                  {/* Amenities grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {room.amenities.map((amenity, ai) => (
                      <div
                        key={ai}
                        className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm shadow-sm border border-brown-deep/5"
                      >
                        <span className="text-lg flex-shrink-0">{amenity.icon}</span>
                        <span className="text-text-muted">{amenity.label[loc]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-brown-deep/10">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-sm text-text-muted">{dict.rooms.from}</span>
                      <div className="text-right">
                        {room.priceEUR ? (
                          <span className="text-3xl font-bold text-gold">{room.priceEUR}&euro;</span>
                        ) : (
                          <span className="text-lg text-text-muted">—</span>
                        )}
                        <span className="text-sm text-text-muted ml-1">{dict.rooms.night}</span>
                      </div>
                    </div>
                    <div className="text-sm text-text-muted mb-4">
                      {room.priceAR.toLocaleString("fr-FR")} Ariary {dict.rooms.night}
                    </div>
                    <Link
                      href={`${basePath}/${locale}/contact`}
                      className="block w-full text-center bg-gold text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gold-light transition-colors shadow-md"
                    >
                      {dict.rooms.book}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}

      {/* Extras section */}
      <section className="py-24 bg-brown-deep text-white">
        <div className="max-w-[1000px] mx-auto px-4">
          <SectionHeader
            label={loc === "fr" ? "Services & Extras" : loc === "es" ? "Servicios y Extras" : "Services & Extras"}
            title={loc === "fr" ? "Restauration & Transferts" : loc === "es" ? "Restauracion y Traslados" : "Dining & Transfers"}
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              [
                { key: "breakfast" as const, icon: "\u2615" },
                { key: "menu" as const, icon: "\uD83C\uDF7D" },
                { key: "picnic" as const, icon: "\uD83E\uDDFA" },
                { key: "transfer" as const, icon: "\uD83D\uDE99" },
              ] as const
            ).map(({ key, icon }, i) => {
              const extra = extras[key];
              return (
                <ScrollReveal key={key} delay={i * 100}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center h-full border border-white/10">
                    <span className="text-3xl block mb-3">{icon}</span>
                    <h4 className="text-white font-semibold mb-2">{extra.label[loc]}</h4>
                    <div className="text-gold text-xl font-bold">
                      {"priceEUR" in extra && extra.priceEUR ? `${extra.priceEUR}\u20AC` : ""}
                    </div>
                    <div className="text-cream/50 text-sm mt-1">
                      {extra.priceAR.toLocaleString("fr-FR")} AR
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Camping section */}
      <section className="py-24 bg-cream">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <ScrollReveal>
            <span className="text-4xl block mb-4">{"\u26FA"}</span>
            <h2 className="mb-4">{dict.rooms.camping}</h2>
            <p className="text-text-muted leading-relaxed mb-6">
              {dict.rooms.campingDesc}
            </p>
            <div className="inline-flex items-baseline gap-2 bg-white rounded-xl px-8 py-4 shadow-sm border border-brown-deep/10">
              <span className="text-3xl font-bold text-gold">
                {extras.camping.priceAR.toLocaleString("fr-FR")}
              </span>
              <span className="text-text-muted">AR {dict.rooms.night}</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA to contact */}
      <section className="py-20 bg-white">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="mb-4">{dict.contact.title}</h2>
            <p className="text-text-muted mb-8">{dict.contact.subtitle}</p>
            <Link
              href={`${basePath}/${locale}/contact`}
              className="inline-block bg-gold text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-gold-light transition-colors shadow-lg"
            >
              {dict.rooms.book}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
