import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";

const basePath = getBasePath();

/* ── Textes FR par défaut — remplacés par le dictionnaire dès fusion des
      deltas (dict-deltas/jardins.json). Garantit un rendu complet même
      avant la fusion. ── */
const EDEN_FR = {
  label: "Jardin d'Éden",
  title: "Toute la richesse végétale de Madagascar",
  p1: "Fleurs aux couleurs éclatantes, arbres du voyageur, orchidées, cactus et bonsaïs : au fil des allées, les jardins du Lac Hôtel rassemblent toute la richesse végétale de Madagascar, en un véritable jardin d'Éden au bord du lac.",
  p2: "Pensé et entretenu dans le respect de l'environnement, le jardin invite à la sérénité. Chaque promenade devient une immersion sensorielle au cœur d'une biodiversité préservée — parfums, couleurs, chants d'oiseaux.",
  heroAlt: "Les jardins fleuris du Lac Hôtel au bord du lac de Sahambavy",
  orchidsLabel: "La collection phare",
  orchidsTitle: "Les orchidées à l'honneur",
  orchidsP1: "Stars du jardin, les orchidées déclinent ici leurs variétés, leurs formes et leurs couleurs : des espèces malgaches délicates que nos jardiniers cultivent avec patience sous les serres ombragées.",
  orchidsP2: "Selon la saison, une floraison différente vous surprend à chaque séjour.",
  orchidsAlt: "Orchidée tigrée en fleur dans les jardins du Lac Hôtel",
  flowersLabel: "Au fil des massifs",
  flowersTitle: "Couleurs du jardin",
  flowers: [
    { caption: "Zinnia et butineuse", alt: "Zinnia orange visité par une abeille dans le jardin" },
    { caption: "Gaillarde", alt: "Gaillarde rouge et jaune dans les massifs du jardin" },
    { caption: "Bougainvillier", alt: "Bougainvillier violet en fleur dans le jardin" },
  ],
  philosophyAlt: "Statue de chérubin parmi les fougères du jardin",
};

const VILLAGE_FR = {
  label: "Au-delà des jardins",
  title: "Le village de Sahambavy",
  intro:
    "À quelques pas de l'hôtel, le village de Sahambavy vit au rythme paisible des hautes terres betsileo. Rizières en terrasses, maisons de terre rouge, sourires des habitants : une escale authentique, loin des sentiers battus.",
  womenLabel: "L'origine du nom",
  womenTitle: "« Le champ des femmes »",
  womenP1: "En malgache, Sahambavy signifie « le champ des femmes » : la tradition raconte que ces terres fertiles étaient cultivées par les femmes du village, qui leur ont laissé leur nom.",
  womenP2: "Aujourd'hui encore, la vie betsileo se découvre ici simplement — les gestes du quotidien, les greniers à riz, les zébus qui rentrent au village à la tombée du jour.",
  womenAlt: "Femme betsileo devant une maison traditionnelle de Sahambavy",
  riceLabel: "Artisans & rizières",
  riceTitle: "Rizières en terrasses et savoir-faire",
  riceP1: "Autour du lac, les rizières dessinent un patchwork de verts qui change avec les saisons. Dans le village, les artisans perpétuent des savoir-faire transmis de génération en génération.",
  riceP2: "Nos équipes organisent volontiers une promenade accompagnée à la rencontre des habitants — en toute simplicité et dans le respect de leurs traditions.",
  riceAlt: "Vue aérienne des rizières en terrasses de Sahambavy",
  riceCta: "Organiser une promenade au village",
  moments: [
    { caption: "Portraits", alt: "Portrait d'un homme betsileo souriant du village de Sahambavy" },
    { caption: "Vie du village", alt: "Scène de village avec zébus sous un grand arbre à Sahambavy" },
    { caption: "Maisons betsileo", alt: "Maison betsileo traditionnelle avec des enfants aux fenêtres" },
  ],
};

const FLOWER_IMAGES = [
  "zinnia-orange-abeille-jardin.jpg",
  "gaillarde-rouge-jaune-jardin.jpg",
  "bougainvillier-violet-jardin.jpg",
];

