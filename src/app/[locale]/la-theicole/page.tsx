import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import TheicoleBookingForm from "./TheicoleBookingForm";

const basePath = "/lachotelsahambavy";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.theicole.heroTitle} — ${siteConfig.name}`,
    description: dict.theicole.heroSubtitle,
  };
}

export default async function TheicolePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const excursionInfoItems = [
    { icon: "⏱", label: locale === "fr" ? "Durée" : locale === "en" ? "Duration" : "Duración", value: dict.theicole.excursionInfo.duration },
    { icon: "🚗", label: locale === "fr" ? "Trajet" : locale === "en" ? "Travel" : "Trayecto", value: dict.theicole.excursionInfo.travel },
    { icon: "📐", label: locale === "fr" ? "Dénivelé" : locale === "en" ? "Elevation" : "Desnivel", value: dict.theicole.excursionInfo.elevation },
    { icon: "🟢", label: locale === "fr" ? "Difficulté" : locale === "en" ? "Difficulty" : "Dificultad", value: dict.theicole.excursionInfo.difficulty },
    { icon: "🥾", label: locale === "fr" ? "Marche" : locale === "en" ? "Walking" : "Caminata", value: dict.theicole.excursionInfo.walking },
  ];

  return (
    <>
      <PageHero
        title={dict.theicole.heroTitle}
        subtitle={dict.theicole.heroSubtitle}
        image="/lachotelsahambavy/images/tea/plantation.jpg"
      />

      {/* History Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.theicole.historyLabel}
            title={dict.theicole.historyTitle}
          />
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-brown-deep/20 hidden md:block" />
            <div className="space-y-12 md:space-y-0">
              {(dict.theicole.historyTimeline as { year: string; text: string }[]).map((item, i) => (
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
      <section className="py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader label={dict.theicole.excursionLabel} title={dict.theicole.excursionTitle} />
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {excursionInfoItems.map((info) => (
                  <div key={info.label} className="text-center">
                    <span className="text-2xl mb-2 block">{info.icon}</span>
                    <span className="block text-sm text-text-muted">{info.label}</span>
                    <span className="block font-semibold text-brown-deep">{info.value}</span>
                  </div>
                ))}
              </div>

              {/* Steps */}
              <h3 className="text-xl mb-6 text-center">{locale === "fr" ? "Déroulé de la visite" : locale === "en" ? "Visit itinerary" : "Itinerario de la visita"}</h3>
              <div className="space-y-4">
                {(dict.theicole.excursionSteps as string[]).map((step, i) => (
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

      {/* Shop */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader label={dict.theicole.shopLabel} title={dict.theicole.shopTitle} />
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {(dict.theicole.shopItems as { name: string; desc: string }[]).map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 100}>
                <div className="bg-cream rounded-2xl p-6 text-center">
                  <span className="text-3xl mb-3 block">🍃</span>
                  <h3 className="text-lg mb-2">{item.name}</h3>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={`/${locale}/contact/`} className="btn btn--outline">
              {dict.theicole.shopCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-24 bg-brown-deep text-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader light label={dict.theicole.bookLabel} title={dict.theicole.bookTitle} />
          <TheicoleBookingForm dict={dict} />
        </div>
      </section>
    </>
  );
}
