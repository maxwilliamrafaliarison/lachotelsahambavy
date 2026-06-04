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
  const title =
    locale === "fr"
      ? "Mariages & Séminaires"
      : locale === "en"
        ? "Weddings & Seminars"
        : "Bodas y Seminarios";
  const description =
    locale === "fr"
      ? `${dict.wedding.subtitle} — ${dict.conference.title} jusqu'à ${dict.conference.capacity}.`
      : locale === "en"
        ? `${dict.wedding.subtitle} — ${dict.conference.title} for up to ${dict.conference.capacity}.`
        : `${dict.wedding.subtitle} — ${dict.conference.title} hasta ${dict.conference.capacity}.`;
  return {
    title: `${title} — ${siteConfig.name}`,
    description,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function MariagesSeminairesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const heroTitle =
    loc === "fr"
      ? "Mariages & Séminaires"
      : loc === "en"
        ? "Weddings & Seminars"
        : "Bodas y Seminarios";
  const heroSubtitle =
    loc === "fr"
      ? "Célébrer ou travailler — entre lac et jardin fleuri."
      : loc === "en"
        ? "Celebrate or work — between the lake and a flowering garden."
        : "Celebrar o trabajar — entre el lago y un jardín florido.";

  const equipmentIcons: Record<string, string> = {
    "Connexion Wi-Fi": "wifi",
    "Wi-Fi connection": "wifi",
    "Conexión Wi-Fi": "wifi",
    Micro: "info",
    Microphone: "info",
    Micrófono: "info",
    Rétroprojecteur: "tv",
    Projector: "tv",
    Proyector: "tv",
    "Tableau blanc": "clipboard",
    Whiteboard: "clipboard",
    Pizarra: "clipboard",
  };

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "mariages-seminaires"))]} />

      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        image={`${basePath}/images/hero/hero-lake-sunset.jpg`}
      />

      {/* ──── MARIAGES — intro éditoriale + photo asymétrique ──── */}
      <section id="mariages" className="py-14 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <ScrollReveal className="lg:col-span-6">
              <div className="product-photo aspect-[4/5] md:aspect-[4/3]">
                <img
                  src={`${basePath}/images/hero/hero-garden.jpg`}
                  alt={dict.wedding.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180} className="lg:col-span-6">
              <span className="section-label">
                {loc === "fr" ? "Mariages & Célébrations" : loc === "en" ? "Weddings & Celebrations" : "Bodas y Celebraciones"}
              </span>
              <h2 className="mt-2 mb-4 leading-[1.15]">{dict.wedding.title}</h2>
              <p className="text-gold font-[family-name:var(--font-sub)] italic text-lg mb-8">
                {dict.wedding.subtitle}
              </p>
              <p className="text-text-muted leading-[1.8] mb-5">{dict.wedding.p1}</p>
              <p className="text-text-muted leading-[1.8] mb-5">{dict.wedding.p2}</p>
              <p className="text-text-muted leading-[1.8] mb-8">{dict.wedding.p3}</p>

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />
                <span className="text-[0.7rem] tracking-[0.28em] uppercase text-gold font-medium">
                  {loc === "fr" ? "Sur devis personnalisé" : loc === "en" ? "Tailor-made quote" : "Presupuesto a medida"}
                </span>
                <span className="h-px flex-1 bg-gold/30" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── DIPTYQUE PHOTOS — atmosphère mariage ──── */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <ScrollReveal>
              <figure>
                <div className="repos-photo aspect-[4/3]">
                  <img
                    src={`${basePath}/images/hotel/hotel-gardens.jpg`}
                    alt={loc === "fr" ? "Cérémonie au jardin" : loc === "en" ? "Garden ceremony" : "Ceremonia en el jardín"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 text-center text-xs font-[family-name:var(--font-sub)] italic text-text-muted">
                  {loc === "fr"
                    ? "La cérémonie au jardin tropical"
                    : loc === "en"
                      ? "Ceremony in the tropical garden"
                      : "La ceremonia en el jardín tropical"}
                </figcaption>
              </figure>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <figure>
                <div className="repos-photo aspect-[4/3]">
                  <img
                    src={`${basePath}/images/restaurant/cocktail-bar.jpg`}
                    alt={loc === "fr" ? "Cocktail au bord du lac" : loc === "en" ? "Cocktail by the lake" : "Cóctel a orillas del lago"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 text-center text-xs font-[family-name:var(--font-sub)] italic text-text-muted">
                  {loc === "fr"
                    ? "Le cocktail au bord du lac"
                    : loc === "en"
                      ? "Cocktail reception by the lake"
                      : "El cóctel a orillas del lago"}
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── SÉMINAIRES & CONFÉRENCES ──── */}
      <section id="seminaires" className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #FBFAF6 50%, #FFFFFF 100%)",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-green-tea/5 blur-3xl -z-10" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <SectionHeader
            label={loc === "fr" ? "Séminaires & Conférences" : loc === "en" ? "Seminars & Conferences" : "Seminarios y Conferencias"}
            title={dict.conference.title}
            subtitle={dict.conference.capacity}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <ScrollReveal className="lg:col-span-6">
              <p className="text-text-muted leading-[1.8] mb-5">{dict.conference.p1}</p>
              <p className="text-text-muted leading-[1.8] mb-8">{dict.conference.p2}</p>

              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-gold" />
                <span className="text-[0.7rem] font-semibold text-gold uppercase tracking-[0.28em]">
                  {loc === "fr" ? "Équipements inclus" : loc === "en" ? "Included equipment" : "Equipos incluidos"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(dict.conference.equipment as string[]).map((eq: string) => (
                  <div
                    key={eq}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gold/15 bg-white/60 backdrop-blur-sm"
                  >
                    <Icon
                      name={equipmentIcons[eq] || "info"}
                      size={18}
                      weight="regular"
                      className="text-gold flex-shrink-0"
                    />
                    <span className="text-sm text-text-body font-medium">{eq}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180} className="lg:col-span-6">
              <div className="product-photo aspect-[4/3]">
                <img
                  src={`${basePath}/images/restaurant/restaurant-01.jpg`}
                  alt={dict.conference.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-5 text-center">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brown-deep/5 border border-brown-deep/10">
                  <Icon name="family" size={16} weight="regular" className="text-brown-deep" />
                  <span className="text-sm font-medium text-brown-deep">{dict.conference.capacity}</span>
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── CTA — carte glass sur photo ──── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url(${basePath}/images/hero/hero-lake-sunset.jpg)` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

        <div className="max-w-[600px] mx-auto px-5 md:px-6 relative text-center">
          <ScrollReveal>
            <h2 className="mb-6" style={{ color: "#FFFFFF" }}>
              {loc === "fr"
                ? "Parlons de votre projet"
                : loc === "en"
                  ? "Let's discuss your project"
                  : "Hablemos de su proyecto"}
            </h2>
            <p className="text-white/85 mb-8 leading-relaxed">
              {loc === "fr"
                ? "Mariage intimiste, séminaire d'entreprise, anniversaire d'exception — chaque événement est unique. Contactez-nous pour un devis sur mesure."
                : loc === "en"
                  ? "Intimate wedding, corporate seminar, milestone birthday — every event is unique. Contact us for a tailor-made quote."
                  : "Boda íntima, seminario de empresa, aniversario excepcional — cada evento es único. Contáctenos para un presupuesto a medida."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact/`} className="btn btn--primary">
                {dict.nav.book}
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  loc === "fr"
                    ? "Bonjour, je souhaite organiser un événement (mariage / séminaire) au Lac Hôtel."
                    : loc === "en"
                      ? "Hello, I would like to organise an event (wedding / seminar) at Lac Hôtel."
                      : "Hola, me gustaría organizar un evento (boda / seminario) en Lac Hôtel."
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
