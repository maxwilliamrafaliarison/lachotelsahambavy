import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";
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

      {/* Introduction éditoriale */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-5 md:px-6">
          <SectionHeader
            label={dict.equipe.introLabel}
            title={dict.equipe.introTitle}
          />
          <ScrollReveal>
            <p className="text-text-muted text-lg leading-[1.8] text-center font-[family-name:var(--font-sub)]">
              {dict.equipe.introP}
            </p>
          </ScrollReveal>
          {/* Ornement éditorial doré discret */}
          <ScrollReveal delay={150}>
            <div className="flex items-center gap-3 mt-10 md:mt-12 max-w-md mx-auto">
              <span className="h-px flex-1 bg-gold/30" />
              <Icon name="hiring" size={18} weight="regular" className="text-gold" />
              <span className="h-px flex-1 bg-gold/30" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* RSE Engagement — liquid-glass premium */}
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
          <SectionHeader
            label={dict.equipe.rseLabel}
            title={dict.equipe.rseTitle}
          />
          <div className="max-w-[900px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {(dict.equipe.rseItems as string[]).map((item, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="repos-feature h-full p-5 md:p-6 flex items-start gap-4">
                    <div className="repos-feature__badge flex-shrink-0" style={{ width: "2.5rem", height: "2.5rem" }}>
                      <Icon name="hiring" size={18} weight="regular" />
                    </div>
                    <p className="text-text-body leading-relaxed text-sm pt-1 flex-1">
                      {item}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Circular Economy — texte éditorial centré */}
      <section className="py-14 md:py-24 bg-white">
        <div className="max-w-[800px] mx-auto px-5 md:px-6">
          <SectionHeader
            label={dict.equipe.economyLabel}
            title={dict.equipe.economyTitle}
          />
          <ScrollReveal>
            <p className="text-text-muted text-lg leading-[1.8] text-center font-[family-name:var(--font-sub)]">
              {dict.equipe.economyP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Grille photos équipe — chaque vignette avec .product-photo
          (bordure dorée intérieure + ombre douce + hover zoom subtil) */}
      <section className="py-14 md:py-24 bg-cream">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <SectionHeader
            label={dict.equipe.teamLabel}
            title={dict.equipe.teamTitle}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {teamPhotos.map((photo, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="product-photo aspect-square group">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-[0.8s] ease-out group-hover:scale-[1.06]"
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
