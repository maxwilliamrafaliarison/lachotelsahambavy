import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TheicoleBookingForm from "./TheicoleBookingForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { touristAttractionSchema, breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";
import { pageAlternates } from "@/lib/seo/alternates";

const basePath = getBasePath();

/* Textes nouveaux de la refonte : fallbacks locaux en attendant la fusion
   des deltas dictionnaire (scratchpad/dict-deltas/plantation.json). Si la
   clé existe déjà dans dict.plantation, elle est prioritaire. */
const extraTexts = {
  fr: {
    heroKicker:
      "520 hectares de théiers ondulent entre le lac et les collines. La deuxième boisson la plus consommée au monde après l'eau pousse ici, et nulle part ailleurs à Madagascar.",
    factsTitle: "La plantation en un regard",
    factsRows: [
      { label: "Superficie", value: "520 hectares" },
      { label: "Thés produits", value: "Noir & vert" },
      { label: "Cueillette", value: "Manuelle, à la main" },
      { label: "Visite guidée", value: "½ journée" },
    ],
    factsFootnote: "L'unique plantation de thé de Madagascar, aux portes de l'hôtel.",
    timelineLabel: "Chronologie",
    timelineTitle: "Les grandes dates",
    womenLabel: "Le thé à Madagascar",
    womenTitle: "Sahambavy, « champs des femmes »",
    cinematicCaption: "Cueilleuses au petit matin. Chaque feuille est encore récoltée à la main.",
    excursionIntro:
      "Quatre heures pour tout comprendre : l'usine et les étapes de fabrication du thé, la dégustation des différentes qualités, puis la promenade à travers les rangées de théiers, à la rencontre des cueilleuses. Réservation auprès de la réception.",
    stepsTitle: "Déroulé de la visite",
    infoDurationLabel: "Durée",
    infoBookingLabel: "Réservation",
    infoElevationLabel: "Dénivelé",
    infoDifficultyLabel: "Difficulté",
    infoWalkingLabel: "Marche",
    soapTitle: "Savons artisanaux 100 % naturels",
    bookIntro:
      "Indiquez-nous vos dates : la réception organise votre visite et vous la confirme par e-mail.",
  },
  en: {
    heroKicker:
      "520 hectares of tea bushes roll between the lake and the hills. The world's second most consumed drink after water grows here, and nowhere else in Madagascar.",
    factsTitle: "The plantation at a glance",
    factsRows: [
      { label: "Area", value: "520 hectares" },
      { label: "Teas produced", value: "Black & green" },
      { label: "Harvest", value: "Picked by hand" },
      { label: "Guided visit", value: "Half day" },
    ],
    factsFootnote: "Madagascar's only tea plantation, right on the hotel's doorstep.",
    timelineLabel: "Timeline",
    timelineTitle: "Key dates",
    womenLabel: "Tea in Madagascar",
    womenTitle: "Sahambavy, 'women's fields'",
    cinematicCaption: "Tea pickers in the early morning. Every leaf is still harvested by hand.",
    excursionIntro:
      "Four hours to see it all: the factory and each stage of tea making, a tasting of the different grades, then a walk through the rows of tea bushes to meet the pickers. Book at the hotel reception.",
    stepsTitle: "Visit itinerary",
    infoDurationLabel: "Duration",
    infoBookingLabel: "Booking",
    infoElevationLabel: "Elevation",
    infoDifficultyLabel: "Difficulty",
    infoWalkingLabel: "Walking",
    soapTitle: "100% natural handmade soaps",
    bookIntro: "Tell us your dates: our reception arranges your visit and confirms it by email.",
  },
  es: {
    heroKicker:
      "520 hectáreas de té ondulan entre el lago y las colinas. La segunda bebida más consumida del mundo después del agua crece aquí, y en ningún otro lugar de Madagascar.",
    factsTitle: "La plantación de un vistazo",
    factsRows: [
      { label: "Superficie", value: "520 hectáreas" },
      { label: "Tés producidos", value: "Negro y verde" },
      { label: "Cosecha", value: "Recogida a mano" },
      { label: "Visita guiada", value: "Medio día" },
    ],
    factsFootnote: "La única plantación de té de Madagascar, a las puertas del hotel.",
    timelineLabel: "Cronología",
    timelineTitle: "Fechas clave",
    womenLabel: "El té en Madagascar",
    womenTitle: "Sahambavy, « campos de las mujeres »",
    cinematicCaption: "Recolectoras al amanecer. Cada hoja se cosecha todavía a mano.",
    excursionIntro:
      "Cuatro horas para verlo todo: la fábrica y las etapas de elaboración del té, la degustación de las distintas calidades y un paseo entre las hileras de té al encuentro de las recolectoras. Reserva en la recepción del hotel.",
    stepsTitle: "Itinerario de la visita",
    infoDurationLabel: "Duración",
    infoBookingLabel: "Reserva",
    infoElevationLabel: "Desnivel",
    infoDifficultyLabel: "Dificultad",
    infoWalkingLabel: "Caminata",
    soapTitle: "Jabones artesanales 100 % naturales",
    bookIntro:
      "Indíquenos sus fechas: la recepción organiza su visita y se la confirma por correo electrónico.",
  },
};

