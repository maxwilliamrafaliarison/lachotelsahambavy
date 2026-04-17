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
    title: `${dict.equipe.heroTitle} — ${siteConfig.name}`,
    description: dict.equipe.heroSubtitle,
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

export default async function NotreEquipePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "notre-equipe"))]} />
      <PageHero
        title={dict.equipe.heroTitle}
        subtitle={dict.equipe.heroSubtitle}
        image={`${basePath}/images/team/team-staff.jpg`}
      />

      {/* Introduction */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader
            label={dict.equipe.introLabel}
            title={dict.equipe.introTitle}
          />
          <ScrollReveal>
            <p className="text-text-muted text-lg leading-relaxed text-center font-[family-name:var(--font-sub)]">
              {dict.equipe.introP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* RSE Engagement */}
      <section className="py-14 md:py-24 bg-cream/50">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.equipe.rseLabel}
            title={dict.equipe.rseTitle}
          />
          <div className="max-w-[800px] mx-auto">
            <div className="space-y-4">
              {(dict.equipe.rseItems as string[]).map((item, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="flex items-start gap-4 bg-white rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-700/10 flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-text-muted leading-relaxed">{item}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Circular Economy */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-4">
          <SectionHeader
            label={dict.equipe.economyLabel}
            title={dict.equipe.economyTitle}
          />
          <ScrollReveal>
            <p className="text-text-muted text-lg leading-relaxed text-center font-[family-name:var(--font-sub)]">
              {dict.equipe.economyP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Team Photo Grid */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-4">
          <SectionHeader
            label={dict.equipe.teamLabel}
            title={dict.equipe.teamTitle}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamPhotos.map((photo, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group">
                  <div
                    className="aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
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