const MOMENT_IMAGES = [
  "portrait-homme-betsileo-sourire.jpg",
  "scene-village-zebus-grand-arbre.jpg",
  "maison-betsileo-enfants-fenetres.jpg",
];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: `${dict.jardins.heroTitle} — ${siteConfig.name}`,
    description: dict.jardins.heroSubtitle,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function JardinsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  const jd = dict.jardins as any;
  const eden: typeof EDEN_FR = { ...EDEN_FR, ...(jd.eden ?? {}) };
  const village: typeof VILLAGE_FR = { ...VILLAGE_FR, ...(jd.village ?? {}) };
  const heroLabel: string = jd.heroLabel ?? "Jardins & village";

  const collections = jd.collections as {
    icon: string;
    title: string;
    desc: string;
  }[];

  const contactHref = `/${loc}/contact/`;

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "jardins"))]} />

      <PanoramaHero
        image={`${basePath}/images/gallery/gallery-gardens.jpg`}
        imageAlt={eden.heroAlt}
        label={heroLabel}
        title={dict.jardins.heroTitle}
        kicker={dict.jardins.heroSubtitle}
      />

      {/* ──── #jardins-eden — richesse végétale ──── */}
      <section id="jardins-eden" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{eden.label}</span>
            <h2 className="mb-6" style={{ textWrap: "balance" }}>
              {eden.title}
            </h2>
            <div className="ge-measure space-y-4 text-[15px] leading-relaxed text-body md:text-base">
              <p>{eden.p1}</p>
              <p>{eden.p2}</p>
            </div>
          </ScrollReveal>

          <div className="mt-12 md:mt-16">
            <EditorialSplit
              image={`${basePath}/images/jardins/orchidee-tigree-jardin-hotel.jpg`}
              imageAlt={eden.orchidsAlt}
              label={eden.orchidsLabel}
              title={eden.orchidsTitle}
            >
              <p>{eden.orchidsP1}</p>
              <p>{eden.orchidsP2}</p>
            </EditorialSplit>
          </div>
        </div>
      </section>

      {/* ──── Collections botaniques — grille hairline ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{dict.jardins.collectionsLabel}</span>
            <h2 className="mb-10 md:mb-12" style={{ textWrap: "balance" }}>
              {dict.jardins.collectionsTitle}
            </h2>
          </ScrollReveal>

          <div className="grid gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col bg-white p-7 md:p-8">
                  <span className="mb-4 text-terracotta">
                    <Icon name={c.icon} size={26} weight="regular" />
                  </span>
                  <h3 className="mb-2 text-lg md:text-xl">{c.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-body">{c.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Grille photos fleurs — 3 colonnes hairline ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{eden.flowersLabel}</span>
            <h2 className="mb-10 md:mb-12" style={{ textWrap: "balance" }}>
              {eden.flowersTitle}
            </h2>
          </ScrollReveal>

          <div className="grid gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline sm:grid-cols-3">
            {eden.flowers.map((f, i) => (
              <ScrollReveal key={f.caption} delay={i * 100} className="h-full">
                <figure className="flex h-full flex-col bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${basePath}/images/jardins/${FLOWER_IMAGES[i]}`}
                    alt={f.alt}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <figcaption className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {f.caption}
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>

          {/* Démarche — jardin pour tous */}
          <div className="mt-12 md:mt-16">
            <EditorialSplit
              image={`${basePath}/images/jardins/pergola-pots-plantes-jardin.jpg`}
              imageAlt={eden.philosophyAlt}
              label={dict.jardins.philosophyLabel}
              title={dict.jardins.philosophyTitle}
              reverse
            >
              <p>{dict.jardins.philosophyP}</p>
            </EditorialSplit>
          </div>
        </div>
      </section>

      {/* ──── #village — Sahambavy, « le champ des femmes » ──── */}
      <section id="village" className="scroll-mt-24 border-y border-hairline bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{village.label}</span>
            <h2 className="mb-6" style={{ textWrap: "balance" }}>
              {village.title}
            </h2>
            <p className="ge-measure text-[15px] leading-relaxed text-body md:text-base">
              {village.intro}
            </p>
          </ScrollReveal>

          <div className="mt-12 flex flex-col gap-10 md:mt-16 md:gap-14">
            <EditorialSplit
              image={`${basePath}/images/village/femme-betsileo-maison-traditionnelle.jpg`}
              imageAlt={village.womenAlt}
              label={village.womenLabel}
              title={village.womenTitle}
            >
              <p>{village.womenP1}</p>
              <p>{village.womenP2}</p>
            </EditorialSplit>

            <EditorialSplit
              image={`${basePath}/images/village/rizieres-sahambavy-vue-aerienne.jpg`}
              imageAlt={village.riceAlt}
              label={village.riceLabel}
              title={village.riceTitle}
              cta={{ href: contactHref, label: village.riceCta }}
              reverse
            >
              <p>{village.riceP1}</p>
              <p>{village.riceP2}</p>
            </EditorialSplit>
          </div>

          {/* Instants du village — bande 3 colonnes hairline */}
          <div className="mt-12 grid gap-px overflow-hidden rounded-[3px] border border-hairline bg-hairline sm:grid-cols-3 md:mt-16">
            {village.moments.map((m, i) => (
              <ScrollReveal key={m.caption} delay={i * 100} className="h-full">
                <figure className="flex h-full flex-col bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${basePath}/images/village/${MOMENT_IMAGES[i]}`}
                    alt={m.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {m.caption}
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA final ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-10">
          <ScrollReveal>
            <h2 className="mb-8" style={{ textWrap: "balance" }}>
              {dict.jardins.ctaTitle}
            </h2>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={contactHref} className="ge-cta">
                {dict.jardins.cta}
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(dict.whatsappMessage ?? "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ge-cta ge-cta--ghost"
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
