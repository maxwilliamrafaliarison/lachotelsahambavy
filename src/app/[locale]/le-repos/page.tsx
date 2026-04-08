import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import Link from "next/link";

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

  return (
    <>
      <PageHero
        title={dict.repos.heroTitle}
        subtitle={dict.repos.heroSubtitle}
        image={`${basePath}/images/rooms/le-repos-exterior.jpg`}
      />

      {/* Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader
            label={dict.repos.introLabel}
            title={dict.repos.introTitle}
          />
          <ScrollReveal>
            <p className="text-text-muted text-lg leading-relaxed text-center mb-12 font-[family-name:var(--font-sub)]">
              {dict.repos.introP}
            </p>
          </ScrollReveal>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {(dict.repos.features as string[]).map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex items-start gap-4 bg-cream/60 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brown-deep/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brown-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-text-body leading-relaxed pt-1">{feature}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${basePath}/images/rooms/le-repos-exterior.jpg)` }}
                  role="img"
                  aria-label="Le Repos — Vue extérieure"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${basePath}/images/rooms/le-repos-nature.jpg)` }}
                  role="img"
                  aria-label="Le Repos — Nature environnante"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Price & CTA */}
      <section className="py-24 bg-brown-deep text-white">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <ScrollReveal>
            <span className="section-label !text-cream mb-4">{dict.repos.priceLabel}</span>
            <p className="text-4xl font-bold font-[family-name:var(--font-heading)] mb-8">{dict.repos.price}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact/`} className="btn btn--primary">
                {dict.repos.cta}
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(dict.whatsappMessage ?? "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1DA851] transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {dict.repos.whatsappCta}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
