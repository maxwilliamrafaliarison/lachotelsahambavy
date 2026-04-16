import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { touristAttractionSchema, breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${locale === "fr" ? "Expériences" : locale === "en" ? "Experiences" : "Experiencias"} — ${siteConfig.name}`,
    description: dict.loisirs.heroSubtitle,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  // JSON-LD : 3 TouristAttractions clés (restaurant, plantation thé, train FCE)
  const attractionRestaurant = touristAttractionSchema({
    locale: loc,
    slug: "restaurant",
    name: dict.restaurantSection.title as string,
    description: dict.restaurantSection.subtitle as string,
    image: "/images/restaurant/restaurant-01.jpg",
  });
  const attractionPlantation = touristAttractionSchema({
    locale: loc,
    slug: "plantation-de-the",
    name: loc === "fr" ? "Plantation de thé de Sahambavy" : loc === "en" ? "Sahambavy Tea Plantation" : "Plantación de té de Sahambavy",
    description: loc === "fr"
      ? "La seule plantation de thé de Madagascar — visite guidée, cueillette et dégustation à 5 min de l'hôtel."
      : loc === "en"
        ? "The only tea plantation in Madagascar — guided tour, picking and tasting 5 min from the hotel."
        : "La única plantación de té de Madagascar — visita guiada, recolección y degustación a 5 min del hotel.",
    image: "/images/tea/plantation-drone-overhead.jpg",
  });
  const attractionTrain = touristAttractionSchema({
    locale: loc,
    slug: "train-fce",
    name: loc === "fr" ? "Train FCE Fianarantsoa–Manakara" : loc === "en" ? "FCE Train Fianarantsoa–Manakara" : "Tren FCE Fianarantsoa–Manakara",
    description: loc === "fr"
      ? "Ligne ferroviaire légendaire de 170 km reliant les hauts plateaux à la côte est. La gare de Sahambavy est à 2 min de l'hôtel."
      : loc === "en"
        ? "Legendary 170 km railway line connecting the highlands to the east coast. Sahambavy station is 2 min from the hotel."
        : "Línea ferroviaria legendaria de 170 km que une las tierras altas con la costa este. La estación de Sahambavy está a 2 min del hotel.",
    image: "/images/train/train-fce.jpg",
  });

  return (
    <>
      <JsonLd
        schemas={[
          attractionRestaurant,
          attractionPlantation,
          attractionTrain,
          breadcrumbSchema(buildBreadcrumb(loc, "experiences")),
        ]}
      />
      <PageHero
        title={locale === "fr" ? "Expériences" : locale === "en" ? "Experiences" : "Experiencias"}
        subtitle={locale === "fr" ? "Gastronomie, nature et découverte" : locale === "en" ? "Gastronomy, nature and discovery" : "Gastronomía, naturaleza y descubrimiento"}
        image={`${basePath}/images/hero/hero-sunset.jpg`}
      />

      {/* ──── RESTAURANT ──── */}
      <section id="restaurant" className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={`${basePath}/images/restaurant/restaurant-01.jpg`}
                  alt="Restaurant panoramique"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <span className="section-label">{dict.restaurantSection.label}</span>
              <h2 className="mt-2 mb-6">{dict.restaurantSection.title}</h2>
              <p className="text-text-muted leading-relaxed mb-4">{dict.restaurantSection.p1}</p>
              {dict.restaurantSection.p2 && (
                <p className="text-text-muted leading-relaxed mb-6">{dict.restaurantSection.p2}</p>
              )}
              <div className="space-y-2 mb-8">
                {(dict.restaurantSection.specialties as string[]).map((spec: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-text-body text-sm">
                    <span className="text-gold">✦</span>
                    {spec}
                  </div>
                ))}
              </div>
              <div className="flex gap-6">
                <div className="glass-card px-6 py-4 text-center">
                  <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">{dict.restaurantSection.breakfast}</span>
                  <span className="block text-lg font-bold text-gold">{dict.restaurantSection.breakfastPrice}</span>
                </div>
                <div className="glass-card px-6 py-4 text-center">
                  <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">{dict.restaurantSection.menu}</span>
                  <span className="block text-lg font-bold text-gold">{dict.restaurantSection.menuPrice}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── PLANTATION DE THÉ ──── */}
      <section id="plantation" className="py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal delay={200} className="md:order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={`${basePath}/images/tea/plantation-drone-overhead.jpg`}
                  alt="Vue aérienne de la plantation de thé Sahambavy"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal className="md:order-1">
              <span className="section-label">{dict.plantation.historyLabel}</span>
              <h2 className="mt-2 mb-6">{dict.plantation.heroTitle}</h2>
              <p className="text-text-muted leading-relaxed mb-4">{dict.plantation.historyIntro}</p>
              <p className="text-text-muted leading-relaxed mb-8">{dict.plantation.historyMadagascar}</p>
              <Link href={`/${locale}/plantation-de-the/`} className="btn btn--outline">
                {dict.destinations.plantation.cta}
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── PISCINE & MASSAGE ──── */}
      <section id="wellness" className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.loisirs.massageLabel}
            title={dict.loisirs.poolTitle}
          />
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <ScrollReveal>
              <div className="glass-card overflow-hidden">
                <img
                  src={`${basePath}/images/pool/pool-night.jpg`}
                  alt="Piscine en ardoise à eau salée"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-lg mb-3">{dict.loisirs.poolTitle}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{dict.loisirs.poolP}</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="glass-card overflow-hidden">
                <img
                  src={`${basePath}/images/nature/garden-path.jpg`}
                  alt="Massage & bien-être"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-lg mb-3">{dict.loisirs.massageTitle}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{dict.loisirs.massageP}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── CIRCUITS & ACTIVITÉS ──── */}
      <section id="activites" className="py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.loisirs.circuitsLabel}
            title={dict.loisirs.circuitsTitle}
          />
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { data: dict.loisirs.discovery, icon: "🌿" },
              { data: dict.loisirs.cultural, icon: "🎭" },
              { data: dict.loisirs.leisure, icon: "🛶" },
            ].map((circuit, ci) => (
              <ScrollReveal key={ci} delay={ci * 150}>
                <div className="glass-card p-8 h-full">
                  <span className="text-3xl mb-4 block">{circuit.icon}</span>
                  <h3 className="text-lg mb-4">{(circuit.data as any).title}</h3>
                  <ul className="space-y-2 mb-4">
                    {((circuit.data as any).items as string[]).map((item: string, i: number) => (
                      <li key={i} className="text-text-muted text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm font-medium text-gold italic">{(circuit.data as any).ideal}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center">
            <Link href={`/${locale}/activites/`} className="btn btn--outline">
              {dict.loisirs.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ──── BOUTIQUE ──── */}
      <section id="boutique" className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.plantation.shopLabel}
            title={dict.plantation.shopTitle}
          />
          <ScrollReveal>
            <p className="text-center text-text-muted leading-relaxed max-w-2xl mx-auto mb-12">
              {dict.plantation.shopIntro}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {(dict.plantation.shopItems as { name: string; desc: string }[]).map((item: any, i: number) => (
              <ScrollReveal key={item.name} delay={i * 80}>
                <div className="glass-card p-5 text-center h-full">
                  <span className="text-2xl mb-3 block">🍃</span>
                  <h4 className="text-sm font-semibold mb-1">{item.name}</h4>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${basePath}/images/hero/hero-lake.jpg)` }} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 max-w-[600px] mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="mb-6" style={{ color: "#FFFFFF" }}>
              {locale === "fr" ? "Prêt à vivre l'expérience ?" : locale === "en" ? "Ready for the experience?" : "¿Listo para la experiencia?"}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact/`} className="btn btn--primary">
                {dict.nav.book}
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(dict.whatsappMessage ?? "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--glass"
              >
                WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
