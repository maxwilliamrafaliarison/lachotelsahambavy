import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import Link from "next/link";
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

/* Microcopie de la page — doublée dans dict-deltas/mariages.json ; après
   fusion des deltas dans les dictionnaires, dict.* prend le dessus (spread). */
const microcopy = {
  fr: {
    wedding: {
      heroLabel: "Événements & célébrations",
      heroTitle: "Mariages & séminaires",
      heroTitleEm: "au bord du lac",
      storyTitle1: "Célébrez votre",
      storyTitleEm: "amour",
      storyTitle2: "dans un cadre d'exception",
      caption1: "Les mariés au coucher du soleil, sur les rives du lac",
      caption2: "La cérémonie sous l'arche fleurie, au jardin",
      receptionLabel: "La réception",
      receptionTitle: "Une réception",
      receptionTitleEm: "à votre image",
      rowSettingLabel: "Cadre",
      rowSettingValue: "Entre lac et jardin fleuri",
      rowRatesLabel: "Tarifs",
      rowRatesValue: "Sur devis personnalisé",
      ctaTitle: "Parlons de",
      ctaTitleEm: "votre projet",
      ctaText:
        "Mariage intimiste, séminaire d'entreprise, anniversaire d'exception — chaque événement est unique. Contactez-nous pour un devis sur mesure.",
      ctaButton: "Demander un devis",
      whatsappText:
        "Bonjour, je souhaite organiser un événement (mariage / séminaire) au Lac Hôtel.",
    },
    conference: {
      label: "Séminaires & Conférences",
      recapTitle: "La salle en un coup d'œil",
      capacityLabel: "Capacité",
      configLabel: "Configuration",
      configValue: "Entièrement modulable",
      includedValue: "Inclus",
      footnote: "Réunions, séminaires, formations ou ateliers — sur devis personnalisé.",
      ctaLabel: "Organiser un séminaire",
    },
  },
  en: {
    wedding: {
      heroLabel: "Events & celebrations",
      heroTitle: "Weddings & seminars",
      heroTitleEm: "on the shores of the lake",
      storyTitle1: "Celebrate your",
      storyTitleEm: "love",
      storyTitle2: "in an exceptional setting",
      caption1: "The newlyweds at sunset, on the shores of the lake",
      caption2: "The ceremony beneath the flowered arch, in the garden",
      receptionLabel: "The reception",
      receptionTitle: "A reception",
      receptionTitleEm: "uniquely yours",
      rowSettingLabel: "Setting",
      rowSettingValue: "Between lake and flowering garden",
      rowRatesLabel: "Rates",
      rowRatesValue: "Tailor-made quote",
      ctaTitle: "Let's talk about",
      ctaTitleEm: "your project",
      ctaText:
        "An intimate wedding, a corporate seminar, a milestone birthday — every event is unique. Contact us for a tailor-made quote.",
      ctaButton: "Request a quote",
      whatsappText: "Hello, I would like to organise an event (wedding / seminar) at Lac Hôtel.",
    },
    conference: {
      label: "Seminars & Conferences",
      recapTitle: "The room at a glance",
      capacityLabel: "Capacity",
      configLabel: "Layout",
      configValue: "Fully modular",
      includedValue: "Included",
      footnote: "Meetings, seminars, training sessions or workshops — tailor-made quote.",
      ctaLabel: "Plan a seminar",
    },
  },
  es: {
    wedding: {
      heroLabel: "Eventos y celebraciones",
      heroTitle: "Bodas y seminarios",
      heroTitleEm: "a orillas del lago",
      storyTitle1: "Celebre su",
      storyTitleEm: "amor",
      storyTitle2: "en un marco excepcional",
      caption1: "Los novios al atardecer, a orillas del lago",
      caption2: "La ceremonia bajo el arco floral, en el jardín",
      receptionLabel: "La recepción",
      receptionTitle: "Una recepción",
      receptionTitleEm: "a su imagen",
      rowSettingLabel: "Marco",
      rowSettingValue: "Entre lago y jardín florido",
      rowRatesLabel: "Tarifas",
      rowRatesValue: "Presupuesto a medida",
      ctaTitle: "Hablemos de",
      ctaTitleEm: "su proyecto",
      ctaText:
        "Una boda íntima, un seminario de empresa, un aniversario excepcional — cada evento es único. Contáctenos para un presupuesto a medida.",
      ctaButton: "Solicitar un presupuesto",
      whatsappText: "Hola, me gustaría organizar un evento (boda / seminario) en el Lac Hôtel.",
    },
    conference: {
      label: "Seminarios y Conferencias",
      recapTitle: "La sala de un vistazo",
      capacityLabel: "Capacidad",
      configLabel: "Configuración",
      configValue: "Totalmente modular",
      includedValue: "Incluido",
      footnote: "Reuniones, seminarios, formaciones o talleres — presupuesto a medida.",
      ctaLabel: "Organizar un seminario",
    },
  },
} as const;

