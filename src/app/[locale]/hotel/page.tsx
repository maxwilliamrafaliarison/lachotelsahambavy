import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";

const basePath = getBasePath();

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.hotel.heroTitle} — ${siteConfig.name}`,
    description: dict.hotel.heroSubtitle,
  };
}

const teamPhotos = [
  { src: "/images/team/team-01.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-02.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-03.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-04.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-05.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-06.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-chef.jpg", alt: "Notre chef cuisinier" },
  { src: "/images/team/team-07.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-08.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-09.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-10.jpg", alt: "Membre de l'équipe" },
  { src: "/images/team/team-staff.jpg", alt: "L'équipe du Lac Hôtel" },
];

export default async function HotelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "hotel"))]} />
      <PageHero
        title={dict.hotel.heroTitle}
        subtitle={dict.hotel.heroSubtitle}
        image={`${basePath}/images/hotel/hotel-facade.jpg`}
      />

      {/* History */}
      <section className="py-24 bg-white">
        <div className="max-w-[1100px] mx-auto px-4">
          <SectionHeader label={dict.hotel.historyLabel} title={dict.hotel.historyTitle} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-14 items-start">
            {/* Texte — colonne principale */}
            <ScrollReveal>
              <div className="space-y-6 text-text-muted leading-relaxed">
                <p>{dict.hotel.historyP1}</p>
                <p>{dict.hotel.historyP2}</p>
                {dict.hotel.historyP3 && <p>{dict.hotel.historyP3}</p>}
                {dict.hotel.historyP4 && (
                  <p className="font-medium text-brown-deep italic">{dict.hotel.historyP4}</p>
                )}
              </div>
            </ScrollReveal>

            {/* Diptyque — portraits Maggie & Sergi, discrets et élégants */}
            <ScrollReveal delay={150}>
              <figure className="space-y-5">
                {[
                  {
                    src: `${basePath}/images/founders/maggie-leong.jpg`,
                    name: "Maggie Leong",
                    alt:
                      loc === "fr"
                        ? "Maggie Leong, co-dirigeante du Lac Hôtel"
                        : loc === "es"
                        ? "Maggie Leong, codirectora del Lac Hôtel"
                        : "Maggie Leong, co-manager of Lac Hôtel",
                  },
                  {
                    src: `${basePath}/images/founders/sergi-formentin.jpg`,
                    name: "Sergi Formentin",
                    alt:
                      loc === "fr"
                        ? "Sergi Formentin, co-dirigeant du Lac Hôtel"
                        : loc === "es"
                        ? "Sergi Formentin, codirector del Lac Hôtel"
                        : "Sergi Formentin, co-manager of Lac Hôtel",
                  },
                ].map((p) => (
                  <div key={p.name} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-sm ring-1 ring-brown-deep/5">
                      <img
                        src={p.src}
                        alt={p.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      {/* Fine bordure dorée intérieure pour un touch "luxe" discret */}
                      <div
                        className="absolute inset-2 rounded-lg pointer-events-none"
                        style={{ border: "1px solid rgba(196, 150, 42, 0.18)" }}
                      />
                    </div>
                    <figcaption className="mt-3 text-center">
                      <span className="block text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-1">
                        &mdash;
                      </span>
                      <span className="text-sm font-[family-name:var(--font-sub)] italic text-brown-deep">
                        {p.name}
                      </span>
                    </figcaption>
                  </div>
                ))}
              </figure>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-cream">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader label={dict.hotel.philosophyLabel} title={dict.hotel.philosophyTitle} />
          <ScrollReveal>
            <div className="space-y-6 text-text-muted leading-relaxed">
              <p>{dict.hotel.philosophyP1}</p>
              <p>{dict.hotel.philosophyP2}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Eco-responsibility / RSE */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader label={dict.hotel.ecoLabel} title={dict.hotel.ecoTitle} />
          <div className="max-w-[800px] mx-auto">
            <ScrollReveal>
              <p className="text-text-muted leading-relaxed mb-10">{dict.hotel.ecoP1}</p>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 gap-4">
              {(dict.hotel.ecoItems as string[]).map((item, i) => (
                <ScrollReveal key={i} delay={i * 60}>
                  <div className="glass-card flex items-start gap-4 p-5">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700/10 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-text-muted leading-relaxed text-sm">{item}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Photo Grid */}
      <section className="py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.equipe.teamLabel}
            title={dict.equipe.teamTitle}
          />
          <ScrollReveal>
            <p className="text-center text-text-muted leading-relaxed max-w-2xl mx-auto mb-12">
              {dict.equipe.introP}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamPhotos.map((photo, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group">
                  <div
                    className="aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${basePath}${photo.src})` }}
                    role="img"
                    aria-label={photo.alt}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
