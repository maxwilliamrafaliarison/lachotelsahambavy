import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { extras } from "@/data/rooms";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { restaurantSchema, breadcrumbSchema } from "@/lib/schema-org";
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
      icon: "leaf",
      title: dict.restaurantSection.philosophyLocal,
      desc: dict.restaurantSection.philosophyLocalDesc,
    },
    {
      icon: "fish",
      title: dict.restaurantSection.philosophyLac,
      desc: dict.restaurantSection.philosophyLacDesc,
    },
    {
      icon: "chef",
      title: dict.restaurantSection.philosophyMaison,
      desc: dict.restaurantSection.philosophyMaisonDesc,
    },
  ];

  const pricingItems = [
    {
      icon: "coffee",
      label: dict.restaurantSection.breakfast,
      priceAR: extras.breakfast.priceAR,
    },
    {
      icon: "dining",
      label: dict.restaurantSection.menu,
      priceAR: extras.menu.priceAR,
    },
    {
      icon: "picnic",
      label: dict.restaurantSection.picnic,
      priceAR: extras.picnic.priceAR,
    },
  ];

  return (
    <>
      <JsonLd
        schemas={[
          restaurantSchema(loc),
          breadcrumbSchema(buildBreadcrumb(loc, "restaurant")),
        ]}
      />
      {/* Hero */}
      <PageHero
        title={dict.restaurantSection.heroTitle}
        subtitle={dict.restaurantSection.heroSubtitle}
        image={`${basePath}/images/restaurant/restaurant-01.jpg`}
      />

      {/* Citation éditoriale — "La qualité commence à la source" (PDF v2026).
          Bandeau crème discret entre le hero et la philosophy strip. */}
      {dict.restaurantSection.qualityQuote && (
        <section className="py-10 md:py-14 bg-cream">
          <div className="max-w-[800px] mx-auto px-5 md:px-6 text-center">
            <ScrollReveal>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="h-px w-10 bg-gold/40" />
                <Icon name="leaf" size={16} weight="regular" className="text-gold" />
                <span className="h-px w-10 bg-gold/40" />
              </div>
              <p className="font-[family-name:var(--font-sub)] italic text-brown-deep text-xl md:text-2xl leading-tight">
                «&nbsp;{dict.restaurantSection.qualityQuote}&nbsp;»
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Philosophy strip — cartes liquid-glass premium avec Phosphor badge */}
      <section className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #FBFAF6 50%, #FFFFFF 100%)",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[360px] h-[360px] rounded-full bg-green-tea/5 blur-3xl -z-10" />
        <div className="absolute -bottom-32 -left-32 w-[360px] h-[360px] rounded-full bg-gold/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {philosophyCards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 120}>
                <div className="repos-feature h-full p-7 md:p-8 text-center">
                  <div className="repos-feature__badge mx-auto mb-5">
                    <Icon name={card.icon} size={26} weight="regular" />
                  </div>
                  <h3 className="text-lg md:text-xl text-text-dark mb-3 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Main content: intro + signatures — photo avec bordure dorée intérieure */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Image produit */}
            <ScrollReveal>
              <div className="product-photo aspect-[4/3]">
                <img
                  src={`${basePath}/images/restaurant/restaurant-02.jpg`}
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
                  className="text-left mb-8 md:mb-10"
                />

                <p className="text-text-muted leading-[1.8] mb-8">
                  {dict.restaurantSection.p1}
                </p>

                {/* Signature dishes — badge editorial en haut + filet doré */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-8 bg-gold" />
                  <span className="text-[0.7rem] font-semibold text-gold uppercase tracking-[0.28em]">
                    {loc === "fr" ? "Nos signatures" : loc === "es" ? "Nuestras firmas" : "Our signatures"}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {dict.restaurantSection.specialties.map((dish: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icon
                        name="fish"
                        size={16}
                        weight="regular"
                        className="text-gold mt-0.5 flex-shrink-0"
                      />
                      <span className="text-text-body leading-relaxed">{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Herbes du potager + Eau filtrée — preuves concrètes éco-responsables
          (PDF v2026). Layout 2 colonnes : à gauche grille d'herbes, à droite
          carte "Eau filtrée à volonté". */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Herbes du potager — grid 4×2 pills */}
            <ScrollReveal className="lg:col-span-7">
              <span className="section-label">
                {dict.restaurantSection.herbsLabel}
              </span>
              <h2 className="mt-2 mb-4 leading-[1.15]">
                {dict.restaurantSection.herbsTitle}
              </h2>
              <p className="text-text-muted leading-[1.8] mb-6">
                {dict.restaurantSection.herbsIntro}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(dict.restaurantSection.herbs as string[]).map((h: string) => (
                  <div
                    key={h}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border border-gold/15 bg-white/60 backdrop-blur-sm"
                  >
                    <Icon
                      name="leaf"
                      size={14}
                      weight="regular"
                      className="text-gold flex-shrink-0"
                    />
                    <span className="text-sm font-medium text-brown-deep tracking-tight">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Eau filtrée — carte glass */}
            <ScrollReveal delay={180} className="lg:col-span-5">
              <div className="repos-feature h-full p-7 md:p-8 text-center">
                <div className="repos-feature__badge mx-auto mb-5">
                  <Icon name="soap" size={28} weight="regular" />
                </div>
                <span className="block text-[0.6rem] uppercase tracking-[0.28em] text-gold font-medium mb-2">
                  {dict.restaurantSection.waterRefillLabel}
                </span>
                <h3 className="text-lg md:text-xl text-text-dark mb-4 leading-tight">
                  {dict.restaurantSection.waterRefillTitle}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {dict.restaurantSection.waterRefillP}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Atmospheric photo strip */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${basePath}/images/hero/hero-twilight.jpg)` }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </section>

      {/* Pricing section — liquid-glass cards avec filet doré en haut */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-5 md:px-6">
          <SectionHeader
            label={loc === "fr" ? "Tarifs" : loc === "es" ? "Tarifas" : "Pricing"}
            title={loc === "fr" ? "Nos formules" : loc === "es" ? "Nuestras formulas" : "Our options"}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {pricingItems.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 100}>
                <div className="room-price text-center p-7 md:p-8 h-full flex flex-col items-center justify-center">
                  <div className="repos-feature__badge mb-5">
                    <Icon name={item.icon} size={24} weight="regular" />
                  </div>
                  <h4 className="text-text-dark text-base font-semibold mb-5">{item.label}</h4>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-bold text-brown-deep font-[family-name:var(--font-heading)] tabular-nums leading-none">
                      {item.priceAR.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-sm text-text-muted font-[family-name:var(--font-sub)] italic">
                      AR
                    </span>
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
          style={{ backgroundImage: `url(${basePath}/images/hero/hero-lake-sunset.jpg)` }}
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
