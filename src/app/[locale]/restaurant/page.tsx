import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { extras } from "@/data/rooms";
import Link from "next/link";

const basePath = "/lachotelsahambavy";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.restaurantSection.heroTitle} — Lac Hôtel Sahambavy`,
    description: dict.restaurantSection.subtitle,
  };
}

export default async function RestaurantPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const philosophyCards = [
    {
      icon: "\uD83C\uDF3F",
      title: dict.restaurantSection.philosophyLocal,
      desc: dict.restaurantSection.philosophyLocalDesc,
    },
    {
      icon: "\uD83D\uDC1F",
      title: dict.restaurantSection.philosophyLac,
      desc: dict.restaurantSection.philosophyLacDesc,
    },
    {
      icon: "\uD83E\uDDD1\u200D\uD83C\uDF73",
      title: dict.restaurantSection.philosophyMaison,
      desc: dict.restaurantSection.philosophyMaisonDesc,
    },
  ];

  const pricingItems = [
    {
      icon: "\u2615",
      label: dict.restaurantSection.breakfast,
      priceEUR: extras.breakfast.priceEUR,
      priceAR: extras.breakfast.priceAR,
    },
    {
      icon: "\uD83C\uDF7D",
      label: dict.restaurantSection.menu,
      priceEUR: extras.menu.priceEUR,
      priceAR: extras.menu.priceAR,
    },
    {
      icon: "\uD83E\uDDFA",
      label: dict.restaurantSection.picnic,
      priceEUR: extras.picnic.priceEUR,
      priceAR: extras.picnic.priceAR,
    },
  ];

  return (
    <>
      {/* Hero */}
      <PageHero
        title={dict.restaurantSection.heroTitle}
        subtitle={dict.restaurantSection.heroSubtitle}
        image="/lachotelsahambavy/images/restaurant/restaurant-01.jpg"
      />

      {/* Philosophy strip */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyCards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 120}>
                <div className="text-center p-8 rounded-xl bg-cream border border-brown-deep/5 h-full">
                  <span className="text-4xl block mb-4">{card.icon}</span>
                  <h3 className="text-lg font-semibold text-text-dark mb-3">{card.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Main content: intro + specialties */}
      <section className="py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <ScrollReveal>
              <div className="rounded-xl overflow-hidden shadow-lg aspect-[4/3]">
                <img
                  src="/lachotelsahambavy/images/restaurant/restaurant-02.jpg"
                  alt={dict.restaurantSection.heroTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>

            {/* Text */}
            <ScrollReveal delay={150}>
              <div>
                <SectionHeader
                  label={dict.restaurantSection.label}
                  title={dict.restaurantSection.title}
                  subtitle={dict.restaurantSection.subtitle}
                  className="text-left mb-10"
                />

                <p className="text-text-muted leading-relaxed mb-8">
                  {dict.restaurantSection.p1}
                </p>

                {/* Signature dishes */}
                <h4 className="text-sm font-semibold text-text-dark uppercase tracking-wider mb-4">
                  {loc === "fr" ? "Nos signatures" : loc === "es" ? "Nuestras firmas" : "Our signatures"}
                </h4>
                <ul className="space-y-3 mb-8">
                  {dict.restaurantSection.specialties.map((dish: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-gold mt-0.5 flex-shrink-0">{"\u2022"}</span>
                      <span className="text-text-muted">{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Atmospheric photo strip */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/lachotelsahambavy/images/hero/hero-twilight.jpg)" }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </section>

      {/* Pricing section */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-4">
          <SectionHeader
            label={loc === "fr" ? "Tarifs" : loc === "es" ? "Tarifas" : "Pricing"}
            title={loc === "fr" ? "Nos formules" : loc === "es" ? "Nuestras formulas" : "Our options"}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingItems.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 100}>
                <div className="text-center bg-cream rounded-xl p-8 border border-brown-deep/5 h-full flex flex-col items-center justify-center">
                  <span className="text-3xl block mb-3">{item.icon}</span>
                  <h4 className="text-text-dark font-semibold mb-3">{item.label}</h4>
                  <div className="text-3xl font-bold text-gold mb-1">
                    {item.priceEUR}&euro;
                  </div>
                  <div className="text-sm text-text-muted">
                    {item.priceAR.toLocaleString("fr-FR")} AR
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Second atmospheric photo */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/lachotelsahambavy/images/hero/hero-lake-sunset.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative z-10 flex items-end justify-center h-full pb-12 px-4">
          <ScrollReveal>
            <p className="text-white text-xl font-[family-name:var(--font-sub)] text-center max-w-xl">
              {dict.philosophy.title} — {dict.philosophy.pillar1}
            </p>
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
