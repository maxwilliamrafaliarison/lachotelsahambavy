import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { rooms, extras } from "@/data/rooms";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { hotelRoomSchema, breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { siteConfig } from "@/data/site";
import { Icon } from "@/components/ui/Icon";

const basePath = getBasePath();

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

  // JSON-LD : ItemList de HotelRoom (un item par type d'hébergement)
  const roomsItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.url}/${loc}/hebergements/#rooms-list`,
    name: dict.rooms.title,
    numberOfItems: rooms.length,
    itemListElement: rooms.map((room, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: hotelRoomSchema(room, loc),
    })),
  };

  return (
    <>
      <JsonLd
        schemas={[
          roomsItemList,
          breadcrumbSchema(buildBreadcrumb(loc, "hebergements")),
        ]}
      />
      {/* Hero */}
      <PageHero
        title={dict.rooms.title}
        subtitle={dict.rooms.subtitle}
        image={`${basePath}/images/rooms/pilotis-01.jpg`}
      />

      {/* Liquid-glass tariff grid — remplace l'ancien tableau "brut".
          Chaque carte = un type d'hébergement avec photo, verre dépoli,
          prix Public (et TO si dispo) + ancre vers la section détaillée. */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.rooms.label}
            title={dict.rooms.tableTitle}
            subtitle={dict.rooms.subtitle}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, i) => (
              <ScrollReveal key={room.id} delay={i * 70}>
                <Link
                  href={`#${room.id}`}
                  className="tariff-card group block aspect-[3/4] bg-brown-deep"
                  aria-label={`${room.name[loc]} — ${dict.rooms.from} ${room.priceEUR ? `${room.priceEUR}\u20AC` : `${room.priceAR.toLocaleString("fr-FR")} AR`}`}
                >
                  {/* Background image */}
                  {room.images[0] ? (
                    <img
                      src={`${basePath}${room.images[0]}`}
                      alt={room.name[loc]}
                      className="tariff-card__image absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : null}

                  {/* Gradient overlay — assure la lisibilité du panneau verre */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Badge top-left */}
                  {room.badge && (
                    <span className="absolute top-4 left-4 z-10 bg-gold/95 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide uppercase shadow-lg">
                      {room.badge}
                    </span>
                  )}

                  {/* Liquid-glass info panel */}
                  <div className="tariff-card__glass absolute inset-x-4 bottom-4 rounded-xl p-5 text-white">
                    <h3 className="text-xl text-white mb-1 leading-tight">
                      {room.name[loc]}
                    </h3>
                    <p className="text-white/75 text-xs mb-4 tracking-wide">
                      {room.units} {dict.rooms.units}
                      {" · "}
                      {room.capacity} pers.
                      {room.surface ? ` · ${room.surface}` : ""}
                    </p>

                    <div className="flex items-end justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] uppercase tracking-[0.15em] text-white/60 mb-0.5">
                          {dict.rooms.from}
                        </span>
                        {room.priceEUR ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gold-light tabular-nums">
                              {room.priceEUR}
                              {"\u20AC"}
                            </span>
                            <span className="text-white/55 text-[11px]">{dict.rooms.night}</span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gold-light tabular-nums">
                              {(room.priceAR / 1000).toLocaleString("fr-FR")}k
                            </span>
                            <span className="text-white/55 text-[11px]">AR {dict.rooms.night}</span>
                          </div>
                        )}
                        {room.priceEUR && (
                          <div className="text-[10px] text-white/45 mt-0.5 tabular-nums">
                            {room.priceAR.toLocaleString("fr-FR")} AR
                            {room.priceTOEUR && room.priceTOEUR !== room.priceEUR ? (
                              <span className="ml-2">
                                {dict.rooms.rateTO}: {room.priceTOEUR}
                                {"\u20AC"}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>

                      <Icon
                        name="arrow"
                        size={20}
                        weight="regular"
                        className="tariff-card__arrow text-white/75 flex-shrink-0 mb-0.5"
                      />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={100}>
            <p className="text-center text-xs text-text-muted mt-10">
              {dict.rooms.extraBed}
              {" · "}
              {dict.rooms.taxeSejour}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Detailed room sections */}
      {rooms.map((room, index) => (
        <section
          key={room.id}
          id={room.id}
          className={`py-14 md:py-24 ${index % 2 === 0 ? "bg-cream" : "bg-white"}`}
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
                        className="flex items-center gap-2.5 bg-white rounded-lg px-3 py-2 text-sm shadow-sm border border-brown-deep/5"
                      >
                        <Icon
                          name={amenity.icon}
                          size={18}
                          weight="regular"
                          className="text-gold flex-shrink-0"
                        />
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
                      href={`/${locale}/contact/`}
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
      <section className="py-14 md:py-24 bg-brown-deep text-white">
        <div className="max-w-[1000px] mx-auto px-4">
          <SectionHeader
            label={loc === "fr" ? "Services & Extras" : loc === "es" ? "Servicios y Extras" : "Services & Extras"}
            title={loc === "fr" ? "Restauration & Transferts" : loc === "es" ? "Restauracion y Traslados" : "Dining & Transfers"}
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              [
                { key: "breakfast" as const, iconName: "coffee" },
                { key: "menu" as const, iconName: "dining" },
                { key: "picnic" as const, iconName: "basket" },
                { key: "transfer" as const, iconName: "car" },
              ] as const
            ).map(({ key, iconName }, i) => {
              const extra = extras[key];
              return (
                <ScrollReveal key={key} delay={i * 100}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center h-full border border-white/10">
                    <div className="flex justify-center mb-3">
                      <Icon name={iconName} size={28} weight="regular" className="text-gold-light" />
                    </div>
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: "#FFFFFF" }}
                    >
                      {extra.label[loc]}
                    </h4>
                    <div
                      className="text-xl font-bold"
                      style={{ color: "#D4A84B" }}
                    >
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
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="flex justify-center mb-4">
              <Icon name="camping" size={40} weight="regular" className="text-gold" />
            </div>
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
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="mb-4">{dict.contact.title}</h2>
            <p className="text-text-muted mb-8">{dict.contact.subtitle}</p>
            <Link
              href={`/${locale}/contact/`}
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
