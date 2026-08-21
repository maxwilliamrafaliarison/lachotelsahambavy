import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import { alt } from "@/lib/alt";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { pageAlternates } from "@/lib/seo/alternates";

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
  /* La description était assemblée à partir du sous-titre et de la
     capacité, ce qui donnait quatre-vingt-dix caractères là où Google en
     montre cent cinquante. Elle est désormais écrite dans chaque
     dictionnaire ; l'assemblage reste en secours. */
  const description =
    dict.wedding.metaDescription ??
    (locale === "fr"
      ? `${dict.wedding.subtitle}. ${dict.conference.capacity} en salle de conférence.`
      : locale === "en"
        ? `${dict.wedding.subtitle}. ${dict.conference.capacity} in the conference room.`
        : `${dict.wedding.subtitle}. ${dict.conference.capacity} en la sala de conferencias.`);
  return {
    title: title,
    description,
    alternates: pageAlternates(locale as Locale, "mariages-seminaires"),
  };
}

/* Microcopie de la page, doublée dans dict-deltas/mariages.json ; après
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
        "Mariage intimiste, séminaire d'entreprise ou anniversaire d'exception, chaque événement est unique. Contactez-nous pour un devis sur mesure.",
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
      footnote: "Réunions, séminaires, formations ou ateliers : sur devis personnalisé.",
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
        "Every event is unique, whether it is an intimate wedding, a corporate seminar or a milestone birthday. Contact us for a tailor-made quote.",
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
      footnote: "Meetings, seminars, training sessions or workshops: tailor-made quote.",
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
        "Ya sea una boda íntima, un seminario de empresa o un aniversario excepcional, cada evento es único. Contáctenos para un presupuesto a medida.",
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
      footnote: "Reuniones, seminarios, formaciones o talleres: presupuesto a medida.",
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

      {/* ──── HERO « Nuit sur le lac » : domaine illuminé, titrage serif champagne ──── */}
      {/* La photo est une vue aérienne nocturne de tout le domaine : le
          bâtiment principal éclairé sous son toit de chaume, la piscine, les
          transats et un brasero. La décrire par la seule piscine laissait de
          côté son sujet principal. */}
      <PanoramaHero
        night
        height="full"
        image={`${basePath}/images/pool/pool-night.jpg`}
        imageAlt={alt(
          {
            fr: "Le Lac Hôtel illuminé à la nuit tombée, piscine et brasero dans les jardins",
            en: "Lac Hôtel lit up at nightfall, its pool and fire pit in the gardens",
            es: "El Lac Hôtel iluminado al caer la noche, con la piscina y el brasero en los jardines",
          },
          loc,
        )}
        label={W.heroLabel}
        title={
          <>
            {W.heroTitle} <em>{W.heroTitleEm}</em>
          </>
        }
        kicker={W.subtitle}
      />

      {/* ──── MARIAGES : récit + diptyque de vignettes (photos basse résolution) ──── */}
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

          {/* Diptyque volontairement petit (sources 543 px / 817 px), cadres fins */}
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
                {/* La légende (dict.wedding.caption2) annonce « la cérémonie
                    sous l'arche fleurie » : la photo montre le jardin en cours
                    d'installation, chaises vides et arche de BALLONS blancs.
                    La légende visible reste telle quelle (elle vient des
                    dictionnaires), mais le texte alternatif décrit l'image. */}
                <div className="border border-night-hairline bg-night-soft p-2">
                  <img
                    src={`${basePath}/images/mariage/ceremonie-arche-jardin.jpg`}
                    alt={alt(
                      {
                        fr: "Rangées de chaises face à une arche de ballons blancs, au jardin",
                        en: "Rows of chairs facing an arch of white balloons, in the garden",
                        es: "Filas de sillas frente a un arco de globos blancos, en el jardín",
                      },
                      loc,
                    )}
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

          {/* La réception : photo haute résolution, bloc éditorial signature */}
          <div className="mt-16 md:mt-20">
            <EditorialSplit
              night
              image={`${basePath}/images/hero/hero-suite-sunset.jpg`}
              imageAlt={alt(
                {
                  fr: "Suite éclairée au coucher du soleil sur le lac Sahambavy",
                  en: "Suite bathed in sunset light, windows opening onto Lake Sahambavy",
                  es: "Suite bañada por la luz del atardecer, con vistas al lago Sahambavy",
                },
                loc,
              )}
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

      {/* ──── SÉMINAIRES & CONFÉRENCES : bloc éditorial inversé + aperçu à filets ──── */}
      <section className="ge-night py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          {/* Le texte alternatif annonçait « une salle de réception dressée pour
              un événement » : la photo montre la salle du restaurant, tables
              dressées et fauteuils en rotin autour de la cheminée de pierre. */}
          <EditorialSplit
            night
            reverse
            id="seminaires"
            image={`${basePath}/images/restaurant/restaurant-01.jpg`}
            imageAlt={alt(
              {
                fr: "Tables dressées et fauteuils en rotin autour de la grande cheminée en pierre",
                en: "Laid tables and rattan armchairs around the large stone fireplace",
                es: "Mesas puestas y sillones de ratán alrededor de la gran chimenea de piedra",
              },
              loc,
            )}
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

      {/* ──── CTA FINAL : champagne sur nuit ──── */}
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
