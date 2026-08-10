import { getDictionary } from "@/i18n/getDictionary";
import { locales, type Locale, getBasePath } from "@/lib/utils";
import PanoramaHero from "@/components/ui/PanoramaHero";
import EditorialSplit from "@/components/ui/EditorialSplit";
import RecapRows from "@/components/ui/RecapRows";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { touristAttractionSchema, breadcrumbSchema } from "@/lib/schema-org";
import { buildBreadcrumb } from "@/lib/seo/breadcrumbs";

const basePath = getBasePath();

/* ------------------------------------------------------------------ */
/* Textes FR de secours, remplacés par dict.experiences dès que le     */
/* delta scratchpad/dict-deltas/experiences.json est fusionné (fr/en/es). */
/* ------------------------------------------------------------------ */
const EX_FR = {
  heroLabel: "Lac Hôtel Sahambavy",
  heroTitle: "Expériences",
  heroKicker:
    "Entre le lac, les collines de thé et les villages betsileo, chaque journée invite à une découverte différente, au départ direct de l'hôtel.",
  introLabel: "Vivre Sahambavy",
  introTitle: "Un territoire d'expériences",
  introP:
    "Loisirs au bord de l'eau, massages aux huiles maison, artisanat du village, descente de rivière en pirogue traditionnelle : composez votre séjour au rythme du lac.",
  loisirs: {
    label: "Loisirs",
    title: "Le lac comme terrain de jeu",
    p: "Le tour du lac (8 km balisés, environ 2 heures de marche) donne le ton : ici, tout se découvre en douceur. La plantation et l'usine de thé TAF se visitent en 4 heures, les villages alentour en 2 heures de balade, entre ateliers de broderie et de vannerie, ferme et potager de Mamie Olga.",
    items: [
      "Tour du Lac (8 km balisés, 2 h)",
      "Visite de la plantation & de l'usine de thé TAF (4 h)",
      "Balade dans les villages alentour (2 h)",
      "Rencontre des artisans (broderie, vannerie)",
      "Ferme & potager de Mamie Olga",
      "Canoë et pédalo sur le lac",
      "Vélo autour du lac",
      "Tennis, ping-pong, baby-foot",
      "Méditation au bord de la piscine",
    ],
    cta: "Voir tous les loisirs",
  },
  conference: {
    label: "Événements professionnels",
    rowCapacity: "Capacité",
    rowEquipment: "Équipement",
    rowLayout: "Configuration",
    layoutValue: "Entièrement modulable",
    cta: "Organiser votre événement",
  },
  mamiShop: {
    label: "Boutique",
    title: "Mami Bio Shop, le savoir-faire de Sahambavy",
    p1: "La boutique de l'hôtel met à l'honneur le savoir-faire des artisans de Sahambavy, et en premier lieu le travail des femmes du village.",
    p2: "Huiles essentielles et huiles de massage, grades de thés de la plantation, savons bio saponifiés à froid, broderies et paniers tressés dans les roseaux du lac : chaque pièce raconte le territoire.",
  },
  riviere: {
    label: "Aventure",
    recapTitle: "Aperçu",
    rowDeparture: "Départ",
    departureValue: "Lac Hôtel → Mahasoabe (45 km)",
    rowNavigation: "Navigation",
    navigationValue: "2 h de pirogue traditionnelle",
    rowWalk: "Marche",
    walkValue: "1 h 30 (villages, rizières, champs de thé)",
    rowLunch: "Déjeuner",
    lunchValue: "Pique-nique au pied d'une cascade",
    included: "Inclus",
    includedValue: "Pique-nique, pirogue et piroguier, guide, taxes villageoises",
    notIncluded: "Non inclus",
    notIncludedValue: "Transport, boissons, activités non mentionnées",
  },
  teasers: {
    label: "Continuer l'exploration",
    mariagesLabel: "Moments signature",
    mariagesTitle: "Célébrer",
    mariagesTitleEm: "au bord du lac",
    mariagesP:
      "Cérémonies au jardin, dîners au coucher du soleil et séminaires au vert : le Lac Hôtel orchestre vos grands moments, du mariage intime à l'événement d'entreprise.",
    mariagesCta: "Mariages & séminaires",
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function mergeSection<T>(base: T, over: any): T {
  if (!over || typeof over !== "object") return base;
  const out: any = { ...(base as any) };
  for (const k of Object.keys(over)) {
    const b = (base as any)[k];
    out[k] =
      b && typeof b === "object" && !Array.isArray(b) && typeof over[k] === "object" && !Array.isArray(over[k])
        ? mergeSection(b, over[k])
        : over[k];
  }
  return out as T;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const ex = mergeSection(EX_FR, (dict as any).experiences);
  return {
    title: locale === "fr" ? "Expériences" : locale === "en" ? "Experiences" : "Experiencias",
    description: ex.heroKicker ?? dict.loisirs.heroSubtitle,
  };
}

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const loc = locale as Locale;
  const ex = mergeSection(EX_FR, (dict as any).experiences);
  const poolP2 = ((dict.loisirs as any).poolP2 as string | undefined) ??
    "Espace zen, chaises longues et vue sur les jardins : le bord de la piscine se prête autant à la baignade qu'à la méditation.";

  // JSON-LD : 3 TouristAttractions clés (restaurant, plantation thé, train FCE)
  const attractionRestaurant = touristAttractionSchema({
    locale: loc,
    chemin: "restaurant",
    name: dict.restaurantSection.title as string,
    description: dict.restaurantSection.subtitle as string,
    image: "/images/restaurant/salle-restaurant-tables-dressees.jpg",
  });
  const attractionPlantation = touristAttractionSchema({
    locale: loc,
    chemin: "plantation-de-the",
    name: loc === "fr" ? "Plantation de thé de Sahambavy" : loc === "en" ? "Sahambavy Tea Plantation" : "Plantación de té de Sahambavy",
    description: loc === "fr"
      ? "La seule plantation de thé de Madagascar : visite guidée, cueillette et dégustation à 5 min de l'hôtel."
      : loc === "en"
        ? "The only tea plantation in Madagascar: guided tour, picking and tasting 5 min from the hotel."
        : "La única plantación de té de Madagascar: visita guiada, recolección y degustación a 5 min del hotel.",
    image: "/images/tea/plantation-drone-overhead.jpg",
  });
  const attractionTrain = touristAttractionSchema({
    locale: loc,
    chemin: "train-fce",
    name: loc === "fr" ? "Train FCE Fianarantsoa–Manakara" : loc === "en" ? "FCE Train Fianarantsoa–Manakara" : "Tren FCE Fianarantsoa–Manakara",
    description: loc === "fr"
      ? "Ligne ferroviaire légendaire de 170 km reliant les hauts plateaux à la côte est. La gare de Sahambavy est à 2 min de l'hôtel."
      : loc === "en"
        ? "Legendary 170 km railway line connecting the highlands to the east coast. Sahambavy station is 2 min from the hotel."
        : "Línea ferroviaria legendaria de 170 km que une las tierras altas con la costa este. La estación de Sahambavy está a 2 min del hotel.",
    image: "/images/train/train-fce.jpg",
  });

  const conferenceRows = [
    { label: ex.conference.rowCapacity, value: dict.conference.capacity },
    {
      label: ex.conference.rowEquipment,
      value: (
        <span className="block max-w-[26ch] whitespace-normal text-right">
          {(dict.conference.equipment as string[]).join(" · ")}
        </span>
      ),
    },
    { label: ex.conference.rowLayout, value: ex.conference.layoutValue },
  ];

  const riviereRows = [
    { label: ex.riviere.rowDeparture, value: ex.riviere.departureValue },
    { label: ex.riviere.rowNavigation, value: ex.riviere.navigationValue },
    { label: ex.riviere.rowWalk, value: ex.riviere.walkValue },
    { label: ex.riviere.rowLunch, value: ex.riviere.lunchValue },
    {
      label: ex.riviere.included,
      value: (
        <span className="block max-w-[34ch] whitespace-normal text-right">{ex.riviere.includedValue}</span>
      ),
    },
    {
      label: ex.riviere.notIncluded,
      value: (
        <span className="block max-w-[34ch] whitespace-normal text-right">{ex.riviere.notIncludedValue}</span>
      ),
    },
  ];

  const shopPhotos = [
    {
      src: "/images/boutique/savon-artisanal-curcuma-natural-by-maggie.jpg",
      alt: "Savon artisanal au curcuma « Natural by Maggie »",
    },
    {
      src: "/images/boutique/savon-coco-artisanal-bois-sculpte.jpg",
      alt: "Savon artisanal à la noix de coco sur bois sculpté",
    },
    {
      src: "/images/boutique/savon-fleur-marguerite-artisanal.jpg",
      alt: "Savon artisanal décoré d'une fleur de marguerite",
    },
    {
      src: "/images/boutique/etal-legumes-bio-mami-shop.jpg",
      alt: "Étal de légumes bio du Mami Bio Shop",
    },
  ];

  return (
    <>
      <JsonLd
        schemas={[
          attractionRestaurant,
          attractionPlantation,
          attractionTrain,
          breadcrumbSchema(buildBreadcrumb(loc, "experiences")),
        ]}
      />
      <PanoramaHero
        image={`${basePath}/images/activities/canoe-aerial.jpg`}
        imageAlt="Canoë sur le lac de Sahambavy vu du ciel"
        label={ex.heroLabel}
        title={ex.heroTitle}
        kicker={ex.heroKicker}
      />

      {/* ──── INTRO ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{ex.introLabel}</span>
            <h2 className="max-w-[22ch]" style={{ textWrap: "balance" }}>
              {ex.introTitle}
            </h2>
            <p className="ge-measure mt-5 text-[15px] leading-relaxed text-body md:text-base">
              {ex.introP}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ──── LOISIRS ──── */}
      <section id="loisirs" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{ex.loisirs.label}</span>
            <h2 className="max-w-[22ch]" style={{ textWrap: "balance" }}>
              {ex.loisirs.title}
            </h2>
            <p className="ge-measure mt-5 text-[15px] leading-relaxed text-body md:text-base">
              {ex.loisirs.p}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <ul className="mt-10 grid gap-x-10 md:grid-cols-2">
              {(ex.loisirs.items as string[]).map((item, i) => (
                <li
                  key={i}
                  className="border-t border-hairline py-3 text-[15px] leading-relaxed text-body"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Link href={`/${locale}/activites/`} className="ge-cta ge-cta--ghost">
                {ex.loisirs.cta}
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-14 md:mt-20">
            <EditorialSplit
              image={`${basePath}/images/pool/tete-bouddha-bord-piscine.jpg`}
              imageAlt="Tête de Bouddha au bord de la piscine en ardoise"
              label={dict.loisirs.poolLabel}
              title={dict.loisirs.poolTitle}
              reverse
            >
              <p>{dict.loisirs.poolP}</p>
              <p>{poolP2}</p>
            </EditorialSplit>
          </div>
        </div>
      </section>

      {/* ──── MASSAGES & BIEN-ÊTRE ──── */}
      <section id="massage" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/activities/salon-detente-vue-lac.jpg`}
            imageAlt="Salon de détente ouvert sur le lac Sahambavy, fauteuils et terrasse au bord de l'eau"
            label={dict.loisirs.massageLabel}
            title={dict.loisirs.massageTitle}
            cta={{ href: `/${locale}/contact/`, label: dict.loisirs.cta }}
          >
            <p>{dict.loisirs.massageP}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* ──── SALLE DE CONFÉRENCE ──── */}
      <section id="salle-de-conference" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/gallery/gallery-lake-view-interior.jpg`}
            imageAlt="Salon lumineux ouvert sur le lac de Sahambavy"
            label={ex.conference.label}
            title={dict.conference.title}
            rows={conferenceRows}
            cta={{ href: `/${locale}/contact/`, label: ex.conference.cta }}
            reverse
          >
            <p>{dict.conference.p1}</p>
            <p>{dict.conference.p2}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* ──── MAMI BIO SHOP ──── */}
      <section id="mami-bio-shop" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            image={`${basePath}/images/boutique/bio-mami-shop-entree-boutique.jpg`}
            imageAlt="Entrée de la boutique Mami Bio Shop"
            label={ex.mamiShop.label}
            title={ex.mamiShop.title}
          >
            <p>{ex.mamiShop.p1}</p>
            <p>{ex.mamiShop.p2}</p>
          </EditorialSplit>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {shopPhotos.map((photo, i) => (
              <ScrollReveal key={photo.src} delay={i * 90}>
                <img
                  src={`${basePath}${photo.src}`}
                  alt={photo.alt}
                  loading="lazy"
                  className="aspect-square w-full rounded-[3px] border border-hairline object-cover"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── DESCENTE DE LA RIVIÈRE MATSIATRA ──── */}
      <section id="riviere-matsiatra" className="scroll-mt-24 bg-mist-bg py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-3">{ex.riviere.label}</span>
            <h2 className="max-w-[24ch]" style={{ textWrap: "balance" }}>
              {dict.loisirs.aventureTitle}
            </h2>
            <p className="ge-measure mt-5 text-[15px] leading-relaxed text-body md:text-base">
              {dict.loisirs.aventureP}
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            <ScrollReveal>
              <ol className="ge-rows">
                {(dict.loisirs.aventureProgram as string[]).map((step, i) => (
                  <li key={i} className="flex items-baseline gap-5 border-b border-hairline py-4">
                    <span className="text-xs font-semibold tabular-nums text-terracotta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] leading-relaxed text-body">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-9">
                <Link href={`/${locale}/contact/`} className="ge-cta">
                  {dict.loisirs.cta}
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <img
                src={`${basePath}/images/activities/pedalos-colores-ponton.jpg`}
                alt="Embarcations au ponton du Lac Hôtel, point de départ des excursions"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-[3px] border border-hairline object-cover"
              />
              <RecapRows className="mt-8" title={ex.riviere.recapTitle} rows={riviereRows} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ──── TEASER PLANTATION DE THÉ ──── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <ScrollReveal>
            <span className="ge-label mb-10 block">{ex.teasers.label}</span>
          </ScrollReveal>
          <EditorialSplit
            image={`${basePath}/images/tea/plantation-cinematic.jpg`}
            imageAlt="Cueilleuses dans la plantation de thé de Sahambavy"
            label={dict.destinations.plantation.label}
            title={dict.destinations.plantation.title}
            cta={{ href: `/${locale}/plantation-de-the/`, label: dict.destinations.plantation.cta }}
            reverse
          >
            <p>{dict.destinations.plantation.desc}</p>
          </EditorialSplit>
        </div>
      </section>

      {/* ──── TEASER MARIAGES : Nuit sur le lac ──── */}
      <section className="ge-night py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <EditorialSplit
            night
            image={`${basePath}/images/mariage/maries-coucher-soleil-lac.jpg`}
            imageAlt="Jeunes mariés au coucher du soleil sur le lac de Sahambavy"
            label={ex.teasers.mariagesLabel}
            title={
              <>
                {ex.teasers.mariagesTitle} <em>{ex.teasers.mariagesTitleEm}</em>
              </>
            }
            cta={{ href: `/${locale}/mariages-seminaires/`, label: ex.teasers.mariagesCta, night: true }}
          >
            <p>{ex.teasers.mariagesP}</p>
          </EditorialSplit>
        </div>
      </section>
    </>
  );
}
