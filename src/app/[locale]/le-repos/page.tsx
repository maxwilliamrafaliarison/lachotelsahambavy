import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import LeReposSignupForm from "./LeReposSignupForm";

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
    alternates: {
      languages: {
        fr: `${basePath}/fr/le-repos`,
        en: `${basePath}/en/le-repos`,
        es: `${basePath}/es/le-repos`,
      },
    },
  };
}

export default async function LeReposPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      {/* Hero */}
      <PageHero
        title={dict.repos.heroTitle}
        subtitle={dict.repos.heroSubtitle}
        image={`${basePath}/images/hero/hero-twilight.jpg`}
      />

      {/* Teaser Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <ScrollReveal>
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-brown-deep/10 rounded-full mb-10">
              <span className="w-2 h-2 rounded-full bg-brown-deep animate-pulse" />
              <span className="text-brown-deep font-semibold text-sm tracking-wide uppercase">
                {dict.repos.comingSoon}
              </span>
            </div>

            <h2 className="mb-6">{dict.repos.teaserTitle}</h2>
            <p className="text-text-muted text-lg leading-relaxed font-[family-name:var(--font-sub)]">
              {dict.repos.teaserP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Signup Form + WhatsApp CTA */}
      <section className="py-24 bg-cream/50">
        <div className="max-w-[600px] mx-auto px-4">
          <SectionHeader
            label={dict.repos.signupTitle}
            title={dict.repos.signupP}
          />

          <ScrollReveal>
            <LeReposSignupForm dict={dict} />
          </ScrollReveal>

          {/* WhatsApp CTA */}
          <ScrollReveal delay={200}>
            <div className="mt-10 text-center">
              <p className="text-text-muted text-sm mb-4">{dict.repos.whatsappCta}</p>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  dict.whatsappMessage ?? "Bonjour, je suis intéressé(e) par Le Repos."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#1DA851] transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