export default async function MariagesSeminairesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;

  // Fusion microcopie locale ← dictionnaire (le dict gagne dès que les
  // deltas y sont intégrés ; en attendant, la microcopie sert de valeur).
  const W = { ...microcopy[loc].wedding, ...dict.wedding };
  const C = { ...microcopy[loc].conference, ...dict.conference };

  const recapRows = [
    { label: C.capacityLabel, value: C.capacity },
    { label: C.configLabel, value: C.configValue },
    ...(C.equipment as string[]).map((eq) => ({ label: eq, value: C.includedValue })),
  ];

  return (
    <>
      <JsonLd schemas={[breadcrumbSchema(buildBreadcrumb(loc, "mariages-seminaires"))]} />

      {/* ──── HERO « Nuit sur le lac » — piscine illuminée, titrage serif champagne ──── */}
      <PanoramaHero
        night
        height="full"
        image={`${basePath}/images/pool/pool-night.jpg`}
        imageAlt="Piscine du Lac Hôtel illuminée à la nuit tombée"
        label={W.heroLabel}
        title={
          <>
            {W.heroTitle} <em>{W.heroTitleEm}</em>
          </>
        }
        kicker={W.subtitle}
      />

      {/* ──── MARIAGES — récit + diptyque de vignettes (photos basse résolution) ──── */}
      <section id="mariages" className="ge-night scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{W.title}</span>
            <h2 className="mb-6" style={{ textWrap: "balance" }}>
              {W.storyTitle1} <em>{W.storyTitleEm}</em> {W.storyTitle2}
            </h2>
            <div className="ge-measure space-y-4 text-[15px] leading-relaxed md:text-base">
              <p>{W.p1}</p>
              <p>{W.p2}</p>
            </div>
          </ScrollReveal>

          {/* Diptyque — volontairement petit (sources 713 px / 817 px), cadres fins */}
          <div className="mt-14 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center md:gap-16">
            <ScrollReveal className="w-full max-w-[340px]">
              <figure>
                <div className="border border-night-hairline bg-night-soft p-2">
                  <img
                    src={`${basePath}/images/mariage/maries-coucher-soleil-lac.jpg`}
                    alt={W.caption1}
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 text-center font-[family-name:var(--font-serif)] text-[13px] italic text-champagne">
                  {W.caption1}
                </figcaption>
              </figure>
            </ScrollReveal>
            <ScrollReveal delay={180} className="w-full max-w-[380px] sm:mt-12">
              <figure>
                <div className="border border-night-hairline bg-night-soft p-2">
                  <img
                    src={`${basePath}/images/mariage/ceremonie-arche-jardin.jpg`}
                    alt={W.caption2}
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 text-center font-[family-name:var(--font-serif)] text-[13px] italic text-champagne">
                  {W.caption2}
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>

          {/* La réception — photo haute résolution, bloc éditorial signature */}
          <div className="mt-16 md:mt-20">
            <EditorialSplit
              night
              image={`${basePath}/images/hero/hero-suite-sunset.jpg`}
              imageAlt="Suite éclairée au coucher du soleil sur le lac Sahambavy"
              label={W.receptionLabel}
              title={
                <>
                  {W.receptionTitle} <em>{W.receptionTitleEm}</em>
                </>
              }
              rows={[
                { label: W.rowSettingLabel, value: W.rowSettingValue },
                { label: W.rowRatesLabel, value: W.rowRatesValue },
              ]}
            >
              <p>{W.p3}</p>
            </EditorialSplit>
          </div>
        </div>
      </section>

      {/* ──── SÉMINAIRES & CONFÉRENCES — bloc éditorial inversé + aperçu à filets ──── */}
      <section className="ge-night py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            night
            reverse
            id="seminaires"
            image={`${basePath}/images/restaurant/restaurant-01.jpg`}
            imageAlt="Salle de réception du Lac Hôtel dressée pour un événement"
            label={C.label}
            title={C.title}
            cta={{ href: `${basePath}/${loc}/contact/`, label: C.ctaLabel, night: true }}
          >
            <p>{C.p1}</p>
            <p>{C.p2}</p>
          </EditorialSplit>

          <ScrollReveal delay={120}>
            <RecapRows
              className="mx-auto mt-14 max-w-2xl"
              title={C.recapTitle}
              rows={recapRows}
              footnote={C.footnote}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ──── CTA FINAL — champagne sur nuit ──── */}
      <section className="ge-night py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <hr className="ge-hairline mb-14 md:mb-16" />
          <div className="mx-auto max-w-2xl text-center">
            <ScrollReveal>
              <span className="ge-label mb-3">{W.heroLabel}</span>
              <h2 className="mb-5" style={{ textWrap: "balance" }}>
                {W.ctaTitle} <em>{W.ctaTitleEm}</em>
              </h2>
              <p className="mx-auto mb-9 max-w-[52ch] text-[15px] leading-relaxed md:text-base">
                {W.ctaText}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href={`/${loc}/contact/`} className="ge-cta ge-cta--night">
                  {W.ctaButton}
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(W.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ge-cta ge-cta--night"
                >
                  WhatsApp
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