type ExtraTexts = (typeof extraTexts)["fr"];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.plantation.heroTitle,
    /* Le sous-titre du hero est une ligne d'affichage, pas un extrait de
       résultat : il tenait en trente caractères là où Google en montre cent
       cinquante. `metaDescription` est écrite pour la recherche ; le
       sous-titre reste en secours si la clé manque dans une langue. */
    description: dict.plantation.metaDescription ?? dict.plantation.heroSubtitle,
    alternates: pageAlternates(locale as Locale, "plantation-de-the"),
  };
}

export default async function PlantationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;
  const p = dict.plantation;

  /* Clé du dict si déjà fusionnée, sinon fallback local (même texte). */
  const pAny = p as Record<string, unknown>;
  const xt = Object.fromEntries(
    Object.entries(extraTexts[loc]).map(([k, v]) => [
      k,
      pAny[k] !== undefined && typeof pAny[k] === typeof v ? pAny[k] : v,
    ]),
  ) as ExtraTexts;

  /* Alt localisé : helper local pour alléger les ternaires. */
  const alt = (fr: string, en: string, es: string) =>
    loc === "fr" ? fr : loc === "es" ? es : en;

  const attractionPlantation = touristAttractionSchema({
    locale: loc,
    chemin: "plantation-de-the",
    name: p.heroTitle as string,
    description: p.heroSubtitle as string,
    image: "/images/tea/plantation-drone-overhead.jpg",
  });

  const excursionInfoRows = [
    { label: xt.infoDurationLabel, value: p.excursionInfo.duration },
    { label: xt.infoBookingLabel, value: p.excursionInfo.travel },
    { label: xt.infoElevationLabel, value: p.excursionInfo.elevation },
    { label: xt.infoDifficultyLabel, value: p.excursionInfo.difficulty },
    { label: xt.infoWalkingLabel, value: p.excursionInfo.walking },
  ];

  return (
    <>
      <JsonLd
        schemas={[
          attractionPlantation,
          breadcrumbSchema(buildBreadcrumb(loc, "plantation")),
        ]}
      />

      {/* Hero Panorama : rangées de théiers vues du ciel (graphique) */}
      <PanoramaHero
        image={`${basePath}/images/tea/plantation-drone-overhead.jpg`}
        imageAlt={alt(
          "Vue aérienne graphique des rangées de théiers de la plantation de Sahambavy",
          "Overhead aerial view of the tea rows at the Sahambavy plantation",
          "Vista aérea cenital de las hileras de té de la plantación de Sahambavy",
        )}
        label={p.heroSubtitle}
        title={p.heroTitle}
        kicker={xt.heroKicker}
        cta={{ href: "#reserver", label: p.bookLabel }}
      />

      {/* Histoire : légende chinoise + faits clés à filets fins */}
      <section id="histoire" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <ScrollReveal>
                <span className="ge-label mb-4">{p.historyLabel}</span>
                <h2 className="max-w-[24ch]" style={{ textWrap: "balance" }}>
                  {p.historyTitle}
                </h2>
                <div className="ge-measure mt-6 space-y-4 text-[15px] leading-relaxed text-body md:text-base">
                  <p>{p.historyIntro}</p>
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 lg:pt-14">
              <ScrollReveal>
                {/* SANS `factsFootnote`. Elle disait « L'unique plantation de
                    thé de Madagascar, aux portes de l'hôtel. » — la phrase
                    même qui coiffe le hero de la page, à trois blocs de là,
                    et que la chronologie répétait une troisième fois. Elle
                    reste dans les dictionnaires, elle n'est plus affichée. */}
                <RecapRows title={xt.factsTitle} rows={xt.factsRows} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Chronologie : rows hairline, année en accent thé */}
      <section className="border-y border-hairline bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-2xl">
            <ScrollReveal>
              <span className="ge-label mb-3">{xt.timelineLabel}</span>
              <h2 className="mb-8">{xt.timelineTitle}</h2>
              <div className="ge-rows">
                {(p.historyTimeline as { year: string; text: string }[]).map((item) => (
                  <div
                    key={item.year}
                    className="grid gap-x-8 gap-y-1 border-b border-hairline py-4 md:grid-cols-[150px_1fr]"
                  >
                    <span className="text-sm font-semibold tabular-nums text-terracotta">
                      {item.year}
                    </span>
                    <p className="text-[15px] leading-relaxed text-body">{item.text}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Le thé à Madagascar : « champs des femmes » */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/tea/cueilleuse-the-panier-brume.jpg`}
            imageAlt={alt(
              "Cueilleuse de thé avec son panier dans la brume matinale à Sahambavy",
              "Tea picker with her basket in the morning mist at Sahambavy",
              "Recolectora de té con su cesta en la bruma matinal de Sahambavy",
            )}
            label={xt.womenLabel}
            title={xt.womenTitle}
          >
            <p>{p.historyMadagascar}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* Pleine page : cueilleuses, lumière éditoriale */}
      <section>
        <figure>
          <img
            src={`${basePath}/images/tea/plantation-cinematic.jpg`}
            alt={alt(
              "Cueilleuses de thé au travail dans la plantation de Sahambavy, lumière du matin",
              "Tea pickers at work in the Sahambavy plantation in morning light",
              "Recolectoras de té trabajando en la plantación de Sahambavy con luz matinal",
            )}
            loading="lazy"
            className="h-[52vh] min-h-[360px] w-full object-cover md:h-[64vh]"
          />
          <figcaption className="mx-auto max-w-7xl px-6 py-4 text-xs text-muted md:px-10">
            {xt.cinematicCaption}
          </figcaption>
        </figure>
      </section>

      {/* Excursion : visite plantation & usine, infos + déroulé */}
      <section id="visite" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            reverse
            image={`${basePath}/images/tea/tea-picker.jpg`}
            imageAlt={alt(
              "Cueilleuse récoltant les jeunes feuilles de thé à la main",
              "Tea picker harvesting young tea leaves by hand",
              "Recolectora cosechando a mano las hojas jóvenes de té",
            )}
            label={p.excursionLabel}
            title={p.excursionTitle}
            cta={{ href: "#reserver", label: p.bookLabel }}
          >
            <p>{xt.excursionIntro}</p>
            <div className="border-t border-hairline">
              {excursionInfoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 border-b border-hairline py-3"
                >
                  <span className="text-sm text-muted">{row.label}</span>
                  <span className="text-right text-sm font-semibold text-terracotta">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </EditorialSplit>

          {/* Déroulé de la visite : liste numérotée à filets fins */}
          <div className="mx-auto mt-12 max-w-2xl md:mt-16">
            <ScrollReveal>
              <p className="ge-label mb-5">{xt.stepsTitle}</p>
              <ol className="ge-rows">
                {(p.excursionSteps as string[]).map((step, i) => (
                  <li
                    key={step}
                    className="flex items-baseline gap-5 border-b border-hairline py-4"
                  >
                    <span className="text-sm font-semibold tabular-nums text-terracotta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] leading-relaxed text-body">{step}</span>
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Diptyque photo : les rangées de théiers, du sol et du ciel */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-2 md:grid-cols-2">
            <ScrollReveal>
              <div className="aspect-[4/3] overflow-hidden rounded-[3px]">
                <img
                  src={`${basePath}/images/tea/plantation-the-rangees-vue-aerienne.jpg`}
                  alt={alt(
                    "Rangées de théiers vues du ciel, plantation de Sahambavy",
                    "Rows of tea bushes seen from above, Sahambavy plantation",
                    "Hileras de té vistas desde el cielo, plantación de Sahambavy",
                  )}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="aspect-[4/3] overflow-hidden rounded-[3px]">
                <img
                  src={`${basePath}/images/tea/plantation-the-sahambavy-rangees-velos.jpg`}
                  alt={alt(
                    "Vélos colorés le long des rangées de théiers de Sahambavy",
                    "Colourful bicycles along the tea rows of Sahambavy",
                    "Bicicletas de colores junto a las hileras de té de Sahambavy",
                  )}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Boutique : Mami Bio Shop, produits Vita Malagasy */}
      <section id="boutique" className="scroll-mt-24 border-y border-hairline bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/tea/plantation.jpg`}
            imageAlt={alt(
              "Collines de théiers de la plantation de Sahambavy",
              "Tea-covered hills of the Sahambavy plantation",
              "Colinas de té de la plantación de Sahambavy",
            )}
            label={p.shopLabel}
            title={p.shopTitle}
            cta={{ href: `/${locale}/contact/`, label: p.shopCta }}
          >
            <p>{p.shopIntro}</p>
            <div className="border-t border-hairline">
              {(p.shopItems as { name: string; desc: string }[]).map((item) => (
                <div
                  key={item.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 border-b border-hairline py-3"
                >
                  <span className="text-[15px] text-ink">{item.name}</span>
                  <span className="text-sm text-muted">{item.desc}</span>
                </div>
              ))}
            </div>
          </EditorialSplit>

          {/* Savons maison (note artisanale) */}
          <div className="mx-auto mt-12 max-w-2xl text-center md:mt-16">
            <ScrollReveal>
              <h3 className="mb-4">{xt.soapTitle}</h3>
              <p className="text-[15px] leading-relaxed text-body">{p.shopSoap}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Réservation : formulaire existant, panneau encre */}
      <section id="reserver" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mx-auto max-w-2xl">
            <ScrollReveal>
              <div className="text-center">
                {/* Chapeau retiré : « Réserver une visite » est déjà le
                    libellé des deux boutons de la page, dont l'un mène ici. */}
                <h2 className="mb-4">{p.bookTitle}</h2>
                <p className="mb-10 text-[15px] leading-relaxed text-body">{xt.bookIntro}</p>
              </div>
              <div className="rounded-[3px] bg-ink p-6 md:p-10">
                <TheicoleBookingForm dict={dict} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
