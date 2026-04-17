import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.loisirs.heroTitle} — ${siteConfig.name}`,
    description: dict.loisirs.heroSubtitle,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function ActivitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const circuits = [
    { data: dict.loisirs.discovery, icon: "nature" },
    { data: dict.loisirs.cultural, icon: "culture" },
    { data: dict.loisirs.leisure, icon: "boat" },
  ];

  return (
    <>
      <PageHero
        title={dict.loisirs.heroTitle}
        subtitle={dict.loisirs.heroSubtitle}
        image={`${basePath}/images/nature/lac-panorama.jpg`}
      />

      {/* Intro */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <SectionHeader label={dict.loisirs.introLabel} title={dict.loisirs.introTitle} />
          <ScrollReveal>
            <p className="text-text-muted text-lg leading-relaxed font-[family-name:var(--font-sub)]">
              {dict.loisirs.introP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Circuits Nature — grille 3 .repos-feature premium */}
      <section className="py-14 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #F8F5F0 0%, #FBFAF6 50%, #F8F5F0 100%)",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-green-tea/5 blur-3xl -z-10" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl -z-10" />

        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">
          <SectionHeader label={dict.loisirs.circuitsLabel} title={dict.loisirs.circuitsTitle} />
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {circuits.map((circuit, ci) => (
              <ScrollReveal key={ci} delay={ci * 150}>
                <div className="repos-feature h-full p-7 md:p-8 flex flex-col">
                  <div className="repos-feature__badge mb-5">
                    <Icon name={circuit.icon} size={26} weight="regular" />
                  </div>
                  <h3 className="text-xl mb-4 leading-tight">{(circuit.data as any).title}</h3>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {((circuit.data as any).items as string[]).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-text-muted text-sm leading-relaxed">
                        <span className="inline-block w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start gap-2 pt-4 border-t border-gold/15">
                    <Icon
                      name="arrow"
                      size={14}
                      weight="regular"
                      className="text-gold mt-0.5 flex-shrink-0"
                    />
                    <p className="text-sm font-medium text-gold italic leading-snug">
                      {(circuit.data as any).ideal}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pool — photo bordure dorée intérieure */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <ScrollReveal>
              <div className="product-photo aspect-[4/3]">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${basePath}/images/pool/pool-night.jpg)` }}
                  role="img"
                  aria-label="Piscine en ardoise à eau salée"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <span className="section-label">{dict.loisirs.poolLabel}</span>
              <h2 className="mt-2 mb-6 leading-[1.15]">{dict.loisirs.poolTitle}</h2>
              <p className="text-text-muted leading-[1.8]">{dict.loisirs.poolP}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Massage — photo bordure dorée intérieure, ordre inversé */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <ScrollReveal delay={200}>
              <span className="section-label">{dict.loisirs.massageLabel}</span>
              <h2 className="mt-2 mb-6 leading-[1.15]">{dict.loisirs.massageTitle}</h2>
              <p className="text-text-muted leading-[1.8]">{dict.loisirs.massageP}</p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="product-photo aspect-[4/3]">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${basePath}/images/nature/garden-path.jpg)` }}
                  role="img"
                  aria-label="Massage & bien-être"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Adventure Circuit — carte .room-price avec filet doré */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-5 md:px-6">
          <SectionHeader label={dict.loisirs.aventureLabel} title={dict.loisirs.aventureTitle} />
          <ScrollReveal>
            <p className="text-text-muted text-lg leading-relaxed text-center mb-10 font-[family-name:var(--font-sub)]">
              {dict.loisirs.aventureP}
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="room-price p-7 md:p-9">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-gold" />
                <span className="text-[0.7rem] font-semibold text-gold uppercase tracking-[0.28em]">
                  {locale === "fr" ? "Au programme" : locale === "en" ? "Programme" : "Programa"}
                </span>
              </div>
              <div className="space-y-4 mb-8">
                {(dict.loisirs.aventureProgram as string[]).map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brown-deep to-gold text-cream flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                      {i + 1}
                    </div>
                    <p className="text-text-body leading-relaxed pt-1 text-sm md:text-base">{step}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm pt-5 border-t border-gold/15">
                <p className="text-green-700 font-medium flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-700 flex-shrink-0" />
                  <span>{dict.loisirs.aventureIncludes}</span>
                </p>
                <p className="text-red-600/80 flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-600/70 flex-shrink-0" />
                  <span>{dict.loisirs.aventureExcludes}</span>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trekking Circuit - 2 Days — 2 cartes .repos-feature jour par jour */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[800px] mx-auto px-5 md:px-6">
          <SectionHeader label={dict.loisirs.trekkingLabel} title={dict.loisirs.trekkingTitle} />
          <ScrollReveal>
            <p className="text-text-muted text-lg leading-relaxed text-center mb-10 font-[family-name:var(--font-sub)]">
              {dict.loisirs.trekkingP}
            </p>
          </ScrollReveal>

          {/* Day 1 */}
          <ScrollReveal>
            <div className="repos-feature p-7 md:p-9 mb-5">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brown-deep to-gold text-cream flex items-center justify-center text-xs font-bold shadow-md">
                  1
                </span>
                <h3 className="text-lg md:text-xl text-brown-deep leading-tight">
                  {(dict.loisirs.trekkingDay1 as any).title}
                </h3>
              </div>
              <div className="space-y-3">
                {((dict.loisirs.trekkingDay1 as any).items as string[]).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-text-muted leading-relaxed text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Day 2 */}
          <ScrollReveal delay={100}>
            <div className="repos-feature p-7 md:p-9 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brown-deep to-gold text-cream flex items-center justify-center text-xs font-bold shadow-md">
                  2
                </span>
                <h3 className="text-lg md:text-xl text-brown-deep leading-tight">
                  {(dict.loisirs.trekkingDay2 as any).title}
                </h3>
              </div>
              <div className="space-y-3">
                {((dict.loisirs.trekkingDay2 as any).items as string[]).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-text-muted leading-relaxed text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="space-y-2 text-sm mb-6">
              <p className="text-green-700 font-medium flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-700 flex-shrink-0" />
                <span>{dict.loisirs.trekkingIncludes}</span>
              </p>
              <p className="text-red-600/80 flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-600/70 flex-shrink-0" />
                <span>{dict.loisirs.trekkingExcludes}</span>
              </p>
            </div>
            <div className="repos-feature p-4 md:p-5 flex items-start gap-3" style={{ background: "rgba(254, 243, 199, 0.85)", borderColor: "rgba(196, 150, 42, 0.25)" }}>
              <Icon
                name="backpack"
                size={20}
                weight="regular"
                className="text-amber-700 mt-0.5 shrink-0"
              />
              <p className="text-amber-800 text-sm leading-relaxed">{dict.loisirs.trekkingAdvice}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-24 bg-brown-deep text-white">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="mb-6" style={{ color: "#FFFFFF" }}>{dict.loisirs.cta}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact/`} className="btn btn--primary">
                {dict.loisirs.cta}
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
                WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
