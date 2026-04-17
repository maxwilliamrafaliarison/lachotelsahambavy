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

      {/* Excursion Info */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader label={dict.plantation.excursionLabel} title={dict.plantation.excursionTitle} />
          <ScrollReveal>
            <div className="bg-cream rounded-2xl shadow-lg p-8 md:p-12 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {excursionInfoItems.map((info) => (
                  <div key={info.label} className="text-center">
                    <Icon
                      name={info.icon}
                      size={26}
                      weight="regular"
                      className="text-gold mx-auto mb-2"
                    />
                    <span className="block text-sm text-text-muted">{info.label}</span>
                    <span className="block font-semibold text-brown-deep">{info.value}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl mb-6 text-center">{locale === "fr" ? "Déroulé de la visite" : locale === "en" ? "Visit itinerary" : "Itinerario de la visita"}</h3>
              <div className="space-y-4">
                {(dict.plantation.excursionSteps as string[]).map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brown-deep text-cream flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-text-body leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Boutique - Mami Bio Shop */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader label={dict.plantation.shopLabel} title={dict.plantation.shopTitle} />
          <ScrollReveal>
            <p className="text-center text-text-muted leading-relaxed max-w-2xl mx-auto mb-10">
              {dict.plantation.shopIntro}
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {(dict.plantation.shopItems as { name: string; desc: string }[]).map((item: any, i: number) => (
              <ScrollReveal key={item.name} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <Icon
                    name="leaf"
                    size={30}
                    weight="regular"
                    className="text-gold mx-auto mb-3"
                  />
                  <h3 className="text-lg mb-2">{item.name}</h3>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-lg mb-4 text-center">{locale === "fr" ? "Savons artisanaux 100 % naturels" : locale === "en" ? "100% Natural Handmade Soaps" : "Jabones artesanales 100 % naturales"}</h3>
              <p className="text-text-muted text-sm leading-relaxed text-center">{dict.plantation.shopSoap}</p>
            </div>
          </ScrollReveal>
          <div className="text-center mt-8">
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
