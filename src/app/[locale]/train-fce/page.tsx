import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, touristAttractionSchema } from "@/lib/schema-org";
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
    title: `${dict.train.heroTitle} — ${siteConfig.name}`,
    description: dict.train.heroSubtitle,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function TrainFCEPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const attractionTrain = touristAttractionSchema({
    locale: loc,
    slug: "train-fce",
    name: dict.train.heroTitle as string,
    description: dict.train.heroSubtitle as string,
    image: "/images/train/train-hotel.jpg",
  });

  // Mapping options train → icônes
  const optionIcons = ["train", "boat", "house"];

  return (
    <>
      <JsonLd
        schemas={[attractionTrain, breadcrumbSchema(buildBreadcrumb(loc, "train-fce"))]}
      />

      <PageHero
        title={dict.train.heroTitle}
        subtitle={dict.train.heroSubtitle}
        image={`${basePath}/images/train/train-hotel.jpg`}
      />

      {/* ──── INTRO ──── */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <ScrollReveal className="lg:col-span-6">
              <span className="section-label">{dict.train.introLabel}</span>
              <h2 className="mt-2 mb-6 leading-[1.15]">{dict.train.introTitle}</h2>
              <p className="text-text-muted leading-[1.8] mb-5">{dict.train.introP1}</p>
              <p className="text-text-muted leading-[1.8] mb-6">{dict.train.introP2}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="h-px w-10 bg-gold" />
                <span className="text-[0.7rem] tracking-[0.28em] uppercase text-gold font-medium">
                  {loc === "fr"
                    ? "Gare à 2 min de l'hôtel"
                    : loc === "en"
                      ? "Station 2 min from the hotel"
                      : "Estación a 2 min del hotel"}
                </span>
                <span className="h-px flex-1 bg-gold/30" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180} className="lg:col-span-6">
              <div className="product-photo aspect-[4/3]">
                <img
                  src={`${basePath}/images/train/train-hotel.jpg`}
                  alt={dict.train.heroTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── 3 OPTIONS — Micheline / Draisine / Train classique ──── */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <SectionHeader
            label={dict.train.optionsLabel}
            title={dict.train.optionsTitle}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {(dict.train.options as { name: string; desc: string }[]).map(
              (opt: any, i: number) => (
                <ScrollReveal key={opt.name} delay={i * 120}>
                  <div className="repos-feature h-full p-7 md:p-8">
                    <div className="repos-feature__badge mb-5">
                      <Icon name={optionIcons[i] || "train"} size={26} weight="regular" />
                    </div>
                    <h3 className="text-lg md:text-xl text-text-dark mb-3 leading-tight">
                      {opt.name}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">{opt.desc}</p>
                  </div>
                </ScrollReveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ──── DRAISINE PRIVATIVE — section signature ──── */}
      <section id="draisine" className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #FBFAF6 50%, #FFFFFF 100%)",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-green-tea/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <ScrollReveal className="lg:col-span-6">
              <div className="product-photo aspect-[4/3]">
                <img
                  src={`${basePath}/images/train/draisine.jpg`}
                  alt={dict.train.draisineTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180} className="lg:col-span-6">
              <span className="section-label">{dict.train.draisineLabel}</span>
              <h2 className="mt-2 mb-6 leading-[1.15]">{dict.train.draisineTitle}</h2>
              <p className="text-text-muted leading-[1.8] mb-5">{dict.train.draisineP}</p>
              <p className="text-text-muted leading-[1.8] italic mb-8">
                {dict.train.draisineProject}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-gold" />
                <span className="text-[0.7rem] font-semibold text-gold uppercase tracking-[0.28em]">
                  {loc === "fr"
                    ? "Itinéraires proposés"
                    : loc === "en"
                      ? "Suggested routes"
                      : "Itinerarios propuestos"}
                </span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {(dict.train.draisineRoutes as string[]).map((route: string) => (
                  <li
                    key={route}
                    className="flex items-start gap-3 text-text-body text-sm"
                  >
                    <Icon
                      name="arrow"
                      size={14}
                      weight="regular"
                      className="text-gold mt-1 flex-shrink-0"
                    />
                    <span>{route}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs text-text-muted leading-relaxed">
                {dict.train.draisineContact}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── INFOS PRATIQUES — grille 6 cellules ──── */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1100px] mx-auto px-5 md:px-6">
          <SectionHeader label={dict.train.infoLabel} title={dict.train.infoTitle} />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { icon: "location", label: loc === "fr" ? "Trajet" : loc === "en" ? "Route" : "Trayecto", value: dict.train.infoItems.route },
              { icon: "ruler", label: loc === "fr" ? "Distance" : loc === "en" ? "Distance" : "Distancia", value: dict.train.infoItems.distance },
              { icon: "clock", label: loc === "fr" ? "Durée" : loc === "en" ? "Duration" : "Duración", value: dict.train.infoItems.duration },
              { icon: "mountain", label: loc === "fr" ? "Altitude" : loc === "en" ? "Altitude" : "Altitud", value: dict.train.infoItems.altitude },
              { icon: "train", label: loc === "fr" ? "Gare" : loc === "en" ? "Station" : "Estación", value: dict.train.infoItems.station },
              { icon: "info", label: loc === "fr" ? "Réservation" : loc === "en" ? "Booking" : "Reserva", value: dict.train.infoItems.booking },
            ].map((it, i) => (
              <ScrollReveal key={it.label} delay={i * 70}>
                <div className="repos-feature h-full p-5 md:p-6 flex flex-col items-center text-center">
                  <div className="repos-feature__badge mb-3" style={{ width: "2.5rem", height: "2.5rem" }}>
                    <Icon name={it.icon} size={18} weight="regular" />
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.22em] text-gold font-medium mb-1.5">
                    {it.label}
                  </span>
                  <span className="text-sm font-semibold text-brown-deep leading-tight">
                    {it.value}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url(${basePath}/images/hero/hero-drone-sunrise.jpg)` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

        <div className="max-w-[600px] mx-auto px-5 md:px-6 relative text-center">
          <ScrollReveal>
            <h2 className="mb-4" style={{ color: "#FFFFFF" }}>
              {dict.train.ctaTitle}
            </h2>
            <p className="text-white/85 mb-8 leading-relaxed">{dict.train.ctaP}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact/`} className="btn btn--primary">
                {dict.train.cta}
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  loc === "fr"
                    ? "Bonjour, je souhaite réserver le train FCE / une draisine privée depuis le Lac Hôtel."
                    : loc === "en"
                      ? "Hello, I would like to book the FCE train / a private draisine from Lac Hôtel."
                      : "Hola, me gustaría reservar el tren FCE / una dresina privada desde Lac Hôtel."
                )}`}
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
