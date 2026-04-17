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
    title: `${dict.repos.heroTitle} — ${siteConfig.name}`,
    description: dict.repos.heroSubtitle,
  };
}

export default async function LeReposPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const features = dict.repos.features as { icon: string; title: string; desc: string }[];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "le-repos"))]} />
      <PageHero
        title={dict.repos.heroTitle}
        subtitle={dict.repos.heroSubtitle}
        image={`${basePath}/images/rooms/le-repos-exterior.jpg`}
      />

      {/* Intro éditoriale — image à gauche avec bordure dorée intérieure,
          texte à droite. Asymétrique pour casser la symétrie des PageHeros. */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <ScrollReveal className="lg:col-span-6">
              <div className="repos-photo aspect-[4/5] md:aspect-[4/3]">
                <img
                  src={`${basePath}/images/rooms/le-repos-exterior.jpg`}
                  alt={dict.repos.photoCaption1}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180} className="lg:col-span-6">
              <span className="section-label">{dict.repos.introLabel}</span>
              <h2 className="mt-2 mb-6 leading-[1.15]">{dict.repos.introTitle}</h2>
              <p className="text-text-muted leading-[1.8] text-base md:text-lg mb-6">
                {dict.repos.introP}
              </p>

              {/* Mini ornament dorée — signature éditoriale discrète */}
              <div className="flex items-center gap-3 mt-8">
                <span className="h-px w-10 bg-gold" />
                <span className="text-[0.7rem] tracking-[0.28em] uppercase text-gold font-medium">
                  {"4"} {loc === "fr" ? "maisons duplex" : loc === "es" ? "casas dúplex" : "duplex houses"}
                </span>
                <span className="h-px flex-1 bg-gold/30" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features — grille liquid-glass Apple avec Phosphor icons dans badges
          dégradés vert→or. Hover : lift + glow doré. */}
      <section className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #F8F5F0 0%, #FBFAF6 50%, #F8F5F0 100%)",
          }}
        />
        {/* Blobs flous en arrière-plan pour donner de la profondeur */}
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-green-tea/5 blur-3xl -z-10" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <SectionHeader
            label={loc === "fr" ? "Équipements" : loc === "es" ? "Equipamientos" : "Amenities"}
            title={loc === "fr" ? "Tout ce qu'il faut pour s'y sentir chez soi" : loc === "es" ? "Todo lo necesario para sentirse como en casa" : "Everything you need to feel at home"}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-[900px] mx-auto">
            {features.map((f, i) => (
              <ScrollReveal key={f.icon} delay={i * 90}>
                <div className="repos-feature h-full p-6 md:p-8 flex items-start gap-5">
                  <div className="repos-feature__badge flex-shrink-0">
                    <Icon name={f.icon} size={24} weight="regular" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl text-text-dark mb-2 leading-tight">
                      {f.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Diptyque photo — bordure dorée intérieure. */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <ScrollReveal>
              <figure>
                <div className="repos-photo aspect-[4/3]">
                  <img
                    src={`${basePath}/images/rooms/le-repos-exterior.jpg`}
                    alt={dict.repos.photoCaption1}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 text-center">
                  <span className="text-xs font-[family-name:var(--font-sub)] italic text-text-muted">
                    {dict.repos.photoCaption1}
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <figure>
                <div className="repos-photo aspect-[4/3]">
                  <img
                    src={`${basePath}/images/rooms/le-repos-nature.jpg`}
                    alt={dict.repos.photoCaption2}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 text-center">
                  <span className="text-xs font-[family-name:var(--font-sub)] italic text-text-muted">
                    {dict.repos.photoCaption2}
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Carte prix liquid-glass — flotte sur une photo hero. Apple iOS 26 feel :
          backdrop-blur 32, highlight interne, ombre généreuse. */}
      <section className="relative py-16 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url(${basePath}/images/rooms/le-repos-nature.jpg)` }}
        />
        {/* Overlay dégradé — sombre en bas pour contraste de la carte */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

        <div className="max-w-[560px] mx-auto px-5 md:px-6 relative">
          <ScrollReveal>
            <div className="repos-price p-8 md:p-12 text-center text-white">
              <span className="block text-[0.7rem] md:text-xs uppercase tracking-[0.3em] text-gold-light mb-4 md:mb-6">
                {dict.repos.priceLabel}
              </span>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-heading)] text-white tabular-nums leading-none">
                  {dict.repos.price}
                </span>
              </div>
              <span className="block text-sm md:text-base text-white/80 font-[family-name:var(--font-sub)] italic">
                {dict.repos.priceUnit}
              </span>

              <div className="h-px w-16 bg-gold-light/50 mx-auto my-6 md:my-8" />

              <p className="text-[0.7rem] md:text-xs text-white/60 mb-6 md:mb-8">
                {dict.repos.priceFootnote}
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href={`/${locale}/contact/`}
                  className="block w-full bg-gold text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-gold-light transition-colors shadow-lg"
                >
                  {dict.repos.cta}
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(dict.whatsappMessage ?? "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/25 text-sm font-medium rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {dict.repos.whatsappCta}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
