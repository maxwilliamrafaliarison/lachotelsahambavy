import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { pageAlternates } from "@/lib/seo/alternates";
import { alt, type TexteAlternatif } from "@/lib/alt";

const basePath = getBasePath();

/* ── Textes FR par défaut, remplacés par le dictionnaire dès fusion des
      deltas (dict-deltas/equipe-galerie.json). Garantit un rendu complet
      même avant la fusion. ── */
const PERSONNEL_FR = {
  label: "Notre personnel",
  title: "Des jeunes du village, accompagnés au quotidien",
  p1: "Notre équipe est majoritairement composée de jeunes issus du village de Sahambavy ou des villages environnants. Accompagnés et formés au quotidien, ils développent leurs compétences et s'épanouissent professionnellement au sein de l'hôtel.",
  p2: "Cette démarche responsable et solidaire, qui privilégie l'emploi local et le partage des savoir-faire, est au cœur de l'identité du Lac Hôtel.",
  welcomeLabel: "L'accueil",
  welcomeTitle: "Un accueil chaleureux et respectueux",
  welcomeP1: "Le français n'est pas la langue principale de nos équipes, mais elles comprennent vos besoins et mettent un point d'honneur à y répondre avec attention.",
  welcomeP2: "Vous serez reçus avec la chaleur et le respect qui font la réputation de l'hospitalité betsileo.",
  welcomeAlt: "Un membre de l'équipe du Lac Hôtel accueille les voyageurs",
  economyAlt: "L'équipe du Lac Hôtel dans les jardins de l'hôtel",
  cta: "Nous écrire",
  heroAlt: "L'équipe du Lac Hôtel Sahambavy réunie devant l'hôtel",
};

const RSE_ICONS = [
  "hiring",
  "shortSupply",
  "people",
  "bees",
  "soap",
  "flower",
  "zeroWaste",
  "leaf",
];

/* Photos d'ambiance : les dix portraits anonymes portent une alternative
   vide. Ils n'ajoutent rien au titre de la section, et dix fois la même
   phrase générique ne ferait qu'encombrer le lecteur d'écran. Seules les
   deux vues qui disent quelque chose de précis gardent leur alternative,
   trilingue depuis le 14/08/2026. */
const teamPhotos: { src: string; alt: "" | TexteAlternatif }[] = [
  { src: "/images/team/team-01.jpg", alt: "" },
  { src: "/images/team/team-02.jpg", alt: "" },
  { src: "/images/team/team-03.jpg", alt: "" },
  { src: "/images/team/team-04.jpg", alt: "" },
  { src: "/images/team/team-05.jpg", alt: "" },
  { src: "/images/team/team-06.jpg", alt: "" },
  { src: "/images/team/team-chef.jpg", alt: { fr: "Notre chef cuisinier", en: "Our head chef", es: "Nuestro chef" } },
  { src: "/images/team/team-07.jpg", alt: "" },
  { src: "/images/team/team-08.jpg", alt: "" },
  { src: "/images/team/team-09.jpg", alt: "" },
  { src: "/images/team/team-10.jpg", alt: "" },
  { src: "/images/team/team-craft.jpg", alt: { fr: "Le savoir-faire artisanal de l'équipe", en: "The team's craftsmanship", es: "La artesanía del equipo" } },
];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.equipe.heroTitle,
    description: dict.equipe.heroSubtitle,
    alternates: pageAlternates(locale as Locale, "notre-equipe"),
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function NotreEquipePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const eq = dict.equipe as any;
  const personnel: typeof PERSONNEL_FR = { ...PERSONNEL_FR, ...(eq.personnel ?? {}) };
  const contactHref = `/${loc}/contact/`;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "notre-equipe"))]} />

      <PanoramaHero
        image={`${basePath}/images/team/team-staff.jpg`}
        imageAlt={personnel.heroAlt}
        label={dict.equipe.introLabel}
        title={dict.equipe.heroTitle}
        kicker={dict.equipe.heroSubtitle}
      />

      {/* ──── Notre personnel : jeunes du village, formation, solidarité ──── */}
      <section id="personnel" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{personnel.label}</span>
            <h2 className="mb-6" style={{ textWrap: "balance" }}>
              {personnel.title}
            </h2>
            <div className="ge-measure space-y-4 text-[15px] leading-relaxed text-body md:text-base">
              <p>{personnel.p1}</p>
              <p>{personnel.p2}</p>
            </div>
          </ScrollReveal>

          <div className="mt-12 md:mt-16">
            <EditorialSplit
              image={`${basePath}/images/team/team-welcome.jpg`}
              imageAlt={personnel.welcomeAlt}
              label={personnel.welcomeLabel}
              title={personnel.welcomeTitle}
            >
              <p>{personnel.welcomeP1}</p>
              <p>{personnel.welcomeP2}</p>
            </EditorialSplit>
          </div>
        </div>
      </section>

      {/* ──── Engagement RSE en grille hairline ──── */}
      <section id="rse" className="scroll-mt-24 border-y border-hairline bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.equipe.rseLabel}</span>
            <h2 className="mb-6" style={{ textWrap: "balance" }}>
              {dict.equipe.rseTitle}
            </h2>
            <p className="ge-measure mb-10 text-[15px] leading-relaxed text-body md:mb-12 md:text-base">
              {dict.equipe.introP}
            </p>
          </ScrollReveal>

          <div className="grid gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline sm:grid-cols-2">
            {(dict.equipe.rseItems as string[]).map((item, i) => (
              <ScrollReveal key={i} delay={i * 60} className="h-full">
                <div className="flex h-full items-start gap-4 bg-white p-6 md:p-7">
                  <span className="mt-0.5 flex-shrink-0 text-terracotta">
                    <Icon name={RSE_ICONS[i % RSE_ICONS.length]} size={22} weight="regular" />
                  </span>
                  <p className="text-sm leading-relaxed text-body">{item}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Économie circulaire ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/team/team-garden.jpg`}
            imageAlt={personnel.economyAlt}
            label={dict.equipe.economyLabel}
            title={dict.equipe.economyTitle}
            cta={{ href: contactHref, label: personnel.cta }}
            reverse
          >
            <p>{dict.equipe.economyP}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* ──── Grille portraits hairline ──── */}
      <section id="visages" className="scroll-mt-24 border-t border-hairline py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.equipe.teamLabel}</span>
            <h2 className="mb-10 md:mb-12" style={{ textWrap: "balance" }}>
              {dict.equipe.teamTitle}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline md:grid-cols-3 lg:grid-cols-4">
            {teamPhotos.map((photo, i) => (
              <ScrollReveal key={photo.src} delay={i * 50} className="h-full">
                <figure className="group h-full overflow-hidden bg-white">
                  <img
                    src={`${basePath}${photo.src}`}
                    alt={photo.alt === "" ? "" : alt(photo.alt, loc)}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
