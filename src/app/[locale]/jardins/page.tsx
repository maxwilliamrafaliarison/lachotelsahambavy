import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
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
    title: `${dict.jardins.heroTitle} — ${siteConfig.name}`,
    description: dict.jardins.heroSubtitle,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function JardinsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const collections = dict.jardins.collections as {
    icon: string;
    title: string;
    desc: string;
  }[];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "jardins"))]} />

      <PageHero
        title={dict.jardins.heroTitle}
        subtitle={dict.jardins.heroSubtitle}
        image={`${basePath}/images/hotel/hotel-gardens.jpg`}
      />

      {/* ──── INTRO — photo bordure dorée + texte ──── */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <ScrollReveal className="lg:col-span-6">
              <div className="repos-photo aspect-[4/5] md:aspect-[4/3]">
                <img
                  src={`${basePath}/images/hero/hero-garden.jpg`}
                  alt={dict.jardins.introTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180} className="lg:col-span-6">
              <span className="section-label">{dict.jardins.introLabel}</span>
              <h2 className="mt-2 mb-6 leading-[1.15]">{dict.jardins.introTitle}</h2>
              <p className="text-text-muted leading-[1.8] text-base md:text-lg">
                {dict.jardins.introP}
              </p>
              <div className="flex items-center gap-3 mt-8">
                <span className="h-px w-10 bg-gold" />
                <span className="text-[0.7rem] tracking-[0.28em] uppercase text-gold font-medium">
                  {loc === "fr"
                    ? "2 hectares · entièrement bio"
                    : loc === "en"
                      ? "2 hectares · fully organic"
                      : "2 hectáreas · totalmente bio"}
                </span>
                <span className="h-px flex-1 bg-gold/30" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── COLLECTIONS — grille 3×2 cartes glass ──── */}
      <section className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(180deg, #F8F5F0 0%, #FBFAF6 50%, #F8F5F0 100%)",
          }}
        />
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-green-tea/5 blur-3xl -z-10" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <SectionHeader
            label={dict.jardins.collectionsLabel}
            title={dict.jardins.collectionsTitle}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {collections.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 90}>
                <div className="repos-feature h-full p-7 md:p-8 flex flex-col">
                  <div className="repos-feature__badge mb-5">
                    <Icon name={c.icon} size={26} weight="regular" />
                  </div>
                  <h3 className="text-lg md:text-xl text-text-dark mb-3 leading-tight">
                    {c.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed flex-1">
                    {c.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── PHILOSOPHIE — bandeau atmosphérique ──── */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[900px] mx-auto px-5 md:px-6 text-center">
          <ScrollReveal>
            <span className="section-label">{dict.jardins.philosophyLabel}</span>
            <h2 className="mt-2 mb-6 leading-[1.15]">{dict.jardins.philosophyTitle}</h2>
            <p className="text-text-muted leading-[1.9] text-base md:text-lg max-w-2xl mx-auto">
              {dict.jardins.philosophyP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ──── DIPTYQUE PHOTOS ──── */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <ScrollReveal>
              <div className="repos-photo aspect-[4/3]">
                <img
                  src={`${basePath}/images/hotel/hotel-gardens.jpg`}
                  alt={loc === "fr" ? "Jardins du Lac Hôtel" : loc === "en" ? "Lac Hôtel gardens" : "Jardines del Lac Hôtel"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="repos-photo aspect-[4/3]">
                <img
                  src={`${basePath}/images/hero/hero-twilight.jpg`}
                  alt={loc === "fr" ? "Jardin au crépuscule" : loc === "en" ? "Garden at twilight" : "Jardín al atardecer"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url(${basePath}/images/hero/hero-garden.jpg)` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

        <div className="max-w-[600px] mx-auto px-5 md:px-6 relative text-center">
          <ScrollReveal>
            <h2 className="mb-6" style={{ color: "#FFFFFF" }}>
              {dict.jardins.ctaTitle}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact/`} className="btn btn--primary">
                {dict.jardins.cta}
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
