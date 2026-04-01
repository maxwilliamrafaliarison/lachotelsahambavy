import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

const basePath = "/lachotelsahambavy";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.hotel.heroTitle} — ${siteConfig.name}`,
    description: dict.hotel.heroSubtitle,
    alternates: {
      languages: {
        fr: `${basePath}/fr/hotel`,
        en: `${basePath}/en/hotel`,
        es: `${basePath}/es/hotel`,
      },
    },
  };
}

export default async function HotelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      {/* Hero */}
      <PageHero
        title={dict.hotel.heroTitle}
        subtitle={dict.hotel.heroSubtitle}
        image="/lachotelsahambavy/images/hotel/hotel-facade.jpg"
      />

      {/* History Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader
            label={dict.hotel.historyLabel}
            title={dict.hotel.historyTitle}
          />

          <ScrollReveal>
            <div className="space-y-6 text-text-muted leading-relaxed">
              <p>{dict.hotel.historyP1}</p>
              <p>{dict.hotel.historyP2}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-cream/50">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader
            label={dict.hotel.philosophyLabel}
            title={dict.hotel.philosophyTitle}
          />

          <ScrollReveal>
            <div className="space-y-6 text-text-muted leading-relaxed">
              <p>{dict.hotel.philosophyP1}</p>
              <p>{dict.hotel.philosophyP2}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Eco-responsibility Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.hotel.ecoLabel}
            title={dict.hotel.ecoTitle}
          />

          <div className="max-w-[800px] mx-auto">
            <ScrollReveal>
              <p className="text-text-muted leading-relaxed mb-10">
                {dict.hotel.ecoP1}
              </p>
            </ScrollReveal>

            <div className="space-y-4">
              {(dict.hotel.ecoItems as string[]).map((item, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="flex items-start gap-4 bg-cream/40 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700/10 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4 text-green-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-text-muted leading-relaxed">{item}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
