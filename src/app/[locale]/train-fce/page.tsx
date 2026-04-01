import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { siteConfig } from "@/data/site";

const basePath = "/lachotelsahambavy";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.train.heroTitle} — ${siteConfig.name}`,
    description: dict.train.heroSubtitle,
  };
}

export default async function TrainFCEPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const infoItems = [
    { icon: "🚂", label: "Route", value: dict.train.infoItems.route },
    { icon: "📏", label: "Distance", value: dict.train.infoItems.distance },
    { icon: "⏱", label: locale === "fr" ? "Durée" : "Duration", value: dict.train.infoItems.duration },
    { icon: "⛰", label: "Altitude", value: dict.train.infoItems.altitude },
    { icon: "🏚", label: locale === "fr" ? "Gare" : "Station", value: dict.train.infoItems.station },
    { icon: "📧", label: locale === "fr" ? "Réservation" : "Booking", value: dict.train.infoItems.booking },
  ];

  return (
    <>
      <PageHero
        title={dict.train.heroTitle}
        subtitle={dict.train.heroSubtitle}
        image="/lachotelsahambavy/images/train/train-hotel.jpg"
      />

      {/* Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader label={dict.train.introLabel} title={dict.train.introTitle} />
          <ScrollReveal>
            <div className="space-y-6 text-text-muted leading-relaxed">
              <p>{dict.train.introP1}</p>
              <p>{dict.train.introP2}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Train Options */}
      <section className="py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader label={dict.train.optionsLabel} title={dict.train.optionsTitle} />
          <div className="grid md:grid-cols-3 gap-8">
            {(dict.train.options as { name: string; desc: string }[]).map((option, i) => (
              <ScrollReveal key={option.name} delay={i * 150}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow p-8 text-center">
                  <div className="text-4xl mb-4">🚂</div>
                  <h3 className="text-xl mb-3">{option.name}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{option.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Info */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader label={dict.train.infoLabel} title={dict.train.infoTitle} />
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {infoItems.map((info) => (
                <div key={info.label} className="bg-cream rounded-2xl p-6 text-center">
                  <span className="text-3xl mb-3 block">{info.icon}</span>
                  <span className="block text-sm text-text-muted mb-1">{info.label}</span>
                  <span className="block font-semibold text-brown-deep text-sm">{info.value}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brown-deep text-white">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-white mb-6">{dict.train.ctaTitle}</h2>
            <p className="text-cream/70 text-lg font-[family-name:var(--font-sub)] mb-10 leading-relaxed">
              {dict.train.ctaP}
            </p>
            <Link href={`/${locale}/contact/`} className="btn btn--primary bg-cream text-brown-deep border-cream hover:bg-white">
              {dict.train.cta}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
