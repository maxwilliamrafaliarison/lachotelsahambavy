import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import TheicoleBookingForm from "./TheicoleBookingForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { touristAttractionSchema, breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { Icon } from "@/components/ui/Icon";

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.plantation.heroTitle} — ${siteConfig.name}`,
    description: dict.plantation.heroSubtitle,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function PlantationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const attractionPlantation = touristAttractionSchema({
    locale: loc,
    slug: "plantation-de-the",
    name: dict.plantation.heroTitle as string,
    description: dict.plantation.heroSubtitle as string,
    image: "/images/tea/plantation-drone-overhead.jpg",
  });

  const excursionInfoItems = [
    { icon: "clock", label: locale === "fr" ? "Durée" : locale === "en" ? "Duration" : "Duración", value: dict.plantation.excursionInfo.duration },
    { icon: "clipboard", label: locale === "fr" ? "Réservation" : locale === "en" ? "Booking" : "Reserva", value: dict.plantation.excursionInfo.travel },
    { icon: "mountain", label: locale === "fr" ? "Dénivelé" : locale === "en" ? "Elevation" : "Desnivel", value: dict.plantation.excursionInfo.elevation },
    { icon: "difficulty", label: locale === "fr" ? "Difficulté" : locale === "en" ? "Difficulty" : "Dificultad", value: dict.plantation.excursionInfo.difficulty },
    { icon: "hike", label: locale === "fr" ? "Marche" : locale === "en" ? "Walking" : "Caminata", value: dict.plantation.excursionInfo.walking },
  ];

  return (
    <>
      <JsonLd
        schemas={[
          attractionPlantation,
          breadcrumbSchema(buildBreadcrumb(loc, "plantation")),
        ]}
      />
      <PageHero
        title={dict.plantation.heroTitle}
        subtitle={dict.plantation.heroSubtitle}
        image={`${basePath}/images/tea/plantation-drone-overhead.jpg`}
      />

      {/* History - Legend & Madagascar */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader
            label={dict.plantation.historyLabel}
            title={dict.plantation.historyTitle}
          />
          <ScrollReveal>
            <div className="space-y-6 text-text-muted leading-relaxed">
              <p>{dict.plantation.historyIntro}</p>
              <p>{dict.plantation.historyMadagascar}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-brown-deep/20 hidden md:block" />
            <div className="space-y-12 md:space-y-0">
              {(dict.plantation.historyTimeline as { year: string; text: string }[]).map((item: any, i: number) => (
                <ScrollReveal key={item.year} delay={i * 100}>
                  <div className={`md:flex items-center gap-8 md:mb-16 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`md:w-5/12 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <span className="inline-block text-3xl font-bold text-brown-deep font-[family-name:var(--font-heading)]">{item.year}</span>
                      <p className="mt-2 text-text-muted leading-relaxed">{item.text}</p>
                    </div>
                    <div className="hidden md:flex md:w-2/12 justify-center">
                      <div className="w-4 h-4 rounded-full bg-brown-deep ring-4 ring-cream" />
                    </div>
                    <div className="md:w-5/12" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Excursion Info — carte liquid-glass avec infos en amenity-chips
          et itinéraire numéroté dans un container séparé */}
      <section className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #FBFAF6 50%, #FFFFFF 100%)",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-green-tea/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <SectionHeader label={dict.plantation.excursionLabel} title={dict.plantation.excursionTitle} />
          <ScrollReveal>
            <div className="room-price p-7 md:p-10 max-w-3xl mx-auto">
              {/* Infos clés — grille de amenity-chips, 5 colonnes sur desktop */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-10">
                {excursionInfoItems.map((info) => (
                  <div key={info.label} className="amenity-chip flex-col text-center !py-4">
                    <Icon
                      name={info.icon}
                      size={22}
                      weight="regular"
                      className="text-gold mb-1.5"
                    />
                    <span className="block text-[0.65rem] uppercase tracking-wider text-text-muted mb-0.5">
                      {info.label}
                    </span>
                    <span className="block text-sm font-semibold text-brown-deep">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Filet doré séparateur — signature éditoriale */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px flex-1 bg-gold/20" />
                <span className="text-[0.7rem] font-semibold text-gold uppercase tracking-[0.28em]">
                  {locale === "fr" ? "Déroulé de la visite" : locale === "en" ? "Visit itinerary" : "Itinerario de la visita"}
                </span>
                <span className="h-px flex-1 bg-gold/20" />
              </div>

              <div className="space-y-4">
                {(dict.plantation.excursionSteps as string[]).map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brown-deep to-gold text-cream flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                      {i + 1}
                    </div>
                    <p className="text-text-body leading-relaxed pt-1 text-sm md:text-base">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Boutique - Mami Bio Shop — grille repos-feature premium */}
      <section className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #F8F5F0 0%, #FBFAF6 50%, #F8F5F0 100%)",
          }}
        />
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <SectionHeader label={dict.plantation.shopLabel} title={dict.plantation.shopTitle} />
          <ScrollReveal>
            <p className="text-center text-text-muted leading-relaxed max-w-2xl mx-auto mb-10 md:mb-12">
              {dict.plantation.shopIntro}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-[900px] mx-auto mb-8">
            {(dict.plantation.shopItems as { name: string; desc: string }[]).map((item: any, i: number) => (
              <ScrollReveal key={item.name} delay={i * 100}>
                <div className="repos-feature h-full p-6 md:p-7 text-center">
                  <div className="repos-feature__badge mx-auto mb-4">
                    <Icon name="leaf" size={22} weight="regular" />
                  </div>
                  <h3 className="text-base md:text-lg text-text-dark mb-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <div className="repos-feature p-7 md:p-9 max-w-2xl mx-auto text-center">
              <div className="flex items-center gap-3 justify-center mb-4">
                <Icon name="soap" size={24} weight="regular" className="text-gold" />
                <h3 className="text-lg md:text-xl text-text-dark">
                  {locale === "fr" ? "Savons artisanaux 100 % naturels" : locale === "en" ? "100% Natural Handmade Soaps" : "Jabones artesanales 100 % naturales"}
                </h3>
              </div>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">
                {dict.plantation.shopSoap}
              </p>
            </div>
          </ScrollReveal>

          <div className="text-center mt-10">
            <Link href={`/${locale}/contact/`} className="btn btn--outline">
              {dict.plantation.shopCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-14 md:py-24 bg-brown-deep text-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader light label={dict.plantation.bookLabel} title={dict.plantation.bookTitle} />
          <TheicoleBookingForm dict={dict} />
        </div>
      </section>
    </>
  );
}
